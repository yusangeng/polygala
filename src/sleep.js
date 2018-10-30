export default function sleep (time) {
  return new Promise(resolve => {
    setTimeout(_ => {
      resolve()
    }, time)
  })
}
