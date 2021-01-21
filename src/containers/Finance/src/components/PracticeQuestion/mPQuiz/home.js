import React from 'react'
import axios from 'axios'
import { withRouter } from 'react-router-dom'
import LinkTag from '@material-ui/core/Link'
import { Button, Modal } from '@material-ui/core'
import CancelIcon from '@material-ui/icons/Cancel'
import MPQuiz from './quiz'
import { WebSockectEvents, eventLabels } from './utilities'
import { socketUrls, urls } from '../../../urls'
import { InternalPageStatus } from '../../../ui'
import ChangeAvatar from './ChangeAvatar'

Number.ordinalSuffixOf = function ordinalSuffixOf (value) {
  if (value === undefined || value === false || value === null) {
    return value
  }
  var j = value % 10
  var k = value % 100
  if (j === 1 && k !== 11) {
    return value + 'st'
  }
  if (j === 2 && k !== 12) {
    return value + 'nd'
  }
  if (j === 3 && k !== 13) {
    return value + 'rd'
  }
  return value + 'th'
}
class MPQuizHome extends React.Component {
  constructor (props) {
    super(props)
    const { match: { params: { lobbyId, onlineClassId } = {} } = {} } = props
    this.state = {
      ws: null,
      lobbyId: this.isValidRouteParam(lobbyId) ? Number(lobbyId) : false,
      onlineClassId: this.isValidRouteParam(onlineClassId) ? Number(onlineClassId) : false,
      lobbyIdFromProps: lobbyId,
      onlineClassIdFromProps: onlineClassId,
      showAvatar: false
    }
    this.renderQuiz = this.renderQuiz.bind(this)
    let { personal_info: { user_id: currentUserId } = {} } = (() => { try { return JSON.parse(localStorage.getItem('user_profile')) } catch (e) { return {} } })() || {}
    this.currentUserId = currentUserId
    let authToken = localStorage.getItem('id_token')
    this.fetchHeaders = { headers: { Authorization: 'Bearer ' + authToken } }
  }
  isValidRouteParam (param) { return Number.isFinite(Number(param)) }
  fetchBgms=() => {
    let{ QuizBgms: urlPath } = urls
    this.setState({ bgms: undefined })
    axios.get(urlPath, this.fetchHeaders)
      .then(res => {
        // eslint-disable-next-line no-debugger
        // debugger
        if (res.status === 200) {
          let { data } = res
          this.setState({ bgms: data })
        }
      })
      .catch(er => {
        // eslint-disable-next-line no-debugger
        // debugger
        this.setState({ bgms: undefined })
      })
  }
  retrieveWSDataFromState = (eventLabel) => {
    let datKey = WebSockectEvents[eventLabel]['storageKey']
    let { [datKey]: dataObj = {} } = this.state || {}
    return dataObj
  }
  // single websocket instance for the own application and constantly trying to reconnect.

  componentDidMount () {
    this.connect()
  }
  componentWillMount () {
    this.fetchBgms()
  }

  timeout = 250; // Initial timeout duration as a class variable

  isPageReloaded = () => {
    if (!window.performance) return false
    if (window.performance.navigation.type === 1) {
      return true
    } else {
      return false
    }
  }

  handleAvatarSelection = (event, data) => {
    const { data: { avatar = null, is_participant: isParticipant } = {} } = data || {}
    if (!avatar && isParticipant && event === 'join_lobby' && !this.isPageReloaded()) {
      this.setState({ showAvatar: true })
    }
    // const { eventType, wb_fetch_participants: { data = [] } = {} } = nextProps || {}
    // const me = data.find(participant => participant.user_id === personalInfo.user_id)
    // // eslint-disable-next-line no-debugger
    // debugger
    // if (eventType && eventType === 'fetch_participants' && me && !me.avatar && !this.isPageReloaded()) {
    //   this.setState({ showSettingsModal: true })
    // }
  }

