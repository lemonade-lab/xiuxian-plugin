import { applicationOptions, useAppStorage } from 'yunzai'
import Apps from './apps'
import redisClient from './model/redis'

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
    async mounted(e) {
      const msgCD = await redisClient.get('msgCD', e['user_id'])
      if (msgCD.type != null) return []
      await redisClient.set(
        'msgCD',
        e['user_id'],
        '',
        {
          msgCD: 2
        },
        { EX: 2 }
      )
      return Data
    }
  })
}
