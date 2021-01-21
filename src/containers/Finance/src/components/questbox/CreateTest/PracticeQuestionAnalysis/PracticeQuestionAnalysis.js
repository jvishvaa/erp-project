import React, { Component } from 'react'
import { Grid, Toolbar } from '@material-ui/core'
import axios from 'axios'
import BarGraph from '../../../../ui/BarGraph/BarGraph'
import LeaderBoard from '../../../../ui/LeaderBoard/LeaderBoard'
import GSelect from '../../../../_components/globalselector'
import { COMBINATIONS } from './PracticeQuestionsCombinations'
import { urls } from '../../../../urls'

class PracticeQuestionAnalysis extends Component {
state = {
  barGraphProperties: {
    data: [],
    labels: ['0-40%', '41-60%', '61-80%', '81-99%', '100%'],
    graphTitle: 'Analysis',
    titleXaxis: 'Percentage',
    titleYaxis: 'Number of students',
    mainTitle: 'Percentage of chapters completed by students',
    isMultiple: false
  },
  selectorValues: {},
  token: JSON.parse(localStorage.getItem('user_profile')).personal_info.token,
  showBarGraph: false,
  showLeaderBoard: false,
  leaders: [],
  currentPage: 1,
  totalPages: 1
}

  handleScroll = () => {
    const { selectorValues } = this.state
    this.setState({ currentPage: this.state.currentPage + 1 }, () => {
      this.getLeaderBoardData(selectorValues.id, this.state.currentPage, true)
    })
  }

  getLeaderBoardData = (chapterId, pageNumber = 1, appendUsers) => {
    let path = `${urls.PracticeQuestionsLeaderboard}?chapter_id=${chapterId}&page_number=${pageNumber}&page_size=10000`
    axios.get(path, {
      headers: {
        Authorization: 'Bearer ' + this.state.token
      }
    })
      .then(res => {
        appendUsers
          ? this.setState({ leaders: [...this.state.leaders, ...res.data.final_result], showLeaderBoard: true, totalPages: res.data.total_page_count })
          : this.setState({ leaders: [...res.data.final_result], showLeaderBoard: true, totalPages: res.data.total_page_count })
      })
      .catch(err => {
        console.log(err)
        this.props.alert.error('Failed to fetch data')
        this.setState({ showLeaderBoard: true })
      })
  }

  getAnalytics = () => {
    const { branch_id: branchId = '', id: chapterId = '', grade_id: gradeId = '' } = this.state.selectorValues
    const path = `${urls.PracticeQuestionAnalysis}?branch=${branchId}&grade=${gradeId}&chapter=${chapterId}`
    axios.get(path, {
      headers: {
        Authorization: 'Bearer ' + this.state.token
      }
    })
      .then(res => {
        const { data } = res.data
        this.setState({
          barGraphProperties: { ...this.state.barGraphProperties,
            data: data
          },
          showBarGraph: true
        })
      })
      .catch(err => {
        console.log(err)
        this.props.alert.error('Failed to fetch data')
        // window.alert('failed')
        this.setState({ showBarGraph: true })
      })
  }

  onChange = (data) => {
    const { selectorValues } = this.state
    console.log(data)
    if (JSON.stringify(selectorValues) !== JSON.stringify(data)) {
      this.setState({ selectorValues: data }, () => {
        if (data.subject_id && data.id) {
          this.setState({ currentPage: 1 }, () => {
            this.getAnalytics()
            this.getLeaderBoardData(data.id, this.state.currentPage, false)
          })
        }
      })
    }
  }

  render () {
    const { currentPage, totalPages } = this.state
    return (
      <div>
        <Toolbar style={{ backgroundColor: '#ecf0f1', padding: 0 }}>
          <GSelect variant={'selector'} onChange={this.onChange} config={COMBINATIONS} />
        </Toolbar>
        <Grid container spacing={1} style={{ marginTop: 20, padding: 20 }}>
          <Grid item sm={6}>
            {
              this.state.showBarGraph
                ? <BarGraph properties={{ ...this.state.barGraphProperties }} />
                : ''
            }

          </Grid>
          <Grid item sm={1} />
          <Grid item sm={5}>
            {
              this.state.showLeaderBoard
                ? <LeaderBoard handleScroll={this.handleScroll} leaders={this.state.leaders} pageDetails={{ currentPage, totalPages }} />
                : ''
            }

          </Grid>
        </Grid>
      </div>
    )
  }
}

export default PracticeQuestionAnalysis
