import puppeteer from './puppeteer.js'
import md5 from 'md5'
const helpData = {}
const allData = {}
class Cache {
  /**
   * @param { data, i } param0
   * @returns
   */
  async helpcache({ data, i }) {
    const tmp = md5(JSON.stringify(data))
    if (!helpData.hasOwnProperty(i)) {
      helpData[i] = {
        md5: '',
        img: ''
      }
    }
    if (helpData[i].md5 == tmp) {
      return helpData[i].img
    }
    helpData[i].img = await puppeteer.screenshot('help', data)
    helpData[i].md5 = tmp
    return helpData[i].img
  }

  /**
   * @param { name } param0
   * @returns
   */
  readCahe({ name }) {
    if (!allData.hasOwnProperty(name)) {
      return {}
    }
    const time = new Date().getMinutes()
    if (allData[name].time + 5 <= time) {
      return { CacheMSG: allData[name].data }
    }
    return {}
  }

  /**
   * @param { name, data }  param0
   * @returns
   */
  addCahe({ name, data }) {
    const time = new Date().getMinutes()
    if (!allData.hasOwnProperty(name)) {
      allData[name] = {
        time: '',
        data: ''
      }
    }
    allData[name].time = time
    allData[name].data = data
    return { CacheMSG: allData[name].data }
  }
}
export default new Cache()
