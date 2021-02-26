import React, { Component } from 'react'
import { Grid, Button, TablePagination } from '@material-ui/core'
import Select from 'react-select'
import { withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
// import FeeShowList from './FeeShowList'
import { apiActions } from '../../../../_actions'
import Layout from '../../../../../../Layout'
// import * as actionTypes from '../store/action'

class FeeCollection extends Component {
  constructor (props) {
    super(props)
  this.state = {
    FeeCollecyionType: '',
    SubType: '',
    FeeAccount: '',
    sessionData: ''
  }
  this.buttonHandler = this.buttonHandler.bind(this)
  this.selectHandler = this.selectHandler.bind(this)
}
  
  buttonHandler = (e) => {
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
  }

  render () {
    return (
      <Layout>
      <div style={{ marginLeft: '20px', marginTop: '10px' }}>
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
                <Button variant='contained' color='primary' onClick={this.buttonHandler}
                  style={{ marginTop: '25px', marginLeft: '20px' }}
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
  session: state.academicSession.items
})

const mapDispatchToProps = dispatch => ({
  loadSession: dispatch(apiActions.listAcademicSessions())
  // fetchFeeCollection: (session, user, alert) => dispatch(actionTypes.fetchFeeCollectionList({ session, user, alert }))
})

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(FeeCollection))
