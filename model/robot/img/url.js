import puppeteer from "../puppeteer/puppeteer.js";
class ShowURl {
  showUrl = async ({ url }) => {
    const browser = await puppeteer.browserInit();
    const page = await browser.newPage();
    await page.setViewport({
      width: 1280,
      height: 1100,
    });
    await page.goto(url);
    let buff = null;
    buff = await page.screenshot({
      clip: {
        x: 400,
        y: 80,
        width: 480,
        height: 1300,
      },
    });
    page.close().catch((err) => logger.error(err));
    return buff;
  };
}
export default new ShowURl();
