/* eslint-disable no-undef */
/* eslint-disable camelcase */
import React, { Component } from 'react'
import { withStyles } from '@material-ui/core/styles'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import Modal from '@material-ui/core/Modal'
import Grid from '@material-ui/core/Grid'
import Backdrop from '@material-ui/core/Backdrop'
import { Button, Typography } from '@material-ui/core'
import TextField from '@material-ui/core/TextField'
import Fade from '@material-ui/core/Fade'
import Card from '@material-ui/core/Card'
import AppBar from '@material-ui/core/AppBar'
import Tabs from '@material-ui/core/Tabs'
import Tab from '@material-ui/core/Tab'
import Box from '@material-ui/core/Box'
import ReactTable from 'react-table'
import CardContent from '@material-ui/core/CardContent'
import axios from 'axios'
import { urls } from '../../urls'
import Home from './components/home'
import BadgesHome from './components/badgesHome'

function TabPanel (props) {
  const { children, value, index, ...other } = props

  return (
    <div
      role='tabpanel'
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box p={3}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  )
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired
}

function a11yProps (index) {
  console.log(index)
  return {
    id: `wrapped-tab-${index}`,
    'aria-controls': `wrapped-tabpanel-${index}`
  }
}
const useStyles = theme => ({
  modalStyle1: {
    position: 'absolute',
    top: '10%',
    left: '10%',
    overflow: 'scroll',
    height: '100%',
    display: 'block'
  },
  custom_bodor: {
    'border-bottom': '1px solid #5d2449',
    margin: '10px 0px'
  },
  paper: {
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3)
  },
  label: {
    backgroundColor: 'white',
    paddingLeft: 5,
    paddingRight: 5 },
  cardroot: {
    minWidth: 275,
    margin: 10,
    boxShadow: '0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24)',
    transition: 'all 0.3s cubic-bezier(.25,.8,.25,1)'
  },
  under__line: {
    'margin-top': '2%',
    'margin-bottom': '2%',
    'border-bottom': '2px solid #5d2449'
  }
})

class Step4 extends Component {
  constructor (props) {
    super(props)
    this.state = {
      Tabvalue: 1,
      open: false,
      badgeOpen: false,
      event: this.props.event,
      eventDate: this.props.eventDate,
      tabChangeLoading: false,
      // Issuerbranch_id: this.props.branchid,
      winnerDetailslist: [],
      role: this.props.role,
      signId: this.props.signId,
      category: this.props.category,
      nameOfSignatory: this.props.nameOfSignatory,
      designationOfsignatory: this.props.designationOfsignatory,
      participantIdList: [],
      participantExcelErpList: [],
      pageSize: 10,
      pageNumber: 0,
      isBadgesLoading: false,
      isCertificateLoading: false,
      isCertificateSubmited: false,
      isBadgeSubmitted: false,
      isCerticicateOnly: false,
      skipped: this.props.skepped,
      isBadgesOnly: false,
      participantList: this.props.participantList,
      newWinnerList: this.props.newWinnerList,
      winnerList: this.props.winnerList,
      isExcel: this.props.isExcel
    }
    this.child = React.createRef()
    this.role = JSON.parse(localStorage.getItem('user_profile')).personal_info.role
  }
  componentWillMount () {
    // eslint-disable-next-line no-debugger
    debugger
    let { participantList, newWinnerList, winnerList } = this.state

    this.setState({
      Tabvalue: ((newWinnerList && newWinnerList.length) || (winnerList && winnerList.length)) > 0 ? 0 : 1
    })
    console.log(this.props.newWinnerList)
    let academicProfile = JSON.parse(localStorage.getItem('user_profile')).academic_profile
    let issuerbranchId = academicProfile && academicProfile.branch_id
    this.setState({ issuerbranchId: issuerbranchId })

    if (this.props.badgeFile) {
      this.getStudentData(0)
    }
    if (participantList && participantList.length) {
      if ((newWinnerList && newWinnerList.length) || (winnerList && winnerList.length)) {
        const excludeWinnerList = participantList.filter(({ erp: prtErp }) => !(winnerList || newWinnerList).some(({ erp: winrErp }) => prtErp === winrErp))
        this.setState({ participantList: excludeWinnerList })
      }
      this.setState({ participantCount: participantList.length })
    }
    if (this.props.skipped && !this.props.skipped.size) {
      this.props.alert.warning('Preview All the Certificate Before Submission')
    }
  }
  componentWillReceiveProps (nextProps) {
    if (nextProps.user !== this.props.user) {
      this.submitAll(nextProps.user)
    }
  }
  handleOpen = (e, i, value) => {
    console.log(value)
    if (!value.grade || !value.name || !this.state.event) {
      this.props.alert.warning('please fill required field')
      return
    }
    this.setState({ open: true, Id: i, allSubmit: false })
  }

