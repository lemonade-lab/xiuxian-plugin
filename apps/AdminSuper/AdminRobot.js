import plugin from '../../../../lib/plugins/plugin.js';
export class AdminRobot extends plugin {
    constructor() {
        super({
            name: 'AdminRobot',
            dsc: 'AdminRobot',
            event: 'message',
            priority: 400,
            rule: [
                {
                    reg: '^#修仙关闭云仔',
                    fnc: 'CloseRobot',
                }
            ],
        });
        this.key = 'xiuxian:restart';
    };
    CloseRobot=async(e)=>{
        if (!e.isMaster) {
            return;
        };
        e.reply('待更新');
        return true;
    };
};