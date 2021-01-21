import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'
import axios from 'axios'
import LinkTag from '@material-ui/core/Link'
import { urls } from '../../../urls'
import { InternalPageStatus } from '../../../ui'
import CardGroup from './cards/cardGroup'

class step1 extends Component {
  state = {}
  componentWillMount () {
    this.getChapters()
  }
  getChapters = () => {
    let { gradeId, authToken, subjectId } = this.props
    let { GetChaptersWithQuestionCount } = urls
    let urlPath = `${GetChaptersWithQuestionCount}?grade_id=${gradeId}&subject_id=${subjectId}&feature=practice_questions&is_hidden=False`
    this.setState({ isFetching: true, isFetchingFailed: false }, () => {
      axios.get(urlPath, {
        headers: {
          'Authorization': 'Bearer ' + authToken
        }
      }).then(response => {
        if (response.status === 200) {
          let { total_count: totalCount, data: chapters } = response.data
          this.setState({ totalCount, chapters, isFetching: false })
        } else {
          this.setState({ isFetching: false, isFetchingFailed: true })
        }
      }).catch(e => { this.setState({ isFetching: false, isFetchingFailed: true }) })
    })
  }
  renderChapters = () => {
    let { isFetching, isFetchingFailed, chapters = [], totalCount } = this.state
    if (isFetchingFailed) {
      return <InternalPageStatus
        label={
          <p>Error occured in fetching Chapters&nbsp;
            <LinkTag
              component='button'
              onClick={this.getChapters}>
              <b>Click here to reload_</b>
            </LinkTag>
          </p>
        }
        loader={false} />
    }
    if (isFetching) {
      return <InternalPageStatus label='Loading' />
    }
    if (chapters.length) {
      return <div style={{ padding: 0, margin: 0 }}>
      Total Questions:&nbsp;<span style={{ fontSize: 18 }}>{totalCount}</span>
        <CardGroup
          cardItems={chapters}
          titleKey='chapter_name'
          countKey='qns_count'
          onCardClick={(quesCount, idArg) => {
            if (quesCount) {
              this.props.handleNavigation('chapter_id', idArg)
            }
          }}
          onCardClickArgKeys={['qns_count', 'id']}
        />
      </div>
    } else {
      return <InternalPageStatus label='Hang tight! We are getting more content for you soon!' loader={false} />
    }
  }
  render () {
    return this.renderChapters()
  }
}
export default withRouter(step1)
