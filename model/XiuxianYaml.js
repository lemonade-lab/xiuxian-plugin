import fs from 'node:fs';
import path from 'path';
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const __dirname = `${path.resolve()}${path.sep}plugins${path.sep}Xiuxian-Plugin-Box${path.sep}config${path.sep}xiuxian${path.sep}xiuxian.yaml`;
class XiuxianYaml {
  constructor() {
    try {
      this.YAML = require('yamljs');
    } catch { }
    try {
      this.yaml = require('js-yaml');
    } catch { }
  };
  UPdataCD = (name, size) => {
    try {
      const data = this.YAML.load(`${__dirname}`);
      data.CD[name] = Number(size);
      const yamlStr = this.yaml.dump(data);
      fs.writeFileSync(`${__dirname}`, yamlStr, 'utf8');
      return `修改${name}为${size}`;
    } catch {
      return '请先执行\npnpm i yamljs -w\npnpm i  js-yaml -w';
    }
  };
  UPdataconfig = (name0, name1, size) => {
    try {
      const data = this.YAML.load(`${__dirname}`);
      data[name0][name1] = Number(size);
      const yamlStr = this.yaml.dump(data);
      fs.writeFileSync(`${__dirname}`, yamlStr, 'utf8');
      return `修改${name0}.${name1}为${size}`;
    } catch {
      return '请先执行\npnpm i yamljs -w\npnpm i  js-yaml -w';
    }
  };
};
export default new XiuxianYaml();