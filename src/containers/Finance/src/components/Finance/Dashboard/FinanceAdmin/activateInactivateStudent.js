import React, { Component } from 'react'
import { connect } from 'react-redux'
import Select from 'react-select'
import PropTypes from 'prop-types'
import { withStyles, Button, TextField } from '@material-ui/core'
import Grid from '@material-ui/core/Grid'
import Table from '@material-ui/core/Table'
import TableCell from '@material-ui/core/TableCell'
import TableHead from '@material-ui/core/TableHead'
import TableRow from '@material-ui/core/TableRow'
import Tabs from '@material-ui/core/Tabs'
import AppBar from '@material-ui/core/AppBar'
import Tab from '@material-ui/core/Tab'
import TableBody from '@material-ui/core/TableBody'
// import Switch from '@material-ui/core/Switch'
import Typography from '@material-ui/core/Typography'
import { withRouter } from 'react-router-dom'
import { apiActions } from '../../../../_actions'
import * as actionTypes from '../../store/actions'
import Modal from '../../../../ui/Modal/modal'
import CircularProgress from '../../../../ui/CircularProgress/circularProgress'
import Layout from 'containers/Layout'

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
  },
  spacing: {
    marginLeft: '20px',
    marginRight: '10px',
    marginTop: '5px',
    marginBottom: '10px'
  },
  modalDeletebutton: {
    bottom: '5px',
    right: '10px',
    backgroundColor: '#cc0000',
    display: 'inlineBlock',
    position: 'absolute'
  },
  modalRemainbutton: {
    bottom: '5px',
    left: '10px',
    backgroundColor: '#009900',
    display: 'inlineBlock',
    position: 'absolute'
  }
})

