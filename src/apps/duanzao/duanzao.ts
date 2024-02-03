import { __PATH } from '../../model/index.js'
import { AppName } from '../../../config.js'
import {
  looktripod,
  settripod,
  Read_mytripod,
  Read_tripod,
  Write_duanlu,
  readthat,
  readall,
  Restraint,
  getxuanze,
  mainyuansu,
  Writeit,
  Read_it,
  alluser
} from '../../model/duanzaofu.js'
import {
  existplayer,
  exist_najie_thing,
  Add_najie_thing,
  Add_职业经验,
  convert2integer,
  foundthing,
  Read_najie,
  Write_najie,
  Read_danyao,
  Write_danyao,
  Read_equipment
} from '../../model/index.js'
import { readdirSync } from 'fs'
import { plugin } from '../../../import.js'
export class duanzao extends plugin {
  constructor() {
    super({
      name: 'Yunzai_Bot_Occupation',
      dsc: '修仙模块',
      event: 'message',
      priority: 600,
      rule: [
        {
          reg: '^#炼器师能力评测',
          fnc: 'getmybook'
        },
        {
          reg: '^#熔炼.*$',
          fnc: 'givein'
        },
        {
          reg: '^#开始炼制',
          fnc: 'startit'
        },
        {
          reg: '^#开炉',
          fnc: 'openit'
        },
        {
          reg: '^#清空锻炉',
          fnc: 'clearthat'
        },
        {
          reg: '^#我the锻炉',
          fnc: 'mytript'
        },
        {
          reg: '^#赋名.*$',
          fnc: 'getnewname'
        },
        {
          reg: '^#全体清空锻炉',
          fnc: 'all_clearthat'
        },
        {
          reg: '^#神兵榜',
          fnc: 'bestfile'
        }
      ]
    })
  }
  async bestfile(e) {
    let wupin
    try {
      wupin = await Read_it()
    } catch {
      await Writeit([])
      wupin = await Read_it()
    }
    let newwupin = []
    const type = ['weapon', 'protective_clothing', 'magic_weapon']
    const nowTime = Date.now()
    // if 根本还没记录时间或者过了时间，就遍历生成，额外往wupin里添加owner_name（号）属性，并重写回去custom.json
    if (
      !(await redis.exists('xiuxian:bestfileCD')) ||
      (await redis.get('xiuxian:bestfileCD')) - nowTime > 30 * 60 * 1000
    ) {
      await redis.set('xiuxian:bestfileCD', nowTime)

      let all = await alluser()
      for (let [wpId, j] of wupin.entries()) {
        for (let i of all) {
          let najie = await Read_najie(i)
          const equ = await Read_equipment(i)
          let exist = najie.装备.find((item) => item.name == j.name)
          for (let m of type) {
            if (equ[m].name == j.name) {
              exist = 1
              break
            }
          }
          let D = '无门无派'
          let author = '神秘匠师'
          if (exist) {
            if (j.author_name) {
              const player = await data.getData('player', j.author_name)
              author = player.name
            }
            const usr_player = await data.getData('player', i)
            wupin[wpId].owner_name = i
            if (usr_player.宗门) D = usr_player.宗门.宗门名称
            newwupin.push({
              name: j.name,
              type: j.type,
              评分: Math.trunc(
                (j.atk * 1.2 + j.def * 1.5 + j.HP * 1.5) * 10000
              ),
              制作者: author,
              使用者: usr_player.name + '(' + D + ')'
            })
            break
          }
        }
      }
      await Writeit(wupin) // 重写custom.json
    }
    // 否则，直接按照custom.json记录the数据生成newwupin
    else {
      for (const wp of wupin) {
        let D = '无门无派'
        let author = '神秘匠师'
        if (wp.author_name) {
          const player = await data.getData('player', wp.author_name)
          author = player.name
        }
        const usr_player = await data.getData('player', wp.owner_name)
        if (usr_player.宗门) D = usr_player.宗门.宗门名称

        newwupin.push({
          name: wp.name,
          type: wp.type,
          评分: Math.trunc((wp.atk * 1.2 + wp.def * 1.5 + wp.HP * 1.5) * 10000),
          制作者: author,
          使用者: usr_player.name + '(' + D + ')'
        })
      }
    }

    // 让newwupin工作
    newwupin.sort(function (a, b) {
      return b.评分 - a.评分
    })
    if (newwupin[20] && newwupin[0].评分 == newwupin[20].评分) {
      let num = Math.floor((newwupin.length - 20) * Math.random())
      newwupin = newwupin.slice(num, num + 20)
    } else {
      newwupin = newwupin.slice(0, 20)
    }
    let bd_date = {
      newwupin
    }
    const data1 = await new Show().get_shenbing(bd_date)
    const tu = await puppeteer.screenshot('shenbing', {
      ...data1
    })
    e.reply(tu)
    return false
  }
  async all_clearthat(e) {
    if (!e.isMaster) return false
    await Write_duanlu([])
    let playerList = []
    let files = readdirSync(
      './plugins/' + AppName + '/resources/data/xiuxian_player'
    ).filter((file) => file.endsWith('.json'))
    for (let file of files) {
      file = file.replace('.json', '')
      playerList.push(file)
    }
    for (let player_id of playerList) {
      let action = null
      await redis.set(
        'xiuxian@1.4.0:' + player_id + ':action10',
        JSON.stringify(action)
      )
    }
    e.reply('清除完成')
    return false
  }
  async clearthat(e) {
    const user_qq = e.user_id //用户qq
    //有无存档
    if (!(await existplayer(user_qq))) return false
    const A = await looktripod(user_qq)
    if (A == 1) {
      let newtripod = await Read_tripod()
      for (let item of newtripod) {
        if (user_qq == item.qq) {
          item.材料 = []
          item.数量 = []
          item.TIME = 0
          item.时长 = 30000
          item.状态 = 0
          item.预计时长 = 0
          await Write_duanlu(newtripod)
          let action = null
          await redis.set(
            'xiuxian@1.4.0:' + user_qq + ':action10',
            JSON.stringify(action)
          )
          e.reply('材料成功清除')
          return false
        }
      }
    }
    return false
  }

