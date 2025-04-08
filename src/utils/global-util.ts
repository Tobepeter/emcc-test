import { emCallback } from './em-callback'

class GlobalUtil {
  init() {
    const win = window as any
    win.win = window
    win.emCallback = emCallback
  }
}

export const globalUtil = new GlobalUtil()

declare global {
  const win: any
  const emCallback: typeof import('./em-callback').emCallback
}
