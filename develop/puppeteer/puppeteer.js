import fs from 'fs'
import template from 'art-template'
class puppeteer {
    dealTpl = (name, data) => {
        let { tplFile, saveId = name } = data
        try {
            const tpl = fs.readFileSync(tplFile, 'utf8')
            return template.render(tpl, data);
        } catch (error) {
            logger.error(`加载html错误:${tplFile}`)
            return false
        }
    }
}
export default new puppeteer()