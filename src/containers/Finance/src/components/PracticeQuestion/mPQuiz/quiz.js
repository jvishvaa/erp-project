import React from 'react'
import { Howl } from 'howler'
import Dialog from '@material-ui/core/Dialog'
import { Slide, Modal, Avatar } from '@material-ui/core'
import LinkTag from '@material-ui/core/Link'
import IconButton from '@material-ui/core/IconButton'
import PauseIcon from '@material-ui/icons/Pause'
import FullscreenIcon from '@material-ui/icons/Fullscreen'
import FullscreenExitIcon from '@material-ui/icons/FullscreenExit'
import ClearIcon from '@material-ui/icons/Clear'
import CancelIcon from '@material-ui/icons/Cancel'
import PeopleIcon from '@material-ui/icons/People'
// import SettingsIcon from '@material-ui/icons/Settings'
import QuestionHandler from './questionsModule/questionHandler'
import {
  WebSockectEvents,
  fetchParticipants,
  eventLabels,
  FullScreenConstructor,
  removeUserTrigger,
  startQuizTrigger,
  endQuizTrigger,
  joinLobby,
  triggerFetchParticipants
} from './utilities'
// eslint-disable-next-line import/no-duplicates
import { ParticipantCount, QuizTimer, QuestionCount, CurrentRank } from './leaderboard/LeaderBoardUtility'
// eslint-disable-next-line import/no-duplicates
import CurrentScore from './leaderboard/LeaderBoardUtility'
import Background from './leaderboard/assets/quiz_background.svg'
import StudentDetails from './leaderboard/StudentDetails'
// import OrderedList from './leaderboard/OrderedList'
import './styles/home.css'
import PostQuizLeaderboard from './leaderboard/PostQuiz/PostQuizLeaderboard'
import HostPostQuizReport from './leaderboard/HostPostQuizReport/HostPostQuizReport'
import ChangeAvatar from './ChangeAvatar'
// import Sound from './Sound'
// import sampleMusic from './sample.mp3'
// import sampleMusic2 from './sample_two.mp3'
// import { urls } from '../../../urls'

const Transition = React.forwardRef(function Transition (props, ref) {
  return <Slide direction='up' ref={ref} {...props} />
  // return <Fade direction='in' ref={ref} {...props} />
})
class MPQuiz extends React.Component {
  /**
 * Live Muilti-player quiz on completion of online class (wbsckt based)
 **/
  constructor (props) {
    super(props)
    // decide host or joine first then set to the state
    // let role = JSON.parse(localStorage.getItem('user_profile')).personal_info.role
    // this.state = { isHost: role.includes('Teacher'), isQuizStarted: false }

    this.updateChildParamToState = this.updateChildParamToState.bind(this)
    this.getQuestionBtn = this.getQuestionBtn.bind(this)
    this.getFullScreenBtn = this.getFullScreenBtn.bind(this)
    this.getJoineeCountLabel = this.getJoineeCountLabel.bind(this)
    this.getClearOrPauseBtn = this.getClearOrPauseBtn.bind(this)

    this.getTopBarContent = this.getTopBarContent.bind(this)
    this.getContainerContent = this.getContainerContent.bind(this)

    this.getHostLobbyTopBarContent = this.getHostLobbyTopBarContent.bind(this)
    this.getHostLobbyContainerContent = this.getHostLobbyContainerContent.bind(this)
    this.getHostQuizContainerContent = this.getHostQuizContainerContent.bind(this)
    this.getHostQuizTopBarContent = this.getHostQuizTopBarContent.bind(this)
    this.getJoineeLobbyTopBarContent = this.getJoineeLobbyTopBarContent.bind(this)
    this.getJoineeQuizTopBarContent = this.getJoineeQuizTopBarContent.bind(this)
    this.getJoineeLobbyContainerContent = this.getJoineeLobbyContainerContent.bind(this)
    this.getJoineeQuizContainerContent = this.getJoineeQuizContainerContent.bind(this)

    this.onReceiveMessage = this.onReceiveMessage.bind(this)
    this.retrieveWSDataFromProps = this.retrieveWSDataFromProps.bind(this)

    this.getCurrentUserInfo = this.getCurrentUserInfo.bind(this)

    /* Full screen handler */
    this.fSHandler = new FullScreenConstructor((fSActivated, csrObj) => {
      /*
        updating variable in state on change of screen (full screen) to update btn icons accordingly
      */
      this.setState({ fSActivated })
    })

    let { bgms: { game: gameBgms = [] } = {} } = props
    this.bgmUrl = null
    if (gameBgms.length) {
      let item = gameBgms[Math.floor(Math.random() * gameBgms.length)]
      let { url: bgmSrc } = item
      this.bgmUrl = bgmSrc
    }
    this.myRef = React.createRef()
  }

