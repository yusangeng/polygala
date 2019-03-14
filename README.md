# polygala

[![TypeScript](https://img.shields.io/badge/lang-typescript-blue.svg)](https://www.tslang.cn/) [![Build Status](https://travis-ci.org/yusangeng/polygala.svg?branch=master)](https://travis-ci.org/yusangeng/polygala) [![Coverage Status](https://coveralls.io/repos/github/yusangeng/polygala/badge.svg?branch=master)](https://coveralls.io/github/yusangeng/polygala?branch=master) [![Npm Package Info](https://badge.fury.io/js/polygala.svg)](https://www.npmjs.com/package/polygala) [![Downloads](https://img.shields.io/npm/dw/polygala.svg?style=flat)](https://www.npmjs.com/package/polygala)

## Abstract

TS library about timing.

## Install

``` bash
npm install polygala --save
```

## Usage

### sleep

Asynchronous sleep.

``` ts
import { sleep } from 'polygala'

async function main () : Promise<void> {
  await sleep(1000)
}
```

### task

Simulative micro/macro task in browser.

``` ts
import { micro, macro } from 'polygala'

const task1 = macro(() => console.log('task1'))
const task2 = micro(() => console.log('task2'))

task1()
task2()

//=> Prints 'task2', 'task1'
```

### fifo

FIFO promise queue.

``` ts
import { fifo, sleep } from 'polygala'

async function fa() : Promise<void> {
  // 2s delay
  await sleep(2000)
}

async function fb() : Promise<void> {
  // 1s delay
  await sleep(1000)
}

const globalFIFOName = Symbol('foobar')

const a = fifo(fa, globalFIFOName)
const b = fifo(fb, globalFIFOName)

let str = ''

a().then(() => { str += 'Hello' })
b().then(() => { str += 'World' })

//=> str === 'Hello World'
```

### poll

An easy-to-use polling implemention.

``` ts
import { poll } from 'polygala'

const stop = poll(async polling => {
  const { url } = polling.context
  await fetch(url)
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

``` ts
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

## API

### sleep

Sleep Asynchronously.

``` ts
function sleep (milliseconds: number) : Promise<void>
```

### micro & macro

Invoke simulative micro/macro tasks in browser.

``` ts
type FProcedure = (...args: any[]) => void

function micro<Fn extends FProcedure> (fn: Fn) : Fn
function macro<Fn extends FProcedure> (fn: Fn) : Fn
```

### fifo

Push an async function and its return value into a FIFO promise queue.

``` ts
type AsyncFunc<RetType> = (...args: any[]) => Promise<RetType>

export function fifo<Fn extends AsyncFunc<void>> (fn : Fn, queueName?: symbol) : Fn
export function fifo<RetType, Fn extends AsyncFunc<RetType>> (fn : Fn, queueName?: symbol) : Fn
```

### pool

Start polling. 

``` ts
// Polling function type.
type PollingFunc<ContextType> = (p: Polling<ContextType>) => void

// Error callbacl type.
type ErrorCallback = (error: Error) => boolean

// Options type.
type PollingOptions<ContextType> = {
  context?: ContextType
  delay?: number
  limit?: number
  onError?: ErrorCallback
}

// Function to stop polling.
type StopFunc = () => void

function poll<ContextType> (fn: PollingFunc<ContextType>, options?: PollingOptions<ContextType>) : StopFunc
```

### quittable

Create a quittable asynchronous task.

``` ts
interface IQuittable<ContextType> {
  quitted: boolean
  readonly context: ContextType
  quit () : void
}

type FQUITTED = () => void

class Quittable<ContextType, RetType> implements IQuittable<ContextType> {
  // ...

  run () : Promise<FQUITTED | RetType>
  quit () : void
}

type QuittableCallable<ContextType, RetType> = (q: IQuittable<ContextType>) => RetType

function quittable<ContextType, RetType = void> (
  context: ContextType,
  fn: QuittableCallable<ContextType, RetType>) : Quittable<ContextType, RetType>

```

### namedQuittable

Create a named quittable asynchronous task.

If you've created a named quittable task, the last task with the same name was quitted automatically.

``` ts
function namedQuittable<ContextType, RetType = void> (
  name: symbol,
  context: ContextType,
  fn: QuittableCallable<ContextType, RetType>) : Quittable<ContextType, RetType>
```
