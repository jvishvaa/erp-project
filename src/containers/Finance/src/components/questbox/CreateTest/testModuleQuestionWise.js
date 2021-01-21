import React from 'react'
// import json5 from 'json5'
import PropTypes from 'prop-types'
// import LinkTag from '@material-ui/core/Link'
// import { Button, Collapse, TextField, ListItemIcon, Avatar } from '@material-ui/core'
import { Button, ListItemIcon, Avatar } from '@material-ui/core'
import { withStyles } from '@material-ui/core/styles'
// import MobileStepper from '@material-ui/core/MobileStepper'
// import Step from '@material-ui/core/Step'
import ClearIcon from '@material-ui/icons/Clear'
import DoneSharpIcon from '@material-ui/icons/DoneSharp'
import green from '@material-ui/core/colors/green'
import KeyboardArrowLeft from '@material-ui/icons/KeyboardArrowLeft'
import KeyboardArrowRight from '@material-ui/icons/KeyboardArrowRight'
import Typography from '@material-ui/core/Typography'
import CardContent from '@material-ui/core/CardContent'
// import CardHeader from '@material-ui/core/CardHeader'
// import ReactHTMLParser, { convertNodeToElement } from 'react-html-parser'
import ReactHTMLParser from 'react-html-parser'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'
// import Radio from '@material-ui/core/Radio'
import FormControl from '@material-ui/core/FormControl'
// import moment from 'moment'

// var x

