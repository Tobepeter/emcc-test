import { execSync } from 'child_process'
import { dirname } from 'dirname-filename-esm'
import path from 'path'
import fg from 'fast-glob'
import commandExists from 'command-exists'
import chalk from 'chalk'

const __dirname = dirname(import.meta)
const projectRoot = path.resolve(__dirname, '../')
const cFolder = path.join(projectRoot, 'src/wasm/c')

const prepare = () => {
  if (!commandExists.sync('clang-format')) {
    console.log(chalk.red('clang-format is not installed'))
    process.exit(1)
  }
}

const getFiles = () => {
  const pattern = '**/*.{c,cpp,h}'
  const files = fg.sync(pattern, { cwd: cFolder, onlyFiles: true }).map((file) => path.join(cFolder, file))
  return files
}

const format = (files) => {
  const shellString = files.map((f) => `"${f}"`).join(' ')
  console.log(shellString)
  execSync(`clang-format -i ${shellString} --style=file`)
}

const main = () => {
  prepare()
  const files = getFiles()
  format(files)
}

main()
