import fs from "node:fs";
import path from "path";
class index {
  constructor() {
  }
  async toindex(input) {
    let filepath = './plugins/xiuxian-emulator-plugin/' + input;
    let apps = {};
    let name = [];
    let newsum = [];
    const travel = (dir, callback) => {
      fs.readdirSync(dir).forEach((file) => {
        let model = dir.search("model");
        //目录存在model，直接不要
        if(model == -1){
          let resources = dir.search("resources");
          //目录存在resources，直接不要
          if(resources == -1){
            let temporary = file.search(".js");
            if (temporary != -1) {
              let y = file.replace(".js", "");
              name.push(y);
            }
            var pathname = path.join(dir, file);
            if (fs.statSync(pathname).isDirectory()) {
              travel(pathname, callback);
            }
            else {
              callback(pathname);
            }
          }
        }
      });
    };
    travel(filepath, (pathname) => {
      let temporary = pathname.search(".js");
      if (temporary != -1) {
        newsum.push(pathname);
      }
    });
    for (var j = 0; j < newsum.length; j++) {
      newsum[j] = newsum[j].replace(/\\/g, "/");
      newsum[j] = newsum[j].replace('plugins/xiuxian-emulator-plugin', "");
      apps[name[j]] = (await import('..' + newsum[j]))[name[j]];
    };
    return apps;
  }
}

export default new index();