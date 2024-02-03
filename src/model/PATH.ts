import { join } from 'path'
import { MyDirPath } from '../../config.js'
// 文件存放路径
export const __PATH = {
  //更新日志
  updata_log_path: join(MyDirPath, 'vertion.txt'),
  //用户数据
  player_path: join(MyDirPath, '/resources/data/xiuxian_player'),
  //装备
  equipment_path: join(MyDirPath, '/resources/data/xiuxian_equipment'),
  //纳戒
  najie_path: join(MyDirPath, '/resources/data/xiuxian_najie'),
  //丹药
  danyao_path: join(MyDirPath, '/resources/data/xiuxian_danyao'),
  //源数据
  lib_path: join(MyDirPath, '/resources/data/item'),
  Timelimit: join(MyDirPath, '/resources/data/Timelimit'),
  Exchange: join(MyDirPath, '/resources/data/Exchange'),
  shop: join(MyDirPath, '/resources/data/shop'),
  log_path: join(MyDirPath, '/resources/data/suduku'),
  association: join(MyDirPath, '/resources/data/association'),
  tiandibang: join(MyDirPath, '/resources/data/tiandibang'),
  qinmidu: join(MyDirPath, '/resources/data/qinmidu'),
  backup: join(MyDirPath, '/resources/backup'),
  player_pifu_path: join(MyDirPath, '/resources/img/player_pifu'),
  shitu: join(MyDirPath, '/resources/data/shitu'),
  equipment_pifu_path: join(MyDirPath, '/resources/img/equipment_pifu'),
  duanlu: join(MyDirPath, '/resources/data/duanlu'),
  temp_path: join(MyDirPath, '/resources/data/temp'),
  custom: join(MyDirPath, '/resources/data/custom'),
  auto_backup: join(MyDirPath, '/resources/data/auto_backup')
}
