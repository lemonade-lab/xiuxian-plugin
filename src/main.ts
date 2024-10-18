const useYunzaiJS = async ({ config }) => {
  const { Client, createLogin, Processor } = await import('yunzaijs')
  setTimeout(async () => {
    await createLogin()
    Client.run()
      .then(() => Processor.install([config]))
      .catch(console.error)
  }, 0)
}
setTimeout(async () => {
  useYunzaiJS({
    config: './lib/yunzai.config.js'
  })
}, 0)
