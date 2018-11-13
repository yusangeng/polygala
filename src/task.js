/**
 * 异步任务
 *
 * @author Y3G
 */

import immediate from 'immediate'

let pendinngCount = 0

export function microTask (fn) {
  return (...args) => immediate(_ => {
    ++pendinngCount

    try {
      fn(...args)
    } finally {
      --pendinngCount
    }
  })
}

export function macroTask (fn) {
  return (...args) => {
    setTimeout(_ => {
      if (!pendinngCount) {
        // immediate有可能是setTimeout模拟的
        // 所以要先检查有没有还没完成的immediate调用
        fn(...args)
        return
      }

      macroTask(fn)(...args)
    }, 0)
  }
}

export const micro = microTask
export const macro = macroTask
