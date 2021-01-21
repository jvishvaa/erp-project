import React, { Component } from 'react'

import axios from 'axios'
import { connect } from 'react-redux'
import { withStyles, Button } from '@material-ui/core'
import IconButton from '@material-ui/core/IconButton/IconButton'
import EditIcon from '@material-ui/icons/EditOutlined'
import DeleteIcon from '@material-ui/icons/DeleteOutlined'
import Restore from '@material-ui/icons/Restore'
import SwapHorizontalIcon from '@material-ui/icons/SwapHorizOutlined'
import { withRouter } from 'react-router-dom'
import update from 'immutability-helper'
import Tabs from '@material-ui/core/Tabs'
import Tab from '@material-ui/core/Tab'
import ReactTable from 'react-table'
import _ from 'lodash'
import 'react-table/react-table.css'
import SearchIcon from '@material-ui/icons/Search'
import { fade } from '@material-ui/core/styles/colorManipulator'
import { throttle, debounce } from 'throttle-debounce'
import InputBase from '@material-ui/core/InputBase'
import '../../css/staff.css'

import { urls } from '../../../urls'
import { RouterButton, OmsSelect, Toolbar } from '../../../ui'
import { apiActions } from '../../../_actions'

const addStaff = {
  label: 'Add Staff',
  color: 'blue',
  href: '/staff/add',
  disabled: false,
  icon: 'star'
}

const addStaffExcel = {
  label: 'Upload Excel',
  color: 'blue',
  href: '/staff/upload',
  disabled: false
}

const styles = theme => ({
  expandCol: {
    width: '5%'
  },
  tableWrapper: {
    overflowX: 'auto'
  },
  root: {
    display: 'flex'
  },
  inputRoot: {
    color: 'inherit',
    width: '100%'
  },
  inputInput: {
    paddingTop: theme.spacing.unit,
    paddingRight: theme.spacing.unit,
    paddingBottom: theme.spacing.unit,
    paddingLeft: theme.spacing.unit * 10,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      width: 120,
      '&:focus': {
        width: 200
      }
    }
  },
  grow: {
    flexGrow: 1
  },
  search: {
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: fade(theme.palette.common.white, 0.15),
    '&:hover': {
      backgroundColor: fade(theme.palette.common.white, 0.25)
    },
    marginLeft: 0,
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      marginLeft: theme.spacing.unit,
      width: 'auto'
    }
  },
  searchIcon: {
    width: theme.spacing.unit * 9,
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  }
})
const teacherColumns = [
  {
    Header: 'Teaching',
    columns: [
      {
        Header: 'Branch',
        accessor: 'branch_name'
      },
      {
        Header: 'Grade',
        accessor: 'grade_name'
      },
      {
        Header: 'Section',
        accessor: 'section_name'
      },
      {
        Header: 'Subject',
        accessor: 'subject_name'
      }

    ],
    style: { color: 'blue' }
  }
]
const canReview = [
  {
    Header: 'Can Review',
    columns: [
      {
        Header: 'Branch',
        accessor: 'branch_name'
      },
      {
        Header: 'Grade',
        accessor: 'grade_name'
      },

      {
        Header: 'Subject',
        accessor: 'subject_name'
      }

    ],
    style: { color: 'blue' }
  }
]
class Staff extends Component {
  constructor (props) {
    super(props)
    this.state = {
      tab: 0,
      data: [],
      click: false,
      expanded: [],
      row: {},
      staffs: [],
      loading: true,
      pages: null,
      subcomponentIsDisplayed: false,
      mapDetails: {},
      csv: {
        label: 'CSV'
      },
      excel: {
        label: 'Excel'
      },
      TabValue: 0,
      isTabClicked: false,
      allStaffs: [],
      tabChangeLoading: false,
      isDelete: 'false',
      isActive: 'true',
      page: 1,
      teaching: [],
      canReview: [],
      acad: [],
      review: []
    }
    this.deleteHandler = this.deleteHandler.bind(this)
    this.fetchData = this.fetchData.bind(this)
    this.handleClick = this.handleClick.bind(this)
    this.handleInputChange = this.handleInputChange.bind(this)
    this.subComponent = this.subComponent.bind(this)
    this.handleSearch = this.handleSearch.bind(this)
    this.handleChangeTab = this.handleChangeTab.bind(this)
    this.showColumn = this.showColumn.bind(this)
    this.autocompleteSearchDebounced = debounce(500, this.autocompleteSearch)
    this.autocompleteSearchThrottled = throttle(500, this.autocompleteSearch)
    this.role = JSON.parse(localStorage.getItem('user_profile')).personal_info.role
    this.delayedCallback = _.debounce((value) => {
      this.getData(value)
    }, 2000)
  }

