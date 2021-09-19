import _ from 'lodash'
import axios from 'axios'
import { saveAs } from 'file-saver'
import VueCookies from 'vue-cookies'
import querystring from 'querystring'

import errors from 'src/utils/errors'
import urlUtils from 'src/utils/url'

import core from 'src/core'
import eventBus from 'src/event-bus'
import store from 'src/store'

export default {
  sendRequest: function ({ moduleName, methodName, parameters }) {
    return new Promise((resolve, reject) => {
      const unknownError = {
        ErrorCode: 0,
        Module: moduleName,
      }

      eventBus.$emit('webApi::Request::before', parameters)

      const postData = {
        Module: moduleName,
        Method: methodName,
      }
      if (!_.isEmpty(parameters)) {
        postData.Parameters = JSON.stringify(parameters)
      }

      // The AutnToken needs to be read from the cookie (тще акщь store) to always match the cookies sent to the server.
      // If a user is also logged in the browser, then his AppData will be received and the login screen will be displayed,
      // because the user is not a superadmin.
      const authToken = VueCookies.get('AuthToken')
      const headers = {}
      if (authToken) {
        headers.Authorization = 'Bearer ' + authToken
      }

      axios({
        method: 'post',
        url: urlUtils.getApiHost() + '?/Api/',
        data: querystring.stringify(postData),
        headers,
      })
        .then((response) => {
          const isOkResponse = response?.status === 200 && !!response?.data
          if (isOkResponse) {
            eventBus.$emit('webApi::Response', { moduleName, methodName, parameters, response: response.data })
            const result = response.data.Result
            if (!result && (response.data.ErrorCode || response.data.ErrorMessage || response.data.SubscriptionsResult)) {
              if (store.getters['user/isUserSuperAdmin'] && errors.isAuthError(response.data.ErrorCode) && methodName !== 'Logout') {
                core.logout()
              } else {
                reject(response.data)
              }
            } else {
              resolve(result)
            }
          } else {
            eventBus.$emit('webApi::Response', { moduleName, methodName, parameters, response: unknownError })
            reject(unknownError)
          }
        }, () => {
          eventBus.$emit('webApi::Response', { moduleName, methodName, parameters, response: unknownError })
          reject(unknownError)
        })
        .catch((error) => {
          const errorResponse = _.extend(unknownError, { ErrorMessage: error.message })
          eventBus.$emit('webApi::Response', { moduleName, methodName, parameters, response: errorResponse })
          reject(errorResponse)
        })
    })
  },

  downloadExportFile: function ({ moduleName, methodName, parameters, fileName, format }) {
    return new Promise((resolve, reject) => {
      const headers = {
        'Content-Type': 'multipart/form-data',
      }
      const authToken = store.getters['user/getAuthToken']
      if (authToken) {
        headers.Authorization = 'Bearer ' + authToken
      }

      const data = new FormData()
      data.set('Module', moduleName)
      data.set('Method', methodName)
      data.set('Parameters', JSON.stringify(parameters))
      if (format) {
        data.set('Format', format)
      }

      axios({
        method: 'post',
        url: urlUtils.getApiHost() + '?/Api/',
        data: data,
        headers: headers
      })
        .then((oResponse) => {
          if (oResponse) {
            let resData = oResponse.data.split('\n')
            resData.pop()
            resData = resData.join('\n')
            const oBlob = new Blob([resData])
            saveAs(oBlob, fileName)
            resolve()
          } else {
            reject()
          }
        })
    })
  }
}
