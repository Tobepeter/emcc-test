import path from 'path'
import { dirname } from 'dirname-filename-esm'
import { wasmUtil } from '../utils/wasm-util.js'

const __dirname = dirname(import.meta)

export const getWasmConfig = (mode) => {
  const isDev = mode === 'dev'
  return {
    srcDir: path.resolve(__dirname, '../../src/wasm/c'),
    outDir: path.resolve(__dirname, '../../src/wasm/build'),
    typesDir: path.resolve(__dirname, '../../src/wasm/bindings'),

    // 需要自行处理依赖顺序
    outFiles: [
      // -- prettier breakline --
      'test.c',
      'main.c',
    ],
    outFileName: 'main.js',

    flag: {
      wasm: true,
      environment: 'web',
      exportedRuntimeMethods: ['ccall', 'cwrap', 'print', 'printErr'],
      exportedFunctions: ['_malloc', '_free', '_main'],
      allowMemoryGrowth: true,
      modularize: true,
      exportES6: true,
      assertions: isDev,
      safeHeap: isDev,
    },
    optimize: {
      level: isDev ? 0 : 3, // -O
    },
    sourceMap: isDev, // -g
  }
}

export const getWasmConfigCMD = (mode) => {
  const { srcDir, outDir, outFiles, outFileName, flag, optimize, sourceMap } = getWasmConfig(mode)
  const inputFiles = outFiles.map((file) => `\"${path.join(srcDir, file)}\"`).join(' ')
  const outputFile = `\"${path.join(outDir, outFileName)}\"`

  let flagStr = ''
  const keys = Object.keys(flag)
  const keyLen = keys.length

  for (let i = 0; i < keyLen; i++) {
    const key = keys[i]
    const value = flag[key]

    const k = wasmUtil.transformFlagKey(key)

    const valueType = typeof value

    // 布尔类型没有值，防止尾部额外添加空格
    let hasValue = true
    if (valueType === 'boolean') {
      if (value) {
        flagStr += `-s ${k}=1`
      } else {
        hasValue = false
      }
    } else if (Array.isArray(value)) {
      // eg. "['ccall', 'cwrap', 'print', 'printErr']"
      flagStr += `-s ${k}=${wasmUtil.transformArrayValue(value)}`
    } else {
      flagStr += `-s ${k}=${value}`
    }

    if (i < keyLen - 1 && hasValue) {
      flagStr += ' '
    }
  }

  // 最后一个布尔值为false，需要删掉前面追加的空格
  flagStr = flagStr.trim()

  // TODO: clang的头文件warning
  //  clang-15: warning: treating 'c-header' input as 'c++-header' when in C++ mode, this behavior is deprecated [-Wdeprecated]

  let command = `emcc ${inputFiles} -o ${outputFile} -I ${srcDir}`
  if (flagStr) command += ` ${flagStr}`
  if (optimize && optimize.level > 0) command += ` -O${optimize.level}`
  if (sourceMap) command += ` -g`
  return command
}
