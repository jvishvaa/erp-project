const JSDOM = require('jest-environment-jsdom-fourteen')

const jsdom = new JSDOM('<!doctype html><html><body></body></html>')
const { window } = jsdom.dom.window
function copyProps (src, target) {
  Object.defineProperties(target, {
    ...Object.getOwnPropertyDescriptors(src),
    ...Object.getOwnPropertyDescriptors(target)
  })
}

class Worker {
  constructor (stringUrl) {
    this.url = stringUrl
    this.onmessage = () => {}
  }

  postMessage (msg) {
    this.onmessage(msg)
  }
}

global.window = window
global.document = window.document
global.window.URL.createObjectURL = jest.fn(() => 'details')
global.Worker = Worker
global.navigator = {
  userAgent: 'node.js'
}
global.requestAnimationFrame = function (callback) {
  return setTimeout(callback, 0)
}
global.cancelAnimationFrame = function (id) {
  clearTimeout(id)
}
copyProps(window, global)
