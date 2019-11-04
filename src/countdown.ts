/**
 * 倒计时
 *
 * @author Y3G
 */

import poll from './poll'
import { noop } from './utils'

export class CountDown {
  private stopPoll: () => void = noop
  private handleTimeout: (total: number, countdown: CountDown) => void = noop
  private handleTick: (residue: number, total: number, countdown: CountDown) => void = noop
  private interval: number
  private total: number = 0
  private residue: number = 0

  paused: boolean = false

  set onTimeout(callback: (total: number, countdown: CountDown) => void) {
    this.handleTimeout = callback
  }

  set onTick(callback: (residue: number, total: number, countdown: CountDown) => void) {
    this.handleTick = callback
  }

  constructor(interval: number = 1000) {
    if (interval <= 0) {
      throw new Error(`interval should be greater than 0.`)
    }

    this.interval = interval
  }

  start(total: number) {
    if (total <= 0) {
      throw new Error(`totalSeconds should be greater than 0.`)
    }

    this.stop()
    this.total = total
    this.residue = total

    this.stopPoll = poll(this._handlePolling.bind(this), {
      delay: this.interval
    })
  }

  pause() {
    this.paused = true
  }

  resume() {
    this.paused = false
  }

  stop() {
    const { stopPoll } = this

    stopPoll()
    this.stopPoll = noop
    this.residue = 0
  }

  private _handlePolling() {
    let { residue, paused } = this

    if (paused || residue === 0) {
      return
    }

    this.residue -= 1
    residue = this.residue

    let { total, handleTick, handleTimeout, stopPoll } = this

    try {
      handleTick(residue, total, this)
    } finally {
      if (residue === 0) {
        stopPoll()
        this.stopPoll = noop
        handleTimeout(total, this)
      }
    }
  }
}

export type CountDownOptions = {
  interval?: number
  total: number
  onTimeout?: (total: number, countdown: CountDown) => void
  onTick?: (residue: number, total: number, countdown: CountDown) => void
}

export function countdown(options: CountDownOptions) {
  const { interval, total, onTimeout = noop, onTick = noop } = options
  const ret = new CountDown(interval)

  ret.onTimeout = onTimeout
  ret.onTick = onTick

  ret.start(total)

  return ret
}

export default countdown
