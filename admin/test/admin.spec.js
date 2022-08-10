const Router = require('@koa/router')
const router = new Router()

const Admin = require('../lib')
const admin = new Admin({
  router,
  fields: {
    createdAt: {
      name: '创建时间'
    }
  }
})

const models = require('./models')

test('admin.register', () => {
  expect(admin.getConfig().length).toBe(0)

  admin.register(models.User, { name: '用户' })
  expect(admin.getConfig().length).toBe(1)
})

test('admin.getAttributes', () => {
  let attributes = admin.getAttributes(models.User)
  expect(Object.keys(attributes).length).toBe(8)

  attributes = admin.getAttributes(models.User, ['username'])
  expect(Object.keys(attributes).length).toBe(7)
})

test('admin.normalizeFields', () => {
  const attributes = admin.getAttributes(models.User)
  const normalized = admin.normalizeFields({
    username: '用户名',
    email: {
      format: 'tooltip',
      options: [
        {
          name: 'a.com',
          value: 'a.com'
        }
      ]
    },

    notExistField: '不存在的字段'
  }, attributes)

  expect(normalized.username.name).toBe('用户名')
  expect(normalized.username.fieldName).toBe('username')
  expect(normalized.username.required).toBeTruthy()
  expect(normalized.username.component).toBe('input')

  expect(normalized.createdAt.name).toBe('创建时间')

  expect(normalized.email.format.type).toBe('tooltip')
  expect(normalized.email.component).toBe('select')
  expect(normalized.notExistField).toBe(undefined)
})

