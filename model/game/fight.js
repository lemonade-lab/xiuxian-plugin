class Fight {
  constructor() {
    /** 文案模板 */
    this.Sneakattack = [
      '老六[A]想偷袭,[B]却一个转身就躲过去了', // 偷袭
      '[A]偷袭,却连[B]的防御都破不了', // 偷袭
      '[A]找准时机,突然暴起冲向[B],但是[B]及时反应,转眼被[B]打死!', // 回合
      '[A]突然一个左勾拳,谁料[B]揭化发', // 回合
      '[A]一拳挥出,如流云遁日般迅疾轻捷,风声呼啸,草飞沙走,看似灵巧散漫,其实就是![B]被[B]打得口吐鲜血,身影急退,掉落山崖而亡', // 回合
      '[A]拳之上凝结了庞大的气势,金色的光芒遮天蔽日,一条宛若黄金浇铸的真龙形成,浩浩荡荡地冲向怪物,但招式过于花里胡哨,[B]一个喷嚏就把[A]吹晕了', // 回合
      '[A]打的山崩地裂，河水倒卷，余波万里,可恶,是幻境,什么时候!突然[B]偷袭,被一口盐汽水喷死!' // 回合
    ]

    /** 消息模板 */
    this.battleMsg = {
      msg: [],
      UID: 1
    }

    this.Hurt = {
      hurtA: 0,
      hurtB: 0
    }
  }

  /* 暴击率 */
  probability(P) {
    if (P > 100) {
      return true
    }
    if (P > Math.random() * (100 - 1) + 1) {
      return true
    }
    return false
  }

  /**
   * 输入双方面板
   *
   * 返回双方面板
   * @param {*} A
   * @param {*} B
   * @returns
   */

  /* 战斗模型 */
  start({ battleA, UIDA, NAMEA }, { battleB, UIDB, NAMEB }) {
    // 战斗消息
    const msg = []
    // 战斗伤害记录
    const HurtA = {
      original: 0, // 原始伤害
      outbreak: 0 // 暴伤
    }
    const HurtB = {
      original: 0, // 原始伤害
      outbreak: 0 // 暴伤
    }

    // 胜利判断

    let victory = 0

    /**
     * 至少有50攻击力
     */
    const sizeA = battleA.attack - battleB.defense
    HurtA.original = sizeA > 50 ? sizeA : 50
    // 暴击结算
    HurtA.outbreak = Math.floor((HurtA.original * battleA.burstmax) / 100)

    // 敏捷判断 如果 A敏捷 < B敏捷 - 5
    if (battleA.speed < battleB.speed - 5) {
      // 对方敏捷扣除缺不比对方大
      msg.push(
        // 随机取 0 和 1 文案

        /**
         * A 是失败者
         * b 是胜利者
         */
        this.Sneakattack[Math.floor(Math.random() * 2)].replace('A', NAMEA).replace('B', NAMEB)
      )
    } else {
      if (this.probability(battleA.burst)) {
        battleB.nowblood -= HurtA.outbreak
        msg.push(`老六[${NAMEA}]偷袭成功,对[${NAMEB}]造成 ${HurtA.outbreak} 暴击伤害`)
      } else {
        // 普通结算
        battleB.nowblood -= HurtA.original
        msg.push(`老六[${NAMEA}]偷袭成功,对[${NAMEB}]造成 ${HurtA.original} 普通伤害`)
      }
      /**
       * 删除不破防
       */

      /**
       * b血量减少
       */
      if (battleB.nowblood < 1) {
        msg.push(`[${NAMEA}]仅出此招,就击败了${NAMEB}!`)
        battleB.nowblood = 0
        // 返回双方变更值
        return {
          battleA,
          battleB,
          victory: UIDA, // a胜利了
          msg
        }
      }
    }
    const sizeB = battleB.attack - battleA.defense
    // 原始伤害计算
    HurtB.original = sizeB > 50 ? sizeB : 50
    // 暴击伤害计算
    HurtB.outbreak = Math.floor((HurtB.original * battleB.burstmax) / 100)

    let round = 0

    // 战斗循环
    while (true) {
      round++

      /**
       * 正常回合,a未偷袭成功,b先开始
       */

      /**
       * 是否暴击
       */
      if (this.probability(battleB.burst)) {
        battleA.nowblood -= HurtB.outbreak
        msg.push(`第${round}回合,[${NAMEB}]对[${NAMEA}]造成 ${HurtB.outbreak} 暴击伤害`)
      } else {
        // 普通结算
        battleA.nowblood -= HurtB.original
        msg.push(`第${round}回合,[${NAMEB}]对[${NAMEA}]造成 ${HurtB.original} 普通伤害`)
      }

      /**  判断血量  */
      if (battleA.nowblood <= 0) {
        // A 没血了  b 赢了
        victory = UIDB

        msg.push(
          this.Sneakattack[Math.ceil(Math.random() * 5) + 1]
            .replace('A', NAMEA)
            .replace('A', NAMEA)
            .replace('B', NAMEB)
            .replace('B', NAMEB)
        )
        break
      }

      if (round >= 16) {
        /** 30个回合过去了 */
        msg.push(`[${NAMEA}]与${NAMEB}势均力敌~经过了${round}回合都奈何不了对方`)
        break
      }

      if (this.probability(battleB.burst)) {
        battleB.nowblood -= HurtB.outbreak
        msg.push(`第${round + 1}回合,[${NAMEA}]对[${NAMEB}]造成 ${HurtA.outbreak} 暴击伤害`)
      } else {
        // 普通结算
        battleB.nowblood -= HurtB.original
        msg.push(`第${round + 1}回合,[${NAMEA}]对[${NAMEB}]造成 ${HurtA.original} 普通伤害`)
      }

      if (battleB.nowblood <= 0) {
        // B 没血了  A 赢了
        victory = UIDA
        msg.push(
          this.Sneakattack[Math.ceil(Math.random() * 5) + 1]
            .replace('A', NAMEB)
            .replace('A', NAMEB)
            .replace('B', NAMEA)
            .replace('B', NAMEA)
        )
        break
      }
    }

    return {
      battleA,
      battleB,
      victory, // a胜利了
      msg
    }
  }
}
export default new Fight()
