/* eslint-disable no-undef */
import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'
import { Stepper, Step, StepLabel, Button, withStyles, Typography } from '@material-ui/core'
import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'
import Step0 from './step0'
import Step1 from './step1'
import Step2 from './step2'
import Step3 from './step3'
import Step4 from './step4'

const styles = theme => ({
  root: {
    width: '100%'
  },
  backButton: {
    marginRight: theme.spacing(1)
  },
  instructions: {
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1)
  },
  cardroot: {
    minWidth: 275,
    margin: 10,
    boxShadow: '0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24)',
    transition: 'all 0.3s cubic-bezier(.25,.8,.25,1)'
  }
})

class Certificate extends Component {
  constructor () {
    super()
    this.state = {
      activeStep: 0,
      winnerList: [],
      skipped: new Set(),
      files: [],
      ErrorList: [],
      signatureVisible: true,
      participantList: [],
      multipleBranch: [],
      multipleSignature: []
    }
    this.role = JSON.parse(localStorage.getItem('user_profile')).personal_info.role
  }

  getSteps () {
    return ['Select Template', 'Select Recipient', 'Winner Details', 'Basic Details', 'Certificate']
  }

  handleNavingation = (data) => {
    this.setState({ role: data })
  }
  handleTemplate = (data, bgClr, tl) => {
    this.setState({ selectedTemplate: data, bgColor: bgClr, title: tl })
  }
  handleWinner = (winnerList) => {
    console.log(winnerList, 'wl')
    this.setState({ winnerList })
  }
  handleDate = (date) => {
    this.setState({ eventDate: date })
  }
  handleSignature = (signDetail, newWinnerList) => {
    this.setState({ signDetail, newWinnerList })
    // let { multipleSignature } = this.state
    // this.setState({ signUrl: signUrl, signature: signature, signId: signId, signbranch: signbranch, nameOfSignatory: nameOfSignatory, designationOfsignatory: designationOfsignatory, signDetail: signDetail })
    // multipleSignature.push({ signId, signbranch })
    // console.log(multipleSignature)
    // this.setState({ multipleSignature })
  }
  handleEvent = (event) => {
    this.setState({ event })
  }
  handleParticipantList = (participantList) => {
    this.setState({ participantList })
  }
  handleExcelUploadSwitch = (status) => {
    this.setState({ isExcel: status })
  }
  handleSubmit =(erp, path) => {
    this.setState({ erp, path })
    this.props.alert.success(erp)
    console.log(erp, path)
  }
  handleCategoryList =(vl) => {
    this.setState({ category: vl })
  }
  handleBadgeFile = (file) => {
    // // eslint-disable-next-line no-debugger
    // debugger
    this.setState({ badgeFile: file })
  }
  handleBranch =(bId, bName, bval, winnerList, gValue, title) => {
    let { multipleBranch } = this.state
    // // eslint-disable-next-line no-debugger
    // debugger
    this.setState({ branchId: bId, branchName: bName, winnerList: winnerList, branchValue: bval, gradeValue: gValue })
    multipleBranch.push({ bId, bName })
    console.log(multipleBranch)
    multipleBranch = [...new Set(multipleBranch)]
    // console.log([].concat.apply([], multipleBranch.map(item => item.bId)))
    this.setState({ multipleBranch })
  }
  handleGrade = (gId, gName, gval, winnerList) => {
    // // eslint-disable-next-line no-debugger
    // debugger
    this.setState({ gradeMapId: gId, gradeName: gName, gradeValue: gval, winnerList: winnerList })
  }
  handlerGselect =(sec) => {
    this.setState({ secMapId: sec, winnerList: [] })
  }
  handleExcelErrorList =(errList) => {
    // // eslint-disable-next-line no-debugger
    // debugger
    this.setState({ ErrorList: errList })
  }
  handleParticipantBranch =(bId, bName, bval, participantList, gValue) => {
    // // eslint-disable-next-line no-debugger
    // debugger
    this.setState({ particpantBranchId: bId, pbranchName: bName, participantList: participantList, particpantBranchValue: bval, participantGradeValue: gValue })
  }
  handleParticipantGrade = (gId, gName, gval, participantList) => {
    // // eslint-disable-next-line no-debugger
    // debugger
    this.setState({ pGradeMapId: gId, pGradeName: gName, participantGradeValue: gval, participantList: participantList })
  }
  // handleMultipleSignature = (signatureId) => {
  //   let multipleSignature = []
  //   // let multipleSignature = [...new Set(signatureId)]
  //   multipleSignature.push(signatureId)
  //   multipleSignature = [...new Set(multipleSignature)]
  //   this.setState({ multipleSignature })
  // }

