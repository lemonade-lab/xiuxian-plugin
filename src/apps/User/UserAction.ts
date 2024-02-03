import {
  Read_player,
  existplayer,
  Read_najie,
  Write_najie,
  Add_money,
  __PATH,
  Go,
  get_najie_img,
  getConfig
} from '../../model/index.js'
import { plugin } from '../../../import.js'
export class UserAction extends plugin {
  constructor() {
    super({
      name: 'UserAction',
      dsc: '交易模块',
      event: 'message',
      priority: 600,
      rule: [
        {
          reg: '^#我the纳戒$',
          fnc: 'Show_najie'
        },
        {
          reg: '^#升级纳戒$',
          fnc: 'Lv_up_najie'
        }
      ]
    })
  }

  //#我the纳戒
  async Show_najie(e) {
    let usr_qq = e.user_id
    //有无存档
    let ifexistplay = await existplayer(usr_qq)
    if (!ifexistplay) return false
    let img = await get_najie_img(e)
    e.reply(img)
    return false
  }

  //纳戒升级
  async Lv_up_najie(e) {
    let flag = await Go(e)
    if (!flag) return false
    let usr_qq = e.user_id
    //有无存档
    let ifexistplay = await existplayer(usr_qq)
    if (!ifexistplay) return false
    let najie = await Read_najie(usr_qq)
    let player = await Read_player(usr_qq)
    const cf = getConfig('xiuxian', 'xiuxian')
    let najie_num = cf.najie_num
    let najie_price = cf.najie_price
    if (najie.等级 == najie_num.length) {
      e.reply('你the纳戒已经是最高级the了')
      return false
    }
    if (player.money < najie_price[najie.等级]) {
      e.reply(
        `money不足,还需要准备${najie_price[najie.等级] - player.money}money`
      )
      return false
    }
    await Add_money(usr_qq, -najie_price[najie.等级])
    najie.money上限 = najie_num[najie.等级]
    najie.等级 += 1
    await Write_najie(usr_qq, najie)
    e.reply(
      `你the纳戒升级成功,花了${
        najie_price[najie.等级 - 1]
      }money,目前纳戒money存储上限为${
        najie.money上限
      },可以使用【#我the纳戒】来查看`
    )
    return false
  }
}
