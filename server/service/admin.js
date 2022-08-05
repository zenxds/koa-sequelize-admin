const Router = require('@koa/router')
const router = new Router()

const Admin = require('../../admin')

module.exports = new Admin({
  router
})
