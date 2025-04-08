import { spawnSync } from 'child_process'

export function commandExists(command) {
  const result = spawnSync('which', [command], { stdio: 'ignore' })
  return result.status === 0
}
