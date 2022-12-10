import fs from 'node:fs';
import path from 'path';
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const other = `${path.resolve()}${path.sep}config${path.sep}config/other.yaml`;
const group = `${path.resolve()}${path.sep}config${path.sep}config/group.yaml`;
class defSet {
  constructor() {
    try {
      this.YAML = require('yamljs');
    } catch {}
    try {
      this.yaml = require('js-yaml');
    } catch {}
  };
  ReadConfig = () => {
    try {
      const data = this.YAML.load(group);
      const sum = ['十连', '角色查询', '体力查询', '用户绑定', '抽卡记录', '添加表情', '欢迎新人', '退群通知', '云崽帮助', '角色素材', '今日素材', '养成计算', '米游社公告']
      data.default.disable.push(...sum);
      const yamlStr = this.yaml.dump(data);
      fs.writeFileSync(group, yamlStr, 'utf8');
      return '关闭成功';
    } catch {
      return '请先执行\npnpm i yamljs -w\npnpm i  js-yaml -w';
    }
  };
  ReadConfighelp = () => {
    try {
      const data = this.YAML.load(group);
      const sum = ['云崽帮助']
      data.default.disable.push(...sum);
      const yamlStr = this.yaml.dump(data);
      fs.writeFileSync(group, yamlStr, 'utf8');
      return '设置成功';
    } catch {
      return '请先执行\npnpm i yamljs -w\npnpm i  js-yaml -w';
    }
  };
  AddMaster = (mastername) => {
    try {
      const QQ = Number(mastername);
      const data = this.YAML.load(other);
      const sum = [QQ];
      data.masterQQ.push(...sum);
      const yamlStr = this.yaml.dump(data);
      fs.writeFileSync(other, yamlStr, 'utf8');
      return '添加成功';
    } catch {
      return '请先执行\npnpm i yamljs -w\npnpm i  js-yaml -w';
    }
  };
  DeleteMaster = (mastername) => {
    try {
      const QQ = Number(mastername);
      const data = this.YAML.load(other);
      const sum = [];
      data.masterQQ.forEach((item) => {
        if (item != QQ) {
          sum.push(item);
        };
      });
      data.masterQQ = sum;
      const yamlStr = this.yaml.dump(data);
      fs.writeFileSync(other, yamlStr, 'utf8');
      return '删除成功';
    } catch {
      return '请先执行\npnpm i yamljs -w\npnpm i  js-yaml -w';
    }
  };
  OffGroup = () => {
    try {
      const data = this.YAML.load(other);
      data.disablePrivate = true;
      const yamlStr = this.yaml.dump(data);
      fs.writeFileSync(other, yamlStr, 'utf8');
      return '关闭成功';
    } catch {
      return '请先执行\npnpm i yamljs -w\npnpm i  js-yaml -w';
    }
  };
  OnGroup = () => {
    try {
      const data = this.YAML.load(other);
      data.disablePrivate = false;
      const yamlStr = this.yaml.dump(data);
      fs.writeFileSync(other, yamlStr, 'utf8');
      return '开启成功';
    } catch {
      return '请先执行\npnpm i yamljs -w\npnpm i  js-yaml -w';
    }
  };
};
export default new defSet();