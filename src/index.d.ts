import { type Client, segment as se } from 'icqq'
import { RedisClientType } from 'redis'
declare global {
  let redis: RedisClientType
  let Bot: Client
  let segment: typeof se
}
