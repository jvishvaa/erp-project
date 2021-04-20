import React, { Component } from 'react'
import axios from 'axios'
import { withRouter } from 'react-router'

import { urls } from '../../../../urls'
import CircularProgress from '../../../../ui/CircularProgress/circularProgress'
import classes from './paytmIntegration.module.css'

class PaytmIntegration extends Component {
  state = {
    innHtml: null,
    isError: false
  }
  componentDidMount () {
    if (!this.props.location.state || !this.props.location.state.amount || !this.props.location.user) {
      this.props.alert.warning('Transaction cannot Be Proceed')
      this.props.history.goBack()
      return
    }
    axios.post(urls.PaytmPaymen, this.props.location.state, {
      headers: {
        Authorization: 'Bearer ' + this.props.location.user
      }
    }).then(response => {
      this.setState({
        innHtml: `${response.data}`
      }, () => {
        setTimeout(() => {
          document.f1.submit()
        }, 1000)
      })
    }).catch(err => {
      console.log(err)
      this.setState({
        isError: true
      })
    })
    // document.body.scrollTop = 0
    window.scrollTo(0, 0)
  }

  goBackHandler = () => {
    this.props.history.replace('/dashboard')
  }

  getHeight = () => {
    let body = document.body
    let html = document.documentElement
    let height = Math.max(body.scrollHeight, body.offsetHeight, html.clientHeight, html.scrollHeight, html.offsetHeight)
    return height
  }

  componentDidUpdate () {
    // document.body.scrollTop = 0
    window.scrollTo(0, 0)
  }

  render () {
    let content = null
    if (!this.state.isError) {
      content = (<div dangerouslySetInnerHTML={{ __html: this.state.innHtml }} style={{ color: 'black' }} />)
    } else {
      content = (
        <div className={classes.failurePage} id='paytm'>
          <div style={{ width: '100%', textAlign: 'center', fontSize: '1.5rem' }}> Something Went Wrong</div>
          <div style={{ width: '100%', textAlign: 'center', fontSize: '1.5rem' }}> Please Retry Payment !!!</div>
          <div style={{ width: '40px', margin: 'auto' }}><button onClick={this.goBackHandler}>Home</button></div>
        </div>
      )
    }
    return (
      <div className={classes.paytm} style={{ height: this.getHeight() }}>
        {content}
        <div className={classes.circularProgress}>{!this.state.isError ? <CircularProgress open /> : null }</div>
      </div>
    )
  }
}

export default withRouter(PaytmIntegration)
