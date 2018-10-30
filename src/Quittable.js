/**
 * 可中途停止的异步任务
 *
 * @author Y3G
 */

const noop = _ => _

const namedQuittableMap = {}

export class QuittableBase {
  get context () {
    return this.context_
  }

  get name () {
    return this.name_
  }

  get hasName () {
    return !!(this.name && this.name.length)
  }

  get used () {
    return this.used_
  }

  get quitted () {
    return this.quitted_
  }

  constructor (fn, { context = {}, name = '', quitPrev = false }) {
    this.fn_ = fn
    this.context_ = context
    this.name_ = name
    this.used_ = false
    this.quitted_ = false
    this.quitPrev_ = quitPrev

    if (!this.hasName && quitPrev) {
      console.warn(`A quittable object without a name should NOT be setted by 'quitPrev'.`)
    }
  }

  async run () {
    if (this.used) {
      throw new Error(`Quitable object should NOT be executed repeatly.`)
    }

    this._beforeRun()

    let ret

    try {
      ret = await this.fn_(this)
    } catch (err) {
      if (!this.quitted) {
        throw err
      }
    }

    this._afterRun()

    return ret
  }

  quit () {
    this.quitted_ = true
  }

  _beforeRun () {
    this.used_ = true
    const { hasName, name, quitPrev_ } = this

    if (hasName && quitPrev_) {
      this._quitPrev()
    }

    if (hasName) {
      namedQuittableMap[name] = this
    }
  }

  _afterRun () {
    if (this.hasName) {
      return
    }

    const { name } = this

    if (namedQuittableMap[name]) {
      delete namedQuittableMap[name]
    }
  }

  _quitPrev () {
    const { name } = this
    const prev = namedQuittableMap[name]

    if (prev) {
      prev.quit()
    }

    delete namedQuittableMap[name]
  }
}

export default class Quittable extends QuittableBase {
  constructor (options = {}) {
    super(noop, options)

    this.fn_ = this.exec.bind(this)
  }

  async exec () {
    throw new Error(`Method exec should be overriden by subclass.`)
  }
}
