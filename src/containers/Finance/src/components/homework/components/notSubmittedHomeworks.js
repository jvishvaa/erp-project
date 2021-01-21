import React from 'react'

import { Button, IconButton, Toolbar as MaterialToolbar, Typography } from '@material-ui/core'
import Dialog from '@material-ui/core/Dialog'
import { AssignmentLateOutlined } from '@material-ui/icons'
import AppBar from '@material-ui/core/AppBar'
import CloseIcon from '@material-ui/icons/Close'
import Slide from '@material-ui/core/Slide'

// import WorkSubmission from '../../teacherManagement/homeworkSubmission/workSubmission'
import WorkSubmission from './notSubmittedTable'

const Transition = React.forwardRef(function Transition (props, ref) {
  return <Slide direction='up' ref={ref} {...props} />
})

export default function NotSubmittedHomeworks ({ alert }) {
  let params = (new URL(document.location)).searchParams
  const [open, setOpen] = React.useState(false)

  const handleOpen = () => {
    setOpen(true)
  }

  const handleClose = () => {
    setOpen(false)
  }
  let onlineClassId = params.get('online_class_id')
  return <><Button onClick={handleOpen}>
    {window.isMobile ? <><AssignmentLateOutlined />View Not Submitted Students</> : <> <AssignmentLateOutlined /> Not Submitted Students</>}
  </Button>
    <Dialog fullScreen onClose={handleClose} open={open} TransitionComponent={Transition}>
      <AppBar>
        <MaterialToolbar>
          <IconButton edge='start' color='inherit' onClick={handleClose} aria-label='close'>
            <CloseIcon />
          </IconButton>
          <Typography variant='h6'>
              Not Submitted Students
          </Typography>
        </MaterialToolbar>
      </AppBar>
      <div style={{ marginTop: 52, width: '100%' }}>
        <WorkSubmission
          type='NS'
          id={onlineClassId}
          isOnlineClass
          alert={alert}
        /></div>
    </Dialog></>
}
