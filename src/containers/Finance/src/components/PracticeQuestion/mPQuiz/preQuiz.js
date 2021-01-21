import React from 'react'
import Modal from '@material-ui/core/Modal'
import Backdrop from '@material-ui/core/Backdrop'
import Fade from '@material-ui/core/Fade'
import axios from 'axios'
import camelcaseKeys from 'camelcase-keys'
import LinkTag from '@material-ui/core/Link'
import { withStyles, Button } from '@material-ui/core'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { eventLabels } from './utilities'
import { InternalPageStatus } from '../../../ui'
import { urls, socketUrls } from '../../../urls'

const useStyles = (theme) => ({
  modal: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  paper: {
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3)
  }
})

class PreQuizHome extends React.Component {
  constructor (props) {
    super(props)
    let { match: { params: { onlineClassId } = {} } = {} } = props

    this.state = {
      onlineClassId: this.isValidRouteParam(onlineClassId) ? Number(onlineClassId) : false
    }
    this.fetchHeaders = { headers: { Authorization: 'Bearer ' + props.authToken } }
    this.fetchQuizInfo = this.fetchQuizInfo.bind(this)
    let { personal_info: personalInfo = {} } = (() => { try { return JSON.parse(localStorage.getItem('user_profile')) } catch (e) { return {} } })() || {}
    this.personalInfo = personalInfo
  }
  componentDidMount () {
    this.fetchQuizInfo()
  }
  createQuery = params => params.filter(param => (param[1] !== undefined)).map(param => `${param[0]}=${param[1]}`).join('&')
  fetchQuizInfo () {
    let { QuizInfo } = urls
    let { onlineClassId } = this.state
    if (!onlineClassId) return
    let params = [
      ['online_class_id', onlineClassId]
    ]
    let query = this.createQuery(params)
    let pathWithQuery = QuizInfo + '?' + query
    let { fetchHeaders } = this
    this.setState({ isFetching: true, isFetchFailed: false })
    axios
      .get(pathWithQuery, fetchHeaders)
      .then(response => {
        if (response.status === 200) {
          let { data: responseData = {} } = response
          let camelCasedResponseData = camelcaseKeys(responseData)
          let { status: statusObj, data: quizRawInfo } = camelCasedResponseData
          console.log(statusObj)
          let { online_class_details: {
            id: onlineClassId,
            title,
            quiz_meta_data: quizQuestionsData,
            total_no_questions: totatNoQuestions,
            quiz_question_paper: questionPaperId,
            tutor_list: tutorListJson
          } = {},
          quiz_lobby_details: {
            lobby_uuid: lobbyUuid,
            is_started: isStarted,
            is_ended: isEnded,
            ended_at: endedAt
          } = {}
          } = quizRawInfo
          let tutorList
          let isOneOftheHosts
          try {
            tutorList = JSON.parse(tutorListJson)
            let { email } = this.personalInfo
            isOneOftheHosts = tutorList.includes(email)
          } catch (e) {
            tutorList = []
          }
          this.setState({
            isFetching: false,
            isFetchFailed: false,
            quizRawInfo,
            quizInfo: { isOneOftheHosts, tutorList, totatNoQuestions, title, onlineClassId, quizQuestionsData, questionPaperId, lobbyUuid, isStarted, isEnded, endedAt }
          })
        } else {
          let { data: { status: statusObj = {} } = {} } = response
          let { message } = statusObj
          this.props.alert.error(`${message}`)
          this.setState({ isFetching: false, isFetchFailed: true })
        }
      })
      .catch(er => {
        this.setState({ isFetching: false, isFetchFailed: true, message: undefined })
        let { message: errorMessage, response: { data: { status: { message: msgFromDeveloper } = {} } = {} } = {} } = er
        let msg
        if (msgFromDeveloper) {
          // this.props.alert.error(`${msgFromDeveloper}`)
          msg = msgFromDeveloper
        } else if (errorMessage) {
          this.props.alert.error(`${errorMessage}`)
          msg = errorMessage
        } else {
          msg = 'Failed to connect to server'
          this.props.alert.error(`${msg}`)
        }
        this.setState({ message: msg })
      })
  }

