import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'
import AppBar from '@material-ui/core/AppBar'
import Tabs from '@material-ui/core/Tabs'
import Tab from '@material-ui/core/Tab'
import { Typography, Grid } from '@material-ui/core'
import { connect } from 'react-redux'
import Select from 'react-select'
import { apiActions } from '../../../../_actions'
import { Bank, AccToClass, AccToBranch, ViewBanks, ViewFeeAccounts, AccToStore } from '../index.js'
import Layout from '../../../../../../Layout'

function TabContainer ({ children, dir }) {
  return (
    <Typography component='div' dir={dir} style={{ padding: 8 * 3 }}>
      {children}
    </Typography>
  )
}

TabContainer.propTypes = {
  children: PropTypes.node.isRequired,
  // dir: PropTypes.string.isRequired
}

const styles = theme => ({
  root: {
    backgroundColor: theme.palette.background.paper,
    width: '100%',
    marginTop: '72px',
    marginLeft: '40px',
    paddingTop: '20px',
    minHeight: '75vh'
  }
})
const NavData = JSON.parse(localStorage.getItem('navigationData')) || {}

let moduleId = null
if (NavData && NavData.length) {
  NavData.forEach((item) => {
    if (
      item.parent_modules === 'Banks & Fee Accounts' &&
      item.child_module &&
      item.child_module.length > 0
    ) {
      item.child_module.forEach((item) => {
        if (item.child_name === 'Manage Bank & Fee Accounts') {
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
let userToken ='';
class TabView extends Component {
  state = {
    value: 'one',
    currentSession: null
  };
componentDidMount(){
   userToken = JSON.parse(localStorage.getItem('userDetails'))?.token;
}
  handleChange = (event, value) => {
    this.setState({ value })
  };

  handleChangeIndex = index => {
    this.setState({ value: index })
  };

  sessionChangeHandler = (e) => {
    this.setState({
      currentSession: e.value
    })
  }

  render () {
    let appBar = null
    if (this.state.currentSession) {
      appBar = (
        <React.Fragment>
          <AppBar position='static'>
            <Tabs value={this.state.value} onChange={this.handleChange}>
              <Tab value='one' label='Banks' />
              <Tab value='two' label='View Banks' />
              <Tab value='three' label='View Fee Accounts' />
              {/* <Tab value='four' label='Fee Accounts To Class' /> */}
              <Tab value='five' label='Fee Accounts To Branch' />
              <Tab value='six' label='Store Fee Accounts' />
              {/* <Tab value='six' label='AirPay Fee Account' /> */}
            </Tabs>
          </AppBar>
          {this.state.value === 'one' && <TabContainer><Bank alert={this.props.alert} user={userToken} currentSession={this.state.currentSession} /></TabContainer>}
          {this.state.value === 'two' && <TabContainer><ViewBanks alert={this.props.alert} user={userToken} currentSession={this.state.currentSession} /></TabContainer>}
          {this.state.value === 'three' && <TabContainer><ViewFeeAccounts alert={this.props.alert} user={userToken} currentSession={this.state.currentSession} /></TabContainer>}
          {this.state.value === 'four' && <TabContainer><AccToClass alert={this.props.alert} user={userToken} currentSession={this.state.currentSession} /></TabContainer>}
          {this.state.value === 'five' && <TabContainer><AccToBranch alert={this.props.alert} user={userToken} currentSession={this.state.currentSession} /></TabContainer>}
          {this.state.value === 'six' && <TabContainer><AccToStore alert={this.props.alert} user={userToken} currentSession={this.state.currentSession} /></TabContainer>}
          {/* {this.state.value === 'six' && <TabContainer><AirPayFeeAccount alert={this.props.alert} user={userToken} currentSession={this.state.currentSession} /></TabContainer>} */}
        </React.Fragment>
      )
    }
    return (
      <Layout>
      <div>
        <Grid container spacing={3} style={{ padding: 15 }}>
          <Grid item xs='3'>
            <label>Academic Year*</label>
            <Select
              placeholder='Select Session'
              value={this.state.currentSession ? ({
                value: this.state.currentSession,
                label: this.state.currentSession
              }) : null}
              options={
                this.props.session && this.props.session.session_year.length
                  ? this.props.session.session_year.map(session => ({ value: session, label: session })
                  ) : []}
              onChange={this.sessionChangeHandler}
            />
          </Grid>
        </Grid>
        { appBar }
      </div>
      </Layout>
    )
  }
}

const mapStateToProps = (state) => ({
  // user: state.authentication.user,
  session: state.academicSession.items
})

const mapDispatchToProps = (dispatch) => ({
  loadSession: dispatch(apiActions.listAcademicSessions(moduleId))
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles, { withTheme: true })(TabView))
