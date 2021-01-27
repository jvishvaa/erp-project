
import React, { useEffect, useState } from 'react'
import Select from 'react-select'
import { connect } from 'react-redux'
import { Button, Grid } from '@material-ui/core/'
import { apiActions } from '../../../../_actions'
import { urls } from '../../../../urls'
import * as actionTypes from '../../store/actions'
import CircularProgress from '../../../../ui/CircularProgress/circularProgress'
import Layout from '../../../../../../Layout'

const WalletReport = ({ session, fetchGrades, fetchBranchAtAcc, fetchBranches, branchAtAcc, branches, downloadReports, dataLoading, grades, alert, user }) => {
  const [sessionData, setSessionData] = useState([])
  const [gradeData, setGradeData] = useState([])
  const [valueGrade, setValueGrade] = useState(null)
  const [branchData, setBranchData] = useState(null)
  const [branchId, setBranchId] = useState(null)
  const [role, setRole] = useState(null)

  useEffect(() => {
    const userProfile = JSON.parse(localStorage.getItem('user_profile'))
    const role = userProfile.personal_info.role.toLowerCase()
    setRole(role)
    if (role === 'financeaccountant') {
      fetchBranchAtAcc(alert, user)
    }
    console.log('grades', grades)
  }, [alert, fetchBranchAtAcc, grades, user])

  const handleAcademicyear = (e) => {
    console.log(e)
    setSessionData(e)
    setValueGrade([])
    setBranchData(null)
    // fetchBranches(e.value, alert, user)
    if (role === 'financeaccountant') {
      fetchGrades(e.value, branchAtAcc && branchAtAcc.branch, alert, user)
    } else {
      fetchBranches(e.value, alert, user)
    }
  }
  const changehandlerbranch = (e) => {
    if (e.value === 'all') {
      const allBranch = branches.map(ele => ele.branch.id).filter(ele => ele !== 'all')
      setBranchData(e)
      setBranchId(allBranch)
      setValueGrade([])
      fetchGrades(sessionData && sessionData.value, allBranch, alert, user)
    } else {
      setBranchData(e)
      setBranchId(e.value)
      setValueGrade([])
      fetchGrades(sessionData && sessionData.value, e.value, alert, user)
    }
  }
  const handleClickGrade = (event) => {
    const allLabel = event.filter(event => {
      return event.label === 'All Grades'
    })
    console.log('event', event)
    if (allLabel.length === 1) {
      const allGrades = {
        value: 'all',
        label: 'All Grades'
      }
      const allGradeIds = grades.map(ele => ele.grade.id).filter(ele => ele !== 'all')
      console.log('grades', grades)
      setGradeData(allGradeIds)
      setValueGrade(allGrades)
    } else {
      let aMapIds = []
      event.forEach((grdae) => {
        aMapIds.push(grdae.value)
        setGradeData(aMapIds)
        setValueGrade(event)
      })
    }
  }
  const getReport = () => {
    if (role === 'financeadmin') {
      if (sessionData && branchData && gradeData && gradeData.length > 0) {
        let url = `${urls.WalletReport}?session_year=${sessionData && sessionData.value}&branch_id=${branchId}&grade=${gradeData}`
        downloadReports('walletReport.xlsx', url, alert, user)
        setSessionData([])
        setGradeData([])
        setBranchData(null)
        setValueGrade(null)
      } else {
        alert.warning('Fill all the required Fields!')
      }
    } else {
      if (sessionData && gradeData && gradeData.length > 0) {
        // let url = `${urls.WalletReport}?session_year=${sessionData && sessionData.value}&grade=${gradeData}`
        let url = `${urls.WalletReport}?session_year=${sessionData && sessionData.value}&branch_id=${branchAtAcc && branchAtAcc.branch}&grade=${gradeData}`
        downloadReports('walletReport.xlsx', url, alert, user)
        console.log('gradedata', gradeData)
        setSessionData([])
        setGradeData([])
        setBranchData(null)
        setValueGrade(null)
      } else {
        alert.warning('Fill all the required Fields!')
      }
    }
  }
  let selectBranch = null
  if (role === 'financeadmin') {
    selectBranch = (
      <Grid item xs={3} style={{ padding: '15px' }}>
        <label>Branch*</label>
        <Select
          placeholder='Select Branch'
          value={branchData || ''}
          options={
            branches
              ? branches.map(branch => ({
                value: branch.branch ? branch.branch.id : '',
                label: branch.branch ? branch.branch.branch_name : ''
              }))
              : []
          }

          onChange={changehandlerbranch}
        />
      </Grid>
    )
  }
  return (
    <Layout>
    <React.Fragment>
      <div style={{ padding: '15px' }}>
        <Grid container spacing={1}>
          <Grid item xs={3} style={{ padding: '15px' }}>
            <label>Academic Year*</label>
            <Select
              placeholder='Select Year'
              value={sessionData || null}
              id='academic_year'
              options={
                session ? session.session_year.map((session) =>
                  ({ value: session, label: session })) : []
              }
              onChange={handleAcademicyear}
            />
          </Grid>
          {selectBranch}
          <Grid item xs={3} style={{ padding: '15px' }}>
            <label>Grade*</label>
            <Select
              placeholder='Select Grade'
              isMulti
              id='grade'
              options={
                valueGrade && valueGrade.value !== 'all' ? grades
                  ? grades.map(grades => ({
                    value: grades.grade ? grades.grade.id : '',
                    label: grades.grade ? grades.grade.grade : ''
                  }))
                  : [] : []
              }
              value={valueGrade}
              onChange={handleClickGrade}
            />
          </Grid>
          <Grid item xs={3} style={{ padding: '15px', marginTop: '20px' }}>
            <Button
              variant='contained'
              color='primary'
              onClick={getReport}>
                Download Report
            </Button>
          </Grid>
        </Grid>
      </div>
      {dataLoading ? <CircularProgress open /> : null}
    </React.Fragment>
    </Layout>
  )
}

const mapStateToProps = state => ({
  user: state.authentication.user,
  session: state.academicSession.items,
  branches: state.finance.common.multipleBranchPerSession,
  branchAtAcc: state.finance.common.branchAtAcc,
  grades: state.finance.common.multGradesPerBranch,
  dataLoading: state.finance.common.dataLoader
})

const mapDispatchToProps = dispatch => ({
  downloadReports: (reportName, url, alert, user) => dispatch(actionTypes.downloadReports({ reportName, url, alert, user })),
  loadSession: dispatch(apiActions.listAcademicSessions()),
  fetchBranches: (session, alert, user) => dispatch(actionTypes.fetchBranchPerSession({ session, alert, user })),
  fetchGrades: (session, branch, alert, user) => dispatch(actionTypes.fetchGradesPerBranch({ session, branch, alert, user })),
  fetchBranchAtAcc: (alert, user) => dispatch(actionTypes.fetchBranchAtAcc({ alert, user })),
  clearProps: () => dispatch(actionTypes.clearTotalPaidProps())
})

export default connect(mapStateToProps, mapDispatchToProps)(WalletReport)
