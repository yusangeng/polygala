/**
 * 在浏览器中模拟异步任务
 *
 * @author Y3G
 */

import immediate from 'immediate'

type FProcedure = (...args: any[]) => void

let microTaskCount = 0

export function microTask<Fn extends FProcedure>(fn: Fn): Fn {
  const retFn = (...args: any[]) => {
    immediate(() => {
      ++microTaskCount

      try {
        fn(...args)
      } finally {
        --microTaskCount
      }
    })
  }

  return retFn as Fn
}

export function macroTask<Fn extends FProcedure>(fn: Fn): Fn {
  const retFn = (...args: any[]) => {
    setTimeout(() => {
      if (!microTaskCount) {
        // immediate有可能是setTimeout模拟的
        // 所以要先检查有没有还没完成的immediate调用
        fn(...args)
        return
      }

      const next = macroTask(fn)
      next(...args)
    }, 0)
  }

  return retFn as Fn
}

export const micro = microTask
export const macro = macroTask
