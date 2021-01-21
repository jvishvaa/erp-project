import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import { Form } from 'semantic-ui-react'
// import { Button } from '@material-ui/core'
import Button from '@material-ui/core/Button'

import axios from 'axios'
import { urls } from '../../urls'
import { ProfanityFilter } from '../../ui'

class UploadFeeds extends Component {
  constructor () {
    super()
    this.state = {
      description: '',
      videoLink: '',
      summary: ''
    }
  }

  handleUpload=(e) => {
    let payload = { feed_description: this.state.description, feed_video_link: this.state.videoLink, feed_summary: this.state.summary }

    axios.post(urls.FEEDS, JSON.stringify(payload), {
      headers: {
        Authorization: 'Bearer ' + this.props.user,
        'Content-Type': 'application/json'
      }
    })
      .then(res => {
        this.props.alert.success(res.data)
        this.setState({
          description: '',
          videoLink: '',
          summary: ''
        })
      })
      .catch((error, status) => {
        console.log(error)
        this.props.alert.error(error.response.data)
        this.setState({
          description: '',
          videoLink: '',
          summary: ''
        })
      })
  }

  getData = (e) => {
    this.setState({ [e.target.name]: e.target.value })
  }

  render () {
    let { description, videoLink, summary } = this.state
    console.log(this.props.name)
    return (
      <React.Fragment>
        <Form style={{ padding: '30px' }}>
          <Form.Field width={6}>
            <ProfanityFilter label={'Summary'} name='summary' onChange={this.getData} value={summary} />
          </Form.Field>
          <Form.Field width={6}>
            <ProfanityFilter label={'Description'} name='description' onChange={this.getData} value={description} />
          </Form.Field>
          <Form.Field width={6}>
            <ProfanityFilter label={'Video url'} name='videoLink' onChange={this.getData} value={videoLink} />
          </Form.Field>
          <Button variant='contained'
            color='primary'
            onClick={this.handleUpload}
            disabled={!description || !videoLink || !summary}>
                Upload
          </Button>
        </Form>
      </React.Fragment>
    )
  }
}

const mapStateToProps = state => ({
  user: state.authentication.user
})

export default connect(
  mapStateToProps
)(withRouter(UploadFeeds))
