import fs from 'fs'
import { plugin, puppeteer, verc, data, Show } from '../../api/api.js'
import { AppName } from '../../app.config.js'
import {
  existplayer,
  Write_player,
  Read_updata_log,
  Add_najie_thing,
  exist_najie_thing,
  Read_Exchange,
  Write_Exchange,
  get_player_img
} from '../../model/xiuxian.js'
import { Read_player, __PATH } from '../../model/xiuxian.js'
export class AdminSuper extends plugin {
  constructor() {
    super({
      name: 'Yunzai_Bot_AdminSuper',
      dsc: '修仙设置',
      event: 'message',
      priority: 100,
      rule: [
        {
          reg: '^#解封.*$',
          fnc: 'relieve'
        },
        {
          reg: '^#解除所有$',
          fnc: 'Allrelieve'
        },
        {
          reg: '^#打落凡间.*$',
          fnc: 'Knockdown'
        },
        {
          reg: '^#清除冲水堂$',
          fnc: 'Deleteexchange'
        },
        {
          reg: '^#查看日志$',
          fnc: 'show_log'
        },
        {
          reg: '^#解散宗门.*$',
          fnc: 'jiesan_ass'
        },
        {
          reg: '#将米娜桑的纳戒里叫.*的的的(装备|道具|丹药|功法|草药|材料|仙宠|口粮)(抹除|替换为叫.*之之之(装备|道具|丹药|功法|草药|材料|仙宠|口粮))$',
          fnc: 'replaceThing'
        }
      ]
    })
  }
  async jiesan_ass(e) {
    if (!e.isMaster) return false

    let didian = e.msg.replace('#解散宗门', '')
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
    fs.rmSync(`${data.filePathMap.association}/${didian}.json`)
    e.reply('解散成功!')
    return false
  }
  async show_log(e) {
    let j
    const reader = await Read_updata_log()
    let str = []
    let line_log = reader.trim().split('\n') //读取数据并按行分割
    line_log.forEach((item, index) => {
      // 删除空项
      if (!item) {
        line_log.splice(index, 1)
      }
    })
    for (let y = 0; y < line_log.length; y++) {
      let temp = line_log[y].trim().split(/\s+/) //读取数据并按空格分割
      let i = 0
      if (temp.length == 4) {
        str.push(temp[0])
        i = 1
      }
      let t = ''
      for (let x = i; x < temp.length; x++) {
        t += temp[x]
        //console.log(t)
        if (x == temp.length - 2 || x == temp.length - 3) {
          t += '\t'
        }
      }
      str.push(t)
      //str += "\n";
    }
    let T
    for (j = 0; j < str.length / 2; j++) {
      T = str[j]
      str[j] = str[str.length - 1 - j]
      str[str.length - 1 - j] = T
    }
    for (j = str.length - 1; j > -1; j--) {
      if (str[j] == '零' || str[j] == '打铁的') {
        let m = j
        while (str[m - 1] != '零' && str[m - 1] != '打铁的' && m > 0) {
          T = str[m]
          str[m] = str[m - 1]
          str[m - 1] = T
          m--
        }
      }
    }
    let log_data = {
      log: str
    }
    const data1 = await new Show(e).get_logData(log_data)
    let img = await puppeteer.screenshot('log', {
      ...data1
    })
    e.reply(img)
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
      let usr_qq = i.qq
      let thing = i.name.name
      let quanity = i.aconut
      if (i.name.class == '装备' || i.name.class == '仙宠') thing = i.name
      await Add_najie_thing(usr_qq, thing, i.name.class, quanity, i.name.pinji)
    }
    await Write_Exchange([])
    e.reply('清除完成！')
    return false
  }

  //#我的信息
  async Show_player(e) {
    let usr_qq = e.user_id
    //有无存档
    let ifexistplay = await existplayer(usr_qq)
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
    let files = fs
      .readdirSync('./plugins/' + AppName + '/resources/data/xiuxian_player')
      .filter((file) => file.endsWith('.json'))
    for (let file of files) {
      file = file.replace('.json', '')
      playerList.push(file)
    }
    for (let player_id of playerList) {
      //清除游戏状态
      await redis.set('xiuxian@1.3.0:' + player_id + ':game_action', 1)
      let action = await redis.get('xiuxian@1.3.0:' + player_id + ':action')
      action = JSON.parse(action)
      //不为空，存在动作
      if (action != null) {
        await redis.del('xiuxian@1.3.0:' + player_id + ':action')
        let arr = action
        arr.is_jiesuan = 1 //结算状态
        arr.shutup = 1 //闭关状态
        arr.working = 1 //降妖状态
        arr.power_up = 1 //渡劫状态
        arr.Place_action = 1 //秘境
        arr.Place_actionplus = 1 //沉迷状态
        arr.end_time = new Date().getTime() //结束的时间也修改为当前时间
        delete arr.group_id //结算完去除group_id
        await redis.set(
          'xiuxian@1.3.0:' + player_id + ':action',
          JSON.stringify(arr)
        )
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
    await redis.set('xiuxian@1.3.0:' + qq + ':game_action', 1)
    //查询redis中的人物动作
    let action = await redis.get('xiuxian@1.3.0:' + qq + ':action')
    action = JSON.parse(action)
    //不为空，有状态
    if (action != null) {
      //把状态都关了
      let arr = action
      arr.is_jiesuan = 1 //结算状态
      arr.shutup = 1 //闭关状态
      arr.working = 1 //降妖状态
      arr.power_up = 1 //渡劫状态
      arr.Place_action = 1 //秘境
      arr.Place_actionplus = 1 //沉迷状态
      arr.end_time = new Date().getTime() //结束的时间也修改为当前时间
      delete arr.group_id //结算完去除group_id
      await redis.set('xiuxian@1.3.0:' + qq + ':action', JSON.stringify(arr))
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
    let player = await Read_player(qq)
    player.power_place = 1
    e.reply('已打落凡间！')
    await Write_player(qq, player)
    return false
  }

  async replaceThing(e) {
    if (!e.isMaster) return false
    const msg1 = e.msg.replace('#将米娜桑的纳戒里叫', '')
    const [thingName, msg2] = msg1.split('的的的')

    // #将米娜桑的纳戒里叫.*的的的(装备|道具|丹药|功法|草药|材料|盒子|仙宠|口粮|项链|食材)(抹除|替换为叫.*之之之(装备|道具|丹药|功法|草药|材料|盒子|仙宠|口粮|项链|食材))$
    if (e.msg.endsWith('抹除')) {
      const thingType = msg2.replace(/抹除$/, '')
      if (!thingName || !thingType)
        return e.reply(
          '格式错误，正确格式范例：#将米娜桑的纳戒里叫1w的的的道具替换为叫1k之之之道具'
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
      const usrId = Object.entries(uid_tnum)[0][0]
      Add_najie_thing(usrId, newThingName, newThingType, uid_tnum.usrId * N)
    })
    return e.reply('全部替换完成')
  }
}

async function clearNajieThing(thingType, thingName) {
  if (!thingType || !thingName) return []
  const path = './plugins/' + AppName + '/resources/data/xiuxian_najie'
  return fs
    .readdirSync(path)
    .filter((file) => file.endsWith('.json'))
    .map((file) => {
      const usrId = file.replace('.json', '')
      const najie = fs.readFileSync(`${path}/${file}`)
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
            pinji
          )
          if (thingNum) {
            Add_najie_thing(usrId, thingName, thingType, -thingNum, pinji)
            thingNumber += thingNum
          }
        })
      }
      return { [usrId]: thingNumber }
    })
    .filter((usrObj) => usrObj)
}
