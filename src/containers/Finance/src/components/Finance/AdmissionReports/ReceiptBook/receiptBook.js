import React, { Component } from 'react'
import Select from 'react-select'
import { connect } from 'react-redux'
import { Button, Grid } from '@material-ui/core/'

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
        if (item.child_name === 'Application/registration Receipt Book') {
          // setModuleId(item.child_id);
          // setModulePermision(true);
            moduleId = item.child_id
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
class ReceiptBookAdm extends Component {
    state ={
      session: '',
      sessionData: [],
      branchId: '',
      startDate: '',
      endDate: '',
      selectedBranches: [],
      selectedTypes: [],
      typesId: '',
      selectedFeeTypes: [],
      feeTypeId: [],
      selectedFeeAccount: [],
      feeAccId: [],
      paymentModeId: [],
      paymentModeData: [],
      role: ''
    }
    componentDidMount () {
      // this.todayDate()
      if(this.props.user === null){
        window.location.reload();
      }
      const userProfile = JSON.parse(localStorage.getItem('userDetails'))
      const role = userProfile?.personal_info?.role?.toLowerCase()
      this.setState({
        role
      }
      // , 
      // () => {
      //   if (this.state.role === 'financeaccountant') {
      //     this.props.fetchBranchAtAcc(this.props.alert, this.props.user)
      //   }
      // }
      )
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
      this.setState({ session: e.value, selectedBranches: [], sessionData: e }, () => {
        // if (this.state.role === 'financeaccountant') {
        //   // this.props.fetchBranchAtAcc(this.props.alert, this.props.user)
        //   this.props.fetchFeeAccounts(this.state.session, this.props.branchAtAcc.branch, this.props.alert, this.props.user)
        // } else {
          this.props.fetchBranches(e.value, this.props.alert, this.props.user, moduleId)
        // }
      })
    }
    changehandlerbranch = (e) => {
      const allLabel = e && e.filter(event => {
        return event && event.label === 'All Branches'
      })
      let ids = []
      if (allLabel && allLabel.length === 1) {
        const allBranches = {
          value: 'all',
          label: 'All Branches'
        }
        const allBranchIds = this.props.branches.map(branch => {
          return branch.branch.id
        }).filter(ele => ele !== 'all')
        this.setState({
          selectedBranches: allBranches,
          branchId: allBranchIds,
          selectedTypes: []
        }, () => {
          this.props.fetchFeeAccounts(this.state.session, this.state.branchId, this.props.alert, this.props.user)
        })
      } else {
        e && e.forEach(payment => {
          ids.push(payment.value)
        })
        this.setState({
          selectedBranches: e,
          branchId: ids,
          selectedTypes: []
        }, () => {
       
          this.props.fetchFeeAccounts(this.state.session, this.state.branchId, this.props.alert, this.props.user)
        })
      }
    }
    changeFeeAccountHandler = (e) => {
      const allLabel = e && e.filter(event => {
        return event && event.label === 'All Fee Account'
      })
      if (allLabel && allLabel.length === 1) {
        const allAccounts = {
          value: 'all',
          label: 'All Fee Account'
        }
        const allFeeAccIds = this.props.feeAccounts.map(fee => {
          return fee.id
        }).filter(ele => ele !== 'all')
        this.setState({
          selectedFeeAccount: allAccounts,
          feeAccId: allFeeAccIds
        })
      } else {
        let ids = []
        e && e.forEach(acc => {
          ids.push(acc.value)
        })
        this.setState({
          selectedFeeAccount: e,
          feeAccId: ids
        })
      }
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
    changePaymentMode = (e) => {
      const allLabel = e && e.filter(event => {
        return event && event.label === 'All'
      })
      let ids = []
      if (allLabel && allLabel.length === 1) {
        const allPayment = {
          value: 'all',
          label: 'All'
        }
        this.setState({
          paymentModeId: [1, 2, 3, 4], paymentModeData: allPayment
        }, () => {
       
        })
      } else {
        e && e.forEach(payment => {
          ids.push(payment.value)
        })
        this.setState({ paymentModeId: ids, paymentModeData: e })
      }
    }
    getReport = () => {
      if (!this.state.session || !this.state.endDate ||
        !this.state.startDate || !this.state.feeAccId
      ) {
        this.props.alert.warning('Select All Required Fields')
        return
      }
      let data = {}
      // if (this.state.role === 'financeaccountant') {
      //   data = {
      //     academic_year: this.state.session,
      //     branches: [this.props.branchAtAcc.branch],
      //     fee_account: this.state.selectedFeeAccount && this.state.selectedFeeAccount.value === 'all' ? 'all' : this.state.feeAccId,
      //     payment_mode: [this.state.paymentModeId],
      //     from_date: this.state.startDate,
      //     to_date: this.state.endDate
      //   }
      // } else {
        data = {
          academic_year: this.state.session,
          branches: this.state.branchId,
          fee_account: this.state.selectedFeeAccount && this.state.selectedFeeAccount.value === 'all' ? 'all' : this.state.feeAccId,
          payment_mode: this.state.paymentModeId,
          from_date: this.state.startDate,
          to_date: this.state.endDate
        }
      // }
      this.props.downloadReports('AdmReceiptBook.xlsx', urls.DownloadAdmRecptBook, data, this.props.alert, this.props.user)
    }
    render () {
      return (
        <Layout>
        <React.Fragment>
          <Grid container spacing={3} style={{ padding: 15 }}>
            <Grid item xs={3} >
              <label>Academic Year*</label>
              <Select
                placeholder='Select Year'
                value={this.state.sessionData ? this.state.sessionData : null}
                options={
                  this.props.session ? this.props.session.session_year.map((session) =>
                    ({ value: session, label: session })) : []
                }
                onChange={this.handleAcademicyear}
              />
            </Grid>
            <Grid item xs='3' >
              <label>Branch*</label>
              <Select
                isMulti
                placeholder='Select Branch'
                value={this.state.selectedBranches ? this.state.selectedBranches : ''}
                options={
                  // this.state.selectedBranches && this.state.selectedBranches.value !== 'all' ? this.props.branches.length && this.props.branches
                  this.props.branches ? this.props.branches && this.props.branches.length && this.props.branches
                    ? this.props.branches.map(branch => ({
                      value: branch.branch ? branch.branch.id : '',
                      label: branch.branch ? branch.branch.branch_name : ''
                    }))
                    : [] : []
                }

                onChange={this.changehandlerbranch}
              />
            </Grid>
            <Grid item xs={3}>
              <label>Fee Account*</label>
              <Select
                placeholder='Fee Account'
                isMulti
                value={this.state.selectedFeeAccount ? this.state.selectedFeeAccount : ''}
                options={
                  // this.state.selectedFeeAccount && this.state.selectedFeeAccount.value !== 'all' ? this.props.feeAccounts && this.props.feeAccounts.length
                  this.props.feeAccounts ? this.props.feeAccounts && this.props.feeAccounts.length
                    ? this.props.feeAccounts.map((row) => ({
                      value: row.id ? row.id : '',
                      label: row.fee_account_name ? row.fee_account_name : ''
                    })) : [] : []
                }
                onChange={this.changeFeeAccountHandler}
              />
            </Grid>
            <Grid item xs={3} >
              <label style={{ paddingTop: 15 }}>Payment Mode*</label>
              <Select
                placeholder='Payment Mode'
                isMulti
                value={this.state.paymentModeData ? this.state.paymentModeData : ''}
                options={
                  // this.state.paymentModeData && this.state.paymentModeData.value !== 'all'
                  // this.state.paymentModeData
                  //   ? 
                    [
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
                      }
                    ] 
                    // : []
                }
                onChange={this.changePaymentMode}
              />
            </Grid>
            <Grid item xs={3} >
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
            <Grid item xs={3}>
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
            <Grid item xs='3'>
              <Button
                variant='contained'
                color='primary'
                style={{ marginTop: 20 }}
                onClick={this.getReport}>
              Download Report
              </Button>
            </Grid>
          </Grid>
          {this.props.dataLoading ? <CircularProgress open /> : null}
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
  feeTypes: state.finance.receiptBook.feeTypesPerType,
  feeAccounts: state.finance.receiptBook.multipleFeeAccounts,
  dataLoading: state.finance.common.dataLoader
})

const mapDispatchToProps = dispatch => ({
  loadSession: dispatch(apiActions.listAcademicSessions(moduleId)),
  fetchBranches: (session, alert, user, moduleId) => dispatch(actionTypes.fetchBranchPerSession({ session, alert, user, moduleId })),
  fetchFeeTypes: (session, branch, feeId, alert, user) => dispatch(actionTypes.fetchFeeTypesPerType({ session, branch, feeId, alert, user })),
  fetchFeeAccounts: (session, branch, alert, user) => dispatch(actionTypes.fetchFeeAccountsReceiptBook({ session, branch, alert, user })),
  downloadReports: (reportName, url, data, alert, user) => dispatch(actionTypes.downloadReports({ reportName, url, data, alert, user })),
  fetchBranchAtAcc: (alert, user) => dispatch(actionTypes.fetchBranchAtAcc({ alert, user }))
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ReceiptBookAdm)
