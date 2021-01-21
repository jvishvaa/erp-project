/* eslint-disable no-undef */

import React, { Component } from 'react'
import { connect } from 'react-redux'
import { withStyles } from '@material-ui/core/styles'
import { withRouter } from 'react-router-dom'
import {
  Grid,
  // Button,
  Card,
  TextField,
  CardMedia,
  CardActionArea,
  Typography
} from '@material-ui/core'
import DateFnsUtils from '@date-io/date-fns'
import moment from 'moment'
// import InputBase from '@material-ui/core/InputBase'
// import SearchIcon from '@material-ui/icons/Search'
import { MuiPickersUtilsProvider, KeyboardDatePicker } from '@material-ui/pickers'
// import Select from 'react-select'
// import { Typography } from '@material-ui/core'
// import Fab from '@material-ui/core/Fab'
// import AddIcon from '@material-ui/icons/Add'
import Autocomplete from '@material-ui/lab/Autocomplete'
import Switch from '@material-ui/core/Switch'
import FormGroup from '@material-ui/core/FormGroup'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import axios from 'axios'
import { urls } from '../../urls'
import BadgesList from './BadgesList'
import { OmsSelect } from '../../ui'
import { apiActions } from '../../_actions'

const useStyles = theme => ({
  root: {
    '& > *': {
      margin: theme.spacing(1)
    }
  },
  extendedIcon: {
    marginRight: theme.spacing(1)
  },
  label: {
    backgroundColor: 'white',
    paddingLeft: 5,
    paddingRight: 5 },

  card_root: {
    maxWidth: '100%'
  },
  title: {
    fontSize: 14
  },
  date__picker: {
    width: '100%',
    border: '1px solid #eee',
    padding: '10px',
    'margin-top': '10px'
  },
  final__button: {
    'margin-top': '2%',
    color: '#fff',
    background: '#4CAF50',
    border: '2px solid #4CAF50',
    display: 'block',
    margin: '0 auto',
    '&:hover': {
      backgroundColor: '#4CAF50',
      color: '#FFF',
      border: '2px solid #4CAF50'
    }
  },
  under__line: {
    'margin-top': '2%',
    'margin-bottom': '2%',
    'border-bottom': '2px solid #5d2449'
  }
})
class Step3 extends Component {
  constructor (props) {
    super(props)
    this.state = {
      eventDate: new Date(),
      signatureData: [],
      selectedSignature: true,
      isLoading: false,
      file: '',
      role: this.props.role,
      category: this.props.category,
      branchId: this.props.branchId,
      isExcel: false,
      participantList: [],
      participantErpList: [],
      clearData2: false,
      loadingParticipantNames: false,
      isSkipped: this.props,
      multipleSignature: [],
      newWinnerList: [],
      winnerList: this.props.winnerList,
      isMultiple: false
    }
    this.role = JSON.parse(localStorage.getItem('user_profile')).personal_info.role
  }

