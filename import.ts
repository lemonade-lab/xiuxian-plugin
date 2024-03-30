/**
 * *********
 * yunzai模块动态导入
 * *********
 */
const plugin = (await import('' + '../../lib/plugins/plugin.js')).default
const common = (await import('' + '../../lib/common/common.js')).default
const puppeteer = (await import('' + '../../lib/puppeteer/puppeteer.js'))
  .default
export { plugin, common, puppeteer }
import { type GroupMessage } from 'icqq'
/**
 * yunzai消息类型
 */
export interface Message extends GroupMessage {
  isMaster: boolean
  msg: string
  reply: (...arg: any) => Promise<any>
}

export const define = {
  name: 'xiuxian',
  dsc: 'xiuxian',
  event: 'message',
  priority: 999
}
