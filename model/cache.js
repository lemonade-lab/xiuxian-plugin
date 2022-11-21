import puppeteer from '../../../lib/puppeteer/puppeteer.js';
import md5 from 'md5';
const helpData = [];
class Cache {
    constructor() {};
     helpcache=async(data, i)=>{
        let tmp = md5(JSON.stringify(data));
        while (true) {
            if (helpData.length <= i) {
                helpData.push({
                    md5: '',
                    img: '',
                });
            } else {
                break;
            }
        };
        if (helpData[i].md5 == tmp) {
            return helpData[i].img
        };
        helpData[i].img = await puppeteer.screenshot('help', data);
        helpData[i].md5 = tmp;
        return helpData[i].img;
    };
};
export default  new Cache();