  state = {
    showSettingsModal: false,
    isMobile: window.innerWidth <= 500,
    personalInfo: JSON.parse(localStorage.getItem('user_profile')).personal_info,
    isMuted: false
  }

  isPageReloaded = () => {
    if (window.performance) {
      if (window.performance.navigation.type === 1) {
        return true
      } else {
        return false
      }
    }
  }

  componentDidMount () {
    triggerFetchParticipants(this.props.websocket)
    if (this.isPageReloaded()) {
      this.setState({ isMuted: true })
    }
  }

  SoundPlay = () => {
    let { bgms: { game: gameBgms = [] } = {} } = this.props
    // eslint-disable-next-line no-debugger
    debugger
    if (gameBgms.length) {
      const Sounds = new Howl({
        src: [...gameBgms],
        autoplay: true,
        loop: true,
        volume: 0.5
      })
      Sounds.play()
    }
  }

  updateChildParamToState (keyName = 'unknown', data = {}) {
    let { [keyName]: prevData } = this.state
    this.setState({ [keyName]: { ...prevData, ...data } })
    // this[keyName] = { ...prevData, ...data }
  }

  onReceiveMessage () {
    const { websocket } = this.props
    try {
      websocket.onmessage = evt => { // listen to data sent from the websocket server
        const message = JSON.parse(evt.data)
        // let { event } = message || {}
        let { status: { success, message: statusMessage } = {} } = message
        if (success) {
          this.setState({ dataFromServer: message })
        } else {
          window.alert(`${statusMessage}`)
        }
        console.log(message)
      }
    } catch (error) {
      console.log(error) // catch error
    }
  }

  getJoineeLobbyTopBarContentTeccc () {
    return (
      <React.Fragment>

        {/* <div className='actions-container'> */}
        <IconButton style={{ background: 'rgb(84,84,84)', borderRadius: '8px', padding: 4, minWidth: '34px', minHeight: '34px', maxHeight: '34px' }} aria-label='upload picture' component='span'>
          <PauseIcon style={{ padding: 0, margin: 0, fontSize: '1.6rem', fontWeight: 'bolder' }} />
        </IconButton>
        {/* <p>Waiting for payers to join the game...</p> */}
        <IconButton style={{ background: 'rgb(84,84,84)', borderRadius: '8px', padding: 4, minWidth: '34px', minHeight: '34px', maxHeight: '34px' }} aria-label='upload picture' component='span'>
          <FullscreenIcon style={{ padding: 0, margin: 0, fontSize: '1.6rem', fontWeight: 'bolder' }} />
        </IconButton>
        <IconButton style={{ background: 'rgb(84,84,84)', borderRadius: '8px', padding: 4, minWidth: '34px', minHeight: '34px', maxHeight: '34px' }} aria-label='upload picture' component='span'>
          <ClearIcon style={{ padding: 0, margin: 0, fontSize: '1.6rem', fontWeight: 'bolder' }} />
        </IconButton>
        <IconButton style={{ background: 'rgb(84,84,84)', borderRadius: '8px', padding: 4, minWidth: '34px', minHeight: '34px', maxHeight: '34px' }} aria-label='upload picture' component='span'>
          <PeopleIcon style={{ padding: 0, margin: 0, fontSize: '1.6rem', fontWeight: 'bolder' }} />&nbsp;<span style={{ padding: 0, margin: 0, fontSize: '1rem' }}>3</span>
        </IconButton>

        <div style={{ display: 'flex', fontWeight: 'bold', textAlign: 'center', background: 'rgb(84,84,84)', borderRadius: '8px', padding: 4, minWidth: '34px', minHeight: '34px', maxHeight: '34px' }}>
          <span style={{ margin: 'auto' }}>6216 3535</span>
        </div>
        <div style={{ display: 'flex', fontWeight: 'bold', textAlign: 'center', background: 'rgb(84,84,84)', borderRadius: '8px', padding: 4, minWidth: '34px', minHeight: '34px', maxHeight: '34px' }}>
          <span style={{ margin: 'auto' }}>1<small><small>/10</small></small></span>
        </div>
      </React.Fragment>
    )
  }
  getHostQuizTopBarContent () {
    // return <p>Host quiz topbar cnt</p>
    return <React.Fragment>
      <button
        className='btn__end--quiz'
        onClick={() => {
          let ifYes = window.confirm('Are you sure on your action?')
          if (ifYes) {
            endQuizTrigger(this.props.websocket)
          }
        }} >End Quiz</button>
    </React.Fragment>
  }

