/* global describe it */

import 'babel-polyfill'
import chai from 'chai'
import fifo from '../src/fifo'

chai.should()

describe('fifo', _ => {
  describe('#fifo', _ => {
    it('1st resolve', done => {
      let s = ''

      async function a (arg) {
        return new Promise((resolve, reject) => {
          setTimeout(_ => {
            resolve(arg)
          }, 200)
        })
      }

      async function b (arg) {
        return new Promise((resolve, reject) => {
          setTimeout(_ => {
            resolve(arg)
          }, 100)
        })
      }

      const fifoA = fifo(a)
      const fifoB = fifo(b)

      fifoA(1).then(arg => {
        arg.should.be.equal(1)
        s += 'Hello'
      })
      fifoB(2).then(arg => {
        arg.should.be.equal(2)
        s += 'World'
      })

      setTimeout(_ => {
        s.should.be.equal('HelloWorld')
        done()
      }, 300)
    })

    it('1st reject', done => {
      let s = ''

      async function a () {
        return new Promise((resolve, reject) => {
          setTimeout(_ => {
            reject(new Error('Hi'))
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

      fifoA().catch(err => {
        console.error(`error: ${err.message}`)
        s += err.message
      })

      fifoB().then(_ => {
        s += 'World'
      })

      setTimeout(_ => {
        s.should.be.equal('HiWorld')
        done()
      }, 300)
    })
  })
})
