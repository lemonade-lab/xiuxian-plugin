import { Application, applicationOptions } from 'yunzaijs'
import redisClient from '@src/model/redis'
import Apps from '@src/apps'
export default (config?: { name: string }) => {
  // 预先存储
  const Rules: {
    reg: RegExp | string
    key: number
  }[] = []
  return applicationOptions({
    // 插件创建时
    create() {
      // 打印
      if (config?.name) console.log(config.name)
      //  预处理
      for (let i = 0; i < Apps.length; i++) {
        // 推类型
        const app: typeof Application.prototype = new Apps[i]()
        // 用  reg 和 key 连接起来。
        // 也可以进行自由排序
        for (const rule of app.rule) {
          Rules.push({
            reg: rule.reg,
            key: i
          })
        }
      }
    },
    // 被执行时
    async mounted(e) {
      // 用户拦截
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
      // 存储
      const Data = []
      // 如果key不存在
      const Cache = {}
      // 预处理
      if (e['msg']) {
        for (const Item of Rules) {
          // 匹配正则
          // 存在key
          // 第一次new
          if (
            new RegExp(Item.reg).test(e['msg']) &&
            Apps[Item.key] &&
            !Cache[Item.key]
          ) {
            Cache[Item.key] = true
            Data.push(new Apps[Item.key]())
          }
        }
      }
      return Data
    }
  })
}