  handleClose = () => {
    this.setState({ open: false })
  }
  onNameChange =(value) => {
    console.log(value)
    this.setState({ name: value })
  }
  onClassChange =(value) => {
    console.log(value)
    this.setState({ grade: value })
  }
  onEventChange =(value, id) => {
    console.log(value)
    this.setState({ event: value, Id: id })
  }
  onSignatureChange = (value, id) => {
    console.log(value)
    this.setState({ nameOfSignatory: value })
  }
  getUnique (arr, comp) {
    const unique = arr
      .map(e => e[comp])

    // store the keys of the unique objects
      .map((e, i, final) => final.indexOf(e) === i && i)

      // eliminate the dead keys & store unique objects
      .filter(e => arr[e]).map(e => arr[e])

    return unique
  }

  handleSubmit=(erp, position, brId, mapId, sectionMapId, signature_id, fileObj) => {
    let { winnerDetailslist = [] } = this.state
    let studentListMap = new Map(winnerDetailslist.map(item => ([item.erp, item])))
    studentListMap.set(erp, { erp, position, 'branch_id': brId, 'acad_grade_mapping_id': mapId, 'acad_section_mapping_id': sectionMapId, 'signature_of': signature_id, 'file_path': fileObj, fileObj })
    this.setState({ winnerDetailslist: [...studentListMap.values()] })
    this.certificateVisited()
  }
  certificateVisited = () => {
    let { winnerDetailslist: studentCertFicatesArr } = this.state
    let { newWinnerList, winnerList } = this.props
    if (studentCertFicatesArr.length === (winnerList.length || newWinnerList.length)) {
      this.setState({ certificateVisited: true })
    }
  }
  postDetails=() => {
    let { CertificateSubmission } = urls

    let { role, event, winnerDetailslist: studentCertFicatesArr, issuerbranchId, category } = this.state
    let { alert, newWinnerList, winnerList } = this.props

    const formData = new FormData()

    if (studentCertFicatesArr.length === (winnerList.length || newWinnerList.length)) {
      this.setState({ isCertificateLoading: true })
      formData.set('certificate_belongs_to', role)
      formData.set('event_name', event)
      // formData.set('signature_of', signId)
      formData.set('category_id', category && category.id)
      if (this.role !== 'Admin' || issuerbranchId === 2) {
        formData.set('issuer_branch_id', issuerbranchId)
      }
      formData.set('conducted_date', this.state.eventDate)
      formData.set('winner_list', JSON.stringify(studentCertFicatesArr))
      studentCertFicatesArr.forEach(studentCertObj => {
        formData.set(`${studentCertObj.erp}_file_obj`, studentCertObj.fileObj)
      })

      axios
        .post(CertificateSubmission, formData, {
          headers: {
            Authorization: 'Bearer ' + this.props.user,
            'Content-Type': 'application/json'
          }
        })
        .then(res => {
          if (res.data && res.data.status) {
            alert.success('Certificate Submitted')
            this.setState({ isCertificateLoading: false, isCertificateSubmited: true })
          }
        })
        .catch(error => {
          let { response: { data: { status } = {} } = {}, message } = error
          if (!status && message) {
            this.props.alert.error(JSON.stringify(message))
          } else {
            this.props.alert.error(JSON.stringify(status))
          }
          this.setState({ isTemplateLoading: false })
        })
    } else {
      this.props.alert.error('Preview The Certificate before submission')
    }
  }
  submitAll =() => {
    this.setState({ allSubmit: true })
  }
  handleChange = (event, tabVal) => {
    let { participantList } = this.state
    this.setState({
      Tabvalue: tabVal,
      currentPage: 0,
      pageNumber: 0,
      tabChangeLoading: true
    })
    if (tabVal === 1) {
      if (this.props.badgeFile) {
        this.getParticipantsDetails(0)
      }
      if (participantList && participantList.length) {
        this.setState({ tabChangeLoading: false })
      }
      this.setState({ badgesVisited: true })
    }
  }
  getParticipantsDetails = (pageNumber) => {
    let { eventDate } = this.props
    let { event, category, role, pageSize, participantExcelErpList, participantIdList } = this.state
    axios.get(`${urls.ParticipantDetails}?category_id= ${category.id}&event_name=${event}&conducted_date=${eventDate}&badges_belongs_to=${role}&page_number=${(Number(pageNumber || 0) + 1)}&page_size=${pageSize}`, {
      headers: {
        Authorization: 'Bearer ' + this.props.user
      }
    }).then(res => {
      let { data: { data = [] } = {} } = res

      if (data.result && data.result.length) {
        this.setState({
          finalData: data.result,
          tabChangeLoading: false,
          totalPages: data.total_pages,
          currentPage: Number(data.current_page) - 1,
          pageSize: data.page_size
        })
      }
      let participantCount = data.no_of_participant
      const prtList = participantExcelErpList && participantExcelErpList.length ? participantExcelErpList : []
      participantExcelErpList = [...new Set([...prtList.map(v => v), ...data.result.filter(e => e.erp).map(v => v.erp)])]
      this.setState({ participantExcelErpList, participantCount, participantIdList })
    }).catch(error => {
      console.log(JSON.stringify(error), error)
      let { response: { data: { status } = {} } = {}, message } = error
      if (!status && message) {
        this.props.alert.error(JSON.stringify(message))
      } else {
        this.props.alert.error(JSON.stringify(status))
      }
    })
  }
  handleBadgesSubmit = (fileObj) => {
    this.setState({ badgeFileObj: fileObj })
    console.log(fileObj)
  }
  handleBadgeOpen = () => {
    this.setState({ badgeOpen: true })
  }
  handleBadgeClose = () => {
    this.setState({ badgeOpen: false })
  }

