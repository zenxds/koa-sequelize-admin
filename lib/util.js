const substitute = exports.substitute = (str, o) => {
  return (str + '').replace(/\\?\{\{\s*([^{}\s]+)\s*\}\}/g, function (match, name) {
    if (match.charAt(0) === '\\') {
      return match.slice(1)
    }
    return (o[name] == null) ? '' : o[name]
  })
}

/**
 * 转为驼峰写法
 */
exports.camelize = str => {
  return str.replace(/[-_][^-_]/g, function(match) {
    return match.charAt(1).toUpperCase()
  })
}

/**
 * 首字母大写
 */
exports.ucfirst = str => {
  return str.charAt(0).toUpperCase() + str.substring(1)
}

/**
 * 获取模型的主键
 * 暂时只考虑单主键的情况
 */
const getPrimaryKey = exports.getPrimaryKey = Model => {
  const pk = Object.keys(Model.primaryKeys)[0]

  return {
    k: pk,
    v: Model.primaryKeys[pk]
  }
}

/**
 * 删除参数中不能编辑的字段
 */
exports.deleteFields = (params, cfg) => {
  const attributes = cfg.adminConfig.attributes
  
  for (let i in attributes) {
    if (attributes[i].editable === false) {
      delete params[i]
    }
  }

  delete params.model
  delete params.pk
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
const defaultComponentType = {
  BelongsTo: 'select',
  BelongsToMany: 'transfer'
}
exports.generateOptions = async(cfg, admin) => {
  const attributes = cfg.adminConfig.attributes
  
  for (let i in cfg.associations) {
    const association = cfg.associations[i]
    const attribute = attributes[i]
    if (!attribute) {
      continue
    }

    const target = association.target
    const targetCfg = admin.getConfig(target.name)
    const targetPK = getPrimaryKey(target)
    const targetItems = await target.findAll()

    attribute.model = targetCfg.name
    attribute.foreignKey = association.foreignKey
    attribute.targetPK = targetPK.k
    attribute.format = targetCfg.adminConfig.format
    attribute.component = normalizeComponent(attribute.component || defaultComponentType[association.associationType])
    attribute.component.options =  targetItems.map(item => {
      return {
        key: substitute(targetCfg.adminConfig.format, item),
        value: item[targetPK.k]
      }
    })
  }
}

/**
 * 统一component为对象的写法
 */
function normalizeComponent(component) {
  if (typeof component === 'string') {
    component = {
      type: component
    }
  }

  return component || {}
}