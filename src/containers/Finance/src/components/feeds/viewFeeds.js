import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import axios from 'axios'
import { Card, CardContent, Typography, Link } from '@material-ui/core'
import { urls } from '../../urls'
import './feeds.css'

class ViewFeeds extends Component {
  constructor () {
    super()
    this.state = {
      feeds: [],
      currentPage: 1,
      scrolled: false
    }
  }

  componentWillMount () {
    axios.get(`${urls.FEEDS}?page_number=${this.state.currentPage}`, {
      headers: {
        Authorization: 'Bearer ' + this.props.user,
        'Content-Type': 'application/json'
      }
    })
      .then(res => {
        this.setState({
          feeds: res.data
        })
      })
      .catch(error => {
        console.log(error)
      })
  }

  handleScroll = (event) => {
    let { currentPage } = this.state
    let { target } = event
    if (target.scrollTop + target.clientHeight >= target.scrollHeight) {
      axios.get(`${urls.FEEDS}?page_number=${currentPage + 1}`, {
        headers: {
          Authorization: 'Bearer ' + this.props.user,
          'Content-Type': 'application/json'
        }
      })
        .then(res => {
          if (res.data.length) {
            this.setState({
              currentPage: this.state.currentPage + 1,
              feeds: [...this.state.feeds, ...res.data]
            })
          }
        })
    }
  }

  render () {
    const { feeds } = this.state
    const feedsList = feeds.map(feed => {
      console.log(feed.feed_summary.trim() ? 'hi' : 'bye')

      return (
        feed.feed_summary.trim() && feed.feed_description.trim() && feed.feed_video_link.trim() ? <Card className='card-wrapper' key={feed.id}>
          <CardContent>
            <Typography className='card-text' variant='h5'>
              {feed.feed_summary}
            </Typography>
            <Typography className='card-text' variant='body1'>
              {feed.feed_description}
            </Typography>
            <Link className='card-text' variant='body1' href={feed.feed_video_link} target='_blank' style={{ color: 'blue' }}>
              {feed.feed_video_link}
            </Link>
          </CardContent>
        </Card> : ''
      )
    })
    return (
      <React.Fragment>
        <div className='feeds-container' onScroll={this.handleScroll}>
          <div>
            {feedsList}
          </div>
        </div>
      </React.Fragment>
    )
  }
}

const mapStateToProps = state => ({
  user: state.authentication.user
})

export default connect(
  mapStateToProps
)(withRouter(ViewFeeds))
