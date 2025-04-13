import concurrently from 'concurrently'
import { dirname } from 'dirname-filename-esm'
import path from 'path'
import { initDevSuiteCommander } from './config/commander-config.js'

const __dirname = dirname(import.meta)
const projectRoot = path.resolve(__dirname, '..')

const options = initDevSuiteCommander()
const { exclude } = options

const scripts = [
  { command: 'npm run dev', name: 'VITE', prefix: 'blue' },
  { command: 'npm run dev:wasm', name: 'WASM', prefix: 'magenta' },
  { command: 'npm run log-server', name: 'LOG', prefix: 'green' },
]

function main() {
  // const filteredScripts = allScripts.filter((script) => !exclude.includes(script.name))
  let scriptsToRun = scripts
  if (exclude.length > 0) {
    scriptsToRun = scripts.filter((script) => !exclude.includes(script.name.toUpperCase()))
  }
  console.log('scriptsToRun', scriptsToRun)

  // TODO: 有的dev工具默认会清屏，如果是并行模式，需要关掉
  try {
    console.log('Executing commands concurrently...')
    concurrently(scriptsToRun, {
      killOthers: ['failure', 'success'],
      cwd: projectRoot,
    })
  } catch (error) {
    console.error('Failed to execute concurrently commands:', error)
    process.exit(1)
  }
}

main()