  getStepContent (stepIndex) {
    let propsObj = { handleNavingation: this.handleNavingation,
      handleBadgeFile: this.handleBadgeFile,
      handleTemplate: this.handleTemplate,
      handleWinner: this.handleWinner,
      handleDate: this.handleDate,
      handleSignature: this.handleSignature,
      handleSubmit: this.handleSubmit,
      handleEvent: this.handleEvent,
      handleCategoryList: this.handleCategoryList,
      handleNext: this.handleNext,
      handleParticipantList: this.handleParticipantList,
      handleBranch: this.handleBranch,
      handlerGselect: this.handlerGselect,
      handleGrade: this.handleGrade,
      handleExcelErrorList: this.handleExcelErrorList,
      handleParticipants: this.handleParticipants,
      handleExcelUploadSwitch: this.handleExcelUploadSwitch,
      handleParticipantGrade: this.handleParticipantGrade,
      handleParticipantBranch: this.handleParticipantBranch,
      // handleMultipleSignature: this.handleMultipleSignature,

      alert: this.props.alert,
      ...this.state }
    switch (stepIndex) {
      case 0:
        return <Step0 {...propsObj} />
      case 1:
        return <Step1 {...propsObj} />
      case 2:
        return <Step2 {...propsObj} />
      case 3:
        return <Step3 {...propsObj} />
      case 4:
        return <Step4 {...propsObj} />
      default:
        return 'Unknown stepIndex'
    }
  }

   handleNext = () => {
     let { activeStep, signatureVisible, skipped } = this.state
     console.log(activeStep, 'll')
     this.setState({
       templateError: false,
       roleError: false,
       winnerError: false,
       DateError: false,
       signatureError: false,
       eventError: false,
       identicalWinnerError: false,
       categoryError: false,
       branchError: false,
       fileError: false,
       isSkipped: false,
       mandatoryFieldsError: false,
       branchValidationError: false,
       signatureAttachedWinnerListError: false

     })

     if (activeStep === 0) {
       let { selectedTemplate } = this.state
       if (!selectedTemplate) {
         this.setState({ templateError: true })
         return
       }
     } else if (activeStep === 1) {
       let { role } = this.state
       if (!role) {
         this.setState({ roleError: true })
         return
       }
     } else if (activeStep === 2) {
       let { winnerList, branchId } = this.state
       if (this.role === 'Admin' && !branchId) {
         this.setState({ branchError: true })
         return
       }
       if (winnerList && !winnerList.length) {
         this.setState({ winnerError: true })
         return
       }
       if ((winnerList && winnerList.length) && (branchId && branchId.length)) {
         const found = branchId.some(wl => !winnerList.some(({ brId }) => brId === wl))
         if (found) {
           this.setState({ branchValidationError: true })
           return
         }
       }
     } else if (activeStep === 3) {
       let { signDetail, event, category, eventDate, ErrorList, participantList, isExcel, winnerList, newWinnerList } = this.state

       if (!event) {
         this.setState({ eventError: true })
         return
       }
       if (!category) {
         this.setState({ categoryError: true })
         return
       }
       if (!eventDate) {
         this.setState({ DateError: true })
         return
       }
       if (signatureVisible) {
         if (!signDetail) {
           this.setState({ signatureError: true })
           return
         }
       }
       console.log(participantList)
       if (ErrorList && ErrorList.length) {
         this.setState({ fileError: true })
         return
       }
       if (((winnerList && winnerList.length) !== (newWinnerList && newWinnerList.length)) && !skipped.size) {
         //  this.setState({ signatureAttachedWinnerListError: true })
         const branchName = [...new Set([...winnerList.filter(wl => !newWinnerList.some(vl => vl.brId === wl.brId)).map(m => m.brName)])]
         console.log(branchName, 'bra')
         this.props.alert.error(`select signature for ${branchName} branch`)
         return
       }

       if (winnerList && !winnerList.length) {
         if ((participantList && !participantList.length) && !isExcel) {
           this.setState({ mandatoryFieldsError: true })
           return
         }
       }

       if (activeStep === 4) {
         console.log('kl')
       }
     }

     if (this.isStepSkipped(activeStep)) {
       skipped = new Set(skipped.values())
       skipped.delete(activeStep)
     }

     this.setState({ activeStep: activeStep + 1, skipped })
     if (activeStep === 2) {
       this.setState({ isSkipped: false, signatureVisible: true })
     }
   }

   handleBack = () => {
     let { activeStep } = this.state

     this.setState({ activeStep: activeStep - 1 })
   }

  handleReset = () => {
    // sessionStorage.setItem('activeStep', 0)
    this.setState({ activeStep: 0 })
  }

  handleSkip = () => {
    this.setState({
      OptionlError: false,
      branchError: false,
      winnerError: false,
      isSkipped: true
    })
    const { activeStep } = this.state

    this.setState({ signatureVisible: false })
    this.setState(state => {
      const skipped = new Set(state.skipped.values())
      skipped.add(activeStep)
      return {
        activeStep: state.activeStep + 1,
        skipped
      }
    })
  }
  isStepOptional = step => {
    return step === 2
  }
  isStepSkipped (step) {
    return this.state.skipped.has(step)
  }

