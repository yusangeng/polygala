/* global describe it */

import chai from 'chai'
import { micro, macro } from '../src/task'
import sleep from '../src/sleep'

const processAny = (process as any)

chai.should()

describe('task', () => {
  describe('#micro', () => {
    it('should exec input function', async () => {
      let i = 0
      micro(() => ++i)()
      await sleep(1)
      i.should.be.equal(1)
    })

    it('should exec input function in browser', async () => {
      processAny.browser = true
      let i = 0
      try {
        micro(() => ++i)()
      } finally {
        processAny.browser = false
      }
      await sleep(1)
      i.should.be.equal(1)
    })
  })

  describe('#macro', () => {
    it('should exec input function', async () => {
      let i = 0
      macro(() => ++i)()
      await sleep(1)
      i.should.be.equal(1)
    })

    it('should exec input function in browser', async () => {
      processAny.browser = true
      let i = 0
      try {
        macro(() => ++i)()
      } finally {
        processAny.browser = false
      }
      await sleep(1)
      i.should.be.equal(1)
    })

    it('should exec after micro', async () => {
      let i = ''
      macro(() => {
        i += 'hello'
      })()
      micro(() => {
        i += 'world'
      })()
      micro(() => {
        i += '!'
      })()
      await sleep(1)
      i.should.be.equal('world!hello')
    })

    it('should exec after micro in micro', async () => {
      let i = ''
      macro(() => {
        i += 'hello'
      })()
      micro(() => {
        i += 'world'
        micro(() => {
          i += '!'
        })()
      })()
      await sleep(1)
      i.should.be.equal('world!hello')
    })

    it('should exec after micro in browser', async () => {
      let i = ''
      processAny.browser = true

      try {
        macro(() => {
          i += 'hello'
        })()
        micro(() => {
          i += 'world'
        })()
        micro(() => {
          i += '!'
        })()
      } finally {
        processAny.browser = false
      }

      await sleep(1)
      i.should.be.equal('world!hello')
    })

    it('should exec after micro in macro in browser', async () => {
      let i = ''
      processAny.browser = true

      try {
        macro(() => {
          i += 'hello'
        })()
        micro(() => {
          i += 'world'
          micro(() => {
            i += '!'
          })()
        })()
      } finally {
        processAny.browser = false
      }

      await sleep(1)
      i.should.be.equal('world!hello')
    })
  })
})
