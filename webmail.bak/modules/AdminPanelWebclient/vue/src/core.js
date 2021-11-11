import { i18n } from 'src/boot/i18n'
import VueCookies from 'vue-cookies'

import _ from 'lodash'

import store from 'src/store'
import enums from 'src/enums'

import errors from 'src/utils/errors'
import notification from 'src/utils/notification'
import typesUtils from 'src/utils/types'
import webApi from 'src/utils/web-api'

import modulesManager from 'src/modules-manager'
import settings from 'src/settings'

const core = {
  appData: null,

  setAuthTokenCookie (authToken) {
    const cookieSettings = settings.getCookieSettings()
    const expire = cookieSettings.authTokenCookieExpireTime > 0 ? cookieSettings.authTokenCookieExpireTime + 'd' : ''
    VueCookies.set('AuthToken', authToken, expire)
  },

  setAuthToken (authToken) {
    const cookieSettings = settings.getCookieSettings()
    if (_.isEmpty(authToken)) {
      const currentAuthToken = VueCookies.get('AuthToken')
      VueCookies.remove('AuthToken')
      const secondAuthToken = VueCookies.get('AuthToken')
      if (secondAuthToken === null) {
        this.commitAuthToken(authToken)
      } else if (secondAuthToken === currentAuthToken) {
        VueCookies.remove('AuthToken', cookieSettings.cookieBasePath)
        this.commitAuthToken(authToken)
      } else {
        webApi.sendRequest({
          moduleName: 'Core',
          methodName: 'GetAppData',
          parameters: {},
        }).then(result => {
          const UserRoles = enums.getUserRoles()
          if (result?.User?.Role === UserRoles.SuperAdmin) {
            VueCookies.remove('AuthToken', cookieSettings.cookieBasePath)
          }
          this.commitAuthToken(authToken)
        }, response => {
          this.commitAuthToken(authToken)
        })
      }
    } else {
      this.setAuthTokenCookie(authToken)
      this.commitAuthToken(authToken)
    }
  },

  commitAuthToken (authToken) {
    store.commit('user/setAuthToken', authToken)
    this.requestAppData()
  },

  parseTenantsFromAppData () {
    const adminPanelWebclientData = typesUtils.pObject(this.appData?.AdminPanelWebclient)
    const tenantsData = typesUtils.pArray(adminPanelWebclientData?.Tenants?.Items)
    if (tenantsData.length > 0) {
      store.dispatch('tenants/parseTenants', tenantsData)
    } else {
      store.dispatch('tenants/requestTenants')
    }
  },

  setAppData (appData) {
    return new Promise((resolve, reject) => {
      this.appData = appData
      enums.init(appData)
      errors.init(appData)
      modulesManager.getModules(appData).then(() => {
        store.dispatch('user/parseAppData', appData).then(() => {
          modulesManager.initModules(appData)
          resolve()
        }, reject)
      }, reject)
    })
  },

  requestAppData () {
    return new Promise((resolve, reject) => {
      webApi.sendRequest({
        moduleName: 'Core',
        methodName: 'GetAppData',
        parameters: {},
      }).then(result => {
        if (_.isObject(result)) {
          this.setAppData(result).then(() => {
            if (store.getters['user/isUserSuperAdmin']) {
              this.parseTenantsFromAppData()
              // Resets AuthToken cookie to continue signing in period,
              // also to make sure that AuthToken cookie is set with the correct path
              this.setAuthTokenCookie(store.getters['user/getAuthToken'])
            }
            resolve()
          }, reject)
        } else {
          notification.showError(i18n.tc('COREWEBCLIENT.ERROR_UNKNOWN'))
          reject()
        }
      }, response => {
        notification.showError(errors.getTextFromResponse(response, i18n.tc('COREWEBCLIENT.ERROR_UNKNOWN')))
        reject()
      })
    })
  },
}

export default {
  init () {
    return new Promise((resolve, reject) => {
      if (core.appData === null) {
        core.requestAppData().then(resolve, reject)
      } else {
        resolve()
      }
    })
  },

  logout () {
    webApi.sendRequest({
      moduleName: 'Core',
      methodName: 'Logout',
      parameters: {},
    }).then(() => {
      core.setAuthToken('')
    }, () => {
      core.setAuthToken('')
    })
  },

  setAuthToken: core.setAuthToken.bind(core),

  getAppData () {
    return core.appData
  },
}
