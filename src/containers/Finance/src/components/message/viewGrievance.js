/* eslint-disable no-lone-blocks */
import React, { Component } from 'react'
import axios from 'axios'
import moment from 'moment'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import IconButton from '@material-ui/core/IconButton/IconButton'
import DeleteIcon from '@material-ui/icons/DeleteOutlined'
import EditIcon from '@material-ui/icons/EditOutlined'
import Button from '@material-ui/core/Button'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
import ExpandLessIcon from '@material-ui/icons/ExpandLess'
import Reply from '@material-ui/icons/Reply'
import FaceIcon from '@material-ui/icons/Face'
import SupervisorAccount from '@material-ui/icons/SupervisorAccount'

import { Popup, Input } from 'semantic-ui-react'
import Grid from '@material-ui/core/Grid'
import { withStyles, TextField, Tabs, Tab, AppBar, Paper, Link
  , Avatar, Chip
} from '@material-ui/core'
import { InternalPageStatus, OmsSelect } from '../../ui'
import { urls } from '../../urls'
import GSelect from '../../_components/globalselector'
import { COMBINATIONS } from './config/combination'
import MediaWrapper from './MediaWrapper'

const styles = theme => ({
  selectTag: {
    marginLeft: theme.spacing.unit * 2,
    marginRight: theme.spacing.unit * 2,
    minWidth: '12%',
    maxWidth: '50%'
  }
})
class viewGrievance extends Component {
  constructor (props) {
    super(props)
    this.state = {
      tab: 0,
      currentPage: 1,
      pageSize: 5,
      scrolled: false,
      expandedMsg: [],
      grievanceTypeList: [],
      loading: false,
      // fromDate: new Date().toISOString().substr(0, 10),
      download: {
        label: 'DOWNLOAD'
      },
      gSelectKey: new Date().getTime(),
      operatingSystemList: [
        { label: 'Windows', value: 'Windows' },
        { label: 'Macintosh', value: 'Macintosh' },
        { label: 'Linux', value: 'Linux' },
        { label: 'Android', value: 'Android' },
        { label: 'iOS', value: 'iOS' }
      ],
      browsersList: [
        { label: 'Chrome', value: 'Chrome' },
        { label: 'Firefox', value: 'Firefox' },
        { label: 'Safari', value: 'Safari' },
        { label: 'Opera', value: 'Opera' },
        { label: 'MSIE', value: 'MSIE' },
        { label: 'Trident', value: 'Trident' }
      ],
      openModal: false,
      currentClickedIndex: null
    }

    this.userProfile = JSON.parse(localStorage.getItem('user_profile'))
    this.postReply = this.postReply.bind(this)
    this.role = this.userProfile.personal_info.role
  }
  roleBasedBranchHandler = () => {
    const { userProfile = {}, state = {} } = this || {}
    const {
      personal_info: personalInfo = {},
      academic_profile: academicProfile = {}
    } = userProfile
    const { role, user_id: userId } = personalInfo
    if (!role) return undefined

    const { branchId } = state
    if (branchId) return { branchIds: [branchId], multiple: false, role, userId }

    switch (role) {
      case 'Student': {
        let { branch_id: branchId } = userProfile
        return { branchIds: [branchId], multiple: false, allBranchAccess: false, role, userId }
      }
      case ('Principal'): {
        let { branch_id: branchId } = academicProfile
        return { branchIds: [branchId], multiple: false, allBranchAccess: false, role, userId }
      }
      case ('AcademicCoordinator'): {
        let { branch_id: branchId } = userProfile
        return { branchIds: [branchId], multiple: false, allBranchAccess: false, role, userId }
      }
      case 'BDM': {
        let { branchs_assigned: branchesAssigned } = academicProfile
        let branchIds = branchesAssigned.map(branchObj => branchObj.branch_id)
        return { branchIds, multiple: true, allBranchAccess: false, role, userId }
      }
      case ('Admin' || 'CFO'): {
        return { branchIds: [], multiple: true, allBranchAccess: true, role, userId }
      }
      case 'GuestStudent': {
        return { branchIds: [], multiple: false, allBranchAccess: false, role, userId }
      }
      default: {
        return {}
      }
    }
  }
  getGrievance = () => {
    let url = urls.Message + '?grievance=' + true + '&page_number=' + 1 + '&page_size=' + this.state.pageSize
    let { grievanceTypeObj: { value: grievanceTypeId } = {}, selectedGrievanceSubTypes = [], selectedOperatingSystems = [], selectedBrowsers = [] } = this.state
    let { branchIds = [], role, userId } = this.roleBasedBranchHandler()
    url += branchIds.length ? `&branch_id=${branchIds}` : ''
    url += (role === 'Student' || role === 'GuestStudent') ? `&uploaded_by=${userId}` : ''
    url += grievanceTypeId ? `&grievance_type_id=${grievanceTypeId}` : ''
    url += selectedGrievanceSubTypes.length ? `&grievance_sub_type_ids=${selectedGrievanceSubTypes.map(item => item.value)}` : ''
    url += selectedOperatingSystems.length ? `&os_name=${selectedOperatingSystems.map(item => item.value)}` : ''
    url += selectedBrowsers.length ? `&browser_name=${selectedBrowsers.map(item => item.value)}` : ''
    this.setState({ loading: true })
    axios
      .get(url, {
        headers: {
          'Authorization': 'Bearer ' + this.props.user
        }
      })
      .then(res => {
        if (res.status === 200) {
          let { data: { results = [], total_items: totalGrievanceItems, total_pages: totalPages } = {} } = res || {}
          this.setState({ grievanceRes: results, totalPages, loading: false, totalGrievanceItems })
        } else {
          this.setState({ loading: false })
          this.props.alert.error('Error Occured')
        }
      })
      .catch(error => {
        this.setState({ loading: false })
        this.props.alert.error('Error Occured')
        console.log(error)
      })
  }
  componentDidMount () {
    this.getGrievanceServiceType()
      .then(result => { this.setState({ grievanceTypeList: result.data }) })
      .catch(err => { console.log(err, 'error in types') })
    this.getGrievance()
  }
  getGrievanceServiceType = async () => {
    let res = await axios.get(urls.GrievanceType, {
      headers: {
        Authorization: 'Bearer ' + this.props.user
      }
    })
    return res
  }

