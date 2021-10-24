<template>
  <div id="q-app">
    <router-view />
    <UnsavedChangesDialog ref="unsavedChangesDialog" />
  </div>
</template>
<script>
import Vue from 'vue'
import _ from 'lodash'

import UnsavedChangesDialog from 'src/components/UnsavedChangesDialog'

Vue.mixin({
  methods: {
    _getParentComponent: function (sComponentName) {
      let oComponent = null
      let oParent = this.$parent
      while (oParent && !oComponent) {
        if (oParent.$options.name === sComponentName) {
          oComponent = oParent
        }
        oParent = oParent.$parent
      }
      return oComponent
    },
    doBeforeRouteLeave: function (to, from, next) {
      const oAppComponent = this._getParentComponent('App')
      const oUnsavedChangesDialog = oAppComponent ? oAppComponent.$refs.unsavedChangesDialog : null

      if (_.isFunction(this.hasChanges) && this.hasChanges() && _.isFunction(oUnsavedChangesDialog?.openConfirmDiscardChangesDialog)) {
        oUnsavedChangesDialog.openConfirmDiscardChangesDialog(() => {
          if (this.revertChanges) {
            this.revertChanges()
          }
          next()
        })
      } else {
        next()
      }
    },
  }
})

export default {
  name: 'App',

  components: {
    UnsavedChangesDialog,
  },

  data() {
    return {
    }
  },

  meta () {
    return {
      title: this.siteName
    }
  },

  mounted () {
    this.setRoute()
  },

  computed: {
    isUserSuperAdmin: function () {
      return this.$store.getters['user/isUserSuperAdmin']
    },
    siteName: function () {
      return this.$store.getters['main/getSiteName']
    },
  },

  watch: {
    isUserSuperAdmin: function () {
      this.setRoute()
    },
  },

  methods: {
    setRoute () {
      const currentPath = this.$router.currentRoute && this.$router.currentRoute.path ? this.$router.currentRoute.path : ''
      const newPath = this.isUserSuperAdmin ? '/system' : '/'
      if (currentPath !== newPath) {
        this.$router.push({ path: newPath })
      }
    }
  }
}
</script>
