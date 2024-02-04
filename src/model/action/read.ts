import { copyFileSync, readFileSync } from 'fs'
import { join } from 'path'
import { __PATH } from '../base/PATH.js'
import { Write_duanlu } from './write.js'
import { shijianc } from '../utils.js'

/**
 *
 * @param user_id
 * @returns
 */
export function Read_equipment(user_id) {
  return JSON.parse(
    readFileSync(join(`${__PATH.equipment_path}/${user_id}.json`), 'utf8')
  )
}

/**
 *
 * @param user_id
 * @returns
 */
export function Read_najie(user_id) {
  return JSON.parse(
    readFileSync(join(`${__PATH.najie_path}/${user_id}.json`), 'utf8')
  )
}

export function fixed(user_id) {
  return copyFileSync(
    `${__PATH.auto_backup}/najie/${user_id}.json`,
    `${__PATH.najie_path}/${user_id}.json`
  )
}

//读交易表
export function Read_Exchange() {
  return JSON.parse(
    readFileSync(join(`${__PATH.Exchange}/Exchange.json`), 'utf8')
  )
}

//读交易表
export function Read_Forum() {
  return JSON.parse(readFileSync(join(`${__PATH.Exchange}/Forum.json`), 'utf8'))
}

export function Read_shop() {
  return JSON.parse(readFileSync(join(`${__PATH.shop}/shop.json`), 'utf8'))
}

export function Read_danyao(user_id) {
  return JSON.parse(
    readFileSync(join(`${__PATH.danyao_path}/${user_id}.json`), 'utf8')
  )
}

export function Read_temp() {
  return JSON.parse(readFileSync(join(`${__PATH.temp_path}/temp.json`), 'utf8'))
}

export function Read_shitu() {
  return JSON.parse(readFileSync(join(`${__PATH.shitu}/shitu.json`), 'utf8'))
}

/**
 * 读取存档信息，返回成一个JavaScript对象
 * @param user_id
 * @returns
 */
export function Read_player(user_id) {
  return JSON.parse(
    decodeURIComponent(
      readFileSync(join(`${__PATH.player_path}/${user_id}.json`), 'utf8')
    )
  )
}

export function Read_qinmidu() {
  return JSON.parse(
    readFileSync(join(`${__PATH.qinmidu}/qinmidu.json`), 'utf8')
  )
}

export function Read_it() {
  return JSON.parse(readFileSync(join(`${__PATH.custom}/custom.json`), 'utf8'))
}

export function Read_mytripod(qq) {
  let tripod
  try {
    tripod = Read_tripod()
  } catch {
    Write_duanlu([])
    tripod = Read_tripod()
  }
  for (let item of tripod) {
    if (qq == item.qq) {
      return item
    }
  }
}

export function Read_tripod() {
  return JSON.parse(readFileSync(join(`${__PATH.duanlu}/duanlu.json`), 'utf8'))
}

export function readall(weizhi) {
  return JSON.parse(
    readFileSync(join(`${__PATH.lib_path}/${weizhi}.json`), 'utf8')
  )
}

/**
 * 获取缓存中the人物状态信息
 * @param user_id
 * @return  falses {Promise<void>}
 */
export async function getPlayerActionData(user_id) {
  return JSON.parse(await redis.get('xiuxian@1.4.0:' + user_id + ':action')) //转为json格式数据
}

export function Read_tiandibang() {
  //将字符串数据转变成数组格式
  return JSON.parse(
    readFileSync(join(`${__PATH.tiandibang}/tiandibang.json`), 'utf8')
  )
}

export async function getLastbisai(user_id) {
  //查询redis中the人物动作
  let time = await redis.get('xiuxian@1.4.0:' + user_id + ':lastbisai_time')
  if (time != null) {
    return shijianc(parseInt(time))
  }
  return false
}
