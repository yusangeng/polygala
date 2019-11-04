/**
 * 轮询
 *
 * @author Y3G
 */

import { noop, goon } from './utils'

export type FPolling<ContextType> = (p: Polling<ContextType>) => any
export type FErrorCallback = (error: Error) => boolean
export type FStopCallback = () => void

export type PollingOptions<ContextType> = {
  context?: ContextType
  delay?: number
  limit?: number
  onError?: FErrorCallback
  onStop?: FStopCallback
}

const getDefaultPollingOptions = () => {
  return {
    context: {},
    delay: 1000,
    limit: 0,
    onError: goon,
    onStop: noop
  }
}

export class Polling<ContextType> {
  private fn: FPolling<ContextType>
  private delay: number
  private limit: number
  private handleError: FErrorCallback
  private handleStop: FStopCallback

  private count: number = 0
  private timer: any = null

  readonly context: ContextType
  started: boolean = false
  stopped: boolean = false

  get finished(): boolean {
    if (this.limit <= 0) {
      return false
    }

    return this.limit === this.count
  }

  constructor(fn: FPolling<ContextType>, options: PollingOptions<ContextType> = {}) {
    const opt = Object.assign(getDefaultPollingOptions(), options)
    const { context, delay, limit, onError, onStop } = opt

    this.context = context
    this.delay = delay
    this.limit = limit
    this.handleError = onError
    this.handleStop = onStop
    this.fn = fn
  }

  async start() {
    if (this.started) {
      throw new Error(`Polling should ONLY be started once.`)
    }

    this.started = true
    this.count = 0
    this._onTimeout()
  }

  stop() {
    this.stopped = true

    if (this.timer) {
      clearTimeout(this.timer)
      this.timer = null

      if (this.handleStop) {
        this.handleStop()
      }
    }
  }

  private _nextTimer() {
    if (this.stopped || this.finished) {
      return
    }

    this.timer = setTimeout(this._onTimeout.bind(this), this.delay)
  }

  private async _onTimeout() {
    if (this.stopped) {
      return
    }

    try {
      this.count++
      await this.fn(this)
    } catch (err) {
      const shouldStop = this.handleError(err)
      if (shouldStop) {
        this.stop()
      }
    } finally {
      this._nextTimer()
    }
  }
}

export type FStop = () => void
export type FCompare<ValueType> = (curr: ValueType, prev: ValueType) => boolean
export type FUntil<ValueType> = (compare: FCompare<ValueType>, timeout?: number) => Promise<ValueType>

export type PollRetType<ValueType> = {
  (): void
  polling: {
    stop: FStop
  }
  until: FUntil<ValueType>
}

export function poll<ContextType, RetType>(
  fn: FPolling<ContextType>,
  options: PollingOptions<ContextType> = {}
): PollRetType<RetType> {
  var pollingContext: any = {
    lastRet: void 0,
    until: null,
    onStop: null
  }

  const polling = new Polling(
    async (p: Polling<ContextType>) => {
      const ret = await fn(p)
      const { lastRet, until } = pollingContext

      if (until) {
        pollingContext.lastRet = ret

        if (until(ret, lastRet)) {
          polling.stop()
        }
      }
    },
    {
      ...options,
      onStop: () => {
        const { onStop: onStopOfPollingContext, lastRet } = pollingContext
        const { onStop: onStopOfOptions } = options

        if (onStopOfPollingContext) onStopOfPollingContext(lastRet)
        if (onStopOfOptions) onStopOfOptions()
      }
    }
  )

  polling.start()

  const retFn: any = () => {
    polling.stop()
  }

  retFn.polling = polling
  retFn.until = (fn: FCompare<RetType> = () => false, timeout: number = 0) => {
    return new Promise((resolve, reject) => {
      if (timeout > 0) {
        setTimeout(() => reject(new Error('Time out.')))
      }

      pollingContext.until = fn
      pollingContext.onStop = (value: RetType) => resolve(value)
    })
  }

  return retFn as PollRetType<RetType>
}

// 兼容老版本
export const startPolling = poll
export default poll
