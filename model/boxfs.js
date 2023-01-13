import fs from 'node:fs'
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
}
export default new BoxFs()