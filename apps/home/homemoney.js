import { BotApi, GameApi, HomeApi, plugin } from '../../model/api/index.js'
//秋雨
export class homemoney extends plugin {
  constructor() {
    super({
      rule: [
        {
          reg: /^(#|\/)我的资产$/,
          fnc: 'Mylingshi'
        },
        {
          reg: /^(#|\/)售卖.*$/,
          fnc: 'Homesale'
        },
        {
          reg: /^(#|\/)采购.*$/,
          fnc: 'Buy_home'
        },
        {
          reg: /^(#|\/)灵瑶阁$/,
          fnc: 'dogshop'
        }
      ]
    })
  }

  Mylingshi(e) {
    //发送消息
    let UID = e.user_id
    //不开放私聊功能
    if (!this.verify(e)) return false
    if (!GameApi.GameUser.existUserSatus({ UID })) {
      e.reply('已仙鹤')
      return false
    }
    const archive = HomeApi.GameUser.Archive({ UID })
    if (archive != 0) {
      e.reply(`${archive}`)
      return false
    }
    let home = HomeApi.Listdata.controlActionInitial({
      CHOICE: 'user_home',
      NAME: UID,
      INITIAL: []
    })
    let Land = home.Land
    let Landgrid = home.Landgrid
    let doge = home.doge
    e.reply(`你的灵晶剩余${doge}颗，你的土地为${Land}块，你的土地格子剩余${Landgrid}格`)
    return false
  }

  //出售商品
  Homesale(e) {
    if (!this.verify(e)) return false
    let UID = e.user_id
    if (!GameApi.GameUser.existUserSatus({ UID })) {
      e.reply('已仙鹤')
      return false
    }
    const archive = HomeApi.GameUser.Archive({ UID })
    if (archive != 0) {
      e.reply(`${archive}`)
      return false
    }
    let thing = e.msg.replace(/^(#|\/)售卖/, '')
    let code = thing.split('*')
    let thing_name = code[0] //物品
    let thing_acount = code[1] //数量
    let quantity = GameApi.GamePublic.leastOne({ value: thing_acount })
    let searchsthing = HomeApi.GameUser.userWarehouseSearch({
      UID: UID,
      name: thing_name
    })
    if (searchsthing == undefined) {
      e.reply(`你没有[${thing_name}]`)
      return false
    }
    if (searchsthing.acount < quantity) {
      e.reply('数量不足')
      return false
    }
    if (searchsthing.doge == undefined) {
      e.reply(`这个物品不是家园所得物品，请移步隔壁商店`)
      return false
    }
    let Warehouse = HomeApi.Listdata.controlActionInitial({
      CHOICE: 'user_home_Warehouse',
      NAME: UID,
      INITIAL: []
    })
    Warehouse = HomeApi.GameUser.Add_DATA_thing({
      DATA: Warehouse,
      DATA1: searchsthing,
      quantity: -quantity
    })
    HomeApi.Listdata.controlActionInitial({
      CHOICE: 'user_home_Warehouse',
      NAME: UID,
      DATA: Warehouse,
      INITIAL: []
    })
    let commodities_doge1 = searchsthing.doge * quantity
    let lt = [0.7, 0.8, 0.9, 1, 1, 1, 1]
    let ex = Math.ceil(Math.random() * 6)
    let rand = lt[ex]
    let commodities_doge = parseInt(commodities_doge1 * rand)
    let sui = commodities_doge1 - commodities_doge
    let sui1 = commodities_doge - commodities_doge1
    HomeApi.GameUser.Add_doge({ UID, money: commodities_doge })
    if (sui < 0) {
      e.reply(`在出售物品的时候，分阁人员掉了${sui1}灵晶在地上，最后得到${commodities_doge}灵晶`)
    } else if (sui == 0) {
      e.reply(`分阁人员拉走了你的货物，并给了你${commodities_doge}灵晶`)
    } else {
      e.reply(`交给分阁人员路费${sui}灵晶，最后出售所得${commodities_doge}灵晶`)
    }
    return false
  }

  dogshop(e) {
    if (!this.verify(e)) return false
    const UID = e.user_id
    if (!GameApi.GameUser.existUserSatus({ UID })) {
      e.reply('已仙鹤')
      return false
    }
    const archive = HomeApi.GameUser.Archive({ UID })
    if (archive != 0) {
      e.reply(`${archive}`)
      return false
    }
    let msg = ['___[灵瑶阁下属地方分阁]___\n#采购+物品名']
    let dogshop_list = HomeApi.Listdata.controlActionInitial({
      CHOICE: 'home_dogshop',
      NAME: 'dogshop',
      INITIAL: []
    })
    let home = HomeApi.Listdata.controlActionInitial({
      CHOICE: 'user_home_user',
      NAME: UID,
      INITIAL: []
    })
    dogshop_list.forEach((item) => {
      let id = item.id.split('-')
      //种子
      if (id[0] == 11) {
        if (id[1] == 2) {
          msg.push('物品：' + item.name + '\n灵晶：' + item.doge)
        } else if (id[1] == 1) {
          msg.push(
            '物品：' +
              item.name +
              '\n所占格子：+' +
              item.lattice +
              '\n灵晶：' +
              item.doge +
              '\n成熟时间：' +
              item.doge * 4
          )
        }
      } else if (id[0] == 50 && home.homelevel > item.animallevel) {
        msg.push('物品：' + item.name + '\n灵晶：' + item.doge)
      } else if (id[0] == 50 && id[1] == 4) {
        msg.push('物品：' + item.name + '\n灵晶：' + item.doge)
      } else if (id[0] == 14) {
        msg.push('物品：' + item.name + '\n灵晶：' + item.doge)
      } else if (id[0] == 13) {
        msg.push('物品：' + item.name + '\n灵晶：' + item.doge)
      }
    })
    BotApi.User.forwardMsg({ e, data: msg })
    return false
  }

  Buy_home(e) {
    if (!this.verify(e)) return false
    let UID = e.user_id
    if (!GameApi.GameUser.existUserSatus({ UID })) {
      e.reply('已仙鹤')
      return false
    }
    const archive = HomeApi.GameUser.Archive({ UID })
    if (archive != 0) {
      e.reply(`${archive}`)
      return false
    }
    let thing = e.msg.replace(/^(#|\/)采购/, '')
    let code = thing.split('*')
    let thing_name = code[0] //物品
    let thing_acount = code[1] //数量
    let quantity = GameApi.GamePublic.leastOne({ value: thing_acount })
    if (quantity > 99) {
      quantity = 99
    }
    let ifexist1 = HomeApi.Listdata.controlActionInitial({
      CHOICE: 'home_home_dogshop',
      NAME: 'dogshop',
      INITIAL: []
    })
    let rangeland = HomeApi.Listdata.controlActionInitial({
      CHOICE: 'user_home_rangeland',
      NAME: UID,
      INITIAL: []
    })
    let ifexist = ifexist1.find((item) => item.name == thing_name)
    let id = ifexist.id.split('-')
    if (!ifexist) {
      e.reply(`不卖:${thing_name}`)
      return false
    }
    let home = HomeApi.Listdata.controlActionInitial({
      CHOICE: 'user_home_user',
      NAME: UID,
      INITIAL: []
    })
    if (id[0] == '50') {
      if (home.homelevel < ifexist.animallevel) {
        e.reply(`未达到采购${thing_name}的等级`)
        return false
      }
    }
    let doge = home.doge
    let commodities_doge1 = ifexist.doge * quantity
    let lt = [0.7, 0.8, 0.9, 1, 1.1, 1.2, 1.3]
    let ex = Math.ceil(Math.random() * 6)
    let rand = lt[ex]
    let commodities_doge = parseInt(commodities_doge1 * rand)
    if (doge < commodities_doge1 * 1.3) {
      e.reply(`哪里来的穷光蛋！一声呵斥，你被灵瑶阁门卫强大的气场给震了出来`)
      return false
    }
    let Warehouse = HomeApi.Listdata.controlActionInitial({
      CHOICE: 'user_home_Warehouse',
      NAME: UID,
      INITIAL: []
    })
    HomeApi.GameUser.Add_DATA_thing({
      DATA: Warehouse,
      DATA1: ifexist,
      quantity: quantity
    })
    HomeApi.Listdata.controlActionInitial({
      CHOICE: 'user_home_Warehouse',
      NAME: UID,
      DATA: Warehouse,
      INITIAL: []
    })
    HomeApi.GameUser.Add_doge({ UID, money: -commodities_doge })
    e.reply(
      `这次税率为【${rand}】,最终花了[${commodities_doge}]灵晶购买了[${thing_name}]*${quantity},`
    )
    return false
  }
}
