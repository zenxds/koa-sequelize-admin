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

exports.camelCase = (str, isBig) => {
  const ret = str
    .replace(/([a-z\d])([A-Z])/g, '$1-$2')
    .toLowerCase()
    .replace(/[-_][^-_]/g, function(match) {
      return match.charAt(1).toUpperCase()
    })

  return (
    (isBig ? ret.charAt(0).toUpperCase() : ret.charAt(0).toLowerCase()) +
    ret.slice(1)
  )
}

function unique(array) {
  return Array.from(new Set(array))
}

/**
 * 获取模型需要include的模型
 */
exports.getInclude = (Model, options={}) => {
  const include = []

  const { includeAll } = options
  const keys = unique(options.keys || [])

  for (let i in Model.associations) {
    const association = Model.associations[i]

    if (includeAll || keys.includes(i)) {
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
