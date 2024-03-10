import { existsSync, readFileSync, writeFileSync } from 'fs'
import { join } from 'path'
import { __PATH } from './PATH.js'
import { getConfig } from '../utils/utils.js'

/**
 * tudo
 * 数据处理方法更改为被动读取
 * 利用强大的io进行文件数据时时刷新
 * 而不是启动时加载所有数据
 * 加载的数据需要及时清除
 */

type NameType = '灵根列表' | '怪物列表' | '商品列表'

/**
 *
 */
class XiuxianData {
  /**
   * lib_path
   * @param name
   * @returns
   */
  getPathData(name: string, key: keyof typeof __PATH = 'lib_path') {
    return JSON.parse(readFileSync(`${__PATH[key]}/${name}.json`, 'utf-8'))
  }

  test = getConfig('task', 'task')

  /**
   * 读取数据
   * @param key
   * @param val
   * @returns
   */
  getTheData(val: NameType, key: keyof typeof __PATH = 'lib_path') {
    return JSON.parse(readFileSync(`${__PATH[key]}/${val}.json`, 'utf-8'))
  }

  //加载talent列表
  talent_list = () => {
    return this.getPathData('灵根列表')
  }
  //加载怪物列表
  monster_list = () => {
    return this.getPathData('怪物列表')
  }
  //加载商品列表
  commodities_list = () => {
    return this.getPathData('商品列表')
  }
  //练气境界
  Level_list = () => {
    return this.getPathData('练气境界', 'Level')
  }
  //练体境界
  LevelMax_list = () => {
    return this.getPathData('炼体境界', 'Level')
  }
  //师徒积分
  shitujifen = () => {
    return this.getPathData('积分商城')
  }
  //加载装备列表
  equipment_list = () => {
    return this.getPathData('装备列表')
  }
  //加载丹药列表
  danyao_list = () => {
    return this.getPathData('丹药列表')
  }
  //加载炼丹师丹药列表
  newdanyao_list = () => {
    return this.getPathData('炼丹师丹药')
  }
  //加载道具列表
  daoju_list = () => {
    return this.getPathData('道具列表')
  }
  //加载功法列表
  gongfa_list = () => {
    return this.getPathData('功法列表')
  }

  //加载草药列表
  caoyao_list = () => {
    return this.getPathData('草药列表')
  }

  //加载地点列表
  didian_list = () => {
    return this.getPathData('地点列表')
  }

  //加载洞天福地列表
  bless_list = () => {
    return this.getPathData('洞天福地')
  }
  //加载宗门秘境
  guildSecrets_list = () => {
    return this.getPathData('宗门秘境')
  }
  //加载禁地列表
  forbiddenarea_list = () => {
    return this.getPathData('禁地列表')
  }
  //加载仙域列表
  Fairyrealm_list = () => {
    return this.getPathData('仙境列表')
  }

  //加载八品功法列表
  bapin = () => {
    return this.getPathData('八品')
  }
  //加载星阁列表
  xingge = () => {
    return this.getPathData('星阁拍卖行列表')
  }
  //天地
  tianditang = () => {
    return this.getPathData('天地堂')
  }
  //仙宠
  changzhuxianchon = () => {
    return this.getPathData('常驻仙宠')
  }

  xianchon = () => {
    return this.getPathData('仙宠列表')
  }

  xianchonkouliang = () => {
    return this.getPathData('仙宠口粮列表')
  }

