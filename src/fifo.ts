/**
 * 先进先出的任务队列
 *
 * @author Y3G
 */

import { noop } from './utils'

enum FIFOStatus {
  PENDING,
  WAITTING
}

type Func = (...args: any[]) => any
type AsyncFunc<RetType> = (...args: any[]) => Promise<RetType>

type QueueItem = {
  id: number
  status: FIFOStatus
  callback: () => void
}

class FIFO {
  private queue: Array<QueueItem> = []
  private currId: number = 0

  transform<RetType, Fn extends AsyncFunc<RetType>>(fn: Fn): Fn {
    const self = this
    const id = this.currId++

    const retFn = function retFn(this: any, ...args: any[]) {
      const runtimeThis: any = this

      return new Promise(async (resolve, reject) => {
        let ret

        try {
          ret = await fn.call(runtimeThis, ...args)
        } catch (err) {
          self._handleResult(id, reject.bind(null, err))
          return
        }

        self._handleResult(id, resolve.bind(null, ret))
      })
    }

    this.queue.push({ id, status: FIFOStatus.PENDING, callback: noop })

    return retFn as Fn
  }

  private _handleResult(id: number, callback: Func): void {
    const { queue } = this
    const item = queue.find(el => el.id === id)

    item!.status = FIFOStatus.WAITTING
    item!.callback = callback

    this._checkWaitingItems()
  }

  private _checkWaitingItems(): void {
    const { queue } = this

    while (queue.length) {
      const item = queue[0]
      const { status, callback } = item

      if (status === FIFOStatus.PENDING) {
        break
      } else {
        callback()
        queue.shift()
      }
    }
  }
}

const fifos: any = {}
const defaultName = Symbol('__DEFAULT_FIFO__')

export function fifo<Fn extends AsyncFunc<void>>(fn: Fn, queueName?: symbol): Fn
export function fifo<RetType, Fn extends AsyncFunc<RetType>>(fn: Fn, queueName?: symbol): Fn

export function fifo(fn: any, queueName = defaultName) {
  let fifo = fifos[queueName] as FIFO

  if (!fifo) {
    fifo = fifos[queueName] = new FIFO()
  }

  return fifo.transform(fn)
}

export default fifo