  componentWillMount () {
    let { eventDate, category, signbranch, nameOfSignatory, designationOfsignatory, signature, signUrl, signId, event, signDetail, isExcel, branchId, newWinnerList } = this.props
    console.log(signbranch)
    let academicProfile = JSON.parse(localStorage.getItem('user_profile')).academic_profile
    let issuerbranchId = academicProfile && academicProfile.branch_id
    this.setState({ issuerbranchId })
    if (!eventDate) {
      let d = moment(this.state.eventDate).format('YYYY-MM-DD')
      this.props.handleDate(d)
    }
    if (branchId && branchId.length > 1) {
      this.setState({ isMultiple: true })
    }
    this.setState({
      eventDate: eventDate,
      category: category,
      signDetail: signDetail,
      signId: signId,
      signUrl: signUrl,
      signature: signature,
      signbranch: signbranch,
      nameOfSignatory: nameOfSignatory,
      designationOfsignatory: designationOfsignatory,
      event: event,
      isExcel: isExcel,
      newWinnerList: newWinnerList || []
    })
    let { particpantBranchValue, participantGradeValue, participantList, pGradeMapId, particpantBranchId, role, sectionMapId } = this.props

    this.setState({
      particpantBranchValue: particpantBranchValue,
      participantGradeValue: participantGradeValue,
      participantList: participantList

    })

    if (this.role === 'Principal' || this.role === 'AcademicCoordinator' ||
    this.role === 'EA Academics') {
      this.setState({
        particpantBranchId: issuerbranchId,
        particpantBranchValue: { value: academicProfile.branch_id, label: academicProfile.branch }
      })
      this.handleClickParticipantBranch({ value: academicProfile.branch_id, label: academicProfile.branch })
    } else if (particpantBranchValue) {
      this.handleClickParticipantBranch(particpantBranchValue)
    }

    if (role && role === 'Student') {
      if (pGradeMapId) {
        this.props.gradeMapBranch(branchId)
        this.getErpList(null, pGradeMapId)
      } else if (sectionMapId) {
        this.getErpList(null, null, sectionMapId)
      }
    } else if (particpantBranchId) {
      this.getErpList(particpantBranchId, null)
    }

    if (this.props.signatureVisible) {
      axios.get(`${urls.signatureUpload}?branch_id=${this.props.branchId}`, {
        headers: {
          Authorization: 'Bearer ' + this.props.user
        }

      }).then(res => {
        let { data: { data = [] } = {} } = res
        this.setState({ signatureData: data })
      }).catch(err => {
        console.log(err)
      })
    }
    axios.get(`${urls.CategoryList}`, {
      headers: {
        Authorization: 'Bearer ' + this.props.user
      }

    }).then(res => {
      let { data: { data = [] } = {} } = res
      this.setState({ categoryList: data })
    }).catch(error => {
      console.log(JSON.stringify(error), error)
      let { response: { data: { status } = {} } = {}, message } = error
      if (!status && message) {
        this.props.alert.error(JSON.stringify(message))
      } else {
        this.props.alert.error(JSON.stringify(status))
      }
      this.setState({ isTemplateLoading: false })
    })
    this.props.listBranches()
  }

  handleDateChange = (date) => {
    this.setState({ dateSetted: true })
    console.log(date)
    let d = moment(date).format('YYYY-MM-DD')
    date = moment(date).format('DD-MM-YYYY')
    this.props.handleDate(d, date)
    this.setState({ eventDate: d })
  }

  handleEventName=(e) => {
    this.props.handleEvent(e.target.value)
    this.setState({ event: e.target.value })
  }

  attachSignatureToWinnerList=(signObj, signUrlList, signatureAttachedWinnerList, uniqueWinnerList) => {
    const { winnerList } = this.props
    signatureAttachedWinnerList.push(...winnerList.filter(({ brId }) => brId === signObj.branch.id).map(val => {
      return (
        {
          ...val,
          signature_id: signObj.id,
          signatureName: signObj.name,
          signatureDesignation: signObj.designation.designation_name,
          signUrl: signUrlList.filter(vl => Object.keys(vl).join() === `${signObj.id}`).map(v => v[`${signObj.id}`])[0],
          signDetail: signObj,
          signbranch: signObj.branch.id
        }
      )
    }
    )
    )
  }

  getSignatureImg=(signEvent) => {
    const { isMultiple } = this.state
    this.setState({ newWinnerList: [] })
    if (signEvent) {
      const signatureId = isMultiple ? signEvent.map(v => v.id) : signEvent.id
      this.setState({ signatureId })
      axios.get(`${urls.Base64Img}?signature_id=${signatureId}`, {
        headers: {
          Authorization: 'Bearer ' + this.props.user
        }
      }).then(res => {
        const { data: { data: { signature_urls: signatureUrlsList = [] } = {} } = {} } = res
        const signUrlList = signatureUrlsList
        const signatureAttachedWinnerList = []
        const uniqueWinnerList = []
        const arryList = [signUrlList, signatureAttachedWinnerList, uniqueWinnerList]

        if (isMultiple) {
          signEvent.map(e => {
            this.attachSignatureToWinnerList(e, ...arryList)
          })
        } else {
          this.attachSignatureToWinnerList(signEvent, ...arryList)
        }
        this.props.handleSignature(signEvent, signatureAttachedWinnerList)
        this.setState({
          newWinnerList: signatureAttachedWinnerList,
          isLoading: false,
          loadingSignature: false,
          signDetail: signEvent
        })
      }).catch((e) => {
        console.log(e)
      })
    }
  }
  handleAddSignature=(event) => {
    this.getSignatureImg(event)
  }

