import { program } from 'commander'

export const initCommander = () => {
  program.option('--dry', 'dry run')
  program.option('-v, --verbose', 'verbose output')
  program.option('-m, --mode <mode>', 'build mode (dev/prod)', 'prod')
  program.option('-w, --watch', 'watch mode')
  program.parse(process.argv)

  return program.opts()
}