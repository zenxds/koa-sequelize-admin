const { each, camelCase } = require('../utils')
const walk = require('../utils/walk')
const sequelize = require('../service/sequelize')
const adminService = require('../service/admin')

const models = {}
const files = walk(__dirname)

each(files, (file, key) => {
  models[camelCase(key, true)] = file(sequelize)
})

each(models, model => {
  if (model.associate) {
    model.associate(models)
  }
})

each(models, (model, key) => {
  if (key === 'Namespace') {
    // delete model.sequelize
    // delete model.options.sequelize

    // console.dir(model.associations)
    // console.dir(model.rawAttributes)
    // console.dir(model.primaryKeys)
    // console.dir(model.tableAttributes)
    
    // prop
    // primaryKeyAttribute/primaryKeyAttributes/autoIncrementAttribute
    // modelName默认大驼峰
    each(Object.keys(model), k => {
      // if (k.charAt(0) !== '_' && !/(sequelize|fieldRawAttributesMap|associations)/.test(k)) {
      //   console.log(k)
      //   console.dir(model[k])
      // }
    })
  }

  if (model.admin) {
    adminService.register(model, model.admin)
  }
})
adminService.setup()

sequelize.sync()

module.exports = models
