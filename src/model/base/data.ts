import { existsSync, readFileSync, writeFileSync } from 'fs'
import { join } from 'path'
import { cwd } from '../../../config.js'

function getPath(name) {
  return join(cwd, '/resources/data', name)
}

/**
 *
 */
class XiuxianData {
  filePathMap = {
    player: getPath('/xiuxian_player'), //用户数据
    equipment: join(cwd, '/resources/data/xiuxian_equipment'),
    najie: join(cwd, '/resources/data/xiuxian_najie'),
    lib: join(cwd, '/resources/data/item'),
    Timelimit: join(cwd, '/resources/data/Timelimit'), //限定
    Level: join(cwd, '/resources/data/Level'), //境界
    association: join(cwd, '/resources/data/association'),
    occupation: join(cwd, '/resources/data/occupation')
  }

  lib_path = this.filePathMap.lib

  Timelimit = this.filePathMap.Timelimit

  Level = this.filePathMap.Level

  Occupation = this.filePathMap.occupation

  //加载talent列表
  talent_list = JSON.parse(
    readFileSync(`${this.lib_path}/灵根列表.json`, 'utf-8')
  )
  //加载怪物列表
  monster_list = JSON.parse(
    readFileSync(`${this.lib_path}/怪物列表.json`, 'utf-8')
  )
  //加载商品列表
  commodities_list = JSON.parse(
    readFileSync(`${this.lib_path}/商品列表.json`, 'utf-8')
  )
  //练气境界
  Level_list = JSON.parse(readFileSync(`${this.Level}/练气境界.json`, 'utf-8'))
  //师徒积分
  shitujifen = JSON.parse(
    readFileSync(`${this.lib_path}/积分商城.json`, 'utf-8')
  )
  //练体境界
  LevelMax_list = JSON.parse(
    readFileSync(`${this.Level}/炼体境界.json`, 'utf-8')
  )
  //加载装备列表
  equipment_list = JSON.parse(
    readFileSync(`${this.lib_path}/装备列表.json`, 'utf-8')
  )
  //加载丹药列表
  danyao_list = JSON.parse(
    readFileSync(`${this.lib_path}/丹药列表.json`, 'utf-8')
  )
  //加载炼丹师丹药列表
  newdanyao_list = JSON.parse(
    readFileSync(`${this.lib_path}/炼丹师丹药.json`, 'utf-8')
  )
  //加载道具列表
  daoju_list = JSON.parse(
    readFileSync(`${this.lib_path}/道具列表.json`, 'utf-8')
  )
  //加载功法列表
  gongfa_list = JSON.parse(
    readFileSync(`${this.lib_path}/功法列表.json`, 'utf-8')
  )
  //加载草药列表
  caoyao_list = JSON.parse(
    readFileSync(`${this.lib_path}/草药列表.json`, 'utf-8')
  )

  //加载地点列表
  didian_list = JSON.parse(
    readFileSync(`${this.lib_path}/地点列表.json`, 'utf-8')
  )
  //加载洞天福地列表
  bless_list = JSON.parse(
    readFileSync(`${this.lib_path}/洞天福地.json`, 'utf-8')
  )
  //加载宗门秘境
  guildSecrets_list = JSON.parse(
    readFileSync(`${this.lib_path}/宗门秘境.json`, 'utf-8')
  )
  //加载禁地列表
  forbiddenarea_list = JSON.parse(
    readFileSync(`${this.lib_path}/禁地列表.json`, 'utf-8')
  )
  //加载仙域列表
  Fairyrealm_list = JSON.parse(
    readFileSync(`${this.lib_path}/仙境列表.json`, 'utf-8')
  )
  //加载限定仙府
  timeplace_list = JSON.parse(
    readFileSync(`${this.Timelimit}/限定仙府.json`, 'utf-8')
  )
  //加载限定功法
  timegongfa_list = JSON.parse(
    readFileSync(`${this.Timelimit}/限定功法.json`, 'utf-8')
  )
  //加载限定装备
  timeequipmen_list = JSON.parse(
    readFileSync(`${this.Timelimit}/限定装备.json`, 'utf-8')
  )
  //加载限定丹药
  timedanyao_list = JSON.parse(
    readFileSync(`${this.Timelimit}/限定丹药.json`, 'utf-8')
  )
  //加载职业列表
  occupation_list = JSON.parse(
    readFileSync(`${this.Occupation}/职业列表.json`, 'utf-8')
  )
  //加载职业经验列表
  occupation_exp_list = JSON.parse(
    readFileSync(`${this.Occupation}/experience.json`, 'utf-8')
  )
  //加载丹方列表
  danfang_list = JSON.parse(
    readFileSync(`${this.Occupation}/炼丹配方.json`, 'utf-8')
  )
  //加载图纸列表
  tuzhi_list = JSON.parse(
    readFileSync(`${this.Occupation}/装备图纸.json`, 'utf-8')
  )

  //加载八品功法列表
  bapin = JSON.parse(readFileSync(`${this.lib_path}/八品.json`, 'utf-8'))
  //加载星阁列表
  xingge = JSON.parse(
    readFileSync(`${this.lib_path}/星阁拍卖行列表.json`, 'utf-8')
  )
  //天地
  tianditang = JSON.parse(readFileSync(`${this.lib_path}/天地堂.json`, 'utf-8'))
  //仙宠
  changzhuxianchon = JSON.parse(
    readFileSync(`${this.lib_path}/常驻仙宠.json`, 'utf-8')
  )
  xianchon = JSON.parse(readFileSync(`${this.lib_path}/仙宠列表.json`, 'utf-8'))
  xianchonkouliang = JSON.parse(
    readFileSync(`${this.lib_path}/仙宠口粮列表.json`, 'utf-8')
  )
  //npc
  npc_list = JSON.parse(readFileSync(`${this.lib_path}/npc列表.json`, 'utf-8'))
  //
  shop_list = JSON.parse(
    readFileSync(`${this.lib_path}/shop列表.json`, 'utf-8')
  )

