import { axiosClient } from './axios-clent'

class Track {
  port = 3000 // TODO: read from env

  api = {
    msg: '/api/msg',
    flush: '/api/flush',
    finish: '/api/finish',
    clear: '/api/clear',
  }

  // TODO: health check

  async msg(message: string) {
    console.log('[track] msg', message)
    await axiosClient.track.post(this.api.msg, { message })
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
