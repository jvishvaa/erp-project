import React, { useEffect, useState } from 'react'
// import Alert from '@material-ui/lab/Alert'
// import OtpInput from 'react-otp-input'
import { makeStyles } from '@material-ui/core/styles'
import { Button, Modal } from '@material-ui/core'
// import { Link } from 'react-router-dom'
// import Autocomplete from '@material-ui/lab/Autocomplete'
// import cityList from './cityList'
import './aol.css'
import Like from './assets/like.png'
import Nav from './nav'
import AolLogin from './aolLogin'

function getModalStyle () {
  const top = 50
  const left = 50

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`
  }
}

const useStyles = makeStyles(theme => ({
  paper: {
    position: 'absolute',
    width: '350px',
    backgroundColor: theme.palette.background.paper,
    border: '1px solid #fff',
    boxShadow: theme.shadows[5],
    padding: '10px 20px',
    borderRadius: '10px',
    outlineColor: 'transparent'
    // padding: theme.spacing(2, 4, 3)
  }
}))

// const useStyles = makeStyles(theme => ({
//   margin: {
//     margin: theme.spacing(1)
//   },
//   formControl: {
//     margin: theme.spacing(1),
//     minWidth: 225
//   },
//   backdrop: {
//     zIndex: theme.zIndex.drawer + 1,
//     color: '#fff'
//   },
//   outlined: {
//     zIndex: 0
//   }
// }))

function ThankYou (props) {
  const classes = useStyles()
  const [modalStyle] = useState(getModalStyle)
  const [showModal, setShowModal] = useState(false)
  const handleModal = (title) => {
    setShowModal(!showModal)
  }

  const modalBody = (
    <div style={modalStyle} className={classes.paper}>
      {/* <h2 style={{ textAlign: 'center' }} id='simple-modal-title'>Login</h2> */}
      {/* <p style={{ textAlign: 'center' }}>Currently Signin is not activated as registrations are going on. This will be activated in few days.</p> */}
      <AolLogin alert={props.alert} />
    </div>
  )
  useEffect(() => {

  }, [])

  return (
    <React.Fragment>
      <Nav />
      <div className='login-header' style={{ minHeight: '5vh' }}>
        <img src={Like} alt='Thank you' />
        <h1 style={{ fontSize: '42px', color: '#e64c3e', textAlign: 'center', padding: '0px 20px' }}>Thank you for Registering!</h1>
        <p style={{ textAlign: 'center', padding: '0px 20px' }}>You are one step closer to help your child learn and grow Click on Login to just jump right into a world of knowledge!</p>
        <Button variant='contained' onClick={handleModal} type='submit' style={{ color: '#fff', background: '#5fc4d6', padding: '6px 18px', boxShadow: 'none' }}>Login</Button>
      </div>
      <Modal
        open={showModal}
        onClose={handleModal}
        aria-labelledby='simple-modal-title'
        aria-describedby='simple-modal-description'
      >
        {modalBody}
      </Modal>
    </React.Fragment>
  )
}

export default ThankYou
