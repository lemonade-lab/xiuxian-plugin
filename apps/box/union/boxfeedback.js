import { plugin } from '../../../model/api/index.js'
export class BoxFeedback extends plugin {
  constructor() {
    super({
      rule: [{ reg: /^(#|\/)联盟反馈$/, fnc: 'userFeedback' }]
    })
  }

  async substitution(e) {
    if (!this.verify(e)) return false
    e.reply(`
        [问题反馈]\n
        1.打开下方链接\n
        2.注册/登录gitee账号\n
        3.点击新建lssue\n
        4.填写标题与内容后创建\n
        <https://gitee.com/three-point-of-water/xiuxian-plugin/issues>
        `)
    return false
  }
}
