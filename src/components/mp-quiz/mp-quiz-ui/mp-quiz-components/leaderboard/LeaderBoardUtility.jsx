import React from 'react'
import CompoundTimer from 'react-compound-timer'
import Timer from './assets/Timer_watch.svg'
import Participant from './assets/Participant.svg'
import RankMedal from './assets/Rank_Medal.svg'
import Coins from './assets/coins.svg'
import './StudentRankingDetails.css'

export const QuestionCount = (props) => {
  const { totalQuestions, currentQuestion } = props
  return (
    <div className='leaderboard__utliliy--container'>
      {
        totalQuestions
          ? <p className='leaderboard__utliliy--text'>Q {currentQuestion} / {totalQuestions}</p>
          : <p className='leaderboard__utliliy--text'>Q 0 / 0</p>
      }
    </div>
  )
}

export const QuizTimer = (props) => {
  /*
    This module to be refactored
  */
  let { duration = 0, timeToRender, startImmediately = false, onZerothChckP = () => {} } = props
  return (
    <div className='leaderboard__utliliy--container'>
      <img src={Timer} alt='Time' className='leaderboard__utliliy--img' />
      <p className='leaderboard__utliliy--text'>
        {/* 2:01:01 */}
        <CompoundTimer
          initialTime={duration * 1000}
          direction='backward'
          startImmediately={startImmediately}
          checkpoints={[{ time: 0, callback: () => { onZerothChckP() } }]}
        >
          {({ start, resume, pause, stop, reset, ...restProps }) => (
            <React.Fragment>
              <div>
                {/* <CompoundTimer.Days />: */}
                <CompoundTimer.Hours />:
                <CompoundTimer.Minutes />:
                <CompoundTimer.Seconds />
                {/* <CompoundTimer.Milliseconds /> milliseconds */}

              </div>
              <div>
                {/* <button onClick={start}>Start</button>
                <button onClick={pause}>Pause</button>
                <button onClick={resume}>Resume</button>
                <button
                >
                x==  {restProps.getTimerState()}
                  {
                    restProps.getTime()
                  }>
                </button> */}
                {(() => {
                  if (timeToRender === 'render_question') {
                    if (restProps.getTimerState() === 'INITED') {
                      start()
                    } else if (restProps.getTimerState() === 'PAUSED') {
                      resume()
                    }
                  } else if (timeToRender !== 'render_question' && typeof timeToRender === 'string') {
                    if (restProps.getTimerState() === 'PLAYING') {
                      pause()
                    }
                  }
                })()}
                {/* <button onClick={stop}>Stop</button> */}
                {/* <button onClick={reset}>Reset</button> */}
              </div>
            </React.Fragment>
          )}
        </CompoundTimer>
      </p>
    </div>
  )
}

export const ParticipantCount = (props) => {
  const { participantsCount } = props
  return (
    <div className='leaderboard__utliliy--container'>
      <img src={Participant} alt='Participant' className='leaderboard__utliliy--img' />
      <p className='leaderboard__utliliy--text'>{participantsCount || 0} {window.innerWidth > 900 ? Number(participantsCount) > 1 ? 'Participants' : 'Participant' : ''}</p>
    </div>
  )
}

export const CurrentRank = (props) => {
  const { rank = '' } = props
  return (
    <div className='leaderboard__utliliy--container'>
      <img src={RankMedal} alt='Rank' className='leaderboard__utliliy--img' />
      <p className='leaderboard__utliliy--text'>{rank}</p>
    </div>
  )
}

class CurrentScore extends React.Component {
  constructor () {
    super()
    this.state = {
      counter: 0
    }
  }

  // countUp = (currentScore = 0) => {
  //   const reference = this.refs['counter']
  //   const start = reference.innerHTML
  // }

  // counterCount = (num) => {
  //   if (num % 100 === 0) {
  //     return 100
  //   } else if (num % 10 === 10) {
  //     return 10
  //   } else {
  //     return 1
  //   }
  // }

  counterAnimation = (el, initialNum, finalNum) => {
    if (Number.isInteger(finalNum)) {
      let interval = setInterval(function () {
        const counterValue = finalNum % 100 === 0 ? 100 : 10
        el.innerHTML = initialNum
        if (initialNum >= finalNum) {
          clearInterval(interval)
          // this.setState({ counter: finalNum })
        } else {
          initialNum = initialNum + counterValue
        }
      }, 2)
    }
  }

  componentWillReceiveProps ({ score = 0 }) {
    const refer = this.refs['counter']
    this.counterAnimation(refer, this.state.counter, score)
    this.setState({ counter: score })
  }

  render () {
    const { counter } = this.state
    return (
      <div className='leaderboard__utliliy--container'>
        <img src={Coins} alt='Score' className='leaderboard__utliliy--img' />
        <p className='leaderboard__utliliy--text leaderboard__utility--score' ref={'counter'}>{counter || 0}</p>
      </div>
    )
  }
}

export default CurrentScore
