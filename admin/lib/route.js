const { Op } = require('sequelize')
const adminUtil = require('./util')

const defaultMiddleware = async (ctx, next) => {
  await next()
}

module.exports = (router, admin) => {
  const middleware = admin.middleware || defaultMiddleware
  const logger = admin.logger
  const modelCheck = async (ctx, next) => {
    const model = ctx.params.model

    if (!model) {
      return ctx.throw(400, 'model is required')
    }

    const config = admin.getConfig(model)
    if (!config) {
      return ctx.throw(403, 'model is not registered')
    }

    ctx.model = model
    ctx.Model = config.Model
    ctx.config = config
    await next()
  }

  router.get('/api/list/:model', modelCheck, middleware, async ctx => {
    const page = ctx.query.page ? parseInt(ctx.query.page) : 0
    const pageSize = parseInt(ctx.query.pageSize || 20)
    const { Model, config } = ctx
    const { orderField, orderDirection, includeAll } = ctx.query
    const filterFields = config.admin.filterFields.filter(
      item => ctx.query[item] !== undefined,
    )
    const searchFields = config.admin.searchFields.filter(
      item => ctx.query[item] !== undefined,
    )
    const include = adminUtil.getInclude(Model, {
      includeAll,
      keys: config.admin.listFields.concat(config.admin.filterFields),
    })
    const where = {}
    const order = []

    if (orderField) {
      order.push([orderField, orderDirection || 'ASC'])
    }

    try {
      filterFields.forEach(item => {
        const association = Model.associations[item]

        if (association) {
          const includeItem = include.find(
            item => item.model === association.target,
          )
          if (includeItem) {
            includeItem.where = {
              [association.target.primaryKeyAttribute]: ctx.query[item],
            }
          }
        } else {
          where[item] = ctx.query[item]
        }
      })

      searchFields.forEach(item => {
        where[item] = {
          [Op.like]: `%${ctx.query[item]}%`,
        }
      })
    } catch (err) {
      logger.error(err + '')
    }

    if (page) {
      const result = await Model.findAndCountAll({
        offset: (page - 1) * pageSize,
        limit: pageSize,
        include,
        where,
        order,
      })

      ctx.body = {
        success: true,
        data: {
          count: result.count,
          rows: result.rows,
        },
      }
    } else {
      const result = await Model.findAll({
        include,
        where,
        order,
      })

      ctx.body = {
        success: true,
        data: result,
      }
    }
  })

  router.get('/api/get/:model', modelCheck, middleware, async ctx => {
    const { Model } = ctx
    const include = adminUtil.getInclude(Model, { includeAll: true })
    const instance = await Model.findByPk(ctx.query.pk, {
      include,
    })

    ctx.body = {
      success: true,
      data: instance,
    }
  })

  router.post('/api/create/:model', modelCheck, middleware, async ctx => {
    const body = ctx.request.body
    const { Model } = ctx
    const { attrParams, associationParams } = adminUtil.separateParams(
      Model,
      body,
    )

    const t = await Model.sequelize.transaction()
    try {
      const instance = await Model.create(attrParams, {
        transaction: t,
      })

      for (let i in Model.associations) {
        const association = Model.associations[i]
        const value = associationParams[i]

        if (value === undefined) {
          continue
        }

        if (/^(BelongsTo|HasOne)$/.test(association.associationType)) {
          const target = await association.target.findByPk(value)
          await instance[association.accessors.set](target, {
            transaction: t,
          })
        }

        if (/^(HasMany|BelongsToMany)$/.test(association.associationType)) {
          const targets = await association.target.findAll({
            where: {
              [association.target.primaryKeyAttribute]: Array.isArray(value)
                ? value
                : value.split(','),
            },
          })
          await instance[association.accessors.set](targets, {
            transaction: t,
          })
        }
      }

      await t.commit()
      ctx.body = {
        success: true,
        data: instance,
      }
    } catch (err) {
      await t.rollback()
      ctx.body = {
        success: false,
        message: err + '',
      }

      logger.error(err + '')
    }
  })

  router.post('/api/edit/:model', modelCheck, middleware, async ctx => {
    const body = ctx.request.body
    const { Model } = ctx
    const { pk } = body
    const { attrParams, associationParams } = adminUtil.separateParams(
      Model,
      body,
    )

    const t = await Model.sequelize.transaction()
    try {
      const instance = await Model.findByPk(pk)
      await instance.update(attrParams, {
        transaction: t,
      })

      for (let i in Model.associations) {
        const association = Model.associations[i]
        const value = associationParams[i]

        if (value === undefined) {
          continue
        }

        if (/^(BelongsTo|HasOne)$/.test(association.associationType)) {
          const target = await association.target.findByPk(value)
          await instance[association.accessors.set](target, {
            transaction: t,
          })
        }

        if (/^(HasMany|BelongsToMany)$/.test(association.associationType)) {
          const targets = await association.target.findAll({
            where: {
              [association.target.primaryKeyAttribute]: Array.isArray(value)
                ? value
                : value.split(','),
            },
          })
          await instance[association.accessors.set](targets, {
            transaction: t,
          })
        }
      }

      await t.commit()
      ctx.body = {
        success: true,
        data: instance,
      }
    } catch (err) {
      await t.rollback()
      ctx.body = {
        success: false,
        message: err + '',
      }

      logger.error(err + '')
    }
  })

  router.post('/api/delete/:model', modelCheck, middleware, async ctx => {
    const body = ctx.request.body
    const { Model } = ctx

    try {
      const instance = await Model.findByPk(body.pk)

      // set association null
      // for (let i in Model.associations) {
      //   const association = Model.associations[i]
      //   await instance[association.accessors.set](null)
      // }

      await instance.destroy()

      ctx.body = {
        success: true,
      }
    } catch (err) {
      ctx.body = {
        success: false,
        message: err + '',
      }

      logger.error(err + '')
    }
  })

  /**
   * only to generate menu
   */
  router.get('/api/config', middleware, async ctx => {
    const config = admin.getConfig()

    ctx.body = {
      success: true,
      data: config.map(item => {
        return {
          key: item.key,
          name: item.name,
          admin: item.admin,
        }
      }),
    }
  })

  router.get('/api/config/:model', modelCheck, middleware, async ctx => {
    const { config } = ctx

    ctx.body = {
      success: true,
      data: {
        name: config.name,
        admin: config.admin,
        associationOptions: await admin.generateAssociationOptions(config),
      },
    }
  })

  return router
}
