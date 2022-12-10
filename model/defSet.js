import fs from 'node:fs';
import path from 'path';
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
try {
  const YAML = require('yamljs');
} catch { }
try {
  const yaml = require('js-yaml');
} catch { }
class defSet {
  constructor() {
    const __dirname = `${path.resolve()}${path.sep}config${path.sep}config`;
  };
  //关闭云崽功能
  ReadConfig = () => {
    const __dirname = `${path.resolve()}${path.sep}config${path.sep}config/group.yaml`;
    try {
      const data = YAML.load(__dirname);
      const sum = ['十连', '角色查询', '体力查询', '用户绑定', '抽卡记录', '添加表情', '欢迎新人', '退群通知', '云崽帮助', '角色素材', '今日素材', '养成计算', '米游社公告']
      data.default.disable.push(...sum);
    }
    catch {
      return '缺少yamljs,请先执行\npnpm i yamljs -w'
    }
    try {
      const yamlStr = yaml.dump(data);
      fs.writeFileSync(__dirname, yamlStr, 'utf8');
    }
    catch {
      return '缺少yamljs,请先执行\npnpm i  js-yaml -w'
    }
    return '关闭成功';
  };
  //关闭云崽帮助
  ReadConfighelp = () => {
    const __dirname = `${path.resolve()}${path.sep}config${path.sep}config/group.yaml`;
    try {
      const data = YAML.load(__dirname);
      const sum = ['云崽帮助']
      data.default.disable.push(...sum);
    } catch {
      return '缺少yamljs,请先执行\npnpm i yamljs -w'
    }
    try {
      const yamlStr = yaml.dump(data);
      fs.writeFileSync(__dirname, yamlStr, 'utf8');
    } catch {
      return '缺少yamljs,请先执行\npnpm i  js-yaml -w'
    }
    return '设置成功';
  };
  //添加主人QQ
  AddMaster = (mastername) => {
    const __dirname = `${path.resolve()}${path.sep}config${path.sep}config/other.yaml`;
    const QQ = Number(mastername);
    try {
      const data = YAML.load(__dirname);
      const sum = [QQ];
      data.masterQQ.push(...sum);
    } catch {
      return '缺少yamljs,请先执行\npnpm i yamljs -w'
    }
    try {
      const yamlStr = yaml.dump(data);
      fs.writeFileSync(__dirname, yamlStr, 'utf8');
    } catch {
      return '缺少yamljs,请先执行\npnpm i  js-yaml -w'
    }
    return '添加成功';
  };
  //删除主人QQ
  DeleteMaster = (mastername) => {
    const __dirname = `${path.resolve()}${path.sep}config${path.sep}config/other.yaml`;
    const QQ = Number(mastername);
    try {
      const data = YAML.load(__dirname);
      const sum = [];
      data.masterQQ.forEach((item) => {
        if (item != QQ) {
          sum.push(item);
        };
      });
      data.masterQQ = sum;
    } catch {
      return '缺少yamljs,请先执行\npnpm i yamljs -w'
    }
    try {
      const yamlStr = yaml.dump(data);
      fs.writeFileSync(__dirname, yamlStr, 'utf8');
    } catch {
      return '缺少yamljs,请先执行\npnpm i  js-yaml -w'
    }
    return '删除成功';
  };
  //关闭云崽私聊
  OffGroup = () => {
    const __dirname = `${path.resolve()}${path.sep}config${path.sep}config/other.yaml`;
    try {
      const data = YAML.load(__dirname);
      data.disablePrivate = true;
    } catch {
      return '缺少yamljs,请先执行\npnpm i yamljs -w'
    }
    try {
      const yamlStr = yaml.dump(data);
      fs.writeFileSync(__dirname, yamlStr, 'utf8');
    } catch {
      return '缺少yamljs,请先执行\npnpm i  js-yaml -w'
    }
    return '关闭成功';
  };
  //开启云崽私聊
  OnGroup = () => {
    const __dirname = `${path.resolve()}${path.sep}config${path.sep}config/other.yaml`;
    try {
      const data = YAML.load(__dirname);
      data.disablePrivate = false;
    } catch {
      return '缺少yamljs,请先执行\npnpm i yamljs -w'
    }
    try {
      const yamlStr = yaml.dump(data);
      fs.writeFileSync(__dirname, yamlStr, 'utf8');
    } catch {
      return '缺少yamljs,请先执行\npnpm i  js-yaml -w'
    }
    return '开启成功';
  };
};
export default new defSet();