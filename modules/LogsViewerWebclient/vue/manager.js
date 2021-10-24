export default {
  moduleName: 'LogsViewerWebclient',

  requiredModules: [],

  getAdminSystemTabs () {
    return [
      {
        tabName: 'logs-viewer',
        title: 'LOGSVIEWERWEBCLIENT.LABEL_LOGGING_SETTINGS_TAB',
        component () {
          return import('./components/LoggingAdminSettings')
        },
      },
    ]
  },
}
