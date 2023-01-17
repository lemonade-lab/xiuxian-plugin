import fs from 'node:fs'
import path from 'path'
import { __dirname } from './main.js'
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
    'fixed_Level': path.join(__dirname, '/resources/data/fixed/Level'),
    'fixed_occupation': path.join(__dirname, '/resources/data/fixed/occupation'),
    'fixed_talent': path.join(__dirname, '/resources/data/fixed/talent'),
    //管理员自定义表
    'custom_goods': path.join(__dirname, '/resources/goods'),
    //生成信息
    'generate_all': path.join(__dirname, '/resources/data/birth/all'),
    'generate_position': path.join(__dirname, '/resources/data/birth/position'),
    'generate_level': path.join(__dirname, '/resources/data/birth/Level'),


    /**
     * 以下旧命名已废弃
     */

    //玩家存档
    'player': path.join(__dirname, '/resources/data/birth/xiuxian/player'),
    'extend': path.join(__dirname, '/resources/data/birth/xiuxian/extend'),
    'action': path.join(__dirname, '/resources/data/birth/xiuxian/action'),
    'battle': path.join(__dirname, '/resources/data/birth/xiuxian/battle'),
    'equipment': path.join(__dirname, '/resources/data/birth/xiuxian/equipment'),
    'level': path.join(__dirname, '/resources/data/birth/xiuxian/level'),
    'talent': path.join(__dirname, '/resources/data/birth/xiuxian/talent'),
    'wealth': path.join(__dirname, '/resources/data/birth/xiuxian/wealth'),
    'najie': path.join(__dirname, '/resources/data/birth/xiuxian/najie'),
    'life': path.join(__dirname, '/resources/data/birth/xiuxian/life'),
    //基础信息
    'fixepoint': path.join(__dirname, '/resources/data/fixed/point'),
    'fixedposition': path.join(__dirname, '/resources/data/fixed/position'),
    'fixedequipment': path.join(__dirname, '/resources/data/fixed/equipment'),
    'fixedgoods': path.join(__dirname, '/resources/data/fixed/goods'),
    'fixedLevel': path.join(__dirname, '/resources/data/fixed/Level'),
    'fixedoccupation': path.join(__dirname, '/resources/data/fixed/occupation'),
    'fixedtalent': path.join(__dirname, '/resources/data/fixed/talent'),
    //新增
    'newgoods': path.join(__dirname, '/resources/goods'),
    //生成
    'all': path.join(__dirname, '/resources/data/birth/all'),
    'position': path.join(__dirname, '/resources/data/birth/position'),
    'Level': path.join(__dirname, '/resources/data/birth/Level'),
}
class boxdada {
    constructor() {
        /*
        this.talent_list = JSON.parse(fs.readFileSync(`${__PATH.fixedtalent}/talent_list.json`))
        this.newlist(__PATH.Level, 'Level_list', [])
        this.newlist(__PATH.Level, 'Level_list', [
            ...this.getlist(__PATH.fixedLevel, 'Level_list.json')
        ])
        this.newlist(__PATH.Level, 'LevelMax_list', [])
        this.newlist(__PATH.Level, 'LevelMax_list', [
            ...this.getlist(__PATH.fixedLevel, 'LevelMax_list.json')
        ])
        //全物品表
        this.newlist(__PATH.all, 'all', [])
        this.newlist(__PATH.all, 'all', [
            ...this.getlist(__PATH.fixedequipment, 'json'),
            ...this.getlist(__PATH.fixedgoods, 'json'),
            ...this.getlist(__PATH.newgoods, 'json')
        ])
        //商品数据
        this.newlist(__PATH.all, 'commodities', [])
        this.newlist(__PATH.all, 'commodities', [
            ...this.getlist(__PATH.fixedgoods, '0.json'),
            ...this.getlist(__PATH.newgoods, '0.json')
        ])
        //怪物掉落表
        this.newlist(__PATH.all, 'dropsItem', [])
        this.newlist(__PATH.all, 'dropsItem', [
            ...this.getlist(__PATH.fixedequipment, 'json'),
            ...this.getlist(__PATH.fixedgoods, 'json'),
            ...this.getlist(__PATH.newgoods, '.json')
        ])
        //地图系统数据
        this.newlist(__PATH.position, 'position', [])
        this.newlist(__PATH.position, 'position', [
            ...this.getlist(__PATH.fixedposition, 'json')
        ])
        this.newlist(__PATH.position, 'point', [])
        this.newlist(__PATH.position, 'point', [
            ...this.getlist(__PATH.fixepoint, 'json')
        ])
        */
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
export default new boxdada()