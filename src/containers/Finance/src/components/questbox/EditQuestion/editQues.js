import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'
import json5 from 'json5'
import Select from 'react-select'
import axios from 'axios'
import CreatableSelect from 'react-select/lib/Creatable'
import { Button } from '@material-ui/core/'
import { Grid } from 'semantic-ui-react'
// import { Paper } from '@material-ui/core'
// import Typography from '@material-ui/core/Typography'
import TinyMce from '../TinyMCE/tinyMce'
import AuthService from '../../AuthService'
import { urls, qBUrls } from '../../../urls'
import '../../css/staff.css'

class EditQues extends Component {
  constructor (props) {
    super(props)
    var auth = new AuthService()
    this.auth_token = auth.getToken()

    this.state = {
      subjectsArr: [],
      gradesArr: [],
      chaptersArr: [],
      chapterTopicsArr: [],
      questionTypeArr: [],
      questionLevelArr: [],
      questionCategoryArr: [],
      topic: [],
      selectedTopic: [],

      optionsArray: [
        { option: 'option1', value: null, isCorrectAnser: false },
        { option: 'option2', value: null, isCorrectAnser: false },
        { option: 'option3', value: null, isCorrectAnser: false },
        { option: 'option4', value: null, isCorrectAnser: false }
      ],
      loading: false

      // questionType: null,
      // subject: null,
      // grade: null,
      // chapter: null,
      // questionlevel: null,
      // questiocategory: null,

      // correctAns: null,
      // question: null,

      // loading: false,
    }
    this.handleTopics = this.handleTopics.bind(this)
    this.handleClickSubject = this.handleClickSubject.bind(this)
    this.handleClickGrade = this.handleClickGrade.bind(this)
    this.handleClickChapter = this.handleClickChapter.bind(this)
    this.handleClickChapterTopics = this.handleClickChapterTopics.bind(this)
  }
  /// ////////////////////////////////////////////////
  componentDidMount () {
    // for testing four kinds of ques..ids are 10806 to 10809
    // var url = window.location.href;
    // var spl = url.split("?");
    // var qid = spl[1];
    var qid = this.props.match.params.id
    axios
      .get(qBUrls.EditQuestion + qid + '/', {
        headers: {
          Authorization: 'Bearer ' + this.auth_token
        }
      })
      .then(res => {
        let resObj = res.data
        console.log(resObj, 'res')

        var {
          subject,
          grade,
          chapter,
          chapter_topic: chapterTopic,
          newTopic,
          questionlevel,
          questioncategory,
          question_type: questionType,
          question,
          correct_ans: correctAns,
          option,
          tag,
          ...rest
        } = resObj

        if (questionType === 1) {
          // correctAns = JSON.parse(correctAns);
          // option = JSON.parse(option);
          // correctAns = json5.parse(correctAns)
          option = json5.parse(option)
        }
        if (questionType === 4 || questionType === 5) {
          // correctAns = JSON.parse(correctAns);
          try {
            correctAns = json5.parse(correctAns)
          } catch (e) {
            correctAns = `${correctAns}`
          }
        }

        if (questionType === null) {
          this.props.alert.error(
            `Question no question type value, Hence can not edit the selected Question`
          )

          this.props.history.goBack()
          return
        }
        this.setState(
          {
            subject,
            grade,
            chapter,
            chapterTopic,
            newTopic,
            questionlevel: Number(questionlevel),
            questionType: Number(questionType),
            questioncategory: Number(questioncategory),
            question,
            correctAns,
            option,
            tag,
            ...rest
          },
          () => {
            if (!subject || !grade || !chapter) {
              return
            }
            this.getGrades()
            this.getChapters()
            // this.handleClickChapter()
            this.getChapterTopics()
          }
        )
      })
      .catch(error => {
        console.log(error)
      })

    axios
      .get(urls.SUBJECT, {
        headers: {
          Authorization: 'Bearer ' + this.auth_token
        }
      })
      .then(res => {
        if (Array.isArray(res.data)) {
          let subjectsArr = []
          for (let i = 0; i < res.data.length; i++) {
            subjectsArr[i] = {
              ...res.data[i],
              label: res.data[i].subject_name
            }
          }
          this.setState({ subjectsArr })
        }
        if (typeof res.data === 'string') {
          this.props.alert.warning(res.data)
        }
      })
      .catch(error => {
        console.log(error)
      })

    axios
      .get(qBUrls.QuestionCategory, {
        headers: {
          Authorization: 'Bearer ' + this.auth_token
        }
      })
      .then(res => {
        if (Array.isArray(res.data)) {
          let qCat = []
          for (let i = 0; i < res.data.length; i++) {
            qCat[i] = { ...res.data[i], label: res.data[i].category_name }
          }
          this.setState({ questionCategoryArr: qCat })
        }
        if (typeof res.data === 'string') {
        }
      })
      .catch(error => {
        console.log(error)
      })

    axios
      .get(qBUrls.QuestionLevel, {
        headers: {
          Authorization: 'Bearer ' + this.auth_token
        }
      })
      .then(res => {
        if (Array.isArray(res.data)) {
          let qLvl = []
          for (let i = 0; i < res.data.length; i++) {
            qLvl[i] = { ...res.data[i], label: res.data[i].question_level }
          }
          this.setState({ questionLevelArr: qLvl })
        }
        if (typeof res.data === 'string') {
        }
      })
      .catch(error => {
        console.log(error)
      })

    axios
      .get(qBUrls.QuestionType, {
        headers: {
          Authorization: 'Bearer ' + this.auth_token
        }
      })
      .then(res => {
        if (Array.isArray(res.data)) {
          let qTyp = []
          for (let i = 0; i < res.data.length; i++) {
            qTyp[i] = { ...res.data[i], label: res.data[i].question_type }
          }
          this.setState({ questionTypeArr: qTyp })
        }
        if (typeof res.data === 'string') {
          console.log(res.data)
        }
      })
      .catch(error => {
        console.log(error)
      })
  }
  getGrades = () => {
    let { subject } = this.state
    axios
      .get(qBUrls.Grades + '?s_id=' + subject, {
        headers: {
          Authorization: 'Bearer ' + this.auth_token
        }
      })
      .then(res => {
        if (Array.isArray(res.data)) {
          let grades = []
          for (let i = 0; i < res.data.length; i++) {
            grades[i] = { ...res.data[i], label: res.data[i].grade }
          }
          this.setState({ gradesArr: grades })
        }
        if (typeof res.data === 'string') {
          this.props.alert.warning(res.data)
        }
      })
      .catch(error => {
        console.log(error)
      })
  };
  /// ///////////////////////////////////////////////

