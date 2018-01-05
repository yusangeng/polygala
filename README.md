# atask | Async task implemention in browser.

## Install

```shell
npm install atask --save
```

## Usage

``` js
import {microTask, macroTask} from 'atask'

const task1 = macroTask(_ => console.log('task1'))
const task2 = microTask(_ => console.log('task2'))

// print 'task2', 'task1'
task1()
task2()

```
