import { plugin, puppeteer, data, config, Show } from '../../api/api.js'
import {
  Read_player,
  existplayer,
  isNotNull,
  add_qinmidu,
  fstadd_qinmidu,
  find_qinmidu,
  exist_hunyin,
  Go,
  setu
} from '../../model/xiuxian.js'
import { Add_灵石, Add_修为 } from '../../model/xiuxian.js'
let gane_key_user = [] //怡红院限制
let yazhu = [] //投入
let gametime = [] //临时游戏CD
export class Games extends plugin {
  constructor() {
    super({
      name: 'Yunzai_Bot_Games',
      dsc: '修仙模块',
      event: 'message',
      priority: 600,
      rule: [
        {
          reg: '^#怡红院$',
          fnc: 'Xiuianplay'
        },
        {
          reg: '^#金银坊$',
          fnc: 'Moneynumber'
        },
        {
          reg: '^#(梭哈)|(投入.*)$',
          fnc: 'Moneycheck'
        },
        {
          reg: '^(大|小)$',
          fnc: 'Moneycheckguess'
        },
        {
          reg: '^#金银坊记录$',
          fnc: 'Moneyrecord'
        },
        {
          reg: '^双修$',
          fnc: 'Couple'
        },
        {
          reg: '^#拒绝双修$',
          fnc: 'Refusecouple'
        },
        {
          reg: '^#允许双修$',
          fnc: 'Allowcouple'
        }
      ]
    })
  }

  async Refusecouple(e) {
    let usr_qq = e.user_id
    let player = await Read_player(usr_qq)
    await redis.set('xiuxian@1.4.0:' + usr_qq + ':couple', 1)
    e.reply(player.名号 + '开启了拒绝模式')
    return false
  }

  async Allowcouple(e) {
    let usr_qq = e.user_id
    let player = await Read_player(usr_qq)
    await redis.set('xiuxian@1.4.0:' + usr_qq + ':couple', 0)
    e.reply(player.名号 + '开启了允许模式')
    return false
  }

  //怡红院
  async Xiuianplay(e) {
    const cf = config.getConfig('xiuxian', 'xiuxian')
    let switchgame = cf.switch.play
    if (switchgame != true) {
      return false
    }
    //统一用户ID名
    let usr_qq = e.user_id
    //全局状态判断
    //得到用户信息
    let player = await Read_player(usr_qq)
    let now_level_id
    if (!isNotNull(player.level_id)) {
      e.reply('请先#同步信息')
      return false
    }
    let flag = await Go(e)
    if (!flag) {
      return false
    }
    now_level_id = data.Level_list.find(
      (item) => item.level_id == player.level_id
    ).level_id
    //用id当作收益用
    //收益用
    let money = now_level_id * 1000
    //如果是渡劫期。大概收益用为33*1000=3.3w
    //为防止丹药修为报废，这个收益要成曲线下降
    //得到的修为
    //先是1:1的收益
    let addlevel
    //到了结丹中期收益变低
    //都不是凡人了，还天天祸害人间？
    if (now_level_id < 10) {
      addlevel = money
    } else {
      addlevel = (9 / now_level_id) * money
    }
    //随机数
    let rand = Math.random()
    let ql1 =
      "门口的大汉粗鲁的将你赶出来:'哪来的野小子,没钱还敢来学人家公子爷寻欢作乐?' 被人看出你囊中羞涩,攒到"
    let ql2 = '灵石再来吧！'
    if (player.灵石 < money) {
      e.reply(ql1 + money + ql2)
      return false
    }
    //加修为
    if (rand < 0.5) {
      let randexp = 90 + parseInt(Math.random() * 20)
      e.reply(
        '花费了' +
          money +
          '灵石,你好好放肆了一番,奇怪的修为增加了' +
          randexp +
          '!在鱼水之欢中你顿悟了,修为增加了' +
          addlevel +
          '!'
      )
      await Add_修为(usr_qq, addlevel)
      await Add_灵石(usr_qq, -money)
      let gameswitch = cf.switch.Xiuianplay_key
      if (gameswitch == true) {
        setu(e)
      }
      return false
    }
    //被教训
    else if (rand > 0.7) {
      await Add_灵石(usr_qq, -money)
      ql1 = '花了'
      ql2 =
        '灵石,本想好好放肆一番,却赶上了扫黄,无奈在衙门被教育了一晚上,最终大彻大悟,下次还来！'
      e.reply([segment.at(usr_qq), ql1 + money + ql2])
      return false
    }
    //被坑了
    else {
      await Add_灵石(usr_qq, -money)
      ql1 =
        '这一次，你进了一个奇怪的小巷子，那里衣衫褴褛的漂亮姐姐说要找你玩点有刺激的，你想都没想就进屋了。\n'
      ql2 =
        '没想到进屋后不多时遍昏睡过去。醒来发现自己被脱光扔在郊外,浑身上下只剩一条裤衩子了。仰天长啸：也不过是从头再来！'
      e.reply([segment.at(usr_qq), ql1 + ql2])
      return false
    }
  }