  validateBadgesTab =() => {
    // eslint-disable-next-line no-debugger
    debugger
    let { participantExcelErpList, participantCount } = this.state
    if (participantExcelErpList && participantExcelErpList.length !== participantCount) {
      this.props.alert.error('please view all badges records')
      return true
    }
    return false
  }
  postBadgeDetails = () => {
    let { role, event, participantList, issuerbranchId, category, badgeFileObj } = this.state
    let { alert } = this.props
    let { participantExcelErpList } = this.state
    let ErpList = [...new Set(participantExcelErpList.map(e => { return ({ erp: e }) }))]

    let formData = new FormData()
    formData.set('badges_belongs_to', role)
    formData.set('category_id', category && category.id)
    formData.set('conducted_date', this.state.eventDate)
    formData.set('event_name', event)
    if (this.role !== 'Admin' || issuerbranchId === 2) {
      formData.set('issuer_branch_id', issuerbranchId)
    }
    if (this.props.badgeFile) {
      if (this.validateBadgesTab()) {
        return
      }
      formData.set('participant_list', JSON.stringify((ErpList)))
      // ErpList.forEach(e => {
      //   formData.set(`${e.erp}_file`, this.state.badgeFileObj)
      // })
      formData.set('participants_badge_file', badgeFileObj)
    } else {
      console.log(participantList, 'pat')
      const newParticipantList = participantList.map(e => ({
        erp: e.erp,
        branch_id: e.branch,
        acad_grade_mapping_id: e.acad_grade_mapping_id,
        acad_sec_mapping_id: e.acad_sec_mapping_id
      }))
      formData.set('participant_list', JSON.stringify(newParticipantList))
      newParticipantList.forEach(particioantObj => {
        formData.set(`${particioantObj.erp}_file`, this.state.badgeFileObj)
      })
    }

    axios

      .post(`${urls.AssigningBadges}`, formData, {
        headers: {
          Authorization: 'Bearer ' + this.props.user,
          'Content-Type': 'application/json'
        }
      })
      .then(res => {
        console.log(res)
        if (res.data && res.data.status) {
          alert.success('Badges Assigned')
          this.setState({ isBadgesLoading: false, isBadgeSubmitted: true })
        }
        // this.props.alert.success(res.data)
      })
      .catch(error => {
        let { response: { data: { status } = {} } = {}, message } = error
        if (!status && message) {
          this.props.alert.error(JSON.stringify(message))
        } else {
          this.props.alert.error(JSON.stringify(status))
        }
      })
  }
  getStudentData =(pNumber) => {
    this.getParticipantsDetails(pNumber)
  }
  commonSubmittion = () => {
    if (this.state.badgesVisited && this.state.certificateVisited) {
      if (this.props.badgeFile) {
        if (this.validateBadgesTab()) {
          return
        }
      }
      this.postDetails()
      this.postBadgeDetails()
    } else if (!this.props.badgeFile && !(this.state.participantList && this.state.participantList.length)) {
      this.setState({ isCerticicateOnly: true })
      this.postDetails()
    } else if (this.props.skipped && this.props.skipped.size) {
      this.setState({ isBadgesOnly: true })
      this.postBadgeDetails()
    } else if (!this.state.certificateVisited) {
      this.props.alert.warning('Preview Certificate')
    } else if (!this.state.badgesVisited) {
      this.props.alert.warning('Please Check Participants in Participants Tab')
    }
  }

