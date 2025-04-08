import dayjs from 'dayjs'
import express from 'express'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { ensureDirExists } from './utils/path-util.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

class LoggerServer {
  config = {
    logFile: path.join(__dirname, '../temp', 'track.log'),
    flushInterval: 1000,
    // TODO: 待实现，一定时间没有flush内容，进入sleep模式·
    // sleepInterval: 1000,
    port: 3000,
    timeStamp: true,
    api: {
      msg: '/api/msg',
      finish: '/api/finish',
      flush: '/api/flush',
    },
  }

  /** @type {{msg: string, count: number, timeStamp: number}[]} */
  logList = []
  app = null
  server = null
  lastFlushTime = Date.now()

  constructor(config = {}) {
    this.config = { ...this.config, ...config }
    // console.log('config', this.config)
  }

  start() {
    this.preprareFile()
    this.setupExpress()
    this.startFlushTimer()
    this.setupSignalHandlers()
  }

  preprareFile() {
    const logDir = path.dirname(this.config.logFile)
    ensureDirExists(logDir)
    fs.writeFileSync(this.config.logFile, '')
  }

  setupExpress() {
    this.app = express()
    this.app.use(express.json())
    this.app.use(express.urlencoded({ extended: true }))

    // API 端点
    this.app.post(this.config.api.msg, (req, res) => {
      const message = req.body.message
      if (!message) {
        return res.status(400).json({ error: 'Message is required' })
      }
      this.push(message)
      res.json({ success: true })
    })

    this.app.post(this.config.api.finish, (req, res) => {
      this.flush(true)
      res.json({ success: true })
    })

    this.app.post(this.config.api.flush, (req, res) => {
      this.flush()
      res.json({ success: true })
    })

    this.server = this.app.listen(this.config.port, () => {
      console.log(`Logger server listening on port ${this.config.port}`)
    })
  }

  startFlushTimer() {
    setInterval(() => {
      this.flush()
    }, this.config.flushInterval)
  }

  setupSignalHandlers() {
    console.log('\n按 Ctrl + C 结束程序')
    process.on('SIGINT', () => {
      this.flush(true) // 确保在退出前写入所有日志
      if (this.server) {
        this.server.close()
      }
      process.exit(0)
    })
  }

  push(message) {
    // 查找是否已存在相同消息
    const existingLog = this.logList.find((log) => log.msg === message)
    if (existingLog) {
      existingLog.count++
    } else {
      this.logList.push({
        msg: message,
        count: 1,
        timeStamp: dayjs().toDate(),
      })
    }
  }

  flush(finish = false) {
    if (this.logList.length > 0) {
      let logContent = ''
      let prefix = ''
      let timeStr = ''
      for (const log of this.logList) {
        prefix = ''
        if (this.config.timeStamp) {
          timeStr = dayjs(log.timeStamp).format('HH:mm')
          prefix = `[${timeStr}] `
        }
        if (log.count > 1) {
          logContent += `${prefix}(+${log.count}) ${log.msg}\n`
        } else {
          logContent += `${prefix}${log.msg}\n`
        }
      }

      fs.appendFileSync(this.config.logFile, logContent)
    }

    // 如果是finish，额外备份一份
    if (finish) {
      const timeStr = dayjs().format('YYYY-MM-DD HH:mm:ss')
      const newLogFile = this.config.logFile.replace('.log', `-${timeStr}.log`)
      fs.copyFileSync(this.config.logFile, newLogFile)
    }

    this.logList = [] // 清空日志列表
    this.lastFlushTime = new Date()
  }
}

function main() {
  const server = new LoggerServer()
  server.start()
}

main()
