import { GameApi, HomeApi, plugin } from '#xiuxian-api'
// 秋雨
export class Homemove extends plugin {
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
          fnc: 'updateWarehouse'
        },
        {
          reg: /^(#|\/)药田重置$/,
          fnc: 'chongzhinongtian'
        }
      ]
    })
  }

  async movewarehouse(e) {
    // 不开放私聊功能
    if (!super.verify(e)) return false
    const UID = e.user_id
    // 有无存档
    const { state, msg } = HomeApi.GP.Archive(UID)
    if (state == 2000) {
      e.reply(msg)
      return false
    }
    const ifexisthome = HomeApi.GP.getPositionHome(UID)
    const region2 = ifexisthome.region
    const action1 = GameApi.Data.controlAction({
      NAME: UID,
      CHOICE: 'playerAction'
    })
    const region1 = action1.region
    if (region2 != region1) {
      e.reply('您现在不在洞府里，无法隔空取物哦！')
      return
    }
    const thing = e.cmd_msg.replace(/^(#|\/)转移到仓库/, '')
    const code = thing.split('*')
    const thingName = code[0] // 物品
    const thingAcount = code[1] // 数量
    let quantity = GameApi.Method.leastOne(thingAcount)
    const searchsthing = GameApi.Bag.searchBagByName({
      UID,
      name: thingName
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
    let Warehouse = GameApi.Data.controlActionInitial({
      CHOICE: 'homeWarehouse',
      NAME: UID,
      INITIAL: []
    })
    Warehouse = HomeApi.GP.addDataThing({
      DATA: Warehouse,
      DATA1: searchsthing,
      quantity
    })
    GameApi.Data.controlAction({
      CHOICE: 'homeWarehouse',
      NAME: UID,
      DATA: Warehouse
    })
    let najie = GameApi.Data.controlAction({
      NAME: UID,
      CHOICE: 'playerBag'
    })
    najie = HomeApi.GP.addDataThing({
      DATA: najie,
      DATA1: searchsthing,
      quantity: -quantity
    })
    GameApi.Data.controlAction({
      NAME: UID,
      CHOICE: 'playerBag',
      DATA: najie
    })
    e.reply(`数量为${quantity}的${thingName}，成功转移到仓库`)
  }

  async movenajie(e) {
    if (!super.verify(e)) return false
    const UID = e.user_id
    // 有无存档
    const { state, msg } = HomeApi.GP.Archive(UID)
    if (state == 2000) {
      e.reply(msg)
      return false
    }
    const ifexisthome = HomeApi.GP.getPositionHome(UID)
    const home = GameApi.Data.controlActionInitial({
      CHOICE: 'homeUser',
      NAME: UID,
      INITIAL: []
    })
    const homelevel = home.homelevel
    if (homelevel < 1) {
      e.reply(`你的洞府等级太低，东西还是放在仓库安全！`)
      return
    }
    const region2 = ifexisthome.region
    const action1 = GameApi.Data.controlAction({
      NAME: UID,
      CHOICE: 'playerAction'
    })
    const region1 = action1.region
    if (region2 != region1) {
      e.reply('您现在不在洞府里，无法隔空取物哦！')
      return
    }
    const thing = e.cmd_msg.replace(/^(#|\/)转移到储物袋/, '')
    const code = thing.split('*')
    const thingName = code[0] // 物品
    const thingAcount = code[1] // 数量
    let quantity = GameApi.Method.leastOne(thingAcount)
    const searchsthing = HomeApi.GP.homeexistWarehouseThingName(UID, thingName)
    if (!searchsthing || searchsthing.acount < quantity) {
      e.reply('数量不足')
      return
    }
    let id = searchsthing.id.split('-')
    if (id[0] == '13' && id[1] == '2') {
      e.reply('锅太大了，放不进储物袋')
      return
    }
    let Warehouse = GameApi.Data.controlActionInitial({
      CHOICE: 'homeWarehouse',
      NAME: UID,
      INITIAL: []
    })
    Warehouse = HomeApi.GP.addDataThing({
      DATA: Warehouse,
      DATA1: searchsthing,
      quantity: -quantity
    })
    GameApi.Data.controlAction({
      CHOICE: 'homeWarehouse',
      NAME: UID,
      DATA: Warehouse
    })
    let najie = GameApi.Data.controlAction({
      NAME: UID,
      CHOICE: 'playerBag'
    })
    najie = HomeApi.GP.addDataThing({
      DATA: najie,
      DATA1: searchsthing,
      quantity
    })
    GameApi.Data.controlAction({
      NAME: UID,
      CHOICE: 'playerBag',
      DATA: najie
    })
    e.reply(`数量为${quantity}的${thingName}，成功转移到储物袋`)
  }

  async updateWarehouse(e) {
    if (!super.verify(e)) return false
    const UID = e.user_id
    // 有无存档
    const { state, msg } = HomeApi.GP.Archive(UID)
    if (state == 2000) {
      e.reply(msg)
      return false
    }
    let Warehouse = GameApi.Data.controlActionInitial({
      CHOICE: 'homeWarehouse',
      NAME: UID,
      INITIAL: []
    })
    for (let i = 0; i < Warehouse.thing.length; i++) {
      let searchsthing = HomeApi.GP.homeexistAllThingByName({
        name: Warehouse.thing[i].name
      })
      if (Warehouse.thing[i].thingId != undefined) {
        delete Warehouse.thing[i]
        Warehouse.thing = Warehouse.thing.filter(
          (item) => !['', null, undefined, NaN, false, true].includes(item)
        )
        GameApi.Data.controlAction({
          CHOICE: 'homeWarehouse',
          NAME: UID,
          DATA: Warehouse
        })
      } else {
        if (searchsthing) {
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
                UID: Warehouse.thing[i].UID,
                durable: Warehouse.thing[i].durable
              }
              searchsthing = Object.assign(searchsthing, durable)
            }
          }
          Warehouse.thing[i] = searchsthing
          GameApi.Data.controlAction({
            CHOICE: 'homeWarehouse',
            NAME: UID,
            DATA: Warehouse
          })
        } else {
          let searchsthing1 = HomeApi.GP.homeexistAllThingById(Warehouse.thing[i].id)
          if (searchsthing1) {
            searchsthing1.acount = Warehouse.thing[i].acount
            Warehouse.thing[i] = searchsthing1
            GameApi.Data.controlAction({
              CHOICE: 'homeWarehouse',
              NAME: UID,
              DATA: Warehouse
            })
          }
        }
      }
    }
    let Warehouse1 = GameApi.Data.controlActionInitial({
      CHOICE: 'homeWarehouse',
      NAME: UID,
      INITIAL: []
    })
    Warehouse1.thing = Warehouse1.thing.reduce((total, cur) => {
      let hasValue = total.findIndex((current) => {
        return current.id === cur.id
      })
      hasValue === -1 && total.push(cur)
      hasValue !== -1 && (total[hasValue].acount = total[hasValue].acount + cur.acount)
      return total
    }, [])
    GameApi.Data.controlAction({
      CHOICE: 'homeWarehouse',
      NAME: UID,
      DATA: Warehouse
    })
    let landgoods = GameApi.Data.controlActionInitial({
      CHOICE: 'fixed_goods',
      NAME: UID,
      INITIAL: []
    })
    for (let i = 0; i < landgoods.thing.length; i++) {
      let searchsthing = HomeApi.GP.homeexistAllThingByName({
        name: landgoods.thing[i].name
      })
      if (searchsthing) {
        landgoods.thing[i].id = searchsthing.id
        GameApi.Data.controlAction({
          CHOICE: 'fixed_goods',
          NAME: UID,
          DATA: landgoods
        })
      } else {
        let searchsthing1 = HomeApi.GP.homeexistAllThingById(landgoods.thing[i].id)
        if (searchsthing1) {
          landgoods.thing[i].name = searchsthing1.name
          GameApi.Data.controlAction({
            CHOICE: 'fixed_goods',
            NAME: UID,
            DATA: landgoods
          })
        }
      }
    }
    e.reply(`成功更新`)
  }

  async chongzhinongtian(e) {
    if (!super.verify(e)) return false
    const UID = e.user_id
    // 有无存档
    const { state, msg } = HomeApi.GP.Archive(UID)
    if (state == 2000) {
      e.reply(msg)
      return false
    }
    const landgoods = {
      thing: []
    }
    GameApi.Data.controlAction({
      CHOICE: 'fixed_goods',
      NAME: UID,
      DATA: landgoods
    })
    const home = GameApi.Data.controlAction({
      CHOICE: 'homeUser',
      NAME: UID
    })
    home.Landgrid = home.LandgridMax
    GameApi.Data.controlAction({
      CHOICE: 'homeUser',
      NAME: UID,
      DATA: home
    })
    e.reply(`重置完成！`)
  }
}
