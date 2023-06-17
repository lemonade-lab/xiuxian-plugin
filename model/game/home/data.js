import { __PATH } from '../data/index.js'
class userData {
  /**
   * @param {__PATH} __PATH
   * @param {地址选择} CHOICE
   * @param {数据} DATA
   * @returns 若无数据输入则为读取操作，并返回数据
   */
  userMsgAction = async ({ NAME, CHOICE, DATA }) => {
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
}
export default new userData()
