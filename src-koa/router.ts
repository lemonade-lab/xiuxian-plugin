import Router from 'koa-router'
import { ArchivePath } from '../src/model/path'
import { readFilesInDirectory } from './utils'

const router = new Router({
  prefix: '/api'
})

router.get('/', (ctx) => {
  const query = ctx.query
  console.log('query', query)
  ctx.body = {
    code: 200,
    msg: '请求成功',
    data: null
  }
})
router.get('/player', (ctx) => {
  const query = ctx.query
  console.log('query', query)
  const fileNames = readFilesInDirectory(ArchivePath['player'])
  ctx.body = {
    code: 200,
    msg: '请求成功',
    data: {
      count: fileNames.length
    }
  }
})
export default router
