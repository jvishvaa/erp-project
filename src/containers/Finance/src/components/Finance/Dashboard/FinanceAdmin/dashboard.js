import React, { Component } from 'react'
import { connect } from 'react-redux'
import {
  withStyles,
  Typography,
  Grid
  // Button,
  // Dialog,
  // DialogActions,
  // DialogTitle,
  // DialogContent,
  // FormControl,
  // DialogContentText
} from '@material-ui/core'
import Select from 'react-select'
import Card from '@material-ui/core/Card'
import CardActionArea from '@material-ui/core/CardActionArea'
// import CardActions from '@material-ui/core/CardActions'
import CardContent from '@material-ui/core/CardContent'
import { withRouter } from 'react-router-dom'
import ActivateInactivateStudentAdm from './activateInactivateStudent'
import * as actionTypes from '../../store/actions'
import { apiActions } from '../../../../_actions'
import CircularProgress from '../../../../ui/CircularProgress/circularProgress'

const styles = theme => ({
  container: {
    display: 'flex',
    flexwrap: 'wrap'
  },
  card: {
    maxWidth: '300px'
  },
  bullet: {
    display: 'inline-block',
    margin: '0 2px',
    transform: 'scale(0.8)'
  },
  title: {
    fontsize: 14
  },
  count_title: {
    fontsize: 16
  },
  pos: {
    marginBottom: 12
  },
  root: {
    flexGrow: 1
  },
  paper: {
    textAlign: 'center',
    color: theme.palette.text.secondary
  },
  spacing: {
    marginLeft: '20px',
    marginRight: '10px',
    marginTop: '5px',
    marginBottom: '10px'
  },
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120
  },
  diag: { minWidth: '40em', minHeight: '40em' }
})

class AdminDashboard extends Component {
  constructor (props) {
    super(props)
    this.state = {
      session: null,
      open: true,
      maxWidth: 'xl'
    }
  }

  componentDidMount () {
    // this.props.dataLoading()
    this.props.getStudentCountActive(this.props.alert, this.props.user)
    this.props.fetchBranch(this.props.alert, this.props.user)
    this.props.getPendingOnlineAdmission(this.props.alert, this.props.user)
  }
  buttonHandler = (e) => {
    this.props.history.push({
      pathname: '/finance/ActivateInactivateStudent'
    })
  }
  card2buttonHandler = (e) => {
    this.props.history.push({
      pathname: '/finance/onlineAdmissions'
    })
  }
  changeBranchHandler = (e) => {
    if (this.props.user) {
      this.props.switchBranchAdmin(this.props.alert, this.props.user, e.value)
    }
  }

  componentDidUpdate () {
    console.log('switchBranchAdminData: ', this.props.switchBranchAdminData)
    if (this.props.switchBranchAdminData) {
      localStorage.setItem('user_profile', JSON.stringify(this.props.switchBranchAdminData))
      this.props.history.push({
        pathname: '/financeAcc/dashboard'
      })
    }
  }

  render () {
    let activeCountDisplay = null
    let inactiveCountDisplay = null
    if (this.props.activeCount) {
      activeCountDisplay = (
        <React.Fragment>
          <span>{ this.props.activeCount.reactive_requests }</span>
        </React.Fragment>
      )
      inactiveCountDisplay = (
        <React.Fragment>
          <span>{ this.props.activeCount.inactive_requests }</span>
        </React.Fragment>
      )
    } else {
      activeCountDisplay = (
        <React.Fragment>
          <span>0</span>
        </React.Fragment>
      )
      inactiveCountDisplay = (
        <React.Fragment>
          <span>0</span>
        </React.Fragment>
      )
    }
    const { classes } = this.props
    // const bull = <span className={classes.bullet}>•</span>

    return (
      <React.Fragment>
        <Typography variant='h5' align='center'>Admin Dashboard</Typography>
        <Grid container spacing={12} justify='space-between'>
          <Grid item xs={6} className={classes.spacing}>
            <Card className={classes.card}>
              <CardActionArea style={{ backgroundColor: 'antiquewhite' }} open={<ActivateInactivateStudentAdm />} onClick={this.buttonHandler}>
                <CardContent>
                  <Typography className={classes.title} color='textSecondary' gutterBottom>
            Admin Card
                  </Typography>
                  <Typography variant='h6' className={classes.count_title} component='h6'>
                    Total ReActive Requests { activeCountDisplay }
                    <br />
                    Total Inactive Requests { inactiveCountDisplay }
                  </Typography>
                  <br />
                  <br />
                  <br />
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid>
          <Grid item xs={6} className={classes.spacing}>
            <Card className={classes.card} style={{ boxShadow: '0 4px 8px 0 rgba(0,0,0,0.2)', transition: '0.3s', border: '5px solid skyBlue' }}>
              <CardActionArea style={{ backgroundColor: 'coral' }} onClick={this.card2buttonHandler}>
                <CardContent>
                  <Typography className={classes.title} color='textSecondary' gutterBottom>
            Pending Admissions
                  </Typography>
                  <Typography variant='h6' className={classes.count_title} component='h6'>
                    <br />
                    Total Pending Admissions : { this.props.onlinePendingAdmissionData && this.props.onlinePendingAdmissionData.count }
                  </Typography>
                  <br />
                  <br />
                  <br />
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid>
          {this.props.branchList.length ? <Grid item xs={3} className={classes.spacing}>
            <label>Switch Branch</label>
            <Select
              placeholder='Select Branch'
              options={
                this.props.branchList ? this.props.branchList.map((branch) =>
                  ({ value: branch.id, label: branch.branch_name })) : []
              }
              // onChange={(e) => switchBranch(alert, user, e.value)}
              onChange={(e) => { this.changeBranchHandler(e) }}
            />
          </Grid> : ''}
        </Grid>
        {this.props.dataLoading ? <CircularProgress open /> : null}
      </React.Fragment>
    )
  }
}

const mapStateToProps = state => ({
  dataLoading: state.finance.common.dataLoader,
  user: state.authentication.user,
  activeCount: state.finance.financeAdminDashBoard.activeCount,
  branchList: state.finance.accountantReducer.financeAccDashboard.branchList,
  switchBranchAdminData: state.finance.financeAdminDashBoard.switchBranchAdminData,
  onlinePendingAdmissionData: state.finance.financeAdminDashBoard.onlinePendingAdmissionData
})
const mapDispatchToProps = dispatch => ({
  loadSession: dispatch(apiActions.listAcademicSessions()),
  getPendingOnlineAdmission: (alert, user) => dispatch(actionTypes.getPendingOnlineAdmission({ alert, user })),
  fetchBranch: (alert, user) => dispatch(actionTypes.fetchBranch({ alert, user })),
  getStudentCountActive: (alert, user) => dispatch(actionTypes.getStudentCountActive({ alert, user })),
  switchBranchAdmin: (alert, user, branch) => dispatch(actionTypes.switchBranchAdmin({ alert, user, branch }))
})
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(withRouter(AdminDashboard)))