  /**
   * @function connect
   * This function establishes the connect with the websocket and also ensures constant reconnection if connection closes
   */
  connect = () => {
    let { MPQUIZ } = socketUrls
    const jwtToken = localStorage.getItem('id_token')
    const { lobbyId } = this.state
    var ws = new window.WebSocket(`${MPQUIZ}${lobbyId}/${jwtToken}/`)
    let that = this // cache the this
    var connectInterval
    // websocket onopen event listener
    ws.onopen = () => {
      console.log('connected websocket main component')

      this.setState({ ws: ws })

      that.timeout = 250 // reset timer to 250 on open of websocket connection
      clearTimeout(connectInterval) // clear Interval on on open of websocket connection
    }
    ws.onmessage = evt => {
      // listen to data sent from the websocket server
      const messageFromServer = JSON.parse(evt.data)
      const { event } = messageFromServer || {}
      const { eventLabel, storageKey, prevDataStrgKey } = WebSockectEvents[event]
      this.handleAvatarSelection(event, messageFromServer)
      // below condition is to check whether event is known to front end.
      if (event === eventLabel) {
        const {
          status: { success, message: statusMessage } = {},
          quiz_details: quizDetails = {}
        } = messageFromServer
        const { is_started: isQuizStarted, is_ended: isQuizEnded } = quizDetails
        const { [storageKey]: previousData } = this.state
        this.setState({
          [storageKey]: { ...messageFromServer, updatedAt: new Date().getTime() },
          [prevDataStrgKey]: previousData,
          wb_quiz_details: quizDetails,
          isQuizStarted,
          isQuizEnded
        })
        let { joinLobby, removeUser } = eventLabels
        switch (event) {
          case joinLobby: {
            const { data: { is_host: isHost } = {} } = messageFromServer || {}
            this.setState({ isHost })
            break
          }
          case removeUser: {
            const { data: { user_id: removedUserId } } = messageFromServer || {}
            let { data: { user_id: currentUserId, is_participant: isParticipant } = {} } = this.retrieveWSDataFromState(joinLobby)
            if (!currentUserId) {
              currentUserId = this.currentUserId
            }
            if (removedUserId === currentUserId && isParticipant) {
              // this.disConnect()
              this.state.ws.close()
            }
            break
          }
        }
        console.log(success, statusMessage)
      }
    }

    // websocket onclose event listener
    ws.onclose = e => {
      this.setState({ ws: ws })
      console.log(
        `Socket is closed. Reconnect will be attempted in ${Math.min(
          10000 / 1000,
          (that.timeout + that.timeout) / 1000
        )} second.`,
        e.reason
      )
      let { doNotRetry } = this.state
      if (!doNotRetry) {
        that.timeout = that.timeout + that.timeout // increment retry interval
        connectInterval = setTimeout(this.check, Math.min(10000, that.timeout)) // call check function after timeout
      }
    }

    // websocket onerror event listener
    ws.onerror = err => {
      this.setState({ ws: ws })
      console.error(
        'Socket encountered error: ',
        err.message,
        'Closing socket'
      )

      ws.close()
    }
  };

