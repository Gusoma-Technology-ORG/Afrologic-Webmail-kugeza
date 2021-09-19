import settings from '../../Dropbox/vue/settings'

export default {
  moduleName: 'Dropbox',

  requiredModules: [],

  init (appData) {
    settings.init(appData)
  },

  getAdminSystemTabs () {
    return [
      {
        tabName: 'dropbox',
        title: 'DROPBOX.LABEL_SETTINGS_TAB',
        component () {
          return import('./components/DropboxAdminSettings')
        },
      },
    ]
  },
}