  componentWillMount () {
    this.props.listBranches()
    console.log(this.props.listBranches())
    var staff = Object.keys(this.props.staffs)
    var staffData = this.props.staffs[Number(staff[0])]
    var selectedBranch
    if (staffData && staff.length > 0) {
      let branch = staffData[0].branch_fk
      selectedBranch = {
        value: branch.id,
        label: branch.branch
      }
      this.setState({ id: selectedBranch })
    }
    let academicProfile = JSON.parse(localStorage.getItem('user_profile')).academic_profile
    if (this.role === 'Principal' || this.role === 'FOE' || this.role === 'AcademicCoordinator' || this.role === 'EA Academics') {
      // this.props.listStaffs(academicProfile.branch_id)
      this.setState({
        id: {
          value: academicProfile.branch_id,
          label: academicProfile.branch
        },
        tabChangeLoading: true
      }, () => { this.getData(null, 0) })
    } else if (this.role === 'BDM') {
      let branchsAssigned = JSON.parse(localStorage.getItem('user_profile')).academic_profile.branchs_assigned
      let branchData = []
      let map = new Map()
      for (const item of branchsAssigned) {
        if (!map.has(item.branch_id)) {
          map.set(item.branch_id, true)
          branchData.push({
            value: item.branch_id,
            label: item.branch_name
          })
        }
      }
      this.setState({ branchData })
    }
  }

  deleteHandler = (id) => {
    var updatedList = urls.Staff + String(id) + '/'
    axios
      .delete(updatedList, {
        headers: {
          Authorization: 'Bearer ' + this.props.user
        }
      })
      .then((res) => {
        this.props.alert.success('Deleted Staff Successfully')
        this.handleClick(this.state.id)
        this.props.listStaffs(this.state.id.value, this.props.staffs.currentPage)
      })
      .catch((error) => {
        console.log("Error: Couldn't fetch data from " + urls.Staff, error)
      })
  }

