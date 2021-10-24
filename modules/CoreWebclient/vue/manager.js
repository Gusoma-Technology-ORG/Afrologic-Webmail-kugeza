export default {
  moduleName: 'CoreWebclient',

  requiredModules: [],

  getAdminSystemTabs () {
    return [
      {
        tabName: 'common',
        title: 'COREWEBCLIENT.LABEL_COMMON_SETTINGS_TABNAME',
        component () {
          return import('./components/CommonAdminSettings')
        },
      },
    ]
  },
}
