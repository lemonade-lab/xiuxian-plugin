import puppeteer from "../../../../../lib/puppeteer/puppeteer.js"
import Show from "../img/show.js"
class RobotApi{
    showPuppeteer = async (path, name, data) => {
        const mydata = await Show.get_Data({
            path, name, data
        })
        const img = await puppeteer.screenshot(name, {
            ...mydata,
        })
        return img
    }

}
export default new RobotApi()