/**
 * 任务调度器
 */
class Runner {
  rafId = -1
  tasks: RunnerTaskData[] = []

  isUpdating = false
  isStarted = false
  init() {}

  start() {
    if (this.isStarted) return
    this.isStarted = true
    this.rafId = requestAnimationFrame(this.loop)
  }

  stop() {
    if (this.rafId > -1) {
      cancelAnimationFrame(this.rafId)
      this.rafId = -1
    }
    this.isStarted = false
  }

  private loop = () => {
    this.update()
    this.rafId = requestAnimationFrame(this.loop)
  }

  update() {
    if (this.isUpdating) return
    this.isUpdating = true
    const tasks = this.tasks
    const now = Date.now()
    const removeTasks: RunnerTask[] = []

    for (let i = 0; i < tasks.length; i++) {
      const task = tasks[i]
      const { fn, duration, lastUpdateTime, once } = task
      const isFirst = lastUpdateTime === -1
      const delta = isFirst ? 0 : now - lastUpdateTime
      const param: RunnerTaskParam = { delta, isFirst, lastUpdateTime, now, duration }

      // if have duration, check if it's time to run
      if (duration > 0) {
        if (isFirst || delta >= duration) {
          fn(param)
          task.lastUpdateTime = now
          if (once) removeTasks.push(task.fn)
        }
      } else {
        fn(param)
        if (once) removeTasks.push(task.fn)
      }
    }

    this.isUpdating = false

    for (let i = 0; i < removeTasks.length; i++) {
      this.remove(removeTasks[i])
    }
  }

  add(fn: RunnerTask, options?: RunnerOptions) {
    this.start()
    this.warnIfUpdating()

    if (this.hasTask(fn)) {
      console.warn(`RunnerTask ${fn} already exists`)
      return
    }

    this.tasks.push({
      fn,
      duration: options?.duration ?? 0,
      lastUpdateTime: -1,
      once: options?.once ?? false,
    })

    const remove = () => this.remove(fn)
    return remove
  }

  hasTask(fn: RunnerTask) {
    return this.tasks.some((task) => task.fn === fn)
  }

  remove(fn: RunnerTask) {
    this.warnIfUpdating()

    for (let i = 0; i < this.tasks.length; i++) {
      if (this.tasks[i].fn === fn) {
        this.tasks.splice(i, 1)
        break
      }
    }
  }

  private warnIfUpdating() {
    if (this.isUpdating) {
      console.warn(`RunnerTask cannot be added while updating`)
    }
  }
}

export interface RunnerOptions {
  duration?: number
  once?: boolean
}

export interface RunnerTaskParam {
  delta: number
  isFirst: boolean
  lastUpdateTime: number
  now: number
  duration: number
}

export type RunnerTask = (param?: RunnerTaskParam) => any

interface RunnerTaskData {
  fn: RunnerTask
  duration: number
  lastUpdateTime: number
  once: boolean
}

export const runner = new Runner()
