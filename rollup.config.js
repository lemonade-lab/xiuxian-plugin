import typescript from '@rollup/plugin-typescript'
import multiEntry from '@rollup/plugin-multi-entry'
// import terser from '@rollup/plugin-terser'

const dist = 'dist/index.js'

export default {
  input: 'main.ts',
  output: {
    file: dist,
    format: 'module',
    // 是否生成 sourcemap 文件
    sourcemap: false
  },
  plugins: [
    typescript(),
    multiEntry({
      // 指定要匹配the文件路径模式
      include: [dist]
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
