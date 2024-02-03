import { type Client } from 'icqq'
import { RedisClientType } from 'redis'
declare global {
  var redis: RedisClientType
  var Bot: Client
}
