import typescript from '@rollup/plugin-typescript'
// import multiEntry from '@rollup/plugin-multi-entry'
// import terser from '@rollup/plugin-terser'
export default {
  input: 'src-koa/main.ts',
  output: {
    // dir: 'dist',
    // 指定输出文件路径为 index.js
    file: 'src-koa/index.js',
    format: 'module',
    // 是否生成 sourcemap 文件
    sourcemap: false
  },
  plugins: [
    typescript()
    // multiEntry()
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
