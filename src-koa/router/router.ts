import Router from 'koa-router'
import { ArchivePath } from '../../src/model/path'
import { readFilesInDirectory } from '../utils/utils'

import { getUserMessageByUid } from '../../src/model/message'
import { getSkillById } from '../../src/model/skills'
import { getEquipmentById } from '../../src/model/equipment'
import { CODE_ERROE, CODE_OK } from '../config'

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
 * /skill
 * get
 * id = 213
 */
router.get('/skill', (ctx) => {
  const query = ctx.query
  if (typeof query.id === 'string' || typeof query.id === 'number') {
    const data = getSkillById(query.id)
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
    const data = getEquipmentById(query.id)
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
  try {
    const fileNames = readFilesInDirectory(ArchivePath['player'])
    ctx.body = {
      code: CODE_OK,
      msg: '请求成功',
      data: {
        count: fileNames.length,
        list: fileNames.map((fileName) => fileName.split('.')[0])
      }
    }
  } catch (err) {
    ctx.body = {
      code: CODE_ERROE,
      msg: '请求成功',
      data: err
    }
  }
})
export default router
