import fs from 'node:fs';
class filecp {
  constructor() {
    this.file(['xiuxian', 'task', 'Help',  'Admin']);
    this.help();
  };
  
  Pluginfile = (name,config) => {
    let cf = [];
    const filepath = './plugins/Xiuxian-Plugin-Box/plugins/'+name+'/defSet/';
    const readdirectory=(dir)=>{
      let files = fs.readdirSync(dir);
      files.forEach(async item => {
        let filepath1 = dir + '/' + item;
        let stat = fs.statSync(filepath1);
        if (stat.isFile()) { }
        else {
          let file = filepath1.replace(filepath + '/', '');
          cf.push(file);
        };
      });
    };
    readdirectory(filepath);
    const filepath0 = './plugins/Xiuxian-Plugin-Box/config/';
    for (var j = 0; j < cf.length; j++) {
      for (var i = 0; i < config.length; i++) {
        let x = filepath0 + cf[j] + '/' + config[i] + '.yaml';
        let y = filepath + cf[j] + '/' + config[i] + '.yaml';
        if (!fs.existsSync(x)) {
          fs.cp(y, x, (err) => {
            if (err) { };
          });
        }else {
          fs.rmSync(`${x}`);
          fs.cp(y, x, (err) => {
            if (err) { };
          });
        };
      };
    };
    return;
  };

  upfile = () => {
    let cf = [];
    const filepath = './plugins/Xiuxian-Plugin-Box/defSet/';
    const config = ['xiuxian', 'task', 'Help',  'Admin'];
    const readdirectory = (dir) => {
      let files = fs.readdirSync(dir);
      files.forEach(async item => {
        let filepath1 = dir + '/' + item;
        let stat = fs.statSync(filepath1);
        if (stat.isFile()) { }
        else {
          let file = filepath1.replace(filepath + '/', '');
          cf.push(file);
        };
      });
    };
    readdirectory(filepath);
    const filepath0 = './plugins/Xiuxian-Plugin-Box/config/';
    for (var j = 0; j < cf.length; j++) {
      for (var i = 0; i < config.length; i++) {
        let x = filepath0 + cf[j] + '/' + config[i] + '.yaml';
        let y = filepath + cf[j] + '/' + config[i] + '.yaml';
        if (fs.existsSync(y)) {
          fs.cp(y, x, (err) => {
            if (err) { };
          });
        };
      };
    };
    return;
  };
  file = (config) => {
    let cf = [];
    const filepath = './plugins/Xiuxian-Plugin-Box/defSet/';
    const readdirectory=(dir)=>{
      let files = fs.readdirSync(dir);
      files.forEach(async item => {
        let filepath1 = dir + '/' + item;
        let stat = fs.statSync(filepath1);
        if (stat.isFile()) { }
        else {
          let file = filepath1.replace(filepath + '/', '');
          cf.push(file);
        };
      });
    };
    readdirectory(filepath);
    const filepath0 = './plugins/Xiuxian-Plugin-Box/config/';
    for (var j = 0; j < cf.length; j++) {
      for (var i = 0; i < config.length; i++) {
        let x = filepath0 + cf[j] + '/' + config[i] + '.yaml';
        let y = filepath + cf[j] + '/' + config[i] + '.yaml';
        if (!fs.existsSync(x)) {
          fs.cp(y, x, (err) => {
            if (err) { };
          });
        };
      };
    };
    return;
  };
  help = () => {
    const config1 = ['help'];
    const config2 = ['help'];
    const cphelp = (cf1, cf2) => {
      for (var i = 0; i < cf1.length; i++) {
        let x = './plugins/Xiuxian-Plugin-Box/resources/' + cf1[i] + '/' + cf2[i] + '.jpg'
        if (!fs.existsSync(x)) {
          let y = './plugins/Xiuxian-Plugin-Box/resources/img/' + cf1[i] + '/' + cf2[i] + '.jpg'
          fs.cp(y, x,
            (err) => {
              if (err) {
                console.error(x);
              };
            });
        };
      };
    };
    cphelp(config1, config2);
    return;
  };

};
export default new filecp();