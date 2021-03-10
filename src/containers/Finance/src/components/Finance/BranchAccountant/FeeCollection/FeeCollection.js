import React, { Component } from 'react'
import { Grid, Button } from '@material-ui/core'
import Select from 'react-select'
import { withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import * as actionTypes from '../../store/actions'
// import FeeShowList from './FeeShowList'
import { apiActions } from '../../../../_actions'
import Layout from '../../../../../../Layout'
// import * as actionTypes from '../store/action'

class FeeCollection extends Component {
  state = {
    FeeCollecyionType: '',
    SubType: '',
    FeeAccount: '',
    sessionData: ''
  }
  componentDidMount () {
    this.props.fetchBranchData(this.props.alert, this.props.user)
  }
  ButtonHandler = (e) => {
    if (this.state.sessionData.value) {
      // this.props.fetchFeeCollection(this.state.sessionData.value, this.props.user, this.props.alert)
      this.props.history.push({
        pathname: '/finance/feeShowList/',
        state: {
          session: this.state.sessionData.value
        }
      })
    } else {
      this.props.alert.warning('Select All Required fields')
    }
  }

  selectHandler = (e) => {
    this.setState({ sessionData: e })
    console.log(e)
    this.props.fetchReceiptRange(e.value, this.props.branchData && this.props.branchData.id, this.props.alert, this.props.user)
  }

  render () {
    return (
      <Layout>
      <div style={{ marginLeft: '20px', marginTop: '20px' }}>
        <Grid container spacing={3}>
          <Grid item xs={3}>
            <label>Academic Year*</label><br />
            <Select
              placeholder='Select Year'
              style={{ width: '100px' }}
              value={this.state.sessionData ? this.state.sessionData : null}
              options={
                this.props.session && this.props.session.session_year.length > 0
                  ? this.props.session.session_year.map((session) => ({ value: session, label: session }))
                  : []}
              onChange={(e) => { this.selectHandler(e) }}
            />
          </Grid>
          {
            this.state.sessionData
              ? <Grid item xs={3}>
                <Button variant='contained' color='primary' onClick={this.ButtonHandler}
                  style={{ marginTop: '20px', marginLeft: '20px' }}
                >
                Add Entry
                  {/* {this.state.clicked
                  ? <FeeShowList
                    sessionYear={this.state.sessionData.value}
                  />
                  : null} */}
                </Button>
              </Grid> : null
          }
        </Grid>
      </div>
      </Layout>
    )
  }
}

const mapStateToProps = state => ({
  user: state.authentication.user,
  session: state.academicSession.items,
  branchData: state.finance.accountantReducer.financeAccDashboard.branchData
})

const mapDispatchToProps = dispatch => ({
  fetchReceiptRange: (session, branch, alert, user) => dispatch(actionTypes.fetchReceiptRange({ session, branch, alert, user })),
  fetchBranchData: (alert, user) => dispatch(actionTypes.fetchAccountantBranch({ alert, user })),
  loadSession: dispatch(apiActions.listAcademicSessions())
  // fetchFeeCollection: (session, user, alert) => dispatch(actionTypes.fetchFeeCollectionList({ session, user, alert }))
})

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(FeeCollection))