  async getmybook(e) {
    const user_qq = e.user_id //用户qq
    //有无存档
    if (!(await existplayer(user_qq))) {
      return false
    }
    const player = await data.getData('player', user_qq)
    if (player.occupation != '炼器师') {
      e.reply(`你还不是炼器师哦,宝贝`)
      return false
    }
    if (player.锻造天赋) {
      e.reply(`您已经测评过了`)
      return false
    }
    const b = await settripod(user_qq)
    e.reply(b)
    return false
  }

  async givein(e) {
    const user_qq = e.user_id //用户qq
    //有无存档
    if (!(await existplayer(user_qq))) return false
    //不开放私聊
    //获取游戏状态
    const game_action = await redis.get(
      'xiuxian@1.4.0:' + user_qq + ':game_action'
    )
    //防止继续其他娱乐行为
    if (game_action == 0) {
      e.reply('修仙：游戏进行中...')
      return false
    }
    const A = await looktripod(user_qq)
    if (A != 1) {
      e.reply(`请先去#炼器师能力评测,再来煅炉吧`)
      return false
    }
    const player = await data.getData('player', user_qq)
    if (player.occupation != '炼器师') {
      e.reply(`切换到炼器师后再来吧,宝贝`)
      return false
    }
    let thing = e.msg.replace('#', '')
    thing = thing.replace('熔炼', '')
    const code = thing.split('*')
    const thing_name = code[0] //物品
    let thing_acount = code[1] //数量
    thing_acount = await convert2integer(thing_acount)
    const wupintype = await foundthing(thing_name)
    if (!wupintype || wupintype.type != '锻造') {
      e.reply(`凡界物品无法放入煅炉`)
      return false
    }
    let mynum = await exist_najie_thing(user_qq, thing_name, '材料')
    if (mynum < thing_acount) {
      e.reply(`材料不足,无法放入`)
      return false
    }

    //开始放入

    const tripod = await Read_mytripod(user_qq)
    if (tripod.状态 == 1) {
      e.reply(`正在炼制中,无法熔炼更多材料`)
      return false
    }
    let num1 = 0
    if (player.仙宠.type == '炼器') {
      num1 = Math.trunc(player.仙宠.等级 / 33)
    }
    let num = 0
    for (let item in tripod.数量) {
      num += Number(tripod.数量[item])
    }
    let dyew = 0
    let dy = await Read_danyao(user_qq)
    if (dy.beiyong5 > 0) {
      dyew = dy.beiyong5
    }
    const shengyu =
      dyew +
      tripod.容纳量 +
      num1 +
      Math.floor(player.occupation_level / 2) -
      num -
      Number(thing_acount)
    if (
      num + Number(thing_acount) >
      tripod.容纳量 + dyew + num1 + Math.floor(player.occupation_level / 2)
    ) {
      e.reply(`该煅炉当前只能容纳[${shengyu + Number(thing_acount)}]物品`)
      return false
    }
    let newtripod
    try {
      newtripod = await Read_tripod()
    } catch {
      await Write_duanlu([])
      newtripod = await Read_tripod()
    }
    for (let item of newtripod) {
      if (user_qq == item.qq) {
        item.材料.push(thing_name)
        item.数量.push(thing_acount)
        await Write_duanlu(newtripod)
        await Add_najie_thing(user_qq, thing_name, '材料', -thing_acount)
        const yongyou = num + Number(thing_acount)
        e.reply(
          `熔炼成功,当前煅炉内拥有[${yongyou}]个材料,根据您现有等级,您还可以放入[${shengyu}]个材料`
        )
        return false
      }
    }
  }

