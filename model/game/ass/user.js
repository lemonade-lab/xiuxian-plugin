import fs from 'node:fs'
import path from 'node:path'
import Method from '../wrap/method.js'
import Data from '../data/index.js'
import Talent from '../box/talent.js'
import Player from '../box/player.js'
import { __PATH } from '../data/path.js'
import algorithm from '../data/algorithm.js'
// 汐颜
class GP {
  constructor() {
    // 固定表数据
    // 门派：位置
    this.assLabyrinthList = Data.controlAction({
      NAME: 'AssLabyrinth',
      CHOICE: 'assRelate'
    })
    //  隐藏物品
    this.baseTreasureVaultList = Data.controlAction({
      NAME: 'Ass000000',
      CHOICE: 'assTreasureVault'
    })
    // 山门
    this.blessPlaceList = Data.controlAction({
      NAME: 'BlessPlace',
      CHOICE: 'assRelate'
    })
    // 门派 ???
    this.assRelationList = Data.controlActionInitial({
      NAME: 'assRelation',
      CHOICE: 'assRelation',
      // 初始化
      INITIAL: [
        {
          id: 'Ass000001', // 编号
          name: '剑神宗', // 名称
          unchartedName: '剑神窟' // 山门
        },
        {
          id: 'Ass000002',
          name: '药神谷',
          unchartedName: '神药庄园'
        },
        {
          id: 'Ass000003',
          name: '雾隐门',
          unchartedName: '雾隐地堡'
        },
        {
          id: 'Ass000004',
          name: '天机门',
          unchartedName: '天机古楼'
        }
      ]
    })
    // 配置
    this.numberMaximums = [6, 8, 10, 13, 16, 18, 20, 23, 25]
    this.spiritStoneAnsMax = [
      2000000, 5000000, 8000000, 11000000, 15000000, 20000000, 35000000, 50000000, 80000000
    ]
    this.buildNameList = ['山门', '藏宝阁', '门派秘境', '神兽祭坛', '聚灵阵', '护宗大阵']
  }

  /**
   * 初始化门派存档
   * @param {*} UID
   * @returns
   */
  existArchive(UID) {
    // 读取用户寿命信息
    let GP = Player.getUserLife(UID)

    // 不存在寿命
    if (!GP) return false

    // 修仙存在此人，看门派系统有没有他
    const GPData = {
      AID: 0, // 门派名称为0
      UID, // 用户 id
      assJob: 0,
      effective: 0,
      contributionPoints: 0,
      historyContribution: 0,
      favorability: 0,
      volunteerAss: 0,
      lastSignAss: 0,
      lastExplorTime: 0,
      lastBounsTime: 0,
      xiuxianTime: GP.createTime, // 时间搓
      time: []
    }

    //  验证存档
    if (!this.existAss('assGP', UID)) {
      // 不存在则初始化
      Data.controlAction({
        NAME: UID,
        CHOICE: 'assGP',
        DATA: GPData
      })
    }

    // 读取用户数据
    let assGP = Data.controlAction({
      NAME: UID,
      CHOICE: 'assGP'
    })

    // 只有生命计数一样，且生命状态正常才为true
    if (GP.createTime == assGP.xiuxianTime && GP.status == 1) {
      return true
    }

    // 两边都有存档，但是死了，或者重生了，需要执行插件删档

    // 检测门派, 先退宗，再重置
    if (this.existAss('assOciation', assGP.AID)) {
      // 读取门派信息
      let ass = Data.controlAction({
        NAME: assGP.AID,
        CHOICE: 'assOciation'
      })

      if (assGP.assJob < 10) {
        // 原来的职位表删掉这个B
        ass.allMembers = ass.allMembers.filter((item) => item != assGP.UID)
        // 记录到存档
        Data.controlAction({
          NAME: ass.id,
          CHOICE: 'assOciation',
          DATA: ass
        })
      } else {
        if (ass.allMembers.length < 2) {
          fs.rmSync(`${__PATH.assOciation}/${assGP.AID}.json`)
        } else {
          ass.allMembers = ass.allMembers.filter((item) => item != assGP.UID)
          // 给掌门
          let randMember = { assJob: 0 }
          for (let item in ass.allMembers) {
            const UIDNum = ass.allMembers[item]
            const assGPA = Data.controlAction({
              NAME: UIDNum,
              CHOICE: 'assGP'
            })

            if (assGPA.assJob > randMember.assJob) {
              randMember = assGPA
            }
          }
          ass.master = randMember.UID
          randMember.assJob = 10
          // 记录到存档

          Data.controlAction({
            NAME: ass.id,
            CHOICE: 'assOciation',
            DATA: ass
          })

          this.assUpdataEfficiency(randMember)
          // 更新面板
          Talent.updataEfficiency(randMember.UID)
        }
      }
    }

    // 检查
    if (assGP.volunteerAss != 0) {
      // 得到数据
      const ass = Data.controlAction({
        NAME: assGP.volunteerAss,
        CHOICE: 'assOciation'
      })
      if (!Method.isNotNull(ass)) {
        ass.applyJoinList = ass.applyJoinList.filter((item) => item != UID)
        // 写入数据
        Data.controlAction({
          NAME: ass.id,
          CHOICE: 'assOciation',
          DATA: ass
        })
      }
    }

    // 写入数据
    Data.controlAction({
      NAME: UID,
      CHOICE: 'assGP',
      DATA: GPData
    })
    return false
  }

