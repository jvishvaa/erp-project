import React from 'react'
import {
  makeStyles
} from '@material-ui/core'
import styles from './orchadioListeners.styles.js'

const useStyles = makeStyles(styles)

const AudioOverlay = ({
  children
}) => {
  const classes = useStyles()
  return (
    <div className={classes.audioOverlay}>
      {children}
    </div>
  )
}

export default AudioOverlay