  getChapters = () => {
    let { subject, grade } = this.state
    axios
      .get(qBUrls.Grades + '?s_id=' + subject + '&g_id=' + grade, {
        headers: {
          Authorization: 'Bearer ' + this.auth_token
        }
      })
      .then(res => {
        if (Array.isArray(res.data)) {
          let chapters = []
          for (let i = 0; i < res.data.length; i++) {
            chapters[i] = { ...res.data[i], label: res.data[i].chapter_name }
          }
          this.setState({ chaptersArr: chapters })
        }
        if (typeof res.data === 'string') {
          this.props.alert.warning(res.data)
        }
      })
      .catch(error => {
        console.log(error)
      })
  };
  handleTopics (topic, action) {
    let chapterTopic = ''
    let newTopic = ''

    if (topic.__isNew__) {
      delete topic.__isNew__
      newTopic = topic
      // eslint-disable-next-line no-debugger
      // debugger
      this.setState({ newTopic: newTopic.value, chapterTopic: newTopic.value })
    } else {
      chapterTopic = topic
      this.setState({ chapterTopic: chapterTopic.id, chapter_topic: chapterTopic.id })
    }
    // this.setState({ chapterTopic: topic.id, chapter_topic: topic.id })
  };
  getChapterTopics=() => {
    let{ chapter } = this.state
    console.log(chapter, 'chapter check')

    axios
      .get(urls.ChapterTopic + '?chapter_id=' + chapter, {
        headers: {
          Authorization: 'Bearer ' + this.auth_token
        }
      })
      .then(res => {
        // eslint-disable-next-line no-debugger
        // debugger
        if (Array.isArray(res.data)) {
          let chapterTopics = []
          for (let i = 0; i < res.data.length; i++) {
            chapterTopics[i] = { ...res.data[i], label: res.data[i].name }
          }
          this.setState({ chapterTopicsArr: chapterTopics })
        }
        if (typeof res.data === 'string') {
          this.props.alert.warning(res.data)
        }
      })
      .catch(error => {
        console.log(error)
      })
  }
  /// ////////////////////////////////////////////////
  handleClickSubject (event) {
    this.setState({ subject: event.id, chapter: null, grade: null, chapterTopicsArr: [], gradesArr: [], chaptersArr: [] }, () => {
      this.getGrades()
    })
  }
  /// ////////////////////////////////////////////////
  handleClickGrade (event) {
    this.setState({ grade: event.id, chapter: null, chapterTopic: null, chapterTopicsArr: [], chaptersArr: [] }, () => {
      this.getChapters()
    })
  }
  handleClickChapter (event) {
    this.setState({ chapter: event.id, chapterTopic: null, chapterTopicsArr: [] }, () => {
      this.getChapterTopics()
    })
  }
  handleClickChapterTopics (event) {
    this.setState({ chapterTopic: event.id, chapter_topic: event.id })
  }
  /// ////////////////////////////////////////////////
  inputFroms = () => {
    return (
      // let
      <React.Fragment>
        <Grid.Row>
          <Grid.Column>
            <label>Select Subject</label>
            <Select
              value={
                this.state.subject
                  ? this.state.subjectsArr.filter(
                    sub => sub.id === this.state.subject
                  )
                  : []
              }
              options={
                this.state.subjectsArr.length ? this.state.subjectsArr : []
              }
              onChange={this.handleClickSubject}
            />

            <label>Select Grade</label>
            <Select
              value={
                this.state.grade
                  ? this.state.gradesArr.filter(
                    grd => grd.id === this.state.grade
                  )
                  : []
              }
              options={this.state.subject ? this.state.gradesArr : []}
              onChange={this.handleClickGrade}
            />
            <label>Select Chapter</label>
            <Select
              value={
                this.state.chapter
                  ? this.state.chaptersArr.filter(
                    chp => chp.id === this.state.chapter
                  )
                  : []
              }
              options={this.state.grade ? this.state.chaptersArr : []}
              onChange={this.handleClickChapter}
            />
            <label>Select Chapter Topic</label>
            <CreatableSelect
              onChange={(e, a) => {
                this.handleTopics(e, a)
              }}
              value={this.state.newTopic ? this.state.newTopic.value
                : this.state.chapterTopic ? this.state.chapterTopicsArr.filter(chap =>
                  // eslint-disable-next-line no-debugger
                  // debugger
                  chap.id === this.state.chapterTopic
                )
                  : []
              }
              options={this.state.chapter ? this.state.chapterTopicsArr : this.state.newTopic}
            />
            {/* <Select
              value={
                this.state.chapterTopic
                  ? this.state.chapterTopicsArr.filter(chap =>
                    // eslint-disable-next-line no-debugger
                    // debugger
                    chap.id === this.state.chapterTopic
                  )
                  : []
              }
              options={this.state.chapter ? this.state.chapterTopicsArr : []}
              defaultValue={this.state.chapterTopicValue}
              onChange={this.handleClickChapterTopics}
            /> */}
          </Grid.Column>

          <Grid.Column>
            <label>Question Level</label>
            <Select
              value={
                this.state.questionlevel
                  ? this.state.questionLevelArr.filter(
                    qLvl => qLvl.id === this.state.questionlevel
                  )
                  : []
              }
              options={
                this.state.questionLevelArr.length
                  ? this.state.questionLevelArr
                  : []
              }
              onChange={e => {
                this.setState({ questionlevel: e.id })
              }}
            />
            <label>Question Category</label>
            <Select
              value={
                this.state.questioncategory
                  ? this.state.questionCategoryArr.filter(
                    qCat => qCat.id === this.state.questioncategory
                  )
                  : []
              }
              options={
                this.state.questionCategoryArr.length
                  ? this.state.questionCategoryArr
                  : []
              }
              onChange={e => {
                this.setState({ questioncategory: e.id })
              }}
            />
          </Grid.Column>
        </Grid.Row>
      </React.Fragment>
    )
  };

