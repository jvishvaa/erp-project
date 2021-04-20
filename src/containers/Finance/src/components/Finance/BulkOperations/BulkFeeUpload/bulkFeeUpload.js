import React, { useState, useLayoutEffect } from 'react'
import {
  TextField,
  Button,
  withStyles
} from '@material-ui/core'
import Grid from '@material-ui/core/Grid'
import Select from 'react-select'
import { connect } from 'react-redux'
import zipcelx from 'zipcelx'
import styles from './bulkFeeUpload.styles'
import { apiActions } from '../../../../_actions'
import * as actionTypes from '../../store/actions'
import CircularProgress from '../../../../ui/CircularProgress/circularProgress'
import Layout from '../../../../../../Layout'

const BulkFeeUpload = ({ classes, session, branches, alert, user, fetchBranches, bulkFeeUpload, dataLoading }) => {
  const [sessionData, setSessionData] = useState(null)
  const [branchData, setBranchData] = useState(null)
  const [branchId, setBranchId] = useState(null)
  const [applicableYears, setApplicableYears] = useState(null)
  const [statusFile, setStatusFile] = useState(null)
  const [yearsArr, setYearsArr] = useState([])
  const [isAdmin, setIsAdmin] = useState(false)
  useLayoutEffect(() => {
    const role = (JSON.parse(localStorage.getItem('user_profile'))).personal_info.role
    if (role === 'FinanceAdmin') {
      setIsAdmin(true)
    }
  }, [])
  const handleClickSessionYear = (e) => {
    setSessionData(e)
    setBranchData(null)
    fetchBranches(e.value, alert, user)
  }
  const changehandlerbranch = (e) => {
    setBranchData(e)
    setBranchId(e.value)
  }

  const handleYears = (e) => {
    console.log('applicable Years: ', e)
    let years = []
    e.forEach(acad => {
      years.push(acad.value)
    })
    setYearsArr(years)
    setApplicableYears(e)
  }

  const downloadSample = () => {
    const headers = [
      {
        value: 'Grade',
        type: 'string'
      },
      {
        value: 'TutionFee1/10_04',
        type: 'string'
      },
      {
        value: 'TutionFee2/10_06',
        type: 'string'
      },
      {
        value: 'TutionFee3/10_09',
        type: 'string'
      },
      {
        value: 'Tution Fee',
        type: 'string'
      },
      {
        value: 'Admission Fee/10_06',
        type: 'string'
      }
    ]
    const config = {
      filename: 'fee_structure_sample',
      sheet: {
        data: [headers]
      }
    }
    zipcelx(config)
  }

  const readExcelFile = () => {
    const form = new FormData()
    if (isAdmin) {
      form.set('session_year', sessionData && sessionData.value)
      form.set('branch_id', branchId)
      form.append('file', statusFile)
      form.append('years_applicable_to', yearsArr)
    } else {
      form.set('session_year', sessionData && sessionData.value)
      form.append('years_applicable_to', yearsArr)
      form.append('file', statusFile)
    }
    for (var key of form.entries()) {
      console.log(key[0] + ', ' + key[1])
    }
    // if (isAdmin && !branchId) {
    //   alert.warning('Select Branch!')
    //   return
    // }
    if (sessionData && statusFile) {
      bulkFeeUpload(form, user, alert)
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
    <div className={classes.container}>
      <Grid container spacing={3}>
        <Grid item xs={3}>
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
          ? <Grid item xs={3}>
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
        <Grid item xs={3}>
          <label>Years Applicable to*</label>
          <Select
            placeholder='Select Years'
            isMulti
            value={applicableYears}
            options={
              session
                ? session.session_year.map((session) => ({
                  value: session,
                  label: session }))
                : []
            }
            onChange={handleYears}
          />
        </Grid>
        <Grid item xs={3}>
          {/* <label>File Upload*</label> */}
          <TextField
            id='file_upload'
            // margin='dense'
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
                >
                  Download Format
                </span>
              </span>
            )}
            onChange={fileChangeHandler}
          />
        </Grid>
        <Grid item xs={3}>
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
  dataLoading: state.finance.common.dataLoader
})
const mapDispatchToProps = dispatch => ({
  loadSession: dispatch(apiActions.listAcademicSessions()),
  fetchBranches: (session, alert, user) => dispatch(actionTypes.fetchBranchPerSession({ session, alert, user })),
  bulkFeeUpload: (body, user, alert) => dispatch(actionTypes.bulkFeeUpload({ body, user, alert }))
})

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(BulkFeeUpload))
