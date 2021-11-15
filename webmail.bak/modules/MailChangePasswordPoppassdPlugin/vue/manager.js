import settings from '../../MailChangePasswordPoppassdPlugin/vue/settings';

export default {
  moduleName: 'MailChangePasswordPoppassdPlugin',

  requiredModules: [],
  init (appData) {
    settings.init(appData)
  },
  getAdminSystemTabs () {
    return [
      {
        tabName: 'mail-poppassd-plugin',
        title: 'MAILCHANGEPASSWORDPOPPASSDPLUGIN.LABEL_POPPASSD_SETTINGS_TAB',
        component () {
          return import('./components/PoppassdAdminSettings')
        },
      },
    ]
  },
}
