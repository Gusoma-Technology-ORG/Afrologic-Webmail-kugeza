<template>
  <q-scroll-area class="full-height full-width relative-position">
    <div class="q-pa-lg ">
      <div class="row q-mb-md">
        <div class="col text-h5" v-if="!createMode" v-t="'COREWEBCLIENT.HEADING_COMMON_SETTINGS'"></div>
        <div class="col text-h5" v-if="createMode" v-t="'ADMINPANELWEBCLIENT.HEADING_CREATE_USER'"></div>
      </div>
      <q-card flat bordered class="card-edit-settings">
        <q-card-section>
          <component v-bind:is="mainDataComponent" ref="mainDataComponent" :currentTenantId="currentTenantId"
                     :user="user" :createMode="createMode" @save="handleSave" />
          <div class="row" v-if="allowMakeTenant">
            <div class="col-2"></div>
            <div class="col-5">
              <q-checkbox dense v-model="isTenantAdmin" :label="$t('ADMINPANELWEBCLIENT.LABEL_USER_IS_TENANT_ADMIN')" />
            </div>
          </div>
          <div class="row q-mt-md" v-if="!createMode">
            <div class="col-2"></div>
            <div class="col-5">
              <q-checkbox dense v-model="writeSeparateLog"
                          :label="$t('ADMINPANELWEBCLIENT.LABEL_LOGGING_SEPARATE_LOG_FOR_USER')" />
            </div>
          </div>
          <component v-for="component in otherDataComponents" :key="component.name" v-bind:is="component"
                     ref="otherDataComponents" :currentTenantId="currentTenantId" :user="user" :createMode="createMode"
                     @save="handleSave" />
        </q-card-section>
      </q-card>
      <div class="q-pt-md text-right">
        <q-btn unelevated no-caps dense class="q-px-sm" :ripple="false" color="negative" @click="deleteUser"
               :label="$t('ADMINPANELWEBCLIENT.ACTION_DELETE_USER')" v-if="!createMode">
        </q-btn>
        <q-btn unelevated no-caps dense class="q-px-sm q-ml-sm" :ripple="false" color="primary" @click="handleSave"
               :label="$t('COREWEBCLIENT.ACTION_SAVE')" v-if="!createMode">
        </q-btn>
        <q-btn unelevated no-caps dense class="q-px-sm q-ml-sm" :ripple="false" color="primary" @click="handleSave"
               :label="$t('COREWEBCLIENT.ACTION_CREATE')" v-if="createMode">
        </q-btn>
        <q-btn unelevated no-caps dense class="q-px-sm q-ml-sm" :ripple="false" color="secondary" @click="cancel"
               :label="$t('COREWEBCLIENT.ACTION_CANCEL')" v-if="createMode" >
        </q-btn>
      </div>
    </div>
    <q-inner-loading style="justify-content: flex-start;" :showing="loading || deleting || saving">
      <q-linear-progress query />
    </q-inner-loading>
  </q-scroll-area>
</template>

<script>
import _ from 'lodash'

import errors from 'src/utils/errors'
import notification from 'src/utils/notification'
import typesUtils from 'src/utils/types'
import webApi from 'src/utils/web-api'

import cache from 'src/cache'
import modulesManager from 'src/modules-manager'
import settings from 'src/settings'

import UserModel from 'src/classes/user'

import enums from 'src/enums'
let UserRoles = {}

