import { join } from 'path'
import { AppName, cwd } from './config.js'
export function supportGuoba() {
  return {
    pluginInfo: {
      name: AppName,
      title: 'xiuxian@1.4.0',
      author: '',
      authorLink: '',
      link: `https://gitee.com/ningmengchongshui/xiuxian-plugin`,
      isV3: true,
      isV2: false,
      description: `xiuxian@1.4.0`,
      icon: 'mdi:stove',
      iconColor: '#d19f56',
      iconPath: join(cwd, 'resources/img/xiuxian.png')
    }
  }
}
