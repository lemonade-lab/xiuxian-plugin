import fs from 'node:fs'
import path from 'node:path'
class BoxFs {
    /**
     * @param {地址} path 
     * @returns 该地址的子目录数组
     */
    returnMenu = (path) => {
        const files = fs.readdirSync(path)
        const shield = ['.git']
        const sum = []
        files.forEach((item) => {
            const newpath = `${path}/${item}`
            const stat = fs.statSync(newpath)
            //不是文件？
            if (!stat.isFile()) {
                //是目录名
                const file = newpath.replace(`${path}/`, '')
                shield.forEach((item) => {
                    if (item != file) {
                        sum.push(file)
                    }
                })
            }
        })
        return sum
    }
    returnfilepath=(menupath,type)=>{
        const newsum = []
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
        travel(menupath, (pathname) => {
            let temporary = pathname.search(type)
            if (temporary != -1) {
                newsum.push(pathname)
            }
        })
        return newsum
    }
}
export default new BoxFs()