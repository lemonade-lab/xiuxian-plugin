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
      // 指定要匹配的文件路径模式
      include: ['index.js']
    })
    // 压缩
    // terser()
  ],
  onwarn: (warning, warn) => {
    // 忽略与无法解析的导入相关的警告信息
    if (warning.code === 'UNRESOLVED_IMPORT') return
    // 继续使用默认的警告处理
    warn(warning)
  }
}
