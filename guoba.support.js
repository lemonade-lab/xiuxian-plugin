import path from 'path';
import Config from './model/Config.js';
import { AppName } from './app.config.js';
const _path = `${process.cwd()}/plugins/${AppName}`;
const link = `https://gitee.com/three-point-of-water/${AppName}/`;
const vcf = Config.getConfig('version', 'version');
export function supportGuoba() {
  return {
    pluginInfo: {
      name: AppName,
      title: 'xiuxian@1.3.0',
      author: '',
      authorLink: '',
      link,
      isV3: true,
      isV2: false,
      description: `xiuxian@1.3.0${vcf.version}]`,
      icon: 'mdi:stove',
      iconColor: '#d19f56',
      iconPath: path.join(_path, 'resources/img/xiuxian.png'),
    },
  };
}
