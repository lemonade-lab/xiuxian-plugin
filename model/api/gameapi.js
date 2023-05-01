import GamePublic from '../game/public/index.js'
import GameBattle from '../game/public/battel.js'
import GameMap from '../game/public/map.js'

import DefsetUpdata from '../game/data/defset.js'
import DataIndex from '../game/data/index.js'
import Schedule from '../game/data/schedule.js'
import Algorithm from '../game/data/algorithm.js'
import Createdata from '../game/data/createdata.js'
import UserData from '../game/data/listdata.js'

import GameMonster from '../game/monster/monster.js'

import Information from '../game/user/information.js'
import UserAction from '../game/user/action.js'
import GameUser from '../game/user/index.js'
import Duel from '../game/user/duel.js'
export const GameApi = {
  Dll: {
    Duel
  },
  GamePublic,
  GameUser,
  DefsetUpdata,
  Schedule,
  Algorithm,
  Createdata,
  UserAction,
  UserData,
  GameMap,
  GameMonster,
  GameBattle,
  Information,
  DataIndex
}
