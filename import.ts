/**
 * *********
 * yunzai模块动态导入
 * *********
 */
const plugin = await import('' + '../../lib/plugins/plugin.js')
const common = await import('' + '../../lib/common/common.js')
const puppeteer = await import('' + '../../lib/puppeteer/puppeteer.js')
export { plugin, common, puppeteer }
