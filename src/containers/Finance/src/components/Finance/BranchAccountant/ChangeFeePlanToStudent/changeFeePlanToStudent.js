import React, { Component } from 'react'
import PropTypes from 'prop-types'
// import { Grid } from 'semantic-ui-react'
// import { withStyles, Table, TableBody, TableCell, TableHead, TableRow, Button, Divider } from '@material-ui/core/'
import { withStyles, Button, Grid, Fab, Tab, Tabs, AppBar, Typography } from '@material-ui/core/'
// import { Edit } from '@material-ui/icons'
import { Edit } from '@material-ui/icons'
import ReactTable from 'react-table'
import 'react-table/react-table.css'
import { withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import Select from 'react-select'
import Modal from '../../../../ui/Modal/modal'
import * as actionTypes from '../../store/actions'
import { apiActions } from '../../../../_actions'
import CircularProgress from '../../../../ui/CircularProgress/circularProgress'
// import { FilterInnerComponent, filterMethod } from '../../FilterInnerComponent/filterInnerComponent'
import AdjustFeeType from './adjustFeeType.js'

const styles = theme => ({
  tableWrapper: {
    overflowX: 'auto',
    marginBottom: 12,
    borderRadius: 4
  }
})

let feePlanState = null
function TabContainer ({ children, dir }) {
  return (
    <Typography component='div' dir={dir} style={{ padding: 8 * 3 }}>
      {children}
    </Typography>
  )
}

TabContainer.propTypes = {
  children: PropTypes.node.isRequired
}
class ChangeFeePlanToStudent extends Component {
  constructor (props) {
    super(props)
    this.state = {
      gradeData: null,
      gradeId: null,
      sectionData: [],
      sectionId: [],
      studentType: null,
      studentList: null,
      editModal: false,
      studentEditId: null,
      feePlans: null,
      changedFeePlanId: null,
      erpCode: null,
      isChecked: {},
      session: null,
      sessionData: null,
      checkedAll: false,
      showInstaDetails: false,
      showFeeModal: false,
      filterValue: '',
      showTabs: false,
      value: 'one'
    }
  }

  componentDidMount () {
    if (feePlanState) {
      this.setState(feePlanState)
    }
  }

  componentDidUpdate () {
    // console.log('checked statuss: ', this.state.isChecked)
  }

  handleAcademicyear = (e) => {
    console.log('acad years', this.props.session)
    this.setState({ session: e.value, gradeData: null, gradeId: null, sessionData: e, showTabs: false }, () => {
      this.props.fetchAllGrades(this.state.session, this.props.alert, this.props.user)
    })
  }

  gradeHandler = (e) => {
    console.log(e.value)
    this.setState({ gradeId: e.value, gradeData: e, showTabs: false }, () => {
      this.props.fetchAllSections(this.state.session, this.state.gradeId, this.props.alert, this.props.user)
    })
  }

  sectionHandler = (e) => {
    let sectionIds = []
    e.forEach(section => {
      sectionIds.push(section.value)
    })
    this.setState({ sectionId: sectionIds, sectionData: e, showTabs: false })
  }

  studentTypeHandler = (e) => {
    this.setState({
      studentType: e.label,
      showTabs: false
    })
  }

  studentList = () => {
    console.log('sections--------------', this.state.sectionId)
    this.setState({
      showTabs: true
    }, () => {
      if (this.state.session && this.state.gradeId && this.state.sectionId && this.state.studentType) {
        this.props.fetchAllPlans(this.state.session, this.state.gradeId, this.state.sectionId, this.state.studentType, this.props.alert, this.props.user)
        this.props.fetchAllFeePlans(this.state.session, this.state.gradeId, this.props.alert, this.props.user)
        feePlanState = this.state
      } else {
        this.props.alert.warning('Fill all the Fields!')
      }
    })
  }

  showEditModalHandler = (studentId, erp) => {
    this.setState({ editModal: true, studentEditId: studentId, erpCode: erp })
  }

  hideEditModalHandler = () => {
    this.setState({ editModal: false, studentEditId: null })
  }

  feePlansHandler = (e) => {
    this.setState({ changedFeePlanId: e.value })
  }

  showInstaDetailsHandler = () => {
    this.setState({
      showInstaDetails: true
    }, () => {
      if (this.state.changedFeePlanId) {
        this.props.fetchInstallDetails(this.state.changedFeePlanId, this.props.alert, this.props.user)
      }
    })
  }

  hideInstaDetailsHandler = () => {
    this.setState({
      showInstaDetails: false
    })
  }

  saveChangeHandler = () => {
    let data = {
      fee_plan_name: this.state.changedFeePlanId,
      erp_code: [this.state.erpCode],
      academic_year: this.state.session
    }
    this.props.editStudentFeePlan(data, this.state.studentEditId, this.props.alert, this.props.user)
    this.hideEditModalHandler()
  }

  checkBoxHandler = (e, id) => {
    let { isChecked } = this.state
    // check if the check box is checked or unchecked
    if (e.target.checked) {
      // add the numerical value of the checkbox to options array
      this.setState({ isChecked: { ...isChecked, [id]: true } })
    } else {
      // or remove the value from the unchecked checkbox from the array
      this.setState({ isChecked: { ...isChecked, [id]: false }, checkedAll: false })
    }
  }

  checkAllStudentsHandler = (e) => {
    let { isChecked } = this.state
    const checked = {}
    if (this.props.studentList && this.props.studentList.length > 0) {
      this.props.studentList.forEach(ele => {
        checked[ele.id] = e.target.checked
      })
      this.setState({
        isChecked: checked,
        checkedAll: !this.state.checkedAll
      }, () => {
        console.log(isChecked)
      })
    }
  }

  renderFeePlanTable = () => {
    let dataToShow = []
    dataToShow = this.props.studentList.map((val, i) => {
      return {
        id: val.id,
        check: <input
          type='checkbox'
          name='checking'
          value={i + 1}
          checked={this.state.isChecked[val.id]}
          onChange={
            (e) => { this.checkBoxHandler(e, val.id) }
          } />,
        studentName: val.student.name ? val.student.name : '',
        erpCode: val.student.erp ? val.student.erp : '',
        currentFeePlan: val.fee_plan_name && val.fee_plan_name.fee_plan_name ? val.fee_plan_name.fee_plan_name : 'No Fee Plan',
        total: val.total ? val.total : '',
        Edit: <Fab size='small' color='primary' style={{ marginBottom: '30px' }} onClick={() => this.showEditModalHandler(val.id, val.student && val.student.erp)}>
          <Edit style={{ cursor: 'pointer' }} />
        </Fab>,
        status: <p style={{ overflowX: 'scroll' }}>{val.fee_plan_name && val.fee_plan_name.status}</p>
      }
    })
    return dataToShow
  }

  renderInstaTable = () => {
    let dataToShow = []
    dataToShow = this.props.instaDetails.map((val, i) => {
      return {
        instaName: val.installment_name ? val.installment_name : 'N/A',
        instaAmount: val.installment_amount ? val.installment_amount : 'N/A',
        dueDate: val.due_date ? val.due_date : '',
        feeAccount: val.fee_account && val.fee_account.fee_account_name ? val.fee_account.fee_account_name : 'N/A',
        feeType: val.fee_type && val.fee_type.fee_type_name ? val.fee_type.fee_type_name : 'N/A'
      }
    })
    return dataToShow
  }

  assignAutomatic = () => {
    this.props.assignAtmtStudents(this.state.session, this.state.gradeId, this.state.sectionId, this.state.studentType, this.props.alert, this.props.user)
  }

  showAdjustFeeHandler = () => {
    this.setState({
      showFeeModal: !this.state.showFeeModal
    }, () => {
      // fetch call
      this.props.fetchAdjustFee(320, this.state.changedFeePlanId, this.props.alert, this.props.user)
    })
  }

  // filterFeePlan = (e) => {
  //   console.log('event from search: ', e)
  //   this.props.filterCurrentFeePlan(e.target.value)
  // }

  handleChange = (event, value) => {
    this.setState({ value })
  }

  saveMultiChangeHandler = () => {
    let rowId = []
    Object.keys(this.state.isChecked).forEach((key) => {
      if (this.state.isChecked[key]) {
        rowId.push(key)
      }
    })

    let finalitems = []
    finalitems = this.props.studentList.filter(item => rowId.includes(item.id + ''))

    let erpArr = []
    finalitems.forEach(ele => {
      erpArr.push(ele.student.erp)
    })
    console.log('the erpArrrr', erpArr)

    let data = {
      fee_plan_name: this.state.changedFeePlanId,
      erp_code: erpArr,
      academic_year: this.state.session
    }
    this.props.editStudentFeePlan(data, this.state.studentEditId, this.props.alert, this.props.user)
  }

  render () {
    // console.log('Usman: ', this.props.instaDetails)
    let { classes } = this.props
    let changeModal = null
    let tabBar = null
    const { showTabs, value } = this.state
    if (showTabs) {
      tabBar = (
        <React.Fragment>
          <AppBar position='static' style={{ zIndex: 0 }}>
            <Tabs value={value} onChange={this.handleChange} variant='scrollable' scrollButtons='auto'>
              <Tab value='one' label='Change/Assign Fee Plan' />
              <Tab value='two' label='Adjust Fee Types' />
            </Tabs>
          </AppBar>
        </React.Fragment>
      )
    }
    if (this.state.editModal) {
      changeModal = (
        <Modal open={this.state.editModal} click={this.hideEditModalHandler}>
          <h3 className={classes.modal__heading}>Change the Fee Plan</h3>
          <hr />
          {this.state.studentEditId
            ? <div style={{ marginLeft: '20px' }}>
              <Grid container spacing={3} style={{ padding: 15 }}>
                <Grid item xs='3'>
                  <label>Fee Plans*</label>
                  <Select
                    placeholder='Select Fee Plan'
                    // value={this.state.changed}
                    options={
                      this.props.feePlans
                        ? this.props.feePlans.map(fp => ({
                          value: fp.id,
                          label: fp.fee_plan_name
                        }))
                        : []
                    }
                    onChange={this.feePlansHandler}
                  />
                </Grid>
                <Grid item xs='3'>
                  <Button
                    style={{ marginTop: '20px' }}
                    variant='contained'
                    color='primary'
                    onClick={this.saveChangeHandler}>
                      Save
                  </Button>
                </Grid>
              </Grid>
            </div>
            : null
          }
        </Modal>
      )
    }

    // let adjustFeeModal = null
    // if (this.state.showFeeModal) {
    //   adjustFeeModal = (
    //     <Modal open={this.state.showFeeModal} click={this.showAdjustFeeHandler}>
    //       <h3 className={classes.modal__heading}>Change the Fee Plan</h3>
    //       <hr />
    //       <p>hi adjust the amount</p>
    //     </Modal>
    //   )
    // }

    let installInfo = null
    if (this.state.showInstaDetails) {
      changeModal = (
        <Modal open={this.state.showInstaDetails} click={this.hideInstaDetailsHandler}>
          <h3 className={classes.modal__heading}>Installment Details</h3>
          <hr />
          <ReactTable
            // pages={Math.ceil(this.props.viewBanksList.count / 20)}
            data={this.renderInstaTable()}
            manual
            columns={[
              {
                Header: 'Installment Name',
                accessor: 'instaName',
                inputFilterable: true,
                exactFilterable: true,
                sortable: true
              },
              {
                Header: 'Installment Amount',
                accessor: 'instaAmount',
                inputFilterable: true,
                exactFilterable: true,
                sortable: true
              },
              {
                Header: 'Due Date',
                accessor: 'dueDate',
                inputFilterable: true,
                exactFilterable: true,
                sortable: true
              },
              {
                Header: 'Fee Account',
                accessor: 'feeAccount',
                inputFilterable: true,
                exactFilterable: true,
                sortable: true
              },
              {
                Header: 'Fee Type',
                accessor: 'feeType',
                inputFilterable: true,
                exactFilterable: true,
                sortable: true
              }
            ]}
            filterable
            sortable
            defaultPageSize={4}
            showPageSizeOptions={false}
            className='-striped -highlight'
            // Controlled props
            // page={this.state.page}
            // Callbacks
            // onPageChange={page => this.pageChangeHandler(page)}
          />
        </Modal>
      )
    }
    let feePlanTable = null
    let multiChange = null
    let checkedAll = null
    if (this.props.studentList.length > 0) {
      checkedAll = (
        <div style={{ padding: '20px' }}>
          <input
            type='checkbox'
            style={{ width: '20px', height: '20px', paddingBottom: '25px' }}
            checked={this.state.checkedAll ? this.state.checkedAll : false}
            onChange={this.checkAllStudentsHandler}
          /> &nbsp; <b>Select All Students</b>
        </div>
      )
      feePlanTable = (<ReactTable
        // pages={Math.ceil(this.props.viewBanksList.count / 20)}
        data={this.renderFeePlanTable()}
        // manual
        columns={[
          {
            Header: 'Select',
            accessor: 'check',
            filterable: false,
            sortable: false
          },
          {
            Header: 'Student Name',
            accessor: 'studentName',
            filterable: false,
            sortable: false
          },
          {
            Header: 'ERP Code',
            accessor: 'erpCode',
            filterable: false,
            sortable: false
          },
          {
            Header: 'Current Fee Plan',
            accessor: 'currentFeePlan',
            filterable: false,
            sortable: true
          },
          {
            Header: 'Total',
            accessor: 'total',
            filterable: false,
            sortable: false
          },
          {
            Header: 'Change Fee Plan',
            accessor: 'Edit',
            filterable: false,
            sortable: false
          },
          {
            Header: 'Status',
            accessor: 'status',
            filterable: false,
            sortable: false
          }
        ]}
        filterable
        sortable
        defaultPageSize={20}
        showPageSizeOptions={false}
        className='-striped -highlight'
      />)

      multiChange = (
        <Grid container spacing={3} style={{ padding: 15 }}>
          <Grid item xs='3'>
            <label>Fee Plans*</label>
            <Select
              placeholder='Select Fee Plan'
              style={{ width: '100px' }}
              options={
                this.props.feePlans
                  ? this.props.feePlans.map(fp => ({
                    value: fp.id,
                    label: fp.fee_plan_name
                  }))
                  : []
              }
              onChange={this.feePlansHandler}
            />
          </Grid>
          <Grid item xs='3'>
            <Button
              style={{ marginTop: '25px' }}
              variant='contained'
              color='primary'
              disabled={!this.state.changedFeePlanId}
              onClick={this.showInstaDetailsHandler}>
                View Details
            </Button>
          </Grid>
          {/* <Grid item xs='3'>
            <Button
              style={{ marginTop: '25px' }}
              variant='contained'
              color='primary'
              // disabled={!this.state.changedFeePlanId}
              onClick={this.showAdjustFeeHandler}>
                Adjust Fee type
            </Button>
          </Grid> */}
          <Grid item xs='3'>
            <Button
              style={{ marginTop: '25px' }}
              variant='contained'
              color='primary'
              onClick={this.saveMultiChangeHandler}>
                Save
            </Button>
          </Grid>
        </Grid>
      )
    }
    return (
      <React.Fragment>
        <Grid container spacing={3} style={{ padding: 15 }}>
          <Grid item xs='9' />
          <Grid item xs='3'>
            {this.state.sessionData && this.state.gradeData && this.state.sectionData && this.state.studentType
              ? <Button
                variant='contained'
                color='primary'
                onClick={this.assignAutomatic}
              >
                  Automatic Assign
              </Button>
              : null}
          </Grid>
          <Grid item xs='3'>
            <label>Academic Year*</label>
            <Select
              placeholder='Select Year'
              value={this.state.sessionData ? this.state.sessionData : ''}
              options={
                this.props.session
                  ? this.props.session.session_year.map(session => ({
                    value: session,
                    label: session
                  }))
                  : []
              }
              onChange={this.handleAcademicyear}
            />
          </Grid>
          <Grid item xs='3'>
            <label>Grade*</label>
            <Select
              placeholder='Select Grade'
              value={this.state.gradeData ? this.state.gradeData : ''}
              options={
                this.props.gradeData
                  ? this.props.gradeData.map(grades => ({
                    value: grades.grade.id,
                    label: grades.grade.grade
                  }))
                  : []
              }
              onChange={this.gradeHandler}
            />
          </Grid>
          <Grid item xs='3'>
            <label>Section*</label>
            <Select
              placeholder='Select Section'
              isMulti
              value={this.state.sectionData ? this.state.sectionData : ''}
              options={
                this.props.sectionData
                  ? this.props.sectionData.map(sec => ({
                    value: sec.section.id,
                    label: sec.section.section_name
                  }))
                  : []
              }
              onChange={this.sectionHandler}
            />
          </Grid>
          <Grid item xs='3'>
            <label>Student Type*</label>
            <Select
              placeholder='Select Student Type'
              // value={this.state.sectionData ? this.state.sectionData : ''}
              options={[
                {
                  label: 'Active',
                  value: 1
                },
                {
                  label: 'InActive',
                  value: 2
                },
                {
                  label: 'both',
                  value: 'both'
                }
              ]}
              onChange={this.studentTypeHandler}
            />
          </Grid>
          <Grid item xs='3'>
            <Button
              variant='contained'
              color='primary'
              onClick={this.studentList}>
                GET
            </Button>
          </Grid>
        </Grid>
        {tabBar}
        {showTabs && value === 'one' && <TabContainer>
          {checkedAll}
          {feePlanTable}
          {multiChange}
          {changeModal}
          {installInfo}
          {/* {adjustFeeModal} */}
        </TabContainer>}
        {showTabs && value === 'two' && <TabContainer>
          <AdjustFeeType alert={this.props.alert}
            session={this.state.session}
            grade={this.state.gradeId}
            section={this.state.sectionId}
            studentList={this.props.studentList}
            normalFeePlan={this.props.feePlans}
            // getData={this.state.getData}
            // erp={erpValue}
            user={this.props.user} />
        </TabContainer>}
        {this.props.dataLoading ? <CircularProgress open /> : null}
      </React.Fragment>
    )
  }
}

const mapStateToProps = state => ({
  user: state.authentication.user,
  session: state.academicSession.items,
  gradeData: state.finance.accountantReducer.changeFeePlan.gradeData,
  sectionData: state.finance.accountantReducer.changeFeePlan.sectionData,
  studentList: state.finance.accountantReducer.changeFeePlan.studentList,
  feePlans: state.finance.accountantReducer.changeFeePlan.feePlans,
  adjustFeeData: state.finance.accountantReducer.changeFeePlan.adjustFeeData,
  dataLoading: state.finance.common.dataLoader,
  instaDetails: state.finance.common.instaDetails
})

const mapDispatchToProps = dispatch => ({
  loadSession: dispatch(apiActions.listAcademicSessions()),
  fetchAllGrades: (session, alert, user) => dispatch(actionTypes.fetchAllGrades({ session, alert, user })),
  fetchAllSections: (session, gradeId, alert, user) => dispatch(actionTypes.fetchAllSections({ session, gradeId, alert, user })),
  fetchAllPlans: (session, gradeId, sectionId, studentType, alert, user) => dispatch(actionTypes.fetchAllPlans({ session, gradeId, sectionId, studentType, alert, user })),
  fetchAllFeePlans: (session, gradeId, alert, user) => dispatch(actionTypes.fetchAllFeePlans({ session, gradeId, alert, user })),
  editStudentFeePlan: (data, studentId, alert, user) => dispatch(actionTypes.editStudentFeePlan({ data, studentId, alert, user })),
  assignAtmtStudents: (session, gradeId, sectionId, studentType, alert, user) => dispatch(actionTypes.assignAutomaticStudent({ session, gradeId, sectionId, studentType, alert, user })),
  fetchInstallDetails: (feePlanId, alert, user) => dispatch(actionTypes.fetchInstallDetails({ feePlanId, alert, user })),
  fetchAdjustFee: (currentFeePlanId, targetFeePlanId, alert, user) => dispatch(actionTypes.fetchAdjustFee({ currentFeePlanId, targetFeePlanId, alert, user })),
  filterCurrentFeePlan: (text) => dispatch(actionTypes.filterCurrentFeePlan({ text }))
})

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(withRouter(ChangeFeePlanToStudent)))
