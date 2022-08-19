const models = require('../../server/models')
const utils = require('../lib/util')

test('util.getInclude', () => {
  const includes = utils.getInclude(models.Project, {
    keys: ['spaces']
  })
  expect(includes.length).toBe(1)
})

test('util.separateParams', () => {
  const { attrParams, associationParams } = utils.separateParams(models.Project, {
    name: 1,
    description: 1,
    spaces: 1,
  })

  expect(Object.keys(attrParams).length).toBe(2)
  expect(Object.keys(associationParams).length).toBe(1)
})