  handleScroll = (event) => {
    const { className } = event.target
    let { currentPage, pageSize, totalPages } = this.state
    let { grievanceTypeObj: { value: grievanceTypeId } = {}, selectedGrievanceSubTypes = [] } = this.state

    let { target } = event
    if (currentPage + 1 <= totalPages && className === 'feeds-container') {
      if (Math.ceil(target.scrollTop + target.clientHeight) >= target.scrollHeight) {
        let urlPath = urls.Message + '?grievance=' + true + '&page_number=' + Number(currentPage + 1) + '&page_size=' + pageSize
        let { branchIds = [], role, userId } = this.roleBasedBranchHandler()
        urlPath += branchIds.length ? `&branch_id=${branchIds}` : ''
        urlPath += grievanceTypeId ? `&grievance_type_id=${grievanceTypeId}` : ''
        urlPath += selectedGrievanceSubTypes.length ? `&grievance_sub_type_ids=${selectedGrievanceSubTypes.map(item => item.value)}` : ''
        urlPath += (role === 'Student' || role === 'GuestStudent') ? `&uploaded_by=${userId}` : ''

        axios.get(urlPath, {
          headers: {
            Authorization: 'Bearer ' + this.props.user,
            'Content-Type': 'application/json'
          }
        })
          .then(res => {
            let { data: { results = [], total_items: totalGrievanceItems, total_pages: totalPages } = {} } = res || {}
            if (results.length) {
              this.setState({
                totalGrievanceItems,
                currentPage: Number(this.state.currentPage) + 1,
                grievanceRes: [...this.state.grievanceRes, ...res.data.results],
                totalPages

              })
            }
          })
          .catch(e => {

          })
      }
    }
  }
  postReply = (grievance, e) => {
    let { message } = this.state
    if (!message || message === '') {
      this.props.alert.warning('Type in your Grievance Reply!')
      return
    }
    var formData = new FormData()
    formData.append('message', message)
    formData.append('is_grievance', 'True')
    formData.append('reply_to', grievance)
    axios
      .post(urls.Message, formData, {
        headers: {
          'Authorization': 'Bearer ' + this.props.user,
          'Content-Type': 'multipart/formData'
        }
      })
      .then(res => {
        if (res.status === 200) {
          this.props.alert.success('Issue Reply Posted Sucessfully')
          this.setState({ message: [] }, () => { this.getGrievance() })
        } else {
          this.props.alert.error('Error occured')
        }
      })
      .catch(error => {
        this.props.alert.error('Error occured')
        console.log(error)
      })
  }
  editReply = (msgId, msg, replyToId) => {
    if (!msg || msg === '') {
      this.props.alert.warning('Type Edit Grievance Reply!')
      return
    }
    var formData = new FormData()
    formData.append('msg_id', msgId)
    formData.append('message', msg)
    formData.append('is_grievance', 'True')
    formData.append('reply_to', replyToId)
    axios
      .put(urls.Message, formData, {
        headers: {
          'Authorization': 'Bearer ' + this.props.user,
          'Content-Type': 'multipart/formData'
        }
      })
      .then(res => {
        if (res.status === 200) {
          this.props.alert.success('Reply Updated Sucessfully')
          this.setState({ msg: [], messageInput: null }, () => { this.getGrievance() })
        } else {
          this.props.alert.error('Error occured')
        }
      })
      .catch(error => {
        this.props.alert.error('Error occured')
        console.log(error)
      })
  }
  getGrievanceData =(urlPath) => {
    // let { branchId } = this.setState
    this.setState({ loading: true })
    axios.get(urlPath, {
      headers: {
        Authorization: 'Bearer ' + this.props.user,
        'Content-Type': 'application/json'
      }
    })
      .then(res => {
        let { data: { results = [], total_pages: totalPages, total_items: totalGrievanceItems } = {} } = res || {}
        if (results) {
          this.setState({
            // branch: branchId,
            currentPage: 1,
            grievanceRes: results,
            loading: false,
            totalPages,
            totalGrievanceItems
          })
        }
      })
      .catch(e => {
        this.setState({ loading: false })
      })
  }
  onBranchChange = (data) => {
    this.setState({ grievanceRes: [] })
    let { pageSize } = this.state
    let urlPath = ''
    let { selectedGrievanceSubTypes = [] } = this.state
    if (data.branch_id) {
      urlPath = urls.Message + '?grievance=' + true + '&page_number=' + Number(1) + '&page_size=' + pageSize + '&branch_id=' + data.branch_id
      let { grievanceTypeObj: { value: grievanceTypeId } = {} } = this.state
      urlPath += grievanceTypeId ? `&grievance_type_id=${grievanceTypeId}` : ''
      urlPath += selectedGrievanceSubTypes.length ? `&grievance_sub_type_ids=${selectedGrievanceSubTypes.map(item => item.value)}` : ''
      this.getGrievanceData(urlPath)
      this.setState({ branchId: data.branch_id })
    }
  }

