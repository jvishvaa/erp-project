import React, { useState } from 'react'

import { Visibility, AudiotrackRounded, VideocamRounded, LaunchRounded, CloseRounded, GetAppRounded } from '@material-ui/icons'
import { ListItemText, ListItem, Avatar, ListItemAvatar, ListItemSecondaryAction, Modal, IconButton, Tooltip } from '@material-ui/core'

import { urls } from '../../../../urls'

function MediaListItem ({ fileName, source, file, allowAttempt, id, onRemove, reload }) {
  const audioExtensions = ['ogg', 'mpeg', 'wav', 'mp3']
  const videoExtensions = ['mp4', 'mkv', 'webm']
  const pdfExtensions = ['pdf']
  const imageExtensions = ['png', 'jpeg', 'jpg']
  const fileExtensionPattern = /\.([0-9a-z]+)(?=[?#])|(\.)(?:[\w]+)$/gmi
  const fileNameWithoutExtension = fileName.replace(fileName.match(fileExtensionPattern), '')
  const fileExtension = (fileName.match(fileExtensionPattern)[0]).replace('.', '')
  const [videoModalOpen, setVideoModalOpen] = useState(false)
  const [audioModalOpen, setAudioModalOpen] = useState(false)
  const [imageModalOpen, setImageModalOpen] = useState(false)
  const [attemptModalOpen, setAttemptModalOpen] = useState(false)
  const [isFullScreen, setIsFullScreen] = useState(false)

  let type
  if (fileName.length > (window.isMobile ? 10 : 30)) {
    fileName = fileNameWithoutExtension.substring(0, window.isMobile ? 10 : 30) + '...' + fileExtension
  }
  if (videoExtensions.includes(fileExtension)) {
    type = 'video'
  } else if (audioExtensions.includes(fileExtension)) {
    type = 'audio'
  } else if (pdfExtensions.includes(fileExtension)) {
    type = 'document'
  } else if (imageExtensions.includes(fileExtension)) {
    type = 'image'
  }
  let audioModal = null

  if (audioModalOpen) {
    audioModal = (
      <Modal
        open={audioModalOpen}
        onClose={() => setAudioModalOpen(false)}
        style={{ zIndex: '1500' }}
        small
      >
        <div style={{ position: 'absolute', left: 0, top: 0, width: '100%', height: '100%', overflow: 'auto', display: 'flex', alignItems: 'flex-start', justifyContent: 'center' }} >
          <audio controls style={{ placeSelf: 'center', marginTop: '15px' }}>
            <source src={source} type='audio/ogg' />
            <source src={source} type='audio/mpeg' />
            <source src={source} type='audio/wav' />
          Your browser does not support the audio element.
          </audio>
          <IconButton style={{ position: 'fixed', top: 32, right: 32, color: 'white' }} onClick={() => setAudioModalOpen(false)} edge='end' aria-label='comments'>
            <CloseRounded />
          </IconButton>
        </div>
      </Modal>
    )
  }

  function onDownload () {
    var a = document.createElement('A')
    a.href = source
    a.target = '_blank'
    a.download = source.substr(source.lastIndexOf('/') + 1)
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
  }

  function handleAttempt () {
    setAttemptModalOpen(true)
  }
  function exitFullScreen () {
    // console.log("Exiting fullscreen...")
    try {
      if (document.fullscreenEnabled) {
        if (document.exitFullscreen) {
          document.exitFullscreen().catch(e => console.log('Fullscreen issue', e))
        } else if (document.mozCancelFullScreen) { /* Firefox */
          document.mozCancelFullScreen().catch(e => console.log('Fullscreen issue', e))
        } else if (document.webkitExitFullscreen) { /* Chrome, Safari and Opera */
          document.webkitExitFullscreen().catch(e => console.log('Fullscreen issue', e))
        } else if (document.msExitFullscreen) { /* IE/Edge */
          document.msExitFullscreen().catch(e => console.log('Fullscreen issue', e))
        }
      }
    } catch (e) {
      console.log('Fullscreen issue', e)
    }
  }
  function enterFullScreen (elem = document.getElementById('attempt-iframe')) {
    try {
      if (elem.requestFullscreen) {
        elem.requestFullscreen().catch(e => console.log('Fullscreen issue', e))
      } else if (elem.mozRequestFullScreen) { /* Firefox */
        elem.mozRequestFullScreen().catch(e => console.log('Fullscreen issue', e))
      } else if (elem.webkitRequestFullscreen) { /* Chrome, Safari and Opera */
        elem.webkitRequestFullscreen().catch(e => console.log('Fullscreen issue', e))
      } else if (elem.msRequestFullscreen) { /* IE/Edge */
        elem.msRequestFullscreen().catch(e => console.log('Fullscreen issue', e))
      }
    } catch (e) {
      console.log('Fullscreen issue', e)
    }
  }
  let attemptModal = null
  if (attemptModalOpen) {
    window.addEventListener('message', function (event) {
      console.log('received: ', event.origin, event.data)
      // can message back using event.source.postMessage(...)
      if (event.data === 'closeMe') {
        setAttemptModalOpen(false)
        reload()
      } else if (event.data === 'toggleFullscreen') {
        if (isFullScreen) {
          exitFullScreen()
          setIsFullScreen(false)
        } else {
          enterFullScreen()
          setIsFullScreen(true)
        }
      }
    })
    attemptModal = (
      <Modal
        open={attemptModalOpen}
        onClose={() => setAttemptModalOpen(false)}
        style={{ zIndex: '1500' }}
      >
        <div style={{ width: '100vw', height: '100vh' }}>
          <iframe id='attempt-iframe' src={`${urls.BASE}/homework_tool/?file_id=${id}&hw_submission_id=13`} frameBorder='0' style={{ overflow: 'hidden', height: '100%', width: '100%' }} height='100%' width='100%' />
        </div>
      </Modal>
    )
  }
  function handleView () {
    if (type === 'video') {
      setVideoModalOpen(true)
    } else if (type === 'audio') {
      setAudioModalOpen(true)
    } else if (type === 'image') {
      setImageModalOpen(true)
    }
  }
  let videoModal = null
  if (videoModalOpen) {
    videoModal = (
      <Modal
        open={videoModalOpen}
        onClose={() => setVideoModalOpen(false)}
        style={{ zIndex: '1500' }}
      >
        <div style={{ position: 'absolute', left: 0, top: 0, width: '100%', height: '100%', overflow: 'auto', display: 'flex', alignItems: 'flex-start', justifyContent: 'center' }} >
          <video autoPlay controls style={{ placeSelf: 'center', marginTop: '15px' }}>
            <source src={source} type='video/mp4' />
            <source src={source} type='video/ogg' />
            <source src={source} type='video/webm' />
          Your browser does not support the video tag.
          </video>
          <IconButton style={{ position: 'fixed', top: 32, right: 32, color: 'white' }} onClick={() => setVideoModalOpen(false)} edge='end' aria-label='comments'>
            <CloseRounded />
          </IconButton>
        </div>
      </Modal>
    )
  }

  let imageModal = null
  if (imageModalOpen) {
    imageModal = (
      <Modal
        open={imageModalOpen}
        onClose={() => setImageModalOpen(false)}
        style={{ zIndex: '1500' }}
      >
        <div style={{ position: 'absolute', left: 0, top: 0, width: '100%', height: '100%', overflow: 'auto', display: 'flex', alignItems: 'flex-start', justifyContent: 'center' }} >
          <img crossOrigin='anonymous' src={source} style={{ paddingTop: `10vh`, left: 0, width: '60%' }} />
          <IconButton style={{ position: 'fixed', top: 32, right: 32, color: 'white' }} onClick={() => setImageModalOpen(false)} edge='end' aria-label='comments'>
            <CloseRounded />
          </IconButton>
        </div>
      </Modal>
    )
  }
  return (<>
    <ListItem onClick={handleView} button>
      <ListItemAvatar>
        <Avatar
          variant='rounded'
          imgProps={{ crossOrigin: 'anonymous' }}
          alt={fileName}
          src={type === 'image' && source}
        >
          {type === 'audio' && <AudiotrackRounded />}
          {type === 'video' && <VideocamRounded />}
        </Avatar>
      </ListItemAvatar>
      <ListItemText primary={fileName} />
      <ListItemSecondaryAction>
        {type !== 'document' && <Tooltip title='View' aria-label='add'>
          <IconButton onClick={handleView} edge='end' aria-label='comments'>
            <Visibility />
          </IconButton>
        </Tooltip>}
        {allowAttempt && (type === 'image' || type === 'document') && <Tooltip title='Attempt Online' aria-label='add'><IconButton onClick={handleAttempt} edge='end' aria-label='comments'>
          <LaunchRounded />
        </IconButton></Tooltip>}
        {!onRemove && <Tooltip title='View' aria-label='add'>
          <IconButton onClick={onDownload} edge='end' aria-label='comments'>
            <GetAppRounded />
          </IconButton>
        </Tooltip>}
        {onRemove && <Tooltip title='Remove File' aria-label='add'><IconButton onClick={onRemove} edge='end' aria-label='comments'>
          <CloseRounded />
        </IconButton></Tooltip>}
      </ListItemSecondaryAction>
    </ListItem>
    {audioModal}
    {videoModal}
    {imageModal}
    {allowAttempt && (type === 'image' || type === 'document') && attemptModal}
  </>
  )
}

export default MediaListItem
