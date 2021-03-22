import React from 'react'
import { Card, CardActions, IconButton, Grid } from '@material-ui/core'
import RefreshIcon from '@material-ui/icons/RefreshRounded'
import HomeIcon from '@material-ui/icons/HomeRounded'
import ErrorHandler from './errorHandler'

class ErrorBoundary extends React.Component {
  constructor (props) {
    super(props)
    this.state = { hasError: false }
  }
/* eslint-disable */
  static getDerivedStateFromError (error) {
    // Update state so the next render will show the fallback UI.
    return { hasError: true }
  }
  /* eslint-enable */

  componentDidCatch (error, info) {
    // You can also log the error to an error reporting service
    let url = window.location.href
    this.errorHandler = new ErrorHandler()
    this.errorHandler.reportError(url, error, info)
  }
  goToHome () {
    window.location.assign('/')
  }

  render () {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return <Grid container style={{ width: '100vw', height: '100vh', backgroundColor: '#eeee', overflow: 'hidden', justifyContent: 'center', alignItems: 'center' }}>
        <Card elevation={0} style={{ padding: 16, paddingBottom: 0 }}>
          <div style={{ textAlign: 'center' }}>
            <h1 style={{ margin: 0, color: '#4c4c4c' }}>Oops! Something went wrong.</h1>
            <span style={{ color: 'grey' }}>We're working on getting it fixed as soon as we can.</span>
          </div>
          <CardActions>
            <IconButton onClick={() => window.location.reload()} ><RefreshIcon fontSize='small' /></IconButton>
            <IconButton onClick={this.goToHome}><HomeIcon fontSize='small' /></IconButton>
          </CardActions>
        </Card>
      </Grid>
    }
    return this.props.children
  }
}

export default ErrorBoundary
