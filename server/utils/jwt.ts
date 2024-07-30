import jwt from 'jsonwebtoken'

/**
 * *******
 * json web token
 * 并不能保证message泄露
 * 只能保证message是由服务器进行签名的有效信息
 * 我们可以通过message中的 id 来知道当前用户是谁
 * **********
 */

// 设置密钥
const secretKey = process.env.APP_SERVER_KEY ?? 'xiuxian-serve'

/**
 * 生成 JWT
 * @param payload
 * @returns
 */
export const generateToken = payload => {
  return jwt.sign(payload, secretKey, { expiresIn: '1h' })
}

/**
 * 验证 JWT
 * @param token
 * @returns
 */
export const verifyToken = (token: string) => {
  return jwt.verify(token, secretKey)
}

/**
 * 身份验证中间件
 * @param ctx
 * @param next
 */
export const authMiddleware = async (ctx, next) => {
  try {
    const token = ctx.headers.authorization
    ctx.state.user = verifyToken(token)
    await next()
  } catch (err) {
    ctx.status = 401
    ctx.body = { error: 'Invalid token' }
  }
}
