import React, { useState } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import { Button, Modal } from '@material-ui/core'
import { Link } from 'react-router-dom'
import './aol.css'
import logo from './assets/logo.png'
import AolLogin from './aolLogin'
import ClassCounter from './classCounter'

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

function Nav (props) {
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
  return (
    <nav className='aol_nav'>
      <Link to='/'><img src={logo} className='App-logo' alt='logo' /></Link>
      {!props.isMobile
        ? <ClassCounter duration={props.duration} classNo={props.classNo} /> : ''}
      <ul className='nav-links'>
        {/* <Link to='/login' className='link-style'>
          <li><Button variant='outlined' style={{ color: '#46b6cf', border: '1px solid rgb(70, 182, 207)'}}>LOGIN</Button></li>
        </Link> */}
        {/* <Link to='/videos' className='link-style'> */}
        <li><Button variant='contained' onClick={handleModal} type='submit' style={{ color: '#fff', background: '#5fc4d6', padding: '6px 18px', boxShadow: 'none' }}>Login</Button></li>
        {/* </Link> */}
      </ul>
      <Modal
        open={showModal}
        onClose={handleModal}
        aria-labelledby='simple-modal-title'
        aria-describedby='simple-modal-description'
      >
        {modalBody}
      </Modal>
    </nav>
  )
}

export default Nav
