import fs from 'fs'
import path from 'path'
import template from 'art-template'
import lodash from 'lodash'
/*启动Chromium */
import puppeteer from 'puppeteer'
/*事件监听*/
import chokidar from 'chokidar'
import { segment } from 'oicq'
class Puppeteer {
  constructor() {
    /*puppeteer实例保存*/
    this.browser = false
    /*进程控制*/
    this.lock = false
    /*  */
    this.shoting = []
    /** 截图数达到时重启浏览器 避免生成速度越来越慢 */
    this.restartNum = 60
    /** 截图次数 */
    this.renderNum = 0
    /*puppeteer配置*/
    this.config = {
      headless: true,
      args: [
        '--disable-gpu',
        '--disable-dev-shm-usage',
        '--disable-setuid-sandbox',
        '--no-first-run',
        '--no-sandbox',
        '--no-zygote',
        '--single-process'
      ]
    }
    /*保存html模板*/
    this.html = {}
    /*监听文件*/
    this.watcher = {}
  }
  /**
   * 启动Chromium
   */
  async browserInit() {
    /*已经初始化过了*/
    if (this.browser) return this.browser
    /*存在即失败*/
    if (this.lock) return false
    this.lock = true
    logger.mark('puppeteer Chromium 启动中...')
    this.browser = await puppeteer.launch(this.config).catch((err) => {
      logger.error(err.toString())
      if (String(err).includes('correct Chromium')) {
        logger.error('没有正确安装Chromium,可以尝试执行\n安装命令: node ./node_modules/puppeteer/install.js')
      }
    })
    this.lock = false
    if (!this.browser) {
      logger.error('puppeteer Chromium 启动失败')
      return false
    }
    logger.mark('puppeteer Chromium 启动成功')
    /** 监听Chromium实例是否断开 */
    this.browser.on('disconnected', (e) => {
      logger.error('Chromium实例关闭或崩溃!\n请及时#重启,后尝试恢复')
      this.browser = false
    })
    return this.browser
  }
  /**
   * `chromium` 截图
   * @param data 模板参数
   * @param data.tplFile 模板路径，必传
   * @param data.saveId  生成html名称，为空name代替
   * @param data.imgType  screenshot参数，生成图片类型:jpeg，png
   * @param data.quality  screenshot参数，图片质量 0-100，jpeg是可传，默认90
   * @param data.omitBackground  screenshot参数，隐藏默认的白色背景，背景透明。默认不透明
   * @param data.path   screenshot参数，截图保存路径。截图图片类型将从文件扩展名推断出来。如果是相对路径，则从当前路径解析。如果没有指定路径，图片将不会保存到硬盘。
   * @return oicq img
   */
  async screenshot(name, data = {}) {
    /*初始化*/
    if (!await this.browserInit()) {
      return false
    }
    /**/
    let savePath = this.dealTpl(name, data)
    if (!savePath) return false
    /**/
    let buff = ''
    let start = Date.now()
    /*推进元素：推进html的名字*/
    this.shoting.push(name)
    try {
      const page = await this.browser.newPage()
      /*图片抓取*/
      await page.goto(`file://${lodash.trim(savePath, '.')}`, data.pageGotoParams || {})
      /* 截图body */
      let body = await page.$('body')
      let randData = {
        // encoding: 'base64',
        type: data.imgType || 'jpeg',
        quality: data.quality || 90,
        path: data.path || ''
      }
      /* 是png删除 */
      if (data.imgType != 'png') {
        randData.omitBackground = data.omitBackground || true
      }
      /* 截图 */
      buff = await body.screenshot(randData)
      /*关闭工具*/
      page.close().catch((err) => logger.error(err))
    } catch (error) {
      logger.error(`图片生成失败:${name}:${error}`)
      /** 关闭浏览器 */
      if (this.browser) {
        await this.browser.close().catch((err) => logger.error(err))
      }
      this.browser = false
      buff = ''
      return false
    }
    /*丢出元素*/
    this.shoting.pop()
    if (!buff) {
      logger.error(`图片生成为空:${name}`)
      return false
    }
    /*生成次数累计*/
    this.renderNum++
    /** 计算图片大小 */
    let kb = (buff.length / 1024).toFixed(2) + 'kb'
    logger.mark(`[xiuxian][${name}][${this.renderNum}次] ${kb} ${logger.green(`${Date.now() - start}ms`)}`)
    /*重启？？？*/
    this.restart()
    /*构造image元素*/
    return segment.image(buff)
  }

  ctrateFile(name) {
    if (!fs.existsSync(`${path.resolve().replace(/\\/g, '/')}/xiuxiandata`)) {
      fs.mkdirSync(`${path.resolve().replace(/\\/g, '/')}/xiuxiandata`)
    }
    if (!fs.existsSync(`${path.resolve().replace(/\\/g, '/')}/xiuxiandata/html`)) {
      fs.mkdirSync(`${path.resolve().replace(/\\/g, '/')}/xiuxiandata/html`)
    }
    if (!fs.existsSync(`${path.resolve().replace(/\\/g, '/')}/xiuxiandata/html/${name}`)) {
      fs.mkdirSync(`${path.resolve().replace(/\\/g, '/')}/xiuxiandata/html/${name}`)
    }
  }

  /** 模板 */
  dealTpl(name, data) {
    let { tplFile, saveId = name } = data
    this.ctrateFile(name)
    /**这个地址应该要配置自己的,只有保存了临时本地文件了之后，浏览器才能去截图生成 */
    let savePath = `${path.resolve().replace(/\\/g, '/')}/xiuxiandata/html/${name}/${saveId}.html`
    /** 读取html模板 */
    if (!this.html[tplFile]) {
      try {
        this.html[tplFile] = fs.readFileSync(tplFile, 'utf8')
      } catch (error) {
        logger.error(`加载html错误:${tplFile}`)
        return false
      }
      /*存在,监控这个文件*/
      this.watch(tplFile)
    }
    /*将模板源代码编译成函数并立刻执行*/
    let tmpHtml = template.render(this.html[tplFile], data)
    fs.writeFileSync(savePath, tmpHtml)
    logger.debug(`[xiuxian][html模板] ${savePath}`)
    return savePath
  }

  /** 监听配置文件 */
  watch(tplFile) {
    if (this.watcher[tplFile]) return
    const watcher = chokidar.watch(tplFile)
    watcher.on('change', () => {
      delete this.html[tplFile]
      logger.mark(`[修改html模板] ${tplFile}`)
    })
    this.watcher[tplFile] = watcher
  }

  /** 重启 */
  restart() {
    /** 截图超过重启数时，自动关闭重启浏览器，避免生成速度越来越慢 */
    if (this.renderNum % this.restartNum == 0) {
      if (this.shoting.length <= 0) {
        setTimeout(async () => {
          if (this.browser) {
            await this.browser.close().catch((err) => logger.error(err))
          }
          this.browser = false
          logger.mark('puppeteer 关闭重启...')
        }, 100)
      }
    }
  }
}
export default new Puppeteer()