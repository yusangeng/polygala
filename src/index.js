import sleep from './sleep'
import { micro, macro, microTask, macroTask } from './task'
import fifo from './fifo'
import poll from './poll'
import quittable from './quittable'

export {
  micro,
  microTask,
  macro,
  macroTask,
  sleep,
  fifo,
  poll,
  quittable
}

const polygala = {
  micro,
  microTask,
  macro,
  macroTask,
  sleep,
  fifo,
  poll,
  quittable
}

export default polygala
