import { wasmModule } from './wasm-loader'
import { track } from './track'

class EMCallback {
  private ptr2str(ptr: number, maxBytesToRead?: number) {
    const str = wasmModule.UTF8ToString(ptr, maxBytesToRead)
    return str
  }

  private str2ptr(str: string) {
    const len = wasmModule.lengthBytesUTF8(str)
    const ptr = wasmModule._malloc(len)
    wasmModule.stringToUTF8(str, ptr, len)
    return ptr
  }

  track(ptr: number) {
    const str = this.ptr2str(ptr)
    track.msg(str)
  }
}

export const emCallback = new EMCallback()
