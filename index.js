import Config from "./model/Config.js";
import index from './model/index.js';
const versionData = Config.getdefSet("version", "version");
const xiuxain = await index.toindex('apps');
const plugin = await index.toindex('plugins');
const apps={...xiuxain,...plugin};
logger.info(`Xiuxian-Plugin-Box[V${versionData[0].version}]`);
export {apps};