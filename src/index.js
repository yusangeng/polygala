/**
 * 异步任务
 *
 * @author Y3G
 */

// FIXME: 会污染全局环境
import 'setimmediate'

const g = typeof self === 'undefined' ? (typeof global === 'undefined' ? this : global) : self
const doc = g.document

function canUsePostMessage () {
  if (g.postMessage && !g.importScripts) {
    var postMessageIsAsynchronous = true
    var oldOnMessage = g.onmessage

    g.onmessage = function () {
      postMessageIsAsynchronous = false
    }

    g.postMessage('', '*')
    g.onmessage = oldOnMessage

    return postMessageIsAsynchronous
  }
}

let isSetTimeout = true

// 以下判断方法和setimmediate.js相同, 目的是判断setImmediate是否为使用setTimout模拟
if ({}.toString.call(global.process) === '[object process]' ||
  canUsePostMessage() || g.MessageChannel ||
  (doc && 'onreadystatechange' in doc.createElement('script'))) {
  isSetTimeout = false
}

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
