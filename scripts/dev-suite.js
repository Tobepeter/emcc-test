import concurrently from 'concurrently'
import { dirname } from 'dirname-filename-esm'
import path from 'path'

const __dirname = dirname(import.meta)
const projectRoot = path.resolve(__dirname, '..')

const scriptsToRun = [
  { command: 'npm run dev', name: 'VITE', prefix: 'blue' },
  { command: 'npm run dev:wasm', name: 'WASM', prefix: 'magenta' },
  { command: 'npm run log-server', name: 'LOG', prefix: 'green' },
]

function main() {
  try {
    console.log('Executing commands concurrently...')
    concurrently(scriptsToRun, {
      killOthers: true,
      cwd: projectRoot,
    })
  } catch (error) {
    console.error('Failed to execute concurrently commands:', error)
    process.exit(1)
  }
}

main()
