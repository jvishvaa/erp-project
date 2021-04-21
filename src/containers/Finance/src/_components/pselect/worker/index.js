import selection from './selection'
/* global Worker */

let code = selection.toString()
code = code.substring(code.indexOf('{') + 1, code.lastIndexOf('}'))

const blob = new Blob([code], { type: 'application/javascript' })
const workerScript = window.URL.createObjectURL(blob)

let worker = new Worker(workerScript)

export default worker
