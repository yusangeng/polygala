import sleep from './sleep'
import { micro, macro, microTask, macroTask } from './task'
import fifo from './fifo'
import poll, { Polling } from './poll'
import quittable, { namedQuittable, Quittable, QUITTED } from './quittable'

export { micro, microTask, macro, macroTask, sleep, fifo, poll, Polling, quittable, namedQuittable, Quittable, QUITTED }

export const polygala = {
  micro,
  microTask,
  macro,
  macroTask,
  sleep,
  fifo,
  poll,
  Polling,
  quittable,
  namedQuittable,
  Quittable,
  QUITTED
}

export default polygala
