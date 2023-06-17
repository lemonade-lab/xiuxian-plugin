import { obtainingImages } from '../robot/img.js'
import ImgCache from '../robot/cache.js'
import { getboxhelp } from '../robot/help.js'
import Robot from '../robot/action.js'
import Exec from '../robot/exex.js'
import { getConfig } from '../robot/defset.js'
import { toIndex } from '../robot/index.js'
export const BotApi = {
  getConfig,
  obtainingImages,
  toIndex,
  ImgCache,
  getboxhelp,
  Robot,
  Exec
}
