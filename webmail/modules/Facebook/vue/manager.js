import settings from '../../Facebook/vue/settings'

export default {
  moduleName: 'Facebook',

  requiredModules: [],

  init (appData) {
    settings.init(appData)
  },

  getAdminSystemTabs () {
    return [
      {
        tabName: 'facebook',
        title: 'FACEBOOK.LABEL_SETTINGS_TAB',
        component () {
          return import('./components/FacebookAdminSettings')
        },
      },
    ]
  },
}
