import fg from 'fast-glob'
import { snakeCase, compact } from 'lodash-es'
import { isAbsolute, join } from 'path'
import path from 'path'
import { printError } from './print.js'

class WasmUtil {
  /**
   * 转换 flag 的 key
   * @param {string} key
   * @returns {string}
   * @example exportedRuntimeMethods -> EXPORTED_RUNTIME_METHODS
   */
  transformFlagKey(key) {
    // NOTE: lodash 数字是分开的，会变成 EXPORT_ES_6
    if (key === 'exportES6') {
      return 'EXPORT_ES6'
    }
    return snakeCase(key).toUpperCase()
  }

  /**
   * 转换数组值
   * @param {string[]} arr
   * @returns {string}
   * @example ['ccall', 'cwrap', 'print', 'printErr'] -> "['ccall','cwrap','print','printErr']"
   *
   * 注意中间是没有空格的（shell空格会被解析）
   */
  transformArrayValue(arr) {
    let str = '\"['
    for (let i = 0; i < arr.length; i++) {
      str += `\'${arr[i]}\'`
      if (i < arr.length - 1) {
        str += ','
      }
    }
    str += ']\"'
    return str
  }

  /**
   * 转换 settings
   * @param {Record<string, any>} settings
   * @returns {string}
   */
  transformSettings(settings) {
    const result = []
    const keys = Object.keys(settings)
    const keyLen = keys.length

    for (let i = 0; i < keyLen; i++) {
      const key = keys[i]
      const value = settings[key]

      // NOTE: 还是还原了和emcc一样的写法
      // const k = wasmUtil.transformFlagKey(key)
      const k = key
      const valueType = typeof value

      if (valueType === 'boolean') {
        if (value) {
          // result += `-s ${k}=1`
          result.push(`-s ${k}`)
        }
      } else if (Array.isArray(value)) {
        result.push(`-s ${k}=${wasmUtil.transformArrayValue(value)}`)
      } else {
        result.push(`-s ${k}=${value}`)
      }
    }
    return result.join(' ')
  }

  /**
   * 转换配置
   * @param {Record<string, any>} obj
   * @param {object} [options]
   * @param {boolean} [options.omitBool=false] 是否忽略布尔值
   * @param {string} [options.prefix=''] 前缀
   * @returns {string}
   */
  transformConfig(obj, options = {}) {
    const result = []
    const keys = Object.keys(obj)
    const keyLen = keys.length

    for (let i = 0; i < keyLen; i++) {
      const key = keys[i]
      const str = this.transformKV(key, obj[key], options)
      if (!str) continue
      result.push(str)
    }
    return result.join(' ')
  }

  // TODO: 这样写太麻烦了，后续还是转成ts实在一点
  /**
   * 转换 key-value
   * @param {string} key
   * @param {string} value
   * @param {object} [options]
   * @param {boolean} [options.omitBool=false] 是否忽略布尔值
   * @param {string} [options.prefix=''] 前缀
   * @returns {string}
   */
  transformKV(key, value, options = {}) {
    const { omitBool = false, prefix = '' } = options
    let valueStr = value
    if (typeof value === 'boolean') {
      valueStr = value ? '1' : '0'
      if (omitBool && !value) return ''
    }
    const prefixStr = prefix ? `${prefix} ` : ''
    return `${prefixStr}${key}=${valueStr}`
  }

  /**
   * 覆盖 setting
   * @param {Record<string, any>} target 目标对象
   * @param {Record<string, any>} setting 设置对象
   */
  overrideSetting(target, setting) {
    const keys = Object.keys(setting)
    for (const key of keys) {
      const val = setting[key]
      // 必须定义了才能被覆盖
      if (target.hasOwnProperty(key)) {
        target[key] = JSON.parse(val)
      } else {
        printError(`Unknown setting: ${key}`)
      }
    }
  }

  /**
   * 获取输入文件
   * @param {string} dir
   * @returns {string[]}
   *
   * 经过测试，emcc貌似不需要指定文件顺序
   * 只要有头文件，在链接阶段，emcc会自动处理好来链接顺序
   */
  getInputFiles(dir) {
    const files = fg.sync('**/*.c', { cwd: dir, onlyFiles: true })
    return files.map((file) => path.join(dir, file))
  }

  /**
   * 获取文件命令数组
   * @param {string} dir 基准目录
   * @param {string[]} arr 文件数组
   * @returns {string}
   * @example ['main.c', 'test.c'] -> "main.c" "test.c"
   */
  getFilesCmdStr(dir, arr) {
    const files = arr.map((file) => {
      let filePath = file
      if (!isAbsolute(filePath)) {
        filePath = join(dir, filePath)
      }
      return `\"${filePath}\"`
    })
    return files.join(' ')
  }

  isOutputHtml(outFileName) {
    return outFileName.endsWith('.html')
  }
}

export const wasmUtil = new WasmUtil()
