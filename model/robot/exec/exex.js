import userAction from "../user/action.js";
import { exec } from "child_process";
import { appname, __dirname, isPath } from "../../main.js";
class Exec {
  execStart = async ({ cmd, e }) => {
    exec(cmd, { cwd: __dirname }, async (error, stdout) => {
      const msg = [];
      if (/(Already up[ -]to[ -]date|已经是最新的)/.test(stdout)) {
        msg.push(`${appname}|已是最新版`);
        await userAction.forwardMsg({ e, data: msg });
        return;
      }
      if (error) {
        msg.push(
          `${appname}|执行失败\nError code: ${error.code}\n${error.stack}\n`
        );
      } else {
        msg.push(`${appname}|执行成功,请[#重启]`);
      }
      await userAction.forwardMsg({ e, data: msg });
      return;
    });
    return;
  };
  onExec = async ({ cmd, e, push }) => {
    exec(cmd, { cwd: `${isPath}` }, async (error, stdout) => {
      const msg = [];
      if (/(Already up[ -]to[ -]date|已经是最新的)/.test(stdout)) {
        msg.push(`${appname}|${push["updata"]}`);
        await userAction.forwardMsg({ e, data: msg });
        return;
      }
      if (error) {
        msg.push(
          `${appname}|${push["err"]}\nError code: ${error.code}\n${error.stack}\n`
        );
      } else {
        msg.push(`${appname}|${push["success"]},请[#重启]`);
      }
      await userAction.forwardMsg({ e, data: msg });
      return;
    });
    return;
  };
}
export default new Exec();
