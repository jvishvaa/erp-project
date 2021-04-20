/* eslint-disable no-undef */
import pako from 'pako'

self.onmessage = (event) => {
  if (event.data.file) {
    if (event.data.message === 'inflate') {
      inflate(event.data.file)
    } else if (event.data.message === 'deflate') {
      deflate(event.data.file)
    }
  } else {
    self.postMessage({ message: 'Wrong Input' })
  }
}

function deflate (file) {
  const reader = new FileReader()
  reader.onload = (e) => {
    const fileAsArray = new Uint8Array(e.target.result)
    const compressedFileArray = pako.deflate(fileAsArray, {
      level: 9,
      windowBits: 15
    })
    const compressedFile = compressedFileArray.buffer
    const dataToUpload = new Blob([compressedFile], { type: file.type, name: file.name })
    const fileToUpload = new Blob([dataToUpload], { type: file.type, name: file.name })
    self.postMessage({ file: fileToUpload, message: 'deflate' })
  }
  reader.readAsArrayBuffer(file)
}

function inflate (file) {
  const reader = new FileReader()
  reader.onload = (e) => {
    const fileAsArray = new Uint8Array(e.target.result)
    const compressedFileArray = pako.inflate(fileAsArray, {
      level: 9,
      windowBits: 15
    })
    const compressedFile = compressedFileArray.buffer
    const dataToUpload = new Blob([compressedFile], { type: file.type })
    const fileToUpload = new Blob([dataToUpload], { type: file.type })
    self.postMessage({ file: fileToUpload, message: 'inflate' })
  }
  reader.readAsArrayBuffer(file)
}