  deleteHandler =(msg) => {
    axios
      .delete(urls.Message + '?msg_id=' + msg + '&is_grievance=' + true, {
        headers: {
          'Authorization': 'Bearer ' + this.props.user
        }
      })
      .then(res => {
        if (res.status === 200) {
          this.props.alert.success('Reply Message has been deleted Successfully')
          this.setState({ message: [] }, () => { this.getGrievance() })
        }
      })
      .catch(error => {
        if (error.ressponse && error.ressponse.status === 409) {
          this.props.alert.error(' Reply Message Does not exist')
        }
        console.log(error)
      })
  }

  getReplyList = (grievance) => {
    return (
      grievance.replies && grievance.replies.map(reply => {
        return <React.Fragment>
          <Grid style={{ margin: 15, marginLeft: 24, marginRight: 8, width: '95%', borderRadius: 8 }} container>
            <Grid style={{ width: '100%' }} item>
              <Grid style={{ backgroundColor: '#eeeeee', borderTopLeftRadius: 8, borderTopRightRadius: 8 }} container>
                <Grid style={{ padding: 16 }} item>

                  <SupervisorAccount /> {reply.uploaded_by ? reply.uploaded_by : 'No Autor'}
                  <br />
                  <span style={{ color: '#821057' }}>
                    <small>
                      {moment(reply.uploaded_time).format('LLLL') }
                    </small>
                  </span>
                </Grid>
              </Grid>
              <Grid style={{ justifyContent: 'space-between', backgroundColor: '#eeeeee', borderBottomLeftRadius: 8, borderBottomRightRadius: 8 }} container>
                <Grid style={{ padding: 16 }} item>
                  {reply.message}
                </Grid>

                <Grid item>
                  <small style={{ cursor: 'pointer', margin: '0 5px 0 0' }}
                  >
                    <u>
                      {reply.replies.length > 0 && (this.state.expandedMsg.includes(reply.id) ? <Button onClick={e => {
                        let { expandedMsg } = this.state
                        if (expandedMsg.includes(reply.id)) {
                          this.setState({ expandedMsg: expandedMsg.filter(item => reply.id !== item) })
                        } else {
                          if (reply.replies.length > 0) {
                            this.setState({ expandedMsg: [...expandedMsg, reply.id] })
                          }
                        }
                      }}>View Replies <ExpandLessIcon /></Button> : <Button onClick={e => {
                        let { expandedMsg } = this.state
                        if (expandedMsg.includes(reply.id)) {
                          this.setState({ expandedMsg: expandedMsg.filter(item => reply.id !== item) })
                        } else {
                          if (reply.replies.length > 0) {
                            this.setState({ expandedMsg: [...expandedMsg, reply.id] })
                          }
                        }
                      }}>View Replies <ExpandMoreIcon /></Button>)}
                    </u>
                  </small>{this.role === 'Admin' || this.role === 'Principal' || this.role === 'BDM' || this.role === 'AcademicCoordinator'
                    ? <Popup
                      content={
                        <Grid>
                          <TextField
                            placeholder=' Reply...'
                            type='text'
                            name='Reply'
                            onChange={e => this.setState({ message: e.target.value })}
                          /> &nbsp;
                          <Button variant='contained' style={{ marginTop: 16 }} color='#E6E6FA' onClick={() => this.postReply(reply.id, this.state.message)}>
                            <Reply />
                          </Button></Grid>}
                      on='click'
                      pinned
                      trigger={
                        <Button ><u>Reply</u></Button>}
                    /> : ''}
                  {this.role === reply.role
                    ? <Popup
                      content={<Grid>
                        <TextField
                          type='text'
                          name='Reply'
                          value={this.state.messageInput || reply.message}
                          onChange={e => this.setState({ messageInput: e.target.value })}
                        /> &nbsp;
                        <Button variant='contained' style={{ marginTop: 16 }} color='#E6E6FA' onClick={() => this.editReply(reply.id, this.state.messageInput, grievance.id)}>
                        save
                        </Button></Grid>}

                      on='click'
                      pinned
                      trigger={
                        <IconButton
                          aria-label='Edit'
                        >
                          <EditIcon fontSize='small' />
                        </IconButton>}
                    /> : ''}
                  {this.role === reply.role
                    ? <IconButton
                      aria-label='Delete'
                      onClick={() => { this.deleteHandler(reply.id) }}
                    >
                      <DeleteIcon fontSize='small' />
                    </IconButton> : ''}
                </Grid>

              </Grid>
              <Grid style={{ transition: 'all 300ms', width: '100%' }} container>
                <div style={{ maxHeight: this.state.expandedMsg.includes(reply.id) ? '10000px' : '0px', overflow: 'hidden', transition: 'all 300ms', width: '100%' }} >
                  {this.getReplyList(reply)}
                </div>
              </Grid>
            </Grid>
          </Grid>
        </React.Fragment>
      })
    )
  }
  getStudentInfo = (grievance) => {
    const { reported_by_details: reportedBy, is_reported: isReported } = grievance || {}
    return (<div
      style={{
        display: 'flex',
        padding: 10,
        // justifyContent: 'center',
        flexDirection: 'row',
        cursor: 'pointer',
        maxWidth: '20vw'
      }}
    >
      <div>
        <FaceIcon />
      </div>
      <div>
        {
          isReported && reportedBy
            ? <h5>
              &nbsp;&nbsp;&nbsp;&nbsp;
              {`${reportedBy.username} ${reportedBy.erp ? `(${reportedBy.erp})` : ''} `}
              <br /><small style={{ color: '#821057' }}>
                {moment(grievance.uploaded_time).format('LLLL') }
              </small>
            </h5>
            : <h5>
          &nbsp;&nbsp;&nbsp;&nbsp;
              { grievance.uploaded_by && grievance.uploaded_by.student
                ? grievance.uploaded_by.student.name
                : grievance.uploaded_by && grievance.uploaded_by.username
                  ? grievance.uploaded_by.username
                  : 'No User'
              }
              <br /><small style={{ color: '#821057' }}>
                {moment(grievance.uploaded_time).format('LLLL') }
              </small>
            </h5>
        }

      </div>
    </div>
    )
  }

