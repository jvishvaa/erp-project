import React, { Component } from 'react'
import PropTypes from 'prop-types'
import AppBar from '@material-ui/core/AppBar'
import Tabs from '@material-ui/core/Tabs'
import Tab from '@material-ui/core/Tab'
import { connect } from 'react-redux' 
import { withStyles, Typography, Grid } from '@material-ui/core/'
import Select from 'react-select'

import * as actionTypes from '../../store/actions'
import Layout from '../../../../../../Layout'

// const BankDeposit = React.lazy(() => import(/* webpackChunkName: 'ADfIN' */'./PettyDeposit/bankDeposit'))
// const ViewDeposits = React.lazy(() => import(/* webpackChunkName: 'ADfIN' */'./ViewDeposits/viewDeposits'))
// const ExpenseDeposit = React.lazy(() => import(/* webpackChunkName: 'ADfIN' */'./ExpenseDeposit/expenseDeposit'))
// const CollectionDeposit = React.lazy(() => import(/* webpackChunkName: 'ADfIN' */'./CollectionDeposit/collectionDeposit'))
import BankDeposit from './PettyDeposit/bankDeposit';
import ViewDeposits  from './ViewDeposits/viewDeposits';
import ExpenseDeposit  from './ExpenseDeposit/expenseDeposit';
import CollectionDeposit from './CollectionDeposit/collectionDeposit'

const NavData = JSON.parse(localStorage.getItem('navigationData')) || {}
function TabContainer ({ children, dir }) {
  return (
    <Typography component='div' dir={dir} style={{ padding: 8 * 3 }}>
      {children}
    </Typography>
  )
}

TabContainer.propTypes = {
  children: PropTypes.node.isRequired
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

class DepositTab extends Component {
  state = {
    value: 'one',
    currentSession: null,
    currentBranch: null,
    moduleId: null
  };
  componentDidMount () {
    if (NavData && NavData.length) {
      NavData.forEach((item) => {
        if (
          item.parent_modules === 'Expense Management' &&
          item.child_module &&
          item.child_module.length > 0
        ) {
          item.child_module.forEach((item) => {
            if (item.child_name === 'Deposit') {
              // setModuleId(item.child_id);
              // setModulePermision(true);
              this.setState({
                moduleId: item.child_id
              })
              console.log('id+', item.child_id)
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
  }
  handleChange = (event, value) => {
    this.setState({ value })
  };

  handleChangeIndex = index => {
    this.setState({ value: index })
  };

  fetchBranchHandler = (e) => {
    this.props.fetchBranches(e.value, this.props.alert, this.props.user, this.state.moduleId)
    this.setState({
      currentSession: e.value
    })
  }

  branchChangeHandler = (e) => {
    this.setState({
      currentBranch: {
        id: e.value,
        branch_name: e.label
      }
    })
  }
  render () {
    let tabBar = null
    if (this.state.currentBranch) {
      tabBar = (
        <React.Fragment>
          <AppBar position='static'>
            <Tabs value={this.state.value} onChange={this.handleChange}>
              <Tab value='one' label='Petty Deposit' />
              <Tab value='three' label='Expense Deposit' />
              <Tab value='four' label='Collection Deposit' />
              <Tab value='two' label='View Deposits' />
            </Tabs>
          </AppBar>
          {this.state.value === 'one' && <TabContainer>
            <BankDeposit alert={this.props.alert}
              branch={this.state.currentBranch}
              session={this.state.currentSession}
              user={this.props.user} />
          </TabContainer>}
          {this.state.value === 'two' && <TabContainer>
            <ViewDeposits alert={this.props.alert}
              branch={this.state.currentBranch}
              session={this.state.currentSession}
              user={this.props.user} />
          </TabContainer>}
          {this.state.value === 'three' && <TabContainer>
            <ExpenseDeposit alert={this.props.alert}
              branch={this.state.currentBranch}
              session={this.state.currentSession}
              user={this.props.user} />
          </TabContainer>}
          {this.state.value === 'four' && <TabContainer>
            <CollectionDeposit alert={this.props.alert}
              branch={this.state.currentBranch}
              session={this.state.currentSession}
              branchSet={this.props.branches}
              user={this.props.user} />
          </TabContainer>}
        </React.Fragment>
      )
    }

    return (
        <Layout>
      <div>
        <Grid container spacing={3} style={{ padding: 15 }}>
          <Grid item xs='3'>
            <label>Financial Year*</label>
            <Select
              placeholder='Select Session'
              value={this.state.currentSession ? ({
                value: this.state.currentSession,
                label: this.state.currentSession
              }) : null}
              options={
                this.props.session.length
                  ? this.props.session.map(session => ({ value: session.session_year, label: session.session_year })
                  ) : []}
              onChange={this.fetchBranchHandler}
            />
          </Grid>
          <Grid item xs='3'>
            <label>Branch*</label>
            <Select
              placeholder='Select Branch'
              value={this.state.currentBranch ? ({
                value: this.state.currentBranch.id,
                label: this.state.currentBranch.branch_name
              }) : null}
              options={
                this.props.branches.length
                  ? this.props.branches.map(branch => ({
                    value: branch.branch.id,
                    label: branch.branch.branch_name
                  }))
                  : []
              }
              onChange={this.branchChangeHandler}
            />
          </Grid >
        </Grid>
        {tabBar}

      </div>
      </Layout>
    )
  }
}

const mapStateToProps = (state) => ({
  user: state.authentication.user,
  branches: state.finance.common.branchPerSession,
  session: state.finance.common.financialYear
})

const mapDispatchToProps = (dispatch) => ({
  fetchBranches: (session, alert, user, moduleId) => dispatch(actionTypes.fetchBranchPerSession({ session, alert, user, moduleId})),
  loadFinancialYear: dispatch(actionTypes.fetchFinancialYear())
})

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles, { withTheme: true })(DepositTab))
