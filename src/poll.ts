/**
 * 轮询
 *
 * @author Y3G
 */

export type PollingFunc<ContextType> = (p: Polling<ContextType>) => void
export type ErrorCallback = (error: Error) => boolean

export type PollingOptions<ContextType> = {
  context?: ContextType
  delay?: number
  limit?: number
  onError?: ErrorCallback
}

function goon (error: Error) {
  return false
}

const getDefaultPollingOptions = () => {
  return {
    context: {},
    delay: 1000,
    limit: 0,
    onError: goon
  }
}

export class Polling<ContextType> {
  private fn: PollingFunc<ContextType>
  private delay: number
  private limit: number
  private onError: ErrorCallback

  private count: number = 0
  private timer: any = null

  readonly context: ContextType
  started: boolean = false
  stopped: boolean = false

  get finished () : boolean {
    if (this.limit <= 0) {
      return false
    }

    return this.limit === this.count
  }

  constructor (fn: PollingFunc<ContextType>,
    options: PollingOptions<ContextType> = {}) {
    const opt = Object.assign(getDefaultPollingOptions(), options)

    this.context = opt.context
    this.delay = opt.delay
    this.limit = opt.limit
    this.onError = opt.onError

    this.fn = fn
  }

  async start () {
    if (this.started) {
      throw new Error(`Polling should ONLY be started once.`)
    }

    this.started = true
    this.count = 0
    this._onTimeout()
  }

  stop () {
    this.stopped = true

    if (this.timer) {
      clearTimeout(this.timer)
      this.timer = null
    }
  }

  private _nextTimer () {
    if (this.stopped || this.finished) {
      return
    }

    this.timer = setTimeout(this._onTimeout.bind(this), this.delay)
  }

  private async _onTimeout () {
    if (this.stopped) {
      return
    }

    try {
      this.count++
      await this.fn(this)
    } catch (err) {
      const shouldStop = this.onError(err)
      if (shouldStop) {
        this.stop()
      }
    } finally {
      this._nextTimer()
    }
  }
}

export type StopFunc = () => void

export function poll<ContextType> (fn: PollingFunc<ContextType>,
  options: PollingOptions<ContextType> = {}) : StopFunc {
  const polling = new Polling(fn, options)
  polling.start()
  return () => polling.stop()
}

// 兼容老版本
export const startPolling = poll
export default poll
