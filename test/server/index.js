const path = require('path')
const Koa = require('koa')
const app = new Koa()
const koaStatic = require('koa-static')
const views = require('koa-views')
const router = require('koa-router')()
const bodyParser = require('koa-bodyparser')

const admin = require('../..')
require('./models')

const viewsPath = path.join(__dirname, 'views')
const staticPath = path.join(__dirname, '../../dist')

app.use(bodyParser())
app.use(views(viewsPath, {
  map: {
    html: 'nunjucks'
  },
  extension: 'html',
  options: {}
}))

router.get('/admin', async(ctx, next) => {
  await ctx.render('admin')
})
router.use('/admin', admin.router.routes())

app.use(router.routes())
app.listen(3000)