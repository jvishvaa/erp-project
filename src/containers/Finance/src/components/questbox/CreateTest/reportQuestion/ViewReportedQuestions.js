import React, { useState, useEffect } from 'react'
import axios from 'axios'
import './ReportQuestion.css'
import Question from './Question'
import FilterReportedQuestions from './FilterReportedQuestions'
import { urls } from '../../../../urls'
import { Pagination, InternalPageStatus } from '../../../../ui'
import LogSuccessMessage from '../../../../ui/LogMessage/LogSuccess'

const ViewReportedQuestions = () => {
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(0)
  const [areQuestionsLoaded, setQuestionsLoadedStatus] = useState(false)
  const token = JSON.parse(localStorage.getItem('user_profile')).personal_info.token

  const [questions, setQuestions] = useState([])

  const onFilter = (filters) => {
    const { checkedQuestionTypes, checkedQuestionLevels, checkedQuestionCategories, checkedSubjects,
      checkedGrades, checkedChapter } = filters
    setCurrentPage(1)
    getReportedQuestions(
      1,
      checkedSubjects,
      checkedQuestionCategories,
      checkedGrades,
      checkedChapter,
      checkedQuestionTypes,
      checkedQuestionLevels
    )
  }

  const getReportedQuestions = (currentPage = 1, subjects = '', categories = '', grades = '', chapters = '', types = '', levels = '') => {
    let path = `${urls.ReportQuestion}?pagenumber=${currentPage}&subject=${subjects}&grade=${grades}&chapter=${chapters}&type=${types}&category=${categories}&level=${levels}&question_status=Mine&ques_type=MCQ`

    axios.get(path, {
      headers: {
        Authorization: 'Bearer ' + token
      }
    })
      .then(res => {
        const { total_page_count: totalPages, data } = res.data
        setTotalPages(totalPages)
        setQuestions(data)
        setQuestionsLoadedStatus(true)
      })
      .catch(err => {
        console.log(err)
        setQuestionsLoadedStatus(true)
      })
  }

  const handlePagination = (page) => {
    setCurrentPage(page)
    setQuestionsLoadedStatus(false)
  }

  useEffect(() => {
    getReportedQuestions(currentPage)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage])

  // useEffect(() => {
  //   getReportedQuestions()
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [])

  const detachQuestion = (questionId) => {
    const filteredQuestions = questions.filter(question => question.question.id !== questionId)
    setQuestions(filteredQuestions)
  }

  return (
    <React.Fragment>
      <FilterReportedQuestions onFilter={onFilter} />
      {
        !areQuestionsLoaded
          ? <InternalPageStatus label='Loading reported questions' />
          : <div>
            {
              questions.length
                ? <div className='masonary__view__report__question'>{questions.map(question => {
                  return (
                    <span>
                      <Question questionDetails={question} detachQuestion={detachQuestion} />
                    </span>
                  )
                })}</div>
                : <div style={{ marginTop: 80 }}>
                  <LogSuccessMessage title={'No reported issues'} description='All questions were reviewed' />
                </div>
            }
          </div>
      }
      <div style={{ padding: 20, bottom: 20, right: 0, position: 'fixed' }}>
        <Pagination
          rowsPerPageOptions={[10, 10]}
          labelRowsPerPage={'Questions per page'}
          page={currentPage - 1}
          rowsPerPage={10}
          count={(totalPages * 10)}
          onChangePage={(e, i) => {
            handlePagination(i + 1)
          }}

        />
      </div>
    </React.Fragment>
  )
}

export default ViewReportedQuestions
