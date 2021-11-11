import { i18n } from 'boot/i18n'
import axios from 'axios'
import VueCookies from 'vue-cookies'
import store from 'src/store'

import _ from 'lodash'

import notification from 'src/utils/notification'
import typesUtils from 'src/utils/types'
import urlUtils from 'src/utils/url'

class AdminPanelSettings {
  constructor(appData, settings) {
    const coreData = typesUtils.pObject(appData.Core)
    this.enableMultiTenant = typesUtils.pBool(coreData.EnableMultiTenant)
    this.authTokenCookieExpireTime = typesUtils.pInt(coreData.AuthTokenCookieExpireTime, 30)
    this.autodetectLanguage = typesUtils.pBool(coreData.AutodetectLanguage)
    this.isSystemConfigured = typesUtils.pBool(coreData.IsSystemConfigured)
    this.language = typesUtils.pString(coreData.CommonLanguage, 'English')
    this.shortLanguage = this._getShortLanguage(coreData)
    this.setSiteName(coreData.SiteName)
    this.storeAuthTokenInDB = typesUtils.pBool(coreData.StoreAuthTokenInDB)
    this.timeFormat = typesUtils.pString(coreData.TimeFormat) // 0 - 24, 1 - 12
    this.cookiePath = typesUtils.pString(coreData.CookiePath)
    if (this.cookiePath === '') {
      this.cookiePath = urlUtils.getAdminAppPath()
    }
    if (process.env.DEV) {
      this.cookiePath = '/'
    }
    this.cookieSecure = typesUtils.pBool(coreData.CookieSecure)
    this.version = typesUtils.pString(coreData.Version)
    this.productName = typesUtils.pString(coreData.ProductName)
    this.enableLogging = typesUtils.pBool(coreData.EnableLogging)
    this.enableEventLogging = typesUtils.pBool(coreData.EnableEventLogging)
    this.loggingLevel = typesUtils.pInt(coreData.LoggingLevel, 100)
    // only for admin
    this.adminHasPassword = typesUtils.pBool(coreData.AdminHasPassword)
    this.adminLanguage = typesUtils.pString(coreData.AdminLanguage)
    this.adminLogin = typesUtils.pString(coreData.AdminLogin)
    this.dbHost = typesUtils.pString(coreData.DBHost)
    this.dbLogin = typesUtils.pString(coreData.DBLogin)
    this.dbName = typesUtils.pString(coreData.DBName)
    this.saltNotEmpty = typesUtils.pBool(coreData.SaltNotEmpty)

    const coreWebclientData = typesUtils.pObject(appData.CoreWebclient)
    this.baseUrl = typesUtils.pString(coreWebclientData.BaseUrl)
    this.languageList = typesUtils.pArray(coreWebclientData.LanguageListWithNames, { name: 'English', text: 'English' })
    this.theme = typesUtils.pString(coreWebclientData.Theme, 'Default')
    this.themeList = typesUtils.pArray(coreWebclientData.ThemeList, ['Default'])

    const adminPanelWebclientData = typesUtils.pObject(appData.AdminPanelWebclient)
    this.entitiesOrder = typesUtils.pArray(adminPanelWebclientData.EntitiesOrder)
    this.entitiesPerPage = typesUtils.pInt(adminPanelWebclientData.EntitiesPerPage, 10)
    this.tabsOrder = typesUtils.pArray(adminPanelWebclientData.TabsOrder)

    const coreMobileWebclient = typesUtils.pObject(appData.CoreMobileWebclient)
    this.mobileTheme = typesUtils.pString(coreMobileWebclient.Theme, 'Default')
    this.mobileThemeList = typesUtils.pArray(coreMobileWebclient.ThemeList, ['Default'])

    const appDataSectionLogsViewerWebclient = typesUtils.pObject(appData.LogsViewerWebclient)
    this.viewLastLogSize = typesUtils.pInt(appDataSectionLogsViewerWebclient.ViewLastLogSize)
  }

  showErrorsIfSystemNotConfigured () {
    if (this.isSystemConfigured === false) {
      notification.showError(i18n.tc('COREWEBCLIENT.ERROR_SYSTEM_NOT_CONFIGURED'), 0)
    }
    if (store.getters['user/isUserSuperAdmin']) {
      this.showErrorIfConfigIsAccessible()
      if (!this.adminHasPassword) {
        this.dismissPasswordError = notification.showError(i18n.tc('ADMINPANELWEBCLIENT.ERROR_ADMIN_EMPTY_PASSWORD'), 0)
      }
      if (!this.saltNotEmpty) {
        notification.showError(i18n.tc('ADMINPANELWEBCLIENT.ERROR_SALT_EMPTY'), 0)
      }
      if (this.dbLogin === '' || this.dbHost === '' || this.dbName === '') {
        this.dismissDbError = notification.showError(i18n.tc('ADMINPANELWEBCLIENT.ERROR_DB_ACCESS'), 0)
      }
    }
  }

  getBaseUrl () {
    let baseUrl = this.baseUrl
    if (_.isEmpty(baseUrl)) {
      baseUrl = urlUtils.getAdminAppPath()
    }
    return baseUrl
  }

  showErrorIfConfigIsAccessible () {
    axios({
      method: 'get',
      url: this.getBaseUrl() + 'data/settings/config.json',
    })
      .then((response) => {
        const isOkResponse = !!response && response.status === 200 && !!response.data
        if (isOkResponse) {
          notification.showError(i18n.tc('ADMINPANELWEBCLIENT.ERROR_DATA_FOLDER_ACCESSIBLE_FROM_WEB'), 0)
        }
      })
      .catch((/* error */) => {
        // Do nothing. It is good that config file is not available
      })
  }

