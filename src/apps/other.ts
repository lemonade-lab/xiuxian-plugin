import { Messages } from 'yunzai'

const message = new Messages('message.group')
message.use(
  async e => {
    const msg = [
      '\tversion:1.0.0',
      '更新内容：',
      '1.去除交易系统',
      '2.新增boss喵喵',
      '3.新增每日签到',
      '4.新增锻体，可增加攻击及防御',
      '5.新增连续采矿',
      '6.新增秘境探索'
    ]
    e.reply(msg.join('\n'))
  },
  [/^(#|\/)?全服更新公告$/]
)

export default message
