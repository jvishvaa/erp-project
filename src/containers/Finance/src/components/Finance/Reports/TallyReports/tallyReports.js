import React, { Component } from 'react'
import Select from 'react-select'
import { connect } from 'react-redux'
import { FormControlLabel, Checkbox, Button, Grid } from '@material-ui/core/'

import { apiActions } from '../../../../_actions'
import { urls } from '../../../../urls'
import * as actionTypes from '../../store/actions'
import CircularProgress from '../../../../ui/CircularProgress/circularProgress'
import Layout from '../../../../../../Layout'

// const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
//   'July', 'August', 'September', 'October', 'November', 'December'
// ]


const NavData = JSON.parse(localStorage.getItem('navigationData')) || {};

let moduleId
if (NavData && NavData.length) {
  NavData.forEach((item) => {
    if (
      item.parent_modules === 'Reports' &&
      item.child_module &&
      item.child_module.length > 0
    ) {
      item.child_module.forEach((item) => {
        if (item.child_name === 'Tally Report') {
          // setModuleId(item.child_id);
          // setModulePermision(true);
            moduleId = item.child_id
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
class TallyReports extends Component {
    state ={
      session: [],
      sessionData: [],
      branchId: '',
      feeAccId: '',
      trnsId: '',
      trnsData: [],
      paymentModeId: [],
      paymentModeData: [],
      today: true,
      startDate: '',
      endDate: '',
      selectedBranches: null,
      selectedbranchIds: [],
      feeAccData: [],
      typeId: '',
      typeData: [],
      todayDate: '',
      role: '',
      branchIdAtAcc: null
    }
    componentDidMount () {
      let today = new Date()
      let dd = today.getDate()
      let mm = today.getMonth() + 1 // January is 0!
      let yyyy = today.getFullYear()
      if (dd < 10) {
        dd = '0' + dd
      }
      today = yyyy + '-' + mm + '-' + dd
      const userProfile = JSON.parse(localStorage.getItem('userDetails'))
      const role = userProfile.personal_info.role.toLowerCase()
      // const role = JSON.parse(localStorage.getItem('userDetails')).role_details.user_role
      this.setState({
        todayDate: today,
        role
      }, () => {
        if (this.state.role === 'financeaccountant') {
          this.props.fetchBranchAtAcc(this.props.alert, this.props.user)
        }
      })
      // role === 'BTM_Admin Venky' || role === 'F_acc'
    }
    componentWillReceiveProps (nextProps) {
      // console.log('------nextprops----------', nextProps)
      // console.log('-----state------', this.state)
      // if (this.state.confirmStatus) {
      //   this.setState({
      //     sessionData: [],
      //     selectedBranches: [],
      //     feeAccData: [],
      //     trnsData: [],
      //     paymentModeData: [],
      //     today: true,
      //     startDate: '',
      //     endDate: '',
      //     typeData: []
      //   })
      // }
    }

    handleAcademicyear = (e) => {
      const sessions = []
      e && e.forEach((val) => {
        sessions.push(val.value)
      })
      console.log(e)
      this.setState({ session: sessions, selectedBranches: [], sessionData: e }, () => {
        if (this.state.role === 'financeaccountant') {
          // console.log('====>result<====', this.props.branchAtAcc.branch)
          // this.props.fetchBranchAtAcc(this.props.alert, this.props.user)
          let data = {
            session_year: this.state.session,
            branch_id: [this.props.branchAtAcc.branch]
          }
          this.props.fetchFeeAccounts(data, this.props.alert, this.props.user)
        } else {
          this.props.fetchBranches(sessions, this.props.alert, this.props.user, moduleId)
        }
      })
    }
    changehandlerbranch = (e) => {
      const allLabel = e.filter(event => {
        return event.label === 'All Branches'
      })
      let data = null
      let ids = []
      if (allLabel.length === 1) {
        console.log('All Branch')
        // const allBranches = this.props.branches.map(branch => {
        //   return {
        //     value: branch.branch.id,
        //     label: branch.branch.branch_name
        //   }
        // })
        const allBranches = {
          value: 'all',
          label: 'All Branches'
        }
        const allBranchIds = this.props.branches.map(branch => {
          return branch.branch.id
        })
        console.log('-----alll branches id -------------', allBranchIds)
        this.setState({
          selectedBranches: allBranches,
          selectedbranchIds: 'all'
        }, () => {
          console.log('-selectedbranch-----------', this.state.selectedBranches)
          console.log('-selectedbranchId-----------', this.state.selectedbranchIds)
          data = {
            session_year: this.state.session,
            branch_id: this.state.selectedbranchIds,
            feeAccData: []
          }
          console.log('--data-----', data)
          this.props.fetchFeeAccounts(data, this.props.alert, this.props.user)
        })
      } else {
        e.forEach(branch => {
          ids.push(branch.value)
        })
        this.setState({
          selectedBranches: e, selectedbranchIds: ids, feeAccData: []
        }, () => {
          console.log('-selectedbranch-----------', this.state.selectedBranches)
          console.log('-selectedbranchId-----------', this.state.selectedbranchIds)
          data = {
            session_year: this.state.session,
            branch_id: this.state.selectedbranchIds
          }
          console.log('--data-----', data)
          this.props.fetchFeeAccounts(data, this.props.alert, this.props.user)
        })
      }
      // let data = {
      //   session_year: this.state.session,
      //   branch_id: this.state.selectedBranches
      // }
      // this.props.fetchFeeAccounts(data, this.props.alert, this.props.user)
    }
    changeFeeAccount = (e) => {
      const allLabel = e.filter(event => {
        return event.label === 'All Fee Accounts'
      })
      let ids = []
      if (allLabel.length === 1) {
        console.log('All Fee Account')
        const allFeeAccs = {
          value: 'all',
          label: 'All Fee Accounts'
        }
        this.setState({
          feeAccData: allFeeAccs,
          feeAccId: 'all'
        }, () => {
          console.log('-all fee accs-----------', this.state.feeAccData)
          console.log('-all fee accs ids-----------', this.state.feeAccId)
        })
      } else {
        e.forEach(fee => {
          ids.push(fee.value)
        })
        this.setState({ feeAccData: e, feeAccId: ids }, () => {
          console.log('-all fee accs-----------', this.state.feeAccData)
          console.log('-all fee accs ids-----------', this.state.feeAccId)
        })
      }
    }
    changeTransactions = (e) => {
      this.setState({ trnsId: e.value, trnsData: e })
    }
    changePaymentMode = (e) => {
      const allLabel = e.filter(event => {
        return event.label === 'All'
      })
      let ids = []
      if (allLabel.length === 1) {
        const allPayment = {
          value: 'all',
          label: 'All'
        }
        this.setState({
          paymentModeId: 'all', paymentModeData: allPayment
        }, () => {
          console.log('-all payment-----------', this.state.paymentModeId)
          console.log('-all payment-----------', this.state.paymentModeData)
        })
      } else {
        e.forEach(payment => {
          ids.push(payment.value)
        })
        this.setState({ paymentModeId: ids, paymentModeData: e })
      }
    }

    changedHandler = (name, event) => {
      this.setState({ [name]: event.target.checked })
    }
    startDateHandler = e => {
      this.setState({ startDate: e.target.value })
    }
    handleEndDate = (e) => {
      this.setState({ endDate: e.target.value })
      var startDate = document.getElementById('startDate').value
      var endDate = document.getElementById('endDate').value
      if (Date.parse(startDate) >= Date.parse(endDate)) {
        this.props.alert.warning('End date should be greater than Start date')
        this.setState({ endDate: '' })
      }
    }
    changeType = (e) => {
      this.setState({ typeId: e.value, typeData: e })
    }
    getReport = () => {
      console.log('I am Called')
      if (!this.state.session || this.state.feeAccData.length < 1 ||
        !this.state.trnsId || this.state.paymentModeData.length < 1 || !this.state.typeId
      ) {
        this.props.alert.warning('Select All Required Fields')
        return
      }
      let data = {}
      if (this.state.role === 'financeaccountant') {
        data = {
          session_year: this.state.session,
          branch: [this.props.branchAtAcc.branch],
          fee_account: this.state.feeAccId,
          transactions: this.state.trnsId,
          payment_mode: this.state.paymentModeId,
          download_type: this.state.typeId
        }
      } else {
        data = {
          session_year: this.state.session,
          branch: this.state.selectedbranchIds,
          fee_account: this.state.feeAccId,
          transactions: this.state.trnsId,
          payment_mode: this.state.paymentModeId,
          download_type: this.state.typeId
        }
      }

      if (this.state.today) {
        data.date_range = 2
        data.date = this.state.todayDate
      } else {
        data.date_range = 1
        data.from_date = this.state.startDate
        data.to_date = this.state.endDate
      }
      console.log('-----final data----------', data)
      this.props.downloadReports('TallyReport.xlsx', urls.DownloadTallyReport, data, this.props.alert, this.props.user)
    }
    render () {
      let selectBranch = null
      const { role } = this.state
      if (role === 'financeadmin') {
        selectBranch = (
          <Grid item xs='3'>
            <label>Branch*</label>
            <Select
              isMulti
              placeholder='Select Branch'
              value={this.state.selectedBranches ? this.state.selectedBranches : ''}
              options={
                this.state.selectedbranchIds !== 'all' ? this.props.branches.length && this.props.branches
                  ? this.props.branches.map(branch => ({
                    value: branch.branch ? branch.branch.id : '',
                    label: branch.branch ? branch.branch.branch_name : ''
                  }))
                  : [] : []
              }

              onChange={this.changehandlerbranch}
            />
          </Grid>
        )
      }
      return (
        <Layout>
        <React.Fragment>
          <Grid container spacing={3} style={{ padding: 15 }}>
            <Grid item xs='3' >
              <label>Academic Year*</label>
              <Select
                placeholder='Select Year'
                isMulti
                value={this.state.sessionData ? this.state.sessionData : null}
                options={
                  this.props.session ? this.props.session.session_year.map((session) =>
                    ({ value: session, label: session })) : []
                }
                onChange={this.handleAcademicyear}
              />
            </Grid>
            {selectBranch}
            <Grid item xs='3'>
              <label>Fee Account*</label>
              <Select
                placeholder='Fee Account'
                isMulti
                value={this.state.feeAccData ? this.state.feeAccData : ''}
                options={
                  this.state.feeAccId !== 'all' ? this.props.feeAccounts.length && this.props.feeAccounts
                    ? this.props.feeAccounts.map(fee => ({
                      value: fee.id ? fee.id : '',
                      label: fee.fee_account_name ? fee.fee_account_name : ''
                    }))
                    : [] : []
                }

                onChange={this.changeFeeAccount}
              />
            </Grid>
            <Grid item xs='3'>
              <label>Transactions*</label>
              <Select
                placeholder='Transactions'
                value={this.state.trnsData ? this.state.trnsData : ''}
                options={
                  [
                    {
                      value: 1,
                      label: 'Active'
                    },
                    {
                      value: 2,
                      label: 'Cancelled'
                    }
                    // {
                    //   value: 'all',
                    //   label: 'Both'
                    // }
                  ]
                }

                onChange={this.changeTransactions}
              />
            </Grid>
            <Grid item xs='3'>
              <label>Payment Mode*</label>
              <Select
                placeholder='Payment Mode'
                isMulti
                value={this.state.paymentModeData ? this.state.paymentModeData : ''}
                options={
                  this.state.paymentModeId !== 'all'
                    ? [
                      {
                        value: 'all',
                        label: 'All'
                      },
                      {
                        value: 5,
                        label: 'Online Payment'
                      },
                      {
                        value: 1,
                        label: 'Cash'
                      },
                      {
                        value: 2,
                        label: 'Cheque'
                      },
                      {
                        value: 3,
                        label: 'Internet Payment'
                      },
                      {
                        value: 4,
                        label: 'Credit/Debit Card Swipe'
                      },
                      {
                        value: 6,
                        label: 'Wallet'
                      },
                      {
                        value: 7,
                        label: 'Mpos'
                      }
                    ] : []
                }

                onChange={this.changePaymentMode}
              />
            </Grid>
            <Grid item xs='3'>
              <label>Date Range*</label><br />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={this.state.today}
                    onChange={(e) => this.changedHandler('today', e)}
                    color='primary'
                  />
                }
                label='Today'
              />
            </Grid>
            {!this.state.today
              ? <React.Fragment>
                <Grid item xs='3'>
                  <label>Start Date</label>
                  <input
                    type='date'
                    value={this.state.startDate}
                    onChange={this.startDateHandler}
                    className='form-control'
                    name='startDate'
                    id='startDate'
                  />
                </Grid>
                <Grid item xs='3'>
                  <label>End Date</label>

                  <input
                    type='date'
                    value={this.state.endDate}
                    className='form-control'
                    name='endDate'
                    id='endDate'
                    onChange={this.handleEndDate}
                  />
                </Grid>
              </React.Fragment>
              : null}
            <Grid item xs='3'>
              <label>Type*</label>
              <Select
                placeholder='Type'
                value={this.state.typeData ? this.state.typeData : ''}
                options={
                  [
                    {
                      value: 1,
                      label: 'Consolidated'
                    },
                    {
                      value: 2,
                      label: 'Individual'
                    }
                  ]
                }

                onChange={this.changeType}
              />
            </Grid>
            {/* <Grid.Row>
            <Grid.Column
              computer={4}
              mobile={16}
              tablet={4}
              className='student-section-inputField'
            >
              <label>Type*</label>
              <Select
                placeholder='Type'
                options={
                  [
                    {
                      value: 1,
                      label: 'Consolidated'
                    },
                    {
                      value: 2,
                      label: 'Individual'
                    }
                  ]
                }

                onChange={this.changeType}
              />
            </Grid.Column>
          </Grid.Row> */}
            <Grid item xs='3'>
              <Button
                style={{ marginTop: 20 }}
                variant='contained'
                color='primary'
                onClick={this.getReport}>
              Download Report
              </Button>
            </Grid>
            {this.props.dataLoading ? <CircularProgress open /> : null}
          </Grid>
        </React.Fragment>
        </Layout>
      )
    }
}

const mapStateToProps = state => ({
  user: state.authentication.user,
  session: state.academicSession.items,
  branches: state.finance.common.multipleBranchPerSession,
  branchAtAcc: state.finance.common.branchAtAcc,
  feeAccounts: state.finance.tallyReports.feeAccountPerBranch,
  dataLoading: state.finance.common.dataLoader
})

const mapDispatchToProps = dispatch => ({
  loadSession: dispatch(apiActions.listAcademicSessions(moduleId)),
  fetchBranches: (session, alert, user, moduleId) => dispatch(actionTypes.fetchBranchPerSession({ session, alert, user, moduleId })),
  fetchFeeAccounts: (data, alert, user) => dispatch(actionTypes.fetchFeeAccPerBranchAndAcad({ data, alert, user })),
  downloadReports: (reportName, url, data, alert, user) => dispatch(actionTypes.downloadReports({ reportName, url, data, alert, user })),
  fetchBranchAtAcc: (alert, user) => dispatch(actionTypes.fetchBranchAtAcc({ alert, user }))
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(TallyReports)
