import React, {
  useState
  // useEffect
  // useMemo
} from 'react'
import { withStyles, Grid, TextField, Button
} from '@material-ui/core/'
import { withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import zipcelx from 'zipcelx'
import readXlsxFile from 'read-excel-file'
// import Select from 'react-select'
// import styles from './bulkSmsSender.styles'
import { apiActions } from '../../../../_actions'
// import { urls } from '../../../../urls'
import * as actionTypes from '../../store/actions'
import CircularProgress from '../../../../ui/CircularProgress/circularProgress'

const styles = theme => ({
  tableWrapper: {
    overflowX: 'auto',
    marginBottom: 12,
    'border': '1px solid black',
    borderRadius: 4
  },
  btn: {
    backgroundColor: '#800080',
    color: '#fff',
    '&:hover': {
      backgroundColor: '#8B008B'
    },
    '&:disabled': {
      backgroundColor: '#A9A9A9'
    }
  },
  root: {
    width: '100%',
    marginTop: theme.spacing * 3,
    overflowX: 'auto'
  },
  table: {
    minWidth: 650
  },
  container: {
    width: '95%',
    margin: 'auto',
    marginTop: '5px'
  },
  divider: {
    marginTop: theme.spacing.unit * 2,
    marginBottom: theme.spacing.unit * 2
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

const BulkSms = ({ classes,
  session,
  branch,
  history,
  sendNormalSms,
  formCount,
  alert,
  user,
  downloadReports,
  fetchBranches,
  sendBulkSms,
  dataLoaded,
  dataLoading,
  ...props }) => {
  const [message, setMessage] = useState(null)
  const [bulkFile, setBulkFile] = useState(null)

  const downloadSample = () => {
    const headers = [
      {
        value: 'ERP',
        type: 'string'
      }
    ]
    const config = {
      filename: 'bulk_sample',
      sheet: {
        data: [headers]
      }
    }
    zipcelx(config)
  }

  const fileChangeHandler = (event) => {
    const file = event.target.files[0]
    setBulkFile(file)
  }

  const messageHandler = (e) => {
    setMessage(e.target.value)
  }

  const bulkSmsHandler = () => {
    const schema = {
      'ERP': {
        prop: 'ERP',
        type: Number
      }
    }
    if (!bulkFile) {
      alert.warning('Choose a file to upload!')
    } else {
      readXlsxFile(bulkFile, { schema }).then(({ rows, errors }) => {
      // `errors` have shape `{ row, column, error, value }`.
        if (errors.length !== 0) {
          throw new Error('Excel Format Not Correct')
        }
        const erp = rows.map(item => item.ERP)
        const body = {
          students: erp,
          message: message,
          session_year: session,
          branch: branch
        }
        // dataLoaded()
        sendBulkSms(body, alert, user)
      }).catch(err => {
        alert.warning(err.message || 'Unable to Read Excel')
      // dataLoaded()
      })
    }
  }

  return (
    <React.Fragment>
      <Grid container spacing={3} style={{ padding: 15 }}>
        <Grid item className={classes.item} xs={3}>
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
        <Grid item className={classes.item} xs={3}>
          <label>Message*</label>
          <TextField
            id='message'
            type='text'
            // className={classes.textField}
            value={message || ''}
            onChange={(e) => { messageHandler(e) }}
            margin='normal'
            variant='outlined'
          />
        </Grid>
        <Grid item className={classes.item} xs={2}>
          <Button style={{ marginTop: 20 }} variant='contained' disabled={false} onClick={() => { bulkSmsHandler() }} className={classes.btn}>Send</Button>
        </Grid>
      </Grid>
      {dataLoading ? <CircularProgress open /> : null}
    </React.Fragment>
  )
}

BulkSms.propTypes = {
  classes: PropTypes.objectOf(PropTypes.string).isRequired
}

const mapStateToProps = state => ({
  user: state.authentication.user,
  dataLoading: state.finance.common.dataLoader,
  branches: state.finance.common.branchPerSession,
  formCount: state.finance.accountantReducer.totalFormCount.formCount
})

const mapDispatchToProps = dispatch => ({
  loadSession: dispatch(apiActions.listAcademicSessions()),
  fetchBranches: (session, alert, user) => dispatch(actionTypes.fetchBranchPerSession({ session, alert, user })),
  sendBulkSms: (data, alert, user) => dispatch(actionTypes.sendBulkSms({ data, alert, user }))
})

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(withRouter(BulkSms)))
