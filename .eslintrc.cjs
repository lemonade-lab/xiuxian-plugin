module.exports = {
  env: {
    commonjs: true,
    es2021: true,
    node: true
  },
  extends: ['eslint:recommended', 'prettier'],
  parserOptions: {
    ecmaVersion: 'latest'
  },
  globals: {
    segment: true
  },
  rules: {
    'no-var': 'off'
  }
}
