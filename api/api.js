import plugin from "../../../lib/plugins/plugin.js";
import common from "../../../lib/common/common.js";
import puppeteer from "../../../lib/puppeteer/puppeteer.js";
let botdata = await import("icqq");
if (botdata) botdata = await import("oicq");
const { segment } = botdata;
export { plugin, common, segment, puppeteer };
