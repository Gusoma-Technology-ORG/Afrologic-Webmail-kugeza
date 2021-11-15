import _ from 'lodash'
import VueCookies from 'vue-cookies'

import UserModel from 'src/classes/user'

import enums from 'src/enums'

export default {
  namespaced: true,

  state: {
    authToken: VueCookies.get('AuthToken') || '',
    userRole: null,
    userPublicId: null,
  },

  mutations: {
    setAuthToken (state, authToken) {
      state.authToken = authToken
    },

    setUserData (state, userData) {
      const user = new UserModel(null, userData, userData)
      if (!_.isEmpty(user)) {
        state.userRole = user.role
        state.userPublicId = user.publicId
      }
    },
  },

  actions: {
    parseAppData ({ commit }, appData) {
      commit('setUserData', appData.User)
    },
  },

  getters: {
    getAuthToken (state) {
      return state.authToken
    },

    isUserSuperAdmin (state) {
      const UserRoles = enums.getUserRoles()
      return state.userRole === UserRoles.SuperAdmin
    },
  },
}
