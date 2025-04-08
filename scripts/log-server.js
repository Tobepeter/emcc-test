import dayjs from 'dayjs'
import { dirname } from 'dirname-filename-esm'
import express from 'express'
import fs from 'fs'
import path from 'path'
import { ensureDirExists } from './utils/path-util.js'

const __dirname = dirname(import.meta)

class LoggerServer {
  config = {
    logFileDir: path.join(__dirname, '../temp'),
    logFileName: 'track',
    logFileExt: '.log',
    flushInterval: 1000,
    // TODO: 待实现，一定时间没有flush内容，进入sleep模式·
    // sleepInterval: 1000,
    port: 3000,
    timeStamp: true,
    api: {
      msg: '/api/msg',
      finish: '/api/finish',
      flush: '/api/flush',
      clean: '/api/clean',
    },
  }

  logFilePath = ''

  /** @type {{msg: string, count: number, timeStamp: number}[]} */
  logList = []
  app = null
  server = null
  lastFlushTime = Date.now()

  constructor(config = {}) {
    this.config = { ...this.config, ...config }
    // console.log('config', this.config)

    const { logFileDir, logFileName, logFileExt } = this.config
    this.logFilePath = path.join(logFileDir, `${logFileName}${logFileExt}`)
  }

  start() {
    this.preprareFile()
    this.setupExpress()
    this.startFlushTimer()
    this.setupSignalHandlers()
  }

  preprareFile() {
    ensureDirExists(this.config.logFileDir)
    fs.writeFileSync(this.logFilePath, '')
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

    this.app.post(this.config.api.clean, (req, res) => {
      this.clean()
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
    const { logFilePath, logList } = this

    if (logList.length > 0) {
      let logContent = ''
      let prefix = ''
      let timeStr = ''
      for (const log of logList) {
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

      fs.appendFileSync(logFilePath, logContent)
    }

    // 如果是finish，额外备份一份
    if (finish) {
      const isEmpty = fs.readFileSync(logFilePath, 'utf8').length === 0

      if (!isEmpty) {
        const timeStr = dayjs().format('YYYY-MM-DD HH:mm:ss')
        const newLogFile = logFilePath.replace('.log', `-${timeStr}.log`)
        fs.copyFileSync(logFilePath, newLogFile)
      }
    }

    logList.length = 0
    this.lastFlushTime = new Date()
  }

  clean() {
    const { logFilePath } = this
    const logDir = path.dirname(logFilePath)
    const files = fs.readdirSync(logDir)
    files.forEach((file) => {
      // 只删除 logFileName 开头的文件
      if (file.startsWith(this.config.logFileName)) {
        fs.unlinkSync(path.join(logDir, file))
      }
    })
    this.preprareFile()
  }
}

function main() {
  const server = new LoggerServer()
  server.start()
}

main()
