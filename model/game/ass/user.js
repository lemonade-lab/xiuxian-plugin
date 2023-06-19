import fs from 'node:fs'
import path from 'node:path'
import Method from '../wrap/method.js'
import Listdata from '../data/listdata.js'
import Talent from '../box/talent.js'
import Player from '../box/player.js'
import { __PATH } from '../data/index.js'
//汐颜
class GP {
  constructor() {
    // 固定表数据
    this.blessPlaceList = Listdata.controlAction({
      NAME: 'BlessPlace',
      CHOICE: 'assRelate'
    })
    this.baseTreasureVaultList = Listdata.controlAction({
      NAME: 'BaseTreasureVault',
      CHOICE: 'assRelate'
    })
    this.assLabyrinthList = Listdata.controlAction({
      NAME: 'AssLabyrinth',
      CHOICE: 'assRelate'
    })
    this.assRelationList = Listdata.controlAction({
      NAME: 'AssRelation',
      CHOICE: 'assRelation'
    })
    // 配置
    this.numberMaximums = [6, 8, 10, 13, 16, 18, 20, 23, 25]
    this.spiritStoneAnsMax = [
      2000000, 5000000, 8000000, 11000000, 15000000, 20000000, 35000000, 50000000, 80000000
    ]
    this.buildNameList = ['山门', '藏宝阁', '宗门秘境', '神兽祭坛', '聚灵阵', '护宗大阵']
  }

  /**
   * 检测宗门存档或用户宗门信息是否存在
   * @param filePathType ["assGP" , "association" ]
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
  getAssOrGP(type, name) {
    let filePath
    let dir
    let data
    if (type == 1) {
      filePath = __PATH.assGP
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

  /**
   * 
   * @param {*} name 
   * @returns 
   */
  readAssNames(name) {
    const dir = __PATH[name]
    let allNames = fs.readdirSync(dir)
    allNames = allNames.filter((file) => file.endsWith('.json'))
    return allNames
  }

  /**
   * 
   * @param {*} num 
   * @returns 
   */
  numberVerify(num) {
    num = num.trim()
    num = isNaN(Number(num)) ? 1 : Number(num)
    num = Math.abs(num) == 0 ? 1 : Math.abs(num)
    return Number(num)
  }

  /**
   * 写入数据
   * @param fileName  ["assGP" , "association" ]
   * @param itemName
   * @param data
   */
  setAssOrGP(fileName, itemName, data) {
    let filePath
    let dir

    filePath = __PATH[fileName]
    dir = path.join(filePath + '/' + itemName + '.json')

    let theARR = JSON.stringify(data, '', '\t') // json转string
    fs.writeFileSync(dir, theARR, 'utf-8', (err) => {
      console.info('写入成功', err)
    })
  }

  /**
   * 
   * @param {*} assGP 
   * @returns 
   */
  assEffCount(assGP) {
    let effective = 0
    if (assGP.assName == 0) {
      assGP.effective = effective
      this.setAssOrGP('assGP', assGP.qqNumber, assGP)
      return
    }
    let ass = this.getAssOrGP(2, assGP.assName)

    if (ass.resident.id != 0) {
      effective += ass.resident.efficiency
    }
    if (ass.facility[4].status != 0) {
      effective += ass.level * 0.05
      effective += ass.level * ass.resident.level * 0.01
    }

    let coefficient = 1 + assGP.assJob / 10

    effective = effective * coefficient
    assGP.effective = effective.toFixed(2)
    Talent.addExtendPerpetual({
      NAME: assGP.qqNumber,
      FLAG: 'ass',
      TYPE: 'efficiency',
      VALUE: Number(assGP.effective)
    })
    this.setAssOrGP('assGP', assGP.qqNumber, assGP)
    Talent.updataEfficiency(assGP.qqNumber)
  }

