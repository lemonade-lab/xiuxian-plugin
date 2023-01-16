class UserData {
    /**
     * 
     * @param {数组} ARR 
     * @returns 随机一个元素
     */
    Anyarray = (ARR) => {
        const randindex = Math.trunc(Math.random() * ARR.length)
        return ARR[randindex]
    }

    /**
     * 
     * @param {表名} NAME 
     * @param {地址选择} CHOICE 
     * @param {数据} DATA 
     * @returns 若无data则是读取操作，返回data
     */
    listAction = async (parameter) => {
        const { NAME, CHOICE, DATA } = parameter
        if (DATA) {
            await boxfs.dataAction({
                NAME: NAME,
                PATH: __PATH[CHOICE],
                DATA: DATA
            })
            return
        }
        return await boxfs.dataAction({
            NAME: NAME,
            PATH: __PATH[CHOICE]
        })
    }
    /**
     * 
     * @param {表名} NAME 
     * @param {地址选择} CHOICE 
     * @param {数据} DATA 
     * @returns 若无data则是读取操作(若读取失败则初始化为[])
     */
    listActionArr = async (parameter) => {
        const { NAME, CHOICE, DATA } = parameter
        if (DATA) {
            await boxfs.dataAction({
                NAME: NAME,
                PATH: __PATH[CHOICE],
                DATA: DATA
            })
            return
        }
        //读取的时候需要检查
        const Data = await boxfs.dataActionNew({
            NAME: NAME,
            PATH: __PATH[CHOICE]
        })
        if (!Data) {
            await boxfs.dataAction({
                NAME: NAME,
                PATH: __PATH[CHOICE],
                DATA: []
            })
            return []
        }
        return Data
    }

    /**
     * @param {属性选择} CHOICE 
     * @param {表名} NAME 
     * @returns 随机返回该表的子元素
     */
    randomListThing = async (parameter) => {
        const { NAME, CHOICE } = parameter
        const LIST = await boxfs.dataAction({
            NAME: NAME,
            PATH: __PATH[CHOICE]
        })
        return LIST[Math.floor(Math.random() * LIST.length)]
    }

}
module.exports = new UserData()