
import plugin from '../../../../lib/plugins/plugin.js'
export class AdminExtend extends plugin {
    constructor() {
        super({
            name: "AdminExtend",
            dsc: "AdminExtend",
            event: "message",
            priority: 400,
            rule: [
                {
                    reg: '^#加载修仙职业$',
                    fnc: 'Xiuxianloadoccupation'
                },
                {
                    reg: '^#加载修仙宗门$',
                    fnc: 'Xiuxianloadorganization'
                }
            ],
        });
    }

    async Xiuxianloadoccupation(e) {
        if (!e.isMaster) {
            return;
        }
        e.reply("待更新！");
        return;
    }

    async Xiuxianloadorganization(e) {
        if (!e.isMaster) {
            return;
        }
        e.reply("待更新！");
        return;
    }

}