  /// //////////////////////////////////////////////////

  handleTinyMCEdit = (content, id) => {
    this.setState({ [id]: content })
  };

  handleOptionsContent = (content, id) => {
    let { option, correctAns } = this.state
    option = { ...option, [id]: content }
    if (correctAns[id] || correctAns[id] === '') {
      // if edited option has ticked as corrct answer..hence modifying corrct answer also
      this.setState({ option, correctAns: { [id]: content } })
    } else {
      this.setState({ option })
    }
  };

  handleCorrectOption = optionNO => {
    let { option } = this.state
    let optionContent = option[optionNO]
    this.setState({ correctAns: { [optionNO]: optionContent } })
  };

  renderQuestion = () => {
    var { question } = this.state

    if (question !== undefined) {
      return (
        <TinyMce
          id={'question'}
          get={this.handleTinyMCEdit}
          content={question}
        />
      )
    }
  };

  handleSave = () => {
    let payLoad = { ...this.state }
    delete payLoad.subjectsArr
    delete payLoad.gradesArr
    delete payLoad.chaptersArr
    delete payLoad.chapterTopicsArr
    delete payLoad.questionCategoryArr
    delete payLoad.questionLevelArr
    delete payLoad.questionTypeArr
    delete payLoad.optionsArray
    delete payLoad.loading
    let {
      questionType,
      questionlevel,
      questioncategory,

      subject,
      grade,
      chapter,
      chapterTopic,
      newTopic,
      question,
      option,
      correctAns
    } = payLoad
    let validationArray = [
      questionType,
      questionlevel,
      questioncategory,
      subject,
      grade,
      chapter,
      chapterTopic || newTopic,
      correctAns
    ]
    for (var item of validationArray) {
      if (!item) {
        this.props.alert.warning('Please choose all fields')
        return null
      }
    }
    if (!question) {
      this.props.alert.warning('Question must not be empty')
      return null
    }
    if (questionType === 1) {
      for (let i = 1; i < 5; i++) {
        if (!option['option' + i]) {
          this.props.alert.warning('option ' + i + ' can not be left empty')
          return null
        }
      }
    } else {
      if (!correctAns) {
        this.props.alert.warning('Please enter answer')
        return null
      }
    }
    payLoad.correct_ans = JSON.stringify(payLoad.correctAns)
    payLoad.option = JSON.stringify(payLoad.option)
    this.setState({ loading: true })
    axios
      .put(qBUrls.EditQuestion + payLoad.id + '/', JSON.stringify(payLoad), {
        headers: {
          Authorization: 'Bearer ' + this.auth_token,
          'Content-Type': 'application/json'
        }
      })
      .then(res => {
        if (res.status === 200) {
          this.props.alert.success('Question updated')
        }
        this.setState({ loading: false })
        // api issue 1 = updateddate not getting updated,
        // need status status text as question updated
      })
      .catch(error => {
        this.props.alert.error('Something went wrong')
        console.log(error.response)
        this.setState({ loading: false })
      })
  };

