import axios, { AxiosInstance } from 'axios'
import { track } from './track'

class AxiosClient {
  track: AxiosInstance

  init() {
    axios.defaults.timeout = 3000
    this.track = axios.create({
      baseURL: `http://localhost:${track.port}`,
    })
  }
}

export const axiosClient = new AxiosClient()
