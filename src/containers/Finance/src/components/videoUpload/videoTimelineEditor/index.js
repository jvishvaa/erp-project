import React, { useEffect, useRef, useState } from 'react'
import axios from 'axios'

import { Button } from '@material-ui/core'

import { CheckCircle, Edit } from '@material-ui/icons'

import { AttemptEvents } from './attemptEvents'
import { QuestionPaper } from './questionPaper'

import EventEditor from './components/questionEditor'

export default function TimelineEditor ({ file, questionPaperId, onChange, alert }) {
  const questionPaperInstance = useRef()
  const eventsInstance = useRef()
  const [questions, setQuestions] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [updated, setUpdated] = useState(false)
  const [open, setOpen] = useState(false)
  useEffect(() => {
    setIsLoading(true)
    axios.get(`http://localhost:8000/qbox/academic/questbox/viewquestionpaper/${questionPaperId}`, {
      headers: {
        Authorization: 'Bearer ' + localStorage.getItem('id_token'),
        'Content-Type': 'multipart/formData'
      }
    })
      .then(res => {
        setIsLoading(false)
        let questionPaperId = res.data.question_paper_details[0]
        let questions = res.data.question_detail
        questionPaperInstance.current = new QuestionPaper(questionPaperId, questions)
        eventsInstance.current = new AttemptEvents(questionPaperInstance.current, [])
        const questionInstances = questionPaperInstance.current.getQuestions()
        setQuestions(questionInstances)
      }).catch(e => alert.error('Something went wrong.'))
  }, [alert, questionPaperId])
  function updateQuestions (questions) {
    console.log(questions, 'Updated questions')
    setQuestions([...questions])
    setUpdated(true)
    let data = {}
    questions.forEach(question => {
      data[question.id] = question.timestamp
    })
    onChange(data)
    setOpen(false)
  }
  return (
    <>{!isLoading ? <>{
      <Button onClick={() => setOpen(true)}>{updated ? <><CheckCircle />QUESTIONS ASSIGNED ( CLICK TO EDIT <Edit /> )</> : 'ASSIGN QUESTIONS TO TIMELINE'}</Button>
    }
      {open && <EventEditor cancel={() => setOpen(false)} setQuestions={updateQuestions} file={file} questions={questions} alert={alert} events={[]} />}
    </>
      : 'Loading...' }</>
  )
}
