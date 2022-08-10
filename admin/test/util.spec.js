const models = require('./models')
const utils = require('../lib/util')

test('util.getInclude', () => {
  const includes = utils.getInclude(models.User, ['tokens', 'roles'])
  expect(includes.length).toBe(2)
})

test('util.separateParams', () => {
  const { attrParams, associationParams } = utils.separateParams(models.User, {
    tokens: 1,
    roles: 1,
    username: 1,
    test: 1,
  })

  expect(Object.keys(attrParams).length).toBe(1)
  expect(Object.keys(associationParams).length).toBe(2)
})
