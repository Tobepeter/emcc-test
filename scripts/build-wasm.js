import { exec } from 'child_process'
import chokidar from 'chokidar'
import clear from 'clear'
import { initCommander } from './config/commander-config.js'
import { getWasmConfig, getWasmConfigCMD } from './config/wasm-config.js'
import { commandExists } from './utils/node-util.js'
import { printError, printInfo, printSuccess } from './utils/print.js'
import { spinner } from './utils/spinner.js'
import { TaskRunner } from './utils/task-runner.js'

const options = initCommander()
const { verbose, dry, mode, watch } = options
const config = getWasmConfig(options.mode)
const command = getWasmConfigCMD(options.mode)

function prepare() {
  if (!commandExists('emcc')) {
    printError('emcc not found')
    process.exit(1)
  }
}

function build(onFinish = null) {
  if (watch) clear()
  ;(verbose || dry) && printInfo(`command: ${command}`)

  if (dry) {
    onFinish?.(true)
    return
  }

  spinner.start('build')
  // execSync(command, { stdio: 'inherit' })

  exec(command, (error, stdout, stderr) => {
    if (error) {
      spinner.fail('Compilation failed: ' + error)
      onFinish?.(false)
      if (!watch) {
        process.exit(1)
      }
      return
    }
    console.log(stdout)
    spinner.succeed(`Successfully compiled in ${mode} mode`)
    onFinish?.(true)
  })
}

function startWatching() {
  const { srcDir } = config
  const watcher = chokidar.watch(srcDir)

  console.log(`watching c dir: ${srcDir}...`)

  const runner = new TaskRunner()
  runner.init({
    fn: build,
  })

  // NOTE: 多次change，如果执行heavy task，没结束，一般后续结尾会多执行一次change，这无法避免
  watcher.on('change', (path) => {
    // console.log(`${path} changed`)
    runner.trigger()
  })

  watcher.on('error', (error) => {
    printError('watch error:', error)
  })
}

function main() {
  prepare()
  const { watch } = options
  watch ? startWatching() : build()
}

main()
