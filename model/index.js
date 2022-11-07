import fs from "node:fs";
class index {
  constructor() {
  }
  async toindex(x) {
    const filepath='./plugins/xiuxian-emulator-plugin/'+x;
    let sum = [""];
    const readdirectory = (dir) => {
      let files = fs.readdirSync(dir);
      files.forEach(async (item) => {
        let filepath1 = dir + '/' + item;
        let stat = fs.statSync(filepath1);
        if (stat.isFile()){}
        else {
          let file = filepath1.replace(filepath, "");
          sum.push(file);
        };
      });
    };
    readdirectory(filepath);
    let apps = {};
    var bian = "";
    for (var i = 0; i < sum.length; i++) {
      bian = sum[i];
      var files = fs
        .readdirSync(filepath + bian)
        .filter((file) => file.endsWith(".js"));
      for (let file of files) {
        let name = file.replace(".js", "");
        apps[name] = (await import('../'+x + bian + '/' + file))[name];
      }
    }
    return apps;
  }
}

export default new index();