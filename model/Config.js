import YAML from 'yaml'
import fs from 'node:fs'
import chokidar from 'chokidar'
import { appname } from './main.js'
class Config {
    constructor() {
        //固定配置地址
        this.defSetPath = `./plugins/${appname}/defSet`
        this.defSet = {}
        //动态配置地址
        this.configPath = `./plugins/${appname}/config`
        this.config = {}
        /** 监听文件 */
        this.watcher = { config: {}, defSet: {} }
    }
    //原始固定配置读取
    getdefSet = (app, name) => {
        return this.getYaml(app, name, 'defSet')
    }
    //动态生成配置读取
    getConfig = (app, name) => {
        //地址名，文件名
        return this.getYaml(app, name, 'config')
    }
    /**
     * 
     * @param {地址名} app 
     * @param {文件名} name 
     * @param {地址类型} type 
     * @returns 
     */
    getYaml = (app, name, type) => {
        //获得配置地址
        let file = this.getFilePath(app, name, type)
        let key = `${app}.${name}`
        if (this[type][key]) return this[type][key]
        //读取配置
        this[type][key] = YAML.parse(fs.readFileSync(file, 'utf8'))
        this.watch(file, app, name, type)
        return this[type][key]
    }
    //如果类型是defSet就返回defSet类型地址
    /**
     * 
     * @param {地址名} app 
     * @param {文件名} name 
     * @param {类型地址} type 
     * @returns 
     */

    getFilePath = (app, name, type) => {
        if (type == 'defSet') {
            return `${this.defSetPath}/${app}/${name}.yaml`
        } else {
            return `${this.configPath}/${app}/${name}.yaml`
        }
    }
    /**
     * @param {地址类型} file 
     * @param {地址名} app 
     * @param {文件名} name 
     * @param {类型地址} type 
     * @returns 
     */
    watch = (file, app, name, type = 'defSet') => {
        let key = `${app}.${name}`
        if (this.watcher[type][key]) return
        const watcher = chokidar.watch(file)
        watcher.on('change', (path) => {
            delete this[type][key]
            logger.mark(`[修改配置文件][${type}][${app}][${name}]`)
            if (this[`change_${app}${name}`]) {
                this[`change_${app}${name}`]()
            }
        })
        this.watcher[type][key] = watcher
        return
    }
}
export default new Config()