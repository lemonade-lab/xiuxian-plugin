import { GameApi, plugin } from '../../model/api/index.js'
export class BoxLevel extends plugin {
  constructor() {
    super({
      rule: [
        { reg: /^(#|\/)突破$/, fnc: 'levelUp' },
        { reg: /^(#|\/)破境$/, fnc: 'levelMaxUp' }
      ]
    })
  }

  async levelUp(e) {
    if (!this.verify(e)) return false
    const UID = e.user_id
    if (!GameApi.Player.getUserLifeSatus(UID)) {
      e.reply('已仙鹤')
      return false
    }
    levelUp(e, UID, 6, 0, 82)
    return false
  }

  async levelMaxUp(e) {
    if (!this.verify(e)) return false
    const UID = e.user_id
    if (!GameApi.Player.getUserLifeSatus(UID)) {
      e.reply('已仙鹤')
      return false
    }
    levelUp(e, UID, 7, 1, 68)
    return false
  }
}

/**
 * @param {消息对象} e
 * @param {编号} UID
 * @param {冷却} CDID
 * @param {境界} ID
 * @param {概率} p
 * @returns
 */
function levelUp(e, UID, CDID, ID, p) {
  const { state: coolingState, msg: coolingMsg } = GameApi.Burial.cooling(e.user_id, CDID)
  if (coolingState == 4001) {
    e.reply(coolingMsg)
    return false
  }
  const LevelMsg = GameApi.Levels.getMsg(UID, ID)
  // 取值范围 [1 68 ] 突破概率为 (realm-68)/100
  if (!GameApi.Method.isTrueInRange(1, p, p - LevelMsg.realm)) {
    // 设置突破冷却
    GameApi.Levels.setSpecial(UID, CDID)
    /** 随机顺序损失经验  */
    const keyArray = Object.keys(GameApi.Levels.CopywritingLevel)
    const randomKey = keyArray[Math.floor(Math.random() * keyArray.length)]
    const size = Math.floor(LevelMsg.experience / randomKey)
    GameApi.Levels.reduceExperience(UID, ID, size)
    e.reply(GameApi.Levels.getCopywriting(ID, randomKey, size))
    return false
  }
  const res = GameApi.Levels.enhanceRealm(UID, ID)
  const { msg } = res
  e.reply(msg)
  // 设置
  GameApi.Levels.setSpecial(UID, CDID)
  return false
}
