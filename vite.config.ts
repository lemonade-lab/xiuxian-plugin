import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { join } from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': join(__dirname, 'src-vite')
    }
  },
  server: {
    proxy: {
      // 将所有以 '/api' 开头的请求代理到目标服务器
      '/api': {
        target: 'http://localhost:9090/api', // 目标服务器地址
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '') // 可选的路径重写
      }
    }
  },
  build: {
    minify: 'terser', // 启用 terser 压缩
    terserOptions: {
      compress: {
        drop_console: true, // 删除所有 console
        drop_debugger: true // 删除 debugger
      }
    },
    rollupOptions: {
      output: {
        //自动分割包名输出 chunkSizeWarningLimit 配置大小
        chunkFileNames: 'js/[name]-[hash].js', //入口文件名
        entryFileNames: 'js/[name]-[hash].js', //出口文件名位置
        assetFileNames: '[ext]/[name]-[hash].[ext]', //静态文件名位置
        manualChunks(id) {
          if (id.includes('node_modules')) {
            return id
              .toString()
              .split('node_modules/')[1]
              .split('/')[0]
              .toString()
          }
        }
      }
    }
  }
})
