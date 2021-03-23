import React, { useState, useEffect } from 'react'
import { connect } from 'react-redux'
import Select from 'react-select'
import zipcelx from 'zipcelx'
import {
  withStyles,
  Grid,
  Button,
  Divider,
  TextField
} from '@material-ui/core/'
// import { AddCircle, DeleteForever } from '@material-ui/icons'

import { apiActions } from '../../../../_actions'
import * as actionTypes from '../../store/actions'
import CircularProgress from '../../../../ui/CircularProgress/circularProgress'
import Layout from '../../../../../../Layout'

const styles = theme => ({
  button: {
    margin: theme.spacing.unit,
    color: '#fff',
    backgroundColor: '#2196f3',
    marginTop: '0px',
    '&:hover': {
      backgroundColor: '#1a8cff'
    }
  },
  divIcon: {
    paddingTop: '30px'
  },
  icon: {
    color: '#2196f3',
    fontWeight: 'bolder',
    fontSize: 30,
    '&:hover': {
      color: '#1a8cff',
      cursor: 'pointer'
    }
  },
  rightIcon: {
    marginLeft: theme.spacing.unit
  },
  deleteButton: {
    color: '#fff',
    backgroundColor: 'rgb(225, 0, 80)'
  },
  container: {
    padding: '20px 40px'
  },
  header: {
    fontSize: 16
  },
  downloadFormat: {
    color: theme.palette.primary.main,
    position: 'absolute',
    right: '15px',
    '&:hover': {
      color: theme.palette.primary.dark,
      textDecoration: 'underline',
      cursor: 'pointer'
    }
  }
})

const OrderStatusUpload = ({ classes, session, alert, user, UploadOrderStatus, dataLoading }) => {
  const [sessionData, setSessionData] = useState({ label: '2020-21', value: '2020-21' })
  const [bulkFile, setBulkFile] = useState(null)
  useEffect(() => {
    console.log(bulkFile)
  }, [bulkFile])
  const handleClickSessionYear = (e) => {
    setSessionData(e)
  }

  const downloadSample = () => {
    const headers = [
      {
        value: 'ERP',
        type: 'string'
      }
    ]
    const config = {
      filename: 'QR_sample',
      sheet: {
        data: [headers]
      }
    }
    zipcelx(config)
  }

  const fileChangeHandler = (event) => {
    console.log('my file: ', event.target.files[0])
    const file = event.target.files[0]
    setBulkFile(file)
  }

  const uploadStatusHandler = () => {
    const form = new FormData()
    form.set('academic_year', sessionData.value)
    form.append('file', bulkFile)
    if (!bulkFile) {
      alert.warning('select the file')
      return
    }
    UploadOrderStatus(form, alert, user)
  }
  return (
    <Layout>
    <div className={classes.container}>
      <Grid container spacing={3}>
        <Grid item xs={10}>
          <label className={classes.header}>
            Order Status Upload
          </label>
          <Divider />
        </Grid>
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
        <Grid item xs={3}>
          <TextField
            id='file_upload'
            margin='dense'
            type='file'
            required
            variant='outlined'
            // className={classes.textField}
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
            style={{ marginTop: '20px' }}
            onClick={uploadStatusHandler}
          >UPLOAD</Button>
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
  dataLoading: state.finance.common.dataLoader
})
const mapDispatchToProps = dispatch => ({
  loadSession: dispatch(apiActions.listAcademicSessions()),
  UploadOrderStatus: (body, alert, user) => dispatch(actionTypes.UploadOrderStatus({ body, alert, user }))
})

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(OrderStatusUpload))
