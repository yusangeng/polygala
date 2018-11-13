/* global describe it */

import 'babel-polyfill'
import chai from 'chai'
import { micro, macro } from '../src/task'
import sleep from '../src/sleep'

chai.should()

describe('task', _ => {
  describe('#micro', _ => {
    it('should exec input function', async () => {
      let i = 0
      micro(_ => ++i)()
      await sleep(1)
      i.should.be.equal(1)
    })

    it('should exec input function in browser', async () => {
      process.browser = true
      let i = 0
      try {
        micro(_ => ++i)()
      } finally {
        process.browser = false
      }
      await sleep(1)
      i.should.be.equal(1)
    })
  })

  describe('#macro', _ => {
    it('should exec input function', async () => {
      let i = 0
      macro(_ => ++i)()
      await sleep(1)
      i.should.be.equal(1)
    })

    it('should exec input function in browser', async () => {
      process.browser = true
      let i = 0
      try {
        macro(_ => ++i)()
      } finally {
        process.browser = false
      }
      await sleep(1)
      i.should.be.equal(1)
    })

    it('should exec after micro', async () => {
      let i = ''
      macro(_ => {
        i += 'hello'
      })()
      micro(_ => {
        i += 'world'
      })()
      micro(_ => {
        i += '!'
      })()
      await sleep(1)
      i.should.be.equal('world!hello')
    })

    it('should exec after micro in micro', async () => {
      let i = ''
      macro(_ => {
        i += 'hello'
      })()
      micro(_ => {
        i += 'world'
        micro(_ => {
          i += '!'
        })()
      })()
      await sleep(1)
      i.should.be.equal('world!hello')
    })

    it('should exec after micro in browser', async () => {
      let i = ''
      process.browser = true

      try {
        macro(_ => {
          i += 'hello'
        })()
        micro(_ => {
          i += 'world'
        })()
        micro(_ => {
          i += '!'
        })()
      } finally {
        process.browser = false
      }

      await sleep(1)
      i.should.be.equal('world!hello')
    })

    it('should exec after micro in macro in browser', async () => {
      let i = ''
      process.browser = true

      try {
        macro(_ => {
          i += 'hello'
        })()
        micro(_ => {
          i += 'world'
          micro(_ => {
            i += '!'
          })()
        })()
      } finally {
        process.browser = false
      }

      await sleep(1)
      i.should.be.equal('world!hello')
    })
  })
})
