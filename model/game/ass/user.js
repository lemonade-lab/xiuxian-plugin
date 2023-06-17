import listdata from '../data/listdata.js'
import { __PATH } from '../data/index.js'
import fs from 'node:fs'
import path from 'path'
import { GameApi } from '../../api/index.js'
class GameUser {
  constructor() {
    this.blessPlaceList = JSON.parse(fs.readFileSync(`${__PATH.assRelate}/BlessPlace.json`))
    this.baseTreasureVaultList = JSON.parse(
      fs.readFileSync(`${__PATH.assRelate}/BaseTreasureVault.json`)
    )
    this.assLabyrinthList = JSON.parse(fs.readFileSync(`${__PATH.assRelate}/AssLabyrinth.json`))
    this.assRelationList = JSON.parse(fs.readFileSync(`${__PATH.assRelation}/AssRelation.json`))
  }
  /**
   * @param {UID} UID
   * @returns 初始化数据，不成功则false
   */
  createDarkPlayer = async (parameter) => {
    const { UID } = parameter
    try {
      return true
    } catch {
      return false
    }
  }

  /**
   * 给背包添加物品
   * @param {用户的背包} BAG
   * @param {物品资料} THING
   * @param {数量} ACCOUNT
   * @returns
   */
  userbagAction = async (parameter) => {
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
  updataUser = async (parameter) => {
    const { UID, CHOICE, ATTRIBUTE, SIZE } = parameter
    //读取原数据
    const data = await listdata.userMsgAction({ NAME: UID, CHOICE: CHOICE })
    data[ATTRIBUTE] += Math.trunc(SIZE)
    await listdata.userMsgAction({ NAME: UID, CHOICE: CHOICE, DATA: data })
    return
  }

  /**
   * 检测宗门存档或用户宗门信息是否存在
   * @param file_path_type ["assPlayer" , "association" ]
   * @param file_name
   */
  existAss(file_path_type, file_name) {
    let file_path
    file_path = __PATH[file_path_type]
    let dir = path.join(file_path + '/' + file_name + '.json')
    if (fs.existsSync(dir)) {
      return true
    }
    return false
  }

  /**
   * 获取用户宗门信息或宗门存档
   * @param assName
   * @param user_qq
   */
  getAssOrPlayer(type, name) {
    let file_path
    let dir
    let data
    if (type == 1) {
      file_path = __PATH['assPlayer']
      dir = path.join(file_path + '/' + name + '.json')
    } else if (type == 2) {
      file_path = __PATH['association']
      dir = path.join(file_path + '/' + name + '.json')
    } else if (type == 3) {
      file_path = __PATH['interimArchive']
      dir = path.join(file_path + '/' + name + '.json')
    } else {
      file_path = __PATH['assTreasureVault']
      dir = path.join(file_path + '/' + name + '.json')
    }

    try {
      data = fs.readFileSync(dir, 'utf8')
    } catch (error) {
      return 'error'
    }
    //将字符串数据转变成json格式
    data = JSON.parse(data)
    return data
  }

  readAssNames = async (name) => {
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
   * @param file_name  ["assPlayer" , "association" ]
   * @param itemName
   * @param data
   */
  setAssOrPlayer(file_name, itemName, data) {
    let file_path
    let dir

    file_path = __PATH[file_name]
    dir = path.join(file_path + '/' + itemName + '.json')

    let new_ARR = JSON.stringify(data, '', '\t') //json转string
    fs.writeFileSync(dir, new_ARR, 'utf-8', (err) => {
      console.log('写入成功', err)
    })
    return
  }

  async assEffCount(assPlayer) {
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
    await GameApi.GameUser.addExtendPerpetual({
      NAME: assPlayer.qqNumber,
      FLAG: 'ass',
      TYPE: 'efficiency',
      VALUE: Number(assPlayer.effective)
    })
    this.setAssOrPlayer('assPlayer', assPlayer.qqNumber, assPlayer)
    await GameApi.GameUser.updataUserEfficiency(assPlayer.qqNumber)
    return
  }

  async assRename(ass, type, association_name) {
    let assRelation = this.assRelationList
    const find = assRelation.find((item) => item.id == ass)
    const location = assRelation.findIndex((item) => item.id == ass)
    if (type == 1) {
      find.name = association_name
    } else {
      find.unchartedName = association_name
    }
    assRelation.splice(location, 1, find)
    let file_path = __PATH.assRelation
    let dir

    dir = path.join(file_path + '/AssRelation.json')

    let new_ARR = JSON.stringify(assRelation, '', '\t') //json转string
    fs.writeFileSync(dir, new_ARR, 'utf-8', (err) => {
      console.log('写入成功', err)
    })
    return
  }

  async searchThingById(id) {
    const newVar = await GameApi.listdata.controlAction({ NAME: 'all', CHOICE: 'generate_all' })
    return newVar.find((item) => item.id == id)
  }

  async checkFacility(ass) {
    let oldStatus = ass.facility[4].status
    const buildNumList = [100, 500, 500, 200, 200, 200, 300]
    for (let i = 0; i < ass.facility.length; i++) {
      if (ass.facility[i].buildNum > buildNumList[i]) {
        ass.facility[i].status = 1
      } else {
        ass.facility[i].status = 0
      }
    }
    await this.setAssOrPlayer('association', ass.id, ass)
    if (oldStatus != ass.facility[4].status) {
      const playerList = ass.allMembers
      for (let player_id of playerList) {
        const UID = player_id
        if (this.existAss('assPlayer', UID)) {
          const assOrPlayer = this.getAssOrPlayer(1, UID)
          this.assEffCount(assOrPlayer)
        }
      }
    }
    return
  }

  async existArchive(qq) {
    let player = await GameApi.GameUser.existUser(qq)
    // 不存在
    if (!player) {
      return false
    }
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
      await this.setAssOrPlayer('assPlayer', qq, assPlayer)
    }
    let assPlayer = await this.getAssOrPlayer(1, qq)
    //只有生命计数一样，且生命状态正常才为true
    if (player.createTime == assPlayer.xiuxianTime && player.status == 1) {
      return true
    }
    //两边都有存档，但是死了，或者重生了，需要执行插件删档
    //先退宗，再重置
    if (this.existAss('association', assPlayer.assName)) {
      let ass = this.getAssOrPlayer(2, assPlayer.assName)

      if (assPlayer.assJob < 10) {
        ass.allMembers = ass.allMembers.filter((item) => item != assPlayer.qqNumber) //原来的职位表删掉这个B
        await this.setAssOrPlayer('association', ass.id, ass) //记录到存档
      } else {
        if (ass.allMembers.length < 2) {
          fs.rmSync(`${__PATH.association}/${assPlayer.assName}.json`)
        } else {
          ass.allMembers = ass.allMembers.filter((item) => item != assPlayer.qqNumber)
          //给宗主
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

          await this.setAssOrPlayer('association', ass.id, ass) //记录到存档
          await this.assEffCount(randMember)
          await GameApi.GameUser.updataUserEfficiency(randMember.qqNumber)
        }
      }
    }
    if (assPlayer.volunteerAss != 0) {
      const ass = this.getAssOrPlayer(2, assPlayer.volunteerAss)
      if (!isNotNull(ass)) {
        ass.applyJoinList = ass.applyJoinList.filter((item) => item != qq)
        await this.setAssOrPlayer('association', ass.id, ass)
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

    await this.setAssOrPlayer('assPlayer', qq, assPlayer)
    return false
  }

  // addSpecialty(idList,address,type){
  //
  //     const find = this.blessPlaceList.find(item => item.id == address)
  //     const location = this.blessPlaceList.findIndex(item => item.id == address)
  //     if(isNotNull(find)){
  //         if(type == 1){
  //             find.specialty.common.push(...idList)
  //         }else if(type == 2){
  //             find.specialty.special.push(...idList)
  //         }
  //     }
  //     this.blessPlaceList.splice(location,1,find)
  //     return
  // }

  // generatePrice = (x,y, obj,countName) => {
  //     const dir = `${this.generateUncharted}/count.json`
  //     let count = JSON.parse(fs.readFileSync(dir))
  //     if(count[countName] == undefined){
  //         count[countName] = 0
  //         const new_ARR = JSON.stringify(count, "", "\t")//json转string
  //         fs.writeFileSync(dir, new_ARR, 'utf-8', (err) => {
  //             console.log('写入成功', err)
  //         })
  //     }
  //     if (count[countName] != 0){
  //         return
  //     }
  //     for (let j=0j<obj.lengthj++){
  //         const number = obj[j].number
  //         const thingId = obj[j].thingId
  //         for(let i=0i<numberi++){
  //             this.BuildAndDeduplication(x,y,thingId)
  //         }
  //     }
  // }

  BuildAndDeduplication = (x, y, thingId) => {
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
      //写入点位
      const point = {
        x: genX + x,
        y: genY + y,
        monLevel: flag,
        thingId: thingId
      }
      pointList.push(point)
      const new_ARR = JSON.stringify(pointList, '', '\t') //json转string
      fs.writeFileSync(dir, new_ARR, 'utf-8', (err) => {
        console.log('写入成功', err)
      })
    } else {
      this.BuildAndDeduplication(x, y, thingId)
    }
    return
  }

  timeInvert = async (time) => {
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

  timeChange = (timestamp) => {
    const date = new Date(timestamp)
    const M = date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1
    return `${date.getFullYear()}-${M}-${date.getDate()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`
  }

  deleteAss = async (path, name) => {
    fs.rmSync(`${__PATH[path]}/${name}.json`)
  }
}

async function get_random_fromARR(ARR) {
  let randindex = Math.trunc(Math.random() * ARR.length)
  return ARR[randindex]
}

function isNotNull(obj) {
  if (obj == undefined || obj == null) return false
  return true
}
export default new GameUser()
