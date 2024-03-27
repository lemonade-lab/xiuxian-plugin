/**
 * *************
 * 定义每一个截图
 * *************
 */
import React from 'react'
import ReactDOMServer from 'react-dom/server'
import { Puppeteer } from './puppeteer.ts'
import { mkdirSync, writeFileSync } from 'fs'
import { join } from 'path'
import { cwd } from '../../config.ts'
// component
import UserMessage from './component/user.tsx'

// 初始化
const p = new Puppeteer()
mkdirSync(join(cwd, 'data'))

/**
 * 用户信息
 * @param data
 * @returns
 */
export function userMessage(data: string) {
  // 渲染 React 组件为 HTML 字符串
  const html = ReactDOMServer.renderToString(<UserMessage data={data} />)
  // data/user.html
  const dir = join(cwd, 'data/user.html')
  writeFileSync(dir, `<!DOCTYPE html>${html}`)
  return p.toFile(dir)
}
