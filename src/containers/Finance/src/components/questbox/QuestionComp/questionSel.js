import React, { Component } from 'react'
import { Checkbox } from 'semantic-ui-react'
import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'
import { connect } from 'react-redux'
import FaceIcon from '@material-ui/icons/Face'
import Fab from '@material-ui/core/Fab'
import Icon from '@material-ui/core/Icon'
import AddIcon from '@material-ui/icons/Add'
import IconButton from '@material-ui/core/IconButton'
import { Popper, Fade, Chip, Paper, Avatar, CardActionArea, Typography, withStyles, Button } from '@material-ui/core'
import ReactHtmlParser from 'react-html-parser'
import { InternalPageStatus, Pagination } from '../../../ui'
// import { apiActions } from '../../../_actions'

const styles = {
  header: { display: 'flex', flexDirection: 'row-reverse' },
  questionWrap: {
    marginTop: 0,
    marginRight: 30,
    marginBottom: 50,
    marginLeft: 30,
    padding: 0
  },
  questionContainer: {
    padding: 10
  },
  optionsWrap: {
    margin: 0,
    padding: 0,
    display: 'flex'
  },
  optionsContainter: {
    display: 'flex',
    flexWrap: 'wrap',
    width: '100%',
    margin: 'auto',
    justifyContent: 'space-around'
  },
  optionDiv: {
    flexBasis: '40%',
    margin: '2px 0',
    padding: '5px'
  }
}
class QuestionSel extends Component {
  constructor (props) {
    console.log('inside const comp')
    super(props)
    let { formData } = props
    let customViewStyles = new Map()
    customViewStyles.set('imageSize', 15)// vw 5vw-60vw
    customViewStyles.set('maxImageSize', 60)
    customViewStyles.set('minImageSize', 5)
    customViewStyles.set('optionsView', ['row', 'column'])
    customViewStyles.set('viewOpted', 0)
    customViewStyles.set('highlightText', true)
    this.state = {
      activePage: 1,
      update: false,
      customViewStyles,
      ...formData
    }
    this.handleSelectedQuestion = this.handleSelectedQuestion.bind(this)
  }

  static getDerivedStateFromProps (nextProps, prevState) {
    if (nextProps.questions !== prevState.questions) {
      return { questions: nextProps.questions }
    } else return null
  }

  // componentWillMount () {
  //   let { questionLevel, questionCategory } = this.props
  //   if (!questionCategory || !questionLevel) {
  //     this.props.loadQuestionLevel()
  //     this.props.loadQuestionCategory()
  //   }
  // }
  componentDidMount () {
    this.handleSelectedQuestion()
  }

