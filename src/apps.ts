import * as bag from './apps/bag'
import * as battle from './apps/battle'
import * as buy from './apps/buy'
import * as create from './apps/create'
import * as level from './apps/level'
import * as message from './apps/message'
import * as ping from './apps/ping'
import * as sign from './apps/sign'
import * as leaderBoard from './apps/leaderBoard.ts'
import * as boss from './apps/boss'
import * as instance from './apps/instance'
import * as other from './apps/other'
import * as associationUser from './apps/association/user'
import * as associationManager from './apps/association/manager.ts'

export default [
  bag.default.ok,
  battle.default.ok,
  buy.default.ok,
  create.default.ok,
  level.default.ok,
  message.default.ok,
  ping.default.ok,
  sign.default.ok,
  leaderBoard.default.ok,
  boss.default.ok,
  instance.default.ok,
  other.default.ok,
  associationUser.default.ok,
  associationManager.default.ok
]
