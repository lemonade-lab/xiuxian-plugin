/** @type {import('tailwindcss').Config} */
import { createRequire } from 'module'
const require = createRequire(import.meta.url)
export default {
  content: [
    './node_modules/preline/dist/*.js',
    './src/**/*.{html,js,jsx,tsx,ts}'
  ],
  theme: {
    extend: {}
  },
  plugins: [require('preline/plugin')]
}
