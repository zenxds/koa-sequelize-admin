const defaults = require('lodash.defaults')
const route = require('./route')
const adminUtil = require('./util')

/**
 * meta 元信息对象{}
 * 
 * fields         新增/编辑时展示的字段
 * exclude        不展示的字段
 * listFields     列表页展示的字段
 * listFilters    列表页的过滤字段
 * searchFields   列表页搜索字段
 * 
 * @class Admin
 */
class Admin {
  constructor() {
    this._data = []
    this._map = {}

    try {
      this.lib = require('sequelize')
    } catch (err) {
      if (err.code === 'MODULE_NOT_FOUND') {
        throw new Error('Please install sequelize package manually')
      }
      throw err
    }

    this.router = route(this)
  }

  /**
   * Model.tableName
   * Model.options
   * Model.associations  为了拿到不含association字段的attributes，延迟初始化associations
   * Model.attributes/rawAttributes(normalized attributes)
   * Model.primaryKeys/primaryKeyAttributes/primaryKeyAttribute/primaryKeyField
   * Model.underscored
   */
  register(Model, AdminConfig={}) {
    const adminConfig = AdminConfig.prototype ? new AdminConfig() : AdminConfig

    if (Model.primaryKeyAttributes.length > 1) {
      throw new Error('multiple primaryKeyAttributes is not support')
    }

    this.normalizeConfig(Model, adminConfig)

    const item = {
      key: Model.name,  // 标识Model的key
      name: adminConfig.name || Model.options.name.plural || Model.options.name.singular,
      attributes: Model.attributes,      
      options: Model.options,
      Model: Model,      
      adminConfig: adminConfig
    }

    this._data.push(item)
    this._map[item.key] = item
  }

  /**
   * 需要序列化给前端
   */
  normalizeConfig(Model, adminConfig) {
    // singular/plural
    adminConfig = defaults(adminConfig, {
      primaryKeyAttribute: Model.primaryKeyAttribute,      
      primaryKey: adminUtil.getPrimaryKey(Model),
      format: `{{ ${Model.primaryKeyAttribute} }}`,   // 如何展示一个对象
      listFilters: [],
      searchFields: [],
      exclude: ['createdAt', 'updatedAt'],
      meta: {},      
      associations: {}
    })

    adminUtil.normalizeMeta(adminConfig.meta, Model.attributes, this.lib.DataTypes)
    adminConfig.fields = (adminConfig.fields || Object.keys(Model.attributes)).filter(item => {
      return adminConfig.exclude.indexOf(item) === -1
    })
    adminConfig.listFields = adminConfig.listFields || adminConfig.fields
  }

  initAssociations() {
    const components = {
      'BelongsTo': 'select',      
      'BelongsToMany': 'transfer',
      'HasOne': 'select',
      'HasMany': 'transfer'
    }

    this._data.map(cfg => {
      const associations = cfg.associations = cfg.Model.associations
      const adminConfig = cfg.adminConfig

      for (let i in associations) {
        const association = associations[i]
        const target = association.target
        const targetCfg = this._map[target.name]

        adminConfig.associations[i] = {
          isAssociation: true,
          type: association.associationType,      
          key: targetCfg.key,      
          name: targetCfg.name,
          component: components[association.associationType],
          required: association.options.constraints,
          format: targetCfg.adminConfig.format,
          primaryKeyAttribute: target.primaryKeyAttribute
        }
      }

      adminConfig.associationFields = adminConfig.associationFields || Object.keys(associations)
    })
  }

  getConfig(key) {
    return key ? this._map[key] : this._data
  }
}

module.exports = new Admin()