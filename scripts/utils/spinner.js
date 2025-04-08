import chalk from 'chalk'
import ora from 'ora'

/**
 * 终端加载动画
 *
 * 传递一个text，如 build
 * 执行过程中，不断的追加 build...(1s)
 * 执行结束，显示 build success
 */
class Spinner {
  ins = null
  startTime = null
  timer = null
  text = 'loading'

  dotCount = 0
  dotInterval = 200

  constructor() {
    this.ins = ora()
  }

  start(text = 'loading') {
    this.text = text
    this.startTime = Date.now()

    const { ins } = this
    ins.start(text)
    this.startUpdate()
  }

  startUpdate() {
    this.stopUpdate()
    this.dotCount = 0

    this.updateText()
    this.timer = setInterval(() => {
      this.updateText()
    }, this.dotInterval)
  }

  updateText() {
    const { ins } = this
    const dotStr = '.'.repeat(this.dotCount)
    ins.text = `${this.text} (${this.getElapsed()}s) ${dotStr}`
    this.dotCount++
    if (this.dotCount > 3) {
      this.dotCount = 0
    }
  }

  getElapsed() {
    return Math.floor((Date.now() - this.startTime) / 1000)
  }

  stopUpdate() {
    if (this.timer) {
      clearInterval(this.timer)
      this.timer = null
    }
  }

  succeed(text = this.text) {
    this.stopUpdate()
    const elapsed = this.getElapsed()
    this.ins.succeed(`${text} done (${elapsed}s)`)
  }

  fail(text = this.text) {
    this.stopUpdate()
    const elapsed = this.getElapsed()
    this.ins.fail(`${text} failed (${elapsed}s)`)
  }
}

export const spinner = new Spinner()
