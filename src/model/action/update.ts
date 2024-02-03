import { writeFileSync } from 'fs'
import { data } from '../base/data'
import { Add_HP } from './add'
import { Read_player } from './read'
import { Write_player } from './write'
import { __PATH } from '../base/PATH'
import { join } from 'path'

/**
 *
 * @param usr_qq
 * @param equipment
 * @returns
 */
export async function Update_equipment(usr_qq, equipment) {
  let player = await Read_player(usr_qq)
  player.攻击 =
    data.Level_list.find((item) => item.level_id == player.level_id).基础攻击 +
    player.攻击加成 +
    data.LevelMax_list.find((item) => item.level_id == player.Physique_id)
      .基础攻击
  player.防御 =
    data.Level_list.find((item) => item.level_id == player.level_id).基础防御 +
    player.防御加成 +
    data.LevelMax_list.find((item) => item.level_id == player.Physique_id)
      .基础防御
  player.血量上限 =
    data.Level_list.find((item) => item.level_id == player.level_id).基础血量 +
    player.生命加成 +
    data.LevelMax_list.find((item) => item.level_id == player.Physique_id)
      .基础血量
  player.暴击率 =
    data.Level_list.find((item) => item.level_id == player.level_id).基础暴击 +
    data.LevelMax_list.find((item) => item.level_id == player.Physique_id)
      .基础暴击
  let type = ['weapon', 'protective_clothing', 'magic_weapon']
  for (let i of type) {
    if (
      equipment[i].atk > 10 ||
      equipment[i].def > 10 ||
      equipment[i].HP > 10
    ) {
      player.攻击 += equipment[i].atk
      player.防御 += equipment[i].def
      player.血量上限 += equipment[i].HP
    } else {
      player.攻击 = Math.trunc(player.攻击 * (1 + equipment[i].atk))
      player.防御 = Math.trunc(player.防御 * (1 + equipment[i].def))
      player.血量上限 = Math.trunc(player.血量上限 * (1 + equipment[i].HP))
    }
    player.暴击率 += equipment[i].bao
  }
  player.暴击伤害 = player.暴击率 + 1.5
  if (player.暴击伤害 > 2.5) player.暴击伤害 = 2.5
  if (player.仙宠.type == '暴伤') player.暴击伤害 += player.仙宠.加成
  Write_player(usr_qq, player)
  await Add_HP(usr_qq, 0)
  writeFileSync(
    join(__PATH.equipment_path, `${usr_qq}.json`),
    JSON.stringify(equipment),
    'utf8'
  )
  return
}
