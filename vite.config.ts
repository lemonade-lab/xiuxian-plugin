import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // 将所有以 '/api' 开头的请求代理到目标服务器
      '/api': {
        target: 'http://localhost:9090/api', // 目标服务器地址
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '') // 可选的路径重写
      }
    }
  }
})
