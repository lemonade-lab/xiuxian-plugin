import { plugin } from '#xiuxian-api'
export class BoxMove extends plugin {
  constructor() {
    super({
      rule: [
        { reg: /^(#|\/)mapw$/, fnc: 'mapW' },
        { reg: /^(#|\/)mapa$/, fnc: 'mapA' },
        { reg: /^(#|\/)maps$/, fnc: 'mapS' },
        { reg: /^(#|\/)mapd$/, fnc: 'mapD' }
      ]
    })
  }

  /**
   * 前进
   */
  async mapW(e) {
    if (!super.verify(e)) return false
    e.reply('待世界升级')
    return false
  }

  /**
   * 向左移动
   */
  async mapA(e) {
    if (!super.verify(e)) return false
    e.reply('待世界升级')
    return false
  }

  /**
   * 后退
   */
  async mapS(e) {
    if (!super.verify(e)) return false
    e.reply('待世界升级')
    return false
  }

  /**
   * 向右移动
   */
  async mapD(e) {
    if (!super.verify(e)) return false
    e.reply('待世界升级')
    return false
  }

  /**
   * 走路消耗灵力（灵力？可能以后会影响元素攻击）
   * （走到半路发现灵力没了，被人打一架。没有法术攻击。。美滋滋）
   * 暴露啥了？
   *
   */

  /**
   * 不同的地点发送的概率事件是不一样的
   */

  /**
   * 不同境界走动的m是不一样的
   */

  /**
   *
   */
}
