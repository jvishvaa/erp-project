import React, { Component } from 'react'
import { AppBar, Tabs, Tab } from '@material-ui/core'
import QuizTestHeldCount from './QuizTestHeldCount'
import ViewQuizResults from './ViewQuizResults'

class QuizStatistics extends Component {
  constructor () {
    super()
    this.state = {
      currentTab: 0
    }
  }

  handleTabChange = (event, tab) => {
    this.setState({ currentTab: tab })
  }

  render () {
    const { currentTab } = this.state
    return (
      <div>
        <AppBar position='static'>
          <Tabs value={currentTab} onChange={this.handleTabChange}>
            <Tab label='Number of tests held' />
            <Tab label='View Results' />
          </Tabs>
        </AppBar>
        {
          currentTab === 0
            ? <QuizTestHeldCount alert={this.props.alert} />
            : <ViewQuizResults alert={this.props.alert} />
        }
      </div>
    )
  }
}

export default QuizStatistics
