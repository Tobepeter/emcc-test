import { wasmModule } from './wasm-loader'
import { track } from './track'
import { memMonitor } from './mem-monitor'

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

  trackPtr(ptr: number) {
    const str = this.ptr2str(ptr)
    track.msg(str)
  }

  track(str: string) {
    track.msg(str)
  }

  notifyAdd(ptr: number, size: number) {
    memMonitor.notifyAdd(ptr, size)
  }

  notifyRemove(ptr: number) {
    memMonitor.notifyRemove(ptr)
  }
}

export const emCallback = new EMCallback()
