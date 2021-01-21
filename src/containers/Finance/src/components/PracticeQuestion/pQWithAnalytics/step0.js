import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'
import axios from 'axios'
// import { Button } from '@material-ui/core'
import LinkTag from '@material-ui/core/Link'
import { urls } from '../../../urls'
import { InternalPageStatus } from '../../../ui'
// import MediaControlCard from './Cards/cardView'
import CardGroup from './cards/cardGroup'

class step0 extends Component {
  state = {}
  componentWillMount () {
    this.getSubjects()
  }
  getSubjects = () => {
    let { gradeId, authToken } = this.props
    let { GetSubjectsWithQuestionCount } = urls
    let getSubPath = `${GetSubjectsWithQuestionCount}?grade_id=${gradeId}`
    this.setState({ isFetching: true, isFetchingFailed: false }, () => {
      axios.get(getSubPath, {
        headers: {
          'Authorization': 'Bearer ' + authToken
        }
      }).then(response => {
        if (response.status === 200) {
          let { total_count: totalCount, data: subjects } = response.data
          this.setState({ totalCount, subjects, isFetching: false })
        } else {
          this.setState({ isFetching: false, isFetchingFailed: true })
        }
      }).catch(e => { this.setState({ isFetching: false, isFetchingFailed: true }) })
    })
  }
  renderSubjects = () => {
    let { isFetching, isFetchingFailed, subjects = [], totalCount } = this.state

    if (isFetchingFailed) {
      return <InternalPageStatus
        label={
          <p>Error occured in fetching Subjects&nbsp;
            <LinkTag
              component='button'
              onClick={this.getSubjects}>
              <b>Click here to reload_</b>
            </LinkTag>
          </p>
        }
        loader={false} />
    }
    if (isFetching) {
      return <InternalPageStatus label='Loading' />
    }
    if (subjects.length) {
      return <div style={{ padding: 0, margin: 0 }}>
      Total Questions:&nbsp;<span style={{ fontSize: 18 }}>{totalCount}</span>
        <CardGroup
          cardItems={subjects}
          titleKey='subject_name'
          countKey='qns_count'
          onCardClick={(quesCount, subjectIdArg) => {
            if (quesCount) {
              this.props.handleNavigation('subject_id', subjectIdArg)
            }
          }}
          onCardClickArgKeys={['qns_count', 'subject_id']}
        />
      </div>
    } else {
      return <InternalPageStatus label='Hang tight! We are getting more content for you soon!' loader={false} />
    }
  }
  render () {
    return this.renderSubjects()
  }
}
export default withRouter(step0)
