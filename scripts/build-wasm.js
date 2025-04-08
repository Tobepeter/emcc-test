import { execSync } from 'child_process'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { expandTilde, ensureDirExists } from './utils/path-util.js'
import chalk from 'chalk'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// 设置目录路径
const SRC_DIR = path.resolve(__dirname, '../src/wasm/c')
const OUT_DIR = path.resolve(__dirname, '../src/wasm/build')
const TYPES_DIR = path.resolve(__dirname, '../src/wasm/bindings')
const EMCC_PATH = expandTilde('~/Desktop/work/git-proj/emsdk/emsdk_env.sh')

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

function sourceEmsdk() {
  const valid = EMCC_PATH && fs.existsSync(EMCC_PATH)
  if (!valid) {
    // NOTE: 也可以自己执行脚本时候提前准备好
    return
  }

  if (!execSync(`which emcc`)) {
    console.log('source emsdk_env.sh')
    execSync(`source ${EMCC_PATH}`)
  }
}

function main() {
  try {
    sourceEmsdk()
    const files = fs.readdirSync(SRC_DIR).filter((file) => file.endsWith('.c') || file.endsWith('.cpp'))

    const verbose = true
    verbose && console.log('files', files)

    files.forEach((file) => {
      const filename = path.parse(file).name
      const inputFile = path.join(SRC_DIR, file)
      const outputFile = path.join(OUT_DIR, `${filename}.js`)
      console.log(`Compiling ${file}...`)
      const command = `emcc ${inputFile} -o ${outputFile} ${EMCC_FLAGS} -s EXPORT_NAME="${filename}Module"`
      verbose && console.log(chalk.green(`command: ${command}`))
      execSync(command, { stdio: 'inherit' })
      console.log(`Successfully compiled ${file}`)
    })

    console.log('WebAssembly compilation completed!')
  } catch (error) {
    console.error('Compilation failed:', error.message)
    process.exit(1)
  }
}

main()
