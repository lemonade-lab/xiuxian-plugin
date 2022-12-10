import plugin from '../../../../lib/plugins/plugin.js';
import XiuxianYaml from '../../model/XiuxianYaml.js';
export class AdminYaml extends plugin {
    constructor() {
        super({
            name: 'AdminYaml',
            dsc: 'AdminYaml',
            event: 'message',
            priority: 400,
            rule: [
                {
                    reg: '^#修仙冷却更改.*',
                    fnc: 'CDupdata',
                },
                {
                    reg: '^#修仙配置更改.*',
                    fnc: 'configupdata',
                }
            ],
        });
    };
    CDupdata=async(e)=>{
        if (!e.isMaster) {
            return;
        };
        const config = e.msg.replace('#修仙冷却更改', '');
        const code = config.split('\*');
        const [name,size] = code;
        if(name=='突破'){
            e.reply(XiuxianYaml.UPdataCD('Level_up',size));
            return;
        }
        else if(name=='破体'){
            e.reply(XiuxianYaml.UPdataCD('LevelMax_up',size));
            return;
        }else if(name=='道宣'){
            e.reply(XiuxianYaml.UPdataCD('Autograph',size));
            return;
        }else if(name=='改名'){
            e.reply(XiuxianYaml.UPdataCD('Name',size));
            return;
        }else if(name=='重生'){
            e.reply(XiuxianYaml.UPdataCD('Reborn',size));
            return;
        }else if(name=='赠送'){
            e.reply(XiuxianYaml.UPdataCD('Transfer',size));
            return;
        }else if(name=='攻击'){
            e.reply(XiuxianYaml.UPdataCD('Attack',size));
            return;
        }else if(name=='击杀'){
            e.reply(XiuxianYaml.UPdataCD('Kill',size));
            return;
        }else{
            e.reply('暂无该配置信息');
            return;
        }
    };
    configupdata=async(e)=>{
        if (!e.isMaster) {
            return;
        };
        const config = e.msg.replace('#修仙配置更改', '');
        const code = config.split('\*');
        const [name,size] = code;//内容
        if(name=='白名单群'){
            e.reply(XiuxianYaml.UPdataconfig('group','white',size));
            return;
        }else if(name=='年龄每小时增加'){
            e.reply(XiuxianYaml.UPdataconfig('Age','size',size));
            return;
        }else if(name=='最多功法持有数'){
            e.reply(XiuxianYaml.UPdataconfig('myconfig','gongfa',size));
            return;
        }else if(name=='最多装备持有数'){
            e.reply(XiuxianYaml.UPdataconfig('myconfig','equipment',size));
            return;
        }else if(name=='闭关倍率'){
            e.reply(XiuxianYaml.UPdataconfig('biguan','size',size));
            return;
        }else if(name=='闭关时间'){
            e.reply(XiuxianYaml.UPdataconfig('biguan','time',size));
            return;
        }else if(name=='降妖倍率'){
            e.reply(XiuxianYaml.UPdataconfig('work','size',size));
            return;
        }else if(name=='降妖时间'){
            e.reply(XiuxianYaml.UPdataconfig('work','time',size));
            return;
        }else{
            e.reply('暂无该配置信息');
            return;
        }
    };
};