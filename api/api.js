import plugin from "../../../lib/plugins/plugin.js";
import common from "../../../lib/common/common.js";
import puppeteer from "../../../lib/puppeteer/puppeteer.js";
let data = await import("icqq");
if (!data) data = await import("oicq");
const { segment } = data;
const name = "xiuxian@1.2.1";
const dsc = "xiuxian@1.2.1";
export { plugin, segment, common, puppeteer, name, dsc };
