import React, { Component } from 'react'
import { Grid } from 'semantic-ui-react'
import axios from 'axios'
import { connect } from 'react-redux'
import moment from 'moment'
import RestoreFromTrashIcon from '@material-ui/icons/RestoreFromTrash'
import Tabs from '@material-ui/core/Tabs'
import Tab from '@material-ui/core/Tab'
import IconButton from '@material-ui/core/IconButton/IconButton'
import DeleteIcon from '@material-ui/icons/DeleteOutlined'
import '../../../css/staff.css'
import { apiActions } from '../../../../_actions'
import { urls } from '../../../../urls'
import { OmsSelect, RouterButton, OmsFilterTable, Toolbar } from '../../../../ui'

const addGradeMapping = {
  label: 'Add Grade Mapping',
  href: 'gradeMapping/addGradeMapping',
  disabled: false
}

const filterTableData = {
  label: 'gradeMapping',
  namespace: 'Staff Data'
}

const field = [
  {
    name: 'branch_name',
    displayName: 'Branch Name'
  },
  {
    name: 'grade',
    displayName: 'Grade'
  },
  {
    name: 'branch_createdAt',
    displayName: 'Created Date'
  },
  {
    name: 'grade_updatedAt',
    displayName: 'Updated Date'
  },
  {
    name: 'Delete',
    displayName: 'Delete'
  }
]

field.forEach(function (obj) {
  obj['inputFilterable'] = true
  obj['exactFilterable'] = true
  obj['sortable'] = true
})

class GradeMapping extends Component {
  constructor () {
    super()
    this.state = {
      tabValue: 0,
      isDelete: 'Flase'
    }
    this.handleClick = this.handleClick.bind(this)
    this.deleteAndUndeleteHandler = this.deleteAndUndeleteHandler.bind(this)
    this.handleChangeTab = this.handleChangeTab.bind(this)
    // this.showDisplayName = this.showDisplayName.bind(this)
    this.showName = this.showName.bind(this)
  }

  componentDidMount () {
    this.props.listBranches()

    this.role = JSON.parse(
      localStorage.getItem('user_profile')
    ).personal_info.role
    let academicProfile = JSON.parse(localStorage.getItem('user_profile'))
      .academic_profile
    if (this.role === 'Principal') {
      this.setState({
        branch: academicProfile.branch_id,
        branch_name: academicProfile.branch
      }, () => { this.handleClick({ value: academicProfile.branch_id }) })
    }
  }

  deleteAndUndeleteHandler = (id, mode) => {
    var updatedList = urls.GradeMapping + id + '/'
    let { branchId, isDelete } = this.state
    let method = ''
    if (mode === 'Delete') { method = 'delete' } else {
      method = 'put'
    }
    axios({
      method: method,
      url: updatedList,
      headers: {
        Authorization: 'Bearer ' + this.props.user
      }
    })
      .then((res) => {
        console.log(res)

        if (method === 'delete') {
          this.props.alert.success('Deleted Successfully')
          this.props.gradeMapBranch(branchId)
        } else {
          this.props.alert.success('UnDeleted Successfully')
          this.props.gradeMapBranch(branchId, isDelete)
        }
      })
      .catch((error) => {
        console.log("Error: Couldn't fetch data from " + urls.GradeMapping)
        console.log(error)
        this.props.alert.error('Error: Something went wrong, please try again')
      })
  }

  handleClick = (e) => {
    this.setState({ branchId: e.value })
    this.props.gradeMapBranch(e.value)
  }

  handleChangeTab (event, tab) {
    let{ branchId } = this.state
    console.log(tab, branchId, 'taa')
    if (tab === 0) {
      this.setState({ tabValue: tab, isDelete: 'False' })
      this.props.gradeMapBranch(branchId)
    } else if (tab === 1) {
      this.setState({ tabValue: tab, isDelete: 'True' })
      this.props.gradeMapBranch(branchId, 'True')
    }
  }

