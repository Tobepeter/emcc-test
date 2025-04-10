import { axiosClient } from './axios-clent'

class Track {
  port = 3000 // TODO: read from env

  api = {
    msg: '/api/msg',
    flush: '/api/flush',
    finish: '/api/finish',
    clear: '/api/clear',
  }

  msgList: string[] = []
  timer = -1

  // TODO: health check

  async msg(message: string) {
    console.log('[track] msg', message)
    this.msgList.push(message)
    this.startUpdate()
  }

  startUpdate() {
    if (this.timer !== -1) return

    this.timer = setInterval(() => {
      this.flushMsgList()
    }, 1000)
  }

  stopUpdate() {
    if (this.timer !== -1) {
      clearInterval(this.timer)
      this.timer = -1
    }
  }

  async flushMsgList() {
    if (this.msgList.length === 0) return

    await axiosClient.track.post(this.api.flush, { messages: this.msgList })
    this.msgList = []
  }

  async flush() {
    await axiosClient.track.post(this.api.flush)
  }

  async finish() {
    await axiosClient.track.post(this.api.finish)
  }

  async clear() {
    await axiosClient.track.post(this.api.clear)
  }
}

export const track = new Track()
