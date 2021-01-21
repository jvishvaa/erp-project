import React from 'react'
import json5 from 'json5'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'
import Stepper from '@material-ui/core/Stepper'
import Step from '@material-ui/core/Step'
import StepButton from '@material-ui/core/StepButton'
import Button from '@material-ui/core/Button'
import Typography from '@material-ui/core/Typography'
import CardContent from '@material-ui/core/CardContent'
import CardHeader from '@material-ui/core/CardHeader'
import ReactHTMLParser from 'react-html-parser'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'
import Radio from '@material-ui/core/Radio'
import FormControl from '@material-ui/core/FormControl'
import moment from 'moment'

var x

const styles = theme => ({
  root: {
    width: '90%'
  },
  button: {
    marginRight: theme.spacing.unit
  },
  backButton: {
    marginRight: theme.spacing.unit
  },
  completed: {
    display: 'inline-block'
  },
  instructions: {
    marginTop: theme.spacing.unit,
    marginBottom: theme.spacing.unit
  },
  stepperCustom: {
    overflowX: 'auto',
    overflowY: 'hidden',
    padding: '0'
  }
})

class HorizontalNonLinearAlternativeLabelStepper extends React.Component {
  constructor () {
    super()
    this.state = {
      activeStep: 0,
      completed: new Set(),
      skipped: new Set(),
      choice: {},
      countdown: null
    }
    this.getSteps = this.getSteps.bind(this)
    this.timer = this.timer.bind(this)
    this.handleLocalStorage = this.handleLocalStorage.bind(this)
    this.isStepSkipped = this.isStepSkipped.bind(this)
  }

  componentDidMount () {
    if (this.props.testType !== 'Practice') {
      this.timer()
    }
    this.handleLocalStorage('GET')
  }

  handleChange = (question, value, isCompType = false, compQuesValue) => {
    let temp
    if (isCompType) {
      let { choice = {}, activeStep } = this.state
      let activeStepChoice = choice[activeStep]
      let compQuestions = activeStepChoice && activeStepChoice['compQuestions'] ? activeStepChoice['compQuestions'] : {}
      temp = {
        id: question,
        value,
        isCompType: true,
        compQuestions: {
          ...compQuestions,
          [compQuesValue.id]: compQuesValue
        }
      }
    } else {
      temp = { id: question, value }
    }
    this.setState({ choice: { ...this.state.choice, [this.state.activeStep]: temp } }, () => { this.handleLocalStorage('PUT') })
  }

