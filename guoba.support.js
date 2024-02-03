import path from 'path'
import Config from './model/Config.js'
import { AppName, MyDirPath } from './config.js'
const link = `https://gitee.com/ningmengchongshui/${AppName}/`
const pkg = Config.getConfig('version', 'version')
export function supportGuoba() {
  return {
    pluginInfo: {
      name: AppName,
      title: 'xiuxian@1.4.0',
      author: '',
      authorLink: '',
      link,
      isV3: true,
      isV2: false,
      description: `xiuxian@1.4.0${pkg.version}]`,
      icon: 'mdi:stove',
      iconColor: '#d19f56',
      iconPath: path.join(MyDirPath, 'resources/img/xiuxian.png')
    }
  }
}
