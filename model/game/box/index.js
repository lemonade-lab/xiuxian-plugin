import Data from '../data/index.js'
class GP {
  /**
   * 得到随机物
   * @returns
   */
  getRandomThing() {
    const dropsItemList = Data.controlAction({
      NAME: 'dropsItem',
      CHOICE: 'generate_all'
    })
    return dropsItemList[Math.floor(Math.random() * dropsItemList.length)]
  }
}
export default new GP()
