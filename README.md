# polygala

Toolset about time & timing.

[![Build Status](https://travis-ci.org/yusangeng/polygala.svg?branch=master)](https://travis-ci.org/yusangeng/pano.gl) [![Standard - JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

[![Npm Info](https://nodei.co/npm/polygala.png?compact=true)](https://www.npmjs.com/package/polygala)

## Install

```shell
npm install polygala --save
```

## Usage

### sleep

Asynchronous sleep.

``` js
import { sleep } from 'polygala'

async function main () {
  await sleep(1000)
}
```

### browserTask

Micro/Macro task in browser.

``` js
import { micro, macro } from 'polygala'

const task1 = macro(_ => console.log('task1'))
const task2 = micro(_ => console.log('task2'))

task1()
task2()

//=> Prints 'task2', 'task1'
```

### fifo

FIFO function queue.

``` js
import { fifo, sleep } from 'polygala'

async function fa() {
  // 2s delay
  await sleep(2000)
}

async function fb() {
  // 1s delay
  await sleep(1000)
}

const a = fifo(fa, 'foobar')
const b = fifo(fb, 'foobar')

let str = ''

a().then(_ => { str += 'Hello' })
b().then(_ => { str += 'World' })

//=> str === 'Hello World'
```

### poll

An easy-to-use polling implemention.

``` js
import { poll } from 'polygala'
import ajax from './ajax'

const stop = poll(async polling => {
  const { url } = polling.context
  await ajax.get(url)
}, {
  delay: 3000,
  limit: 1000, // Repeats at most 1000 times, 0 means NO limit.
  context: {
    url: '//foobar.com/heartbeat'
  },
  onError: err => {
    console.error(err)
    return false // False means "Don't stop polling", if you want to stop, return true.
  }
})

// ...

stop() // stop polling.
```

### quittable

Quittable asynchronous task.

``` js
import { quittable, sleep } from 'polygala'
import ajax from './ajax'
import store from './store'

const task = quittable(async task => {
  await sleep(1000)

  if (task.quitted) {
    // Task has been quitted.
    return
  }

  const { url } = task.context
  const data = await ajax.get(url)

  if (task.quitted) {
    return
  }

  store.data = data
},
// Name of quittable task, null means on name. A named task would be quitted if a new task with the same name was run.
'foobar',
// context
{
  url: '//foobar.com/heartbeat'
})

task.run()

setTimeout(_ => {
  task.quit()
}, 1050)
```
