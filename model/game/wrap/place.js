class Place {
  constructor() {
    this.timeObj = {}

    this.CopywritingPlace = {
      0: '突然听到一声鸡叫,鸡..鸡..鸡...鸡你太美!险些走火入魔,丧失了size[name]',
      1: '突破时想到鸡哥了,险些走火入魔,丧失了size[name]',
      2: '突破时突然想起后花园种有药草,强行打断突破,嘴角流血,丧失了size[name]',
      3: '突破失败,丧失了size[name]',
      4: '突破失败,你刚刚气沉丹田就被一口老痰差点噎死,丧失了size[name]',
      5: '噗～你一口老血喷了出,突破失败,丧失了size[name]',
      6: '砰!你突破时身后的柜子动了一下,吓得你一时不敢突破并丧失了size[name]',
      7: '突破失败,你也不知道为啥,并且丧失了size[name]',
      8: '突破失败,可能是因为姿势不对吧,你尝试换了个姿势,发现丧失了size[name]',
      9: '突破失败,你差一点就成功了,你决定再试一次,可惜刚入定就被反噬,丧失了size[name]',
      10: '突破失败,因为今天是KFC疯狂星期四,决定不突破了去吃了KFC,回来直接变身喷射战士,并丧失了size[name]'
    }
  }

  get(key) {
    return this.timeObj[key]
  }

  set(key, val) {
    this.timeObj[key] = val
  }

  delete(key) {
    delete this.timeObj[key]
  }

  /**
   * 得到一个随机事件
   */

  getRandomKey() {
    const keyArray = Object.keys(this.CopywritingPlace)
    const randomKey = keyArray[Math.floor(Math.random() * keyArray.length)]
    return randomKey
  }

  getCopywriting(id, randomKey, size) {
    const name = this.NAMEMAP[id]
    const copywriting = this.CopywritingPlace[randomKey]
    const result = copywriting.replace('size[name]', `${size}[${name}]`)
    return result
  }
}
export default new Place()
