import React, { Component } from 'react'
import { Grid, Button } from '@material-ui/core'
import axios from 'axios'
import Select from 'react-select'
import { withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
// import FeeShowList from './FeeShowList'
import { apiActions } from '../../../../_actions'
import * as actionTypes from '../../store/actions'
import { urls } from '../../../../urls'
import Layout from '../../../../../../Layout'


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
        if (item.child_name === 'Concession Report') {
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
class ConcessionReport extends Component {
  state = {
    sessionData: [],
    role: '',
    feeAccData: [],
    branchId: '',
    selectedbranchIds: '',
    gradeData: null,
    selectedBranches: '',
    selectedFeeTypes: [],
    feeTypeIds: [],
    studentTypeData: {
      value: 'both',
      label: 'Both'
    },
    getData: false,
    typesId: 2
  }
  componentDidMount () {
    const userProfile = JSON.parse(localStorage.getItem('userDetails'))
    const role = userProfile && userProfile?.personal_info && userProfile?.personal_info?.role?.toLowerCase()
    this.setState({
      role
    }
    // () => {
    //   if (this.state.role === 'financeaccountant') {
    //     this.props.fetchBranchAtAcc(this.props.alert, this.props.user)
    //   }
    // }
    )
  }
  activeHandler = (e) => {
    this.setState({
      studentTypeData: e
    })
  }

  ButtonHandler = (sessionData) => {
    const years = this.state.sessionData.map(year => year.value)
    let feeTypeSelected
    if (this.state.selectedFeeTypes.value === 'all') {
      feeTypeSelected = this.state.feeTypeId
    } else {
      feeTypeSelected = this.state.selectedFeeTypes && this.state.selectedFeeTypes.value
    }
    let campus
    if (this.props.branchAtAcc && this.props.branchAtAcc.branch) {
      campus = this.props.branchAtAcc.branch
    } else {
      campus = this.state.selectedbranchIds
    }
    if (!feeTypeSelected || !campus || !years) {
      this.props.alert.warning('Please fill all the fields!')
      return
    }
    let url = urls.ConcessionReports + '?session_year=' + years + '&branch_id=' + campus + '&is_active=' + this.state.studentTypeData.value + '&fee_type_id=' + feeTypeSelected
    axios
      .get(url,
        {
          // params: { session_year: this.state.sessionData[0].value, branch: this.state.selectedbranchIds, is_active: this.state.studentTypeData.value, fee_types: this.state.selectedFeeTypes.value },
          headers: {
            'Authorization': 'Bearer ' + this.props.user
          },
          'responseType': 'blob'
        }
      )
      .then(res => {
        if (res.status === 200) {
          let blob = new Blob([res.data], { type: 'application/vnd.ms-excel' })
          let url = window.URL.createObjectURL(blob)
          let link = document.createElement('a')
          link.style.display = 'none'
          link.href = url
          link.setAttribute('download', 'concession_report.xls')
          document.body.appendChild(link)
          link.click()
        } else {
          this.props.alert.error('Error occured while generating excel')
        }
      })
      .catch(error => {
        if (error.response && error.response.status) {
          this.props.alert.error(error.response.data.err_msg)
        } else {
          this.props.alert.error('Something Went Wrong!')
        }
        console.error(error)
      })
  }
  changehandlerbranch = (e) => {
    const branch = e && e.map(city => city.value)
    if (branch.includes('all')) {
      const allBranches = {
        value: 'all',
        label: 'All Branches'
      }
      let AllBranchIds = []
      this.props.branches.forEach(branch => {
        if (typeof branch.branch.id === 'number') {
          AllBranchIds.push(branch.branch.id)
        }
      })
      this.setState({
        selectedBranches: allBranches,
        selectedbranchIds: AllBranchIds
      }, () => {
        this.props.fetchFeeTypes(this.state.session, this.state.selectedbranchIds, 1, this.props.alert, this.props.user)
        // data = {
        //   session_year: this.state.session,
        //   branch_id: this.state.selectedbranchIds,
        //   feeAccData: []
        // }
      })
    } else {
      const selectIds = e.map(branch => branch.value)
      this.setState({
        selectedBranches: e,
        selectedbranchIds: selectIds
      }, () => {
        this.props.fetchFeeTypes(this.state.session, this.state.selectedbranchIds, 1, this.props.alert, this.props.user)
      })
    }
  }

  handleAcademicyear = (e) => {
    const sessions = []
    e && e.forEach((val) => {
      sessions.push(val.value)
    })
    this.setState({ session: sessions, selectedBranches: [], sessionData: e }, () => {
      if (this.state.role === 'financeaccountant') {
        // this.props.fetchFeeTypes(this.state.session, this.props.branchAtAcc.branch, 1, this.props.alert, this.props.user)
      } else {
        this.props.fetchBranches(sessions, this.props.alert, this.props.user, moduleId)
      }
    })
    // this.setState({
    //   selectedFeeTypes: this.props.feeTypes
    // })
  }

  selectHandler = (e) => {
    this.setState({ sessionData: e })
  }
  changeFeeTypeHandler = (e) => {
    // const allLabel = e.filter(event => {
    //   return event.label === 'All Fee Types'
    // })
    if (e.value === 'all') {
      const allFeeTypes = {
        value: 'all',
        label: 'All Fee Types'
      }
      let fee = []
      this.props.feeTypes.forEach(feeId => {
        if (typeof feeId.id === 'number') {
          fee.push(feeId.id)
        }
      })
      this.setState({
        selectedFeeTypes: allFeeTypes,
        feeTypeId: fee
      })
    } else {
      this.setState({
        selectedFeeTypes: e
      })
    }
  }

  render () {
    let selectBranch = null
    const { role } = this.state
    // if (role === 'financeadmin') {
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
    // }

    return (
      <Layout>
      <div style={{ marginLeft: '20px', marginTop: '20px' }}>
        <Grid container spacing={3}>
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
            <label>Fee Types*</label><br />
            <Select
              placeholder='Fee Types'
              id='fee_type'
              multiple
              value={this.state.selectedFeeTypes ? this.state.selectedFeeTypes : ''}
              onChange={this.changeFeeTypeHandler}
              options={
                this.props.feeTypes.map((fee) =>
                  ({ value: fee.id, label: fee.fee_type_name }))
              }
            >
              {/* {this.state.feeTypeId !== 'all' ? this.props.feeTypes && this.props.feeTypes.length
                ? this.props.feeTypes.map((row) => <option>{row.fee_type_name}</option>)
                : [] : [] } */}
            </Select>
          </Grid>
          <Grid item xs='3'>
            <label>Status*</label>
            <Select
              placeholder='Select Status'
              value={this.state.studentTypeData}
              options={[
                {
                  value: 1,
                  label: 'Active'
                },
                {
                  value: 0,
                  label: 'Inactive'
                },
                {
                  value: 'both',
                  label: 'Both'
                }
              ]}
              onChange={this.activeHandler}
            />
          </Grid>
          {
            this.state.sessionData
              ? <Grid item xs={3}>
                <Button variant='contained' color='primary' onClick={this.ButtonHandler}
                  style={{ marginTop: '25px', marginLeft: '20px' }} download
                >
                 Download Excel
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
  branches: state.finance.common.multipleBranchPerSession,
  branchAtAcc: state.finance.common.branchAtAcc,
  feeTypes: state.finance.receiptBook.feeTypesPerType
})

const mapDispatchToProps = dispatch => ({
  loadSession: dispatch(apiActions.listAcademicSessions()),
  fetchBranches: (session, alert, user, moduleId) => dispatch(actionTypes.fetchBranchPerSession({ session, alert, user, moduleId })),
  loadSession: dispatch(apiActions.listAcademicSessions(moduleId)),
  fetchFeeTypes: (session, branch, feeId, alert, user) => dispatch(actionTypes.fetchFeeTypesPerType({ session, branch, feeId, alert, user })),
  fetchBranchAtAcc: (alert, user) => dispatch(actionTypes.fetchBranchAtAcc({ alert, user }))
})

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(ConcessionReport))
