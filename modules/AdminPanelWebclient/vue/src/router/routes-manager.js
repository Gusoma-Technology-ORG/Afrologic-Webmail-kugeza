import modulesManager from 'src/modules-manager'

import EditUser from 'src/components/EditUser'
import Empty from 'src/components/Empty'

let isInitialized = false

export default {
  initRoutes (router) {
    if (!isInitialized) {
      this.addUserRoutes(router)
      this.addUserFiltersRoutes(router)
      isInitialized = true
    }
  },

  addUserRoutes (router, filterRoutePart = '') {
    if (filterRoutePart === '') {
      router.addRoute('users', { path: 'create', component: EditUser })
    }
    router.addRoute('users', { path: filterRoutePart + 'create', component: EditUser })
    router.addRoute('users', { path: filterRoutePart + 'id/:id', component: EditUser })
    router.addRoute('users', { path: filterRoutePart + 'search/:search', component: Empty })
    router.addRoute('users', { path: filterRoutePart + 'search/:search/id/:id', component: EditUser })
    router.addRoute('users', { path: filterRoutePart + 'page/:page', component: Empty })
    router.addRoute('users', { path: filterRoutePart + 'page/:page/id/:id', component: EditUser })
    router.addRoute('users', { path: filterRoutePart + 'search/:search/page/:page', component: Empty })
    router.addRoute('users', { path: filterRoutePart + 'search/:search/page/:page/id/:id', component: EditUser })
  },

  async addUserFiltersRoutes (router) {
    const filters = await modulesManager.getFiltersForUsers()
    filters.forEach(filterComponent => {
      router.addRoute('users', { path: filterComponent.filterRoute, component: Empty })
      this.addUserRoutes(router, filterComponent.filterRoute + '/')
    })
    if (filters.length > 1) {
      filters.forEach(filterComponent1 => {
        filters.forEach(filterComponent2 => {
          if (filterComponent1.filterRoute !== filterComponent2.filterRoute) {
            const path = filterComponent1.filterRoute + '/' + filterComponent2.filterRoute
            router.addRoute('users', { path, component: Empty })
            this.addUserRoutes(router, path + '/')
          }
        })
      })
    }
    // TODO: if there are more than 2 filters
  },
}
