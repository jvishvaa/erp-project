import React from 'react'
import MenuIcon from '@material-ui/icons/Menu'
import classNames from 'classnames'
import IconButton from '@material-ui/core/IconButton'
import { connect } from 'react-redux'
import { viewActions } from '../../../_actions'

class SidebarToggle extends React.Component {
    handleDrawerToggle = () => {
      this.props.toggleSidebar()
    }
    render () {
      let { classes } = this.props
      return <IconButton
        color='inherit'
        aria-label='Open drawer'
        onClick={this.handleDrawerToggle}
        className={classNames(classes.menuButton)}
      >
        <MenuIcon />
      </IconButton>
    }
}

const mapDispatchToProps = dispatch => ({
  toggleSidebar: () => dispatch(viewActions.toggleSidebar())
})

export default connect(null, mapDispatchToProps)(SidebarToggle)
