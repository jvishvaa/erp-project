import React, { useState } from 'react'
import {
  TextField,
  // Radio,
  Grid,
  withStyles,
  Button
} from '@material-ui/core'
import { connect } from 'react-redux'
import readXlsxFile from 'read-excel-file'
import zipcelx from 'zipcelx'

import styles from '../BulkActiveInactive/bulkActiveInactive.styles'
import * as actionTypes from '../../store/actions'
import { CircularProgress } from '../../../../ui'

const OnlinePaymentUpload = ({
  classes,
  dataLoaded,
  dataLoading,
  ...props }) => {
  const [statusFile, setStatusFile] = useState(null)
  // const [status, setStatus] = useState('active')

  const fileChangeHandler = (event) => {
    const file = event.target.files[0]
    setStatusFile(file)
  }

  const downloadSample = () => {
    const headers = [
      {
        value: 'S.No',
        type: 'string'
      },
      {
        value: 'Merc Txn Id',
        type: 'string'
      }
    ]
    const config = {
      filename: 'online_payment_upload',
      sheet: {
        data: [headers]
      }
    }
    zipcelx(config)
  }

  const readExcelFile = () => {
    const schema = {
      'Enrollment code': {
        prop: 'enrollment_code',
        type: String
      }
    }
    dataLoading()
    readXlsxFile(statusFile, { schema }).then(({ rows, errors }) => {
      // `errors` have shape `{ row, column, error, value }`.
      if (errors.length !== 0) {
        throw new Error('Excel Format Not Correct')
      }
      const erp = rows.map(item => item.enrollment_code)
      const body = {
        erp
        // status: status === 'active'
      }
      dataLoaded()
      props.onlinePaymentUpload(body, props.user, props.alert)
    }).catch(err => {
      console.log(err)
      props.alert.warning(err.message || 'Unable to Read Excel')
      dataLoaded()
    })
  }
  return (
    <div className={classes.container}>
      <Grid container spacing={6} alignItems='center'>
        <Grid item xs={12} md={3}>
          <TextField
            id='file_upload'
            margin='dense'
            type='file'
            required
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
        <Grid item xs={3}>
          <Button
            variant='contained'
            color='primary'
            onClick={readExcelFile}
          >Submit</Button>
        </Grid>
      </Grid>
      {/* <Grid container spacing={8} alignItems='center'>
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
      </Grid> */}
      {props.dataLoadingStatus ? <CircularProgress open /> : null}
    </div>
  )
}

const mapStateToProps = (state) => ({
  user: state.authentication.user,
  dataLoadingStatus: state.finance.common.dataLoader
})

const mapDispatchToProps = (dispatch) => ({
  dataLoaded: () => dispatch(actionTypes.dataLoaded()),
  dataLoading: () => dispatch(actionTypes.dataLoading()),
  onlinePaymentUpload: (body, user, alert) => dispatch(actionTypes.onlinePaymentUpload({ body, user, alert }))
})

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(OnlinePaymentUpload))
