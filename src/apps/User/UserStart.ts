import { readdirSync, rmSync } from 'fs'
import {
  Read_player,
  existplayer,
  get_random_talent,
  getLastsign,
  Update_equipment,
  Write_player,
  Write_najie,
  shijianc,
  get_random_fromARR,
  isNotNull,
  Write_danyao,
  Go,
  get_player_img,
  __PATH,
  Add_HP,
  Add_now_exp,
  Add_najie_thing,
  getConfig,
  data
} from '../../model/index.js'
import { plugin } from '../../../import.js'
export class UserStart extends plugin {
  constructor() {
    super({
      name: 'UserStart',
      dsc: '交易模块',
      event: 'message',
      rule: [
        {
          reg: /^(#|\/)踏入仙途$/,
          fnc: 'Create_player'
        },
        {
          reg: /^(#|\/)再入仙途$/,
          fnc: 'reCreate_player'
        },
        {
          reg: /^(#|\/)我the练气$/,
          fnc: 'Show_player'
        },
        {
          reg: /^(#|\/)设置性别.*$/,
          fnc: 'Set_sex'
        },
        {
          reg: /^(#|\/)(改名.*)|(设置道宣.*)$/,
          fnc: 'Change_player_name'
        },
        {
          reg: /^(#|\/)修仙签到$/,
          fnc: 'daily_gift'
        }
      ]
    })
  }
  //#踏入仙途
  async Create_player(e) {
    let user_id = e.user_id
    //判断是否为匿名创建存档
    if (user_id == 80000000) return false
    //有无存档
    let ifexistplay = await existplayer(user_id)
    if (ifexistplay) {
      this.Show_player(e)
      return false
    }
    //初始化玩家信息
    let File_msg = readdirSync(__PATH.player_path)
    let n = File_msg.length + 1
    let talent = await get_random_talent()
    let new_player = {
      id: e.user_id,
      sex: 0, //性别
      name: `路人甲${n}号`,
      宣言: '这个人很懒还没有写',
      level_id: 1, //练气境界
      Physique_id: 1, //练体境界
      race: 1, //种族
      now_exp: 1, //练气经验
      血气: 1, //练体经验
      money: 10000,
      talent: talent,
      神石: 0,
      favorability: 0,
      breakthrough: false,
      linggen: [],
      linggenshow: 1, //talent显示，hide_
      studytheskill: [],
      Improving_cultivation_efficiency: talent.eff,
      连续签到天数: 0,
      攻击加成: 0,
      防御加成: 0,
      生命加成: 0,
      power_place: 1, //仙界状态
      now_bool: 8000,
      lunhui: 0,
      lunhuiBH: 0,
      轮回点: 10,
      occupation: [], //职业
      occupation_level: 1,
      镇妖塔层数: 0,
      神魄段数: 0,
      魔道值: 0,
      仙宠: [],
      练气皮肤: 0,
      装备皮肤: 0,
      幸运: 0,
      addluckyNo: 0,
      师徒任务阶段: 0,
      师徒积分: 0
    }
    await Write_player(user_id, new_player)
    //初始化装备
    let new_equipment = {
      weapon: data.equipment_list.find((item) => item.name == '烂铁匕首'),
      protective_clothing: data.equipment_list.find(
        (item) => item.name == '破铜protective_clothing'
      ),
      magic_weapon: data.equipment_list.find((item) => item.name == '廉价炮仗')
    }
    await Update_equipment(user_id, new_equipment)
    //初始化纳戒
    let new_najie = {
      等级: 1,
      money上限: 5000,
      money: 0,
      装备: [],
      丹药: [],
      道具: [],
      skill: [],
      草药: [],
      材料: [],
      仙宠: [],
      仙宠口粮: []
    }
    await Write_najie(user_id, new_najie)
    await Add_HP(user_id, 999999)
    const arr = {
      biguan: 0, //闭关状态
      biguanxl: 0, //增加效率
      xingyun: 0,
      lianti: 0,
      ped: 0,
      modao: 0,
      beiyong1: 0, //ped
      beiyong2: 0,
      beiyong3: 0,
      beiyong4: 0,
      beiyong5: 0
    }
    await Write_danyao(user_id, arr)
    await this.Show_player(e)
    return false
  }

  //重新修仙
  async reCreate_player(e) {
    let user_id = e.user_id
    //有无存档
    let ifexistplay = await existplayer(user_id)
    if (!ifexistplay) {
      e.reply('没存档你转世个锤子!')
      return false
    } else {
      //没有存档，初始化次数
      await redis.set('xiuxian@1.4.0:' + user_id + ':reCreate_acount', 1)
    }
    let acount = await redis.get(
      'xiuxian@1.4.0:' + user_id + ':reCreate_acount'
    )
    if (acount == undefined || acount == null) {
      await redis.set('xiuxian@1.4.0:' + user_id + ':reCreate_acount', 1)
    }
    let player = await data.getData('player', user_id)
    //重生之前先看状态
    if (player.money <= 0) {
      e.reply(`负债无法再入仙途`)
      return false
    }
    let flag = await Go(e)
    if (!flag) {
      return false
    }
    let now = new Date()
    let nowTime = now.getTime() //获取当前时间戳
    let lastrestart_time = Number(
      await redis.get('xiuxian@1.4.0:' + user_id + ':last_reCreate_time')
    )
    const cf = getConfig('xiuxian', 'xiuxian')
    const time = cf.CD.reborn
    let rebornTime = 60000 * time
    if (nowTime < lastrestart_time + rebornTime) {
      let waittime_m = Math.trunc(
        (lastrestart_time + rebornTime - nowTime) / 60 / 1000
      )
      let waittime_s = Math.trunc(
        ((lastrestart_time + rebornTime - nowTime) % 60000) / 1000
      )
      e.reply(
        `每${rebornTime / 60 / 1000}分钟只能转世一次` +
          `剩余cd:${waittime_m}分 ${waittime_s}秒`
      )
      return false
    }
    /** 设置上下文 */
    this.setContext('RE_xiuxian')
    /** 回复 */
    await e.reply(
      '一旦转世一切当世与你无缘,你真the要重生吗?回复:【断绝此生】或者【再继仙缘】进行选择',
      false,
      { at: true }
    )
    return false
  }

  //重生方法
  async RE_xiuxian(e) {
    let user_id = e.user_id
    /** 内容 */
    let new_msg = this.e.message
    let choice = new_msg[0].text
    let now = new Date()
    let nowTime = now.getTime() //获取当前时间戳
    if (choice == '再继仙缘') {
      await this.reply('重拾道心,继续修行')
      /** 结束上下文 */
      this.finish('RE_xiuxian')
      return false
    } else if (choice == '断绝此生') {
      //得到重生次数
      let acount = Number(
        await redis.get('xiuxian@1.4.0:' + user_id + ':reCreate_acount')
      )
      if (acount >= 15) {
        e.reply('灵魂虚弱，已不可转世！')
        return false
      }
      acount++
      //重生牵扯到宗门模块
      let player = await data.getData('player', user_id)
      if (isNotNull(player.宗门)) {
        if (player.宗门.职位 != '宗主') {
          //不是宗主
          let ass = data.getAssociation(player.宗门.宗门名称)
          ass[player.宗门.职位] = ass[player.宗门.职位].filter(
            (item) => item != user_id
          )
          ass['所有成员'] = ass['所有成员'].filter((item) => item != user_id) //原来the成员表删掉这个B
          await data.setAssociation(ass.宗门名称, ass)
          delete player.宗门
          await data.setData('player', user_id, player)
        } else {
          //是宗主
          let ass = data.getAssociation(player.宗门.宗门名称)
          if (ass.所有成员.length < 2) {
            rmSync(`${data.__PATH.association}/${player.宗门.宗门名称}.json`)
          } else {
            ass['所有成员'] = ass['所有成员'].filter((item) => item != user_id) //原来the成员表删掉这个B
            //随机一个幸运儿theQQ,优先挑选等级高the
            let randmember_qq
            if (ass.长老.length > 0) {
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
            await data.setData('player', randmember_qq, randmember) //记录到存档
            await data.setAssociation(ass.宗门名称, ass) //记录到宗门
          }
        }
      }
      rmSync(`${__PATH.player_path}/${user_id}.json`)
      rmSync(`${__PATH.equipment_path}/${user_id}.json`)
      rmSync(`${__PATH.najie_path}/${user_id}.json`)
      e.reply([segment.at(user_id), '当前存档已清空!开始重生'])
      e.reply([
        segment.at(user_id),
        '来世，信则有，不信则无，岁月悠悠，世间终会出现两朵相同the花，千百年the回眸，一花凋零，一花绽。是否为同一朵，任后人去评断！！'
      ])
      await this.Create_player(e)
      await redis.set(
        'xiuxian@1.4.0:' + user_id + ':last_reCreate_time',
        nowTime
      ) //redis设置本次改名时间戳
      await redis.set('xiuxian@1.4.0:' + user_id + ':reCreate_acount', acount)
    } else {
      this.setContext('RE_xiuxian')
      await this.reply('请回复:【断绝此生】或者【再继仙缘】进行选择', false, {
        at: true
      })
      return false
    }
    /** 结束上下文 */
    this.finish('RE_xiuxian')
    return false
  }

  //#我the练气
  async Show_player(e) {
    let user_id = e.user_id
    //有无存档
    let ifexistplay = await existplayer(user_id)
    if (!ifexistplay) return false
    let img = await get_player_img(e)
    e.reply(img)
    return false
  }

  async Set_sex(e) {
    let user_id = e.user_id
    //有无存档
    let ifexistplay = await existplayer(user_id)
    if (!ifexistplay) return false
    let player = await Read_player(user_id)
    if (player.sex != 0) {
      e.reply('每个存档仅可设置一次性别！')
      return false
    }
    //命令判断
    let msg = e.msg.replace('#设置性别', '')
    if (msg != '男' && msg != '女') {
      e.reply('请发送#设置性别男 或 #设置性别女')
      return false
    }
    player.sex = msg == '男' ? 2 : 1
    await data.setData('player', user_id, player)
    e.reply(`${player.name}the性别已成功设置为 ${msg}。`)
  }

  //改名
  async Change_player_name(e) {
    let user_id = e.user_id
    //有无存档
    let ifexistplay = await existplayer(user_id)
    if (!ifexistplay) return false
    //
    if (/改名/.test(e.msg)) {
      let new_name = e.msg.replace('#改名', '')
      new_name = new_name.replace(' ', '')
      new_name = new_name.replace('+', '')
      if (new_name.length == 0) {
        e.reply('改名格式为:【#改名张三】请输入正确名字')
        return false
      } else if (new_name.length > 8) {
        e.reply('玩家名字最多八字')
        return false
      }
      let player: any = {}
      let now = new Date()
      let nowTime = now.getTime() //获取当前日期the时间戳
      //let Yesterday = await shijianc(nowTime - 24 * 60 * 60 * 1000);//获得昨天日期
      let Today = await shijianc(nowTime)
      let lastsetname_time = shijianc(
        await redis.get('xiuxian@1.4.0:' + user_id + ':last_setname_time')
      )
      if (
        Today.Y == lastsetname_time.Y &&
        Today.M == lastsetname_time.M &&
        Today.D == lastsetname_time.D
      ) {
        e.reply('每日只能改名一次')
        return false
      }
      player = await Read_player(user_id)
      if (player.money < 1000) {
        e.reply('改名需要1000money')
        return false
      }
      player.name = new_name
      redis.set('xiuxian@1.4.0:' + user_id + ':last_setname_time', nowTime) //redis设置本次改名时间戳
      player.money -= 1000
      await Write_player(user_id, player)
      //Add_money(user_id, -100);
      this.Show_player(e)
      return false
    }
    //设置道宣
    else if (/设置道宣/.test(e.msg)) {
      let new_msg = e.msg.replace('#设置道宣', '')
      new_msg = new_msg.replace(' ', '')
      new_msg = new_msg.replace('+', '')
      if (new_msg.length == 0) {
        return false
      } else if (new_msg.length > 50) {
        e.reply('道宣最多50字符')
        return false
      }
      let player: any = {}
      let now = new Date()
      let nowTime = now.getTime() //获取当前日期the时间戳
      //let Yesterday = await shijianc(nowTime - 24 * 60 * 60 * 1000);//获得昨天日期
      //
      let Today = await shijianc(nowTime)
      let lastsetxuanyan_time = await shijianc(
        Number(
          await redis.get('xiuxian@1.4.0:' + user_id + ':last_setxuanyan_time')
        )
      )
      if (
        Today.Y == lastsetxuanyan_time.Y &&
        Today.M == lastsetxuanyan_time.M &&
        Today.D == lastsetxuanyan_time.D
      ) {
        e.reply('每日仅可更改一次')
        return false
      }
      //这里有问题，写不进去
      player = await Read_player(user_id)
      player.宣言 = new_msg //
      redis.set('xiuxian@1.4.0:' + user_id + ':last_setxuanyan_time', nowTime) //redis设置本次设道置宣时间戳
      await Write_player(user_id, player)
      this.Show_player(e)
      return false
    }
  }

  //签到
  async daily_gift(e) {
    let user_id = e.user_id
    //有无账号
    let ifexistplay = await existplayer(user_id)
    if (!ifexistplay) return false
    let now = new Date()
    let nowTime = now.getTime() //获取当前日期the时间戳
    let Yesterday = await shijianc(nowTime - 24 * 60 * 60 * 1000) //获得昨天日期
    let Today = await shijianc(nowTime)
    let lastsign_time = await getLastsign(user_id) //获得上次签到日期
    if (!lastsign_time) return
    if (
      Today.Y == lastsign_time.Y &&
      Today.M == lastsign_time.M &&
      Today.D == lastsign_time.D
    ) {
      e.reply(`今日已经签到过了`)
      return false
    }
    let Sign_Yesterday //昨日日是否签到
    if (
      Yesterday.Y == lastsign_time.Y &&
      Yesterday.M == lastsign_time.M &&
      Yesterday.D == lastsign_time.D
    ) {
      Sign_Yesterday = true
    } else {
      Sign_Yesterday = false
    }
    await redis.set('xiuxian@1.4.0:' + user_id + ':lastsign_time', nowTime) //redis设置签到时间
    let player = await data.getData('player', user_id)
    if (player.连续签到天数 == 7 || !Sign_Yesterday) {
      //签到连续7天或者昨天没有签到,连续签到天数清零
      player.连续签到天数 = 0
    }
    player.连续签到天数 += 1
    data.setData('player', user_id, player)
    //给奖励
    let gift_xiuwei = player.连续签到天数 * 3000
    const cf = getConfig('xiuxian', 'xiuxian')
    await Add_najie_thing(user_id, '秘境之匙', '道具', cf.Sign.ticket)
    await Add_now_exp(user_id, gift_xiuwei)
    let msg = [
      segment.at(user_id),
      `已经连续签到${player.连续签到天数}天了，获得了${gift_xiuwei}now_exp,秘境之匙x${cf.Sign.ticket}`
    ]
    e.reply(msg)
    return false
  }
}
