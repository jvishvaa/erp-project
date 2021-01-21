import React from 'react'
// import IconButton from '@material-ui/core/IconButton'
import Menu from '@material-ui/core/Menu/Menu'
import List from '@material-ui/core/List'
import Typography from '@material-ui/core/Typography'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'
import MenuItem from '@material-ui/core/MenuItem/MenuItem'
import Person from '@material-ui/icons/Person'
import Avatar from '@material-ui/core/Avatar'
import { connect } from 'react-redux'
import AppBar from '@material-ui/core/AppBar'
import Snackbar from '@material-ui/core/Snackbar'
import CloseIcon from '@material-ui/icons/Close'
// import SettingsIcon from '@material-ui/icons/Settings'
import Card from '@material-ui/core/Card'
import classNames from 'classnames'
import Toolbar from '@material-ui/core/Toolbar'
import { withRouter } from 'react-router-dom'
import IconButton from '@material-ui/core/IconButton'
import Modal from '@material-ui/core/Modal'
import { withStyles } from '@material-ui/core'
import axios from 'axios'
// import _ from 'lodash'
import TrackerComponent from '../../trackercomponent'
import SidebarToggle from './sidebarToggle'
import GlobalSearch from '../../../_components/globalsearch'
import StudentContactNumber from '../../masters/student/studentContactNumber'
import { userActions, apiActions } from '../../../_actions'
import Notifications from './notifications'
import { messages } from '../../Firebase/bloc'
import UserSwitcher from './userSwitcher'
import { urls } from '../../../urls'
import AddGuestChild from '../../aol/addGuestStudent'
import StudentCount from '../../aol/studentCount'

