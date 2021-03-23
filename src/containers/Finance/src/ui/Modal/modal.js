import React from 'react'
import classes from './modal.module.css'
import Backdrop from '../Backdrop/backdrop'

const modal = (props) => {
  let classNames = ''
  if (props.open && props.small) {
    classNames = classes.modal__small
  } else if (props.open && props.medium) {
    classNames = classes.modal__medium
  } else if (props.open && props.large) {
    classNames = classes.modal__large
  } else if (props.open) {
    classNames = classes.modal
  } else {
    classNames = classes.noModal
  }
  return (
    <React.Fragment>
      <Backdrop open={props.open} click={props.click}
        zIndex={props.style && (props.style.zIndex || props.style['z-index']) ? (props.style.zIndex || props.style['z-index']) : null} />
      <div className={classNames} style={props.style}>
        {props.children}
      </div>
    </React.Fragment>
  )
}

export default modal
