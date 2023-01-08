const appname = 'Xiuxian-Plugin-Box'
const dirname = `plugins/${appname}/resources`
class Show {
  constructor() {
    this.userId = ''  //文件标记
    this.name = ''    //地址标记
    this._path = process.cwd().replace(/\\/g, '/')  //插件位置 
  }
  /**
   * @param {地址} path 
   * @param {文件名} name 
   * @param {数据} myData 
   * @param {UID} UID
   * @returns 
   */
  get_Data = async (path, name, myData, UID) => {
    this.userId = UID  //文件名
    this.path = path//地址
    this.name = name//文件名
    return {
      //html保存id
      saveId: this.userId,
      //模板html路径                    //
      tplFile: `./${dirname}/html/${this.path}/${this.name}.html`,
      /** 绝对路径 */
      //插件资源路径
      pluResPath: `${this._path}/${dirname}/`,
      ...myData,//数据
    }
  }
}
export default new Show()