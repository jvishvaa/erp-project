import React from 'react'
import Popover from '@material-ui/core/Popover'
import AnnouncementIcon from '@material-ui/icons/Announcement'
import Typography from '@material-ui/core/Typography'
import { makeStyles } from '@material-ui/core/styles'
import Button from '@material-ui/core/Button'
// import IconButton from '@material-ui/core/IconButton'
// import DeleteIcon from '@material-ui/icons/Delete'
// import ArrowDownwardIcon from '@material-ui/icons/ArrowDownward'

const useStyles = makeStyles(theme => ({
  popover: {
    pointerEvents: 'none'
  },
  paper: {
    padding: theme.spacing(1)
  },
  margin: {
    margin: theme.spacing(1)
  },
  extendedIcon: {
    marginRight: theme.spacing(1)
  }
}))

export default function MouseOverPopover (props) {
  const classes = useStyles()
  const [anchorEl, setAnchorEl] = React.useState(null)

  const handlePopoverOpen = event => {
    setAnchorEl(event.currentTarget)
  }

  const handlePopoverClose = () => {
    setAnchorEl(null)
  }

  const open = Boolean(anchorEl)

  return (
    <div>
      <Typography
        aria-owns={open ? 'mouse-over-popover' : undefined}
        aria-haspopup='true'
        onMouseEnter={handlePopoverOpen}
        onMouseLeave={handlePopoverClose}
        // component='button'
        {...props}
      >
        <Button
          variant='raised'
          // color='primary'
          size='small'
          className={classes.button}
          startIcon={<AnnouncementIcon color='primary' fontSize='inherit' />}
        >
        Report an issue
        </Button>
        {/* <IconButton aria-label='delete' className={classes.margin} size='medium'>
          <AnnouncementIcon color='primary' fontSize='inherit' />
        </IconButton> */}
      </Typography>
      <Popover
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
        onClose={handlePopoverClose}
        disableRestoreFocus
      >
        <p>issue in question?, click to report</p>
      </Popover>
    </div>
  )
}