  getFullScreenBtn () {
    return <React.Fragment>
      { this.fSHandler.fullscreenEnabled
        ? <IconButton
          className='topbar-btn btn__fullscreen--quiz'
          aria-label='upload picture'
          component='span'
          style={{ zIndex: 9999 }}
          onClick={() => {
            if (this.state.fSActivated) { this.fSHandler.exitFullscreen() } else { this.fSHandler.requestFullscreen() }
          }}
        >
          {this.state.fSActivated
            ? <FullscreenExitIcon className='topbar-btn-icon' />
            : <FullscreenIcon className='topbar-btn-icon' />
          }
        </IconButton>
        : null
      }
    </React.Fragment>
  }
  getCurrentUserInfo () {
    let { fetchLeaderboard } = eventLabels
    let { data: leaderBoardArr = [] } = this.retrieveWSDataFromProps(fetchLeaderboard)
    const { data: { user_id: currentUserId } = {} } = this.retrieveWSDataFromProps(joinLobby)
    const tempArray = leaderBoardArr.filter(playerObj => String(playerObj.user_id) === String(currentUserId))
    let playerObj = {}
    if (tempArray.length === 1) {
      playerObj = tempArray[0]
    } else {
      playerObj = { first_name: 'Un identified user' }
    }
    // eslint-disable-next-line no-debugger
    // debugger
    return [currentUserId, playerObj]
  }
  getQuestionBtn () {
    const { __questionData } = this.state
    let {
      activeStep: currentQuesionIndex = 0,
      score: scoreAchievedByCurrentQues = 0,
      isFetchFailed: isQuestionFetchFailed,
      isFetching: isQuestionsFetching,
      questionData: {
        questionCount: totQestionCount = 0
      } = {}
    } = __questionData || {}
    // console.log(isQuestionFetchFailed, isQuestionsFetching, score)
    // if (!__questionData) return <div />
    return <div className='topbar-btn' style={{ display: 'flex', fontWeight: 'bold', textAlign: 'center' }} >
      <span style={{ margin: 'auto' }}>
        {isQuestionsFetching
          ? <small><small>loading...</small></small> : isQuestionFetchFailed
            ? <small><small>Failed</small></small>
            : <React.Fragment>
              {currentQuesionIndex + 1}<small><small>/{totQestionCount},
                {/* Total score: {totalScore}, */}
               score for curret ques: {scoreAchievedByCurrentQues}</small></small>
            </React.Fragment>
        }

      </span>
    </div>
  }
  getJoineeCountLabel () {
    const { data: playersArray = [] } = this.retrieveWSDataFromProps(fetchParticipants)
    return <IconButton className='topbar-btn' aria-label='upload picture' component='span'>
      <PeopleIcon className='topbar-btn-icon' />&nbsp;<span style={{ padding: 0, margin: 0, fontSize: '1rem' }}>{playersArray.length}</span>
    </IconButton>
  }
  getClearOrPauseBtn () {
    return <IconButton
      className='topbar-btn btn__close--websocket'
      aria-label='upload picture' component='span'
      // onClick={() => { this.props.websocket.close() }}
      onClick={() => {
        let confirmed = window.confirm('Are you sure you want to exit from this quiz?')
        if (confirmed) {
          this.props.quitQuiz()
          // this.props.history.p
        }
      }}
    >
      <ClearIcon className='topbar-btn-icon' />
    </IconButton>
  }
  backUpLogicToEndQuiz=() => {
    const websocket = this.props.websocket
    let { isHost } = this.props
    if (isHost) {
      setTimeout(() => {
        let confirmed = true
        if (confirmed) {
          endQuizTrigger(websocket)
        }
      })
    }
  }
  getDurationCounter=() => {
    const counterDuration = 3
    const questionAnimDuration = 1
    const lbDuration = 5
    const questionOptionduration = 2.5
    const memeDuration = 5
    /*
    * This duration module to be refactored.
    */
    let { wb_quiz_details: quizDetails = {} } = this.props
    let { duration: durationInMin = 0, started_at: startedAt, total_no_of_questions: totalNoOfQuestions = 0 } = quizDetails || {}
    let durationInSec = durationInMin * 60
    const [currentUserId, currentPlayerObj] = this.getCurrentUserInfo()
    const { joined_at: joinedAt } = currentPlayerObj
    let { isHost } = this.props
    const { __questionData } = this.state
    let {
      // activeStep: currentQuesionIndex = 0,
      timeToRender
    } = __questionData || {}
    let passedDuration = 0
    let sagDuration = questionAnimDuration + questionOptionduration + lbDuration + memeDuration
    let quizDuration
    let quizStartedAt
    let startImmediately
    let onZerothChckP = this.backUpLogicToEndQuiz

    // remove below statement to handle indepdent times in next release.
    isHost = true
    // logic to run counter equally
    if (isHost === true) {
      quizDuration = durationInSec + (totalNoOfQuestions * sagDuration) + counterDuration
      quizStartedAt = startedAt
      startImmediately = !!(startedAt && startedAt !== 'None')
      timeToRender = startImmediately ? 'render_question' : undefined
    } else if (isHost === false) {
      quizDuration = durationInSec
      quizStartedAt = joinedAt
      startImmediately = false
    }
    console.log(quizDuration, startedAt, currentUserId)
    if (quizStartedAt !== 'None') {
      try {
        quizStartedAt = new Date(quizStartedAt)
        let epochStartedAt = quizStartedAt.getTime()
        if (isNaN(epochStartedAt)) {
          // eslint-disable-next-line no-throw-literal
          throw 'Invalid time fomat'
        }
        let epochNow = new Date().getTime()
        passedDuration = epochNow - epochStartedAt
        passedDuration = passedDuration / 1000
      } catch (e) {
        passedDuration = 0
      }
    }
    const timeLeft = quizDuration - passedDuration
    let { timerAction } = this.state
    return { onZerothChckP: onZerothChckP, startImmediately, duration: timeLeft, timerAction, startedAt, timeToRender }
  }
  renderUtlityContent = (showUtilities) => {
    const [currentUserId, currentPlayerObj] = this.getCurrentUserInfo()
    console.log(currentUserId)
    const { total_score: totalScore, rank } = currentPlayerObj || {}
    const { __questionData } = this.state
    let {
      activeStep: currentQuesionIndex = 0,
      questionData: {
        questionCount: totQestionCount = 0
      } = {}
    } = __questionData || {}
    let { fetchLeaderboard, fetchParticipants } = eventLabels
    const { isHost } = this.props
    let { data: participants = [] } = this.retrieveWSDataFromProps(fetchParticipants) || {}
    let { data: leaderboardData = [] } = this.retrieveWSDataFromProps(fetchLeaderboard) || {}
    return <div className='quiz__topbar--container'>
      {this.getClearOrPauseBtn()}
      {this.getFullScreenBtn()}
      {
        showUtilities
          ? <React.Fragment>
            <span className='quiz__topbar--questioncount'>
              {
                isHost
                  ? this.getHostQuizTopBarContent()
                  : <QuestionCount currentQuestion={currentQuesionIndex + 1} totalQuestions={totQestionCount} />
              }
            </span>
            <span className='quiz__topbar--timer'>
              <QuizTimer {...this.getDurationCounter()} />
            </span>
            <span className='quiz__topbar--participantcount'>
              <ParticipantCount participantsCount={participants.length} />
            </span>
            <span className='quiz__topbar--currentrank'>
              {
                isHost
                  ? <div className='paricipant__attended--count'>
                    {`${leaderboardData.filter(item => item.has_finished).length} / ${leaderboardData.length} done`}
                  </div>
                  : <CurrentRank rank={rank} />
              }
            </span>
            <span className='quiz__topbar--currentscore'>
              {
                !isHost
                  ? <CurrentScore score={totalScore} />
                  : ''
              }
            </span>
          </React.Fragment>
          : ''
      }

    </div>
  }

