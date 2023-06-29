import puppeteer from './puppeteer.js'
export function createUrlImg(url) {
  const browser = puppeteer.browserInit()
  const page = browser.newPage()
  page.setViewport({
    width: 1280,
    height: 1100
  })
  page.goto(url)
  const buff = page.screenshot({
    clip: {
      x: 400,
      y: 80,
      width: 480,
      height: 1300
    }
  })
  page.close().catch((err) => console.error(err))
  return buff
}
