import Router from 'koa-router'
import { ArchivePath } from '../../src/model/path'
import { readFilesInDirectory } from '../utils/utils'

import { getUserMessageByUid } from '../../src/model/message'
import { getKillById } from '../../src/model/kills'
import { getEuipmentById } from '../../src/model/equipment'

const router = new Router({
  prefix: '/api'
})

/**
 * 请求相应测试
 * /
 * get
 */
router.get('/', (ctx) => {
  const query = ctx.query
  console.log('query', query)
  ctx.body = {
    code: 200,
    msg: '请求成功',
    data: null
  }
})

/**
 * 获得指定装备信息
 * /kill
 * get
 * id = 213
 */
router.get('/kill', (ctx) => {
  const query = ctx.query
  if (typeof query.id === 'string' || typeof query.id === 'number') {
    const data = getKillById(query.id)
    ctx.body = {
      code: 200,
      msg: '请求成功',
      data: data
    }
  } else {
    ctx.body = {
      code: 200,
      msg: '请求失败',
      data: null
    }
  }
})

/**
 * 获得指定武器信息
 * /arms
 * get
 * id = 123
 */
router.get('/arms', (ctx) => {
  const query = ctx.query
  if (typeof query.id === 'string' || typeof query.id === 'number') {
    const data = getEuipmentById(query.id)
    ctx.body = {
      code: 200,
      msg: '请求成功',
      data: data
    }
  } else {
    ctx.body = {
      code: 200,
      msg: '请求失败',
      data: null
    }
  }
})

/**
 * 获得指定用户信息
 * /message
 * get
 * uid = 123456
 */
router.get('/message', (ctx) => {
  const query = ctx.query
  if (typeof query.uid === 'string' || typeof query.uid === 'number') {
    const data = getUserMessageByUid(query.uid)
    ctx.body = {
      code: 200,
      msg: '请求成功',
      data: data
    }
  } else {
    ctx.body = {
      code: 200,
      msg: '请求失败',
      data: null
    }
  }
})

/**
 * 获得存档总计信息
 * /player
 * get
 */
router.get('/player', (ctx) => {
  const fileNames = readFilesInDirectory(ArchivePath['player'])
  ctx.body = {
    code: 200,
    msg: '请求成功',
    data: {
      count: fileNames.length,
      list: fileNames.map((fileName) => fileName.split('.')[0])
    }
  }
})
export default router
