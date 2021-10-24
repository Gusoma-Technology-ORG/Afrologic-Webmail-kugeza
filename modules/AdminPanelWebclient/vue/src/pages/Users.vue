<template>
  <q-splitter :after-class="!showTabs ? 'q-splitter__right-panel' : ''" class="full-height full-width"
              v-model="listSplitterWidth" :limits="[10,30]">
    <template v-slot:before>
      <div class="flex column full-height">
        <q-toolbar class="col-auto q-py-sm list-border">
          <div class="flex">
            <q-btn flat color="grey-8" size="mg" no-wrap :disable="checkedIds.length === 0"
                   @click="askDeleteCheckedUsers">
              <Trash></Trash>
              <span>{{ countLabel }}</span>
              <q-tooltip>
                {{ $t('COREWEBCLIENT.ACTION_DELETE') }}
              </q-tooltip>
            </q-btn>
            <q-btn flat color="grey-8" size="mg" @click="routeCreateUser" v-if="allowCreateUser">
              <Add></Add>
              <q-tooltip>
                {{ $t('ADMINPANELWEBCLIENT.ACTION_CREATE_ENTITY_USER') }}
              </q-tooltip>
            </q-btn>
            <component v-for="filter in filters" :key="filter.name" v-bind:is="filter" @filter-selected="routeFilter"
                       @filter-filled-up="populateFiltersGetParameters" @allow-create-user="handleAllowCreateUser"/>
          </div>
        </q-toolbar>
        <StandardList class="col-grow list-border" :items="userItems" :selectedItem="selectedUserId" :loading="loadingUsers"
                      :totalCountText="totalCountText" :search="search" :page="page" :pagesCount="pagesCount"
                      :noItemsText="'ADMINPANELWEBCLIENT.INFO_NO_ENTITIES_USER'"
                      :noItemsFoundText="'ADMINPANELWEBCLIENT.INFO_NO_ENTITIES_FOUND_USER'"
                      ref="userList" @route="route" @check="afterCheck"/>
      </div>
    </template>
    <template v-slot:after>
      <q-splitter after-class="q-splitter__right-panel" v-if="showTabs" class="full-height full-width"
                  v-model="tabsSplitterWidth" :limits="[10,30]">
        <template v-slot:before>
          <q-list>
            <div>
              <q-item clickable @click="route(selectedUserId)" :class="selectedTab === '' ? 'bg-selected-item' : ''">
                <q-item-section>
                  <q-item-label lines="1" v-t="'ADMINPANELWEBCLIENT.LABEL_COMMON_SETTINGS_TAB'"></q-item-label>
                </q-item-section>
              </q-item>
              <q-separator/>
            </div>
            <div v-for="tab in tabs" :key="tab.tabName">
              <q-item clickable @click="route(selectedUserId, tab.tabName)"
                      :class="selectedTab === tab.tabName ? 'bg-selected-item' : ''">
                <q-item-section>
                  <q-item-label lines="1">{{ $t(tab.title) }}</q-item-label>
                </q-item-section>
              </q-item>
              <q-separator/>
            </div>
            <q-inner-loading style="justify-content: flex-start;" :showing="deleting">
              <q-linear-progress query/>
            </q-inner-loading>
          </q-list>
        </template>
        <template v-slot:after>
          <router-view @no-user-found="handleNoUserFound" @user-created="handleCreateUser"
                       @cancel-create="route" @delete-user="askDeleteUser" :deletingIds="deletingIds"
                       :createMode="createMode"></router-view>
        </template>
      </q-splitter>
      <router-view v-if="!showTabs" @no-user-found="handleNoUserFound" @user-created="handleCreateUser"
                   @cancel-create="route" @delete-user="askDeleteUser" :deletingIds="deletingIds"
                   :createMode="createMode"></router-view>
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

import cache from 'src/cache'
import modulesManager from 'src/modules-manager'
import settings from 'src/settings'

import ConfirmDialog from 'src/components/ConfirmDialog'
import StandardList from 'src/components/StandardList'

import Add from 'src/assets/icons/Add'
import Trash from 'src/assets/icons/Trash'

