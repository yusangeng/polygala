/**
 * 异步任务
 *
 * @author Y3G
 */

import isSetTimeout from './isSetTimeout'

export function microTask (fn) {
  return (...params) => setImmediate(_ => fn(...params))
}

export function macroTask (fn) {
  if (isSetTimeout) {
    // setImmediate可能是用setTimeout模拟的, 这里做两次setTimeout, 可以保证次序
    return (...params) => setTimeout(_ => {
      setTimeout(_ => fn(...params), 0)
    }, 0)
  }

  return (...params) => setTimeout(_ => fn(...params), 0)
}
