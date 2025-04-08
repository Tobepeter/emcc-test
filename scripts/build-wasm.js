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
  // NOTE: 注意中间不能有空格
  //  main需要导出后才能自动调用
  "-s EXPORTED_FUNCTIONS=['_malloc','_free','_main']",
  '-s ALLOW_MEMORY_GROWTH=1',
  '-s ENVIRONMENT=web',
  '-s MODULARIZE=1',
  '-s EXPORT_ES6=1',
  `-I ${SRC_DIR}`,
  // '-s EXPORT_NAME="wasmModule"',
].join(' ')

// 确保输出目录存在
;[OUT_DIR, TYPES_DIR].forEach((dir) => {
  ensureDirExists(dir)
})

const srcFiles = [
  // -- prettier breakline --
  'test.c',
  'main.c',
]
const srcFilesFullPath = srcFiles.map((file) => path.join(SRC_DIR, file))

function main() {
  if (!commandExists('emcc')) {
    printError('emcc not found')
    process.exit(1)
  }

  // TODO: clang的头文件warning
  //  clang-15: warning: treating 'c-header' input as 'c++-header' when in C++ mode, this behavior is deprecated [-Wdeprecated]

  const options = program.opts()
  const { verbose, dry } = options

  const inputFiles = srcFilesFullPath.map((file) => `"${file}"`).join(' ')
  const outputFileName = 'main.js'
  const outputFile = `"${path.join(OUT_DIR, outputFileName)}"`
  const command = `emcc ${inputFiles} -o ${outputFile} ${EMCC_FLAGS}`
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
