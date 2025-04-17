import { program } from 'commander'
import { dirname } from 'dirname-filename-esm'
import path from 'path'
import { printError } from '../utils/print.js'
import { wasmUtil } from '../utils/wasm-util.js'
import { compact } from 'lodash-es'

const __dirname = dirname(import.meta)

const wasmConfigCache = {}

export const getWasmConfig = (mode = 'prod') => {
  const isDev = mode === 'dev'

  // TODO: 想用watch配置构建，缓存肯定不能用，但是去掉也不行，因为模块已经被加载了
  if (wasmConfigCache[mode]) {
    return wasmConfigCache[mode]
  }

  const config = {
    srcDir: path.resolve(__dirname, '../../src/wasm/c'),
    outDir: path.resolve(__dirname, '../../src/wasm/build'),
    typesDir: path.resolve(__dirname, '../../src/wasm/bindings'),

    // 如果为空，从srcDir中获取所有.c文件
    srcFiles: [],
    outFileName: 'main.js',
    // outFileName: 'main.html',

    settings: {
      // NOTE: 这个其实是默认是1，不需要额外设置
      WASM: 1,
      ENVIRONMENT: 'web',
      EXPORTED_RUNTIME_METHODS: [
        // -- prettier-linebreak --
        'ccall',
        'cwrap',
        'print',
        'printErr',
        'stringToUTF8',
        'UTF8ToString',
        'stackTrace',
        'addFunction',
        'removeFunction',
      ],
      EXPORTED_FUNCTIONS: ['_malloc', '_free', '_main'],
      ALLOW_MEMORY_GROWTH: true,
      ALLOW_TABLE_GROWTH: true,
      MODULARIZE: true,
      EXPORT_ES6: true,

      /** @docs https://emscripten.org/docs/porting/Debugging.html */
      ASSERTIONS: isDev,
      SAFE_HEAP: isDev,
      STACK_OVERFLOW_CHECK: isDev ? 2 : 0,
      // NOTE: 如果设置为true，没有.wasm文件，内容会被base64编码
      // SINGLE_FILE: true,

      // TODO: 需要直接空字符串或者null字段省略
      // MALLOC: 'emmalloc-verbose',
      // MALLOC: 'none',

      // RUNTIME_DEBUG: isDev,
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
      // EMCC_DEBUG: isDev,
    },

    // NOTE: 这个命令测不出来有什么作用，也许开了sourcemap差别不大了
    // profiling: isDev,
    // cpuprofiler: isDev,
    // memoryprofiler: isDev,

    define: {
      DEBUG: isDev,
    },

    // tracing: isDev,
    // clearCache: isDev,
  }

  // override from commander
  const { setting } = program.opts()
  if (setting) wasmUtil.overrideSetting(config.settings, setting)

  wasmConfigCache[mode] = config
  return config
}

export const getWasmConfigCMD = (mode) => {
  const { srcDir, outDir, srcFiles, outFileName, settings, optimize, sourceMap, inject, env, verbose, profiling, cpuprofiler, memoryprofiler, define, clearCache, tracing } = getWasmConfig(mode)
  const srcFilesFull = srcFiles.length > 0 ? srcFiles : wasmUtil.getInputFiles(srcDir)
  const srcFilesStr = wasmUtil.getFilesCmdStr(srcDir, srcFilesFull)
  const outputFileStr = `\"${path.join(outDir, outFileName)}\"`
  const settingStr = wasmUtil.transformSettings(settings)
  const isOutputHtml = wasmUtil.isOutputHtml(outFileName)

  const envStr = env && wasmUtil.transformConfig(env)
  const commandArr = [envStr, `emcc ${srcFilesStr} -o ${outputFileStr} -I ${srcDir}`, settingStr]
  if (optimize && optimize.level > 0) commandArr.push(`-O${optimize.level}`)
  if (sourceMap) commandArr.push(`-g`)
  if (verbose) commandArr.push(`-v`)
  if (inject) {
    if (inject.pre) commandArr.push(`--pre-js \"${inject.pre}\"`)
    if (inject.post) commandArr.push(`--post-js \"${inject.post}\"`)
  }
  if (profiling) commandArr.push(`--profiling`)
  if (cpuprofiler) {
    if (isOutputHtml) commandArr.push(`--cpuprofiler`)
    else printError('cpuprofiler is not supported for non-html output')
  }
  if (memoryprofiler) {
    if (isOutputHtml) commandArr.push(`--memoryprofiler`)
    else printError('memoryprofiler is not supported for non-html output')
  }

  if (define) commandArr.push(wasmUtil.transformConfig(define, { omitBool: true, prefix: '-D' }))
  if (clearCache) commandArr.push('--clear-cache')
  if (tracing) commandArr.push('--tracing')
  const command = compact(commandArr).join(' ')
  return command
}
