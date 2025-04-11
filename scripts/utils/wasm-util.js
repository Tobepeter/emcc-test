import { snakeCase } from 'lodash-es'

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
    let result = ''
    const keys = Object.keys(settings)
    const keyLen = keys.length

    for (let i = 0; i < keyLen; i++) {
      const key = keys[i]
      const value = settings[key]

      // NOTE: 还是还原了和emcc一样的写法
      // const k = wasmUtil.transformFlagKey(key)
      const k = key

      const valueType = typeof value

      // 布尔类型没有值，防止尾部额外添加空格
      let hasValue = true
      if (valueType === 'boolean') {
        if (value) {
          result += `-s ${k}=1`
        } else {
          hasValue = false
        }
      } else if (Array.isArray(value)) {
        // eg. "['ccall', 'cwrap', 'print', 'printErr']"
        result += `-s ${k}=${wasmUtil.transformArrayValue(value)}`
      } else {
        result += `-s ${k}=${value}`
      }

      if (i < keyLen - 1 && hasValue) {
        result += ' '
      }
    }

    // 最后一个布尔值为false，需要删掉前面追加的空格
    result = result.trim()
    return result
  }

  /**
   * 转换env
   * @param {Record<string, any>} env
   * @returns {string}
   */
  transformEnv(env) {
    let envStr = ''
    const keys = Object.keys(env)
    const keyLen = keys.length

    for (let i = 0; i < keyLen; i++) {
      const key = keys[i]
      const value = env[key]

      if (typeof value === 'boolean') {
        value = value ? '1' : '0'
      }

      envStr += `${key}=${value}`

      if (i < keyLen - 1) {
        envStr += ' '
      }
    }
    return envStr
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
      if (target.hasOwnProperty(key)) {
        target[key] = JSON.parse(val)
      } else {
        printError(`Unknown setting: ${key}`)
      }
    }
  }
}

export const wasmUtil = new WasmUtil()
