import imgindex from '../img/index.js'
import Modifi from '../data/defset/modify.js'
import exec from '../exec/exex.js'
import cache from '../img/cache.js'
import help from '../img/help.js'
class botapi {
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
    cacheHelp = (parameter) => {
        return cache.helpcache(parameter)
    }
    getHelp = (parameter) => {
        return help.getboxhelp(parameter)
    }

}
export default new botapi()