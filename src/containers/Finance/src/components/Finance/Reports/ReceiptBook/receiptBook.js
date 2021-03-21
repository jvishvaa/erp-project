import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Button, Grid, FormControl, MenuItem, withStyles, Select, TextField } from '@material-ui/core/'
import { apiActions } from '../../../../_actions'
import { urls } from '../../../../urls'
import * as actionTypes from '../../store/actions'
import CircularProgress from '../../../../ui/CircularProgress/circularProgress'
import Layout from '../../../../../../Layout'
// import { TextField } from 'material-ui'

// const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
//   'July', 'August', 'September', 'October', 'November', 'December'
// ]
const styles = theme => ({
  formControl: {
    margin: theme.spacing * 1,
    minWidth: 170,
    maxWidth: 170
  },
  dateField: {
  }
})

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
        if (item.child_name === 'Receipt Book') {
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
class ReceiptBook extends Component {
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
      slelectFeeAcc: [],
      feeAccId: [],
      paymentModeId: [],
      paymentModeData: [],
      role: ''
    }
    componentDidMount () {
      // this.todayDate()
      const userProfile = JSON.parse(localStorage.getItem('userDetails'))
      const role = userProfile.personal_info.role.toLowerCase()
      this.setState({
        role
      }, () => {
        if (this.state.role === 'financeaccountant') {
          this.props.fetchBranchAtAcc(this.props.alert, this.props.user)
        }
      })
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
      let session = []
      e.target.value.forEach(payment => {
        session.push(payment)
      })
      console.log(e)
      this.setState({ session: session, selectedBranches: [], sessionData: e.target.value }, () => {
        if (this.state.role === 'financeaccountant') {
          // this.props.fetchFeeTypes(this.state.session, this.props.branchAtAcc.branch, this.props.alert, this.props.user)
        } else {
          this.props.fetchBranches(session, this.props.alert, this.props.user, moduleId)
        }
      })
    }
    changehandlerbranch = (e) => {
      // const allLabel = e.target.value.filter(event => {
      //   return event === 'all'
      // })
      let ids = []
      if (e.target.value === 'all') {
        const allBranches = {
          value: 'all',
          label: 'All Branches'
        }
        // const allBranchIds = this.props.branches.map(branch => {
        //   return branch.branch.id
        // })
        this.setState({
          selectedBranches: allBranches,
          branchId: 'all',
          selectedTypes: []
        }, () => {
          console.log(this.state.selectedBranches)
          // this.props.fetchFeeAccounts(this.state.session, this.state.branchId, this.props.alert, this.props.user)
        })
      } else {
        e.target.value.forEach(payment => {
          ids.push(payment)
        })
        this.setState({
          selectedBranches: e.target.value,
          branchId: ids,
          selectedTypes: []
        }, () => {
          console.log(this.state.selectedBranches)
          console.log(this.state.branchId)
          // this.props.fetchFeeAccounts(this.state.session, this.state.branchId, this.props.alert, this.props.user)
        })
      }
    }
    changeTypesHandler = (e) => {
      this.setState({
        selectedTypes: e.target.value,
        typesId: e.target.value
      }, () => {
        if (this.state.role === 'financeaccountant') {
          // this.props.fetchBranchAtAcc(this.props.alert, this.props.user)
          this.props.fetchFeeTypes(this.state.session, this.props.branchAtAcc.branch, this.state.typesId, this.props.alert, this.props.user)
        } else {
          this.props.fetchFeeTypes(this.state.session, this.state.branchId, this.state.typesId, this.props.alert, this.props.user)
        }
      })
    }
    changeFeeTypeHandler = (e) => {
      // const allLabel = e.filter(event => {
      //   return event.label === 'All Fee Types'
      // })
      if (e.target.value === 'all') {
        const allFeeTypes = {
          value: 'all',
          label: 'All Fee Types'
        }
        this.setState({
          selectedFeeTypes: allFeeTypes,
          feeTypeId: 'all'
        }, () => {
          if (this.state.role === 'financeaccountant') {
            // this.props.fetchBranchAtAcc(this.props.alert, this.props.user)
            this.props.fetchFeeAccounts(this.state.session, this.props.branchAtAcc.branch, this.state.typesId, this.state.selectedFeeTypes && this.state.selectedFeeTypes.value, this.props.alert, this.props.user)
          } else {
            this.props.fetchFeeAccounts(this.state.session, this.state.branchId, this.state.typesId, this.state.selectedFeeTypes && this.state.selectedFeeTypes.value, this.props.alert, this.props.user)
          }
        })
      } else {
        let ids = []
        e.target.value.forEach(payment => {
          ids.push(payment)
        })
        this.setState({
          selectedFeeTypes: e.target.value,
          feeTypeId: ids
        }, () => {
          if (this.state.role === 'financeaccountant') {
            // this.props.fetchBranchAtAcc(this.props.alert, this.props.user)
            this.props.fetchFeeAccounts(this.state.session, this.props.branchAtAcc.branch, this.state.typesId, this.state.feeTypeId, this.props.alert, this.props.user)
          } else {
            this.props.fetchFeeAccounts(this.state.session, this.state.branchId, this.state.typesId, this.state.feeTypeId, this.props.alert, this.props.user)
          }
        })
      }
    }
    changeFeeAccountHandler = (e) => {
      // const allLabel = e.filter(event => {
      //   return event.label === 'All Fee Account'
      // })
      if (e.target.value === 'all') {
        const allAccounts = {
          value: 'all',
          label: 'All Fee Account'
        }
        this.setState({
          selectedFeeAccount: allAccounts,
          feeAccId: 'all'
        })
      } else {
        let ids = []
        e.target.value.forEach(acc => {
          ids.push(acc)
        })
        this.setState({
          selectedFeeAccount: e.target.value,
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
      // const allLabel = e.filter(event => {
      //   return event.label === 'All'
      // })
      let ids = []
      if (e.target.value === 'all') {
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
        e.target.value.forEach(payment => {
          ids.push(payment)
        })
        this.setState({ paymentModeId: ids, paymentModeData: e.target.value })
      }
    }
    getReport = () => {
      console.log('I am Called')
      if (!this.state.session || this.state.feeTypeId.length < 1 ||
        !this.state.startDate || !this.state.feeAccId
      ) {
        this.props.alert.warning('Select All Required Fields')
        return
      }
      let data = {}
      if (this.state.role === 'financeaccountant') {
        data = {
          academic_year: this.state.session,
          branches: [this.props.branchAtAcc.branch],
          fee_account: this.state.feeAccId,
          types: [this.state.typesId],
          payment_mode: [this.state.paymentModeId],
          fee_types: this.state.feeTypeId,
          from_date: this.state.startDate,
          to_date: this.state.endDate
        }
      } else {
        data = {
          academic_year: this.state.session,
          branches: this.state.branchId,
          fee_account: this.state.feeAccId,
          types: [this.state.typesId],
          payment_mode: this.state.paymentModeId,
          fee_types: this.state.feeTypeId,
          from_date: this.state.startDate,
          to_date: this.state.endDate
        }
      }
      this.props.downloadReports('ReceiptBook.csv', urls.DownloadReceiptBook, data, this.props.alert, this.props.user)
    }
    render () {
      let selectBranch = null
      const { role } = this.state
      if (role === 'financeadmin') {
        selectBranch = (
          <Grid item xs='3'>
            <label>Branch*</label> <br />
            <FormControl variant='outlined' className={this.props.classes.formControl}>
              <Select
                multiple
                placeholder='Select Branch'
                id='branch'
                value={this.state.selectedBranches ? this.state.selectedBranches : ''}
                onChange={this.changehandlerbranch}
              >
                {
                  this.state.branchId !== 'all' ? this.props.branches.length && this.props.branches
                    ? this.props.branches.map(branch => (<MenuItem value={branch.branch ? branch.branch.id : ''}>{ branch.branch ? branch.branch.branch_name : ''}</MenuItem>))
                    : [] : []}
              </Select>
            </FormControl>
          </Grid>
        )
      }
      return (
        <Layout>
        <React.Fragment>
          <Grid container spacing={3} style={{ padding: 15 }}>
            <Grid item xs='3'>
              <label>Academic Year*</label><br />
              <FormControl variant='outlined' className={this.props.classes.formControl}>
                <Select
                  placeholder='Select Year'
                  multiple
                  id='year'
                  value={this.state.sessionData ? this.state.sessionData : null}
                  onChange={this.handleAcademicyear}
                >
                  {this.props.session ? this.props.session.session_year.map((session) => (<MenuItem value={session}>{session}</MenuItem>))
                    : []}
                </Select>
              </FormControl>
            </Grid>
            {selectBranch}
            <Grid item xs='3'>
              <label>Types*</label><br />
              <FormControl variant='outlined' className={this.props.classes.formControl}>
                <Select
                  placeholder='Types'
                  id='type'
                  value={this.state.selectedTypes ? this.state.selectedTypes : ''}
                  onChange={this.changeTypesHandler}
                >
                  {/* {this.state.selectedBranches.value || this.state.selectedBranches.length > 0 || this.state.role === 'financeaccountant'
                  ? <React.Fragment> */}
                  <MenuItem value={1}>All Types</MenuItem>
                  <MenuItem value={2}>Normal Fee Types</MenuItem>
                  <MenuItem value={3}>Other Fee types</MenuItem>
                  <MenuItem value={4}>Application Fee Types</MenuItem>
                  <MenuItem value={5}>Registration Fee Types</MenuItem>
                  <MenuItem value={6}>Store Fee Types</MenuItem>
                  {/* </React.Fragment>
                  : [] } */}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs='3'>
              <label>Fee Types*</label><br />
              <FormControl variant='outlined' className={this.props.classes.formControl}>
                <Select
                  placeholder='Fee Types'
                  id='fee_type'
                  multiple
                  value={this.state.selectedFeeTypes ? this.state.selectedFeeTypes : ''}
                  onChange={this.changeFeeTypeHandler}
                >
                  {this.state.feeTypeId !== 'all' ? this.props.feeTypes && this.props.feeTypes.length
                    ? this.props.feeTypes.map((row) => (<MenuItem value={row.id ? row.id : ''}>{row.fee_type_name ? row.fee_type_name : ''}</MenuItem>))
                    : [] : [] }
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs='3'>
              <label>Fee Account*</label><br />
              <FormControl variant='outlined' className={this.props.classes.formControl}>
                <Select
                  placeholder='Fee Account'
                  id='fee_account'
                  multiple
                  value={this.state.selectedFeeAccount ? this.state.selectedFeeAccount : ''}
                  onChange={this.changeFeeAccountHandler}
                >
                  {
                    this.state.feeAccId !== 'all' ? this.props.feeAccounts && this.props.feeAccounts.length
                      ? this.props.feeAccounts.map((row) => (<MenuItem value={row.id ? row.id : ''}>{row.fee_account_name ? row.fee_account_name : ''}</MenuItem>))
                      : [] : [] }
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs='3'>
              <label>Start Date</label><br />
              <TextField
                type='date'
                variant='outlined'
                className={this.props.classes.dateField}
                id='startDate'
                value={this.state.startDate}
                onChange={this.startDateHandler}
              />
            </Grid>
            <Grid item xs='3'>
              <label>End Date</label><br />
              <TextField
                type='date'
                variant='outlined'
                className={this.props.classes.dateField}
                id='endDate'
                value={this.state.endDate}
                onChange={this.handleEndDate}
              />
            </Grid>
            <Grid item xs='3'>
              <label>Payment Mode*</label> <br />
              <FormControl variant='outlined' className={this.props.classes.formControl}>
                <Select
                  placeholder='Payment Mode'
                  id='payment_mode'
                  multiple
                  value={this.state.paymentModeData ? this.state.paymentModeData : ''}
                  onChange={this.changePaymentMode}
                >
                  {/* {this.state.paymentModeId !== 'all'
                  ? <React.Fragment> */}
                  <MenuItem value={'all'}>All</MenuItem>
                  <MenuItem value={1}>Cash</MenuItem>
                  <MenuItem value={2}>Cheque</MenuItem>
                  <MenuItem value={3}>Internet Payment</MenuItem>
                  <MenuItem value={4}>Credit/Debit Card Swipe</MenuItem>
                  <MenuItem value={5}>Online Payment</MenuItem>
                  <MenuItem value={6}>Wallet</MenuItem>
                  <MenuItem value={7}>Mpos</MenuItem>
                  {/* </React.Fragment>
                  : [] } */}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs='3'>
              <Button
                variant='contained'
                color='primary'
                id='download_report'
                style={{ marginTop: 35 }}
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
  feeTypes: state.finance.receiptBook.feeTypesPerType,
  feeAccounts: state.finance.receiptBook.multipleFeeAccounts,
  dataLoading: state.finance.common.dataLoader
})

const mapDispatchToProps = dispatch => ({
  loadSession: dispatch(apiActions.listAcademicSessions(moduleId)),
  fetchBranches: (session, alert, user, moduleId) => dispatch(actionTypes.fetchBranchPerSession({ session, alert, user, moduleId })),
  fetchFeeTypes: (session, branch, feeId, alert, user) => dispatch(actionTypes.fetchFeeTypesPerType({ session, branch, feeId, alert, user })),
  fetchFeeAccounts: (session, branch, types, feetypes, alert, user) => dispatch(actionTypes.fetchFeeAccountsReceiptBook({ session, branch, types, feetypes, alert, user })),
  downloadReports: (reportName, url, data, alert, user) => dispatch(actionTypes.downloadReports({ reportName, url, data, alert, user })),
  fetchBranchAtAcc: (alert, user) => dispatch(actionTypes.fetchBranchAtAcc({ alert, user }))
})

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(ReceiptBook))
