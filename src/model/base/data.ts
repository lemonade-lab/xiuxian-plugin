import { existsSync, readFileSync, writeFileSync } from 'fs'
import { join } from 'path'
import { __PATH as __path } from './PATH.js'
import { getConfig } from '../utils.js'

/**
 * tudo
 * 数据处理方法更改为被动读取
 * 利用强大的io进行文件数据时时刷新
 * 而不是启动时加载所有数据
 * 加载的数据需要及时清除
 */

/**
 *
 */
class XiuxianData {
  __PATH = __path

  /**
   * lib_path
   * @param name
   * @returns
   */
  getPathData(name: string, path = this.__PATH.lib) {
    return JSON.parse(readFileSync(`${path}/${name}.json`, 'utf-8'))
  }

  test = getConfig('task', 'task')

  //加载talent列表
  talent_list = this.getPathData('灵根列表')
  //加载怪物列表
  monster_list = this.getPathData('怪物列表')
  //加载商品列表
  commodities_list = this.getPathData('商品列表')
  //练气境界
  Level_list = this.getPathData('练气境界')
  //师徒积分
  shitujifen = this.getPathData('积分商城')
  //练体境界
  LevelMax_list = this.getPathData('炼体境界')
  //加载装备列表
  equipment_list = this.getPathData('装备列表')
  //加载丹药列表
  danyao_list = this.getPathData('丹药列表')
  //加载炼丹师丹药列表
  newdanyao_list = this.getPathData('炼丹师丹药')
  //加载道具列表
  daoju_list = this.getPathData('道具列表')
  //加载功法列表
  gongfa_list = this.getPathData('功法列表')

  //加载草药列表
  caoyao_list = this.getPathData('草药列表')

  //加载地点列表
  didian_list = this.getPathData('地点列表')

  //加载洞天福地列表
  bless_list = this.getPathData('洞天福地')
  //加载宗门秘境
  guildSecrets_list = this.getPathData('宗门秘境')
  //加载禁地列表
  forbiddenarea_list = this.getPathData('禁地列表')
  //加载仙域列表
  Fairyrealm_list = this.getPathData('仙境列表')

  //加载八品功法列表
  bapin = this.getPathData('八品')
  //加载星阁列表
  xingge = this.getPathData('星阁拍卖行列表')
  //天地
  tianditang = this.getPathData('天地堂')
  //仙宠
  changzhuxianchon = this.getPathData('常驻仙宠')

  xianchon = this.getPathData('仙宠列表')

  xianchonkouliang = this.getPathData('仙宠口粮列表')

  //npc
  npc_list = this.getPathData('npc列表')
  //
  shop_list = this.getPathData('shop列表')

  //魔界
  mojie = this.getPathData('魔界列表')

  //兑换码
  duihuan = this.getPathData('兑换列表')

  //神界
  shenjie = this.getPathData('神界列表')

  //加载技能列表
  jineng1 = this.getPathData('技能列表1')

  jineng2 = this.getPathData('技能列表2')

  //加载强化列表
  qianghua = this.getPathData('强化列表')

  //锻造材料列表
  duanzhaocailiao = this.getPathData('锻造材料')

  //锻造武器列表
  duanzhaowuqi = this.getPathData('锻造武器')
  //锻造护具列表
  duanzhaohuju = this.getPathData('锻造护具')
  //锻造宝物列表
  duanzhaobaowu = this.getPathData('锻造宝物')
  //hide_talent列表
  yincang = this.getPathData('隐藏灵根')
  //锻造杂类列表
  zalei = this.getPathData('锻造杂类')
  //加载技能列表
  jineng = this.getPathData('技能列表')

  //加载限定仙府
  timeplace_list = this.getPathData('限定仙府', this.__PATH.Timelimit)

  //加载限定功法

  timegongfa_list = this.getPathData('限定功法', this.__PATH.Timelimit)

  //加载限定装备
  timeequipmen_list = this.getPathData('限定装备', this.__PATH.Timelimit)

  //加载限定丹药
  timedanyao_list = this.getPathData('限限定丹药定装备', this.__PATH.Timelimit)

  qinlong = this.getPathData('青龙', this.__PATH.Timelimit)

  qilin = this.getPathData('麒麟', this.__PATH.Timelimit)

  xuanwu = this.getPathData('玄武朱雀白虎', this.__PATH.Timelimit)

  //加载职业列表
  occupation_list = this.getPathData('职业列表', this.__PATH.occupation)

  //加载职业经验列表
  occupation_exp_list = this.getPathData('experience', this.__PATH.occupation)

  //加载丹方列表

  danfang_list = this.getPathData('炼丹配方', this.__PATH.occupation)

  //加载图纸列表
  tuzhi_list = this.getPathData('装备图纸', this.__PATH.occupation)

  /**
   * 检测存档存在
   * @param file_path_type ["player" , "association" ]
   * @param file_name
   */
  existData(file_path_type, file_name) {
    if (existsSync(join(`${this.__PATH[file_path_type]}/${file_name}.json`))) {
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
      file_path = this.__PATH[file_name]
      dir = join(file_path + '/' + user_id + '.json')
    } else {
      //不带参数the查询item下文件
      file_path = this.__PATH.lib
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
      file_path = this.__PATH[file_name]
      dir = join(file_path + '/' + user_id + '.json')
    } else {
      file_path = this.__PATH.lib
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
          join(this.__PATH.association + '/' + file_name + '.json'),
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
      join(`${this.__PATH.association}/${file_name}.json`),
      JSON.stringify(data),
      'utf-8'
    )
  }
}

export const data = new XiuxianData()
