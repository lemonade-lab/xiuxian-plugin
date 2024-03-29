import React from 'react'
import { renderToString } from 'react-dom/server'
import { Puppeteer } from './puppeteer.ts'
import { mkdirSync, writeFileSync } from 'fs'
import { join } from 'path'
import { cwd } from '../../config.ts'
// component
import HelpComponent from './component/help.tsx'
// 初始化
const p = new Puppeteer()
// dir
const dir = join(cwd, 'resources', 'cache')
mkdirSync(dir, {
  recursive: true
})

/**
 * 用户信息
 * @param data
 * @returns
 */
export function getHelpComponent(data: string, name = 'user.html') {
  const html = renderToString(<HelpComponent data={data} />)
  const address = join(dir, name)
  writeFileSync(address, `<!DOCTYPE html>${html}`)
  return p.toFile(address)
}
