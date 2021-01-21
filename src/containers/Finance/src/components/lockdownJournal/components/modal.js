import React from 'react'
import { Modal, Card } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import HighlightOffIcon from '@material-ui/icons/HighlightOff'

import Backdrop from '@material-ui/core/Backdrop'

const useStyles = makeStyles(theme => ({
  modal: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  paper: {
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: '30px 10px 0px 10px'
  }
}))
export default function ViewJournal ({ open, toggle, id }) {
  console.log('props', open, toggle, id)
  const classes = useStyles()
  return (
    <React.Fragment>
      <Modal
        aria-labelledby='transition-modal-title'
        aria-describedby='transition-modal-description'
        className={classes.modal}
        open={open}
        onClose={() => {
          toggle()
        }}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500
        }}
      >
        <Card style={{
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '95%'

        }}
        >
          <div className={classes.paper} style={{ position: 'relative', overflow: 'scroll', 'max-height': '90vh' }}>

            <HighlightOffIcon style={{ position: 'absolute', right: 20, top: 2 }} className='clear__files' onClick={() => {
              toggle()
            }} />
            <h1>view file</h1>
          </div>

        </Card>

      </Modal>
    </React.Fragment>
  )
}