  fetchData (state, instance) {
    if (this.state.searchLength > 0) {
      if (this.state.id.label === 'Central') {
        this.props.listStaffsSearch('AcademicStaff', this.state.searchValue, this.state.id.value, state.page + 1)
      } else {
        this.props.listStaffsSearch('SchoolStaff', this.state.searchValue, this.state.id.value, state.page + 1)
      }
    } else {
      this.props.listStaffs(this.state.id.value, state.page + 1)
    }
    // this.setState({ csv: { href: urls.StaffExport + '?branch_id=' + this.state.id.value + '&export_type=csv', label: 'CSV' }, excel: { href: urls.StaffExport + '?branch_Id=' + this.state.id.value + '&export_type=excel', label: 'Excel' } })
  }
  openRow = (userId) => {
    if (!this.state.row[userId]) {
      this.setState({ row: { [userId]: { isLoading: true, expanded: true } } })
      axios
        .get(urls.Staff + `?user_id=${userId}`, {
          headers: {
            Authorization: 'Bearer ' + this.props.user
          }
        }).then(res => {
          this.setState({ row: { [userId]: { isLoading: false, expanded: true, data: Object.keys(res.data.academic_profile).length === 0 ? null : res.data.academic_profile } } })
        })
    } else {
      if (this.state.row[userId].expanded === true) this.setState({ row: update(this.state.row, { [userId]: { expanded: { $set: false } } }) })
      else this.setState({ row: update(this.state.row, { [userId]: { expanded: { $set: true } } }) })
    }
  }
  // DeletedStaff=() => {
  //   axios
  //     .get()
  // }
  subComponent = (properties) => {
    var userId = properties.original.user.id
    // var roleName = properties.original.role_name
    // let { acad } = this.state

    if (!this.state.mapDetails[userId]) {
      axios
        .get(urls.Staff + `?user_id=${userId}`, {
          headers: {
            Authorization: 'Bearer ' + this.props.user
          }
        }).then(res => {
          this.setState({
            mapDetails: { ...this.state.mapDetails,
              [userId]: { acad: res.data.academic_profile, review: res.data.can_review_profile }
            }

          })
        })
    }

    // if (JSON.stringify(this.state.mapDetails[userId]) === JSON.stringify({})

    // ) {
    //   console.log('Null')
    // } else
    if (this.state.mapDetails &&
       this.state.mapDetails[userId] &&
       Object.keys(this.state.mapDetails[userId].acad).length > 0) {
      if (properties.original.role_name === 'LeadTeacher') {
        return (

          <div>
            <ReactTable

              className='-striped -highlight'
              data={
                this.state.mapDetails &&
                   this.state.mapDetails[userId] &&
                    this.state.mapDetails[userId].acad &&
                    Array.isArray(this.state.mapDetails[userId].acad)
                  ? this.state.mapDetails[userId].acad : []}
              // data={[]}
              defaultPageSize={5}
              showPageSizeOptions={false}
              columns={teacherColumns}
            />

            <ReactTable
              className='-striped -highlight'
              data={this.state.mapDetails &&
                  this.state.mapDetails[userId] &&
                  this.state.mapDetails[userId].review &&
                  Array.isArray(this.state.mapDetails[userId].review)
                ? this.state.mapDetails[userId].review : []}
              defaultPageSize={5}
              showPageSizeOptions={false}
              columns={canReview}
            />
          </div>

        )
      } else {
        console.log(this.state.mapDetails &&
          this.state.mapDetails[userId] &&
          Object.keys(this.state.mapDetails[userId].acad).length)

        return <ReactTable
          className='-striped -highlight'
          data={this.state.mapDetails &&
            this.state.mapDetails[userId] &&
             this.state.mapDetails[userId].acad &&
             Array.isArray(this.state.mapDetails[userId].acad)
            ? this.state.mapDetails[userId].acad : []}
          defaultPageSize={5}
          showPageSizeOptions={false}
          columns={[
            {
              Header: 'Branch',
              accessor: 'branch_name'
            },
            {
              Header: 'Grade',
              accessor: 'grade_name'
            },
            {
              Header: 'Section',
              accessor: 'section_name'
            }
          ]}
        />
      }
    } else if ((this.state.mapDetails &&
      this.state.mapDetails[userId] &&
      Object.keys(this.state.mapDetails[userId].acad).length === 0)) {
      return <div>No mapping</div>
    } else {
      return <div>Loading...</div>
    }
  }
  handleSearch = (e) => {
    let { id } = this.state
    console.log(this.state.searchValue, id, 'value')
    console.log('searching', e.target.value)
    console.log('crt', this.state.id)
    e.persist()
    if (!id) {
      this.setState({ tabChangeLoading: false })
    } else {
      this.setState({ currentPage: 0, searchLength: e.target.value.length, searchValue: e.target.value, tabChangeLoading: true, pageNo: 0 })
    }
    this.delayedCallback(e.target.value)
    // debounce(700, (e) => {
    //   this.getData(this.state.searchValue)
    // })(e)
  }
  changeQuery = event => {
    this.setState({ q: event.target.value }, () => {
      const q = this.state.q
      if (q.length < 5) {
        this.autocompleteSearchThrottled(this.state.q)
      } else {
        this.autocompleteSearchDebounced(this.state.q)
      }
    })
  };

  autocompleteSearch = (q) => {
    this.props.listStaffsSearch(this.state.id.value, q)
    // getObjects(q)
  }

  handleClick = (e) => {
    this.setState({
      csv: { href: urls.MEDIA_BASE + '/staff/' + e.value + '_False' + '.csv', label: 'CSV' },
      excel: { href: urls.MEDIA_BASE + '/staff/' + e.value + '_False' + '.xlsx', label: 'Excel' },
      id: e,
      searchLength: 0,
      searchValue: '',
      isTabClicked: false,
      TabValue: 0,
      currentPage: 0,
      isDelete: 'false',
      tabChangeLoading: true,
      pageNo: 0,
      branchValue: e.label },
    this.getData)
  }
  switchUser = (userId) => {
    axios.post(urls.LOGIN, {
      user_id: userId
    }, {
      headers: {
        Authorization: 'Bearer ' + this.props.user
      }
    }).then(res => {
      localStorage.setItem('user_profile', JSON.stringify(res.data))
      localStorage.setItem('id_token', res.data.personal_info.token)
      window.location.assign('/')
    })
  }
  handleInputChange (event) {
    const target = event.target
    const value = target.type === 'checkbox' ? target.checked : target.value
    const name = target.name

    this.setState({
      [name]: value
    })
  }

