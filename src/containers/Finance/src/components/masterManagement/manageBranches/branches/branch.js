import React, { Component } from 'react'
import axios from 'axios'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { Grid } from 'semantic-ui-react'
import { Button } from '@material-ui/core/'

import IconButton from '@material-ui/core/IconButton/IconButton'
import DeleteIcon from '@material-ui/icons/DeleteOutlined'
import EditIcon from '@material-ui/icons/EditOutlined'
import { urls } from '../../../../urls'
import { RouterButton, OmsFilterTable, Toolbar } from '../../../../ui'
import { apiActions } from '../../../../_actions'
import '../../../css/staff.css'

const addBranch = {
  label: 'Add Branch',
  color: 'blue',
  href: 'branch/add',
  disabled: false
}

const staffTableField = [
  {
    name: 'No',
    displayName: 'Sr',
    inputFilterable: true,
    exactFilterable: true,
    sortable: true
  },
  {
    name: 'BranchName',
    displayName: 'Branch Name',
    inputFilterable: true,
    exactFilterable: true,
    sortable: true
  },
  {
    name: 'BranchCode',
    displayName: 'Branch Code',
    inputFilterable: true,
    exactFilterable: true,
    sortable: true
  },
  {
    name: 'BranchEnrollmentCode',
    displayName: 'Branch Enrollment Code',
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
]

class Branch extends Component {
  constructor () {
    super()
    this.state = {
      field: [],
      data: [],
      click: false
    }
    this.csv = urls.BranchExport + '?export_type=csv'
    this.excel = urls.BranchExport + '?export_type=excel'
    this.deleteHandler = this.deleteHandler.bind(this)
    this.tableData = this.tableData.bind(this)
  }

  componentDidMount () {
    if (this.props.branches && this.props.branches.length > 0) {
      this.tableData(this.props.branches)
    } else {
      this.props.listBranches()
    }
  }

  componentWillReceiveProps (props) {
    if (props.branches && props.branches.length > 0) {
      this.tableData(props.branches)
    }
  }

  tableData (data) {
    var staffList = []
    data.forEach((v, index) => {
      staffList.push({
        id: v.id,
        No: index + 1,
        BranchName: v.branch_name,
        BranchCode: v.branch_code,
        BranchEnrollmentCode: v.branch_enrollment_code,
        Address: v.address,
        CreatedDate: v.createdAt,
        UpdatedDate: v.updatedAt,
        Edit: (
          <IconButton
            aria-label='Edit'
            onClick={e => {
              e.stopPropagation()
              this.props.history.push(
                '/branch/edit/' + v.id
              )
            }}
          >
            <EditIcon fontSize='small' />
          </IconButton>
        ),
        Delete: (
          <IconButton
            aria-label='Delete'
            onClick={() => { this.deleteHandler(v.id) }}
          >
            <DeleteIcon fontSize='small' />
          </IconButton>
        )
      })
    })
    this.setState({ data: staffList })
  }

  deleteHandler (id) {
    axios
      .delete(urls.BRANCH + id + '/', {
        headers: {
          Authorization: 'Bearer ' + this.props.user
        }
      })
      .then(res => {
        if (res.status === 200) {
          let data = this.state.data
          data.splice(data.findIndex(data => (data.id === id)), 1, data)
          this.setState((state, props) => ({
            data: data
          }))
          this.props.alert.success('Deletion successful')
        } else {
          this.props.alert.error('Error: Something went wrong, please try again.')
        }
      })
      .catch(error => {
        console.log(error)
        this.props.alert.error('Error: Something went wrong, please try again.')
      })
  }

  render () {
    return (
      <React.Fragment>
        <Toolbar
          floatRight={
            <RouterButton value={addBranch} />
          }>
          <div>
            <Button href={this.csv} target='_blank'>CSV</Button>
            <Button href={this.excel} target='_blank'>Excel</Button>
          </div>
        </Toolbar>
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
                tableFields={staffTableField}
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
  branches: state.branches.items
})

const mapDispatchToProps = dispatch => ({
  listBranches: () => dispatch(apiActions.listBranches())
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(Branch))
