/* global describe it */

import chai from 'chai'
import fifo from '../src/fifo'

chai.should()

describe('fifo', () => {
  describe('#fifo', () => {
    it('1st resolve', done => {
      let s = ''

      function a (arg: number) : Promise<number> {
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve(arg)
          }, 200)
        })
      }

      function b (arg: number, b: string) : Promise<number> {
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve(arg)
          }, 100)
        })
      }

      const fifoA = fifo(a)
      const fifoB = fifo(b)

      fifoA(1).then((arg: number) => {
        arg.should.be.equal(1)
        s += 'Hello'
      })

      fifoB(2, '').then((arg: number) => {
        arg.should.be.equal(2)
        s += 'World'
      })

      setTimeout(() => {
        s.should.be.equal('HelloWorld')
        done()
      }, 300)
    })

    it('1st reject', done => {
      let s = ''

      function a () : Promise<void> {
        return new Promise((resolve, reject) => {
          setTimeout(() => {
            reject(new Error('Hi'))
          }, 200)
        })
      }

      function b () : Promise<void> {
        return new Promise((resolve, reject) => {
          setTimeout(() => {
            resolve()
          }, 100)
        })
      }

      const foobarName = Symbol('foobar')

      const fifoA = fifo(a, foobarName)
      const fifoB = fifo(b, foobarName)

      fifoA().catch((err: Error) => {
        console.error(`error: ${err.message}`)
        s += err.message
      })

      fifoB().then(() => {
        s += 'World'
      })

      setTimeout(() => {
        s.should.be.equal('HiWorld')
        done()
      }, 300)
    })
  })
})