  async startit(e) {
    let user_qq = e.user_id
    if (!(await existplayer(user_qq))) return false
    const A = await looktripod(user_qq)
    if (A != 1) {
      e.reply(`请先去#炼器师能力评测,再来锻造吧`)
      return false
    }

    let newtripod
    try {
      newtripod = await Read_tripod()
    } catch {
      await Write_duanlu([])
      newtripod = await Read_tripod()
    }
    for (let item of newtripod) {
      if (user_qq == item.qq) {
        if (item.材料.length == 0) {
          e.reply(`炉子为空,无法炼制`)
          return false
        }
        let action = await redis.get('xiuxian@1.4.0:' + user_qq + ':action10')
        action = JSON.parse(action)
        if (action != null) {
          //人物有动作查询动作结束时间
          let action_end_time = action.end_time
          let now_time = new Date().getTime()
          if (now_time <= action_end_time) {
            let m = parseInt((action_end_time - now_time) / 1000 / 60)
            let s = parseInt(
              (action_end_time - now_time - m * 60 * 1000) / 1000
            )
            e.reply(
              '正在' + action.action + '中，剩余时间:' + m + '分' + s + '秒'
            )
            return false
          }
        }
        item.状态 = 1
        item.TIME = Date.now()
        await Write_duanlu(newtripod)
        let action_time = 180 * 60 * 1000 //持续时间，单位毫秒
        let arr = {
          action: '锻造', //动作
          end_time: new Date().getTime() + action_time, //结束时间
          time: action_time //持续时间
        }
        let dy = await Read_danyao(user_qq)
        if (dy.xingyun >= 1) {
          dy.xingyun--
          if (dy.xingyun == 0) {
            dy.beiyong5 = 0
          }
        }
        await Write_danyao(user_qq, dy)
        await redis.set(
          'xiuxian@1.4.0:' + user_qq + ':action10',
          JSON.stringify(arr)
        ) //redis设置动作
        e.reply(`现在开始锻造weapon,最少需锻造30分钟,高级装备需要更多温养时间`)
        return false
      }
    }
  }
  async openit(e) {
    let user_qq = e.user_id
    //有无存档
    if (!(await existplayer(user_qq))) return false
    const A = await looktripod(user_qq)
    if (A != 1) {
      e.reply(`请先去#炼器师能力评测,再来锻造吧`)
      return false
    }
    let newtripod
    const player = await data.getData('player', user_qq)
    if (player.occupation != '炼器师') {
      e.reply(`切换到炼器师后再来吧,宝贝`)
      return false
    }
    try {
      newtripod = await Read_tripod()
    } catch {
      await Write_duanlu([])
      newtripod = await Read_tripod()
    }
    for (let item of newtripod) {
      if (user_qq == item.qq) {
        if (item.TIME == 0) {
          e.reply(`煅炉里面空空如也,也许自己还没有启动它`)
          return false
        }
        //属性变化系数
        let xishu = 1
        //判断时间是否正确
        const newtime = Date.now() - item.TIME
        if (newtime < 1000 * 60 * 30) {
          e.reply(`炼制时间过短,无法获得装备,再等等吧`)
          return false
        }
        //关闭状态

        let action = await redis.get('xiuxian@1.4.0:' + user_qq + ':action10')
        action = JSON.parse(action)

        //判断属性九维值
        let cailiao
        let jiuwei = [0, 0, 0, 0, 0, 0, 0, 0, 0]
        for (let newitem in item.材料) {
          cailiao = await readthat(item.材料[newitem], '锻造材料')
          jiuwei[0] += cailiao.攻 * item.数量[newitem]
          jiuwei[1] += cailiao.防 * item.数量[newitem]
          jiuwei[2] += cailiao.血 * item.数量[newitem]
          jiuwei[3] += cailiao.暴 * item.数量[newitem]
          jiuwei[4] += cailiao.金 * item.数量[newitem]
          jiuwei[5] += cailiao.木 * item.数量[newitem]
          jiuwei[6] += cailiao.土 * item.数量[newitem]
          jiuwei[7] += cailiao.水 * item.数量[newitem]
          jiuwei[8] += cailiao.火 * item.数量[newitem]
        }

        let newrandom = Math.random()
        let xuanze = ['锻造weapon', '锻造protective_clothing', '锻造宝物']
        let weizhi
        let wehizhi1
        if (jiuwei[0] > jiuwei[1] * 2) {
          weizhi = xuanze[0]
          wehizhi1 = 'weapon'
        } else if (jiuwei[0] * 2 < jiuwei[1]) {
          weizhi = xuanze[1]
          wehizhi1 = 'protective_clothing'
        } else if (newrandom > 0.8) {
          weizhi = xuanze[2]
          wehizhi1 = 'magic_weapon'
        } else if (jiuwei[0] > jiuwei[1]) {
          weizhi = xuanze[0]
          wehizhi1 = 'weapon'
        } else {
          weizhi = xuanze[1]
          wehizhi1 = 'protective_clothing'
        }

        //寻找符合标准the装备
        const newwupin = await readall(weizhi)
        let bizhi = []

        for (let item2 in newwupin) {
          bizhi[item2] = Math.abs(
            newwupin[item2].atk -
              jiuwei[0] +
              newwupin[item2].def -
              jiuwei[1] +
              newwupin[item2].HP -
              jiuwei[2]
          )
        }
        let min = bizhi[0]
        let new1
        for (let item3 in bizhi) {
          if (min >= bizhi[item3]) {
            min = bizhi[item3]
            new1 = item3
          }
        }
        const wuqiname = newwupin[new1].name
        const num = jiuwei[0] + jiuwei[1] + jiuwei[2]
        //计算所用时间(毫秒)带来the收益
        const overtime = (80 * num + 10) * 1000 * 60
        const nowtime = Math.abs((overtime - newtime) / 1000 / 60)
        if (nowtime < 2) {
          xishu += 0.1
        } else if (nowtime > 8) {
          xishu -= 0.1
        } else if (nowtime > 12) {
          xishu -= 0.2
        } else {
          xishu -= 0.25
        }
        let houzhui
        //计算五维收益
        let i
        let qianzhui = 0
        const wuwei = [jiuwei[4], jiuwei[5], jiuwei[6], jiuwei[7], jiuwei[8]]
        const wuxing = ['金', '木', '土', '水', '火']
        let max = wuwei[0]
        let shuzu = [wuwei[0]]
        for (i = 0; i < wuwei.length; i++) {
          if (max < wuwei[i]) {
            max = wuwei[i]
            shuzu = [wuxing[i]]
          } else if (max == wuwei[i]) {
            shuzu.push(wuxing[i])
          }
          if (wuwei[i] != 0) {
            qianzhui++
          }
        }
        max = await getxuanze(shuzu, player.hide_talent.type)
        let fangyuxuejian = 0
        if (qianzhui == 5) {
          houzhui = '五行杂灵'
          xishu += 0.1
        } else if (qianzhui == 4) {
          houzhui = '四圣显化'
          xishu += 0.07
        } else if (qianzhui == 3) {
          houzhui = '三灵共堂'
          xishu += 0.05
        } else if (qianzhui == 2) {
          const shuzufu = await Restraint(wuwei, max[0])
          houzhui = shuzufu[0]
          xishu += shuzufu[1]
          if (shuzufu[1] == 0.5) {
            fangyuxuejian = 0.5
          }
        } else if (qianzhui == 1) {
          const mu = await mainyuansu(wuwei)
          houzhui = '纯' + mu
          xishu += 0.15
        }
        const newtime1 = Date.now() - Math.floor(Date.now() / 1000) * 1000
        const sum = jiuwei[0] + jiuwei[1] + jiuwei[2]
        const zhuangbei = {
          id: max[1],
          name: wuqiname + '·' + houzhui + newtime1,
          class: '装备',
          type: wehizhi1,
          atk: Math.floor(jiuwei[0] * xishu * 1000) / 1000,
          def: Math.floor(jiuwei[1] * (xishu - fangyuxuejian) * 1000) / 1000,
          HP: Math.floor(jiuwei[2] * xishu * 1000) / 1000,
          bao: Math.floor(jiuwei[3] * 1000) / 1000,
          author_name: player.id,
          出售价: Math.floor(1000000 * sum)
        }
        await Add_najie_thing(user_qq, zhuangbei, '装备', 1)
        //计算经验收益

        //talent影响值
        let v =
          player.hide_talent.控器 /
          (Math.abs(max[1] - player.hide_talent.type) + 5)
        //天赋影响值
        let k = ((player.锻造天赋 + 100) * v) / 200 + 1
        //基础值
        let z = Math.floor(sum * 1000 * 0.7 * k + 200)
        if (sum >= 0.9) {
          z += 2000
        } else if (sum >= 0.7) {
          z += 1000
        }
        if (player.仙宠.type == '炼器') {
          z = Math.floor(z * (1 + (player.仙宠.等级 / 25) * 0.1))
        }
        Add_职业经验(user_qq, z)
        //关闭所有状态
        item.状态 = 0
        item.TIME = 0
        item.材料 = []
        item.数量 = []
        await Write_duanlu(newtripod)
        //清除时间
        action = new Date().getTime()
        await redis.set(
          'xiuxian@1.4.0:' + user_qq + ':action10',
          JSON.stringify(action)
        )
        e.reply(`恭喜你获得了[${wuqiname}·${houzhui}],炼器经验增加了[${z}]`)
        return false
      }
    }
  }
  async mytript(e) {
    const user_qq = e.user_id
    if (!(await existplayer(user_qq))) return false
    const A = await looktripod(user_qq)
    if (A != 1) {
      e.reply(`请先去#炼器师能力评测,再来煅炉吧`)
      return false
    }

    let a = await Read_mytripod(user_qq)

    if (a.材料 == []) {
      e.reply(`锻炉里空空如也,没什么好看the`)
      return false
    }
    let shuju = []
    let shuju2 = []
    let xuanze = 0
    let b = '您the锻炉里,拥有\n'
    for (let item in a.材料) {
      for (let item1 in shuju) {
        if (shuju[item1] == a.材料[item]) {
          shuju2[item1] = shuju2[item1] * 1 + a.数量[item] * 1
          xuanze = 1
        }
      }
      if (xuanze == 0) {
        shuju.push(a.材料[item])
        shuju2.push(a.数量[item])
      } else {
        xuanze = 0
      }
      //不要问我为啥不在前面优化，问就是懒，虽然确实前面优化会加快机器人反应速度
    }
    for (let item2 in shuju) {
      b += shuju[item2] + shuju2[item2] + '个\n'
    }
    e.reply(b)
    return false
  }