  //金银坊
  async Moneynumber(e) {
    const cf = config.getConfig('xiuxian', 'xiuxian')
    //金银坊开关
    let gameswitch = cf.switch.Moneynumber
    if (gameswitch != true) return false
    let usr_qq = e.user_id
    let flag = await Go(e)
    if (!flag) return false
    //用户信息查询
    let player = data.getData('player', usr_qq)
    let now_time = new Date().getTime()
    let money = 10000
    //判断灵石
    if (player.灵石 < money) {
      //直接清除，并记录
      //重新记录本次时间
      await redis.set('xiuxian@1.4.0:' + usr_qq + ':last_game_time', now_time) //存入缓存
      //清除游戏状态
      await redis.set('xiuxian@1.4.0:' + usr_qq + ':game_action', 1)
      //清除未投入判断
      //清除金额
      yazhu[usr_qq] = 0
      //清除游戏定时检测CD
      clearTimeout(gametime[usr_qq])
      e.reply('媚娘：钱不够也想玩？')
      return false
    }
    //设置
    let time = cf.CD.gambling //
    //获取当前时间
    //最后的游戏时间
    //last_game_time
    //获得时间戳
    let last_game_time = await redis.get(
      'xiuxian@1.4.0:' + usr_qq + ':last_game_time'
    )
    last_game_time = parseInt(last_game_time)
    let transferTimeout = parseInt(60000 * time)
    if (now_time < last_game_time + transferTimeout) {
      let game_m = Math.trunc(
        (last_game_time + transferTimeout - now_time) / 60 / 1000
      )
      let game_s = Math.trunc(
        ((last_game_time + transferTimeout - now_time) % 60000) / 1000
      )
      e.reply(
        `每${transferTimeout / 1000 / 60}分钟游玩一次。` +
          `cd: ${game_m}分${game_s}秒`
      )
      //存在CD。直接返回
      return false
    }
    //记录本次执行时间
    await redis.set('xiuxian@1.4.0:' + usr_qq + ':last_game_time', now_time)
    //判断是否已经在进行
    let game_action = await redis.get(
      'xiuxian@1.4.0:' + usr_qq + ':game_action'
    )
    //为0，就是在进行了
    if (game_action == 0) {
      //在进行
      e.reply(`媚娘：猜大小正在进行哦!`)
      return false
    }
    //不为0   没有参与投入和梭哈
    e.reply(`媚娘：发送[#投入+数字]或[#梭哈]`, true)
    //写入游戏状态为真-在进行了
    await redis.set('xiuxian@1.4.0:' + usr_qq + ':game_action', 0)
    return false
  }

