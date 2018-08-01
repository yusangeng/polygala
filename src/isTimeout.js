/**
 * 检查setImmediate是否是setTimeout模拟的
 *
 * @author Y3G
 */

// FIXME: 会污染全局环境
import 'setimmediate'

/* eslint no-undef: 0 */
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

export default isSetTimeout
