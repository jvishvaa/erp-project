import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'
import axios from 'axios'
import LinkTag from '@material-ui/core/Link'
import { urls } from '../../../urls'
import { InternalPageStatus } from '../../../ui'
import CardGroup from './cards/cardGroup'

class step2 extends Component {
  state = {}
  componentWillMount () {
    this.getQLevels()
  }
  getQLevels = () => {
    let { gradeId, authToken, subjectId, chapterId } = this.props
    let { GetQuestionLevelsWithQuestionCount } = urls
    let urlPath = `${GetQuestionLevelsWithQuestionCount}?grade_id=${gradeId}&subject_id=${subjectId}&chapter_id=${chapterId}&feature=practice_questions&is_hidden=False`
    this.setState({ isFetching: true, isFetchingFailed: false }, () => {
      axios.get(urlPath, {
        headers: {
          'Authorization': 'Bearer ' + authToken
        }
      }).then(response => {
        if (response.status === 200) {
          let { total_count: totalCount, data: qLevels } = response.data
          this.setState({ totalCount, qLevels, isFetching: false })
        } else {
          this.setState({ isFetching: false, isFetchingFailed: true })
        }
      }).catch(e => { this.setState({ isFetching: false, isFetchingFailed: true }) })
    })
  }
  renderQLevels = () => {
    let { isFetching, isFetchingFailed, qLevels = [], totalCount } = this.state
    if (isFetchingFailed) {
      return <InternalPageStatus
        label={
          <p>Error occured in fetching Question levels&nbsp;
            <LinkTag
              component='button'
              onClick={this.getQLevels}>
              <b>Click here to reload_</b>
            </LinkTag>
          </p>
        }
        loader={false} />
    }
    if (isFetching) {
      return <InternalPageStatus label='Loading' />
    }
    if (qLevels.length) {
      return <div style={{ padding: 0, margin: 0 }}>
      Total Questions:&nbsp;<span style={{ fontSize: 18 }}>{totalCount}</span>
        <CardGroup
          cardItems={qLevels}
          titleKey='question_level'
          countKey='qns_count'
          onCardClick={(quesCount, idArg) => {
            if (quesCount) {
              this.props.handleNavigation('qLevel_id', idArg)
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
    return this.renderQLevels()
  }
}
export default withRouter(step2)
