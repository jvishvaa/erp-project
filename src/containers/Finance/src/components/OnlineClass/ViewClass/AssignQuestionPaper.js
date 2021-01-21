import React, { useState, useEffect, useCallback, useMemo } from 'react'
import {
  Grid,
  // TextField,
  // IconButton,
  // Tooltip,
  // Divider,
  makeStyles,
  Typography,
  Button
} from '@material-ui/core'
// import {
//   HighlightOffOutlined as CloseIcon,
//   EditOutlined as EditIcon,
//   OpenInBrowserOutlined as OpenIcon
// } from '@material-ui/icons'
import axios from 'axios'
import { useSelector } from 'react-redux'
import { urls, qBUrls } from '../../../urls'
import { AutoSuggest } from '../../../ui'
import { debounce } from '../../../utils'
import styles from './quizModal.styles'

// const results = [
//   { id: 1, value: 'English' },
//   { id: 2, value: 'England' },
//   { id: 3, value: 'Enforce' },
//   { id: 4, value: 'Employee' },
//   { id: 5, value: 'Employment' },
//   { id: 6, value: 'Energy' },
//   { id: 7, value: 'Engage' }
// ]

const useStyles = makeStyles(styles)

const AssignQuestionPaper = ({
  id,
  alert,
  onClose,
  handleAssignQuestionPaper
}) => {
  const [quizData, setQuizData] = useState([])
  // const [existingLink, setExistingLink] = useState(null)
  const [search, setSearch] = useState('')
  const [searchResult, setSearchResult] = useState([])
  const [isSelected, setIsSelected] = useState(false)
  const [isPending, setIsPending] = useState(false)
  // eslint-disable-next-line no-unused-vars
  const [questionTypes, setQuestionTypes] = useState([])
  const user = useSelector(state => state.authentication.user)
  const classes = useStyles()

  useEffect(() => {
    async function fetchQuizType () {
      const configOptions = {
        headers: {
          'Authorization': `Bearer ${user}`
        }
      }
      try {
        const result = await axios.get(`${qBUrls.QuestionType}`, configOptions)
        setQuestionTypes(result.data)
      } catch (err) {
        setQuestionTypes([])
      }
    }
    fetchQuizType()
  }, [user])

  useEffect(() => {
    async function fetchQuizPaper () {
      const configOptions = {
        headers: {
          'Authorization': `Bearer ${user}`
        }
      }
      try {
        const result = await axios.get(`${urls.OnlineQuizPaper}?online_class_id=${id}`,
          configOptions)
        setSearch(result.data.quiz_question_paper.id)
        setSearchResult([result.data.quiz_question_paper])
        setIsSelected(true)
      } catch (err) {
        setSearch('')
        setSearchResult([])
        setIsSelected(false)
      }
    }
    fetchQuizPaper()
  }, [id, user])

  const quizSearchApiHandler = useMemo(() => debounce((searchStr) => {
    setIsPending(true)
    axios.get(`${urls.OnlineQuizSearch}?search=${searchStr}`, {
      headers: {
        'Authorization': `Bearer ${user}`
      }
    }).then(res => {
      setSearchResult(res.data)
      setIsPending(false)
    }).catch(() => setIsPending(false))
  }, 500), [user])

  const quizSuggestionHandler = useCallback(async () => {
    if (search && !isSelected) {
      quizSearchApiHandler(search)
    } else if (search && isSelected) {
      const configOptions = {
        headers: {
          'Authorization': `Bearer ${user}`
        }
      }

      try {
        const result = await axios.get(`${urls.OnlineQuizQuestionsList}?question_paper_id=${search}`,
          configOptions)
        setQuizData(result.data)
      } catch (err) {
        setQuizData([])
      }
    }
  }, [search, isSelected, quizSearchApiHandler, user])

  useEffect(() => {
    quizSuggestionHandler()
  }, [quizSuggestionHandler])

  const searchChangeHandler = (e, selected) => {
    setSearch(e.target.value)
    setIsSelected(selected)
  }

  const getQuestionType = (typeId) => {
    const data = questionTypes.find(item => +item.id === +typeId)
    return data && data.question_type
  }

  const assignQuizHandler = async () => {
    if (!isSelected) {
      alert.warning('Select Some Paper')
      return
    }
    const reqMetaData = {
      headers: {
        Authorization: 'Bearer ' + user
      }
    }
    const body = {
      'online_class_id': id,
      'question_paper_id': search

    }
    try {
      await axios.post(`${urls.OnlineQuizPaper}`, body, reqMetaData)
      alert.success('Saved Successfully')
      handleAssignQuestionPaper()
      onClose()
    } catch (err) {
      alert.warning('Something Went Wrong')
    }
  }

  const questionCard = (data, index) => {
    let options = JSON.parse(data.option)
    if (typeof options === 'string') {
      try {
        options = JSON.parse(options)
      } catch (err) {
        options = {}
      }
    }

    let answer
    if (data.correct_ans.startsWith('{')) {
      let answerObj = JSON.parse(data.correct_ans)
      answer = Object.keys(answerObj).map((key, i) => {
        return (
          <div key={`${key}-${i}`} className={classes.quizAnswer}>
            <span>{key} (</span>
            <div
              dangerouslySetInnerHTML={{ __html: answerObj[key] }}
              className={classes.quizMcqAnswer}
            />
            <span>)</span>
          </div>
        )
      })
    } else if (data.correct_ans.startsWith('"')) {
      answer = data.correct_ans.substring(1, data.correct_ans.length - 1)
    } else {
      answer = data.correct_ans
    }

    const filteredOptions = Object.entries(options).filter(([key, value]) => value !== null)
    return (
      <div className={classes.cardContainer}>
        <Grid container>
          <Grid item xs={1}>{index + 1}</Grid>
          <Grid item xs={11}>
            <div
              dangerouslySetInnerHTML={{ __html: data.question }}
              className={classes.containerQuestion}
            />
          </Grid>
        </Grid>
        <Grid container spacing={2}>
          {filteredOptions.map(([key, value], i) => {
            return (
              <Grid
                item
                xs={6}
                md={3}
                key={`${key}-${i}`}
                className={classes.questionOptions}
              >
                <span>{i + 1}.</span>
                <div
                  dangerouslySetInnerHTML={{ __html: value }}
                  className={classes.quizAnswer}
                />
              </Grid>
            )
          })}
        </Grid>
        <Grid
          style={{
            marginTop: '20px'
          }}
          container
          justify='space-between'
          spacing={2}
        >
          <Grid item xs={12} md={4}>
            <span>Answer: </span>
            {
              typeof answer === 'object' ? answer : (
                <div
                  dangerouslySetInnerHTML={{ __html: answer }}
                  className={classes.quizAnswer}
                />
              )
            }
          </Grid>
          <Grid item xs={12} md={4}>
            <span>Question Type:</span>
            <div className={classes.quizAnswer}>
              {getQuestionType(data.question_type)}
            </div>
          </Grid>
        </Grid>
      </div>
    )
  }

  return (
    <div style={{ padding: '12px' }}>
      <Typography variant='h4' style={{ textAlign: 'center' }}>
        Quiz Link
      </Typography>
      <Grid container spacing={2} alignItems='center' style={{ marginTop: '15px' }}>
        <Grid item xs={10}>
          <AutoSuggest
            showAllListItems
            label='Search Paper'
            value={search || ''}
            onChange={searchChangeHandler}
            popperZIndex={1700}
            data={searchResult &&
                searchResult.length > 0 &&
                searchResult.map(item => ({
                  label: item.question_paper_name,
                  value: +item.id
                }))
            }
            isPending={isPending}
          />
        </Grid>
      </Grid>
      <div>
        {quizData && quizData.map((item, index) => {
          return (
            <div key={item.id}>
              {
                item.create_question_fk &&
                questionCard(item.create_question_fk, index)
              }
            </div>
          )
        })}
      </div>
      <Button
        color='primary'
        variant='contained'
        onClick={assignQuizHandler}
        size='large'
        style={{ marginTop: '15px' }}
      >
        Assign
      </Button>
    </div>
  )
}
export default React.memo(AssignQuestionPaper)
