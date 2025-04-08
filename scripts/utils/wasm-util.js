import { snakeCase } from 'lodash-es'

class WasmUtil {
  /**
   * 转换 flag 的 key
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
}

export const wasmUtil = new WasmUtil()
