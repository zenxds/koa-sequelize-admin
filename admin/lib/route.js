const { Op } = require("sequelize")
const adminUtil = require('./util')

const defaultMiddleware = async(ctx, next) => {
  await next()
}

module.exports = (router, admin) => {
  const middleware = admin.middleware || defaultMiddleware
  const modelCheck = async(ctx, next) => {
    const model = ctx.params.model
  
    if (!model) {
      return ctx.throw(400, 'model is required')
    }

    const config = admin.getConfig(model)
    if (!config) {
      return ctx.throw(400, 'model is not registered')
    }

    ctx.model = model
    ctx.Model = config.Model
    ctx.config = config
    await next()
  }

  router.get('/api/list/:model', modelCheck, middleware, async (ctx) => {
    const page = parseInt(ctx.query.page || 1)
    const pageSize = parseInt(ctx.query.pageSize || 20)
    const { Model, config } = ctx
    const include = adminUtil.getInclude(Model, config.admin.listFields)
    const where = {}
    const filterFields = config.admin.filterFields.filter(item => ctx.query[item] !== undefined)
    const searchFields = config.admin.searchFields.filter(item => ctx.query[item] !== undefined)

    try {
      filterFields.forEach(item => {
        const association = Model.associations[item]

        // 注意要在include里
        if (association) {
          // http://docs.sequelizejs.com/manual/tutorial/models-usage.html#eager-loading
          where['$' + `${item}.${association.target.primaryKeyAttribute}` + '$'] = ctx.query[item]
        } else {
          where[item] = ctx.query[item]
        }
      })

      searchFields.forEach(item => {
        where[item] = {
          [Op.like]: `%${ctx.query[item]}%`
        }
      })
    } catch (err) {
      console.log(err)
    }

    const result = await config.Model.findAndCountAll({
      offset: (page - 1) * pageSize,
      limit: pageSize,
      distinct: true,
      include: include,
      where: where,
    })

    ctx.body = {
      success: true,
      data: {
        count: result.count,
        rows: result.rows,
      },
    }
  })

  // router.get('/api/get', modelCheck, async (ctx) => {
  //   const { Model, cfg } = ctx
  //   const include = adminUtil.getInclude(cfg, cfg.adminConfig.fields)
  //   const instance = await cfg.Model.findByPk(ctx.query.pk, {
  //     include: include,
  //   })

  //   ctx.body = {
  //     success: true,
  //     data: instance,
  //   }
  // })

  router.post('/api/create/:model', modelCheck, middleware, async (ctx) => {
    const body = ctx.request.body
    const { Model } = ctx
    const { attrParams, associationParams } = adminUtil.separateParams(Model, body)

    try {
      const instance = await Model.create(attrParams)

      for (let i in Model.associations) {
        const association = Model.associations[i]
        const value = associationParams[i]

        if (value === undefined) {
          continue
        }

        if (/^(BelongsTo|HasOne)$/.test(association.associationType)) {
          const target = await association.target.findByPk(value)
          await instance[association.accessors.set](
            target,
          )
        }

        if (/^(HasMany|BelongsToMany)$/.test(association.associationType)) {
          const targets = await association.target.findAll({
            where: {
              [association.target.primaryKeyAttribute]: Array.isArray(value) ? value : value.split(','),
            },
          })
          await instance[association.accessors.set](
            targets,
          )
        }
      }

      ctx.body = {
        success: true,
        data: instance
      }
    } catch (err) {
      ctx.body = {
        success: false,
        message: err + '',
      }
    }
  })

  router.post('/api/edit/:model', modelCheck, middleware, async (ctx) => {
    const body = ctx.request.body
    const { Model } = ctx
    const { pk } = body
    const { attrParams, associationParams } = adminUtil.separateParams(Model, body)

    try {
      const instance = await Model.findByPk(pk)
      await instance.update(attrParams)

      for (let i in Model.associations) {
        const association = Model.associations[i]
        const value = associationParams[i]

        if (value === undefined) {
          continue
        }

        if (/^(BelongsTo|HasOne)$/.test(association.associationType)) {
          const target = await association.target.findByPk(value)
          await instance[association.accessors.set](
            target,
          )
        }

        if (/^(HasMany|BelongsToMany)$/.test(association.associationType)) {
          const targets = await association.target.findAll({
            where: {
              [association.target.primaryKeyAttribute]: Array.isArray(value) ? value : value.split(','),
            },
          })
          await instance[association.accessors.set](
            targets,
          )
        }
      }

      ctx.body = {
        success: true,
        data: instance
      }
    } catch (err) {
      ctx.body = {
        success: false,
        message: err + '',
      }
    }
  })

  router.post('/api/delete/:model', modelCheck, middleware, async (ctx) => {
    const body = ctx.request.body
    const { Model } = ctx
    
    try {
      const instance = await Model.findByPk(body.pk)

      // delete association
      for (let i in Model.associations) {
        const association = Model.associations[i]
        await instance[association.accessors.set](null)
      }

      await instance.destroy()

      ctx.body = {
        success: true,
      }
    } catch (err) {
      console.log(err)
      ctx.body = {
        success: false,
        message: err + '',
      }
    }
  })

  /**
   * only to generate menu
   */
  router.get('/api/config', middleware, async (ctx) => {
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

  router.get('/api/config/:model', modelCheck, middleware, async (ctx) => {
    const { config } = ctx
    await adminUtil.generateAssociationOptions(config, admin)

    ctx.body = {
      success: true,
      data: {
        name: config.name,
        admin: config.admin,
      },
    }
  })

  return router
}
