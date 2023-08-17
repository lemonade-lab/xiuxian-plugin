import { plugin, verc, data } from '../../api/api.js'
import {
  Read_player,
  isNotNull,
  sleep,
  exist_najie_thing,
  Go,
  Add_najie_thing,
  convert2integer,
  Add_灵石,
  Add_修为,
  Goweizhi,
  jindi
} from '../../model/xiuxian.js'
export class SecretPlaceplus extends plugin {
  constructor() {
    super({
      name: 'Yunzai_Bot_SecretPlace',
      dsc: '修仙模块',
      event: 'message',
      priority: 600,
      rule: [
        {
          reg: '^#沉迷秘境.*$',
          fnc: 'Gosecretplace'
        },
        {
          reg: '^#沉迷禁地.*$',
          fnc: 'Goforbiddenarea'
        },
        {
          reg: '^#沉迷仙境.*$',
          fnc: 'Gofairyrealm'
        }
      ]
    })
  }

  async Xiuxianstate(e) {
    let flag = await Go(e)
    if (!flag) {
      return false
    }
    return false
  }

  //秘境地点
  async Secretplace(e) {
    let addres = '秘境'
    let weizhi = data.didian_list
    await Goweizhi(e, weizhi, addres)
  }

  //禁地
  async Forbiddenarea(e) {
    let addres = '禁地'
    let weizhi = data.forbiddenarea_list
    await jindi(e, weizhi, addres)
  }

  //限定仙府
  async Timeplace(e) {
    e.reply('仙府乃民间传说之地,请自行探索')
  }

  //仙境
  async Fairyrealm(e) {
    let addres = '仙境'
    let weizhi = data.Fairyrealm_list
    await Goweizhi(e, weizhi, addres)
  }

  //沉迷秘境
  async Gosecretplace(e) {
    let usr_qq = e.user_id
    let flag = await Go(e)
    if (!flag) {
      return false
    }
    let didian = e.msg.replace('#沉迷秘境', '')
    let code = didian.split('*')
    didian = code[0]
    let i = await convert2integer(code[1])
    if (i > 12) {
      return false
    }
    let weizhi = await data.didian_list.find((item) => item.name == didian)
    if (!isNotNull(weizhi)) {
      return false
    }
    let player = await Read_player(usr_qq)
    if (player.灵石 < weizhi.Price * 10 * i) {
      e.reply('没有灵石寸步难行,攒到' + weizhi.Price * 10 * i + '灵石才够哦~')
      return false
    }
    if (didian == '大千世界' || didian == '桃花岛') {
      e.reply('该秘境不支持沉迷哦')
      return false
    }
    let number = await exist_najie_thing(usr_qq, '秘境之匙', '道具')
    if (isNotNull(number) && number >= i) {
      await Add_najie_thing(usr_qq, '秘境之匙', '道具', -i)
    } else {
      e.reply('你没有足够数量的秘境之匙')
      return false
    }
    let Price = weizhi.Price * 10 * i
    await Add_灵石(usr_qq, -Price)
    const time = i * 10 * 5 + 10 //时间（分钟）
    let action_time = 60000 * time //持续时间，单位毫秒
    let arr = {
      action: '历练', //动作
      end_time: new Date().getTime() + action_time, //结束时间
      time: action_time, //持续时间
      shutup: '1', //闭关
      working: '1', //降妖
      Place_action: '1', //秘境状态---开启
      Place_actionplus: '0', //沉迷秘境状态---关闭
      power_up: '1', //渡劫状态--关闭
      mojie: '1', //魔界状态---关闭
      xijie: '1', //洗劫状态开启
      plant: '1', //采药-开启
      mine: '1', //采矿-开启
      cishu: i * 10,
      //这里要保存秘境特别需要留存的信息
      Place_address: weizhi
    }
    if (e.isGroup) {
      arr.group_id = e.group_id
    }
    await redis.set('xiuxian@1.3.0:' + usr_qq + ':action', JSON.stringify(arr))
    e.reply('开始降临' + didian + ',' + time + '分钟后归来!')
    return false
  }

