import React, { Component } from 'react'
import { Grid, Button } from '@material-ui/core'

// import Close from '@material-ui/icons/Close'
import axios from 'axios'
import HoverRating from './utils/Rating'
import { urls } from '../../urls'

class Review extends Component {
  constructor () {
    super()
    this.state = {
      ratingParameters: [],
      overallRemark: '',

      personalInfo: JSON.parse(localStorage.getItem('user_profile')).personal_info
    }
  }

  getStaticParamters = () => {
    return [
      { rating: null, remark: null, rating_type: 'Grammar' },
      { rating: null, remark: null, rating_type: 'Clarity' },
      { rating: null, remark: null, rating_type: 'Structure' },
      { rating: null, remark: null, rating_type: 'Engagement' },
      { rating: null, remark: null, rating_type: 'Vocabulary' },
      { rating: null, remark: null, rating_type: 'Coherence' }
    ]
  }

  componentDidMount () {
    if (this.props.ratingParameters().length) {
      this.setState({ ratingParameters: this.props.ratingParameters(), overallRemark: this.props.overallRemark() })
    } else {
      this.setState({ ratingParameters: this.getStaticParamters() })
    }
  }

  handleRatingScaleChange = (parameter, rating) => {
    const ratingParametersCopy = this.state.ratingParameters
    ratingParametersCopy.find(item => item.rating_type === parameter).rating = rating
    this.setState({ ratingParameters: ratingParametersCopy })
  }

  calculateOverallRating = () => {
    const { ratingParameters } = this.state
    let average = 0
    ratingParameters.map(parameter => {
      average += parameter.rating
    })
    return average / 6
  }

  handleRemark = (parameter, value) => {
    if (parameter === 'Overall') {
      this.setState({ overallRemark: value })
    } else {
      const ratingParametersCopy = this.state.ratingParameters
      ratingParametersCopy.find(item => item.rating_type === parameter).remark = value
      this.setState({ ratingParameters: ratingParametersCopy })
    }
  }

  isAllParametersEntered = () => {
    const { ratingParameters } = this.state
    const isEntered = ratingParameters.every(paramter => (paramter.rating))
    return isEntered
  }

  logError = (err, alertType = 'error') => {
    let { message, response: { data: { status: messageFromDev, err_msg: middleWareMsg } = {} } = {} } = err || {}
    let alertMsg
    if (messageFromDev) {
      alertMsg = messageFromDev
    } else if (middleWareMsg) {
      alertMsg = middleWareMsg
    } else if (message) {
      alertMsg = message
    } else {
      alertMsg = 'Failed to connect to server'
    }
    this.props.alert[alertType](`${alertMsg}`)
  }

  handleSubmit = () => {
    const { blogId } = this.props
    const { overallRemark, ratingParameters, personalInfo } = this.state
    const formData = new FormData()
    formData.append('id', blogId)
    formData.append('overall_remark', overallRemark)
    formData.append('overall_rating', this.calculateOverallRating())
    formData.append('remark_rating', JSON.stringify(ratingParameters))
    axios.post(`${urls.CreateBlog}`, formData, {
      headers: {
        Authorization: 'Bearer ' + personalInfo.token
      }
    })
      .then(res => {
        console.log(res)
        this.props.alert.success('Successfully reviewed the blog')
        this.props.closeFullscreen(blogId)
      })
      .catch(err => {
        console.log(err)
        this.logError(err)
      })
  }

  render () {
    const { ratingParameters, overallRemark, personalInfo } = this.state
    return (
      <React.Fragment>
        <Grid container spacing={2}>
          {
            ratingParameters.map(parameter => {
              return (
                <Grid item xs={12} sm={4} md={4}>
                  <HoverRating {...parameter} handleRatingEdit={this.handleRatingScaleChange} handleRemark={this.handleRemark} />
                </Grid>
              )
            })
          }
          <Grid item xs={12} sm={12} md={12} >
            <hr />
            <HoverRating rating={this.calculateOverallRating()} overallRemark={overallRemark} rating_type='Overall' handleRemark={this.handleRemark} />
          </Grid>
        </Grid>

        {
          personalInfo.role !== 'Student'
            ? <Button
              className='reviewer_submit'
              variant='contained'
              color='primary'
              onClick={this.handleSubmit}
              disabled={!this.isAllParametersEntered() || !overallRemark} >
             Submit
            </Button>

            : ''
        }
      </React.Fragment>
    )
  }
}

export default Review
