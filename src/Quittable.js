/**
 * 可中途停止的异步任务
 *
 * @author Y3G
 */

const namedQuittableMap = {}

export class Quittable {
  get context () {
    return this.context_
  }

  get name () {
    return this.name_
  }

  get used () {
    return this.used_
  }

  get quitted () {
    return this.quitted_
  }

  constructor (fn, { context = {}, name = null }) {
    this.fn_ = fn
    this.context_ = context
    this.name_ = name
    this.used_ = false
    this.quitted_ = false
  }

  async run () {
    if (this.used) {
      throw new Error(`Quittable object should NOT be executed repeatly.`)
    }

    this._beforeRun()

    let ret

    try {
      ret = await this.fn_(this)
    } catch (err) {
      if (!this.quitted) {
        throw err
      }
    } finally {
      this._afterRun()
    }

    return ret
  }

  quit () {
    this.quitted_ = true
  }

  _beforeRun () {
    this.used_ = true
    const { name } = this

    if (name) {
      this._quitPrev()
      namedQuittableMap[name] = this
    }
  }

  _afterRun () {
    const { name } = this

    if (!name) {
      return
    }

    if (namedQuittableMap[name] === this) {
      delete namedQuittableMap[name]
    }
  }

  _quitPrev () {
    const { name } = this
    const prev = namedQuittableMap[name]

    if (prev) {
      prev.quit()
      delete namedQuittableMap[name]
    }
  }
}

export function quittable (fn, name, context) {
  return new Quittable(fn, { name, context })
}

export default quittable
