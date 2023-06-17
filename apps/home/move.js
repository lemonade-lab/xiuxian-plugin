import { BotApi, GameApi, HomeApi, plugin } from '../../model/api/index.js'
export class move extends plugin {
  constructor() {
    super({
      rule: [
        {
          reg: /^(#|\/)转移到仓库.*$/,
          fnc: 'movewarehouse'
        },
        {
          reg: /^(#|\/)转移到储物袋.*$/,
          fnc: 'movenajie'
        },
        {
          reg: /^(#|\/)更新仓库$/,
          fnc: 'update_warehouse'
        },
        {
          reg: /^(#|\/)农田重置$/,
          fnc: 'chongzhinongtian'
        }
      ]
    })
  }
  async movewarehouse(e) {
    //发送消息
    const UID = e.user_id
    //不开放私聊功能
    if (!e.isGroup || e.user_id == 80000000) return false
    const { whitecrowd, blackid } = await GameApi.DefsetUpdata.getConfig({
      app: 'parameter',
      name: 'namelist'
    })
    if (whitecrowd.indexOf(e.group_id) == -1) return false
    if (blackid.indexOf(e.user_id) != -1) return false
    //有无存档
    const archive = await HomeApi.GameUser.Archive({ UID })
    if (archive == 1) {
      e.reply(`没有存档，请先执行#踏入仙途，创建存档哦`)
      return
    } else if (archive != 0 && archive != '您都还没建立过家园') {
      e.reply(`${archive}`)
      return
    }
    const ifexisthome = await HomeApi.GameUser.existhome({ UID })
    const region2 = ifexisthome.region
    const action1 = await GameApi.UserData.listAction({
      NAME: UID,
      CHOICE: 'user_action'
    })
    const region1 = action1.region
    if (region2 != region1) {
      e.reply('您现在不在家园里，无法隔空取物哦！')
      return
    }
    const thing = e.msg.replace(/^(#|\/)转移到仓库/, '')
    const code = thing.split('*')
    const thing_name = code[0] //物品
    const thing_acount = code[1] //数量
    let quantity = await GameApi.GamePublic.leastOne({ value: thing_acount })
    const searchsthing = await GameApi.GameUser.userBagSearch({
      UID,
      name: thing_name
    })
    let id = searchsthing.id.split('-')
    if (id[0] == '13' && id[1] == '2') {
      e.reply('不能转移锅')
      return
    }
    if (searchsthing == 1 || searchsthing.acount < quantity) {
      e.reply('数量不足')
      return
    }
    let Warehouse = await HomeApi.Listdata.listActionArr({
      CHOICE: 'user_Warehouse',
      NAME: UID
    })
    Warehouse = await HomeApi.GameUser.Add_DATA_thing({
      DATA: Warehouse,
      DATA1: searchsthing,
      quantity
    })
    await HomeApi.Listdata.listActionArr({
      CHOICE: 'user_Warehouse',
      NAME: UID,
      DATA: Warehouse
    })
    let najie = await GameApi.UserData.listAction({
      NAME: UID,
      CHOICE: 'user_bag'
    })
    najie = await HomeApi.GameUser.Add_DATA_thing({
      DATA: najie,
      DATA1: searchsthing,
      quantity: -quantity
    })
    await GameApi.UserData.listAction({
      NAME: UID,
      CHOICE: 'user_bag',
      DATA: najie
    })
    e.reply(`数量为${quantity}的${thing_name}，成功转移到仓库`)
    return
  }

  async movenajie(e) {
    //发送消息
    const UID = e.user_id
    //不开放私聊功能
    if (!e.isGroup || e.user_id == 80000000) return false
    const { whitecrowd, blackid } = await GameApi.DefsetUpdata.getConfig({
      app: 'parameter',
      name: 'namelist'
    })
    if (whitecrowd.indexOf(e.group_id) == -1) return false
    if (blackid.indexOf(e.user_id) != -1) return false
    //有无存档
    const archive = await HomeApi.GameUser.Archive({ UID })
    if (archive == 1) {
      e.reply(`没有存档，请先执行#踏入仙途，创建存档哦`)
      return
    } else if (archive != 0 && archive != '您都还没建立过家园') {
      e.reply(`${archive}`)
      return
    }
    const ifexisthome = await HomeApi.GameUser.existhome({ UID })
    const home = await HomeApi.Listdata.listActionArr({
      CHOICE: 'user_home',
      NAME: UID
    })
    const homelevel = home.homelevel
    if (homelevel < 1) {
      e.reply(`你的家园等级太低，东西还是放在仓库安全！`)
      return
    }
    const region2 = ifexisthome.region
    const action1 = await GameApi.UserData.listAction({
      NAME: UID,
      CHOICE: 'user_action'
    })
    const region1 = action1.region
    if (region2 != region1) {
      e.reply('您现在不在家园里，无法隔空取物哦！')
      return
    }
    const thing = e.msg.replace( /^(#|\/)转移到储物袋/, '')
    const code = thing.split('*')
    const thing_name = code[0] //物品
    const thing_acount = code[1] //数量
    let quantity = await GameApi.GamePublic.leastOne({ value: thing_acount })
    const searchsthing = await HomeApi.GameUser.homeexist_Warehouse_thing_name({
      name: thing_name,
      UID
    })
    if (searchsthing == 1 || searchsthing.acount < quantity) {
      e.reply('数量不足')
      return
    }
    let id = searchsthing.id.split('-')
    if (id[0] == '13' && id[1] == '2') {
      e.reply('锅太大了，放不进储物袋')
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
    let najie = await GameApi.UserData.listAction({
      NAME: UID,
      CHOICE: 'user_bag'
    })
    najie = await HomeApi.GameUser.Add_DATA_thing({
      DATA: najie,
      DATA1: searchsthing,
      quantity
    })
    await GameApi.UserData.listAction({
      NAME: UID,
      CHOICE: 'user_bag',
      DATA: najie
    })
    e.reply(`数量为${quantity}的${thing_name}，成功转移到储物袋`)
    return
  }

  async update_warehouse(e) {
    //发送消息
    const UID = e.user_id
    //不开放私聊功能
    if (!e.isGroup || e.user_id == 80000000) return false
    const { whitecrowd, blackid } = await GameApi.DefsetUpdata.getConfig({
      app: 'parameter',
      name: 'namelist'
    })
    if (whitecrowd.indexOf(e.group_id) == -1) return false
    if (blackid.indexOf(e.user_id) != -1) return false
    //有无存档
    const archive = await HomeApi.GameUser.Archive({ UID })
    if (archive == 1) {
      e.reply(`没有存档，请先执行#踏入仙途，创建存档哦`)
      return
    } else if (archive != 0 && archive != '您都还没建立过家园') {
      e.reply(`${archive}`)
      return
    }
    let Warehouse = await HomeApi.Listdata.listActionArr({
      CHOICE: 'user_Warehouse',
      NAME: UID
    })
    for (let i = 0; i < Warehouse.thing.length; i++) {
      let searchsthing = await HomeApi.GameUser.homeexist_all_thing_name({
        name: Warehouse.thing[i].name
      })
      if (Warehouse.thing[i].thingId != undefined) {
        delete Warehouse.thing[i]
        Warehouse.thing = Warehouse.thing.filter(
          (item) => !['', null, undefined, NaN, false, true].includes(item)
        )
        await HomeApi.Listdata.listActionArr({
          CHOICE: 'user_Warehouse',
          NAME: UID,
          DATA: Warehouse
        })
      } else {
        if (searchsthing != 1) {
          searchsthing.acount = Warehouse.thing[i].acount
          let id = searchsthing.id.split('-')
          if (id[0] == '13' && id[1] == '2') {
            searchsthing.durable = Warehouse.thing[i].durable
          }
          if (id[0] == '13' && id[1] == '1') {
            if (Warehouse.thing[i].proficiency != undefined) {
              searchsthing.proficiency = Warehouse.thing[i].proficiency
            } else {
              let durable = {
                qq: Warehouse.thing[i].qq,
                durable: Warehouse.thing[i].durable
              }
              searchsthing = Object.assign(searchsthing, durable)
            }
          }
          Warehouse.thing[i] = searchsthing
          await HomeApi.Listdata.listActionArr({
            CHOICE: 'user_Warehouse',
            NAME: UID,
            DATA: Warehouse
          })
        } else {
          let searchsthing1 = await HomeApi.GameUser.homeexist_all_thing_id({
            id: Warehouse.thing[i].id
          })
          if (searchsthing1 != 1) {
            searchsthing1.acount = Warehouse.thing[i].acount
            Warehouse.thing[i] = searchsthing1
            await HomeApi.Listdata.listActionArr({
              CHOICE: 'user_Warehouse',
              NAME: UID,
              DATA: Warehouse
            })
          }
        }
      }
    }
    let Warehouse1 = await HomeApi.Listdata.listActionArr({
      CHOICE: 'user_Warehouse',
      NAME: UID
    })
    Warehouse1.thing = Warehouse1.thing.reduce((total, cur, index) => {
      let hasValue = total.findIndex((current) => {
        return current.id === cur.id
      })
      hasValue === -1 && total.push(cur)
      hasValue !== -1 && (total[hasValue].acount = total[hasValue].acount + cur.acount)
      return total
    }, [])
    await HomeApi.Listdata.listActionArr({
      CHOICE: 'user_Warehouse',
      NAME: UID,
      DATA: Warehouse
    })
    let landgoods = await HomeApi.Listdata.listActionArr({
      CHOICE: 'user_landgoods',
      NAME: UID
    })
    for (let i = 0; i < landgoods.thing.length; i++) {
      let searchsthing = await HomeApi.GameUser.homeexist_all_thing_name({
        name: landgoods.thing[i].name
      })
      if (searchsthing != 1) {
        landgoods.thing[i].id = searchsthing.id
        await HomeApi.Listdata.listActionArr({
          CHOICE: 'user_landgoods',
          NAME: UID,
          DATA: landgoods
        })
      } else {
        let searchsthing1 = await HomeApi.GameUser.homeexist_all_thing_id({
          id: landgoods.thing[i].id
        })
        if (searchsthing1 != 1) {
          landgoods.thing[i].name = searchsthing1.name
          await HomeApi.Listdata.listActionArr({
            CHOICE: 'user_landgoods',
            NAME: UID,
            DATA: landgoods
          })
        }
      }
    }
    e.reply(`成功更新`)
    return
  }

  async chongzhinongtian(e) {
    //发送消息
    const UID = e.user_id
    //不开放私聊功能
    if (!e.isGroup || e.user_id == 80000000) return false
    const { whitecrowd, blackid } = await GameApi.DefsetUpdata.getConfig({
      app: 'parameter',
      name: 'namelist'
    })
    if (whitecrowd.indexOf(e.group_id) == -1) return false
    if (blackid.indexOf(e.user_id) != -1) return false
    //有无存档
    const archive = await HomeApi.GameUser.Archive({ UID })
    if (archive == 1) {
      e.reply(`没有存档，请先执行#踏入仙途，创建存档哦`)
      return
    } else if (archive != 0 && archive != '您都还没建立过家园') {
      e.reply(`${archive}`)
      return
    }
    const landgoods = {
      thing: []
    }
    await HomeApi.Listdata.listActionArr({
      CHOICE: 'user_landgoods',
      NAME: UID,
      DATA: landgoods
    })
    const home = await HomeApi.Listdata.listActionArr({
      CHOICE: 'user_home',
      NAME: UID
    })
    home.Landgrid = home.LandgridMax
    await HomeApi.Listdata.listActionArr({
      CHOICE: 'user_home',
      NAME: UID,
      DATA: home
    })
    e.reply(`重置完成！`)
  }
}