  getData (searchValue, tablePage) {
    console.log(JSON.stringify(this.state))
    let { id, isDelete } = this.state
    if (searchValue && id) {
      this.props.listStaffsSearch(id.value, (Number(tablePage || 0) + 1), isDelete, 'Staff', searchValue)
        .then(({ payload }) => {
          this.setState({ allStaffs: payload, tabChangeLoading: false, totalPages: payload.total_pages, currentPage: Number(payload.current_page) - 1 })
        }).catch(err => {
          console.log(err)
        })
    } else if (!searchValue && id) {
      this.props.listStaffsTab(id.value, (Number(tablePage || 0) + 1), isDelete)
        .then(({ payload }) => {
          this.setState({ allStaffs: { ...payload, results: payload.result }, tabChangeLoading: false, totalPages: payload.total_pages })
        }).catch(err => {
          console.log(err)
        })
    }
  }

  handleChangeTab=(e, tab) => {
    const { id } = this.state
    console.log(id)
    if (id) {
      this.setState({
        tab: 0,
        TabValue: tab,
        isTabClicked: true,
        tabChangeLoading: true,
        searchValue: '',
        isDelete: tab === 0 ? 'false' : 'true',
        isActive: tab === 0 ? 'true' : 'false',
        currentPage: 0,
        pageNo: 0
      }, () => this.getData(null, 0))
      // tab === 0 ? this.setState({ isDelete: 'false', isActive: 'true', currentPage: 0, pageNo: 0 }, this.getData) : this.setState({ isDelete: 'true', isActive: 'false', currentPage: 0, pageNo: 0 })
      tab === 0 ? this.setState({ csv: { href: urls.MEDIA_BASE + '/staff/' + id.value + '_False' + '.csv', label: 'CSV' },
        excel: { href: urls.MEDIA_BASE + '/staff/' + id.value + '_False' + '.xlsx', label: 'Excel' } }) : this.setState({ csv: { href: urls.MEDIA_BASE + '/staff/' + id.value + '_True' + '.csv', label: 'CSV' },
        excel: { href: urls.MEDIA_BASE + '/staff/' + id.value + '_True' + '.xlsx', label: 'Excel' } })
    }
  }

  fetchTabsData=(state, instance) => {
    if (this.state.id) {
      // this.setState({ currentPage: state.page, tabChangeLoading: true }, () => { this.getData(this.state.searchValue) })
      this.setState({ tabChangeLoading: true }, () => { this.getData(this.state.searchValue, state.page) })
    }
  }

