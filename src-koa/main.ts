import Koa from 'koa'
import KoaStatic from 'koa-static'
import router from './router'
// new
const app = new Koa()
const PORT = 9090
// static
app.use(KoaStatic('resources'))
// routes
app.use(router.routes())
// listen
app.listen(PORT, () => {
  console.log('Server is running on port ' + PORT)
  console.log('http://localhost:' + PORT)
})
