import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import { Stepper, Step, StepLabel, Button, withStyles } from '@material-ui/core'
import Step0 from './step0'
import Step1 from './step1'
import Step2 from './step2'
import Step3 from './step3'
import './responsive.css'

const styles = themes => ({ root: {
  // backgroundColor: 'rgb(242,242,242)',
  // minHeight: '32vw'
  padding: 6
} })
class Home extends Component {
  constructor () {
    super()
    this.userProfile = JSON.parse(localStorage.getItem('user_profile')) || {}
    let gradeDataObj = this.setAndGetGradeId()
    this.state = { ...gradeDataObj }
  }

  handleBack = () => {
    // this.setState(state => ({
    //   activeStep: state.activeStep - 1,
    //   currentLevelIndex: ''
    // }))
    this.handleBackwardNavigation()
  };

  handleNext = () => {
    const { activeStep = 0 } = this.state
    this.setState({
      activeStep: activeStep + 1
    })
  }

  getSteps () {
    return ['Select Subjects', 'Select Chapters', 'Select Level', 'Practice Questions']
  }
  getRouteParams = () => {
    let { match: { path, params: { chapter_id: chapterIdParam, subject_id: subjectIdParam, qLevel_id: qLevelIdParam } } = {} } = this.props
    return { chapterIdParam, subjectIdParam, qLevelIdParam, path }
  }

  getStepContent (step) {
    let { authToken } = this.props
    const { chapterIdParam, subjectIdParam, qLevelIdParam } = this.getRouteParams()
    let propsObj = { handleNavigation: this.handleNavigation, ...this.state, authToken, subjectId: subjectIdParam, chapterId: chapterIdParam, qLevelId: qLevelIdParam }

    switch (step) {
      case 0:
        return <Step0 {...propsObj} />
      case 1:
        return <Step1 {...propsObj} />
      case 2:
        return <Step2 {...propsObj} />
      case 3:
        return <Step3 {...propsObj} />
      default:
        return 'Unknown step'
    }
  }

  switchControls =() => {
    const { classes } = this.props
    const { activeStep = 0 } = this.state
    return <React.Fragment>
      {
        activeStep !== 0
          ? <Button
            disabled={activeStep === 0}
            onClick={this.handleBack}
            className={classes.button}
            variant='contained'
            color='primary'
          >
          Back
          </Button>
          : null
      }
    </React.Fragment>
  }

