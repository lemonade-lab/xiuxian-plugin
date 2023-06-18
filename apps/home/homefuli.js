import { BotApi, GameApi, HomeApi, plugin } from '../../model/api/index.js'
import fs from 'node:fs'
// 秋雨
export class Homefuli extends plugin {
  constructor() {
    super({
      rule: [
        {
          reg: /^(#|\/)发家园福利.*$/,
          fnc: 'Allfulihome'
        },
        {
          reg: /^(#|\/)发家园补偿.*$/,
          fnc: 'Fulihome'
        },
        {
          reg: /^(#|\/)发家园物品.*$/,
          fnc: 'zengsonghome'
        },
        {
          reg: /^(#|\/)发家园经验.*$/,
          fnc: 'zenjiagrjy'
        },
        {
          reg: /^(#|\/)扣除全体家园经验.*$/,
          fnc: 'kouchujy'
        },
        {
          reg: /^(#|\/)扣除家园经验.*$/,
          fnc: 'kouchugrjy'
        },
        {
          reg: /^(#|\/)扣除灵晶.*$/,
          fnc: 'kouchulj'
        }
      ]
    })
  }

  // #发家园福利
  async Allfulihome(e) {
    if (!this.verify(e)) return false
    if (!e.isMaster) return false
    let ls = e.msg.replace(/^(#|\/)发家园福利/, '')
    var pattern = /[0-9]+/
    var str = ls
    if (!pattern.test(str)) {
      e.reply(`错误福利`)
      return false
    }
    if (parseInt(ls) > 0) {
      ls = parseInt(ls)
    } else {
      ls = 100 // 没有输入正确数字或不是正数
    }
    let File = fs.readdirSync(HomeApi.__PATH.user_home)
    File = File.filter((file) => file.endsWith('.json'))
    let FileLength = File.length
    for (var i = 0; i < FileLength; i++) {
      let theQQ = File[i].replace('.json', '')
      HomeApi.GameUser.addDoge({ UID: theQQ, money: ls })
    }
    e.reply(`发放成功,目前共有${FileLength}个玩家,每人增加${ls}灵晶`)
    return false
  }

  // #发家园补偿
  async Fulihome(e) {
    // 不开放私聊功能
    if (!this.verify(e)) return false
    if (!e.isMaster) return false

    let doge = e.msg.replace(/^(#|\/)发家园补偿/, '')
    var pattern = /[0-9]+/
    var str = doge

    if (!pattern.test(str)) {
      e.reply(`错误福利`)
      return false
    }

    if (parseInt(doge) > 0) {
      doge = parseInt(doge)
    } else {
      doge = 100 // 没有输入正确数字或不是正数
    }
    const user = {
      A: e.user_id,
      C: 0,
      QQ: 0,
      p: Math.floor(Math.random() * (99 - 1) + 1)
    }
    user.B = BotApi.Robot.at({ e })
    if (!user.B) {
      return false
    }
    HomeApi.GameUser.addDoge({ UID: user.B, money: doge })
    e.reply(`【全服公告】 ${user.B} 获得${doge}灵晶的补偿`)
    return false
  }

  // #发家园物品
  async zengsonghome(e) {
    if (!this.verify(e)) return false
    if (!e.isMaster) return false
    // 对方
    const user = {
      A: e.user_id,
      C: 0,
      QQ: 0,
      p: Math.floor(Math.random() * (99 - 1) + 1)
    }
    user.B = BotApi.Robot.at({ e })
    if (!user.B) {
      return false
    }
    let thing = e.msg.replace(/^(#|\/)发家园物品/, '')
    let code = thing.split('*')
    let thingName = code[0] // 物品名字
    let acount = code[1] // 物品数量
    let quantity = GameApi.Method.leastOne(acount)
    let wupin = HomeApi.GameUser.homesearchThingName({
      name: thingName
    })
    if (wupin == undefined) {
      e.reply(`未找到此物品`)
      return false
    }
    let Warehouse = HomeApi.Listdata.controlActionInitial({
      CHOICE: 'user_Warehouse',
      NAME: user.B,
      INITIAL: []
    })
    Warehouse = HomeApi.GameUser.addDataThing({
      DATA: Warehouse,
      DATA1: wupin,
      quantity
    })
    HomeApi.Listdata.controlActionInitial({
      CHOICE: 'user_Warehouse',
      NAME: user.B,
      DATA: Warehouse,
      INITIAL: []
    })
    e.reply(`${user.B}已获得上天赠予数量为${quantity}的${thingName}`)
    return false
  }

  // #扣除全体家园经验
  async kouchujy(e) {
    if (!this.verify(e)) return false

    if (!e.isMaster) return false

    // 获取扣除经验
    let jy = e.msg.replace(/^(#|\/)扣除全体家园经验/, '')
    var pattern = /[0-9]+/
    var str = jy
    if (!pattern.test(str)) {
      e.reply(`错误福利`)
      return false
    }

    // 校验输入经验
    if (parseInt(jy) > 0) {
      jy = parseInt(jy)
    } else {
      jy = 100 // 没有输入正确数字或不是正数
    }
    let File = fs.readdirSync(HomeApi.__PATH.user_home)
    File = File.filter((file) => file.endsWith('.json'))
    let FileLength = File.length

    for (var i = 0; i < FileLength; i++) {
      let theQQ = File[i].replace('.json', '')
      HomeApi.GameUser.addHomeexperience({
        UID: theQQ,
        experience: -jy
      })
    }
    e.reply(`经验扣除成功,目前共有${FileLength}个玩家,每人减少${jy}家园经验`)
    return false
  }

  // #扣除家园经验
  async kouchugrjy(e) {
    if (!this.verify(e)) return false
    if (!e.isMaster) return false
    // 对方
    const user = {
      A: e.user_id,
      C: 0,
      QQ: 0,
      p: Math.floor(Math.random() * (99 - 1) + 1)
    }
    user.B = BotApi.Robot.at({ e })
    if (!user.B) {
      return false
    }
    let jy = e.msg.replace(/^(#|\/)扣除家园经验/, '')
    var pattern = /[0-9]+/
    var str = jy
    if (!pattern.test(str)) {
      e.reply(`错误福利`)
      return false
    }
    if (parseInt(jy) > 0) {
      jy = parseInt(jy)
    } else {
      jy = 100 // 没有输入正确数字或不是正数
    }
    HomeApi.GameUser.addHomeexperience({ UID: user.B, experience: -jy })
    e.reply(`经验扣除成功,${user.B}减少${jy}家园经验`)
    return false
  }

  // #发家园经验
  async zenjiagrjy(e) {
    if (!this.verify(e)) return false
    if (!e.isMaster) return false
    // 对方
    const user = {
      A: e.user_id,
      C: 0,
      QQ: 0,
      p: Math.floor(Math.random() * (99 - 1) + 1)
    }
    user.B = BotApi.Robot.at({ e })
    if (!user.B) {
      return false
    }
    let jy = e.msg.replace(/^(#|\/)发家园经验/, '')
    var pattern = /[0-9]+/
    var str = jy
    if (!pattern.test(str)) {
      e.reply(`错误福利`)
      return false
    }
    if (parseInt(jy) > 0) {
      jy = parseInt(jy)
    } else {
      jy = 100 // 没有输入正确数字或不是正数
    }
    HomeApi.GameUser.addHomeexperience({ UID: user.B, experience: jy })
    e.reply(`经验发放成功,${user.B}增加${jy}家园经验`)
    return false
  }

  // #扣除灵晶
  async kouchulj(e) {
    if (!this.verify(e)) return false
    if (!e.isMaster) return false
    let doge = e.msg.replace(/^(#|\/)扣除灵晶/, '')
    var pattern = /[0-9]+/
    var str = doge
    if (!pattern.test(str)) {
      e.reply(`错误福利`)
      return false
    }
    if (parseInt(doge) > 0) {
      doge = parseInt(doge)
    } else {
      doge = 100 // 没有输入正确数字或不是正数
    }
    let theQQ = BotApi.Robot.at({ e })
    HomeApi.GameUser.addDoge({ UID: theQQ, money: -doge })
    e.reply(`${theQQ}被管理员扣除 ${doge}灵晶`)
    return false
  }
}
