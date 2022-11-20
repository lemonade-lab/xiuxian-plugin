import plugin from '../../../../lib/plugins/plugin.js';
export class AdminExtend extends plugin {
    constructor() {
        super({
            name: "AdminExtend",
            dsc: "AdminExtend",
            event: "message",
            priority: 400,
            rule: [
                {
                    reg: '^#修仙设置帮助$',
                    fnc: 'Xiuxianhelp'
                }
            ],
        });
    };
     Xiuxianhelp=async(e)=>{
        if (!e.isMaster) {
            return;
        };
        e.reply("待更新！");
        return;
    };
};
