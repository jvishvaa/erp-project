import trackercode from './trackercode'
/* global Worker */

let code = trackercode.toString()
code = code.substring(code.indexOf('{') + 1, code.lastIndexOf('}'))

const blob = new Blob([code], { type: 'application/javascript' })
const workerScript = URL.createObjectURL(blob)

let tracker = new Worker(workerScript)

export default tracker
