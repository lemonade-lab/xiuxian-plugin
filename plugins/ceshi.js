import plugin from '../../../lib/plugins/plugin.js'
export class ceshi extends plugin {
    constructor() {
        super({
            name: 'ceshi',
            dsc: 'ceshi',
            event: 'message',
            priority: 600,
            rule: [
                {
                    reg: '^#插件测试$',
                    fnc: 'newceshi'
                }
            ]
        })
    }

    //攻击
    async newceshi(e) {
        e.reply("插件测试")
        return;
    }

}
