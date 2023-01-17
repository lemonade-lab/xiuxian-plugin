import puppeteer from '../../../../../lib/puppeteer/puppeteer.js'
import md5 from 'md5'
const helpData = {}
const allData = {}
class Cache {
    helpcache = async (parameter) => {
        const { data, i } = parameter
        const tmp = md5(JSON.stringify(data))
        if (!helpData.hasOwnProperty(i)) {
            helpData[i] = {
                'md5': '',
                'img': ''
            }
        }
        if (helpData[i].md5 == tmp) {
            return helpData[i].img
        }
        helpData[i].img = await puppeteer.screenshot('help', data)
        helpData[i].md5 = tmp
        return helpData[i].img
    }
    //查看缓存
    readCahe = async (parameter) => {
        const { name } = parameter
        if (!allData.hasOwnProperty(name)) {
            return false
        }
        const time = new Date().getMinutes()
        if (allData[name]['time'] + 5 <= time) {
            return allData[name]['data']
        }
        return false
    }
    //添加缓存
    addCahe = async (parameter) => {
        const { name, data } = parameter
        const time = new Date().getMinutes()
        if (!allData.hasOwnProperty(name)) {
            allData[name] = {
                'time': '',
                'data': ''
            }
        }
        allData[name]['time'] = time
        allData[name]['data'] = data
        return allData[name]['data']
    }
}
export default new Cache()