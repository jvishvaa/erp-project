import React, { useState, useEffect } from 'react'

import {
  TextField,
  Grid,
  withStyles,
  Button
} from '@material-ui/core'
import { connect } from 'react-redux'
import readXlsxFile from 'read-excel-file'
import zipcelx from 'zipcelx'

import styles from './AccountantLogin.styles.js'
import * as actionTypes from '../../store/actions'
import { CircularProgress } from '../../../../ui'

const AccountantLogin = ({
  classes,
  dataLoaded,
  dataLoading,
  branchListing,
  user,
  alert,
  ...props }) => {
  const [statusFile, setStatusFile] = useState(null)

  useEffect(() => {
    branchListing(user, alert)
  }, [alert, branchListing, user])

  const fileChangeHandler = (event) => {
    const file = event.target.files[0]
    setStatusFile(file)
  }

  const downloadSample = () => {
    const headers = [
      {
        value: 'ERPCode',
        type: 'string'
      },
      {
        value: 'ERPName',
        type: 'string'
      },
      {
        value: 'Email',
        type: 'string'
      },
      {
        value: 'Address',
        type: 'string'
      },
      {
        value: 'BranchName',
        type: 'string'
      },
      {
        value: 'Login Access Level',
        type: 'string'
      },
      {
        value: 'ContactNumber',
        type: 'string'
      },
      {
        value: 'Date of birth',
        type: 'string'
      }
    ]
    const config = {
      filename: 'accountant_login_sample',
      sheet: {
        data: [headers]
      }
    }
    zipcelx(config)
  }

  const downloadBranchList = () => {
    const headers = [
      {
        value: 'Branch_name',
        type: 'string'
      },
      {
        value: 'Branch_id',
        type: 'string'
      }
    ]
    const branches = props.branchList.map((branch) => {
      return [
        {
          value: branch.branch_name,
          type: 'string'
        },
        {
          value: branch.id,
          type: 'number'
        }
      ]
    })
    const config = {
      filename: 'branch_list',
      sheet: {
        data: [headers, ...branches]
      }
    }
    zipcelx(config)
  }

  const readExcelFile = () => {
    const schema = {
      'ERPCode': {
        prop: 'ERPCode',
        type: Number,
        required: true,
        parse (value) {
          const numLen = `${value}`.trim().length
          if (numLen !== 10) {
            throw new Error('Invalid ERP')
          }
          return value
        }
      },
      'ERPName': {
        prop: 'ERPName',
        type: String,
        required: true
      },
      'Email': {
        prop: 'Email',
        type: String,
        required: true
      },
      'BranchName': {
        prop: 'BranchName',
        type: String,
        required: true,
        parse (value) {
          const found = props.branchList.find(item => item.branch_name === value)
          if (!found) {
            throw new Error('Invalid Branch')
          }
          return value
        }
      },
      'ContactNumber': {
        prop: 'ContactNumber',
        type: Number,
        required: true,
        parse (value) {
          const numLen = `${value}`.trim().length
          if (numLen !== 10) {
            throw new Error('Invalid Contact Number')
          }
          return value
        }
      }
    }
    dataLoading()
    readXlsxFile(statusFile, { schema }).then(({ rows, errors }) => {
      // `errors` have shape `{ row, column, error, value }`.
      // if (errors.length !== 0) {
      //   console.log('Error', errors)
      //   throw new Error(`${errors[0].error}: Row - ${errors[0].row} | Column - ${errors[0].column} | Value - ${errors[0].value}`)
      // }
      console.log('rows', rows)
      dataLoaded()
      const form = new FormData()
      form.append('file', statusFile)
      props.bulkAccLogin(form, user, alert)
    }).catch(err => {
      console.log(err)
      alert.warning(err.message || err)
      dataLoaded()
    })
  }
  return (
    <div className={classes.container}>
      <Grid container justify='flex-end'>
        <Grid item xs={3}>
          <Button
            variant='outlined'
            color='primary'
            onClick={downloadBranchList}
          >Download Branch List</Button>
        </Grid>
      </Grid>
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
      {props.dataLoadingStatus ? <CircularProgress open /> : null}
    </div>
  )
}

const mapStateToProps = (state) => ({
  user: state.authentication.user,
  dataLoadingStatus: state.finance.common.dataLoader,
  branchList: state.finance.bulkOperation.branchList
})

const mapDispatchToProps = (dispatch) => ({
  dataLoaded: () => dispatch(actionTypes.dataLoaded()),
  dataLoading: () => dispatch(actionTypes.dataLoading()),
  branchListing: (user, alert) => dispatch(actionTypes.branchListing({ user, alert })),
  bulkAccLogin: (body, user, alert) => dispatch(actionTypes.bulkAccountantLogin({ body, user, alert }))
})

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(AccountantLogin))
