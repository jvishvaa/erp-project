import React, { Component } from 'react'
import { withStyles, Grid, TextField, Table, TableRow, TableHead, TableBody, TableCell, Paper } from '@material-ui/core/'
import Button from '@material-ui/core/Button'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import Select from 'react-select'
import { apiActions } from '../../../../_actions'
import * as actionTypes from '../../store/actions'
import CircularProgress from '../../../../ui/CircularProgress/circularProgress'
import Layout from '../../../../../../Layout'
// import NewRegistration from './newRegistrationForm'

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
    margin: '5px',
    '&:hover': {
      backgroundColor: '#8B008B',
      color: '#fff'
    }
  },
  root: {
    width: '100%',
    marginTop: theme.spacing(3),
    overflowX: 'auto'
  },
  table: {
    minWidth: 650
  },
  margin: {
    margin: theme.spacing(1)
  }
})

const NavData = JSON.parse(localStorage.getItem('navigationData')) || {}
let moduleId
if (NavData && NavData.length) {
  NavData.forEach((item) => {
    if (
      item.parent_modules === 'Admissions' &&
      item.child_module &&
      item.child_module.length > 0
    ) {
      item.child_module.forEach((item) => {
        if (item.child_name === 'Registration Form') {
          // setModuleId(item.child_id);
          // setModulePermision(true);
            moduleId = item.child_id
          console.log('id+', item.child_id)
        } else {
          // setModulePermision(false);
        }
      });
    } else {
      // setModulePermision(false);
    }
  });
} else {
  // setModulePermision(false);
}

class RegistrationForm extends Component {
  constructor (props) {
    super(props)
    this.state = {
      session: null
    }
  }

  handleAcademicyear = (e) => {
    this.setState({ session: e })
  }

  fromDateHandler = (e) => {
    this.setState({ fromDate: e.target.value })
    // if (Date.parse(e.target.value) > Date.parse(this.state.todayDate)) {
    //   this.props.alert.warning('Selected Date is Incorrect!')
    //   this.setState({ fromDate: null })
    //   return false
    // } else {
    //   this.setState({ fromDate: e.target.value })
    // }
  }

  toDateHandler = (e) => {
    this.setState({ toDate: e.target.value })
    // if (this.state.fromDate) {
    //   if (Date.parse(this.state.fromDate) > Date.parse(e.target.value) || Date.parse(e.target.value) > Date.parse(this.state.todayDate)) {
    //     this.props.alert.warning('Selected Date is Incorrect!')
    //     this.setState({ toDate: null })
    //     return false
    //   } else {
    //     this.setState({ toDate: e.target.value })
    //   }
    // } else {
    //   this.props.alert.warning('select From Date Buddy!')
    // }
  }

  onCreateClick = () => {
    // this.setState({
    //   show: true
    // })
    this.props.history.push({
      pathname: '/finance/accountant/newregistrationForm'
    })
  }

  fetchRegListHandler = () => {
    // fetch calll
    const { session, fromDate, toDate } = this.state
    this.props.fetchRegistrationList(session, fromDate, toDate, this.props.user, this.props.alert)
  }

  render () {
    const { classes } = this.props
    // const alertt = this.props
    let regListTable = null
    if (this.props.regList && this.props.regList.length > 0) {
      regListTable = (
        <Paper className={classes.root}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Sl</TableCell>
                <TableCell>Name</TableCell>
                {/* <TableCell>ERP</TableCell> */}
                <TableCell>Class</TableCell>
                <TableCell>Application no</TableCell>
                <TableCell>Registration no</TableCell>
                <TableCell>Parent Name</TableCell>
                <TableCell>Contact no</TableCell>
                <TableCell>Address</TableCell>
                {/* <TableCell>Qualified</TableCell> */}
                <TableCell>Admission Status</TableCell>
                <TableCell>Reg Date</TableCell>
                <TableCell>Paid Amount</TableCell>
                <TableCell>Paid Date</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {this.props.regList.map((row, i) => (
                <TableRow>
                  <TableCell>{i + 1}</TableCell>
                  <TableCell>{row.student && row.student.student_name ? row.student.student_name : ''}</TableCell>
                  <TableCell>{row.student && row.student.opting_class && row.student.opting_class.grade ? row.student.opting_class.grade : ''}</TableCell>
                  <TableCell>{row.application_number ? row.application_number : ''}</TableCell>
                  <TableCell>{row.registration_number ? row.registration_number : ''}</TableCell>
                  <TableCell>{row.student.parent && row.student.parent.father_name ? row.student.parent.father_name : row.student.parent.mother_name ? row.student.parent.mother_name : row.student.parent.guardian_name}</TableCell>
                  <TableCell>{row.student && row.student.phone ? row.student.phone : ''}</TableCell>
                  <TableCell>{row.student && row.student.address ? row.student.address : ''}</TableCell>
                  <TableCell>{'-'}</TableCell>
                  <TableCell>{row.registration_date ? row.registration_date : ''}</TableCell>
                  <TableCell>{row.paid_amount ? row.paid_amount : ''}</TableCell>
                  <TableCell>{row.paid_date ? row.paid_date : ''}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Paper>
      )
    }
    return (
      <Layout>      
        <div>
        <Grid container spacing={2} style={{ padding: '20px' }}>
          <Grid xs={10} />
          <Grid item xs={2} >
            <Button variant='contained' color='primary' onClick={this.onCreateClick}>
                Create New
            </Button>
          </Grid>
        </Grid>
        <Grid container spacing={2}>
          <Grid item xs={3} style={{ padding: '20px' }}>
            <label>Academic Year*</label>
            <Select
              placeholder='Select Year'
              // style={{ height: '30px' }}
              value={this.state.session ? this.state.session : null}
              options={
                this.props.session
                  ? this.props.session.session_year.map(session => ({
                    value: session,
                    label: session
                  }))
                  : []
              }
              onChange={(e) => { this.handleAcademicyear(e) }}
            />
          </Grid>
          <Grid item xs={3} style={{ padding: '20px' }}>
            {/* <label>From Date*</label> */}
            <TextField
              id='startDate'
              label='From Date'
              type='date'
              variant='outlined'
              // className={classes.textField}
              onChange={this.fromDateHandler}
              InputLabelProps={{
                shrink: true
              }}
            />
          </Grid>
          <Grid item xs={3} style={{ padding: '20px' }}>
            {/* <label>To Date*</label> */}
            <TextField
              id='endDate'
              label='To Date'
              type='date'
              variant='outlined'
              // className={classes.textField}
              onChange={this.toDateHandler}
              InputLabelProps={{
                shrink: true
              }}
            />
          </Grid>
          <Grid item xs={3} style={{ padding: '20px', marginTop: '18px' }}>
            <Button variant='contained' disabled={!this.state.session || !this.state.fromDate || !this.state.toDate} color='primary' onClick={this.fetchRegListHandler}>
                Get
            </Button>
          </Grid>
        </Grid>
        {regListTable}
        {this.props.dataLoading ? <CircularProgress open /> : null}
      </div>
      </Layout>
    )
  }
}

const mapStateToProps = state => ({
  user: state.authentication.user,
  session: state.academicSession.items,
  regList: state.finance.accountantReducer.regForm.regList,
  dataLoading: state.finance.common.dataLoader
})

const mapDispatchToProps = dispatch => ({
  loadSession: dispatch(apiActions.listAcademicSessions(moduleId)),
  fetchRegistrationList: (session, fromDate, toDate, user, alert) => dispatch(actionTypes.fetchRegistrationList({ session, fromDate, toDate, user, alert }))
})

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(withRouter(RegistrationForm)))
