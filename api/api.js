import plugin from '../../../lib/plugins/plugin.js';
import common from '../../../lib/common/common.js';
import puppeteer from '../../../lib/puppeteer/puppeteer.js';

import config from '../model/Config.js';
import data from '../model/XiuxianData.js';
import Show from '../model/show.js';

let botdata = await import('icqq');
if (botdata) botdata = await import('oicq');
const { segment } = botdata;

export const verc = ({ e }) => {
  const { whitecrowd, blackid } = config.getConfig('parameter', 'namelist');
  if (whitecrowd.indexOf(e.group_id) == -1) return false;
  if (blackid.indexOf(e.user_id) != -1) return false;
  return true;
};
export { plugin, common, segment, puppeteer, data, config, Show };
