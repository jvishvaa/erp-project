import React, { Component } from 'react'
import { Grid, Divider, Icon } from 'semantic-ui-react'
import axios from 'axios'
import Select from 'react-select'
import { Typography, Paper, Button } from '@material-ui/core/'
import { withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import { OmsFilterTable, OmsSelect } from '../../../../ui'
import { apiActions } from '../../../../_actions'
import EditOtherFee from './editOtherFee'
import AddOtherFee from './addOtherFee'
import Modal from '../../../../ui/Modal/modal'
import { urls } from '../../../../urls'
import '../../../css/staff.css'

const otherFee = {
  namespace: 'Other Fee'
}

class OtherFeeType extends Component {
  constructor (props) {
    super(props)
    this.state = {
      showTable: false,
      showModal: false,
      showAddFeeModal: false
    }
  }

  showModalHandler = (id) => {
    this.setState({
      showModal: true,
      id: id
    })
  }

  showAddFeeModalHandler = () => {
    this.setState({
      showAddFeeModal: true
    })
  }

  hideModalHandler = () => {
    this.setState({
      showModal: false,
      showAddFeeModal: false
    })
  }

  changehandlerbranch = (e) => {
    this.setState({ branchId: e.value, branchData: e })
  }

  handleAcademicyear = (e) => {
    console.log(e)
    this.setState({ session: e.value, branchData: [] })
    axios
      .get(urls.MiscFeeClass + '?session_year=' + e.value, {
        headers: {
          Authorization: 'Bearer ' + this.props.user
        }
      })
      .then(res => {
        if (+res.status === 200) {
          // console.log(res.data);
          this.setState({ branchValue: res.data })
        }
      })
      .catch((error) => {
        console.log("Error: Couldn't fetch data from " + urls.MiscFeeClass + 'error' + error)
      })
  }

  handleClickFeeData = (e) => {
    if (!this.state.session) {
      this.props.alert.warning('Select Academic Year')
    } else if (!this.state.branchId) {
      this.props.alert.warning('Select Branch')
    }

    if (this.state.session && this.state.branchId) {
      this.setState({ showTable: true })
    }
    this.renderTable()
  }

  deleteHandler = id => {
    console.log(id)
    var updatedList = urls.Finance + id + '/' + 'deleteotherfee/'
    console.log(updatedList)
    axios
      .delete(updatedList, {
        headers: {
          Authorization: 'Bearer ' + this.props.user
        }
      })
      .then(res => {
        console.log(res)
        this.props.alert.success('Deleted Successfully')
        this.renderTable()
      })
      .catch((error) => {
        // console.log("Error: Couldn't fetch data from " + urls.GRADE)
        this.props.alert.error('Something Went Wrong', error)
      })
  };

  renderTable = () => {
    console.log('renderTable method invoked')
    if (this.state.session && this.state.branchId) {
      axios
        .get(urls.OthersFeeType + '?academic_year=' + this.state.session + '&branch_id=' + this.state.branchId, {
          headers: {
            Authorization: 'Bearer ' + this.props.user
          }
        })
        .then(res => {
          var arr = res['data'].results
          var feelist = []
          var feetable = []
          this.setState({ feeDetails: arr })
          arr.forEach((val, i) => {
            feelist.push({
              Sr: ++i,
              fee_type_name: val.fee_type_name ? val.fee_type_name : '',
              is_multiple_records_allow: val.is_multiple_records_allow ? 'Yes' : 'No',
              individual_student_wise: val.individual_student_wise ? 'Yes' : 'No',
              allow_partial_payments: val.allow_partial_payments ? 'Yes' : 'No',
              can_be_group: val.can_be_group ? 'Yes' : 'No',
              is_allow_remarks: val.is_allow_remarks ? 'Yes' : 'No',
              allow_excess_amount: val.allow_excess_amount ? 'Yes' : 'No',
              is_last_year_due: val.is_last_year_due ? 'Yes' : 'No',
              status: val.status ? 'Active' : 'Inactive',
              Edit: (
                <div onClick={() => this.showModalHandler(val.id)} style={{ cursor: 'pointer' }}>
                  <Button basic>
                    <Button.Content>
                      <Icon name='edit' />
                    </Button.Content>
                  </Button>
                </div>
              ),
              Delete: (
                <Button
                  icon='delete'
                  basic
                  onClick={() => { this.deleteHandler(val.id) }}
                />
              )
            })
          })
          feetable.push(
            {
              name: 'Sr',
              displayName: 'Sr',
              inputFilterable: true,
              exactFilterable: true,
              sortable: true
            },
            {
              name: 'fee_type_name',
              displayName: 'Fee_Type_Name',
              inputFilterable: true,
              exactFilterable: true,
              sortable: true
            },
            {
              name: 'is_multiple_records_allow',
              displayName: 'is_multiple_records_allow',
              inputFilterable: true,
              exactFilterable: true,
              sortable: true
            },
            {
              name: 'individual_student_wise',
              displayName: 'individual_student_wise',
              inputFilterable: true,
              exactFilterable: true,
              sortable: true
            },
            {
              name: 'allow_partial_payments',
              displayName: 'allow_partial_payments',
              inputFilterable: true,
              exactFilterable: true,
              sortable: true
            },
            {
              name: 'can_be_group',
              displayName: 'can_be_group',
              inputFilterable: true,
              exactFilterable: true,
              sortable: true
            },
            {
              name: 'is_allow_remarks',
              displayName: 'is_allow_remarks',
              inputFilterable: true,
              exactFilterable: true,
              sortable: true
            },
            {
              name: 'allow_excess_amount',
              displayName: 'allow_excess_amount',
              inputFilterable: true,
              exactFilterable: true,
              sortable: true
            },
            {
              name: 'is_last_year_due',
              displayName: 'is_last_year_due',
              inputFilterable: true,
              exactFilterable: true,
              sortable: true
            },
            {
              name: 'status',
              displayName: 'status',
              inputFilterable: true,
              exactFilterable: true,
              sortable: true
            },
            {
              name: 'Edit',
              displayName: 'Edit',
              inputFilterable: true,
              exactFilterable: true,
              sortable: true
            },
            {
              name: 'Delete',
              displayName: 'Delete',
              inputFilterable: true,
              exactFilterable: true,
              sortable: true
            }
          )
          this.setState({ data: feelist })
          this.setState({ field: feetable })
        })
        .catch((error) => {
          console.log("Error: Couldn't fetch data from " + urls.NormalFeeType + error)
        })
    }
  }
  componentDidMount () {
    this.renderTable()
  }

  getBackTheUpdatedDataHandler = (status, data) => {
    // console.log("----------UPDATED----------")
    // console.log(data);
    if (status === 'success') {
      const feeList = [...this.state.data]
      const index = feeList.findIndex(ele => {
        return ele.id === data.id
      })
      const changeObj = { ...feeList[index] }
      changeObj.id = data.id ? data.id : ''
      changeObj.fee_type_name = data.fee_type_name ? data.fee_type_name : ''
      changeObj.is_multiple_records_allow = data.is_multiple_records_allow ? 'Yes' : 'No'
      changeObj.individual_student_wise = data.individual_student_wise ? 'Yes' : 'No'
      changeObj.allow_partial_payments = data.allow_partial_payments ? 'Yes' : 'No'
      changeObj.can_be_group = data.can_be_group ? 'Yes' : 'No'
      changeObj.is_allow_remarks = data.is_allow_remarks ? 'Yes' : 'No'
      changeObj.allow_excess_amount = data.allow_excess_amount ? 'Yes' : 'No'
      changeObj.is_last_year_due = data.is_last_year_due ? 'Yes' : 'No'
      changeObj.status = data.status ? 'Active' : 'Inactive'

      feeList[index] = { ...changeObj }
      this.setState({
        data: [...feeList]
      }, () => {
        this.hideModalHandler()
      })
    }
  }

  getBackTheAddedDataHandler = (status, data) => {
    if (status === 'success') {
      const feeList = [...this.state.data]
      const feeData = [...this.state.feeDetails]
      // to push data to the edit page
      feeData.push({
        id: data.id ? data.id : '',
        fee_type_name: data.fee_type_name ? data.fee_type_name : '',
        is_multiple_records_allow: !!data.is_multiple_records_allow,
        individual_student_wise: !!data.individual_student_wise,
        allow_partial_payments: !!data.allow_partial_payments,
        can_be_group: !!data.can_be_group,
        is_allow_remarks: !!data.is_allow_remarks,
        allow_excess_amount: !!data.allow_excess_amount,
        is_last_year_due: !!data.is_last_year_due,
        status: !!data.status
      })
      // to push data in table
      feeList.push({
        Sr: this.state.data.length ? this.state.data.length + 1 : 1,
        id: data.id ? data.id : '',
        fee_type_name: data.fee_type_name ? data.fee_type_name : '',
        is_multiple_records_allow: data.is_multiple_records_allow ? 'Yes' : 'No',
        individual_student_wise: data.individual_student_wise ? 'Yes' : 'No',
        allow_partial_payments: data.allow_partial_payments ? 'Yes' : 'No',
        can_be_group: data.can_be_group ? 'Yes' : 'No',
        is_allow_remarks: data.is_allow_remarks ? 'Yes' : 'No',
        allow_excess_amount: data.allow_excess_amount ? 'Yes' : 'No',
        is_last_year_due: data.is_last_year_due ? 'Yes' : 'No',
        status: data.status ? 'Active' : 'Inactive',
        Edit: (
          <div onClick={() => this.showModalHandler(data.id)} style={{ cursor: 'pointer' }}>
            <Button basic>
              <Button.Content>
                <Icon name='edit' />
              </Button.Content>
            </Button>
          </div>
        ),
        Delete: (
          <Button
            icon='delete'
            basic
            onClick={() => { this.deleteHandler(data.id) }}
          />
        )
      })
      console.log(feeList)
      this.setState({
        data: feeList,
        feeDetails: feeData
      }, () => {
        console.log('--state---------')
        console.log(this.state.feeDetails)
        this.hideModalHandler()
      })
    }
  }

  render () {
    let modal = null
    if (this.state.showModal) {
      modal = (
        <Modal open={this.state.showModal} click={this.hideModalHandler}>
          <EditOtherFee id={this.state.id} feeDetails={this.state.feeDetails} giveData={this.getBackTheUpdatedDataHandler} alert={this.props.alert} close={this.hideModalHandler} />
        </Modal>
      )
    }
    let addFeeModal = null
    if (this.state.showAddFeeModal) {
      addFeeModal = (
        <Modal open={this.state.showAddFeeModal} click={this.hideModalHandler}>
          <AddOtherFee giveData={this.getBackTheAddedDataHandler} alert={this.props.alert} close={this.hideModalHandler} />
        </Modal>
      )
    }
    return (
      <React.Fragment>
        <div style={{ width: '100%', height: 150, backgroundColor: '#720D5D ', padding: 50, color: '#ffffff' }}>
          <Typography variant='h4' style={{ color: '#fff' }}>Fee Type</Typography>
        </div>
        <div className='student-section'>
          <Grid >
            <Grid.Row>
              <Grid.Column computer={16} className='student-addStudent-StudentSection'>
                <Paper style={{ marginTop: -50 }}>
                  <Grid>
                    <Grid.Row>
                      <Grid.Column
                        floated='left'
                        computer={10}
                        mobile={10}
                        tablet={10}
                      >
                        <label className='student-addStudent-segment1-heading'>
                          View Other Fee Type
                        </label>
                      </Grid.Column>
                      <Grid.Column
                        floated='left'
                        computer={5}
                        mobile={5}
                        tablet={5}
                      >
                        <div onClick={this.showAddFeeModalHandler} style={{ cursor: 'pointer' }}>
                          <Button basic>
                            <Button.Content>
                              <Icon name='plus square' /> Add Fee
                            </Button.Content>
                          </Button>
                        </div>
                      </Grid.Column>
                    </Grid.Row>
                    <Divider />

                    <Grid.Row>
                      <Grid.Column
                        computer={5}
                        mobile={16}
                        tablet={4}
                        className='student-section-inputField'
                      >
                        <label>Academic Year*</label>
                        <OmsSelect
                          options={this.props.session ? this.props.session.session_year.map((session) => ({ value: session, label: session })) : null}
                          change={this.handleAcademicyear} />
                      </Grid.Column>
                      <Grid.Column
                        computer={5}
                        mobile={16}
                        tablet={4}
                        className='student-section-inputField'
                      >
                        <label>Branch*</label>
                        <Select
                          placeholder='Select Branch'
                          value={this.state.branchData}
                          options={
                            this.state.branchValue
                              ? this.state.branchValue.map(branch => ({
                                value: branch.branch.id,
                                label: branch.branch.branch_name
                              }))
                              : []
                          }

                          onChange={this.changehandlerbranch}
                        />
                      </Grid.Column>
                      <Grid.Column
                        computer={5}
                        mobile={16}
                        tablet={4}
                        className='student-section-inputField-button'
                      >
                        <Button
                          color='purple'
                          onClick={this.handleClickFeeData}
                        >
                          Get
                        </Button>
                      </Grid.Column>
                    </Grid.Row>

                    {this.state.showTable ? <Grid.Row>
                      <Grid.Column
                        computer={15}
                        mobile={12}
                        tablet={15}
                        className='staff-table1'
                      >
                        <OmsFilterTable
                          filterTableData={otherFee}
                          tableData={this.state.data}
                          tableFields={this.state.field}
                        />
                      </Grid.Column>
                    </Grid.Row> : null}

                  </Grid>
                </Paper>
              </Grid.Column>
            </Grid.Row>
          </Grid>
        </div>
        {modal}
        {addFeeModal}
      </React.Fragment>
    )
  }
}

const mapStateToProps = state => ({
  user: state.authentication.user,
  session: state.academicSession.items
})

const mapDispatchToProps = dispatch => ({
  loadSession: dispatch(apiActions.listAcademicSessions())
})

export default connect(mapStateToProps, mapDispatchToProps)((withRouter(OtherFeeType)))
