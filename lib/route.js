const Router = require('koa-router')
const adminUtil = require('./util')

module.exports = (admin) => {
  const validate = (params, ctx) => {
    const model = params.model

    if (!model) {
      ctx.body = {
        success: false,
        message: 'model is required'
      }
      return false
    }

    const cfg = admin.getConfig(model)
    if (!cfg) {
      ctx.body = {
        success: false,
        message: 'model is not registed'
      }
      return false
    }

    return {
      model,
      cfg
    }
  }

  const router = new Router()

  router.get('/api/list', async(ctx, next) => {
    const validated = validate(ctx.query, ctx)
    if (!validated) {
      return
    }

    const p = parseInt(ctx.query.p || 1)
    const n = parseInt(ctx.query.n || 20)
    const { model, cfg } = validated
    const include = adminUtil.getInclude(cfg, cfg.adminConfig.listFields)
    const where = {}

    try {
      const filters = JSON.parse(ctx.query.filters)
      for (let i in filters) {
        if (cfg.associations[i]) {
          const association = cfg.associations[i]
          // http://docs.sequelizejs.com/manual/tutorial/models-usage.html#eager-loading
          where['$' + `${i}.${association.target.primaryKeyAttribute}` + '$'] = filters[i]
        } else {
          where[i] = filters[i]          
        }
      }

      if (ctx.query.searchK) {
        const Op = admin.lib.Op
        
        where['$or'] = cfg.adminConfig.searchFields.map(field => {
          return {
            [field]: {
              '$like': `%${ctx.query.searchK}%`
            }
          }
        })
      }
    } catch(e) {}

    const result = await cfg.Model.findAndCountAll({
      offset: (p - 1) * n,
      limit: n,
      distinct: true,
      include: include,
      where: where
    })
    await adminUtil.generateAssociationOptions(cfg, admin)

    ctx.body = {
      success: true,
      data: {
        adminConfig: cfg.adminConfig,
        count: result.count,
        rows: result.rows
      }
    }
  })

  router.get('/api/get', async(ctx, next) => {
    const validated = validate(ctx.query, ctx)
    if (!validated) {
      return
    }

    const { model, cfg } = validated
    const include = adminUtil.getInclude(cfg, cfg.adminConfig.fields)
    const instance = await cfg.Model.findById(ctx.query.pk, {
      include: include
    })

    ctx.body = {
      success: true,
      data: instance
    }
  })

  router.post('/api/add', async(ctx, next) => {
    const body = ctx.request.body
    const validated = validate(body, ctx)
    if (!validated) {
      return
    }

    const { model, cfg } = validated
    const { attrParams, associationParams } = adminUtil.separateParams(body, cfg)

    try {
      const instance = await cfg.Model.create(attrParams)
    
      for (let i in cfg.associations) {
        const association = cfg.associations[i]
        if (!associationParams[i]) {
          continue
        }

        if (/^(BelongsTo|HasOne)$/.test(association.associationType)) {
          const target = await association.target.findById(associationParams[i])
          await instance['set' + adminUtil.getAssociationAccessor(association)](target)
        }

        if (/^(HasMany|BelongsToMany)$/.test(association.associationType)) {
          const targets = await association.target.findAll({
            where: {
              [association.target.primaryKeyAttribute]: associationParams[i]
            }
          })
          await instance['set' + adminUtil.getAssociationAccessor(association)](targets)
        }
      }
    } catch(err) {
      ctx.body = {
        success: false,
        message: err + ''
      }
      return
    }

    ctx.body = {
      success: true
    }
  })

  router.post('/api/edit', async(ctx, next) => {
    const body = ctx.request.body
    const validated = validate(body, ctx)
    if (!validated) {
      return
    }

    const { model, cfg } = validated
    const { pk } = body  
    const { attrParams, associationParams } = adminUtil.separateParams(body, cfg)

    try {      
      const instance = await cfg.Model.findById(pk)
      await instance.update(attrParams)

      for (let i in cfg.associations) {
        const association = cfg.associations[i]
        if (!associationParams[i]) {
          continue
        }

        if (/^(BelongsTo|HasOne)$/.test(association.associationType)) {
          const target = await association.target.findById(associationParams[i])
          await instance['set' + adminUtil.getAssociationAccessor(association)](target)
        }

        if (/^(HasMany|BelongsToMany)$/.test(association.associationType)) {
          const targets = await association.target.findAll({
            where: {
              [association.target.primaryKeyAttribute]: associationParams[i]
            }
          })
          await instance['set' + adminUtil.getAssociationAccessor(association)](targets)
        }
      }
    } catch(err) {
      ctx.body = {
        success: false,
        message: err + ''
      }
      return
    }

    ctx.body = {
      success: true
    }
  })

  router.post('/api/delete', async(ctx, next) => {
    const body = ctx.request.body
    const validated = validate(body, ctx)
    if (!validated) {
      return
    }

    const { model, cfg } = validated
    try {
      const instance = await cfg.Model.findById(body.pk)

      // delete association
      for (let i in cfg.associations) {
        const association = cfg.associations[i]

        await instance['set' + adminUtil.getAssociationAccessor(association)](null)
      }

      await instance.destroy()
    } catch(err) {
      ctx.body = {
        success: false,
        message: err + ''
      }
      return
    }

    ctx.body = {
      success: true
    }
  })

  /**
   * only to generate menu
   */
  router.get('/api/config', async(ctx, next) => {
    const cfg = admin.getConfig()

    ctx.body = {
      success: true,
      data: cfg.map(item => {
        return {
          key: item.key,
          name: item.name,
          adminConfig: item.adminConfig
        }
      })
    }
  })

  router.get('/api/config/:model', async(ctx, next) => {
    const validated = validate(ctx.params, ctx)
    if (!validated) {
      return
    }

    const { model, cfg } = validated
    await adminUtil.generateAssociationOptions(cfg, admin)

    ctx.body = {
      success: true,
      data: {
        name: cfg.name,
        adminConfig: cfg.adminConfig
      }
    }
  })

  return router
}