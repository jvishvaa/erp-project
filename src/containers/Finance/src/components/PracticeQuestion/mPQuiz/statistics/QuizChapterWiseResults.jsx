import React, { Component } from 'react'
import axios from 'axios'
import Results from './Results'
import { InternalPageStatus, Pagination } from '../../../../ui'
import { urls } from '../../../../urls'

class QuizChapterWiseResults extends Component {
  constructor () {
    super()
    this.state = {
      results: [],
      loading: true,
      showMessage: false,
      currentPage: 0,
      pageSize: 10,
      count: 0
    }
  }

  componentDidMount () {
    this.getResults()
  }

  getResults = () => {
    const { onlineClassId } = this.props
    const personalInfo = JSON.parse(localStorage.getItem('user_profile')).personal_info
    const { pageSize, currentPage } = this.state
    const url = `${urls.OnlineClassQuizResults}?online_class_id=${onlineClassId}&page_number=${currentPage + 1}&page_size=${pageSize}`
    axios.get(url, {
      headers: {
        Authorization: 'Bearer ' + personalInfo.token
      }
    })
      .then(res => {
        this.setState({ results: res.data.data, loading: false, showMessage: true, count: res.data.total_items })
      })
      .catch(err => {
        console.log(err)
        this.setState({ loading: false, showMessage: true })
        this.props.alert.error('Something went wrong')
      })
  }

  handlePagination = (event, page) => {
    this.setState({ loading: true, currentPage: page }, () => {
      this.getResults()
    })
  }

  render () {
    const { results, loading, showMessage, currentPage, pageSize, count } = this.state
    return (
      <div>
        {
          loading
            ? <InternalPageStatus label={'Loading data. Please wait!'} />
            : results.length
              ? <React.Fragment>
                <Results results={results} />
                <Pagination
                  rowsPerPageOptions={[]}
                  page={currentPage}
                  rowsPerPage={pageSize}
                  count={count}
                  onChangePage={this.handlePagination}
                />
              </React.Fragment>
              : showMessage ? <InternalPageStatus label='No data found!' loader={false} /> : ''
        }
      </div>
    )
  }
}

export default QuizChapterWiseResults
