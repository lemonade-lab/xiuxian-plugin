import { plugin, puppeteer, verc } from '../../api/api.js'
import Help from '../../model/help.js'
import Help2 from '../../model/shituhelp.js'
import md5 from 'md5'
let helpData = {
  md5: '',
  img: ''
}
export class BotHelp extends plugin {
  constructor() {
    super({
      name: 'BotHelp',
      dsc: '修仙帮助',
      event: 'message',
      priority: 400,
      rule: [
        {
          reg: '^#修仙帮助$',
          fnc: 'Xiuxianhelp'
        },
        {
          reg: '^#修仙管理$',
          fnc: 'adminsuper'
        },
        {
          reg: '^#宗门管理$',
          fnc: 'AssociationAdmin'
        },
        {
          reg: '^#修仙扩展$',
          fnc: 'Xiuxianhelpcopy'
        },
        {
          reg: '^#师徒帮助$',
          fnc: 'shituhelp'
        }
      ]
    })
  }

  async Xiuxianhelpcopy(e) {
    if (!verc({ e })) return false
    let data = await Help.gethelpcopy(e)
    if (!data) return false
    let img = await this.cache(data)
    await e.reply(img)
  }
  async Xiuxianhelp(e) {
    if (!verc({ e })) return false
    let data = await Help.get(e)
    if (!data) return false
    let img = await this.cache(data)
    await e.reply(img)
  }

  async adminsuper(e) {
    if (!verc({ e })) return false
    let data = await Help.setup(e)
    if (!data) return false
    let img = await this.cache(data)
    await e.reply(img)
  }

  async AssociationAdmin(e) {
    if (!verc({ e })) return false
    let data = await Help.Association(e)
    if (!data) return false
    let img = await this.cache(data)
    await e.reply(img)
  }

  async shituhelp(e) {
    if (!verc({ e })) return false
    e.reply('维护中')
    return false
    let data = await Help2.shituhelp(e)
    if (!data) return false
    let img = await this.cache(data)
    await e.reply(img)
  }

  async cache(data) {
    let tmp = md5(JSON.stringify(data))
    if (helpData.md5 == tmp) return helpData.img
    helpData.img = await puppeteer.screenshot('help', data)
    helpData.md5 = tmp
    return helpData.img
  }
}
