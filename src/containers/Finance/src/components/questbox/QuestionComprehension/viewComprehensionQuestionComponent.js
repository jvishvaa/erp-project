import React, { Component } from 'react'
import ReactHtmlParser from 'react-html-parser'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import { Popper, Fade, Paper, Chip, Avatar, Button, withStyles, Card, CardActionArea, Typography, Tooltip } from '@material-ui/core'
import AddIcon from '@material-ui/icons/Add'
import Input from '@material-ui/core/InputBase'
import { debounce } from 'throttle-debounce'
import SearchIcon from '@material-ui/icons/Search'
import Fab from '@material-ui/core/Fab'
import FaceIcon from '@material-ui/icons/Face'
import StarIcon from '@material-ui/icons/Star'
import IconButton from '@material-ui/core/IconButton'
import Icon from '@material-ui/core/Icon'
import axios from 'axios'
import { qBUrls, urls } from '../../../urls'
import { FamilyConsumer, FamilyContext } from '../SmallContext'
import { InternalPageStatus, Pagination } from '../../../ui'
import { apiActions } from '../../../_actions'
import ExpansionPanel from './ExpansionPanel'

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
class CompQuestionsFrame extends Component {
  constructor (props) {
    super(props)
    let customViewStyles = new Map()
    customViewStyles.set('imageSize', 15)// vw 5vw-60vw
    customViewStyles.set('maxImageSize', 60)
    customViewStyles.set('minImageSize', 5)
    customViewStyles.set('optionsView', ['row', 'column'])
    customViewStyles.set('viewOpted', 0)
    this.state = {
      searchValue: '',
      filteredData: '',
      datais: true,
      loading: false,
      queries: '',
      customViewStyles
    }
    this.handleDelete = this.handleDelete.bind(this)
    this.SearchFunction = this.SearchFunction.bind(this)
    this.headers = { headers: { Authorization: 'Bearer ' + this.props.user } }
    let userProfile = JSON.parse(window.localStorage.getItem('user_profile'))
    this.role = userProfile ? userProfile.personal_info.role : null
  }
  componentWillUpdate () {
    this.headers = { headers: { Authorization: 'Bearer ' + this.props.user } }
  }
  handleDelete (id, updateQues) {
    let { headers } = this
    let URL = qBUrls.ListQuestion.slice(0, -1) + `${id}`
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
    let subjectName = qus.subject || qus.subjectname
    // eslint-disable-next-line no-unused-vars
    // const values = {
    //   a: 'aa',
    //   b: 'bb',
    //   c: '',
    //   branches: ['a', 'b', 'c', 'd']
    // }
    const values = qus.user_details || {}
    let brnlen = values.branches == null ? 0 : values.branches.length
    function sentenceCase (str) {
      if ((str === null) || (str === '')) { return false } else { str = str.toString() }

      return str.replace(/\w\S*/g, function (txt) { return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase() })
    }
    let TooltipData = (
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
    let { classes } = this.props
    return (
      <React.Fragment>
        <Chip
          label={subjectName || 'No Subject assigned'}
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
        <Tooltip title={TooltipData} leaveDelay={800} classes={{ tooltip: classes.customWidth }} arrow interactive>
          <Chip
            label={qus.user_name || 'No Author'}
            avatar={<Avatar><FaceIcon /></Avatar>}
            {...chipProps}
          />
        </Tooltip>
        {qus.rating ? <Chip
          label={qus.rating || 'No Rating'}
          avatar={<Avatar><StarIcon /></Avatar>}
          {...chipProps}
        /> : ''}

      </React.Fragment>
    )
  }
  getCorrectAns = (question) => {
    let { correct_ans: correctAns, question_id: id } = question
    if (!correctAns) { return null }
    let regEx = new RegExp(/option[1-4]/, 'i')
    let correctOption = correctAns.match(regEx)
    correctAns = correctOption ? correctOption[0] : `No Valid option for question with Id ${id}`
    return <Typography style={{ color: 'rgb(132,49,86)' }} component='p'>Correct Answer: {correctAns}</Typography>
  }
    reSizeImageTags = string => {
      let regEx = new RegExp(/<img\s[a-z=]{6}"/, 'gi')
      let imageSize = this.getCustomView('get', 'imageSize')
      let replaceStr = `<img style="height:auto; width:${imageSize}vw; `
      return string.replace(regEx, replaceStr)
    }
    highLightQuery = (data) => {
      let { searchValue = '' } = this.state
      if (data && (typeof (data) === 'string') && (searchValue.trim() !== '')) {
        console.log(searchValue)
        let regEx = new RegExp('' + searchValue + '', 'gi')
        let replaceStr = `<span style="background-color: yellow;">${searchValue}</span>`
        console.log(data, regEx, replaceStr, data.replace(regEx, replaceStr))
        console.log(data.replace(regEx, replaceStr), 'mk')
        // eslint-disable-next-line no-debugger
        // debugger
        return data.replace(regEx, replaceStr)
      }
      return data
    }
  getComprehension =(questionObj) => {
    console.log('comppp')

    return (
      <React.Fragment>
        <CardActionArea>
          <Typography style={{ color: 'rgb(132,49,86)' }} variant='h6' component='p' gutterBottom>
          Comprehension :
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
          {ReactHtmlParser(this.highLightQuery(this.reSizeImageTags(question.questiontext)))}
        </CardActionArea>
      </React.Fragment>
    )
  }

  getOptions =(question) => {
    let { props: { classes: { optionsWrap, optionsContainter, optionDiv } } } = this
    let{ option: options = [] } = question
    return (
      <React.Fragment>
        <Typography style={{ color: 'rgb(132,49,86)' }} component='p' gutterBottom>options </Typography>
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
          <Typography gutterBottom component='p' style={{ color: 'rgb(132,49,86)' }} >
            {((this.props.activePage - 1) * 4) + index + 1}&nbsp;)
          </Typography>
        </span>
        <span>
          {this.getPublishActions(qus, context.updateQues)}
        </span>
        <span>
          <Button
            variant='contained'
            component={Link}
            to={`/questbox/editquestion/${qus.id}/type/comp`}
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
    console.log('i am inside customview')
    let { customViewStyles: cVStyles } = this.state
    if (method === 'get') {
      if (key === 'optionsView') {
        let viewOpted = cVStyles.get('viewOpted')
        let optionsView = cVStyles.get('optionsView')
        if (viewOpted !== 0 || !optionsView) {
        }
        return optionsView[viewOpted]
      }
      return cVStyles.get(key)
    }
    if (method === 'set') {
      if (key === 'optionsView') {
        let viewOpted = cVStyles.get('viewOpted') ? 0 : 1
        cVStyles.set('viewOpted', viewOpted)
      } else {
        cVStyles.set(key, value)
      }
      this.setState({ customViewStyles: cVStyles })
    }
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

  handleRating = (id, event) => {
    let rating = event.target.value
    let { makePublishQuestions = new Map() } = this.state
    if (rating >= 1 && rating <= 10) {
      makePublishQuestions.set(id, { rating, isPublished: false })
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
    let quesType = 'COMP'
    axios
      .put(qBUrls.PublishQuestion + id + `/?ques_type=${quesType}`, data, headers)
      .then(res => {
        if (res.status === 200) {
          mPQues.set(id, { rating, isPublished: true })
          this.setState({ makePublishQuestions: mPQues })
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
    if (this.role === 'Reviewer' || this.role === 'Subjecthead' || this.role === 'Planner') {
      console.log('i ammm re')
      return (
        <div>
          <input
            type='number'
            min={1}
            max={10}
            disabled={isInputDisabled}
            onChange={(e) => { this.handleRating(id, e) }}
          />
          &nbsp;
          <Button
            variant='contained' component='span' color='primary'
            disabled={isButtonDisabled}
            onClick={() => { this.publishQuestion(id, updateQues) }}
          >
            {buttonText}
          </Button>
        </div>
      )
    }
  }
  SearchFunction (pageNo) {
    console.log('hello', this.state.searchValue)

    this.setState({ loading: true })
    debounce(5000, () => {
      axios
        .get(urls.ListComprehenssionQuestionSearch + '?page_no=' + pageNo + '&page_size=' + 4 + '&search=' + this.state.searchValue, {
          headers: {
            Authorization: 'Bearer ' + this.props.user
          }
        })
        .then(res => {
          console.log(res.data)
          this.setState({ queries: res.data.query })
          if (res.data.query && res.data.data.length > 0) {
            this.setState({ searchedData: res.data, loading: false })
          } else if (res.data.query && res.data.data.length === 0) { this.setState({ searchedData: res.data, loading: false }) } else {
            this.setState({ datais: true, searchedData: res.data, loading: false })
          }
        })
        .catch(error => {
          this.setState({ loading: false })
          this.props.alert.warning('Something went wrong with elastic search')

          console.log('error', error)
          // this.setState({ loading: false })
        })
    })()
    // this.setState({ questions_context: { data: this.state.searchData } })
    // this.setState({ questions_context: this.state.searchData })
  }

  handleSearch = (e) => {
    this.setState({ searchValue: e.target.value, datais: false })
    this.props.getSearchValue(e.target.value)

    if (e.target.value !== '') {
      this.SearchFunction(this.props.activePage)
    } else {
      this.setState({ loading: false, datais: true })
    }
  }

  ignoreThisFunction=() => {
    console.log('ignoreee')
  }

  render () {
    const { searchValue } = this.props
    console.log(searchValue, 'searrrrrrr', this.props)

    let { classes, keyNameofQuestionsData, loaderLabel, loading } = this.props
    console.log(this.props.keyNameofQuestionsData, this.state.datais)
    return (
      <React.Fragment>

        <div style={{ padding: 16, display: 'flex', flexDirection: 'row-reverse', position: 'relative', transition: 'all 2s cubic-bezier(0.4, 0, 0.2, 1)', marginLeft: '80%' }}>
          <div style={{ display: 'flex', position: 'relative', borderRadius: '20px', backgroundColor: 'rgb(226, 226, 226)', transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)' }}>
            <div style={{ position: 'relative', marginLeft: '20px', top: '3px', color: 'white' }}>
              <SearchIcon style={{ color: 'rgba(0,0,0,0.7)' }} /></div>
            <div style={{ marginLeft: 30, position: 'relative' }}>
              <Input
                type='search'
                placeholder='Search…'
                onChange={this.handleSearch}
                value={this.state.searchValue}
                style={{ color: '#000', display: 'flex', position: 'relative', width: 100 }}
              />
            </div>
          </div>
        </div>
        <FamilyConsumer>
          {context => (
            loading
              ? <InternalPageStatus label={loaderLabel} />
              : <div>
                <div className={classes.header} style={{ margin: 15 }}>
                  <div>
                    <h5>
                      Total Questions : {this.state.datais ? context[keyNameofQuestionsData].question_count || ' - - ' : (this.state.searchedData && this.state.searchedData.question_count > 10 && this.state.searchedData.question_count) || ' - -'}
                    </h5>
                    {this.customViewPanel()}
                  </div>
                </div>

                <div style={{ margin: 0, padding: 0 }}>

                  {

                    this.state.datais ? ((context && context[keyNameofQuestionsData] && context[keyNameofQuestionsData].data.length) > 0 ? (
                      context[keyNameofQuestionsData].data.map((qus, i) => (

                        <Paper elevation={4} className={classes.questionWrap} >
                          <Card className={classes.questionContainer}>
                            {this.getActionButtons(qus, i, context)}
                            {this.getComprehension(qus)}
                            <br />
                            {this.getChips(qus)}
                          </Card>
                        </Paper>
                      ))
                    ) : loading ? (
                      <InternalPageStatus label={loaderLabel} />
                    ) : (
                      <InternalPageStatus label='No data' loader={false} />
                    )) : (this.state.searchedData ? (
                      this.state.searchedData.data.map((qus, i) => (
                        <Paper elevation={4} className={classes.questionWrap} >
                          <Card className={classes.questionContainer}>
                            {this.getActionButtons(qus, i, context)}
                            {this.getComprehension(qus)}
                            <br />
                            {this.getChips(qus)}
                          </Card>
                        </Paper>
                      ))
                    ) : this.state.loading ? (
                      <InternalPageStatus label={loaderLabel} />
                    )
                      : (<InternalPageStatus label='No data' loader={false} />)
                    )
                  }
                  {this.state.queries && this.state.searchedData && this.state.searchedData.data.length === 0 ? (<InternalPageStatus label='No data' loader={false} />) : ''}

                </div>
                <div style={{ padding: 20, bottom: 20, right: 0, position: 'fixed' }}>
                  <Pagination
                    rowsPerPageOptions={[4, 4]}
                    labelRowsPerPage={'Questions per page'}
                    page={this.props.activePage - 1}
                    rowsPerPage={4}
                    count={this.state.datais ? (context[keyNameofQuestionsData].total_page_count * 4) : this.state.searchedData && this.state.searchedData.total_page_count * 4}
                    onChangePage={(e, i) => {
                      this.props.page(i + 1); this.state.searchValue !== '' ? this.SearchFunction(i + 1) : this.ignoreThisFunction()
                    }}
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
CompQuestionsFrame.contextType = FamilyContext

const mapStateToProps = state => ({
  user: state.authentication.user,
  questionLevel: state.questionLevel.items,
  questionCategory: state.questionCategory.items
})
const mapDispatchToProps = dispatch => ({
  loadQuestionLevel: dispatch(apiActions.listQuestionLevel()),
  loadQuestionCategory: dispatch(apiActions.listQuestionCategory())
})

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(CompQuestionsFrame))
