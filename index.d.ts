import { type Client, segment as se } from 'icqq'
import { RedisClientType } from 'redis'
declare global {
  var redis: RedisClientType
  var Bot: Client
  var segment: typeof se
}
