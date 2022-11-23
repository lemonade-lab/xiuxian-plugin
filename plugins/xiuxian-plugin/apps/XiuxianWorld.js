import plugin from '../../../../../lib/plugins/plugin.js';
import pluginup from '../model/pluginup.js';
import { __PATH, ForwardMsg,Read_Life } from '../../../apps/Xiuxian/Xiuxian.js';
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
                },
                {
                    reg: '^#修仙存档升级$',
                    fnc: 'Xiuxiandataup'
                }
            ]
        });
    };
    XiuxianWorld = async (e) => {
        if (!e.isMaster) {
            return;
        };
        const life = await Read_Life();
        const msg = ['--修仙世界---'];
        msg.push('人数:' + life.length);
        await ForwardMsg(e, msg);
        return;
    };
    Xiuxiandataup=(e)=>{
        if (!e.isMaster) {
            return;
        };
        const the=pluginup.pluginupdata();
        if(the!=1){
            e.reply('出错了');
            return;
        };
        e.reply('升级完成');
        return;
    };
};