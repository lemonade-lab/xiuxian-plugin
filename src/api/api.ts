const plugin = await import('' + '../../../lib/plugins/plugin.js')
const common = await import('' + '../../../lib/common/common.js')
const puppeteer = await import('' + '../../../lib/puppeteer/puppeteer.js')
import config from '../model/Config.js'
import data from '../model/XiuxianData.js'
import Show from '../model/show.js'
export { plugin, common, puppeteer, data, config, Show }
