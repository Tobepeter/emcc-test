import { execSync } from 'child_process'
import { program } from 'commander'
import path from 'path'
import { commandExists } from './utils/node-util.js'
import { ensureDirExists } from './utils/path-util.js'
import { printError, printInfo, printSuccess } from './utils/print.js'
import { dirname } from 'dirname-filename-esm'

const __dirname = dirname(import.meta)

program.option('--dry', 'dry run')
program.option('-v, --verbose', 'verbose output')
program.parse(process.argv)

// 设置目录路径
const SRC_DIR = path.resolve(__dirname, '../src/wasm/c')
const OUT_DIR = path.resolve(__dirname, '../src/wasm/build')
const TYPES_DIR = path.resolve(__dirname, '../src/wasm/bindings')

// Emscripten 编译选项
const EMCC_FLAGS = [
  '-s WASM=1',
  "-s EXPORTED_RUNTIME_METHODS=['ccall','cwrap','print','printErr']",
  "-s EXPORTED_FUNCTIONS=['_malloc','_free']",
  '-s ALLOW_MEMORY_GROWTH=1',
  '-s ENVIRONMENT=web',
  '-s MODULARIZE=1',
  '-s EXPORT_ES6=1',
  // '-s EXPORT_NAME="wasmModule"',
].join(' ')

// 确保输出目录存在
;[OUT_DIR, TYPES_DIR].forEach((dir) => {
  ensureDirExists(dir)
})

const srcFiles = ['main.c'].map((file) => path.join(SRC_DIR, file))

function main() {
  if (!commandExists('emcc')) {
    printError('emcc not found')
    process.exit(1)
  }

  const options = program.opts()
  const { verbose, dry } = options

  const inputFile = srcFiles.join(' ')
  const outputFileName = 'main.js'
  const outputFile = path.join(OUT_DIR, outputFileName)
  const command = `emcc "${inputFile}" -o "${outputFile}" ${EMCC_FLAGS}`
  ;(verbose || dry) && printInfo(`command: ${command}`)

  if (!dry) {
    try {
      execSync(command, { stdio: 'inherit' })
      printSuccess(`Successfully compiled ${outputFile}`)
    } catch (error) {
      printError('Compilation failed:', error)
      process.exit(1)
    }
  }
}

main()
