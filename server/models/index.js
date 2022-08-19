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

each(models, model => {
  if (model.admin) {
    adminService.register(model, model.admin)
  }
})
adminService.setup()

sequelize.sync()

module.exports = models
