const path = require('path')
const Koa = require('koa')
const config = require('config')
const views = require('koa-views')
const Router = require('@koa/router')


const app = new Koa()
const router = new Router()
const viewsPath = path.join(__dirname, 'views')

const adminService = require('./service/admin')

require('./models')

app.use(
  require('koa-body')({
    formLimit: '100mb',
  }),
)
app.use(require('koa-static')(path.join(__dirname, '../client/data')))
app.use(views(viewsPath, {
  map: {
    html: 'nunjucks'
  },
  extension: 'html',
  options: {}
}))

app.use(async (ctx, next) => {
  ctx.state = {
    isProduction: config.get('isProduction'),
    staticServer: config.get('staticServer'),
    staticVersion: config.get('staticVersion')
  }
  await next()
})
router.get('/admin', async(ctx, next) => {
  await ctx.render('admin')
})
router.use('/admin', adminService.router.routes())

app.use(router.routes())
app.listen(config.get('port'), function () {
  console.log(`server is running on port ${this.address().port}`)
})