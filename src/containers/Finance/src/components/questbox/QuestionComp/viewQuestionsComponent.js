import React, { Component } from 'react'
import ReactHtmlParser from 'react-html-parser'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import { Popper, Fade, Paper, Chip, Avatar, Button, withStyles, Card, CardActionArea, Typography, Tooltip } from '@material-ui/core'
import AddIcon from '@material-ui/icons/Add'
import Fab from '@material-ui/core/Fab'
import FaceIcon from '@material-ui/icons/Face'
import StarIcon from '@material-ui/icons/Star'
import IconButton from '@material-ui/core/IconButton'
import Icon from '@material-ui/core/Icon'
// import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
import axios from 'axios'
import { qBUrls } from '../../../urls'
import { FamilyConsumer, FamilyContext } from '../SmallContext'
import { InternalPageStatus, Pagination } from '../../../ui'
import { apiActions } from '../../../_actions'
import ExpansionPanel from './ExpansionPanel'

const styles = {
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    flexDirection: 'row-reverse',
    alignContent: 'center'

  },
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
  },
  customWidth: {
    width: '1000px',
    borderRadius: '10px'
  }
}
class QuestionsFrame extends Component {
  constructor (props) {
    super(props)
    let customViewStyles = new Map()
    customViewStyles.set('imageSize', 15)// vw 5vw-60vw
    customViewStyles.set('maxImageSize', 60)
    customViewStyles.set('minImageSize', 5)
    customViewStyles.set('optionsView', ['row', 'column'])
    customViewStyles.set('viewOpted', 0)
    customViewStyles.set('highlightText', true)
    this.state = {
      // questions: {
      //   data: [],
      //   loading: false,
      //   activePage: 15
      // },
      // imageSize: 20, // vw 20-60
      // maxImageSize: 60,
      // minImageSize: 20,
      // optionsView: ['row', 'column'],
      // viewOpted: 0,
      customViewStyles
    }
    this.handleDelete = this.handleDelete.bind(this)
    this.headers = { headers: { Authorization: 'Bearer ' + this.props.user } }
    let userProfile = JSON.parse(window.localStorage.getItem('user_profile'))
    this.role = userProfile ? userProfile.personal_info.role : null
  }
  componentWillUpdate () {
    this.headers = { headers: { Authorization: 'Bearer ' + this.props.user } }
  }
  handleDelete (id, updateQues) {
    let { headers } = this
    //  ListQuestion: BASE + '/academic/questbox/question/?
    let URL = qBUrls.ListQuestion.slice(0, -1) + `${id}`
    // let newurl =
    //   qBUrls.ListQuestion.substring(0, qBUrls.ListQuestion.length - 1) + `${e}`
    axios
      .delete(URL, headers)
      .then(res => {
        this.props.alert.success('Deletion Succeeded')
        updateQues()
      })
      .catch(error => {
        console.log(error)
        this.props.alert.error('Deletion Failed')
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
    let formatedDate = qus.created_date ? qus.created_date.slice(0, 10) : ''
    // eslint-disable-next-line no-unused-vars
    // const values = {
    //   a: 'aa',
    //   b: 'bb',
    //   c: '',
    //   branches: ['a', 'b', 'c', 'd']
    // }
    const values = qus.user_details || {}
    let brnlen = values && values.branches ? values.branches.length : 0
    function sentenceCase (str) {
      if ((str === null) || (str === '')) { return false } else { str = str.toString() }

      return str.replace(/\w\S*/g, function (txt) { return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase() })
    }
    let TooltipData = values && (

      brnlen > 1
        ? <React.Fragment>
          <Typography variant='body1'> {Object.keys(values).map((key, index) => {
            if (key !== 'branches') {
              // eslint-disable-next-line quotes
              if (values[key] !== null && values[key] !== '') {
                return <li>{`${sentenceCase([key])}: ${sentenceCase(values[key])}`}</li>
              }
            }
          })}<ExpansionPanel data={values.branches} />
          </Typography>

        </React.Fragment>

        : <React.Fragment><Typography variant='body1'> {Object.keys(values).map((key, index) => {
          // eslint-disable-next-line quotes
          if (values[key] !== null && values[key] !== '') {
            return <li>{`${sentenceCase([key])}: ${sentenceCase(values[key])}`}</li>
          }
        })}
        </Typography>
        </React.Fragment>
    )
    // <h1>hello</h1>
    // values.map(item => <li>{item}</li>)
    let { classes } = this.props
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
          label={questionLevel || 'No Question levl assigned'}
          avatar={<Avatar>QL</Avatar>}
          {...chipProps}
        />
        <Chip
          label={questionCategory || 'No Question Category assigned'}
          avatar={<Avatar>QC</Avatar>}
          {...chipProps}
        />
        <Tooltip title={TooltipData} leaveDelay={800} classes={{ tooltip: classes.customWidth }} arrow interactive>
          <Chip label={qus.user_name || 'No Author'}
            avatar={<Avatar><FaceIcon /></Avatar>}
            {...chipProps}
          />
        </Tooltip>
        <Chip
          label={qus.first_name || 'No First Name'}
          avatar={<Avatar>FN</Avatar>}
          {...chipProps}
        />
        <Chip
          label={formatedDate || 'No Created Date'}
          avatar={<Avatar>CD</Avatar>}
          {...chipProps}
        />
        {qus.rating ? <Chip
          label={qus.rating || 'No Rating'}
          avatar={<Avatar><StarIcon /></Avatar>}
          {...chipProps}
        /> : ''}

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
        return <Typography style={{ color: 'rgb(132,49,86)' }} component='p'>Correct Answer: {correctAns}</Typography>
      // case 2:
      //   Comprehension
      //   break
      case 3:
        // True or False
        return <Typography style={{ color: 'rgb(132,49,86)' }} component='p'>Correct Answer: {correctAns}</Typography>
      case 4 || 5:
        // Fill in the blanks || Descriptive type
        return <Typography style={{ color: 'rgb(132,49,86)' }} component='p'>Correct Answer: {ReactHtmlParser(correctAns)}</Typography>
      default:
        return 'Question type is invalid'
    }
  }
  reSizeImageTags = string => {
    // let { imageSize } = this.state
    let regEx = new RegExp(/<img\s[a-z=]{6}"/, 'gi')
    let imageSize = this.getCustomView('get', 'imageSize')
    let replaceStr = `<img style="height:auto; width:${imageSize}vw; `
    return string.replace(regEx, replaceStr)
  }
  highlightText= (text, highlight) => {
    let addHighlight = this.getCustomView('get', 'highlightText')
    if (!addHighlight) return text
    // Split text on higlight term, include term itself into parts, ignore case
    if (typeof (highlight) === 'string' && highlight.trim('') !== '') {
      var parts = text.split(new RegExp(`(${highlight})`, 'gi'))
      return parts.map(part => part.toLowerCase() === highlight.toLowerCase() ? `<b style="background-color: orange">${part}</b>` : part).join('')
      // let highlightParts = highlight.split(' ')
      // var highlightedString = text
      // highlightParts.forEach(highlightPart => {
      /*
        * reg ex (?<=>(.+)?)(${highlight})(?=(.+)?<)
        * <p id="paragraph">in this paraller</p>
        * reg ex will only match content which surrounded by >search value<
        * (?<=>.+) preceded by > plus anything
        * (?=.+<) folowed by anything till <
        */
      //   if (highlightPart.length > 1) {
      //     var parts = highlightedString.split(new RegExp(`(?<=>(.+)?)(${highlightPart})(?=(.+)?<)`, 'gi'))
      //     highlightedString = parts.map(part => part.toLowerCase() === highlightPart.toLowerCase() ? `<b style="background-color: orange">${part}</b>` : part).join('')
      //   }
      // })
      // return highlightedString
    } else return text
  }
  getQuestion = ({ question }, index) => {
    // return ((this.props.activePage - 1) * 10) + i + 1,ReactHtmlParser(question))
    let { searchString = '' } = this.props
    question = searchString.trim() !== '' ? this.highlightText(question, searchString) : question
    return (
      <React.Fragment>
        <CardActionArea>
          <Typography style={{ color: 'rgb(132,49,86)' }} gutterBottom component='p'>
            Question :
          </Typography>
          {ReactHtmlParser(this.reSizeImageTags(question))}
        </CardActionArea>
      </React.Fragment>
    )
  }

  getOptions = (question) => {
    let { props: { classes: { optionsWrap, optionsContainter, optionDiv } } } = this
    let { searchString = '' } = this.props
    let { question_type: qType, option: options } = question
    if (qType !== 'MCQ') { return null }
    return (
      <React.Fragment>
        <Typography component='p' style={{ color: 'rgb(132,49,86)' }} >options</Typography>
        <div className={optionsWrap} >
          <div className={optionsContainter} style={{ flexDirection: this.getCustomView('get', 'optionsView') }}>
            {options.map((option, index) => {
              option = this.highlightText(option, searchString)
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
  getActionButtons = (qus, index, context) => {
    return (
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <span>
          <Typography gutterBottom component='p' style={{ color: 'rgb(132,49,86)' }} >
            {((this.props.activePage - 1) * 10) + index + 1}&nbsp;)
          </Typography>
        </span>
        <span>
          {this.getPublishActions(qus, context.updateQues)}
        </span>
        <span>
          <Button
            variant='contained'
            component={Link}
            to={`/questbox/editquestion/${qus.id}/type/normal`}
          >
            Edit
          </Button>
          <Button variant='contained' component='span'
            onClick={() => { this.handleDelete(qus.id, context.updateQues) }}
          >
            Remove
          </Button>
        </span>
      </div>
    )
  }
  transform = (node, index) => {
    console.log('transform', node, index)
  }
  handleClick = event => {
    const { currentTarget } = event
    this.setState(state => ({
      anchorEl: currentTarget,
      open: !state.open
    }))
  };
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
  customViewPanel = () => {
    console.log('come here ones-----------------------------')
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
                    <Typography className={classes.typography}>Highlight search text :</Typography>
                    <Button variant='default' component='span' onClick={() => {
                      let value = this.getCustomView('get', 'highlightText')
                      this.getCustomView('set', 'highlightText', !value)
                    }}>
                      {this.getCustomView('get', 'highlightText') ? 'true' : 'false'}
                    </Button>
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
  handleRating = (id, event) => {
    let rating = event.target.value
    let { makePublishQuestions = new Map() } = this.state
    if (rating >= 1 && rating <= 10) {
      makePublishQuestions.set(id, { rating, isPublished: false })
      // makePublishQuestions.set(id, rating)
    } else {
      makePublishQuestions.delete(id)
    }
    this.setState({ makePublishQuestions })
  };

  publishQuestion = (id, updateQues) => {
    let { headers, state: { makePublishQuestions: mPQues = new Map() } } = this
    if (!mPQues.size) { return }
    let rating = mPQues.get(id)['rating']
    let data = {
      is_approve: true,
      rating
    }
    let quesType = 'NORMAL'
    axios
      .put(qBUrls.PublishQuestion + id + `/?ques_type=${quesType}`, data, headers)
      .then(res => {
        if (res.status === 200) {
          // this.context.questions_drafted.data = this.context.questions_drafted.data.filter(item => item.id !== id)
          mPQues.set(id, { rating, isPublished: true })
          this.setState({ makePublishQuestions: mPQues })
          // mPQues.delete(id)
          // this.setState({ makePublishQuestions: mPQues })
          // this.setState({ temp1: true }) // using this statement updating the context
          this.props.alert.success('Question Published successfully')
          updateQues('PUBLISH')
        }
      })
      .catch(error => {
        console.log(
          "Error: Couldn't post data to " + qBUrls.PublishQuestion,
          error
        )
      })
  };
  getPublishActions = ({ id }, updateQues) => {
    let { makePublishQuestions: mPQues = new Map() } = this.state
    let { publishQuestions } = this.props
    if (!publishQuestions) { return null }
    let isButtonDisabled = !mPQues.has(id)
    let isInputDisabled = (mPQues.has(id) && mPQues.get(id)['isPublished'])
    let buttonText = (mPQues.has(id) && mPQues.get(id)['isPublished']) ? 'Published' : 'Publish'
    if (buttonText === 'Published') {
      isButtonDisabled = true
    }
    if (this.role === 'Reviewer' || this.role === 'Subjecthead' || this.role === 'LeadTeacher' || this.role === 'Planner') {
      return (
        <div>
          <input
            type='number'
            min={1}
            max={10}
            disabled={isInputDisabled}
            // value={mPQues.get(id)}
            onChange={(e) => { this.handleRating(id, e) }}
          />
          &nbsp;
          <Button
            variant='contained' component='span' color='primary'
            disabled={isButtonDisabled}
            // disabled={!mPQues.has(id)}
            onClick={() => { this.publishQuestion(id, updateQues) }}
          >
            {buttonText}
          </Button>
        </div>
      )
    }
  }
  // Returns a function, that, as long as it continues to be invoked, will not
  // be triggered. The function will be called after it stops being called for
  // N milliseconds. If `immediate` is passed, trigger the function on the
  // leading edge, instead of the trailing.
  // debounce = (func, wait, immediate) => {
  //   var timeout
  //   return function () {
  //     var context = this; var args = arguments
  //     var later = function () {
  //       timeout = null
  //       if (!immediate) func.apply(context, args)
  //     }
  //     var callNow = immediate && !timeout
  //     clearTimeout(timeout)
  //     timeout = setTimeout(later, wait)
  //     if (callNow) func.apply(context, args)
  //   }
  // };

  // handleSearch = this.debounce(
  //   page => {
  //     // All the taxing stuff you do
  //     let { keyNameofQuestionsData, searchQuestion } = this.props
  //     let { searchString = '' } = this.state
  //     if (searchString.trim() === '') return
  //     page = page ? page + 1 : 1
  //     searchQuestion(page, keyNameofQuestionsData, searchString)
  //   },
  //   250)
  handleSearch = page => {
    let { keyNameofQuestionsData, searchQuestion, searchString = '' } = this.props
    if (searchString.trim() === '') return
    page = page === undefined ? 1 : page
    searchQuestion(page, keyNameofQuestionsData, searchString)
  }

  handlePagination = (page) => {
    let { searchString = '' } = this.props
    if (searchString.trim() === '') {
      this.props.page(page)
    } else {
      this.handleSearch(page)
    }
  }
  render () {
    let { classes, keyNameofQuestionsData, loaderLabel, loading } = this.props

    return (
      <React.Fragment>
        <FamilyConsumer>
          {context => (

            <React.Fragment>
              {loading
                ? <InternalPageStatus label={loaderLabel} />
                : <div>
                  <div className={classes.header} style={{ margin: 15 }}>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      {this.customViewPanel()}
                      <h5 style={{ margin: 0 }}>
                      Total Questions : {(!loading && context[keyNameofQuestionsData].question_count) || ' - - '}
                      </h5>
                    </div>
                  </div>
                  <div style={{ margin: 0, padding: 0 }}>
                    {
                      (context && context[keyNameofQuestionsData] && context[keyNameofQuestionsData].data && context[keyNameofQuestionsData].data.length) > 0 ? (
                        context[keyNameofQuestionsData].data.map((qus, i) => (
                          <Paper elevation={4} className={classes.questionWrap} >
                            <Card className={classes.questionContainer}>
                              {this.getActionButtons(qus, i, context)}
                              {this.getQuestion(qus, i)}
                              {this.getOptions(qus)}
                              {this.getCorrectAns(qus)}
                              <br />
                              {this.getChips(qus)}
                            </Card>
                          </Paper>
                        ))
                      ) : loading ? (
                        <InternalPageStatus label={loaderLabel} />
                      ) : (
                        <InternalPageStatus label='No data' loader={false} />
                      )
                    }
                  </div>
                  <div style={{ padding: 20, bottom: 20, right: 0, position: 'fixed' }}>
                    <Pagination
                      rowsPerPageOptions={[10, 10]}
                      labelRowsPerPage={'Questions per page'}
                      page={this.props.activePage - 1}
                      rowsPerPage={10}
                      count={(context[keyNameofQuestionsData].total_page_count * 10)}
                      onChangePage={(e, i) => {
                        // i+1 to handle zero index
                        this.handlePagination(i + 1)
                      }}
                    // onChangeRowsPerPage={handleChangeRowsPerPage}
                    />
                  </div>
                </div>}
            </React.Fragment>
          )
          }
        </FamilyConsumer>

      </React.Fragment>
    )
  }
}
QuestionsFrame.contextType = FamilyContext

const mapStateToProps = state => ({
  user: state.authentication.user,
  questionLevel: state.questionLevel.items,
  questionCategory: state.questionCategory.items
})
const mapDispatchToProps = dispatch => ({
  loadQuestionLevel: dispatch(apiActions.listQuestionLevel()),
  loadQuestionCategory: dispatch(apiActions.listQuestionCategory())
})

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(QuestionsFrame))