export default {
  name: 'Domains',

  components: {
    ConfirmDialog,
    StandardList,
    Add,
    Trash
  },

  data() {
    return {
      users: [],
      selectedUserId: 0,
      loadingUsers: false,
      totalCount: 0,

      search: '',
      page: 1,
      limit: settings.getEntitiesPerPage(),

      userItems: [],
      checkedIds: [],

      allowCreateUser: true,
      justCreatedId: 0,

      deletingIds: [],

      tabs: [],
      selectedTab: '',

      listSplitterWidth: localStorage.getItem('users-list-splitter-width') || 20,
      tabsSplitterWidth: localStorage.getItem('users-tabs-splitter-width') || 20,

      filters: [],
      currentFiltersRoutes: {},
      filtersGetParameters: {},
    }
  },

  computed: {
    currentTenantId () {
      return this.$store.getters['tenants/getCurrentTenantId']
    },

    pagesCount () {
      return Math.ceil(this.totalCount / this.limit)
    },

    countLabel () {
      const count = this.checkedIds.length
      return count > 0 ? count : ''
    },

    totalCountText () {
      return this.$tc('ADMINPANELWEBCLIENT.LABEL_USERS_COUNT', this.totalCount, { COUNT: this.totalCount })
    },

    showTabs () {
      return this.tabs.length > 0 && this.selectedUserId > 0
    },

    deleting () {
      return this.deletingIds.indexOf(this.selectedUserId) !== -1
    },

    createMode () {
      const createIndex = this.$route.path.indexOf('/create')
      return createIndex !== -1 && createIndex === (this.$route.path.length - 7)
    },
  },

  watch: {
    currentTenantId () {
      if (this.$route.path !== '/users') {
        this.route()
      }
      this.populate()
    },

    $route (to, from) {
      if (this.createMode) {
        this.selectedUserId = 0
      } else {
        const search = typesUtils.pString(this.$route?.params?.search)
        const page = typesUtils.pPositiveInt(this.$route?.params?.page)
        if (this.search !== search || this.page !== page || this.justCreatedId !== 0) {
          this.search = search
          this.page = page
          this.populate()
        }

        const userId = typesUtils.pNonNegativeInt(this.$route?.params?.id)
        if (this.selectedUserId !== userId) {
          this.selectedUserId = userId
        }

        const pathParts = this.$route.path.split('/')
        const lastPart = pathParts.length > 0 ? pathParts[pathParts.length - 1] : ''
        const tab = this.tabs.find(tab => { return tab.tabName === lastPart })
        this.selectedTab = tab ? tab.tabName : ''
      }
    },

    users () {
      this.userItems = this.users.map(user => {
        return {
          id: user.id,
          title: user.publicId,
          checked: false,
        }
      })
    },

    allowCreateUser () {
      if (!this.allowCreateUser && this.createMode) {
        this.$router.push('/users')
      }
    },

    listSplitterWidth () {
      localStorage.setItem('users-list-splitter-width', this.listSplitterWidth)
    },

    tabsSplitterWidth () {
      localStorage.setItem('users-tabs-splitter-width', this.tabsSplitterWidth)
    }
  },

  async mounted () {
    await this.populateFilters()
    this.populateTabs()
    this.populate()
  },

  methods: {
    handleAllowCreateUser (data) {
      if (data.tenantId === this.currentTenantId) {
        this.allowCreateUser = data.allowCreateUser
      }
    },

    async populateFilters () {
      this.filters = await modulesManager.getFiltersForUsers()
    },

    populateTabs () {
      const tabsRoutes = []
      this.tabs = modulesManager.getAdminUserTabs()
      _.each(this.tabs, (tab) => {
        if (typesUtils.isNonEmptyArray(tab.paths)) {
          tab.paths.forEach(path => {
            this.$router.addRoute('users', { path, component: tab.component })
            tabsRoutes.push({ path, component: tab.component })
          })
        } else {
          this.$router.addRoute('users', { path: tab.tabName, component: tab.component })
          tabsRoutes.push({ path: tab.tabName, component: tab.component })
        }
      })
      tabsRoutes.forEach(tabRoute => {
        this.filters.forEach(filterComponent => {
          this.$router.addRoute('users', { path: filterComponent.filterRoute + '/' + tabRoute.path, component: tabRoute.component })
        })
      })
    },

    populateFiltersGetParameters (filterGetParameter) {
      const newFiltersGetParameters = _.extend(_.clone(this.filtersGetParameters), filterGetParameter)
      if (!_.isEqual(newFiltersGetParameters, this.filtersGetParameters)) {
        this.filtersGetParameters = newFiltersGetParameters
        this.populate()
      }
    },

    populate () {
      this.loadingUsers = true
      cache.getUsers(this.currentTenantId, this.filtersGetParameters, this.search, this.page, this.limit)
        .then(({ users, totalCount, tenantId, filtersGetParameters = {}, page = 1, search = '' }) => {
          if (tenantId === this.currentTenantId && _.isEqual(filtersGetParameters, this.filtersGetParameters) &&
            page === this.page && search === this.search
          ) {
            this.users = users
            this.totalCount = totalCount
            this.loadingUsers = false
            if (this.justCreatedId && users.find(user => {
              return user.id === this.justCreatedId
            })) {
              this.route(this.justCreatedId)
              this.justCreatedId = 0
            }
          }
        })
    },

    getFiltersRoute () {
      const filterRoutes = _.map(this.currentFiltersRoutes, (routeValue, routeName) => {
        return routeValue !== undefined ? routeName + '/' + routeValue : ''
      })
      const filterRoutesValues = _.filter(filterRoutes, routeValue => {
        return routeValue !== ''
      })
      return filterRoutesValues.length > 0 ? '/' + filterRoutesValues.join('/') : ''
    },

    routeFilter (data) {
      this.currentFiltersRoutes[data.routeName] = data.routeValue
      this.route()
    },

    route (userId = 0, tabName = '') {
      const enteredSearch = this.$refs?.userList?.enteredSearch || ''
      const searchRoute = enteredSearch !== '' ? `/search/${enteredSearch}` : ''

      let selectedPage = this.$refs?.userList?.selectedPage || 1
      if (this.search !== enteredSearch) {
        selectedPage = 1
      }
      const pageRoute = selectedPage > 1 ? `/page/${selectedPage}` : ''

      const idRoute = userId > 0 ? `/id/${userId}` : ''
      const tabRoute = tabName !== '' ? `/${tabName}` : ''
      const path = '/users' + this.getFiltersRoute() + searchRoute + pageRoute + idRoute + tabRoute
      if (path !== this.$route.path) {
        this.$router.push(path)
      }
    },

    routeCreateUser () {
      this.$router.push('/users' + this.getFiltersRoute() + '/create')
    },

    handleCreateUser (id) {
      this.justCreatedId = id
      this.route()
      this.populate()
    },

    afterCheck (ids) {
      this.checkedIds = ids
    },

    handleNoUserFound () {
      notification.showError(this.$t('ADMINPANELWEBCLIENT.ERROR_USER_NOT_FOUND'))
      this.route()
      this.populate()
    },

    askDeleteUser (id) {
      this.askDeleteUsers([id])
    },

    askDeleteCheckedUsers () {
      this.askDeleteUsers(this.checkedIds)
    },

    askDeleteUsers (ids) {
      if (_.isFunction(this?.$refs?.confirmDialog?.openDialog)) {
        const user = ids.length === 1
          ? this.users.find(user => {
            return user.id === ids[0]
          })
          : null
        const title = user ? user.publicId : ''
        this.$refs.confirmDialog.openDialog({
          title,
          message: this.$tc('ADMINPANELWEBCLIENT.CONFIRM_DELETE_USER_PLURAL', ids.length),
          okHandler: this.deleteUsers.bind(this, ids)
        })
      }
    },

    deleteUsers (ids) {
      this.deletingIds = ids
      this.loadingUsers = true
      webApi.sendRequest({
        moduleName: 'Core',
        methodName: 'DeleteUsers',
        parameters: {
          IdList: ids,
          DeletionConfirmedByAdmin: true
        },
      }).then(result => {
        this.deletingIds = []
        this.loadingUsers = false
        if (result === true) {
          notification.showReport(this.$tc('ADMINPANELWEBCLIENT.REPORT_DELETE_ENTITIES_USER_PLURAL', ids.length))
          const isSelectedUserRemoved = ids.indexOf(this.selectedUserId) !== -1
          const selectedPage = this.$refs?.userList?.selectedPage || 1
          const shouldChangePage = this.users.length === ids.length && selectedPage > 1
          if (shouldChangePage && _.isFunction(this.$refs?.userList?.decreasePage)) {
            this.$refs.userList.decreasePage()
          } else if (isSelectedUserRemoved) {
            this.route()
            this.populate()
          } else {
            this.populate()
          }
        } else {
          notification.showError(this.$tc('ADMINPANELWEBCLIENT.ERROR_DELETE_ENTITIES_USER_PLURAL', ids.length))
        }
      }, error => {
        this.deletingIds = []
        this.loadingUsers = false
        notification.showError(errors.getTextFromResponse(error, this.$tc('ADMINPANELWEBCLIENT.ERROR_DELETE_ENTITIES_USER_PLURAL', ids.length)))
      })
    },
  },
}
</script>

<style lang="scss">
</style>
