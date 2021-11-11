import settings from '../../Google/vue/settings'

export default {
  moduleName: 'Google',

  requiredModules: [],

  init (appData) {
    settings.init(appData)
  },

  getAdminSystemTabs () {
    return [
      {
        tabName: 'google',
        title: 'GOOGLE.LABEL_SETTINGS_TAB',
        component () {
          return import('./components/GoogleAdminSettings')
        },
      },
    ]
  },
}
