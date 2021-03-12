import React, { useState, useEffect } from 'react'
import {
//   withStyles
  Button, TableHead, TableCell, Table, TableRow, TableBody, TextField
} from '@material-ui/core'
import Grid from '@material-ui/core/Grid'
import Select from 'react-select'
import Edit from '@material-ui/icons/Edit'
import { connect } from 'react-redux'
import { apiActions } from '../../../_actions'
import * as actionTypes from '../store/actions'
import Modal from '../../../ui/Modal/modal'
import CircularProgress from '../../../ui/CircularProgress/circularProgress'
// import { student } from '../../../masters'

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


const PartialPayment = ({ classes, session, branches, fetchBranches, partialPaymentList, savePartialPaymentLastDate, partialPayments, fetchGradesPerBranch, fetchAllSection, alert, user, dataLoading, gradesPerBranch, sections }) => {
  // const [sessionData, setSessionData] = useState([])
  const [branchData, setBranchData] = useState(null)
  // const [sectionData, setSectionData] = useState(null)
  const [gradeData, setGradeData] = useState(null)
  const [showActionModal, setShowActionModal] = useState(false)
  const [partialPaymentId, setPartialPaymentId] = useState(null)
  const [partPayLastDate, setPartPayLastDate] = useState(null)
  const [partialPaymentGrade, setPartialPaymentGrade] = useState(null)
  const [partialPaymentBranch, setPartialPaymentBranch] = useState(null)
  const [showTable, setShowTable] = useState(false)
  const [createBackDate, setCreateBackDate] = useState(false)
  //   const [gradeId, setGradeId] = useState(null)

  // const handleClickSessionYear = (e) => {
  //   setSessionData(e)
  //   fetchBranches(e.value, alert, user)
  // }

  useEffect(() => {
    fetchBranches(session, alert, user, moduleId)
  }, [alert, fetchBranches, session, user])

  const changehandlerbranch = (e) => {
    setBranchData(e)
    fetchGradesPerBranch(alert, user, session, e.value, moduleId)
    setShowTable(false)
  }
  const gradeHandler = (e) => {
    console.log(e.value)
    setGradeData(e)
    setShowTable(false)
  }

  // const sectionHandler = (e) => {
  //   setSectionData(e)
  // }

  const getPartialPaymentHandler = (e) => {
    if (session && branchData && gradeData) {
      setShowTable(true)
      setCreateBackDate(false)
      partialPaymentList(session, branchData && branchData.value, gradeData && gradeData.value, alert, user)
    } else {
      alert.warning('Fill all required Fields!')
    }
  }
  const hideActionModalHandler = (e) => {
    setShowActionModal(false)
  }
  const lastDateHandler = (e) => {
    console.log('qqqqq', e.target.value)
    setPartPayLastDate(e.target.value)
  }
  const saveLastDate = (e) => {
    console.log('jehhd', partialPaymentId)
    if (!partPayLastDate) {
      alert.warning('Select the required Fields!')
    }
    if (partialPaymentId && partialPaymentGrade && partialPaymentBranch && e && partPayLastDate) {
      let data = {
        date_of_partial_payment: partPayLastDate,
        // is_applicable: true,
        grades: partialPaymentGrade,
        academic_year: session,
        branch: partialPaymentBranch
      }
      savePartialPaymentLastDate(data, alert, user)
      setShowActionModal(false)
      // setGradeData(null)
      // setBranchData(null)
    }
    if (gradeData && branchData && session && createBackDate && partPayLastDate) {
      let data = {
        date_of_partial_payment: partPayLastDate,
        // is_applicable: true,
        grades: gradeData && gradeData.value,
        academic_year: session,
        branch: branchData && branchData.value
      }
      savePartialPaymentLastDate(data, alert, user)
      setShowActionModal(false)
      // setGradeData(null)
      // setBranchData(null)
      setShowTable(true)
    }
  }
  let actionModal = null
  if (showActionModal) {
    actionModal = (
      <Modal open={showActionModal} click={hideActionModalHandler} small>
        {createBackDate ? <h3 style={{ textAlign: 'center' }}>Create Date</h3> : <h3 style={{ textAlign: 'center' }}>Change Date</h3> }
        <hr />
        <Grid container spacing={3} style={{ padding: '15px' }} >
          <Grid item xs={2} />
          <Grid item xs={6}>
            <TextField
              name='lastDate'
              type='date'
              variant='outlined'
              style={{ width: '180px' }}
              value={partPayLastDate}
              onChange={(e) => lastDateHandler(e)} />
          </Grid>
          <Grid item xs={3} />
          <Grid item xs='2' />
          <Grid item xs='4'>         <Button
            color='primary'
            variant='contained'
            onClick={saveLastDate}
          >
            Save
          </Button>
          </Grid>
          <Grid item xs='4'>
            <Button
              color='primary'
              variant='contained'
              onClick={hideActionModalHandler}
            >
            Go Back
            </Button>
          </Grid>
          <Grid item xs='2' />
        </Grid>
      </Modal>
    )
  }
  const showActionModalHandler = (id, grades, branch) => {
    setPartialPaymentId(id)
    setPartialPaymentGrade(grades.id)
    setShowActionModal(true)
    setCreateBackDate(false)
    setPartialPaymentBranch(branch)
  }
  const createBackDateHandler = () => {
    if (session && branchData && gradeData) {
      setShowActionModal(true)
      setCreateBackDate(true)
      setPartPayLastDate(null)
    } else {
      // alert.warning('Select all required Fields!')
    }
  }
  const partialPaymentTable = () => {
    let partialTable = null
    partialTable = (
      <div style={{ marginTop: '60px' }}>
        { partialPayments && partialPayments.length > 0
          ? <React.Fragment>
            <hr />
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell style={{ fontSize: 15 }}><b>S.No</b></TableCell>
                  <TableCell style={{ fontSize: 15 }}><b>GRADE</b> </TableCell>
                  <TableCell style={{ fontSize: 15 }}><b>PARTIAL PAYMENT BACKDATE</b></TableCell>
                  <TableCell style={{ fontSize: 15 }}><b>APPLICABLE</b></TableCell>
                  <TableCell style={{ fontSize: 15 }}><b>UPDATE</b></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {partialPayments && partialPayments.map((val, i) => {
                  return (
                    <TableRow>
                      <TableCell>{i + 1}</TableCell>
                      <TableCell>{val.grades && val.grades.grade}</TableCell>
                      <TableCell>{val.date_of_partial_payment} </TableCell>
                      <TableCell>{val.is_applicable ? 'Yes' : 'No'}</TableCell>
                      <TableCell>{<Edit style={{ cursor: 'pointer' }} onClick={() => showActionModalHandler(val.id, val.grades, val.branch)} />}</TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </React.Fragment>
          : [] }
      </div>
    )
    return partialTable
  }
  return (
    <div>
      <Grid container spacing={3} style={{ padding: '15px' }}>
        <Grid item xs={9} />
        <Grid item xs={3}>
          <Button
            variant='contained'
            color='primary'
            style={{ marginTop: '20px' }}
            onClick={createBackDateHandler}
          >Create Back Date </Button>
        </Grid>
      </Grid>
      <Grid container spacing={3} style={{ padding: '15px' }}>
        <Grid item xs={3}>
          <label>Branch*</label>
          <Select
            placeholder='Select Branch'
            value={branchData}
            options={
              branches.length
                ? branches.map(branch => ({
                  value: branch.branch ? branch.branch.id : '',
                  label: branch.branch ? branch.branch.branch_name : ''
                }))
                : []
            }
            onChange={changehandlerbranch}
          />
        </Grid>
        <Grid item xs={3}>
          <label>Grades*</label>
          <Select
            placeholder='Select Grade'
            value={gradeData}
            options={
              gradesPerBranch
                ? gradesPerBranch.map(grades => ({
                  value: grades.grade.id,
                  label: grades.grade.grade
                }))
                : []
            }
            onChange={gradeHandler}
          />
        </Grid>
        {/* <Grid item xs={3}>
          <label>Section</label>
          <Select
            placeholder='Select Section'
            value={sectionData}
            options={
              sections
                ? sections.filter(ele => ele.section !== null).map(sec => ({
                  value: sec.section && sec.section.id ? sec.section.id : '',
                  label: sec.section && sec.section.section_name ? sec.section.section_name : ''
                }))
                : []
            }
            onChange={sectionHandler}
          />
        </Grid> */}
        <Grid item xs={3}>
          <Button
            variant='contained'
            color='primary'
            style={{ marginTop: '20px' }}
            onClick={getPartialPaymentHandler}
          >Get</Button>
        </Grid>
      </Grid>
      { showTable ? partialPaymentTable() : []}
      {actionModal}
      { dataLoading ? <CircularProgress open /> : null }
    </div>
  )
}
const mapStateToProps = state => ({
  user: state.authentication.user,
  // session: state.academicSession.items,
  branches: state.finance.common.branchPerSession,
  gradesPerBranch: state.finance.common.gradesPerBranch,
  // sections: state.finance.common.sectionsPerGradeAdmin,
  sections: state.finance.accountantReducer.studentPromotion.sectionsPerGrade,
  dataLoading: state.finance.common.dataLoader,
  partialPayments: state.finance.lastDateSettings.partialPayment
})
const mapDispatchToProps = dispatch => ({
  loadSession: dispatch(apiActions.listAcademicSessions(moduleId)),
  fetchBranches: (session, alert, user, moduleId) => dispatch(actionTypes.fetchBranchPerSession({ session, alert, user, moduleId })),
  fetchGradesPerBranch: (alert, user, session, branch, moduleId) => dispatch(actionTypes.fetchGradesPerBranch({ alert, user, session, branch, moduleId })),
  // fetchAllSectionsPerGradeAsAdmin: (session, alert, user, gradeId, branchId) => dispatch(actionTypes.fetchAllSectionsPerGradeAsAdmin({ session, alert, user, gradeId, branchId }))
  fetchAllSection: (session, alert, user, gradeId, branchId, moduleId) => dispatch(actionTypes.fetchAllSection({ session, alert, user, gradeId, branchId, moduleId })),
  partialPaymentList: (session, branch, grade, alert, user) => dispatch(actionTypes.partialPaymentList({ session, branch, grade, alert, user })),
  savePartialPaymentLastDate: (data, alert, user) => dispatch(actionTypes.savePartialPaymentLastDate({ data, alert, user }))
})

export default connect(mapStateToProps, mapDispatchToProps)((PartialPayment))
