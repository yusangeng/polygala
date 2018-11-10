/* global describe it */

import 'babel-polyfill'
import chai from 'chai'
import quittable from '../src/quittable'
import sleep from '../src/sleep'

chai.should()

describe('quittable', _ => {
  describe('#quittable', _ => {
    it('should have right context', async () => {
      const task = quittable(async task => {
        task.context.time.should.be.equal(100)
      }, null, {
        time: 100
      })

      await task.run()
    })

    it('should quit', async () => {
      let i = 0

      const task = quittable(async task => {
        while (!task.quitted) {
          await sleep(task.context.time)
          i++

          if (i === 5) {
            task.quit()
          }
        }

        return i
      }, null, {
        time: 100
      })

      const ret = await task.run()

      ret.should.be.equal(5)
    })

    it('should quit prev task', () => {
      let i = 0

      const task1 = quittable(async task => {
        await sleep(100)

        if (!task.quitted) {
          i += 2
        }
      }, 'foobar')

      const task2 = quittable(async task => {
        await sleep(200)

        if (!task.quitted) {
          i += 3
        }
      }, 'foobar')

      return Promise.all([task1.run(), task2.run()]).then(_ => {
        i.should.be.equal(3)
        return Promise.resolve()
      })
    })

    it('should throw error', async () => {
      const task = quittable(async task => {
        await sleep(100)
        throw new Error('xxx')
      })

      let flag = false

      try {
        await task.run()
      } catch (err) {
        err.message.should.be.equal('xxx')
        flag = true
      }

      flag.should.be.equal(true)
    })

    it('should NOT throw error', async () => {
      const task = quittable(async task => {
        await sleep(300)
        throw new Error('xxx')
      })

      let flag = false

      try {
        setTimeout(_ => {
          task.quit()
        }, 100)

        await task.run()
      } catch (err) {
        flag = true
      }

      flag.should.be.equal(false)
    })
  })
})