  getColumns=(cObj) => {
    let { pageNumber, pageSize } = this.state

    const excelColumns = [
      {
        Header: <div className='student'>Sr</div>,
        accessor: 'id',
        Cell: (row) => {
          return <div>{ (pageSize * pageNumber + (row.index + 1))}</div>
        }
        // maxWidth: 60
      },
      {
        Header: <div className='student'>Name</div>,

        accessor: `${cObj.name}`,
        Cell: props => <span className='number'>{props.value ? props.value : 'NIL'}</span>
        // maxWidth: 100
      },
      {
        Header: <div className='student'>ERP</div>,

        accessor: 'erp',
        Cell: props => <span className='number'>{props.value ? props.value : 'NIL'}</span>
        // maxWidth: 100
      },
      {
        Header: <div className='student'>Branch</div>,

        accessor: `${cObj.branch_name}`,
        Cell: props => <span className='number'>{props.value ? props.value : 'NIL'}</span>
        // maxWidth: 100
      }, {
        Header: <div className='student'>Grade</div>,

        accessor: `${cObj.grade_name}`,
        Cell: props => <span className='number'>{props.value ? props.value : 'NIL'}</span>
        // maxWidth: 100
      }, {
        Header: <div className='student'>Section</div>,
        accessor: `${cObj.section_name}`,
        Cell: props => <span className='number'>{props.value ? props.value : 'NIL'}</span>
        // maxWidth: 100
      }

    ]

    return excelColumns
  }

