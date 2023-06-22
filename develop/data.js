import { resolve } from 'node:path'
import { dealTpl } from './puppeteer/puppeteer.js'
// import { getConfig } from './defset/defset.js'
/* 数据调试 */

/* 选择调试文件并重启 */
const tplFile = `${resolve().replace(/\\/g, '/')}/resources/html/user/information/information.html`

/* 需要填充的数据 */
// const data = getConfig({ name: 'help' })

const UID = 1715713638
const data = {
  UID,
  life: {},
  GP: {},
  level: {
    levelname: '4', // 练气名
    experience: '3', // 练气经验
    levelnamemax: '2', // 练体名
    experiencemax: '1' // 练体经验
  },
  linggenName: '4',
  battle: {},
  equipment: {},
  talent: 'TalentData',
  talentsize: 456,
  user_avatar: `https://q1.qlogo.cn/g?b=qq&s=0&nk=${UID}`
}

/**
 * 不用配置,默认当前配置
 */

/* 调试结束 */
export function getData() {
  return dealTpl({
    /** heml路径 */
    tplFile,
    /** css路径 */
    pluResPath: ``,
    /** 版本 */
    version: 'V2.0',
    /** 数据 */
    ...data
    // data,
  })
}
