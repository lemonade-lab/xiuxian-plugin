
import { createRequire } from 'module'
const require = createRequire(import.meta.url)
class NodeJs{
    returnSchedele=()=>{
        return require('node-schedule')
    }
    returnyamljs=()=>{
        return require('yamljs')
    }
    returnjsyaml=()=>{
        return require('js-yaml')
    }
    returnexec=()=>{
        return require('child_process')
    }
}
export default   new NodeJs()