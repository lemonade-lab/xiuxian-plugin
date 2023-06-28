import { GameApi, plugin } from '#xiuxian-api'
export class BoxadminConfig extends plugin {
  constructor() {
    super({
      rule: [
        { reg: /^(#|\/)修仙开启.*$/, fnc: 'boxaSwitchOpen' },
        { reg: /^(#|\/)修仙关闭.*$/, fnc: 'boxaSwitchOff' },
        { reg: /^(#|\/)修仙配置更改.*$/, fnc: 'updataConfig' },
        { reg: /^(#|\/)修仙重置配置$/, fnc: 'updataConfigRe' }
      ]
    })
  }

  async boxaSwitchOpen(e) {
    if (!e.isMaster) return false
    if (!super.verify(e)) return false
    e = super.escape(e)
    const name = e.cmd_msg.replace(/^(#|\/)修仙开启/, '')
    e.reply(GameApi.Defset.updataSwich(name, true))
    return false
  }

  async boxaSwitchOff(e) {
    if (!e.isMaster) return false
    if (!super.verify(e)) return false
    e = super.escape(e)
    const name = e.cmd_msg.replace(/^(#|\/)修仙关闭/, '')
    e.reply(GameApi.Defset.updataSwich(name, false))
    return false
  }

  async updataConfig(e) {
    if (!e.isMaster) return false
    if (!super.verify(e)) return false
    e = super.escape(e)
    const [name, size] = e.cmd_msg.replace(/^(#|\/)修仙配置更改/, '').split('*')
    e.reply(GameApi.Defset.updataConfig(name, size))
    return false
  }

  async reUpdataConfig(e) {
    if (!e.isMaster) return false
    if (!super.verify(e)) return false
    e = super.escape(e)
    GameApi.Createdata.recreateConfig()
    e.reply('配置已重置')
    return false
  }
}