const styles = theme => ({
  paper: {
    position: 'absolute',
    width: theme.spacing.unit * 50,
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[5],
    padding: theme.spacing.unit * 4,
    outline: 'none'
  }
})
class Topbar extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      menuAnchorEl: null,
      open: false,
      openSnackbar: false,
      snackbarData: '',
      withoutBase: props.view.withoutBase,
      user: {},
      noOfTimesSubscribed: 0,
      listAcadSession: [],
      acadSessionAnchorEl: null,
      selectedIndex: 0,
      selectedSession: '',
      currentAcadSession: 'Academic year'

    }
    this.handleCloseSnackbar = this.handleCloseSnackbar.bind(this)
    this.userProfile = JSON.parse(localStorage.getItem('user_profile')).personal_info
    this.role = this.userProfile.role
    this.token = this.userProfile.token
  }
  componentDidMount () {
    messages.subscribe(data => this.setState({ openSnackbar: true, snackbarData: data['firebase-messaging-msg-data'].notification.body }))
    if (this.role !== 'Student' && this.role !== 'GuestStudent' && this.role !== 'AOLAdmin') {
      this.getAcadSessions()
        .then(res => { this.setState({ listAcadSession: [...res.data.session_year] }) })
        .catch(err => { console.log(err) })
      this.getCurrentAcadSession()
        .then(res => { this.setState({ currentAcadSession: res.data.acad_session, currentYear: res.data.acad_session }) })
        .catch(err => { console.log(err) })
    }
  }
  handleOpen = () => {
    this.setState({ open: true })
  }

  handlerClose = () => {
    this.setState({ open: false })
  }
  handleClose = () => {
    this.setState({ menuAnchorEl: null })
  }
  handleMenu = event => {
    this.setState({ menuAnchorEl: event.currentTarget })
  }
  openGlobalFilter = () => {
    this.setState(state => ({ openGlobalFilter: true }))
  }

  handleCloseFilter = () => {
    this.setState(state => ({ openGlobalFilter: false }))
  }
  handleLogout = () => {
    this.props.logout()
    this.setState({ anchorEl: null })
  }
  handleEditProfile = (event) => {
    console.log('id')
    // e.props.stopPropagation()
    console.log(this.props, 'id')
    let { history } = this.props
    event.preventDefault()
    var user = JSON.parse(localStorage.getItem('user_profile'))
    console.log(user.personal_info.user_id, 'ID')
    history.push(
      '/student/edit/' + user.student_id + '/'
    )
  }
  handleSettings = (event) => {
    console.log('id')
    // e.props.stopPropagation()
    console.log(this.props, 'id')
    let { history } = this.props
    event.preventDefault()
    var user = JSON.parse(localStorage.getItem('user_profile'))
    console.log(user.personal_info.user_id, 'ID')
    history.push(
      '/Settings/settings/'
    )
  }
  shouldComponentUpdate (nextProps, prevState) {
    if (this.state.menuAnchorEl !== prevState.menuAnchorEl) {
      return true
    } else if (this.state.open !== prevState.open) {
      return true
    } else if (this.state.openSnackbar !== prevState.openSnackbar) {
      return true
    } else if (nextProps.view.withoutBase !== prevState.withoutBase) {
      return true
    } else if (this.state.acadSessionAnchorEl !== prevState.acadSessionAnchorEl) {
      return true
    } else if (this.state.currentAcadSession !== prevState.currentAcadSession) {
      return true
    }
    return false
  }
  handleOpen = () => {
    this.setState({ open: true })
  }
  handleCloseContactDetails = () => {
    this.setState({ open: false })
  }
  getNotification () {
    return <Card style={{ width: 100 }}>
      {/* <  /> */}
    </Card>
  }
  handleCloseSnackbar () {
    this.setState({ openSnackbar: false })
  }

  handleSessionListItemClick =(event) => {
    this.setState({ acadSessionAnchorEl: event.currentTarget })
  }

  handleSessionChange = (event, index) => {
    this.setState({ selectedIndex: index, acadSessionAnchorEl: null, selectedSession: event.target.textContent }, () => {
      this.changeCurrentAcadSession(this.state.selectedSession, this.userProfile.user_id)
        .then(res => {
          this.props.listBranches()
          this.props.alert.success('User Academic Session Added Successfully')
          window.location.reload(true)
        })
        .catch(err => {
          console.log(err)
        })
    })
  }

  handleSessionClose = () => {
    this.setState({ acadSessionAnchorEl: null })
  }

  changeCurrentAcadSession = async (session, userId) => {
    let res = await axios.post(urls.ACADSESSION, {
      'user_id': userId,
      'acad_session': session }, {
      headers: {
        Authorization: 'Bearer ' + this.token
      }
    })

    return res
  }
  getAcadSessions = async () => {
    let result = await axios.get(urls.UTILACADEMICSESSION, {
      headers: {
        Authorization: 'Bearer ' + this.token,
        'Content-Type': 'application/json'
      }
    })
    return result
  }

  getCurrentAcadSession = async () => {
    let res = await axios.get(urls.ACADSESSION, {
      headers: {
        Authorization: 'Bearer ' + this.token,
        'Content-Type': 'application/json'
      }
    })

    return res
  }

  render () {
    var user = JSON.parse(localStorage.getItem('user_profile'))
    let firstName = user.personal_info.first_name
    let lastName = user.personal_info.second_name
    let email = user.personal_info.email
    let role = user.personal_info.role
    // console.log(role)
    // let { history } = this.props
    console.log('Teacher', role)
    if (role === 'Student') {
      try {
        var branch = user.branch_name
        var grade = user.grade_name
        var section = user.section_name
        var erp = user.erp
      } catch (err) {
        branch = ''
      }
    } else if (role === 'GuestStudent') {
      let { grade_name: gradeName } = user.academic_profile || {}
      grade = gradeName
    } else if (role === 'Teacher') {
      try {
        branch = user.academic_profile[0].branch_name
      } catch (err) {
        branch = ''
      }
    } else if (role === 'Principal' || role === 'EA Academics' || role === 'FOE') {
      try {
        branch = user.academic_profile.branch
      } catch (err) {
        branch = ''
      }
    } else if (role === 'BDM') {
      try {
        branch = user.academic_profile.branch
      } catch (err) {
        branch = ''
      }
    } else {
      branch = ''
    }

    let menuOpen = Boolean(this.state.menuAnchorEl)
    let { classes } = this.props
    let { open, openSnackbar, snackbarData, withoutBase, selectedSession, currentAcadSession } = this.state
    return !withoutBase ? <React.Fragment>
      <AppBar
        position='fixed'
        className={classNames(classes.appBar)}
      >
        <Toolbar disableGutters>
          <SidebarToggle classes={classes} />
          <Typography variant='h5' color='inherit' noWrap>

            {window.location.host.includes('alwaysonlearning.com')
              ? <React.Fragment>AOL</React.Fragment>
              : <React.Fragment> Eduvate<sup style={{ fontSize: 12 }}> beta</sup></React.Fragment>}
          </Typography>
          <TrackerComponent />

          <div className={classes.grow} />
          <Notifications />
          {role === 'AOLAdmin' ? <StudentCount /> : null}
          {role === 'AOLAdmin' ? <AddGuestChild alert={this.props.alert} /> : ''}

          {
            this.role !== 'Student' && this.role !== 'GuestStudent' && this.role !== 'AOLAdmin' ? (
              <Toolbar>
                <div>
                  <List component='nav'>
                    <ListItem
                      button
                      onClick={this.handleSessionListItemClick}
                      style={{ color: 'white' }}
                    >
                      <ListItemText
                        primary={<Typography style={{ color: '#FFFFFF' }}>{!selectedSession ? currentAcadSession : selectedSession}</Typography>}
                      />
                    </ListItem>
                  </List>
                  <Menu
                    id='lock-menu'
                    anchorEl={this.state.acadSessionAnchorEl}
                    keepMounted
                    open={Boolean(this.state.acadSessionAnchorEl)}
                    onClose={this.handleSessionClose}
                  >

                    {this.state.listAcadSession.length ? this.state.listAcadSession.map((option, index) => (
                      <MenuItem

                        key={option}
                        selected={index === this.state.selectedIndex}
                        onClick={event => this.handleSessionChange(event, index)}
                      >
                        {option}
                      </MenuItem>
                    )) : ''}
                  </Menu>
                </div>
              </Toolbar>
            )
              : ('')
          }

          <Snackbar
            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            open={openSnackbar}
            onClose={this.handleCloseSnackbar}
            action={<IconButton onClick={this.handleCloseSnackbar} color='secondary' size='small'>
              <CloseIcon />
            </IconButton>}
            ContentProps={{
              'aria-describedby': 'message-id'
            }}
            message={<span id='message-id'>{snackbarData}</span>}
          />
          {(role === 'Admin' || role === 'Principal' || role === 'BDM' || role === 'EA Academics') && <GlobalSearch alert={this.props.alert} isMobile={document.documentElement.clientWidth < 600} />}
          {/* <Firebase /> */}
          {/* </ListItem> */}
          <Menu
            id='menu-appbar'
            anchorEl={this.state.menuAnchorEl}
            anchorOrigin={{
              vertical: 'top',
              horizontal: 'right'
            }}
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right'
            }}
            open={menuOpen}
            onClose={this.handleClose}
          >
            <ListItem selected={false} alignItems='flex-start'>
              <Avatar>
                <Person />
              </Avatar>
              &nbsp;
              &nbsp;
              <ListItemText
                secondary={
                  <React.Fragment>
                    <Typography component='p' className={classes.inline} color='textPrimary'>
                      {email}
                    </Typography>
                    <Typography component='p' className={classes.inline} color='textPrimary'>
                      {erp}
                    </Typography>
                    <Typography component='p' className={classes.inline} color='textPrimary'>
                      {branch}
                    </Typography>
                    <Typography component='p' className={classes.inline} color='textPrimary'>
                      {grade}
                    </Typography>
                    <Typography component='p' className={classes.inline} color='textPrimary'>
                      {section}
                    </Typography>
                  </React.Fragment>
                }
              />

            </ListItem>
            {role === 'Student' && <UserSwitcher />}
            <MenuItem onClick={this.handleLogout}>Logout</MenuItem>

            {role === 'Student' && <MenuItem onClick={this.handleEditProfile}>Edit Profile</MenuItem>
            }
            {role === 'Student' && <MenuItem onClick={this.handleOpen}>Edit Contact Details</MenuItem>}
            {/* {<MenuItem onClick={this.handleSettings}>  <SettingsIcon style={{ marginRight: '5' }} /> Settings</MenuItem>} */}
          </Menu>

          <List>
            <ListItem dense style={{ padding: 0, paddingRight: 8, paddingLeft: 8 }} button onClick={this.handleMenu}>
              <ListItemText primaryTypographyProps={{ style: { color: '#fff', margin: 5 } }} secondaryTypographyProps={{ style: { color: '#fff' } }} primary={firstName + lastName} secondary={role.includes('GuestStudent') ? '' : role} />
              <Avatar>
                <Person />
              </Avatar>
            </ListItem>
          </List>
        </Toolbar>
      </AppBar>
      <Modal
        aria-labelledby='simple-modal-title'
        aria-describedby='simple-modal-description'
        open={open}
        onClose={this.handleCloseContactDetails}
      >
        <div style={{ width: '85vw', height: '85vh', left: 'calc(25vw/3)', top: 'calc(25vh/3)', position: 'absolute', overflow: 'auto' }} className={classes.paper} >
          <StudentContactNumber alert={this.props.alert} />
        </div>
      </Modal>
    </React.Fragment> : ''
  }
}
const mapDispatchToProps = dispatch => ({
  logout: () => dispatch(userActions.logout()),
  listBranches: () => dispatch(apiActions.listBranches())
})
const mapStateToProps = state => ({
  view: state.view,
  branches: state.branches.items
})

export default connect(mapStateToProps,
  mapDispatchToProps
)(withRouter(withStyles(styles)(Topbar)))
