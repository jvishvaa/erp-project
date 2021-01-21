import imageCompression from 'browser-image-compression'
import CompressionWorker from './compression.worker.js'

/**
 * For files/data other than image decompression is neccesary.
 */
class Compression {
  constructor () {
    this.worker = new CompressionWorker()
    console.log('Compression Worker initialised')
  }

  /**
   *
   * @param {file} File which needs to be compressed
   */
  async encode (file) {
    const compressPromise = new Promise((resolve, reject) => {
      const fileType = file.type
      if (fileType.startsWith('audio') || fileType.startsWith('video')) {
        return file
      }
      this.worker.postMessage({ file, message: 'deflate' })
      this.worker.addEventListener('message', (e) => {
        resolve(e.data)
      })
      this.worker.addEventListener('error', (e) => {
        reject(e.message)
      })
    })

    const data = await compressPromise
    return data.file
  }

  /**
   *
   * @param {file} file that is already compressed
   */
  async decode (file) {
    const decompressPromise = new Promise((resolve, reject) => {
      this.worker.postMessage({ file, message: 'inflate' })
      this.worker.addEventListener('message', (e) => {
        resolve(e.data)
      })
      this.worker.addEventListener('error', (e) => {
        reject(e.message)
      })
    })
    try {
      const data = await decompressPromise
      return data.file
    } catch (err) {
      return file
    }
  }

  async compressImage (imageFile) {
    const fileType = imageFile.type
    if (!fileType.startsWith('image')) {
      return imageFile
    }
    const options = {
      maxSizeMB: 1,
      maxWidthOrHeight: 1920,
      useWebWorker: true
    }
    const compressedFile = await imageCompression(imageFile, options)
    // smaller than maxSizeMB
    return compressedFile
  }
}

export const compression = new Compression()

// export const compression = 'Will FIx It'
