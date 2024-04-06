import Router from 'koa-router'
import { ArchivePath } from '../src/model/path'
import { readFilesInDirectory } from './utils'

import { getUserMessageByUid } from '../src/model/message.ts'

const router = new Router({
  prefix: '/api'
})

/**
 *
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

router.get('/message', (ctx) => {
  const query = ctx.query
  console.log('query', query.uid)
  if (typeof query.uid == 'string') {
    const data = getUserMessageByUid(query.uid as any)
    ctx.body = {
      code: 200,
      msg: '请求成功',
      data: data
    }
  }
})

/**
 * 统计信息
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
