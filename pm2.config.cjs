module.exports = {
  apps: [
    {
      name: 'yz-xiuxian',
      script: './src/main.ts',
      interpreter: 'node',
      interpreter_args:
        ' --no-warnings=ExperimentalWarning --loader ts-node/esm',
      env: {
        NODE_ENV: 'development'
      },
      env_production: {
        NODE_ENV: 'production'
      },
      autoRestart: false
    }
  ]
}
