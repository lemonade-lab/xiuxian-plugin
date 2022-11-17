import puppeteer from "../../../lib/puppeteer/puppeteer.js";
import md5 from "md5";
const helpData = [];
/**
 * 已占用位：0，1，2
 * 宗门系统：3
 */
class Cache {
    constructor() {}
    /**
     * 
     * @param  data 数据
     * @param  i 占用位置
     * @returns 
     */
    async helpcache(data, i) {
        let tmp = md5(JSON.stringify(data));
        while (true) {
            if (helpData.length <= i) {
                helpData.push({
                    md5: "",
                    img: "",
                });
            } else {
                break;
            }
        };
        if (helpData[i].md5 == tmp) {
            return helpData[i].img
        };
        helpData[i].img = await puppeteer.screenshot("help", data);
        helpData[i].md5 = tmp;
        return helpData[i].img;
    }
}
export default  new Cache();