  getStudentInfoPopUp = (grievance = {}) => {
    const { is_reported: isReported } = grievance
    return (
      <Popup
        content={(() => {
          let { uploaded_by: uploadedBy = {} } = grievance
          const guestStudentData = uploadedBy && uploadedBy.guest_student
            ? uploadedBy.guest_student[0] : ''
          const gradeData = guestStudentData && guestStudentData.grade ? guestStudentData.grade.grade : ''
          const userName = guestStudentData ? guestStudentData.name : ''
          const mobileNumber = guestStudentData ? guestStudentData.phone_number : ''

          let { student } = uploadedBy || {}
          let { name = 'No name', grade: gradeObj = {}, section: sectionObj = {}, father_mobile: fatherMobile = 'No number', branch: branchObj } = student || {}
          let { branch_name: branchName = 'No branch' } = branchObj || {}
          let { grade: gradeName = 'No grade' } = gradeObj || {}
          let { section_name: sectionName = 'No section' } = sectionObj || {}
          return (
            <React.Fragment>
              {
                !isReported
                  ? <div>
                    {
                      !guestStudentData
                        ? <div>{name}
                          <ul style={{ margin: 10, padding: 0 }}>
                            <li>Branch: {branchName}</li>
                            <li>Grade: {gradeName}</li>
                            <li>Section: {sectionName}</li>
                            <li>Mobile: {fatherMobile}</li>
                            <li>Role: Student</li>
                          </ul></div>
                        : <div>
                          {userName}
                          <ul style={{ margin: 10, padding: 0 }}>
                            <li>Grade: {gradeData}</li>
                            <li>Mobile: {mobileNumber}</li>
                            {!this.role === 'AOL'
                              ? <li>
                     Role: GuestStudent</li> : ''}
                          </ul>
                        </div>}
                  </div>
                  : ''
              }
            </React.Fragment>
          )
        })()}
        on='hover'
        trigger={this.getStudentInfo(grievance)}
      />
    )
  }
  handleChangeToDate = event => {
    this.setState({ toDate: event.target.value })
  }
  handleChangeToDate = event => {
    this.setState({ toDate: event.target.value })
  }
  handleChangeFromDate = event => {
    this.setState({ fromDate: event.target.value })
  }
  download=() => {
    let { toDate, fromDate } = this.state
    window.open(urls.GrievanceDateRangeExport + '?from_date=' + fromDate + '&to_date=' + toDate, '_blank')
  }
  getFileName = (url) => {
    let part = (url.split('/')[url.split('/').length - 1])
    return part
  }

