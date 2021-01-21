import React from 'react'
import { Checkbox, Grid } from 'semantic-ui-react'
import { connect } from 'react-redux'
import FaceIcon from '@material-ui/icons/Face'
import Fab from '@material-ui/core/Fab'
import Icon from '@material-ui/core/Icon'
import IconButton from '@material-ui/core/IconButton'
import AddIcon from '@material-ui/icons/Add'
import { Popper, Fade, Chip, Paper, Avatar, CardActionArea, Typography, withStyles, Button } from '@material-ui/core'
import ReactHtmlParser from 'react-html-parser'
import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'
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

class ComprehensionQuestions extends React.Component {
  constructor (props) {
    super(props)
    let { formData } = props
    this.state = {
      ...formData
    }
    this.handleCheckbox = this.handleCheckbox.bind(this)
    // this.handleSelectedQuestion = this.handleSelectedQuestion.bind(this)
  }
  // componentWillMount () {
  //   let { questionLevel, questionCategory } = this.props
  //   if (!questionCategory || !questionLevel) {
  //     this.props.loadQuestionLevel()
  //     this.props.loadQuestionCategory()
  //   }
  // }
  // componentDidMount () {
  //   this.handleSelectedQuestion()
  // }

  // handleSelectedQuestion () {
  //   this.state.comprehensionSelected.map(id => {
  //     this.setState({ [id]: true })
  //   })
  // }
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
          label={qus.subject || 'No Subject assigned'}
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
  reSizeImageTags = string => {
    let regEx = new RegExp(/<img\s[a-z=]{6}"/, 'gi')
    let imageSize = this.getCustomView('get', 'imageSize')
    let replaceStr = `<img style="height:auto; width:${imageSize}vw; `
    return string.replace(regEx, replaceStr)
  }
getComprehension = (questionObj, index) => {
  return (
    <React.Fragment>
      <CardActionArea key={index}>
        <Typography style={{ color: 'rgb(132,49,86)' }} variant='h6' component='p' gutterBottom>
        Comprehension: {index + 1}
        </Typography>
        {ReactHtmlParser(this.reSizeImageTags(questionObj.compreshion_text))}
      </CardActionArea>
      {questionObj.questions.map((question, index) => {
        return (
          <div style={{ marginTop: 15, borderTop: '1px dashed rgb(132,49,86)' }}>
            {this.getCompQuestion(question, (index + 1))}
            {this.getOptions(question)}
            {this.getCorrectAns(question)}
          </div>

        )
      })}
    </React.Fragment>
  )
}
getCompQuestion =(question, index) => {
  console.log('question', question.questiontext)
  return (
    <React.Fragment>
      <CardActionArea>
        <Typography style={{ color: 'rgb(132,49,86)' }} component='p' gutterBottom>
        Question : {index}
        </Typography>
        {ReactHtmlParser(this.reSizeImageTags(question.questiontext))}
      </CardActionArea>
    </React.Fragment>
  )
}

getOptions =(question) => {
  let { props: { classes: { optionsWrap, optionsContainter, optionDiv } } } = this
  let{ option: options = [] } = question
  return (
    <React.Fragment>
      <Typography style={{ color: 'rgb(132,49,86)' }} component='p' gutterBottom>Options</Typography>
      <div className={optionsWrap} >
        <div className={optionsContainter} style={{ flexDirection: this.getCustomView('get', 'optionsView') }}>
          {options.map((option, index) => {
            return (
              <CardActionArea key={index} className={optionDiv}>
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
  let { correct_ans: correctAns, question_id: id } = question
  if (!correctAns) { return null }
  let regEx = new RegExp(/option[1-4]/, 'i')
  let correctOption = correctAns.match(regEx)
  correctAns = correctOption ? correctOption[0] : `No Valid option for question with Id ${id}`
  return <Typography style={{ color: 'rgb(132,49,86)' }} component='p'>Correct Answer : {correctAns}</Typography>
}
getCustomView=(method, key, value) => {
}
customViewPanel=() => {
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

transform=(node, index) => {
  console.log('transform', node, index)
}

handleCheckbox (id, questionObj) {
  // let selectedQuestions = this.props.questions.data.filter(question => {
  //   return question.id === id
  // })
  // let selectedSubquestions = []
  // selectedQuestions.forEach(question => {
  //   question.questions.forEach(subQuestion => {
  //     selectedSubquestions.push(subQuestion.question_id)
  //   })
  // })
  // if (this.state.comprehensionSelected.includes(id)) {
  //   // question is being removed
  //   let comprehensionSelected = this.state.comprehensionSelected.filter(idx => id !== idx)
  //   this.setState({ comprehensionSelected, [id]: false })
  //   this.props.onSelectQuestions(selectedSubquestions, 'removed', 'comp', comprehensionSelected)
  // } else {
  //   // question is being added
  //   let comprehensionSelected = [...this.state.comprehensionSelected, id]
  //   this.setState({ comprehensionSelected, [id]: true })
  //   this.props.onSelectQuestions(selectedSubquestions, 'added', 'comp', comprehensionSelected)
  // }

  this.props.onSelectQuestions(id, questionObj, 'comp')
}
  handlePage = i => {
    console.log(i)
    this.props.goToPage(i)
    this.setState({ activePage: i })
  }
  render () {
    let { questions: { data: questionsData = [] } } = this.props
    let { selectedQuestionsMap: selQuesMap = new Map() } = this.props
    return <div>
      {questionsData.length
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
          <Grid>
            <Grid.Row>
              <Grid.Column floated='right' width={5}>
                {' '}
                  Total Questions :{' '}
                {this.props.questions && this.props.questions.question_count}
              </Grid.Column>
            </Grid.Row>
            <Grid.Row>
              {this.props.questions.data.map((question, index) => {
                return <Card key={index}
                  style={{
                    margin: 16,
                    width: '100%',
                    ...selQuesMap.has(`${question.id}_comp`) ? { backgroundColor: 'rgb(165,233,153)' } : {} }}>
                  <CardContent>
                    <Checkbox
                      key={question.id}
                      label='Select'
                      value={question.id}
                      name='questions'
                      checked={selQuesMap.has(`${question.id}_comp`)}
                      onChange={() => this.handleCheckbox(question.id, question)}
                    />
                    {this.getComprehension(question, index)}
                    <br />
                    {this.getChips(question)}
                  </CardContent>
                </Card>
              })}
            </Grid.Row>
          </Grid>

        </React.Fragment>
        : <InternalPageStatus label='No Comprehension type Questions' loader={false} />
      }
    </div>
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

export default connect(mapStateToProps)(withStyles(styles)(ComprehensionQuestions))
