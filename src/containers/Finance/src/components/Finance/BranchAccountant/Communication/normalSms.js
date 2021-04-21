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
// import Select from 'react-select'
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
  approve: {
    backgroundColor: '#008000',
    color: '#fff',
    '&:hover': {
      backgroundColor: '#006400'
    },
    '&:disabled': {
      backgroundColor: '#A9A9A9'
    }
  },
  reject: {
    backgroundColor: '#FF0000',
    color: '#fff',
    '&:hover': {
      backgroundColor: '#8B0000'
    },
    '&:disabled': {
      backgroundColor: '#A9A9A9'
    }
  }
})

const NormalSms = ({ classes,
  session,
  history,
  dataLoading,
  sendNormalSms,
  formCount,
  alert,
  user,
  downloadReports,
  fetchBranches,
  ...props }) => {
  const [contactNo, setContactNo] = useState(null)
  const [message, setMessage] = useState(null)

  const contactNoHandler = (e) => {
    if (e.target.value.length <= 10) {
      setContactNo(e.target.value)
    } else {
      alert.warning('enter 10 digits')
    }
  }

  const messageHandler = (e) => {
    setMessage(e.target.value)
  }

  const sendNormalSmsHandler = () => {
    // send the msg
    let data = {
      contact_no: contactNo,
      message: message
    }
    sendNormalSms(data, alert, user)
  }

  return (
    <React.Fragment>
      <Grid container spacing={3} style={{ padding: 15 }}>
        <Grid item className={classes.item} xs={3}>
          <label>Contact Number*</label>
          <TextField
            id='contactNo'
            type='number'
            value={contactNo || ''}
            onChange={(e) => { contactNoHandler(e) }}
            margin='normal'
            variant='outlined'
          />
        </Grid>
        <Grid item className={classes.item} xs={3}>
          <label>Message*</label>
          <TextField
            id='message'
            type='text'
            value={message || ''}
            onChange={(e) => { messageHandler(e) }}
            margin='normal'
            variant='outlined'
          />
        </Grid>
        <Grid item className={classes.item} xs={2}>
          <Button style={{ marginTop: 20 }} variant='contained' disabled={!contactNo || !message} onClick={() => { sendNormalSmsHandler() }} className={classes.btn}>Send</Button>
        </Grid>
      </Grid>
      {dataLoading ? <CircularProgress open /> : null}
    </React.Fragment>
  )
}

NormalSms.propTypes = {
  classes: PropTypes.objectOf(PropTypes.string).isRequired
}

const mapStateToProps = state => ({
  user: state.authentication.user,
  session: state.academicSession.items,
  dataLoading: state.finance.common.dataLoader,
  branches: state.finance.common.branchPerSession,
  formCount: state.finance.accountantReducer.totalFormCount.formCount
})

const mapDispatchToProps = dispatch => ({
  loadSession: dispatch(apiActions.listAcademicSessions()),
  fetchBranches: (session, alert, user) => dispatch(actionTypes.fetchBranchPerSession({ session, alert, user })),
  sendNormalSms: (data, alert, user) => dispatch(actionTypes.sendNormalSms({ data, alert, user }))
})

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(withRouter(NormalSms)))