const styles = theme => ({
  root: {
    width: '90%',
    flexGrow: 1
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
  avatar: {

  },
  redAvatar: {
    color: '#fff',
    backgroundColor: 'red'
  },
  greenAvatar: {
    color: '#fff',
    backgroundColor: green[500]
  }
})

class ProgressMobileStepper extends React.Component {
  constructor () {
    super()
    this.state = {
      activeStep: 0,
      completed: new Set(),
      skipped: new Set(),
      choice: {},
      countdown: null,
      expandedStats: null,
      descriptiveStats: null,
      array: [],
      attemptedQuestions: []
    }
    this.getSteps = this.getSteps.bind(this)
    // this.timer = this.timer.bind(this)
    this.handleLocalStorage = this.handleLocalStorage.bind(this)
    this.isStepSkipped = this.isStepSkipped.bind(this)
  }

  componentDidMount () {
    // if (this.props.testType !== 'Practice') {
    //   this.timer()
    // }
    // this.handleLocalStorage('GET')
  }

  handleChange = (question, value) => {
    let { attemptedQuestions } = this.state
    if (!attemptedQuestions.includes(question)) {
      this.setState({ choice: { ...this.state.choice, [this.state.activeStep]: { id: question, value } }, attemptedQuestions: [...attemptedQuestions, question] }, () => { this.handleLocalStorage('PUT') })
    }
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

  getStepContent =(step) => {
    let { questions } = this.props
    let currentQuestionCount = ((this.props.page - 1) * 10) + this.state.activeStep + 1
    if (questions.length === 0) {
      this.props.alert.error('Level has no questions')
      // this.handleComplete()
      return null
    }
    if (questions[step] && questions[step].question_type === 'MCQ') {
      var correctOption = Object.keys(JSON.parse(questions[step].correct_ans))[0].substr(-1)
      var usersOption = this.state.choice[this.state.activeStep] ? this.state.choice[this.state.activeStep].value : null
    }
    return questions[step] && questions[step].question_type === 'MCQ' ? (<React.Fragment>
      <div style={{ minWidth: '35vw' }}>
        <div>
          Q.{currentQuestionCount} ) <br />{ReactHTMLParser(questions[step].question)}
        </div>
        <hr />
        <FormControl component='fieldset'>
          {questions[step].option.map((option, index) => {
            return (

              <ListItem
                key={option}
                role={undefined} dense button
                onClick={() => { this.handleChange(questions[step].id, index + 1) }}
              >
                <ListItemIcon>
                  {usersOption ? ((Number(correctOption) === (index + 1)) ? <Avatar className={this.props.classes.greenAvatar}> <DoneSharpIcon /></Avatar> : ((Number(usersOption) === (index + 1)) ? <Avatar className={this.props.classes.redAvatar}><ClearIcon /> </Avatar> : <Avatar>{index + 1}</Avatar>)) : <Avatar>{index + 1}</Avatar>}
                </ListItemIcon>
                <ListItemText primary={ReactHTMLParser(option)} />
              </ListItem>
            )
          })}
        </FormControl>
      </div>
    </React.Fragment>) : null
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

  handleNext = () => {
    let { activeStep } = this.state
    let currentQuestionCount = ((this.props.page - 1) * 10) + this.state.activeStep + 1
    if ((activeStep + 1) === this.props.questions.length) {
      // if (activeStep + 1 === this.totalSteps()) {
      if (Object.keys(this.state.choice).length !== this.props.questions.length) {
        this.setState({ activeStep: 0 })
        return
      }
      if (Number(this.props.questionCount) === Number(currentQuestionCount)) {
        console.log('Finished no more')
        this.props.onFinish()
      } else {
        this.props.changePage(this.props.page + 1).then(() => {
          this.setState({
            activeStep: 0,
            choice: {},
            attemptedQuestions: []
          })
        })
      }
    } else {
      this.setState({ activeStep: activeStep + 1, descriptiveStats: false, expandedStats: false })
    }
  }

  handleBack = () => {
    let { page } = this.props
    let { activeStep } = this.state
    // eslint-disable-next-line no-debugger
    debugger
    if (activeStep === 0 && page > 1) {
      this.props.changePage(this.props.page - 1).then(() => {
        this.setState({
          activeStep: 0,
          choice: {},
          attemptedQuestions: []
        })
      })
    } else {
      this.setState({ activeStep: activeStep - 1, expandedStats: false, descriptiveStats: false })
    }
  }

  handleStep = step => () => {
    this.setState({
      activeStep: step
    })
  }

  handleComplete = () => {
    this.props.onFinish(this.state.choice)
    // clearInterval(x)
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

  componentWillReceiveProps () {
    this.setState({ activeStep: this.props.activeStep })
  }
  handlechanedValue=(e) => {
    let { array } = this.state

    this.state.array[this.state.activeStep] = e.target.value
    this.setState({ array })
  }
  render () {
    const { classes } = this.props
    // const steps = this.getSteps()
    const { activeStep } = this.state
    let currentQuestionCount = ((this.props.page - 1) * 10) + this.state.activeStep + 1
    return (<React.Fragment>
      {/* <CardHeader title={this.state.countdown} /> */}
      <CardContent>
        <div className={classes.root}>
          <div>
            { <div>
              <Typography className={classes.instructions}>{this.getStepContent(activeStep)}</Typography>
              <div>
                <Button
                  disabled={activeStep === 0 && this.props.page === 1}
                  onClick={this.handleBack}
                  className={classes.button}
                >
                  <KeyboardArrowLeft />
                  Prev Ques
                </Button>

                <Button
                  variant='contained'
                  color='primary'
                  onClick={this.handleNext}
                  className={classes.button}
                >

                  {
                    Number(this.props.questionCount) === Number(currentQuestionCount)
                      ? <React.Fragment>
                        Finish
                      </React.Fragment>
                      : <React.Fragment>
                        Next Ques <KeyboardArrowRight />
                      </React.Fragment>
                  }

                </Button>
                <Button
                  // disabled
                  className={classes.button}
                >
                  {`${currentQuestionCount} / ${this.props.questionCount}`}
                </Button>
              </div>
            </div>}
          </div>
        </div>
      </CardContent>
      {/* <Button variant='contained' color='primary' onClick={() => { this.props.skipTest('SKIP') }} >Skip test </Button> */}
    </React.Fragment>)
  }
}

ProgressMobileStepper.propTypes = {
  classes: PropTypes.object
}

export default withStyles(styles, { withTheme: true })(ProgressMobileStepper)