  async getnewname(e) {
    const user_qq = e.user_id //用户qq
    if (!(await existplayer(user_qq))) return false
    let thing = e.msg.replace('#', '')
    thing = thing.replace('赋名', '')
    const code = thing.split('*')
    const thing_name = code[0] //原物品
    let new_name = code[1] //新名字
    const thingnum = await exist_najie_thing(user_qq, thing_name, '装备')
    if (!thingnum) {
      e.reply(`你没有这件装备`)
      return false
    }
    const newname = await foundthing(new_name)
    if (newname) {
      e.reply(`这个世间已经拥有这把weapon了`)
      return false
    }
    if (newname.length > 8) {
      e.reply('字符超出最大限制,请重新赋名')
      return false
    }
    let A
    try {
      A = await Read_it()
    } catch {
      await Writeit([])
      A = await Read_it()
    }
    for (let item of A) {
      if (item.name == thing_name) {
        e.reply(`一个装备只能赋名一次`)
        return false
      }
    }
    const thingall = await Read_najie(user_qq)

    for (let item of thingall.装备) {
      if (item.name == thing_name) {
        if (item.atk < 10 && item.def < 10 && item.HP < 10) {
          if (
            item.atk >= 1.5 ||
            item.def >= 1.2 ||
            (item.type == 'magic_weapon' && (item.atk >= 1 || item.def >= 1)) ||
            item.atk + item.def > 1.95
          ) {
            item.name = new_name
            A.push(item)
            await Write_najie(user_qq, thingall)
            await Writeit(A)
            e.reply(`附名成功,您the${thing_name}更名为${new_name}`)
            return false
          }
        }
      }
    }
    e.reply(`您the装备太弱了,无法赋予名字`)
    return false
  }
}
