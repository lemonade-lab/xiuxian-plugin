
import { createRequire } from 'module'
const require = createRequire(import.meta.url)
class NodeJs {
    returnSchedele = () => {
        return require('node-schedule')
    }
    returnexec = () => {
        return require('child_process')
    }
}
export default new NodeJs()