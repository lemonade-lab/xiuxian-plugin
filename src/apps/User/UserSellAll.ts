import {
  Read_player,
  existplayer,
  exist_najie_thing,
  foundthing,
  re_najie_thing,
  Write_najie,
  sleep,
  synchronization,
  Synchronization_ASS,
  Add_money,
  Add_najie_thing,
  Add_now_exp,
  Add_player_studyskill,
  Add_血气,
  __PATH,
  instead_equipment,
  Read_najie,
  get_equipment_img,
  data
} from '../../model/index.js'
import { plugin } from '../../../import.js'
export class UserSellAll extends plugin {
  constructor() {
    super({
      name: 'UserSellAll',
      dsc: '修仙模块',
      event: 'message',
      priority: 600,
      rule: [
        {
          reg: /^(#|\/)一键出售(.*)$/,
          fnc: 'Sell_all_comodities'
        },
        {
          reg: /^(#|\/)一键服用now_exp丹$/,
          fnc: 'all_xiuweidan'
        },
        {
          reg: /^(#|\/)一键服用血气丹$/,
          fnc: 'all_xueqidan'
        },
        {
          reg: /^(#|\/)一键study$/,
          fnc: 'all_learn'
        },
        {
          reg: /^(#|\/)一键同步$/,
          fnc: 'all_tongbu'
        },
        {
          reg: /^(#|\/)(锁定|解锁).*$/,
          fnc: 'locked'
        },
        {
          reg: /^(#|\/)一键回收(.*)$/,
          fnc: 'Sell_all_huishou'
        },
        {
          reg: /^(#|\/)一键赠送(.*)$/,
          fnc: 'all_give'
        },
        {
          reg: /^(#|\/)一键锁定(.*)$/,
          fnc: 'all_locked'
        },
        {
          reg: /^(#|\/)一键解锁(.*)$/,
          fnc: 'all_unlocked'
        },
        {
          reg: /^(#|\/)一键装备$/,
          fnc: 'all_zhuangbei'
        }
      ]
    })
  }
  async all_zhuangbei(e) {
    let usr_qq = e.user_id
    let ifexistplay = await existplayer(usr_qq)
    if (!ifexistplay) return false
    //检索方法
    let najie = await data.getData('najie', usr_qq)
    let player = await Read_player(usr_qq)
    let sanwei = []
    sanwei[0] =
      data.Level_list.find((item) => item.level_id == player.level_id)
        .基础攻击 +
      player.攻击加成 +
      data.LevelMax_list.find((item) => item.level_id == player.Physique_id)
        .基础攻击
    sanwei[1] =
      data.Level_list.find((item) => item.level_id == player.level_id)
        .基础防御 +
      player.防御加成 +
      data.LevelMax_list.find((item) => item.level_id == player.Physique_id)
        .基础防御
    sanwei[2] =
      data.Level_list.find((item) => item.level_id == player.level_id)
        .基础血量 +
      player.生命加成 +
      data.LevelMax_list.find((item) => item.level_id == player.Physique_id)
        .基础血量
    let equipment = await data.getData('equipment', usr_qq)
    //智能选择装备
    let type = ['weapon', 'protective_clothing', 'magic_weapon']
    for (let j of type) {
      let max
      let max_equ
      if (
        equipment[j].atk < 10 &&
        equipment[j].def < 10 &&
        equipment[j].HP < 10
      )
        max =
          equipment[j].atk * sanwei[0] * 0.43 +
          equipment[j].def * sanwei[1] * 0.16 +
          equipment[j].HP * sanwei[2] * 0.41
      else
        max =
          equipment[j].atk * 0.43 +
          equipment[j].def * 0.16 +
          equipment[j].HP * 0.41
      for (let i of najie['装备']) {
        //先判断装备存不存在
        let thing_exist = await foundthing(i.name)
        if (!thing_exist) {
          continue
        }
        if (i.type == j) {
          let temp
          //再判断装备数值类型
          if (i.atk < 10 && i.def < 10 && i.HP < 10)
            temp =
              i.atk * sanwei[0] * 0.43 +
              i.def * sanwei[1] * 0.16 +
              i.HP * sanwei[2] * 0.41
          else temp = i.atk * 0.43 + i.def * 0.16 + i.HP * 0.41
          //选出最佳装备
          if (max < temp) {
            max = temp
            max_equ = i
          }
        }
      }
      if (max_equ) await instead_equipment(usr_qq, max_equ)
    }
    let img = await get_equipment_img(e)
    e.reply(img)
    return false
  }

  async all_locked(e) {
    let usr_qq = e.user_id
    //有无存档
    let ifexistplay = await existplayer(usr_qq)
    if (!ifexistplay) return false
    let najie = await data.getData('najie', usr_qq)
    let wupin = [
      '装备',
      '丹药',
      '道具',
      'skill',
      '草药',
      '材料',
      '仙宠',
      '仙宠口粮'
    ]
    let wupin1 = []
    if (e.msg != '#一键锁定') {
      let thing = e.msg.replace('#一键锁定', '')
      for (let i of wupin) {
        if (thing == i) {
          wupin1.push(i)
          thing = thing.replace(i, '')
        }
      }
      if (thing.length == 0) {
        wupin = wupin1
      } else {
        return false
      }
    }
    for (let i of wupin) {
      for (let l of najie[i]) {
        //纳戒中the数量
        l.islockd = 1
      }
    }
    await Write_najie(usr_qq, najie)
    e.reply(`一键锁定完成`)
    return false
  }

  async all_unlocked(e) {
    let usr_qq = e.user_id
    //有无存档
    let ifexistplay = await existplayer(usr_qq)
    if (!ifexistplay) return false
    let najie = await data.getData('najie', usr_qq)
    let wupin = [
      '装备',
      '丹药',
      '道具',
      'skill',
      '草药',
      '材料',
      '仙宠',
      '仙宠口粮'
    ]
    let wupin1 = []
    if (e.msg != '#一键解锁') {
      let thing = e.msg.replace('#一键解锁', '')
      for (let i of wupin) {
        if (thing == i) {
          wupin1.push(i)
          thing = thing.replace(i, '')
        }
      }
      if (thing.length == 0) {
        wupin = wupin1
      } else {
        return false
      }
    }
    for (let i of wupin) {
      for (let l of najie[i]) {
        //纳戒中the数量
        l.islockd = 0
      }
    }
    await Write_najie(usr_qq, najie)
    e.reply(`一键解锁完成`)
    return false
  }

  async all_give(e) {
    //这是自己the
    let A_qq = e.user_id
    //自己没存档
    let ifexistplay = await existplayer(A_qq)
    if (!ifexistplay) return false
    //对方
    let isat = e.message.some((item) => item.type === 'at')
    if (!isat) return false
    let atItem = e.message.filter((item) => item.type === 'at') //获取at信息
    let B_qq = atItem[0].qq //对方qq
    //对方没存档
    ifexistplay = await existplayer(B_qq)
    if (!ifexistplay) {
      e.reply(`此人尚未踏入仙途`)
      return false
    }
    let A_najie = await data.getData('najie', A_qq)
    let wupin = [
      '装备',
      '丹药',
      '道具',
      'skill',
      '草药',
      '材料',
      '仙宠',
      '仙宠口粮'
    ]
    let wupin1 = []
    if (e.msg != '#一键赠送') {
      let thing = e.msg.replace('#一键赠送', '')
      for (let i of wupin) {
        if (thing == i) {
          wupin1.push(i)
          thing = thing.replace(i, '')
        }
      }
      if (thing.length == 0) {
        wupin = wupin1
      } else {
        return false
      }
    }
    for (let i of wupin) {
      for (let l of A_najie[i]) {
        if (l && l.islockd == 0) {
          let quantity = l.数量
          //纳戒中the数量
          if (i == '装备' || i == '仙宠') {
            await Add_najie_thing(B_qq, l, l.class, quantity, l.pinji)
            await Add_najie_thing(A_qq, l, l.class, -quantity, l.pinji)
            continue
          }
          await Add_najie_thing(A_qq, l.name, l.class, -quantity)
          await Add_najie_thing(B_qq, l.name, l.class, quantity)
        }
      }
    }
    e.reply(`一键赠送完成`)
    return false
  }
  async Sell_all_huishou(e) {
    let usr_qq = e.user_id
    //有无存档
    let ifexistplay = await existplayer(usr_qq)
    if (!ifexistplay) return false
    let najie = await data.getData('najie', usr_qq)
    let lingshi = 0
    let wupin = [
      '装备',
      '丹药',
      '道具',
      'skill',
      '草药',
      '材料',
      '仙宠',
      '仙宠口粮'
    ]
    let wupin1 = []
    if (e.msg != '#一键回收') {
      let thing = e.msg.replace('#一键回收', '')
      for (let i of wupin) {
        if (thing == i) {
          wupin1.push(i)
          thing = thing.replace(i, '')
        }
      }
      if (thing.length == 0) {
        wupin = wupin1
      } else {
        return false
      }
    }
    for (let i of wupin) {
      for (let l of najie[i]) {
        //纳戒中the数量
        let thing_exist = await foundthing(l.name)
        if (thing_exist) {
          continue
        }
        await Add_najie_thing(usr_qq, l.name, l.class, -l.数量, l.pinji)
        if (l.class == '材料' || l.class == '草药') {
          lingshi += l.出售价 * l.数量
        } else {
          lingshi += l.出售价 * l.数量 * 2
        }
      }
    }
    await Add_money(usr_qq, lingshi)
    e.reply(`回收成功!  获得${lingshi}money `)
    return false
  }
  async locked(e) {
    let usr_qq = e.user_id
    //有无存档
    let ifexistplay = await existplayer(usr_qq)
    if (!ifexistplay) return false
    //命令判断
    let msg = e.msg.replace(/^(#|\/)/, '')
    let un_lock = msg.substr(0, 2)
    let thing = msg.substr(2).split('*')
    let thing_name = thing[0]
    let najie = await Read_najie(usr_qq)
    thing[0] = parseInt(thing[0])
    let thing_pinji
    //装备优化
    if (thing[0]) {
      if (thing[0] > 1000) {
        try {
          thing_name = najie.仙宠[thing[0] - 1001].name
        } catch {
          e.reply('仙宠代号输入有误!')
          return false
        }
      } else if (thing[0] > 100) {
        try {
          thing_name = najie.装备[thing[0] - 101].name
          thing[1] = najie.装备[thing[0] - 101].pinji
        } catch {
          e.reply('装备代号输入有误!')
          return false
        }
      }
    }
    let thing_exist = await foundthing(thing_name)
    if (!thing_exist) {
      e.reply(`你瓦特了吧，这方世界没有这样the东西:${thing_name}`)
      return false
    }
    let pj = {
      劣: 0,
      普: 1,
      优: 2,
      精: 3,
      极: 4,
      绝: 5,
      顶: 6
    }
    thing_pinji = pj[thing[1]]
    let ifexist
    if (un_lock == '锁定') {
      ifexist = await re_najie_thing(
        usr_qq,
        thing_name,
        thing_exist.class,
        thing_pinji,
        1
      )
      if (ifexist) {
        e.reply(`${thing_exist.class}:${thing_name}已锁定`)
        return false
      }
    } else if (un_lock == '解锁') {
      ifexist = await re_najie_thing(
        usr_qq,
        thing_name,
        thing_exist.class,
        thing_pinji,
        0
      )
      if (ifexist) {
        e.reply(`${thing_exist.class}:${thing_name}已解锁`)
        return false
      }
    }
    e.reply(`你没有【${thing_name}】这样the${thing_exist.class}`)
    return false
  }

  async all_tongbu(e) {
    await synchronization(e)
    await Synchronization_ASS(e)
    return false
  }
  //一键出售
  async Sell_all_comodities(e) {
    let usr_qq = e.user_id
    //有无存档
    let ifexistplay = await existplayer(usr_qq)
    if (!ifexistplay) return false
    let commodities_price = 0
    let najie = await data.getData('najie', usr_qq)
    let wupin = [
      '装备',
      '丹药',
      '道具',
      'skill',
      '草药',
      '材料',
      '仙宠',
      '仙宠口粮'
    ]
    let wupin1 = []
    if (e.msg != '#一键出售') {
      let thing = e.msg.replace('#一键出售', '')
      for (let i of wupin) {
        if (thing == i) {
          wupin1.push(i)
          thing = thing.replace(i, '')
        }
      }
      if (thing.length == 0) {
        wupin = wupin1
      } else {
        return false
      }
      for (let i of wupin) {
        for (let l of najie[i]) {
          if (l && l.islockd == 0) {
            //纳戒中the数量
            let quantity = l.数量
            await Add_najie_thing(usr_qq, l.name, l.class, -quantity, l.pinji)
            commodities_price = commodities_price + l.出售价 * quantity
          }
        }
      }
      await Add_money(usr_qq, commodities_price)
      e.reply(`出售成功!  获得${commodities_price}money `)
      return false
    }
    let goodsNum = 0
    let goods = []
    goods.push('正在出售:')
    for (let i of wupin) {
      for (let l of najie[i]) {
        if (l && l.islockd == 0) {
          //纳戒中the数量
          let quantity = l.数量
          goods.push('\n' + l.name + '*' + quantity)
          goodsNum++
        }
      }
    }
    if (goodsNum == 0) {
      e.reply('没有东西可以出售', false, { at: true })
      return false
    }
    goods.push('\n回复[1]出售,回复[0]取消出售')
    /** 设置上下文 */
    this.setContext('noticeSellAllGoods')
    for (let i = 0; i < goods.length; i += 8) {
      e.reply(goods.slice(i, i + 8), false, { at: true })
      await sleep(500)
    }
    /** 回复 */
    return false
  }
  async noticeSellAllGoods(e) {
    let reg = new RegExp(/^1$/)
    let new_msg = this.e.msg
    let difficulty = reg.exec(new_msg)
    if (!difficulty) {
      e.reply('已取消出售', false, { at: true })
      /** 结束上下文 */
      this.finish('noticeSellAllGoods')
      return false
    }
    /** 结束上下文 */
    this.finish('noticeSellAllGoods')
    /**出售*/

    let usr_qq = e.user_id
    //有无存档
    let najie = await data.getData('najie', usr_qq)
    let commodities_price = 0
    let wupin = [
      '装备',
      '丹药',
      '道具',
      'skill',
      '草药',
      '材料',
      '仙宠',
      '仙宠口粮'
    ]
    for (let i of wupin) {
      for (let l of najie[i]) {
        if (l && l.islockd == 0) {
          //纳戒中the数量
          let quantity = l.数量
          await Add_najie_thing(usr_qq, l.name, l.class, -quantity, l.pinji)
          commodities_price = commodities_price + l.出售价 * quantity
        }
      }
    }
    await Add_money(usr_qq, commodities_price)
    e.reply(`出售成功!  获得${commodities_price}money `)
    return false
  }

  //#(装备|服用|使用)物品*数量
  async all_xiuweidan(e) {
    let usr_qq = e.user_id
    //有无存档
    let ifexistplay = await existplayer(usr_qq)
    if (!ifexistplay) return false
    //检索方法
    let najie = await data.getData('najie', usr_qq)
    let xiuwei = 0
    for (let l of najie.丹药) {
      if (l.type == 'now_exp') {
        //纳戒中the数量
        let quantity = await exist_najie_thing(usr_qq, l.name, l.class)
        await Add_najie_thing(usr_qq, l.name, l.class, -quantity)
        xiuwei = xiuwei + l.exp * quantity
      }
    }
    await Add_now_exp(usr_qq, xiuwei)
    e.reply(`服用成功,now_exp增加${xiuwei}`)
    return false
  }

  //#(装备|服用|使用)物品*数量
  async all_xueqidan(e) {
    let usr_qq = e.user_id
    //有无存档
    let ifexistplay = await existplayer(usr_qq)
    if (!ifexistplay) return false

    //检索方法
    let najie = await data.getData('najie', usr_qq)
    let xueqi = 0
    for (let l of najie.丹药) {
      if (l.type == '血气') {
        //纳戒中the数量
        let quantity = await exist_najie_thing(usr_qq, l.name, l.class)
        await Add_najie_thing(usr_qq, l.name, l.class, -quantity)
        xueqi = xueqi + l.xueqi * quantity
      }
    }
    await Add_血气(usr_qq, xueqi)
    e.reply(`服用成功,血气增加${xueqi}`)
    return false
  }

  async all_learn(e) {
    let usr_qq = e.user_id
    //有无存档
    let ifexistplay = await existplayer(usr_qq)
    if (!ifexistplay) return false
    //检索方法
    let najie = await data.getData('najie', usr_qq)
    let gongfa = []
    let player = await Read_player(usr_qq)
    let name = ''
    for (let l of najie.skill) {
      let islearned = player.studytheskill.find((item) => item == l.name)
      if (!islearned) {
        await Add_najie_thing(usr_qq, l.name, 'skill', -1)
        await Add_player_studyskill(usr_qq, l.name)
        name = name + ' ' + l.name
      }
    }
    if (name) {
      e.reply(`你学会了${name},可以在【#我the炼体】中查看`)
    } else {
      e.reply('无新skill')
    }
    return false
  }
}
