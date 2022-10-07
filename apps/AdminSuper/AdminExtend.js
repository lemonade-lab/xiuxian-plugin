
import plugin from '../../../../lib/plugins/plugin.js'
/**
 * 修仙
 * 加载
 */
export class AdminExtend extends plugin {
    constructor() {
        super({
            name: "AdminExtend",
            dsc: "AdminExtend",
            event: "message",
            priority: 100,
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
        if (!e.isGroup) {
            return;
        }
        e.reply("待更新！");
        return;
    }

    async Xiuxianloadorganization(e) {
        if (!e.isMaster) {
            return;
        }
        if (!e.isGroup) {
            return;
        }
        e.reply("待更新！");
        return;
    }

}

