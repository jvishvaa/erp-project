import React, { useState, useEffect } from 'react'
import { CardContent, Typography, CardActions, Button, ExpansionPanel, ExpansionPanelSummary, ExpansionPanelDetails, Box, Checkbox, FormControlLabel } from '@material-ui/core'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
import ReactHtmlParser from 'react-html-parser'
import { withRouter } from 'react-router-dom'
import axios from 'axios'
import { urls } from '../../../../urls'

function Question ({ questionDetails, history, detachQuestion }) {
  const [question, setQuestion] = useState({ question: '', id: '' })
  const [reports, setReports] = useState([])
  const [isExpanded, setExpansion] = useState(false)
  const token = JSON.parse(localStorage.getItem('user_profile')).personal_info.token

  useEffect(() => {
    const { question = { question: '', id: '' }, reports = [] } = questionDetails
    setQuestion(question)
    setReports(reports)
  }, [questionDetails])

  const parseHtml = (question) => {
    return (
      <React.Fragment>
        <Typography gutterBottom component='p'>
                  Question :
        </Typography>
        {ReactHtmlParser(question)}
      </React.Fragment>
    )
  }

  const handleChange = (event, reportDetails, reportIndex) => {
    const { id, question: questionId, report_type_id: reportTypeId } = reportDetails
    const formData = new FormData()
    formData.append('id', id)
    formData.append('invalid', event.target.checked ? 'True' : 'False')
    formData.append('question_id', questionId)
    formData.append('is_reviewed', event.target.checked ? 'True' : 'False')
    formData.append('report_type_id', reportTypeId)
    // formData.append('reviewed_by', reviewedById)
    axios.put(urls.ReportQuestion, formData, {
      headers: {
        Authorization: 'Bearer ' + token
      }
    })
      .then(res => {
        const filteredReport = reports.filter(report => report.id !== reportDetails.id)
        setReports(filteredReport)
      })
      .catch(err => {
        console.log(err)
      })
  }

  useEffect(() => {
    if (!reports.length) {
      detachQuestion(question.id)
    }
  }, [detachQuestion, question.id, reports.length])

  const renderReports = (report, index) => {
    return (
      <li>
        <div boxShadow={2} style={{ padding: 5, marginTop: 5 }}>
          <Typography variant='h6'>{report.report_type_name}</Typography>
          <FormControlLabel
            control={
              <Checkbox
                checked={report.invalid}
                onChange={(e) => { handleChange(e, report, index) }}
                value='invalid'
                color='primary'
              />
            }
            label='Invalid Reason'
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={report.is_reviewed}
                onChange={(e) => { handleChange(e, report, index) }}
                value='reviewed'
                color='primary'
              />
            }
            label='Question reviewed'
          />
        </div>
      </li>
    )
  }

  const renderExpander = (reports = []) => {
    return (
      <ExpansionPanel className='remove__shadow'
        onChange={() => { setExpansion(!isExpanded) }}
        expanded={isExpanded}>
        <ExpansionPanelSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls='panel1a-content'
          id='panel1a-header'
          onChange={() => { setExpansion(!isExpanded) }}
          expanded={isExpanded}
        >
          <Typography>{reports.length ? reports[0].report_type_name : ''}</Typography>
        </ExpansionPanelSummary>
        <ExpansionPanelDetails onChange={() => { setExpansion(!isExpanded) }}
          expanded={isExpanded}>
          <ul style={{ padding: 0 }}>
            {reports.map((report, index) => {
              return renderReports(report, index)
            })}
          </ul>
        </ExpansionPanelDetails>
      </ExpansionPanel>
    )
  }

  const handleEditQuestion = (questionId) => {
    history.push(`/questbox/editquestion/${questionId}/type/normal`)
  }

  return (
    <Box boxShadow={4} className='masonary__view__report__question__item'>
      <CardContent>
        <Typography variant='h6' component='p'>
          { parseHtml(question.question) }
        </Typography>
      </CardContent>
      {renderExpander(reports)}
      <CardActions />
      <div style={{ padding: 10 }}>
        <Button
          size='small'
          color='primary'
          onClick={() => { handleEditQuestion(question.id) }}
          variant='contained'
        >
            Edit
        </Button>
      </div>
    </Box>
  )
}

export default withRouter(Question)
