import fs from 'fs'
import template from 'art-template'
export const dealTpl = (data) => {
    let { tplFile } = data
    try {
        const tpl = fs.readFileSync(tplFile, 'utf8')
        return template.render(tpl, data);
    } catch (error) {
        console.log(`[加载html错误]${tplFile}`)
        return false
    }
}