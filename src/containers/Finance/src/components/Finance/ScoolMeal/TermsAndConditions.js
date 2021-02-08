import React, {
  useEffect,
  useState
} from 'react'
import { withStyles, Grid, Button } from '@material-ui/core/'
import { withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import Select from 'react-select'
import { apiActions } from '../../../_actions'
// import RequestShuffle from './requestShuffle'
import '../../../css/staff.css'
import * as actionTypes from '../store/actions'
// import classes from './feeStructure.module.css'
// import Modal from '../../../../ui/Modal/modal'
import CircularProgress from '../../../ui/CircularProgress/circularProgress'

const styles = theme => ({
  tableWrapper: {
    overflowX: 'auto',
    marginBottom: 12,
    'border': '1px solid black',
    borderRadius: 4
  },
  item: {
    margin: '15px'
  },
  btn: {
    backgroundColor: '#800080',
    color: '#fff',
    '&:hover': {
      backgroundColor: '#8B008B'
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

const TermsAndConditions = ({ classes, session, history, dataLoading, fetchBranches, branchPerSession, fetchTermList, termsList, alert, user }) => {
  const [sessionYear, setSession] = useState({ value: '2019-20', label: '2019-20' })
  const [branchData, setBranchData] = useState(null)
  const [terms, setTerms] = useState(null)
  useEffect(() => {
    if (sessionYear) {
      fetchBranches(sessionYear.value, alert, user)
    }
  }, [alert, fetchBranches, sessionYear, user])

  useEffect(() => {
    console.log(termsList)
  })

  const handleSession = (e) => {
    setSession(e)
    fetchBranches(e.value, alert, user)
    setBranchData(null)
  }

  const branchDataHandler = (e) => {
    setBranchData(e)
  }

  const termsHandler = (e) => {
    setTerms(e.target.value)
  }

  const getTermsHandler = () => {
    console.log('fetch all terms')
    fetchTermList(sessionYear.value, branchData.value, alert, user)
  }

  return (
    <React.Fragment>
      <Grid container spacing={3}>
        <Grid item className={classes.item} xs={3}>
          <label>Academic Year*</label>
          <Select
            placeholder='Select Year'
            value={sessionYear || ''}
            options={
              session
                ? session.session_year.map(session => ({
                  value: session,
                  label: session
                }))
                : []
            }
            onChange={handleSession}
          />
        </Grid>
        <Grid item className={classes.item} xs={3}>
          <label>Branch*</label>
          <Select
            placeholder='Select Branch'
            options={
              branchPerSession && branchPerSession.length > 0
                ? branchPerSession.map((branch) => ({
                  value: branch.branch.id ? branch.branch.id : '',
                  label: branch.branch.branch_name ? branch.branch.branch_name : ''
                }))
                : []}
            value={branchData || null}
            onChange={branchDataHandler}
          />
        </Grid>
        <Grid item className={classes.item} xs={3}>
          <Button
            onClick={getTermsHandler}
            color='primary'
            style={{ marginTop: '20px' }}
            variant='contained'
          >
            Get
          </Button>
        </Grid>
        {branchData && sessionYear
          ? <React.Fragment>
            <Grid item className={classes.item} xs={3}>
              <label>Terms And Conditions*</label>
              <textarea
                name='terms'
                type='text'
                className='form-control'
                style={{ width: '200px', height: '100px' }}
                value={terms || null}
                onChange={termsHandler}
              />
            </Grid>
            <Grid item className={classes.item} xs={3}>
              <Button
                // onClick={addTermsHandler}
                color='primary'
                style={{ marginTop: '20px' }}
                variant='contained'
              >
                Add
              </Button>
            </Grid>
          </React.Fragment>
          : null}
      </Grid>
      {/* {shuffleStatus && shuffleStatus.value === 1 ? pendingShuffleTable() : shuffleStatus && shuffleStatus.value === 2 ? approvedShuffleTable() : rejectedShuffleTable() } */}
      {dataLoading ? <CircularProgress open /> : null}
    </React.Fragment>
  )
}

TermsAndConditions.propTypes = {
  classes: PropTypes.objectOf(PropTypes.string).isRequired
  // session: PropTypes.array.isRequired
}

const mapStateToProps = state => ({
  user: state.authentication.user,
  session: state.academicSession.items,
  dataLoading: state.finance.common.dataLoader,
  branchPerSession: state.finance.common.branchPerSession,
  termsList: state.finance.scoolMeal.termsList
})

const mapDispatchToProps = dispatch => ({
  loadSession: dispatch(apiActions.listAcademicSessions()),
  fetchBranches: (session, alert, user) => dispatch(actionTypes.fetchBranchPerSession({ session, alert, user })),
  fetchTermList: (session, branch, alert, user) => dispatch(actionTypes.fetchTermList({ session, branch, alert, user }))
})

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(withRouter(TermsAndConditions)))
