import React from 'react'
import { withStyles } from '@material-ui/core/styles'
import classes from './backdrop.module.css'

const styles = theme => ({
  icon: {
    margin: theme.spacing.unit,
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

const backdrop = (props) => (
  <div className={props.open ? classes.backdrop : classes.noBackdrop} onClick={props.click} style={props.zIndex ? { zIndex: +props.zIndex - 50 } : null}>
  </div>
)

export default withStyles(styles)(backdrop)