  getJoineeQuizTopBarContent () {
    return <React.Fragment>
      {this.getClearOrPauseBtn()}
      {this.getFullScreenBtn()}
    </React.Fragment>
  }
  getHostLobbyTopBarContent () {
    // return <p>Host lobby topbar cnt</p>
    return (<React.Fragment>
      {this.getClearOrPauseBtn()}
      <p>Waiting for players to join the game...</p>
      {this.getFullScreenBtn()}
    </React.Fragment>)
  }
  getJoineeLobbyTopBarContent () {
    return <React.Fragment>
      {this.getClearOrPauseBtn()}
      {this.getJoineeCountLabel()}
      {this.getFullScreenBtn()}
    </React.Fragment>
  }
  retrieveWSDataFromProps (eventLabel, previousData = false) {
    let datKey
    if (previousData) {
      datKey = WebSockectEvents[eventLabel]['prevDataStrgKey']
    } else {
      datKey = WebSockectEvents[eventLabel]['storageKey']
    }
    let { [datKey]: dataObj = {} } = this.props
    return dataObj
  }

  getHostLobbyContainerContent () {
    let { isHost } = this.props
    return (
      <React.Fragment>
        {this.renderUtlityContent(true)}
        { this.getLobbyParticipantsContainer(isHost) }
      </React.Fragment>
    )
  }
  getJoineeLobbyContainerContent () {
    let { isHost } = this.props
    return (
      <React.Fragment>
        {this.renderUtlityContent(true)}
        { this.getLobbyParticipantsContainer(isHost) }
      </React.Fragment>
    )
  }
  getHostQuizContainerContent () {
    let { isQuizEnded, isHost } = this.props
    const [currentUserId, currentPlayerObj] = this.getCurrentUserInfo()
    console.log(currentUserId)
    let { fetchLeaderboard, fetchParticipants } = eventLabels
    let { data: leaderboardData = [], quiz_details: quizDetails = {} } = this.retrieveWSDataFromProps(fetchLeaderboard) || {}
    let { data: participantsData = [] } = this.retrieveWSDataFromProps(fetchParticipants) || {}
    leaderboardData = leaderboardData.length ? leaderboardData : participantsData
    leaderboardData = leaderboardData.map(item => ({ ...item, name: item.first_name }))
    return <React.Fragment>
      {this.renderUtlityContent(true)}
      <div key={`getHostQuizContainerContent`} className='host__quiz--container'>
        {/* <OrderedList leaders={leaderboardData} /> */}
        <PostQuizLeaderboard leaderboardData={leaderboardData} quizDetails={quizDetails} currentPlayerObj={currentPlayerObj} isQuizEnded={isQuizEnded} isHost={isHost} onlineClassId={this.props.onlineClassId} />
      </div>
    </React.Fragment>
  }

