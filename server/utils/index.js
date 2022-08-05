exports.each = (object, fn) => {
  let length = object.length

  if (length === +length) {
    for (let i = 0; i < length; i++) {
      if (fn(object[i], i, object) === false) {
        break
      }
    }
  } else {
    for (let i in object) {
      if (fn(object[i], i, object) === false) {
        break
      }
    }
  }
}

exports.camelCase = (str, isBig) => {
  const ret = str
    .replace(/([a-z\d])([A-Z])/g, '$1-$2')
    .toLowerCase()
    .replace(/[-_][^-_]/g, function (match) {
      return match.charAt(1).toUpperCase()
    })

  return (
    (isBig ? ret.charAt(0).toUpperCase() : ret.charAt(0).toLowerCase()) +
    ret.slice(1)
  )
}
