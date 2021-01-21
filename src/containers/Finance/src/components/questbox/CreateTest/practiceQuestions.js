import React, { Component } from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import axios from 'axios'
import CheckedIcon from '@material-ui/icons/CheckCircle'
import { withStyles, Stepper, Step, StepLabel, Typography, CardContent, Badge } from '@material-ui/core'
import Grid from '@material-ui/core/Grid'
import Card from '@material-ui/core/Card'
// import List from '@material-ui/core/List'
// import ListItem from '@material-ui/core/ListItem'
import Button from '@material-ui/core/Button'
import { urls, qBUrls } from '../../../urls'
import { InternalPageStatus } from '../../../ui'
import TestModule from './testModuleQuestionWise'
// import Finish from '../../Test/finish'
import './hoverEffect.css'

class PracticeQuestions extends Component {
  constructor () {
    super()

    this.state = {

      currentPage: 1,
      expandedStats: null,
      chapters: [],
      questionList: [],
      subjectWiseQuestCount: [],
      chapterWiseQuestCount: [],
      activeStepper: 0,
      activeStep: 0,
      currentSubjectIndex: '',
      currentChapterIndex: '',
      currentLevelIndex: '',
      skipped: new Set(),
      loading: true }
    this.userProfile = JSON.parse(localStorage.getItem('user_profile'))
    this.renderSubjectsCard = this.renderSubjectsCard.bind(this)
    this.renderChapters = this.renderChapters.bind(this)
    this.renderQuestionLevel = this.renderQuestionLevel.bind(this)
    this.getStepContent = this.getStepContent.bind(this)
    this.getSteps = this.getSteps.bind(this)
    this.guestStudentGradeId = this.userProfile.personal_info.role === 'GuestStudent' && this.userProfile.academic_profile.grade
    console.log(this.userProfile.personal_info.role, 'roleeeeeeeeeeee')
  }