  handleEditProfile = () => {
    this.setState({ showSettingsModal: true })
  }

  handleModalOpen = () => {
    this.setState({ showSettingsModal: false })
  }

  renderProfileSettings = () => {
    return (
      <Modal
        open={this.state.showSettingsModal}
        onClose={() => { this.setState({ showSettingsModal: false }) }}
      >
        <div className='avatar__modal'>
          <CancelIcon className='close__icon' onClick={() => {
            this.setState({ showSettingsModal: false })
          }} />
          <ChangeAvatar socket={this.props.websocket} alert={this.props.alert} modalStatus={this.handleModalOpen} />
        </div>
      </Modal>
    )
  }

  getAvatar = (url = '', firstName = '') => {
    if (url) {
      return <Avatar onClick={this.handleEditProfile} src={url} alt='Select Avatar' className='avatar__select'>H</Avatar>
    } else {
      return <Avatar onClick={this.handleEditProfile} alt='Select Avatar' className='avatar__select'>{firstName.charAt(0)}</Avatar>
    }
  }

  getLobbyParticipantsContainer = (isHost) => {
    const { data: { user_id: currentUserId } = {} } = this.retrieveWSDataFromProps(joinLobby)
    console.log(currentUserId)
    const { user_id: userId, first_name: firstName } = this.state.personalInfo
    let { data: participants = [] } = this.retrieveWSDataFromProps(fetchParticipants)
    participants = participants.map(item => ({ ...item, name: item.first_name }))
    const { avatar = '' } = participants.find(participant => participant.user_id === userId) || {}
    return (
      <div className='lobby__participants--container'>

        <h2 className='lobby__header--title' style={{ textAlign: 'center' }}>{isHost ? 'Waiting for players to join' : 'Waiting for game to begin..'}</h2>
        {
          isHost
            ? <button
              className='btn__start--quiz'
              variant='contained'
              size='large'
              style={{ backgroundColor: '#27a936' }}
              disabled={!isHost}
              onClick={() => { startQuizTrigger(this.props.websocket) }}
            >
              Start Quiz
            </button>
            : this.getAvatar(avatar, firstName)
        }

        <div className='lobby__participants'>
          {participants.length
            ? participants.map(participant =>
              <div><StudentDetails
                {...participant}
                isHost={isHost}
                {...isHost
                  ? { removeUser: () => {
                    let confirmed = window.confirm('Remove user?')
                    if (confirmed) {
                      removeUserTrigger(this.props.websocket, participant.user_id)
                    }
                  } }
                  : { removeUser: false }}
              /></div>)
            : null
          }
        </div>
      </div>
    )
  }

