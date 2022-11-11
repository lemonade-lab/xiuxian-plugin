import plugin from '../../../../lib/plugins/plugin.js'
export class XiuxianWorld extends plugin {
    constructor() {
        super({
            name: 'XiuxianWorld',
            dsc: 'XiuxianWorld',
            event: 'message',
            priority: 600,
            rule: [
                {
                    reg: '^#修仙世界$',
                    fnc: 'XiuxianWorld'
                }
            ]
        })
    }

    async XiuxianWorld(e){
        if (!e.isMaster) {
            return;
        };
        e.reply("#修仙世界");
        return;
    }
}
