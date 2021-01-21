import React, { Component } from 'react'
import Select from 'react-select'
import axios from 'axios'
import { connect } from 'react-redux'
import { Grid, Segment, Breadcrumb } from 'semantic-ui-react'
import '../../css/staff.css'
import { urls } from '../../../urls'
import { apiActions } from '../../../_actions'
import { renderRoutes } from '../../../_components'
import { OmsSelect, OmsFilterTable, RouterButton, Button } from '../../../ui'

const staffTable = {
  namespace: 'Staff mapping Data'
}
const csv = {
  label: 'CSV'
}
const excel = {
  label: 'Excel'
}

const getStaff = {
  label: 'Get Staff',
  color: 'blue',
  disabled: false
}

var field = [
  {
    name: 'StaffName',
    displayName: 'Staff Name',
    inputFilterable: true,
    exactFilterable: true,
    sortable: true
  },
  {
    name: 'Mobile',
    displayName: 'Mobile',
    inputFilterable: true,
    exactFilterable: true,
    sortable: true
  },
  {
    name: 'Email',
    displayName: 'Email',
    inputFilterable: true,
    exactFilterable: true,
    sortable: true
  },
  {
    name: 'ERPCode',
    displayName: 'ERPCode',
    inputFilterable: true,
    exactFilterable: true,
    sortable: true
  },
  {
    name: 'Branch',
    displayName: 'Branch',
    inputFilterable: true,
    exactFilterable: true,
    sortable: true
  },
  {
    name: 'Designation',
    displayName: 'Designation',
    inputFilterable: true,
    exactFilterable: true,
    sortable: true
  },
  {
    name: 'Department',
    displayName: 'Department',
    inputFilterable: true,
    exactFilterable: true,
    sortable: true
  },
  {
    name: 'Address',
    displayName: 'Address',
    inputFilterable: true,
    exactFilterable: true,
    sortable: true
  },
  {
    name: 'CreatedDate',
    displayName: 'CreatedDate',
    inputFilterable: true,
    exactFilterable: true,
    sortable: true
  },
  {
    name: 'UpdatedDate',
    displayName: 'UpdatedDate',
    inputFilterable: true,
    exactFilterable: true,
    sortable: true
  },
  {
    name: 'Delete',
    displayName: 'Delete'
  }
]

class StaffMapping extends Component {
  constructor (props) {
    super(props)
    this.storeRes = {}
    this.staff = ''
    this.state = {
      data: [],
      options: []
    }
    this.handleChange = this.handleChange.bind(this)
    this.deleteHandler = this.deleteHandler.bind(this)
    this.handleGetstaff = this.handleGetstaff.bind(this)
  }

  componentDidMount () {
    console.log(this.props)
  }

  handleGetstaff = () => {
    var array = this.storeRes.data
    var staffList = []
    var that = this

    if (this.staff !== '') {
      array.forEach(function (val) {
        var empDetails = val.user
        var branchDetails = val.branch_fk
        var departmentDetails = val.department_fk
        var designation = val.designation
        if (val.id === that.staff) {
          staffList.push({
            StaffName: empDetails.first_name,
            Mobile: val.contact_no,
            Email: empDetails.email,
            ERPCode: val.erp_code,
            Branch: branchDetails ? branchDetails.branch_name : '',
            Designation: designation ? designation.designation_name : '',
            Department: departmentDetails
              ? departmentDetails.department_name
              : '',
            Address: branchDetails ? branchDetails.address : '',
            CreatedDate: branchDetails ? branchDetails.createdAt : '',
            UpdatedDate: branchDetails ? branchDetails.updatedAt : '',
            Delete: (
              <RouterButton
                icon='delete'
                value={{ basic: 'basic' }}
                click={e => that.deleteHandler(val.id)}
              />
            )
          })
        }
      })
      this.setState({ data: staffList })
      console.log(this.state)
    }
  };

  deleteHandler = id => {
    var updatedList = urls.Teacher + id + '/'
    axios
      .delete(updatedList, {
        headers: {
          Authorization: 'Bearer ' + this.props.user
        }
      })
      .then(res => {
        this.props.alert.success('Staff Deleted Successfully')
      })
      .catch(function (error) {
        console.log("Error: Couldn't fetch data from " + urls.Teacher, error)
      })
  };

  deleteHandler = id => {
    var updatedList = urls.Teacher + id + '/'
    axios
      .delete(updatedList, {
        headers: {
          Authorization: 'Bearer ' + this.props.user
        }
      })
      .then(res => {
        this.props.alert.success('Staff Deleted Successfully')
      })
      .catch(function (error) {
        console.log("Error: Couldn't fetch data from " + urls.Teacher, error)
      })
  };

  handleStaff = e => {
    this.staff = e.value
  };

