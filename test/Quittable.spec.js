/* global describe it */

import 'babel-polyfill'
import chai from 'chai'
import Quittable from '../src/Quittable'

chai.should()

describe('Quittable', _ => {
  describe('#Quittable', _ => {
    class MyQuittable extends Quittable {
      constructor (...params) {
        super(...params)
        this.i = 0
      }

      async exec () {
        return new Promise((resolve, reject) => {
          setTimeout(_ => {
            if (!this.quitted) {
              this.i = 1
            }

            resolve()
          }, 100)
        })
      }
    }

    it('exec', done => {
      const q = new MyQuittable()
      q.run()

      setTimeout(_ => {
        q.i.should.be.equal(1)
        done()
      }, 200)
    })

    it('quit', done => {
      const q = new MyQuittable()
      q.run()

      setTimeout(_ => {
        q.quit()
      }, 50)

      setTimeout(_ => {
        q.i.should.be.equal(0)
        done()
      }, 200)
    })
  })
})
