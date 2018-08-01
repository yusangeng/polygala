import { microTask, macroTask } from './browserTask'
import fifo from './FIFO'
import Polling, { startPolling, PollingBase } from './Polling'
import Quittable, { QuittableBase } from './Quittable'

export {
  microTask,
  macroTask,
  fifo,
  Polling,
  PollingBase,
  startPolling,
  Quittable,
  QuittableBase
}

const polygala = {
  microTask,
  macroTask,
  fifo,
  Polling,
  PollingBase,
  startPolling,
  Quittable,
  QuittableBase
}

export default polygala

