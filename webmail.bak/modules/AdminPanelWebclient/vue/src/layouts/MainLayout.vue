<template>
  <q-layout view="hHh LpR lfr">
    <q-header v-show="!isLoginPage">
      <q-tabs class="q-py-sm" no-caps align="left" indicator-color="transparent">
        <q-route-tab to="/system" :ripple="false" class="q-px-none">
          <div class="q-px-md tab-label" v-t="'ADMINPANELWEBCLIENT.HEADING_SYSTEM_SETTINGS_TABNAME'"></div>
        </q-route-tab>
        <q-route-tab to="/tenants" :ripple="false" class="q-px-none" v-if="enableMultiTenant">
          <div class="q-px-md tab-label">
            <span v-t="'ADMINPANELWEBCLIENT.HEADING_TENANTS_SETTINGS_TABNAME'"></span>
            <span v-if="tenantOptions.length > 1">:</span>
          </div>
        </q-route-tab>
        <q-btn-dropdown no-icon-animation cover auto-close stretch flat dense :ripple="false" @click.stop
                        v-if="enableMultiTenant && tenantOptions.length > 1" :label="selectedTenantName"
                        class="q-px-none text-weight-regular no-hover tenants-dropdown">
          <q-list class="non-selectable" v-for="tenant in tenantOptions" :key="tenant.id">
            <q-item clickable @click="changeTenant(tenant.id)">
              <q-item-section>{{tenant.name}}</q-item-section>
              <q-item-section avatar v-show="tenant.id === selectedTenantId">
                <q-icon name="arrow_drop_up" />
              </q-item-section>
            </q-item>
          </q-list>
        </q-btn-dropdown>
        <q-route-tab v-for="page in pages" :key="page.pageName" :to="'/' + page.pageName" :ripple="false" class="q-px-none">
          <div class="q-px-md tab-label">{{ $t(page.pageTitle)}}</div>
        </q-route-tab>
        <q-space />
        <q-route-tab to="/logout" :ripple="false" class="q-px-none q-tab--logout">
          <div class="q-px-md tab-label" v-t="'COREWEBCLIENT.ACTION_LOGOUT'"></div>
        </q-route-tab>
      </q-tabs>
    </q-header>
    <q-page-container style="height: 100vh">
      <q-page :class="{ 'full-height': !isLoginPage, 'login-page': isLoginPage, 'flex-stretch': !isLoginPage, 'flex-center': isLoginPage }" class="flex">
        <router-view />
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script>
import _ from 'lodash'

import typesUtils from 'src/utils/types'

import modulesManager from 'src/modules-manager'
import settings from 'src/settings'

export default {
  name: 'admin',

  components: {
  },

  data() {
    return {
      enableMultiTenant: settings.getEnableMultiTenant(),

      pages: [],

      selectedTenantId: null,
    }
  },

  computed: {
    currentTenantId () {
      return this.$store.getters['tenants/getCurrentTenantId']
    },

    isLoginPage () {
      return this.$route.name === 'login'
    },

    tenantOptions () {
      const tenants = this.$store.getters['tenants/getTenants']
      const options = []
      tenants.forEach(tenant => {
        const option = {
          id: tenant.id,
          name: tenant.name,
        }
        if (tenant.id === this.currentTenantId) {
          options.unshift(option)
        } else {
          options.push(option)
        }
      })
      return options
    },

    selectedTenantName () {
      const currentTenant = this.tenantOptions.find(tenant => tenant.id === this.selectedTenantId)
      return currentTenant ? currentTenant.name : ''
    },
  },

  watch: {
    currentTenantId () {
      this.selectedTenantId = this.currentTenantId
    },
  },

  mounted () {
    this.$store.dispatch('tenants/requestTenants')

    if (this.enableMultiTenant) {
      this.$router.addRoute('main', { path: '/tenants', name: 'tenants', component: () => import('pages/Tenants.vue') })
      this.selectedTenantId = this.currentTenantId
    }

    let allPages = [{
      pageName: 'users',
      pageTitle: 'ADMINPANELWEBCLIENT.HEADING_USERS_SETTINGS_TABNAME',
    }]

    const otherPages = modulesManager.getPages()
    if (typesUtils.isNonEmptyArray(otherPages)) {
      _.each(otherPages, (page) => {
        this.$router.addRoute('main', { path: page.pageName, name: page.pageName, component: page.component })
        allPages.push({
          pageName: page.pageName,
          pageTitle: page.pageTitle,
        })
      })
    }

    const pagesOrder = settings.getTabsBarOrder()
    allPages = _.sortBy(allPages, (page) => {
      const index = _.indexOf(pagesOrder, page.pageName)
      return index !== -1 ? index : pagesOrder.length
    })

    this.pages = allPages
  },

  methods: {
    changeTenant (id) {
      this.$store.commit('tenants/setCurrentTenantId', id)
    },
  },
}
</script>

<style lang="scss" scoped>
.tenants-dropdown {
  margin-left: -6px;
  margin-bottom: -1px;
}
</style>
