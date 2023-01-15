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
    /**
     * 
     * @param {*} menupath 
     * @param {类型} type 
     * @returns 
     */
    returnfilepath = (menupath, type) => {
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

    /**
     * {表名,地址,数据}
     * @param {对象} parameter 
     * @returns 若存在不存在数据参数则是读取操作
     */
    dataAction=async(parameter)=>{
        const {NAME,PATH,DATA}=parameter
        const DIR = path.join(`${PATH}/${NAME}.json`)
        if(DATA){
            fs.writeFileSync(DIR, JSON.stringify(DATA, '', '\t'), 'utf8', (err) => { })
            return
        }
        const data = JSON.parse(fs.readFileSync(DIR, 'utf8', (err, data) => {
            if (err) {
                return 'error'
            }
            return data
        }))
        return data
    }

    /**
     * 
     * @param {表名} NAME 
     * @param {数据} DATA 
     * @param {地址} PATH 
     * @returns 
     */
    write = async (NAME, DATA, PATH) => {
        const dir = path.join(PATH, `${NAME}.json`)
        const new_ARR = JSON.stringify(DATA, '', '\t')
        fs.writeFileSync(dir, new_ARR, 'utf8', (err) => { })
        return
    }
    /**
     * 
     * @param {表名} NAME 
     * @param {地址} PATH 
     * @returns 
     */
    read = async (NAME, PATH) => {
        const dir = path.join(`${PATH}/${NAME}.json`)
        let msg = fs.readFileSync(dir, 'utf8', (err, data) => {
            if (err) {
                return 'error'
            }
            return data
        })
        msg = JSON.parse(msg)
        return msg
    }
    newRead = async (NAME, PATH) => {
        const dir = path.join(`${PATH}/${NAME}.json`)
        try {
            const newData = fs.readFileSync(dir, 'utf8', (err, data) => {
                if (err) {
                    return 'error'
                }
                return data
            })
            return newData
        } catch {
            return false
        }
    }
}
export default new BoxFs()