function TabContainer (props) {
  return (
    <Typography component='div' style={{ padding: 8 * 3 }}>
      {props.children}
    </Typography>
  )
}
TabContainer.propTypes = {
  children: PropTypes.node.isRequired
}
class ActivateInactivateStudentAdm extends Component {
  constructor (props) {
    super(props)
    this.state = {
      session: null,
      activeInactive: {
        academicyear: '2019-20'
      },
      updaterow: null,
      remark: null,
      value: 'one'
    }
  }
  componentWillReceiveProps (nextProps) {
    console.log(nextProps)
  }
  componentDidMount () {
    this.props.getActiveRequest('2019-20', this.props.user, this.props.alert)
    console.log(this.props.session)
    console.log(this.props.activeRequstList)
  }
  handleChange = (event, value) => {
    this.setState({ value })
  }
  approveRequestHandler= () => {
    console.log(this.state.updaterow)
    this.setState({ showAcceptModal: false })
    this.setState({ showRejectModal: false })
    const body = {
      request_id: this.state.updaterow.id,
      status: 'Approved',
      remark: this.state.remark
    }
    this.props.approveRequest(body, this.props.user, this.props.alert)
    this.setState({ updaterow: '' })
  }
  rejectRequestHandler= () => {
    this.setState({ showAcceptModal: false })
    this.setState({ showRejectModal: false })
    const body = {
      request_id: this.state.updaterow.id,
      status: 'Rejected',
      remark: this.state.remark
    }
    this.props.approveRequest(body, this.props.user, this.props.alert)
    this.setState({ updaterow: '' })
  }
  handleSwitch = (event, data) => {
    // console.log('switch state', e.target.checked)
    console.log('switch is pressed', event)
    console.log('MAKE API CALL', data)
  }
  showInfoModalAcceptHandler = (event, data) => {
    this.setState({ showAcceptModal: true })
    console.log(data)
    this.setState({ updaterow: data })
    console.log(this.state.updaterow)
  }
  showInfoModalRejectHandler = (event, data) => {
    this.setState({ showRejectModal: true })
    console.log(data)
    this.setState({ updaterow: data })
    console.log(this.state.updaterow)
  }
  hideInfoModalHandler= () => {
    this.setState({ showAcceptModal: false })
    this.setState({ showRejectModal: false })
  }
  remarkInputHandler= (event) => {
    this.setState({
      remark: event.target.value
    })
  }
  activeInactiveDropdonHandler= (event, name) => {
    console.log('activeInactive detail handler', event, name)
    const newActiveInactive = { ...this.state.activeInactive }
    console.log(event.value)
    switch (name) {
      case 'academicyear': {
        newActiveInactive['academicyear'] = event.value
        break
      }
      default: {

      }
    }
    this.setState({
      activeInactive: newActiveInactive
    }, () => {
      if (name === 'academicyear') {
        this.props.getActiveRequest(this.state.activeInactive.academicyear, this.props.user, this.props.alert)
      }
    })
  }
  render () {
    const { classes } = this.props
    let acceptModal = null
    if (this.state.showAcceptModal) {
      acceptModal = (
        <Modal open={this.state.showAcceptModal} click={this.hideInfoModalHandler} small>
          <React.Fragment>
            <Grid container spacing={3}>
              <Grid item xs={12} className={classes.spacing}>
                <label>Add Remark</label>
                <TextField
                  type='text'
                  margin='dense'
                  fullWidth
                  required
                  // value={this.state.studentParentDetails.fatherphone}
                  onChange={this.remarkInputHandler}
                  variant='outlined'
                  name='certificateName' />
              </Grid>
            </Grid>
          </React.Fragment>
          <div className={classes.modalRemainbutton}>
            <Button primary style={{ color: '#fff' }} disabled={!this.state.remark} onClick={this.approveRequestHandler}>Save</Button>
          </div>
          <div className={classes.modalDeletebutton}>
            <Button primary style={{ color: '#fff' }} onClick={this.hideInfoModalHandler}>Go Back</Button>
          </div>
        </Modal>
      )
    }
    let rejectModal = null
    if (this.state.showRejectModal) {
      rejectModal = (
        <Modal open={this.state.showRejectModal} click={this.hideInfoModalHandler} small>
          <React.Fragment>
            <Grid container spacing={3}>
              <Grid item xs={12} className={classes.spacing}>
                <label>Add Remark</label>
                <TextField
                  type='text'
                  margin='dense'
                  fullWidth
                  required
                  // value={this.state.studentParentDetails.fatherphone}
                  onChange={this.remarkInputHandler}
                  variant='outlined'
                  name='certificateName' />
              </Grid>
            </Grid>
          </React.Fragment>
          <div className={classes.modalRemainbutton}>
            <Button primary style={{ color: '#fff' }} disabled={!this.state.remark} onClick={this.rejectRequestHandler}>Save</Button>
          </div>
          <div className={classes.modalDeletebutton}>
            <Button primary style={{ color: '#fff' }} onClick={this.hideInfoModalHandler}>Go Back</Button>
          </div>
        </Modal>
      )
    }
    const { value } = this.state
    let studentTableInActive = null
    if (this.props.activeRequstList.inactive.length > 0) {
      studentTableInActive = (
        <div style={{ overflowX: 'auto' }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Student Name</TableCell>
                <TableCell>Enrollment Code</TableCell>
                <TableCell>Admission Number</TableCell>
                <TableCell>Branch</TableCell>
                <TableCell>Class</TableCell>
                <TableCell>Request Sent By</TableCell>
                <TableCell>Request Sent Date</TableCell>
                <TableCell>Balance</TableCell>
                <TableCell>Paid Amount</TableCell>
                <TableCell>Remark</TableCell>
                <TableCell>Gender</TableCell>
                <TableCell>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {this.props.activeRequstList.inactive.map((row, i) => {
                return (
                  <TableRow>
                    <TableCell>{row.student.name ? row.student.name : '-'}</TableCell>
                    <TableCell>{row.student.erp ? row.student.erp : '-'}</TableCell>
                    <TableCell>{row.student.admission_number ? row.student.admission_number : '-'}</TableCell>
                    <TableCell>{row.academic_year.branch.branch_name ? row.academic_year.branch.branch_name : '-'}</TableCell>
                    <TableCell>{row.student.acad_branch_mapping.grade.grade ? row.student.acad_branch_mapping.grade.grade : '-'}</TableCell>
                    <TableCell>{row.request_by.first_name ? row.request_by.first_name : '-'}</TableCell>
                    <TableCell>{row.request_date ? row.request_date : '-'}</TableCell>
                    <TableCell>{row.balance ? row.balance : '-'}</TableCell>
                    <TableCell>{row.amout_paid ? row.amout_paid : '-'}</TableCell>
                    <TableCell>{row.request_remarks ? row.request_remarks : '-'}</TableCell>
                    {/* <TableCell>{row.student.date_of_birth ? row.student.date_of_birth : '-'}</TableCell> */}
                    {/* <TableCell>{row.request_date ? row.request_date : '-'}</TableCell> */}
                    <TableCell>{row.student.gender ? row.student.gender : '-'}</TableCell>
                    {/* <TableCell>{row.student.roll_no ? row.student.roll_no : '-'}</TableCell> */}
                    <TableCell><Button color='primary' onClick={(e) => { this.showInfoModalAcceptHandler(e, row) }}>Approve</Button><Button color='primary' onClick={(e) => { this.showInfoModalRejectHandler(e, row) }}>Reject</Button></TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </div>
      )
    } else {
      studentTableInActive = (<h1>No Records Found</h1>)
    }
    let studentTableActive = null
    if (this.props.activeRequstList.reactive.length > 0) {
      studentTableActive = (
        <div style={{ overflowX: 'auto' }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Student Name</TableCell>
                <TableCell>Enrollment Code</TableCell>
                <TableCell>Admission Number</TableCell>
                <TableCell>Branch</TableCell>
                <TableCell>Class</TableCell>
                <TableCell>Request Sent By</TableCell>
                <TableCell>Request Sent Date</TableCell>
                <TableCell>Balance</TableCell>
                <TableCell>Paid Amount</TableCell>
                <TableCell>Remark</TableCell>
                <TableCell>Gender</TableCell>
                <TableCell>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {this.props.activeRequstList.reactive.map((row, i) => {
                return (
                  <TableRow>
                    <TableCell>{row.student.name ? row.student.name : '-'}</TableCell>
                    <TableCell>{row.student.erp ? row.student.erp : '-'}</TableCell>
                    <TableCell>{row.student.admission_number ? row.student.admission_number : '-'}</TableCell>
                    <TableCell>{row.academic_year.branch.branch_name ? row.academic_year.branch.branch_name : '-'}</TableCell>
                    <TableCell>{row.student.acad_branch_mapping.grade.grade ? row.student.acad_branch_mapping.grade.grade : '-'}</TableCell>
                    <TableCell>{row.request_by.first_name ? row.request_by.first_name : '-'}</TableCell>
                    <TableCell>{row.request_date ? row.request_date : '-'}</TableCell>
                    <TableCell>{row.balance ? row.balance : '-'}</TableCell>
                    <TableCell>{row.amout_paid ? row.amout_paid : '-'}</TableCell>
                    <TableCell>{row.request_remarks ? row.request_remarks : '-'}</TableCell>
                    <TableCell>{row.student.gender ? row.student.gender : '-'}</TableCell>
                    <TableCell><Button color='primary' onClick={(e) => { this.showInfoModalAcceptHandler(e, row) }}>Approve</Button><Button color='primary' onClick={(e) => { this.showInfoModalRejectHandler(e, row) }}>Reject</Button></TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </div>
      )
    } else {
      studentTableActive = (<h1>No Records Found</h1>)
    }
    return (
      <Layout>
      <React.Fragment>
        <div>
          <Grid container spacing={3}>
            <Grid item xs={3} className={classes.spacing}>
              <label>Academic Year</label>
              <Select
                placeholder='Select Year'
                defaultValue={{ label: '2019-20', value: '2019-20' }}
                name='academicyear'
                options={
                  this.props.session
                    ? this.props.session.session_year.map(session => ({
                      value: session,
                      label: session
                    }))
                    : []
                }
                onChange={(e) => { this.activeInactiveDropdonHandler(e, 'academicyear') }}
              />
            </Grid>
            {this.props.dataLoading ? <CircularProgress open /> : null}
          </Grid>
          <AppBar position='static'>
            <Tabs value={value} onChange={this.handleChange}>
              <Tab value='one' label='Reactive Request' />
              <Tab value='two' label='Inactive Request' />
            </Tabs>
          </AppBar>
          {value === 'one' && <TabContainer>
            {studentTableActive}
          </TabContainer>}
          {value === 'two' && <TabContainer>
            {studentTableInActive}
          </TabContainer>}
        </div>
        {acceptModal}
        {rejectModal}
      </React.Fragment>
      </Layout>
    )
  }
}
const mapStateToProps = state => ({
  user: state.authentication.user,
  session: state.academicSession.items,
  activeRequstList: state.finance.financeAdminDashBoard.activeRequstList,
  dataLoading: state.finance.common.dataLoader
})
const mapDispatchToProps = dispatch => ({
  loadSession: dispatch(apiActions.listAcademicSessions()),
  getActiveRequest: (sessionYear, user, alert) => dispatch(actionTypes.getActiveRequest({ sessionYear, user, alert })),
  approveRequest: (data, user, alert) => dispatch(actionTypes.approveRequest({ data, user, alert }))
})
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(withRouter(ActivateInactivateStudentAdm)))
