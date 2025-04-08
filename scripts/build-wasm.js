import { execSync } from 'child_process'
import { program } from 'commander'
import { getWasmConfigCMD } from './config/wasm-config.js'
import { commandExists } from './utils/node-util.js'
import { printError, printInfo, printSuccess } from './utils/print.js'

program.option('--dry', 'dry run')
program.option('-v, --verbose', 'verbose output')
program.option('-m, --mode <mode>', 'build mode (dev/prod)', 'prod')
program.parse(process.argv)

function main() {
  if (!commandExists('emcc')) {
    printError('emcc not found')
    process.exit(1)
  }

  const options = program.opts()
  const { verbose, dry, mode } = options

  const command = getWasmConfigCMD(mode)
  ;(verbose || dry) && printInfo(`command: ${command}`)

  if (!dry) {
    try {
      execSync(command, { stdio: 'inherit' })
      printSuccess(`Successfully compiled in ${mode} mode`)
    } catch (error) {
      printError('Compilation failed:', error)
      process.exit(1)
    }
  }
}

main()
