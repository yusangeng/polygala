/**
 * 轮询
 *
 * @author Y3G
 */

const noop = _ => true

export class PollingBase {
  get started () {
    return this.started_
  }

  get stopped () {
    return this.stopped_
  }

  get context () {
    return this.context_
  }

  get delay () {
    return this.delay_
  }

  set delay (val) {
    this.delay_ = val
  }

  get limit () {
    return this.limit_
  }

  get count () {
    return this.count_
  }

  get finished () {
    if (this.limit === 0) {
      return false
    }

    return this.limit === this.count
  }

  constructor (fn, { context = {}, delay = 1000, limit = 0, onError = noop }) {
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
      throw new Error(`Polling instance should ONLY be started once.`)
    }

    this.started_ = true
    this.count_ = 0

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

  stop () {
    this.stopped_ = true

    if (this.timer_) {
      clearTimeout(this.timer_)
      this.timer_ = null
    }
  }

  _setTimer () {
    if (this.stopped || this.finished) {
      return
    }

    this.timer_ = setTimeout(async _ => {
      try {
        await this.fn_(this)
        this.count_++
      } catch (err) {
        const shouldStop = this.onError(err)
        if (shouldStop) {
          this.stop()
        }
      } finally {
        this._setTimer()
      }
    }, this.delay_)
  }
}

export function startPolling (fn, options = {}) {
  const polling = new PollingBase(fn, options)
  polling.start()
  return _ => polling.stop()
}

export default class Polling extends PollingBase {
  constructor (options = {}) {
    super(noop, options)

    this.fn_ = this.exec.bind(this)
    this.onError_ = this.onError.bind(this)
  }

  exec () {
    throw new Error(`Method exec should be overriden by subclass.`)
  }

  onError () {
    console.error(`Error occured during polling, default action is stopping polling.`)
    return true
  }
}
