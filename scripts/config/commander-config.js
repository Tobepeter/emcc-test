import { program } from 'commander'

export const initCommander = () => {
  program.option('--dry', 'dry run')
  program.option('-v, --verbose', 'verbose output')
  program.option('-m, --mode <mode>', 'build mode (dev/prod)', 'prod')
  program.option('-w, --watch', 'watch mode')
  program.option(
    '-s, --setting <value>',
    'wasm setting override',
    (value, previous) => {
      if (value.includes('=')) {
        const [key, val] = value.split('=')
        return { ...previous, [key]: val }
      } else {
        return { ...previous, [value]: true }
      }
    },
    {},
  )

  program.action((options) => {
    if (options.verbose) {
      console.log(`[commander] options: ${JSON.stringify(options)}\n`)
    }
  })

  program.parse(process.argv)

  return program.opts()
}
