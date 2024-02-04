import {
  existsSync,
  mkdirSync,
  promises,
  readFileSync,
  readdirSync,
  statSync,
  writeFileSync
} from 'fs'
import { __PATH, data, getTimeStr } from '../../model/index.js'
import { plugin } from '../../../import.js'
export class BackUp extends plugin {
  constructor() {
    super({
      name: 'BackUp',
      dsc: '存档备份',
      event: 'message',
      priority: 1000,
      rule: [
        {
          reg: /^(#|\/)备份存档$/,
          fnc: 'saveBackUp'
        },
        {
          reg: /^(#|\/)存档列表$/,
          fnc: 'checkBackUp'
        },
        {
          reg: /^(#|\/)读取存档(.*)/,
          fnc: 'loadBackUp'
        }
      ]
    })
    this.saving = false
    this.task = {
      cron: data.test.AutoBackUpTask,
      name: 'AutoBackUp',
      fnc: this.saveBackUp
    }
  }

  async saveBackUp(e) {
    try {
      if (!e.isMaster) {
        e.reply('只有主人可以执行操作')
        return false
      }
      await e?.reply('开始备份...')
      const needSave = [
        'association',
        'Exchange',
        'qinmidu',
        'duanlu',
        'shitu',
        'tiandibang',
        'equipment_path',
        'najie_path',
        'player_path',
        'custom',
        'shop',
        'danyao_path'
      ]

      // [[fn, fn...], ...]
      const readFnameTask = needSave.map((folderName) => {
        return promises.readdir(__PATH[folderName])
      })
      const dataFname = await Promise.all(readFnameTask)

      // [[data, data...], ...]
      const readDoneTask = needSave.map((folderName, index) => {
        dataFname[index] = dataFname[index].filter((fn) => fn.endsWith('.json'))

        const readTask = dataFname[index].map((fn) =>
          promises.readFile(`${__PATH[folderName]}/${fn}`)
        )
        return Promise.all(readTask)
      })
      const dataProm = Promise.all(readDoneTask)
      // 先泡杯茶等等dataProm吧

      // redis
      const redisObj = {}
      const redisKeys = await redis.keys('xiuxian:*')
      const redisTypes = await Promise.all(
        redisKeys.map((key) => redis.type(key))
      )
      const redisValues = await Promise.all(
        redisKeys.map((key, i) => {
          switch (redisTypes[i]) {
            case 'string':
              return redis.get(key)
            case 'set':
              return redis.sMembers(key)
          }
        })
      )
      redisKeys.forEach(
        (key, i) => (redisObj[key] = [redisTypes[i], redisValues[i]])
      )

      // 看看前置工作有没有完成
      if (!existsSync(__PATH.backup)) {
        mkdirSync(__PATH.backup, { recursive: true })
      }

      const nowTimeStamp = Date.now()
      const saveFolder = `${__PATH.backup}/${nowTimeStamp}`
      if (existsSync(saveFolder)) {
        e?.reply('致命错误...')
        return
      }
      mkdirSync(saveFolder)

      // 好了吗？好了就写到backup
      const saveData = await dataProm
      const finishTask = needSave.map((folderName, index) => {
        mkdirSync(`${saveFolder}/${folderName}`)

        const writeTask = saveData[index].map((sd, i) =>
          promises.writeFile(
            `${saveFolder}/${folderName}/${dataFname[index][i]}`,
            sd
          )
        )
        return Promise.all(writeTask)
      })

      // redis
      writeFileSync(`${saveFolder}/redis.json`, JSON.stringify(redisObj))

      // 尘埃落定了就提示一下
      await Promise.all(finishTask)

      const timeStr = getTimeStr(nowTimeStamp)
      e?.reply(`存档已备份：${timeStr}`)
      return false
    } catch (err) {
      await e?.reply(`备份失败，${err}`)
      throw err
    }
  }

  async checkBackUp(e) {
    try {
      if (!e.isMaster) {
        e.reply('只有主人可以执行操作')
        return false
      }

      let backUpList = readdirSync(__PATH.backup).filter((folderName) => {
        const stat = statSync(`${__PATH.backup}/${folderName}`)
        return folderName === `${Number(folderName)}` && stat.isDirectory()
      })
      if (backUpList.length > 80) backUpList = backUpList.slice(-80)

      const backUpObj = backUpList
        .map((timeStamp) => getTimeStr(timeStamp))
        .map((str, index) => {
          return {
            message: `${index + 1}：${str}`,
            nickname: Bot.nickname,
            user_id: Bot.uin
          }
        })
      e.reply(await Bot.makeForwardMsg(backUpObj))
      return false
    } catch (err) {
      await e.reply(`查看存档列表失败，${err}`)
      throw err
    }
  }

  async loadBackUp(e) {
    try {
      if (!e.isMaster) {
        e.reply('只有主人可以执行操作')
        return false
      }
      const saveDataNum = Number(e.msg.replace('#读取存档', '').trim())
      if (!(1 <= saveDataNum && saveDataNum <= 80)) {
        e.reply('正确格式：#读取存档[1~80]\n如：#读取存档18')
        return false
      }

      await e.reply('正在自动备份当前存档...')
      await this.saveBackUp(e)

      await e.reply('开始读取存档...')
      let backUpList = readdirSync(__PATH.backup).filter((folderName) => {
        const stat = statSync(`${__PATH.backup}/${folderName}`)
        return folderName === `${Number(folderName)}` && stat.isDirectory()
      })
      if (backUpList.length > 80) backUpList = backUpList.slice(-80)
      const backUpPath = `${__PATH.backup}/${backUpList[saveDataNum - 1]}`
      if (!existsSync(backUpPath)) {
        e.reply('该存档已损坏')
        return false
      }

      const needLoad = [
        'association',
        'Exchange',
        'qinmidu',
        'duanlu',
        'shitu',
        'tiandibang',
        'equipment_path',
        'najie_path',
        'player_path',
        'custom',
        'shop',
        'danyao_path'
      ]

      // [[fn, fn...], ...]
      const readFnameTask = needLoad.map((folderName) => {
        return promises.readdir(`${backUpPath}/${folderName}`)
      })
      const dataFname = await Promise.all(readFnameTask)

      // [[data, data...], ...]
      const readDoneTask = needLoad.map((folderName, index) => {
        dataFname[index] = dataFname[index].filter((fn) => fn.endsWith('.json'))

        const readTask = dataFname[index].map((fn) =>
          promises.readFile(`${backUpPath}/${folderName}/${fn}`)
        )
        return Promise.all(readTask)
      })

      // redis
      let redisObj = {}
      let includeBackup = true
      try {
        redisObj = JSON.parse(readFileSync(`${backUpPath}/redis.json`, 'utf-8'))
      } catch (_) {
        includeBackup = false // 这个备份不包含redis
      }

      const loadData = await Promise.all(readDoneTask)

      // 导入
      const finishTask = needLoad.map(async (folderName, index) => {
        // 删一删原本the存档
        const originFname = readdirSync(`${__PATH[folderName]}`)
        const clearTask = originFname.map((fn) => {
          if (!fn.endsWith('.json')) return Promise.resolve()

          return promises.rm(`${__PATH[folderName]}/${fn}`)
        })
        await Promise.all(clearTask)

        // 删原本theredis
        if (includeBackup) {
          const originRedisKeys = await redis.keys('xiuxian:*')
          const clearRedisTask = originRedisKeys.map((key) => redis.del(key))
          await Promise.all(clearRedisTask)
        }

        // 然后再写入备份the
        const writeTask = loadData[index].map((ld, i) =>
          promises.writeFile(`${__PATH[folderName]}/${dataFname[index][i]}`, ld)
        )

        // 写入备份theredis
        if (includeBackup) {
          await Promise.all(
            Object.keys(redisObj).map((key) => {
              switch (redisObj[key][0]) {
                case 'string':
                  redis.set(key, redisObj[key][1])
                  return
                case 'set':
                  redis.sAdd(key, redisObj[key][1])
                  return
              }
            })
          )
        }

        return Promise.all(writeTask)
      })

      // 尘埃落定了就提示一下
      await Promise.all(finishTask)

      const timeStr = getTimeStr(backUpList[saveDataNum - 1])
      e.reply(`存档已读取：${timeStr}`)
      return false
    } catch (err) {
      await e.reply(`读取失败，${err}`)
      throw err
    }
  }
}
