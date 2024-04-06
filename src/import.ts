const plugin = (await import('' + '../../lib/plugins/plugin.js')).default
// const common = (await import('' + '../../lib/common/common.js')).default.default
export { plugin }
import { type GroupMessage } from 'icqq'
/**
 * Yunzai-event
 */
export interface Event extends GroupMessage {
  isMaster: boolean
  group: {
    recallMsg: (...arg: any) => any
  }
  msg: string
  reply: (...arg: any) => Promise<any>
}

export const define = {
  name: 'xiuxian',
  dsc: 'xiuxian',
  event: 'message',
  priority: 999
}
