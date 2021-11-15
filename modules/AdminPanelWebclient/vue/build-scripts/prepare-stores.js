const fs = require('fs')

function prepareStores() {
  const modulesPath = './src/../../../'
  const storesPaths = []
  const storesNames = []
  fs.readdirSync(modulesPath).forEach(moduleName => {
    let moduleStorePath = modulesPath + moduleName + '/vue/store'
    if (fs.existsSync(moduleStorePath)) {
      moduleStorePath = moduleStorePath.slice(2)
      const moduleStoreName = moduleName.toLowerCase().replace('webclient', '')
      storesNames.push(`    ${moduleStoreName},`)
      storesPaths.push(`import ${moduleStoreName} from '${moduleStorePath}'`)
    }
  })

  const dir = './src/store'
  if (fs.existsSync(dir)) {
    const paths = storesPaths.join('\n')
    const names = storesNames.join('\n')
    const storesContent =
      `import Vue from 'vue'
import Vuex from 'vuex'

import user from './user'
import main from './main'
import tenants from './tenants'
${paths}

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    main,
    user,
    tenants,
${names}
  },

  strict: process.env.DEV
})
`
    fs.writeFileSync(dir + '/index.js', storesContent)
  }
}

prepareStores()
