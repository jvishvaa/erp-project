import React, { useState, useEffect } from 'react'
import { Radio, Button, Toolbar, AppBar, Typography, Grid, Modal } from '@material-ui/core'
import { CheckCircleOutline, ErrorOutline } from '@material-ui/icons'
import axios from 'axios'
import { urls } from '../../../../urls'
import './ReportQuestion.css'

const ReportQuestion = (props) => {
  const [options, setOptions] = useState([])
  const [selectedOption, setSelectedOption] = useState('')
  const [selectedOptionId, setSelectedOptionId] = useState('')
  const [showSubmitMessage, setShowSubmitMessage] = useState(false)
  const [open, setOpen] = useState(true)
  const [messageOnSubmit, setMessageOnSubmit] = useState('')
  const [userFeedback, setUserFeedback] = useState('')
  const token = JSON.parse(localStorage.getItem('user_profile')).personal_info.token

  const handleRadioChange = (option) => {
    const { id, report_name: reportName } = option
    setSelectedOption(reportName)
    setSelectedOptionId(id)
  }

  const renderRadioButtons = (option) => {
    return (
      <div className='report__question__option'>
        <Radio
          checked={option.report_name === selectedOption}
          onChange={() => { handleRadioChange(option) }}
          value={option.report_name}
          name='radio-button-demo'
        />
        <Typography variant='subtitle1' className='report__question__value'>{option.report_name}</Typography>
      </div>

    )
  }

  const getReportQuestionByOptions = () => {
    axios.get(urls.ReportQuestionByOptions, {
      headers: {
        Authorization: 'Bearer ' + token
      }
    })
      .then(res => {
        setOptions(res.data)
      })
      .catch(err => {
        console.log(err)
      })
  }

  useEffect(() => {
    getReportQuestionByOptions()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleSubmit = () => {
    const formData = new FormData()
    formData.append('question_id', props.questionId)
    if (selectedOption === 'others' || selectedOption === 'Others') {
      formData.append('new_report_type', userFeedback)
    } else {
      formData.append('report_type_id', selectedOptionId)
    }
    axios.post(urls.ReportQuestion, formData, {
      headers: {
        Authorization: 'Bearer ' + token
      }
    })
      .then(res => {
        setShowSubmitMessage(true)
        setMessageOnSubmit('Successfully reported the question')
      })
      .catch(err => {
        console.log(err)
        setShowSubmitMessage(true)
        setMessageOnSubmit('Failed to report')
      })
  }

  const handleClose = () => {
    setOpen(false)
    props.handleClose()
  }

  const handleChange = (event) => {
    const { value } = event.target
    setUserFeedback(value)
  }

  return (
    <Modal
      open={open}
      onClose={handleClose}
    >
      <div className='report__question__container'>
        <AppBar position='static'>
          <Toolbar>
            <Typography
              variant='h4'
            >
              Report Issue
            </Typography>
          </Toolbar>
        </AppBar>
        <Grid
          container
          style={{ height: 400 }}
        >
          {
            !showSubmitMessage &&
            <Grid
              item
              className='options__container'
            >
              <Typography
                variant='h5'
                align='center'
                style={{ margin: '10px 0' }}
              >
                Tell us the reason for reporting
              </Typography>
              {options.map((option, index) => {
                return renderRadioButtons(option)
              })}
              {
                selectedOption === 'others' || selectedOption === 'Others'
                  ? <textarea
                    className='rendered-input__textarea'
                    // value={''}
                    onChange={handleChange}
                  />
                  : ''
              }
            </Grid>
          }
          {
            showSubmitMessage && <Grid xs={12} item className='submit__message__container'>
              {
                messageOnSubmit.includes('Failed')
                  ? <ErrorOutline style={{ color: 'red', fontSize: 30 }} />
                  : <CheckCircleOutline style={{ color: 'green', fontSize: 30 }} />
              }
              <Typography variant='h4' style={{ marginLeft: 10 }}>{messageOnSubmit}</Typography>
            </Grid>
          }
        </Grid>
        {
          !showSubmitMessage
            ? <Button
              variant='contained'
              color='primary'
              onClick={handleSubmit}
              className='btn__submit__report'
            >Submit
            </Button>
            : ''
        }

      </div>
    </Modal>
  )
}

export default ReportQuestion
