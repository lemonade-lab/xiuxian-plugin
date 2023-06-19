import listdata from '../data/listdata.js'
import { __PATH } from '../data/index.js'
import fs from 'node:fs'
import path from 'node:path'
import { GameApi } from '../../api/index.js'

function getJsonParse(val) {
  return JSON.parse(fs.readFileSync(val))
}

class Player {
  constructor() {
    this.blessPlaceList = getJsonParse(`${__PATH.assRelate}/BlessPlace.json`)
    this.baseTreasureVaultList = getJsonParse(`${__PATH.assRelate}/BaseTreasureVault.json`)
    this.assLabyrinthList = getJsonParse(`${__PATH.assRelate}/AssLabyrinth.json`)
    this.assRelationList = getJsonParse(`${__PATH.assRelation}/AssRelation.json`)
  }

  /**
   * 给背包添加物品
   * @param {用户的背包} BAG
   * @param {物品资料} THING
   * @param {数量} ACCOUNT
   * @returns
   */
  userbagAction(parameter) {
    const { BAG, THING, ACCOUNT } = parameter
    const thing = BAG.thing.find((item) => item.id == THING.id)
    if (thing) {
      let acount = thing.acount + ACCOUNT
      if (acount < 1) {
        BAG.thing = BAG.thing.filter((item) => item.id != THING.id)
      } else {
        BAG.thing.find((item) => item.id == THING.id).acount = acount
      }
      return BAG
    } else {
      THING.acount = ACCOUNT
      BAG.thing.push(THING)
      return BAG
    }
  }

  /**
   * 表名，地址，属性，大小
   * @param {UID, CHOICE, ATTRIBUTE, SIZE} parameter
   * @returns
   */
  updataUser(parameter) {
    const { UID, CHOICE, ATTRIBUTE, SIZE } = parameter
    // 读取原数据
    const data = listdata.userMsgAction({ NAME: UID, CHOICE })
    data[ATTRIBUTE] += Math.trunc(SIZE)
    listdata.userMsgAction({ NAME: UID, CHOICE, DATA: data })
  }

  /**
   * 检测宗门存档或用户宗门信息是否存在
   * @param filePathType ["assPlayer" , "association" ]
   * @param fileName
   */
  existAss(filePathType, fileName) {
    let filePath
    filePath = __PATH[filePathType]
    let dir = path.join(filePath + '/' + fileName + '.json')
    if (fs.existsSync(dir)) {
      return true
    }
    return false
  }

  /**
   * 获取用户宗门信息或宗门存档
   * @param assName
   * @param userQQ
   */
  getAssOrPlayer(type, name) {
    let filePath
    let dir
    let data
    if (type == 1) {
      filePath = __PATH.assPlayer
      dir = path.join(filePath + '/' + name + '.json')
    } else if (type == 2) {
      filePath = __PATH.association
      dir = path.join(filePath + '/' + name + '.json')
    } else if (type == 3) {
      filePath = __PATH.interimArchive
      dir = path.join(filePath + '/' + name + '.json')
    } else {
      filePath = __PATH.assTreasureVault
      dir = path.join(filePath + '/' + name + '.json')
    }

    try {
      data = fs.readFileSync(dir, 'utf8')
    } catch (error) {
      return 'error'
    }
    // 将字符串数据转变成json格式
    data = JSON.parse(data)
    return data
  }

  readAssNames(name) {
    const dir = __PATH[name]
    let allNames = fs.readdirSync(dir)
    allNames = allNames.filter((file) => file.endsWith('.json'))
    return allNames
  }

  numberVerify(num) {
    num = num.trim()
    num = isNaN(Number(num)) ? 1 : Number(num)
    num = Math.abs(num) == 0 ? 1 : Math.abs(num)
    return Number(num)
  }

