
import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'
import { Button, withStyles, Grid } from '@material-ui/core'
import Slide from '@material-ui/core/Slide'
import Dialog from '@material-ui/core/Dialog'
import QuestionHandler from './questionsModule/questionHandler'
import PracticeQuestionAccuracyReport from '../PracticeQuestionAccuracyReport'

const useStyles = theme => ({})

const Transition = React.forwardRef(function Transition (props, ref) {
  return <Slide direction='up' ref={ref} {...props} />
})

class step3 extends Component {
  state = { page: 1, size: 10 }
  componentWillMount () {
    let { open, qId } = this.getSearchParams()
    if (open === 'true') this.handleClickOpen()
    this.setState({ questionId: qId })
  }
  getSearchParams = () => {
    let { location: { search = '' } = {} } = this.props
    const urlParams = new URLSearchParams(search) // search = ?open=true&qId=123
    const searchParamsObj = Object.fromEntries(urlParams) // {open: "true", def: "[asf]", xyz: "5"}
    return searchParamsObj
  }
  pushQueryParam = () => {
    //   // let cUrl = this.props.location.pathname + this.props.location.search
    //   let searchParamsObj = this.getSearchParams()
    //   let noOfSearchParams = Object.keys(searchParamsObj).length
    //   let result = search.match(/open=.+&/)
    //   if (result) {
    //     let matchStr = result[0]
    //     let replacedSearch = search.replace(matchStr, 'open=true&')
    //   } else {
    //   }
    //   replacedSearch = ((noOfSearchParams === 0) ? '?' : '') + replacedSearch
    //   // this.props.history.push(search + 'open=true')
    //   this.props.history.push(replacedSearch)
    // let search = this.props.location.search
    // let searchParamsObj = this.getSearchParams()
    // let noOfSearchParams = Object.keys(searchParamsObj).length
    // let { open } = searchParamsObj
    // if (open) {
    //   let result = search.match(/open=.+&/)
    // }
    let { page: pageFrmSt, size: sizeFrmSt } = this.state
    let { page: pageParam = pageFrmSt, size: sizeParam = sizeFrmSt } = this.getSearchParams()
    this.props.history.push(`?open=true&size=${sizeParam}&page=${pageParam}`)
  }
  popQueryParam = () => {
    // let searchParamsObj = this.getSearchParams()
    // let noOfSearchParams = Object.keys(searchParamsObj).length
    // let search = this.props.location.search
    // // let cUrl = this.props.location.pathname + this.props.location.search
    // let result = search.match(/open=.+&/)
    // if (result) {
    //   let matchStr = result[0]
    //   this.props.history.push(search.replace(matchStr, ''))
    // }
    // let search = this.props.location.search
    this.props.history.push(this.props.location.pathname)
  }
  handleClickOpen = () => {
    this.setState({ open: true }, () => this.pushQueryParam())
  }

  handleClose = () => {
    this.setState({ open: false }, () => this.popQueryParam())
  }
  dialogBox = () => {
    let { open } = this.state
    let { qLevelId, subjectId, chapterId, gradeId, acadeBranchGradeId } = { ...this.props }
    let propsToChild = { qLevelId, subjectId, chapterId, gradeId, acadeBranchGradeId, handleFinish: this.handleClose, handleClose: this.handleClose }
    return <Dialog fullScreen open={open} onClose={this.handleClose} TransitionComponent={Transition}>
      {open && <QuestionHandler {...propsToChild} />}
    </Dialog>
  }
  render () {
    return (
      // <div className='responsive-div' style={{ display: 'flex', justifyContent: 'space-between', marginTop: 30, alignItems: 'center' }}>
      //   {this.dialogBox()}
      //   <div className='responsive-width' style={{ width: '80%' }}>
      //     {!this.state.open && <PracticeQuestionAccuracyReport chapterId={this.props.chapterId} />}
      //   </div>
      //   <div>
      //     <Button variant='outlined' color='secondary' onClick={this.handleClickOpen}>Solve Questions</Button>
      //   </div>
      // </div>
      <div style={{ marginTop: 10 }}>
        {this.dialogBox()}
        <Grid container justify='center' >
          <Grid item xs={12} md={3} >
            <Button size='large' style={{ width: '100%', marginBottom: 20, height: 50, backgroundImage: 'linear-gradient(to bottom right,rgba(126,213,111,0.8), rgba(40,180,133,0.8))' }} variant='contained' color='primary' onClick={this.handleClickOpen}>Solve Questions</Button>
          </Grid>
          <Grid item xs={12}>
            <div>
              {!this.state.open && <PracticeQuestionAccuracyReport chapterId={this.props.chapterId} />}
            </div>
          </Grid>
        </Grid>
      </div>
    )
  }
}
export default withRouter(withStyles(useStyles)(step3))
