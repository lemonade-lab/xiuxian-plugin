import { __PATH } from './path.js'
import algorithm from './algorithm.js'
class Data {
  /**
   * 写入数据
   * @param {*} NAME
   * @param {*} CHOICE
   * @param {*} DATA
   */
  write(NAME, CHOICE, DATA) {
    algorithm.postData(NAME, __PATH[CHOICE], DATA)
  }

  /**
   * 读取数据
   * @param {*} NAME
   * @param {*} CHOICE
   * @returns
   */
  read(NAME, CHOICE) {
    return algorithm.getData(NAME, __PATH[CHOICE])
  }

  /**
   * 初始化读取
   * @param {*} NAME
   * @param {*} CHOICE
   * @param {*} INITIAL
   * @returns
   */
  readInitial(NAME, CHOICE, INITIAL) {
    if (!algorithm.existFile(__PATH[CHOICE], NAME)) {
      algorithm.postData(NAME, __PATH[CHOICE], INITIAL)
      return INITIAL
    } else {
      const Data = algorithm.getData(NAME, __PATH[CHOICE])
      return Data
    }
  }

  /**
   * tudo
   * 若无data则是读取操作，返回data
   * @param { NAME, CHOICE, DATA }param0
   * @returns
   */
  controlAction({ NAME, CHOICE, DATA }) {
    if (DATA) {
      algorithm.postData(NAME, __PATH[CHOICE], DATA)
      return
    }
    return algorithm.getData(NAME, __PATH[CHOICE])
  }

  /**
   * tudo
   * 当读取失败时则指定初始化
   * @param { NAME, CHOICE, DATA, INITIAL } param0
   * @returns
   */
  controlActionInitial({ NAME, CHOICE, DATA, INITIAL }) {
    if (DATA) {
      algorithm.postData(NAME, __PATH[CHOICE], DATA)
      return
    }
    if (!algorithm.existFile(__PATH[CHOICE], NAME)) {
      algorithm.postData(NAME, __PATH[CHOICE], INITIAL)
      return INITIAL
    } else {
      const Data = algorithm.getData(NAME, __PATH[CHOICE])
      return Data
    }
  }

  /**
   * @param {属性选择} CHOICE
   * @param {表名} NAME
   * @returns 随机返回该表的子元素
   */
  randomListThing(NAME, CHOICE) {
    const LIST = algorithm.getData(NAME, __PATH[CHOICE])
    return LIST[Math.floor(Math.random() * LIST.length)]
  }

  /**
   * 根据条件搜索
   * @param {属性选择} CHOICE
   * @param {表名} NAME
   * @param {对象属性} condition
   * @param {条件属性} name
   * @returns 返回信息
   */
  searchThing({ CHOICE, NAME, condition, name }) {
    const all = this.controlAction({ CHOICE, NAME })
    const ifexist = all.find((item) => item[condition] == name)
    return ifexist
  }

  /**
   * 搜索指定物品信息
   * @param {*} condition
   * @param {*} name
   * @returns
   */
  searchAllThing(condition, name) {
    const all = this.controlAction({ CHOICE: 'generate_all', NAME: 'goods' })
    const ifexist = all.find((item) => {
      return item[condition] == name
    })
    return ifexist
  }

  /**
   * 根据id搜索数组
   * @param {*} id
   * @returns
   */
  searchThingById(id) {
    const goods = this.controlAction({ NAME: 'goods', CHOICE: 'generate_all' })
    return goods.find((item) => item.id == id)
  }
}
export default new Data()
