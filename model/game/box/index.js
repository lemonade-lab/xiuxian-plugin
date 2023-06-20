import Listdata from '../data/listdata.js'
class GP {
  /**
   * 表名，地址，属性，大小
   * @param {UID, CHOICE, ATTRIBUTE, SIZE} param0
   * @returns
   */
  updataUser({ UID, CHOICE, ATTRIBUTE, SIZE }) {
    // 读取原数据
    const data = Listdata.controlAction({ NAME: UID, CHOICE })
    data[ATTRIBUTE] += Math.trunc(SIZE)
    Listdata.controlAction({ NAME: UID, CHOICE, DATA: data })
  }

  getTypeThing(position, type) {
    const dropsItemList = Listdata.controlAction({
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

  randomTypeThing(position, type) {
    const dropsItemList = Listdata.controlAction({
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
    const dropsItemList = Listdata.controlAction({
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
    const extend = Listdata.controlActionInitial({
      NAME,
      CHOICE: 'playerExtend',
      INITIAL: {}
    })
    if (!extend[FLAG]) {
      extend[FLAG] = {
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
    const find = extend[FLAG].times.findIndex((item) => item.type == TYPE)
    const time = new Date().getTime()
    if (
      find != -1 &&
      extend[FLAG].times[find].timeLimit > time &&
      extend[FLAG].times[find].value >= VALUE
    ) {
      Listdata.controlAction({ NAME, CHOICE: 'playerExtend', DATA: extend })
      this.updatePanel(NAME)
    } else if (
      find != -1 &&
      (extend[FLAG].times[find].timeLimit <= time || extend[FLAG].times[find].value < VALUE)
    ) {
      extend[FLAG].times[find].value = VALUE
      extend[FLAG].times[find].timeLimit = ENDTIME
      Listdata.controlAction({ NAME, CHOICE: 'playerExtend', DATA: extend })
      this.updatePanel(NAME)
    } else {
      extend[FLAG].times.push({
        type: TYPE,
        value: VALUE,
        timeLimit: ENDTIME
      })
      Listdata.controlAction({ NAME, CHOICE: 'playerExtend', DATA: extend })
      this.updatePanel(NAME)
    }
  }

  synthesisResult({ ans, type }) {
    // 这里可以写成返回对象，物品+msg，来给炼制增加不同的过程反馈
    let drawingList = Listdata.controlAction({
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
      drawingList.sort(sortRule)
      const slice = drawingList.slice(0, 3)
      // 随机取一个
      return randomArr(slice)
    } else {
      // 直接随机取
      return randomArr(drawingList)
    }
  }

  /**
   * 根据id搜索数组
   * @param {*} id
   * @returns
   */
  searchThingById(id) {
    const goods = Listdata.controlAction({ NAME: 'goods', CHOICE: 'generate_all' })
    return goods.find((item) => item.id == id)
  }
}

export default new GP()

function sortRule(a, b) {
  return a.rank - b.rank // 如果a>=b，返回自然数，不用交换位置
}

function randomArr(array) {
  const location = Math.floor(Math.random() * array.length)
  return array[location]
}
