import Data from '../data/index.js'
import Method from '../wrap/method.js'
class GP {
  constructor() {
    this.extendData = {
      times: [],
      perpetual: {
        attack: 0,
        defense: 0,
        blood: 0,
        burst: 0,
        burstmax: 0,
        speed: 0,
        efficiency: 0
      }
    }
  }

  /**
   * @param {*} position
   * @param {*} type
   * @returns
   */
  getTypeThing(position, type) {
    const dropsItemList = Data.controlAction({
      NAME: 'goods',
      CHOICE: 'generate_all'
    })
    const sum = []
    dropsItemList.forEach((item) => {
      const id = item.id.split('-')
      if (id[position] == type) {
        sum.push(item)
      }
    })
    return sum
  }

  /**
   *
   * @param {*} position
   * @param {*} type
   * @returns
   */
  randomTypeThing(position, type) {
    const dropsItemList = Data.controlAction({
      NAME: 'goods',
      CHOICE: 'generate_all'
    })
    const sum = []
    for (let item of dropsItemList) {
      const id = item.id.split('-')
      if (id[position] == type) {
        sum.push(item)
      }
    }
    return sum[Math.floor(Math.random() * sum.length)]
  }

  /**
   * 得到随机物
   * @returns
   */
  randomThing() {
    const dropsItemList = Data.controlAction({
      NAME: 'dropsItem',
      CHOICE: 'generate_all'
    })
    return dropsItemList[Math.floor(Math.random() * dropsItemList.length)]
  }

  /**
   * @param { NAME, FLAG, TYPE, VALUE, ENDTIME } param0
   * @returns
   */
  addExtendTimes({ NAME, FLAG, TYPE, VALUE, ENDTIME }) {
    const extend = Data.controlActionInitial({
      NAME,
      CHOICE: 'playerExtend',
      INITIAL: {}
    })
    if (!extend[FLAG]) {
      extend[FLAG] = this.extendData
    }
    const find = extend[FLAG].times.findIndex((item) => item.type == TYPE)
    const time = new Date().getTime()
    if (
      find != -1 &&
      extend[FLAG].times[find].timeLimit > time &&
      extend[FLAG].times[find].value >= VALUE
    ) {
      Data.controlAction({ NAME, CHOICE: 'playerExtend', DATA: extend })
      this.updatePanel(NAME)
    } else if (
      find != -1 &&
      (extend[FLAG].times[find].timeLimit <= time || extend[FLAG].times[find].value < VALUE)
    ) {
      extend[FLAG].times[find].value = VALUE
      extend[FLAG].times[find].timeLimit = ENDTIME
      Data.controlAction({ NAME, CHOICE: 'playerExtend', DATA: extend })
      this.updatePanel(NAME)
    } else {
      extend[FLAG].times.push({
        type: TYPE,
        value: VALUE,
        timeLimit: ENDTIME
      })
      Data.controlAction({ NAME, CHOICE: 'playerExtend', DATA: extend })
      this.updatePanel(NAME)
    }
  }

  /**
   *
   * @param {*} param0
   * @returns
   */
  synthesisResult({ ans, type }) {
    // 这里可以写成返回对象，物品+msg，来给炼制增加不同的过程反馈
    let drawingList = Data.controlAction({
      NAME: 'AllDrawing',
      CHOICE: 'fixed_material'
    })
    drawingList = drawingList.filter(
      (item) =>
        item.type == type &&
        item.gold <= ans.gold &&
        item.wood <= ans.wood &&
        item.water <= ans.water &&
        item.fire <= ans.fire &&
        item.earth <= ans.earth
    )
    if (drawingList.length == 0) {
      // 没有对应图纸
      const res = { name: '无用的残渣' }
      return res
    } else if (drawingList.length > 3) {
      // 可能的结果过多，取三个最好的
      drawingList.sort(Method.sortRule)
      const slice = drawingList.slice(0, 3)
      // 随机取一个
      return Method.randomArr(slice)
    } else {
      // 直接随机取
      return Method.randomArr(drawingList)
    }
  }
}

export default new GP()
