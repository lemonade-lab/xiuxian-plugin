
import { createRequire } from 'module'
import { ForwardMsg } from '../../public.js'
const require = createRequire(import.meta.url)
const { exec } = require('child_process')
/**
 * 
 */
class Exec {
    start = async (cmd, cwd, name, e) => {
        exec(cmd, { cwd: cwd },
            async (error, stdout, stderr) => {
                const msg = []
                if (/(Already up[ -]to[ -]date|已经是最新的)/.test(stdout)) {
                    msg.push(`${name}|已是最新版`)
                    await ForwardMsg(e, msg)
                    return
                }
                if (error) {
                    msg.push(`${name}执行失败\nError code: ${error.code}\n${error.stack}\n`)
                } else {
                    msg.push(`${name}执行成功,请[#重启]`)
                }
                await ForwardMsg(e, msg)
                return
            }
        )
        return
    }
}
module.exports = new Exec()