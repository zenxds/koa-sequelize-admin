exports.substitute = (str, o) => {
  return (str + '').replace(
    /\\?\{\{\s*([^{}\s]+)\s*\}\}/g,
    function (match, name) {
      if (match.charAt(0) === '\\') {
        return match.slice(1)
      }
      return o[name] == null ? '' : o[name]
    },
  )
}

function unique(array) {
  return Array.from(new Set(array))
}

/**
 * 根据fields获取模型需要include的模型
 */
exports.getInclude = (Model, fields) => {
  const include = []

  fields = unique(fields)

  for (let i in Model.associations) {
    const association = Model.associations[i]

    if (fields.includes(i)) {
      include.push({
        model: association.target,
        as: association.as,
      })
    }
  }

  return include
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
