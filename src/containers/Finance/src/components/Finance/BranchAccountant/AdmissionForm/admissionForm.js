/* eslint-disable indent */
import React, { Component } from 'react'
import { connect } from 'react-redux'
import Select from 'react-select'
import { withStyles, Button, TextField } from '@material-ui/core'
import Grid from '@material-ui/core/Grid'
import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableHead from '@material-ui/core/TableHead'
import Icon from '@material-ui/core/Icon'
// import TablePagination from '@material-ui/core/TablePagination'
import TableRow from '@material-ui/core/TableRow'
// import TableSortLabel from '@material-ui/core/TableSortLabel'
// import FilterListIcon from '@material-ui/icons/FilterList'
// import Paper from '@material-ui/core/Paper'
import { withRouter } from 'react-router-dom'
import { apiActions } from '../../../../_actions'
import CustomizedAdmissionFormAcc from './customizedAdmissionForm'
// import UpdateAdmissionFormAcc from './updateAdmissionForm'
import * as actionTypes from '../store/actions'
import Layout from '../../../../../../Layout'

const styles = theme => ({
  container: {
    display: 'flex',
    flexwrap: 'wrap'
  },
  root: {
    flexGrow: 1
  },
  paper: {
    textAlign: 'center',
    color: theme.palette.text.secondary
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
        if (item.child_name === 'Admission Form') {
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
class AdmissionFormAcc extends Component {
  constructor (props) {
    super(props)
    this.state = {
      dropdowns: { session: null,
      fromDate: null,
      toDate: null }
    }
  }
  buttonHandler = (e) => {
    this.props.history.push({
      pathname: '/finance/customizedAdmissionForm'
    })
  }
  handleGetButton = (e) => {
    this.props.getAdmissionRecords(this.props.user, this.props.alert, this.state.dropdowns.session, this.state.dropdowns.fromDate, this.state.dropdowns.toDate)
  }

  dropDownHandler= (event, name) => {
    console.log('student detail handler', event, name)
    const newstate = { ...this.state.dropdowns }
    console.log(event.value)
    switch (name) {
      case 'session': {
        newstate['session'] = event.value
        break
      }
      default: {

      }
    }
    this.setState({
      dropdowns: newstate
    })
  }
  InputHandler= (event) => {
    const newstate = { ...this.state.dropdowns }
    switch (event.target.name) {
      case 'fromDate': {
        newstate['fromDate'] = event.target.value
        break
      }
      case 'toDate': {
        newstate['toDate'] = event.target.value
        break
      }
      default: {

      }
    }
    this.setState({
      dropdowns: newstate
    })
  }
  editButtonHandler = (event, data) => {
    console.log(data)
    if (data.student_registered) {
      this.props.history.push({
        pathname: '/admissions/UpdateRegistrationForm/',
        studentInformationForAdmission: data
      })
    } else {
      this.props.history.push({
        pathname: '/admissions/UpdateRegistrationForm/'
      })
    }
  }

  render () {
    console.log('rendered')
    let admissionTable = null
    if (this.props.admissionrecords.length > 0) {
    admissionTable = (
      <div>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>SNo</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Gender</TableCell>
              <TableCell>Class</TableCell>
              <TableCell>Admission No</TableCell>
              <TableCell>Admission Date</TableCell>
              <TableCell>Edit</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {this.props.admissionrecords.map((row, i) => {
              return (
                <TableRow>
                  <TableCell>{ i }</TableCell>
                  <TableCell>{row.student_registered && row.student_registered.name ? row.student_registered.name : '-' }</TableCell>
                  <TableCell>{row.student_registered && row.student_registered.gender ? row.student_registered.gender : '-'}</TableCell>
                  <TableCell>{row.student_registered && row.student_registered.grade ? row.student_registered.grade : '-'}</TableCell>
                  <TableCell>{row.student_registered && row.student_registered.admission_number ? row.student_registered.admission_number : '-'}</TableCell>
                  <TableCell>{row.student_registered && row.admission_date ? row.admission_date : '-'}</TableCell>
                  <TableCell><Button onClick={(e) => { this.editButtonHandler(e, row) }}>EDIT</Button></TableCell>
                  {/* <TableCell>
                    <input
                      name='concession'
                      type='number'
                      className='form-control'
                      value={this.state.concessionRequestAmount}
                      onChange={(e) => { this.concessionAmountHandler(e, row.balance) }} />
                  </TableCell> */}
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </div>
    )
                    }
                    // else if (this.props.admissionrecords.length === 0) {
                    //   admissionTable = (
                    //     <h3>            No Records Found</h3>
                    //   )
                    // }
    const classes = styles
    return (
      <Layout>
      <React.Fragment>
        <div className={classes.root}>
          <Grid container spacing={3}>
            <Grid container spacing={3} >
              <Grid item xs={9} />
              <Grid item xs={3}>
                <div style={{ marginTop: '25px', marginLeft: '30px' }}>
                  <Button variant='contained' color='primary' open={<CustomizedAdmissionFormAcc />} onClick={this.buttonHandler}>Create New
                  </Button>
                </div>
              </Grid>
            </Grid>
            <Grid container spacing={3}>
              <Grid item xs={3} style={{ marginLeft: '20px', marginRight: '10px' }}>
                <label>Academic Year*</label>
                <div style={{ marginTop: '15px' }}>
                  <Select
                    placeholder='Select Year'
                  // value={this.state.sessionData ? this.state.sessionData : null}
                    name='session'
                    options={
                    this.props.session
                      ? this.props.session.session_year.map(session => ({
                        value: session,
                        label: session
                      }))
                      : []
                  }
                    onChange={(e) => { this.dropDownHandler(e, 'session') }}
                />
                </div>
              </Grid>
              {/* <Grid item xs={3}>
                <label>Select</label>
                <Select
                  placeholder='Select'
                  options={[
                    { value: 'Today', label: 'Today' },
                    { value: 'Last 7 Days', label: 'Last 7 Days' },
                    { value: 'Last 30 Days', label: 'Last 30 Days' },
                    { value: 'Till Date', label: 'Till Date' }
                  ]}
                />
              </Grid> */}
              <Grid item xs={2} style={{ marginLeft: '15px' }}>
                <label>From Date:</label>
                <TextField
                  type='date'
                  margin='dense'
                  fullWidth
                  required
                  onChange={this.InputHandler}
                  variant='outlined'
                  name='fromDate' />
              </Grid>
              <Grid item xs={2} style={{ marginLeft: '15px' }}>
                <label>To Date:</label>
                <TextField
                  type='date'
                  margin='dense'
                  fullWidth
                  required
                  onChange={this.InputHandler}
                  variant='outlined'
                  name='toDate' />
              </Grid>
              <Grid item xs={4}>
                <div style={{ marginTop: '32px', marginLeft: '15px' }}>
                  <Button variant='contained' disabled={!this.state.dropdowns.toDate} onClick={this.handleGetButton} color='primary'>GET
                  </Button>
                </div>
              </Grid>
            </Grid>
          </Grid>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <div>
                {admissionTable}
              </div>
            </Grid>
          </Grid>
        </div>
      </React.Fragment>
      </Layout>
    )
  }
}
const mapStateToProps = state => ({
  user: state.authentication.user,
  session: state.academicSession.items,
  admissionrecords: state.finance.accountantReducer.admissionForm.admissionrecords
})
const mapDispatchToProps = dispatch => ({
  loadSession: dispatch(apiActions.listAcademicSessions(moduleId)),
  getAdmissionRecords: (user, alert, session, fromDate, toDate) => dispatch(actionTypes.getAdmissionRecords({ user, alert, session, fromDate, toDate }))
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(withRouter(AdmissionFormAcc)))
