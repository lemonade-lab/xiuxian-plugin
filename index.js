import Config from "./model/Config.js";
import index from './model/index.js';
const versionData = Config.getdefSet("version", "version");
let xiuxain = await index.toindex('apps');
let plugin = await index.toindex('plugins');
let apps={...xiuxain,...plugin};
logger.info(`修仙模拟器[V${versionData[0].version}]`);
logger.info(`修仙答疑群[685979617]`);
export {apps};