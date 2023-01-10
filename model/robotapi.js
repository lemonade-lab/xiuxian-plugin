import plugin from '../../../lib/plugins/plugin.js';
export default class Robotapi extends plugin {}
export const superIndex = (arr) => {
    return {
        name: 'xiuxian',
        dsc: 'xiuxian',
        event: 'message',
        priority: 400,
        rule: arr,
    }
}