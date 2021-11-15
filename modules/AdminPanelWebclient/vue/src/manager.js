import settings from 'src/settings'

export default {
  moduleName: 'AdminPanelWebclient',

  requiredModules: [],

  init (appData) {
    settings.init(appData)
  },

  getAdminSystemTabs () {
    return [
      {
        tabName: 'admin-security',
        title: 'ADMINPANELWEBCLIENT.LABEL_SECURITY_SETTINGS_TAB',
        component () {
          return import('components/AccountAdminSettings')
        },
      },
      {
        tabName: 'admin-db',
        title: 'ADMINPANELWEBCLIENT.HEADING_DB_SETTINGS',
        component () {
          return import('components/DbAdminSettingsView')
        },
      },
      {
        tabName: 'about',
        title: 'ADMINPANELWEBCLIENT.LABEL_ABOUT_SETTINGS_TAB',
        component () {
          return import('components/AboutAdminSettings')
        },
      }
    ]
  },
}
