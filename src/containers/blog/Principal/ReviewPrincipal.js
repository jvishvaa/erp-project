import React, { Component } from 'react'
import { Grid, Button } from '@material-ui/core'
import { withRouter } from 'react-router-dom';

// import Close from '@material-ui/icons/Close'
import axios from '../../../config/axios';
import endpoints from '../../../config/endpoints';

import HoverRating from './RatingPrincipal'

class ReviewPrincipal extends Component {
  constructor (props) {
    super(props)
    this.state = {
      ratingParameters: [],
      overallRemark: '',

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


  

  render () {
    const { ratingParameters, overallRemark} = this.state
    return (
      <React.Fragment>
        <Grid container spacing={2}>
          {
            ratingParameters.map(parameter => {
              return (
                <Grid item xs={12}>
                  <HoverRating {...parameter} handleRatingEdit={this.handleRatingScaleChange} handleRemark={this.handleRemark} />
                </Grid>
              )
            })
          }
          <Grid item xs={12}  >
            <hr />
            <HoverRating rating={this.calculateOverallRating()} overallRemark={overallRemark} rating_type='Overall' handleRemark={this.handleRemark} />
          </Grid>
        </Grid>

     

      </React.Fragment>
    )
  }
}

export default withRouter(ReviewPrincipal)