  restoreUser = (userId) => {
    axios.post(`${urls.StaffV2}restore_user/`, {
      'user_id': userId
    }, {
      headers: {
        Authorization: 'Bearer ' + this.props.user
      }
    }).then(res => {
      this.props.alert.success(res.data.response)
      this.setState({ tabChangeLoading: true }, () => { this.getData(null, this.state.pageNo) })
    })
      .catch(err => {
        console.log(err)
      })
  }
  showColumn (mode) {
    let{ TabValue } = this.state
    if (mode === 'restore' && TabValue === 0) {
      return false
    } else {
      return true
    }
  }
  render () {
    let { classes } = this.props
    const columns = [
      {
        Header: 'Staff Name',
        accessor: 'user.first_name',
        maxWidth: 120
      },
      {
        Header: 'Mobile',
        accessor: 'contact_no',
        maxWidth: 120
      },
      {
        Header: 'Email',
        accessor: 'user.email',
        maxWidth: 120
      },
      {
        Header: 'User Name',
        accessor: 'user.username',
        maxWidth: 120
      },
      {
        Header: 'Erp Code',
        accessor: 'erp_code',
        maxWidth: 120
      },
      {
        Header: 'Branch',
        accessor: 'branch_fk.branch_name',
        maxWidth: 100
      },
      {
        Header: 'Designation',
        accessor: 'designation.designation_name',
        maxWidth: 90
      },
      {
        Header: 'Role',
        accessor: 'role_name',
        maxWidth: 100
      },
      {
        Header: 'Department',
        accessor: 'department_fk.department_name',
        maxWidth: 90
      },
      {
        id: 'x',
        Header: 'Actions',

        minWidth: 120,
        accessor: props => {
          return (
            <div>
              {this.role === 'Admin' && this.state.branchValue !== 'Central' ? <IconButton
                aria-label='Login As'
                onClick={() => this.switchUser(props.user.id)}
                className={classes.margin}
              >
                <SwapHorizontalIcon fontSize='small' />
              </IconButton> : ''}
              <IconButton
                aria-label='Edit'
                onClick={e => {
                  e.stopPropagation()
                  this.props.history.push(
                    '/staff/edit/' + props.user.id
                  )
                }}
                className={classes.margin}
              >
                {this.role !== 'CFO' && <EditIcon fontSize='small' />}
              </IconButton>
              {
                props.user.is_active & (this.role === 'Admin' || this.role === 'Principal' || this.role === 'EA Academics') ? (
                  <IconButton
                    aria-label='Delete'
                    onClick={(e) => this.deleteHandler(props.user.id)}
                    className={classes.margin}
                  >
                    {!props.is_delete && <DeleteIcon fontSize='small' />}
                  </IconButton>
                ) : ('')
              }
            </div>
          )
        }
      },
      {
        id: 'restore',
        Header: 'Restore',
        show: this.showColumn('restore'),
        minWidth: 120,
        accessor: props => {
          console.log(props, 'pros')
          return (
            <div>
              {
                (!props.user.is_active || props.is_delete) && (this.role === 'Admin' || this.role === 'Principal' || this.role === 'EA Academics') ? (
                  <IconButton
                    aria-label='Delete'
                    onClick={(e) => this.restoreUser(props.user.id)}
                    className={classes.margin}
                  >
                    <Restore />
                  </IconButton>
                ) : ('')
              }
            </div>
          )
        }
      }
    ]
    return (
      <React.Fragment>
        <Toolbar
          floatRight={
            <React.Fragment>
              {this.state.id &&
              <React.Fragment>
                <Button href={this.state.csv.href}>{this.state.csv.label}</Button>
                <Button href={this.state.excel.href}>{this.state.excel.label}</Button>
              </React.Fragment>
              }
              {this.role !== 'CFO' && <RouterButton value={addStaff} />}
              {this.role !== 'CFO' && <RouterButton value={addStaffExcel} />}
            </React.Fragment>
          }>
          <OmsSelect
            label={'Branch'}
            defaultValue={this.state.id}
            options={this.role === 'BDM'
              ? this.state.branchData
              : this.props.branches
                ? this.props.branches.map(branch => ({
                  value: branch.id,
                  label: branch.branch_name
                }))
                : []
            }
            disabled={this.role === 'Principal' || this.role === 'AcademicCoordinator' ||
              this.role === 'FOE' || this.role === 'EA Academics'}
            change={this.handleClick}
          />
          <div className={classes.grow} />
          <div className={classes.search}>
            <div className={classes.searchIcon}>
              <SearchIcon />
            </div>
            <InputBase
              placeholder='Search…'
              classes={{
                root: classes.inputRoot,
                input: classes.inputInput
              }}
              value={this.state.searchValue}
              onChange={this.handleSearch}
              onBlur={(e) => { e.target.value.length < 0 && this.setState({ searching: false }) }}
              onFocus={(e) => { e.target.value.length > 0 && this.setState({ searching: true }) }}
            />
          </div>

        </Toolbar>
        <Tabs value={this.state.TabValue} indicatorColor='primary' textColor='primary' onChange={this.handleChangeTab}>
          <Tab tab='0' label='Staff' />
          <Tab tab='1'label='Deleted Staff' />
        </Tabs>
        <ReactTable
          manual
          // {...this.state.pageNo === 0 ? { page: 0 } : this.state.pageNo}
          loading={this.state.tabChangeLoading}
          showPagination
          showPageSizeOptions={false}
          defaultPageSize={5}
          columns={columns}
          SubComponent={this.subComponent}
          expanded={this.state.expanded}
          onExpandedChange={expanded => this.setState({ expanded })}
          // onFetchData={this.fetchTabsData}
          onPageChange={(a) => {
            this.setState({ pageNo: a, tabChangeLoading: true }, () => { this.getData(null, a) })
          }}
          page={this.state.pageNo}
          pages={this.state.totalPages}
          data={this.state.allStaffs ? this.state.allStaffs.results : []}
        />
      </React.Fragment>
    )
  }
}
const mapStateToProps = state => ({
  branches: state.branches.items,
  staffs: state.staffs,
  staffResult: state.staffSearch,
  staffTabs: state.staffTabs,
  user: state.authentication.user,
  roles: state.roles.items
})

const mapDispatchToProps = dispatch => ({
  listBranches: () => dispatch(apiActions.listBranches()),
  listStaffs: (branchId, pageId = 1) => dispatch(apiActions.listStaffs(branchId, pageId)),
  listStaffsTab: (branchId, pageId = 1, isDelete) => dispatch(apiActions.listStaffsTab(branchId, pageId, isDelete)),
  listStaffsSearch: (branchId, pageId = 1, isDelete, role, search) => dispatch(apiActions.listStaffsSearch(branchId, pageId, isDelete, role, search)),
  loadRoles: dispatch(apiActions.listRoles())
})

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(withRouter(Staff)))