  handleCategory =(e) => {
    if (e) {
      console.log(this.state.category, e)
      this.setState({ category: e })
      this.props.handleCategoryList(e)
    } else {
      this.setState({ category: '' })
      this.props.handleCategoryList(null)
    }
  }
  onDrop = (file) => {
    this.setState({ file })
  }
  postDetails = () => {
    console.log(this.state.file)
  }
  handleBadgeFile = (file) => {
    console.log(file)
    this.props.handleBadgeFile(file)
  }
  handleSwitch = (event) => {
    console.log(event.target.checked)
    this.setState({ isExcel: event.target.checked })

    this.props.handleExcelUploadSwitch(event.target.checked)
  }
  handleClickParticipantBranch = (e, clear) => {
    let { participantList } = this.state
    let { role } = this.props

    let particpantBranchId = this.role === 'Admin' ? e.map(e => e.value) : e.value
    let participantBranchName = this.role === 'Admin' ? e.map(e => e.label) : e.label

    this.setState({ particpantBranchId, particpantBranchValue: e })
    if (role !== 'Student') {
      this.getErpList(particpantBranchId)
    }
    if (participantList && participantList.length) {
      this.setState({ clearData1: true })
    }
    this.setState({ particpantBranchId, particpantBranchValue: e })
    if (clear) {
      this.setState({ participantGradeValue: [], participantList: [], participantErpList: [] })

      this.props.handleParticipantBranch(particpantBranchId, participantBranchName, e, [], [])
    } else if (this.props.participantList && this.props.participantList.length) {
      this.props.handleParticipantBranch(particpantBranchId, participantBranchName, e, this.props.participantList, this.props.participantGradeValue)
    } else {
      this.props.handleParticipantBranch(particpantBranchId, participantBranchName, e, [], [])
    }
    if (this.props.participantGradeValue && this.props.participantGradeValue.length) {
      this.handleClickParticipantGrade(this.props.participantGradeValue)
    }

    this.props.gradeMapBranch(particpantBranchId)
  }
  handleClickParticipantGrade = (e, clear) => {
    let gradeArry = e.map(e => e.value)
    let { participantList } = this.state

    if (gradeArry && gradeArry.length) {
      this.getErpList(null, gradeArry)
    }
    if (participantList && participantList.length) {
      this.setState({ clearData2: true })
    }
    this.setState({ participantGradeValue: e })
    if (clear) {
      this.setState({ participantList: [], participantErpList: [] })
      this.props.handleParticipantGrade(e.value, e.label, e, [])
    } else {
      this.props.handleParticipantGrade(e.value, e.label, e, this.props.participantList)
    }
  }
  handleParticipantChange = (e) => {
    let participantList = []
    console.log(e)
    if (e && e.length) {
      e.map(item => {
        participantList.push({
          name: item.name,
          erp: item.erp,
          branch: item.branch && item.branch.id,
          branch_name: item.branch && item.branch.branch_name,
          grade_name: item.grade && item.grade.grade,
          acad_grade_mapping_id: item.acad_branch_mapping && item.acad_branch_mapping.id,
          acad_sec_mapping_id: item.acad_section_mapping && item.acad_section_mapping.id,
          section_name: item.section && item.section.section_name
        })
      })
    }
    this.setState({ participantList })
    console.log(participantList)
    this.props.handleParticipantList(participantList)
  }
  getErpList (branchId, gradeMapId, secMapId) {
    this.setState({ loadingParticipantNames: true })
    let { role } = this.props
    console.log(branchId)
    if (branchId || gradeMapId || secMapId) {
      let path = ''
      if (branchId) {
        path = `?role=${role}&branch_id=${branchId}`
      } else if (gradeMapId) {
        path = `?role=${role}&acad_branch_mapping_id=${gradeMapId}`
      } else if (secMapId) {
        path = `?role=${role}&section_map_id=${secMapId}`
      }
      axios.get(`${urls.CertificateErpList}${path}`, {
        headers: {
          Authorization: 'Bearer ' + this.props.user
        }

      }).then(res => {
        let { data: { data = [] } = {} } = res
        let { winnerList } = this.props
        console.log(winnerList, 'winnn')
        let excludedWinnerList = data.filter(({ erp: werp }) => !winnerList.some(({ erp: everp }) => werp === everp))
        console.log(excludedWinnerList, 'excludedWinnerList')
        this.setState({ participantErpList: excludedWinnerList })

        this.setState({ loadingParticipantNames: false })
      }).catch(err => {
        console.log(err)

        this.setState({ loadingParticipantNames: false })
      })
    }
  }

