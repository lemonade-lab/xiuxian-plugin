import koaRouter from 'koa-router'
import { verifyToken } from '../utils/jwt.js'
const router = new koaRouter({ prefix: '/api/test' })
/**
 * 获取玩家最新操作记录
 */
router.get('/jwt', async (ctx) => {
  // 获取 GET 请求的 query 数据
  ctx.body = {
    code: 200,
    msg: '请求成功',
    data: {
      user: ctx.state.user,
      query: ctx.request.query
    }
  }
})
/**
 * 校验token并得到ws-url
 */
router.get('/geteway', async (ctx) => {
  try {
    const token = ctx.headers.authorization
    ctx.state.user = verifyToken(token)
  } catch (err) {
    console.log('ctx.status', '400')
    ctx.status = 401
    ctx.body = { error: 'Invalid token' }
    return
  }
  // 返回url
  ctx.body = {
    code: 200,
    msg: '请求成功',
    data: {
      url: 'ws:127.0.0.1:8000/ws'
    }
  }
})
export default router