  downloadTabContent = () => {
    let { fromDate, toDate } = this.state
    return (
      <Grid container >

        <Grid style={{ padding: 10 }} >
          <div className='ui label'>
            <p style={{ fontSize: '16px' }}> From Date :</p>
          </div>
          <Input
            type='date'
            // value={fromDate}
            max={(() => { let tdy = new Date(); let yr = tdy.getFullYear(); let mn = String(tdy.getMonth() + 1).padStart(2, '0'); let dy = String(tdy.getDate()).padStart(2, '0'); return (yr + '-' + mn + '-' + dy) })()}

            onChange={this.handleChangeFromDate}
          />
        </Grid>
        <Grid style={{ padding: 10 }} >
          <div className='ui label'>
            <p style={{ fontSize: '16px' }}>To Date :</p>
          </div>
          <Input
            type='date'
            // value={date}
            max={(() => { let tdy = new Date(); let yr = tdy.getFullYear(); let mn = String(tdy.getMonth() + 1).padStart(2, '0'); let dy = String(tdy.getDate()).padStart(2, '0'); return (yr + '-' + mn + '-' + dy) })()}

            onChange={this.handleChangeToDate}
          />
        </Grid>
        <Grid >
          <Button variant='contained' disabled={(!fromDate) || (!toDate)} style={{ marginTop: 10 }} color='primary' onClick={this.download}
          >{this.state.download.label}</Button>

        </Grid>

      </Grid>
    )
  }
  decideTab =() => {
    if (this.state.tab === 0) {
      return this.viewTabContent()
    } else if (this.state.tab === 1) {
      return this.downloadTabContent()
    }
  }
  getGrievanceType = (grievance) => {
    let { grievance_type: grievanceType, grievance_sub_type: grievanceSubtypes = [] } = grievance
    let { type_name: typeName = 'Not found' } = grievanceType || {}
    return grievanceSubtypes.length
      ? <React.Fragment>
        <h3 style={{ margin: 0, padding: 0 }} >
          <small>Type:</small>
          <span style={{ fontWeight: 'normal' }}>

            {grievanceSubtypes.map(item => <li>{item.type.type_name}: {item.sub_type_name} </li>)}
          </span>
        </h3>
      </React.Fragment>
      : <h3 style={{ margin: 0, padding: 0 }} >
        <small>Type:</small>&nbsp;<br />&nbsp;&nbsp;&nbsp;&nbsp;<span style={{ fontWeight: 'normal' }}>{typeName}</span>
      </h3>
  }
  handleType = (data) => {
    let { pageSize } = this.state
    if (data.value) {
      let urlPath = urls.Message + '?grievance=' + true + '&page_number=' + Number(1) + '&page_size=' + pageSize
      // urlPath += branchId ? `&branch_id=${branchId}` : ''
      // let { branchIds = [] } = this.roleBasedBranchHandler()
      // urlPath += branchIds.length ? `&branch_id=${branchIds}` : ''
      urlPath += data.value ? `&grievance_type_id=${data.value}` : ''
      this.getGrievanceData(urlPath)
      this.setState({ grievanceTypeObj: data, grievanceTypeObjLabel: data.label, selectedBrowsers: [], selectedOperatingSystems: [], selectedGrievanceSubTypes: [], branchId: '' })
    }
  }
  getReplyPopup =(grievanceObj) => {
    const { is_reported: isReported } = grievanceObj
    return (
      !isReported
        ? <Popup
          content={
            <Grid>
              <TextField
                placeholder='Reply.. '
                type='text'
                name='Reply'
                onChange={e => this.setState({ message: e.target.value })}
              /> &nbsp;
              <Button variant='contained' style={{ marginTop: 16 }} color='#E6E6FA' onClick={() => this.postReply(grievanceObj.id, this.state.message)}>
                <Reply />
              </Button></Grid>
          }
          on='click'
          pinned
          trigger={
            <Button ><u>Reply</u></Button>}
        />
        : ''
    )
  }

