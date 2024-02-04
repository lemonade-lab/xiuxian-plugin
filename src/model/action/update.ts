import { writeFileSync } from 'fs'
import { data } from '../base/data'
import { Add_HP } from './add'
import { Read_player } from './read'
import { Write_player } from './write'
import { __PATH } from '../base/PATH'
import { join } from 'path'

/**
 *
 * @param user_id
 * @param equipment
 * @returns
 */
export async function Update_equipment(user_id, equipment) {
  let player = await Read_player(user_id)

  const Level_list = data.Level_list()
  const LevelMax_list = data.LevelMax_list()

  /**
   * 数据计算
   */
  player.攻击 =
    Level_list.find((item) => item.level_id == player.level_id).基础攻击 +
    player.攻击加成 +
    LevelMax_list.find((item) => item.level_id == player.Physique_id).基础攻击
  player.防御 =
    Level_list.find((item) => item.level_id == player.level_id).基础防御 +
    player.防御加成 +
    LevelMax_list.find((item) => item.level_id == player.Physique_id).基础防御
  player.血量上限 =
    Level_list.find((item) => item.level_id == player.level_id).基础血量 +
    player.生命加成 +
    LevelMax_list.find((item) => item.level_id == player.Physique_id).基础血量
  player.暴击率 =
    Level_list.find((item) => item.level_id == player.level_id).基础暴击 +
    LevelMax_list.find((item) => item.level_id == player.Physique_id).基础暴击

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
  Write_player(user_id, player)
  await Add_HP(user_id, 0)
  writeFileSync(
    join(__PATH.equipment_path, `${user_id}.json`),
    JSON.stringify(equipment),
    'utf8'
  )
  return
}
