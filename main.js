import express from 'express'
import { getData } from './develop/data.js'
const app = express()
const port = 3000
/* 静态文件 */
app.use('/resources', express.static('resources'))
app.use('/resources/img', express.static('resources/html/allimg'))
/*  挂载 */
app.get('/', (req, res) => {
    var html = getData() 
    res.send(html);
})
/* 监听 */
app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
    console.log(`http://127.0.0.1:${port}`)
})