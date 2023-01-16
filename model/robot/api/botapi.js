import imgindex from '../img/index.js'
import Modifi from '../data/defset/modify.js'
import exec from '../exec/exex.js'
import cache from '../img/cache.js'
import help from '../img/help.js'
import user from '../user/action.js'
class botapi {
    /**
     * 得到图片
     * @param {} parameter 
     * @returns 
     */
    showPuppeteer = async (parameter) => {
        return await imgindex.showPuppeteer(parameter)
    }
    readConfig = () => {
        return Modifi.Readconfig()
    }
    openConfig = () => {
        return Modifi.openReadconfig()
    }
    readConfigHelp = () => {
        return Modifi.Readconfighelp()
    }
    openConfigHelp = () => {
        return Modifi.openReadconfighelp()
    }
    addMaster = (parameter) => {
        return Modifi.AddMaster(parameter)
    }
    deleteMaster = (parameter) => {
        return Modifi.DeleteMaster(parameter)
    }
    offGroup = () => {
        return Modifi.OffGroup()

    }
    onGroup = () => {
        return Modifi.OnGroup()
    }
    exec = (parameter) => {
        return exec.start(parameter)
    }
    cacheHelp = async (parameter) => {
        return await cache.helpcache(parameter)
    }
    getHelp = async (parameter) => {
        return await help.getboxhelp(parameter)
    }
    forwardMsg = async (parameter) => {
        return await user.forwardMsg(parameter)
    }
    at = async (parameter) => {
        return await user.at(parameter)
    }
}
export default new botapi()