  handleLocalStorage = (type) => {
    let { testType, lSKey, isReviewingTest, assessId } = this.props
    if (testType && lSKey) {
      let key = lSKey
      if (isReviewingTest === true) { key = 'reviewTest' }
      switch (type) {
        case 'PUT' : {
          let putState = JSON.stringify(this.state)
          window.localStorage.setItem(key, putState)
          break
        }
        case 'GET' : {
          let getState = JSON.parse(window.localStorage.getItem(key))
          if (getState) {
            let choice = isReviewingTest ? getState['assessId' + assessId] : getState.choice
            this.setState({ choice })
          }
          break
        }
      }
    }
  }
  handleComprehensionType = (step) => {
    let { questions = [], testType, isReviewingTest } = this.props
    let { id: comprehensionId, comprehension_text: comprehensionText, question_detail: subQuestions = [] } = questions[step] || {}
    if (!comprehensionText) return null
    let showAnswer = testType === 'Practice' && isReviewingTest === true
    var correctAns
    return (
      <React.Fragment>
        <div>
          <h5>{step + 1} ). </h5>{ReactHTMLParser(comprehensionText)}
        </div>
        {
          subQuestions.map((subQuestionObj, subQuesIndex) => {
            let { question: subQuestionText, correct_ans: subQuestionAns, id: subQuestionId, option: subQuestionOptions } = subQuestionObj
            console.log(testType, comprehensionId, subQuestionAns, subQuestionId)
            let isCompType = true
            let { choice } = this.state
            var usersOption
            if (showAnswer) {
              let correctAnsObj = subQuestionObj.correct_ans ? json5.parse(subQuestionObj.correct_ans) : null
              var correctOption
              var isCorrect
              var bgColor
              if (correctAnsObj) {
                correctAns = subQuestionObj.correct_ans ? Object.values(correctAnsObj)[0] : null
                correctOption = Object.keys(correctAnsObj)[0].substr(-1)
                usersOption = (choice[step] &&
                  choice[step].id === comprehensionId &&
                  choice[step]['compQuestions'] &&
                  choice[step]['compQuestions'][subQuestionId] &&
                  choice[step]['compQuestions'][subQuestionId]['value'])
                isCorrect = Number(correctOption) === Number(usersOption)
                bgColor = isCorrect ? 'green' : 'red'
              }
            }
            return (<React.Fragment>

              <div>
                <h5>{subQuesIndex + 1} ). </h5>{ReactHTMLParser(subQuestionText)}
              </div>
              <FormControl component='fieldset'>
                {
                  subQuestionOptions.map((option, optionIndex) => {
                    return <ListItem
                      key={option}
                      role={undefined}
                      dense
                      button
                      style={{
                        backgroundColor: (showAnswer && bgColor && (optionIndex + 1) === usersOption) ? bgColor : 'transparent' }}
                      onClick={
                        () => {
                          if (isReviewingTest) { return }
                          let valueObj = {
                            id: subQuestionId,
                            value: optionIndex + 1,
                            index: subQuesIndex
                          }
                          this.handleChange(comprehensionId, null, isCompType, valueObj)
                        }
                      }
                    >
                      <Radio
                        value={option}
                        label={option}
                        checked={
                          (() => {
                            let optionVal = (choice[step] &&
                              choice[step].id === comprehensionId &&
                              choice[step]['compQuestions'] &&
                              choice[step]['compQuestions'][subQuestionId] &&
                              choice[step]['compQuestions'][subQuestionId]['value'])
                            let checked = (optionIndex + 1) === optionVal
                            return checked
                          })()
                        }
                        onClick={
                          () => {
                            if (isReviewingTest) { return }
                            let valueObj = {
                              id: subQuestionId,
                              value: optionIndex + 1,
                              index: subQuesIndex
                            }
                            this.handleChange(comprehensionId, null, isCompType, valueObj)
                          }
                        }
                      />
                      <ListItemText primary={ReactHTMLParser(option)} />
                    </ListItem>
                  })
                }
                {showAnswer && correctAns && <p><b style={{ color: 'green' }} >Answer :</b>{ReactHTMLParser(correctAns)}</p>}
              </FormControl>
            </React.Fragment>
            )
          }
          )
        }

