import { wasmModule } from './wasm-loader'

class WasmHelper {
  getHeapSize() {
    return wasmModule.HEAPU8.length
  }

  getHeapSizeMB() {
    return this.getHeapSize() / 1024 / 1024 + 'MB'
  }
}

export const wasmHelper = new WasmHelper()
