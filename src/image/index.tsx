import React from 'react'
import { renderToString } from 'react-dom/server'
import { Puppeteer } from './puppeteer.ts'
import { mkdirSync, writeFileSync } from 'fs'
import { join } from 'path'
import { cwd } from '../../config.ts'
// component
import HelloComponent from '../component/hellox.tsx'
import MessageComponent from '../component/message.tsx'
import { UserMessageType } from '../model/types.ts'
class Component {
  pup: typeof Puppeteer.prototype
  dir = ''
  constructor(dir: string) {
    this.pup = new Puppeteer()
    this.dir = dir
    mkdirSync(this.dir, {
      recursive: true
    })
  }
  /**
   *
   * @param element
   * @param name
   * @returns
   */
  create(element: React.ReactNode, name: string) {
    const html = renderToString(element)
    const address = join(this.dir, name)
    writeFileSync(address, `<!DOCTYPE html>${html}`)
    return address
  }

  hello(_, name: string = 'help.html') {
    return this.pup.toFile(this.create(<HelloComponent />, name))
  }

  message(data: UserMessageType, name: string = 'help.html') {
    return this.pup.toFile(this.create(<MessageComponent data={data} />, name))
  }
}
export default new Component(join(cwd, 'resources', 'cache'))
