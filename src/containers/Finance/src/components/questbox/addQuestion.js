import React, { Component } from 'react'
import { Grid, Tab, Container, Header } from 'semantic-ui-react'
import { Button } from '@material-ui/core/'

import { withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import axios from 'axios'
import Select from 'react-select'
import CreatableSelect from 'react-select/lib/Creatable'
import { OmsSelect } from '../../ui'
import TinyMce from './TinyMCE/tinyMce'
import { qBUrls } from '../../urls'
import GSelect from '../../_components/globalselector'
import { COMBINATIONS } from './config/combination'
import '../css/staff.css'

class AddQuestion extends Component {
  constructor (props) {
    super(props)
    this.state = {
      loading: false,
      questionType: [],
      selectedQuestionType: null,
      subjects: [],
      selectedSubject: null,
      grades: [],
      selectedGrade: null,
      chapters: [],
      chaptersTopics: [],
      selectedChapter: null,
      optionContent: false,
      questionLevel: [],
      selectedQuestionLevel: null,
      questionCategory: [],
      selectedQuestionCategory: null,
      topics: [],
      tags: [],
      selectedTags: [],
      selectedTagsValue: null,
      optionsArray: [
        { option: 'option1', value: null, isCorrectAnser: false },
        { option: 'option2', value: null, isCorrectAnser: false },
        { option: 'option3', value: null, isCorrectAnser: false },
        { option: 'option4', value: null, isCorrectAnser: false }
      ],
      correctAns: null,
      question: null,
      stringifyOption: {
        option1: null,
        option2: null,
        option3: null,
        option4: null
      },

      type: null,
      comprehension: null,
      noOfQuesInComp: 0,
      compQuesArr: []
    }
    this.userProfile = JSON.parse(localStorage.getItem('user_profile'))
    this.role = this.userProfile.personal_info.role
    this.refreshComponent = this.refreshComponent.bind(this)
    // this.refreshComponent = this.refreshComponent.bind(this)
    this.handleTags = this.handleTags.bind(this)
    this.handleTopics = this.handleTopics.bind(this)
    this.handleClickQuestionType = this.handleClickQuestionType.bind(this)
    this.handleTabChange = this.handleTabChange.bind(this)
    this.handleClickGrade = this.handleClickGrade.bind(this)
    this.handleClickSubject = this.handleClickSubject.bind(this)
    this.handleClickChapter = this.handleClickChapter.bind(this)
    this.questionType = this.questionType.bind(this)
    // this.handleChapterTopics = this.handleChapterTopics.bind(this)
  }

  handleClickQuestionType (event) {
    console.log('Question type', event)
    if (this.state && this.state.selectedQuestionType) {
      this.setState({
        stringifyOption: {
          option1: null,
          option2: null,
          option3: null,
          option4: null
        },
        correctAns: null
      })
    }
    this.setState({
      selectedQuestionType: {
        ...event,
        value: event.id,
        label: event.question_type
      }
    })
  }

  componentDidMount () {
    // if (this.userProfile.personal_info.role.toString() !== 'Admin') {
    //   this.mappindDetails = this.userProfile.academic_profile
    //   let subjectData = []
    //   let map = new Map()
    //   for (const item of this.mappindDetails) {
    //     if (!map.has(item.subject_id)) {
    //       map.set(item.subject_id, true)
    //       subjectData.push({
    //         value: item.subject_id,
    //         label: item.subject_name
    //       })
    //     }
    //   }
    //   this.setState({ subjects: subjectData })
    // } else if (this.userProfile.personal_info.role.toString() === 'Admin') {
    //   axios
    //     .get(urls.SUBJECT, {
    //       headers: {
    //         Authorization: 'Bearer ' + this.props.user
    //       }
    //     })
    //     .then(res => {
    //       if (Array.isArray(res.data)) {
    //         let subjects = []
    //         for (let i = 0; i < res.data.length; i++) {
    //           subjects[i] = {
    //             value: res.data[i].id,
    //             label: res.data[i].subject_name
    //           }
    //         }
    //         this.setState({ subjects })
    //       }
    //       if (typeof res.data === 'string') {
    //         this.props.alert.warning(res.data)
    //       }
    //     })
    //     .catch(error => {
    //       console.log("Error: Couldn't fetch data from " + urls.SUBJECT)
    //       console.log(error)
    //     })
    // }
    axios
      .get(qBUrls.QuestionCategory, {
        headers: {
          Authorization: 'Bearer ' + this.props.user
        }
      })
      .then(res => {
        console.log('Qustn Category: ', res.data)
        if (Array.isArray(res.data)) {
          let qCat = []
          for (let i = 0; i < res.data.length; i++) {
            qCat[i] = { ...res.data[i], label: res.data[i].category_name }
          }
          this.setState({ questionCategory: qCat })
        }
        if (typeof res.data === 'string') {
          console.log(res.data)
        }
      })
      .catch(error => {
        console.log(
          "Error: Couldn't fetch data from " + qBUrls.QuestionCategory
        )
        console.log(error)
      })

    axios
      .get(qBUrls.QuestionLevel, {
        headers: {
          Authorization: 'Bearer ' + this.props.user
        }
      })
      .then(res => {
        console.log('Qustn level: ', res.data)
        if (Array.isArray(res.data)) {
          let qLvl = []
          for (let i = 0; i < res.data.length; i++) {
            qLvl[i] = { ...res.data[i], label: res.data[i].question_level }
          }
          this.setState({ questionLevel: qLvl })
        }
        if (typeof res.data === 'string') {
          console.log(res.data)
        }
      })
      .catch(error => {
        console.log("Error: Couldn't fetch data from " + qBUrls.QuestionLevel)
        console.log(error)
      })

    axios
      .get(qBUrls.QuestionType, {
        headers: {
          Authorization: 'Bearer ' + this.props.user
        }
      })
      .then(res => {
        if (Array.isArray(res.data)) {
          let qTyp = []
          for (let i = 0; i < res.data.length; i++) {
            if (res.data[i].question_type) { qTyp.push({ ...res.data[i], label: res.data[i].question_type }) }
          }
          this.setState({ questionType: qTyp })
        }
        if (typeof res.data === 'string') {
          console.log(res.data)
        }
      })
      .catch(error => {
        console.log("Error: Couldn't fetch data from " + qBUrls.QuestionType)
        console.log(error)
      })

    axios
      .get(qBUrls.Tags, {
        headers: {
          Authorization: 'Bearer ' + this.props.user
        }
      })
      .then(res => {
        console.log('Qustn level: ', res.data)
        if (Array.isArray(res.data)) {
          let tags = []
          for (let i = 0; i < res.data.length; i++) {
            if (res.data[i].tag_name) {
              tags.push({
                ...res.data[i],
                label: res.data[i].tag_name,
                value: res.data[i].tag_name
              })
            }
          }
          this.setState({ tags })
        }
        if (typeof res.data === 'string') {
          console.log(res.data)
        }
      })
      .catch(error => {
        console.log("Error: Couldn't fetch data from " + qBUrls.Tags)
        console.log(error)
      })
  }

  refreshComponent () {
    this.setState({
      selectedQuestionType: null,
      loading: false,
      optionsArray: [
        { option: 'option1', value: null, isCorrectAnser: false },
        { option: 'option2', value: null, isCorrectAnser: false },
        { option: 'option3', value: null, isCorrectAnser: false },
        { option: 'option4', value: null, isCorrectAnser: false }
      ],
      correctAns: null,
      question: null,
      stringifyOption: {
        option1: null,
        option2: null,
        option3: null,
        option4: null
      },
      compQuesArr: []
    })
  };

  handleClickSubject (event) {
    this.setState({
      selectedSubject: event,
      selectedChapter: null,
      selectedGrade: null
    })
    if (this.userProfile.personal_info.role.toString() !== 'Admin') {
      this.mappindDetails = this.userProfile.academic_profile
      let gradeData = []
      let map = new Map()
      for (const item of this.mappindDetails) {
        if (!map.has(item.grade_id) && item.subject_id === event.value) {
          map.set(item.grade_id, true)
          gradeData.push({
            value: item.grade_id,
            label: item.grade_name
          })
        }
      }
      this.setState({ grades: gradeData })
    } else if (this.userProfile.personal_info.role.toString() === 'Admin') {
      axios
        .get(qBUrls.Grades + '?s_id=' + event.value, {
          headers: {
            Authorization: 'Bearer ' + this.props.user
          }
        })
        .then(res => {
          console.log('Grades : ', res.data)
          if (Array.isArray(res.data)) {
            let grades = []
            for (let i = 0; i < res.data.length; i++) {
              grades[i] = { value: res.data[i].id, label: res.data[i].grade }
            }
            this.setState({ grades })
          }
          if (typeof res.data === 'string') {
            this.props.alert.warning(res.data)
          }
        })
        .catch(error => {
          console.log(
            "Error: Couldn't fetch data from" +
              qBUrls.Grades +
              '?s_id=' +
              event.id
          )
          console.log(error)
        })
    }
  }
  getChapterTopics = (id) => {
    axios
      .get(qBUrls.chapterTopic + '?chapter_id=' + id, {
        headers: {
          Authorization: 'Bearer ' + this.props.user
        }
      })
      .then(res => {
        console.log('chap', res.data)
        let chaptersTopics = res.data.map(item => ({ ...item, label: item.name, value: item.id }))

        this.setState({ chaptersTopics })
      })
      .catch(error => {
        console.log(error)
      })
      // .then((res) => {
      //   console.log(res, 'ressss')
      //   if (res.status === 200) {
      //     this.setState({ topicsData: res.data.chapter_topic_type
      //     })
      //     console.log(this.state.topicsData, 'dataa')
      //   }
      // })
      // .catch(e => console.log(e))
  }

  getChapters = (gradeid, id) => {
    axios
      .get(qBUrls.Grades + '?s_id=' + id + '&g_id=' + gradeid, {
        headers: {
          Authorization: 'Bearer ' + this.props.user
        }
      })
      .then(res => {
        console.log('%c Chapters : ', 'color:orange', res.data)
        let gradeId = Number(gradeid)
        let subjectId = Number(id)
        let chapters = res.data.map(item => ({ ...item, label: item.chapter_name }))
        let allChapters = chapters.filter(chtr => (chtr.grade === gradeId && chtr.subject === subjectId))
        this.setState({ chapters: allChapters })
      })
      .catch(error => {
        console.log(error)
      })
  }

  handleClickGrade (event) {
    if (!this.state.selectedSubject) {
      return null
    }
    if (this.state.selectedGrade) {
      this.setState({ selectedChapter: null })
    }
    console.log('this.handleClickGrade invoked', event.value, event)
    this.setState({ selectedGrade: event })
    let id = this.state.selectedSubject.value
    axios
      .get(qBUrls.Grades + '?s_id=' + id + '&g_id=' + event.value, {
        headers: {
          Authorization: 'Bearer ' + this.props.user
        }
      })
      .then(res => {
        console.log('%c Chapters : ', 'color:orange', res.data)
        let gradeId = event.value
        let { selectedSubject: { value: subjectId } } = this.state
        let chapters = res.data.map(item => ({ ...item, label: item.chapter_name }))
        chapters = chapters.filter(chtr => (chtr.grade === gradeId && chtr.subject === subjectId))
        console.log('%c All Chapters : ', 'color:red', res.data)
        console.log('%c Chapters : ', 'color:red')
        console.table([...chapters])
        this.setState({ chapters })
      })
      .catch(error => {
        console.log(error)
      })
  }
  handleClickChapter (event) {
    if (!this.state.selectedSubject) {
      return null
    }
    console.log('this.handleClickChapter invoked', event)
    this.getChapterTopics(event.value)
    this.setState({ selectedChapter: event.value, selectedChapterValue: event })
    // selectedChapter: { ...event, value: event.id, label: event.chapter_name }
    // })
  }
  handleTags (tags, action) {
    let selectedTags = []
    let newTags = []
    for (let tag of tags) {
      if (tag.id) {
        selectedTags.push(tag)
      } else {
        newTags.push(tag)
      }
    }
    this.setState({ newTags, selectedTags, selectedTagsValue: tags })
  };

  handleTabChange (event, data) {
    if (data.activeIndex === 0) {
      this.setState({ type: null })
    } else if (data.activeIndex === 1) {
      this.setState({ type: 'comprehension' })
    }
    this.setState({
      selectedQuestionType: null,
      question: null,
      comprehension: null,
      noOfQuesInComp: 0,
      compQuesArr: [],
      selectedSubject: null,
      selectedGrade: null,
      selectedChapterValue: null,
      selectedQuestionLevel: null,
      selectedQuestionCategory: null,
      selectedTagsValue: null,
      selectedTopicsValue: ''

    })
  };
  handleTopics (topic, action) {
    let selectedTopic = ''
    let newTopic = ''

    if (topic.__isNew__) {
      delete topic.__isNew__
      newTopic = topic
    } else {
      selectedTopic = topic
    }
    // for (let topic of topics) {
    //   if (topic.id) {
    //     selectedTopics.push(topic)
    //   } else {
    //     newTopics.push(topic)
    //   }
    // }
    this.setState({ newTopic, selectedTopic })
  };
  questionType () {
    return (
      <Grid.Column width={8}>
        <label>Select Question Type</label>
        <OmsSelect
          placeholder='Select Question Paper Type '
          options={this.state.questionType}
          change={this.handleClickQuestionType}
        />
      </Grid.Column>
    )
  };

  onChange = (data) => {
    console.log(data)
    if (this.role !== 'Subjecthead') {
      this.setState({ selectedGrade: { value: Number(data.grade_id), label: data.grade_name }, chapters: [] })
      if (data.subject_id && data.grade_id) {
        this.setState({ selectedSubject: { value: Number(data.subject_id), label: data.subject_name }, chapters: [] }, () => {
          this.getChapters(data.grade_id, data.subject_id)
        })
      }
    } else {
      this.setState({ selectedSubject: { value: Number(data.subject_id), label: data.subject_name }, chapters: [] })
      if (data.grade_id) {
        this.setState({ selectedGrade: { value: Number(data.grade_id), label: data.grade_name }, chapters: [] }, () => {
          this.getChapters(data.grade_id, data.subject_id)
        })
      }
    }
  }

  inputFroms = tab => {
    return (
      <React.Fragment>
        <Grid.Row>{tab === 'tab1' ? this.questionType() : null}</Grid.Row>
        <Grid.Row>
          <Grid.Column>
            <GSelect variant={'selector'} config={COMBINATIONS} onChange={this.onChange} />
            <label>Select Chapter</label>
            <OmsSelect
              disabled={!this.state.selectedSubject}
              options={this.state.chapters
                ? this.state.chapters.map(chap => ({
                  value: chap.id,
                  label: chap.chapter_name
                }))
                : []}
              change={this.handleClickChapter}
              defaultValue={
                this.state.selectedChapterValue || {}
              }
            />
            <label>Select Chapter Topic</label>
            <CreatableSelect
              onChange={(e, a) => {
                this.handleTopics(e, a)
              }}
              options={this.state.chaptersTopics ? this.state.chaptersTopics : []}
            />

          </Grid.Column>

          <Grid.Column>
            <label>Question Level</label>
            <OmsSelect
              options={
                this.state.questionLevel.length ? this.state.questionLevel : []
              }
              change={e => {
                this.setState({
                  selectedQuestionLevel: {
                    ...e,
                    value: e.id,
                    label: e.question_level
                  }
                })
              }}
              defaultValue={
                this.state.selectedQuestionLevel || []
              }
            />
            <label>Question Category</label>
            <OmsSelect
              options={
                this.state.questionCategory.length
                  ? this.state.questionCategory
                  : []
              }
              change={e => {
                this.setState({
                  selectedQuestionCategory: {
                    ...e,
                    value: e.id,
                    label: e.category_name
                  }
                })
              }}
              defaultValue={
                this.state.selectedQuestionCategory || []
              }

            />

            <label>Select Tags:</label>
            <div style={{ zIndex: 10000 }}>

              <CreatableSelect
                onChange={(e, a) => {
                  this.handleTags(e, a)
                }}
                isMulti
                options={this.state.tags ? this.state.tags : []}
                // defaultValue={
                //   this.state.selectedTagsValue || {}
                // }

              />
            </div>
          </Grid.Column>
        </Grid.Row>
      </React.Fragment>
    )
  };

  tab1Content = () => {
    return (
      <Grid stackable columns='equal'>
        {this.inputFroms('tab1')}
      </Grid>
    )
  };
  tab2Content = () => {
    return (
      <Grid stackable columns='equal'>
        {this.inputFroms('tab2')}
      </Grid>
    )
  };
  handleQuestionEdit = (content, id) => {
    if (id === 'Q1345') {
      this.setState({ question: content })
    }
    if (id === 'Q2' && this.state.questionType) {
      this.setState({ comprehension: content })
    }
  };
  handleAnswerChange = (content, id) => {
    console.log(content)
    this.setState({ OptionsContent: content })
    console.log('Content (answer) was updated:', id)
    var { id: qID } = this.state.selectedQuestionType
    if (qID === 1) {
      let stringifyOption = this.state.stringifyOption
      stringifyOption[id] = content
      this.setState({ stringifyOption })
      this.setState({ optionContent: true })
      console.log(stringifyOption)
    }

    if (qID === 4 || qID === 5) {
      this.setState({ correctAns: content })
    }
  };
  handleOptions = index => {
    if (this.state.selectedQuestionType.id === 1) {
      // MCQ type
      console.log(index, 'checkbox clicked')
      this.setState({ optionAns: index })
      let optionsArray = [...this.state.optionsArray]
      for (let i = 0; i < optionsArray.length; i++) {
        optionsArray[i].isCorrectAnser = false
      }
      optionsArray[index].isCorrectAnser = true
      let correctOption = 'option' + (index + 1)
      let content = this.state.stringifyOption[correctOption]

      this.setState({
        optionsArray,
        correctAns: { [correctOption]: content }
      })
    }
  };
  handleSubmit = () => {
    let {
      selectedChapter,
      question,
      correctAns,
      selectedSubject,
      selectedGrade,
      selectedQuestionLevel,
      selectedQuestionType,
      selectedQuestionCategory,
      selectedTags,
      stringifyOption,
      type,
      // chapterTopicType,
      comprehension
    } = this.state
    if (!type && !selectedQuestionType) {
      this.props.alert.warning('Please Select Question Type')
      return null
    } else if (type && !comprehension) {
      this.props.alert.warning('Please Enter Comprehension Text')
      return null
    }

    let validationArray = [
      selectedSubject,
      // chapterTopicType,
      selectedGrade,
      selectedChapter,
      selectedQuestionLevel,
      selectedQuestionCategory,
      selectedTags,
      stringifyOption
    ]
    console.log(validationArray)
    for (let data of validationArray) {
      if (!data) {
        this.props.alert.warning('Please enter required fields')
        return null
      }
    }
    var formData = new FormData()
    formData.append('subject_id', selectedSubject.value)
    // formData.append('name', chapterTopicType.label)
    formData.append('grade', selectedGrade.value)
    formData.append('chapter', selectedChapter)
    formData.append('category', selectedQuestionCategory.id)
    formData.append('level', selectedQuestionLevel.id)
    let newTag = this.state.newTags ? this.state.newTags.map(tag => tag.value) : []
    formData.append('newTag', JSON.stringify(newTag))
    let existedTag = selectedTags.map(tag => tag.id.toString())
    formData.append('existedTag', JSON.stringify(existedTag))
    // let newTopic = this.state.newTopic ? this.state.newTopic.map(topic => topic.value)t : []
    this.state.newTopic && formData.append('newTopic', this.state.newTopic.value)
    // let existedTopic = selectedTopics.map(topic => topic.id.toString())
    this.state.selectedTopic && formData.append('existedTopic', this.state.selectedTopic.value)

    if (type) {
      // if type exists then it is comprehension else normal questions type
      formData.append('type', type)
      formData.append('comprehension', this.state.comprehension)
      // validations for comp questions
      if (!question) {
        this.props.alert.warning('Add atleast one question')
        return null
      }
      for (let i = 0; i < question.length; i++) {
        if (!question[i].compQuestion) {
          this.props.alert.warning(
            'Comprehension ' + (i + 1) + ' question field must not be empty.'
          )
          return null
        }
        if (!question[i].correctAns) {
          this.props.alert.warning(
            'Tick the correct answer of question ' + (i + 1)
          )
          return null
        }
        for (let k = 1; k < 5; k++) {
          if (!question[i]['option']['option' + k]) {
            this.props.alert.warning(
              'Enter question ' + (i + 1) + ' option ' + k
            )
            return null
          }
        }
      }
      for (let i = 0; i < question.length; i++) {
        delete question[i]['label']
      }
      formData.append('question', JSON.stringify(question))
    } else {
      // validation if question,options not gven by user
      if (!question) {
        this.props.alert.warning('Please enter question')
        return null
      }

      if (selectedQuestionType.id === 1) {
        // if selected question type === MCQ..then will check for options
        for (let k = 1; k < 5; k++) {
          if (!stringifyOption['option' + k]) {
            this.props.alert.warning('Enter option ' + k)
            return null
          }
        }
        if (!correctAns) {
          this.props.alert.warning('Please tick the correct option')
          return null
        }
      }
      if (selectedQuestionType.id === 3) {
        if (correctAns === null || correctAns === undefined) {
          this.props.alert.warning('Please choose answer')
          return null
        }
      }
      if (selectedQuestionType.id === 4 || selectedQuestionType.id === 5) {
        if (!correctAns) {
          this.props.alert.warning('Please enter answer')
          return null
        }
      }
      formData.append('question', question)
      formData.append('correct_ans', JSON.stringify(correctAns))
      formData.append('question_type', selectedQuestionType.id)
      formData.append('option', JSON.stringify(stringifyOption))
    }

    this.setState({ loading: true })
    axios
      .post(qBUrls.AddQuestion, formData, {
        headers: {
          Authorization: 'Bearer ' + this.props.user
        }
      })
      .then(res => {
        if (res.status === 201) {
          this.props.alert.success('Question Created')
          this.refreshComponent()
        } else {
          this.props.alert.warning(JSON.stringify(res.data))
        }
        this.setState({ loading: false })
      })
      .catch(error => {
        this.setState({ loading: false })
        console.log(error)
        console.log("Error: Couldn't fetch data from " + qBUrls.AddQuestion)
      })
  };
  tab1AnswersDiv = () => {
    if (!this.state.selectedQuestionType) {
      return null
    }
    var { id, label: questionType } = this.state.selectedQuestionType

    if (id === 1) {
      console.log('Question Type:', questionType)
      return (
        <div>
          <h3>Options :</h3>
          {this.state.optionsArray.map((option, index) => {
            return (
              <div key={option.option}>
                <h5>{option.option}</h5>
                <Grid stackable columns={'equal'}>
                  <Grid.Column>
                    <TinyMce id={option.option} get={this.handleAnswerChange} />
                  </Grid.Column>
                  <Grid.Column>
                    <label>Is Correct Answer</label>
                    <input
                      type='checkbox'
                      disabled={!this.state.stringifyOption[option.option]}
                      checked={this.state.optionsArray[index].isCorrectAnser}
                      onClick={() => {
                        this.handleOptions(index)
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
    if (id === 3) {
      console.log('Question Type:', questionType)
      return (
        <div>
          <h5>Answer</h5>
          <div style={{ width: '40%' }}>
            <Select
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
    if (id === 4) {
      console.log('Question Type:', questionType)
      return (
        <div>
          <h5>Answer</h5>
          <div style={{ width: '70%' }}>
            <TinyMce id={'Q4ANS'} get={this.handleAnswerChange} />
          </div>
        </div>
      )
    }
    if (id === 5) {
      console.log('Question Type:', questionType)
      return (
        <div>
          <h5>Answer</h5>
          <div style={{ width: '70%' }}>
            <TinyMce id={'Q5ANS'} get={this.handleAnswerChange} />
          </div>
        </div>
      )
    }
  };

  tab2AnswersDiv = () => {
    return (
      <div style={{ padding: '0px', margin: '0px' }}>
        {this.state.compQuesArr.map(que => (
          <CompQues
            key={que.label}
            send={this.handleCompQuesObj}
            index={que.index}
            id={que.label}
            delete={this.handleDeleteCompQues}
          />
        ))}
      </div>
    )
  };
  handleDeleteCompQues = label => {
    let { question, compQuesArr, noOfQuesInComp } = this.state
    noOfQuesInComp -= 1
    compQuesArr = compQuesArr.filter(item => {
      return item.label !== label
    })
    if (question) {
      question = question.filter(item => {
        return item.label !== label
      })
      this.setState({ compQuesArr, question, noOfQuesInComp })
    } else {
      this.setState({ compQuesArr, noOfQuesInComp })
    }
  };
  handleCompQuesObj = (obj, label) => {
    console.log(obj)
    obj = { ...obj, label }
    var { question } = this.state
    if (Array.isArray(question)) {
      if (question.length === 0) {
        // if question obj is empty array....pushing obj directly
        question.push(obj)
        this.setState({ question })
        return null
      } else {
        // if obj exists...replacing it with new content
        for (let i = 0; i < question.length; i++) {
          if (question[i].label === obj.label) {
            question[i] = obj
            this.setState({ question })
            return null
          }
        }
        // else pushing it
        question.push(obj)
        this.setState({ question })
        return null
      }
    } else if (!question) {
      // if question obj is null....pushing obj directly
      question = []
      question.push(obj)
      this.setState({ question })
      return null
    }
  };
  render () {
    console.log(this.state.topicsData, 'dataa')
    console.log(this.state.chaptersTopics, 'chap')
    const panes = [
      {
        menuItem: 'MCQ Question',
        render: () => (
          <Tab.Pane>
            <div>{this.tab1Content()}</div>
            <h5>Enter Question</h5>
            <TinyMce id={'Q1345'} get={this.handleQuestionEdit} />
            <div style={{ marginTop: '50px' }}>{this.tab1AnswersDiv()}</div>
          </Tab.Pane>
        )
      },
      {
        menuItem: 'Comprehension Question',
        render: () => {
          return (
            <Tab.Pane>
              <div>{this.tab2Content()}</div>
              <h5>Enter Comprehension Text</h5>
              <TinyMce id={'Q2'} get={this.handleQuestionEdit} />
              <div style={{ marginTop: '50px' }}>{this.tab2AnswersDiv()}</div>
              <Button
                primary
                onClick={() => {
                  let { noOfQuesInComp: noOfQues, compQuesArr } = this.state
                  noOfQues++
                  compQuesArr.push({
                    index: noOfQues,
                    label: 'compQues' + noOfQues
                  })
                  this.setState({ noOfQuesInComp: noOfQues, compQuesArr })
                }}
              >
                Add Question
              </Button>
            </Tab.Pane>
          )
        }
      }
    ]
    return (
      <React.Fragment>
        <Tab
          panes={panes}
          onTabChange={(event, data) => {
            this.handleTabChange(event, data)
          }}
        />
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
              onClick={this.handleSubmit}
            >
                  Create Question
            </Button>
          </Grid.Column>
        </Grid>
      </React.Fragment>
    )
  }
}

class CompQues extends Component {
  constructor (props) {
    super(props)
    this.state = {
      compQuestion: null,
      isComprehension: true,
      option: { option1: null, option2: null, option3: null, option4: null },
      correctAns: null,

      optionsArray: [
        { option: 'option1', isCorrectAnser: false },
        { option: 'option2', isCorrectAnser: false },
        { option: 'option3', isCorrectAnser: false },
        { option: 'option4', isCorrectAnser: false }
      ]
    }
  }

  handleCompQuestionEdit = (content, id) => {
    this.setState({ compQuestion: content })
    this.sendDataToParent()
  };
  handleAnswerChange = (content, id) => {
    id = id.substr(-7) // id='compQues1option1' making it 'option1'
    let option = { ...this.state.option, [id]: content }
    this.setState({ option })
    this.sendDataToParent()
  };
  handleCorrectAns = index => {
    console.log(index, 'checkbox clicked')
    let optionsArray = [...this.state.optionsArray]
    for (let i = 0; i < optionsArray.length; i++) {
      optionsArray[i].isCorrectAnser = false
    }
    optionsArray[index].isCorrectAnser = true
    let correctOption = 'option' + (index + 1)
    let content = this.state.option[correctOption]
    this.setState(
      {
        optionsArray,
        correctAns: { [correctOption]: content }
      },
      this.sendDataToParent
    )
  };
  sendDataToParent = () => {
    let { compQuestion, isComprehension, option, correctAns } = this.state
    let quesObj = { compQuestion, isComprehension, option, correctAns }
    this.props.send(quesObj, this.props.id)
  };

  render () {
    let id = 'compQues' + this.props.index
    return (
      <div>
        <Container clearing>
          <Header as='h3' floated='left'>
            Question
          </Header>
          <Button
            floated='right'
            basic
            color='red'
            size='tiny'
            onClick={() => this.props.delete(this.props.id)}
          >
            Delete Question
          </Button>
        </Container>
        <TinyMce id={id} get={this.handleCompQuestionEdit} />
        {this.state.optionsArray.map((item, index) => {
          return (
            <div key={item.option}>
              <h5>{item.option}</h5>
              <Grid stackable columns={'equal'}>
                <Grid.Column>
                  <TinyMce
                    id={id + item.option}
                    get={this.handleAnswerChange}
                  />
                </Grid.Column>
                <Grid.Column>
                  <label>Is Correct Answer</label>
                  <input
                    type='checkbox'
                    disabled={!this.state.option[item.option]}
                    checked={this.state.optionsArray[index].isCorrectAnser}
                    onClick={() => {
                      this.handleCorrectAns(index)
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
}

const mapStateToProps = state => ({
  user: state.authentication.user
})
export default connect(mapStateToProps)(withRouter(AddQuestion))
