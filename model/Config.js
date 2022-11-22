import YAML from 'yaml';
import fs from 'node:fs';
import chokidar from 'chokidar';
import lodash from 'lodash';
class Config {
    constructor() {
        this.defSetPath = './plugins/Xiuxian-Plugin-Box/defSet/';
        this.defSet = {};
        this.configPath = './plugins/Xiuxian-Plugin-Box/config/';
        this.config = {};
        /** 监听文件 */
        this.watcher = { config: {}, defSet: {} };
    }
    getdefSet = (app, name) => {
        return this.getYaml(app, name, 'defSet');
    };
    getConfig = (app, name) => {
            return this.getYaml(app, name, 'config');
    };
    getYaml = (app, name, type) => {
        let file = this.getFilePath(app, name, type);
        let key = `${app}.${name}`;
        if (this[type][key]) return this[type][key];
        this[type][key] = YAML.parse(fs.readFileSync(file, 'utf8'));
        this.watch(file, app, name, type);
        return this[type][key];
    };

    getFilePath = (app, name, type) => {
        if (type == 'defSet') return `${this.defSetPath}${app}/${name}.yaml`;
        else return `${this.configPath}${app}/${name}.yaml`;
    };
    watch = (file, app, name, type = 'defSet') => {
        let key = `${app}.${name}`;
        if (this.watcher[type][key]) return;
        const watcher = chokidar.watch(file);
        watcher.on('change', (path) => {
            delete this[type][key];
            logger.mark(`[修改配置文件][${type}][${app}][${name}]`);
            if (this[`change_${app}${name}`]) {
                this[`change_${app}${name}`]();
            };
        });
        this.watcher[type][key] = watcher;
        return;
    };
    saveSet = (app, name, type, data) => {
        let file = this.getFilePath(app, name, type);
        if (lodash.isEmpty(data)) {
            fs.existsSync(file) && fs.unlinkSync(file);
        }
        else {
            let yaml = YAML.stringify(data);
            fs.writeFileSync(file, yaml, 'utf8');
        };
        return;
    };
};
export default new Config();