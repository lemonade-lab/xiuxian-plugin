import fs from 'node:fs'
import path from 'path'
import { __dirname } from '../../main.js'
/**
 * 游戏数据生成
 */
export const __PATH = {
    //玩家存档
    'user_player': path.join(__dirname, '/resources/data/birth/xiuxian/player'),
    'user_extend': path.join(__dirname, '/resources/data/birth/xiuxian/extend'),
    'user_action': path.join(__dirname, '/resources/data/birth/xiuxian/action'),
    'user_battle': path.join(__dirname, '/resources/data/birth/xiuxian/battle'),
    'user_equipment': path.join(__dirname, '/resources/data/birth/xiuxian/equipment'),
    'user_level': path.join(__dirname, '/resources/data/birth/xiuxian/level'),
    'user_talent': path.join(__dirname, '/resources/data/birth/xiuxian/talent'),
    'user_wealth': path.join(__dirname, '/resources/data/birth/xiuxian/wealth'),
    'user_bag': path.join(__dirname, '/resources/data/birth/xiuxian/najie'),
    'user_life': path.join(__dirname, '/resources/data/birth/xiuxian/life'),
    //基础信息
    'fixed_point': path.join(__dirname, '/resources/data/fixed/point'),
    'fixed_position': path.join(__dirname, '/resources/data/fixed/position'),
    'fixed_equipment': path.join(__dirname, '/resources/data/fixed/equipment'),
    'fixed_goods': path.join(__dirname, '/resources/data/fixed/goods'),
    'fixed_level': path.join(__dirname, '/resources/data/fixed/Level'),
    'fixed_occupation': path.join(__dirname, '/resources/data/fixed/occupation'),
    'fixed_talent': path.join(__dirname, '/resources/data/fixed/talent'),
    //管理员自定义表
    'custom_goods': path.join(__dirname, '/resources/goods'),
    //生成信息
    'generate_all': path.join(__dirname, '/resources/data/birth/all'),
    'generate_position': path.join(__dirname, '/resources/data/birth/position'),
    'generate_level': path.join(__dirname, '/resources/data/birth/Level'),
}
class GenerateData {
    constructor() {
        this.talent_list = JSON.parse(fs.readFileSync(`${__PATH.fixed_talent}/talent_list.json`))
        this.newlist(__PATH.generate_level, 'Level_list', [])
        this.newlist(__PATH.generate_level, 'Level_list', [
            ...this.getlist(__PATH.fixed_level, 'Level_list.json')
        ])
        this.newlist(__PATH.generate_level, 'LevelMax_list', [])
        this.newlist(__PATH.generate_level, 'LevelMax_list', [
            ...this.getlist(__PATH.fixed_level, 'LevelMax_list.json')
        ])
        //全物品表
        this.newlist(__PATH.generate_all, 'all', [])
        this.newlist(__PATH.generate_all, 'all', [
            ...this.getlist(__PATH.fixed_equipment, 'json'),
            ...this.getlist(__PATH.fixed_goods, 'json'),
            ...this.getlist(__PATH.custom_goods, 'json')
        ])
        //商品数据
        this.newlist(__PATH.generate_all, 'commodities', [])
        this.newlist(__PATH.generate_all, 'commodities', [
            ...this.getlist(__PATH.fixed_goods, '0.json'),
            ...this.getlist(__PATH.custom_goods, '0.json')
        ])
        //怪物掉落表
        this.newlist(__PATH.generate_all, 'dropsItem', [])
        this.newlist(__PATH.generate_all, 'dropsItem', [
            ...this.getlist(__PATH.fixed_equipment, 'json'),
            ...this.getlist(__PATH.fixed_goods, 'json'),
            ...this.getlist(__PATH.custom_goods, '.json')
        ])
        //地图系统数据
        this.newlist(__PATH.generate_position, 'position', [])
        this.newlist(__PATH.generate_position, 'position', [
            ...this.getlist(__PATH.fixed_position, 'json')
        ])
        this.newlist(__PATH.generate_position, 'point', [])
        this.newlist(__PATH.generate_position, 'point', [
            ...this.getlist(__PATH.fixed_point, 'json')
        ])
    }
    /**
     * @param {地址} path 
     * @param {表名} name 
     * @param {原数据} sum 
     * @param {新数据} newsum 
     */
    list = (PATH, name, sum, newsum) => {
        const dir = path.join(PATH, `${name}.json`)
        const new_ARR = JSON.stringify([...sum, ...newsum], '', '\t')
        fs.writeFileSync(dir, new_ARR, 'utf8', (err) => { })
    }
    /**
     * @param {地址} path 
     * @param {表名} name 
     * @param {数据} sum 
     */
    newlist = (PATH, name, sum) => {
        const dir = path.join(PATH, `${name}.json`)
        const new_ARR = JSON.stringify(sum, '', '\t')
        fs.writeFileSync(dir, new_ARR, 'utf8', (err) => { })
    }
    /**
     * @param {地址} PATH 
     * @param {检索条件} type 
     */
    getlist = (PATH, type) => {
        const newsum = []
        const data = []
        const travel = (dir, callback) => {
            fs.readdirSync(dir).forEach((file) => {
                var pathname = path.join(dir, file)
                if (fs.statSync(pathname).isDirectory()) {
                    travel(pathname, callback)
                } else {
                    callback(pathname)
                }
            })
        }
        travel(PATH, (pathname) => {
            let temporary = pathname.search(type)
            if (temporary != -1) {
                newsum.push(pathname)
            }
        })
        newsum.forEach((file) => {
            data.push(...JSON.parse(fs.readFileSync(file)))
        })
        return data
    }
}
module.exports = new GenerateData()