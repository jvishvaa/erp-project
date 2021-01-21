import React from 'react'
import { withRouter } from 'react-router-dom'
import axios from 'axios'
import Paper from '@material-ui/core/Paper'
import Grid from '@material-ui/core/Grid'
import { connect } from 'react-redux'
import Dialog from '@material-ui/core/Dialog'
import Slide from '@material-ui/core/Slide'
import LinkTag from '@material-ui/core/Link'
import { withStyles, Tabs, Tab, AppBar, Typography, Button, ExpansionPanelDetails, ExpansionPanel, ExpansionPanelSummary, ListItem } from '@material-ui/core/'
import { ExpandMore } from '@material-ui/icons'
import { urls, vimeoUrl } from '../../urls'
import { Pagination, InternalPageStatus } from '../../ui'
import { apiActions } from '../../_actions'
import GSelect from '../../_components/globalselector'
import { COMBINATIONS } from './config/view/combination'
import { COMBINATION as GRADECOMBINATION } from './config/view/gradeCombination'
import './styles/responsive.css'
import teacherSvg from './svgLogos/Teacher.svg'
import dateUploadSvg from './svgLogos/Date_UPLD.svg'
import lastUploadSvg from './svgLogos/Last_UPLD.svg'
import vOTD from './svgLogos/VOTD.svg'
import vPlay from './svgLogos/VPlay.svg'
// import PlayerInstance from './player'
import PlayerInstance from './vimeoPlayer/playerClass'

const Transition = React.forwardRef(function Transition (props, ref) {
  return <Slide direction='up' ref={ref} {...props} />
})
const styles = theme => ({
  root: {
    flexGrow: 1
  },
  paper: {
    padding: theme.spacing(1),
    marginTop: theme.spacing(2)
    // color: theme.palette.text.secondary
  },
  typography: {
    textAlign: 'justify'
    // color: 'black'
  },
  palecolortext: {
    color: theme.palette.text.secondary
    // color: 'rgb(242,242,242)'
  }
})

