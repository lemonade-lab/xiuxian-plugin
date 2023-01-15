
import { createRequire } from 'module'
const require = createRequire(import.meta.url)
const { exec } = require('child_process')
class BoxExex {
    start = async (cmd, cwd, name) => {
        const msg = []
        try {
            exec(cmd, { cwd: cwd },
                async (error, stdout, stderr) => {
                    if (/(Already up[ -]to[ -]date|已经是最新的)/.test(stdout)) {
                        msg.push(`${name}已是最新版`)
                    }
                    if (error) {
                        msg.push(`${name}执行失败\nError code: ${error.code}\n${error.stack}\n`)
                        return
                    }
                    msg.push(`${name}执行成功,请[#重启]`)
                }
            )
        } catch {
            msg.push('执行失败')
        }
        return msg
    }
}
export default new BoxExex()