  /**
   * 写入数据
   * @param fileName  ["assPlayer" , "association" ]
   * @param itemName
   * @param data
   */
  setAssOrPlayer(fileName, itemName, data) {
    let filePath
    let dir

    filePath = __PATH[fileName]
    dir = path.join(filePath + '/' + itemName + '.json')

    let theARR = JSON.stringify(data, '', '\t') // json转string
    fs.writeFileSync(dir, theARR, 'utf-8', (err) => {
      console.log('写入成功', err)
    })
  }

  assEffCount(assPlayer) {
    let effective = 0
    if (assPlayer.assName == 0) {
      assPlayer.effective = effective
      this.setAssOrPlayer('assPlayer', assPlayer.qqNumber, assPlayer)
      return
    }
    let ass = this.getAssOrPlayer(2, assPlayer.assName)

    if (ass.resident.id != 0) {
      effective += ass.resident.efficiency
    }
    if (ass.facility[4].status != 0) {
      effective += ass.level * 0.05
      effective += ass.level * ass.resident.level * 0.01
    }

    let coefficient = 1 + assPlayer.assJob / 10

    effective = effective * coefficient
    assPlayer.effective = effective.toFixed(2)
    GameApi.Player.addExtendPerpetual({
      NAME: assPlayer.qqNumber,
      FLAG: 'ass',
      TYPE: 'efficiency',
      VALUE: Number(assPlayer.effective)
    })
    this.setAssOrPlayer('assPlayer', assPlayer.qqNumber, assPlayer)
    GameApi.Player.updataUserEfficiency(assPlayer.qqNumber)
  }

  assRename(ass, type, associationName) {
    let assRelation = this.assRelationList
    const find = assRelation.find((item) => item.id == ass)
    const location = assRelation.findIndex((item) => item.id == ass)
    if (type == 1) {
      find.name = associationName
    } else {
      find.unchartedName = associationName
    }
    assRelation.splice(location, 1, find)
    let filePath = __PATH.assRelation
    let dir

    dir = path.join(filePath + '/AssRelation.json')

    let theARR = JSON.stringify(assRelation, '', '\t') // json转string
    fs.writeFileSync(dir, theARR, 'utf-8', (err) => {
      console.log('写入成功', err)
    })
  }

  searchThingById(id) {
    const newVar = GameApi.listdata.controlAction({ NAME: 'all', CHOICE: 'generate_all' })
    return newVar.find((item) => item.id == id)
  }

  checkFacility(ass) {
    let oldStatus = ass.facility[4].status
    const buildNumList = [100, 500, 500, 200, 200, 200, 300]
    for (let i = 0; i < ass.facility.length; i++) {
      if (ass.facility[i].buildNum > buildNumList[i]) {
        ass.facility[i].status = 1
      } else {
        ass.facility[i].status = 0
      }
    }
    this.setAssOrPlayer('association', ass.id, ass)
    if (oldStatus != ass.facility[4].status) {
      const playerList = ass.allMembers
      for (let playerID of playerList) {
        const UID = playerID
        if (this.existAss('assPlayer', UID)) {
          const assOrPlayer = this.getAssOrPlayer(1, UID)
          this.assEffCount(assOrPlayer)
        }
      }
    }
  }