  render () {
    const steps = this.getSteps()
    const { classes } = this.props
    let { activeStep, roleError, templateError, winnerError, DateError, signatureError, identicalWinnerError, eventError, categoryError, branchError, fileError, OptionlError, mandatoryFieldsError, branchValidationError } = this.state

    return (

      <React.Fragment>
        <Stepper activeStep={activeStep} alternativeLabel>
          {steps.map((label, index) => {
            console.log(index, 'indexx')
            const props = {}
            const labelProps = {}
            if (this.isStepOptional(index)) {
              labelProps.optional = <Typography variant='caption'>Optional</Typography>
            }
            if (this.isStepSkipped(index)) {
              props.completed = false
            }

            return (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            )
          })}
        </Stepper>
        <div style={{ padding: 10 }}>
          {activeStep === steps.length ? (
            <React.Fragment>
              <Button onClick={this.handleReset} variant='contained'>Go Home</Button>
              <div>
                <Card className={classes.cardroot}>
                  <CardContent style={{ textAlign: 'center' }}>
                    <Typography variant='body1'>Event :{this.state.event}</Typography>
                  </CardContent>
                </Card>
                {this.state.winnerList.length > 0 && (this.state.badgeFile || this.state.participantList.length > 0)
                  ? <Typography align={'center'}> Certificates and Badges issued </Typography>
                  : this.state.winnerList.length > 0 ? this.state.winnerList.map(item => {
                    return <React.Fragment>
                      <Card className={classes.cardroot}>
                        <CardContent style={{ textAlign: 'center' }}>
                          <Typography>ERP: {item.erp}</Typography>
                          <br />
                          <Typography>Rank:{item.rank}</Typography>
                          <br />
                          <Typography>Name:{item.name}</Typography>
                        </CardContent>
                      </Card>
                    </React.Fragment>
                  }) : <Typography align={'center'}> Badges Issued Successfully</Typography>}
              </div>
            </React.Fragment>
          ) : (
            <div>
              <div>
                <Button
                  disabled={activeStep === 0}
                  onClick={this.handleBack}
                  className={classes.backButton}
                  variant='outlined'
                  color='primary'
                >
                  Back
                </Button>
                {this.isStepOptional(activeStep) && (
                  <Button
                    variant='contained'
                    color='primary'
                    onClick={this.handleSkip}
                    className={classes.button}
                  >
                          Skip
                  </Button>
                )}
                {activeStep !== steps.length - 1
                  ? <Button style={{ float: 'right' }}variant='contained' color='primary' disabled={activeStep === steps.length - 1}onClick={this.handleNext}>
                    {activeStep === steps.length - 1 ? 'Finish' : 'Next'}
                  </Button> : ''}
              </div>
              {templateError && <Typography style={{ textAlign: 'center', color: 'red' }}className={classes.instructions}>please choose template</Typography>}
              {roleError && <Typography style={{ textAlign: 'center', color: 'red' }}className={classes.instructions}>please Select recipient</Typography>}
              {OptionlError && <Typography style={{ textAlign: 'center', color: 'red' }}className={classes.instructions}>you can not skip without branch</Typography>}
              {branchError && <Typography style={{ textAlign: 'center', color: 'red' }}className={classes.instructions}>please Select branch</Typography>}
              {identicalWinnerError && <Typography style={{ textAlign: 'center', color: 'red' }}className={classes.instructions}>please Select different erp</Typography>}
              {winnerError && <Typography style={{ textAlign: 'center', color: 'red' }}className={classes.instructions}>please Select Winners</Typography>}
              {branchValidationError && <Typography style={{ textAlign: 'center', color: 'red' }}className={classes.instructions}>missing winners from filterd branch</Typography>}
              {DateError && <Typography style={{ textAlign: 'center', color: 'red' }}className={classes.instructions}>please Select date</Typography>}
              {signatureError && <Typography style={{ textAlign: 'center', color: 'red' }}className={classes.instructions}>please Select signature</Typography>}
              {eventError && <Typography style={{ textAlign: 'center', color: 'red' }}className={classes.instructions}>please Select event</Typography>}
              {categoryError && <Typography style={{ textAlign: 'center', color: 'red' }}className={classes.instructions}>please Select category</Typography>}
              {fileError && <Typography style={{ textAlign: 'center', color: 'red' }}className={classes.instructions}>please clear errors</Typography>}
              {mandatoryFieldsError && <Typography style={{ textAlign: 'center', color: 'red' }}className={classes.instructions}>you selected Niether winner nor participant</Typography>}
              {/* {signatureAttachedWinnerListError && <Typography style={{ textAlign: 'center', color: 'red' }}className={classes.instructions}>winner does not have signature attached with it .please select signature once</Typography>} */}

              {this.getStepContent(activeStep)}

            </div>
          )}
        </div>
      </React.Fragment>
    )
  }
}

export default withRouter(withStyles(styles)(Certificate))
