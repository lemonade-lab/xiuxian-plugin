import { applicationOptions } from 'yunzai'
import Apps from './apps'
const Data = []

export default () => {
  return applicationOptions({
    // 插件创建时
    create() {
      for (const item of Apps) {
        Data.push(new item())
      }
    },
    // 被执行时
    mounted() {
      return Data
    }
  })
}
