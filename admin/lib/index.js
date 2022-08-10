const { DataTypes } = require('sequelize')
const route = require('./route')
const adminUtil = require('./util')
const { attributeComponentMap, associationComponentMap } = require('./constants')

const defaultLogger = {
  info: msg => console.log(msg),
  error: msg => console.log(msg)
}

class Admin {
  constructor(options = {}) {
    this.data = []
    this.map = {}
    // 统一中间件
    this.middleware = options.middleware
    // 全局fields配置
    this.fields = options.fields || {}
    this.logger = options.logger || defaultLogger
    this.router = route(options.router, this)
  }

  // adminConfig是对前端展示的配置
  register(Model, adminConfig = {}) {
    adminConfig = this.normalizeConfig(Model, adminConfig)

    const key = Model.name
    const config = {
      Model,
      key,
      name: adminConfig.name || Model.options.name.plural,
      admin: adminConfig
    }

    this.data.push(config)
    this.map[key] = config
  }

  getAttributeComponent(attribute) {
    for (let t in attributeComponentMap) {
      const dataTypes = attributeComponentMap[t]
      for (let i = 0; i < dataTypes.length; i++) {
        if (attribute.type instanceof dataTypes[i]) {
          return t
        }
      }
    }

    return 'input'
  }

  getAttributes(Model, excludeFields = []) {
    const attributes = Model.getAttributes()
    const ret = {}

    for (let i in attributes) {
      const attribute = attributes[i]

      // 外键字段或者虚拟字段
      if (attribute.references || attribute.type instanceof DataTypes.VIRTUAL) {
        continue
      }

      // exclude
      if (excludeFields.includes(attribute.fieldName)) {
        continue
      }

      const item = {
        // createdAt这种自动生成的字段
        autoGenerated: attribute._autoGenerated,
        fieldName: attribute.fieldName,
        name: attribute.fieldName,
        component: this.getAttributeComponent(attribute),
        required: !(attribute.allowNull || attribute.defaultValue !== undefined),
      }

      if (attribute.defaultValue !== undefined) {
        item.defaultValue = attribute.defaultValue 
      }

      // DataTypes.ENUM
      if (attribute.values) {
        item.options = attribute.values.map(item => {
          return {
            name: item,
            value: item
          }
        })
      }

      ret[i] = item
    }

    return ret
  }

  /**
   * adminConfig需要序列化给前端
   */
  normalizeConfig(Model, adminConfig) {
    const { primaryKeyAttribute } = Model
    const attributes = this.getAttributes(Model, adminConfig.excludeFields || [])

    adminConfig = Object.assign({
      primaryKeyAttribute,
      primaryKeyAutoIncrement: Model.primaryKeys[primaryKeyAttribute].autoIncrement,
      // 如何展示一个对象
      format: `{{ ${primaryKeyAttribute} }}`,
      fields: {},
      listFields: Object.keys(attributes),
      filterFields: [],
      searchFields: [],
      associations: {}
    }, adminConfig)

    adminConfig.fields = this.normalizeFields(adminConfig.fields, attributes)
    return adminConfig
  }

  normalizeFields(fields, attributes) {
    const ret = {}

    for (let i in attributes) {
      const field = fields[i] || {}
      const fieldConfig = typeof field === 'string' ? { name: field } : field
      const attribute = Object.assign({}, attributes[i], this.fields[i] || {}, fieldConfig)

      if (typeof attribute.format === 'string') {
        attribute.format = {
          type: attribute.format
        }
      }

      if (attribute.options && attribute.options.length) {
        attribute.component = 'select'
      }

      ret[i] = attribute
    }

    return ret
  }

  async generateAssociationOptions(config) {
    const associations = config.Model.associations
    const ret = {}
  
    for (let i in associations) {
      const association = associations[i]
      const target = association.target
      const adminConfig = config.admin.associations[i]
      const targetConfig = this.getConfig(target.name)
  
      if (!targetConfig) {
        continue
      }

      if (adminConfig && adminConfig.visible === false) {
        continue
      }
  
      const targetRecords = await target.findAll()
      ret[i] = targetRecords.map(item => {
        return {
          name: adminUtil.substitute(targetConfig.admin.format, item),
          value: item[target.primaryKeyAttribute],
        }
      })
    }

    return ret
  }

  setup() {
    this.data.map(config => {
      const associations = config.Model.associations
      const adminConfig = config.admin

      for (let i in associations) {
        const association = associations[i]
        const { associationType, target } = association
        const targetConfig = this.getConfig(target.name)
        
        if (!targetConfig) {
          continue
        }
        
        adminConfig.associations[i] =  Object.assign({
          fieldName: i,
          type: associationType,
          component: associationComponentMap[associationType],
          name: targetConfig.name,
          primaryKeyAttribute: targetConfig.admin.primaryKeyAttribute,
          format: targetConfig.admin.format
        }, adminConfig.associations[i] || {})
      }
    })
  }

  getConfig(key) {
    return key ? this.map[key] : this.data
  }
}

module.exports = Admin
