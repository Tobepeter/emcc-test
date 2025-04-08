class GlobalUtil {
  init() {
    const win = window as any
    win.win = window
  }
}

export const globalUtil = new GlobalUtil()

declare global {
  const win: any
}