  showName (status) {
    let{ tabValue } = this.state

    if (status === 'columnHeader') {
      if (tabValue === 0) {
        return 'Delete'
      } else {
        return 'Restore'
      }
    } else {
      if (tabValue === 0) {
        return 'Delete'
      } else {
        return 'Restore'
      }
    }
  }

  render () {
    let { branchId } = this.state
    return (
      <React.Fragment>
        <Toolbar
          floatRight={
            <React.Fragment>
              <RouterButton value={addGradeMapping} />

            </React.Fragment>
          } >
          {this.role === 'Principal'
            ? <input
              type='text'
              value={this.state.branch_name}
              disabled
              className='form-control'
              placeholder='Branch'
            /> : (
              <OmsSelect
                label={'Branch'}
                defaultValue={this.state.id}
                options={
                  this.props.branches
                    ? this.props.branches.map(branch => ({
                      value: branch.id,
                      label: branch.branch_name
                    }))
                    : null
                }
                value={
                  this.role === 'Principal' &&
                this.state.currentPrincipalBranch
                }
                isDisabled={this.role === 'Principal'}
                change={this.handleClick}
              />
            )}

        </Toolbar>
        {(this.role === 'Admin' && branchId) && <div className='grade_mapping'>
          <Grid >

            <Tabs value={this.state.tabValue} indicatorColor='primary' textColor='primary' onChange={this.handleChangeTab} style={{ flexDirection: 'row', justifyContent: 'center' }}>
              <Tab label='ACTIVE' />
              <Tab label='DELETED' />
            </Tabs></Grid></div>}

        <Grid className='student-addStudent-segment1'>
          <Grid.Row centered={1}>
            <Grid.Column>
            </Grid.Column>
          </Grid.Row>
          <Grid.Row>
            <Grid.Column
              computer={15}
              mobile={15}
              tablet={15}
              className='staff-table1'
            >
              <OmsFilterTable
                loading={!this.props.grades && this.state.branchId}
                filterTableData={filterTableData}
                tableData={this.props.grades
                  ? this.props.grades.map((grades) =>
                    ({
                      branch_name: grades.branch.branch_name,
                      branch_createdAt: moment(grades.branch.createdAt).format('DD/MM/YYYY HH:MM:SS'),
                      grade: grades.grade.grade,
                      grade_updatedAt: moment(grades.branch.updatedAt).format('DD/MM/YYYY HH:MM:SS'),
                      Delete:
                    <IconButton area-label='Delete' onClick={() => {
                      this.deleteAndUndeleteHandler(grades.id, 'Delete')
                    }} >
                      <DeleteIcon fontSize='small' />
                    </IconButton>,
                      Restore:
                    <IconButton area-label='restore' onClick={() => {
                      this.deleteAndUndeleteHandler(grades.id, 'Restore')
                    }} >
                      <RestoreFromTrashIcon fontSize='small' />
                    </IconButton>

                    }))
                  : null}
                tableFields={[ {
                  name: 'branch_name',
                  displayName: 'Branch Name'
                },
                {
                  name: 'grade',
                  displayName: 'Grade'
                },
                {
                  name: 'branch_createdAt',
                  displayName: 'Created Date'
                },
                {
                  name: 'grade_updatedAt',
                  displayName: 'Updated Date'
                },
                {
                  name: this.showName('columnValue'),
                  displayName: this.showName('ColumnHeader')
                }]}
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
  branches: state.branches.items,
  grades: state.gradeMap.items,
  gradeLoading: state.gradeMap.loading
})

const mapDispatchToProps = dispatch => ({
  listBranches: () => dispatch(apiActions.listBranches()),
  gradeMapBranch: (branchId, isDelete) => dispatch(apiActions.getGradeMapping(branchId, isDelete))
  // getGradeDeletedMapping: (branchId, isDelete) => dispatch(apiActions.getGradeMapping(branchId, isDelete))
})

export default connect(mapStateToProps, mapDispatchToProps)(GradeMapping)
