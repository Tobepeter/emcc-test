import express from 'express'
import cors from 'cors'

/**
 * 适配 emscripten 的 tracing.h
 * 
 * 其实已经放弃了，需要专用服务器才能实现的
 * 而且那个python web项目，非常老旧
 */
const PORT = 3001
const app = express()
const server = app.listen(PORT, () => {
  console.log(`追踪服务器已启动，监听端口 ${PORT}`)
})

// 错误处理
server.on('error', (error) => {
  console.error('服务器错误:', error)
})

// 确保进程不会意外退出
process.on('uncaughtException', (error) => {
  console.error('未捕获的异常:', error)
})

process.on('unhandledRejection', (reason, promise) => {
  console.error('未处理的 Promise 拒绝:', reason)
})

app.use(cors())
app.use(express.json())

app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`)
  console.log('Headers:', req.headers)
  console.log('Body:', req.body)
  next()
})

app.use('/', (req, res) => {
  res.send({
    message: 'ok',
    data: req.body,
  })
})