  // getJoineeQuizContainerContent () { return <p>joinee quiz container</p> }
  getJoineeQuizContainerContent () {
    const { isMuted } = this.state
    const wbData = {}
    Object.keys(this.props).filter(key => key.includes('wb_')).forEach(keyName => {
      wbData[keyName] = this.props[keyName]
    })
    return (
      <React.Fragment>
        {this.renderUtlityContent(true)}
        <QuestionHandler
          onlineClassId={this.props.onlineClassId}
          websocket={this.props.websocket}
          {...wbData}
          updateStateToParent={(data = {}) => {
            this.updateChildParamToState('__questionData', data)
          }}
          bgms={this.props.bgms}
          isMuted={isMuted}
        />
      </React.Fragment>
    )
  }
  getErrorMsgC=(label) => {
    return <div style={{ textAlign: 'center' }}>
      <h5>Please wait...The connection was interrupted</h5>

      <h6>If you see this error for long, please&nbsp;
        <LinkTag
          component='button'
          // Include a function to auto report
          // with compoent ws_ state vars route and user.
          onClick={() => { window.location.reload() }}>
          <b>Click here to reload_</b>
        </LinkTag>
      </h6>
      <p><small>{label}</small></p>
    </div>
  }
  getTopBarContent () {
    if (this) return null
    let { isHost, isQuizStarted } = this.props
    // isHost = undefined
    /*
      If above variables are undefined while quiz is live
      wbsocket event failed to send quiz_datails obj to frontend
    */
    if (isHost === undefined) {
      // return <p>Please wait, game is loading decide host or joinee</p>
      return this.getErrorMsgC(`ref error code (e.u-stat:undefined)`)
    } else if (isQuizStarted === undefined) {
      // return <p>Please waiting ... loading to know quiz started or not</p>
      return this.getErrorMsgC(`ref error code (f.q-stat:undefined)`)
    } else {
      return this.getJoineeQuizTopBarContent()
    }
  }

