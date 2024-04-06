module.exports = {
  apps: [
    {
      name: 'xiuxian-app',
      script: 'src-koa/index.js',
      instances: 1,
      autorestart: true,
      exec_mode: 'cluster',
      max_memory_restart: '2G',
      cron_restart: '0 */1 * * *',
      watch: false,
      autodump: true,
      merge_logs: true,
      error_file: `./logs/err.log`,
      out_file: `./logs/out.log`,
      log_max_size: '10M',
      log_rotate_interval: 'daily',
      log_date_format: 'YYYY-MM-DD HH:mm:ss',
      env: {
        NODE_ENV: 'production'
      },
      kill_timeout: 5000,
      listen_timeout: 3000,
      max_restarts: 10,
      restart_delay: 5000,
      restart_delay_max: 10000
    }
  ]
}
