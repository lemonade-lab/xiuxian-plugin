import plugin from '../../../lib/plugins/plugin.js'
//类名必须与文件名一致，即plugins跟plugins.js
export class plugins extends plugin {
    constructor() {
        super({
            name: 'plugins',
            dsc: 'plugins',
            event: 'message',
            //优先级，越小越高
            priority: 600,
            rule: [
                {
                    //指令
                    reg: '^#修仙插件测试$',
                    //函数
                    fnc: 'xianxianceshi'
                }
            ]
        })
    }

    // 异步  函数名（消息）
    async xianxianceshi(e){
        //非主人拦截
        if (!e.isMaster) {
            return;
        };
        //发送消息
        e.reply("#修仙插件测试")
        return;
    }
}
