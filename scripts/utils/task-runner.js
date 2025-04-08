/**
 * 任务运行器
 *
 * @desc lodash的throttle和debounce都太能满足需求
 *
 * 1. 能执行时候立刻执行
 * 2. 如果不能执行，顺延到下一个周期执行
 *
 * 为了能够播放一个loading，主线程不能卡住，因此任务一般是异步的
 * 异步的话，chokidar可能多次change执行多次
 * 这里做一个异步任务的防抖
 */
export class TaskRunner {
  fn = null
  interval = 1000
  lastRunTime = 0
  timer = null
  isRunning = false

  init(data) {
    const { fn, interval } = data
    this.fn = fn
    interval > 0 && (this.interval = interval)
  }

  stopTimer() {
    if (this.timer) {
      clearTimeout(this.timer)
      this.timer = null
    }
  }

  delayRun(ms) {
    if (this.timer) {
      clearTimeout(this.timer)
    }
    this.timer = setTimeout(() => {
      this.trigger()
    }, ms)
  }

  trigger() {
    if (this.isRunning) {
      this.delayRun(this.interval)
      return
    }

    const now = Date.now()
    const delta = now - this.lastRunTime

    if (delta >= this.interval) {
      this.isRunning = true
      this.fn(this.onFinish)
    } else {
      this.delayRun(this.interval - delta)
    }
  }

  onFinish = () => {
    this.isRunning = false
    this.lastRunTime = Date.now()
  }
}