  qinlong = JSON.parse(readFileSync(`${this.Timelimit}/青龙.json`, 'utf-8'))
  qilin = JSON.parse(readFileSync(`${this.Timelimit}/麒麟.json`, 'utf-8'))
  xuanwu = JSON.parse(
    readFileSync(`${this.Timelimit}/玄武朱雀白虎.json`, 'utf-8')
  )
  //魔界
  mojie = JSON.parse(readFileSync(`${this.lib_path}/魔界列表.json`, 'utf-8'))
  //兑换码
  duihuan = JSON.parse(readFileSync(`${this.lib_path}/兑换列表.json`, 'utf-8'))
  //神界
  shenjie = JSON.parse(readFileSync(`${this.lib_path}/神界列表.json`, 'utf-8'))
  //加载技能列表
  jineng1 = JSON.parse(readFileSync(`${this.lib_path}/技能列表1.json`, 'utf-8'))
  jineng2 = JSON.parse(readFileSync(`${this.lib_path}/技能列表2.json`, 'utf-8'))
  //加载强化列表
  qianghua = JSON.parse(readFileSync(`${this.lib_path}/强化列表.json`, 'utf-8'))
  //锻造材料列表
  duanzhaocailiao = JSON.parse(
    readFileSync(`${this.lib_path}/锻造材料.json`, 'utf-8')
  )
  //锻造武器列表
  duanzhaowuqi = JSON.parse(
    readFileSync(`${this.lib_path}/锻造武器.json`, 'utf-8')
  )
  //锻造护具列表
  duanzhaohuju = JSON.parse(
    readFileSync(`${this.lib_path}/锻造护具.json`, 'utf-8')
  )
  //锻造宝物列表
  duanzhaobaowu = JSON.parse(
    readFileSync(`${this.lib_path}/锻造宝物.json`, 'utf-8')
  )
  //hide_talent列表
  yincang = JSON.parse(readFileSync(`${this.lib_path}/隐藏灵根.json`, 'utf-8'))
  //锻造杂类列表
  zalei = JSON.parse(readFileSync(`${this.lib_path}/锻造杂类.json`, 'utf-8'))
  //加载技能列表
  jineng = JSON.parse(readFileSync(`${this.lib_path}/技能列表.json`, 'utf-8'))

  /**
   * 检测存档存在
   * @param file_path_type ["player" , "association" ]
   * @param file_name
   */
  existData(file_path_type, file_name) {
    let file_path
    file_path = this.filePathMap[file_path_type]
    let dir = join(file_path + '/' + file_name + '.json')
    if (existsSync(dir)) {
      return true
    }
    return false
  }

  /**
   * 获取文件数据(user_qq为空查询item下thefile_name文件)
   * @param file_name  [player,equipment,najie]
   * @param user_qq
   */
  getData(file_name, user_qq) {
    let file_path
    let dir
    let data
    if (user_qq) {
      //带user_qqthe查询数据文件
      file_path = this.filePathMap[file_name]
      dir = join(file_path + '/' + user_qq + '.json')
    } else {
      //不带参数the查询item下文件
      file_path = this.filePathMap.lib
      dir = join(file_path + '/' + file_name + '.json')
    }
    try {
      data = readFileSync(dir, 'utf8')
    } catch (error) {
      console.error('读取文件错误：' + error)
      return 'error'
    }
    //将字符串数据转变成json格式
    return JSON.parse(data)
  }

  /**
   * 写入数据
   * @param file_name [player,equipment,najie]
   * @param user_qq
   * @param data
   */
  setData(file_name, user_qq, data) {
    let file_path
    let dir
    if (user_qq) {
      file_path = this.filePathMap[file_name]
      dir = join(file_path + '/' + user_qq + '.json')
    } else {
      file_path = this.filePathMap.lib
      dir = join(file_path + '/' + file_name + '.json')
    }
    let new_ARR = JSON.stringify(data) //json转string
    if (existsSync(dir)) {
      writeFileSync(dir, new_ARR, 'utf-8')
    }
    return
  }

  /**
   * 获取宗门数据
   * @param file_name  宗门名称
   */
  getAssociation(file_name) {
    let file_path
    let dir
    let data
    file_path = this.filePathMap.association
    dir = join(file_path + '/' + file_name + '.json')
    try {
      data = readFileSync(dir, 'utf8')
    } catch (error) {
      console.error('读取文件错误：' + error)
      return 'error'
    }
    //将字符串数据转变成json格式
    data = JSON.parse(data)
    return data
  }

  /**
   * 写入宗门数据
   * @param file_name  宗门名称
   * @param data
   */
  setAssociation(file_name, data) {
    let file_path
    let dir
    file_path = this.filePathMap.association
    dir = join(file_path + '/' + file_name + '.json')
    let new_ARR = JSON.stringify(data) //json转string
    writeFileSync(dir, new_ARR, 'utf-8')
    return
  }
}

/**
 *
 */
export const data = new XiuxianData()
