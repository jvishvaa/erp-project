import React from 'react'
import { withStyles } from '@material-ui/core/styles'
import { withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import { throttle, debounce } from 'throttle-debounce'
import SearchIcon from '@material-ui/icons/Search'
import { Popper, Fade, Paper, Grid, ListItemSecondaryAction } from '@material-ui/core'
import EditIcon from '@material-ui/icons/EditOutlined'
import { fade } from '@material-ui/core/styles/colorManipulator'
import IconButton from '@material-ui/core/IconButton'
import List from '@material-ui/core/List'
import ListItemText from '@material-ui/core/ListItemText'
import ListSubheader from '@material-ui/core/ListSubheader'
import axios from 'axios'
import ListItem from '@material-ui/core/ListItem'
import Drawer from '@material-ui/core/Drawer'
import InputBase from '@material-ui/core/InputBase'
import CircularProgress from '@material-ui/core/CircularProgress'
import LinearProgress from '@material-ui/core/LinearProgress'
import SwapHorizontalIcon from '@material-ui/icons/SwapHorizOutlined'
import DeleteIcon from '@material-ui/icons/Delete'
import data from '../../components/all_pages.json'
import getObjects from '../../components/findInJSON.js'
import './globalSearch.css'
import { apiActions } from '../../_actions'
import { urls } from '../../urls'
// console.warn(mappings)
const drawerWidth = 240
let Results = data
const styles = theme => ({
  root: {
    display: 'flex'
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen
    })
  },
  appBarShift: {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen
    })
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
  },
  menuButton: {
    marginLeft: 8,
    marginRight: 16
  },
  hide: {
    display: 'none'
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
    whiteSpace: 'nowrap'
  },
  drawerOpen: {
    width: drawerWidth,
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen
    })
  },
  drawerClose: {
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen
    }),
    overflowX: 'hidden',
    width: 64,
    [theme.breakpoints.up('sm')]: {
      width: 64
    }
  },
  listItemTextOpen: {
    opacity: 1.0,
    display: 'block',
    minWidth: 150,
    transition: theme.transitions.create(['all'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen
    })
  },
  bodyContentClose: {
    minWidth: 'calc( 100vw - 64px )',
    maxWidth: 'calc( 100vw - 64px )',
    transition: theme.transitions.create(['all'], {
      duration: 400
    })
  },
  bodyContentOpen: {
    minWidth: 'calc( 100vw - 240px )',
    maxWidth: 'calc( 100vw - 240px )',
    transition: theme.transitions.create(['all'], {
      duration: 400
    })
  },
  listItemTextClose: {
    opacity: 0.0,
    minWidth: 150,
    transition: theme.transitions.create(['all'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen
    })
  },
  expandIconOpen: {
    opacity: 1.0,
    transition: theme.transitions.create(['all'], {
      easing: theme.transitions.easing.sharp,
      duration: 1000
    })
  },
  expandIconClose: {
    opacity: 0.0,
    transition: theme.transitions.create(['all'], {
      easing: theme.transitions.easing.sharp,
      duration: 30
    })
  },
  toolbar: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: '0 8px',
    ...theme.mixins.toolbar
  },
  grow: {
    flexGrow: 1
  },
  content: {
    flexGrow: 1
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
  searchDropdown: {
    paddingTop: theme.spacing.unit,
    paddingRight: theme.spacing.unit,
    paddingBottom: theme.spacing.unit,
    paddingLeft: theme.spacing.unit * 10,
    transition: theme.transitions.create('width')
    // width: '100%',
    // [theme.breakpoints.up('sm')]: {
    //   maxWidth: 700,
    //   '&:focus': {
    //     width: 200
    //   }
    // }
  }
})
class GlobalSearch extends React.Component {
  constructor () {
    super()
    this.state = {
      open: false,
      // sections: null,
      sectionData: null,
      searching: false,
      results: {},
      searchResults: {},
      openGlobalFilter: false,
      staffDetailsIndex: -1,
      studentDetailsIndex: -1,
      search: [],
      totalStaffPages: 1,
      totalStudentPages: 1,
      currentStaffPage: 1,
      currentStudentPage: 1,
      staffs: [],
      students: [],
      loading: true,
      staffDetailsLoading: false,
      studentDetailsLoading: false,
      studentDetails: {},
      q: '',
      hasError: false
    }
    this.autocompleteSearchDebounced = debounce(500, this.autocompleteSearch)
    this.autocompleteSearchThrottled = throttle(500, this.autocompleteSearch)
    this.userProfile = JSON.parse(localStorage.getItem('user_profile'))
    this.openStaffDetails = this.openStaffDetails.bind(this)
    this.openStudentDetails = this.openStudentDetails.bind(this)
    this.searchInputRef = React.createRef()
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
  deleteHandler = (id) => {
    var updatedList = urls.Student + id + '/'
    axios
      .delete(updatedList, {
        headers: {
          Authorization: 'Bearer ' + this.props.user
        }
      })
      .then((res) => {
        this.props.alert.success('Deleted Student Successfully')
      })
      .catch(function (error) {
        console.log("Error: Couldn't fetch data from " + urls.Student, error)
      })
  }

  openStaffDetails (userId) {
    this.setState({ openStaffDetails: true, staffDetailsLoading: true })
    var finalUrl = urls.Staff + userId + '/'
    axios
      .get(finalUrl, {
        headers: {
          Authorization: 'Bearer ' + this.props.user
        }
      })
      .then(res => {
        var staffDetails = res['data']['staff_details'][0]
        this.setState({ staffDetailsLoading: false, staffDetails })
      })
      .catch(function (error) {
        console.log("Error: Couldn't fetch data from " + urls.Staff + error)
      })
  }
  openStudentDetails (userId) {
    this.setState({ openStudentDetails: true, studentDetailsLoading: true })
    var finalUrl = urls.Student + userId + '/'
    axios
      .get(finalUrl, {
        headers: {
          Authorization: 'Bearer ' + this.props.user
        }
      })
      .then(res => {
        var studentDetails = res['data'][0]['student']
        this.setState({ studentDetailsLoading: false, studentDetails })
      })
      .catch(function (error) {
        console.log("Error: Couldn't fetch data from " + urls.Staff + error)
      })
  }
  componentDidMount () {
    this.props.listSections()
    this.props.listSubjects()
    this.role = this.userProfile.personal_info.role
    let academicProfile = this.userProfile.academic_profile
    if (this.role === 'Principal' || this.role === 'BDM') {
      this.setState({
        branchId: academicProfile.branch_id,
        branchValue: { value: academicProfile.branch_id, label: academicProfile.branch }
      })
    }
  }

  handleDrawerOpen = () => {
    this.setState({ open: true })
  };
  handleClose = () => {
    this.setState({ menuAnchorEl: null })
  };
  handleDrawerToggle = () => {
    if (this.state.open) {
      this.setState({ menus: {} })
      this.setState({ open: false })
    } else {
      this.setState({ menus: {},
        popper: {},
        popperHover: {},
        anchorEl: {},
        openPopperMenus: {} })
      this.setState({ open: true })
    }
  };
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
  static getDerivedStateFromProps (props, state) {
    function parseNewData (newData) {
      let students = []
      let staffs = []
      if (state.q.length > 0) {
        if (newData.student.data) {
          let studentData = newData.student.data
          Object.values(studentData).forEach(page => {
            students.push(...page)
          })
        }
        if (newData.staff.data) {
          let staffData = newData.staff.data
          Object.values(staffData).forEach(page => {
            staffs.push(...page)
          })
        }
        if (newData.error) {
          return { hasError: true }
        }
        return {
          searchResults: newData,
          staffs,
          hasError: false,
          students,
          totalStaffPages: newData.staff.totalPages,
          totalStudentPages: newData.student.totalPages
        }
      }
    }

    if (props.globalSearchResults !== state.searchResults) {
      return parseNewData(props.globalSearchResults)
    }
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

  autocompleteSearch = (q, pageId, isDelete) => {
    q.length === 0 && this.setState({ staffs: [], students: [] }, () => console.log(this.state.staffs, this.state.students))
    var user = JSON.parse(localStorage.getItem('user_profile'))
    let role = user.personal_info.role
    if (role === 'Principal' || role === 'BDM') {
      var branchId = user.academic_profile.branch_id
      this.props.globalSearch(q, pageId, branchId, isDelete ? 'True' : 'False')
    } else if (role === 'Admin') {
      this.props.globalSearch(q, pageId, null, isDelete ? 'True' : 'False')
    }
    this.setState({ results: getObjects(Results, q, isDelete) })
  }
  toggleModal = () => {
    this.setState({ openStaffDetails: !this.state.openStaffDetails })
  }
  toggleModal = () => {
    this.setState({ openStudentDetails: !this.state.openStudentDetails })
  }
  returnSubject = (id) => {
    let x = ' '
    this.props.subjects.forEach((v) => {
      if (v.id === id) {
        x = v
      }
    })
    return x.subject_name
  }
  handleScroll = (event, type) => {
    let { currentStaffPage, currentStudentPage, totalStaffPages, totalStudentPages, branchId } = this.state
    let { target } = event
    // let { prevState } = this.props
    if (target.scrollTop + target.clientHeight === target.scrollHeight) {
      // if (this.props.globalSearchResults.staff) {
      if (type === 'staff') {
        currentStaffPage + 1 <= totalStaffPages && this.setState({ currentStaffPage: currentStaffPage + 1 }, () => this.props.globalSearch(this.state.q, this.state.currentStaffPage, branchId, this.state.isDelete ? 'True' : 'False'))
      } else if (type === 'student') {
        currentStudentPage + 1 <= totalStudentPages && this.setState({ currentStudentPage: currentStudentPage + 1 }, () => this.props.globalSearch(this.state.q, this.state.currentStudentPage, branchId, this.state.isDelete ? 'True' : 'False'))
      }
      // }
    }
  }

  render () {
    let { classes } = this.props
    const { staffs, students, staffDetailsLoading, studentDetailsLoading, staffDetails, studentDetails } = this.state
    return (
      <React.Fragment>
        <div style={{ display: this.props.isMobile ? 'none' : 'block', marginRight: 8 }} className={classes.search}>
          <div className={classes.searchIcon}>
            <SearchIcon />
          </div>
          <InputBase
            placeholder='Search…'
            classes={{
              root: classes.inputRoot,
              input: classes.inputInput
            }}
            onBlur={() => this.setState({ searching: false })}
            onFocus={() => this.setState({ searching: true })}
            inputRef={this.searchInputRef}
            onChange={this.changeQuery}
          />
        </div>
        <Popper open={this.state.searching} className={classes.searchDropdown} placement='bottom' style={{ position: 'fixed', top: this.searchInputRef.current && this.searchInputRef.current.getBoundingClientRect().top + 32, left: 'auto', right: `calc(100vw - ${(this.searchInputRef.current && this.searchInputRef.current.getBoundingClientRect().left + this.searchInputRef.current.getBoundingClientRect().width)}px)`, zIndex: 3000 }} transition>
          {({ TransitionProps }) => (
            <Fade {...TransitionProps} timeout={350}>
              <Paper>
                <Grid container style={{ flexDirection: 'row' }}>
                  {this.props.globalSearchResults && this.props.globalSearchResults.staff && !this.props.globalSearchResults.staff.loading ? <React.Fragment>
                    <Grid item>
                      <Grid container style={{ flexDirection: 'row', paddingBottom: 12, paddingTop: 12, paddingLeft: 16, backgroundColor: '#eee', paddingRight: 16, minWidth: 374 }}>
                        <Grid onScroll={(event) => this.handleScroll(event, 'staff')} style={{ paddingRight: 8, maxHeight: 385, height: 300, overflow: 'auto' }} item>
                          {this.props.globalSearchResults && <List style={{ minWidth: 61 }} subheader={<ListSubheader style={{ background: 'rgb(238, 238, 238)', width: '100%' }}>Staffs</ListSubheader>} >
                            {this.props.globalSearchResults && this.props.globalSearchResults.staff && staffs.map((result, index) => {
                              return <ListItem style={{ width: 324 }} button onClick={() => { console.log('I amcalled...'); this.openStaffDetails(result.user.id) }}><ListItemText primary={result && result.user && result.user.first_name} secondary={result && result.user && result.user.email} /></ListItem>
                            })}
                          </List>}
                        </Grid>
                      </Grid>
                    </Grid>

                    <Grid item>
                      <Grid container style={{ flexDirection: 'row', paddingBottom: 12, paddingTop: 12, paddingLeft: 16, backgroundColor: '#eee', paddingRight: 16, minWidth: 374 }}>
                        <Grid onScroll={(event) => this.handleScroll(event, 'student')} style={{ paddingRight: 8, maxHeight: 385, height: 300, overflow: 'auto' }} item>
                          {this.props.globalSearchResults && <List style={{ minWidth: 61 }} subheader={<ListSubheader style={{ background: 'rgb(238, 238, 238)', width: '100%' }}>Students</ListSubheader>} >
                            {this.props.globalSearchResults && this.props.globalSearchResults.student && students.map((result, index) => {
                              return <ListItem style={{ width: 324 }} button onClick={() => { console.log('I amcalled...'); this.openStudentDetails(result.id) }}>
                                <ListItemText primary={result.name} secondary={result.erp} />
                                <ListItemSecondaryAction>
                                  { (this.role === 'Admin') && <IconButton
                                    aria-label='Delete'
                                    onClick={(e) => this.deleteHandler(result.id)}
                                    className={classes.margin}
                                  >
                                    <DeleteIcon fontSize='small' />
                                  </IconButton> }
                                </ListItemSecondaryAction>
                              </ListItem>
                            })}
                          </List>}
                        </Grid>
                      </Grid>
                    </Grid>
                  </React.Fragment> : <Grid container style={{ flexDirection: 'row', backgroundColor: '#eee', minHeight: 324, minWidth: 748, flexGrow: 1 }}>{this.state.q.length > 0 ? <LinearProgress style={{ width: '100%' }} color='secondary' variant='query' /> : <span style={{ padding: 16 }}>Type something to search.</span>}</Grid>}
                </Grid>
                <Grid container>
                  {this.props.globalSearchResults && this.props.globalSearchResults.staff && this.props.globalSearchResults.staff.error && <Grid style={{ padding: 8, width: '100%', backgroundColor: '#eee' }} xs={12} item>Something went wrong.</Grid>}
                </Grid>
              </Paper>
            </Fade>
          )}
        </Popper>
        <Drawer
          anchor='right'
          open={this.state.openStaffDetails}
          onClose={() => this.setState({ openStaffDetails: false })}
        >
          {staffDetailsLoading ? <div style={{ display: 'flex', minWidth: 300, minHeight: 200, alignItems: 'center', justifyContent: 'center' }}><CircularProgress className={classes.progress} color='secondary' /></div>
            : staffDetails && <Grid container style={{ flexDirection: 'column' }}>
              <Grid container style={{ flexDirection: 'row', paddingBottom: 12, paddingTop: 12, paddingLeft: 16, backgroundColor: '#eee', paddingRight: 16 }}>
                <Grid style={{ paddingRight: 8 }} item />
                <h3><Grid item>{staffDetails.user ? staffDetails.user.first_name : 'NIL'}</Grid></h3>
              </Grid>
              <Grid item>
                <Grid container style={{ flexDirection: 'row', paddingBottom: 12, paddingTop: 12, paddingLeft: 16, paddingRight: 16 }}>
                  <h5><Grid style={{ paddingRight: 8 }} item>Mobile:</Grid></h5>
                  <Grid item>{staffDetails.contact_no ? staffDetails.contact_no : 'NIL'}</Grid>
                </Grid>
              </Grid>
              <Grid item>
                <Grid container style={{ flexDirection: 'row', paddingBottom: 12, paddingTop: 12, paddingLeft: 16, backgroundColor: '#eee', paddingRight: 16 }}>
                  <h5><Grid style={{ paddingRight: 8 }} item>Email:</Grid></h5>
                  <Grid item>{staffDetails.user.email ? staffDetails.user.email : 'NIL'}</Grid>
                </Grid>
              </Grid>
              <Grid item>
                <Grid container style={{ flexDirection: 'row', paddingBottom: 12, paddingTop: 12, paddingLeft: 16, paddingRight: 16 }}>
                  <h5><Grid style={{ paddingRight: 8 }} item>ERP Code:</Grid></h5>
                  <Grid item>{staffDetails.erp_code ? staffDetails.erp_code : 'NIL'}</Grid>
                </Grid>
              </Grid>
              <Grid item>
                <Grid container style={{ flexDirection: 'row', paddingBottom: 12, paddingTop: 12, paddingLeft: 16, backgroundColor: '#eee', paddingRight: 16 }}>
                  <h5> <Grid style={{ paddingRight: 8 }} item>Branch:</Grid></h5>
                  <Grid item>{staffDetails.branch_fk && staffDetails.branch_fk.branch_name ? staffDetails.branch_fk && staffDetails.branch_fk.branch_name : 'NIL'}</Grid>
                </Grid>
              </Grid>

              <Grid item>
                <Grid container style={{ flexDirection: 'row', paddingBottom: 12, paddingTop: 12, paddingLeft: 16, paddingRight: 8 }}>
                  <h5> <Grid style={{ paddingRight: 8 }} item>Designation:</Grid></h5>
                  <Grid item>{ staffDetails.designation && staffDetails.designation.designation_name ? staffDetails.designation && staffDetails.designation.designation_name : 'NIL'}

                  </Grid>
                </Grid>
              </Grid>
              <Grid item>
                <Grid container style={{ flexDirection: 'row', paddingBottom: 12, paddingTop: 12, paddingLeft: 16, backgroundColor: '#eee', paddingRight: 16 }}>
                  <h5><Grid style={{ paddingRight: 8 }} item>City:</Grid></h5>
                  <Grid item>{staffDetails.branch_fk && staffDetails.branch_fk.city ? staffDetails.branch_fk && staffDetails.branch_fk.city : 'NIL'}</Grid>
                </Grid>
              </Grid>
              <Grid item>
                <Grid container style={{ flexDirection: 'row', paddingBottom: 12, paddingTop: 12, paddingLeft: 16, paddingRight: 16 }}>
                  <h5> <Grid style={{ paddingRight: 8 }} item>Address:</Grid></h5>
                  <Grid item>{staffDetails.branch_fk && staffDetails.branch_fk.address ? staffDetails.branch_fk && staffDetails.branch_fk.address : 'NIL'}</Grid>
                </Grid>
              </Grid>
              <Grid item>
                <Grid container style={{ flexDirection: 'row', paddingBottom: 12, paddingTop: 12, paddingLeft: 16, backgroundColor: '#eee', paddingRight: 16 }}>
                  <h5> <Grid style={{ paddingRight: 8 }} item>Department:</Grid></h5>
                  <Grid item>{staffDetails.department_fk && staffDetails.department_fk.department_name ? staffDetails.department_fk && staffDetails.department_fk.department_name : 'NIL'}</Grid>
                </Grid>
              </Grid>
              <Grid item>
                <IconButton
                  aria-label='Edit'
                  onClick={e => {
                    this.setState({ openStaffDetails: false })
                    e.stopPropagation()
                    this.props.history.push(
                      '/staff/edit/' + staffDetails.user.id
                    )
                  }}
                >
                  <EditIcon fontSize='small' />
                </IconButton>
                {this.role === 'Admin' && this.state.branchValue !== 'Central' ? <IconButton
                  aria-label='Login As'
                  onClick={() => this.switchUser(staffDetails.user.id)}
                  className={classes.margin}
                >
                  <SwapHorizontalIcon fontSize='small' />
                </IconButton> : ''}
              </Grid>
            </Grid>}
        </Drawer>
        <Drawer
          anchor='right'InputBase
          open={this.state.openStudentDetails}
          onClose={() => this.setState({ openStudentDetails: false })}
        >
          {studentDetailsLoading ? <div style={{ display: 'flex', minWidth: 300, minHeight: 200, alignItems: 'center', justifyContent: 'center' }}><CircularProgress className={classes.progress} color='secondary' /></div> : (studentDetails && <Grid container >

            <Grid item>
              <Grid container style={{ flexDirection: 'column' }}>

                <Grid item>
                  <Grid container style={{ flexDirection: 'row', paddingBottom: 12, paddingTop: 12, paddingLeft: 16, backgroundColor: '#eee', paddingRight: 16 }}>
                    <Grid style={{ paddingRight: 8 }} item />
                    <h3><Grid item>{studentDetails.name ? studentDetails.name : 'NIL'}</Grid></h3>
                  </Grid>
                </Grid>

                <Grid item>
                  <Grid container style={{ flexDirection: 'row', paddingBottom: 12, paddingTop: 12, paddingLeft: 16, paddingRight: 16 }}>
                    <h5> <Grid style={{ paddingRight: 8 }} item>Enrollment Code:</Grid></h5>
                    <Grid item>{studentDetails.erp ? studentDetails.erp : 'NIL'}</Grid>
                  </Grid>
                </Grid>

                <Grid item>
                  <Grid container style={{ flexDirection: 'row', paddingBottom: 12, paddingTop: 12, paddingLeft: 16, backgroundColor: '#eee', paddingRight: 16 }}>
                    <h5><Grid style={{ paddingRight: 8 }} item>Admission Number:</Grid></h5>
                    <Grid item>{studentDetails.admission_number ? studentDetails.admission_number : 'NIL'}</Grid>
                  </Grid>
                </Grid>

                <Grid item>
                  <Grid container style={{ flexDirection: 'row', paddingBottom: 12, paddingTop: 12, paddingLeft: 16, paddingRight: 16 }}>
                    <h5>  <Grid style={{ paddingRight: 8 }} item>Gr Number:</Grid></h5>
                    <Grid item>{studentDetails.gr_number ? studentDetails.gr_number : 'NIL'}</Grid>
                  </Grid>
                </Grid>

                <Grid item>
                  <Grid container style={{ flexDirection: 'row', paddingBottom: 12, paddingTop: 12, paddingLeft: 16, backgroundColor: '#eee', paddingRight: 16 }}>
                    <h5>  <Grid style={{ paddingRight: 8 }} item>Date of Admission:</Grid></h5>
                    <Grid item>{studentDetails.admission_date ? studentDetails.admission_date : 'NIL'}</Grid>
                  </Grid>
                </Grid>

                <Grid item>
                  <Grid container style={{ flexDirection: 'row', paddingBottom: 12, paddingTop: 12, paddingLeft: 16, paddingRight: 16 }}>
                    <h5>  <Grid style={{ paddingRight: 8 }} item>Date Of Birth:</Grid></h5>
                    <Grid item>{studentDetails.date_of_birth ? studentDetails.admission_date : 'NIL'}</Grid>
                  </Grid>
                </Grid>

                <Grid item>
                  <Grid container style={{ flexDirection: 'row', paddingBottom: 12, paddingTop: 12, paddingLeft: 16, backgroundColor: '#eee', paddingRight: 16 }}>
                    <h5>  <Grid style={{ paddingRight: 8 }} item>Gender:</Grid></h5>
                    <Grid item>{studentDetails.gender ? studentDetails.gender : 'NIL'}</Grid>
                  </Grid>
                </Grid>

                <Grid item>
                  <Grid container style={{ flexDirection: 'row', paddingBottom: 12, paddingTop: 12, paddingLeft: 16, paddingRight: 16 }}>
                    <h5>  <Grid style={{ paddingRight: 8 }} item>Roll Number:</Grid></h5>
                    <Grid item>{studentDetails.roll_no ? studentDetails.roll_no : 'NIL'}</Grid>
                  </Grid>
                </Grid>

                <Grid item>
                  <Grid container style={{ flexDirection: 'row', paddingBottom: 12, paddingTop: 12, paddingLeft: 16, backgroundColor: '#eee', paddingRight: 16 }}>
                    <h5>  <Grid style={{ paddingRight: 8 }} item>Adhar Number:</Grid></h5>
                    <Grid item>{studentDetails.aadhar_number ? studentDetails.aadhar_number : 'NIL'}</Grid>
                  </Grid>
                </Grid>

                <Grid item>
                  <Grid container style={{ flexDirection: 'row', paddingBottom: 12, paddingTop: 12, paddingLeft: 16, paddingRight: 16 }}>
                    <h5>   <Grid style={{ paddingRight: 8 }} item>Section Name:</Grid></h5>
                    <Grid item>{studentDetails.section ? studentDetails.section.section_name : 'NIL'}</Grid>

                  </Grid>
                </Grid>

                <Grid item>
                  <Grid container style={{ flexDirection: 'row', paddingBottom: 12, paddingTop: 12, paddingLeft: 16, backgroundColor: '#eee', paddingRight: 16 }}>
                    <h5>  <Grid style={{ paddingRight: 8 }} item>Address:</Grid></h5>
                    <Grid item>{studentDetails.address ? studentDetails.address : 'NIL'}</Grid>
                  </Grid>
                </Grid>

                <Grid item>
                  <Grid container style={{ flexDirection: 'row', paddingBottom: 12, paddingTop: 12, paddingLeft: 16, paddingRight: 16 }}>
                    <h5>  <Grid style={{ paddingRight: 8 }} item>Using Transport :</Grid></h5>
                    <Grid item>{studentDetails.transport ? 'True' : 'False'}</Grid>
                  </Grid>
                </Grid>

                <Grid item>
                  <Grid container style={{ flexDirection: 'row', paddingBottom: 12, paddingTop: 12, paddingLeft: 16, backgroundColor: '#eee', paddingRight: 16 }}>
                    <h5>   <Grid style={{ paddingRight: 8 }} item>Category :</Grid></h5>
                    <Grid item>{studentDetails.stay_category ? studentDetails.stay_category : 'NIL'}</Grid>
                  </Grid>
                </Grid>

                <Grid item>
                  <Grid container style={{ flexDirection: 'row', paddingBottom: 12, paddingTop: 12, paddingLeft: 16, paddingRight: 16 }}>
                    {/* <Grid style={{ paddingRight: 8 }} item>City:</Grid> */}
                    <Grid item> <div>
                      <IconButton
                        aria-label='Edit'
                        onClick={e => {
                          this.setState({ openStudentDetails: false })
                          e.stopPropagation()
                          this.props.history.push(
                            '/student/edit/' + studentDetails.id
                          )
                        }}
                        className={classes.margin}

                      >
                        <EditIcon fontSize='small' />
                      </IconButton>
                    </div></Grid>
                    <Grid item>
                      {this.role === 'Admin' && studentDetails.is_active && <IconButton
                        aria-label='Login As'
                        onClick={() => this.switchUser(studentDetails.user)}
                        className={classes.margin}
                      >
                        <SwapHorizontalIcon fontSize='small' />
                      </IconButton>}
                    </Grid>
                  </Grid>
                </Grid>

              </Grid>
            </Grid>

          </Grid>)}
        </Drawer>

      </React.Fragment>

    )
  }
}

const mapDispatchToProps = dispatch => ({
  listStaffsSearch: (branchId, searchParameter, pageId = 1) => dispatch(apiActions.listStaffsSearch(branchId, searchParameter, pageId, false)),
  globalSearch: (searchParameter, pageId = 1, branchId, isDelete = 'false') => dispatch(apiActions.globalSearch(searchParameter, pageId, branchId, isDelete)),
  listStudentSearch: (searchParameter, sectionId, pageId = 1) => dispatch(apiActions.listStudentSearch(searchParameter, sectionId, pageId, false)),
  listSections: () => dispatch(apiActions.listSections()),
  listSubjects: () => dispatch(apiActions.listSubjects())

})
const mapStateToProps = state => {
  return {
    globalSearchResults: state.globalSearch,
    sections: state.sections.items,
    subjects: state.subjects.items,
    user: state.authentication.user
  }
}
export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles, { withTheme: true })(withRouter(GlobalSearch)))
