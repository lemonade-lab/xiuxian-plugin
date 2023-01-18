import fs from 'node:fs'
import path from 'path'
import YAML from 'yaml'
import NodeJS from '../../../node/node.js'
const other = `${path.resolve()}${path.sep}config${path.sep}config/other.yaml`
const group = `${path.resolve()}${path.sep}config${path.sep}config/group.yaml`
class ConfigModify {
    Readconfig = () => {
        try {
            const data = YAML.parse(fs.readFileSync(`${group}`, 'utf8'))
            const sum = ['十连', '角色查询', '体力查询', '用户绑定', '抽卡记录', '添加表情', '欢迎新人', '退群通知', '云崽帮助', '角色素材', '今日素材', '养成计算', '米游社公告']
            data.default.disable.push(...sum)
            const yamlStr = NodeJS.returnjsyaml().dump(data)
            fs.writeFileSync(group, yamlStr, 'utf8')
            return '关闭成功'
        } catch {
            return '[缺少必要依赖]\nYunzai-Bot目录下\n执行以下两条指令\npnpm i yamljs -w\npnpm i  js-yaml -w'
        }
    }
    openReadconfig = () => {
        try {
            const data = YAML.parse(fs.readFileSync(`${group}`, 'utf8'))
            data.default.disable = []
            const yamlStr = NodeJS.returnjsyaml().dump(data)
            fs.writeFileSync(group, yamlStr, 'utf8')
            return '开启成功'
        } catch {
            return '[缺少必要依赖]\nYunzai-Bot目录下\n执行以下两条指令\npnpm i yamljs -w\npnpm i  js-yaml -w'
        }
    }
    Readconfighelp = () => {
        try {
            const data = YAML.parse(fs.readFileSync(`${group}`, 'utf8'))
            const sum = ['云崽帮助']
            data.default.disable.push(...sum)
            const yamlStr = NodeJS.returnjsyaml().dump(data)
            fs.writeFileSync(group, yamlStr, 'utf8')
            return '设置成功'
        } catch {
            return '[缺少必要依赖]\nYunzai-Bot目录下\n执行以下两条指令\npnpm i yamljs -w\npnpm i  js-yaml -w'
        }
    }
    openReadconfighelp = () => {
        try {
            const data = YAML.parse(fs.readFileSync(`${group}`, 'utf8'))
            const sum = []
            data.default.disable.forEach((item) => {
                if (item != '云崽帮助') {
                    sum.push(item)
                }
            })
            data.default.disable = sum
            const yamlStr = NodeJS.returnjsyaml().dump(data)
            fs.writeFileSync(group, yamlStr, 'utf8')
            return '设置成功'
        } catch {
            return '[缺少必要依赖]\nYunzai-Bot目录下\n执行以下两条指令\npnpm i yamljs -w\npnpm i  js-yaml -w'
        }
    }
    AddMaster = (parameter) => {
        const { mastername } = parameter
        try {
            const QQ = Number(mastername)
            const data = YAML.parse(fs.readFileSync(`${other}`, 'utf8'))
            const sum = [QQ]
            data.masterQQ.push(...sum)
            const yamlStr = NodeJS.returnjsyaml().dump(data)
            fs.writeFileSync(other, yamlStr, 'utf8')
            return '添加成功'
        } catch {
            return '[缺少必要依赖]\nYunzai-Bot目录下\n执行以下两条指令\npnpm i yamljs -w\npnpm i  js-yaml -w'
        }
    }
    DeleteMaster = (parameter) => {
        const { mastername } = parameter
        try {
            const QQ = Number(mastername)
            const data = YAML.parse(fs.readFileSync(`${other}`, 'utf8'))
            const sum = []
            data.masterQQ.forEach((item) => {
                if (item != QQ) {
                    sum.push(item)
                }
            })
            data.masterQQ = sum
            const yamlStr = NodeJS.returnjsyaml().dump(data)
            fs.writeFileSync(other, yamlStr, 'utf8')
            return '删除成功'
        } catch {
            return '[缺少必要依赖]\nYunzai-Bot目录下\n执行以下两条指令\npnpm i yamljs -w\npnpm i  js-yaml -w'
        }
    }
    OffGroup = () => {
        try {
            const data = YAML.parse(fs.readFileSync(`${other}`, 'utf8'))
            data.disablePrivate = true
            const yamlStr = NodeJS.returnjsyaml().dump(data)
            fs.writeFileSync(other, yamlStr, 'utf8')
            return '关闭成功'
        } catch {
            return '请先执行\npnpm i yamljs -w\npnpm i  js-yaml -w'
        }
    }
    OnGroup = () => {
        try {
            const data = YAML.parse(fs.readFileSync(`${other}`, 'utf8'))
            data.disablePrivate = false
            const yamlStr = NodeJS.returnjsyaml().dump(data)
            fs.writeFileSync(other, yamlStr, 'utf8')
            return '开启成功'
        } catch {
            return '[缺少必要依赖]\nYunzai-Bot目录下\n执行以下两条指令\npnpm i yamljs -w\npnpm i  js-yaml -w'
        }
    }
}
export default new ConfigModify()