  existArchive(qq) {
    let player = GameApi.Player.existUser(qq)
    // 不存在
    if (!player) return false
    // 修仙存在此人，看宗门系统有没有他
    if (!this.existAss('assPlayer', qq)) {
      let assPlayer = {
        assName: 0,
        qqNumber: qq + '',
        assJob: 0,
        effective: 0,
        contributionPoints: 0,
        historyContribution: 0,
        favorability: 0,
        volunteerAss: 0,
        lastSignAss: 0,
        lastExplorTime: 0,
        lastBounsTime: 0,
        xiuxianTime: player.createTime,
        time: []
      }
      this.setAssOrPlayer('assPlayer', qq, assPlayer)
    }
    let assPlayer = this.getAssOrPlayer(1, qq)
    // 只有生命计数一样，且生命状态正常才为true
    if (player.createTime == assPlayer.xiuxianTime && player.status == 1) {
      return true
    }
    // 两边都有存档，但是死了，或者重生了，需要执行插件删档
    // 先退宗，再重置
    if (this.existAss('association', assPlayer.assName)) {
      let ass = this.getAssOrPlayer(2, assPlayer.assName)

      if (assPlayer.assJob < 10) {
        ass.allMembers = ass.allMembers.filter((item) => item != assPlayer.qqNumber) // 原来的职位表删掉这个B
        this.setAssOrPlayer('association', ass.id, ass) // 记录到存档
      } else {
        if (ass.allMembers.length < 2) {
          fs.rmSync(`${__PATH.association}/${assPlayer.assName}.json`)
        } else {
          ass.allMembers = ass.allMembers.filter((item) => item != assPlayer.qqNumber)
          // 给宗主
          let randMember = { assJob: 0 }
          for (let item in ass.allMembers) {
            const qqNum = ass.allMembers[item]
            const assPlayerA = this.getAssOrPlayer(1, qqNum)
            if (assPlayerA.assJob > randMember.assJob) {
              randMember = assPlayerA
            }
          }

          ass.master = randMember.qqNumber
          randMember.assJob = 10

          this.setAssOrPlayer('association', ass.id, ass) // 记录到存档
          this.assEffCount(randMember)
          GameApi.Player.updataUserEfficiency(randMember.qqNumber)
        }
      }
    }
    if (assPlayer.volunteerAss != 0) {
      const ass = this.getAssOrPlayer(2, assPlayer.volunteerAss)
      if (!isNotNull(ass)) {
        ass.applyJoinList = ass.applyJoinList.filter((item) => item != qq)
        this.setAssOrPlayer('association', ass.id, ass)
      }
    }

    assPlayer = {
      assName: 0,
      qqNumber: qq + '',
      assJob: 0,
      effective: 0,
      contributionPoints: 0,
      historyContribution: 0,
      favorability: 0,
      volunteerAss: 0,
      lastSignAss: 0,
      lastExplorTime: 0,
      lastBounsTime: 0,
      xiuxianTime: player.createTime,
      time: []
    }

    this.setAssOrPlayer('assPlayer', qq, assPlayer)
    return false
  }

  BuildAndDeduplication(x, y, thingId) {
    const genX = Math.trunc(Math.random() * 99) + 1
    const genY = Math.trunc(Math.random() * 99) + 1
    const a = genX % 10
    const fileName = `${x}-${y}-${a}.json`
    const dir = `${this.generateUncharted}/${fileName}`
    if (!fs.existsSync(dir)) {
      fs.writeFileSync(dir, '[]', 'utf-8', (err) => {
        console.log('写入成功', err)
      })
    }
    let pointList = JSON.parse(fs.readFileSync(dir))
    let ifexist0 = pointList.find((item) => item.x == genX + x && item.y == genY + y)
    const monLevel = Math.ceil(Math.random() * 13) - 4
    const flag = monLevel < 0 ? 0 : monLevel
    if (!ifexist0) {
      // 写入点位
      const point = {
        x: genX + x,
        y: genY + y,
        monLevel: flag,
        thingId
      }
      pointList.push(point)
      const theARR = JSON.stringify(pointList, '', '\t')
      fs.writeFileSync(dir, theARR, 'utf-8', (err) => {
        console.log('写入成功', err)
      })
    } else {
      this.BuildAndDeduplication(x, y, thingId)
    }
  }

  timeInvert(time) {
    const dateObj = {}
    const date = new Date(time)
    dateObj.Y = date.getFullYear()
    dateObj.M = date.getMonth() + 1
    dateObj.D = date.getDate()
    dateObj.h = date.getHours()
    dateObj.m = date.getMinutes()
    dateObj.s = date.getSeconds()
    return dateObj
  }

  timeChange(timestamp) {
    const date = new Date(timestamp)
    const M = date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1
    return `${date.getFullYear()}-${M}-${date.getDate()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`
  }

  deleteAss(path, name) {
    fs.rmSync(`${__PATH[path]}/${name}.json`)
  }
}
export default new Player()

function isNotNull(obj) {
  if (obj == undefined || obj == null) return false
  return true
}
