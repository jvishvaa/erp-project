import React from 'react'
import { Box, Typography, Card, Chip, Grid, CircularProgress, Hidden } from '@material-ui/core'
import moment from 'moment'
import './UserSession.css'

const UserSessionReport = (props) => {
  const {
    answers_correct_count: correctAnswersCount,
    answers_skipped_count: skippedAnswersCount,
    answers_incorrect_count: incorrectAnswersCount,
    total_time: totalTime,
    total_session_time: totalSessionTime,
    average_question_time: averageQuestionTime,
    accuracy,
    total_question_count: totatQuestionsCount,
    unAttemptedQuestions = totatQuestionsCount - (correctAnswersCount + incorrectAnswersCount)
  } = props.accuracyReport

  const calculatePercentage = (count) => {
    let percentage = (count / totatQuestionsCount) * 100
    percentage = isNaN(percentage) ? 0 : percentage
    return <span style={{ fontSize: 14, marginLeft: 5 }}>{`(${percentage.toFixed(2)}%)`}</span>
  }

  const renderAnalysis = (title, content, color, showPercentage) => {
    return (
      <Grid item xs={12} sm={4} md={4}>
        <Card className='anaysis__container' elevation={3}>
          <Typography variant='subtitle1' style={{ marginTop: 5 }}>{title}</Typography>
          {
            props.showLoader
              ? <div style={{ width: 50 }}><CircularProgress style={{ color: 'green' }} /></div>
              : <Typography variant='h5' style={{ color: color }}>
                {content}{showPercentage ? calculatePercentage(content) : ''}
              </Typography>
          }
        </Card>
      </Grid>
    )
  }

  const formatTime = (seconds) => {
    const mins = moment.utc(moment.duration(seconds, 'seconds').asMilliseconds()).format('mm')
    if (mins < 1) {
      const secs = moment.utc(moment.duration(seconds, 'seconds').asMilliseconds()).format('ss')
      return `${secs} sec`
    } else {
      return `${mins} mins`
    }
  }
  const getAccurayStr = () => {
    return `${accuracy === null ? '- -' : accuracy < 9 ? `${accuracy.toFixed(0)} %` : `${accuracy.toFixed(0)} %`} (${correctAnswersCount}/${(correctAnswersCount + incorrectAnswersCount) || '0'})`
  }

  return (
    <React.Fragment>
      <Box className={['user__session__conatiner', 'responsive-div']} boxShadow={4}>
        { <Hidden smDown>
          <div className='user__session__results__container'>
            <Chip className='user__session__chip' label='Accuracy %' />
            <div className='user__session__rank__container'>
              <Typography variant='h3' className='user__session__rank'>
                {accuracy === null
                  ? '- -'
                  : accuracy < 9 ? `${accuracy.toFixed(0)} %` : accuracy.toFixed(0)}</Typography>
            </div>
            <Typography variant='h6' className='your__score'>Your Score: </Typography>
            <Typography variant='h4' className='user__session__score'>{correctAnswersCount}/{(correctAnswersCount + incorrectAnswersCount) || '0'}</Typography>
          </div>
        </Hidden>}
        <div className='analysis__container'>
          <Typography variant='h5' style={{ margin: '0 auto', textAlign: 'center' }}>CHAPTER-WISE ACCURACY REPORT</Typography>
          <br />
          <Grid container spacing={1}>
            <Hidden smUp>
              {renderAnalysis('Accuracy', getAccurayStr(), 'green')}
            </Hidden>
            {renderAnalysis('Correct Answers', correctAnswersCount, 'green', true)}
            {renderAnalysis('Wrong Answers', incorrectAnswersCount, 'red', true)}
            {renderAnalysis('Skipped Answers', skippedAnswersCount, 'orange', true)}
            {/* </Grid>
          <Grid container spacing={1}> */}
            {renderAnalysis('Total time spent', formatTime(totalTime), 'blue', false)}
            {renderAnalysis('Average duration', formatTime(averageQuestionTime), 'blue', false)}
            {renderAnalysis('Session duration', formatTime(totalSessionTime), 'blue', false)}
            {/* </Grid> */}
            {/* <Grid container spacing={1}> */}
            {renderAnalysis('No of Questions', totatQuestionsCount, 'blue', false)}
            {renderAnalysis('Unattempted Questions', unAttemptedQuestions, 'blue', false)}
          </Grid>
        </div>
      </Box>
    </React.Fragment>
  )
}

export default UserSessionReport
