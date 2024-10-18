const cfg = require('yunzaijs/pm2')
const app = cfg.apps[0]
app.script = 'node lib/app.js'
module.exports = {
  apps: [app]
}
