import userAction from './action.js'
import { exec } from 'child_process'
import { AppName, MyDirPath } from '../../app.config.js'
class Exec {
  execStart = ({ cmd, e }) => {
    exec(cmd, { cwd: MyDirPath }, (error, stdout) => {
      const msg = []
      if (/(Already up[ -]to[ -]date|已经是最新的)/.test(stdout)) {
        msg.push(`${AppName}|已是最新版`)
        userAction.forwardMsg({ e, data: msg })
        return
      }
      if (error) {
        msg.push(`${AppName}|执行失败\nError code: ${error.code}\n${error.stack}\n`)
      } else {
        msg.push(`${AppName}|执行成功,请[#重启]`)
      }
      userAction.forwardMsg({ e, data: msg })
      return
    })
    return
  }
  onExec = ({ cmd, e, push }) => {
    exec(cmd, { cwd: `${process.cwd()}` }, (error, stdout) => {
      const msg = []
      if (/(Already up[ -]to[ -]date|已经是最新的)/.test(stdout)) {
        msg.push(`${AppName}|${push['updata']}`)
        userAction.forwardMsg({ e, data: msg })
        return
      }
      if (error) {
        msg.push(`${AppName}|${push['err']}\nError code: ${error.code}\n${error.stack}\n`)
      } else {
        msg.push(`${AppName}|${push['success']},请[(#|/)重启]`)
      }
      userAction.forwardMsg({ e, data: msg })
      return
    })
    return
  }
}
export default new Exec()
