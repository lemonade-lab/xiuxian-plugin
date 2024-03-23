import { join } from 'path'
import { dirname, basename } from 'path'
import { fileURLToPath } from 'url'
const __dirname = dirname(fileURLToPath(import.meta.url))
// 插件名
const AppName = basename(__dirname)
// 插件路径
const cwd = __dirname.replace(/\\/g, '/')
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
