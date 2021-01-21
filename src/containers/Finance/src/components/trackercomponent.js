import React from 'react'
import { CircularProgress, withStyles } from '@material-ui/core'
import tracker from '../tracker'

let styles = theme => ({
  progress: {
    color: 'white',
    margin: theme.spacing.unit * 2
  }
})
class TrackerComponent extends React.Component {
  constructor () {
    super()
    this.state = {
      loading: false
    }
  }
  componentDidMount () {
    let _this = this
    tracker.onmessage = function (event) {
      if (event.data === 'STARTED') {
        _this.setState({ loading: true })
      } else {
        _this.setState({ loading: false })
      }
    }
  }
  render () {
    let { classes } = this.props
    return this.state.loading ? <CircularProgress className={classes.progress} thickness={4} size={26} color={'secondary'} /> : null
  }
}

export default withStyles(styles)(TrackerComponent)
