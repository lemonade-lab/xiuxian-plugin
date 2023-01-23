
import userAction from '../user/action.js'
import process from 'child_process'
class Exec {
    execStart = async (parameter) => {
        const { cmd, cwd, name, e } = parameter
        process.exec(cmd, { cwd: cwd },
            async (error, stdout, stderr) => {
                const msg = []
                if (/(Already up[ -]to[ -]date|已经是最新的)/.test(stdout)) {
                    msg.push(`${name}|已是最新版`)
                    await userAction.forwardMsg({
                        e, data: msg
                    })
                    return
                }
                if (error) {
                    msg.push(`${name}执行失败\nError code: ${error.code}\n${error.stack}\n`)
                } else {
                    msg.push(`${name}执行成功,请[#重启]`)
                }
                await userAction.forwardMsg({ e, data: msg })
                return
            }
        )
        return
    }
}
export default new Exec()