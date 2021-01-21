import React from 'react'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'
import classes from './backdrop.module.css'

const styles = (theme) => ({
  icon: {
    margin: theme.spacing(1),
    fontSize: 32,
    color: '#fff',
    position: 'fixed',
    top: '10px',
    right: '15px',
    '&:hover': {
      cursor: 'pointer'
    }
  }
})

const Backdrop = ({ open, click, zIndex }) => {
  const escKeyDownHandler = (event) => {
    if (event.keyCode === 27) {
      click()
    }
  }

  return (
    <div
      className={open ? classes.backdrop : classes.noBackdrop}
      onClick={click}
      role='presentation'
      onKeyDown={escKeyDownHandler}
      style={zIndex ? { zIndex: +zIndex - 50 } : null}
    >
      {/* <CloseIcon className={props.classes.icon} onClick={() => {console.log("Hii There")}}/> */}
    </div>
  )
}

Backdrop.propTypes = {
  open: PropTypes.bool.isRequired,
  click: PropTypes.func,
  zIndex: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
}

Backdrop.defaultProps = {
  zIndex: 0,
  click: () => {}
}
export default withStyles(styles)(Backdrop)