  getReactTable = () => {
    let { pageSize, pageNumber, totalPages, tabChangeLoading, finalData, participantList } = this.state

    const columnsCellObj = {
      name: finalData ? `user.first_name` : `name`,
      branch_name: finalData ? `branch.branch_name` : `branch_name`,
      grade_name: finalData ? `branch_grade_acad_session_mapping.grade.grade` : `grade_name`,
      section_name: finalData ? `acad_section_mapping.section.section_name` : `section_name`

    }

    return (
      <ReactTable
        manual
        loading={tabChangeLoading}
        data={finalData || (participantList || [])}
        showPagination
        showPageSizeOptions={false}
        defaultPageSize={pageSize}
        style={{ maxWidth: '100%' }}
        onPageChange={(pNo) => {
          this.setState({ pageNumber: pNo, tabChangeLoading: true }, () => { this.getStudentData(pNo) })
        }}
        page={pageNumber}
        pages={totalPages}
        columns={this.getColumns(columnsCellObj)}
      />
    )
  }
  render () {
    let { classes } = this.props
    let { selectedTemplate, newWinnerList, winnerList } = this.props
    let { event, Tabvalue, category, finalData, participantCount, isBadgesLoading, isCertificateLoading, isBadgeSubmitted, isCertificateSubmited, isCerticicateOnly, isBadgesOnly, participantList } = this.state
    console.log(newWinnerList, winnerList, 'winner')
    let { allSubmit } = this.state
    let submitProps = { handleSubmit: this.handleSubmit, handleBadgesSubmit: this.handleBadgesSubmit, alert: this.props.alert }
    return (
      <div>
        <AppBar position='static' color='default'>
          <Tabs variant='fullWidth' indicatorColor='primary' value={Tabvalue} onChange={this.handleChange} aria-label='simple tabs example'>
            {((newWinnerList && newWinnerList.length) || (winnerList && winnerList.length)) > 0 ? <Tab label='Certificates' {...a11yProps(0)} /> : <Tab disabled label='Certificates' {...a11yProps(0)} />}
            {this.props.badgeFile || (this.state.participantList && participantList.length) ? <Tab label={`Participant Badges - ${(participantCount === undefined) ? 'Loading' : participantCount}`} {...a11yProps(1)} />
              : <Tab disabled label='Badges' {...a11yProps(1)} />}
          </Tabs>
          {this.props.skipped && !this.props.skipped.size ? <TabPanel value={Tabvalue} index={0}>
            <Grid className={classes.under__line} />
            <Card className={classes.cardroot}>
              <CardContent style={{ backgroundColor: '#eee', padding: '20px' }}>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={12} md={12}>
                    <Grid container spacing={2}>
                      <Grid item xs={12} sm={6} md={6}>
                        <TextField id='outlined-basic' style={{ width: 200 }} onChange={e => this.onEventChange(e.target.value)} label='Event' inputProps={{
                          maxLength: 26
                        }}defaultValue={event} />
                        <Typography variant='subtitle2' style={{ color: '#9e9e9e' }}>Max 26 Characters</Typography>
                      </Grid>
                      <Grid item xs={12} sm={6} md={6}>
                        {(newWinnerList || winnerList).filter((v, i, a) => a.findIndex(t => (t.brId === v.brId)) === i).map(item => {
                          return <React.Fragment>
                            <TextField disabled id='outlined-basic' style={{ width: 200 }} onChange={e => this.onSignatureChange(e.target.value)} label='Signature' inputProps={{
                              maxLength: 14
                            }}defaultValue={item.signatureName} />
                            {/* <Typography variant='subtitle2' style={{ color: '#9e9e9e' }}>Max 14 Characters</Typography> */}
                          </React.Fragment>
                        })}
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
            {((newWinnerList && newWinnerList) || (winnerList && winnerList)).map((e, i) => {
              return (<Card className={classes.cardroot}>
                <CardContent>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={3} md={3}>
                      <TextField id='outlined-basic' onChange={c => { e.name = c.target.value }} label='Name' defaultValue={e.name} />
                    </Grid>
                    <Grid item xs={12} sm={3} md={3}>
                      <TextField
                        id='outlined-basic'
                        disabled
                        onChange={c => { e.grade = c.target.value }}
                        label='Grade' defaultValue={e.grade}
                        inputProps={{
                          maxLength: 7
                        }}
                        helperText='Max 7 Characters'
                      />
                    </Grid>
                    <Grid item xs={12} sm={3} md={3}>
                      <TextField id='outlined-basic' label='position' defaultValue={e.rank} disabled />
                    </Grid>
                    <Grid item xs={12} sm={3} md={3}>
                      <Button
                        key={i}
                        id={i}
                        variant='outlined'
                        color='primary'
                        onClick={(event) => this.handleOpen(event, i, e)}
                      >
                    Preview Certificate
                      </Button>
                      {i === this.state.Id && <Modal
                        id={i}
                        key={i}
                        aria-labelledby='transition-modal-title'
                        aria-describedby='transition-modal-description'
                        className={classes.modalStyle1}
                        open={this.state.open}
                        onClose={this.handleClose}
                        closeAfterTransition
                        BackdropComponent={Backdrop}
                        BackdropProps={{
                          timeout: 500
                        }}
                      >
                        <Fade in={this.state.open}>
                          <div className={classes.paper}>
                            <React.Fragment>
                              <Home key={i}id={i} src={selectedTemplate} erp={e.erp} name={e.name} branch={e.brId} grade={e.grade} mapId={e.mappingId} sectionMapId={e.sectionMapId} rank={e.rank} event={event} eventDate={this.state.eventDate} allSubmit={allSubmit} signId={e.signature_id} signature={e.signUrl} signatureName={e.signatureName} signatureDesignation={e.signatureDesignation} {...submitProps} />
                              <Button variant='outlined' color='primary' onClick={this.handleClose}>Close</Button>
                            </React.Fragment>
                          </div>
                        </Fade>
                      </Modal>
                      }
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
              )
            })}

          </TabPanel> : Tabvalue === 0 && <div style={{ textAlign: 'center', padding: '50px' }}><Typography>There are no  winners</Typography></div>}
          <TabPanel value={Tabvalue} index={1}>

            <BadgesHome catergoryId={category.id} src={selectedTemplate} event={event} eventDate={this.state.eventDate} preview={false} {...submitProps} />
            {(isBadgesLoading || isCertificateLoading) && <div className='notification-text'>please wait submitting...</div>}

            {((finalData && finalData.length) || (participantList && participantList.length)) &&
            this.getReactTable()
            }

          </TabPanel>
        </AppBar>
        <Button variant='contained'
          color='primary'
          fullWidth
          onClick={() => this.commonSubmittion()}
          disabled={isBadgesLoading || isCertificateLoading || (this.props.skipped && this.props.skipped.size && Tabvalue === 0)}
        >
          {(this.props.skipped && this.props.skipped.size && Tabvalue === 0) ? 'Confirm Submission' : (isBadgesLoading || isCertificateLoading) ? 'Confirming Submission...' : 'Confirm Submission'}
        </Button>
        { ((isBadgeSubmitted || isCerticicateOnly) && (isCertificateSubmited || isBadgesOnly)) && this.props.handleNext()}
      </div>
    )
  }
}
const mapStateToProps = state => ({
  user: state.authentication.user
})

export default connect(
  mapStateToProps
)(withStyles(useStyles)(Step4))
