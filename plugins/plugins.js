import plugin from '../../../lib/plugins/plugin.js'
console.log("-------------");
console.log("[修仙插件模块]初始化~");
console.log("-------------");
export class plugins extends plugin {
    constructor() {
        super({
            name: 'plugins',
            dsc: 'plugins',
            event: 'message',
            priority: 600,
            rule: [
            ]
        })
    }
}
