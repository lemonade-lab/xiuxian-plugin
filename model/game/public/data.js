import { __PATH } from '../data/index.js'
import algorithm from '../data/algorithm.js'
/**表数据类,结合选择器进行快速获取指定路径的文件*/
class ListData {
  listAction = async ({ NAME, CHOICE, DATA }) => {
    if (DATA) {
      await algorithm.dataAction({
        NAME: NAME,
        PATH: __PATH[CHOICE],
        DATA: DATA
      })
      return
    }
    return await algorithm.dataAction({
      NAME: NAME,
      PATH: __PATH[CHOICE]
    })
  }

  /**
   * @param { NAME, CHOICE, DATA, INITIAL } param0
   * @returns
   */
  listActionInitial = async ({ NAME, CHOICE, DATA, INITIAL }) => {
    if (DATA) {
      await algorithm.dataAction({
        NAME,
        PATH: __PATH[CHOICE],
        DATA
      })
      return
    }
    /*读取的时候需要检查*/
    const Data = await algorithm.dataActionNew({
      NAME,
      PATH: __PATH[CHOICE]
    })
    if (!Data) {
      await algorithm.dataAction({
        NAME,
        PATH: __PATH[CHOICE],
        DATA: INITIAL
      })
      return INITIAL
    }
    return Data
  }
  listActionArr = async ({ NAME, CHOICE, DATA }) => {
    if (DATA) {
      await algorithm.dataAction({
        NAME: NAME,
        PATH: __PATH[CHOICE],
        DATA: DATA
      })
      return
    }
    //读取的时候需要检查
    const Data = await algorithm.dataActionNew({
      NAME: NAME,
      PATH: __PATH[CHOICE]
    })
    if (!Data) {
      await algorithm.dataAction({
        NAME: NAME,
        PATH: __PATH[CHOICE],
        DATA: []
      })
      return []
    }
    return Data
  }
  randomListThing = async ({ NAME, CHOICE }) => {
    const LIST = await algorithm.dataAction({
      NAME: NAME,
      PATH: __PATH[CHOICE]
    })
    return LIST[Math.floor(Math.random() * LIST.length)]
  }
  searchThing = async (parameter) => {
    let { CHOICE, NAME, condition, name } = parameter
    if (!CHOICE) {
      //默认检索all表
      ;(CHOICE = 'home_all'), (NAME = 'all')
    }
    const all = await this.listAction({ CHOICE: CHOICE, NAME: NAME })
    const ifexist = all.find((item) => item[condition] == name)
    return ifexist
  }
}
export default new ListData()
