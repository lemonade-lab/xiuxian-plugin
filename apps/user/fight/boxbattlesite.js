import { BotApi, GameApi, plugin, name, dsc, verify } from '../../../model/api/api.js'
export class BoxBattleSite extends plugin {
  constructor() {
    super({
      name,
      dsc,
      rule: [
        { reg: '^#击杀.*$', fnc: 'userKill' },
        { reg: '^#探索怪物$', fnc: 'userExploremonsters' }
      ]
    })
  }
  userKill = async (e) => {
    if (!verify(e)) return false
    if (!(await GameApi.GameUser.existUserSatus({ UID: e.user_id }))) {
      e.reply('已仙鹤')
      return false
    }
    const { MSG } = await GameApi.GamePublic.Go({ UID: e.user_id })
    if (MSG) {
      e.reply(MSG)
      return false
    }
    const UID = e.user_id
    const CDID = '10'
    const now_time = new Date().getTime()
    const cf = GameApi.DefsetUpdata.getConfig({
      app: 'parameter',
      name: 'cooling'
    })
    const CDTime = cf['CD']['Kill'] ? cf['CD']['Kill'] : 5
    const { CDMSG } = await GameApi.GamePublic.cooling({ UID, CDID })
    if (CDMSG) {
      e.reply(CDMSG)
      return false
    }
    const name = e.msg.replace('#击杀', '')
    const action = await GameApi.UserData.listAction({
      NAME: UID,
      CHOICE: 'user_action'
    })
    const monstersdata = await GameApi.GameMonster.monsterscache({
      i: action.region
    })
    const mon = monstersdata.find((item) => item.name == name)
    if (!mon) {
      e.reply(`这里没有[${name}],去别处看看吧`)
      return false
    }
    const acount = await GameApi.GameMonster.add({
      i: action.region,
      num: Number(1)
    })
    const msg = [`${UID}的[击杀结果]\n注:怪物每1小时刷新\n物品掉落率=怪物等级*5%`]
    const buff = {
      msg: 1
    }
    if (acount == 1) {
      buff.msg = Math.floor(Math.random() * (10 - 3)) + Number(3)
      msg.push('怪物突然变异了!')
    }
    const Levellist = await GameApi.UserData.listAction({
      NAME: 'gaspractice',
      CHOICE: 'generate_level'
    })
    const LevelMax = Levellist.find((item) => item.id == mon.level + 1)
    const monsters = {
      nowblood: LevelMax.blood * buff.msg,
      attack: LevelMax.attack * buff.msg,
      defense: LevelMax.defense * buff.msg,
      blood: LevelMax.blood * buff.msg,
      burst: LevelMax.burst + LevelMax.id * 5 * buff.msg,
      burstmax: LevelMax.burstmax + LevelMax.id * 10 * buff.msg,
      speed: LevelMax.speed + 5 + buff.msg
    }
    const battle = await GameApi.UserData.listAction({
      NAME: UID,
      CHOICE: 'user_battle'
    })
    const talent = await GameApi.UserData.listAction({
      NAME: UID,
      CHOICE: 'user_talent'
    })
    const mybuff = Math.floor(talent.talentsize / 100) + Number(1)
    const battle_msg = await GameApi.GameBattle.monsterbattle({
      e,
      battleA: battle,
      battleB: monsters
    })
    battle_msg.msg.forEach((item) => {
      msg.push(item)
    })
    if (battle_msg.QQ != 0) {
      const m = Math.floor(Math.random() * (100 - 1)) + Number(1)
      if (m < (mon.level + 1) * 6) {
        const randomthinf = await GameApi.GameUser.randomThing()
        let najie = await GameApi.UserData.listAction({
          NAME: UID,
          CHOICE: 'user_bag'
        })
        if (najie.thing.length <= najie.grade * 10) {
          await GameApi.GameUser.userBag({
            UID,
            name: randomthinf.name,
            ACCOUNT: randomthinf.acount
          })
          msg.push(`[${randomthinf.name}]*1`)
        } else {
          msg.push('储物袋已满')
        }
      }
      if (m < (mon.level + 1) * 7) {
        const SIZE = mon.level * 25 * mybuff
        msg.push(`[气血]*${SIZE}`)
        await GameApi.GameUser.updataUser({
          UID,
          CHOICE: 'user_level',
          ATTRIBUTE: 'experiencemax',
          SIZE
        })
      }
      if (m < (mon.level + 1) * 8) {
        const lingshi = await GameApi.GamePublic.leastOne({
          value: mon.level * 2
        })
        msg.push(`[上品灵石]*${lingshi}`)
        await GameApi.GameUser.userBag({
          UID,
          name: '上品灵石',
          ACCOUNT: lingshi
        })
      }
      if (m < (mon.level + 1) * 9) {
        const lingshi = await GameApi.GamePublic.leastOne({
          value: mon.level * 20
        })
        msg.push(`[中品灵石]*${lingshi}`)
        await GameApi.GameUser.userBag({
          UID,
          name: '中品灵石',
          ACCOUNT: lingshi
        })
      }
      if (m >= (mon.level + 1) * 9) {
        const lingshi = await GameApi.GamePublic.leastOne({
          value: mon.level * 200
        })
        msg.push(`[下品灵石]*${lingshi}`)
        await GameApi.GameUser.userBag({
          UID,
          name: '下品灵石',
          ACCOUNT: lingshi
        })
      }
    }
    GameApi.GamePublic.setRedis(UID, CDID, now_time, CDTime)
    BotApi.User.forwardMsg({ e, data: msg }).catch((err) => {
      e.reply('出错了')
      console.log('[err]', msg)
      console.log('[err]', err)
    })
    return false
  }
  userExploremonsters = async (e) => {
    if (!verify(e)) return false
    if (!(await GameApi.GameUser.existUserSatus({ UID: e.user_id }))) {
      e.reply('已仙鹤')
      return false
    }
    const { MSG } = await GameApi.GamePublic.GoMini({ UID: e.user_id })
    if (MSG) {
      e.reply(MSG)
      return false
    }
    const UID = e.user_id
    const action = await GameApi.UserData.listAction({
      NAME: UID,
      CHOICE: 'user_action'
    })
    const msg = []
    const monster = await GameApi.GameMonster.monsterscache({
      i: action.region
    })
    monster.forEach((item) => {
      msg.push('怪名:' + item.name + '\n' + '等级:' + item.level + '\n')
    })
    BotApi.User.forwardMsgSurveySet({ e, data: msg })
    return false
  }
}
