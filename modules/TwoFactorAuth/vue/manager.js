export default {
  moduleName: 'TwoFactorAuth',

  requiredModules: [],

  getAdminUserTabs () {
    return [
      {
        tabName: 'two-factor-auth',
        title: 'TWOFACTORAUTH.LABEL_SETTINGS_TAB',
        paths: [
          'id/:id/two-factor-auth',
          'search/:search/id/:id/two-factor-auth',
          'page/:page/id/:id/two-factor-auth',
          'search/:search/page/:page/id/:id/two-factor-auth',
        ],
        component () {
          return import('./components/TwoFactorAuthAdminSettingsPerUser')
        },
      },
    ]
  },
}
