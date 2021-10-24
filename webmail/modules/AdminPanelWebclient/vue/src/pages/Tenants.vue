<template>
  <q-splitter :after-class="!showTabs ? 'q-splitter__right-panel' : ''" class="full-height full-width"
              v-model="listSplitterWidth" :limits="[10,30]">
    <template v-slot:before>
      <div class="flex column full-height ">
        <q-toolbar class="col-auto q-py-sm list-border">
          <q-btn flat color="grey-8" size="mg" no-wrap :disable="checkedIds.length === 0"
                 @click="askDeleteCheckedTenants">
            <Trash></Trash>
            <span>{{ countLabel }}</span>
            <q-tooltip>
              {{ $t('COREWEBCLIENT.ACTION_DELETE') }}
            </q-tooltip>
          </q-btn>
          <q-btn flat color="grey-8" size="mg" @click="routeCreateTenant">
            <Add></Add>
            <q-tooltip>
              {{ $t('ADMINPANELWEBCLIENT.ACTION_CREATE_ENTITY_TENANT') }}
            </q-tooltip>
          </q-btn>
        </q-toolbar>
        <StandardList class="col-grow list-border" :items="tenantItems" :selectedItem="selectedTenantId" :loading="loadingTenants"
                      :search="search" :page="page" :pagesCount="pagesCount"
                      :noItemsText="'ADMINPANELWEBCLIENT.INFO_NO_ENTITIES_TENANT'"
                      :noItemsFoundText="'ADMINPANELWEBCLIENT.INFO_NO_ENTITIES_FOUND_TENANT'"
                      ref="tenantList" @route="route" @check="afterCheck"/>
      </div>
    </template>
    <template v-slot:after>
      <q-splitter after-class="q-splitter__right-panel" v-if="showTabs" class="full-height full-width"
                  v-model="tabsSplitterWidth" :limits="[10,30]">
        <template v-slot:before>
          <q-list >
            <div>
              <q-item clickable @click="route(selectedTenantId)" :class="selectedTab === '' ? 'bg-selected-item' : ''">
                <q-item-section>
                  <q-item-label lines="1" v-t="'ADMINPANELWEBCLIENT.LABEL_COMMON_SETTINGS_TAB'"></q-item-label>
                </q-item-section>
              </q-item>
              <q-separator/>
            </div>
            <div v-for="tab in tabs" :key="tab.tabName">
              <q-item clickable @click="route(selectedTenantId, tab.tabName)"
                      :class="selectedTab === tab.tabName ? 'bg-selected-item' : ''">
                <q-item-section>
                  <q-item-label lines="1">{{ $t(tab.title) }}</q-item-label>
                </q-item-section>
              </q-item>
              <q-separator/>
            </div>
          </q-list>
        </template>
        <template v-slot:after>
          <router-view @tenant-created="handleCreateTenant"
                       @cancel-create="route" @delete-tenant="askDeleteTenant" :deletingIds="deletingIds"></router-view>
        </template>
      </q-splitter>
      <router-view v-if="!showTabs" @tenant-created="handleCreateTenant"
                   @cancel-create="route" @delete-tenant="askDeleteTenant" :deletingIds="deletingIds"></router-view>
    </template>
    <ConfirmDialog ref="confirmDialog"/>
  </q-splitter>
</template>

<script>
import _ from 'lodash'

import errors from 'src/utils/errors'
import notification from 'src/utils/notification'
import typesUtils from 'src/utils/types'
import webApi from 'src/utils/web-api'

import modulesManager from 'src/modules-manager'
import settings from 'src/settings'

import ConfirmDialog from 'components/ConfirmDialog'
import EditTenant from 'components/EditTenant'
import Empty from 'components/Empty'
import StandardList from 'components/StandardList'
import Add from 'src/assets/icons/Add'
import Trash from 'src/assets/icons/Trash'

