import React, { useState } from 'react'

import {
  TextField,
  Radio,
  Grid,
  withStyles,
  Button,
  CircularProgress
} from '@material-ui/core'
import Select from 'react-select'
import { connect } from 'react-redux'
// import readXlsxFile from 'read-excel-file'
import zipcelx from 'zipcelx'

import styles from './bulkActiveInactive.styles'
import * as actionTypes from '../../store/actions'
import Layout from '../../../../../../Layout'
// import { CircularProgress } from '../../../../ui'

const BulkActiveInactive = ({
  classes,
  dataLoaded,
  dataLoading,
  ...props }) => {
  const [statusFile, setStatusFile] = useState(null)
  const [status, setStatus] = useState('active')
  const [reason, setReason] = useState({
    value: 4,
    label: 'Others'
  })

  const fileChangeHandler = (event) => {
    const file = event.target.files[0]
    setStatusFile(file)
  }
  const reasonHandler = (e) => {
    setReason(e)
  }
  const downloadSample = () => {
    const headers = [
      {
        value: 'ERP',
        type: 'string'
      }
      // {
      //   value: 'Student Name',
      //   type: 'string'
      // },
      // {
      //   value: 'Class',
      //   type: 'string'
      // },
      // {
      //   value: 'STD Type',
      //   type: 'string'
      // },
      // {
      //   value: 'Location/Zone',
      //   type: 'string'
      // },
      // {
      //   value: 'Branch',
      //   type: 'string'
      // }
    ]
    const config = {
      filename: 'active_inactive_sample',
      sheet: {
        data: [headers]
      }
    }
    zipcelx(config)
  }

  const readExcelFile = () => {
    // const schema = {
    //   'Enrollment code': {
    //     prop: 'enrollment_code',
    //     type: String
    //   }
    // }
    // dataLoading()
    // readXlsxFile(statusFile, { schema }).then(({ rows, errors }) => {
    //   // `errors` have shape `{ row, column, error, value }`.
    //   if (errors.length !== 0) {
    //     throw new Error('Excel Format Not Correct')
    //   }
    //   const erp = rows.map(item => item.enrollment_code)
    //   const body = {
    //     erp,
    //     status: status === 'active'
    //   }
    //   dataLoaded()
    //   props.bulkActiveInactive(body, props.user, props.alert)
    // }).catch(err => {
    //   props.alert.warning(err.message || 'Unable to Read Excel')
    //   dataLoaded()
    // })
    const form = new FormData()
    form.append('file', statusFile)
    form.append('reason', status === 'active' ? 'Others' : reason && reason.label)
    if (status === 'active') {
      form.append('status', 'True')
    } else {
      form.append('status', 'False')
    }
    for (var key of form.entries()) {
    }

    if (statusFile && reason) {
      props.bulkActiveInactive(form, props.user, props.alert)
    } else {
      props.alert.warning('Please Select File to Upload!')
    }
    if (!reason) {
      props.alert.warning('Please Select the remark!')
    }
  }
  return (
    <Layout>
    <div className={classes.container}>
      <Grid container spacing={6} alignItems='center'>
        <Grid item xs={6} md={4}>
          <TextField
            id='file_upload'
            margin='dense'
            type='file'
            required
            style={{ marginTop: '30px' }}
            variant='outlined'
            className={classes.textField}
            inputProps={{ accept: '.xlsx' }}
            helperText={(
              <span>
                <span>Upload Excel Sheet</span>
                <span
                  className={classes.downloadFormat}
                  onClick={downloadSample}
                  onKeyDown={() => { }}
                  role='presentation'
                >
                  Download Format
                </span>
              </span>
            )}
            onChange={fileChangeHandler}
          />
        </Grid>
        {status === 'active' ? []
          : (<Grid item xs={3}>
            <label>Remark*</label>
            <Select
              onChange={reasonHandler}
              name='credit'
              value={reason}
              options={[
                {
                  value: 1,
                  label: 'TC/LC'
                },
                {
                  value: 2,
                  label: 'Admission Withdrawn'
                },
                {
                  value: 3,
                  label: 'Sabbatical'
                },
                {
                  value: 4,
                  label: 'Others'
                }
              ]}
            />
          </Grid>)
        }
        <Grid item xs={3}>
          <Button
            variant='contained'
            color='primary'
            onClick={readExcelFile}
            style={{ marginTop: '20px' }}
          >Submit</Button>
        </Grid>
      </Grid>
      <Grid container spacing={8} alignItems='center'>
        <Grid item xs={6} md={2}>
          <Radio
            checked={status === 'active'}
            onChange={(e) => setStatus(e.target.value)}
            value='active'
            classes={{ root: classes.greenButton }}
            name='radio-button-demo'
            inputProps={{ 'aria-label': 'A' }}
          />
          <span>Active</span>
        </Grid>
        <Grid item xs={6} md={2}>
          <Radio
            checked={status === 'inactive'}
            onChange={(e) => setStatus(e.target.value)}
            value='inactive'
            classes={{ root: classes.greenButton }}
            name='radio-button-demo'
            inputProps={{ 'aria-label': 'A' }}
          />
          <span>Inactive</span>
        </Grid>
      </Grid>
      {props.dataLoadingStatus ? <CircularProgress open /> : null}
    </div>
    </Layout>
  )
}

const mapStateToProps = (state) => ({
  user: state.authentication.user,
  dataLoadingStatus: state.finance.common.dataLoader
})

const mapDispatchToProps = (dispatch) => ({
  dataLoaded: () => dispatch(actionTypes.dataLoaded()),
  dataLoading: () => dispatch(actionTypes.dataLoading()),
  bulkActiveInactive: (body, user, alert) => dispatch(actionTypes.bulkActiveInactive({ body, user, alert }))
})

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(BulkActiveInactive))
