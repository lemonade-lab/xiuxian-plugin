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
