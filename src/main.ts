import { Events } from './import'
import bag from './apps/bag'
import battle from './apps/battle'
import buy from './apps/buy'
import create from './apps/create'
import level from './apps/level'
import message from './apps/message'
import ping from './apps/ping'
const event = new Events()
event.use(bag.ok())
event.use(battle.ok())
event.use(buy.ok())
event.use(create.ok())
event.use(level.ok())
event.use(message.ok())
event.use(ping.ok())
const apps = event.ok()
export { apps }
