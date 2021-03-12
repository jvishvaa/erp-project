/* eslint-disable indent */
import React, { Component } from 'react'
import { connect } from 'react-redux'
// import Select from 'react-select'
import { withStyles } from '@material-ui/core'
import Grid from '@material-ui/core/Grid'
import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableHead from '@material-ui/core/TableHead'
// import Icon from '@material-ui/core/Icon'
import Checkbox from '@material-ui/core/Checkbox'
// import TablePagination from '@material-ui/core/TablePagination'
import TableRow from '@material-ui/core/TableRow'
// import TableSortLabel from '@material-ui/core/TableSortLabel'
// import FilterListIcon from '@material-ui/icons/FilterList'
// import Paper from '@material-ui/core/Paper'
import { withRouter } from 'react-router-dom'
import { apiActions } from '../../../../_actions'
// import CustomizedAdmissionFormAcc from './customizedAdmissionForm'
// import UpdateAdmissionFormAcc from './updateAdmissionForm'
import * as actionTypes from '../store/actions'

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
class UpdateStudentCertiDetailsAcc extends Component {
  constructor (props) {
    super(props)
    this.data = []
    this.state = {
      session: null,
      certificateCheck: [],
      certificates: []
    }
  }
  componentWillReceiveProps (nextProps) {
    console.log('===received props', nextProps.admissionrecordbyerp)
    if (nextProps.admissionrecordbyerp) {
      console.log('this is printed chandan')
      if (this.data.length > 0) {
        console.log('not inserted')
      } else {
      this.data = nextProps.admissionrecordbyerp.student_certificate ? nextProps.admissionrecordbyerp.student_certificate : null
      this.state.certificates = nextProps.admissionrecordbyerp.student_certificate ? nextProps.admissionrecordbyerp.student_certificate : null
      }
    }
  }
  buttonHandler = (e) => {
    console.log(this.props.studentAdmissionCertificates)
  }
  handleGetButton = (e) => {
    this.props.getAdmissionRecords(this.props.user, this.props.alert)
  }
  componentDidMount () {
    this.props.fetchStudentAdmissionCertificates(this.props.user, this.props.alert)
  }
  componentDidUpdate () {
    console.log('DID UPDATED', this.state)
    this.props.getCertificateDetail(this.state.certificates)
  }
  certificateHandler = (event, data) => {
    console.log('certificate check is pressed', event.target.checked, data)
    if (event.target.checked) {
      console.log('push to data')
      this.data.push(data)
      console.log(this.data)
    } else {
      console.log('remove from the array', data.id)
      this.data = this.data.filter(a => {
        console.log(a.id)
        return a.id !== data.id
})
    //   for (let i = 0; i < this.data.length; i++) {
    //     if (this.data[i] === data) {
    //       this.data.splice(i, 1)
    //     }
    //  }
     console.log(this.data)
    }
    console.log(this.data)
    this.setState({ certificates: this.data })
  }
  editButtonHandler = (event, data) => {
    console.log(data)
    this.props.history.push({
      pathname: '/finance/UpdateAdmissionForm',
      studentInformationForAdmission: data
    })
  }

  render () {
    console.log('rendered')
    let certificateTable = null
    if (this.props.studentAdmissionCertificates) {
      certificateTable = (
        <div>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Sl No.</TableCell>
                <TableCell>Name</TableCell>
                <TableCell>Yes/no</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {this.props.studentAdmissionCertificates.map((row, i) => {
              return (
                <TableRow>
                  <TableCell>{ i }</TableCell>
                  <TableCell>{row.certificate_name ? row.certificate_name : '-' }</TableCell>
                  <TableCell> <Checkbox
                    checked={this.state.certificates.map(item => item.id).includes(row.id)}
                    // defaultChecked={this.state.certificates.map(item => item.id).includes(row.id)}
                    onChange={(e) => { this.certificateHandler(e, row) }}
                    // value='this.data[i].id'
                    color='primary'
                    inputProps={{
          'aria-label': 'secondary checkbox'
        }}
      /></TableCell>
                </TableRow>
              )
            })}
            </TableBody>
          </Table>
        </div>
    )
                    }
    const classes = styles
    return (
      <React.Fragment>
        <div className={classes.root}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <div>
                {certificateTable}
              </div>
            </Grid>
          </Grid>
        </div>
      </React.Fragment>
    )
  }
}
const mapStateToProps = state => ({
  user: state.authentication.user,
  session: state.academicSession.items,
  admissionrecords: state.finance.accountantReducer.admissionForm.admissionrecords,
  admissionrecordbyerp: state.finance.accountantReducer.admissionForm.admissionrecordbyerp,
  studentAdmissionCertificates: state.finance.accountantReducer.admissionForm.studentAdmissionCertificates
})
const mapDispatchToProps = dispatch => ({
  loadSession: dispatch(apiActions.listAcademicSessions(moduleId)),
  getAdmissionRecords: (user, alert) => dispatch(actionTypes.getAdmissionRecords({ user, alert })),
  fetchStudentAdmissionCertificates: (user, alert) => dispatch(actionTypes.fetchStudentAdmissionCertificates({ user, alert }))
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(withRouter(UpdateStudentCertiDetailsAcc)))
