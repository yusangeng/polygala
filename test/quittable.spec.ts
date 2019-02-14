/* global describe it */

import chai from 'chai'
import quittable, { namedQuittable } from '../src/quittable'
import sleep from '../src/sleep'

chai.should()

const nameFoobar = Symbol('foobar')

describe('quittable', () => {
  describe('#quittable', () => {
    it('should have right context', async () => {
      const task = quittable({
        time: 100
      }, async task => {
        task.context.time.should.be.equal(100)
      })

      await task.run()
    })

    it('should quit', async () => {
      let i = 0

      const task = quittable({
        time: 100
      }, async task => {
        while (!task.quitted) {
          await sleep(task.context.time)
          i++

          if (i === 5) {
            task.quit()
          }
        }

        return i
      })

      const ret = await task.run()

      ret.should.be.equal(5)
    })

    it('should quit prev task', () => {
      let i = 0

      const task1 = namedQuittable(nameFoobar, {}, async task => {
        await sleep(100)

        if (!task.quitted) {
          i += 2
        }
      })

      const task2 = namedQuittable(nameFoobar, {}, async task => {
        await sleep(200)

        if (!task.quitted) {
          i += 3
        }
      })

      return Promise.all([task1.run(), task2.run()]).then(() => {
        i.should.be.equal(3)
        return Promise.resolve()
      })
    })

    it('should throw error', async () => {
      const task = quittable({}, async task => {
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

    it('should throw error', async () => {
      const task = quittable({}, async task => {
        await sleep(300)
        throw new Error('xxx')
      })

      let flag = false

      try {
        setTimeout(() => {
          task.quit()
        }, 100)

        await task.run()
      } catch (err) {
        flag = true
      }

      flag.should.be.equal(true)
    })
  })
})
