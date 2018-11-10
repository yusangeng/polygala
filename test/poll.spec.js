/* global describe it */

import 'babel-polyfill'
import chai from 'chai'
import poll from '../src/poll'

chai.should()

describe('poll', _ => {
  describe('#poll', _ => {
    it('should have right context', done => {
      let i = 0

      poll(async polling => {
        polling.context.flag.should.be.equal(true)
      }, {
        delay: 100,
        limit: 1,
        onError: err => {
          void err
          i = 1
        },
        context: {
          flag: true
        }
      })

      setTimeout(_ => {
        i.should.be.equal(0)
        done()
      }, 500)
    })

    it('should poll 3 times', done => {
      let i = 0

      poll(async polling => {
        i++
      }, {
        delay: 100,
        limit: 3
      })

      setTimeout(_ => {
        i.should.be.equal(3)
        done()
      }, 500)
    })

    it('should poll 3 times with error', done => {
      let i = 0

      poll(async polling => {
        i++
        throw new Error('')
      }, {
        delay: 100,
        limit: 3
      })

      setTimeout(_ => {
        i.should.be.equal(3)
        done()
      }, 500)
    })

    it('should stop on error', done => {
      let i = 0

      poll(async polling => {
        i++

        if (i === 2) {
          throw new Error('xxx')
        }
      }, {
        delay: 100,
        limit: 3,
        onError: err => {
          void err
          // console.log(err.message)
          return true
        }
      })

      setTimeout(_ => {
        i.should.be.equal(2)
        done()
      }, 500)
    })

    it('should stop when polling.stop was called', done => {
      let i = 0

      poll(async polling => {
        i++

        if (i === 2) {
          polling.stop()
        }
      }, {
        delay: 100,
        limit: 3
      })

      setTimeout(_ => {
        i.should.be.equal(2)
        done()
      }, 500)
    })

    it('should stop', done => {
      let i = 0

      const stop = poll(async polling => {
        i++
      }, {
        delay: 100
      })

      setTimeout(_ => {
        stop()
      }, 250)

      setTimeout(_ => {
        i.should.be.equal(3)
        done()
      }, 500)
    })
  })
})
