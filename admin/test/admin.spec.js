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

const models = require('../../server/models')

test('admin.register', () => {
  expect(admin.getConfig().length).toBe(0)

  admin.register(models.Project, { name: '项目' })
  expect(admin.getConfig().length).toBe(1)
})

test('admin.getAttributes', () => {
  let attributes = admin.getAttributes(models.Project)
  expect(Object.keys(attributes).length).toBe(5)

  attributes = admin.getAttributes(models.Project, ['name'])
  expect(Object.keys(attributes).length).toBe(4)
})

test('admin.normalizeFields', () => {
  const attributes = admin.getAttributes(models.Project)
  const normalized = admin.normalizeFields({
    name: '名称',
    description: {
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

  expect(normalized.name.name).toBe('名称')
  expect(normalized.name.fieldName).toBe('name')
  expect(normalized.name.required).toBeTruthy()
  expect(normalized.name.component).toBe('input')

  expect(normalized.createdAt.name).toBe('创建时间')

  expect(normalized.description.format.type).toBe('tooltip')
  expect(normalized.description.component).toBe('select')
  expect(normalized.notExistField).toBe(undefined)
})

