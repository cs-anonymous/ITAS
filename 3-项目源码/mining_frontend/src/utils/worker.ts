export const callWorker = (worker: Worker, msg) => {
    return new Promise((resolve, reject) => {
      const listener = (event) => {
        resolve(event.data)
        worker.removeEventListener('message', listener)
      }
      worker.addEventListener('message', listener)
      worker.postMessage(msg)
    })
  }
  