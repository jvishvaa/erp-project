import React from 'react'
import PropTypes from 'prop-types'
import { makeStyles } from '@material-ui/core/styles'
import Modal from '@material-ui/core/Modal'
import Backdrop from '@material-ui/core/Backdrop'
import { useSpring, animated } from 'react-spring/web.cjs' // web.cjs is required for IE 11 support

const useStyles = makeStyles((theme) => ({
  modal: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    maxHeight: '100vh',
    overflow: 'auto'
  },
  paper: {
    position: 'fixed',
    left: 0,
    top: 0,
    backgroundColor: theme.palette.background.paper,
    maxHeight: '100vh',
    overflow: 'hidden',
    width: '100vw',
    height: '100vh'
  }
}))

const Fade = React.forwardRef(function Fade (props, ref) {
  const { in: open, children, onEnter, onExited, ...other } = props
  const style = useSpring({
    from: { opacity: 0 },
    to: { opacity: open ? 1 : 0 },
    onStart: () => {
      if (open && onEnter) {
        onEnter()
      }
    },
    onRest: () => {
      if (!open && onExited) {
        onExited()
      }
    }
  })

  return (
    <animated.div ref={ref} style={style} {...other}>
      {children}
    </animated.div>
  )
})

Fade.propTypes = {
  children: PropTypes.element,
  in: PropTypes.bool.isRequired,
  onEnter: PropTypes.func,
  onExited: PropTypes.func
}

export default function SpringModal (props) {
  const classes = useStyles()
  return (<Modal
    aria-labelledby='spring-modal-title'
    aria-describedby='spring-modal-description'
    className={classes.modal}
    open={props.open}
    onClose={props.onClose}
    closeAfterTransition
    BackdropComponent={Backdrop}
    BackdropProps={{
      timeout: 500
    }}
  >
    <Fade in={props.open}>
      <div className={classes.paper}>
        <iframe id='correction-iframe' src={props.link} frameBorder='0' style={{ overflow: 'hidden', height: '100vh', width: '100vw' }} height='100%' width='100%' />
      </div>
    </Fade>
  </Modal>
  )
}