export default {
  name: 'EditUser',

  props: {
    deletingIds: Array,
    createMode: Boolean,
  },

  data() {
    return {
      mainDataComponent: null,
      otherDataComponents: [],

      allowMakeTenant: settings.getEnableMultiTenant(),

      user: null,
      publicId: '',
      isTenantAdmin: false,
      writeSeparateLog: false,

      loading: false,
      saving: false,
    }
  },

  computed: {
    currentTenantId () {
      return this.$store.getters['tenants/getCurrentTenantId']
    },

    deleting () {
      return this.deletingIds.indexOf(this.user?.id) !== -1
    },
  },

  watch: {
    $route(to, from) {
      this.parseRoute()
      this.getUserMainDataComponent()
    },
  },

  beforeRouteLeave (to, from, next) {
    this.doBeforeRouteLeave(to, from, next)
  },

  beforeRouteUpdate (to, from, next) {
    this.doBeforeRouteLeave(to, from, next)
  },

  mounted () {
    UserRoles = enums.getUserRoles()
    this.getUserMainDataComponent()
    this.getUserOtherDataComponents()
    this.loading = false
    this.saving = false
    this.parseRoute()
  },

  methods: {
    async getUserMainDataComponent () {
      this.mainDataComponent = await modulesManager.getUserMainDataComponent()
    },
    async getUserOtherDataComponents () {
      this.otherDataComponents = await modulesManager.getUserOtherDataComponents()
    },
    parseRoute () {
      if (this.createMode) {
        const user = new UserModel(this.currentTenantId, {})
        this.fillUp(user)
      } else {
        const userId = typesUtils.pPositiveInt(this.$route?.params?.id)
        if (this.user?.id !== userId) {
          this.user = {
            id: userId,
          }
          this.populate()
        }
      }
    },

    clear () {
      this.publicId = ''
      this.isTenantAdmin = false
      this.writeSeparateLog = false
    },

    fillUp (user) {
      this.user = user
      this.publicId = user.publicId
      this.isTenantAdmin = user.role === UserRoles.TenantAdmin
      this.writeSeparateLog = user.writeSeparateLog
    },

    populate () {
      this.clear()
      this.loading = true
      cache.getUser(this.currentTenantId, this.user.id).then(({ user, userId }) => {
        if (userId === this.user.id) {
          this.loading = false
          if (user) {
            this.fillUp(user)
          } else {
            this.$emit('no-user-found')
          }
        }
      })
    },

    /**
     * Method is used in doBeforeRouteLeave mixin
     */
    hasChanges () {
      if (this.loading) {
        return false
      }

      const hasMainDataChanges = _.isFunction(this.$refs?.mainDataComponent?.hasChanges)
        ? this.$refs.mainDataComponent.hasChanges()
        : false
      const hasOtherDataChanges = _.isFunction(this.$refs?.otherDataComponents?.some)
        ? this.$refs.otherDataComponents.some(component => {
          return _.isFunction(component.hasChanges) ? component.hasChanges() : false
        })
        : false
      return hasMainDataChanges || hasOtherDataChanges || this.isTenantAdmin !== (this.user?.role === UserRoles.TenantAdmin) ||
        this.writeSeparateLog !== this.user?.writeSeparateLog
    },

    /**
     * Method is used in doBeforeRouteLeave mixin,
     * do not use async methods - just simple and plain reverting of values
     * !! hasChanges method must return true after executing revertChanges method
     */
    revertChanges () {
      if (_.isFunction(this.$refs?.mainDataComponent?.revertChanges)) {
        this.$refs.mainDataComponent.revertChanges()
      }
      if (_.isFunction(this.$refs?.otherDataComponents?.forEach)) {
        this.$refs.otherDataComponents.forEach(component => {
          if (_.isFunction(component.revertChanges)) {
            component.revertChanges()
          }
        })
      }
      this.isTenantAdmin = (this.user?.role === UserRoles.TenantAdmin)
      this.writeSeparateLog = this.user?.writeSeparateLog
    },

    isDataValid () {
      const isMainDataValid = _.isFunction(this.$refs?.mainDataComponent?.isDataValid)
        ? this.$refs.mainDataComponent.isDataValid()
        : true
      const isOtherDataValid = _.isFunction(this.$refs?.otherDataComponents?.every)
        ? this.$refs.otherDataComponents.every(component => {
          return _.isFunction(component.isDataValid) ? component.isDataValid() : true
        })
        : true
      return isMainDataValid && isOtherDataValid
    },

    isUserEmailValid () {
      const userData = this.$refs.mainDataComponent.getSaveParameters()
      const userEmail = userData.PublicId
      const userNamePart = userEmail.slice(0, userEmail.lastIndexOf('@'))
      const invalidCharactersRegex = /[@\s]/
      return !invalidCharactersRegex.test(userNamePart) && userNamePart.length
    },

    handleSave () {
      this.isUserEmailValid()
        ? this.save()
        : notification.showError(this.$t('ADMINPANELWEBCLIENT.ERROR_INVALID_EMAIL_USERNAME_PART'))
    },

    save () {
      if (!this.saving && this.isDataValid()) {
        this.saving = true
        const mainDataParameters = _.isFunction(this.$refs?.mainDataComponent?.getSaveParameters)
          ? this.$refs.mainDataComponent.getSaveParameters()
          : {}
        let parameters = _.extend({
          UserId: this.user.id,
          TenantId: this.user.tenantId,
          Role: this.isTenantAdmin ? UserRoles.TenantAdmin : UserRoles.NormalUser,
          WriteSeparateLog: this.writeSeparateLog,
          Forced: true,
        }, mainDataParameters)
        console.log('parameters', parameters)
        if (_.isFunction(this.$refs?.otherDataComponents?.forEach)) {
          this.$refs.otherDataComponents.forEach(component => {
            const otherParameters = _.isFunction(component.getSaveParameters)
              ? component.getSaveParameters()
              : {}
            parameters = _.extend(parameters, otherParameters)
          })
        }

        webApi.sendRequest({
          moduleName: 'Core',
          methodName: this.createMode ? 'CreateUser' : 'UpdateUser',
          parameters,
        }).then(result => {
          this.saving = false
          if (this.createMode) {
            this.handleCreateResult(result, parameters)
          } else {
            this.handleUpdateResult(result, parameters)
          }
        }, response => {
          this.saving = false
          const errorConst = this.createMode ? 'ERROR_CREATE_ENTITY_USER' : 'ERROR_UPDATE_ENTITY_USER'
          notification.showError(errors.getTextFromResponse(response, this.$t('ADMINPANELWEBCLIENT.' + errorConst)))
        })
      }
    },

    handleCreateResult (result, parameters) {
      if (_.isSafeInteger(result)) {
        notification.showReport(this.$t('ADMINPANELWEBCLIENT.REPORT_CREATE_ENTITY_USER'))
        this.user.update(parameters)
        this.$emit('user-created', result)
      } else {
        notification.showError(this.$t('ADMINPANELWEBCLIENT.ERROR_CREATE_ENTITY_USER'))
      }
    },

    handleUpdateResult (result, parameters) {
      if (result === true) {
        cache.getUser(parameters.TenantId, parameters.UserId).then(({ user }) => {
          user.update(parameters)
          this.populate()
        })
        notification.showReport(this.$t('ADMINPANELWEBCLIENT.REPORT_UPDATE_ENTITY_USER'))
      } else {
        notification.showError(this.$t('ADMINPANELWEBCLIENT.ERROR_UPDATE_ENTITY_USER'))
      }
    },

    cancel () {
      this.$emit('cancel-create')
    },

    deleteUser () {
      this.$emit('delete-user', this.user.id)
    },
  },
}
</script>

<style scoped>

</style>
