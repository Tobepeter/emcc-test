import fs from 'fs'
import { homedir } from 'os'

/**
 * 将 ~ 替换为当前用户的主目录
 * @desc fs.existsSync 等方法需要使用绝对路径
 */
export function expandTilde(filePath) {
  if (filePath.startsWith('~/') || filePath === '~') {
    return filePath.replace('~', homedir())
  }
  return filePath
}


/**
 * 保证目录存在
 */
export function ensureDirExists(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true })
  }
}
