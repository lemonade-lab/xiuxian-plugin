import { writeFileSync } from 'fs'
import { join } from 'path'
import { __PATH } from '../base/PATH.js'

/**
 * 写入存档信息,第二个参数是一个JavaScript对象
 * @param user_id
 * @param player
 * @returns
 */
export function Write_player(user_id, player) {
  return writeFileSync(
    join(__PATH.player_path, `${user_id}.json`),
    JSON.stringify(player),
    'utf8'
  )
}

//写入交易表
export function Write_Exchange(wupin) {
  return writeFileSync(
    join(__PATH.Exchange, `Exchange.json`),
    JSON.stringify(wupin),
    'utf8'
  )
}

//写入交易表
export function Write_Forum(wupin) {
  return writeFileSync(
    join(__PATH.Exchange, `Forum.json`),
    JSON.stringify(wupin),
    'utf8'
  )
}

export async function Write_shop(shop) {
  return writeFileSync(
    join(__PATH.shop, `shop.json`),
    JSON.stringify(shop),
    'utf8'
  )
}

export async function Write_danyao(user_id, danyao) {
  return writeFileSync(
    join(__PATH.danyao_path, `${user_id}.json`),
    JSON.stringify(danyao),
    'utf8'
  )
}

export async function Write_temp(temp) {
  return writeFileSync(
    join(__PATH.temp_path, `temp.json`),
    JSON.stringify(temp),
    'utf8'
  )
}

export async function Write_shitu(shitu) {
  return writeFileSync(
    join(__PATH.shitu, `shitu.json`),
    JSON.stringify(shitu),
    'utf8'
  )
}

export function Write_qinmidu(qinmidu) {
  return writeFileSync(
    join(__PATH.qinmidu, `qinmidu.json`),
    JSON.stringify(qinmidu),
    'utf8'
  )
}

//写入纳戒信息,第二个参数是一个JavaScript对象
export function Write_najie(user_id, najie) {
  return writeFileSync(
    join(__PATH.najie_path, `${user_id}.json`),
    JSON.stringify(najie),
    'utf8'
  )
}

export function Write_duanlu(duanlu) {
  return writeFileSync(
    join(__PATH.duanlu, `duanlu.json`),
    JSON.stringify(duanlu),
    'utf8'
  )
}

export function Writeit(custom) {
  return writeFileSync(
    join(__PATH.custom, `custom.json`),
    JSON.stringify(custom),
    'utf8'
  )
}

export function Write_tiandibang(wupin) {
  writeFileSync(
    join(__PATH.tiandibang, `tiandibang.json`),
    JSON.stringify(wupin),
    'utf8'
  )
  return false
}
