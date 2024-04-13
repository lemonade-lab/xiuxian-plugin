import koaRouter from 'koa-router'
// import { readFileSync, writeFileSync } from 'fs'
// import { join } from 'path'
import { generateToken } from '../utils/jwt'

const router = new koaRouter({ prefix: '/api' })

const username = '123456'
const password = '123456'

/**
 * 用户注册
 * x-wwww-from-urlencoded
 */
router.post('/logon', async (ctx) => {
  // 获取 POST 请求的 body 数据
  const body = ctx.request.body as {
    username: string
    password: string
  }
  console.log('body', body)
  /**
   * 拦截非法请求
   */
  if (!body || !body?.password || !body?.username) {
    ctx.body = {
      code: 4000,
      msg: '非法请求'
    }
    return
  }
  /**
   * 验证请求合法性
   */
  const { length: Ulength } = body.username.split('')
  const { length: Plength } = body.password.split('')
  if (Ulength < 6 || Ulength > 12 || Plength < 6 || Plength > 12) {
    ctx.body = {
      code: 4000,
      msg: '非法注册'
    }
    return
  }

  ctx.body = {
    code: 4000,
    msg: '暂不支持注册'
  }
})

/**
 * 用户登录
 * x-wwww-from-urlencoded
 */
router.post('/login', async (ctx) => {
  const body = ctx.request.body as {
    username: string
    password: string
  }
  console.log('body', body)
  /**
   * 拦截非法请求
   */
  if (!body || !body?.password || !body?.username) {
    ctx.body = {
      code: 4000,
      msg: '非法请求'
    }
    return
  }
  const res = {
    username,
    password
  }

  if (body.username == username && body.password) {
    // 发放token
    ctx.body = {
      code: 2000,
      msg: '登录成功',
      data: {
        token: generateToken(res)
      }
    }
  } else {
    ctx.body = {
      code: 4000,
      msg: '账号或密码错误',
      data: null
    }
  }
})

/**
 * 重置密码
 * x-wwww-from-urlencoded
 */
router.put('/password', async (ctx) => {
  /**
   * tudo
   * 不知道是保留邮箱还是手机验证模式
   */
  const body = ctx.request.body as {
    username: string
    mail: string
    phone: string
  }
  /**
   * 拦截非法请求
   */
  if (!body || !body?.mail || !body?.phone) {
    ctx.body = {
      code: 4000,
      msg: '非法请求'
    }
    return
  }
  ctx.body = {
    code: 2000,
    msg: '待生产'
  }
})

export default router
