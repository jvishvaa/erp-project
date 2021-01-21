import React, { Component } from 'react'
import Select from 'react-select'
import axios from 'axios'
import CreatableSelect from 'react-select/lib/Creatable'
import { Grid } from 'semantic-ui-react'
import { Paper, Button } from '@material-ui/core'
import Typography from '@material-ui/core/Typography'
import { withRouter } from 'react-router-dom'
import json5 from 'json5'
import { urls, qBUrls } from '../../../urls'
import '../../css/staff.css'
import TinyMce from '../TinyMCE/tinyMce'
import AuthService from '../../AuthService'

// import update from 'immutability-helper';
class EditCompQues extends Component {
  constructor (props) {
    super(props)
    var auth = new AuthService()
    this.auth_token = auth.getToken()
    this.state = {
      loading: false,
      subjectsArr: [],
      gradesArr: [],
      chaptersArr: [],
      chapterTopicsArr: [],
      questionTypeArr: [],
      questionLevelArr: [],
      questionCategoryArr: [],
      newTopic: [],

      optionsArray: [
        { option: 'option1', value: null, isCorrectAnser: false },
        { option: 'option2', value: null, isCorrectAnser: false },
        { option: 'option3', value: null, isCorrectAnser: false },
        { option: 'option4', value: null, isCorrectAnser: false }
      ]
    }
    this.handleTopics = this.handleTopics.bind(this)
    this.handleClickSubject = this.handleClickSubject.bind(this)
    this.handleClickGrade = this.handleClickGrade.bind(this)
    this.handleClickChapter = this.handleClickChapter.bind(this)
    this.handleClickChapterTopics = this.handleClickChapterTopics.bind(this)
  }
  componentDidMount () {
    // debugger
    var qid = this.props.match.params.id
    axios
      .get(qBUrls.EditQuestion + qid + '/?ques_type=comp', {
        headers: {
          Authorization: 'Bearer ' + this.auth_token
        }
      })
      .then(res => {
        // debugger
        let resObj = res.data
        var {
          subject,
          grade,
          chapter,
          // chapterTopic,
          questionlevel,
          questioncategory,
          chapter_topic: chapTopic,
          newTopic
        } = resObj.question_data[0]

        for (let i = 0; i < resObj.question_data.length; i++) {
          let { correct_ans: correctAns, option } = resObj.question_data[i]
          delete resObj.question_data[i]['correct_ans']
          resObj.question_data[i]['correctAns'] = json5.parse(correctAns)
          resObj.question_data[i]['option'] = json5.parse(option)
        }
        this.setState(
          {
            ...resObj,
            subject,
            grade,
            chapter,
            // chapterTopic,
            questionlevel,
            questioncategory,
            chapterTopic: chapTopic,
            newTopic
          },
          () => {
            if (!subject || !grade || !chapter) {
              console.log('Question has no subject || grade || chapter data')
              return
            }
            this.getGrades()
            this.getChapters()
            this.getChapterTopics()
          }
        )
      })
      .catch(error => {
        console.log(error)
      })
    //
    axios
      .get(urls.SUBJECT, {
        headers: {
          Authorization: 'Bearer ' + this.auth_token
        }
      })
      .then(res => {
        console.log('Subject: ', res.data)
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
        console.log("Error: Couldn't fetch data from " + urls.SUBJEC)
      })

    axios
      .get(qBUrls.QuestionCategory, {
        headers: {
          Authorization: 'Bearer ' + this.auth_token
        }
      })
      .then(res => {
        console.log('Qustn Category: ', res.data)
        if (Array.isArray(res.data)) {
          let qCat = []
          for (let i = 0; i < res.data.length; i++) {
            qCat[i] = { ...res.data[i], label: res.data[i].category_name }
          }
          this.setState({ questionCategoryArr: qCat })
        }
        if (typeof res.data === 'string') {
          console.log(res.data)
        }
      })
      .catch(error => {
        console.log(error)
        console.log(
          "Error: Couldn't fetch data from " + qBUrls.QuestionCategory
        )
      })

    axios
      .get(qBUrls.QuestionLevel, {
        headers: {
          Authorization: 'Bearer ' + this.auth_token
        }
      })
      .then(res => {
        console.log('Qustn level: ', res.data)
        if (Array.isArray(res.data)) {
          let qLvl = []
          for (let i = 0; i < res.data.length; i++) {
            qLvl[i] = { ...res.data[i], label: res.data[i].question_level }
          }
          this.setState({ questionLevelArr: qLvl })
        }
        if (typeof res.data === 'string') {
          console.log(res.data)
        }
      })
      .catch(error => {
        console.log(error)
        console.log("Error: Couldn't fetch data from " + qBUrls.QuestionLevel)
      })

    axios
      .get(qBUrls.QuestionType, {
        headers: {
          Authorization: 'Bearer ' + this.auth_token
        }
      })
      .then(res => {
        console.log('Qustn level: ', res.data)
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
        console.log("Error: Couldn't fetch data from " + urls.SUBJECT)
      })
  }

