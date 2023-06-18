import Wrap from '../game/wrap/index.js'
import GameBattle from '../game/wrap/battel.js'
import GameMap from '../game/wrap/map.js'
import * as GamePlace from '../game/wrap/place.js'
import Method from '../game/wrap/method.js'

import DefsetUpdata from '../game/data/defset.js'
import DataIndex from '../game/data/index.js'
import Schedule from '../game/data/schedule.js'
import Algorithm from '../game/data/algorithm.js'
import Createdata from '../game/data/createdata.js'
import UserData from '../game/data/listdata.js'

import GameMonster from '../game/monster/monster.js'

import Information from '../game/box/information.js'
import UserAction from '../game/box/action.js'
import GameUser from '../game/box/index.js'
import Duel from '../game/box/duel.js'
export const GameApi = {
  Dll: {
    Duel
  },
  Method,
  GamePlace,
  Wrap,
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
