import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { urls } from '../../urls'
import UserSessionReport from '../../ui/UserSessionAnalytics/UserSessionReport'

const PracticeQuestionAccuracyReport = (props) => {
  const token = JSON.parse(localStorage.getItem('user_profile')).personal_info.token
  const [accuracyReport, setAccuracyReport] = useState({
    'answers_correct_count': undefined,
    'answers_skipped_count': undefined,
    'answers_incorrect_count': undefined,
    'total_time': undefined,
    'total_session_time': undefined,
    'average_question_time': undefined,
    'accuracy': 0.0,
    'total_question_count': undefined
  })
  const [showLoader, setShowLoader] = useState(true)

  const getAccuracyReport = () => {
    let path = `${urls.PracticeQuestionsAccuracyReport}?chapter=${props.chapterId}`
    axios.get(path, {
      headers: {
        Authorization: 'Bearer ' + token
      }
    })
      .then(res => {
        setAccuracyReport(res.data)
        setShowLoader(false)
      })
      .catch(err => {
        console.log(err)
        // window.alert('Something went wrong')
        // setAccuracyReport()
      })
  }

  useEffect(() => {
    getAccuracyReport()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <UserSessionReport accuracyReport={{ ...accuracyReport }} showLoader={showLoader} />
  )
}

export default PracticeQuestionAccuracyReport