  handleSelectedQuestion () {
    this.state.selectedMCQ.map(id => {
      this.setState({ [id]: true })
    })
  }
  getChips = (qus) => {
    let questionCategory = this.props.questionCategory
      ? this.props.questionCategory
        .filter(obj => obj.id === Number(qus.questioncategory))[0] ? this.props.questionCategory
          .filter(obj => obj.id === Number(qus.questioncategory))[0]['category_name'] : null
      : null
    let questionLevel = this.props.questionLevel
      ? this.props.questionLevel
        .filter(obj => obj.id === Number(qus.questionlevel))[0] ? this.props.questionLevel
          .filter(obj => obj.id === Number(qus.questionlevel))[0]['question_level'] : null
      : null

    let chipProps = { variant: 'default', color: 'default', style: { margin: '3px' } }
    return (
      <React.Fragment>
        <Chip
          label={qus.subjectname || 'No Subject assigned'}
          avatar={<Avatar>SB</Avatar>}
          {...chipProps}
        />
        <Chip
          label={qus.grade || 'No Grade'}
          avatar={<Avatar>G</Avatar>}
          {...chipProps}
        />
        <Chip
          label={qus.chapter || 'No Chapter'}
          avatar={<Avatar>C</Avatar>}
          {...chipProps}
        />
        <Chip
          label={qus.question_type || 'No Question Type assigned'}
          avatar={<Avatar>QT</Avatar>}
          {...chipProps}
        />
        <Chip
          label={questionLevel || 'No Question level assigned'}
          avatar={<Avatar>QL</Avatar>}
          {...chipProps}
        />
        <Chip
          label={questionCategory || 'No Question Category assigned'}
          avatar={<Avatar>QC</Avatar>}
          {...chipProps}
        />
        <Chip
          label={qus.user_name || 'No Author'}
          avatar={<Avatar><FaceIcon /></Avatar>}
          {...chipProps}
        />
      </React.Fragment>
    )
  }
  reSizeImageTags = string => {
    let imageSize = this.getCustomView('get', 'imageSize')
    if (!imageSize) {
      return string
    }
    let regEx = new RegExp(/<img\s[a-z=]{6}"/, 'gi')
    let replaceStr = `<img style="height:auto; width:${imageSize}vw; `
    return string.replace(regEx, replaceStr)
  }
  getOptions = (question) => {
    let { props: { classes: { optionsWrap, optionsContainter, optionDiv } } } = this
    let { question_type: qType, option: options } = question
    if (qType !== 'MCQ') { return null }
    return (
      <React.Fragment>
        <Typography component='p'style={{ color: 'rgb(132,49,86)' }}>Options</Typography>
        <div className={optionsWrap} >
          <div className={optionsContainter} style={{ flexDirection: this.getCustomView('get', 'optionsView') }}>
            {options.map((option, index) => {
              return (
                <CardActionArea className={optionDiv}>
                  <Typography style={{ float: 'left' }} component='p'>{`${index + 1} : `}&nbsp;&nbsp;</Typography>
                  {ReactHtmlParser(this.reSizeImageTags(option))}
                </CardActionArea>
              )
            })}
          </div>
        </div>
      </React.Fragment>
    )
  }
  getCorrectAns = (question) => {
    let { correct_ans: correctAns, question_type_id: qTypeId, id } = question
    qTypeId = Number(qTypeId)
    if (!correctAns) { return null }
    switch (qTypeId) {
      case 1:
        // MCQ
        let regEx = new RegExp(/option[1-4]/, 'i')
        let correctOption = correctAns.match(regEx)
        correctAns = correctOption ? correctOption[0] : `No Valid option for question with Id ${id}`
        return <Typography component='p' style={{ color: 'rgb(132,49,86)' }}>Answer: {correctAns}</Typography>
      // case 2:
      //   Comprehension
      //   break
      case 3:
        // True or False
        return <Typography component='p' style={{ color: 'rgb(132,49,86)' }}>Answer: {correctAns}</Typography>
      case 4 || 5:
        // Fill in the blanks || Descriptive type
        return <Typography component='p' style={{ color: 'rgb(132,49,86)' }}>Answer: {ReactHtmlParser(correctAns)}</Typography>
      default:
        return 'Question type is invalid'
    }
  }
  getCustomView = (method, key, value) => {
    let { customViewStyles: cVStyles } = this.state
    // let returnValue
    if (method === 'get') {
      if (key === 'optionsView') {
        let viewOpted = cVStyles.get('viewOpted')
        let optionsView = cVStyles.get('optionsView')
        if (viewOpted !== 0 || !optionsView) {
          console.log('')
        }
        return optionsView[viewOpted]
      }
      return cVStyles.get(key)
    }
    if (method === 'set') {
      if (key === 'optionsView') {
        // viewOpted either 1  or zero
        let viewOpted = cVStyles.get('viewOpted') ? 0 : 1
        cVStyles.set('viewOpted', viewOpted)
      } else {
        cVStyles.set(key, value)
      }
      // else if (key === 'imageSize') {
      //   cVStyles.get('optionsView')
      // }
      this.setState({ customViewStyles: cVStyles })
    }
    // return returnValue
    // return cVStyles.get(key)return cVStyles.get(key)
  }
  handleClick = event => {
    const { currentTarget } = event
    this.setState(state => ({
      anchorEl: currentTarget,
      open: !state.open
    }))
  };
  customViewPanel = () => {
    const { classes } = this.props
    const { anchorEl = null, open = false } = this.state
    const id = open ? 'simple-popper' : null
    return (
      <div>
        <Button aria-describedby={id} onClick={this.handleClick}>
          <Icon>art_track</Icon>
        </Button>
        <Popper id={id} open={open} anchorEl={anchorEl} transition>
          {({ TransitionProps }) => (
            <Fade {...TransitionProps} timeout={350}>
              <Paper style={{ padding: 10, margin: 10, height: 'auto', minWidth: '400px', width: '30vw' }}>
                <div style={{ width: '80%', margin: 'auto' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography className={classes.typography}>Options view :</Typography>
                    <Button variant='default' component='span' onClick={() => { this.getCustomView('set', 'optionsView') }}>{this.getCustomView('get', 'optionsView')}</Button>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography className={classes.typography}>Image size :</Typography>
                    {!this.props
                      ? <Fab variant='default' size='small' aria-label='Add' className={classes.margin}>
                        <AddIcon />
                        <IconButton color='primary' onClick={() => { this.getCustomView('set', 'viewOpted') }} className={classes.button} component='span'>
                          <AddIcon />
                        </IconButton>
                      </Fab>
                      : <span style={{ display: 'flex' }}>
                        <input
                          style={{ flexBasis: '4' }}
                          type='range'
                          value={this.getCustomView('get', 'imageSize')}
                          onChange={(e) => { this.getCustomView('set', 'imageSize', e.target.value) }}
                          min={this.getCustomView('get', 'minImageSize')}
                          max={this.getCustomView('get', 'mixImageSize')}
                        />
                        <Button
                          style={{ flexBasis: '1' }}
                          variant='default'
                          component='span'
                          onClick={() => { this.getCustomView('set', 'imageSize', 15) }}
                        >
                          Reset
                        </Button>
                      </span>
                    }

                  </div>
                </div>

              </Paper>
            </Fade>
          )}
        </Popper>
      </div>
    )
  }
  handleCheckbox = (qusId, qusObj) => {
    // var arrayId = this.state.aSelectedQuestions
    // if (i && i.checked) {
    //   if (!arrayId.includes(String(i.value))) {
    //     arrayId.push(`${i.value}`)
    //     this.props.onSelectQuestions(i.value, 'added', 'MCQ')
    //     this.setState({ [i.value]: true })
    //   }
    // } else {
    //   if (arrayId.includes(String(i.value))) {
    //     let v = arrayId.indexOf(i.value)
    //     arrayId.splice(v, 1)
    //     this.props.onSelectQuestions(i.value, 'removed', 'MCQ')
    //     this.setState({ [i.value]: false })
    //   }
    // }
    // this.setState({ aSelectedQuestions: arrayId })
    // let { aSelectedQuestions: selQues = new Set() } = this.state
    // let { selectedQuestionsMap: selQues = new Set() } = this.props
    // if (selQues.has(qusId)) {
    // selQues.delete(qusId)
    this.props.onSelectQuestions(qusId, qusObj, 'MCQ')
    // } else {
    // selQues.add(qusId)
    // this.props.onSelectQuestions(qusId, qusObj, 'MCQ')
    // }
    // this.setState({ aSelectedQuestions: selQues })
  }

  handlePage = i => {
    console.log(i)
    this.props.goToPage(i)
    this.setState({ activePage: i })
  }
  render () {
    let { questions: { data: questionsData = [] }, qType } = this.props
    let data = questionsData && questionsData.filter(item => item.question_type === 'MCQ')

    console.log(data)
    let { selectedQuestionsMap: selQuesMap = new Map(), classes } = this.props
    return (
      <React.Fragment>
        {this.props.questions
          ? <React.Fragment>
            <div style={{ padding: 20, bottom: 20, right: 0, position: 'fixed', zIndex: 10 }}>
              <Pagination
                rowsPerPageOptions={[10, 10]}
                labelRowsPerPage={'Questions per page'}
                page={this.props.activePage - 1}
                rowsPerPage={10}
                count={this.props.questions.question_count}
                onChangePage={(e, i) => { this.handlePage(i + 1) }}
              />
            </div>
            <div>
              <div className={classes.header} style={{ margin: 15 }}>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  {this.customViewPanel()}
                  <h5 style={{ margin: 0 }}>
                      Total Questions : {(this.props.questions && this.props.questions.question_count) || ' - - '}
                  </h5>
                </div>
              </div>
              <div style={{ margin: 0, padding: 0 }}>
                {
                  questionsData.length ? (

                    this.props.questions.data.filter(item => {
                      if (qType === 'QUIZ' || qType === 'Recorded Lectures') {
                        return item.question_type === 'MCQ'
                      } else return item.question_type
                    })
                      .map((qus, i) => (
                        <Card key={i}
                          style={{
                            margin: 16,
                            width: '100%',
                            ...selQuesMap.has(`${qus.id}_MCQ`) ? { backgroundColor: 'rgb(165,233,153)' } : {} }}
                        >
                          <CardContent>
                            <Checkbox
                              key={qus.id}
                              label='select'
                              value={qus.id}
                              name='questions'
                              checked={selQuesMap.has(`${qus.id}_MCQ`)}
                              onChange={e => { this.handleCheckbox(qus.id, qus) }}
                            />
                            <br />

                            <div>
                              <Typography style={{ color: 'rgb(132,49,86)' }} component='p' gutterBottom>
                                {((this.props.activePage - 1) * 10) + i + 1}&nbsp;)&nbsp;
                              </Typography>
                              {ReactHtmlParser(qus.question)}
                            </div>
                            {!this.props
                              ? <Fab variant='default' size='small' aria-label='Add' className={classes.margin}>
                                <AddIcon />
                                <IconButton
                                  color='primary'
                                  onClick={() => { this.getCustomView('set', 'viewOpted') }}
                                  className={classes.button}
                                  component='span'
                                >
                                  <AddIcon />
                                </IconButton>
                              </Fab> : '' }
                            {this.getOptions(qus)}
                            <br />
                            {this.getCorrectAns(qus)}
                            {this.getChips(qus)}
                          </CardContent>
                        </Card>
                      ))
                  ) : (
                    <InternalPageStatus label='No Questions' loader={false} />
                  )}
              </div>
            </div>
          </React.Fragment>
          : <InternalPageStatus label={'Loading questions...'} />
        }
      </React.Fragment>
    )
  }
}
const mapStateToProps = state => ({
  user: state.authentication.user
  // questionLevel: state.questionLevel.items,
  // questionCategory: state.questionCategory.items
})
// const mapDispatchToProps = dispatch => ({
//   loadQuestionLevel: dispatch(apiActions.listQuestionLevel()),
//   loadQuestionCategory: dispatch(apiActions.listQuestionCategory())
// })

export default connect(mapStateToProps)(withStyles(styles)(QuestionSel))
