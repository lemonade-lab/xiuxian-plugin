import plugin from '../../../lib/plugins/plugin.js'
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
