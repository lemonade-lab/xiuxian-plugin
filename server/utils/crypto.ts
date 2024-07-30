import { createHash } from 'crypto'
// import bcrypt from 'bcrypt'

/**
 * 密码在服务器这里也不可见
 * 防止数据库用户密码泄露
 * 密码仅能通过重置来获得新密码
 * 因此需要引入手机短信验证或者邮箱验证
 */

/**
 * 密码哈希化
 * @param password
 * @returns
 */
export const hashPassword = (password: string) => {
  // const saltRounds = Number(process.env?.APP_SALT_ROUNDS ?? 10);
  // const salt = bcrypt.genSaltSync(saltRounds); // 生成固定的盐值
  // return bcrypt.hashSync(password, salt);
  return createHash('sha256').update(password).digest('hex')
}

/**
 * 密码哈希化
 * @param password
 * @returns
 */
export const HASH = (msg: string) => {
  return createHash('sha256').update(msg).digest('hex')
}