  renderAnswer = () => {
    var { correctAns, option, questionType } = this.state
    if (correctAns && option && questionType) {
      if (questionType === 1) {
        return (
          <div>
            <h3>Options :</h3>
            {this.state.optionsArray.map((option, index) => {
              return (
                <div key={option.option}>
                  <h5>{option.option}</h5>
                  <Grid stackable columns={'equal'}>
                    <Grid.Column>
                      <TinyMce
                        id={option.option}
                        content={this.state.option[`option${index + 1}`]}
                        get={this.handleOptionsContent}
                      />
                    </Grid.Column>
                    <Grid.Column>
                      <label>Is Correct Answer</label>
                      <input
                        type='checkbox'
                        disabled={!this.state.option[`option${index + 1}`]}
                        checked={
                          this.state.correctAns[`option${index + 1}`] ===
                          this.state.option[`option${index + 1}`]
                        }
                        onClick={() => {
                          this.handleCorrectOption(`option${index + 1}`)
                        }}
                      />
                    </Grid.Column>
                  </Grid>
                </div>
              )
            })}
          </div>
        )
      }
      if (questionType === 3) {
        return (
          <div>
            <h5>Answer</h5>
            <div style={{ width: '40%' }}>
              <Select
                value={
                  this.state.correctAns
                    ? { value: true, label: 'True' }
                    : { value: false, label: 'False' }
                }
                options={[
                  { value: true, label: 'True' },
                  { value: false, label: 'False' }
                ]}
                onChange={e => {
                  this.setState({ correctAns: e.value })
                }}
              />
            </div>
          </div>
        )
      }
      if (questionType === 4 || questionType === 5) {
        return (
          <div>
            <h5>Answer</h5>
            <div style={{ width: '70%' }}>
              <TinyMce
                id={'correctAns'}
                get={this.handleTinyMCEdit}
                content={this.state.correctAns}
              />
            </div>
          </div>
        )
      }
    }
  };

  render () {
    return (
      <React.Fragment>
        {/* <div
          style={{
            width: '100%',
            height: 150,
            backgroundColor: '#720D5D ',
            padding: 50,
            color: '#ffffff'
          }}
        >
          <Typography variant='h4' style={{ color: '#fff' }}>
            Edit Question
          </Typography>
        </div> */}

        {/* <div className='student-section'> */}
        {/* <Paper
            style={{ position: 'relative', top: '-30px', marginRight: 30 }}
          > */}
        <div style={{ padding: '2%' }}>
          <Grid stackable columns='equal'>
            {this.inputFroms()}
          </Grid>

          <h5>Question</h5>
          {this.renderQuestion()}
          {this.renderAnswer()}
          <Grid>
            <Grid.Column
              computer={16}
              mobile={16}
              tablet={16}
              className='student-section-addstaff-button'
            >
              <Button
                primary
                onClick={this.props.history.goBack}
                type='button'
              >
                    Return
              </Button>

              <Button
                loading={this.state.loading}
                color='green'
                onClick={this.handleSave}
              >
                    Save Changes
              </Button>
            </Grid.Column>
          </Grid>
        </div>
        {/* </Paper>
        </div> */}
      </React.Fragment>
    )
  }
}
export default withRouter(EditQues)