  /**
   * 
   * @param {*} ass 
   * @param {*} type 
   * @param {*} associationName 
   */
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
      console.info('写入成功', err)
    })
  }

  /**
   * 
   * @param {*} ass 
   */
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
    this.setAssOrGP('association', ass.id, ass)
    if (oldStatus != ass.facility[4].status) {
      const GPList = ass.allMembers
      for (let GPID of GPList) {
        const UID = GPID
        if (this.existAss('assGP', UID)) {
          const assOrGP = this.getAssOrGP(1, UID)
          this.assEffCount(assOrGP)
        }
      }
    }
  }

  /**
   * 
   * @param {*} qq 
   * @returns 
   */
  existArchive(qq) {
    let GP = Player.getUserLife(qq)

    // 不存在
    if (!GP) return false
    // 修仙存在此人，看宗门系统有没有他
    if (!this.existAss('assGP', qq)) {
      let assGP = {
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
        xiuxianTime: GP.createTime,
        time: []
      }
      this.setAssOrGP('assGP', qq, assGP)
    }
    let assGP = this.getAssOrGP(1, qq)
    // 只有生命计数一样，且生命状态正常才为true
    if (GP.createTime == assGP.xiuxianTime && GP.status == 1) {
      return true
    }
    // 两边都有存档，但是死了，或者重生了，需要执行插件删档
    // 先退宗，再重置
    if (this.existAss('association', assGP.assName)) {
      let ass = this.getAssOrGP(2, assGP.assName)

      if (assGP.assJob < 10) {
        ass.allMembers = ass.allMembers.filter((item) => item != assGP.qqNumber) // 原来的职位表删掉这个B
        this.setAssOrGP('association', ass.id, ass) // 记录到存档
      } else {
        if (ass.allMembers.length < 2) {
          fs.rmSync(`${__PATH.association}/${assGP.assName}.json`)
        } else {
          ass.allMembers = ass.allMembers.filter((item) => item != assGP.qqNumber)
          // 给宗主
          let randMember = { assJob: 0 }
          for (let item in ass.allMembers) {
            const qqNum = ass.allMembers[item]
            const assGPA = this.getAssOrGP(1, qqNum)
            if (assGPA.assJob > randMember.assJob) {
              randMember = assGPA
            }
          }

          ass.master = randMember.qqNumber
          randMember.assJob = 10

          this.setAssOrGP('association', ass.id, ass) // 记录到存档
          this.assEffCount(randMember)
          Talent.updataEfficiency(randMember.qqNumber)
        }
      }
    }
    if (assGP.volunteerAss != 0) {
      const ass = this.getAssOrGP(2, assGP.volunteerAss)
      if (!Method.isNotNull(ass)) {
        ass.applyJoinList = ass.applyJoinList.filter((item) => item != qq)
        this.setAssOrGP('association', ass.id, ass)
      }
    }

    assGP = {
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
      xiuxianTime: GP.createTime,
      time: []
    }

    this.setAssOrGP('assGP', qq, assGP)
    return false
  }

  /**
   * 
   * @param {*} x 
   * @param {*} y 
   * @param {*} thingId 
   */
  BuildAndDeduplication(x, y, thingId) {
    const genX = Math.trunc(Math.random() * 99) + 1
    const genY = Math.trunc(Math.random() * 99) + 1
    const a = genX % 10
    const fileName = `${x}-${y}-${a}.json`
    const dir = `${this.generateUncharted}/${fileName}`
    if (!fs.existsSync(dir)) {
      fs.writeFileSync(dir, '[]', 'utf-8', (err) => {
        console.info('写入成功', err)
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
        console.info('写入成功', err)
      })
    } else {
      this.BuildAndDeduplication(x, y, thingId)
    }
  }
  
  /**
   * 
   * @param {*} path 
   * @param {*} name 
   */
  deleteAss(path, name) {
    fs.rmSync(`${__PATH[path]}/${name}.json`)
  }
}
export default new GP()
