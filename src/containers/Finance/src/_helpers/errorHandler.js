import axios from 'axios'
import { urls } from '../urls'

class ErrorHandler {
  reportError (url, error, info) {
    if (window.location.hostname !== 'localhost') {
      this.sendError(url, error, info)
    }
  }
  sendError (url, error, info, userId) {
    let formData = new FormData()
    formData.set('url', url)
    formData.set('error_message', String(error))
    formData.set('context', String(info.componentStack))
    axios.post(urls.ERROR_HANDLER, formData, {
      headers: {
        Authorization: 'Bearer ' + localStorage.getItem('id_token'),
        'content-type': 'multipart/form-data'
      }
    })
  }
}

export default ErrorHandler
