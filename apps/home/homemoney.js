import { BotApi, GameApi, HomeApi, name, dsc, plugin } from '../../model/api/api.js'
export class homemoney extends plugin {
  constructor() {
    super({
      name,
      dsc,
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

  async Mylingshi(e) {
    //发送消息
    let UID = e.user_id
    //不开放私聊功能
    if (!e.isGroup || e.user_id == 80000000) return false
    const { whitecrowd, blackid } = await GameApi.DefsetUpdata.getConfig({
      app: 'parameter',
      name: 'namelist'
    })
    if (whitecrowd.indexOf(e.group_id) == -1) return false
    if (blackid.indexOf(e.user_id) != -1) return false
    if (!(await GameApi.GameUser.existUserSatus({ UID }))) {
      e.reply('已死亡')
      return
    }
    const archive = await HomeApi.GameUser.Archive({ UID })
    if (archive != 0) {
      e.reply(`${archive}`)
      return
    }
    let home = await HomeApi.Listdata.listActionArr({
      CHOICE: 'user_home',
      NAME: UID
    })
    let Land = home.Land
    let Landgrid = home.Landgrid
    let doge = home.doge
    e.reply(`你的灵晶剩余${doge}颗，你的土地为${Land}块，你的土地格子剩余${Landgrid}格`)
    return
  }

  //出售商品
  async Homesale(e) {
    if (!e.isGroup || e.user_id == 80000000) return false
    const { whitecrowd, blackid } = await GameApi.DefsetUpdata.getConfig({
      app: 'parameter',
      name: 'namelist'
    })
    if (whitecrowd.indexOf(e.group_id) == -1) return false
    if (blackid.indexOf(e.user_id) != -1) return false
    let UID = e.user_id
    if (!(await GameApi.GameUser.existUserSatus({ UID }))) {
      e.reply('已死亡')
      return
    }
    const archive = await HomeApi.GameUser.Archive({ UID })
    if (archive != 0) {
      e.reply(`${archive}`)
      return
    }
    let thing = e.msg.replace('#售卖', '')
    let code = thing.split('*')
    let thing_name = code[0] //物品
    let thing_acount = code[1] //数量
    let quantity = await GameApi.GamePublic.leastOne({ value: thing_acount })
    let searchsthing = await HomeApi.GameUser.userWarehouseSearch({
      UID: UID,
      name: thing_name
    })
    if (searchsthing == undefined) {
      e.reply(`你没有[${thing_name}]`)
      return
    }
    if (searchsthing.acount < quantity) {
      e.reply('数量不足')
      return
    }
    if (searchsthing.doge == undefined) {
      e.reply(`这个物品不是家园所得物品，请移步隔壁商店`)
      return
    }
    let Warehouse = await HomeApi.Listdata.listActionArr({
      CHOICE: 'user_Warehouse',
      NAME: UID
    })
    Warehouse = await HomeApi.GameUser.Add_DATA_thing({
      DATA: Warehouse,
      DATA1: searchsthing,
      quantity: -quantity
    })
    await HomeApi.Listdata.listActionArr({
      CHOICE: 'user_Warehouse',
      NAME: UID,
      DATA: Warehouse
    })
    let commodities_doge1 = searchsthing.doge * quantity
    let lt = [0.7, 0.8, 0.9, 1, 1, 1, 1]
    let ex = Math.ceil(Math.random() * 6)
    let rand = lt[ex]
    let commodities_doge = parseInt(commodities_doge1 * rand)
    let sui = commodities_doge1 - commodities_doge
    let sui1 = commodities_doge - commodities_doge1
    await HomeApi.GameUser.Add_doge({ UID, money: commodities_doge })
    if (sui < 0) {
      e.reply(`在出售物品的时候，分阁人员掉了${sui1}灵晶在地上，最后得到${commodities_doge}灵晶`)
    } else if (sui == 0) {
      e.reply(`分阁人员拉走了你的货物，并给了你${commodities_doge}灵晶`)
    } else {
      e.reply(`交给分阁人员路费${sui}灵晶，最后出售所得${commodities_doge}灵晶`)
    }
    return
  }

  async dogshop(e) {
    if (!e.isGroup || e.user_id == 80000000) return false
    const { whitecrowd, blackid } = await GameApi.DefsetUpdata.getConfig({
      app: 'parameter',
      name: 'namelist'
    })
    if (whitecrowd.indexOf(e.group_id) == -1) return false
    if (blackid.indexOf(e.user_id) != -1) return false
    const UID = e.user_id
    if (!(await GameApi.GameUser.existUserSatus({ UID }))) {
      e.reply('已死亡')
      return
    }
    const archive = await HomeApi.GameUser.Archive({ UID })
    if (archive != 0) {
      e.reply(`${archive}`)
      return
    }
    let msg = ['___[灵瑶阁下属地方分阁]___\n#采购+物品名']
    let dogshop_list = await HomeApi.Listdata.listActionArr({
      CHOICE: 'home_dogshop',
      NAME: 'dogshop'
    })
    let home = await HomeApi.Listdata.listActionArr({
      CHOICE: 'user_home',
      NAME: UID
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
    await BotApi.User.forwardMsg({ e, data: msg })
    return
  }

  async Buy_home(e) {
    if (!e.isGroup || e.user_id == 80000000) return false
    const { whitecrowd, blackid } = await GameApi.DefsetUpdata.getConfig({
      app: 'parameter',
      name: 'namelist'
    })
    if (whitecrowd.indexOf(e.group_id) == -1) return false
    if (blackid.indexOf(e.user_id) != -1) return false
    let UID = e.user_id
    if (!(await GameApi.GameUser.existUserSatus({ UID }))) {
      e.reply('已死亡')
      return
    }
    const archive = await HomeApi.GameUser.Archive({ UID })
    if (archive != 0) {
      e.reply(`${archive}`)
      return
    }
    let thing = e.msg.replace('#采购', '')
    let code = thing.split('*')
    let thing_name = code[0] //物品
    let thing_acount = code[1] //数量
    let quantity = await GameApi.GamePublic.leastOne({ value: thing_acount })
    if (quantity > 99) {
      quantity = 99
    }
    let ifexist1 = await HomeApi.Listdata.listActionArr({
      CHOICE: 'home_dogshop',
      NAME: 'dogshop'
    })
    let rangeland = await HomeApi.Listdata.listActionArr({
      CHOICE: 'user_rangeland',
      NAME: UID
    })
    let ifexist = ifexist1.find((item) => item.name == thing_name)
    let id = ifexist.id.split('-')
    if (!ifexist) {
      e.reply(`不卖:${thing_name}`)
      return
    }
    let home = await HomeApi.Listdata.listActionArr({
      CHOICE: 'user_home',
      NAME: UID
    })
    if (id[0] == '50') {
      if (home.homelevel < ifexist.animallevel) {
        e.reply(`未达到采购${thing_name}的等级`)
        return
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
      return
    }
    let Warehouse = await HomeApi.Listdata.listActionArr({
      CHOICE: 'user_Warehouse',
      NAME: UID
    })
    HomeApi.GameUser.Add_DATA_thing({
      DATA: Warehouse,
      DATA1: ifexist,
      quantity: quantity
    })
    await HomeApi.Listdata.listActionArr({
      CHOICE: 'user_Warehouse',
      NAME: UID,
      DATA: Warehouse
    })
    await HomeApi.GameUser.Add_doge({ UID, money: -commodities_doge })
    e.reply(
      `这次税率为【${rand}】,最终花了[${commodities_doge}]灵晶购买了[${thing_name}]*${quantity},`
    )
    return
  }
}
