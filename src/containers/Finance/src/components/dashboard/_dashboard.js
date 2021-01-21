import React from 'react'
import Modal from '@material-ui/core/Modal'
import { Grid, Button, IconButton } from '@material-ui/core'
import { Close } from '@material-ui/icons'
import { connect } from 'react-redux'
import { filterActions } from '../../_actions'
import { AdminConsolidationReport } from '../adminConsolidationReport'

class OMSDashboard extends React.Component {
  static defaultProps = {
    className: 'layout',
    items: 20,
    rowHeight: 30,
    onLayoutChange: function () {},
    cols: 12
  }
  constructor (props) {
    super(props)
    this.state = {
      open: false
    }
    this.userProfile = JSON.parse(localStorage.getItem('user_profile'))
    this.role = this.userProfile.personal_info.role
  }

  handleClick = () => {
    this.setState({ open: true })
  }

  handleClose = () => {
    this.setState({ open: false })
  }
  onLayoutChange (layout) {
    this.props.onLayoutChange(layout)
  }

  render () {
    return (
      <React.Fragment>
        { this.role === 'Admin'
          ? <React.Fragment>
            <Button variant='contained' color='primary' onClick={this.handleClick}>Consolidation Reports Widget</Button>
            <Modal open={this.state.open} onClose={this.handleClose}>
              <Grid style={{ margin: '16px auto', width: '90%', height: '80%', backgroundColor: 'white', overflow: 'scroll' }} container>
                <div style={{ float: 'right' }}>
                  <IconButton
                    onClick={this.handleClose}
                    color='inherit'
                    aria-label='Open drawer'
                  >
                    <Close />
                  </IconButton></div>
                <Grid container justify='space-around'>
                  <Grid item xs={12}>
                    <AdminConsolidationReport />
                  </Grid>
                </Grid>
              </Grid>
            </Modal>

          </React.Fragment>
          : ''}
      </React.Fragment>
    )
  }
}

const mapDispatchToProps = dispatch => ({
  update: (data) => dispatch(filterActions.update(data))
})

export default connect(null, mapDispatchToProps)(OMSDashboard)
