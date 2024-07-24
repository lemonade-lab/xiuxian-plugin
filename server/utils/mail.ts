import { createTransport } from 'nodemailer'
export const Mail = createTransport({
  // 平台
  service: 'qq',
  // 账号密码
  auth: {
    user: '',
    pass: ''
  }
})
