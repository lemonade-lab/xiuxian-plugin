import Router from 'koa-router'

import { getSkillById } from '../../src/model/skills'
import { getEquipmentById } from '../../src/model/equipment'
import { CODE_ERROR } from '../config'
import { DB } from '../../src/model/db-system'

const router = new Router({
  prefix: '/api'
})

/**
 * 请求相应测试
 * /
 * get
 */
router.get('/', ctx => {
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
router.get('/skill', ctx => {
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
router.get('/arms', ctx => {
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
router.get('/message', async ctx => {
  const query = ctx.query
  if (typeof query.uid === 'string' || typeof query.uid === 'number') {
    const data = await DB.findOne(query.uid)
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
router.get('/player', ctx => {
  ctx.body = {
    code: CODE_ERROR,
    msg: '请求成功',
    data: null
  }
})
export default router
