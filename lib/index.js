const router = require('./router')
const adminUtil = require('./util')

class Admin {
  constructor() {
    this._data = []
    this._map = {}
    this.router = router(this)
  }

  register(Model, adminConfig) {
    this.normalizeConfig(Model, adminConfig)

    // Model.options.getterMethods
    const item = {
      name: Model.name,
      options: Model.options,
      attributes: Model.attributes,
      associations: Model.associations,
      adminConfig: adminConfig,
      Model: Model      
    }

    this._data.push(item)
    this._map[item.name] = item
  }

  normalizeConfig(Model, adminConfig) {
    const primaryKey = adminUtil.getPrimaryKey(Model)
    adminConfig.primaryKey = {
      field: primaryKey.k,
      autoIncrement: primaryKey.v.autoIncrement
    }

    for(let i in adminConfig.attributes) {
      const attribute = adminConfig.attributes[i]
      if (typeof attribute === 'string') {
        adminConfig.attributes[i] = {
          displayName: attribute
        }
      }
    }
  }

  getConfig(name) {
    return name ? this._map[name] : this._data
  }
}

module.exports = Admin