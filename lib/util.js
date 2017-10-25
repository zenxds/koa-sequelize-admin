const defaults = require('lodash.defaults')

const substitute = exports.substitute = (str, o) => {
  return (str + '').replace(/\\?\{\{\s*([^{}\s]+)\s*\}\}/g, function (match, name) {
    if (match.charAt(0) === '\\') {
      return match.slice(1)
    }
    return (o[name] == null) ? '' : o[name]
  })
}

/**
 * 首字母大写
 */
const ucfirst = exports.ucfirst = str => {
  return str.charAt(0).toUpperCase() + str.substring(1)
}

/**
 * 获取模型的主键
 * 暂时只考虑单主键的情况
 */
exports.getPrimaryKey = Model => {
  const pk = Model.primaryKeys[Model.primaryKeyAttribute]

  return {
    fieldName: pk.fieldName,
    autoIncrement: pk.autoIncrement
  }
}

/**
 * 获取模型需要include的所有模型
 */
exports.getInclude = cfg => {
  const include = []

  for (let i in cfg.associations) {
    const association = cfg.associations[i]

    include.push({
      model: association.target,
      as: association.as
    })
  }

  return include
}

/**
 * 为关联的模型自动生成options
 */
exports.generateAssociationOptions = async(cfg, admin) => {
  const associations = cfg.associations
  const adminConfig = cfg.adminConfig

  for (let i in associations) {
    const association = associations[i]
    const target = association.target
    const targetCfg = admin.getConfig(target.name)
    const targetItems = await target.findAll()

    adminConfig.associations[i].options = targetItems.map(item => {
      return {
        key: substitute(targetCfg.adminConfig.format, item),
        value: item[target.primaryKeyAttribute]
      }
    })
  }
}

/**
 * input/select/textarea/editor/transfer/datetime
 * 
 * @param {any} attribute 
 * @param {any} DataTypes 
 * @returns 
 */
function getDefaultComponent(attribute, DataTypes) {
  let component = 'input'

  if (attribute.type instanceof DataTypes.TEXT) {
    component = 'textarea'
  }

  if (attribute.type instanceof DataTypes.DATE) {
    component = 'datetime'
  }

  return component
}

/**
 * list format
 * time/image/link/tooltip
 */
function getDefaultFormat(attribute, DataTypes) {
  let format = ''

  if (attribute.type instanceof DataTypes.DATE) {
    format = 'time'
  }

  if (attribute.type instanceof DataTypes.TEXT) {
    format = 'tooltip'
  }

  return format
}

/**
 * normalize meta info
 * defaultValue/helpMsg/required
 * component string
 * format string/{ type, ...}
 */
exports.normalizeMeta = (meta={}, attributes, DataTypes) => {
  for(let i in attributes) {
    const attribute = attributes[i]    
    const item = typeof meta[i] === 'string' ?  { name: meta[i] } : meta[i] || {}

    meta[i] = defaults(item, {
      name: i,
      component: getDefaultComponent(attribute, DataTypes),
      format: getDefaultFormat(attribute, DataTypes),      
      required: !attribute.allowNull,
      defaultValue: attribute.defaultValue,
      helpMsg: ''
    })

    if (typeof meta[i].format === 'string') {
      meta[i].format = {
        type: meta[i].format
      }
    }
  }

  return meta
}

exports.getAssociationAccessor = function(association) {
  const associationType = association.associationType
  const name = association.options.name

  if (/^(BelongsTo|HasOne)$/.test(associationType)) {
    return ucfirst(name.singular)
  }

  if (/^(BelongsToMany|HasMany)$/.test(associationType)) {
    return ucfirst(name.plural)
  }
}

/**
 * 分离model本身的参数和association的参数
 */
exports.separateParams = function(params, cfg) {
  const attrParams = {}
  const associationParams = {}

  for (let i in params) {
    if (cfg.associations[i]) {
      associationParams[i] = params[i]
    } else if (cfg.attributes[i]) {
      attrParams[i] = params[i]
    }
  }

  return {
    attrParams,
    associationParams
  }
}