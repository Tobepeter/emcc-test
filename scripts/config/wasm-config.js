import { dirname } from 'dirname-filename-esm'
import path from 'path'
import { program } from 'commander'
import { wasmUtil } from '../utils/wasm-util.js'
import { printError } from '../utils/print.js'
const __dirname = dirname(import.meta)

const wasmConfigCache = {}

export const getWasmConfig = (mode = 'prod') => {
  const isDev = mode === 'dev'

  if (wasmConfigCache[mode]) {
    return wasmConfigCache[mode]
  }

  wasmConfigCache[mode] = {
    srcDir: path.resolve(__dirname, '../../src/wasm/c'),
    outDir: path.resolve(__dirname, '../../src/wasm/build'),
    typesDir: path.resolve(__dirname, '../../src/wasm/bindings'),

    // 如果为空，从srcDir中获取所有.c文件
    outFiles: [],
    outFileName: 'main.js',
    // outFileName: 'main.html',

    settings: {
      // NOTE: 这个其实是默认是1，不需要额外设置
      WASM: 1,
      ENVIRONMENT: 'web',
      EXPORTED_RUNTIME_METHODS: ['ccall', 'cwrap', 'print', 'printErr', 'stringToUTF8', 'UTF8ToString'],
      EXPORTED_FUNCTIONS: ['_malloc', '_free', '_main'],
      ALLOW_MEMORY_GROWTH: true,
      MODULARIZE: true,
      EXPORT_ES6: true,

      /** @docs https://emscripten.org/docs/porting/Debugging.html */
      ASSERTIONS: isDev,
      SAFE_HEAP: isDev,
      STACK_OVERFLOW_CHECK: isDev ? 2 : 0,
      // NOTE: 如果设置为true，没有.wasm文件，内容会被base64编码
      // SINGLE_FILE: true,
    },
    optimize: {
      level: isDev ? 0 : 3, // -O
    },
    sourceMap: isDev, // -g
    // verbose: isDev, // -v

    // NOTE: 其实就是在闭包内插入一些代码片段
    inject: {
      // pre: path.resolve(__dirname, './wasm-pre.js'),
      // post: path.resolve(__dirname, './wasm-post.js'),
    },

    env: {
      // EMCC_DEBUG: 1,
    },

    // NOTE: 这个命令测不出来有什么作用，也许开了sourcemap差别不大了
    // profiling: isDev,
    // cpuprofiler: isDev,
    // memoryprofiler: isDev,
  }

  // override from commander
  const { setting } = program.opts()
  if (setting) wasmUtil.overrideSetting(wasmConfigCache[mode].settings, setting)

  return wasmConfigCache[mode]
}

export const getWasmConfigCMD = (mode) => {
  const { srcDir, outDir, outFiles, outFileName, settings, optimize, sourceMap, inject, env, verbose, profiling, cpuprofiler, memoryprofiler } = getWasmConfig(mode)
  const outFilesFull = outFiles.length > 0 ? outFiles : wasmUtil.getInputFiles(srcDir)
  const inputFiles = wasmUtil.getFilesCmdArr(srcDir, outFilesFull)
  const outputFile = `\"${path.join(outDir, outFileName)}\"`
  const settingStr = wasmUtil.transformSettings(settings)
  const isOutputHtml = wasmUtil.isOutputHtml(outFileName)

  // TODO: clang的头文件warning
  //  clang-15: warning: treating 'c-header' input as 'c++-header' when in C++ mode, this behavior is deprecated [-Wdeprecated]

  let command = `emcc ${inputFiles} -o ${outputFile} -I ${srcDir}`
  let envStr = env && wasmUtil.transformEnv(env)
  if (envStr) command = `${envStr} ${command}`
  if (settingStr) command += ` ${settingStr}`
  if (optimize && optimize.level > 0) command += ` -O${optimize.level}`
  if (sourceMap) command += ` -g`
  if (verbose) command += ` -v`
  if (inject) {
    if (inject.pre) command += ` --pre-js \"${inject.pre}\"`
    if (inject.post) command += ` --post-js \"${inject.post}\"`
  }
  if (profiling) command += ` --profiling`
  if (cpuprofiler) {
    if (isOutputHtml) command += ` --cpuprofiler`
    else printError('cpuprofiler is not supported for non-html output')
  }
  if (memoryprofiler) {
    if (isOutputHtml) command += ` --memoryprofiler`
    else printError('memoryprofiler is not supported for non-html output')
  }

  return command
}
