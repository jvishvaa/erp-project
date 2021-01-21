import React, { Component } from 'react'
import { Modal } from '@material-ui/core'
import CancelIcon from '@material-ui/icons/Cancel'
import CustomVideoPlayer from '../videoPlayer/customVideoPlayer'

export class MediaWrapper extends Component {
    getExtension = (url = '') => {
      url = url.substr(1 + url.lastIndexOf('.'))
      url = url.split('?')[0]
      url = url.split('#')[0]
      return url
    }

    fileFormat = (src) => {
      const IMAGE_FILE_FORMATS = ['jpg', 'jpeg', 'png']
      const VIDEO_FILE_FORMATS = ['mp4', 'ogg', 'webm']

      if (IMAGE_FILE_FORMATS.includes(this.getExtension(src))) return 'IMAGE'
      if (VIDEO_FILE_FORMATS.includes(this.getExtension(src))) return 'VIDEO'
      return null
    }

    renderMedia = (src) => {
      return (
        !this.fileFormat(src)
          ? <h1 style={{ textAlign: 'center' }}>File format not supported</h1>
          : <div style={{ margin: '0 auto', textAlign: 'center' }}>
            {
              this.fileFormat(src) === 'IMAGE'
                ? <img src={src} style={{ width: '100%', height: 'auto' }} />
                : <div style={{ position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%, -50%)' }}><CustomVideoPlayer src={src} /></div>
            }
          </div>
      )
    }

    render () {
      const { open, handleClose, src } = this.props
      return (
        <Modal
          open={open}
          onClose={handleClose}
          aria-labelledby='simple-modal-title'
          aria-describedby='simple-modal-description'
        >
          <React.Fragment>
            <div
              style={{ backgroundColor: 'white', width: '90%', height: '80vh', position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', overflowY: 'auto', padding: 20 }}
            >
              <CancelIcon className='clear__files' style={{ float: 'right', marginBottom: 20 }} onClick={handleClose} />
              {
                this.renderMedia(src)
              }
            </div>
          </React.Fragment>
        </Modal>
      )
    }
}

export default MediaWrapper
