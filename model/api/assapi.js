import assDataIndex from '../game/data/index.js'
import createData from '../game/data/createdata.js'
import assUser from '../game/ass/user.js'
import { numberMaximums, spiritStoneAnsMax, buildNameList } from '../game/ass/assconfig.js'
import Schedule from '../game/data/schedule.js'
export const AssociationApi = {
  assDataIndex,
  createData,
  assUser,
  Schedule,
  config: {
    numberMaximums,
    spiritStoneAnsMax,
    buildNameList
  }
}