  isValidRouteParam (param) { return Number.isFinite(Number(param)) }
  createLobby=() => {
    let { MPQUIZ } = socketUrls
    const jwtToken = localStorage.getItem('id_token')
    const { onlineClassId } = this.state.quizInfo
    var ws = new window.WebSocket(`${MPQUIZ}${onlineClassId}/${jwtToken}/`)
    this.setState({ creatingLobby: true, creationFailed: false })
    // websocket onopen event listener
    ws.onopen = () => {
      console.log('connected websocket main component')
      this.setState({ ws: ws })
    }
    ws.onmessage = evt => {
      // listen to data sent from the websocket server
      const messageFromServer = JSON.parse(evt.data)
      const { event } = messageFromServer || {}
      let { joinLobby } = eventLabels
      if (event === joinLobby) {
        const {
          status: { success, message: statusMessage } = {},
          quiz_details: { lobby_uuid: lobbyUuid }
        } = messageFromServer
        if (success) {
          let lobbyId = onlineClassId
          this.props.history.push(`/quiz/game/${onlineClassId}/${lobbyUuid}/${lobbyId}/`)
          this.setState({ creatingLobby: false, creationFailed: false })
        } else {
          this.props.alert.error(`${statusMessage}`)
          this.setState({ creatingLobby: false, creationFailed: true })
        }
      }
      ws.close()
    }
    ws.onclose = e => {
      this.setState({ ws: ws })
      console.log(`Socket is closed.`, e.reason)
    }

    // websocket onerror event listener
    ws.onerror = err => {
      this.setState({ ws: ws })
      console.error('Socket encountered error: ', err.message, 'Closing socket')
      this.setState({ creatingLobby: false, creationFailed: true })
      this.props.alert.error('Failed to create lobby, Please try again.')
      ws.close()
    }
  }
  createLobbyOrRedirect=() => {
    let { lobbyUuid, onlineClassId } = this.state.quizInfo || {}
    if (lobbyUuid) {
      let lobbyId = onlineClassId
      this.props.history.push(`/quiz/game/${onlineClassId}/${lobbyUuid}/${lobbyId}/`)
    } else {
      this.createLobby()
    }
  }
  getBtn=() => {
    const { isOneOftheHosts, onlineClassId, lobbyUuid } = this.state.quizInfo || {}
    const { creatingLobby, creationFailed } = this.state
    if (isOneOftheHosts) {
      let btnLabel = lobbyUuid ? `Join to the Lobby` : `Create Quiz Lobby`
      btnLabel = creatingLobby ? 'Lobby is getting created.. Please Wait' : btnLabel
      btnLabel = creationFailed ? 'Retry to create Quiz Lobby' : btnLabel
      return (
        <Button
          variant='outlined'
          color={lobbyUuid ? 'primary' : 'secondary'}
          onClick={() => { this.createLobbyOrRedirect() }}
          disabled={creatingLobby}
        >
          {btnLabel}
        </Button>
      )
    } else {
      if (lobbyUuid) {
        return <Button
        // disabled={!lobbyUuid}
          variant='outlined'
          color={lobbyUuid ? 'primary' : 'secondary'}
          onClick={
            () => {
              if (lobbyUuid) {
                let lobbyId = onlineClassId
                this.props.history.push(`/quiz/game/${onlineClassId}/${lobbyUuid}/${lobbyId}/`)
              }
            }
          }
        >
        Join Quiz
        </Button>
      } else {
        let message = 'Quiz lobby is not created yet. Please wait until host creates quiz lobby.'
        return <h4>{`${message}`}&nbsp;
          <LinkTag
            component='button'
            onClick={this.fetchQuizInfo}>
            <b>Click here to reload_</b>
          </LinkTag>
        </h4>
      }
    }
  }
  render () {
    let { isFetchFailed, isFetching, message } = this.state
    if (isFetching) {
      return <InternalPageStatus label='Loading..' />
    } else if (isFetchFailed) {
      return <InternalPageStatus
        // label={`${message}`}
        label={
          <p>{`${message}`}&nbsp;
            <LinkTag
              component='button'
              onClick={this.fetchQuizInfo}>
              <b>Click here to reload_</b>
            </LinkTag>
          </p>
        }
        loader={false}
      />
    } else {
      const { totatNoQuestions, title, isEnded, endedAt } = this.state.quizInfo || {}
      const open = true
      const { classes } = this.props
      if (isEnded) {
        return <InternalPageStatus label={`Quiz has been ended at ${endedAt}`} loader={false} />
      }

      return <Modal
        aria-labelledby='transition-modal-title'
        aria-describedby='transition-modal-description'
        className={classes.modal}
        open={open}
        // onClose={handleClose}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500
        }}
      >
        <Fade in={open}>
          <div className={classes.paper} style={{ minWidth: '50vw' }}>
            <h2 id='spring-modal-title'>{title}</h2>
            <p id='spring-modal-description'>No of questions: {totatNoQuestions}</p>
            {this.getBtn()}
          </div>
        </Fade>
      </Modal>
    }
  }
}
const mapStateToProps = state => ({
  authToken: state.authentication.user
})
export default connect(mapStateToProps)(withRouter(withStyles(useStyles)(PreQuizHome)))