class playVideo extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      activePage: 1,
      currentTab: 0,
      isVideoOfDay: false,
      totalQuestions: 0,
      numOfCorrectAns: 0,
      timeSpent: 0,
      numOfInCorrectAns: 0,
      numOfSkippedquestions: 0,
      questionsMap: new Map(),
      reset: false,
      lmsKey: '',
      loading: false

    }
    this.handleFilter = this.handleFilter.bind(this)
    this.userProfile = JSON.parse(localStorage.getItem('user_profile'))
    this.role = this.userProfile.personal_info.role
    this.subjects = []

    this.getVideosDiv = this.getVideosDiv.bind(this)
    this.videoBlock = this.videoBlock.bind(this)
    this.getTruncatedDes = this.getTruncatedDes.bind(this)
    this.getLabels = this.getLabels.bind(this)
    this.getVideoLables = this.getVideoLables.bind(this)
    this.getTopBar = this.getTopBar.bind(this)
    this.renderGSelect = this.renderGSelect.bind(this)
  }

  componentDidMount () {
    this.getData()
    window.addEventListener('resize', this.setSizesOfPlayer)
    window.addEventListener('orientationchange', this.setSizesOfPlayer)
  }

  setSizesOfPlayer=() => {
    let { innerWidth, innerHeight } = { innerWidth: window.innerWidth, innerHeight: window.innerHeight }
    // let width = (innerWidth * 95) / 100
    let width = (innerWidth * 100) / 100
    let height = width * 0.55
    height = height > innerHeight ? innerHeight : height
    this.setState({ width, height })
  }

  getData = () => {
    this.handleFilter()
  }
  createQuery = params => params.filter(param => (param[1] !== undefined)).map(param => `${param[0]}=${param[1]}`).join('&')
  handleFilter () {
    const { subjectId, gradeId, chapterId, currentTab, isVideoOfDay, activePage = 1, videoType } = this.state
    const rolesWhichNeedUserId = ['Planner', 'Subjecthead']
    let userId = this.userProfile.personal_info.user_id
    let paramsObj = Object.assign({}, { page_number: activePage, grade_id: gradeId ? `[${gradeId}]` : undefined
    })
    if (currentTab === 0) {
      Object.assign(paramsObj, { chapter_id: chapterId, subject_id: subjectId ? `[${subjectId}]` : undefined, role: this.role })
      if (rolesWhichNeedUserId.includes(this.role)) {
        Object.assign(paramsObj, { user_id: userId })
      }
      // else {
      //   Object.assign(paramsObj, { role: this.role })
      // }
    } else if (currentTab === 1) {
      Object.assign(paramsObj, { is_video_of_day: isVideoOfDay, role: 'Student' })
    } else if (currentTab === 2) {
      // Object.assign(paramsObj, { video_type: `[${videoType}]`, role: this.role })
      Object.assign(paramsObj, { video_type: `[${videoType}]`, chapter_id: chapterId, subject_id: subjectId ? `[${subjectId}]` : undefined, role: this.role })
    }

    let query = this.createQuery(Object.entries(paramsObj))
    // if (window.isMobileFunc()) {
    //   query = 'page_number=1&grade_id=[5]&subject_id=[880]&role=Admin'
    // }
    this.filter(query)
  }

  filter (queryParams) {
    let { currentTab: currentTabBeforeAxios } = this.state
    this.setState({ isFetching: true, fetchFailed: undefined })

    axios
      .get(urls.LmsVideo + '?' + queryParams, {
        headers: {
          Authorization: 'Bearer ' + this.props.user
        }
      })
      .then(res => {
        if (res.status === 200) {
          let { currentTab: currentTabAfterAxios } = this.state
          if (currentTabBeforeAxios === currentTabAfterAxios) {
            let url = []
            let { total_page_count: totalPages, total_video_item_count: totalVideosCount } = res.data || {}
            res.data.data.map(data => {
              let videos = JSON.parse(data.video)
              videos.map(video => {
                url.push({
                  ...data,
                  // uri: vimeoUrl.get + video + '/?loop=true&autopause=true',
                  uri: vimeoUrl.get + video + '/?autopause=true',
                  videoId: video
                })
              })
            })
            this.setState({ url, videoData: res.data, totalPages, totalVideosCount })
          }
        }
        this.setState({ isFetching: false, fetchFailed: undefined })
      }).catch(error => {
        this.setState({ isFetching: false, fetchFailed: true })
        this.logError(error)
      })
  }

  handlePageChange = (pageNumber) => {
    this.setState({ activePage: pageNumber },
      () => this.handleFilter())
  }

  logError = (err, alertType = 'error') => {
    let { message, response: { data: { status: messageFromDev, err_msg: middleWareMsg } = {} } = {} } = err || {}
    let alertMsg
    if (messageFromDev) {
      alertMsg = messageFromDev
    } else if (middleWareMsg) {
      alertMsg = middleWareMsg
    } else if (message) {
      alertMsg = message
    } else {
      alertMsg = 'Failed to connect to server'
    }
    this.props.alert[alertType](`${alertMsg}`)
  }

  handleTabChange = (e, tab) => {
    // if (tab === 1) {
    //   this.setState({ isVideoOfDay: true })
    // } else if (tab === 2) {

    //   this.setState({ isVideoOfDay: true })
    // } else {
    //   this.setState({ isVideoOfDay: false })
    // }
    switch (tab) {
      case 0: {
        this.setState({ isVideoOfDay: false, videoType: undefined, recordedLectures: undefined })
        break
      }
      case 1: {
        this.setState({ isVideoOfDay: true, videoType: undefined, recordedLectures: undefined })
        break
      }
      case 2: {
        this.setState({ isVideoOfDay: false, videoType: 1, recordedLectures: true })
        break
      }
      default: {
        this.setState({ isVideoOfDay: false, videoType: undefined, recordedLectures: undefined })
      }
    }
    this.setState({ currentTab: tab,
      url: undefined,
      gradeId: undefined,
      subjectId: undefined,
      chapterId: undefined,
      activePage: 1
    }, () => { this.getData() })
  }

  onChange = (data) => {
    const { grade_id: gradeId, subject_id: subjectId, id: chapterId } = data
    const { gradeId: gradeIdFrmst, subjectId: subjectIdFrmSt } = this.state
    this.setState({
      gradeId,
      subjectId: gradeIdFrmst === gradeId ? subjectId : undefined,
      chapterId: (gradeIdFrmst === gradeId && subjectIdFrmSt === subjectId) ? chapterId : undefined,
      activePage: 1
    }, this.handleFilter)
  }
  getTruncatedDes (description = '', videoId) {
    const trucateAtCharlength = window.isMobileFunc() ? 200 : 400
    let { videoIdsSet = new Set() } = this.state
    return <span style={{ whiteSpace: 'pre-line' }}>
      {videoIdsSet.has(videoId) ? description : description.slice(0, trucateAtCharlength) }
      {description.length >= trucateAtCharlength
        ? <LinkTag
          component='button'
          onClick={() => {
            let { videoIdsSet = new Set() } = this.state
            if (videoIdsSet.has(videoId)) {
              videoIdsSet.delete(videoId)
            } else {
              videoIdsSet.add(videoId)
            }
            this.setState({ videoIdsSet })
          }}>
          <b>{videoIdsSet.has(videoId) ? ` view less` : '...view more'}</b>
        </LinkTag>
        : null }
    </span>
  }
  getLabels ({ uploadedBy = '', uploadedAt }) {
    return <Grid
      container
      spacing={1}
      direction='row'
      justify='space-between'
      alignItems='stretch'
    >
      {this.role.toLowerCase().includes('student') ? null
        : <Grid item xs={6}>
          <Grid
            container
            spacing={1}
            direction='row'
            justify='flex-start'
            alignItems='center'
          >

            <img src={teacherSvg} className='svg-logo' alt='svg-logo' />
            <p style={{ whiteSpace: 'pre-line' }}>
              {uploadedBy.replace(' ', '\n')}
            </p>
          </Grid>
        </Grid>
      }

      <Grid item xs={6}>
        <Grid
          container
          spacing={1}
          direction='row'
          justify='flex-start'
          alignItems='center'
        >

          <img src={dateUploadSvg} className='svg-logo' alt='svg-logo' />
          <p style={{ whiteSpace: 'pre-line' }}>
            {uploadedAt
              ? new Date(uploadedAt).toDateStringWithAMPM().replace('am', 'am\n').replace('pm', 'pm\n')
              // ? new Date(uploadedAt).toDateString()
              : 'Invalid Date'}
          </p>
        </Grid>

      </Grid>

    </Grid>
  }
  getVideoLables ({ gradeName, subjectName, chapterName }, isVideoOfDay, viewAllLabels = false) {
    // filterd varibales by user
    let { subjectId, gradeId, chapterId } = this.state
    let { classes: { palecolortext } = {} } = this.props
    const roles = ['Student', 'GuestStudent']
    const isStudent = roles.includes(this.role)
    let viewGrade = isStudent ? false : !gradeId
    let viewSubject = isVideoOfDay ? false : !subjectId
    let viewChapter = isVideoOfDay ? false : !chapterId
    viewAllLabels = isVideoOfDay ? false : viewAllLabels
    return <Grid
      container
      spacing={1}
      direction='row'
      // justify={window.isMobileFunc() ? 'space-between' : isVideoOfDay ? 'flex-start' : 'space-around'}
      justify={window.isMobileFunc() ? 'space-between' : isVideoOfDay ? 'flex-start' : 'space-between'}
      alignItems='center'
    >     {
        (viewGrade || viewAllLabels)
          ? <span>
            {/* <span className={palecolortext}>Grade: </span> */}
            {gradeName}<br />
          </span>
          : null
      }
      {
        (viewSubject || viewAllLabels)
          ? <span>
            <span className={palecolortext}>Subject: </span>
            {subjectName}<br />
          </span>
          : null
      }
      {
        (viewChapter || viewAllLabels)
          ? <span>
            {chapterName.toLowerCase().includes('chapter') ? null : <span className={palecolortext}>Chapter: </span>}
            {chapterName}
          </span>
          : null
      }

    </Grid>
  }

  dialogBox = () => {
    let { fullScrenOpen, videoType, recordedLectures } = this.state

    let { videoDataObj = {} } = this.state || {}
    let { uri, title, videoId, lmsId } = videoDataObj
    let { width, height } = this.state
    return <Dialog fullScreen open={fullScrenOpen} onClose={this.handleClose} TransitionComponent={Transition}>
      {fullScrenOpen &&
      <div
        style={{
          boxSizing: 'border-box',
          margin: 0,
          padding: 0,
          position: 'relative',
          display: 'flex'
        }}
      >
        <div style={{ margin: 'auto' }} >
          <PlayerInstance
            uri={uri}
            videoId={videoId}
            lmsId={lmsId}
            title={title || 'not found'}
            handleClose={this.handleClose}
            width={width}
            eight={height}
            height={window.innerHeight}
            videoDataObj={videoDataObj}
            isRecordedLecture={videoType === 1 && recordedLectures}
            alertMessages={this.props.alert}
            tab={this.state.currentTab}
          />
        </div>
      </div>
      }
    </Dialog>
  }

  componentWillMount () {
    console.clear()
    console.log('console.log cleared in view.js file')
    let { watch: fullScrenOpen, UUID: videoId, lmsId } = this.getSearchParams()
    if (!isNaN(Number(videoId)) && !isNaN(Number(lmsId))) {
      if (fullScrenOpen === 'true') {
        this.setVideoDataObjAndOpen(
          { videoId,
            lmsId,
            // uri: vimeoUrl.get + videoId + '/?autopause=true&autoplay=1'
            uri: vimeoUrl.get + videoId + '/?autopause=true'
            // uri: vimeoUrl.get + videoId + '/?loop=true&autopause=true&autoplay=1'
          }
        )
      }
    }
    this.setSizesOfPlayer()
  }
  getSearchParams = () => {
    let { location: { search = '' } = {} } = this.props
    const urlParams = new URLSearchParams(search) // search = ?open=true&qId=123
    const searchParamsObj = Object.fromEntries(urlParams) // {open: "true", def: "[asf]", xyz: "5"}
    return searchParamsObj
  }
  pushQueryParam = () => {
    let { videoId, lmsId } = this.state.videoDataObj || {}
    this.props.history.push(`?watch=true&lmsId=${lmsId}&UUID=${videoId}`)
  }
  popQueryParam = () => {
    this.props.history.push(this.props.location.pathname)
  }
  setVideoDataObjAndOpen = (videoDataObj) => {
    console.log(videoDataObj)
    this.setState({ videoDataObj }, () => this.handleClickOpen())
  }
  handleClickOpen=() => {
    this.setState({ fullScrenOpen: true }, () => this.pushQueryParam())
  }
  handleClose = () => {
    this.setState({ fullScrenOpen: false }, () => this.popQueryParam())
  }

  getSummaryData=(val) => {
    console.log(val)
    const { lmsId } = val
    const { RecordedLetureQuestionPaper } = urls

    let params = [
      ['lms_video_id', lmsId]
    ]
    this.setState({
      lmsKey: lmsId,
      loading: true
    })

    let query = this.createQuery(params)
    let pathWithQuery = RecordedLetureQuestionPaper + '?' + query

    axios.get(pathWithQuery, {
      headers: {
        Authorization: 'Bearer ' + this.props.user
      }
    })
      .then(res => {
        if (res.status === 200) {
          if (res.data.data.lms_vrl_details_user === null) {
            this.setState({
              reset: true,
              timeSpent: '00hr :00min :00sec',
              loading: false

            })
          } else {
            if (res.data.data.lms_vrl_details_user.last_view_position_seconds !== null) {
              var timestamp = res.data.data.lms_vrl_details_user.last_view_position_seconds
              var hours = Math.floor(timestamp / 60 / 60)

              var minutes = Math.floor(timestamp / 60) - (hours * 60)

              var seconds = Math.ceil(timestamp % 60)
              var formatted = hours + 'hr: ' + minutes + 'min: ' + seconds + 'sec'
              this.setState({
                timeSpent: formatted,
                reset: false,
                loading: false
              })
            } else {
              this.setState({
                timeSpent: '00hr :00min :00 sec',
                reset: false,
                loading: false
              })
            }
          }
        }
        let questions = res.data.data.question_details.map(item => item && item.response)
        const skipped = res.data.data.question_details.filter(item => !item.response).length
        const correctAns = questions.filter(item => item && item.correct).length
        const incorrectAns = questions.filter(item => item && !item.correct).length

        this.setState({
          numOfCorrectAns: correctAns,
          numOfInCorrectAns: incorrectAns,
          numOfSkippedquestions: skipped,
          totalQuestions: questions.length,
          loading: false
        })
      })
      .catch(err => {
        console.log(err)
        this.setState({
          reset: false,
          loading: false
        })
      })
  }

  resetQuestion=(val) => {
    const { lmsId } = val
    let payLoad = {
      'lms_video_id': lmsId,
      'is_reset': true
    }
    let { RecordedLeture } = urls
    let pathWithQuery = RecordedLeture
    axios
      .put(pathWithQuery, payLoad, {
        headers: {
          Authorization: 'Bearer ' + this.props.user
        }
      })
      .then(res => {
        this.props.alert.success('Resetted Successfully')
      })
      .catch(err => {
        console.log(err)
      })
  }
  videoBlock (videoObj, index) {
    /*
    let samplevideoObj = {
      'id': 2033,
      'video': '[402083532]',
      'video_title': 'video of the test',
      'video_description': 'test',
      'is_video_of_day': true,
      'uploaded_datetime': '2020-03-30T11:56:41.956137',
      'is_delete': false,
      'uploaded_by': {
        'id': 1143,
        'password': 'pbkdf2_sha256$120000$V1qqcvWChrwj$kNk8xnVvtEmAx64rFU5Hq7KL/Ja5gKLdFmqBpqEHU0U=',
        'last_login': '2020-03-30T16:47:51.418062',
        'is_superuser': true,
        'username': 'shree',
        'first_name': '',
        'last_name': '',
        'email': '',
        'is_staff': true,
        'is_active': true,
        'date_joined': '2018-10-03T17:22:50.188886',
        'groups': '[]',
        'user_permissions': '[]'
      },
      'grade': {
        'id': 5,
        'grade': 'Grade 1',
        'createdAt': '2018-12-07T18:30:46.643077',
        'updatedAt': '2018-12-07T18:30:46.880317',
        'is_delete': false,
        'order_num': 7,
        'grade_category': '{createdAt: "2018-12-14T14:56:01.619066", grade_cat…}'
      },
      'chapter': null,
      'deleted_by': null,
      'role': [
        {
          'id': 13,
          'role_name': 'Student',
          'is_delete': false,
          'collar_type': null
        }
      ],
      'uri': 'https://player.vimeo.com/video/402083532'
    }
    */
    let { classes } = this.props
    const {
      id: lmsId,
      video_title: title,
      video_description: description = '',
      is_video_of_day: isVideoOfDay,
      uploaded_by: uploadedByObj,
      uploaded_datetime: uploadedAt,
      grade: gradeObj,
      chapter: chapterObj,
      role: rolesArray,
      uri,
      videoId
    } = videoObj
    const { username = '', first_name: firstName = '', last_name: lastName = '' } = uploadedByObj || {}
    const fullName = `${firstName} ${lastName}`
    const uploadedBy = fullName.trim().length ? fullName : username.trim().length ? username : 'No name found'
    const { grade: gradeName = 'grade name not found' } = gradeObj || {}
    const { chapter_name: chapterName = 'chaper name not found', subject: subjectObj } = chapterObj || {}
    const { subject_name: subjectName = 'subject name not found' } = subjectObj || {}
    const [roleObj = {}] = rolesArray || []
    const { role_name: roleName } = roleObj
    let videoDataObj = {
      lmsId,
      videoId,
      title,
      description,
      isVideoOfDay,
      uploadedAt,
      uri,
      uploadedBy,
      gradeName,
      subjectName,
      roleName,
      chapterName,
      firstName,
      username,
      lastName,
      fullName
    }
    // const { activePage: pageNumber = 1, pageSize = 10 } = this.state
    const isMobile = window.isMobileFunc()
    // console.log(videoDataObj)
    // {/* <iframe
    //   id={uri}
    //   src={uri}
    //   style={{ padding: 0, margin: 'auto' }}
    //   frameBorder='0'
    //   allowFullScreen
    //   // {...isMobile ? {} : { width: '480', height: '360' }}
    //   {...isMobile ? {} : { width: '100%', minWidth: '100%', height: '280' }}
    //   webkitallowfullscreen
    //   mozallowfullscreen
    //   title={title || 'not foun'}
    // /> */}

    const { totalQuestions, timeSpent, numOfCorrectAns, numOfInCorrectAns, numOfSkippedquestions, currentTab, reset } = this.state
    return <Paper className={classes.paper} elevation={3}>
      <Grid container spacing={2} justify='space-evenly' direction='row-reverse' >
        <Grid item xs={12} sm={12} md={6} lg={6} xl={6} >
          <div style={{ position: 'relative' }}>
            <iframe
              frameBorder='0'
              allowFullScreen
              webkitallowfullscreen
              mozallowfullscreen
              // autoPlay
              videoId
              key={uri}
              src={uri}
              {...isMobile ? {} : { width: '100%', minWidth: '100%', height: '280' }}
              title={title || 'not found'}
              {...this.recordedLecturesAttemptiopnAccess.includes(this.role)
                ? { onClick: () => { this.setVideoDataObjAndOpen(videoDataObj) } }
                : { }
              }
            />
            {
              this.recordedLecturesAttemptiopnAccess.includes(this.role)
                ? <div style={{
                  position: 'absolute',
                  left: 0,
                  top: 0,
                  width: '100%',
                  height: '100%',
                  // border: '1px solid green',
                  cursor: 'pointer'
                }} onClick={() => this.setVideoDataObjAndOpen(videoDataObj)} />
                : null}
          </div>
        </Grid>
        <Grid item xs={12} sm={12} md={4} lg={4} xl={4}>
          {/* <span className={classes.palecolortext} >
            {((pageNumber - 1) * pageSize) + index + 1})
          </span> */}
          <Typography className={classes.typography} variant='subtitle1' gutterBottom>
            Title:&nbsp;{title.trim().length ? title : 'No title found'}
          </Typography>
          {description && description.trim().length
            ? <Typography className={classes.typography} variant='body2' gutterBottom>
                Description:&nbsp;
              <p style={{ backgroundColor: 'rgb(242,242,242)', fontWeight: 'lighter', padding: 6, margin: 1 }}>
                {description.trim().length
                  // ? description
                  ? this.getTruncatedDes(description, uri)
                  : 'No description found'}
              </p>
            </Typography>
            : null
          }
          <br />
          {

            this.recordedLecturesAttemptiopnAccess.includes(this.role) && currentTab === 2
              ? <div onClick={() => this.getSummaryData(videoDataObj)}>
                <ExpansionPanel style={{ 'margin-bottom': '10%' }} >
                  <ExpansionPanelSummary
                    expandIcon={<ExpandMore />}
                    aria-controls='panel1d-content' id='panel1d-header'>
                    <Typography style={{ color: '#5d1049' }}>View Summary</Typography>
                  </ExpansionPanelSummary>
                  {
                    this.state.loading ? <div>Loading...</div> : reset ? <Typography style={{ 'margin-left': '3%' }}>You have not yet taken the video.</Typography>
                      : this.state.lmsKey === videoDataObj.lmsId ? <ExpansionPanelDetails>
                        <Typography style={{ width: '200px', color: 'green' }}>
                          <ListItem style={{ width: 'max-content' }}><h5 >Total Questions :  {totalQuestions}</h5><br />
                          </ListItem>
                          <ListItem style={{ width: 'max-content' }}><h5>Number of correct questions:  {numOfCorrectAns}</h5><br />
                          </ListItem>
                          <ListItem style={{ width: 'max-content' }}><h5>Number of incorrect questions:  {numOfInCorrectAns}</h5><br />
                          </ListItem>
                          <ListItem style={{ width: 'max-content' }}><h5>Number of questions skipped:  {numOfSkippedquestions}</h5><br />
                          </ListItem>
                          <ListItem style={{ width: 'max-content' }}><h5>Last viewed position:  {timeSpent !== null || timeSpent !== 'NaN:NaN:NaN' ? timeSpent : '00hr :00 min :00sec'}</h5><br />
                          </ListItem>
                          <ListItem>

                            <Button variant='outlined' color='primary' onClick={() => { this.resetQuestion(videoDataObj) }}>Reset Questions</Button>

                          </ListItem>
                        </Typography>

                      </ExpansionPanelDetails> : ''
                  }

                </ExpansionPanel>

              </div>

              : ''

          }
          {this.getVideoLables({ gradeName, subjectName, chapterName }, isVideoOfDay, false)}
          <br />
          {this.getLabels({ uploadedBy, uploadedAt })}
        </Grid>
      </Grid>
    </Paper>
  }
  getVideosDiv () {
    let { url: videosArray, isFetching, fetchFailed } = this.state

    let { classes } = this.props
    if (isFetching) {
      return <InternalPageStatus label='Loading..' />
    } else if (fetchFailed) {
      return <InternalPageStatus
        loader={false}
        label={<p>Error occured in fetching data&nbsp;
          <LinkTag
            component='button'
            onClick={this.handleFilter}>
            <b>Click here to reload_</b>
          </LinkTag>
        </p>}
      />
    } else if (Array.isArray(videosArray) && videosArray.length === 0) {
      return <InternalPageStatus label='Hang tight! We are getting more content for you soon!' loader={false} />
    } else if (Array.isArray(videosArray) && videosArray.length) {
      return <div className={classes.root}>
        {videosArray.map((videoObj, index) => this.videoBlock(videoObj, index))}
      </div>
    }
  }
  getTopBar () {
    let { classes } = this.props
    let { totalVideosCount, fetchFailed, isFetching } = this.state
    const topbarItem = [
      { title: `Total ${isFetching ? 'loading..' : fetchFailed ? '--' : totalVideosCount}`, subtitle: 'Scholarly videos', icon: vPlay },
      { title: 'II pu com EBAS SANSKRIT', subtitle: 'uploaded at 24.03.2020', icon: lastUploadSvg },
      { title: '1', subtitle: 'Video of the day', icon: vOTD }
    ]
    return <Grid
      container
      spacing={4}
      direction='row'
      justify='space-between'
      alignItems='center'
      style={{ marginBottom: 1, marginTop: 1 }}
    >
      {topbarItem.map((item, index, arr) => {
        const { title, subtitle, icon } = item

        let gridLength = Math.round(12 / arr.length)
        return <Grid item xs={12} md={gridLength}>
          <Grid
            container
            spacing={2}
            direction='row'
            justify='flex-start'
            alignItems='center'
            style={{ backgroundColor: 'rgb(242,242,242)', color: '#5d1048', paddingLeft: 5 }}
          >
            <img src={icon} className='svg-logo-topbar' alt='svg-logo' />
            <Typography className={classes.typography} style={{ lineHeight: 'normal' }} variant='subtitle1' gutterBottom>
              {title}
              <small style={{ whiteSpace: 'pre-line' }}>
                {`\n${subtitle}`}
              </small>
            </Typography>
          </Grid>
        </Grid>
      })}
    </Grid>
  }
  renderGSelect () {
    let { currentTab = 0 } = this.state
    const { classes } = this.props || {}
    console.log(this.state.reset)
    if (currentTab === 1 && this.role.toLowerCase().includes('student')) {
      // in video of the day - there is no necessity of gselect for roles student and guest stundent
      return null
    } else {
      return <Paper className={classes.paper} elevation={1}>
        <div style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center', marginTop: 2 }}>
          <div>
            {
              currentTab === 0 || currentTab === 2
                ? <GSelect key='tab-0-gslect' config={COMBINATIONS} variant={'selector'} onChange={this.onChange} />
                : currentTab === 1
                  ? <GSelect key='tab-1-gslect' variant={'selector'} onChange={this.onChange} config={GRADECOMBINATION} />
                  : null
            }
          </div>
        </div>
      </Paper>
    }
  }
  tabsBarAccess = ['Admin', 'Planner', 'Subjecthead', 'Student', 'LeadTeacher', 'GuestStudent']
  recordedLecturesAttemptiopnAccess = ['Student', 'GuestStudent']
  render () {
    const { videoData, activePage, totalPages } = this.state

    return (
      <React.Fragment>
        {/* {
          fullScrenOpen
            ? this.dialogBox() */}

        {/* : */}
        {this.dialogBox()}
        <div style={{ padding: 15 }} >
          {this.tabsBarAccess.includes(this.role)
            ? <AppBar style={{ backgroundColor: '#f0f0f0' }} elevation={3} position='static'>
              <Tabs
                indicatorColor='primary'
                textColor='primary'
                onChange={this.handleTabChange}
                value={this.state.currentTab}
                variant='fullWidth'
              >
                <Tab label='All Videos' />
                <Tab label='Video of the Day' />
                <Tab label='Recorded Lectures' />
              </Tabs>
            </AppBar>
            : null
          }
          {/* {this.getTopBar()} */}
          {this.renderGSelect()}
          {this.getVideosDiv()}
          {totalPages > 1
            ? <div style={{ padding: 20, bottom: 20, right: 0, position: 'fixed' }}>
              <Pagination
                // rowsPerPageOptions={[10, 10]}
                // labelRowsPerPage={'Videos per page'}
                rowsPerPageOptions={[]}
                labelRowsPerPage=''
                page={activePage - 1}
                count={videoData.total_video_item_count}
                rowsPerPage={10}
                onChangePage={(e, i) => { this.handlePageChange(i + 1) }}
              />
            </div>
            : null
          }
        </div>
        {/* } */}
      </React.Fragment>
    )
  }
}

const mapStateToProps = state => ({
  user: state.authentication.user,
  subject: state.subjects.items
})

const mapDispatchToProps = dispatch => ({
  listSubjects: dispatch(apiActions.listSubjects())
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(withRouter(playVideo)))

// { /* <span style={{ position: 'absolute', top: 0, zIndex: '10000' }}>
//           <button onClick={this.handleClose} >X</button>
//           {title}
//           width:{width}<br />
//           height:{height}<br />
//           window.innerHeight{window.innerHeight}<br />
//           window.innerWidth{window.innerWidth}<br />
//         </span> */ }
// { /* {uri} */ }
