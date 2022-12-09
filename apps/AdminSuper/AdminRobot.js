import plugin from '../../../../lib/plugins/plugin.js';
import defSet from '../../model/defSet.js';
export class AdminRobot extends plugin {
    constructor() {
        super({
            name: 'AdminRobot',
            dsc: 'AdminRobot',
            event: 'message',
            priority: 400,
            rule: [
                {
                    reg: '^#修仙关闭云崽',
                    fnc: 'CloseRobot',
                },
                {
                    reg: '^#修仙设置帮助',
                    fnc: 'CloseRobothelp',
                }
            ],
        });
        this.key = 'xiuxian:restart';
    };
    CloseRobot=async(e)=>{
        if (!e.isMaster) {
            return;
        };
        e.reply(defSet.ReadConfig('group'));
        return true;
    };
    CloseRobothelp=async(e)=>{
        if (!e.isMaster) {
            return;
        };
        e.reply(defSet.ReadConfighelp('group'));
        return true;
    }
};