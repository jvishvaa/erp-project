import React, { useState, useLayoutEffect } from 'react'
import {
  TextField,
  Button,
  withStyles
} from '@material-ui/core'
import Grid from '@material-ui/core/Grid'
import Select from 'react-select'
import { connect } from 'react-redux'
// import zipcelx from 'zipcelx'
import styles from './bulkReportUpload.styles'
import { apiActions } from '../../../_actions'
import * as actionTypes from '../store/actions'
import CircularProgress from '../../../ui/CircularProgress/circularProgress'
import Layout from '../../../../../Layout'

const BulkReportUpload = ({ classes, session, branches, bulkReportList, reports, alert, user, fetchBranches, bulkReportUpload, dataLoading }) => {
  const [sessionData, setSessionData] = useState([])
  const [branchData, setBranchData] = useState([])
  const [branchId, setBranchId] = useState(null)
  const [statusFile, setStatusFile] = useState(null)
  const [reportType, setReportType] = useState(null)
  const [reportId, setReportId] = useState(null)
  const [isAdmin, setIsAdmin] = useState(false)
  useLayoutEffect(() => {
    const role = (JSON.parse(localStorage.getItem('user_profile'))).personal_info.role
    if (role === 'FinanceAdmin') {
      setIsAdmin(true)
    }
  }, [])
  const handleClickSessionYear = (e) => {
    setSessionData(e)
    setBranchData([])
    fetchBranches(e.value, alert, user)
    bulkReportList(user, alert)
  }
  const changehandlerbranch = (e) => {
    setBranchData(e)
    setBranchId(e.value)
  }
  const changeReportHandler = (e) => {
    setReportType(e)
    setReportId(e.value)
  }
  const downloadSample = () => {
    // const headers = [
    //   {
    //     value: 'S.No',
    //     type: 'string'
    //   },
    //   {
    //     value: 'Branch',
    //     type: 'string'
    //   },
    //   {
    //     value: 'Academic Year',
    //     type: 'string'
    //   },
    //   {
    //     value: 'Location/Zone',
    //     type: 'string'
    //   },
    //   {
    //     value: 'Enrollment Code',
    //     type: 'string'
    //   },
    //   {
    //     value: 'Student Status',
    //     type: 'string'
    //   },
    //   {
    //     value: 'Student Name',
    //     type: 'string'
    //   },
    //   {
    //     value: 'Class',
    //     type: 'string'
    //   },
    //   {
    //     value: 'Concession Name',
    //     type: 'string'
    //   },
    //   {
    //     value: 'Fees Type',
    //     type: 'string'
    //   },
    //   {
    //     value: 'Installmet Name',
    //     type: 'string'
    //   },
    //   {
    //     value: 'Concession Amount',
    //     type: 'string'
    //   }
    // ]
    // const config = {
    //   filename: 'transaction_report_sample',
    //   sheet: {
    //     data: [headers]
    //   }
    // }
    // zipcelx(config)
  }
  // const getReportFormatHandler = () => {
  //    {reportId === 1  ? <a href='https://letseduvate.s3.ap-south-1.amazonaws.com/prod/media/finance/reports/uploads/19-20_BTM_Concessions_Details.xlsx' target='_blank'>Download report</a> : 'NA' }
  // }
  const readExcelFile = () => {
    const form = new FormData()
    if (isAdmin) {
      form.set('session_year', sessionData.value)
      form.set('branch_id', branchId)
      form.set('report_type', reportId)
      form.append('file', statusFile)
    } else {
      form.set('session_year', sessionData.value)
      form.set('report_type', reportId)
      form.append('file', statusFile)
    }
    for (var key of form.entries()) {
    }
    if (isAdmin && !branchId) {
      alert.warning('Select Branch!')
      return
    }
    if (sessionData && reportId && statusFile) {
      bulkReportUpload(form, reportId, user, alert)
    } else {
      alert.warning('Fill all the Fields!')
    }
  }
  const fileChangeHandler = (event) => {
    const file = event.target.files[0]
    setStatusFile(file)
  }
  return (
    <Layout>
    <div>
      <Grid container spacing={3} style={{ padding: '15px' }}>
        <Grid item xs={4}>
          <label>Academic Year*</label>
          <Select
            placeholder='Select Academic Year'
            value={sessionData}
            options={
              session
                ? session.session_year.map((session) => ({
                  value: session,
                  label: session }))
                : []
            }
            onChange={handleClickSessionYear}
          />
        </Grid>
        { isAdmin
          ? <Grid item xs={4}>
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
          : [] }
        <Grid item xs={4}>
          <label>Report Type*</label>
          <Select placeholder='Select Report' value={reportType} onChange={changeReportHandler}
            options={
              reports.length
                ? reports.map(reportList => ({
                  value: reportList.id ? reportList.id : '',
                  label: reportList.report_name ? reportList.report_name : ''
                }))
                : []
            }
          />
        </Grid>
        <Grid item xs={4}>
          <TextField
            id='file_upload'
            margin='dense'
            type='file'
            required
            variant='outlined'
            inputProps={{ accept: '.xlsx' }}
            helperText={(
              <span>
                <span>Upload Excel Sheet</span>
                <span
                  onClick={downloadSample}
                  onKeyDown={() => { }}
                  role='presentation'
                  style={{ color: 'purple', paddingLeft: '5px' }}
                />
                {reportId === 1 || reportId === 2 ? <a href='https://letseduvate.s3.ap-south-1.amazonaws.com/prod/media/finance/reports/uploads/19-20_BTM_Concessions_Details.xlsx' target='_blank'>Download report</a> : ''}
                {reportId === 3 || reportId === 4 || reportId === 5 ? <a href='https://letseduvate.s3.ap-south-1.amazonaws.com/prod/media/finance/reports/uploads/19-20_BTM_FRR_Report_as_on_18th_Nov__2019.xlsx' target='_blank'>Download report</a> : '' }
                {reportId === 6 ? <a href='https://letseduvate.s3.amazonaws.com/prod/media/finance/reports/downloads/error_ois_undri09_01_2020_12_54_19_concession.xlsx' target='_blank'>Download report</a> : '' }
              </span>
            )}
            onChange={fileChangeHandler}
          />
        </Grid>
        <Grid item xs={4}>
          <Button
            variant='contained'
            color='primary'
            style={{ marginTop: '20px' }}
            onClick={readExcelFile}
          >Submit</Button>
        </Grid>
      </Grid>
      { dataLoading ? <CircularProgress open /> : null }
    </div>
    </Layout>
  )
}
const mapStateToProps = state => ({
  user: state.authentication.user,
  session: state.academicSession.items,
  branches: state.finance.common.branchPerSession,
  dataLoading: state.finance.common.dataLoader,
  reports: state.finance.bulkOperation.bulkReportList
})
const mapDispatchToProps = dispatch => ({
  loadSession: dispatch(apiActions.listAcademicSessions()),
  fetchBranches: (session, alert, user) => dispatch(actionTypes.fetchBranchPerSession({ session, alert, user })),
  bulkReportUpload: (body, reportId, user, alert) => dispatch(actionTypes.bulkReportUpload({ body, reportId, user, alert })),
  bulkReportList: (user, alert) => dispatch(actionTypes.bulkReportList({ user, alert }))
})

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(BulkReportUpload))
