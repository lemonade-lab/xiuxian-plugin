import { GameApi, HomeApi, plugin } from '../../model/api/index.js'
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
    if (!this.verify(e)) return false
    const UID = e.user_id
    // 有无存档
    const archive = HomeApi.GP.Archive(UID)
    if (archive == 1) {
      e.reply(`没有存档，请先执行(#|/)踏入仙途，建立存档哦`)
      return
    } else if (archive != 0 && archive != '您都还没建立过洞府') {
      e.reply(`${archive}`)
      return
    }
    const ifexisthome = HomeApi.GP.existhome(UID)
    const region2 = ifexisthome.region
    const action1 = GameApi.Listdata.controlAction({
      NAME: UID,
      CHOICE: 'playerAction'
    })
    const region1 = action1.region
    if (region2 != region1) {
      e.reply('您现在不在洞府里，无法隔空取物哦！')
      return
    }
    const thing = e.msg.replace(/^(#|\/)转移到仓库/, '')
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
    let Warehouse = GameApi.Listdata.controlActionInitial({
      CHOICE: 'user_home_Warehouse',
      NAME: UID,
      INITIAL: []
    })
    Warehouse = HomeApi.GP.addDataThing({
      DATA: Warehouse,
      DATA1: searchsthing,
      quantity
    })
    GameApi.Listdata.controlAction({
      CHOICE: 'user_home_Warehouse',
      NAME: UID,
      DATA: Warehouse
    })
    let najie = GameApi.Listdata.controlAction({
      NAME: UID,
      CHOICE: 'playerBag'
    })
    najie = HomeApi.GP.addDataThing({
      DATA: najie,
      DATA1: searchsthing,
      quantity: -quantity
    })
    GameApi.Listdata.controlAction({
      NAME: UID,
      CHOICE: 'playerBag',
      DATA: najie
    })
    e.reply(`数量为${quantity}的${thingName}，成功转移到仓库`)
  }

  async movenajie(e) {
    if (!this.verify(e)) return false
    const UID = e.user_id
    // 有无存档
    const archive = HomeApi.GP.Archive(UID)
    if (archive == 1) {
      e.reply(`没有存档，请先执行(#|/)踏入仙途，建立存档哦`)
      return
    } else if (archive != 0 && archive != '您都还没建立过洞府') {
      e.reply(`${archive}`)
      return
    }
    const ifexisthome = HomeApi.GP.existhome(UID)
    const home = GameApi.Listdata.controlActionInitial({
      CHOICE: 'user_home_user',
      NAME: UID,
      INITIAL: []
    })
    const homelevel = home.homelevel
    if (homelevel < 1) {
      e.reply(`你的洞府等级太低，东西还是放在仓库安全！`)
      return
    }
    const region2 = ifexisthome.region
    const action1 = GameApi.Listdata.controlAction({
      NAME: UID,
      CHOICE: 'playerAction'
    })
    const region1 = action1.region
    if (region2 != region1) {
      e.reply('您现在不在洞府里，无法隔空取物哦！')
      return
    }
    const thing = e.msg.replace(/^(#|\/)转移到储物袋/, '')
    const code = thing.split('*')
    const thingName = code[0] // 物品
    const thingAcount = code[1] // 数量
    let quantity = GameApi.Method.leastOne(thingAcount)
    const searchsthing = HomeApi.GP.homeexistWarehouseThingName({
      name: thingName,
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
    let Warehouse = GameApi.Listdata.controlActionInitial({
      CHOICE: 'user_home_Warehouse',
      NAME: UID,
      INITIAL: []
    })
    Warehouse = HomeApi.GP.addDataThing({
      DATA: Warehouse,
      DATA1: searchsthing,
      quantity: -quantity
    })
    GameApi.Listdata.controlAction({
      CHOICE: 'user_home_Warehouse',
      NAME: UID,
      DATA: Warehouse
    })
    let najie = GameApi.Listdata.controlAction({
      NAME: UID,
      CHOICE: 'playerBag'
    })
    najie = HomeApi.GP.addDataThing({
      DATA: najie,
      DATA1: searchsthing,
      quantity
    })
    GameApi.Listdata.controlAction({
      NAME: UID,
      CHOICE: 'playerBag',
      DATA: najie
    })
    e.reply(`数量为${quantity}的${thingName}，成功转移到储物袋`)
  }

  async updateWarehouse(e) {
    if (!this.verify(e)) return false
    const UID = e.user_id
    // 有无存档
    const archive = HomeApi.GP.Archive(UID)
    if (archive == 1) {
      e.reply(`没有存档，请先执行(#|/)踏入仙途，建立存档哦`)
      return
    } else if (archive != 0 && archive != '您都还没建立过洞府') {
      e.reply(`${archive}`)
      return
    }
    let Warehouse = GameApi.Listdata.controlActionInitial({
      CHOICE: 'user_home_Warehouse',
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
        GameApi.Listdata.controlAction({
          CHOICE: 'user_home_Warehouse',
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
                UID: Warehouse.thing[i].UID,
                durable: Warehouse.thing[i].durable
              }
              searchsthing = Object.assign(searchsthing, durable)
            }
          }
          Warehouse.thing[i] = searchsthing
          GameApi.Listdata.controlAction({
            CHOICE: 'user_home_Warehouse',
            NAME: UID,
            DATA: Warehouse
          })
        } else {
          let searchsthing1 = HomeApi.GP.homeexistAllThingById({
            id: Warehouse.thing[i].id
          })
          if (searchsthing1 != 1) {
            searchsthing1.acount = Warehouse.thing[i].acount
            Warehouse.thing[i] = searchsthing1
            GameApi.Listdata.controlAction({
              CHOICE: 'user_home_Warehouse',
              NAME: UID,
              DATA: Warehouse
            })
          }
        }
      }
    }
    let Warehouse1 = GameApi.Listdata.controlActionInitial({
      CHOICE: 'user_home_Warehouse',
      NAME: UID,
      INITIAL: []
    })
    Warehouse1.thing = Warehouse1.thing.reduce((total, cur, index) => {
      let hasValue = total.findIndex((current) => {
        return current.id === cur.id
      })
      hasValue === -1 && total.push(cur)
      hasValue !== -1 && (total[hasValue].acount = total[hasValue].acount + cur.acount)
      return total
    }, [])
    GameApi.Listdata.controlAction({
      CHOICE: 'user_home_Warehouse',
      NAME: UID,
      DATA: Warehouse
    })
    let landgoods = GameApi.Listdata.controlActionInitial({
      CHOICE: 'user_home_landgoods',
      NAME: UID,
      INITIAL: []
    })
    for (let i = 0; i < landgoods.thing.length; i++) {
      let searchsthing = HomeApi.GP.homeexistAllThingByName({
        name: landgoods.thing[i].name
      })
      if (searchsthing != 1) {
        landgoods.thing[i].id = searchsthing.id
        GameApi.Listdata.controlAction({
          CHOICE: 'user_home_landgoods',
          NAME: UID,
          DATA: landgoods
        })
      } else {
        let searchsthing1 = HomeApi.GP.homeexistAllThingById({
          id: landgoods.thing[i].id
        })
        if (searchsthing1 != 1) {
          landgoods.thing[i].name = searchsthing1.name
          GameApi.Listdata.controlAction({
            CHOICE: 'user_home_landgoods',
            NAME: UID,
            DATA: landgoods
          })
        }
      }
    }
    e.reply(`成功更新`)
  }

  async chongzhinongtian(e) {
    if (!this.verify(e)) return false
    const UID = e.user_id
    // 有无存档
    const archive = HomeApi.GP.Archive(UID)
    if (archive == 1) {
      e.reply(`没有存档，请先执行(#|/)踏入仙途，建立存档哦`)
      return
    } else if (archive != 0 && archive != '您都还没建立过洞府') {
      e.reply(`${archive}`)
      return
    }
    const landgoods = {
      thing: []
    }
    GameApi.Listdata.controlAction({
      CHOICE: 'user_home_landgoods',
      NAME: UID,
      DATA: landgoods
    })
    const home = GameApi.Listdata.controlAction({
      CHOICE: 'user_home_user',
      NAME: UID
    })
    home.Landgrid = home.LandgridMax
    GameApi.Listdata.controlAction({
      CHOICE: 'user_home_user',
      NAME: UID,
      DATA: home
    })
    e.reply(`重置完成！`)
  }
}
