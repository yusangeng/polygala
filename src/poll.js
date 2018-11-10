/**
 * 轮询
 *
 * @author Y3G
 */

const goon = _ => false

export class Polling {
  get context () {
    return this.context_
  }

  get started () {
    return this.started_
  }

  get stopped () {
    return this.stopped_
  }

  get delay () {
    return this.delay_
  }

  get limit () {
    return this.limit_
  }

  get count () {
    return this.count_
  }

  get finished () {
    if (this.limit <= 0) {
      return false
    }

    return this.limit === this.count
  }

  constructor (fn, { context = {}, delay = 1000, limit = 0, onError = goon }) {
    this.fn_ = fn
    this.context_ = context
    this.delay_ = delay
    this.limit_ = limit
    this.count_ = 0
    this.onError_ = onError
    this.timer_ = null
    this.started_ = false
    this.stopped_ = false
  }

  async start () {
    if (this.started) {
      throw new Error(`Polling should ONLY be started once.`)
    }

    this.started_ = true
    this.count_ = 0
    this._onTimeout()
  }

  stop () {
    this.stopped_ = true

    if (this.timer_) {
      clearTimeout(this.timer_)
      this.timer_ = null
    }
  }

  _nextTimer () {
    if (this.stopped || this.finished) {
      return
    }

    this.timer_ = setTimeout(this._onTimeout.bind(this), this.delay)
  }

  async _onTimeout () {
    try {
      await this.fn_(this)
      this.count_++
    } catch (err) {
      const shouldStop = this.onError_(err)
      if (shouldStop) {
        this.stop()
      }
    } finally {
      this._setTimer()
    }
  }
}

export function poll (fn, options = {}) {
  const polling = new Polling(fn, options)
  polling.start()
  return _ => polling.stop()
}

// 兼容老版本
export const startPolling = poll
export default poll
