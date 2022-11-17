import plugin from '../../../../lib/plugins/plugin.js';
//类名必须与文件名一致，即plugins跟plugins.js
export class exampleplugin extends plugin {
    //基础构造
    constructor() {
        super({
            //
            name: 'exampleplugin',
            //
            dsc: 'exampleplugin',
            //
            event: 'message',
            //优先级，越小越高
            priority: 600,
            //
            rule: [
                {
                    //指令
                    reg: '^#插件示例测试$',
                    //函数
                    fnc: 'xianxianceshi'
                }
            ]
        });
    };
    // 异步  函数名（消息）
    async xianxianceshi(e){
        //非私聊拦截
        if (!e.isGroup) {
            return;
        };
        //非主人拦截
        if (!e.isMaster) {
            return;
        };
        //发送消息
        e.reply("#插件示例测试");
        return;
    };
};