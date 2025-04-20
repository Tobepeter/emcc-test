import { axiosClient } from './axios-client'
import { runner } from './runner'

class Track {
  port = 3000 // TODO: read from env

  /**
   * 是否开启追踪
   * 如果不开启，为仅在控制台打印
   */
  enable = false

  api = {
    msg: '/api/msg',
    flush: '/api/flush',
    finish: '/api/finish',
    clear: '/api/clear',
  }

  private msgList: string[] = []

  // TODO: health check

  private isInit = false

  init() {
    if (this.isInit) return
    this.isInit = true
    runner.add(() => this.flushMsgList(), { duration: 1000 })
  }

  async msg(message: string) {
    if (!message) return
    console.log('[track] msg', message)
    if (this.enable) {
      this.msgList.push(message)
    }
  }

  async flushMsgList() {
    if (this.msgList.length === 0) return

    try {
      await axiosClient.track.post(this.api.flush, { messages: this.msgList })
    } finally {
      // 如果失败了，也要清空掉，比如服务器没有启动，防止一直发起
      this.msgList = []
    }
  }

  async flush() {
    if (!this.enable) return
    await axiosClient.track.post(this.api.flush)
  }

  async finish() {
    if (!this.enable) return
    await axiosClient.track.post(this.api.finish)
  }

  async clear() {
    if (!this.enable) return
    await axiosClient.track.post(this.api.clear)
  }
}

export const track = new Track()
