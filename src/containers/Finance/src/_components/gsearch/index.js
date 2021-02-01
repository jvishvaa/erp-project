import React, { useState } from 'react'
import SearchIcon from '@material-ui/icons/Search'
import InputBase from '@material-ui/core/InputBase'
import { fade } from '@material-ui/core/styles/colorManipulator'
import { withStyles } from '@material-ui/core/styles'
import Popper from '@material-ui/core/Popper'
import Fade from '@material-ui/core/Fade'
import Paper from '@material-ui/core/Paper'
import Typography from '@material-ui/core/Typography'

const styles = theme => ({
  searchIcon: {
    width: theme.spacing.unit * 9,
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  inputRoot: {
    color: 'inherit',
    width: '100%'
  },
  inputInput: {
    paddingTop: theme.spacing.unit,
    paddingRight: theme.spacing.unit,
    paddingBottom: theme.spacing.unit,
    paddingLeft: theme.spacing.unit * 10,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      width: 120,
      '&:focus': {
        width: 200
      }
    }
  },
  search: {
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: fade(theme.palette.common.white, 0.15),
    '&:hover': {
      backgroundColor: fade(theme.palette.common.white, 0.25)
    },
    marginLeft: 0,
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      marginLeft: theme.spacing.unit,
      width: 'auto'
    }
  }
})
function GSearch (props) {
  let { classes } = props
  const [anchorEl, setAnchorEl] = useState(null)
  const [popperOpen, setPopperOpen] = useState(false)
  return <React.Fragment>
    <div style={{ display: props.isMobile ? 'none' : 'block', marginRight: 8 }} className={classes.search}>
      <div className={classes.searchIcon}>
        <SearchIcon />
      </div>
      <InputBase
        placeholder='Search…'
        classes={{
          root: classes.inputRoot,
          input: classes.inputInput
        }}
        onFocus={(e) => { setAnchorEl(e.target); setPopperOpen(true) }}
      // onBlur={() => this.setState({ searching: false })}
      // onFocus={() => this.setState({ searching: true })}
      // onChange={this.changeQuery}
      />
    </div>
    <div>
      <Popper style={{ zIndex: 3000,
        marginTop: 24,
        width: 700,
        height: 300,
        background: 'white',
        boxShadow: '0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24)',
        transition: 'all 0.3s cubic-bezier(.25,.8,.25,1)' }} open={popperOpen} anchorEl={anchorEl} >
        {({ TransitionProps }) => (
          <Fade {...TransitionProps} timeout={350}>
            <Paper style={{ width: 700, height: 300, zIndex: 3000 }}>
              <Typography className={classes.typography}>The content of the Popper.</Typography>
            </Paper>
          </Fade>
        )}
      </Popper>
    </div>
  </React.Fragment>
}

export default withStyles(styles)(GSearch)