  componentWillMount () {
    this.handleStepsByParams()
  }
  // componentDidUpdate (prevProps) {
  // eslint-disable-next-line no-debugger
  // debugger
  // will be true
  // const locationChanged = this.props.location !== prevProps.location
  // this.handleStepsByParams()
  // }
  handleIsNan = () => {
    // handle if any idParam is not a number

  }
  handleStepsByParams = () => {
    // let { match: { params: { chapter_id: chapterIdParam, subject_id: subjectIdParam, qLevel_id: qLevelIdParam } = {} } = {} } = this.props
    //   let gradeId = this.setAndGetGradeId()
    let activeStep
    let { chapterIdParam, subjectIdParam, qLevelIdParam } = this.getRouteParams()
    subjectIdParam = Number(subjectIdParam)
    chapterIdParam = Number(chapterIdParam)
    qLevelIdParam = Number(qLevelIdParam)
    if (subjectIdParam && chapterIdParam && qLevelIdParam) {
      activeStep = 3
    } else if (subjectIdParam && chapterIdParam) {
      activeStep = 2
    } else if (subjectIdParam) {
      activeStep = 1
    } else {
      activeStep = 0
    }
    this.setState({ activeStep })
  }
  handleBackwardNavigation = () => {
    let { path, chapterIdParam, subjectIdParam, qLevelIdParam } = this.getRouteParams()
    let pushablePath
    if (subjectIdParam && chapterIdParam && qLevelIdParam) {
      pushablePath = path.replace(':qLevel_id/', '')
    } else if (subjectIdParam && chapterIdParam) {
      pushablePath = path.replace(':chapter_id/', '').replace(':qLevel_id/', '')
    } else if (subjectIdParam) {
      pushablePath = path.replace(':subject_id/', '').replace(':chapter_id/', '').replace(':qLevel_id/', '')
    }
    pushablePath = pushablePath.replace(':subject_id', subjectIdParam).replace(':chapter_id', chapterIdParam).replace(':qLevel_id', qLevelIdParam)
    this.props.history.push(pushablePath)
  }
  handleNavigation = (paramName, paramValue) => {
    let { path, chapterIdParam, subjectIdParam, qLevelIdParam } = this.getRouteParams()
    subjectIdParam = Number(subjectIdParam)
    chapterIdParam = Number(chapterIdParam)
    qLevelIdParam = Number(qLevelIdParam)
    if (isNaN(paramValue)) {
      console.error({ paramName, paramValue })
      console.error('param id having NaN type')
      return
    }
    console.log(chapterIdParam, qLevelIdParam, subjectIdParam, path)
    if (paramName === 'subject_id') {
      // remove :chapter_id if exists
      let paramRmIndex = path.search(':chapter_id')
      path = paramRmIndex > 0 ? path.slice(0, paramRmIndex) : path
    } else if (paramName === 'chapter_id' && subjectIdParam) {
      // remove :qLevel_id if exists
      let paramRmIndex = path.search(':qLevel_id')
      path = paramRmIndex > 0 ? path.slice(0, paramRmIndex) : path
      path = path.replace(`:subject_id`, subjectIdParam)
    } else if (paramName === 'qLevel_id' && subjectIdParam && chapterIdParam) {
      path = path.replace(`:subject_id`, subjectIdParam).replace(':chapter_id', chapterIdParam)
    }
    let isIncludes = path.includes(`:${paramName}`)
    path = path.endsWith('/') ? path : `${path}/`
    let pushablePath
    if (isIncludes) {
      // "/questbox/questions/practice/:subject_id/:chapter_id/:qLevel_id/" paramName will be rplaced by paramValue
      pushablePath = path.replace(`:${paramName}`, paramValue)
    } else {
      // "/questbox/questions/practice/:subject_id/:chapter_id/" + id+'/'
      pushablePath = `${path}${paramValue}/`
    }
    this.props.history.push(pushablePath)
  }

  setAndGetGradeId = () => {
    const { personal_info: { role } = {}, acade_branch_grade_id: acadeBranchGradeId, grade_id: studentGradeId, academic_profile: { grade: guestStudentGradeId } = {} } = this.userProfile || {}
    let gradeId
    if (role === 'Student') {
      gradeId = studentGradeId
    } else if (role === 'GuestStudent') {
      gradeId = guestStudentGradeId
    }
    // this.setState({ gradeId, acadeBranchGradeId, isGuestStudent: role === 'GuestStudent' })
    return { gradeId, acadeBranchGradeId, isGuestStudent: role === 'GuestStudent' }
  }
  isMobile = () => {
    const toMatch = [
      /Android/i,
      /webOS/i,
      /iPhone/i,
      /iPad/i,
      /iPod/i,
      /BlackBerry/i,
      /Windows Phone/i
    ]

    return toMatch.some((toMatchItem) => {
      return navigator.userAgent.match(toMatchItem)
    })
  }
  render () {
    const { classes } = this.props
    const { activeStep = 0 } = this.state
    const steps = this.getSteps()
    return <React.Fragment>
      <div className={classes.root}>
        {
          this.isMobile() ? null
            : <Stepper activeStep={activeStep}>
              {steps.map((label, index) => {
                const props = {}
                const labelProps = {}
                return (
                  <Step key={label} {...props}>
                    <StepLabel {...labelProps}>{label}</StepLabel>
                  </Step>
                )
              })}

            </Stepper>
        }
        {this.switchControls()}
        {this.getStepContent(activeStep)}
      </div>
    </React.Fragment>
  }
}
const mapStateToProps = state => ({
  authToken: state.authentication.user
})
export default connect(mapStateToProps)(withRouter(withStyles(styles)(Home)))
