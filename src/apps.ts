import bag from '@src/apps/bag'
import battle from '@src/apps/battle'
import buy from '@src/apps/buy'
import create from '@src/apps/create'
import level from '@src/apps/level'
import message from '@src/apps/message'
import ping from '@src/apps/ping'
import sign from '@src/apps/sign'
import leaderBoard from '@src/apps/leaderboard'
import boss from '@src/apps/boss'
import instance from '@src/apps/instance'
import other from '@src/apps/other'
import associationUser from '@src/apps/association/user'
import associationManager from '@src/apps/association/manager.ts'

export default [
  bag.ok,
  battle.ok,
  buy.ok,
  create.ok,
  level.ok,
  message.ok,
  ping.ok,
  sign.ok,
  leaderBoard.ok,
  boss.ok,
  instance.ok,
  other.ok,
  associationUser.ok,
  associationManager.ok
]