  handleChange = e => {
    this.setState({ options: [] })
    var staffList = urls.Teacher + '?branch=' + e.value
    axios
      .get(staffList, {
        headers: {
          Authorization: 'Bearer ' + this.props.user
        }
      })
      .then(res => {
        this.storeRes = res
        var option = []
        res.data.forEach(function (val) {
          option.push({
            value: val.id,
            label: val.name
          })
        })
        this.setState({ options: option })
      })
      .catch(function (error) {
        console.log("Error: Couldn't fetch data from " + urls.Teacher, error)
      })
  };

  render () {
    return (
      <React.Fragment>
        <Grid>
          <Grid.Column computer={8} mobile={16} tablet={10} floated='left'>
            <label className='student-heading'>Manage</label>&nbsp;View Staff
            Mapping
          </Grid.Column>
          <Grid.Column computer={8} mobile={16} tablet={10} floated='right'>
            <Breadcrumb
              size='mini'
              textAlign='center'
              className='student-breadcrumb'
            >
              <Breadcrumb.Section link>Home</Breadcrumb.Section>
              <Breadcrumb.Divider icon='right chevron' />
              <Breadcrumb.Section active>
                View Staff Mapping
              </Breadcrumb.Section>
            </Breadcrumb>
          </Grid.Column>
        </Grid>

        <Grid>
          <Grid.Row>
            <Grid.Column
              computer={16}
              mobile={16}
              tablet={10}
              className='student-addStudent-StudentSection'
            >
              <Segment.Group>
                <Segment>
                  <Grid>
                    <Grid.Row>
                      <Grid.Column
                        floated='left'
                        computer={4}
                        mobile={16}
                        tablet={10}
                      >
                        <label className='student-addStudent-segment1-heading'>
                          View Staff Mapping
                        </label>
                      </Grid.Column>
                    </Grid.Row>
                  </Grid>
                </Segment>

                <Segment className='student-addStudent-segment1'>
                  <Grid>
                    <Grid.Row>
                      <Grid.Column
                        computer={6}
                        mobile={16}
                        tablet={16}
                        className='student-section-inputField'
                      >
                        <label>Branch*</label>
                        {this.role === 'Principal'
                          ? <input
                            type='text'
                            value={this.state.branch_name}
                            disabled
                            className='form-control'
                            placeholder='Branch'
                          /> : (
                            <OmsSelect
                              defaultValue={
                                this.props.branches
                                  ? [this.props.branches[0].branch_name]
                                  : { value: '1', label: 'hello' }
                              }
                              options={
                                this.props.branches
                                  ? this.props.branches.map(branch => ({
                                    value: branch.id,
                                    label: branch.branch_name
                                  }))
                                  : null
                              }
                              change={this.handleChange}
                            />
                          )}
                      </Grid.Column>
                      <Grid.Column
                        computer={6}
                        mobile={16}
                        tablet={16}
                        className='student-section-inputField'
                      >
                        <label>Select Staff*</label>

                        <Select
                          id='selectempty'
                          onChange={this.handleStaff}
                          placeholder='select staff'
                          options={this.state.options}
                        />
                      </Grid.Column>
                      <Grid.Column
                        computer={4}
                        mobile={16}
                        tablet={16}
                        className='student-section-inputField-button'
                      >
                        <Button
                          value={getStaff}
                          click={this.handleGetstaff}
                        />
                      </Grid.Column>
                    </Grid.Row>
                  </Grid>
                </Segment>

                <Segment>
                  <Grid>
                    <Grid.Row className='student-section-excel-button'>
                      <Grid.Column
                        floated='left'
                        computer={5}
                        mobile={16}
                        tablet={16}
                      >
                        <RouterButton value={csv} /> &nbsp;
                        <RouterButton value={excel} />
                      </Grid.Column>
                    </Grid.Row>
                  </Grid>
                </Segment>

                <Segment className='student-section-studentDetails'>
                  <Grid>
                    <Grid.Row>
                      <Grid.Column
                        computer={15}
                        mobile={15}
                        tablet={15}
                        className='staff-table1'
                      >
                        <OmsFilterTable
                          filterTableData={staffTable}
                          tableData={this.state.data}
                          tableFields={field}
                        />
                      </Grid.Column>
                    </Grid.Row>
                  </Grid>
                </Segment>
              </Segment.Group>
            </Grid.Column>
          </Grid.Row>
        </Grid>
        {this.props.routes ? renderRoutes(this.props.routes) : null}
      </React.Fragment>
    )
  }
}
const mapStateToProps = state => ({
  branches: state.branches.items,
  user: state.authentication.user
})
const mapDispatchToProps = dispatch => ({
  listBranches: () => dispatch(apiActions.listBranches())
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(StaffMapping)
