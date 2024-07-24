import { applicationOptions, useAppStorage } from 'yunzai'
import Apps from './apps'
export default (config?: { name: string }) => {
  const Data = useAppStorage()
  return applicationOptions({
    // 插件创建时
    create() {
      if (config?.name) console.log(config.name)
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
