import workercode from './workercode'
/* global Worker */

let code = workercode.toString()
code = code.substring(code.indexOf('{') + 1, code.lastIndexOf('}'))

const blob = new Blob([code], { type: 'application/javascript' })
const workerScript = URL.createObjectURL(blob)

let worker = new Worker(workerScript)

export default worker
