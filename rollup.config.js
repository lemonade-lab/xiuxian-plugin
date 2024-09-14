import { defineConfig } from 'rollup'
import { dirname, resolve } from 'path'
import { fileURLToPath } from 'url'
import typescript from '@rollup/plugin-typescript'
import alias from '@rollup/plugin-alias'
import dts from 'rollup-plugin-dts'
export default defineConfig([
  {
    input: 'src/index.ts',
    output: {
      dir: 'lib',
      format: 'es',
      sourcemap: false,
      preserveModules: true
    },
    plugins: [
      typescript({
        compilerOptions: {
          outDir: 'lib'
        },
        include: ['src/**/*']
      })
    ],
    onwarn: (warning, warn) => {
      if (warning.code === 'UNRESOLVED_IMPORT') return
      warn(warning)
    }
  },
  {
    input: 'src/index.ts',
    output: {
      dir: 'lib',
      format: 'es',
      sourcemap: false,
      preserveModules: true
    },
    plugins: [
      alias({
        entries: [
          {
            find: '@',
            replacement: resolve(dirname(fileURLToPath(import.meta.url)), 'src')
          }
        ]
      }),
      typescript({
        compilerOptions: {
          suppressImplicitAnyIndexErrors: true,
          outDir: 'lib'
        },
        include: ['src/**/*']
      }),
      dts()
    ],
    onwarn: (warning, warn) => {
      if (warning.code === 'UNRESOLVED_IMPORT') return
      warn(warning)
    }
  }
])
