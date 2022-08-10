const { Sequelize } = require('sequelize')

const { each } = require('./utils')
const dbConfig = require('config').get('db')
const sequelize = new Sequelize(dbConfig)

const models = {}

models.User = require('./user')(sequelize)
models.Role = require('./role')(sequelize)
models.AuthToken = require('./authToken')(sequelize)

each(models, model => {
  if (model.associate) {
    model.associate(models)
  }
})

const { User, AuthToken } = models
User.addHook('afterCreate', 'generateAuthToken', (user) => {
  AuthToken.create({
    token: AuthToken.generate(),
    userId: user.id
  })
})

module.exports = models
