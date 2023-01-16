
import { createRequire } from 'module'
const require = createRequire(import.meta.url)
class NodeJs{
    returnSchedele=()=>{
        return require('node-schedule')
    }

    
}
module.exports = new NodeJs()