  //npc
  npc_list = () => {
    return this.getPathData('npc列表')
  }
  //
  shop_list = () => {
    return this.getPathData('shop列表')
  }
  //魔界
  mojie = () => {
    return this.getPathData('魔界列表')
  }
  //兑换码
  duihuan = () => {
    return this.getPathData('兑换列表')
  }
  //神界
  shenjie = () => {
    return this.getPathData('神界列表')
  }
  //加载技能列表
  jineng1 = () => {
    return this.getPathData('技能列表1')
  }
  jineng2 = () => {
    return this.getPathData('技能列表2')
  }
  //加载强化列表
  qianghua = () => {
    return this.getPathData('强化列表')
  }
  //锻造材料列表
  duanzhaocailiao = () => {
    return this.getPathData('锻造材料')
  }
  //锻造武器列表
  duanzhaowuqi = () => {
    return this.getPathData('锻造武器')
  }
  //锻造护具列表
  duanzhaohuju = () => {
    return this.getPathData('锻造护具')
  }
  //锻造宝物列表
  duanzhaobaowu = () => {
    return this.getPathData('锻造宝物')
  }
  //hide_talent列表
  yincang = () => {
    return this.getPathData('隐藏灵根')
  }
  //锻造杂类列表
  zalei = () => {
    return this.getPathData('锻造杂类')
  }
  //加载技能列表
  jineng = () => {
    return this.getPathData('技能列表')
  }
  //加载限定仙府
  timeplace_list = () => {
    return this.getPathData('限定仙府', 'Timelimit')
  }
  //加载限定功法

  timegongfa_list = () => {
    return this.getPathData('限定功法', 'Timelimit')
  }
  //加载限定装备
  timeequipmen_list = () => {
    return this.getPathData('限定装备', 'Timelimit')
  }
  //加载限定丹药
  timedanyao_list = () => {
    return this.getPathData('限限定丹药定装备', 'Timelimit')
  }
  qinlong = () => {
    return this.getPathData('青龙', 'Timelimit')
  }
  qilin = () => {
    return this.getPathData('麒麟', 'Timelimit')
  }
  xuanwu = () => {
    return this.getPathData('玄武朱雀白虎', 'Timelimit')
  }
  //加载职业列表
  occupation_list = () => {
    return this.getPathData('职业列表', 'occupation')
  }
  //加载职业经验列表
  occupation_exp_list = () => {
    return this.getPathData('experience', 'occupation')
  }
  //加载丹方列表

  danfang_list = () => {
    return this.getPathData('炼丹配方', 'occupation')
  }
  //加载图纸列表
  tuzhi_list = () => {
    return this.getPathData('装备图纸', 'occupation')
  }
  /**
   * 检测存档存在
   * @param file_path_type ["player" , "association" ]
   * @param file_name
   */
  existData(file_path_type, file_name) {
    if (existsSync(join(`${__PATH[file_path_type]}/${file_name}.json`))) {
      return true
    }
    return false
  }

  /**
   * 获取文件数据(user_id为空查询item下thefile_name文件)
   * @param file_name  [player,equipment,najie]
   * @param user_id
   */
  getData(file_name, user_id) {
    let file_path
    let dir
    if (user_id) {
      //带user_idthe查询数据文件
      file_path = __PATH[file_name]
      dir = join(file_path + '/' + user_id + '.json')
    } else {
      //不带参数the查询item下文件
      file_path = __PATH.lib
      dir = join(file_path + '/' + file_name + '.json')
    }
    try {
      //将字符串数据转变成json格式
      return JSON.parse(readFileSync(dir, 'utf8'))
    } catch (error) {
      console.error('读取文件错误：' + error)
      return 'error'
    }
  }

  /**
   * 写入数据
   * @param file_name [player,equipment,najie]
   * @param user_id
   * @param data
   */
  setData(file_name, user_id, data) {
    let file_path
    let dir
    if (user_id) {
      file_path = __PATH[file_name]
      dir = join(file_path + '/' + user_id + '.json')
    } else {
      file_path = __PATH.lib
      dir = join(file_path + '/' + file_name + '.json')
    }
    if (existsSync(dir)) {
      writeFileSync(dir, JSON.stringify(data), 'utf-8')
    }
    return
  }

  /**
   * 获取宗门数据
   * @param file_name  宗门名称
   */
  getAssociation(file_name) {
    try {
      //将字符串数据转变成json格式
      return JSON.parse(
        readFileSync(
          join(__PATH.association + '/' + file_name + '.json'),
          'utf8'
        )
      )
    } catch (error) {
      console.error('读取文件错误：' + error)
      return 'error'
    }
  }

  /**
   * 写入宗门数据
   * @param file_name  宗门名称
   * @param data
   */
  setAssociation(file_name, data) {
    return writeFileSync(
      join(`${__PATH.association}/${file_name}.json`),
      JSON.stringify(data),
      'utf-8'
    )
  }
}

export const data = new XiuxianData()