  getContainerContent () {
    // if game has to be started return lobby content
    // if game started return game content
    let { isHost, isQuizStarted, isQuizEnded, onlineClassId } = this.props
    const [currentUserId, currentPlayerObj] = this.getCurrentUserInfo()
    console.log(currentUserId)
    let { has_finished: hasFinished } = currentPlayerObj || {}
    let { fetchLeaderboard } = eventLabels
    let { data: leaderBoardArr = [], quiz_details: quizDetails = {}, quiz_summary: quizSummary = {} } = this.retrieveWSDataFromProps(fetchLeaderboard)
    // isHost = undefined
    if (isHost === undefined) {
      return this.getErrorMsgC(`ref error code (e.u-stat:undefined)`)
    } else if (isQuizStarted === undefined) {
      return this.getErrorMsgC(`ref error code (f.q-stat:undefined)`)
    } else if (isQuizEnded && isHost) {
      return <React.Fragment>
        {this.renderUtlityContent(false)}
        <div className='studentpostquiz__leaderboard--container'>
          <h2 className='leaderboard__title--host'>Quiz Ended..</h2>
          <div className='quiz__results--container'>
            <HostPostQuizReport
              onlineClassId={this.props.onlineClassId}
              leaders={leaderBoardArr}
              quizSummary={quizSummary}
            />
          </div>
        </div>
      </React.Fragment>
    } else if ((hasFinished || isQuizEnded) && !isHost) {
      return <React.Fragment>
        {this.renderUtlityContent()}
        <PostQuizLeaderboard leaderboardData={leaderBoardArr} quizDetails={quizDetails} currentPlayerObj={currentPlayerObj} isQuizEnded={isQuizEnded} onlineClassId={onlineClassId} />
      </React.Fragment>
    } else {
      const userType = isHost ? 'HOST' : 'JOINEE'
      const quizStatus = isQuizStarted ? 'QUIZ' : 'LOBBY'
      const DECIDE = {
        'HOST_LOBBY': this.getHostLobbyContainerContent,
        'JOINEE_LOBBY': this.getJoineeLobbyContainerContent,
        'HOST_QUIZ': this.getHostQuizContainerContent,
        'JOINEE_QUIZ': this.getJoineeQuizContainerContent
      }
      return DECIDE[`${userType}_${quizStatus}`]()
    }
  }

  toggleMute = () => {
    const { isMuted } = this.state
    this.setState({ isMuted: !isMuted })
    if (this.myRef && this.myRef.current) {
      this.myRef.current.play()
      this.myRef.current.volume = isMuted ? 1 : 0
    }
  }

  render () {
    // Howler.volume(2.5)
    let { open = true, isQuizStarted, isQuizEnded } = this.props || {}
    const { isMuted } = this.state
    return <div>
      {/* <Sound src={this.bgmUrl} /> */}
      {/* <iframe src='https://letseduvate.s3.amazonaws.com/dev/media/multiplayer_quiz/music/entire_game_tune_2_speed_up_a_little_game.mp3?rel=0&autostart=2&loop=2&' allow='autoplay' style={{ display: 'none' }} id='iframeAudio' /> */}
      {/* <iframe src='https://letseduvate.s3.amazonaws.com/dev/media/multiplayer_quiz/music/entire_game_tune_2_speed_up_a_little_game.mp3' autoPlay loop hidden /> */}
      <audio ref={this.myRef}
      // style={{ visibility: 'hidden' }}
        id={this.bgmUrl} autoPlay loop src={this.bgmUrl ? this.bgmUrl : 'https://letseduvate.s3.amazonaws.com/dev/media/multiplayer_quiz/music/entire_game_tune_2_speed_up_a_little_game.mp3'} controls />
      <Dialog fullScreen open={open} onClose={this.handleClose} TransitionComponent={Transition}>
        <img className={`volume__controller ${!isMuted ? 'quiz__volume--mute' : 'quiz__volume--unmute'}`} onClick={this.toggleMute} />
        <div className='Quiz-home'
          style={{ backgroundImage: isQuizEnded ? `url(${Background})` : `linear-gradient(to right, rgba(8,30,47, 0.8), rgba(8,30,47,0.8)),url(${Background})` }}
        >
          <img className={`quiz__background ${isQuizEnded ? 'quiz__background--ended' : 'quiz__background--started'}`} />
          <div className='Quiz-lobby-topbar actions-wrapper in-quiz'>
            {this.getTopBarContent()}
          </div>
          <div className={isQuizStarted ? 'Quiz-play-contentdiv' : 'Quiz-lobby-contentdiv'}>
            {this.getContainerContent()}
          </div>
        </div>
        {
          this.state.showSettingsModal
            ? this.renderProfileSettings()
            : ''
        }
      </Dialog>
    </div>
  }
}
export default MPQuiz
