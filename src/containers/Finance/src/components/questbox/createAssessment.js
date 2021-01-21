/* eslint-disable camelcase */
import React, { Component } from 'react'
import ReactHtmlParser from 'react-html-parser'
import {
  Segment,
  Grid,
  Form,
  TextArea
  // Dimmer,
  // Loader
} from 'semantic-ui-react'
import axios from 'axios'
import Select from 'react-select'
import CreatableSelect from 'react-select/lib/Creatable'
import { withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import Stepper from '@material-ui/core/Stepper'
import Step from '@material-ui/core/Step'
import ClearIcon from '@material-ui/icons/Clear'
import StepLabel from '@material-ui/core/StepLabel'
import { withStyles } from '@material-ui/core/styles'
import Button from '@material-ui/core/Button'
import Typography from '@material-ui/core/Typography'
import Drawer from '@material-ui/core/Drawer'
import { List, Avatar } from '@material-ui/core'

import Close from '@material-ui/icons/Close'

// import Checkbox from './Checkbox/Checkbox'
import { urls, qBUrls } from '../../urls'
import Exporter from '../../_components/pselect/exporter'
import PSelect from '../../_components/pselect'
import { OmsSelect } from '../../ui'
import { apiActions } from '../../_actions'
import { COMBINATIONS } from './gSelectorConfig'
import { COMBINATIONS as OFFLINECONFIG } from './config/offlineAssessmentConfig'
import GSelect from '../../_components/globalselector'
import '../css/staff.css'

var questionPaper = []
var questionsData = []
console.log(questionsData)
// var CompQuestionsData = []
var finalData = []
// var assessmentCCategory = []
// var assessmentTType = []

const styles = theme => ({
  root: {
    width: '90%'
  },
  button: {
    marginRight: theme.spacing.unit
  },
  instructions: {
    marginTop: theme.spacing.unit,
    marginBottom: theme.spacing.unit
  },
  list: {
    width: 350
  }

})

function getSteps () {
  return ['Assessment Details', 'Assign To', 'Question Paper', 'Assign Marks To Questions']
}

function getStepContent (step) {
  switch (step) {
    case 0:
      // return 'Assessment Details'
      return null
    case 1:
      // return 'Assign To?'
      return null
    case 2:
      // return 'Question Paper'
      return null
    case 3:
      // return 'Assign Marks To Questions'
      return null
    default:
      // return 'Unknown step'
      return null
  }
}

class CreateAssessment extends Component {
  constructor (props) {
    super(props)
    this.state = {
      assessmentCreatedId: null,
      selectedTags: [],
      activeStep: 0,
      skipped: new Set(),
      branchSelected: { branch_name: 'html', id: 1 },
      questionPapers: [],
      questionsOfPaper: [],
      compQuestionsOfPaper: null,
      duration: '',
      tags: [],
      usePowerSelector: false,
      openPowerSelector: false,
      question_paper_details: null,
      questionMarksData: [],
      assessmentName: '',
      testName: '',
      termList: [],
      showAssessmentCategory: false,
      offlineSubTypes: [],
      offlineCategories: [],
      showStatus: false,
      currentPage: 0,
      uniqueTestIdList: [],
      section_mapping: [],
      selectedTagsLabel: {},
      open: false,
      right: false,
      questionCount: 0,
      globalSelectorKey: new Date().getTime()

    }
    this.userProfile = JSON.parse(localStorage.getItem('user_profile'))
    this.handleClickSubject = this.handleClickSubject.bind(this)
    this.handleQuestionCategory = this.handleQuestionCategory.bind(this)
    this.handleEndDate = this.handleEndDate.bind(this)
    this.handleQuestionPaper = this.handleQuestionPaper.bind(this)
    this.handleMarksField = this.handleMarksField.bind(this)
    this.getStepers = this.getStepers.bind(this)
  }
  componentDidMount () {
    this.role = this.userProfile.personal_info.role
    // axios
    //   .get(urls.AsseesmentCategories, {
    //     headers: {
    //       Authorization: 'Bearer ' + this.props.user
    //     }
    //   })
    //   .then(res => {
    //     console.log(res.data)
    //     this.state.assessmentTType = Object.values(res.data[0])
    //     this.state.assessmentCCategory = Object.values(res.data[1])
    //     console.log(this.state.assessmentTType, 'onjjjj')
    //     console.log(this.state.assessmentCCategory, 'onjjjj')
    //     this.setState({ assessmentChoices: res.data,
    //       online: res.data.online })
    //   })
    //   .catch(error => {
    //     console.log("Error: Couldn't fetch data from " + urls.SUBJECT)
    //     console.log(error)
    //   })
    this.getAssessmentConfigurations()
    axios
      .get(urls.QuestionPaperType, {
        headers: {
          Authorization: 'Bearer ' + this.props.user
        }
      })
      .then(res => {
        console.log(res.data)
        this.setState({ questionCategory: res.data })
      })
      .catch(error => {
        console.log("Error: Couldn't fetch data from " + urls.SUBJECT)
        console.log(error)
      })
    axios
      .get(qBUrls.AssessmentTags, {
        headers: {
          Authorization: 'Bearer ' + this.props.user
        }
      })
      .then(res => {
        // console.log('Qustn level: ', res.data)
        console.log(res.data)
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

    this.getTerms()
      .then(result => { this.setState({ termList: result.data }) })
      .catch(err => { console.log(err) })
  }

  getAssessmentByTestId = (testId) => {
    axios.get(`${qBUrls.AssessmentNew_v2}?test_id=${testId}`, {
      headers: {
        Authorization: 'Bearer ' + this.props.user
      }
    })
      .then(res => {
        let sectionMappingIds = res.data.assign_to_section_mappings.map(section => {
          return section.id
        })

        const { instruction, start_date, end_date, duration, description, name_assessment, id, assessment_conf: { assessment_sub_type, assessment_category, assessment_sub_category }, max_marks, min_marks, test_name } = res.data
        this.setState({ instruction,
          description,
          startDate: start_date && start_date.slice(0, 10),
          endDate: end_date && end_date.slice(0, 10),
          assessmentName: name_assessment,
          duration,
          section_mapping: sectionMappingIds,
          usePowerSelector: !!sectionMappingIds.length,
          assessmentCreatedId: id,
          assessmentSubTypeValue: { label: assessment_sub_type },
          assessmentSubType: assessment_sub_type,
          assessmentCategoryValue: { label: assessment_category },
          assessmentCategory: assessment_category,
          assessmentSubCategoryValue: { label: assessment_sub_category },
          assessmentSubCategory: assessment_sub_category,
          testName: test_name,
          minimumMarks: min_marks,
          maximumMarks: max_marks,
          showAssessmentCategory: !!assessment_category
        })
      })
  }

  getTerms = async () => {
    let res = await axios.get(urls.AcademicTerms, {
      headers: {
        Authorization: 'Bearer ' + this.props.user
      }
    })
    return res
  }

  handleClickSubject = event => {
    console.log(event)
    // this.props.getSubjects(event.value)
    this.setState({
      // QuestionCategoryValue: null,
      subjectVal: event.value,
      subjectId: event.value,
      subjectValue: event,
      QuestionPaperCategory: {},
      QuestionCategoryValue: {},
      questionPapers: [],
      questionpaperValue: {},
      subjectName: event.label
    })
  }
  handleTags = (tags, action) => {
    // let selectedTags = []
    // let newTags = []
    // for (let tag of tags) {
    //   if (tag.id) {
    //     selectedTags.push(tag)
    //   } else {
    //     newTags.push(tag)
    //   }
    // }
    let tagLabel = tags.map(tag => {
      return tag.tag_name
    })

    this.setState(state => {
      return { newTags: tags.filter(tag => !tag['id']), selectedTags: tags.filter(tag => tag['id']), tagLabel }
    })
  }
  handleQuestionCategory = event => {
    console.log(event.value, 'uio')
    let exporter = new Exporter()
    questionPaper = []
    this.setState({ questionPaperTypeLabel: event.label, QuestionCategory: event.value, QuestionCategoryValue: event, QuestionPaperCategory: event, questionPapers: [], questionpaperValue: {} }, () => {
      console.log(this.state.QuestionCategory, 'statoi')
      axios
        .get(urls.QuestionPaperFilter + (this.state.assessmentType === 'offline' ? ('?subject_id=' + this.state.subjectId + (this.state.usePowerSelector ? '&acad_branch_grade_mapping_id=' + (exporter.getGrades())[0] : '&grade_id=' + this.state.mappingGrade)) : '?subject_id=' + this.state.osubject_id + '&grade_id=' + this.state.ograde_id) + '&question_paper_type_id=' + this.state.QuestionCategory, {
          headers: {
            Authorization: 'Bearer ' + this.props.user
          }
        })
        .then(res => {
          console.log(res.data)
          res.data.forEach(val => {
            console.log(val)
            console.log(this.state.QuestionCategory)
            console.log(val.question_paper_type)
            if (this.state.QuestionCategory === val.question_paper_type.id) {
              console.log(val.question_paper_name)
              questionPaper.push({
                label: val.question_paper_name,
                value: val.id
              })
            }
          })
          console.log(questionPaper)

          this.setState({ questionPapers: questionPaper })
        })
        .catch(error => {
          console.log("Error: Couldn't fetch data from " + urls.SUBJECT)
          console.log(error)
        })
    })
  }
  handleQuestionPaper = event => {
    console.log(event, 'eve hellloooo')
    console.log(event.value, 'hellloooo')
    questionsData = []
    this.state.ques_paper_i = event.value
    this.setState({ QuestionPaperLabel: event.label, QuestionPaper: event.value, questionpaperValue: event, questionsOfPaper: [], questionsData: [] }, () => {
      axios
        .get(urls.ViewQuestionPaperDetail + event.value, {
          headers: {
            Authorization: 'Bearer ' + this.props.user
          }
        })
        .then(res => {
          console.log(res, 'result')
          console.log(res.data, 'result.data', res.data['question_count'])
          console.log(res.data['question_detail'], 'result questions data')
          console.log(res.data['question_paper_details'], 'result question paper data')
          this.setState({ questionsOfPaper: res.data['question_detail'], question_paper_details: res.data['question_paper_details'], questionCount: res.data['question_count'] })
        })
        .catch(error => {
          console.log("Error: Couldn't fetch data from ")
          console.log(error)
        })
    })
  }
  handleMarksField = (ques) => event => {
    // console.log(e.target.value, 'evennojlnt')
    console.log(event.target.value, 'event that marks')
    console.log(ques, 'question id')
    var text = document.getElementsByName('textbox1').value
    console.log(text, 'marks')
    console.log(this.state.questionMarksData, 'question marks data inside marks handler')
    // if (event.target.value === '') {
    //   event.target.value = 1
    // }
    this.state.questionMarksData.forEach(val => {
      if (val) {
        if (val.QuestionId === ques) {
          if (event.target.value === '') {
            val.QuestionMark = '1'
          } else {
            val.QuestionMark = event.target.value
          }
          console.log(val.QuestionMarkId, 'llllooolllo')
        }
      } else {
        console.log('error log')
      }
      console.log(val, 'each marks object in array')
    })
    console.log(this.state.questionMarksData, 'after update')
  }
  handleClickBranch = event => {
    console.log(event)
    this.props.gradeMapBranch(event.value)
  }

  handleClickGrade = event => {
    this.props.sectionMapGrade(event.value)
    this.setState({
      gradeId: event.value,
      gradeValue: event,
      sectionValue: []
    })
  };

  handleClickSection = event => {
    let aSection = []
    event.forEach(function (section) {
      aSection.push(section.value)
    })
    this.setState({ section_mapping: aSection, sectionValue: event })
  };

  // handleTestId = e => {
  //   this.setState({ testId: e && e.value ? e.value : '' }, () => {
  //     axios
  //       .get(urls.UniqueTestId + '?testId=' + this.state.testId, {
  //         headers: {
  //           Authorization: 'Bearer ' + this.props.user
  //         }
  //       })
  //       .then(res => {
  //         console.log(res.status === 204)
  //         if (res.status === 204) {
  //           this.setState({ testID: true, showStatus: true })
  //         }
  //       })
  //       .catch(error => {
  //         console.log(error.response.status === 400)
  //         if (error.response.status === 409) {
  //           this.setState({ testID: false, showStatus: true })
  //         } else {
  //           console.log(error)
  //         }
  //         console.log("Error: Couldn't fetch data from " + urls.UniqueTestId)
  //       })
  //   })

  //   // this.setState({ testId: idEntered })
  // };

  handleEndDate = e => {
    // this.setState({ endDate : e.target.value })
    let startDate = document.getElementById('startDate').value
    let nendDate = document.getElementById('endDate').value
    if (startDate >= nendDate) {
      this.props.alert.error('End date should be greater than Start date')
      this.setState({ endDate: '' })
    } else {
      this.setState({ endDate: nendDate })
    }
  };

  handleMarksSubmit = e => {
    this.setState({ submMarks: e })
    this.setState({ submScore: e })
    console.log('hello call succcessfull')
    this.state.questionMarksData.forEach(val => {
      finalData.push({
        q_id: val.QuestionId,
        marks: val.QuestionMark
      })
    })
    console.log(this.state.questionMarksData, 'hello call 2')
    console.log(finalData, 'final datasdfolk')
    let dataVerMarks = {
      // assessment_questionpaper_question_marks_id: this.state.testId,
      assessment_id: this.state.assessmentCreatedId,
      question_marks_details: finalData
    }
    console.log(dataVerMarks, 'data post update marks')
    axios
      .post(qBUrls.AssessmentScore, dataVerMarks, {
        headers: {
          Authorization: 'Bearer ' + this.props.user
        }
      })
      .then(res => {
        console.log(res)
        if (res.status === 201) {
          this.props.alert.success('Assessment score added successfully')
          document.getElementById('formReset2').reset()
          this.props.history.push('/questbox/assessment/view')
        } else if (
          res.data === 'something went wrong'
        ) {
          this.props.alert.warning(res.data)
        }
      })
      .catch(error => {
        console.log(error.response.status === 400)
        if (error.response.status === 409) {
          this.props.alert.error('Id Already Exists')
        }
        console.log("Error: Couldn't fetch data from " + urls.CreateAssessment)
      })
  }
  handleSubmitAssessment = e => {
    // let { questionCount } = this.state

    // if (questionCount <= 0) {
    //   this.props.alert.error('There are no questions in this question paper choose another question paper')
    //   return
    // }
    this.setState({ submAssess: e, questionMarksData: [] })

    let { selectedTags, newTags = [], assessmentType, assessmentCreatedId, isNewTestId, assessmentCategory, assessmentSubCategory, assessmentSubType } = this.state
    let validationArray = [
      selectedTags
    ]
    let exporter = new Exporter()
    for (let data of validationArray) {
      if (!data) {
        this.props.alert.warning('Please enter required fields')
        return null
      }
    }
    let newTag = newTags.map(tag => tag.value)
    let existedTag = selectedTags.map(tag => tag.id.toString())
    let dataVer2 = {
      unique_test_id: this.state.testId,
      sectionmapping_ids: this.state.usePowerSelector ? exporter.getSections() : this.state.section_mapping,
      assessment_category: assessmentCategory,
      assessment_type: this.state.assessmentType,
      subject_id: this.state.subjectId,
      // online: this.state.assessmentType.online,
      assessment_name: this.state.assessmentName,
      question_paper_id: this.state.QuestionPaper,
      // start_date: this.state.startDate,
      // end_date: this.state.endDate,
      duration: this.state.duration,
      instruction: this.state.instruction,
      description: this.state.description,
      newTag: newTag,
      existedTag: existedTag,
      termId: this.state.termId,
      assessment_sub_type: assessmentSubType,
      assessment_sub_category: assessmentSubCategory,
      test_name: this.state.testName
    }
    if (assessmentType === 'online') {
      dataVer2.subject_id = this.state.osubject_id
      dataVer2.grade_id = this.state.ograde_id
    } else if (assessmentType === 'offline') {
      dataVer2.start_date = this.state.startDate
      dataVer2.end_date = this.state.startDate
      dataVer2.max_marks = this.state.maximumMarks
      dataVer2.min_marks = this.state.minimumMarks
    }
    console.log(dataVer2, 'query_params')
    if (assessmentCreatedId) {
      dataVer2.assessment_id = assessmentCreatedId
    }
    const options = {
      method: assessmentCreatedId ? 'PUT' : 'POST',
      headers: {
        Authorization: 'Bearer ' + this.props.user
      },
      data: dataVer2,
      url: qBUrls.AssessmentNew_v2
    }
    axios(options)
      .then(res => {
        console.log(res)
        if (res.status === 201) {
          let{ assessmentSubType, assessmentType } = this.state
          this.props.alert.success('Assessment Created Successfully proceed to Updating Marks')
          if (assessmentSubType === 'subjective' && assessmentType === 'offline') {
            if (isNewTestId) {
              this.setState({ assessmentCreatedId: res.data[0][0].assessment_id })
              this.props.history.push('/questbox/assessment/view')
            } else {
              this.props.history.push('/questbox/assessment/view')
            }
          } else {
            isNewTestId ? this.setState({ assessmentCreatedId: res.data[0][0].assessment_id, activeStep: 3 }) : this.setState({ activeStep: 3 })
          }
          console.log(this.state.assessmentCreatedId, 'tyuhj')
          // this.state.assessmentCreatedId=
          document.getElementById('formReset').reset()
        } else if (
          res.data === 'students may not be present in any of the sections'
        ) {
          this.props.alert.warning(res.data)
        }
        if (this.state.questionsOfPaper) {
          this.state.questionsOfPaper.map(qus => {
            if ('comprehension_details' in qus) {
              qus.sub_question_details.map(quest => {
                this.state.questionMarksData.push({
                  QuestionId: quest.id,
                  QuestionMark: quest.question_paper_level_marks,
                  UpdatedMarks: '1'
                })
              })
            } else {
              this.state.questionMarksData.push({
                QuestionId: qus.id,
                QuestionMark: qus.question_paper_level_marks,
                UpdatedMarks: '1'
              })
            }
          })
        }
      })
      .catch(error => {
        console.log("Error: Couldn't fetch data from ")
        console.log(error)
      })
      // .catch(error => {
      //   console.log(error.response.status === 400)
      //   if (error.response.status === 409) {
      //     this.props.alert.error('Id Already Exists')
      //   }
      //   console.log("Error: Couldn't fetch data from " + urls.CreateAssessment)
      // })
  };

  isStepOptional = step => step === 1;

  // handleNext = () => {
  //   const { activeStep } = this.state
  //   let { skipped } = this.state
  //   if (this.isStepSkipped(activeStep)) {
  //     skipped = new Set(skipped.values())
  //     skipped.delete(activeStep)
  //   }
  //   this.setState({
  //     activeStep: activeStep + 1,
  //     skipped
  //   })
  // };
  handleNext = () => {
    this.setState({
      branchError: false,
      assessmentTermError: false,
      assessmentTypeError: false,
      assessmentNameError: false,
      testNameError: false,
      testIdError: false,
      endDateError: false,
      startDateError: false,
      durationError: false,
      instructionError: false,
      descriptionError: false,
      gradeError: false,
      sectionError: false,
      subError: false,
      sbsubError: false,
      quesCatError: false,
      QuestionPaperError: false,
      questPaperCatError: false,
      assessmentCategoryError: false,
      assessmentSubTypeError: false,
      minMarksError: false,
      maxMarksError: false,
      osubError: false,
      ogradeError: false

    })
    const { activeStep } = this.state
    if (activeStep === 0) {
      let { assessmentType, assessmentCategoryValue, assessmentName, testId, startDate, endDate, duration, instruction, description, assessmentSubType, termId, testName, maximumMarks, minimumMarks } = this.state
      // if (!branch) {
      //   this.setState({ branchError: true })
      //   return
      // }
      if (assessmentType === 'online') {
        this.setState({ activeStep: activeStep + 2 })
        return
        // this.setState({ assessmentTypeError: true })
        // return
      }

      if (!testId) {
        this.setState({ testIdError: true })
        return
      }

      if (!termId) {
        this.setState({ assessmentTermError: true })
        return
      }

      if (!assessmentSubType && assessmentType === 'offline') {
        this.setState({ assessmentSubTypeError: true })
        return
      }
      if (!assessmentCategoryValue) {
        this.setState({ assessmentCategoryError: true })
        return
      }
      if (!assessmentName) {
        this.setState({ assessmentNameError: true })
        return
      }
      if (!testName && assessmentType === 'offline') {
        this.setState({ testNameError: true })
        return
      }

      if (!minimumMarks && assessmentType === 'offline') {
        this.setState({ minMarksError: true })
        return
      }

      if (!maximumMarks && assessmentType === 'offline') {
        this.setState({ maxMarksError: true })
        return
      }

      if (!startDate) {
        this.setState({ startDateError: true })
        return
      }
      if (!endDate) {
        this.setState({ endDateError: true })
        return
      }
      if (!duration) {
        this.setState({ durationError: true })
        return
      }
      if (!instruction) {
        this.setState({ instructionError: true })
        return
      }
      if (!description) {
        this.setState({ descriptionError: true })
        return
      }
    } else if (activeStep === 1) {
      // // eslint-disable-next-line no-debugger
      // debugger
      console.log(this.state.branch, 'b stpper')
      console.log(this.state.grade, 'g stpper')
      console.log(this.state.section, 's stpper')
      let { mappingGrade, section, valueBranch, subjectID } = this.state
      // let { gradeId, section } = this.state
      if (!valueBranch && !this.state.section_mapping.length && !this.state.usePowerSelector) {
        this.setState({ branchError: true })
        return
      }
      if (!subjectID && this.role === 'Subjecthead' && !this.state.section_mapping.length && !this.state.usePowerSelector) {
        this.setState({ sbsubError: true })
        return
      }
      if (!mappingGrade && !this.state.section_mapping.length && !this.state.usePowerSelector) {
        this.setState({ gradeError: true })
        return
      }
      if (!section && !this.state.section_mapping.length && !this.state.usePowerSelector) {
        this.setState({ sectionError: true })
        return
      }
    } else if (activeStep === 2) {
      // // eslint-disable-next-line no-debugger
      // debugger
      let { subjectVal, QuestionCategory, QuestionPaper, submAssess, osubject_id, ograde_id, assessmentType } = this.state

      if (!subjectVal && assessmentType === 'offline') {
        this.setState({ subError: true })
        return
      }
      if (this.role === 'Subjecthead') {
        if (!osubject_id && assessmentType === 'online') {
          this.setState({ osubError: true })
          return
        }
        if (!ograde_id && assessmentType === 'online') {
          this.setState({ ogradeError: true })
          return
        }
      } else {
        if (!ograde_id && assessmentType === 'online') {
          this.setState({ ogradeError: true })
          return
        }
        if (!osubject_id && assessmentType === 'online') {
          this.setState({ osubError: true })
          return
        }
      }

      if (!QuestionCategory) {
        this.setState({ questPaperCatError: true })
        return
      }
      if (!QuestionPaper) {
        this.setState({ QuestionPaperError: true })
        return
      }
      if (!submAssess) {
        this.setState({ submitError: true })
        return
      }
    } else if (activeStep === 3) {
      let { submMarks } = this.state
      if (!submMarks) {
        this.setState({ submitMarkError: true })
        return
      }
    } else if (activeStep === 4) {
      let { submMarks } = this.state
      if (!submMarks) {
        this.setState({ submitMarkError: true })
        return
      }
    }
    let { skipped } = this.state
    if (this.isStepSkipped(activeStep)) {
      skipped = new Set(skipped.values())
      skipped.delete(activeStep)
    }
    this.setState({
      activeStep: activeStep + 1,
      skipped
    })
  }

  handleBack = () => {
    const { assessmentType, activeStep = 0 } = this.state

    if (activeStep === 2) {
      if (assessmentType === 'online') {
        this.setState({ activeStep: activeStep - 2 })
        return
      }
    }
    if (this.state.activeStep === 3) {
      this.setState(state => ({
        activeStep: state.activeStep - 0
      }))
    } else {
      this.setState(state => ({
        activeStep: state.activeStep - 1
      }))
    }
  };

  handleSkip = () => {
    const { activeStep } = this.state
    if (!this.isStepOptional(activeStep)) {
      // You probably want to guard against something like this,
      // it should never occur unless someone's actively trying to break something.
      throw new Error("You can't skip a step that isn't optional.")
    }

    this.setState(state => {
      const skipped = new Set(state.skipped.values())
      skipped.add(activeStep)
      return {
        activeStep: state.activeStep + 1,
        skipped
      }
    })
  }

  handleReset = () => {
    this.setState({
      activeStep: 0
    })
  };

  isStepSkipped (step) {
    return this.state.skipped.has(step)
  }
  onChangeOnlineAssessment = (data, ...object) => {
    this.setState({ selectorData: data })
    object && object.map(obj => {
      return ({
        gradeData: obj[0] && obj[0].filter(i => {
          if (i.grade_id && i.grade_id.toString() === data.grade_id) {
            this.setState({ gradeName: i.grade_name })
            return i.grade_name
          }
        }),
        subjectData: obj[1] && obj[1].filter(i => {
          if (i.subject_id && i.subject_id.toString() === data.subject_id) {
            this.setState({ subjectName: i.subject_name })
            return i.subject_name || this.state.subjectName
          }
        })

      })
    })
    this.setState({ ograde_id: data.grade_id, osubject_id: data.subject_id })
    console.log(this.state.ograde_id, 'grade_id')
  }
  onChange = (data, ...object) => {
    this.setState({ selectorData: data })
    console.log(data)
    object && object.map(branch => {
      return ({
        branchData: branch[0] && branch[0].filter(i => {
          if (i.branch_id && i.branch_id.toString() === data.branch_id) {
            this.setState({ branchName: i.branch_name })
            return i.branch_name
          }
        }),
        gradeData: branch[1] && branch[1].filter(i => {
          if (i.grade_id && i.grade_id.toString() === data.grade_id) {
            this.setState({ gradeName: i.grade_name })
            return i.grade_name
          }
        }),
        sectionData: branch[2] && branch[2].filter(i => {
          if (i.section_mapping_id && i.section_mapping_id.toString() === data.section_mapping_id) {
            this.setState({ sectionName: i.section_name })
            return i.section_name
          }
        }) })
    })

    console.log(data)
    this.setState({ valueBranch: data.branch_id, grade: data.grade_id })
    if (data.grade_id) {
      this.setState({ mappingGrade: data.grade_id })
    }
    if (data.subject_id) {
      this.setState({ subjectID: data.subject_id })
    }
    const sectionMappindIds = []
    if (data.section_mapping_id) {
      let res = data.section_mapping_id.split(',')
      res.forEach(curr => {
        sectionMappindIds.push(Number(curr))
      })
      this.setState({ section_mapping: sectionMappindIds, section: sectionMappindIds })
    }
  }

  handleOpen = () => {
    this.setState({ right: true })
  };
  handleClose = () => {
    this.setState({ right: false })
  };
  Summary = () => {
    let { assessmentTypeLabel, assessmentCategoryValueLabel, tagLabel, assessmentName, testId, startDate, endDate, duration, instruction, description,
      branchName, gradeName, sectionName, subjectName, questionPaperTypeLabel, QuestionPaperLabel } = this.state
    assessmentTypeLabel = assessmentTypeLabel || 'NO Assessment Type'
    assessmentCategoryValueLabel = assessmentCategoryValueLabel || 'NO Assessment category'
    assessmentName = assessmentName || 'NO Assessment name'
    testId = testId || 'NO Unique Test ID'

    tagLabel = tagLabel || 'No Tag '
    startDate = startDate || 'No Start Date Selected'
    endDate = endDate || 'No End Date Selected'
    duration = duration || 'No duration Mentioned'
    instruction = instruction || 'No Instruction'
    description = description || 'No Description'
    branchName = branchName || 'No Branch'
    gradeName = gradeName || 'No Grade'
    sectionName = sectionName || 'No Section'
    subjectName = subjectName || 'No Subject'
    questionPaperTypeLabel = questionPaperTypeLabel || 'No questionPaperType'
    QuestionPaperLabel = QuestionPaperLabel || 'No QuestionPaperLabel'

    const summarystep1details =
       ['Selected Assessment Type ' + ':' + assessmentTypeLabel,
         'Selected Assessment Category' + ':' + assessmentCategoryValueLabel,
         'Assessment Name ' + ':' + assessmentName,
         'Unique Test ID' + ':' + testId,
         'Start Date' + ':' + startDate,
         'End Date' + ':' + endDate,
         'Duration (HH:MM)' + ':' + duration,
         'Select Tags' + ':' + tagLabel,
         'Instructions' + ':' + instruction,
         'Description' + ':' + description

       ]
    const summarystep2details =
       ['Selected Branch ' + ':' + branchName,
         'Selected Grade' + ':' + gradeName,
         'Selected Section ' + ':' + sectionName

       ]
    const summarystep3detailsOnline =
       [
         'Selected Grade ' + ':' + gradeName,
         'Selected Subject' + ':' + subjectName,
         'Select Question Paper Type' + ':' + questionPaperTypeLabel,
         'Select Question Paper ' + ':' + QuestionPaperLabel

       ]
    const summarystep3detailsoffline =
       [
         'Selected Subject' + ':' + subjectName,
         'Select Question Paper Type' + ':' + questionPaperTypeLabel,
         'Select Question Paper ' + ':' + QuestionPaperLabel

       ]
    console.log(summarystep2details[0].split(':')[1])
    return (
      <React.Fragment>
        <List style={{ padding: 10, fontSize: '1.5rem' }}>Create Assessment Summary
          <Button
            type='button'
            color='red'
            onClick={this.handleClose} >
            <Avatar ><Close /></Avatar>
          </Button></List>
        <h3>Assessment Details :</h3>
        { <ol>{ summarystep1details.map((i, index) => {
          console.log(i, index)
          return <li key={index}>{i ? i.split(':').join(':  ') : ''}</li>
        })}</ol> }
        <Button
          type='button'
          color='primary'
          onClick={e => {
            this.setState({
              activeStep: 0
            })
          }}
        >
                         Go to Assessment Details
        </Button>{this.state.assessmentTypeLabel !== 'online'
          ? <div>
            <h3>Assign To :</h3>
            <ol> {this.props.filter && this.props.filter.data &&
         Object.values(this.props.filter.data.itemData).map((value, index) => (
           <li key={index}>
             Selected Branch :  &nbsp; &nbsp; {value.branch}<br />
             Selected Grade &nbsp; &nbsp;  :{value.grade}<br />
              Selected Section&nbsp;: &nbsp;  :{value.name}</li>

         ))}</ol>
            {summarystep2details[0].split(':')[1] !== 'No Branch'
              ? <ol>{ summarystep2details.map((i, index) => {
                console.log(i, index)
                return <li key={index}>{i ? i.split(':').join(':  ') : ''}</li>
              })}</ol> : ''}
            <Button
              type='button'
              color='primary'
              onClick={e => {
                this.setState({
                  activeStep: 1
                })
              }}
            >
                         Go to Assign To
            </Button></div>
          : ''}
        <h3>Question Paper :</h3>
        {this.state.assessmentTypeLabel === 'online'
          ? <ol>{ summarystep3detailsOnline.map((i, index) => {
            console.log(i, index)
            return <li key={index}>{i ? i.split(':').join(':  ') : ''}</li>
          })}</ol>
          : <ol>{ summarystep3detailsoffline.map((i, index) => {
            console.log(i, index)
            return <li key={index}>{i ? i.split(':').join(':  ') : ''}</li>
          })}</ol> }

      </React.Fragment>)
  }

  handleTermChange = ({ label, value }) => {
    this.setState({ termId: value, termValue: { value: value, label: label } })
  }

  getAssessmentConfigurations = (option) => {
    // eslint-disable-next-line no-debugger
    debugger
    const { assessmentType, assessmentSubType, assessmentCategory } = this.state
    let path = ''
    if (option === 'type') {
      path += `assessment_type=${assessmentType}`
    } else if (option === 'subType') {
      path += `assessment_type=${assessmentType}&assessment_sub_type=${assessmentSubType}`
    } else if (option === 'category') {
      path += `assessment_type=${assessmentType}&assessment_sub_type=${assessmentSubType}&assessment_category=${assessmentCategory}`
    }

    axios.get(`${urls.AssessmentConfiguration}?${path}`, {
      headers: {
        Authorization: 'Bearer ' + this.props.user
      }
    })
      .then(res => {
        // eslint-disable-next-line camelcase
        const { assessment_type = [], assessment_sub_type = [], assessment_category = [], assessment_sub_category = [] } = res.data
        if (!option) {
          this.setState({ assessmentTType: assessment_type })
        } else if (option === 'type') {
          this.setState({ offlineSubTypes: assessment_sub_type })
        } else if (option === 'subType') {
          this.setState({
            offlineCategories: assessment_category
          })
        } else if (option === 'category') {
          this.setState({ assessmentSubCategories: assessment_sub_category })
        }
      })
      .catch(err => {
        console.log(err)
      })
  }

  testIdOnChange = (e) => {
    if (!e) {
      this.setState({ showTestIdLengthError: false, showStatus: false, testId: '' })
      return false
    } else if (e.value.length !== 5) {
      this.setState({ showTestIdLengthError: true, showStatus: false, testId: '' })
      return false
    } else {
      this.setState({ showTestIdLengthError: false }, () => {
        // this.handleTestId(e)
      })
    }
  }

  getStepers (steps, activeStep) {
    console.log(steps, activeStep)
    return (
      <Stepper activeStep={activeStep}>
        {steps.map((label, index) => {
          const props = {}
          const labelProps = {}
          // if (this.isStepOptional(index)) {
          //   labelProps.optional = <Typography variant='caption'>' '</Typography>
          // }
          if (this.isStepSkipped(index)) {
            props.completed = false
          }
          return (
            <Step key={label} {...props}>
              <StepLabel {...labelProps}>{label}</StepLabel>
            </Step>
          )
        })}
      </Stepper>
    )
  }
  getUniqueTestIds = (isScrolled, query, showAvailableStatus) => {
    const { currentPage, uniqueTestIdList, assessmentType } = this.state
    axios.get(`${urls.TestIds}?test_type=${assessmentType}&test_id=${query}&page=${currentPage + 1}&page_size=${10}`, {
      headers: {
        Authorization: 'Bearer ' + this.props.user
      }
    })
      .then(res => {
        let availableStatus = Array.isArray(res.data) && res.data[0] ? res.data[0] : ''
        const { results } = res.data
        const list = results && results.map(result => {
          return { label: result.unique_test_id, value: result.unique_test_id }
        })
        if (availableStatus && showAvailableStatus) {
          if (availableStatus.includes('available')) {
            this.setState({ isNewTestId: true, testId: query, currentPage: currentPage + 1 })
          } else {
            this.setState({ testId: query, currentPage: currentPage + 1, isNewTestId: false }, () => {
              this.getAssessmentByTestId(this.state.testId)
            })
          }
        } else if (isScrolled) {
          this.setState({ uniqueTestIdList: [...uniqueTestIdList, ...list], currentPage: currentPage + 1 })
        } else {
          this.setState({ uniqueTestIdList: list, currentPage: currentPage + 1 })
        }
      })
      .catch(err => {
        console.log('hello')
        console.log(err)
      })
  }

  resetAll=(e) => {
    let { activeStep } = this.state
    // // eslint-disable-next-line no-debugger
    // debugger

    if (activeStep === 0) {
      this.setState({
        selectedTags: [],
        newTag: [],
        startDate: '',
        endDate: '',
        duration: '',
        uniqueTestIdList: null,
        instruction: '',
        description: '',
        termId: '',
        termValue: {},
        testId: '',
        assessmentTypeValue: null,
        assessmentType: '',
        assessmentSubType: '',
        assessmentSubTypeValue: null,
        assessmentCategoryValue: '',
        assessmentCategory: '',
        assessmentName: '',
        testName: '',
        minimumMarks: '',
        maximumMarks: ''

      })
    } else if (activeStep === 1) {
      this.setState({
        selectorData: null,
        section_mapping: '',
        section: '',
        valueBranch: '',
        mappingGrade: '',
        subjectID: '',
        globalSelectorKey: new Date().getTime()
      })
    } else {
      if (this.state.assessmentType === 'online') {
        this.setState({ selectorData: null })
      }
      this.setState({
        selectedTestTypes: {},
        osubject_id: '',
        ograde_id: '',
        subjectId: '',
        subjectValue: {},
        subjectVal: '',
        QuestionCategoryValue: {},
        QuestionPaperCategory: {},
        QuestionCategory: '',
        questionpaperValue: {},
        QuestionPaper: '',
        globalSelectorKey: new Date().getTime()

      })
    }
  }

  render () {
    const { sectionError, branchError, assessmentTypeError, assessmentTermError,
      assessmentNameError, testIdError, endDateError, startDateError,
      durationError, instructionError, descriptionError, gradeError, questPaperCatError,
      subError, QuestionPaperError, submitError, assessmentCategoryError, submitMarkError, assessmentSubTypeError, termList, testNameError, minMarksError, maxMarksError, osubError, ogradeError, sbsubError } = this.state

    const { classes } = this.props
    const steps = getSteps()
    const { activeStep } = this.state
    // let { branchData, sectionData, valueBranch } = this.state
    let ind = 1
    return (
      <React.Fragment>

        {/* <AlertMessage alertMessage={this.state.alertMessage} /> */}
        {/* <div className={classes.root}> */}

        {this.state.assessmentSubType && (this.state.assessmentSubType === 'subjective' && this.state.assessmentType === 'offline') ? this.getStepers(steps.slice(0, 3), activeStep) : this.getStepers(steps, activeStep)}
        {/* </div> */}
        <Form id='formReset' style={{ padding: '0px', margin: '0px' }}>
          <Grid container>
            {this.state.activeStep === 1 ? <React.Fragment>
              <Grid.Row style={{ padding: '0px' }}>
                <Grid.Column
                  computer={5}
                  mobile={16}
                  tablet={16}
                >
                  {/* <label>Branch*</label>
                  <OmsSelect
                    options={this.role === 'Admin'
                      ? this.props.branches
                        ? this.props.branches.map((branch) => ({
                          value: branch.id,
                          label: branch.branch_name }))
                        : []
                      : branchData
                    }
                    required
                    defaultValue={valueBranch}
                    placeholder='Select Branch'
                    change={this.changehandlerbranch}
                    disabled={this.role === 'Principal' || this.role === 'Teacher' || this.role === 'BDM' || this.state.usePowerSelector}
                  /> */}
                  {branchError && (
                    <Typography style={{ color: 'red' }}>Select Branch</Typography>
                  )}
                </Grid.Column>
                <Grid.Column
                  computer={5}
                  mobile={16}
                  tablet={5}
                >
                  {sbsubError && (
                    <Typography style={{ color: 'red' }}>Select Subject</Typography>
                  )}
                </Grid.Column>

                <Grid.Column
                  computer={5}
                  mobile={16}
                  tablet={5}
                >
                  {gradeError && (
                    <Typography style={{ color: 'red' }}>Select grade</Typography>
                  )}
                </Grid.Column>

                <Grid.Column
                  computer={5}
                  mobile={16}
                  tablet={5}
                >
                  {sectionError && (
                    <Typography style={{ color: 'red' }}>Select section</Typography>
                  )}
                </Grid.Column>
              </Grid.Row>
              <Grid.Row>
                <GSelect key={this.state.globalSelectorKey}initialValue={this.state.selectorData}config={COMBINATIONS} variant={'selector'} onChange={this.onChange} />
              </Grid.Row>
              <Grid.Row style={{ justifyContent: 'center' }}>
                <span>or</span>
              </Grid.Row>
              <Grid.Row style={{ justifyContent: 'center' }}>
                <PSelect section selectedItems={this.state.section_mapping} onClick={() => { console.log('Setting powerselector'); this.setState({ usePowerSelector: true }) }} />
              </Grid.Row>
            </React.Fragment> : '' }
            {this.state.activeStep === 2 ? <Grid.Row>
              {/* {this.state.handleClickGrade ? <Grid.Row> */}
              {this.state.assessmentType === 'offline' ? <Grid.Column
                computer={5}
                mobile={16}
                tablet={16}
              >
                <label>Select Subject*</label>
                <OmsSelect
                  defaultValue={this.state.subjectValue}
                  placeholder='Select Subject'
                  options={
                    (() => {
                      if (this.role === 'Subjecthead') {
                        let { subjectData = [] } = this.state
                        return subjectData.map(item => ({ label: item.name, value: item.id }))
                      }
                      return this.props.subjects
                        ? this.props.subjects.map(subject => ({
                          value: subject.id,
                          label: subject.subject_name
                        }))
                        : []
                    })()
                  }
                  change={this.handleClickSubject}
                  required
                />
                {subError && (
                  <Typography style={{ color: 'red' }}>Select Subject</Typography>
                )}
              </Grid.Column> : <div> <GSelect key={this.state.globalSelectorKey}initialValue={this.state.selectorData} config={OFFLINECONFIG} variant={'selector'} onChange={this.onChangeOnlineAssessment} />
                {osubError && (
                  <Typography style={{ color: 'red', marginLeft: this.role !== 'Subjecthead' ? '200px' : 0 }}>Select Subject</Typography>
                )}
                {ogradeError && (
                  <Typography style={{ color: 'red', marginLeft: this.role === 'Subjecthead' ? '200px' : 0 }}>Select Grade</Typography>
                )}</div>}
              {this.state.assessmentSubType !== 'subjective' && <Grid.Column
                computer={5}
                mobile={16}
                tablet={16}
              >
                <label>Select Question Paper Type</label>
                <OmsSelect
                  defaultValue={this.state.QuestionCategoryValue}
                  placeholder='Select Question Paper Type '
                  options={
                    this.state.questionCategory
                      ? this.state.questionCategory.map(
                        questionCategory => ({
                          value: questionCategory.id,
                          label: questionCategory.question_paper_type
                        })
                      )
                      : []
                  }
                  change={this.handleQuestionCategory}
                  required
                />
                {questPaperCatError && (
                  <Typography style={{ color: 'red' }}>Select Question Paper Category</Typography>
                )}
              </Grid.Column>}
              {this.state.assessmentSubType !== 'subjective' && <Grid.Column
                computer={5}
                mobile={16}
                tablet={5}
              >
                <label>Select Question Paper</label>
                <OmsSelect
                  defaultValue={this.state.questionpaperValue}
                  placeholder='Select Question Paper'
                  options={this.state.questionPapers}
                  change={this.handleQuestionPaper}
                  required
                />
                {QuestionPaperError && (
                  <Typography style={{ color: 'red' }}>Select Question Paper</Typography>
                )}
              </Grid.Column>}
            </Grid.Row> : '' }
            {this.state.activeStep === 2 ? <Grid columns={3}>

              <Grid.Row>
                <Grid.Column computer={6}
                  mobile={16}
                  tablet={16} >
                  <Button
                    type='button'
                    color='primary'
                    onClick={this.handleOpen}
                  >
                          Summary
                  </Button>
                  <Drawer anchor='right' open={this.state.right} onClose={this.handleClose}>
                    {this.Summary()}
                  </Drawer>
                </Grid.Column>

                <Grid.Column
                  computer={6}
                  mobile={16}
                  tablet={16}
                >
                  <Button
                    type='submit'
                    color='green'
                    onClick={this.handleSubmitAssessment}
                  >
                    {submitError && (
                      <Typography style={{ color: 'red' }}>Submit to assign marks</Typography>
                    )}
                            Create Assessment
                  </Button>
                </Grid.Column>
                <Grid.Column />
              </Grid.Row>
            </Grid> : '' }

            {this.state.activeStep === 0 ? <Grid.Row>
              <Grid.Column
                computer={5}
                mobile={16}
                tablet={5}
                style={{ marginBottom: 20 }}
              >
                <label>Select Assessment Type</label>
                <Select
                  placeholder='Select Assessment Type'
                  value={this.state.assessmentTypeValue}
                  required
                  options={
                    this.state.assessmentTType
                      ? this.state.assessmentTType.map(type => {
                        return { value: type,
                          label: type
                        }
                      })
                      : []
                  }
                  onChange={e => {
                    this.setState({
                      assessmentCategoryValue: '',
                      assessmentType: e.value,
                      assessmentTypeValue: e,
                      showAssessmentCategory: e.value !== 'offline',
                      assessmentSubTypeValue: ''
                    }, () => {
                      this.getUniqueTestIds(false, '', false)
                      if (e.value === 'offline') {
                        this.getAssessmentConfigurations('type')
                      }
                    })
                  }}
                />
                {assessmentTypeError && (
                  <Typography style={{ color: 'red' }}>Select Assessment Type</Typography>
                )}
              </Grid.Column>
              <Grid.Column
                computer={6}
                mobile={16}
                tablet={5}
              >
                <label>Unique Test ID</label>
                <CreatableSelect
                  isDisabled={!this.state.assessmentType}
                  isClearable
                  value={{ label: this.state.testId, value: this.state.testId }}
                  onChange={(e) => {
                    if (!e) {
                      this.getUniqueTestIds(false, '', true)
                      this.setState({ showTestIdLengthError: false })
                    } else if (e && e.value.length === 5) {
                      this.getUniqueTestIds(false, e.value, true)
                      this.setState({ showTestIdLengthError: false })
                    } else {
                      this.setState({ showTestIdLengthError: true })
                    }
                  }}
                  options={this.state.uniqueTestIdList ? this.state.uniqueTestIdList : []}
                  onMenuScrollToBottom={(event) => {
                    this.getUniqueTestIds(true, '', false)
                  }}
                  onInputChange={(value) => {
                    if (value) {
                      this.setState({ currentPage: 0 }, () => {
                        this.getUniqueTestIds(false, value, false)
                      })
                    }
                  }}
                />
                {testIdError && (
                  <Typography style={{ color: 'red' }}>Add Test Id</Typography>
                )}
                {
                  this.state.showTestIdLengthError
                    ? (<p style={{ color: 'red' }}>Test Id should be 5 digits</p>)
                    : ''
                }
              </Grid.Column>
              <Grid.Column
                computer={5}
                mobile={16}
                tablet={3}
              >
                <OmsSelect
                  label={'Term'}
                  value={this.state.termValue}
                  options={termList.map((term) => {
                    return { label: term.term, value: term.id }
                  })}
                  change={this.handleTermChange}
                  defaultValue={this.state.termValue}

                />
                {assessmentTermError && (
                  <Typography style={{ color: 'red' }}>Select Assessment Term</Typography>
                )}
              </Grid.Column>
              {
                this.state.assessmentType && this.state.assessmentType === 'offline'
                  ? <Grid.Column
                    computer={5}
                    mobile={16}
                    tablet={5}
                  >
                    <label>Select Assessment Subtype</label>
                    <Select
                      placeholder='Select Assessment SubType'
                      value={this.state.assessmentSubTypeValue}
                      required
                      options={
                        this.state.offlineSubTypes
                          ? this.state.offlineSubTypes.map(type => {
                            return {
                              value: type,
                              label: type
                            }
                          })
                          : []
                      }
                      onChange={e => {
                        console.log(e)
                        this.setState({
                          assessmentSubTypeValue: e,
                          assessmentSubType: e.value,
                          showAssessmentCategory: true
                        }, () => {
                          this.getAssessmentConfigurations('subType')
                        })
                      }}
                    />
                    {assessmentSubTypeError && (
                      <Typography style={{ color: 'red' }}>Select Assessment Subtype</Typography>
                    )}
                  </Grid.Column>
                  : ''
              }
              {
                this.state.assessmentType !== 'offline'
                  ? <Grid.Column
                    computer={5}
                    mobile={16}
                    tablet={5}
                  >
                    <label>Select Assessment Category</label>

                    <Select
                      placeholder='Select Assessment  Category'
                      value={this.state.assessmentCategoryValue}
                      required
                      options={
                        this.state.assessmentCCategory
                          ? this.state.assessmentCCategory.map(category => ({
                            value: category,
                            label: category
                          }))
                          : []
                      }
                      onChange={e => {
                        this.setState({
                          assessmentCategory: e.value,
                          assessmentCategoryValue: e,
                          assCat: e
                        })
                      }}
                    />
                    {assessmentCategoryError && (
                      <Typography style={{ color: 'red' }}>Select Assessment category</Typography>
                    )}
                  </Grid.Column>
                  : ''
              }
              {
                this.state.assessmentType === 'offline' && this.state.showAssessmentCategory
                  ? <Grid.Column
                    computer={5}
                    mobile={16}
                    tablet={5}
                  >
                    <label>Select Assessment Category</label>

                    <Select
                      placeholder='Select Assessment  Category'
                      value={this.state.assessmentCategoryValue}
                      required
                      options={
                        this.state.offlineCategories &&
                        this.state.offlineCategories.map(category => ({
                          value: category,
                          label: category
                        }))
                      }
                      onChange={e => {
                        this.setState({
                          assessmentCategory: e.value,
                          assessmentCategoryValue: e,
                          assCat: e
                        }, () => {
                          // eslint-disable-next-line no-debugger
                          debugger
                          this.getAssessmentConfigurations('category')
                        })
                      }}
                    />
                    {assessmentCategoryError && (
                      <Typography style={{ color: 'red' }}>Select Assessment category</Typography>
                    )}
                  </Grid.Column>
                  : ''
              }
              {
                this.state.assessmentCategoryValue && this.state.assessmentType === 'offline'
                  ? <Grid.Column
                    computer={5}
                    mobile={16}
                    tablet={5}
                  >
                    <label>Select Assessment SubCategory</label>
                    <Select
                      placeholder='Select Assessment SubCategory'
                      value={this.state.assessmentSubCategoryValue}
                      required
                      options={
                        this.state.assessmentSubCategories &&
                        this.state.assessmentSubCategories.map(category => {
                          return { value: category, label: category }
                        })
                      }
                      onChange={e => {
                        this.setState({
                          assessmentSubCategoryValue: e,
                          assessmentSubCategory: e.value
                        })
                      }}
                    />
                  </Grid.Column>
                  : ''
              }

            </Grid.Row> : '' }
            {
              this.state.activeStep === 0
                ? (<Grid.Row>
                  <Grid.Column
                    computer={5}
                    mobile={16}
                    tablet={16}
                  >
                    <label>Assessment Name</label>

                    <input
                      type='text'
                      value={this.state.assessmentName}
                      required
                      onChange={e => {
                        this.setState({ assessmentName: e.target.value })
                      }}
                      className='form-control'
                      name='assessmentName'
                    />
                    {assessmentNameError && (
                      <Typography style={{ color: 'red' }}>Add Assessment Name</Typography>
                    )}
                  </Grid.Column>
                  <Grid.Column
                    computer={5}
                    mobile={16}
                    tablet={16}
                  >
                    <label>Test Name</label>

                    <input
                      type='text'
                      value={this.state.testName}
                      required
                      onChange={e => {
                        this.setState({ testName: e.target.value })
                      }}
                      className='form-control'
                      name='testName'
                    />
                    {testNameError && (
                      <Typography style={{ color: 'red' }}>Add Test Name</Typography>
                    )}
                  </Grid.Column>
                </Grid.Row>)
                : ''
            }
            {this.state.activeStep === 0 && this.state.assessmentType === 'offline' ? <Grid.Row>
              <Grid.Column
                computer={5}
                mobile={16}
                tablet={16}
              >
                <label>Minimum marks</label>

                <input
                  type='text'
                  value={this.state.minimumMarks}
                  required
                  onChange={e => {
                    this.setState({ minimumMarks: e.target.value })
                  }}
                  className='form-control'
                  name='minimumMarks'
                />
                {minMarksError && (
                  <Typography style={{ color: 'red' }}>Enter Minimum Marks</Typography>
                )}
              </Grid.Column>
              <Grid.Column
                computer={5}
                mobile={16}
                tablet={16}
              >
                <label>Maximum marks</label>

                <input
                  type='text'
                  value={this.state.maximumMarks}
                  required
                  onChange={e => {
                    this.setState({ maximumMarks: e.target.value })
                  }}
                  className='form-control'
                  name='maximumMarks'
                />
                {maxMarksError && (
                  <Typography style={{ color: 'red' }}>Enter Maximum Marks</Typography>
                )}
              </Grid.Column>
              <Grid.Column
                computer={5}
                mobile={16}
                tablet={5}
              >
                <label>Test Date</label>
                <input
                  type='date'
                  value={this.state.startDate}
                  required
                  onChange={e => {
                    this.setState({ startDate: e.target.value })
                  }}
                  className='form-control'
                  name='startDate'
                  id='startDate'
                />
                {startDateError && (
                  <Typography style={{ color: 'red' }}>Select Start Date</Typography>
                )}
              </Grid.Column>
              <Grid.Column
                computer={5}
                mobile={16}
                tablet={5}
              >
                <label>Marks Entering Ends On</label>

                <input
                  type='date'
                  value={this.state.endDate}
                  className='form-control'
                  name='endDate'
                  id='endDate'
                  onChange={this.handleEndDate}
                  required
                />
                {endDateError && (
                  <Typography style={{ color: 'red' }}>Select End Date</Typography>
                )}
              </Grid.Column>
            </Grid.Row> : '' }
            {this.state.activeStep === 0 ? <Grid.Row>
              <Grid.Column
                computer={5}
                mobile={16}
                tablet={5}
              >
                <label>Duration (HH:MM)</label>

                <input
                  type='time'
                  value={this.state.duration}
                  required
                  onChange={e => {
                    console.log(e.target.value, 'duration')
                    this.setState({ duration: e.target.value })
                    console.log(this.setState.duration, 'duraaa')
                    if (e.target.value === '00:00') {
                      this.props.alert.error('Invalid Duration')
                    }
                  }}
                  className='form-control'
                  name='duration'
                />
                {durationError && (
                  <Typography style={{ color: 'red' }}>Enter Duration</Typography>
                )}
              </Grid.Column>
              <Grid.Column
                computer={5}
                mobile={16}
                tablet={5}
              >
                <label>Select Tags:</label>
                <CreatableSelect
                  onChange={(e, a) => {
                    this.handleTags(e, a)
                  }}
                  isMulti
                  options={this.state.tags ? this.state.tags : []}
                  value={(() => { let { selectedTags = [], newTags = [] } = this.state; return [...selectedTags, ...newTags] })()}
                />
              </Grid.Column>
            </Grid.Row> : '' }
            {this.state.activeStep === 0 ? <Grid.Row>
              <Grid.Column
                computer={5}
                mobile={16}
                tablet={5}
              >
                <label>Instructions</label>

                <TextArea
                  onChange={e => {
                    this.setState({ instruction: e.target.value })
                  }}
                  className='form-control'
                  required
                  name='instruction'
                  autoHeight
                  placeholder='Instructions'
                  value={this.state.instruction}
                  style={{ minHeight: 100 }}
                />
                {instructionError && (
                  <Typography style={{ color: 'red' }}>Add Instruction</Typography>
                )}
              </Grid.Column>

              <Grid.Column
                computer={5}
                mobile={16}
                tablet={5}
              >
                <label>Description</label>

                <TextArea
                  onChange={e => {
                    this.setState({ description: e.target.value })
                  }}
                  className='form-control'
                  name='description'
                  required
                  autoHeight
                  placeholder='Description'
                  value={this.state.description}
                  style={{ minHeight: 100 }}
                />
                {descriptionError && (
                  <Typography style={{ color: 'red' }}>Add Description</Typography>
                )}
              </Grid.Column>
            </Grid.Row> : '' }
          </Grid>
        </Form>
        {
          this.state.activeStep === 4 ? <div>step 4</div> : ''
        }
        {this.state.assessmentSubTypeValue !== 'Subjective' && this.state.activeStep === 3 ? <Form onSubmit={this.handleMarksSubmit} id='formReset2'>
          <Grid>
            <Grid.Row>
              <Grid.Row style={{ width: '100%' }}>
                {console.log(this.state.questionsOfPaper, 'render')}
                {console.log(this.state.CompQuestionsOfPaper, 'render comp quest')}
                {/* {this.state.questionsOfPaper && this.state.questionsOfPaper.data ? ( */}
                {this.state.questionsOfPaper ? (
                  this.state.questionsOfPaper.map((qus) => (
                    !('comprehension_details' in qus) ? (
                      <Segment>
                        <Segment>{ (ind++) })&nbsp;&nbsp;{ReactHtmlParser(qus.question)}
                          <div style={{ width: '10%', float: 'right', marginTop: '-20px' }}>
                              Marks:
                            <input
                              label='select'
                              placeholder='1'
                              name='question_marks'
                              id='textbox1'
                              onChange={this.handleMarksField(qus.id)}
                            />
                          </div>
                        </Segment>
                        <div>
                            Options:
                          {qus.options ? (
                            <div style={{ marginLeft: '20px' }}>
                              {console.log(qus.options.option1, 'option1 norm')}
                              {console.log(qus.options['option1'], 'option1')}
                              <p>a.&nbsp;&nbsp;{ReactHtmlParser(qus.options['option1'])}</p>
                              <p>b.&nbsp;&nbsp;{ReactHtmlParser(qus.options['option2'])}</p>
                              <p>c.&nbsp;&nbsp;{ReactHtmlParser(qus.options['option3'])}</p>
                              <p>d.&nbsp;&nbsp;{ReactHtmlParser(qus.options['option4'])}</p>
                              {console.log(qus.options, 'ques options')}
                            </div>
                          ) : (
                            <div />
                          )}
                        </div>
                        <br />
                        <div>
                            Ans:&nbsp;&nbsp;{qus.correct_ans.substring(2, 9)}{' '}
                        </div>

                        <div style={{ marginTop: '20px' }} />
                      </Segment>
                    ) : (
                      <Segment>
                        <Segment>{ (ind++) })&nbsp;&nbsp; {ReactHtmlParser(qus.comprehension_details.comprehension_question)}
                          {qus.sub_question_details.map((quest, k) => (
                            <React.Fragment>
                              <Segment>{ (k + 1) })&nbsp;&nbsp; {ReactHtmlParser(quest.question)}
                                <div style={{ width: '10%', float: 'right', marginTop: '-20px' }}>
                                    Marks:
                                  <input
                                    label='select'
                                    placeholder='1'
                                    name='question_marks'
                                    id='textbox1'
                                    onChange={this.handleMarksField(quest.id)}
                                  />
                                </div>
                              </Segment>
                              <div>
                                Options:
                                {quest.options ? (
                                  <div style={{ marginLeft: '20px' }}>
                                    {console.log(quest.options.option1, 'option1 norm')}
                                    {console.log(quest.options['option1'], 'option1')}
                                    <p>a.{ReactHtmlParser(quest.options['option1'])}</p>
                                    <p>b.{ReactHtmlParser(quest.options['option2'])}</p>
                                    <p>c.{ReactHtmlParser(quest.options['option3'])}</p>
                                    <p>d.{ReactHtmlParser(quest.options['option4'])}</p>
                                    {console.log(qus.options, 'ques options')}
                                  </div>
                                ) : (
                                  <div />
                                )}
                              </div>
                              <br />
                              <div>
                                  Ans:&nbsp;&nbsp;{quest.correct_ans.substring(2, 9)}{' '}
                              </div>

                              <div style={{ marginTop: '20px' }} />
                            </React.Fragment>
                          ))
                          }
                        </Segment>
                      </Segment>
                    )
                  ))
                ) : (
                  <div>
                    {console.log('not here')}
                        No data
                  </div>
                )}
              </Grid.Row>
              <Grid.Row style={{ marginTop: '20px' }}>
                <Grid.Column
                  computer={6}
                  mobile={16}
                  tablet={16}
                  style={{ float: 'centre' }}
                >
                  <Button
                    type='submit'
                    color='green'
                  >
                    {submitMarkError && (
                      <Typography style={{ color: 'red' }}>update marks to proceed</Typography>
                    )}
                            UPDATE Marks
                  </Button>
                </Grid.Column>
              </Grid.Row>
            </Grid.Row>
          </Grid>
        </Form> : ''}
        {activeStep === steps.length ? (
          <div>
            <Typography className={classes.instructions}>
                    All steps completed - you&apos;re finished
            </Typography>
            <Button onClick={this.handleReset} className={classes.button}>
                    Reset
            </Button>
          </div>
        ) : (
          <div>
            <Typography className={classes.instructions}>{getStepContent(activeStep)}</Typography>
            <div>
              <Button
                disabled={activeStep === 0}
                onClick={this.handleBack}
                className={classes.button}>
                        Back
              </Button>
              <Button
                variant='contained'
                color='primary'
                onClick={this.handleNext}
                className={classes.button}
              >
                {activeStep === steps.length - 1 && this.state.submScore ? 'Finish' : 'Next'}
              </Button>
            </div>
          </div>
        )}
        {activeStep !== 3 && <div>

          <Button
            style={{ float: 'right', margin: '-30px 20px 20px 0px' }}
            onClick={
              (e) => this.resetAll(e)

            }
            variant='outlined'
            color='primary'
            size='small'

          >
            <ClearIcon />
               clear
          </Button>

        </div>}
      </React.Fragment>
    )
  }
}

const mapStateToProps = state => ({
  user: state.authentication.user,
  branches: state.branches.items,
  section: state.sectionMap.items,
  grades: state.gradeMap.items,
  gradeLoader: state.gradeMap.loading,
  sectionLoader: state.sectionMap.loading,
  subjects: state.subjects.items
})

const mapDispatchToProps = dispatch => ({
  loadBranches: () => dispatch(apiActions.listBranches()),
  sectionMap: gradeMapId => dispatch(apiActions.getSectionMapping(gradeMapId)),
  listSubjects: dispatch(apiActions.listSubjects()),
  listBranches: dispatch(apiActions.listBranches()),
  listSections: dispatch(apiActions.listSections()),
  getSubjects: subjectId => dispatch(apiActions.getSubjects()),
  gradeMapBranch: (branchId) => dispatch(apiActions.getGradeMapping(branchId))
})

export default withStyles(styles)(connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(CreateAssessment)))