  //这里冲突了，拆函数！
  //梭哈|投入999
  async Moneycheck(e) {
    let usr_qq = e.user_id
    //获取当前时间戳
    let now_time = new Date().getTime()
    //文档
    let ifexistplay = await existplayer(usr_qq)
    //得到此人的状态
    //判断是否是投入用户
    let game_action = await redis.get(
      'xiuxian@1.4.0:' + usr_qq + ':game_action'
    )
    if (!ifexistplay || game_action == 1) {
      //不是就返回
      return false
    }
    //梭哈|投入999。如果是投入。就留下999
    let es = e.msg.replace('#投入', '').trim()
    //去掉投入，发现得到的是梭哈
    //梭哈，全部灵石
    if (es == '#梭哈') {
      let player = await Read_player(usr_qq)
      //得到投入金额
      yazhu[usr_qq] = player.灵石 - 1
      e.reply('媚娘：梭哈完成,发送[大]或[小]')
      return false
    }
    //不是梭哈，看看是不是数字
    //判断是不是输了个数字，看看投入多少
    if (parseInt(es) == parseInt(es)) {
      let player = await Read_player(usr_qq)
      //判断灵石
      if (player.灵石 >= parseInt(es)) {
        //得到投入数
        yazhu[usr_qq] = parseInt(es)
        //这里限制一下，至少押1w
        let money = 10000
        //如果投入的数大于0
        if (yazhu[usr_qq] >= money) {
          //如果押的钱不够
          //值未真。并记录此人信息
          gane_key_user[usr_qq]
          e.reply('媚娘：投入完成,发送[大]或[小]')
          return false
        } else {
          //直接清除，并记录
          //重新记录本次时间
          await redis.set(
            'xiuxian@1.4.0:' + usr_qq + ':last_game_time',
            now_time
          ) //存入缓存
          //清除游戏状态
          await redis.set('xiuxian@1.4.0:' + usr_qq + ':game_action', 1)
          //清除未投入判断
          //清除金额
          yazhu[usr_qq] = 0
          //清除游戏定时检测CD
          clearTimeout(gametime[usr_qq])
          e.reply('媚娘：钱不够也想玩？')
          return false
        }
      }
    }
    return false
  }

  //大|小
  async Moneycheckguess(e) {
    let usr_qq = e.user_id
    //获取当前时间戳
    let now_time = new Date().getTime()
    //文档
    let ifexistplay = await existplayer(usr_qq)
    //得到此人的状态
    //判断是否是投入用户
    let game_action = await redis.get(
      'xiuxian@1.4.0:' + usr_qq + ':game_action'
    )
    if (!ifexistplay || game_action == 1) {
      //不是就返回
      return false
    }
    if (isNaN(yazhu[usr_qq])) {
      return false
    }
    //判断是否投入金额
    //是对应的投入用户。
    //检查此人是否已经投入
    if (!gane_key_user) {
      e.reply('媚娘：公子，你还没投入呢')
      return false
    }
    let player = await Read_player(usr_qq)
    let es = e.msg
    //随机数并取整【1，7）
    let randtime = Math.trunc(Math.random() * 6) + 1
    //点子
    let touzi
    let n
    //防止娶不到整，我们自己取
    for (n = 1; n <= randtime; n++) {
      //是1.111就取1 --是2.0就取到2。没有7.0是不可能取到7的。也就是得到6
      //随机并取整
      touzi = n
    }
    //发送固定点数的touzi
    e.reply(segment.dice(touzi))
    const cf = config.getConfig('xiuxian', 'xiuxian')
    //你说大，touzi是大。赢了
    if ((es == '大' && touzi > 3) || (es == '小' && touzi < 4)) {
      //赢了
      //获奖倍率
      let x = cf.percentage.Moneynumber
      let y = 1
      let z = cf.size.Money * 10000
      //增加金银坊投资记录
      //投入大于一百万
      if (yazhu[usr_qq] >= z) {
        //扣一半的投入
        x = cf.percentage.punishment
        //并提示这是被扣了一半
        y = 0
      }
      yazhu[usr_qq] = Math.trunc(yazhu[usr_qq] * x)
      //金库
      //获得灵石超过100w
      //积累
      if (isNotNull(player.金银坊胜场)) {
        player.金银坊胜场 = parseInt(player.金银坊胜场) + 1
        player.金银坊收入 =
          parseInt(player.金银坊收入) + parseInt(yazhu[usr_qq])
      } else {
        player.金银坊胜场 = 1
        player.金银坊收入 = parseInt(yazhu[usr_qq])
      }
      //把记录写入
      data.setData('player', usr_qq, player)
      //得到的
      Add_灵石(usr_qq, yazhu[usr_qq])
      if (y == 1) {
        e.reply([
          segment.at(usr_qq),
          `骰子最终为 ${touzi} 你猜对了！`,
          '\n',
          `现在拥有灵石:${player.灵石 + yazhu[usr_qq]}`
        ])
      } else {
        e.reply([
          segment.at(usr_qq),
          `骰子最终为 ${touzi} 你虽然猜对了，但是金银坊怀疑你出老千，准备打断你的腿的时候，你选择破财消灾。`,
          '\n',
          `现在拥有灵石:${player.灵石 + yazhu[usr_qq]}`
        ])
      }
      //重新记录本次时间
      await redis.set('xiuxian@1.4.0:' + usr_qq + ':last_game_time', now_time) //存入缓存
      //清除游戏状态
      await redis.set('xiuxian@1.4.0:' + usr_qq + ':game_action', 1)
      //清除未投入判断
      //清除金额
      yazhu[usr_qq] = 0
      //清除游戏CD
      clearTimeout(gametime[usr_qq])
      return false
    }
    //你说大，但是touzi<4,是输了
    else if ((es == '大' && touzi < 4) || (es == '小' && touzi > 3)) {
      //输了
      //增加金银坊投资记录
      if (isNotNull(player.金银坊败场)) {
        player.金银坊败场 = parseInt(player.金银坊败场) + 1
        player.金银坊支出 =
          parseInt(player.金银坊支出) + parseInt(yazhu[usr_qq])
      } else {
        player.金银坊败场 = 1
        player.金银坊支出 = parseInt(yazhu[usr_qq])
      }
      //把记录写入
      data.setData('player', usr_qq, player)
      //只要花灵石的地方就要查看是否存在游戏状态
      Add_灵石(usr_qq, -yazhu[usr_qq])
      let msg = [
        segment.at(usr_qq),
        `骰子最终为 ${touzi} 你猜错了！`,
        '\n',
        `现在拥有灵石:${player.灵石 - yazhu[usr_qq]}`
      ]
      let now_money = player.灵石 - yazhu[usr_qq]
      //重新记录本次时间
      await redis.set('xiuxian@1.4.0:' + usr_qq + ':last_game_time', now_time) //存入缓存
      //清除游戏状态
      await redis.set('xiuxian@1.4.0:' + usr_qq + ':game_action', 1)
      //清除未投入判断
      //清除金额
      yazhu[usr_qq] = 0
      //清除游戏CD
      clearTimeout(gametime[usr_qq])
      //如果扣了之后，钱被扣光了，就提示
      if (now_money <= 0) {
        msg.push(
          '\n媚娘：没钱了也想跟老娘耍？\n你已经裤衩都输光了...快去降妖赚钱吧！'
        )
      }
      e.reply(msg)
      return false
    }
  }

