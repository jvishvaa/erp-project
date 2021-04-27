import React, { Component } from 'react'
import { connect } from 'react-redux'
import SwipeableDrawer from '@material-ui/core/SwipeableDrawer'

class FinanceFilter extends Component {
  render () {
    let filterList = null
    if (this.props.role === 'FinanceAccountant') {
      filterList = (
        <React.Fragment>

        </React.Fragment>
      )
    }
    return (
      <div>
        <SwipeableDrawer
          anchor='right'
          open={this.props.open}
          onClose={() => this.props.toggleDrawer(false)}
          onOpen={() => this.props.toggleDrawer(true)}
        >
          <div
            tabIndex={0}
            role='button'
            onClick={() => this.props.toggleDrawer(false)}
            onKeyDown={() => this.props.toggleDrawer(false)}
          >
            <div>Hey I am The best</div>
            {filterList}
          </div>
        </SwipeableDrawer>
      </div>
    )
  }
}

const mapStateToProps = (state) => ({
  user: state.authentication.user,
  session: state.academicSession.items,
  branches: state.finance.common.branchPerSession
})

export default connect(
  mapStateToProps
)(FinanceFilter)
