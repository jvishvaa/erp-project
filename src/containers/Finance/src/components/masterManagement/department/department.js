import React, { Component } from 'react'
import axios from 'axios'
import { withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import { Grid } from 'semantic-ui-react'
import { Button } from '@material-ui/core/'

import IconButton from '@material-ui/core/IconButton/IconButton'
import DeleteIcon from '@material-ui/icons/DeleteOutlined'
import { urls } from '../../../urls'
import { apiActions } from '../../../_actions'
import { RouterButton, OmsFilterTable, AlertMessage, Toolbar } from '../../../ui'
import '../../css/staff.css'

const departmentData = {
  namespace: 'Department'
}

const addDepartment = {
  label: 'Add Department',
  color: 'blue',
  href: '/department/addDepartment',
  disabled: false
}

class Department extends Component {
  constructor () {
    super()
    this.state = {
      field: [],
      data: [],
      click: false
    }
    this.deleteHandler = this.deleteHandler.bind(this)
    this.csv = urls.DepartmentExport + '?export_type=csv'
    this.excel = urls.DepartmentExport + '?export_type=excel'
  }

  deleteHandler = id => {
    var updatedList = urls.DEPARTMENT + id + '/'

    axios
      .delete(updatedList, {
        headers: {
          Authorization: 'Bearer ' + this.props.user
        }
      })
      .then(res => {
        if (res.status === 204) {
          this.setState({
            alertMessage: {
              messageText: 'Department Deleted Successfully',
              variant: 'success',
              reset: () => {
                this.setState({ alertMessage: null })
              }
            }
          })
        }
      })
      .catch(error => {
        console.log(error)
        this.setState({
          alertMessage: {
            messageText: 'Error: Something went wrong, please try again',
            variant: 'error',
            reset: () => {
              this.setState({ alertMessage: null })
            }
          }
        })
      })
  }

  componentDidMount () {
    if (this.props.department && this.props.department.length > 0) {
      var staffList = []
      var staffTable = []
      var i = 1
      var that = this
      this.props.department.forEach(function (v) {
        var idDept = v.id
        that.setState({
          edit: { name: 'edit', href: '/department/editDepartment?' + idDept }
        })
        staffList.push({
          No: i,
          DepartmentName: v.department_name,
          CreatedDate: v.createdAt,
          UpdatedDate: v.updatedAt,
          Edit: (
            <RouterButton
              icon='edit'
              value={{
                basic: 'basic',
                href: '/department/editDepartment?' + v.id
              }}
              id={v.id}
            />
          ),
          Delete: (
            <IconButton
              area-label='Delete'
              basic
              onClick={() => { that.deleteHandler(v.id) }}
            >
              <DeleteIcon fontSize='small' />
            </IconButton>
          )
        })
        i++
      })

      staffTable.push(
        {
          name: 'No',
          displayName: 'Sr',
          inputFilterable: true,
          exactFilterable: true,
          sortable: true
        },
        {
          name: 'DepartmentName',
          displayName: 'Department Name',
          inputFilterable: true,
          exactFilterable: true,
          sortable: true
        },
        {
          name: 'CreatedDate',
          displayName: 'Added Date',
          inputFilterable: true,
          exactFilterable: true,
          sortable: true
        },
        {
          name: 'UpdatedDate',
          displayName: 'Update Date',
          inputFilterable: true,
          exactFilterable: true,
          sortable: true
        },
        {
          name: 'Edit',
          displayName: 'Edit',
          inputFilterable: false,
          exactFilterable: false,
          sortable: false
        },
        {
          name: 'Delete',
          displayName: 'Delete',
          inputFilterable: false,
          exactFilterable: false,
          sortable: false
        }
      )
      this.setState({ data: staffList })
      this.setState({ field: staffTable })
      console.log('---------')
      console.log(this.state.field)
      console.log(this.state.data)
    } else {
      this.props.listDepartments()
    }
  }

  componentWillReceiveProps (props) {
    console.log('will receive', props)
    if (props.department && props.department.length > 0) {
      var staffList = []
      var staffTable = []
      var i = 1
      var that = this
      props.department.forEach(function (v) {
        var idDept = v.id
        that.setState({
          edit: { name: 'edit', href: '/department/editDepartment?' + idDept }
        })
        staffList.push({
          No: i,
          DepartmentName: v.department_name,
          CreatedDate: v.createdAt,
          UpdatedDate: v.updatedAt,
          Edit: (
            <RouterButton
              icon='edit'
              value={{
                basic: 'basic',
                href: '/department/editDepartment?' + v.id
              }}
              id={v.id}
            />
          ),
          Delete: (
            // <Button
            //   icon='delete'
            //   basic
            //   onClick={() => { that.deleteHandler(v.id) }}
            // />
            <IconButton
              area-label='Delete'
              basic
              onClick={() => { that.deleteHandler(v.id) }}
            >
              <DeleteIcon fontSize='small' />
            </IconButton>
          )
        })
        i++
      })

      staffTable.push(
        {
          name: 'No',
          displayName: 'Sr',
          inputFilterable: true,
          exactFilterable: true,
          sortable: true
        },
        {
          name: 'DepartmentName',
          displayName: 'Department Name',
          inputFilterable: true,
          exactFilterable: true,
          sortable: true
        },
        {
          name: 'CreatedDate',
          displayName: 'Added Date',
          inputFilterable: true,
          exactFilterable: true,
          sortable: true
        },
        {
          name: 'UpdatedDate',
          displayName: 'Update Date',
          inputFilterable: true,
          exactFilterable: true,
          sortable: true
        },
        {
          name: 'Edit',
          displayName: 'Edit',
          inputFilterable: false,
          exactFilterable: false,
          sortable: false
        },
        {
          name: 'Delete',
          displayName: 'Delete',
          inputFilterable: false,
          exactFilterable: false,
          sortable: false
        }
      )
      this.setState({ data: staffList })
      this.setState({ field: staffTable })
      console.log('---------')
      console.log(this.state.field)
      console.log(this.state.data)
      return
    }
    console.log('departmentlist', staffList)
  }

  render () {
    return (
      <React.Fragment>
        <Toolbar
          floatRight={
            <RouterButton value={addDepartment} />
          } >
          <div>
            <Button href={this.csv} target='_blank'>CSV</Button>
            <Button href={this.excel} target='_blank'>Excel</Button>
          </div>
        </Toolbar>

        <AlertMessage alertMessage={this.state.alertMessage} />

        <Grid className='student-section-studentDetails'>
          <Grid.Row>
            <Grid.Column
              computer={15}
              mobile={13}
              tablet={15}
              className='staff-table1'
            >
              <OmsFilterTable
                tableData={this.state.data}
                tableFields={this.state.field}
                filterTableData={departmentData}
              />
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </React.Fragment>
    )
  }
}

const mapStateToProps = state => ({
  user: state.authentication.user,
  department: state.department.items
})

const mapDispatchToProps = dispatch => ({
  listDepartments: () => dispatch(apiActions.listDepartments())
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(Department))
