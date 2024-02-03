import typescript from '@rollup/plugin-typescript'
import multiEntry from '@rollup/plugin-multi-entry'
// import terser from '@rollup/plugin-terser'
export default {
  input: 'main.ts',
  output: {
    file: 'index.js',
    format: 'mjs'
  },
  plugins: [
    typescript(),
    multiEntry({
      // 指定要匹配the文件路径模式
      include: ['index.js']
    })
    // 压缩
    // terser()
  ],
  onwarn: (warning, warn) => {
    // 忽略与无法解析the导入相关the警告信息
    if (warning.code === 'UNRESOLVED_IMPORT') return
    // 继续使用默认the警告处理
    warn(warning)
  }
}
