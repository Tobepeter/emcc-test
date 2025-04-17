import { getMsStr } from './common'
import { track } from './track'
import { runner } from './runner'

class MemMonitor {
  // maxLiveTime = 1 * 60 * 1000 // 1分钟
  // TEST
  maxLiveTime = 2 * 1000

  data: MemMonitorData[] = []
  enable = true
  verbose = true
  enableOverlapCheck = true

  private isInit = false

  init() {
    if (this.isInit) return
    this.isInit = true
    // 不需要太频繁，会自动合并信息
    const duration = 200
    runner.add(() => this.update(), { duration })
  }

  update = () => {
    if (!this.enable) return

    const str = this.formatOverData(true)
    track.msg(str)
  }

  /** 获取超过maxPtrLiveTime的数组 */
  getOverData() {
    const now = Date.now()
    const results = []
    for (let i = 0; i < this.data.length; i++) {
      const item = this.data[i]
      const delta = now - item.createTime
      if (delta < this.maxLiveTime) continue
      results.push(item)
    }
    return results
  }

  /**
   * 格式化超过maxPtrLiveTime的数组
   * @param dirtyReport 是否过滤已经报告的
   * @returns
   */
  formatOverData(dirtyReport = false) {
    let result = ''
    const data = this.getOverData()
    const len = data.length
    const now = Date.now()
    for (let i = 0; i < len; i++) {
      const item = data[i]

      if (dirtyReport && item.isReported) continue
      const deltaMS = now - item.createTime
      // ptr size createTime delta
      result += `[MemMonitor] ptr: ${item.ptr} size: ${item.size} delta: ${getMsStr(deltaMS)}\n`

      if (dirtyReport) {
        item.isReported = true
      }
    }
    return result
  }

  notifyAdd(ptr: number, size: number) {
    if (!this.enable) return
    this.init()
    this.checkOverlap()

    if (this.verbose) {
      console.log(`[MemMonitor] add ptr: ${ptr} size: ${size}`)
    }

    this.data.push({
      ptr,
      size,
      createTime: Date.now(),
      isReported: false,
    })
  }

  notifyRemove(ptr: number) {
    if (!this.enable) return
    this.init()

    if (this.verbose) {
      console.log(`[MemMonitor] remove ptr: ${ptr}`)
    }

    for (let i = 0; i < this.data.length; i++) {
      const item = this.data[i]
      if (item.ptr === ptr) {
        this.data.splice(i, 1)
        break
      }
    }
  }

  /**
   * 检查地址直接不能重叠
   * @returns
   */
  checkOverlap() {
    const { enableOverlapCheck, data } = this
    if (!enableOverlapCheck) return

    for (let i = 0; i < data.length; i++) {
      const item = data[i]
      const { ptr, size } = item
      for (let j = i + 1; j < data.length; j++) {
        const item2 = data[j]
        const { ptr: ptr2, size: size2 } = item2

        const notOverlap = ptr2 + size2 <= ptr || ptr2 >= ptr + size
        if (notOverlap) continue

        console.error(`overlap: ${ptr} ${size} ${ptr2} ${size2}`)
      }
    }
  }
}

export interface MemMonitorData {
  ptr: number
  size: number
  createTime: number
  isReported: boolean
}

export const memMonitor = new MemMonitor()