  render () {
    let { isExcel, participantErpList, loadingSignature, clearData2, participantList, participantGradeValue, eventDate, role, categoryList, category, signDetail, selectedSignature, event, particpantBranchValue, loadingParticipantNames, isMultiple, newWinnerList, signatureVisible, winnerList } = this.state

    console.log(newWinnerList, signatureVisible, winnerList, 'new winner')
    let { classes } = this.props
    let propsObj = { handleBadgeFile: this.handleBadgeFile }

    return (
      <React.Fragment>
        <Grid className={classes.under__line} />
        <Grid container spacing={2}>
          <Grid item xs={1} sm={1} md={1} />
          <Grid item xs={12} sm={5} md={5}>
            <Grid item xs={12} sm={12} md={12}>
              <TextField fullWidth onChange={e => this.handleEventName(e)}required id='standard-required' variant='outlined' label='Event' placeholder='Academics/Cultural Activites/Sports' inputProps={{
                maxLength: 26
              }}defaultValue={event} />
              <Typography variant='subtitle2' style={{ color: '#9e9e9e' }}>Max 26 Characters</Typography>
              <Autocomplete
                id='combo-box-demo'
                options={categoryList}

                style={{ paddingTop: 10 }}
                getOptionLabel={(option) => option.category_name}
                renderInput={(params) => <TextField {...params} required label='Category' InputLabelProps={{
                  classes: {
                    root: classes.label
                  } }} variant='outlined' style={{ width: '100%' }} />}
                onChange={(event, newValue) => {
                  this.handleCategory(newValue)
                }}
                defaultValue={category}
              />
            </Grid>
            <Grid item xs={12} sm={12} md={12}>
              <MuiPickersUtilsProvider utils={DateFnsUtils}>
                <KeyboardDatePicker
                  disableToolbar
                  className={classes.date__picker}
                  format='dd/MM/yyyy'
                  id='date-picker-inline'
                  value={eventDate}
                  variant='dialog'
                  onChange={this.handleDateChange}
                  defaultValue={eventDate}
                />
              </MuiPickersUtilsProvider>
            </Grid>
            {loadingSignature && <div className='notification-text'>please wait Loading Signature...</div>}
            {this.props.signatureVisible
              ? <Grid item xs={12} sm={12} md={12}>
                <Autocomplete
                  id='combo-box-demo'
                  options={this.state.signatureData && newWinnerList && this.state.signatureData.filter(e => !newWinnerList.find(vl => vl.signbranch === e.branch.id))}
                  multiple={isMultiple}
                  style={{ paddingTop: 10 }}
                  getOptionLabel={(option) => option.name}
                  onDelete={e => console.log(e.target.value)}
                  renderInput={(params) => <TextField {...params} required label='Add Signature' InputLabelProps={{
                    classes: {
                      root: classes.label
                    } }} variant='outlined' style={{ width: '100%' }} />}
                  onChange={(event, newValue) => {
                    this.handleAddSignature(newValue)
                  }}

                  defaultValue={signDetail}
                />
                {console.log(selectedSignature)}
                {console.log(this.state.multipleSignature)}

                <Grid
                  container
                  direction='row'
                  justify='flex-start'
                  alignItems='center'
                >
                  {this.state.newWinnerList && this.state.newWinnerList.length
                    ? Array.from(new Set(this.state.newWinnerList.map(a => a.signature_id))).map(id => {
                      return this.state.newWinnerList.find(a => a.signature_id === id)
                    }).map((list) => {
                      return <Grid item xs>
                        {/* <Grid item xs={12} md={12} sm={12}> */}
                        {/* <Button onClick={(e) => this.setState({ selectedSignature: false })}> */}
                        <Card key={list.id} {...list} className={classes.card_root}>
                          <CardActionArea>
                            <CardMedia
                              style={{
                                'object-fit': 'cover',
                                width: '100%',
                                height: '100%'
                              }}
                              component='img'
                              alt={`${list.added_time}`}
                              height='140'
                              src={`${list.signUrl}`}
                            />
                          </CardActionArea>
                          <Typography className={classes.title} color='textSecondary' gutterBottom>
                            {list.signatureDesignation}
                          </Typography>
                          <Typography className={classes.title} color='textSecondary' gutterBottom>
                            {list.signatureName}
                          </Typography>
                        </Card>
                        {/* </Button> */}

                      </Grid>
                    }
                    ) : ''
                  }
                </Grid>
              </Grid>
              : ''}
          </Grid>
          <Grid item xs={8} sm={5} md={5}>
            <Grid item xs={12} sm={12} md={12}>
              <Typography align='center'> Participants List </Typography>
              <FormGroup row>
                <FormControlLabel
                  control={
                    <Switch checked={this.state.isExcel} onChange={e => this.handleSwitch(e)} name='checkedA' />
                  }
                  label='Excel Upload'
                />
              </FormGroup>
              {isExcel
                ? <BadgesList {...propsObj} file={this.props.badgeFile}eventName={event} issuerBranch={this.state.issuerbranchId}alert={this.props.alert} eventDate={this.props.eventDate || eventDate} category={category && category.id} role={role} winnersDetails={winnerList} handleExcelErrorList={this.props.handleExcelErrorList} ErrorList={this.props.ErrorList} />
                : <React.Fragment>
                  <OmsSelect
                    id='participantBranch'
                    name='participantBranch'
                    label={'Branch'}
                    defaultValue={particpantBranchValue}
                    isMulti
                    options={this.props.participantBranches
                      ? this.props.participantBranches.map(branch => ({
                        value: branch.id,
                        label: branch.branch_name
                      }))

                      : []

                    }
                    disabled={this.role === 'Principal' || this.role === 'AcademicCoordinator' || this.role === 'EA Academics'}

                    change={(e) => this.handleClickParticipantBranch(e, true)}
                  />
                  <br />
                  {loadingParticipantNames && <div className='notification-text'>please wait getting names...</div>}
                  <OmsSelect
                    id='participantGrade'
                    isMulti
                    name='participantGrade'
                    placeholder='Grade'
                    options={this.props.participantGrades
                      ? this.props.participantGrades.map(grade => ({
                        value: grade.id,
                        label: `${grade.branch.branch_name} - ${grade.grade.grade}`
                      }))
                      : []}
                    defaultValue={participantGradeValue}
                    change={(e) => this.handleClickParticipantGrade(e, true)}
                  />
                  <Autocomplete
                    multiple
                    key={clearData2}
                    options={participantErpList && participantList && participantErpList.filter(ar => participantList && !participantList.find(rm => rm.erp === ar.erp))}
                    style={{ paddingTop: 10 }}
                    onChange={(e, data) => this.handleParticipantChange(data)}
                    getOptionLabel={(option) => option.name}
                    renderInput={(params) => <TextField
                      {...params} required InputLabelProps={{
                        classes: {
                          root: classes.label
                        }
                      }}variant='outlined'
                      style={{ width: '100%' }}
                      className={classes.level__drop}
                    />}

                    defaultValue={participantList}
                  />

                </React.Fragment>
              }
            </Grid>
          </Grid>
          <Grid item xs={1} sm={1} md={1} />
        </Grid>
      </React.Fragment>

    )
  }
}
const mapStateToProps = state => ({
  user: state.authentication.user,
  participantBranches: state.branches.items,
  participantGrades: state.gradeMap.items
})
const mapDispatchToProps = dispatch => ({
  listBranches: () => dispatch(apiActions.listBranches()),
  gradeMapBranch: particpantBranchId => dispatch(apiActions.getGradeMapping(particpantBranchId))
})
export default connect(mapStateToProps, mapDispatchToProps)(withRouter(withStyles(useStyles)(Step3)))
