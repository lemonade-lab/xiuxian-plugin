import { BotApi, GameApi, HomeApi, plugin } from '../../model/api/index.js'
import fs from 'node:fs'
export class homefuli extends plugin {
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
  //#发家园福利
  Allfulihome = async (e) => {
    if (!e.isGroup || e.user_id == 80000000) return false
    const { whitecrowd, blackid } = await GameApi.DefsetUpdata.getConfig({
      app: 'parameter',
      name: 'namelist'
    })
    if (whitecrowd.indexOf(e.group_id) == -1) return false
    if (blackid.indexOf(e.user_id) != -1) return false
    if (!e.isMaster) {
      e.reply(`你不是主人哦!`)
      return
    }

    let ls = e.msg.replace(/^(#|\/)发家园福利/, '')
    var pattern = new RegExp('[0-9]+')
    var str = ls
    if (!pattern.test(str)) {
      e.reply(`错误福利`)
      return
    }
    if (parseInt(ls) == parseInt(ls) && parseInt(ls) > 0) {
      ls = parseInt(ls)
    } else {
      ls = 100 //没有输入正确数字或不是正数
    }
    let File = fs.readdirSync(HomeApi.__PATH.user_home)
    File = File.filter((file) => file.endsWith('.json'))
    let File_length = File.length
    for (var i = 0; i < File_length; i++) {
      let this_qq = File[i].replace('.json', '')
      await HomeApi.GameUser.Add_doge({ UID: this_qq, money: ls })
    }
    e.reply(`发放成功,目前共有${File_length}个玩家,每人增加${ls}灵晶`)
    return
  }
  //#发家园补偿
  async Fulihome(e) {
    //不开放私聊功能
    if (!e.isGroup || e.user_id == 80000000) return false
    const { whitecrowd, blackid } = await GameApi.DefsetUpdata.getConfig({
      app: 'parameter',
      name: 'namelist'
    })
    if (whitecrowd.indexOf(e.group_id) == -1) return false
    if (blackid.indexOf(e.user_id) != -1) return false
    if (!e.isMaster) {
      e.reply(`你不是主人哦!`)
      return
    }

    let doge = e.msg.replace(/^(#|\/)发家园补偿/, '')
    var pattern = new RegExp('[0-9]+')
    var str = doge

    if (!pattern.test(str)) {
      e.reply(`错误福利`)
      return
    }

    if (parseInt(doge) == parseInt(doge) && parseInt(doge) > 0) {
      doge = parseInt(doge)
    } else {
      doge = 100 //没有输入正确数字或不是正数
    }
    const user = {
      A: e.user_id,
      C: 0,
      QQ: 0,
      p: Math.floor(Math.random() * (99 - 1) + 1)
    }
    user['B'] = await BotApi.User.at({ e })
    if (!user['B']) {
      return
    }
    await HomeApi.GameUser.Add_doge({ UID: user.B, money: doge })
    e.reply(`【全服公告】 ${user.B} 获得${doge}灵晶的补偿`)
    return
  }
  //#发家园物品
  async zengsonghome(e) {
    if (!e.isGroup || e.user_id == 80000000) return false
    const { whitecrowd, blackid } = await GameApi.DefsetUpdata.getConfig({
      app: 'parameter',
      name: 'namelist'
    })
    if (whitecrowd.indexOf(e.group_id) == -1) return false
    if (blackid.indexOf(e.user_id) != -1) return false
    if (!e.isMaster) {
      e.reply(`你不是主人哦!`)
      return
    }
    //对方
    const user = {
      A: e.user_id,
      C: 0,
      QQ: 0,
      p: Math.floor(Math.random() * (99 - 1) + 1)
    }
    user['B'] = await BotApi.User.at({ e })
    if (!user['B']) {
      return
    }
    let thing = e.msg.replace(/^(#|\/)发家园物品/, '')
    let code = thing.split('*')
    let thing_name = code[0] //物品名字
    let acount = code[1] //物品数量
    let quantity = await GameApi.GamePublic.leastOne({ value: acount })
    let wupin = await HomeApi.GameUser.homesearch_thing_name({
      name: thing_name
    })
    if (wupin == undefined) {
      e.reply(`未找到此物品`)
      return
    }
    let Warehouse = await HomeApi.Listdata.listActionArr({
      CHOICE: 'user_Warehouse',
      NAME: user.B
    })
    Warehouse = await HomeApi.GameUser.Add_DATA_thing({
      DATA: Warehouse,
      DATA1: wupin,
      quantity
    })
    await HomeApi.Listdata.listActionArr({
      CHOICE: 'user_Warehouse',
      NAME: user.B,
      DATA: Warehouse
    })
    e.reply(`${user.B}已获得上天赠予数量为${quantity}的${thing_name}`)
    return
  }
  //#扣除全体家园经验
  kouchujy = async (e) => {
    if (!e.isGroup || e.user_id == 80000000) return false
    const { whitecrowd, blackid } = await GameApi.DefsetUpdata.getConfig({
      app: 'parameter',
      name: 'namelist'
    })
    if (whitecrowd.indexOf(e.group_id) == -1) return false
    if (blackid.indexOf(e.user_id) != -1) return false

    if (!e.isMaster) {
      e.reply(`你不是主人哦!`)
      return
    }

    //获取扣除经验
    let jy = e.msg.replace(/^(#|\/)扣除全体家园经验/, '')
    var pattern = new RegExp('[0-9]+')
    var str = jy
    if (!pattern.test(str)) {
      e.reply(`错误福利`)
      return
    }

    //校验输入经验
    if (parseInt(jy) == parseInt(jy) && parseInt(jy) > 0) {
      jy = parseInt(jy)
    } else {
      jy = 100 //没有输入正确数字或不是正数
    }
    let File = fs.readdirSync(HomeApi.__PATH.user_home)
    File = File.filter((file) => file.endsWith('.json'))
    let File_length = File.length

    for (var i = 0; i < File_length; i++) {
      let this_qq = File[i].replace('.json', '')
      await HomeApi.GameUser.Add_homeexperience({
        UID: this_qq,
        experience: -jy
      })
    }
    e.reply(`经验扣除成功,目前共有${File_length}个玩家,每人减少${jy}家园经验`)
    return
  }
  //#扣除家园经验
  kouchugrjy = async (e) => {
    if (!e.isGroup || e.user_id == 80000000) return false
    const { whitecrowd, blackid } = await GameApi.DefsetUpdata.getConfig({
      app: 'parameter',
      name: 'namelist'
    })
    if (whitecrowd.indexOf(e.group_id) == -1) return false
    if (blackid.indexOf(e.user_id) != -1) return false
    if (!e.isMaster) {
      e.reply(`你不是主人哦!`)
      return
    }
    //对方
    const user = {
      A: e.user_id,
      C: 0,
      QQ: 0,
      p: Math.floor(Math.random() * (99 - 1) + 1)
    }
    user['B'] = await BotApi.User.at({ e })
    if (!user['B']) {
      return
    }
    let jy = e.msg.replace(/^(#|\/)扣除家园经验/, '')
    var pattern = new RegExp('[0-9]+')
    var str = jy
    if (!pattern.test(str)) {
      e.reply(`错误福利`)
      return
    }
    if (parseInt(jy) == parseInt(jy) && parseInt(jy) > 0) {
      jy = parseInt(jy)
    } else {
      jy = 100 //没有输入正确数字或不是正数
    }
    await HomeApi.GameUser.Add_homeexperience({ UID: user.B, experience: -jy })
    e.reply(`经验扣除成功,${user.B}减少${jy}家园经验`)
    return
  }
  //#发家园经验
  zenjiagrjy = async (e) => {
    if (!e.isGroup || e.user_id == 80000000) return false
    const { whitecrowd, blackid } = await GameApi.DefsetUpdata.getConfig({
      app: 'parameter',
      name: 'namelist'
    })
    if (whitecrowd.indexOf(e.group_id) == -1) return false
    if (blackid.indexOf(e.user_id) != -1) return false
    if (!e.isMaster) {
      e.reply(`你不是主人哦!`)
      return
    }
    //对方
    const user = {
      A: e.user_id,
      C: 0,
      QQ: 0,
      p: Math.floor(Math.random() * (99 - 1) + 1)
    }
    user['B'] = await BotApi.User.at({ e })
    if (!user['B']) {
      return
    }
    let jy = e.msg.replace(/^(#|\/)发家园经验/, '')
    var pattern = new RegExp('[0-9]+')
    var str = jy
    if (!pattern.test(str)) {
      e.reply(`错误福利`)
      return
    }
    if (parseInt(jy) == parseInt(jy) && parseInt(jy) > 0) {
      jy = parseInt(jy)
    } else {
      jy = 100 //没有输入正确数字或不是正数
    }
    await HomeApi.GameUser.Add_homeexperience({ UID: user.B, experience: jy })
    e.reply(`经验发放成功,${user.B}增加${jy}家园经验`)
    return
  }
  //#扣除灵晶
  kouchulj = async (e) => {
    if (!e.isGroup || e.user_id == 80000000) return false
    const { whitecrowd, blackid } = await GameApi.DefsetUpdata.getConfig({
      app: 'parameter',
      name: 'namelist'
    })
    if (whitecrowd.indexOf(e.group_id) == -1) return false
    if (blackid.indexOf(e.user_id) != -1) return false
    if (!e.isMaster) {
      e.reply(`你不是主人哦!`)
      return
    }
    let doge = e.msg.replace(/^(#|\/)扣除灵晶/, '')
    var pattern = new RegExp('[0-9]+')
    var str = doge
    if (!pattern.test(str)) {
      e.reply(`错误福利`)
      return
    }
    if (parseInt(doge) == parseInt(doge) && parseInt(doge) > 0) {
      doge = parseInt(doge)
    } else {
      doge = 100 //没有输入正确数字或不是正数
    }
    let this_qq = await BotApi.User.at({ e })
    await HomeApi.GameUser.Add_doge({ UID: this_qq, money: -doge })
    e.reply(`${this_qq}被管理员扣除 ${doge}灵晶`)
    return
  }
}
