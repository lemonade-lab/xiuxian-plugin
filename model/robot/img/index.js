import puppeteer from "../../../../../lib/puppeteer/puppeteer.js"
import Show from "./show.js"
class ImgIndex {
    showPuppeteer = async (parameter) => {
        const { path, name, data } = parameter
        const mydata = await Show.get_Data({
            path, name, data
        })
        const img = await puppeteer.screenshot(name, {
            ...mydata,
        })
        return img
    }
}
export default new ImgIndex()