import { join } from 'path'
import { cwd } from '../../config.js'
// 文件存放路径
export const __PATH = {
  //更新日志
  updata_log_path: join(cwd, 'vertion.txt'),
  //用户数据
  player_path: join(cwd, '/resources/data/xiuxian_player'),
  //装备
  equipment_path: join(cwd, '/resources/data/xiuxian_equipment'),
  //纳戒
  najie_path: join(cwd, '/resources/data/xiuxian_najie'),
  //丹药
  danyao_path: join(cwd, '/resources/data/xiuxian_danyao'),
  //源数据
  lib_path: join(cwd, '/resources/data/item'),
  Timelimit: join(cwd, '/resources/data/Timelimit'),
  Exchange: join(cwd, '/resources/data/Exchange'),
  shop: join(cwd, '/resources/data/shop'),
  log_path: join(cwd, '/resources/data/suduku'),
  association: join(cwd, '/resources/data/association'),
  tiandibang: join(cwd, '/resources/data/tiandibang'),
  qinmidu: join(cwd, '/resources/data/qinmidu'),
  backup: join(cwd, '/resources/backup'),
  player_pifu_path: join(cwd, '/resources/img/player_pifu'),
  shitu: join(cwd, '/resources/data/shitu'),
  equipment_pifu_path: join(cwd, '/resources/img/equipment_pifu'),
  duanlu: join(cwd, '/resources/data/duanlu'),
  temp_path: join(cwd, '/resources/data/temp'),
  custom: join(cwd, '/resources/data/custom'),
  auto_backup: join(cwd, '/resources/data/auto_backup')
}
