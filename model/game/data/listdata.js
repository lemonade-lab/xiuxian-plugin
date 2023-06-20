import { __PATH } from './index.js'
import algorithm from './algorithm.js'
class Listdata {
  /**
   * 若无data则是读取操作，返回data
   * @param { NAME, CHOICE, DATA }param0
   * @returns
   */
  controlAction({ NAME, CHOICE, DATA }) {
    if (DATA) {
      algorithm.dataAction({
        NAME,
        PATH: __PATH[CHOICE],
        DATA
      })
      return
    }
    return algorithm.dataAction({
      NAME,
      PATH: __PATH[CHOICE]
    })
  }

  /**
   * 当读取失败时则指定初始化
   * @param { NAME, CHOICE, DATA, INITIAL } param0
   * @returns
   */
  controlActionInitial({ NAME, CHOICE, DATA, INITIAL }) {
    if (DATA) {
      algorithm.dataAction({
        NAME,
        PATH: __PATH[CHOICE],
        DATA
      })
      return
    }
    // 读取的时候需要检查
    // 判断是否存在,不存在需要初始化
    if (!algorithm.existFile(__PATH[CHOICE], NAME)) {
      algorithm.dataAction({
        NAME,
        PATH: __PATH[CHOICE],
        DATA: INITIAL
      })
    } else {
      const Data = algorithm.dataActionNew({
        NAME,
        PATH: __PATH[CHOICE]
      })
      return Data
    }
  }

  /**
   * @param {属性选择} CHOICE
   * @param {表名} NAME
   * @returns 随机返回该表的子元素
   */
  randomListThing({ NAME, CHOICE }) {
    const LIST = algorithm.dataAction({
      NAME,
      PATH: __PATH[CHOICE]
    })
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
}
export default new Listdata()
