import React from 'react'
import CircularProgress from '@material-ui/core/CircularProgress'
import { withStyles } from '@material-ui/core/styles'
import Backdrop from '../Backdrop/backdrop'

const styles = theme => ({
  progress: {
    margin: theme.spacing.unit * 2,
    position: 'fixed',
    top: 'calc(50% - 30px)',
    left: 'calc(50% - 30px)',
    width: '60px !important',
    height: '60px !important',
    'z-index': '1550',
    color: '#5d1049'
  }
})

const circularProgress = (props) => {
  return (
    <div>
      <Backdrop open={props.open} onClick={() => {}} zIndex='1550' />
      <CircularProgress className={props.classes.progress} />
    </div>
  )
}

export default withStyles(styles)(circularProgress)
