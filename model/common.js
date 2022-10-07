import fs from "fs";
import template from "art-template";
import path from "path"
import puppeteer from "puppeteer";

/**
 * 公共方法模块，目前包含功能如下:
 * 模板相关：通过html模板生成html(generateHtml)，通过html文件生成图片(generateImgByHtml)，获取模板所在的文件根路径(getTemplatePath)
 * 数据校验相关：判断数据是否为空isNotNull、isNotBlank
 */
class common{

    constructor() {
        //浏览器配置
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
    }

    /**
     * 通过模板生成html文件
     * @param file_name 文件路径  (示例:D:/template.html)
     * @param save_name 模板生成的html文件存储路径(使用文件全路径，如：D:/aaa.html)
     * @param data  文件渲染数据(json格式)
     * @returns {Promise<void>}
     */
     async generateHtml(file_path,save_path,data){
        //读取文件
        fs.readFile(file_path,(error,template_data)=>{
            if(!error){//文件读取成功
                template_data=template_data.toString();//模板数据
                let html=template.render(template_data,data);//生成html文件
                //存储为html文件
                fs.writeFile(save_path,html,function (error,res){
                    if(error){//文件存储失败
                       logger.error(error);
                    }else {
                        logger.info("generate html file success!");
                    }
                })
            }else {
                logger.error("文件读取错误,file_path="+file_path+"；原因:"+error);
            }
        });
    }

    /**
     * 获取模板文件所在路径(机器人目录/plugins/xiuxian-emulator-plugin/resources/template/)
     * @returns 示例: 机器人目录/plugins/xiuxian-emulator-plugin/resources/template/
     */
    async getTemplatePath(){
        //路径分隔符都使用 /
        let file_path=path.resolve().replace(/\\/g, "/")+"/plugins/xiuxian-emulator-plugin/resources/template/";
        return file_path;
    }

    /**
     * 通过html文件生成图片
     * @param file_path 文件路径
     * @param save_path 图片保存路径
     * @param param 参数
     * @returns {Promise<void>}
     */
    async generateImgByHtml(file_path,save_path,param){
        //浏览器初始化
        let browser=await puppeteer.launch(this.config).catch((err) => {
            logger.error(err.toString())
            if (String(err).includes('correct Chromium')) {
                logger.error('没有正确安装Chromium，可以尝试执行安装命令：node ./node_modules/puppeteer/install.js')
            }
        })
        let page=await browser.newPage();//获取一个新页面
        await page.goto("file://"+file_path);//打开页面
        let body = await page.$('#container') || await page.$('body');//获取body
        //生成图片的参数
        if(!this.isNotBlank(param)){
            param={};
        }
        let randData = {
            type: this.isNotBlank(param.type)?param.type:'jpeg',//可以是jpeg或者png，默认是png
            omitBackground: this.isNotBlank(param.omitBackground)?param.omitBackground:false,//隐藏默认的白色背景并允许以透明度捕捉屏幕截图。默认为 false.
            quality: this.isNotBlank(param.quality)?param.quality:100,//图片质量1-100
            fullPage:this.isNotBlank(param.fullPage )?param.fullPage:false,//截取完整的可滚动页面. 默认为 false
            path: save_path || ''       //保存路径
        }
        if(this.isNotBlank(param.clip)){
            randData.clip=param.clip;//指定页面剪切区域的对象,必须含有x,y,width,height这4个参数
        }
        if (randData.type == 'png') delete randData.quality
        let img = await body.screenshot(randData);//生成图片
        logger.info("generate img");
        await page.close().catch((err) => logger.error(err));//关闭页面
        await browser.close().catch((err) => logger.error(err));//关闭浏览器
        return img;
    }

    //判断是否为null或者undefind
    isNotNull(obj) {
        if (obj == undefined || obj == null)
            return false;
        return true;
    }
    //判断对象是否为""、null或者undefind
    isNotBlank(value) {
        if (value ?? '' !== '') {
            return true;
        } else {
            return false;
        }
    }

}

export default new common();

