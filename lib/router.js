const Router = require('koa-router')
const adminUtil = require('./util')

module.exports = (admin) => {
  const validate = (params, ctx) => {
    const model = params.model

    if (!model) {
      ctx.body = {
        code: 400,
        msg: 'model is required'
      }
      return false
    }

    const cfg = admin.getConfig(model)
    if (!cfg) {
      ctx.body = {
        code: 404,
        msg: 'model is not registed'
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
    const include = adminUtil.getInclude(cfg)

    const result = await cfg.Model.findAndCountAll({
      offset: (p - 1) * n,
      limit: n,
      distinct: true,
      include: include
    })
    await adminUtil.generateOptions(cfg, admin)

    ctx.body = {
      code: 200,
      data: {
        adminConfig: cfg.adminConfig,
        total: result.count,
        list: result.rows.map(item => item.toJSON())
      }
    }
  })

  router.get('/api/get', async(ctx, next) => {
    const validated = validate(ctx.query, ctx)
    if (!validated) {
      return
    }

    const { model, cfg } = validated
    const include = adminUtil.getInclude(cfg)
    const instance = await cfg.Model.findById(ctx.query.pk, {
      include: include
    })

    ctx.body = {
      code: 200,
      data: instance.toJSON()
    }
  })

  router.post('/api/add', async(ctx, next) => {
    const body = ctx.request.body
    const validated = validate(body, ctx)
    if (!validated) {
      return
    }

    const { model, cfg } = validated
    delete body.model

    try {
      const instance = await cfg.Model.create(body)
    
      for (let i in cfg.associations) {
        const association = cfg.associations[i]
        if (body[i] && association.associationType === 'BelongsTo') {
          const target = await association.target.findById(body[i])
          await instance['set' + adminUtil.ucfirst(i)](target)
        }

        if (body[i] && association.associationType === 'BelongsToMany') {
          const targetPK = adminUtil.getPrimaryKey(association.target)
          const targets = await association.target.findAll({
            where: {
              [targetPK.k]: body[i]
            }
          })
          await instance['set' + adminUtil.ucfirst(i)](targets)
        }
      }
    } catch (e) {
      ctx.body = {
        code: 500,
        msg: e + ''
      }
      return
    }

    ctx.body = {
      code: 200
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
    adminUtil.deleteFields(body, cfg)

    try {      
      const instance = await cfg.Model.findById(pk)
      await instance.update(body)

      for (let i in cfg.associations) {
        const association = cfg.associations[i]
        if (body[i] && association.associationType === 'BelongsTo') {
          const target = await association.target.findById(body[i])
          await instance['set' + adminUtil.ucfirst(i)](target)
        }

        if (body[i] && association.associationType === 'BelongsToMany') {
          const targetPK = adminUtil.getPrimaryKey(association.target)
          const targets = await association.target.findAll({
            where: {
              [targetPK.k]: body[i].filter(item => !!item)
            }
          })
          await instance['set' + adminUtil.ucfirst(i)](targets)
        }
      }
    } catch (e) {
      ctx.body = {
        code: 500,
        msg: e + ''
      }
      return
    }

    ctx.body = {
      code: 200
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

      // delete belong association
      for (let i in cfg.associations) {
        const association = cfg.associations[i]
        if (/BelongsTo/.test(association.associationType)) {
          await instance['set' + adminUtil.ucfirst(i)](null)          
        }
      }

      await instance.destroy()
    } catch (e) {
      ctx.body = {
        code: 500,
        msg: e + ''
      }
      return
    }

    ctx.body = {
      code: 200
    }
  })

  /**
   * only to generate menu
   */
  router.get('/api/config', async(ctx, next) => {
    const cfg = admin.getConfig()

    ctx.body = {
      code: 200,
      data: cfg.map(item => {
        return {
          name: item.name,
          adminConfig: {
            displayName: item.adminConfig.displayName
          }
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
    await adminUtil.generateOptions(cfg, admin)

    ctx.body = {
      code: 200,
      data: {
        name: cfg.name,
        adminConfig: cfg.adminConfig
      }
    }
  })

  return router
}