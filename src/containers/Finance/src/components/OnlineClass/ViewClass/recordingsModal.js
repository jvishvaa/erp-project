import React from 'react'
import { Modal, Typography } from '@material-ui/core'

function RecordingsModal ({ showRecordings, handleRecordingsToggle, loadingFiles, recordedFiles }) {
  return <Modal
    aria-labelledby='simple-modal-title'
    aria-describedby='simple-modal-description'
    open={showRecordings}
    onClose={handleRecordingsToggle}
  >
    <div style={{
      position: 'absolute',
      left: 'calc(50vw - 200px)',
      top: 'calc(50vh - 200px)',
      padding: 16,
      backgroundColor: 'white',
      width: 370,
      boxShadow: '0 3px 6px rgba(0,0,0,0.16), 0 3px 6px rgba(0,0,0,0.23)'
    }}>
      <Typography style={{ paddingBottom: 8 }} variant='h5'>Files (Recordings)</Typography>
      {
        !loadingFiles ? recordedFiles.length > 0 ? recordedFiles.map(file => {
          let recordingExtension = file.zoom_meeting_file.split('.').pop()
          if (recordingExtension === 'MP4') {
            return <video width='320' height='240' controls>
              <source src={file.zoom_meeting_file} type='video/mp4' />
            Your browser does not support the video tag.
            </video>
          } else if (recordingExtension === 'M4A') {
            return <audio controls preload='none' style={{ width: 320 }}>
              <source src={file.zoom_meeting_file} type='audio/mp4' />
              <p>Your browser does not support HTML5 audio.</p>
            </audio>
          } else {
            return <><br /><a href={file.zoom_meeting_file}>{file.zoom_meeting_file.slice(0, 45)}...</a></>
          }
        }) : 'No recordings found.' : 'Loading...'
      }
    </div>
  </Modal>
}

export default RecordingsModal