export default {
  name: 'Tenants',

  components: {
    ConfirmDialog,
    StandardList,
    Add,
    Trash
  },

  data() {
    return {
      tenants: [],
      selectedTenantId: 0,
      loadingTenants: false,
      totalCount: 0,

      search: '',
      page: 1,
      limit: settings.getEntitiesPerPage(),

      tenantItems: [],
      checkedIds: [],

      justCreatedId: 0,

      deletingIds: [],

      tabs: [],
      selectedTab: '',

      listSplitterWidth: localStorage.getItem('tenants-list-splitter-width') || 20,
      tabsSplitterWidth: localStorage.getItem('tenants-tabs-splitter-width') || 20,
    }
  },

  computed: {
    currentTenantId () {
      return this.$store.getters['tenants/getCurrentTenantId']
    },

    allTenants () {
      return this.$store.getters['tenants/getTenants']
    },

    pagesCount () {
      return Math.ceil(this.totalCount / this.limit)
    },

    countLabel () {
      const count = this.checkedIds.length
      return count > 0 ? count : ''
    },

    showTabs () {
      return this.tabs.length > 0 && this.selectedTenantId > 0
    },
  },

  watch: {
    $route (to, from) {
      if (this.$route.path === '/tenants/create') {
        this.selectedTenantId = 0
      } else {
        const search = typesUtils.pString(this.$route?.params?.search)
        const page = typesUtils.pPositiveInt(this.$route?.params?.page)
        if (this.search !== search || this.page !== page || this.justCreatedId !== 0) {
          this.search = search
          this.page = page
          this.populate()
        }

        const tenantId = typesUtils.pNonNegativeInt(this.$route?.params?.id)
        if (this.selectedTenantId !== tenantId) {
          this.selectedTenantId = tenantId
        }

        const pathParts = this.$route.path.split('/')
        const lastPart = pathParts.length > 0 ? pathParts[pathParts.length - 1] : ''
        const tab = this.tabs.find(tab => { return tab.tabName === lastPart })
        this.selectedTab = tab ? tab.tabName : ''
      }
    },

    allTenants () {
      this.populate()
      let isRouteChanged = false
      if (this.justCreatedId && this.allTenants.find(tenant => {
        return tenant.id === this.justCreatedId
      })) {
        if (this.tenants.find(tenant => {
          return tenant.id === this.justCreatedId
        })) {
          this.route(this.justCreatedId)
          isRouteChanged = true
        }
        this.justCreatedId = 0
      }
      if (this.selectedTenantId === 0 && !isRouteChanged) {
        this.route(this.currentTenantId)
      }
    },

    tenants () {
      if (this.tenants) {
        this.tenantItems = this.tenants.map(tenant => {
          return {
            id: tenant.id,
            title: tenant.name,
            checked: false,
          }
        })
      } else {
        this.tenantItems = []
      }
    },

    currentTenantId () {
      if (this.currentTenantId !== this.selectedTenantId) {
        this.route(this.currentTenantId)
      }
    },

    selectedTenantId () {
      if (this.currentTenantId !== this.selectedTenantId && this.selectedTenantId !== 0) {
        this.$store.commit('tenants/setCurrentTenantId', this.selectedTenantId)
      }
    },

    listSplitterWidth () {
      localStorage.setItem('tenants-list-splitter-width', this.listSplitterWidth)
    },

    tabsSplitterWidth () {
      localStorage.setItem('tenants-tabs-splitter-width', this.tabsSplitterWidth)
    }
  },

  mounted () {
    this.$router.addRoute('tenants', { path: 'id/:id', component: EditTenant })
    this.$router.addRoute('tenants', { path: 'create', component: EditTenant })
    this.$router.addRoute('tenants', { path: 'search/:search', component: Empty })
    this.$router.addRoute('tenants', { path: 'search/:search/id/:id', component: EditTenant })
    this.$router.addRoute('tenants', { path: 'page/:page', component: Empty })
    this.$router.addRoute('tenants', { path: 'page/:page/id/:id', component: EditTenant })
    this.$router.addRoute('tenants', { path: 'search/:search/page/:page', component: Empty })
    this.$router.addRoute('tenants', { path: 'search/:search/page/:page/id/:id', component: EditTenant })
    this.populateTabs()
    this.populate()
  },

  methods: {
    populateTabs () {
      this.tabs = typesUtils.pArray(modulesManager.getAdminTenantTabs())
      _.each(this.tabs, (tab) => {
        if (typesUtils.isNonEmptyArray(tab.paths)) {
          tab.paths.forEach(path => {
            this.$router.addRoute('tenants', { path, component: tab.component })
          })
        } else {
          this.$router.addRoute('tenants', { path: tab.tabName, component: tab.component })
        }
      })
    },

    populate () {
      const search = this.search.toLowerCase()
      const tenants = search === ''
        ? this.allTenants
        : this.allTenants.filter(tenant => tenant.name.toLowerCase().indexOf(search) !== -1)
      this.totalCount = tenants.length
      const offset = this.limit * (this.page - 1)
      this.tenants = tenants.slice(offset, offset + this.limit)
    },

    route (tenantId = 0, tabName = '') {
      const enteredSearch = this.$refs?.tenantList?.enteredSearch || ''
      const searchRoute = enteredSearch !== '' ? `/search/${enteredSearch}` : ''

      let selectedPage = this.$refs?.tenantList?.selectedPage || 1
      if (this.search !== enteredSearch) {
        selectedPage = 1
      }
      const pageRoute = selectedPage > 1 ? `/page/${selectedPage}` : ''

      const idRoute = tenantId > 0 ? `/id/${tenantId}` : ''
      const tabRoute = tabName !== '' ? `/${tabName}` : ''
      const path = '/tenants' + searchRoute + pageRoute + idRoute + tabRoute
      if (path !== this.$route.path) {
        this.$router.push(path)
      }
    },

    routeCreateTenant () {
      this.$router.push('/tenants/create')
    },

    handleCreateTenant (id) {
      this.justCreatedId = id
      this.route()
      this.$store.dispatch('tenants/requestTenants')
    },

    afterCheck (ids) {
      this.checkedIds = ids
    },

    askDeleteTenant (id) {
      this.askDeleteTenants([id])
    },

    askDeleteCheckedTenants () {
      this.askDeleteTenants(this.checkedIds)
    },

    askDeleteTenants (ids) {
      if (_.isFunction(this?.$refs?.confirmDialog?.openDialog)) {
        const tenant = ids.length === 1
          ? this.tenants.find(tenant => {
            return tenant.id === ids[0]
          })
          : null
        const title = tenant ? tenant.name : ''
        this.$refs.confirmDialog.openDialog({
          title,
          message: this.$tc('ADMINPANELWEBCLIENT.CONFIRM_DELETE_TENANT_PLURAL', ids.length),
          okHandler: this.deleteTenants.bind(this, ids)
        })
      }
    },

    deleteTenants (ids) {
      this.deletingIds = ids
      this.loadingTenants = true
      webApi.sendRequest({
        moduleName: 'Core',
        methodName: 'DeleteTenants',
        parameters: {
          IdList: ids,
          DeletionConfirmedByAdmin: true,
          TenantId: this.currentTenantId,
          Type: 'Tenant',
        },
      }).then(result => {
        this.deletingIds = []
        this.loadingTenants = false
        if (result === true) {
          notification.showReport(this.$tc('ADMINPANELWEBCLIENT.REPORT_DELETE_ENTITIES_TENANT_PLURAL', ids.length))
          const isSelectedTenantRemoved = ids.indexOf(this.selectedTenantId) !== -1
          const selectedPage = this.$refs?.tenantList?.selectedPage || 1
          const shouldChangePage = this.tenants.length === ids.length && selectedPage > 1
          if (shouldChangePage && _.isFunction(this.$refs?.tenantList?.decreasePage)) {
            this.$refs.tenantList.decreasePage()
          } else if (isSelectedTenantRemoved) {
            this.route()
            this.populate()
          } else {
            this.populate()
          }
        } else {
          notification.showError(this.$tc('ADMINPANELWEBCLIENT.ERROR_DELETE_ENTITIES_TENANT_PLURAL', ids.length))
        }
        this.$store.dispatch('tenants/requestTenants')
      }, error => {
        this.deletingIds = []
        this.loadingTenants = false
        notification.showError(errors.getTextFromResponse(error, this.$tc('ADMINPANELWEBCLIENT.ERROR_DELETE_ENTITIES_TENANT_PLURAL', ids.length)))
        this.$store.dispatch('tenants/requestTenants')
      })
    },
  },
}
</script>
