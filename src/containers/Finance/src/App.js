import React, { Component } from 'react'
import MuiThemeProvider from '@material-ui/core/styles/MuiThemeProvider'
import axios from 'axios'
import createMuiTheme from '@material-ui/core/styles/createMuiTheme'
import * as firebase from 'firebase/app'
import { connect } from 'react-redux'
import { alertActions, userActions } from './_actions'
import tracker from './tracker'
import { Alert } from './ui'
import './ui/table.css'
import OMSBase from './components/OMSBase'

const THEME = createMuiTheme({
  typography: {
    fontFamily: '"Raleway", sans-serif',
    fontSize: 14,
    fontWeightLight: 500,
    fontWeightRegular: 600,
    fontWeightMedium: 700,
    subheading: {
      letterSpacing: '1px',
      wordWrap: 'break-word'
    },
    h4: {
      letterSpacing: '1px'
    },
    h6: {
      letterSpacing: '1px'
    },
    useNextVariants: true
  },
  palette: {
    primary: {
      main: '#5d1049'
    },
    secondary: {
      main: '#E30425'
    },
    background: {
      default: '#f2f2f2'
    }
  },

  shape: {
    borderRadius: 0
  }
})

window.isMobile = document.documentElement.clientWidth < 600
window.isFirebaseSupported = firebase.messaging && firebase.messaging.isSupported()

class App extends Component {
  constructor (props, context) {
    super(props, context)
    this.props = props
    this.state = {
      openToolBar: true
    }
    this.handleDrawerClose = this.handleDrawerClose.bind(this)
    this.handleDrawerOpen = this.handleDrawerOpen.bind(this)
  }
  handleDrawerClose = () => {
    this.setState(state => ({ openToolBar: false }))
  };
  handleDrawerOpen = () => {
    this.setState(state => ({ openToolBar: true }))
  };

  render () {
    return (
      <MuiThemeProvider theme={THEME}>
        <Alert />
        <OMSBase alert={this.props.alert} />
      </MuiThemeProvider>
    )
  }
}

axios.interceptors.request.use(request => {
  tracker.postMessage('STARTED')
  return request
})

axios.interceptors.response.use(response => {
  tracker.postMessage('FINISHED')
  return response
})

axios.interceptors.response.use(null, (error) => {
  tracker.postMessage('FINISHED')
  if (error.response && error.response.status === 401) {
    userActions.logout()
  }
  return Promise.reject(error)
})

const mapDispatchToProps = dispatch => ({
  alert: {
    success: message => dispatch(alertActions.success(message)),
    warning: message => dispatch(alertActions.warning(message)),
    error: message => dispatch(alertActions.error(message))
  }
})
const mapStateToProps = state => {
  return {
    isLoggedIn: state.authentication.loggedIn
  }
}
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(App)
