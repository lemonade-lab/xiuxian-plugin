import {
  exist_najie_thing,
  Read_najie,
  isNotNull,
  Write_player,
  Add_najie_thing,
  convert2integer,
  Add_仙宠,
  data
} from '../../model/index.js'
import { plugin } from '../../../import.js'
export class Pokemon extends plugin {
  constructor() {
    super({
      name: 'Pokemon',
      dsc: '修仙模块',
      event: 'message',
      priority: 600,
      rule: [
        {
          reg: '^#出战仙宠.*$',
          fnc: 'Fight'
        },
        {
          reg: '^#喂给仙宠.*$',
          fnc: 'feed'
        },
        {
          reg: '^#进阶仙宠$',
          fnc: 'Advanced'
        }
      ]
    })
  }

  async Fight(e) {
    let usr_qq = e.user_id
    let ifexistplay = data.existData('player', usr_qq)
    if (!ifexistplay) return false
    let player = data.getData('player', usr_qq)
    let name = e.msg.replace('#', '')
    name = name.replace('出战仙宠', '')
    let num = parseInt(name)
    let najie = await Read_najie(usr_qq)
    if (num && num > 1000) {
      try {
        name = najie.仙宠[num - 1001].name
      } catch {
        e.reply('仙宠代号输入有误!')
        return false
      }
    }
    if (player.仙宠.灵魂绑定 == 1) {
      e.reply('你已经与' + player.仙宠.name + '绑定了灵魂,无法更换别the仙宠！')
      return false
    }
    let thing = data.xianchon.find((item) => item.name == name) //查找仙宠
    if (!isNotNull(thing)) {
      e.reply('这方世界不存在' + name)
      return false
    }
    //放回
    let last = 114514
    for (let i = 0; najie.仙宠.length > i; i++) {
      if (najie.仙宠[i].name == name) {
        last = najie.仙宠[i]
        break
      }
    }
    if (last == 114514) {
      e.reply('你没有' + name)
      return false
    }
    if (isNotNull(player.仙宠.name)) {
      await Add_仙宠(usr_qq, player.仙宠.name, 1, player.仙宠.等级)
    }
    if (player.仙宠.type == '修炼') {
      player.Improving_cultivation_efficiency =
        player.Improving_cultivation_efficiency - player.仙宠.加成
    }
    if (player.仙宠.type == '幸运') {
      player.幸运 = player.幸运 - player.仙宠.加成
    }
    player.仙宠 = last
    player.仙宠.加成 = player.仙宠.等级 * player.仙宠.每级增加
    if (last.type == '幸运') {
      player.幸运 = player.幸运 + last.加成
    }
    if (last.type == '修炼') {
      player.Improving_cultivation_efficiency =
        player.Improving_cultivation_efficiency + last.加成
    }
    //增减仙宠方法
    await Add_仙宠(usr_qq, last.name, -1, last.等级)
    await Write_player(usr_qq, player) //写入
    e.reply('成功出战' + name)
  }

  async Advanced(e) {
    let usr_qq = e.user_id
    let ifexistplay = data.existData('player', usr_qq)
    if (!ifexistplay) return false
    let player = data.getData('player', usr_qq)
    let list = ['仙胎', '仙仔', '仙兽', '仙道', '仙灵']
    let list_level = [20, 40, 60, 80, 100]
    let x = 114514
    for (let i = 0; list.length > i; i++) {
      if (list[i] == player.仙宠.品级) {
        x = i
        break
      }
    }
    if (x == 114514) {
      e.reply('你没有仙宠')
      return false
    }
    if (x == 4) {
      e.reply('[' + player.仙宠.name + ']已达到最高品级')
      return false
    }
    let number_n = x + 1
    number_n.toString //等级转换字符串
    let name = number_n + '级仙石'
    let quantity = await exist_najie_thing(usr_qq, name, '道具') //查找纳戒
    if (!quantity) {
      //没有
      e.reply(`你没有[${name}]`)
      return false
    }
    let player_level = player.仙宠.等级
    let last_jiachen = player.仙宠.加成
    if (player_level == list_level[x]) {
      //判断是否满级
      let thing = data.xianchon.find((item) => item.id == player.仙宠.id + 1) //查找下个等级仙宠
      console.log(thing)
      player.仙宠 = thing
      player.仙宠.等级 = player_level //赋值之前the等级
      player.仙宠.加成 = last_jiachen //赋值之前the加成
      await Add_najie_thing(usr_qq, name, '道具', -1)
      await Write_player(usr_qq, player)
      e.reply('恭喜进阶【' + player.仙宠.name + '】成功')
    } else {
      let need = Number(list_level[x]) - Number(player_level)
      e.reply('仙宠the灵泉集韵不足,还需要【' + need + '】级方可进阶')
      return false
    }
  }

  async feed(e) {
    let usr_qq = e.user_id
    //用户不存在
    let ifexistplay = data.existData('player', usr_qq)
    if (!ifexistplay) return false
    let player = data.getData('player', usr_qq)
    if (player.仙宠 == '') {
      //有无仙宠
      e.reply('你没有仙宠')
      return false
    }
    let thing = e.msg.replace('#', '')
    thing = thing.replace('喂给仙宠', '')
    let code = thing.split('*')
    let thing_name = code[0] //物品
    let thing_value = await convert2integer(code[1]) //数量
    let ifexist = data.xianchonkouliang.find((item) => item.name == thing_name) //查找
    if (!isNotNull(ifexist)) {
      e.reply('此乃凡物,仙宠不吃' + thing_name)
      return false
    }
    if (
      player.仙宠.等级 == player.仙宠.等级上限 &&
      player.仙宠.品级 != '仙灵'
    ) {
      e.reply('等级已达到上限,请主人尽快为仙宠突破品级')
      return false
    }
    if (
      player.仙宠.品级 == '仙灵' &&
      player.仙宠.等级 == player.仙宠.等级上限
    ) {
      e.reply('您the仙宠已达到天赋极限')
      return false
    }
    //纳戒中the数量
    let thing_quantity = await exist_najie_thing(usr_qq, thing_name, '仙宠口粮')
    if (thing_quantity < thing_value || !thing_quantity) {
      //没有
      e.reply(`【${thing_name}】数量不足`)
      return false
    }
    //纳戒数量减少
    await Add_najie_thing(usr_qq, thing_name, '仙宠口粮', -thing_value)
    //待完善加成
    let jiachen = ifexist.level * thing_value //加the等级
    if (jiachen > player.仙宠.等级上限 - player.仙宠.等级) {
      jiachen = player.仙宠.等级上限 - player.仙宠.等级
    }
    //保留
    player.仙宠.加成 += jiachen * player.仙宠.每级增加
    if (player.仙宠.type == '修炼') {
      player.Improving_cultivation_efficiency += jiachen * player.仙宠.每级增加
    }
    if (player.仙宠.type == '幸运') {
      player.幸运 += jiachen * player.仙宠.每级增加
    }
    if (player.仙宠.等级上限 > player.仙宠.等级 + jiachen) {
      player.仙宠.等级 += jiachen
    } else {
      if (player.仙宠.品级 == '仙灵') {
        e.reply('您the仙宠已达到天赋极限')
      } else {
        e.reply('等级已达到上限,请主人尽快为仙宠突破品级')
      }
      player.仙宠.等级 = player.仙宠.等级上限
    }
    await data.setData('player', usr_qq, player)
    e.reply(`喂养成功，仙宠the等级增加了${jiachen},当前为${player.仙宠.等级}`)
    return false
  }
}
