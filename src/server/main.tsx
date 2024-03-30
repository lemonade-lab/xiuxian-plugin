import { renderToString } from 'react-dom/server'
import Koa from 'koa'
import KoaStatic from 'koa-static'
import Router from 'koa-router'
import { routes } from './routes'
// new
const app = new Koa()
const router = new Router()
const PORT = 8080
// for all component
for (const item of routes) {
  router.get(item.url, (ctx) => {
    const html = renderToString(item.element)
    ctx.body = `<!DOCTYPE html>${html}`
  })
}
// static
app.use(KoaStatic('resources'))
// routes
app.use(router.routes())
// listen 800
app.listen(PORT, () => {
  console.log('Server is running on port ' + PORT)
  console.log('http://localhost:' + PORT)
})
