/**
 *
 * @param param0
 */
const useYunzaiJS = async ({ config }) => {
  const { Client, createLogin, Processor } = await import('yunzaijs')
  setTimeout(async () => {
    await createLogin()
    Client.run()
      .then(() => Processor.install([config]))
      .catch(console.error)
  }, 0)
}

useYunzaiJS({
  config: 'lib/yunzai.config.js'
})
