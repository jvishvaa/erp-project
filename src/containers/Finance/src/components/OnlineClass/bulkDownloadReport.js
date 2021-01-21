import React, { Component } from 'react'
import { connect } from 'react-redux'
import axios from 'axios'
import moment from 'moment'
import { withRouter } from 'react-router-dom'
import { withStyles, Grid } from '@material-ui/core'
import Button from '@material-ui/core/Button'
import { urls } from '../../urls'
import './class.css'

const styles = ({
  AnchorStyle: {
    color: '#017344',
    'padding-left': '90px'
    // borderBottom: '1px solid blue'
  },
  root: {
    flexGrow: 1
  }
})
class BulkDownloadReport extends Component {
  constructor () {
    super()
    this.state = {
      date: new Date(),
      dates: 10,
      classBulkDownload: [],
      pageSize: 10,
      currentPage: 1,
      page: 1,
      scrolled: false,
      showText: false

    }
  }
  handleDate = (e) => {
    this.setState({ data: [], date: e.target.value, currentPage: 1, classBulkDownload: [] })
  }

  bulkDownload = (state, pageSize) => {
    this.setState({ showText: true })
    let date = this.state.date ? moment(this.state.date).format('DD-MM-YYYY') : null
    pageSize = pageSize || this.state.pageSize

    axios.get(`${urls.OnlineClassBulkDownload + '?date=' + date + '&page_number=' + (state && state.page ? state.page + 1 : 1) + '&page_size=' + pageSize}`, {
      headers: {
        Authorization: 'Bearer ' + this.props.user
        // 'Content-Type': 'application/json'
      }
    })
      .then(res => {
        this.setState({
          classBulkDownload: res.data.urls,
          showText: true,
          loading: false
        })
      })
      .catch(error => {
        this.setState({ loading: false })
        if (error.response && error.response.status === 400) {
          this.props.alert.error('Files Not Found')
        } else {
          this.props.alert.error('Error Occurred')
        }
        console.log(error)
      })
  }

  getDateClassReport (url) {
    let part = (url.split('/')[url.split('/').length - 1]).replace('class-Report-', '')
    let index = part.indexOf('.')
    let date = part.substring(0, index !== -1 ? index : part.length)
    return date
  }

  scrollHandle = (event, state, pageSize) => {
    let { currentPage } = this.state
    // let url = urls.OnlineClassBulkDownload
    let date = this.state.date ? moment(this.state.date).format('DD-MM-YYYY') : null
    pageSize = pageSize || this.state.pageSize
    // let{ date } = this.state
    let { target } = event

    if (target.scrollTop + target.clientHeight >= target.scrollHeight) {
      axios.get(`${urls.OnlineClassBulkDownload + '?date=' + date + '&page_number=' + (currentPage + 1) + '&page_size=' + pageSize}`, {
        headers: {
          Authorization: 'Bearer ' + this.props.user
          // 'Content-Type': 'application/json'
        }
      })
        .then(res => {
          if (res.data.urls.length) {
            this.setState({
              currentPage: this.state.currentPage + 1,
              classBulkDownload: [...this.state.classBulkDownload, ...res.data.urls]
            })
          }
        })
    }
  }
  render () {
    console.log(this.state.classBulkDownload, 'class')
    const { classBulkDownload } = this.state
    let { classes } = this.props
    // const classList = classBulkDownload.map(clas => {
    // })
    return (
      <React.Fragment>

        <Grid style={{ 'font-size': '16px', padding: 10 }} >
          {/* <div className='ui label'>
          </div> */}
          <label>Select date:</label><br />
          <input
            className='unstyled'
            onChange={this.handleDate}
            value={this.state.date}
            type='date'
            name='startingDate'
            id='startingDate'
            max={(() => { let tdy = new Date(); let yr = tdy.getFullYear(); let mn = String(tdy.getMonth() + 1).padStart(2, '0'); let dy = String(tdy.getDate() - 1).padStart(2, '0'); return (yr + '-' + mn + '-' + dy) })()}

          />
            &nbsp; &nbsp;
          <Button variant='contained' size='small' style={{ padding: 10 }} color='primary' onClick={this.bulkDownload}>
            FILTER
          </Button>
          &nbsp; &nbsp;
        </Grid>
        {this.state.showText && <div style={{ 'text-align': 'center' }}><h3 >
              BranchWise Excel Reports
        </h3></div>}
        <div className='class-container' onScroll={this.scrollHandle}>
          {classBulkDownload && classBulkDownload.length > 0 && classBulkDownload.map(classReport => {
            return (
              <a className={classes.AnchorStyle} href={classReport} target='_blank'>
                <i className='download icon' style={{ fontSize: '28px', display: 'flex', padding: '10px 0px 0px 93px' }} /><p style={{ fontSize: '16px', display: 'flex', justifyContent: 'space-around' }}>
                  {this.getDateClassReport(classReport)}
                </p>
              </a>
            )
          })}
        </div>
        {/* </div> */}
      </React.Fragment>
    )

    // return (
    //   <React.Fragment>
    //     <div className='onlineClass-container'onScroll={this.scrollHandle}>
    //       <div>
    //         {classList}
    //       </div>
    //     </div>
    //   </React.Fragment>
    // )
  }
}

const mapStateToProps = state => ({
  user: state.authentication.user
})

export default connect(mapStateToProps, null)(
  withStyles(styles)(withRouter(BulkDownloadReport)))
