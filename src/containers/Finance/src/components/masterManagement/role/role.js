import React, { Component } from 'react'
import { Grid } from 'semantic-ui-react'
import { Button } from '@material-ui/core/'

import axios from 'axios'
import { withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import IconButton from '@material-ui/core/IconButton/IconButton'
import DeleteIcon from '@material-ui/icons/DeleteOutlined'
import AuthService from '../../AuthService'
import { urls } from '../../../urls'
import { apiActions } from '../../../_actions'
import '../../css/staff.css'
import { RouterButton, OmsFilterTable, AlertMessage, Toolbar } from '../../../ui'

const addRole = {
  label: 'Add Role',
  color: 'blue',
  href: '/role/addRole',
  disabled: false
}
const permission = {
  label: 'Edit Permissions',
  color: 'blue',
  href: '/role/permission',
  disabled: false
}

const roleData = {
  namespace: 'Role'
}

// const csv = {
//   label: 'CSV'
// }

// const excel = {
//   label: 'Excel'
// }

class Role extends Component {
  constructor () {
    super()
    var a = new AuthService()
    this.auth_token = a.getToken()
    this.state = {
      data: [],
      field: [],
      click: false
    }
    this.csv = urls.RoleExport + '?export_type=csv'
    this.excel = urls.RoleExport + '?export_type=excel'
    this.deleteHandler = this.deleteHandler.bind(this)
    this.deleteHandler = this.deleteHandler.bind(this)
  }
  componentDidMount () {
    if (this.props.roles && this.props.roles.length > 0) {
      var arr = []
      var roleList = []
      var roleTable = []
      var that = this
      console.log(arr)
      this.props.roles.forEach(function (val, i) {
        console.log(val)
        roleList.push({
          Sr: ++i,
          roleName: val.role_name,
          Edit: (
            <RouterButton
              icon='edit'
              value={{ basic: 'basic', href: '/role/editRole?' + val.id }}
              id={val.id}
            />
          ),
          Delete: (
            <IconButton
              area-label='Delete'
              basic
              onClick={() => that.deleteHandler(val.id)}
            >
              <DeleteIcon fontSize='small' />
            </IconButton>
          )
        })
      })
      roleTable.push(
        {
          name: 'Sr',
          displayName: 'Sr',
          inputFilterable: true,
          exactFilterable: true,
          sortable: true
        },
        {
          name: 'roleName',
          displayName: 'Role Name',
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
      this.setState({ data: roleList })
      this.setState({ field: roleTable })
    } else {
      this.props.listRoles()
    }
  }

  deleteHandler = id => {
    console.log(id)
    var updatedList = urls.ROLE + id + '/'

    axios
      .delete(updatedList, {
        headers: {
          Authorization: 'Bearer ' + this.auth_token
        }
      })
      .then(res => {
        console.log(res)
        // alert("Deleted ROLE Successfully");
        this.setState({
          alertMessage: {
            messageText: 'Deleted role successfully',
            variant: 'success',
            reset: () => {
              this.setState({ alertMessage: null })
            }
          }
        })
      })
      .catch(error => {
        console.log("Error: Couldn't fetch data from " + urls.ROLE)
        this.setState({
          alertMessage: {
            messageText: 'Error: Something went wrong, please try again.',
            variant: 'error',
            reset: () => {
              this.setState({ alertMessage: null }, error)
            }
          }
        })
      })
  };

  componentWillReceiveProps (props) {
    console.log('will receive', props)
    if (props.roles && props.roles.length > 0) {
      var arr = []
      var roleList = []
      var roleTable = []
      var that = this
      console.log(arr)
      props.roles.forEach(function (val, i) {
        console.log(val)
        roleList.push({
          Sr: ++i,
          roleName: val.role_name,
          Edit: (
            <RouterButton
              icon='edit'
              value={{ basic: 'basic', href: '/role/editRole?' + val.id }}
              id={val.id}
            />
          ),
          Delete: (
            <IconButton
              area-label='Delete'
              basic
              onClick={that.deleteHandler}
            >
              <DeleteIcon fontSize='small' />
            </IconButton>
          )
        })
      })
      roleTable.push(
        {
          name: 'Sr',
          displayName: 'Sr',
          inputFilterable: true,
          exactFilterable: true,
          sortable: true
        },
        {
          name: 'roleName',
          displayName: 'Role Name',
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
      this.setState({ data: roleList })
      this.setState({ field: roleTable })
    }
    console.log('rolelist', roleList)
  }

  render () {
    return (
      <React.Fragment>
        <Toolbar
          floatRight={
            <RouterButton value={addRole} />
          }>
          <div>
            <Button href={this.csv} target='_blank'>CSV</Button>
            <Button href={this.excel} target='_blank'>Excel</Button>
            <RouterButton value={permission} />
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
                filterTableData={roleData}
                tableData={this.state.data}
                tableFields={this.state.field}
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
  roles: state.roles.items
})

const mapDispatchToProps = dispatch => ({
  listRoles: () => dispatch(apiActions.listRoles())
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(Role))
