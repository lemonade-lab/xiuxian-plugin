import userAction from './action.js'
import { exec } from 'child_process'
import { AppName, MyDirPath } from '../../app.config.js'
class Exec {
  execStart = async ({ cmd, e }) => {
    exec(cmd, { cwd: MyDirPath }, async (error, stdout) => {
      const msg = []
      if (/(Already up[ -]to[ -]date|已经是最新的)/.test(stdout)) {
        msg.push(`${AppName}|已是最新版`)
        await userAction.forwardMsg({ e, data: msg })
        return
      }
      if (error) {
        msg.push(`${AppName}|执行失败\nError code: ${error.code}\n${error.stack}\n`)
      } else {
        msg.push(`${AppName}|执行成功,请[#重启]`)
      }
      await userAction.forwardMsg({ e, data: msg })
      return
    })
    return
  }
  onExec = async ({ cmd, e, push }) => {
    exec(cmd, { cwd: `${process.cwd()}` }, async (error, stdout) => {
      const msg = []
      if (/(Already up[ -]to[ -]date|已经是最新的)/.test(stdout)) {
        msg.push(`${AppName}|${push['updata']}`)
        await userAction.forwardMsg({ e, data: msg })
        return
      }
      if (error) {
        msg.push(`${AppName}|${push['err']}\nError code: ${error.code}\n${error.stack}\n`)
      } else {
        msg.push(`${AppName}|${push['success']},请[(#|/)重启]`)
      }
      await userAction.forwardMsg({ e, data: msg })
      return
    })
    return
  }
}
export default new Exec()