  //沉迷禁地
  async Goforbiddenarea(e) {
    let usr_qq = e.user_id
    let flag = await Go(e)
    if (!flag) {
      return false
    }
    let player = await Read_player(usr_qq)
    let now_level_id
    if (!isNotNull(player.level_id)) {
      e.reply('请先#同步信息')
      return false
    }
    if (!isNotNull(player.power_place)) {
      e.reply('请#同步信息')
      return false
    }
    now_level_id = data.Level_list.find(
      (item) => item.level_id == player.level_id
    ).level_id
    if (now_level_id < 22) {
      e.reply('没有达到化神之前还是不要去了')
      return false
    }
    let didian = await e.msg.replace('#沉迷禁地', '')
    let code = didian.split('*')
    didian = code[0]
    let i = await convert2integer(code[1])
    if (i > 12) {
      return false
    }
    let weizhi = await data.forbiddenarea_list.find(
      (item) => item.name == didian
    )
    if (!isNotNull(weizhi)) {
      return false
    }
    if (player.灵石 < weizhi.Price * 10 * i) {
      e.reply('没有灵石寸步难行,攒到' + weizhi.Price * 10 * i + '灵石才够哦~')
      return false
    }
    if (player.修为 < weizhi.experience * 10 * i) {
      e.reply(
        '你需要积累' + weizhi.experience * 10 * i + '修为，才能抵抗禁地魔气！'
      )
      return false
    }
    let number = await exist_najie_thing(usr_qq, '秘境之匙', '道具')
    if (isNotNull(number) && number >= i) {
      await Add_najie_thing(usr_qq, '秘境之匙', '道具', -i)
    } else {
      e.reply('你没有足够数量的秘境之匙')
      return false
    }
    let Price = weizhi.Price * 10 * i
    let Exp = weizhi.experience * 10 * i
    await Add_灵石(usr_qq, -Price)
    await Add_修为(usr_qq, -Exp)
    const time = i * 10 * 5 + 10 //时间（分钟）
    let action_time = 60000 * time //持续时间，单位毫秒
    let arr = {
      action: '禁地', //动作
      end_time: new Date().getTime() + action_time, //结束时间
      time: action_time, //持续时间
      shutup: '1', //闭关
      working: '1', //降妖
      Place_action: '1', //秘境状态---开启
      Place_actionplus: '0', //沉迷秘境状态---关闭
      power_up: '1', //渡劫状态--关闭
      mojie: '1', //魔界状态---关闭
      xijie: '1', //洗劫状态开启
      plant: '1', //采药-开启
      mine: '1', //采矿-开启
      cishu: 10 * i,
      //这里要保存秘境特别需要留存的信息
      Place_address: weizhi
    }
    if (e.isGroup) {
      arr.group_id = e.group_id
    }
    await redis.set('xiuxian@1.3.0:' + usr_qq + ':action', JSON.stringify(arr))
    e.reply('正在前往' + weizhi.name + ',' + time + '分钟后归来!')
    return false
  }