      </React.Fragment>
    )
  }

  getStepContent (step) {
    let { questions, testType, isReviewingTest } = this.props
    let showAnswer = testType === 'Practice' && isReviewingTest === true
    if (questions.length === 0) {
      this.props.alert.error('Assessment has no questions')
      this.handleComplete()
      return null
    }
    if (questions[step].question_type === 'MCQ') {
      var correctAns
      if (showAnswer) {
        correctAns = questions[step] && questions[step].correct_ans ? Object.values(json5.parse(questions[step].correct_ans))[0] : null
        var correctOption = Object.keys(JSON.parse(questions[step].correct_ans))[0].substr(-1)
        var usersOption = this.state.choice[this.state.activeStep] ? this.state.choice[this.state.activeStep].value : null
        var isCorrect = Number(correctOption) === Number(usersOption)
        var bgColor = isCorrect ? 'green' : 'red'
      }
      return <React.Fragment>
        <div>
          <h5>{step + 1} ). </h5>{ReactHTMLParser(questions[step].question)}
        </div>
        <FormControl component='fieldset'>
          {questions[step].option.map((option, index) => {
            return <ListItem
              key={option}
              style={{
                backgroundColor: (showAnswer && bgColor && (index + 1) === usersOption) ? bgColor : 'transparent' }}
              role={undefined}
              dense
              button
              onClick={
                () => {
                  if (isReviewingTest) { return }
                  this.handleChange(questions[step].id, index + 1)
                }
              }
            >
              <Radio
                value={option}
                checked={
                  (this.state.choice[this.state.activeStep] && this.state.choice[this.state.activeStep].id === questions[step].id && this.state.choice[this.state.activeStep].value) === index + 1
                }
                onChange={
                  () => {
                    if (isReviewingTest) { return }
                    this.handleChange(questions[step].id, index + 1)
                  }
                }
                label={option}
              />
              <ListItemText primary={ReactHTMLParser(option)} />
            </ListItem>
          })}
          {showAnswer && correctAns && <p><b style={{ color: 'green' }} >Answer :</b>{ReactHTMLParser(correctAns)}</p>}
        </FormControl>
      </React.Fragment>
    } else {
      return this.handleComprehensionType(step)
    }
  }

  getSteps () {
    return this.props.questions.map(question => question.id)
  }

  totalSteps = () => this.getSteps().length;

  isStepOptional = step => step === -1;

  handleSkip = () => {
    var { activeStep } = this.state
    if (!this.isStepOptional(activeStep)) {
      // You probably want to guard against something like this
      // it should never occur unless someone's actively trying to break something.
      throw new Error("You can't skip a step that isn't optional.")
    }
    // let totalSteps = this.totalSteps() - 1
    if (this.isLastStep() && !this.allStepsCompleted()) {
      // It's the last step, but not all steps have been completed
      // find the first step that has been completed
      const steps = this.getSteps()
      activeStep = steps.findIndex((step, i) => !this.state.completed.has(i))
    } else if (this.isLastStep() && this.allStepsCompleted()) {
      activeStep = 0
    } else {
      activeStep = this.state.activeStep + 1
    }
    this.setState(state => {
      const skipped = new Set(state.skipped.values())
      skipped.add(activeStep)
      return {
        activeStep,
        skipped
      }
    })
  }

  timer () {
    let _this = this // Set the date we're counting down to
    let { duration } = this.props
    localStorage.getItem('duration')
    var countDownDate = localStorage.getItem('duration') ? moment().add({ seconds: localStorage.getItem('duration') }) : moment().add({ seconds: duration })
    // Update the count down every 1 second
    x = setInterval(function () {
      // Get todays date and time
      var now = moment()
      let difference = countDownDate.diff(now, 'seconds')
      localStorage.setItem('duration', difference)
      var days = parseInt(difference / 86400)
      difference = difference % 86400
      var hours = parseInt(difference / 3600)
      difference = difference % 3600
      var minutes = parseInt(difference / 60)
      var seconds = parseInt(difference % 60)
      // format countdown string + set tag value
      _this.setState({ countdown: days + 'd ' + hours + 'h ' + minutes + 'm ' + seconds + 's' })
      // If the count down is finished, write some text
      if (difference < 0) {
        clearInterval(x)
        _this.handleComplete()
      }
    }, 1000)
  }

  handleNext = () => {
    if (!this.props.isReviewingTest) window.scrollTo(0, 0)
    let activeStep
    if (this.props.isReviewingTest) {
      let { activeStep } = this.state
      const steps = this.getSteps()
      if (activeStep >= (steps.length - 1)) {
        activeStep = 0
        this.setState({
          activeStep
        })
        return
      }
    }
    if (this.isLastStep() && !this.allStepsCompleted()) {
      // It's the last step, but not all steps have been completed
      // find the first step that has been completed
      const steps = this.getSteps()
      activeStep = steps.findIndex((step, i) => !this.state.completed.has(i))
    } else {
      activeStep = this.state.activeStep + 1
    }
    this.setState({
      activeStep
    })
  }

  handleBack = () => {
    this.setState(state => ({
      activeStep: state.activeStep - 1
    }))
  }

  handleStep = step => () => {
    this.setState({
      activeStep: step
    })
  }

  handleComplete = () => {
    let refactoredChoice = []
    let { choice } = this.state
    Object.keys(choice).forEach(key => {
      let choiceObj = choice[key]
      let { isCompType, compQuestions = {} } = choiceObj
      if (isCompType && Object.keys(compQuestions).length) {
        Object.values(compQuestions).forEach(compQuesChoiceObj => {
          refactoredChoice.push(compQuesChoiceObj)
        })
      } else {
        refactoredChoice.push(choiceObj)
      }
    })
    this.props.onFinish(refactoredChoice)
    clearInterval(x)
  }

  handleReset = () => {
    this.setState({
      activeStep: 0,
      completed: new Set(),
      skipped: new Set()
    })
  }

  skippedSteps () {
    return this.state.skipped.size
  }

  isStepSkipped (step) {
    return this.state.skipped.has(step)
  }

  isStepComplete (step) {
    return this.state.choice[step]
  }

  completedSteps () {
    return Object.keys(this.state.choice).length
  }

  allStepsCompleted () {
    console.log(Object.keys(this.state.choice).length === this.props.questions.length)
    return Object.keys(this.state.choice).length === this.props.questions.length
  }

  isLastStep () {
    return this.state.activeStep === this.totalSteps() - 1
  }

  render () {
    const { classes } = this.props
    const steps = this.getSteps()
    const { activeStep } = this.state
    this.getStepContent = this.getStepContent.bind(this)
    return (
      <React.Fragment>
        <CardHeader title={this.state.countdown} />
        <CardContent>
          <div className={classes.root}>
            <Stepper alternativeLabel nonLinear activeStep={activeStep}
              className={window.isMobile ? classes.stepperCustom : ''}>
              {steps.map((label, index) => {
                const props = {}
                const buttonProps = {}
                if (this.isStepOptional(index)) {
                  buttonProps.optional = <Typography variant='caption'>Optional</Typography>
                }
                if (this.isStepSkipped(index)) {
                  props.completed = false
                }
                return (
                  <Step key={label} {...props}>
                    <StepButton
                      onClick={this.handleStep(index)}
                      completed={this.isStepComplete(index)}
                      {...buttonProps}
                    />
                  </Step>
                )
              })}
            </Stepper>
            <div style={{ marginTop: '10px' }}>
              <Typography className={classes.instructions}>
                {this.getStepContent(activeStep)}
              </Typography>
              <div>
                <Button
                  disabled={activeStep === 0}
                  onClick={this.handleBack}
                  className={classes.button}
                >
                  Back
                </Button>
                {this.completedSteps() === this.totalSteps() && (!this.props.isReviewingTest) ? null : <Button
                  variant='contained'
                  color='primary'
                  onClick={this.handleNext}
                  className={classes.button}
                >
                  Next
                </Button>}
                {this.isStepOptional(activeStep) && !this.state.completed.has(this.state.activeStep) && (
                  <Button
                    variant='contained'
                    color='primary'
                    onClick={this.handleSkip}
                    className={classes.button}
                  >
                    Skip
                  </Button>
                )}
                {activeStep !== steps.length &&
                  (this.state.completed.has(this.state.activeStep)
                    ? (
                      <Typography variant='caption' className={classes.completed}>
                      Step {activeStep + 1} already completed
                      </Typography>
                    ) : (
                      this.completedSteps() === this.totalSteps() && (!this.props.isReviewingTest) &&
                      <Button
                        variant='contained'
                        color='primary'
                        onClick={this.handleComplete}
                      >
                      Finish
                      </Button>
                    ))}
              </div>
            </div>
          </div>
        </CardContent>
        {/* <Button variant='contained' color='primary' onClick={() => { this.props.skipTest('SKIP') }} >Skip test </Button> */}
      </React.Fragment>)
  }
}

HorizontalNonLinearAlternativeLabelStepper.propTypes = {
  classes: PropTypes.object
}

export default withStyles(styles)(HorizontalNonLinearAlternativeLabelStepper)
