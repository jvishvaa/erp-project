import React, { Component } from 'react'
import Popover from '@material-ui/core/Popover'
import Typography from '@material-ui/core/Typography'
import { withStyles } from '@material-ui/core/styles'

const styles = theme => ({
  popover: {
    pointerEvents: 'none'
  },
  paper: {
    padding: theme.spacing.unit
  }
})
class PopoverTemplate extends Component {
    state = {
      anchorEl: null
    };
    handlePopoverOpen = event => {
      this.setState({ anchorEl: event.currentTarget })
    };

      handlePopoverClose = () => {
        this.setState({ anchorEl: null })
      };
      render () {
        const { classes } = this.props
        const { anchorEl } = this.state
        const open = Boolean(anchorEl)
        return <Popover
          id='mouse-over-popover'
          className={classes.popover}
          classes={{
            paper: classes.paper
          }}
          open={open}
          anchorEl={anchorEl}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'left'
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'left'
          }}
          onClose={this.handlePopoverClose}
          disableRestoreFocus
        >
          <Typography>I use Popover.</Typography>
        </Popover>
      }
}

export default withStyles(styles)(PopoverTemplate)
