import React, { Component } from 'react'
import { Button, Fab, Grid, withStyles, Table, TableBody, TableCell, Divider, TableHead, TableRow } from '@material-ui/core/'
import {
  Edit as EditIcon,
  Add as AddIcon,
  Delete as DeleteIcon
} from '@material-ui/icons'
import { withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import Select from 'react-select'
import EditFeePlanName from './editFeePlanName'
// import { RouterButton } from '../../../ui'
// import { urls } from '../../../urls'
import { apiActions } from '../../../_actions'
import EModal from '../../../ui/Modal/modal'
import * as actionTypes from '../store/actions'
import CircularProgress from '../../../ui/CircularProgress/circularProgress'
// import '../../css/staff.css'
import classess from './deleteModal.module.css'

const CreatePlan = {
  label: 'Create Fee Plan',
  color: 'blue',
  href: '/finance/create_feePlan',
  disabled: false
}

const styles = theme => ({
  tableWrapper: {
    overflowX: 'auto'
  }
})

let feePlanState = null

class CreateFeePlan extends Component {
  constructor (props) {
    super(props)
    this.state = {
      showTable: false,
      feeList: [],
      grades: [],
      open: {},
      showEditModal: false,
      feeNameId: null,
      sessionData: [],
      branchData: [],
      showDeleteModal: false,
      gradeid: null,
      typeid: null,
      addGradeModal: false,
      gradeList: [],
      feePlanId: null
    }
  }

  show = index => () => this.setState({ size: 'small', open: { [index]: true } })
  closeAddGradeHandler = () => {
    this.setState({ addGradeModal: false })
    // this.feeList()
  }

  showAddGradeModalHandler = (grade, id) => {
    console.log('-----grades-------', grade)
    console.log('----id--------', id)
    this.setState({
      addGradeModal: true,
      gradeList: grade,
      feePlanId: id
    }, () => {
      const data = this.props.gradeList.filter(grade => {
        let value = true
        this.state.gradeList.map(filteredGrade => {
          if (filteredGrade.id === grade.id) { value = false }
        })
        return value
      })
      console.log('state grades', this.state.gradeList)
      console.log('props grade', this.props.gradeList)
      console.log(data)
    })
  }

  showeditModalHandler = (id) => {
    this.setState({
      showEditModal: true,
      feeNameId: id
    })
  }

  hideModalHandler = () => {
    this.setState({
      showEditModal: false
    })
  }

  // deletion of grades
  deleteModalShowHandler = (gradeid, typeid) => {
    this.setState({
      showDeleteModal: true,
      gradeid: gradeid,
      typeid: typeid
    })
  }

  // deletion of grades
  deleteModalCloseHandler = () => {
    this.setState({
      showDeleteModal: false
    })
  }

  changehandlerbranch = (e) => {
    this.setState({ branchId: e.value, branchData: e })
  }

  handleClickSessionYear = (e) => {
    this.setState({ session: e.value, branchData: [], sessionData: e })
    this.props.fetchBranches(e.value, this.props.alert, this.props.user)
  }

  handlevalue = e => {
    e.preventDefault()
    if (!this.state.session) {
      this.props.alert.warning('Select Academic Year')
      return
    } else if (!this.state.branchId) {
      this.props.alert.warning('Select Branch')
      return
    }
    this.props.fetchListFeePlan(this.state.session, this.state.branchId, this.props.alert, this.props.user)
    this.setState({ showTable: true }, () => {
      feePlanState = this.state
    })
  }

  handlegrade = (typeid) => {
    this.props.updateGrades(this.state.gradeId, typeid, this.props.alert, this.props.user)
    this.closeAddGradeHandler()
  };

  // to delete the grade
  deleteHandler = () => {
    console.log('deletehandler : ' + this.state.gradeid + ',' + this.state.typeid)
    this.props.deleteGrades(this.state.gradeid, this.state.typeid, this.props.alert, this.props.user)
    this.deleteModalCloseHandler()
  }

  gradelistHandler = (e) => {
    this.setState({ gradeId: e.value })
  }

  componentDidMount () {
    if (feePlanState) {
      this.setState(feePlanState)
      return
    }
    this.props.fetchGrades(this.props.alert, this.props.user)
  }

  getBackTheUpdatedDataHandler = (status, data) => {
    console.log('----------UPDATED----------')
    console.log(data)
    console.log('-------before--------')
    console.log(this.state.feeList)
    if (status === 'success') {
      const feeList = [...this.state.feeList]
      const index = feeList.findIndex(ele => {
        return ele.id === data.id
      })
      console.log(index)
      const changeObj = { ...feeList[index] }
      changeObj.id = data.id ? data.id : ''
      changeObj.fee_plan_name = data.fee_plan_name ? data.fee_plan_name : ''
      changeObj.is_dayscholar = !!data.is_dayscholar
      changeObj.is_afternoonbatch = !!data.is_afternoonbatch
      changeObj.is_new_admission = !!data.is_new_admission
      changeObj.is_regular = !!data.is_regular
      changeObj.is_rte = !!data.is_rte
      changeObj.is_specialchild = !!data.is_specialchild
      changeObj.is_this_a_limited_plan = !!data.is_this_a_limited_plan
      changeObj.plan_status = !!data.plan_status

      feeList[index] = { ...changeObj }
      this.setState({
        feeList: [...feeList]
      }, () => {
        console.log('--after-----------')
        console.log(this.state.feeList)
        this.hideModalHandler()
      })
    }
  }

  render () {
    let { classes } = this.props

    let editModal = null
    if (this.state.showEditModal) {
      editModal = (
        <EModal open={this.state.showEditModal} click={this.hideModalHandler}>
          <EditFeePlanName id={this.state.feeNameId} listFeePlan={this.props.listFeePlan} alert={this.props.alert} close={this.hideModalHandler} />
        </EModal>
      )
    }

    let deleteModal = null
    if (this.state.showDeleteModal) {
      deleteModal = (
        <EModal open={this.state.showDeleteModal} click={this.deleteModalCloseHandler} small>
          <h3 className={classess.modal__heading}>Are You Sure?</h3>
          <hr />
          <div className={classess.modal__deletebutton}>
            <Button
              onClick={this.deleteHandler}
              color='secondary'
              variant='contained'
            >
              Delete
            </Button>
          </div>
          <div className={classess.modal__remainbutton}>
            <Button
              color='primary'
              variant='contained'
              onClick={this.deleteModalCloseHandler}
            >
              Go Back
            </Button>
          </div>
        </EModal>
      )
    }

    let addFeePlanGradeModal = null
    if (this.state.addGradeModal) {
      addFeePlanGradeModal = (
        <EModal open={this.state.addGradeModal} click={this.closeAddGradeHandler} medium>
          <Grid container spacing={3} style={{ padding: 25 }}>
            <Grid item xs='12' >
              <h3>Add Grade</h3>
            </Grid>
            <Divider />
            <Grid item xs='5' >
              <label>Grade</label>
              <Select
                placeholder='Select Grade'
                options={
                  this.props.gradeList ? this.props.gradeList.filter(grade => {
                    let value = true
                    this.state.gradeList.map(filteredGrade => {
                      if (filteredGrade.id === grade.id) { value = false }
                    })
                    return value
                  }).map((con, i) => ({ value: con.id, label: con.grade })) : null
                }
                onChange={this.gradelistHandler}
              />
            </Grid>
            <Grid item xs='3'>
              <Button
                color='primary'
                variant='contained'
                style={{ marginTop: '20px' }}
                onClick={() => { this.handlegrade(this.state.feePlanId) }}
              >Add </Button>
            </Grid>
          </Grid>
        </EModal>
      )
    }

    return (
      <React.Fragment>
        <Grid container spacing={3} style={{ padding: 15 }} >
          <Grid item xs={8} />
          <Grid item xs={4} >
            {/* <RouterButton value={CreatePlan} /> */}
          </Grid>
        </Grid>
        <Grid container spacing={3} style={{ flexGrow: 1, padding: 15 }}>
          <Grid item xs={3}>
            <label>Academic Year*</label>
            <Select
              placeholder='Select Academic Year'
              value={this.state.sessionData}
              options={
                this.props.session
                  ? this.props.session.session_year.map((session) => ({
                    value: session,
                    label: session }))
                  : []
              }
              onChange={this.handleClickSessionYear}
            />
          </Grid>
          <Grid item xs={3}>
            <label>Branch*</label>
            <Select
              placeholder='Select Branch'
              value={this.state.branchData}
              options={
                this.props.branches.length
                  ? this.props.branches.map(branch => ({
                    value: branch.branch ? branch.branch.id : '',
                    label: branch.branch ? branch.branch.branch_name : ''
                  }))
                  : []
              }
              onChange={this.changehandlerbranch}
            />
          </Grid>
          <Grid item xs={3}>
            <Button
              color='primary'
              variant='contained'
              onClick={this.handlevalue}
              style={{ marginTop: 20 }}
            >Show Fee Plan</Button>
          </Grid>
        </Grid>
        <Grid container spacing={3} style={{ padding: 10 }}>
          <Grid item xs='12'>
            {this.state.showTable
              ? <React.Fragment>
                <div className={classes.tableWrapper}>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Sr.</TableCell>
                        <TableCell>Fee Plan Name</TableCell>
                        <TableCell>Classes</TableCell>
                        <TableCell>Fee Types</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {this.props.listFeePlan ? this.props.listFeePlan.map((row, index) => {
                        return (
                          <React.Fragment>
                            <TableRow hover >
                              <TableCell>{++index}</TableCell>
                              <TableCell>{row.fee_plan_name}
                                <div style={{ cursor: 'pointer' }}>
                                  <Fab
                                    color='primary'
                                    size='small'
                                    onClick={() => this.showeditModalHandler(row.id)}
                                  >
                                    <EditIcon />
                                  </Fab>
                                </div>
                              </TableCell>
                              <TableCell>
                                <Table>
                                  <TableHead>
                                    <TableRow>
                                      <TableCell>
                                        <div style={{ cursor: 'pointer' }}>
                                          <Fab
                                            color='primary'
                                            size='small'
                                            onClick={() => { this.showAddGradeModalHandler(row.grades, row.id) }}
                                          >
                                            <AddIcon />
                                          </Fab>
                                        </div>
                                        {/* <Button onClick={this.show(index)} >+</Button> */}
                                      </TableCell>
                                    </TableRow>
                                    <TableRow>
                                      <TableCell>Grade</TableCell>
                                    </TableRow>
                                  </TableHead>
                                  <TableBody>
                                    {row.grades ? row.grades.map((val, index) => {
                                      return (
                                        <React.Fragment>
                                          <TableRow hover >
                                            <TableCell>{val.grade}
                                            </TableCell>
                                            <TableCell>
                                              {/* <Button
                                            icon='delete'
                                            value={{
                                              basic: 'basic'
                                            }}
                                            onClick={this.deleteHandler.bind(this, val.id, row.id)}
                                          /> */}
                                              <Fab
                                                color='primary'
                                                size='small'
                                                onClick={() => { this.deleteModalShowHandler(val.id, row.id) }}
                                              >
                                                <DeleteIcon />
                                              </Fab>
                                            </TableCell>
                                          </TableRow>
                                        </React.Fragment>
                                      )
                                    }) : null}
                                  </TableBody>
                                </Table>
                              </TableCell>
                              <TableCell>
                                {/* <RouterButton
                                  icon='clone'
                                  value={{
                                    basic: 'basic',
                                    href: '/finance/manage_feeType/' + row.id,
                                    label: 'Manage Fee Type'
                                  }}
                                  id={row.id}
                                /> */}
                              </TableCell>
                            </TableRow>
                          </React.Fragment>
                        )
                      }) : null}
                    </TableBody>
                  </Table>
                </div>
              </React.Fragment>
              : null}
          </Grid>
          {this.props.dataLoading ? <CircularProgress open /> : null}
          {editModal}
          {deleteModal}
          {addFeePlanGradeModal}
        </Grid>
      </React.Fragment>
    )
  }
}

const mapStateToProps = state => ({
  user: state.authentication.user,
  session: state.academicSession.items,
  branches: state.finance.common.branchPerSession,
  listFeePlan: state.finance.feePlan.feePlanList,
  gradeList: state.finance.common.gradeList,
  dataLoading: state.finance.common.dataLoader
})

const mapDispatchToProps = dispatch => ({
  loadSession: dispatch(apiActions.listAcademicSessions()),
  fetchBranches: (session, alert, user) => dispatch(actionTypes.fetchBranchPerSession({ session, alert, user })),
  fetchListFeePlan: (session, branch, alert, user) => dispatch(actionTypes.fetchFeePlanList({ session, branch, alert, user })),
  fetchGrades: (alert, user) => dispatch(actionTypes.fetchGradeList({ alert, user })),
  deleteGrades: (gradeId, typeId, alert, user) => dispatch(actionTypes.deleteFeePlanGrades({ gradeId, typeId, alert, user })),
  updateGrades: (gradeId, typeId, alert, user) => dispatch(actionTypes.updateFeePlanGrades({ gradeId, typeId, alert, user }))
})

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(withRouter(CreateFeePlan)))
