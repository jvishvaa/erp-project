class FileSystemAPI {
  constructor () {
    this.requestFileSystem = window.requestFileSystem || window.webkitRequestFileSystem
    this.initialize = this.initialize.bind(this)
  }
  storeData () {

  }
  getData () {

  }
  onInitFS (fs) {
    fs.root.getFile('log.txt', { create: false }, (fileEntry) => {
      // Get a File object representing the file,
      fileEntry.remove(() => {
        fs.root.getFile('log.txt', { create: true, exclusive: true }, (fileEntry) => {
        }, (e) => { console.log('error', e.name) })
      }, (e) => console('File removal', e))
    }, (e) => {
      if (e.name === 'NotFoundError') {
        fs.root.getFile('log.txt', { create: true, exclusive: true }, (fileEntry) => {
        }, (e) => { console.log('error', e.name) })
      }
    })
  }
  initialize () {
    return new Promise((resolve, reject) => {
      var requestedBytes = 1024 * 1024 * 10 // 10MB

      navigator.webkitPersistentStorage ? navigator.webkitPersistentStorage.requestQuota(
        requestedBytes, (grantedBytes) => {
          window.webkitRequestFileSystem(1, grantedBytes, (fs) => resolve(fs), (error) => {
            reject(error)
          })
        }, function (e) { console.log('Error', e) }
      ) : reject(new Error('unsupported browser'))
    })
  }

  getItem (name) {
    return new Promise((resolve, reject) => {
      this.initialize().then(fs => {
        fs.root.getFile(name, {}, (fileEntry) => {
          fileEntry.file(function (file) {
            var reader = new FileReader()
            reader.onloadend = function (e) {
              resolve(this.result)
            }
            reader.readAsText(file)
          }, (e) => { resolve(null); throw new Error('Issue resolving:', e.name) })
        }, (e) => {
          if (e.name === 'NotFoundError') {
            resolve(null)
          }
        })
      }).catch(e => resolve(null))
    })
  }
  setItem (name, content) {
    return new Promise((resolve, reject) => {
      this.initialize().then(fs => {
        fs.root.getFile(name, {}, (fileEntry) => {
          fileEntry.remove(() => {
            fs.root.getFile(name, { create: true, exclusive: true }, (fileEntry) => {
              fileEntry.createWriter(function (fileWriter) {
                fileWriter.onwriteend = function (e) {
                  resolve()
                }

                fileWriter.onerror = function (e) {
                  console.log('Write failed: ' + e.toString())
                }

                // Create a new Blob and write it to log.txt.
                var blob = new Blob([content], { type: 'text/plain' })

                fileWriter.write(blob)
              }, (e) => { console.log('Error occured creating file', e.name) })
            })
          }, (e) => { console.log('error', e.name) })
        }, (e) => {
          fs.root.getFile(name, { create: true, exclusive: true }, (fileEntry) => {
            fileEntry.createWriter(function (fileWriter) {
              fileWriter.onwriteend = function (e) {
                console.log('Write completed.')
                resolve()
              }

              fileWriter.onerror = function (e) {
                console.log('Write failed: ' + e.toString())
              }

              // Create a new Blob and write it to log.txt.
              var blob = new Blob([content], { type: 'text/plain' })

              fileWriter.write(blob)
            }, (e) => { console.log('Error occured creating file', e.name); resolve(null) })
          }, (e) => { console.log('error', e.name); resolve(null) })
        })
      }, (e) => {
        if (e.name === 'NotFoundError') {
          resolve(null)
        }
      }).catch(e => resolve(null))
    }).catch(e => console.log(e))
  }
}

export default FileSystemAPI
