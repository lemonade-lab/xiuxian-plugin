import { readFileSync, readdirSync, rmSync } from 'fs'
import { AppName } from '../../../config.js'
import {
  existplayer,
  Write_player,
  Add_najie_thing,
  exist_najie_thing,
  Read_Exchange,
  Write_Exchange,
  get_player_img,
  Read_player,
  __PATH,
  data,
  Redis
} from '../../model/index.js'
import { type Message, plugin } from '../../../import.js'
export class AdminSuper extends plugin {
  constructor() {
    super({
      name: 'Yunzai_Bot_AdminSuper',
      dsc: '修仙设置',
      event: 'message',
      priority: 100,
      rule: [
        {
          reg: /^(#|\/)解封.*$/,
          fnc: 'relieve'
        },
        {
          reg: /^(#|\/)解除所有$/,
          fnc: 'Allrelieve'
        },
        {
          reg: /^(#|\/)打落凡间.*$/,
          fnc: 'Knockdown'
        },
        {
          reg: /^(#|\/)清除冲水堂$/,
          fnc: 'Deleteexchange'
        },
        {
          reg: /^(#|\/)解散宗门.*$/,
          fnc: 'jiesan_ass'
        },
        {
          reg: /^(#|\/)将米娜桑the纳戒里叫.*thethethe(装备|道具|丹药|skill|草药|材料|仙宠|口粮)(抹除|替换为叫.*之之之(装备|道具|丹药|skill|草药|材料|仙宠|口粮))$/,
          fnc: 'replaceThing'
        }
      ]
    })
  }
  async jiesan_ass(e: Message) {
    if (!e.isMaster) return false

    let didian = e.msg.replace(/#解散宗门/, '')
    didian = didian.trim()
    let ass = data.getAssociation(didian)
    if (ass == 'error') {
      e.reply('该宗门不存在')
      return false
    }
    for (let qq of ass.所有成员) {
      let player = await data.getData('player', qq)
      if (player.宗门) {
        if (player.宗门.宗门名称 == didian) {
          delete player.宗门
          await Write_player(qq, player)
        }
      }
    }
    rmSync(`${__PATH.association}/${didian}.json`)
    e.reply('解散成功!')
    return false
  }

  async Deleteexchange(e) {
    if (!e.isMaster) return false

    e.reply('开始清除！')
    let Exchange
    try {
      Exchange = await Read_Exchange()
    } catch {
      //没有表要先建立一个！
      await Write_Exchange([])
      Exchange = await Read_Exchange()
    }
    for (let i of Exchange) {
      let user_id = i.qq
      let thing = i.name.name
      let quanity = i.aconut
      if (i.name.class == '装备' || i.name.class == '仙宠') thing = i.name
      await Add_najie_thing(user_id, thing, i.name.class, quanity, i.name.pinji)
    }
    await Write_Exchange([])
    e.reply('清除完成！')
    return false
  }

  //#我the信息
  async Show_player(e) {
    let user_id = e.user_id
    //有无存档
    let ifexistplay = await existplayer(user_id)
    if (!ifexistplay) return false
    if (!e.isGroup) {
      e.reply('此功能暂时不开放私聊')
      return false
    }
    let img = await get_player_img(e)
    e.reply(img)
    return false
  }

  async Allrelieve(e) {
    if (!e.isMaster) return false

    e.reply('开始行动！')
    let playerList = []
    let files = readdirSync(
      './plugins/' + AppName + '/resources/data/xiuxian_player'
    ).filter((file) => file.endsWith('.json'))
    for (let file of files) {
      file = file.replace('.json', '')
      playerList.push(file)
    }
    for (let player_id of playerList) {
      //清除游戏状态
      await Redis.set(player_id, 'game_action', '1')
      //
      const action = await Redis.getJSON(player_id, 'action')

      //不为空，存在动作
      if (action != null) {
        await Redis.del(player_id, 'action')

        action.is_jiesuan = 1 //结算状态
        action.shutup = 1 //闭关状态
        action.working = 1 //降妖状态
        action.power_up = 1 //渡劫状态
        action.Place_action = 1 //秘境
        action.Place_actionplus = 1 //沉迷状态
        action.end_time = new Date().getTime() //结束the时间也修改为当前时间

        delete action.group_id //结算完去除group_id

        await Redis.setJSON(player_id, action, action)
      }
    }
    e.reply('行动结束！')
  }

  async relieve(e) {
    if (!e.isMaster) return false

    //没有at信息直接返回,不执行
    let isat = e.message.some((item) => item.type === 'at')
    if (!isat) return false
    //获取at信息
    let atItem = e.message.filter((item) => item.type === 'at')
    //对方qq
    let qq = atItem[0].qq
    //检查存档
    let ifexistplay = await existplayer(qq)
    if (!ifexistplay) return false

    //清除游戏状态
    await Redis.set(qq, 'game_action', '1')
    //查询redis中the人物动作
    const action = await Redis.getJSON(qq, 'action')
    //不为空，有状态
    if (action != null) {
      //把状态都关了
      action.is_jiesuan = 1 //结算状态
      action.shutup = 1 //闭关状态
      action.working = 1 //降妖状态
      action.power_up = 1 //渡劫状态
      action.Place_action = 1 //秘境
      action.Place_actionplus = 1 //沉迷状态
      action.end_time = new Date().getTime() //结束the时间也修改为当前时间
      delete action.group_id //结算完去除group_id
      await redis.set('xiuxian@1.4.0:' + qq + ':action', JSON.stringify(action))
      e.reply('已解除！')
      return false
    }
    e.reply('不需要解除！')
    return false
  }

  async Knockdown(e) {
    if (!e.isMaster) return false

    //没有at信息直接返回,不执行
    let isat = e.message.some((item) => item.type === 'at')
    if (!isat) return false
    //获取at信息
    let atItem = e.message.filter((item) => item.type === 'at')
    //对方qq
    let qq = atItem[0].qq
    //检查存档
    let ifexistplay = await existplayer(qq)
    if (!ifexistplay) {
      e.reply('没存档你打个锤子！')
      return false
    }
    const player = Read_player(qq)
    player.power_place = 1
    e.reply('已打落凡间！')
    await Write_player(qq, player)
    return false
  }

  async replaceThing(e) {
    if (!e.isMaster) return false
    const msg1 = e.msg.replace(/#将米娜桑the纳戒里叫/, '')
    const [thingName, msg2] = msg1.split('thethethe')

    // #将米娜桑the纳戒里叫.*thethethe(装备|道具|丹药|skill|草药|材料|盒子|仙宠|口粮|项链|食材)(抹除|替换为叫.*之之之(装备|道具|丹药|skill|草药|材料|盒子|仙宠|口粮|项链|食材))$
    if (e.msg.endsWith('抹除')) {
      const thingType = msg2.replace(/抹除$/, '')
      if (!thingName || !thingType)
        return e.reply(
          '格式错误，正确格式范例：#将米娜桑the纳戒里叫1wthethethe道具替换为叫1k之之之道具'
        )
      await clearNajieThing(thingType, thingName)
      return e.reply('全部抹除完成')
    }

    // 替换为
    const N = 1 // 倍数
    const [thingType, msg3] = msg2.split('替换为叫')
    const [newThingName, newThingType] = msg3.split('之之之')
    const objArr = await clearNajieThing(thingType, thingName)
    objArr.map((uid_tnum) => {
      if (!uid_tnum) return
      const usrId = Object.entries(uid_tnum)[0][0]
      Add_najie_thing(usrId, newThingName, newThingType, uid_tnum.usrId * N)
    })
    return e.reply('全部替换完成')
  }
}

async function clearNajieThing(thingType, thingName) {
  if (!thingType || !thingName) return []
  const path = './plugins/' + AppName + '/resources/data/xiuxian_najie'
  return readdirSync(path)
    .filter((file) => file.endsWith('.json'))
    .map((file) => {
      const usrId = file.replace('.json', '')
      const najie = readFileSync(`${path}/${file}`, 'utf-8')
      const thingInNajie = JSON.parse(najie)[thingType]?.find(
        (thing) => thing.name == thingName
      )
      if (!thingInNajie) return false
      let thingNumber = thingInNajie.数量
      Add_najie_thing(usrId, thingName, thingType, -thingNumber)
      if (thingType == '装备') {
        ;['劣', '普', '优', '精', '绝', '顶'].map(async (pinji) => {
          const thingNum = await exist_najie_thing(
            usrId,
            thingName,
            thingType,
            Number(pinji)
          )
          if (thingNum) {
            Add_najie_thing(
              usrId,
              thingName,
              thingType,
              -thingNum,
              Number(pinji)
            )
            thingNumber += thingNum
          }
        })
      }
      return { [usrId]: thingNumber }
    })
    .filter((usrObj) => usrObj)
}