  isDesktopSelected = () => {
    const { selectedGrievanceSubTypes } = this.state
    if (!selectedGrievanceSubTypes) return false
    return selectedGrievanceSubTypes.some(item => item.sub_type_name === 'Desktop')
  }

  handleModalClose = () => {
    this.setState({ openModal: false, currentClickedIndex: null })
  }

  viewTabContent=() => {
    const { grievanceRes, grievanceTypeList, grievanceTypeObjLabel, browsersList, operatingSystemList, openModal, currentClickedIndex } = this.state
    const { classes } = this.props
    const { grievanceTypeObj, gSelectKey, selectedGrievanceSubTypes = [] } = this.state
    const { servicesubtype_set: grievanceSubTypes = [] } = grievanceTypeObj || {}
    return (
      <React.Fragment>
        {this.filterAccessRoles.includes(this.role)
          ? <div style={{ display: 'flex', marginTop: 10, marginLeft: 10 }}>

            <OmsSelect
              label='Type'
              name='Type'
              className={classes.selectTag}
              placeholder='Select Type'
              change={this.handleType}
              defaultValue={grievanceTypeObj}
              options={grievanceTypeList.map((item) => {
                return { ...item, label: item.type_name, value: item.id }
              })}
            />
            { grievanceSubTypes.length
              ? <OmsSelect
                label='Sub Type'
                name='Sub Type'
                className={classes.selectTag}
                placeholder='Select Sub Types'
                defaultValue={selectedGrievanceSubTypes}
                change={(selectedData) => {
                  this.setState({ selectedGrievanceSubTypes: [selectedData], selectedBrowsers: [], selectedOperatingSystems: [] }, this.getGrievance)
                }}
                options={grievanceSubTypes.map(item => ({ ...item, label: item.sub_type_name, value: item.id }))
                }
              />
              : null
            }
            {
              this.isDesktopSelected()
                ? <React.Fragment>
                  <OmsSelect
                    label='Select Browser'
                    name='Browser Type'
                    className={classes.selectTag}
                    placeholder='Select Browser'
                    isMulti
                    change={(selectedData) => {
                      this.setState({ selectedBrowsers: selectedData }, this.getGrievance)
                    }}
                    options={browsersList}
                  />
                  <OmsSelect
                    label='Select OS'
                    name='Operating System'
                    className={classes.selectTag}
                    placeholder='Select OS'
                    isMulti
                    change={(selectedData) => {
                      this.setState({ selectedOperatingSystems: selectedData }, this.getGrievance)
                    }}
                    options={operatingSystemList}
                  />
                </React.Fragment>
                : ''
            }
            {(grievanceTypeObjLabel !== 'AOL') && (grievanceTypeObjLabel !== 'Eduvate Portal/App') ? <div>
              <GSelect key={gSelectKey} variant={'selector'} onChange={this.onBranchChange} config={COMBINATIONS} />
            </div> : ''}

            <Button
              style={{ margin: 5 }}
              onClick={
                () => {
                  this.setState({ branchId: undefined, gSelectKey: new Date().getTime(), grievanceTypeObj: {}, selectedGrievanceSubTypes: [], selectedBrowsers: [], selectedOperatingSystems: [] }, this.getGrievance)
                }}
              variant='outlined'
              color='primary'
            >
              Clear
            </Button>

          </div>

          : null
        }
        {this.state.loading
          ? <InternalPageStatus label={'Loading...'} />
          : (grievanceRes && grievanceRes.length > 0)
            ? <div>
              <div style={{ margin: 10 }}>
                <h4>Issues Count: {this.state.totalGrievanceItems}</h4>
              </div>

              <div className='feeds-container' style={{ minHeight: '65vh' }} onScroll={this.handleScroll}>
                { grievanceRes.map((grievance, index) => (
                  <Paper elevation={3} style={{ marginTop: 30, padding: 5, paddingLeft: 10 }}>
                    {this.getStudentInfoPopUp(grievance)}

                    {this.getGrievanceType(grievance)}

                    <h3 style={{ padding: 0, margin: 0 }}>
                      <small>Title:</small>&nbsp;<br />&nbsp;&nbsp;&nbsp;&nbsp;
                      <span style={{ fontWeight: 'normal' }}>{grievance.title}</span>
                    </h3>
                    <div style={{ color: '#821057', float: 'right' }}>
                      <small
                        style={{ cursor: 'pointer', margin: '0 10px' }}
                        onClick={e => { this.setState(state => ({ expandedMsgId: state.expandedMsgId === grievance.id ? null : grievance.id })) }}>
                        <u>
                          {grievance.replies.length > 0 && (this.state.expandedMsg.includes(grievance.id)
                            ? <Button
                              onClick={e => {
                                let { expandedMsg } = this.state
                                if (expandedMsg.includes(grievance.id)) {
                                  this.setState({ expandedMsg: expandedMsg.filter(item => grievance.id !== item) })
                                } else {
                                  if (grievance.replies.length > 0) {
                                    this.setState({ expandedMsg: [...expandedMsg, grievance.id] })
                                  }
                                }
                              }}
                            >
                          View Replies
                              <ExpandLessIcon />
                            </Button>
                            : <Button
                              onClick={e => {
                                let { expandedMsg } = this.state
                                if (expandedMsg.includes(grievance.id)) {
                                  this.setState({ expandedMsg: expandedMsg.filter(item => grievance.id !== item) })
                                } else {
                                  if (grievance.replies.length > 0) {
                                    this.setState({ expandedMsg: [...expandedMsg, grievance.id] })
                                  }
                                }
                              }}
                            >
                          View Replies <ExpandMoreIcon />
                            </Button>
                          )
                          }
                        </u>
                      </small>

                      {this.replyAccessRoles.includes(this.role) ? this.getReplyPopup(grievance) : null }
                    </div>
                    <h3 style={{ padding: 0, margin: 0 }}>
                      <small>Message:</small>&nbsp;<br />&nbsp;&nbsp;&nbsp;&nbsp;<span style={{ fontWeight: 'normal', whiteSpace: 'pre-line' }}>{grievance.message}</span>
                    </h3>
                    <br />
                    {grievance.msg_media && grievance.msg_media.length && !grievance.is_reported
                      ? grievance.msg_media.map(media => {
                        return <li> <Link className='card-text' href={media.msg_media_file} variant='body1' target='_blank' style={{ color: 'blue' }}>
                         MEDIA:----- {this.getFileName(media.msg_media_file)}
                        </Link ></li>
                      })
                      : ''
                    }
                    <div style={{ maxHeight: this.state.expandedMsgId === grievance.id ? '10000px' : '0px', overflow: 'hidden' }} >
                      {this.getReplyList(grievance)}
                    </div>
                    {
                      grievance.is_reported
                        ? <React.Fragment>
                          <div>
                            <Button
                              variant='contained'
                              color='primary'
                              style={{ marginBottom: 20 }}
                              onClick={() => { this.setState({ openModal: true, currentClickedIndex: index }) }}
                            >
                              Click here to view the screenshot
                            </Button>
                          </div>
                          <div style={{ width: '50%', display: 'flex', justifyContent: 'space-between' }}>
                            {
                              grievance.reported_browser_type
                                ? <Chip size='medium' avatar={<Avatar>BN</Avatar>} label={grievance.reported_browser_type.browser_name} />
                                : ''
                            }
                            {
                              grievance.reported_browser_version
                                ? <Chip size='medium' avatar={<Avatar>BV</Avatar>} label={grievance.reported_browser_version} />
                                : ''
                            }
                            {
                              grievance.reported_os_type
                                ? <Chip size='medium' avatar={<Avatar>OS</Avatar>} label={grievance.reported_os_type.os_name} />
                                : ''
                            }

                          </div>
                          <MediaWrapper open={openModal} handleClose={this.handleModalClose} src={currentClickedIndex !== null ? grievanceRes[currentClickedIndex].msg_media[0].msg_media_file : ''} />
                        </React.Fragment>
                        : ''
                    }
                  </Paper>
                ))}
              </div> </div> : <InternalPageStatus label='No data' loader={false} />
        }
      </React.Fragment>
    )
  }
  handleTabChange = (event, value) => {
    if (value === 0) {
      this.setState({ tab: value, branchId: undefined }, this.getGrievance)
    } else {
      this.setState({ tab: value })
    }
  }
  filterAccessRoles = ['Admin', 'BDM', 'Subjecthead', 'Principal', 'AcademicCoordinator']
  viewAccessRoles = ['Admin', 'BDM', 'Principal', 'AcademicCoordinator', 'FOE', 'LeadTeacher', 'Teacher']
  downloadAccessRoles = ['Admin', 'CFO', 'BDM']
  replyAccessRoles = ['Admin', 'BDM', 'Principal', 'AcademicCoordinator', 'GuestStudent']
  render () {
    return (
      <React.Fragment>
        {this.viewAccessRoles.includes(this.role) && this.downloadAccessRoles.includes(this.role)
          ? <AppBar style={{ backgroundColor: '#f0f0f0' }} elevation={3} position='static'>
            <Tabs
              value={this.state.tab}
              onChange={this.handleTabChange}
              indicatorColor='primary'
              textColor='primary'
              variant='fullWidth'
            >
              {this.viewAccessRoles.includes(this.role) ? <Tab label='View' /> : ''}
              {this.downloadAccessRoles.includes(this.role) ? <Tab label='Download' /> : ''}
            </Tabs>
          </AppBar> : ''}
        {this.decideTab()}
      </React.Fragment>
    )
  }
}

const mapStateToProps = state => ({
  user: state.authentication.user
})

const mapDispatchToProps = dispatch => ({
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(withStyles(styles)(viewGrievance)))