  componentDidMount () {
    this.role = this.userProfile.personal_info.role
    let acadGrade = this.userProfile
    if (this.role === 'Student') {
      this.setState({
        branchGradeId: acadGrade.acade_branch_grade_id,
        gradeId: acadGrade.grade_id
      }, () => {
        this.getSubjects()
        this.getQuestionLevel()
        this.getQuestionCount()
      })
    } else if (this.role === 'GuestStudent') {
      this.setState({
        branchGradeId: acadGrade.acade_branch_grade_id,
        gradeId: this.userProfile.academic_profile.grade
      }, () => { this.getSubjects() })
    }
  }
  getSteps () {
    return ['Select Subjects', 'Select Chapters', 'select Level', 'Practice Questions']
  }
  getStepContent (step) {
    switch (step) {
      case 0:
        return 'Select campaign settings...'
      case 1:
        return 'What is an ad group anyways?'
      case 2:
        return 'This is the bit I really care about!'
      default:
        return 'Unknown step'
    }
  }
    isStepOptional = step => step === 2;
    handleNext = () => {
      const { activeStep, currentSubjectIndex, currentChapterIndex, currentLevelIndex } = this.state
      if (activeStep === 0) {
        if (!currentSubjectIndex.toString()) {
          this.props.alert.warning('Select Subject')
        } else {
          this.setState({
            activeStep: activeStep + 1
          })
        }
      }
      if (activeStep === 1) {
        if (!currentChapterIndex.toString()) {
          this.props.alert.warning('Select Chapter')
        } else {
          this.setState({
            activeStep: activeStep + 1
          })
        }
      }
      if (activeStep === 2) {
        if (!currentLevelIndex.toString()) {
          this.props.alert.warning('Select Level')
        } else {
          this.setState({
            activeStep: activeStep + 1

          })
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
    isStepSkipped (step) {
      return this.state.skipped.has(step)
    }
    handleSkip = () => {
      const { activeStep } = this.state
      if (activeStep === 2) {
        this.getQuestionsList(1, null, true)
      }
      if (!this.isStepOptional(activeStep)) {
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

    handleBack = () => {
      this.setState(state => ({
        activeStep: state.activeStep - 1,
        currentLevelIndex: ''
      }))
    };
    handleReset = () => {
      this.setState({
        activeStep: 0
      })
    };
    getQuestionCount = () => {
      let { gradeId } = this.state
      console.log(gradeId)
      this.setState({ loading: true })
      var path = urls.GetQuestionCount + '?'
      path += 'grade_id=' + gradeId + '&'
      axios.get(path, {
        headers: {
          'Authorization': 'Bearer ' + this.props.user
        }
      }).then((res) => {
        console.log(res, 'ressss')
        if (res.status === 200) {
          this.setState({ questionCount: res.data.data,
            subjectWiseQuestCount: res.data.data.map(item => item.qns_count),
            totalQuestionCount: res.data.total_count.map(item => item.total_count),
            loading: false
          })
          console.log(this.state.questionCount, 'dataa')
        }
      })
        .catch(e => console.log(e))
    }
    getChapters=(subjectId, currentSubjectIndex) => {
      let { state: { gradeId, activeStep } } = this
      this.setState({ subjectId, isChapLoading: true, currentSubjectIndex })
      var path = urls.ChapterWiseQuesCount + '?'
      path += gradeId ? 'grade_id=' + gradeId + '&' : ''
      path += subjectId ? 'subject_id=' + subjectId + '&' : ''
      path += 'feature=' + 'practice_questions' + '&is_hidden=False'

      axios.get(path, {
        headers: {
          'Authorization': 'Bearer ' + this.props.user
        }
      })
        .then((res) => {
          console.log(res, 'ressss')
          if (res.status === 200) {
            this.setState({ chapters: res.data.data,
              loading: false,
              chapterWiseQuestCount: res.data.data.map(item => item.qns_count),
              isChapLoading: false,
              totalChapterQuestionCount: res.data.total_count,
              activeStep: activeStep + 1

            })
          // console.log(this.state.subjectData, 'dataa')
          }
        })
      // .then((res) => {
      //   console.log(res, 'ressss')
      //   if (res.status === 200) {
      //     let data = res.data.data
      //     if (Array.isArray(data)) {
      //       this.setState({ chapters: data,
      //         isChapLoading: false,
      //         chapterWiseQuestCount: data.data.map(item => item.qns_count),
      //         totalChapterQuestionCount: data.total_count
      //       })
      //     } else {
      //       this.setState({ chapters: [] })
      //     }
      //     console.log(res.data, 'chapters')
      //   }
      // }

        .catch(e => {
          this.setState({ isChapLoading: false })
        })
    }
    getQuestionLevel = (currentChapterIndex) => {
      let { gradeId, subjectId, chapterId, activeStep } = this.state
      var path = qBUrls.QuestionLevelV2 + '?'
      path += gradeId ? 'grade_id=' + gradeId + '&' : ''
      path += subjectId ? 'subject_id=' + subjectId + '&' : ''
      path += chapterId ? 'chapter_id=' + chapterId + '&' : ''
      path += 'feature=' + 'practice_questions' + '&'
      axios
        .get(path, {
          headers: {
            Authorization: 'Bearer ' + this.props.user
          }
        })
        .then(res => {
          console.log('Qustn level: ', res.data)
          if (Array.isArray(res.data.data)) {
            let qLvl = []
            for (let i = 0; i < res.data.data.length; i++) {
              qLvl[i] = { ...res.data.data[i], label: res.data.data[i].question_level }
            }
            this.setState({ questionLevel: qLvl,
              activeStep: activeStep + 1,
              levelWiseQuestCount: res.data.data.map(item => item.qns_count),
              totalLevelCount: res.data.total_count,
              currentChapterIndex,
              selectedQuestionLevel: qLvl.map(type => ({
                value: type.id,
                label: type.question_level
              }))
            })
          }
          if (typeof res.data.data === 'string') {
            console.log(res.data.data)
          }
        })
        .catch(error => {
          console.log("Error: Couldn't fetch data from " + qBUrls.QuestionLevelV2)
          console.log(error)
        })
    }

  getSubjects = (state) => {
    let { state: { gradeId, activeStep } } = this
    this.setState({ loading: true })
    var path = urls.GetQuestionCount + '?'
    if (this.role !== 'GuestStudent') {
      path += gradeId ? 'grade_id=' + gradeId + '&' : ''
    } else {
      path += 'grade_id=' + this.guestStudentGradeId
    }

    axios.get(path, {
      headers: {
        'Authorization': 'Bearer ' + this.props.user
      }
    }).then((res) => {
      console.log(res, 'ressss')
      if (res.status === 200) {
        this.setState({ subjectData: res.data.data,
          loading: false,
          subjectWiseQuestCount: res.data.data.map(item => item.qns_count),
          totalQuestionCount: res.data.total_count,
          activeStep: activeStep + 0

        })
        console.log(this.state.subjectData, 'dataa')
      }
    })
      .catch(e => console.log(e))
  }
  argRequired = () => {
    // eslint-disable-next-line no-throw-literal
    throw 'Parameter required in decideCardCursorPointer'
  }
decideCardCursorPointer = (itemCount = this.argRequired()) => {
  try {
    itemCount = Number(itemCount)
    if (itemCount) {
      return { 'cursor': 'pointer' }
    } else {
      return { 'cursor': 'not-allowed' }
    }
  } catch (err) {
    console.error(err)
    return {}
  }
}
renderSubjectsCard () {
  let { subjectData = [], loading, currentSubjectIndex } = this.state
  if (loading) {
    return <InternalPageStatus label={`Loading Subjects...`} />
  }
  return subjectData.map((subject, index) => (<Grid style={{ margin: 8 }} item>

    <Card className='hoverEffect' style={{ padding: 16, overflow: 'hidden', ...this.decideCardCursorPointer(this.state.subjectWiseQuestCount[index]) }}
      onClick={
        () => {
          if (Number(this.state.subjectWiseQuestCount[index])) {
            this.getChapters(subject.subject_id, index)
          }
        }}>
      <Badge
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right'
        }}
        badgeContent={this.state.subjectWiseQuestCount[index]}
        color='primary'
      >
        <CardContent
          button
          onClick={
            () => {
              if (Number(this.state.subjectWiseQuestCount[index])) {
                this.getChapters(subject.subject_id, index)
              }
            }}
        >
          {subject.subject_name}<br />
          {/* (No. of Questions: {this.state.subjectWiseQuestCount[index]} ) */}
        </CardContent>
      </Badge>
      {currentSubjectIndex === index && <CheckedIcon fontSize={'small'} color={'secondary'} />}
    </Card></Grid>))
}

renderChapters (cardSubId) {
  let { chapters = [], isChapLoading, subjectId, currentChapterIndex } = this.state
  if (Number(subjectId) === Number(cardSubId)) {
    // if (!chapters.length) { return <p>No Chapters Available</p> }
    if (isChapLoading) {
      return <InternalPageStatus label={`Loding Chapters...`} />
    }
    return chapters.map((chapter, index) => (<Grid style={{ margin: 8 }} item>
      <Card className='hoverEffect' style={{ padding: 16, overflow: 'hidden', ...this.decideCardCursorPointer(this.state.chapterWiseQuestCount[index]) }}>
        <Badge anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right'
        }} badgeContent={this.state.chapterWiseQuestCount.length > 0 && this.state.chapterWiseQuestCount[index]} color='primary'>
          <CardContent button onClick={() => {
            if (Number(this.state.chapterWiseQuestCount[index])) {
              this.setState({ chapterId: chapter.id, activeStepper: 0 }, () => this.getQuestionLevel(index))
            }
          }}>
            {chapter.chapter_name} <br />
          </CardContent>
        </Badge>
        {currentChapterIndex === index && <CheckedIcon fontSize={'small'} color={'secondary'} />}
      </Card></Grid>))
  } else {
    return null
  }
}
renderQuestionLevel () {
  let { questionLevel = [], isChapLoading, currentLevelIndex } = this.state
  if (isChapLoading) {
    return <InternalPageStatus label={`Loding Question Level...`} />
  }
  return questionLevel.map((level, index) => (<Grid style={{ margin: 8 }} item>
    <Card className='hoverEffect' style={{ padding: 16, overflow: 'hidden', ...this.decideCardCursorPointer(this.state.levelWiseQuestCount[index]) }}>
      <Badge anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'right'
      }} badgeContent={this.state.levelWiseQuestCount[index]} color='primary'>
        <CardContent button
          onClick={() => {
            if (Number(this.state.levelWiseQuestCount[index])) { this.getQuestionsList(1, index) }
          }}>
          {level.question_level}<br />
        </CardContent></Badge>
      {currentLevelIndex === index && <CheckedIcon fontSize={'small'} color={'secondary'} />}

    </Card></Grid>))
}
  getQuestionsList = (page, currentLevelIndex, isLevelOptional, incrementActiveStep = true) => {
    if (currentLevelIndex === undefined || currentLevelIndex === null) {
      currentLevelIndex = this.state.currentLevelIndex
    }
    let { subjectId, gradeId, chapterId, selectedQuestionLevel, activeStep } = this.state
    let newurl =
    qBUrls.ListQuestion +
    `pagenumber=${page}&subject=${String(subjectId)}&grade=${String(
      gradeId
    )}&chapter=${String(chapterId)}&type=MCQ&category=&${!isLevelOptional ? `level=${selectedQuestionLevel[currentLevelIndex].value}` : `level=`}&question_status=Published&ques_type=MCQ`
    let _this = this
    return new Promise((resolve, reject) => {
      this.setState({ loading1: true }, () => {
        axios
          .get(newurl, {
            headers: {
              Authorization: 'Bearer ' + this.props.user
            }
          })
          .then(res => {
            let totalPageCount = res.data['total_page_count']
            let questionCount = res.data['question_count']
            _this.setState(
              { ...res.data,
                totalPageCount,
                questionCount,
                questionsList: [..._this.state.questionList, ...res.data.data],
                loading1: false,
                currentLevelIndex,
                ...incrementActiveStep ? { activeStep: activeStep + 1 } : {}
              }, () => { console.log(this.state.questionList); setTimeout(resolve(), 700) })
          //   }
          })
          .catch(error => {
            console.log('error', error)
            this.setState({ loading1: false })
            reject(error)
          })
      })
    })
  }
  handlePagination = (page) => {
    return new Promise((resolve, reject) => {
      let { currentPage, totalPageCount } = this.state
      if (currentPage <= totalPageCount) {
        this.setState({ currentPage: page }, () => this.getQuestionsList(page, null, null, false).then(() => resolve()).catch((err) => reject(err)))
      }
    })
  }
  checkFeatureAllowed = () => {
    // As of now "practice question feature" is going for only grade 6 to 8 and for maths subject only
    // id | grade name
    // 7 | Grade 3
    // 8 | Grade 4
    // 9 | Grade 5
    // 10 | Grade 6
    // 11 | Grade 7
    // 12 | Grade 8
    // 13 | Grade 9
    // 14 | Grade 10

    let { grade_id: gradeId, grade_name: gradeName } = this.userProfile
    const allowedGrades = ['5', '6', '7', '8', '9', '10', '11', '12', '13', '14']
    const isGradeAllowed = allowedGrades.includes(String(gradeId))
    return { isAllowed: isGradeAllowed, gradeName }
  }
  render () {
    const { classes } = this.props
    const steps = this.getSteps()
    let { subjectId, currentPage, totalPageCount } = this.state
    const { activeStep } = this.state

    const { isAllowed, gradeName } = this.checkFeatureAllowed()
    if (!isAllowed) return <InternalPageStatus label={`Feature not available for ${gradeName}`} loader={false} />
    return (
      <React.Fragment>
        <div className={classes.root}>
          <Stepper activeStep={activeStep}>
            {steps.map((label, index) => {
              const props = {}
              const labelProps = {}
              if (this.isStepOptional(index)) {
                labelProps.optional = <Typography variant='caption'>Optional</Typography>
              }
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

        </div>
        {activeStep === 0
          ? <div>
            {/* Subjectwise Questions Count: {this.state.totalQuestionCount} */}

            <Grid container spacing={12}>
              {this.renderSubjectsCard()}
            </Grid>
          </div> : null
        }

        {activeStep === 1
          ? <div>
            Total Questions Count: {this.state.totalChapterQuestionCount}

            <Grid container spacing={12}>
              {subjectId && this.renderChapters(subjectId)}
            </Grid>
          </div> : null
        }
        {activeStep === 2
          ? <div>
            Level Questions Count: {this.state.totalLevelCount}
            <Grid container spacing={12}>
              {subjectId && this.renderQuestionLevel()}
            </Grid>
          </div> : null
        }
        {activeStep === 3
          ? <div>
            <Grid container>
              {this.state.questionsList &&
              <TestModule
                getMoreQues={currentPage < totalPageCount}
                changePage={this.handlePagination}
                page={this.state.currentPage}
                totalPageCount={this.state.totalPageCount}
                questionCount={this.state.questionCount}
                questions={this.state.questionsList || []}
                alert={this.props.alert}
                onFinish={() => { this.setState({ activeStep: 0, currentLevelIndex: '' }) }}
                // activeStep={this.state.activeStepper}

              />}
            </Grid>
          </div>
          : null}
        <div>
          {activeStep === steps.length ? (
            <div>
              {this.state.loading ? <Typography className={classes.instructions}>
                  Loading....
              </Typography> : <Button
                onClick={this.handleBack}
                variant='contained'
                className={classes.button}
              >
                  Back
              </Button>}
            </div>
          ) : (
            <div>
              <div>
                <Button
                  disabled={activeStep === 0}
                  onClick={this.handleBack}
                  className={classes.button}
                  variant='contained'
                >
                      Back
                </Button>

              </div>
            </div>
          )}
        </div>
      </React.Fragment>
    )
  }
}
const mapStateToProps = state => ({

  user: state.authentication.user

})
const mapDispatchToProps = dispatch => ({

})
export default connect(mapStateToProps,
  mapDispatchToProps
)(withRouter(withStyles()(PracticeQuestions)))
