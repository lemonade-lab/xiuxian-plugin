import { BotApi, GameApi, plugin } from '../../../model/api/index.js'
export class BoxHome extends plugin {
  constructor() {
    super({
      rule: [
        { reg: /^(#|\/)服用[\u4e00-\u9fa5]*$/, fnc: 'take' },
        { reg: /^(#|\/)学习[\u4e00-\u9fa5]*$/, fnc: 'study' },
        { reg: /^(#|\/)忘掉[\u4e00-\u9fa5]*$/, fnc: 'forget' },
        { reg: /^(#|\/)消耗[\u4e00-\u9fa5]*$/, fnc: 'consumption' }
      ]
    })
  }
  take = async (e) => {
    if (!this.verify(e)) return false
    const UID = e.user_id
    if (!(await GameApi.GameUser.existUserSatus({ UID }))) {
      e.reply('已仙鹤')
      return false
    }
    let [thing_name, thing_acount] = e.msg.replace(/^(#|\/)服用/, '').split('*')
    thing_acount = await GameApi.GamePublic.leastOne({ value: thing_acount })
    const najie_thing = await GameApi.GameUser.userBagSearch({
      UID,
      name: thing_name
    })
    if (!najie_thing) {
      e.reply(`没有[${thing_name}]`)
      return false
    }
    if (najie_thing.acount < thing_acount) {
      e.reply('数量不足')
      return false
    }
    const id = najie_thing.id.split('-')
    let x = 0 //用于判断pa数组内是否存在id[0]
    let pa = [1, 2, 3, 4, 5, 6]
    for (let i = 0; i < pa.length; i++) {
      if (id[0] == pa[i]) {
        x = 1
      }
    }
    if (x != 1) {
      e.reply(`你看看${thing_name}，想想怎么吞都吞不下去吧`)
      return
    }
    switch (id[1]) {
      case '1': {
        let blood = parseInt(najie_thing.blood)
        await GameApi.GameUser.updataUserBlood({ UID, SIZE: Number(blood) })
        const battle = await GameApi.UserData.controlAction({
          NAME: UID,
          CHOICE: 'user_battle'
        })
        e.reply(
          `成功服用${thing_name}，当前血量为：${battle.nowblood}（${Math.trunc(
            (battle.nowblood / battle.blood) * 100
          )}%）`
        )
        break
      }
      case '2': {
        let experience = parseInt(najie_thing.experience)
        if (id[0] == '6') {
          if (thing_acount > 2200) {
            thing_acount = 2200
          }
          const cf = GameApi.DefsetUpdata.getConfig({
            app: 'parameter',
            name: 'cooling'
          })
          const CDTime = cf['CD']['Practice'] ? cf['CD']['Practice'] : 5
          const CDID = '12'
          const now_time = new Date().getTime()
          const { CDMSG } = await GameApi.GamePublic.cooling({ UID, CDID })
          if (CDMSG) {
            experience = 0
            e.reply(CDMSG)
          }
          GameApi.GamePublic.setRedis(UID, CDID, now_time, CDTime)
          const player = GameApi.UserData.controlAction({
            NAME: UID,
            CHOICE: 'user_level'
          })
          switch (id[2]) {
            case '1': {
              if (player.level_id >= 3) {
                experience = 0
              }
              break
            }
            case '2': {
              if (player.level_id >= 5) {
                experience = 0
              }
              break
            }
            case '3': {
              if (player.level_id >= 7) {
                experience = 0
              }
              break
            }
            case '4': {
              if (player.level_id >= 9) {
                experience = 0
              }
              break
            }
            default: {
            }
          }
        }
        if (experience > 0) {
          await GameApi.GameUser.updataUser({
            UID,
            CHOICE: 'user_level',
            ATTRIBUTE: 'experience',
            SIZE: thing_acount * experience
          })
        }
        e.reply(`[修为]+${thing_acount * experience}`)
        break
      }
      case '3': {
        let experiencemax = parseInt(najie_thing.experiencemax)
        await GameApi.GameUser.updataUser({
          UID,
          CHOICE: 'user_level',
          ATTRIBUTE: 'experiencemax',
          SIZE: thing_acount * experiencemax
        })
        e.reply(`[气血]+${thing_acount * experiencemax}`)
        break
      }
      default: {
      }
    }
    await GameApi.GameUser.userBag({
      UID,
      name: najie_thing.name,
      ACCOUNT: -thing_acount
    })
    return false
  }
  study = async (e) => {
    if (!this.verify(e)) return false
    const UID = e.user_id
    if (!(await GameApi.GameUser.existUserSatus({ UID }))) {
      e.reply('已仙鹤')
      return false
    }
    const thing_name = e.msg.replace(/^(#|\/)学习/, '')
    const najie_thing = await GameApi.GameUser.userBagSearch({
      UID,
      name: thing_name
    })
    if (!najie_thing) {
      e.reply(`没有[${thing_name}]`)
      return false
    }
    const id = najie_thing.id.split('-')
    if (id[0] != 5) {
      return false
    }
    const talent = await GameApi.UserData.controlAction({
      NAME: UID,
      CHOICE: 'user_talent'
    })
    const islearned = talent.AllSorcery.find((item) => item.id == najie_thing.id)
    if (islearned) {
      e.reply('学过了')
      return false
    }
    if (
      talent.AllSorcery.length >=
      GameApi.DefsetUpdata.getConfig({ app: 'parameter', name: 'cooling' }).myconfig.gongfa
    ) {
      e.reply('你反复看了又看,却怎么也学不进')
      return false
    }
    talent.AllSorcery.push(najie_thing)
    await GameApi.UserData.controlAction({
      NAME: UID,
      CHOICE: 'user_talent',
      DATA: talent
    })
    await GameApi.GameUser.updataUserEfficiency({ UID })
    await GameApi.GameUser.userBag({
      UID,
      name: najie_thing.name,
      ACCOUNT: -1
    })
    e.reply(`学习[${thing_name}]`)
    return false
  }
  forget = async (e) => {
    if (!this.verify(e)) return false
    const UID = e.user_id
    if (!(await GameApi.GameUser.existUserSatus({ UID }))) {
      e.reply('已仙鹤')
      return false
    }
    const thing_name = e.msg.replace(/^(#|\/)忘掉/, '')
    const talent = await GameApi.UserData.controlAction({
      NAME: UID,
      CHOICE: 'user_talent'
    })
    const islearned = talent.AllSorcery.find((item) => item.name == thing_name)
    if (!islearned) {
      e.reply(`没学过[${thing_name}]`)
      return false
    }
    talent.AllSorcery = talent.AllSorcery.filter((item) => item.name != thing_name)
    await GameApi.UserData.controlAction({
      NAME: UID,
      CHOICE: 'user_talent',
      DATA: talent
    })
    await GameApi.GameUser.updataUserEfficiency({ UID })
    await GameApi.GameUser.userBag({ UID, name: islearned.name, ACCOUNT: 1 })
    e.reply(`忘了[${thing_name}]`)
    return false
  }
  consumption = async (e) => {
    if (!this.verify(e)) return false
    const UID = e.user_id
    if (!(await GameApi.GameUser.existUserSatus({ UID }))) {
      e.reply('已仙鹤')
      return false
    }
    const thing_name = e.msg.replace(/^(#|\/)消耗/, '')
    const najie_thing = await GameApi.GameUser.userBagSearch({
      UID,
      name: thing_name
    })
    if (!najie_thing) {
      e.reply(`没有[${thing_name}]`)
      return false
    }
    await GameApi.GameUser.userBag({
      UID,
      name: najie_thing.name,
      ACCOUNT: -1
    })
    const id = najie_thing.id.split('-')
    if (id[0] != 6) {
      e.reply(`[${thing_name}]损坏`)
      return false
    }
    if (id[1] == 1) {
      switch (id[2]) {
        case '1': {
          const player = GameApi.UserData.controlAction({
            NAME: UID,
            CHOICE: 'user_level'
          })
          if (player.level_id >= 10) {
            e.reply('[灵根]已定\n此生不可再洗髓')
            break
          }
          const talent = await GameApi.UserData.controlAction({
            NAME: UID,
            CHOICE: 'user_talent'
          })
          talent.talent = await GameApi.GameUser.getTalent()
          await GameApi.UserData.controlAction({
            NAME: UID,
            CHOICE: 'user_talent',
            DATA: talent
          })
          await GameApi.GameUser.updataUserEfficiency({ UID })
          const { path, name, data } = await GameApi.Information.userDataShow({
            UID: e.user_id
          })
          const isreply = await e.reply(await BotApi.ImgIndex.showPuppeteer({ path, name, data }))
          await BotApi.User.surveySet({ e, isreply })
          break
        }
        case '2': {
          const talent = await GameApi.UserData.controlAction({
            NAME: UID,
            CHOICE: 'user_talent'
          })
          talent.talentshow = 0
          await GameApi.UserData.controlAction({
            NAME: UID,
            CHOICE: 'user_talent',
            DATA: talent
          })
          const { path, name, data } = await GameApi.Information.userDataShow({
            UID: e.user_id
          })
          const isreply = await e.reply(await BotApi.ImgIndex.showPuppeteer({ path, name, data }))
          await BotApi.User.surveySet({ e, isreply })
          break
        }
        default: {
        }
      }
    }
    return false
  }
}