  //探索仙府
  async GoTimeplace(e) {
    let usr_qq = e.user_id
    let flag = await Go(e)
    if (!flag) {
      return false
    }
    let player = await Read_player(usr_qq)
    let didianlist = ['无欲天仙', '仙遗之地']
    let suiji = Math.round(Math.random()) //随机一个地方
    let yunqi = Math.random() //运气随机数
    await sleep(1000)
    e.reply('你在冲水堂发现有人上架了一份仙府地图')
    let didian = didianlist[suiji] //赋值
    let now_level_id
    if (!isNotNull(player.level_id)) {
      e.reply('请先#同步信息')
      return false
    }
    await sleep(1000)
    if (yunqi > 0.9) {
      //10%寄
      if (player.灵石 < 50000) {
        e.reply('还没看两眼就被看堂的打手撵了出去说:“哪来的穷小子,不买别看”')
        return false
      }
      e.reply(
        '价格为50w,你觉得特别特别便宜,赶紧全款拿下了,历经九九八十天,到了后发现居然是仙湖游乐场！'
      )
      await Add_灵石(usr_qq, -50000)
      return false
    }
    now_level_id = data.Level_list.find(
      (item) => item.level_id == player.level_id
    ).level_id
    if (now_level_id < 21) {
      e.reply('到了地图上的地点，结果你发现,你尚未达到化神,无法抵御灵气压制')
      return false
    }
    let weizhi = await data.timeplace_list.find((item) => item.name == didian)
    if (!isNotNull(weizhi)) {
      e.reply('报错！地点错误，请找群主反馈')
      return false
    }
    if (player.灵石 < weizhi.Price * 10) {
      e.reply('你发现标价是' + weizhi.Price + ',你买不起赶紧溜了')
      return false
    }
    if (player.修为 < 1000000) {
      e.reply(
        '到了地图上的地点，发现洞府前有一句前人留下的遗言:‘至少有10w修为才能抵御仙威！’'
      )
      return false
    }
    let Price = weizhi.Price * 10
    await Add_灵石(usr_qq, -Price)
    const time = 22 //时间（分钟）
    let action_time = 60000 * time //持续时间，单位毫秒
    let arr = {
      action: '探索', //动作
      end_time: new Date().getTime() + action_time, //结束时间
      time: action_time, //持续时间
      shutup: '1', //闭关
      working: '1', //降妖
      Place_action: '1', //秘境状态---开启
      Place_actionplus: '0', //沉迷秘境状态---关闭
      power_up: '1', //渡劫状态--关闭
      mojie: '1', //魔界状态---关闭
      xijie: '1', //洗劫状态开启
      plant: '1', //采药-开启
      mine: '1', //采矿-开启
      cishu: '10',
      //这里要保存秘境特别需要留存的信息
      Place_address: weizhi
    }
    if (e.isGroup) {
      arr.group_id = e.group_id
    }
    await redis.set('xiuxian@1.3.0:' + usr_qq + ':action', JSON.stringify(arr))
    await Add_修为(usr_qq, -1000000)
    if (suiji == 0) {
      e.reply(
        '你买下了那份地图,历经九九八十一天,终于到达了地图上的仙府,洞府上模糊得刻着[' +
          weizhi.name +
          '仙府]你兴奋地冲进去探索机缘,被强大的仙气压制，消耗了1000000修为成功突破封锁闯了进去' +
          time +
          '分钟后归来!'
      )
    }
    if (suiji == 1) {
      e.reply(
        '你买下了那份地图,历经九九八十一天,终于到达了地图上的地点,这座洞府仿佛是上个末法时代某个仙人留下的遗迹,你兴奋地冲进去探索机缘,被强大的仙气压制，消耗了1000000修为成功突破封锁闯了进去' +
          time +
          '分钟后归来!'
      )
    }
    return false
  }

  //前往仙境
  async Gofairyrealm(e) {
    let usr_qq = e.user_id
    let flag = await Go(e)
    if (!flag) {
      return false
    }
    let didian = e.msg.replace('#沉迷仙境', '')
    let code = didian.split('*')
    didian = code[0]
    let i = await convert2integer(code[1])
    if (i > 12) {
      return false
    }
    let weizhi = await data.Fairyrealm_list.find((item) => item.name == didian)
    if (!isNotNull(weizhi)) {
      return false
    }
    let player = await Read_player(usr_qq)
    if (player.灵石 < weizhi.Price * 10 * i) {
      e.reply('没有灵石寸步难行,攒到' + weizhi.Price * 10 * i + '灵石才够哦~')
      return false
    }
    let now_level_id
    if (didian == '仙界矿场') {
      e.reply('打工本不支持沉迷哦')
      return false
    }
    player = await Read_player(usr_qq)
    now_level_id = data.Level_list.find(
      (item) => item.level_id == player.level_id
    ).level_id
    if (now_level_id < 42 && player.lunhui == 0) {
      return false
    }
    let number = await exist_najie_thing(usr_qq, '秘境之匙', '道具')
    if (isNotNull(number) && number >= i) {
      await Add_najie_thing(usr_qq, '秘境之匙', '道具', -i)
    } else {
      e.reply('你没有足够数量的秘境之匙')
      return false
    }
    let Price = weizhi.Price * 10 * i
    await Add_灵石(usr_qq, -Price)
    const time = i * 10 * 5 + 10 //时间（分钟）
    let action_time = 60000 * time //持续时间，单位毫秒
    let arr = {
      action: '历练', //动作
      end_time: new Date().getTime() + action_time, //结束时间
      time: action_time, //持续时间
      shutup: '1', //闭关
      working: '1', //降妖
      Place_action: '1', //秘境状态---开启
      Place_actionplus: '0', //沉迷秘境状态---关闭
      power_up: '1', //渡劫状态--关闭
      mojie: '1', //魔界状态---关闭
      xijie: '1', //洗劫状态开启
      plant: '1', //采药-开启
      mine: '1', //采矿-开启
      cishu: 10 * i,
      //这里要保存秘境特别需要留存的信息
      Place_address: weizhi
    }
    if (e.isGroup) {
      arr.group_id = e.group_id
    }
    await redis.set('xiuxian@1.3.0:' + usr_qq + ':action', JSON.stringify(arr))
    e.reply('开始镇守' + didian + ',' + time + '分钟后归来!')
    return false
  }
}
