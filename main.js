import express from 'express'
import { getData } from './develop/data.js'
const app = express()
const port = 3000
/* 静态文件 */
app.use('/html', express.static('resources/html'))

app.use('/font', express.static('resources/font'))

app.use('/img', express.static('resources/img'))

/*  挂载 */
app.get('/', (req, res) => {
  let html = getData()
  res.send(html)
})

/* 监听 */
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
  console.log(`http://127.0.0.1:${port}`)
})
