import sleep from './sleep'
import { microTask, macroTask } from './browserTask'
import fifo from './fifo'
import poll from './poll'
import quittable from './quittable'

export {
  sleep,
  microTask,
  macroTask,
  fifo,
  poll
}

const polygala = {
  sleep,
  microTask,
  macroTask,
  fifo,
  quittable
}

export default polygala
