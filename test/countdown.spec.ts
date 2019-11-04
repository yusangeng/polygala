/* global describe it */

import chai from 'chai'
import sleep from '../src/sleep'
import countdown from '../src/countdown'

chai.should()

describe('countdown', () => {
  describe('#countdown', () => {
    it('should be invoke timeout & tick callback', done => {
      let counter = 0

      countdown({
        interval: 100,
        total: 10,
        onTimeout: total => {
          total.should.be.equal(10)
          done()
        },
        onTick: (residue, total) => {
          counter += 1
          try {
            residue.should.be.equal(total - counter)
            total.should.be.equal(10)
          } catch (err) {
            counter -= 1
          }
        }
      })
    })

    it('pause & resume', async () => {
      let counter = 0

      const cd = countdown({
        interval: 100,
        total: 10,
        onTick: () => {
          counter += 1
        }
      })

      await sleep(50)
      counter.should.be.equal(1)
      await sleep(100)
      counter.should.be.equal(2)
      cd.pause()
      await sleep(200)
      counter.should.be.equal(2)
      cd.resume()
      await sleep(1000)
      counter.should.be.equal(10)
    })
  })
})
