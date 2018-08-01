/* global describe it */

import 'babel-polyfill'
import chai from 'chai'
import Polling, { PollingBase } from '../src/Polling'

chai.should()

describe('Polling', _ => {
  describe('#PollingBase', _ => {
    it('polling 3 times', done => {
      let i = 0
      const pl = new PollingBase(pl => {
        pl.context.i.should.be.equal(0)
        i++
      }, {
        context: {
          i: 0
        },
        delay: 10,
        limit: 3
      })

      pl.start()

      setTimeout(_ => {
        i.should.be.equal(3)
        done()
      }, 100)
    })
  })

  describe('#Polling', _ => {
    it('exec', done => {
      class MyPolling extends Polling {
        constructor (...params) {
          super(...params)
          this.i = 0
        }

        exec () {
          this.i++
        }
      }

      const pl = new MyPolling({ limit: 3, delay: 10 })
      pl.start()

      setTimeout(_ => {
        pl.i.should.be.equal(3)
        done()
      }, 100)
    })

    it('onError', done => {
      class MyPolling extends Polling {
        constructor (...params) {
          super(...params)
          this.i = 0
        }

        exec () {
          throw new Error('xxx')
        }

        onError (err) {
          err.message.should.be.equal('xxx')
          return false
        }
      }

      const pl = new MyPolling({ delay: 10 })
      pl.start()

      setTimeout(_ => {
        done()
      }, 100)
    })
  })
})
