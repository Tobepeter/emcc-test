import { exec } from 'child_process'
import chokidar from 'chokidar'
import clear from 'clear'
import { dirname } from 'dirname-filename-esm'
import fs from 'fs'
import path from 'path'
import { initWasmCommander } from './config/commander-config.js'
import { getWasmConfig, getWasmConfigCMD } from './config/wasm-config.js'
import { clearDir, commandExists, ensureDirExists } from './utils/node-util.js'
import { printError, printInfo, printWarning } from './utils/print.js'
import { spinner } from './utils/spinner.js'
import { TaskRunner } from './utils/task-runner.js'

const __dirname = dirname(import.meta)

const options = initWasmCommander()
const { verbose, dry, mode, watch } = options
const config = getWasmConfig(options.mode)

function prepare() {
  if (!commandExists('emcc')) {
    printError('emcc not found')
    process.exit(1)
  }

  if (!dry) {
    ensureDirExists(config.outDir)
    clearDir(config.outDir)
  }
}

function build(onFinish = null) {
  if (watch) clear()
  // build都要重新计算，因为 inputFiles 可能会变化
  const command = getWasmConfigCMD(options.mode)

  let verboseCmd = ''
  if (verbose || dry) {
    verboseCmd = `[wasm] Running command: \n${command}\n`
    printInfo(verboseCmd)
  }

  if (dry) {
    onFinish?.(true)
    return
  }

  spinner.start('[wasm] build')
  const logFile = path.join(__dirname, '../temp/wasm-build.log')

  // execSync(command, { stdio: 'inherit' })

  exec(command, (error, stdout, stderr) => {
    if (error) {
      spinner.fail('Compilation failed')
      printError(error)
      fs.writeFileSync(logFile, error.message)

      // TODO: error 也需要写入到日志文件，也许日志支持多个？
      onFinish?.(false)
      if (!watch) {
        process.exit(1)
      }
      return
    }
    console.log(stdout)
    spinner.succeed(`Successfully compiled in ${mode} mode`)

    /**
     * 额外的日志
     *
     * emcc有的warning信息是放到stderr的
     * 节约下性能，只有verbose才会写入文件
     */
    if (verbose) {
      let logStr = verboseCmd
      if (stderr) {
        printWarning(stderr)
        logStr += `\n${stderr}`
      }
      fs.writeFileSync(logFile, logStr)
    }
    onFinish?.(true)
  })
}

function startWatching() {
  // TODO: 有空支持，脚本修改，重启整个watch
  const { srcDir } = config
  const watcher = chokidar.watch(srcDir)

  console.log(`watching c dir: ${srcDir}...`)

  const runner = new TaskRunner()
  runner.init({ fn: build })

  // 初始触发一次
  watcher.on('ready', () => runner.trigger())

  // NOTE: 多次change，如果执行heavy task，没结束，一般后续结尾会多执行一次change，这无法避免
  watcher.on('change', (path) => {
    // console.log(`${path} changed`)
    runner.trigger()
  })

  watcher.on('error', (error) => printError(`watch error: ${error}`))
}

function main() {
  prepare()
  const { watch } = options
  watch ? startWatching() : build()
}

main()
