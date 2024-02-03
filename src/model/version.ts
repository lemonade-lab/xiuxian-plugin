import base from './base.js'

export default class Version extends base {
  constructor() {
    super()
    this.model = 'version'
  }
  /**
   * 生成版本信息图片
   * @param versionData
   * @returns
   */
  getData(versionData) {
    const version = versionData.version
    return {
      ...this.screenData,
      userId: version,
      quality: 100,
      saveId: version,
      versionData: versionData
    }
  }
}
