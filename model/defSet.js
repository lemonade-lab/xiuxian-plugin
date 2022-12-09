import fs from 'node:fs';
import { createRequire } from 'module';
import path from 'path';
const require = createRequire(import.meta.url);
const YAML = require('yamljs');
const yaml = require('js-yaml');
class defSet {
  constructor() {
    const __dirname = `${path.resolve()}${path.sep}config${path.sep}config`;
  };
  ReadConfig = (filename) => {
    const __dirname = `${path.resolve()}${path.sep}config${path.sep}config/${filename}.yaml`;
    const data = YAML.load(__dirname);
    const sum = ['十连', '角色查询', '体力查询', '用户绑定', '抽卡记录', '添加表情', '欢迎新人', '退群通知', '云崽帮助', '角色素材', '今日素材', '养成计算', '米游社公告']
    data.default.disable.push(...sum);
    const yamlStr = yaml.dump(data);
    fs.writeFileSync(__dirname, yamlStr, 'utf8');
    return '关闭成功';
  };
  ReadConfighelp = (filename) => {
    const __dirname = `${path.resolve()}${path.sep}config${path.sep}config/${filename}.yaml`;
    const data = YAML.load(__dirname);
    const sum = ['云崽帮助']
    data.default.disable.push(...sum);
    const yamlStr = yaml.dump(data);
    fs.writeFileSync(__dirname, yamlStr, 'utf8');
    return '设置成功';
  };
};
export default new defSet();