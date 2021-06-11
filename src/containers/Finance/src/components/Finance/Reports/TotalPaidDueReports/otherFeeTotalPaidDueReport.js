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
        if (item.child_name === 'Other Fee Total Paid and Due Report') {
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
class OtherFeeTotalPaidReports extends Component {
  state = {
    session: '',
    sessionData: [],
    branchId: '',
    selectedBranches: null,
    valueGrade: [],
    gradeData: [],
    installmentIds: [],
    selectedInstallments: [],
    selectedFeeTypes: '',
    feeTypeIds: [],
    selectedTypes: [],
    typesId: '',
    active: false,
    inactive: false,
    allStudents: false,
    selectedFeeTypeAndinst: [],
    feeInstId: '',
    selectedStudentStatus: { value: 1, label: 'All Students' },
    studentStatusId: '',
    role: '',
    selectedFeePlan: '',
    feePlanId: [],
    selectedOthrFeeTypes: '',
    othrfeeTypeIds: [],
    selectedOthrInstallments: [],
    othrInstallmentIds: [],
    branchType: ''
  }
  componentDidMount () {
    // this.todayDate()
    const userProfile = JSON.parse(localStorage.getItem('userDetails'))
    const role = userProfile && userProfile?.personal_info && userProfile?.personal_info?.role?.toLowerCase()
    this.setState({
      role
    }
    // , () => {
    //   if (this.state.role === 'financeaccountant') {
    //     this.props.fetchBranchAtAcc(this.props.alert, this.props.user)
    //   }
    // }
    )

    if (NavData && NavData.length) {
      NavData.forEach((item) => {
        if (
          item.parent_modules === 'Reports' &&
          item.child_module &&
          item.child_module.length > 0
        ) {
          item.child_module.forEach((item) => {
            if (item.child_name === 'Other Fee Total Paid and Due Report') {
              // setModuleId(item.child_id);
              // setModulePermision(true);
              this.setState({
                moduleId: item.child_id
              })
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
  componentWillReceiveProps (nextProps) {
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
      //   // this.props.fetchFeeAccounts(this.state.session, this.props.branchAtAcc.branch, this.props.alert, this.props.user)
      //   this.props.fetchGrades(this.state.session, this.props.branchAtAcc.branch, this.props.alert, this.props.user, moduleId)
      //   // this.props.fetchFeeTypes(this.state.session, this.props.branchAtAcc.branch, this.props.alert, this.props.user)
      // }
    })
  }
  changehandlerbranchType = (e) => {
    this.setState({
      branchType: e
    })
    this.props.fetchBranches(this.state.sessionData && this.state.sessionData.value, e.value, this.props.alert, this.props.user, moduleId)
  }
  changehandlerbranch = (e) => {
    if (e.value === 'all') {
      const allBranch = this.props.branches.map(ele => ele.branch.id).filter(ele => ele !== 'all')
      this.setState({
        branchId: allBranch,
        selectedBranches: e,
        valueGrade: [],
        selectedFeeTypes: []
      }, () => {
        this.props.fetchGrades(this.state.session, this.state.branchId, this.props.alert, this.props.user, moduleId)
        // this.props.fetchFeeTypes(this.state.session, this.state.branchId, this.props.alert, this.props.user)
      })
    } else {
      this.setState({
        branchId: e.value,
        selectedBranches: e,
        valueGrade: [],
        selectedFeeTypes: []
      }, () => {
        this.props.fetchGrades(this.state.session, this.state.branchId, this.props.alert, this.props.user, moduleId)
      // this.props.fetchFeeTypes(this.state.session, this.state.branchId, this.props.alert, this.props.user)
      })
    }
  }
  handleClickGrade = event => {
    const allLabel = event && event.filter(event => {
      return event && event.label === 'All Grades'
    })
    let aMapIds = []
    if (allLabel && allLabel.length === 1) {
      const allGrades = {
        value: 'all',
        label: 'All Grades'
      }
      const allGradeIds = this.props.grades.map(ele => ele.grade.id).filter(ele => ele !== 'all')
      this.setState({
        gradeData: allGradeIds,
        valueGrade: allGrades,
        selectedFeePlan: [],
        selectedFeeTypes: [],
        selectedOthrInstallments: []
      }, () => {
        // if (this.state.role === 'financeaccountant' && this.state.gradeData.length > 0) {
        //   this.props.fetchFeePlanNames(this.state.session, this.props.branchAtAcc.branch, this.state.gradeData, this.props.alert, this.props.user)
        // } else if (this.state.gradeData.length > 0) {
          this.props.fetchFeePlanNames(this.state.session, this.state.branchId, this.state.gradeData, this.props.alert, this.props.user)
        // }
      })
    } else {
      event && event.forEach((grdae) => {
        aMapIds.push(grdae.value)
      })
      this.setState({
        gradeData: aMapIds,
        valueGrade: event,
        selectedFeePlan: [],
        selectedFeeTypes: [],
        selectedOthrInstallments: []
      }, () => {
        // if (this.state.role === 'financeaccountant' && this.state.gradeData.length > 0) {
        //   this.props.fetchFeePlanNames(this.state.session, this.props.branchAtAcc.branch, this.state.gradeData, this.props.alert, this.props.user)
        // } else if (this.state.gradeData.length > 0) {
          this.props.fetchFeePlanNames(this.state.session, this.state.branchId, this.state.gradeData, this.props.alert, this.props.user)
        // }
      })
    }
  }
  changeInstallmentsHandler = (e) => {
    const allLabel = e.filter(event => {
      return event.label === 'All Installments'
    })
    let instIds = []
    if (allLabel.length === 1) {
      const allInsts = {
        value: 'all',
        label: 'All Installments'
      }
      const allInstIds = this.props.installments.map(ele => ele.id).filter(ele => ele !== 'all')
      this.setState({
        selectedInstallments: allInsts,
        installmentIds: allInstIds
      })
    } else {
      e.forEach(payment => {
        instIds.push(payment.value)
      })
      this.setState({
        selectedInstallments: e,
        installmentIds: instIds
      })
    }
  }

  changeOthrInstallmentsHandler = (e) => {
    const allLabel = e && e.filter(event => {
      return event && event.label === 'All Installments'
    })
    let instIds = []
    if (allLabel && allLabel.length === 1) {
      const allInsts = {
        value: 'all',
        label: 'All Installments'
      }
      const allInstIds = this.props.othrInst.map(ele => ele.id).filter(ele => ele !== 'all')
      this.setState({
        selectedOthrInstallments: allInsts,
        othrInstallmentIds: allInstIds
      })
    } else {
      e && e.forEach(payment => {
        instIds.push(payment.value)
      })
      this.setState({
        selectedOthrInstallments: e,
        othrInstallmentIds: instIds
      })
    }
  }

  changeFeeTypeHandler = (e) => {
    let feeIds = []
    const allLabel = e && e.filter(event => {
      return event.label === 'All Fee Types'
    })
    if (allLabel && allLabel.length === 1) {
      const allFeeTypes = {
        value: 'all',
        label: 'All Fee Types'
      }
      const allfeeIds = this.props.feeTypes.map(ele => ele.id).filter(ele => ele !== 'all')
      this.setState({
        selectedFeeTypes: allFeeTypes,
        feeTypeIds: allfeeIds,
        selectedInstallments: []
      }, () => {
        let data = {}
        // if (this.state.role === 'financeaccountant') {
        //   data = {
        //     branch: this.props.branchAtAcc.branch,
        //     academic_year: this.state.session,
        //     fee_types: this.state.feeTypeIds,
        //     fee_plan: this.state.feePlanId,
        //     grades: this.state.gradeData
        //   }
        // } else {
          data = {
            branch: this.state.branchId,
            academic_year: this.state.session,
            fee_types: this.state.feeTypeIds,
            fee_plan: this.state.feePlanId,
            grades: this.state.gradeData
          }
        // }
        if (this.state.selectedFeeTypes.value === 'all' && this.state.feeTypeIds.length > 0) {
          this.props.fetchInstallments(data, this.props.alert, this.props.user)
        }
      })
    } else {
      e && e.forEach(payment => {
        feeIds.push(payment.value)
      })
      this.setState({
        selectedFeeTypes: e,
        feeTypeIds: feeIds,
        selectedInstallments: []
      }, () => {
        // moved
        let data = {}
        // if (this.state.role === 'financeaccountant') {
        //   data = {
        //     branch: this.props.branchAtAcc.branch,
        //     academic_year: this.state.session,
        //     fee_types: this.state.feeTypeIds,
        //     fee_plan: this.state.feePlanId,
        //     grades: this.state.gradeData
        //   }
        // } else {
          data = {
            branch: this.state.branchId,
            academic_year: this.state.session,
            fee_types: this.state.feeTypeIds,
            fee_plan: this.state.feePlanId,
            grades: this.state.gradeData
          }
        // }
        if (this.state.feeTypeIds.length > 0) {
          this.props.fetchInstallments(data, this.props.alert, this.props.user)
        }
      })
    }
  }

  changeOthrFeeTypeHandler = (e) => {
    let feeIds = []
    const allLabel = e && e.filter(event => {
      return event && event.label === 'All Fee Types'
    })
    if (allLabel && allLabel.length === 1) {
      const allFeeTypes = {
        value: 'all',
        label: 'All Fee Types'
      }
      const allfeeIds = this.props.othrFeetyp.map(ele => ele.id).filter(ele => ele !== 'all')
      this.setState({
        selectedOthrFeeTypes: allFeeTypes,
        othrfeeTypeIds: allfeeIds,
        selectedOthrInstallments: []
      }, () => {
        let data = {}
        // if (this.state.role === 'financeaccountant') {
        //   data = {
        //     branch: this.props.branchAtAcc.branch,
        //     academic_year: this.state.session,
        //     fee_types: this.state.othrfeeTypeIds,
        //     // fee_plan: this.state.feePlanId,
        //     grades: this.state.gradeData
        //   }
        // } else {
          data = {
            branch: this.state.branchId,
            academic_year: this.state.session,
            fee_types: this.state.othrfeeTypeIds,
            // fee_plan: this.state.feePlanId,
            grades: this.state.gradeData
          }
        // }
        if (this.state.selectedOthrFeeTypes.value === 'all' && this.state.othrfeeTypeIds.length > 0) {
          this.props.fetchOthrInstallments(data, this.props.alert, this.props.user)
        }
      })
    } else {
      e && e.forEach(payment => {
        feeIds.push(payment.value)
      })
      this.setState({
        selectedOthrFeeTypes: e,
        othrfeeTypeIds: feeIds,
        selectedOthrInstallments: []
      }, () => {
        // moved
        let data = {}
        // if (this.state.role === 'financeaccountant') {
        //   data = {
        //     branch: this.props.branchAtAcc.branch,
        //     academic_year: this.state.session,
        //     fee_types: this.state.othrfeeTypeIds,
        //     // fee_plan: this.state.feePlanId,
        //     grades: this.state.gradeData
        //   }
        // } else {
          data = {
            branch: this.state.branchId,
            academic_year: this.state.session,
            fee_types: this.state.othrfeeTypeIds,
            // fee_plan: this.state.feePlanId,
            grades: this.state.gradeData
          }
        // }
        if (this.state.othrfeeTypeIds.length > 0) {
          this.props.fetchOthrInstallments(data, this.props.alert, this.props.user)
        }
      })
    }
  }

  changeTypeHandler = (e) => {
    this.setState({
      selectedTypes: e,
      typesId: e.value
    })
  }

  changeFeePlanHandler = (e) => {
    let feeplans = []
    const allLabel = e && e.filter(event => {
      return event && event.label === 'All Fee Plan'
    })
    if (allLabel.length === 1) {
      const allFeePlans = {
        value: 'all',
        label: 'All Fee Plan'
      }
      const allfeePlIds = this.props.feePlans.map(ele => ele.id).filter(ele => ele !== 'all')
      this.setState({
        selectedFeePlan: allFeePlans,
        feePlanId: allfeePlIds,
        selectedFeeTypes: [],
        selectedInstallments: [],
        selectedOthrFeeTypes: [],
        selectedOthrInstallments: []
      }, () => {
        if (this.state.feePlanId.length > 0) {
          this.props.fetchFeeTypes(this.state.session, this.state.branchId || this.props.branchAtAcc.branch, this.state.gradeData, this.state.feePlanId, this.props.alert, this.props.user)
        }
      })
    } else {
      e && e.forEach(fee => {
        feeplans.push(fee.value)
      })
      this.setState({
        selectedFeePlan: e,
        feePlanId: feeplans,
        selectedFeeTypes: [],
        selectedInstallments: [],
        selectedOthrFeeTypes: [],
        selectedOthrInstallments: []
      }, () => {
        if (this.state.feePlanId.length > 0) {
          this.props.fetchFeeTypes(this.state.session, this.state.branchId, this.state.gradeData, this.state.feePlanId, this.props.alert, this.props.user)
        }
      })
    }

    // donot delete this
    // this.setState({
    //   selectedFeePlan: e
    // }, () => {
    //   this.props.fetchFeeTypes(this.state.selectedFeePlan.value, this.props.alert, this.props.user)
    //   // let data = {}
    //   // if (this.state.role === 'financeaccountant') {
    //   //   data = {
    //   //     branch: this.props.branchAtAcc.branch,
    //   //     academic_year: this.state.session,
    //   //     fee_types: this.state.feeTypeIds,
    //   //     fee_plan: this.state.selectedFeePlan.value,
    //   //     grades: this.state.gradeData
    //   //   }
    //   // } else {
    //   //   data = {
    //   //     branch: this.state.branchId,
    //   //     academic_year: this.state.session,
    //   //     fee_types: this.state.feeTypeIds,
    //   //     fee_plan: this.state.selectedFeePlan.value,
    //   //     grades: this.state.gradeData
    //   //   }
    //   // }
    //   // this.props.fetchInstallments(data, this.props.alert, this.props.user)
    // })
  }
  changedHandler = (name, event) => {
    this.setState({ [name]: event.target.checked }, () => {
    })
  }
  changeFeeTypeAndInstHandler = (e) => {
    this.setState({
      selectedFeeTypeAndinst: e,
      feeInstId: e.value
    })
  }
  changeStudentStatusHandler = (e) => {
    this.setState({
      selectedStudentStatus: e,
      studentStatusId: e.value
    })
  }
  getReport = () => {
    // if (!this.state.session || this.state.valueGrade.length < 1 ||
    //   this.state.selectedInstallments.length < 1 || this.state.selectedFeeTypes.length < 1 ||
    //   !this.state.feeInstId || !this.state.typesId || this.state.othrInstallmentIds.length < 1 ||
    //   this.state.othrfeeTypeIds.length < 1
    if (!this.state.session || this.state.valueGrade.length < 1 ||
      !this.state.feeInstId
    ) {
      this.props.alert.warning('Select All Required Fields')
      return
    }
    if (this.state.gradeData.length > 0 && (this.state.selectedFeeTypes.length === 0 && this.state.othrfeeTypeIds.length === 0)) {
      this.props.alert.warning('Select Either Normal or Other Fees')
      return
    }
    if (this.state.feePlanId.length > 0 && this.state.selectedFeeTypes.length > 0 && this.state.selectedInstallments.length === 0) {
      this.props.alert.warning('Select Normal Fee & Installments')
      return
    }
    if (this.state.othrfeeTypeIds.length > 0 && this.state.othrInstallmentIds.length === 0) {
      this.props.alert.warning('Select Other Fee & Installments')
      return
    }
    let data = {}
    if (this.state.role === 'financeaccountant') {
      data = {
        academic_year: this.state.session,
        branches: [this.props.branchAtAcc.branch],
        grades: this.state.gradeData,
        // fee_types: this.state.feeTypeIds.length > 0 ? this.state.feeTypeIds : null,
        // fee_plan: this.state.feePlanId.length > 0 ? this.state.feePlanId : null,
        // installments: this.state.installmentIds.length > 0 ? this.state.installmentIds : null,
        // type: this.state.typesId,
        FeeTypes_installments: this.state.feeInstId,
        student_status: this.state.selectedStudentStatus.value,
        active: this.state.active,
        inactive: this.state.inactive,
        allStudents: this.state.allStudents,
        other_fee_type: this.state.othrfeeTypeIds.length > 0 ? this.state.othrfeeTypeIds : null,
        other_fee_installments: this.state.othrInstallmentIds.length > 0 ? this.state.othrInstallmentIds : null
      }
    } else {
      data = {
        academic_year: this.state.session,
        branches: [this.state.branchId],
        grades: this.state.gradeData,
        // fee_types: this.state.feeTypeIds.length > 0 ? this.state.feeTypeIds : null,
        // fee_plan: this.state.feePlanId.length > 0 ? this.state.feePlanId : null,
        // installments: this.state.installmentIds.length > 0 ? this.state.installmentIds : null,
        // type: this.state.typesId,
        FeeTypes_installments: this.state.feeInstId,
        student_status: this.state.selectedStudentStatus.value,
        active: this.state.active,
        inactive: this.state.inactive,
        allStudents: this.state.allStudents,
        other_fee_type: this.state.othrfeeTypeIds.length > 0 ? this.state.othrfeeTypeIds : null,
        other_fee_installments: this.state.othrInstallmentIds.length > 0 ? this.state.othrInstallmentIds : null
      }
    }
    // if (this.state.active) {
    //   data.active = this.state.active
    // } else if (this.state.inactive) {
    //   data.inactive = this.state.inactive
    // } else if (this.state.allStudents) {
    //   data.allStudents = this.state.allStudents
    // }
    this.props.downloadReports('Other_fee_total_paid_and_due_reports.csv', urls.DownloadTotalPaidOtherFeeReports, data, this.props.alert, this.props.user)
    this.setState({
      sessionData: [],
      session: '',
      branchId: '',
      selectedBranches: [],
      valueGrade: [],
      gradeData: [],
      selectedFeePlan: [],
      feePlanId: [],
      selectedFeeTypes: [],
      feeTypeIds: [],
      typesId: '',
      selectedInstallments: [],
      installmentIds: [],
      active: false,
      inactive: false,
      allStudents: false,
      selectedTypes: [],
      feeInstId: '',
      selectedFeeTypeAndinst: [],
      // selectedStudentStatus: [],
      selectedOthrFeeTypes: [],
      othrfeeTypeIds: [],
      selectedOthrInstallments: [],
      othrInstallmentIds: []
    })
  }
  render () {
    let selectBranch = null
    const { role } = this.state
    // if (role === 'financeadmin') {
      selectBranch = (
        <React.Fragment>
          <Grid item xs={4} style={{ padding: '15px' }}>
            <label>Branch Type*</label>
            <Select
              placeholder='Select Branch'
              value={this.state.branchType ? this.state.branchType : ''}
              options={[
                {
                  'label': 'School',
                  'value': '1'
                },
                {
                  label: 'College',
                  value: '2'
                }
              ]}

              onChange={this.changehandlerbranchType}
            />
          </Grid>
          <Grid item xs={4} style={{ padding: '15px' }}>
            <label>Branch*</label>
            <Select
              placeholder='Select Branch'
              value={this.state.selectedBranches ? this.state.selectedBranches : ''}
              options={
                this.props.branches
                  ? this.props.branches.map(branch => ({
                    value: branch.branch ? branch.branch.id : '',
                    label: branch.branch ? branch.branch.branch_name : ''
                  }))
                  : []
              }

              onChange={this.changehandlerbranch}
            />
          </Grid>
        </React.Fragment>
      )
    // }
    return (
      <Layout>
      <React.Fragment>
        <div style={{ padding: '15px' }}>
          <Grid container spacing={1}>
            <Grid item xs={4} style={{ padding: '15px' }}>
              <label>Academic Year*</label>
              <Select
                placeholder='Select Year'
                value={this.state.sessionData ? this.state.sessionData : null}
                id='academic_year'
                options={
                  this.props.session ? this.props.session.session_year.map((session) =>
                    ({ value: session, label: session })) : []
                }
                onChange={this.handleAcademicyear}
              />
            </Grid>
            {selectBranch}
            <Grid item xs={4} style={{ padding: '15px' }}>
              <label>Grade*</label>
              <Select
                placeholder='Select Grade'
                isMulti
                id='grade'
                options={
                  // this.state.valueGrade && this.state.valueGrade.value !== 'all' ? this.props.grades
                  this.props.grades ? this.props.grades
                    ? this.props.grades && this.props.grades.map(grades => ({
                      value: grades.grade ? grades.grade.id : '',
                      label: grades.grade ? grades.grade.grade : ''
                    }))
                    : [] : []
                }
                value={this.state.valueGrade}
                onChange={this.handleClickGrade}
              />
            </Grid>
            {/* <Grid item xs={4} style={{ padding: '15px' }}>
              <label>Fee Plans*</label>
              <Select
                placeholder='Fee Plans'
                value={this.state.selectedFeePlan ? this.state.selectedFeePlan : ''}
                id='feePlans'
                isMulti
                options={
                  this.state.selectedFeePlan.value !== 'all' ? this.props.feePlans && this.props.feePlans.length > 0
                    ? this.props.feePlans.map((feePlan) => (
                      {
                        label: feePlan.fee_plan_name ? feePlan.fee_plan_name : '',
                        value: feePlan.id ? feePlan.id : ''
                      }
                    ))
                    : [] : []
                }
                onChange={this.changeFeePlanHandler}
              />
            </Grid> */}
            {/* <Grid item xs={4} style={{ padding: '15px' }}>
              <label>Other Fee Types</label>
              <Select
                placeholder='Fee Types'
                isMulti
                id='fee_types'
                value={this.state.selectedFeeTypes ? this.state.selectedFeeTypes : ''}
                options={
                  this.props.feeTypes && this.state.selectedFeeTypes.value !== 'all' ? this.props.feeTypes && this.props.feeTypes.length
                    ? this.props.feeTypes.map(feeTypes => ({
                      value: feeTypes.id ? feeTypes.id : '',
                      label: feeTypes.fee_type_name ? feeTypes.fee_type_name : ''
                    }))
                    : [] : []
                }
                onChange={this.changeFeeTypeHandler}
              />
            </Grid> */}
            {/* <Grid item xs={4} style={{ padding: '15px' }}>
              <label>Other Fee Installments*</label>
              <Select
                placeholder='Installments'
                id='installments'
                isMulti
                value={this.state.selectedInstallments ? this.state.selectedInstallments : ''}
                options={
                  this.state.selectedInstallments.value !== 'all' ? this.props.installments && this.props.installments.length
                    ? this.props.installments.map(installments => ({
                      value: installments.id ? installments.id : '',
                      label: installments.installment_name ? installments.installment_name : ''
                    }))
                    : [] : []
                }
                onChange={this.changeInstallmentsHandler}
              />
            </Grid> */}
            <Grid item xs={4} style={{ padding: '15px' }}>
              <label>Other Fee Types</label>
              <Select
                placeholder='Fee Types'
                isMulti
                id='fee_types'
                value={this.state.selectedOthrFeeTypes ? this.state.selectedOthrFeeTypes : ''}
                options={
                  // this.props.othrFeetyp && this.state.selectedOthrFeeTypes && this.state.selectedOthrFeeTypes.value !== 'all' ? this.props.othrFeetyp && this.props.othrFeetyp.length
                  this.props.othrFeetyp ? this.props.othrFeetyp && this.props.othrFeetyp.length
                    ? this.props.othrFeetyp.map(feeTypes => ({
                      value: feeTypes.id ? feeTypes.id : '',
                      label: feeTypes.fee_type_name ? feeTypes.fee_type_name : ''
                    }))
                    : [] : []
                }
                onChange={this.changeOthrFeeTypeHandler}
              />
            </Grid>
            <Grid item xs={4} style={{ padding: '15px' }}>
              <label>Other Fee Installments*</label>
              <Select
                placeholder='Installments'
                id='installments'
                isMulti
                value={this.state.selectedOthrInstallments ? this.state.selectedOthrInstallments : ''}
                options={
                  // this.state.selectedOthrInstallments && this.state.selectedOthrInstallments.value !== 'all' ? this.props.othrInst && this.props.othrInst.length
                  this.props.othrInst ? this.props.othrInst && this.props.othrInst.length
                    ? this.props.othrInst && this.props.othrInst.map(installments => ({
                      value: installments.id ? installments.id : '',
                      label: installments.installment_name ? installments.installment_name : ''
                    }))
                    : [] : []
                }
                onChange={this.changeOthrInstallmentsHandler}
              />
            </Grid>
            <Grid item xs={4} style={{ padding: '20px 15px' }}>
              {!this.state.inactive && !this.state.allStudents ? <FormControlLabel
                control={
                  <Checkbox
                    checked={this.state.active}
                    onChange={(e) => this.changedHandler('active', e)}
                    color='primary'
                  />
                }
                label='Active'
              /> : null}
              {!this.state.active && !this.state.allStudents ? <FormControlLabel
                control={
                  <Checkbox
                    checked={this.state.inactive}
                    onChange={(e) => this.changedHandler('inactive', e)}
                    color='primary'
                  />
                }
                label='InActive'
              /> : null}
              {!this.state.active && !this.state.inactive ? <FormControlLabel
                control={
                  <Checkbox
                    checked={this.state.allStudents}
                    onChange={(e) => this.changedHandler('allStudents', e)}
                    color='primary'
                  />
                }
                label='All Students'
              /> : null}
            </Grid>
            {/* <Grid item xs={4} style={{ padding: '15px' }}>
              <label>Types*</label>
              <Select
                placeholder='Types'
                value={this.state.selectedTypes ? this.state.selectedTypes : ''}
                options={
                  [
                    {
                      value: 1,
                      label: 'Day Scholar'
                    },
                    {
                      value: 2,
                      label: 'Residential'
                    },
                    {
                      value: 3,
                      label: 'Hostel'
                    }
                  ]
                }
                onChange={this.changeTypeHandler}
              />
            </Grid> */}
            <Grid item xs={4} style={{ padding: '15px' }}>
              <label>Fee Types & Installments*</label>
              <Select
                placeholder='Fee & Installments'
                value={this.state.selectedFeeTypeAndinst ? this.state.selectedFeeTypeAndinst : ''}
                id='feeTypes_installments'
                options={
                  [
                    {
                      value: 1,
                      label: 'Fee Type Wise'
                    },
                    // {
                    //   value: 2,
                    //   label: 'Installment Wise'
                    // },
                    {
                      value: 3,
                      label: 'Fee Type & Installment'
                    }
                  ]
                }
                onChange={this.changeFeeTypeAndInstHandler}
              />
            </Grid>
            <Grid item xs={4} style={{ padding: '15px' }}>
              <label>Students Status*</label>
              <Select
                placeholder='Select Students Type'
                value={this.state.selectedStudentStatus ? this.state.selectedStudentStatus : ''}
                id='student_status'
                options={
                  [
                    {
                      value: 1,
                      label: 'All Students'
                    },
                    {
                      value: 2,
                      label: 'Due Students'
                    }
                  ]
                }
                onChange={this.changeStudentStatusHandler}
              />
            </Grid>
          </Grid>
        </div>
        <div style={{ marginLeft: '200px', marginTop: '60px', paddingBottom: '60px' }}>
          <Button
            variant='contained'
            color='primary'
            onClick={this.getReport}>
            Download Report
          </Button>
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
  branches: state.finance.common.multipleBranchPerSession,
  branchAtAcc: state.finance.common.branchAtAcc,
  grades: state.finance.common.multGradesPerBranch,
  installments: state.finance.totalPaidDueReports.multInstallmentList,
  feeTypes: state.finance.totalPaidDueReports.multFeeTypes,
  feePlans: state.finance.totalPaidDueReports.multFeePlans,
  othrFeetyp: state.finance.totalPaidDueReports.othrFeeTyp,
  othrInst: state.finance.totalPaidDueReports.othrFeeInst,
  dataLoading: state.finance.common.dataLoader
})

const mapDispatchToProps = dispatch => ({
  loadSession: dispatch(apiActions.listAcademicSessions(moduleId)),
  fetchBranches: (session, branchType, alert, user, moduleId) => dispatch(actionTypes.fetchBranchPerSession({ session, branchType, alert, user, moduleId })),
  fetchGrades: (session, branch, alert, user, moduleId) => dispatch(actionTypes.fetchGradesPerBranch({ session, branch, alert, user, moduleId })),
  fetchInstallments: (data, alert, user) => dispatch(actionTypes.fetchInstallmentListPerFeeType({ data, alert, user })),
  fetchFeeTypes: (session, branch, grade, feePlanId, alert, user) => dispatch(actionTypes.fetchFeeTypesPaidReportsPerBranch({ session, branch, grade, feePlanId, alert, user })),
  downloadReports: (reportName, url, data, alert, user) => dispatch(actionTypes.downloadReports({ reportName, url, data, alert, user })),
  fetchBranchAtAcc: (alert, user) => dispatch(actionTypes.fetchBranchAtAcc({ alert, user })),
  fetchFeePlanNames: (session, branch, grades, alert, user) => dispatch(actionTypes.fetchFeePlanNames({ session, branch, grades, alert, user })),
  // fetchOthrFees: (session, branch, grades, alert, user) => dispatch(actionTypes.fetchOtherFeeTypes({ session, branch, grades, alert, user })),
  fetchOthrInstallments: (data, alert, user) => dispatch(actionTypes.fetchOthrFeeInsts({ data, alert, user })),
  clearProps: () => dispatch(actionTypes.clearTotalPaidProps())
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(OtherFeeTotalPaidReports)
