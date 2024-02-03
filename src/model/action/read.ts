import { copyFileSync, readFileSync } from 'fs'
import { join } from 'path'
import { __PATH } from '../base/PATH.js'
import { Write_duanlu } from './write.js'

/**
 *
 * @param usr_qq
 * @returns
 */
export function Read_equipment(usr_qq) {
  return JSON.parse(
    readFileSync(join(`${__PATH.equipment_path}/${usr_qq}.json`), 'utf8')
  )
}

/**
 *
 * @param usr_qq
 * @returns
 */
export function Read_najie(usr_qq) {
  return JSON.parse(
    readFileSync(join(`${__PATH.najie_path}/${usr_qq}.json`), 'utf8')
  )
}

export function fixed(usr_qq) {
  return copyFileSync(
    `${__PATH.auto_backup}/najie/${usr_qq}.json`,
    `${__PATH.najie_path}/${usr_qq}.json`
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

export function Read_danyao(usr_qq) {
  return JSON.parse(
    readFileSync(join(`${__PATH.danyao_path}/${usr_qq}.json`), 'utf8')
  )
}

export function Read_temp() {
  return JSON.parse(readFileSync(join(`${__PATH.temp_path}/temp.json`), 'utf8'))
}

export function Read_shitu() {
  return JSON.parse(readFileSync(join(`${__PATH.shitu}/shitu.json`), 'utf8'))
}

/**
 *
 * @returns
 */
export function Read_updata_log() {
  return readFileSync(join(`${__PATH.updata_log_path}`), 'utf8')
}

/**
 * 读取存档信息，返回成一个JavaScript对象
 * @param usr_qq
 * @returns
 */
export function Read_player(usr_qq) {
  return JSON.parse(
    decodeURIComponent(
      readFileSync(join(`${__PATH.player_path}/${usr_qq}.json`), 'utf8')
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
