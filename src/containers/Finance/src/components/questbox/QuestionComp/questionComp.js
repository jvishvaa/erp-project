import React, { Component } from 'react'
import ReactHtmlParser from 'react-html-parser'
import Pagination from 'react-js-pagination'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import { Popper, Fade, Paper, Chip, Avatar, Button, withStyles, Card, CardActionArea, Typography } from '@material-ui/core'
import AddIcon from '@material-ui/icons/Add'
import Fab from '@material-ui/core/Fab'
import FaceIcon from '@material-ui/icons/Face'
import IconButton from '@material-ui/core/IconButton'
import Icon from '@material-ui/core/Icon'
import axios from 'axios'
import { qBUrls } from '../../../urls'
import { FamilyConsumer } from '../SmallContext'
import { InternalPageStatus } from '../../../ui'
import { apiActions } from '../../../_actions'

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
class QuestionComp extends Component {
  constructor (props) {
    console.log('inside const comp')
    super(props)
    let customViewStyles = new Map()
    customViewStyles.set('imageSize', 15)// vw 5vw-60vw
    customViewStyles.set('maxImageSize', 60)
    customViewStyles.set('minImageSize', 5)
    customViewStyles.set('optionsView', ['row', 'column'])
    customViewStyles.set('viewOpted', 0)
    this.state = {
      questions: {
        data: [],
        loading: false,
        activePage: 15
      },
      imageSize: 20, // vw 20-60
      maxImageSize: 60,
      minImageSize: 20,
      optionsView: ['row', 'column'],
      viewOpted: 0,
      customViewStyles
    }
    this.handleDelete = this.handleDelete.bind(this)
  }

  handleDelete (e, updateQues) {
    let newurl =
      qBUrls.ListQuestion.substring(0, qBUrls.ListQuestion.length - 1) + `${e}`
    axios
      .delete(newurl, {
        headers: {
          Authorization: 'Bearer ' + this.props.user
        }
      })
      .then(res => {
        console.log(res)
        this.props.alert.success('Question Deleted')
        updateQues()
      })
      .catch(error => {
        console.log(error)
        this.props.alert.error('Something went wrong')
      })
  }

  getChips = (qus) => {
    let { variant, color } = this.state
    console.log(variant, color)
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
          label={questionLevel || 'No Question levl assigned'}
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
        return <Typography component='p'>Correct Answer: {correctAns}</Typography>
      // case 2:
      //   Comprehension
      //   break
      case 3:
        // True or False
        return <Typography component='p'>Correct Answer: {correctAns}</Typography>
      case 4 || 5:
        // Fill in the blanks || Descriptive type
        return <Typography component='p'>Correct Answer: {ReactHtmlParser(correctAns)}</Typography>
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
  getQuestion =({ question }, index) => {
    // return ((this.props.activePage - 1) * 10) + i + 1,ReactHtmlParser(question))
    return (
      <React.Fragment>
        <CardActionArea>
          <Typography gutterBottom component='p'>
          Question :
            {/* {((this.props.activePage - 1) * 10) + index + 1})&nbsp;: */}
          </Typography>
          {ReactHtmlParser(this.reSizeImageTags(question))}
        </CardActionArea>
      </React.Fragment>
    )
  }

  getOptions =(question) => {
    let { props: { classes: { optionsWrap, optionsContainter, optionDiv } } } = this
    let{ question_type: qType, option: options } = question
    if (qType !== 'MCQ') { return null }
    return (
      <React.Fragment>
        <Typography component='p'>options</Typography>
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
  getActionButtons=(qus, index, context) => {
    return (
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <span>
          <Typography gutterBottom component='p'>
            {((this.props.activePage - 1) * 10) + index + 1}&nbsp;)
          </Typography>
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
  transform=(node, index) => {
    console.log('transform', node, index)
  }
  handleClick = event => {
    const { currentTarget } = event
    this.setState(state => ({
      anchorEl: currentTarget,
      open: !state.open
    }))
  };
  getCustomView=(method, key, value) => {
    let { customViewStyles: cVStyles } = this.state
    // let returnValue
    if (method === 'get') {
      if (key === 'optionsView') {
        let viewOpted = cVStyles.get('viewOpted')
        let optionsView = cVStyles.get('optionsView')
        if (viewOpted !== 0 || !optionsView) {
          // eslint-disable-next-line no-debugger
          debugger
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
  customViewPanel=() => {
    const { classes } = this.props
    const { anchorEl = null, open = false } = this.state
    const id = open ? 'simple-popper' : null
    console.log(classes)
    return (
      <div>
        <Button aria-describedby={id} onClick={this.handleClick}>
          {/* Edit Questions View */}
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
                          onClick={() => { this.getCustomView('set', 'imageSize', 20) }}
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
  render () {
    let { classes, keyNameofQuestionsData } = this.props
    return (
      <React.Fragment>
        <FamilyConsumer>
          {context => (
            context.loading
              ? <InternalPageStatus label='Loading Questions...' />
              : <div>
                <div className={classes.header} style={{ margin: 15 }}>
                  <div>
                    <h5>
                      {((context) => {
                        console.log(context)
                        if (context) {
                          if (context[keyNameofQuestionsData]) {
                            if (context[keyNameofQuestionsData].question_count) {
                              return context[keyNameofQuestionsData].question_count
                            }
                          }
                        }
                        return ' - - '
                        // eslint-disable-next-line no-debugger
                        // debugger
                      })()}
                      {/* Total Questions : {context.questions_context.question_count || ' - -'} */}
                    </h5>
                    {this.customViewPanel()}
                  </div>
                </div>
                <div style={{ margin: 0, padding: 0 }}>
                  {
                    context.questions_context.data.length > 0 ? (
                      context.questions_context.data.map((qus, i) => (
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
                    ) : context.loading ? (
                      <InternalPageStatus label='Loading Questions...' />
                    ) : (
                      <InternalPageStatus label='No data' loader={false} />
                    )
                  }
                </div>
                <div className={classes.header} style={{ margin: 15 }}>
                  <Pagination
                    activePage={this.props.activePage}
                    totalItemsCount={
                      context.questions_context.total_page_count * 10
                    }
                    itemsCountPerPage={10}
                    pageRangeDisplayed={5}
                    onChange={this.props.page}
                  />
                </div>
              </div>
          )
          }
        </FamilyConsumer>
      </React.Fragment>
    )
  }
}

const mapStateToProps = state => ({
  user: state.authentication.user,
  questionLevel: state.questionLevel.items,
  questionCategory: state.questionCategory.items
})
const mapDispatchToProps = dispatch => ({
  loadQuestionLevel: dispatch(apiActions.listQuestionLevel()),
  loadQuestionCategory: dispatch(apiActions.listQuestionCategory())
})

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(QuestionComp))
