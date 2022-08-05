const substitute = (exports.substitute = (str, o) => {
  return (str + '').replace(
    /\\?\{\{\s*([^{}\s]+)\s*\}\}/g,
    function (match, name) {
      if (match.charAt(0) === '\\') {
        return match.slice(1)
      }
      return o[name] == null ? '' : o[name]
    },
  )
})

/**
 * 获取模型需要include的所有模型
 */
exports.getInclude = (Model, fields) => {
  const include = []

  for (let i in Model.associations) {
    const association = Model.associations[i]

    // 没有在fields就不需要
    if (fields.indexOf(i) === -1) {
      continue
    }

    include.push({
      model: association.target,
      as: association.as,
    })
  }

  return include
}

/**
 * 为关联的模型自动生成options
 */
exports.generateAssociationOptions = async (config, admin) => {
  const associations = config.Model.associations
  const adminConfig = config.admin

  for (let i in associations) {
    const association = associations[i]
    const target = association.target
    const targetConfig = admin.getConfig(target.name)

    if (!targetConfig) {
      continue
    }

    const targetItems = await target.findAll()
    adminConfig.associations[i].options = targetItems.map(item => {
      return {
        name: substitute(targetConfig.admin.format, item),
        value: item[targetConfig.admin.primaryKey.fieldName],
      }
    })
  }
}

/**
 * 分离model本身的参数和association的参数
 */
exports.separateParams = function (Model, params) {
  const attrParams = {}
  const associationParams = {}
  const attributes = Model.getAttributes()

  for (let i in params) {
    if (Model.associations[i]) {
      associationParams[i] = params[i]
    } else if (attributes[i]) {
      attrParams[i] = params[i]
    }
  }

  return {
    attrParams,
    associationParams,
  }
}
