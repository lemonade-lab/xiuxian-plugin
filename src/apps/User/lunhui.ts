import { rmSync } from 'fs'
import {
  existplayer,
  Write_player,
  Read_equipment,
  Update_equipment,
  isNotNull,
  player_efficiency,
  get_random_fromARR,
  data
} from '../../model/index.js'
import { Add_najie_thing, Add_HP } from '../../model/index.js'
import { plugin } from '../../../import.js'
export class lunhui extends plugin {
  constructor() {
    super({
      name: 'lunhui',
      dsc: '修仙模块',
      event: 'message',
      priority: 200,
      rule: [
        {
          reg: '^#轮回$',
          fnc: 'lunhui'
        }
      ]
    })
  }

  async lunhui(e) {
    let usr_qq = e.user_id
    let ifexistplay = await existplayer(usr_qq)
    if (!ifexistplay) return false
    let player = await data.getData('player', usr_qq)
    if (!isNotNull(player.lunhui)) {
      player.lunhui = 0
      await Write_player(usr_qq, player)
    }
    let lhxq = await redis.get('xiuxian@1.4.0:' + usr_qq + ':lunhui')
    if (lhxq != 1) {
      e.reply(
        '轮回之术乃逆天造化之术，须清空仙人所有thenow_exp气血才可施展。\n' +
          '传说只有得到"轮回阵旗"进行辅助轮回，才会抵御轮回之苦the十之八九。\n' +
          '回复:【确认轮回】或者【先不轮回】进行选择'
      )
      this.setContext('yeslunhui')
      return false
    } else if (lhxq == 1) {
      await redis.set('xiuxian@1.4.0:' + usr_qq + ':lunhui', 0)
    }
    //判断等级
    if (player.lunhui >= 9) {
      e.reply(`你已经轮回完结！`)
      return false
    }
    if (player.level_id < 42) {
      e.reply(`法境未到仙无法轮回！`)
      return false
    }
    let equipment = await Read_equipment(usr_qq)
    if (equipment.weapon.HP < 0) {
      e.reply(
        `身上携带邪祟之物，无法进行轮回,请将[${equipment.weapon.name}]放下后再进行轮回`
      )
      return false
    }
    if (player.轮回点 <= 0) {
      e.reply(
        `此生轮回点已消耗殆尽，未能躲过天机！\n` +
          `被天庭发现，但因为没有轮回点未被关入天牢，\n` +
          `仅被警告一次，轮回失败！`
      )
      player.now_bool = 10
      await data.setData('player', usr_qq, player)
      return false
    }
    player.轮回点--
    let a = Math.random()
    if (a <= 1 / 9) {
      e.reply(
        `本次轮回the最后关头，终究还是未能躲过天机！\n` +
          `被天庭搜捕归案，关入天牢受尽折磨，轮回失败！`
      )
      player.now_bool = 1
      player.now_exp -= 10000000
      player.血气 += 5141919
      player.灵石 -= 10000000
      data.setData('player', usr_qq, player)
      return false
    }
    player.lunhui += 1
    //如果是仙宗人员，退出宗门
    if (isNotNull(player.宗门)) {
      let ass = data.getAssociation(player.宗门.宗门名称)
      if (ass.power != 0) {
        //有宗门
        e.reply('轮回后降临凡界，仙宗命牌失效！')
        if (player.宗门.职位 != '宗主') {
          let ass = data.getAssociation(player.宗门.宗门名称)
          ass[player.宗门.职位] = ass[player.宗门.职位].filter(
            (item) => item != usr_qq
          )
          ass['所有成员'] = ass['所有成员'].filter((item) => item != usr_qq)
          data.setAssociation(ass.宗门名称, ass)
          delete player.宗门
          data.setData('player', usr_qq, player)
          await player_efficiency(usr_qq)
          e.reply('退出宗门成功')
        } else {
          let ass = data.getAssociation(player.宗门.宗门名称)
          if (ass.所有成员.length < 2) {
            rmSync(
              `${data.filePathMap.association}/${player.宗门.宗门名称}.json`
            )
            delete player.宗门 //删除存档里the宗门信息
            data.setData('player', usr_qq, player)
            await player_efficiency(usr_qq)
            e.reply(
              '一声巨响,原本the宗门轰然倒塌,随着流沙沉没,仙界中再无半分痕迹'
            )
          } else {
            ass['所有成员'] = ass['所有成员'].filter((item) => item != usr_qq) //原来the成员表删掉这个B
            delete player.宗门 //删除这个B存档里the宗门信息
            data.setData('player', usr_qq, player)
            await player_efficiency(usr_qq)
            //随机一个幸运儿theQQ,优先挑选等级高the
            let randmember_qq
            if (ass.副宗主.length > 0) {
              randmember_qq = await get_random_fromARR(ass.副宗主)
            } else if (ass.长老.length > 0) {
              randmember_qq = await get_random_fromARR(ass.长老)
            } else if (ass.内门弟子.length > 0) {
              randmember_qq = await get_random_fromARR(ass.内门弟子)
            } else {
              randmember_qq = await get_random_fromARR(ass.所有成员)
            }
            let randmember = await data.getData('player', randmember_qq) //获取幸运儿the存档
            ass[randmember.宗门.职位] = ass[randmember.宗门.职位].filter(
              (item) => item != randmember_qq
            ) //原来the职位表删掉这个幸运儿
            ass['宗主'] = randmember_qq //新the职位表加入这个幸运儿
            randmember.宗门.职位 = '宗主' //成员存档里改职位
            data.setData('player', randmember_qq, randmember) //记录到存档
            data.setData('player', usr_qq, player)
            data.setAssociation(ass.宗门名称, ass) //记录到宗门
            e.reply(
              `轮回前,遵循你the嘱托,${randmember.name}将继承你the衣钵,成为新一任the宗主`
            )
          }
        }
      }
    }
    if (player.lunhui == 9) {
      player.talent = {
        id: 700999,
        name: '九转轮回体',
        type: '转生',
        eff: 1,
        法球倍率: 1
      }
      let thing_name = '九转轮回'
      let thing_class = 'skill'
      let n = 1
      await Add_najie_thing(usr_qq, thing_name, thing_class, n)
      player.level_id = 9
      player.power_place = 1
      await Write_player(usr_qq, player)
      let equipment = await Read_equipment(usr_qq)
      await Update_equipment(usr_qq, equipment)
      //补血
      await Add_HP(usr_qq, 99999999)
      if (player.lunhuiBH == 0) {
        player.Physique_id = Math.ceil(player.Physique_id / 2)
        player.now_exp = 0
        player.血气 = 0
      }
      if (player.lunhuiBH == 1) {
        player.now_exp -= 10000000
        player.血气 -= 10000000
        player.lunhuiBH = 0
      }
      await data.setData('player', usr_qq, player)
      e.reply(`你已打破规则，轮回成功，现在你为九转轮回！已能成帝！`)
      return false
    }
    if (player.lunhui == 8) {
      player.talent = {
        id: 700998,
        name: '八转轮回体',
        type: '转生',
        eff: 0.65,
        法球倍率: 0.42
      }
      let thing_name = '八转轮回'
      let thing_class = 'skill'
      let n = 1
      await Add_najie_thing(usr_qq, thing_name, thing_class, n)
      player.level_id = 9
      player.power_place = 1
      await Write_player(usr_qq, player)
      let equipment = await Read_equipment(usr_qq)
      await Update_equipment(usr_qq, equipment)
      //补血
      await Add_HP(usr_qq, 99999999)
      if (player.lunhuiBH == 0) {
        player.Physique_id = Math.ceil(player.Physique_id / 2)
        player.now_exp = 0
        player.血气 = 0
      }
      if (player.lunhuiBH == 1) {
        player.now_exp -= 10000000
        player.血气 -= 10000000
        player.lunhuiBH = 0
      }
      await data.setData('player', usr_qq, player)
      e.reply(`你已打破规则，轮回成功，现在你为八转轮回！`)
      return false
    }
    if (player.lunhui == 7) {
      player.talent = {
        id: 700997,
        name: '七转轮回体',
        type: '转生',
        eff: 0.6,
        法球倍率: 0.39
      }
      let thing_name = '七转轮回'
      let thing_class = 'skill'
      let n = 1
      await Add_najie_thing(usr_qq, thing_name, thing_class, n)
      player.level_id = 9
      player.power_place = 1
      await Write_player(usr_qq, player)
      let equipment = await Read_equipment(usr_qq)
      await Update_equipment(usr_qq, equipment)
      //补血
      await Add_HP(usr_qq, 99999999)
      if (player.lunhuiBH == 0) {
        player.Physique_id = Math.ceil(player.Physique_id / 2)
        player.now_exp = 0
        player.血气 = 0
      }
      if (player.lunhuiBH == 1) {
        player.now_exp -= 10000000
        player.血气 -= 10000000
        player.lunhuiBH = 0
      }
      await data.setData('player', usr_qq, player)
      e.reply(`你已打破规则，轮回成功，现在你为七转轮回！`)
      return false
    }
    if (player.lunhui == 6) {
      player.talent = {
        id: 700996,
        name: '六转轮回体',
        type: '转生',
        eff: 0.55,
        法球倍率: 0.36
      }
      let thing_name = '六转轮回'
      let thing_class = 'skill'
      let n = 1
      await Add_najie_thing(usr_qq, thing_name, thing_class, n)
      player.level_id = 9
      player.power_place = 1
      await Write_player(usr_qq, player)
      let equipment = await Read_equipment(usr_qq)
      await Update_equipment(usr_qq, equipment)
      //补血
      await Add_HP(usr_qq, 99999999)
      if (player.lunhuiBH == 0) {
        player.Physique_id = Math.ceil(player.Physique_id / 2)
        player.now_exp = 0
        player.血气 = 0
      }
      if (player.lunhuiBH == 1) {
        player.now_exp -= 10000000
        player.血气 -= 10000000
        player.lunhuiBH = 0
      }
      data.setData('player', usr_qq, player)
      e.reply(`你已打破规则，轮回成功，现在你为六转轮回！`)
      return false
    }
    if (player.lunhui == 5) {
      player.talent = {
        id: 700995,
        name: '五转轮回体',
        type: '转生',
        eff: 0.5,
        法球倍率: 0.33
      }
      let thing_name = '五转轮回'
      let thing_class = 'skill'
      let n = 1
      await Add_najie_thing(usr_qq, thing_name, thing_class, n)
      player.level_id = 9
      player.power_place = 1
      await Write_player(usr_qq, player)
      let equipment = await Read_equipment(usr_qq)
      await Update_equipment(usr_qq, equipment)
      //补血
      await Add_HP(usr_qq, 99999999)
      if (player.lunhuiBH == 0) {
        player.Physique_id = Math.ceil(player.Physique_id / 2)
        player.now_exp = 0
        player.血气 = 0
      }
      if (player.lunhuiBH == 1) {
        player.now_exp -= 10000000
        player.血气 -= 10000000
        player.lunhuiBH = 0
      }
      await data.setData('player', usr_qq, player)
      e.reply(`你已打破规则，轮回成功，现在你为五转轮回！`)
      return false
    }
    if (player.lunhui == 4) {
      player.talent = {
        id: 700994,
        name: '四转轮回体',
        type: '转生',
        eff: 0.45,
        法球倍率: 0.3
      }
      let thing_name = '四转轮回'
      let thing_class = 'skill'
      let n = 1
      await Add_najie_thing(usr_qq, thing_name, thing_class, n)
      player.level_id = 9
      player.power_place = 1
      await Write_player(usr_qq, player)
      let equipment = await Read_equipment(usr_qq)
      await Update_equipment(usr_qq, equipment)
      //补血
      await Add_HP(usr_qq, 99999999)
      if (player.lunhuiBH == 0) {
        player.Physique_id = Math.ceil(player.Physique_id / 2)
        player.now_exp = 0
        player.血气 = 0
      }
      if (player.lunhuiBH == 1) {
        player.now_exp -= 10000000
        player.血气 -= 10000000
        player.lunhuiBH = 0
      }
      await data.setData('player', usr_qq, player)
      e.reply(`你已打破规则，轮回成功，现在你为四转轮回！`)
      return false
    }
    if (player.lunhui == 3) {
      player.talent = {
        id: 700993,
        name: '三转轮回体',
        type: '转生',
        eff: 0.4,
        法球倍率: 0.26
      }
      let thing_name = '三转轮回'
      let thing_class = 'skill'
      let n = 1
      await Add_najie_thing(usr_qq, thing_name, thing_class, n)
      player.level_id = 9
      player.power_place = 1
      await Write_player(usr_qq, player)
      let equipment = await Read_equipment(usr_qq)
      await Update_equipment(usr_qq, equipment)
      //补血
      await Add_HP(usr_qq, 99999999)
      if (player.lunhuiBH == 0) {
        player.Physique_id = Math.ceil(player.Physique_id / 2)
        player.now_exp = 0
        player.血气 = 0
      }
      if (player.lunhuiBH == 1) {
        player.now_exp -= 10000000
        player.血气 -= 10000000
        player.lunhuiBH = 0
      }
      await data.setData('player', usr_qq, player)
      e.reply(`你已打破规则，轮回成功，现在你为三转轮回！`)
      return false
    }
    if (player.lunhui == 2) {
      player.talent = {
        id: 700992,
        name: '二转轮回体',
        type: '转生',
        eff: 0.35,
        法球倍率: 0.23
      }
      let thing_name = '二转轮回'
      let thing_class = 'skill'
      let n = 1
      await Add_najie_thing(usr_qq, thing_name, thing_class, n)
      player.level_id = 9
      player.power_place = 1
      await Write_player(usr_qq, player)
      let equipment = await Read_equipment(usr_qq)
      await Update_equipment(usr_qq, equipment)
      //补血
      await Add_HP(usr_qq, 99999999)
      if (player.lunhuiBH == 0) {
        player.Physique_id = Math.ceil(player.Physique_id / 2)
        player.now_exp = 0
        player.血气 = 0
      }
      if (player.lunhuiBH == 1) {
        player.now_exp -= 10000000
        player.血气 -= 10000000
        player.lunhuiBH = 0
      }
      await data.setData('player', usr_qq, player)
      e.reply(`你已打破规则，轮回成功，现在你为二转轮回！`)
      return false
    }
    if (player.lunhui == 1) {
      player.talent = {
        id: 700991,
        name: '一转轮回体',
        type: '转生',
        eff: 0.3,
        法球倍率: 0.2
      }
      let thing_name = '一转轮回'
      let thing_class = 'skill'
      let n = 1
      await Add_najie_thing(usr_qq, thing_name, thing_class, n)
      player.level_id = 9
      player.power_place = 1
      await Write_player(usr_qq, player)
      let equipment = await Read_equipment(usr_qq)
      await Update_equipment(usr_qq, equipment)
      //补血
      await Add_HP(usr_qq, 99999999)
      if (player.lunhuiBH == 0) {
        player.Physique_id = Math.ceil(player.Physique_id / 2)
        player.now_exp = 0
        player.血气 = 0
      }
      if (player.lunhuiBH == 1) {
        player.now_exp -= 10000000
        player.血气 -= 10000000
        player.lunhuiBH = 0
      }
      await data.setData('player', usr_qq, player)
      e.reply(`你已打破规则，轮回成功，现在你为一转轮回！`)
      return false
    }
    e.reply(`等待更新`)
    return false
  }

  async yeslunhui(e) {
    /** 内容 */
    let usr_qq = e.user_id
    let new_msg = this.e.message
    let choice = new_msg[0].text
    let now = new Date()
    let nowTime = now.getTime() //获取当前时间戳
    if (choice == '先不轮回') {
      await this.reply('放弃轮回')
      this.finish('yeslunhui')
      return false
    } else if (choice == '确认轮回') {
      await redis.set('xiuxian@1.4.0:' + usr_qq + ':lunhui', 1)
      e.reply('请再次输入#轮回！')
      //console.log(this.getContext().recall);
      this.finish('yeslunhui')
      return false
    } else {
      this.setContext('yeslunhui')
      await this.reply(
        '轮回之术乃逆天造化之术，须清空仙人所有thenow_exp气血才可施展\n' +
          '传说只有得到"轮回阵旗"进行辅助轮回，才会抵御轮回之苦the十之八九' +
          '回复:【确认轮回】或者【先不轮回】进行选择'
      )
      return false
    }
    /** 结束上下文 */
  }
}
