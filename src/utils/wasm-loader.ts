class WasmLoader {
  private _isInit = false

  config = {
    // 可选配置
    // locateFile: (path: string) => {
    //   if (path.endsWith('.wasm')) {
    //     return `/wasm/${path}` // 指定.wasm文件位置
    //   }
    //   return path
    // },
    // onRuntimeInitialized: () => {
    //   console.log('WASM Runtime initialized')
    // },
    // print: (text: string) => {
    //   console.log('WASM stdout:', text)
    // },
    // printErr: (text: string) => {
    //   console.error('WASM stderr:', text)
    // },
  }

  async initWasm() {
    if (this._isInit) return
    this._isInit = true

    const module = await import('@/wasm/build/main.js')

    // TODO: 使用这个会有一个报错
    //  "Aborted(Module.arguments has been replaced with plain arguments_
    //  (the initial value can be provided on Module, but after startup the value is only looked for on a local variable of that name))"
    // wasmModule = await module.default(this.config)

    wasmModule = await module.default()

    // 如果存在 _main 函数，静默调用
    // if ((wasmModule as any)['_main']) {
    //   ;(wasmModule as any)['_main']()
    // }

    // TODO: 通过define控制环境调试代码
    win.wasmModule = wasmModule
  }
}

export const wasmLoader = new WasmLoader()

export let wasmModule: Awaited<ReturnType<typeof import('@/wasm/build/main.js').default>>
