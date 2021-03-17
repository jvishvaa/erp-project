import React, { Component } from 'react'
import { Checkbox, Dialog, Slide, AppBar, Toolbar, IconButton } from '@material-ui/core'
import CloseIcon from '@material-ui/icons/Close'
import PostQuizStudentRankingDetails from './PostQuizStudentRankingDetails'
import OrderedList from '../OrderedList'
import './PostQuizLeaderboard.css'
import ReviewAnswers from './ReviewAnswers'

const Transition = React.forwardRef(function Transition (props, ref) {
  return <Slide direction='up' ref={ref} {...props} />
})
class PostQuizLeaderboard extends Component {
  constructor () {
    super()
    this.state = {
      participants: [],
      showTopFive: false,
      open: false
    }
  }

  handleChange = (event) => {
    const { checked } = event.target
    this.setState({ showTopFive: checked })
  }

  handleClose = () => {
    this.setState({ open: false })
  }

  render () {
    const { showTopFive, open } = this.state
    const { leaderboardData = [],
      quizDetails: { total_possible_score: possibleScore = 0, total_no_of_questions: totalQuestions },
      currentPlayerObj = {},
      currentUserId,
      isQuizEnded,
      isHost,
      onlineClassId
    } = this.props
    const currentPlayerLBData = leaderboardData.find(item => item.user_id === currentPlayerObj.user_id) || {}
    return (
      <div className='studentpostquiz__leaderboard--container'>
        {
          !isHost
            ? <React.Fragment>
              <div>
                <h2 className='leaderboard__title'>
                  {isQuizEnded ? 'Quiz Ended' : 'Waiting for other players to finish the game'}
                </h2>
                {
                  currentPlayerLBData
                    ? <div style={{ width: '70%', margin: '0 auto' }}>
                      <PostQuizStudentRankingDetails key={`current-${currentPlayerLBData.user_id}`} {...currentPlayerLBData} possibleScore={possibleScore} />
                    </div>
                    : ''
                }
              </div>
            </React.Fragment>
            : ''
        }

        <div style={{ height: isHost ? '90%' : '80%' }}>
          <div className='postquiz__leaderboard--container'>
            <img className='postquiz__playerinfo--background' />
            {/* {!isHost && <button className='btn__download--results' onClick={() => {
              this.setState({ open: true })
            }}>Review Questions</button>} please handle */} 
            {
              <Dialog fullScreen open={open} onClose={this.handleClose} TransitionComponent={Transition}>
                <AppBar>
                  <Toolbar>
                    <IconButton edge='start' color='inherit' onClick={this.handleClose} aria-label='close'>
                      <CloseIcon />
                    </IconButton>
                  </Toolbar>
                </AppBar>
                {
                  onlineClassId ? <ReviewAnswers onlineClassId={onlineClassId} /> : <p>ReviewAnswers - pass online class id and review ques</p>
                }
                
              </Dialog>
            }
            <div className='postquiz__done--status'>
              {`${leaderboardData.filter(item => item.has_finished).length} / ${leaderboardData.length} done`}
            </div>
            {leaderboardData.length > 5
              ? <div className='postquiz__showtop5'>
                Show only top 5 <span style={{ display: 'inline' }}>
                  <Checkbox
                    checked={showTopFive}
                    onChange={this.handleChange}
                    inputProps={{ 'aria-label': 'primary checkbox' }}
                  />
                </span>
              </div>
              : null}
            <div className='postquiz__participants--container'>
              <div>
                <OrderedList currentUserId={currentUserId} leaders={leaderboardData} showTopFive={showTopFive} showWithProgress possibleScore={possibleScore} totalQuestions={totalQuestions} isHost={isHost} />
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default PostQuizLeaderboard
