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
const __dirname = `${path.resolve()}${path.sep}config${path.sep}config/other.yaml`;
const returnyamljs = '缺少yamljs,请先执行\npnpm i yamljs -w';
const returnjsyaml = '缺少yamljs,请先执行\npnpm i  js-yaml -w';
class defSet {
  constructor() { };
  ReadConfig = () => {
    try {
      const data = YAML.load(__dirname);
      const sum = ['十连', '角色查询', '体力查询', '用户绑定', '抽卡记录', '添加表情', '欢迎新人', '退群通知', '云崽帮助', '角色素材', '今日素材', '养成计算', '米游社公告']
      data.default.disable.push(...sum);
    }
    catch {
      return returnyamljs;
    };
    try {
      const yamlStr = yaml.dump(data);
      fs.writeFileSync(__dirname, yamlStr, 'utf8');
    }
    catch {
      return returnjsyaml;
    };
    return '关闭成功';
  };
  ReadConfighelp = () => {
    try {
      const data = YAML.load(__dirname);
      const sum = ['云崽帮助']
      data.default.disable.push(...sum);
    } catch {
      return returnyamljs;
    };
    try {
      const yamlStr = yaml.dump(data);
      fs.writeFileSync(__dirname, yamlStr, 'utf8');
    } catch {
      return returnjsyaml;
    };
    return '设置成功';
  };
  AddMaster = (mastername) => {
    const QQ = Number(mastername);
    try {
      const data = YAML.load(__dirname);
      const sum = [QQ];
      data.masterQQ.push(...sum);
    } catch {
      return returnyamljs;
    };
    try {
      const yamlStr = yaml.dump(data);
      fs.writeFileSync(__dirname, yamlStr, 'utf8');
    } catch {
      return returnjsyaml;
    };
    return '添加成功';
  };
  DeleteMaster = (mastername) => {
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
      return returnyamljs;
    };
    try {
      const yamlStr = yaml.dump(data);
      fs.writeFileSync(__dirname, yamlStr, 'utf8');
    } catch {
      return returnjsyaml;
    };
    return '删除成功';
  };
  OffGroup = () => {
    try {
      const data = YAML.load(__dirname);
      data.disablePrivate = true;
    } catch {
      return returnyamljs;
    };
    try {
      const yamlStr = yaml.dump(data);
      fs.writeFileSync(__dirname, yamlStr, 'utf8');
    } catch {
      return returnjsyaml;
    };
    return '关闭成功';
  };
  OnGroup = () => {
    try {
      const data = YAML.load(__dirname);
      data.disablePrivate = false;
    } catch {
      return returnyamljs;
    };
    try {
      const yamlStr = yaml.dump(data);
      fs.writeFileSync(__dirname, yamlStr, 'utf8');
    } catch {
      return returnjsyaml;
    };
    return '开启成功';
  };
};
export default new defSet();