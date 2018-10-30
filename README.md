# polygala

Tools for writing async function in browser.

## Install

```shell
npm install polygala --save
```

## Usage

### sleep

Async sleep.

``` js
import {sleep} from 'polygala'

async function main () {
  await sleep(1000)
}
```

### browserTask

Micro/Macro task in browser.

``` js
import {microTask, macroTask} from 'polygala'

const task1 = macroTask(_ => console.log('task1'))
const task2 = microTask(_ => console.log('task2'))

// print 'task2', 'task1'
task1()
task2()

```

### fifo

FIFO function queue.

``` js
import { fifo } from 'polygala'

async function fa() {
  // 2s delay
}

async function fb() {
  // 1s delay
}

const a = fifo(fa)
const b = fifo(fb)

let str = ''

a().then(_ => {
  str += 'Hello'
})
b().then(_ => {
  str += 'World'
  console.log(str)
})
```

### Polling

An easy-to-use polling implemention.

``` js
import { Polling } from 'polygala'

class MyPolling extends Polling {
  async exec() {
    // ...
  }
}

const pl = new Polling()
pl.start()

// ...

pl.stop()
```

### Quittable

Quittable async task.

``` js
import { Quittable } from 'polygala'

class MyQuittable extends Quittable {
  async exec() {
    // ...
  }

  onError () {
    return false // false means do NOT stop polling on error.
  }
}

const q = new MyQuittable()
q.start()

// ...

q.quit()
```