  async Moneyrecord(e) {
    let qq = e.user_id
    let shenglv
    //获取人物信息
    let player_data = data.getData('player', qq)
    let victory = isNotNull(player_data.金银坊胜场) ? player_data.金银坊胜场 : 0
    let victory_num = isNotNull(player_data.金银坊收入)
      ? player_data.金银坊收入
      : 0
    let defeated = isNotNull(player_data.金银坊败场)
      ? player_data.金银坊败场
      : 0
    let defeated_num = isNotNull(player_data.金银坊支出)
      ? player_data.金银坊支出
      : 0
    if (parseInt(victory) + parseInt(defeated) == 0) {
      shenglv = 0
    } else {
      shenglv = ((victory / (victory + defeated)) * 100).toFixed(2)
    }
    const data1 = await new Show(e).get_jinyin({
      user_qq: qq,
      victory,
      victory_num,
      defeated,
      defeated_num
    })
    let img = await puppeteer.screenshot('moneyCheck', {
      ...data1
    })
    e.reply(img)
  }

  //双修
  async Couple(e) {
    const cf = config.getConfig('xiuxian', 'xiuxian')
    //双修开关
    let gameswitch = cf.switch.couple
    if (gameswitch != true) {
      return false
    }
    let A = e.user_id
    //全局状态判断
    //B
    let isat = e.message.some((item) => item.type === 'at')
    if (!isat) return false
    let atItem = e.message.filter((item) => item.type === 'at')
    //对方QQ
    let B = atItem[0].qq
    if (A == B) {
      e.reply('你咋这么爱撸自己呢?')
      return false
    }
    let Time = cf.CD.couple //6个小时
    let shuangxiuTimeout = parseInt(60000 * Time)
    //自己的cd
    let now_Time = new Date().getTime() //获取当前时间戳
    let last_timeA = await redis.get(
      'xiuxian@1.4.0:' + A + ':last_shuangxiu_time'
    ) //获得上次的时间戳,
    last_timeA = parseInt(last_timeA)
    if (now_Time < last_timeA + shuangxiuTimeout) {
      let Couple_m = Math.trunc(
        (last_timeA + shuangxiuTimeout - now_Time) / 60 / 1000
      )
      let Couple_s = Math.trunc(
        ((last_timeA + shuangxiuTimeout - now_Time) % 60000) / 1000
      )
      e.reply(`双修冷却:  ${Couple_m}分 ${Couple_s}秒`)
      return false
    }
    let last_timeB = await redis.get(
      'xiuxian@1.4.0:' + B + ':last_shuangxiu_time'
    ) //获得上次的时间戳,
    last_timeB = parseInt(last_timeB)
    if (now_Time < last_timeB + shuangxiuTimeout) {
      let Couple_m = Math.trunc(
        (last_timeB + shuangxiuTimeout - now_Time) / 60 / 1000
      )
      let Couple_s = Math.trunc(
        ((last_timeB + shuangxiuTimeout - now_Time) % 60000) / 1000
      )
      e.reply(`对方双修冷却:  ${Couple_m}分 ${Couple_s}秒`)
      return false
    }
    //对方存档
    let ifexistplay_B = await existplayer(B)
    if (!ifexistplay_B) {
      e.reply('修仙者不可对凡人出手!')
      return false
    }
    //拒绝
    let couple = await redis.get('xiuxian@1.4.0:' + B + ':couple')
    if (couple != 0) {
      e.reply('哎哟，你干嘛...')
      return false
    }
    let pd = await find_qinmidu(A, B)
    let hunyin_B = await exist_hunyin(A)
    let hunyin_A = await exist_hunyin(B)
    //console.log(`pd = `+pd+` hunyin = `+hunyin);
    //双方有一人已婚
    if (hunyin_B != false || hunyin_A != false) {
      //不是对方
      if (hunyin_A != A || hunyin_B != B) {
        e.reply(`力争纯爱！禁止贴贴！！`)
        return false
      }
    } else if (pd == false) {
      //没有存档
      await fstadd_qinmidu(A, B)
    }
    //前戏做完了!
    await redis.set('xiuxian@1.4.0:' + A + ':last_shuangxiu_time', now_Time)
    await redis.set('xiuxian@1.4.0:' + B + ':last_shuangxiu_time', now_Time)
    if (A != B) {
      let option = Math.random()
      let xiuwei = Math.random()
      let x = 0
      let y = 0
      if (option > 0 && option <= 0.5) {
        x = 28000
        y = Math.trunc(xiuwei * x)
        await Add_修为(A, parseInt(y))
        await Add_修为(B, parseInt(y))
        await add_qinmidu(A, B, 30)
        e.reply(
          '你们双方情意相通，缠绵一晚，都增加了' +
            parseInt(y) +
            '修为,亲密度增加了30点'
        )
        return false
      } else if (option > 0.5 && option <= 0.6) {
        x = 21000
        y = Math.trunc(xiuwei * x)
        await Add_修为(A, parseInt(y))
        await Add_修为(B, parseInt(y))
        await add_qinmidu(A, B, 20)
        e.reply(
          '你们双方交心交神，努力修炼，都增加了' +
            parseInt(y) +
            '修为,亲密度增加了20点'
        )
      } else if (option > 0.6 && option <= 0.7) {
        x = 14000
        y = Math.trunc(xiuwei * x)
        await Add_修为(A, parseInt(y))
        await Add_修为(B, parseInt(y))
        await add_qinmidu(A, B, 15)
        e.reply(
          '你们双方共同修炼，过程平稳，都增加了' +
            parseInt(y) +
            '修为,亲密度增加了15点'
        )
      } else if (option > 0.7 && option <= 0.9) {
        x = 520
        y = Math.trunc(1 * x)
        await Add_修为(A, parseInt(y))
        await Add_修为(B, parseInt(y))
        await add_qinmidu(A, B, 10)
        e.reply(
          '你们双方努力修炼，但是并进不了状态，都增加了' +
            parseInt(y) +
            '修为,亲密度增加了10点'
        )
      } else {
        e.reply('你们双修时心神合一，但是不知道哪来的小孩，惊断了状态')
      }
      return false
    }
  }
}
