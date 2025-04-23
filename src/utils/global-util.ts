import { emCallback } from './em-callback'
import { wasmHelper } from './wasm-helper'

class GlobalUtil {
  init() {
    this.initGlobal()
    this.injectDebug()
  }

  initGlobal() {
    const win = window as any
    win.win = window
    win.emCallback = emCallback
  }

  injectDebug() {
    const win = window as any
    win.wasmHelper = wasmHelper
  }
}

export const globalUtil = new GlobalUtil()

declare global {
  const win: any
  const emCallback: typeof import('./em-callback').emCallback
}