  /**
   * utilited by the @function connect to check if the connection is close, if so attempts to reconnect
   */
  check = () => {
    const { ws } = this.state
    if (!ws || ws.readyState === window.WebSocket.CLOSED) this.connect() // check if websocket instance is closed, if so call `connect` function.
  };
  disConnect =() => {
    try {
      this.setState({ doNotRetry: true }, () => { this.state.ws.close() })
    } catch (error) {
      console.log(error)
    }
  }
  componentWillUnmount () {
    // Logic to disconnect on switch of fronented route
    this.disConnect()
  }
  renderQuiz () {
    const { lobbyId, ws, onlineClassId, onlineClassIdFromProps, lobbyIdFromProps } = this.state
    if (!lobbyId) {
      return <div>
        <p>Lobby is invalid {lobbyIdFromProps}</p>
        <Button onClick={() => { this.props.history.push(`/quiz/start/${onlineClassIdFromProps}/`) }} >
        Yes or no
        </Button>
      </div>
    }
    let{ joinLobby } = eventLabels
    let { storageKey } = WebSockectEvents[joinLobby]
    let { status: statusObj } = this.state[storageKey] || {}
    let { success: succededToJoin = undefined, message } = statusObj || {}
    if (succededToJoin === false) {
      return <InternalPageStatus label={`${message}`} loader={false} />
    } else if (!ws) {
      return <InternalPageStatus
        label={`
         Please wait. Connecting to server... (ref error code a)
      `}
      />
    } else if (ws && ws.readyState === window.WebSocket.CLOSED) {
      let msg = `
      Please wait. Trying to reconnect to server... ${ws && ws.readyState ? `(ref error code b.${ws.readyState})` : ''}
      `
      let { doNotRetry } = this.state
      msg = doNotRetry ? null : msg
      return <InternalPageStatus
        loader={!doNotRetry}
        label={(msg || <div>
          <p>
              Quiz Paused&nbsp;
            <br />
            <LinkTag component='button' onClick={() => {
              this.setState({ doNotRetry: false }, () => {
                this.connect()
              })
            }}><b>Resume Quiz</b></LinkTag>
            <br />
            <LinkTag component='button' onClick={() => { this.props.history.push(`/`) }}><b>Go home</b></LinkTag>
          </p>
        </div>)
        }

      />
      // return <InternalPageStatus
      //   label={msg}
      // />
    } else if (ws && ws.readyState !== window.WebSocket.CLOSED) {
      const wbData = {}
      Object.keys(this.state).filter(key => key.includes('wb_')).forEach(keyName => {
        wbData[keyName] = this.state[keyName]
      })
      const { isQuizStarted, isQuizEnded, isHost, bgms } = this.state
      const propsToChild = { onlineClassId, isQuizStarted, isHost, isQuizEnded, bgms }
      return <MPQuiz websocket={this.state.ws} {...wbData} {...propsToChild} quitQuiz={this.disConnect} />
    } else {
      return <div style={{ whiteSpace: 'pre-wrap', fontWeight: 'bold', fontFamily: '"Gill Sans", sans-serif' }} >
        <InternalPageStatus
          loader={false}
          label={`
         Unknown error occured... ${ws && ws.readyState ? `(ref error code c.${ws.readyState})` : ''}\n
         Error handling steps:\n
         * Please check your network connection.\n
         * Please try refreshing the page (Ctrl+Shift+R).\n
         * Please wait until your teacher creates lobby for quiz.\n
        `}
        /></div>
    }
  }

  handleModalOpen = () => {
    this.setState({ showAvatar: false })
  }

  renderProfileSettings = () => {
    return (
      <Modal
        open={this.state.showAvatar}
        onClose={() => { this.setState({ showAvatar: false }) }}
      >
        <div className='avatar__modal'>
          <CancelIcon className='close__icon' onClick={() => {
            this.setState({ showAvatar: false })
          }} />
          <ChangeAvatar socket={this.state.ws} alert={this.props.alert} modalStatus={this.handleModalOpen} />
        </div>
      </Modal>
    )
  }

  render () {
    return (
      <React.Fragment>
        {this.renderQuiz()}
        {
          this.state.showAvatar
            ? this.renderProfileSettings()
            : ''
        }
      </React.Fragment>
    )
  }
}
export default withRouter(MPQuizHome)

// if (ws) {
//   switch (ws.readyState) {
//     case (window.WebSocket.OPEN):
//       if (ws) {
//         return <p>connected
//           <Button onClick={() => { this.state.ws.close() }}>
//             close
//           </Button>
//         </p>
//       }
//       return <MPQuiz websocket={this.state.ws} />
//     case (window.WebSocket.CONNECTING):
//       return <p>Please wait .. ws is in connecting to quiz</p>
//     case (window.WebSocket.CLOSED):
//       return <p>Please wait .. ws is closed</p>
//     case (window.WebSocket.CLOSING):
//       return <p>Please wait .. ws is in closing</p>
//   }
// } else {
//   return <p>ws is {Boolean(ws)}</p>
// }
// return <MPQuiz websocket={this.state.ws} />