  /// ////////////////////////
  getGrades = () => {
    let { subject } = this.state
    axios
      .get(qBUrls.Grades + '?s_id=' + subject, {
        headers: {
          Authorization: 'Bearer ' + this.auth_token
        }
      })
      .then(res => {
        console.log('Grades : ', res.data)
        if (Array.isArray(res.data)) {
          let grades = []
          for (let i = 0; i < res.data.length; i++) {
            grades[i] = { ...res.data[i], label: res.data[i].grade }
          }
          this.setState({ gradesArr: grades })
        } else {
          this.setState({ gradesArr: [] })
        }
        if (typeof res.data === 'string') {
          this.props.alert.warning(res.data)
        }
      })
      .catch(error => {
        console.log(error)
        console.log(
          "Error: Couldn't fetch data from" + qBUrls.Grades + '?s_id=' + subject
        )
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
        console.log('%c Chapters : ', 'color:orange', res.data)
        if (Array.isArray(res.data)) {
          let chapters = []
          for (let i = 0; i < res.data.length; i++) {
            chapters[i] = { ...res.data[i], label: res.data[i].chapter_name }
          }
          this.setState({ chaptersArr: chapters })
        } else {
          this.setState({ chaptersArr: [] })
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
      this.setState({ newTopic: newTopic.value })
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
    console.log('this.handleClickSubject invoked', event.id, event)
    this.setState({ subject: event.id, chapter: null, grade: null, chapterTopic: null }, () => {
      this.getGrades()
    })
  }
  /// ////////////////////////////////////////////////
  handleClickGrade (event) {
    console.log('this.handleClickGrade invoked', event.value, event)
    this.setState({ grade: event.id, chapter: null, chapterTopic: null }, () => {
      this.getChapters()
    })
  }
  handleClickChapter (event) {
    console.log('this.handleClickChapter invoked', event)
    this.setState({ chapter: event.id, chapterTopic: null }, () => {
      this.getChapterTopics()
    })
  }
  handleClickChapterTopics (event) {
    const { question_data: questData } = this.state
    const quesDataCopy = questData
    // eslint-disable-next-line no-debugger
    // debugger
    quesDataCopy[0].chapter_topic = event.id
    this.setState({ chapterTopic: event.id, question_data: quesDataCopy })
  }
  /// ////////////////////////////////////////////////

  inputFroms = () => {
    return (
      <React.Fragment>
        <Grid.Row>
          <Grid.Column>
            <label>Select Subject</label>
            <Select
              value={
                this.state.subject
                  ? this.state.subjectsArr.filter(sub => {
                    console.log('select', this.state)
                    return sub.id === this.state.subject
                  })
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
                this.state.chapterTopicsArr
                  ? this.state.chapterTopicsArr.filter(chap => {
                    // eslint-disable-next-line no-debugger
                    // debugger
                    return chap.id === this.state.chapterTopic
                  })
                  : []
              }
              options={this.state.chapter ? this.state.chapterTopicsArr : []}
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
    // for handling question and comprehension
    if (id === 'comprehensionQuestion') {
      let { comprehension_data: comprehensionData } = this.state
      comprehensionData.comprehension_question = content
      this.setState({ comprehension_data: comprehensionData })
    } else {
      // ids will be link question-0, question-1,
      // debugger;
      let index = id.split('-')
      index = index[1]
      let { question_data: questionData } = this.state
      questionData[index].question = content
      this.setState({ question_data: questionData })
    }
  };

  handleOptionsContent = (content, id) => {
    // id format quesindex+'-'+option.option = 0-option1
    let splitArr = id.split('-')
    var quesIndex = splitArr[0]
    var optionNO = splitArr[1]
    var quesObj = this.state.question_data
    var { option, correctAns } = quesObj[quesIndex]
    quesObj[quesIndex]['option'] = { ...option, [optionNO]: content }
    if (correctAns[optionNO] || correctAns[optionNO] === '') {
      // if edited option has ticked as corrct answer..hence modifying corrct answer also
      let optionContent = quesObj[quesIndex]['option'][optionNO]
      quesObj[quesIndex]['correctAns'] = { [optionNO]: optionContent }
    }
    this.setState({ question_data: quesObj })
  };

  handleCorrectOption = (optionNO, quesIndex) => {
    let quesObj = this.state.question_data
    let optionContent = quesObj[quesIndex]['option'][optionNO]
    quesObj[quesIndex]['correctAns'] = { [optionNO]: optionContent }
    this.setState({ question_data: quesObj })
  };

  renderQuestion = index => {
    if (this.state.question_data) {
      // debugger
      var { question } = this.state.question_data[index]
      if (question !== undefined) {
        return (
          <TinyMce
            id={'question-' + index}
            get={this.handleTinyMCEdit}
            content={question}
          />
        )
      }
    }
  };
  renderComprehension = () => {
    if (this.state.comprehension_data) {
      var { comprehension_question: comprehensionQuestion } = this.state.comprehension_data
      if (comprehensionQuestion !== undefined) {
        return (
          <TinyMce
            id={`comprehensionQuestion`}
            get={this.handleTinyMCEdit}
            content={comprehensionQuestion}
          />
        )
      }
    }
  };
  renderAnswer = quesindex => {
    // debugger
    if (!this.state.question_data) {
      return null
    }
    var { question_data: questionData } = this.state
    var { correctAns, option } = questionData[quesindex]
    // debugger;
    if (correctAns && option) {
      return (
        <div>
          <h3>Options :</h3>
          {this.state.optionsArray.map((item, index) => {
            // let x = question_data[quesindex]["option"][`option${index + 1}`] ;
            // debugger

            return (
              <div key={quesindex + '-' + item.option}>
                <h5>{item.option}</h5>
                <Grid stackable columns={'equal'}>
                  <Grid.Column>
                    <TinyMce
                      id={quesindex + '-' + item.option}
                      content={option[`option${index + 1}`]}
                      get={this.handleOptionsContent}
                    />
                  </Grid.Column>
                  <Grid.Column>
                    <label>Is Correct Answer</label>
                    <input
                      type='checkbox'
                      disabled={
                        !questionData[quesindex]['option'][`option${index + 1}`]
                      }
                      checked={
                        questionData[quesindex]['correctAns'][`option${index + 1}`] ===
                        questionData[quesindex].option[`option${index + 1}`]
                      }
                      onClick={() => {
                        this.handleCorrectOption(
                          `option${index + 1}`,
                          quesindex
                        )
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
  };

  handleSave = () => {
    let qid = this.state.comprehension_data.id
    var breakHandleSave = false
    let dummystate = { ...this.state }
    // let dummystate = update(this.state,{$merge: {}});
    var {
      question_data: questionData,
      comprehension_data: comprehensionData,
      subject,
      grade,
      chapter,
      chapterTopic,
      newTopic,
      questionlevel,
      questioncategory
    } = { ...dummystate }
    var validationArr = [
      subject,
      grade,
      chapter,
      chapterTopic || newTopic,
      questionlevel,
      questioncategory
    ]
    validationArr.forEach(item => {
      if (!item) {
        this.props.alert.error('Please choose all fields')
        breakHandleSave = true
      }
    })
    if (breakHandleSave) {
      breakHandleSave = false
      return
    }
    if (!comprehensionData.comprehension_question) {
      this.props.alert.error('Please enter comprehension')
      return null
    }
    questionData.map((quesObj, index) => {
      quesObj.subject = subject
      quesObj.grade = grade
      quesObj.chapter = chapter
      quesObj.chapterTopic = chapterTopic
      quesObj.newTopic = newTopic
      quesObj.questionlevel = questionlevel
      quesObj.questioncategory = questioncategory
      if (!quesObj.question) {
        this.props.alert.error(`Please enter question ${index + 1}`)
        return null
      }
      for (let i = 1; i < 5; i++) {
        if (!quesObj['option'][`option${i}`]) {
          this.props.alert.error(
            `Please enter option ${i} of question ${index + 1}`
          )
          console.log('i', i, 'index', index)
          breakHandleSave = true
          break
        }
      }
      if (!quesObj.correctAns) {
        this.props.alert.error(
          `Please choose correct answer to question ${index + 1}`
        )
        return null
      }
      return quesObj
    })
    if (breakHandleSave) {
      breakHandleSave = false
      return
    }
    let payLoad = { question_data: questionData, comprehensionData }
    for (let a = 0; a < payLoad.question_data.length; a++) {
      payLoad.question_data[a].correctAns = JSON.stringify(
        payLoad.question_data[a].correctAns
      )
      payLoad.question_data[a].option = JSON.stringify(
        payLoad.question_data[a].option
      )
    }
    this.setState({ loading: true })
    axios
      .put(
        qBUrls.EditQuestion + qid + '/?ques_type=comp',
        JSON.stringify(payLoad),
        {
          headers: {
            Authorization: 'Bearer ' + this.auth_token,
            'Content-Type': 'application/json'
          }
        }
      )
      .then(res => {
        // eslint-disable-next-line no-debugger
        // debugger
        if (res.status === 200) {
          this.props.alert.success('Question updated')
        }
        // due to state immutability issue,stigifying of payload effect state's correctans and obj (nested objct gets stringifies)so parsing them back to js obj using json.parse
        let questionData = this.state.question_data
        for (let i = 0; i < questionData.length; i++) {
          let { correctAns, option } = questionData[i]
          questionData[i]['correctAns'] = json5.parse(correctAns)
          questionData[i]['option'] = json5.parse(option)
        }
        this.setState({ question_data: questionData, loading: false })
      })
      .catch(error => {
        this.props.alert.error('Something went wrong')
        console.log(error.response)
        this.setState({ loading: false })
      })
  };

  render () {
    return (
      <React.Fragment>
        <div
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
        </div>

        <div className='student-section'>
          <Paper
            style={{ position: 'relative', top: '-30px', marginRight: 30 }}
          >
            <div style={{ padding: '2%' }}>
              <Grid stackable columns='equal'>
                {this.inputFroms()}
              </Grid>

              <h5>Comprehension</h5>
              {this.renderComprehension()}

              {this.state.question_data
                ? this.state.question_data.map((ques, index) => {
                  return (
                    <div>
                      <h5>Question</h5>
                      {this.renderQuestion(index)}
                      {this.renderAnswer(index)}
                    </div>
                  )
                })
                : null}

              <Grid>
                <Grid.Column
                  computer={16}
                  mobile={16}
                  tablet={16}
                  className='student-section-addstaff-button'
                >
                  <Button
                    loading={this.state.loading}
                    color='green'
                    onClick={() => {
                      this.handleSave()
                    }}
                  >
                    Save Changes
                  </Button>
                  <Button
                    primary
                    onClick={this.props.history.goBack}
                    type='button'
                  >
                    Return
                  </Button>
                </Grid.Column>
              </Grid>
            </div>
          </Paper>
        </div>
      </React.Fragment>
    )
  }
}
export default withRouter(EditCompQues)
