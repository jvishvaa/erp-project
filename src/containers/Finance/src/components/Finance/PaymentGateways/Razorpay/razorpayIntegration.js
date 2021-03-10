import React, { Component } from 'react'
import axios from 'axios'
import { withRouter } from 'react-router'

import { urls } from '../../../../urls'
import CircularProgress from '../../../../ui/CircularProgress/circularProgress'
import classes from '../Airpay/airpayIntegration.module.css'

class RazorpayIntegration extends Component {
  state = {
    innHtml: null,
    isError: false,
    errRes: null
    // success: true
  }
  componentDidMount () {
    console.log('mounted integration: ', this.props.location)
    if (!this.props.user) {
      this.props.alert.warning('Transaction cannot Be Proceed')
      this.props.history.goBack()
      return
    }
    // const body = { ...this.props.location.state }
    const url = urls.order_payment

    axios.get(url + '?customer_id=' + this.props.customer + '&order_id=' + this.props.order, {
      headers: {
        Authorization: 'Bearer ' + this.props.user
      }
    }).then(response => {
      // let data1 = response.data
      // let amount = data1.amount
      // let order = data1.order_id
      // window.location.replace('http://localhost:8000/qbox/razorpay/test_redirect/?amount=' + amount + '&order_id=' + order)
      let urlss = url + '?customer_id=' + this.props.customer + '&order_id=' + this.props.order
      if (+response.status === 200) {
        window.location.replace(urlss)
        // this.setState({
        //   success: false
        // })
      }
      console.log('innHtml', `${response.data}`)
      this.setState({
        innHtml: `${response.data}`
      }, () => {
        setTimeout(() => {
          const form = document.forms[0]
          console.log('form', form)
          form && form.submit()
        }, 500)
      })
    }).catch(err => {
      console.log(err)
      this.setState({
        isError: true,
        errRes: err.response,
        success: false
      })
      // if (err.response && err.response.data && err.response.data.err_msg && (err.response.status === 400 || err.response.status === 404)) {
      //   this.props.alert.warning(err.response.data.err_msg)
      // } else {
      //   this.props.alert.warning('Something Went Wrong!')
      // }
    })

    // document.body.scrollTop = 0
    window.scrollTo(0, 0)
  }

  goBackHandler = () => {
    // this.props.history.replace('/dashboard')
    this.props.history.replace('/airpayresponse/?TRANSACTIONID=null&APTRANSACTIONID=null&AMOUNT=null&TRANSACTIONSTATUS=null&MESSAGE=null')
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
      content = (<div dangerouslySetInnerHTML={{ __html: this.state.innHtml }} style={{ color: 'black', width: '100px', margin: 'auto', marginTop: '200px' }} />)
      console.log('content', content)
    } else {
      content = (
        <div className={classes.failurePage} id='paytm'>
          <div style={{ width: '100%', textAlign: 'center', fontSize: '1.5rem' }}> {(this.state.errRes && this.state.errRes.data && this.state.errRes.data && (+this.state.errRes.status === 400 || +this.state.errRes.status === 404)) ? this.state.errRes && this.state.errRes.data.detail : 'Something Went Wrong!'}</div>
          {/* <div style={{ width: '100%', textAlign: 'center', fontSize: '1.5rem' }}> Please Retry Payment !!!</div> */}
          <div style={{ width: '40px', margin: 'auto' }}><button onClick={this.goBackHandler}>Home</button></div>
        </div>
      )
    }
    return (
      <div className={classes.airpay} style={{ height: this.getHeight() }}>
        {content}
        <div className={classes.circularProgress}>{!this.state.isError ? <CircularProgress open /> : null }</div>
      </div>
    )
  }
}

export default withRouter(RazorpayIntegration)
