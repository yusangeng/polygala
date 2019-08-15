/* global describe it */

import chai from 'chai'
import { poll } from '../src/poll'

chai.should()

describe('poll', () => {
  describe('#util', () => {
    it('should return a right value', done => {
      let i = 0

      poll(
        async () => {
          return i++
        },
        {
          delay: 100
        }
      )
        .until((curr: any) => {
          return curr > 2
        })
        .then((data: any) => {
          data.should.be.equal(3)
          done()
        })
    })

    it('should time out', done => {
      let i = 0

      poll(
        async () => {
          return i++
        },
        {
          delay: 100
        }
      )
        .until((curr: any) => {
          return curr > 2
        }, 200)
        .catch(err => {
          done()
        })
    })
  })
})
