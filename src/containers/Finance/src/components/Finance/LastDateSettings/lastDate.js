import React, { Component } from 'react'
import { withStyles, Typography, Grid } from '@material-ui/core/'
import { withRouter } from 'react-router-dom'
import Select from 'react-select'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import AppBar from '@material-ui/core/AppBar'
import Tabs from '@material-ui/core/Tabs'
import Tab from '@material-ui/core/Tab'
// import ReactTable from 'react-table'
import CircularProgress from '../../../ui/CircularProgress/circularProgress'
import * as actionTypes from '../store/actions/index'
import { apiActions } from '../../../_actions'
import '../../css/staff.css'
import BackDateSelection from './backDateSelection'
import ConcessionLastDate from './concessionLastDate'
import PartialPayment from './partialPayment'
import Layout from '../../../../../Layout'
// import { urls } from '../../../urls'

const styles = theme => ({
  tableWrapper: {
    overflowX: 'auto'
  },
  root: {
    width: '90%'
  }
})

TabContainer.propTypes = {
  children: PropTypes.node.isRequired
}

function TabContainer ({ children, dir }) {
  return (
    <Typography component='div' dir={dir} style={{ padding: 8 * 3 }}>
      {children}
    </Typography>
  )
}
const NavData = JSON.parse(localStorage.getItem('navigationData')) || {}
let moduleId = null

if (NavData && NavData.length) {
  NavData.forEach((item) => {
    if (
      item.parent_modules === 'Settings' &&
      item.child_module &&
      item.child_module.length > 0
    ) {
      item.child_module.forEach((item) => {
        if (item.child_name === 'Last Date Settings') {
          // setModuleId(item.child_id);
          // setModulePermision(true);
          // this.setState({
            moduleId= item.child_id
          // })
        } else {
          // setModulePermision(false);
        }
      });
    } else {
      // setModulePermision(false);
    }
  });
} else {
  // setModulePermision(false);
}
class LastDateSettings extends Component {
  constructor (props) {
    super(props)
    this.state = {
      currentSession: null,
      sessionData: null,
      value: 'one'

    }
  }

  componentDidMount () {

  }

  componentDidUpdate () {
  }

  handleChange = (event, value) => {
    this.setState({ value })
  }

  handleChangeIndex = index => {
    this.setState({ value: index })
  }

  handleAcademicyear = (e) => {
    this.setState({ currentSession: e.value, sessionData: e })
  }

  render () {
    // let { classes } = this.props
    let tabBar = null

    if (this.state.currentSession) {
      tabBar = (
        <React.Fragment>
          <AppBar position='static'>
            <Tabs value={this.state.value} onChange={this.handleChange}>
              <Tab value='one' label='Concession Back Date' />
              <Tab value='two' label='Back Date Selection' />
              <Tab value='three' label='Partial Payment Last Date' />
            </Tabs>
          </AppBar>
          {this.state.value === 'one' && <TabContainer>
            <ConcessionLastDate alert={this.props.alert}
              session={this.state.currentSession}
              user={this.props.user} />
          </TabContainer>}
          {this.state.value === 'two' && <TabContainer>
            <BackDateSelection alert={this.props.alert}
              session={this.state.currentSession}
              user={this.props.user} />
          </TabContainer>}
          {this.state.value === 'three' && <TabContainer>
            <PartialPayment alert={this.props.alert}
              session={this.state.currentSession}
              user={this.props.user} />
          </TabContainer>

          }
        </React.Fragment>
      )
    }
    return (
      <Layout>
      <React.Fragment>
        <Grid container spacing={3} style={{ padding: 15 }}>
          <Grid item xs='3'>
            <label>Academic Year*</label>
            <Select
              placeholder='Select Year'
              value={this.state.sessionData ? this.state.sessionData : null}
              options={
                this.props.session
                  ? this.props.session.session_year.map(session => ({
                    value: session,
                    label: session
                  }))
                  : []
              }
              onChange={this.handleAcademicyear}
            />
          </Grid>
        </Grid>
        <div>
          {tabBar}
        </div>
        {this.props.dataLoading ? <CircularProgress open /> : null}
      </React.Fragment>
      </Layout>
    )
  }
}

const mapStateToProps = state => ({
  user: state.authentication.user,
  session: state.academicSession.items,
  feeTypeList: state.finance.itc.feeTypeList,
  dataLoading: state.finance.common.dataLoader
})

const mapDispatchToProps = dispatch => ({
  loadSession: dispatch(apiActions.listAcademicSessions(moduleId)),
  fetchBranches: (session, alert, user, moduleId) => dispatch(actionTypes.fetchBranchPerSession({ session, alert, user, moduleId }))

})

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(withRouter(LastDateSettings)))
