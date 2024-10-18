import { defineConfig } from 'lvyjs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'
import { createServer as useJSXP } from 'jsxp'
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

/**
 * 使用yunzaijs框架
 * @param param0
 */
const useYunzaiJS = async ({ config }) => {
  const { Client, createLogin, Processor } = await import('yunzaijs')
  setTimeout(async () => {
    await createLogin()
    Client.run()
      .then(() => Processor.install([config]))
      .catch(console.error)
  }, 0)
}

export default defineConfig({
  plugins: [
    {
      name: 'yunzai',
      useApp: () => {
        if (process.argv.includes('--yunzai'))
          useYunzaiJS({
            config: 'src/yunzai.config.ts'
          })
      }
    },
    {
      name: 'jsxp',
      useApp: async () => {
        if (process.argv.includes('--view')) useJSXP()
      }
    }
  ],
  build: {
    // 别名映射
    alias: {
      entries: [{ find: '@src', replacement: join(__dirname, 'src') }]
    },
    typescript: {
      // 去除注释
      removeComments: true
    }
  }
})
