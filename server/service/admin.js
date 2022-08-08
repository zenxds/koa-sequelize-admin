const Router = require('@koa/router')
const router = new Router()

const Admin = require('../../admin')

module.exports = new Admin({
  router,
  fields: {
    createdAt: {
      name: '创建时间'
    },
    updatedAt: {
      name: '更新时间'
    }
  }
})
