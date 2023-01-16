import fs from 'node:fs'
import path from 'path'
/**
 * 游戏数据生成
 */
class GenerateData {
    /**
     * @param {地址} path 
     * @param {表名} name 
     * @param {原数据} sum 
     * @param {新数据} newsum 
     */
    list = (PATH, name, sum, newsum) => {
        const dir = path.join(PATH, `${name}.json`)
        const new_ARR = JSON.stringify([...sum, ...newsum], '', '\t')
        fs.writeFileSync(dir, new_ARR, 'utf8', (err) => { })
    }
    /**
     * @param {地址} path 
     * @param {表名} name 
     * @param {数据} sum 
     */
    newlist = (PATH, name, sum) => {
        const dir = path.join(PATH, `${name}.json`)
        const new_ARR = JSON.stringify(sum, '', '\t')
        fs.writeFileSync(dir, new_ARR, 'utf8', (err) => { })
    }
    /**
     * @param {地址} PATH 
     * @param {检索条件} type 
     */
    getlist = (PATH, type) => {
        const newsum = []
        const data = []
        const travel = (dir, callback) => {
            fs.readdirSync(dir).forEach((file) => {
                var pathname = path.join(dir, file)
                if (fs.statSync(pathname).isDirectory()) {
                    travel(pathname, callback)
                } else {
                    callback(pathname)
                }
            })
        }
        travel(PATH, (pathname) => {
            let temporary = pathname.search(type)
            if (temporary != -1) {
                newsum.push(pathname)
            }
        })
        newsum.forEach((file) => {
            data.push(...JSON.parse(fs.readFileSync(file)))
        })
        return data
    }
}
module.exports = new GenerateData()