  saveAdminAccountData ({ login, hasPassword, language }) {
    this.adminLogin = login
    this.adminHasPassword = hasPassword
    if (this.adminHasPassword && _.isFunction(this.dismissPasswordError)) {
      this.dismissPasswordError()
      this.dismissPasswordError = null
    }
    if (this.adminLanguage !== language) {
      this.adminLanguage = language
      window.location.reload()
    }
  }

  saveLoggingData ({ enableLogging, enableEventLogging, loggingLevel }) {
    this.enableLogging = enableLogging
    this.enableEventLogging = enableEventLogging
    this.loggingLevel = loggingLevel
  }

  saveCommonSettingData ({ siteName, theme, mobileTheme, language, timeFormat, autodetectLanguage }) {
    this.setSiteName(siteName)
    this.theme = theme
    this.mobileTheme = mobileTheme
    this.language = language
    this.timeFormat = timeFormat
    this.autodetectLanguage = autodetectLanguage
  }

  setSiteName (siteName) {
    this.siteName = typesUtils.pString(siteName)
    store.commit('main/setSiteName', this.siteName)
  }

  saveDatabaseSetting ({ dbName, dbLogin, dbHost }) {
    this.dbName = dbName
    this.dbLogin = dbLogin
    this.dbHost = dbHost
    if (!_.isEmpty(this.dbLogin) && !_.isEmpty(this.dbHost) && !_.isEmpty(this.dbName) && _.isFunction(this.dismissDbError)) {
      this.dismissDbError()
      this.dismissDbError = null
    }
  }

  _getShortLanguage (coreData) {
    let shortLanguage = typesUtils.pString(coreData.ShortLanguage, 'en')
    if (_.isEmpty(shortLanguage) || i18n.availableLocales.indexOf(shortLanguage) === -1) {
      if (i18n.availableLocales.indexOf('en') !== -1) {
        shortLanguage = 'en'
      } else if (!_.isEmpty(i18n.availableLocales)) {
        shortLanguage = i18n.availableLocales[0]
      }
    }
    return shortLanguage
  }
}

let settings = null

export default {
  init (appData) {
    settings = new AdminPanelSettings(appData)
    settings.showErrorsIfSystemNotConfigured()
    if (!_.isEmpty(settings.shortLanguage) && i18n.availableLocales.indexOf(settings.shortLanguage) !== -1) {
      i18n.locale = settings.shortLanguage
    }
    VueCookies.config('', settings.cookiePath, '', settings.cookieSecure)
  },

  getEnableMultiTenant () {
    return settings.enableMultiTenant
  },

  getTabsOrder () {
    return settings?.tabsOrder || []
  },

  getTabsBarOrder () {
    const order = settings.entitiesOrder.map(entityName => {
      switch (entityName) {
        case 'Tenant': return 'tenants'
        case 'User': return 'users'
        case 'Group': return 'groups'
        case 'Domain': return 'domains'
        default: return entityName
      }
    })
    order.unshift('system')
    return order
  },

  getEntitiesPerPage () {
    return settings.entitiesPerPage
  },

  getAboutSettings () {
    return {
      version: settings?.version || '',
      productName: settings?.productName || ''
    }
  },

  getLanguageList () {
    return settings?.languageList || []
  },

  getThemeList () {
    return settings?.themeList || []
  },

  getMobileThemeList () {
    return settings?.mobileThemeList || []
  },

  getCookieSettings () {
    const pathParts = settings.cookiePath.split('/')
    let lastPart = pathParts[pathParts.length - 1]
    if (_.isEmpty(lastPart) && pathParts.length > 2) {
      lastPart = pathParts[pathParts.length - 2]
    }
    const cookieBasePath = settings.cookiePath.replace(lastPart, '').replace('//', '/')
    return {
      authTokenCookieExpireTime: settings.authTokenCookieExpireTime,
      cookieSecure: settings.cookieSecure,
      cookiePath: settings.cookiePath,
      cookieBasePath,
    }
  },

  getAdminAccountData () {
    return {
      adminLogin: settings?.adminLogin || '',
      adminHasPassword: settings?.adminHasPassword || false,
      adminLanguage: settings?.adminLanguage || '',
    }
  },

  getCommonSettingData () {
    return {
      siteName: settings.siteName,
      theme: settings.theme,
      mobileTheme: settings.mobileTheme,
      language: settings.language,
      timeFormat: settings.timeFormat,
      autodetectLanguage: settings.autodetectLanguage
    }
  },

  getDatabaseSettingsData () {
    return {
      dbName: settings.dbName,
      dbLogin: settings.dbLogin,
      dbHost: settings.dbHost,
    }
  },
  getStoreAuthTokenInDB () {
    return settings.storeAuthTokenInDB
  },

  getLoggingData () {
    return {
      enableEventLogging: settings.enableEventLogging,
      enableLogging: settings.enableLogging,
      loggingLevel: settings.loggingLevel,
      viewLastLogSize: settings.viewLastLogSize
    }
  },

  getBaseUrl () {
    return settings.getBaseUrl()
  },

  saveAdminAccountData (data) {
    settings.saveAdminAccountData(data)
  },

  saveCommonSettingData (data) {
    settings.saveCommonSettingData(data)
  },

  saveDatabaseSetting (data) {
    settings.saveDatabaseSetting(data)
  },

  saveLoggingData (data) {
    settings.saveLoggingData(data)
  },
}