  /**
   * 检测门派存档或用户门派信息是否存在
   * @param filePathType ["assGP" , "assOciation" ]
   * @param fileName
   */
  existAss(filePathType, fileName) {
    return algorithm.existFile(__PATH[filePathType], fileName)
  }

  /**
   * 读取门派名
   * @param {*} name
   * @returns
   */
  readAssNames(name) {
    // 指定路径
    let allNames = fs.readdirSync(__PATH[name])
    // 赛选.json
    allNames = allNames.filter((file) => file.endsWith('.json'))
    return allNames
  }

  /**
   * 写入数据
   * @param fileName  ["assGP" , "assOciation" ]
   * @param itemName
   * @param data
   */
  setAssOrGP(fileName, itemName, data) {
    Data.controlAction({
      NAME: itemName,
      CHOICE: fileName,
      DATA: data
    })
  }

  /**
   *
   * @param {*} assGP 用户数据
   * @returns
   */
  assUpdataEfficiency(assGP) {
    // 没有门派
    if (assGP.AID == 0) {
      assGP.effective = 0
      Data.controlAction({
        NAME: assGP.UID,
        CHOICE: 'assGP',
        DATA: assGP
      })
      return false
    }
    // 有门派
    let effective = 0
    // 读取门派数据
    let ass = Data.controlAction({
      NAME: assGP.AID,
      CHOICE: 'assOciation'
    })
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
    // 更新
    Talent.addExtendPerpetual({
      NAME: assGP.UID,
      FLAG: 'ass',
      TYPE: 'efficiency',
      VALUE: assGP.effective
    })
    // 更新用户
    Data.controlAction({
      NAME: assGP.UID,
      CHOICE: 'assGP',
      DATA: assGP
    })
    // 更新天赋
    Talent.updataEfficiency(assGP.UID)
  }

  /**
   *
   * 重命名门派
   * @param {*} ass
   * @param {*} type
   * @param {*} assOciationName
   */
  renameAssociation(ass, type, assOciationName) {
    let assRelation = this.assRelationList
    const find = assRelation.find((item) => item.id == ass)
    const location = assRelation.findIndex((item) => item.id == ass)
    if (type == 1) {
      find.name = assOciationName
    } else {
      find.unchartedName = assOciationName
    }
    assRelation.splice(location, 1, find)
    fs.writeFileSync(
      path.join(`${__PATH.assRelation}/assRelation.json`),
      JSON.stringify(assRelation, '', '\t'),
      'utf-8',
      (err) => {
        console.info('写入成功', err)
      }
    )
  }

  /**
   * 检查设施
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

    Data.controlAction({
      NAME: ass.id,
      CHOICE: 'assOciation',
      DATA: ass
    })

    if (oldStatus != ass.facility[4].status) {
      const GPList = ass.allMembers
      for (let GPID of GPList) {
        const UID = GPID
        if (this.existAss('assGP', UID)) {
          const assOrGP = Data.controlAction({
            NAME: UID,
            CHOICE: 'assGP'
          })
          this.assUpdataEfficiency(assOrGP)
        }
      }
    }
  }

  /**
   * 删除指定文件
   * @param {*} path
   * @param {*} name
   */
  deleteAss(path, name) {
    algorithm.deleteFile(__PATH[path], name)
  }
}
export default new GP()
