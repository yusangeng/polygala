/* global describe it */

import 'babel-polyfill'
import chai from 'chai'
import fifo from '../src/fifo'

chai.should()

describe('fifo', _ => {
  describe('#fifo', _ => {
    it('usage', done => {
      let s = ''

      async function a () {
        return new Promise((resolve, reject) => {
          setTimeout(_ => {
            resolve()
          }, 200)
        })
      }

      async function b () {
        return new Promise((resolve, reject) => {
          setTimeout(_ => {
            resolve()
          }, 100)
        })
      }

      const fifoA = fifo(a)
      const fifoB = fifo(b)

      fifoA().then(_ => {
        s += 'Hello'
      })
      fifoB().then(_ => {
        s += 'World'
      })

      setTimeout(_ => {
        s.should.be.equal('HelloWorld')
        done()
      }, 300)
    })
  })
})
