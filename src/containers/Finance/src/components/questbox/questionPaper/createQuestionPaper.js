import React, { Component, Fragment } from 'react'
import { Form, Input, TextArea } from 'semantic-ui-react'
import { withRouter } from 'react-router-dom'
import axios from 'axios'
import HTML5Backend from 'react-dnd-html5-backend'
import { DragDropContext } from 'react-dnd'
import { connect } from 'react-redux'
import ReactHtmlParser from 'react-html-parser'
import ClearIcon from '@material-ui/icons/Clear'
// import SwipeableDrawer from '@material-ui/core/SwipeableDrawer'
import Drawer from '@material-ui/core/Drawer'
import ExpandLess from '@material-ui/icons/ExpandLess'
import ExpandMore from '@material-ui/icons/ExpandMore'
import Typography from '@material-ui/core/Typography'
import { Stepper, Step, StepLabel, withStyles, Grid, Button, Tabs, Tab, AppBar, Collapse, ListItem, List, ListItemText, Paper, TextField } from '@material-ui/core'
import Badge from '@material-ui/core/Badge'
import './summary.css'
import { urls, qBUrls } from '../../../urls'
import QuestionSel from '../QuestionComp/questionSel'
import ComprehensionQuestions from '../QuestionComp/comprehensionQuestions'
import Checkbox from '../Checkbox/Checkbox'
import { OmsSelect, InternalPageStatus, Toolbar } from '../../../ui'
import GSelect from '../../../_components/globalselector'
import { COMBINATIONS } from '../config/combination'
import Card from '../CreateTest/card'
import './duration.css'
import ReportConfiguration from '../reportConfiguration/reportConfiguration'

const update = require('immutability-helper')

const styles = theme => ({
  root: {
    width: '90%'
  },
  padding: {
    padding: `0 ${theme.spacing.unit * 4}px`
  },
  button: {
    marginRight: theme.spacing.unit
  },
  instructions: {
    marginTop: theme.spacing.unit,
    marginBottom: theme.spacing.unit
  },
  floatRight: {
    // float: 'right'
  }
})

// let filterQuestionType = []
// let filterQuestionLevel = []
// let filterQuestionCategory = []
// let filterChapter = []

function TabContainer (props) {
  return (
    <Typography component='div' style={{ padding: 8 * 3 }}>
      {props.children}
    </Typography>
  )
}
function convertMinsToHrsMins (mins) {
  let h = Math.floor(mins / 60)
  let m = mins % 60
  h = h < 10 ? '0' + h : h
  m = m < 10 ? '0' + m : m
  return `${h}:${m}`
}
class CreateQuestionPaper extends Component {
  constructor () {
    super()
    this.state = {
      questionPaperTypes: [],
      questionPaperSubTypes: [],
      subjectArr: [],
      gradeArr: [],
      chapter: {},
      questionTypeArr: [],
      questionLevelArr: [],
      questionCategoryArr: [],
      activeStep: 0,
      questionStatus: 'Mine',
      filter: 'notapply',
      skipped: new Set(),
      tab: 'MCQ',
      index: [],
      pageNo: 1,
      aSelectedQuestions: new Set(),
      selectedMCQ: [],
      selectedComp: [],
      selectedQuestions: [],
      comprehensionSelected: [],
      questions_context: {
        data: []
      },
      mins: 0,
      filterQuestionType: new Set(),
      filterQuestionLevel: new Set(),
      filterQuestionCategory: new Set(),
      filterChapter: new Set(),
      viewSummary: false,
      testTypes: [{ label: 'offline', value: 'offline' }, { label: 'online', value: 'online' }],
      globalSelectorKey: new Date().getTime(),
      selectedTestType: ''

    }
    this.userProfile = JSON.parse(localStorage.getItem('user_profile'))
    this.getStepContent = this.getStepContent.bind(this)
    this.role = JSON.parse(localStorage.getItem('user_profile')).personal_info.role
  }

  isStepOptional = step => {

  }

  isStepFailed = step => {
    return step === 1
  }

    handleCheckbox = (e, i) => {
      let {
        filterQuestionType: fQType = new Set(),
        filterQuestionLevel: fQLevel = new Set(),
        filterQuestionCategory: fQCatgry = new Set(),
        filterChapter: fChapter = new Set()
      } = this.state
      var itemId = `${i.value}`
      var itemName = `${i.name}`
      console.log(itemName)
      if (itemName === 'Question Type') {
        console.log('TYpe TEst 117', fQType)
        fQType.has(itemId) ? fQType.delete(itemId) : fQType.add(itemId)
      }

      // Question Level
      if (itemName === 'Question Level') {
        fQLevel.has(itemId) ? fQLevel.delete(itemId) : fQLevel.add(itemId)
      }
      //  Chapter
      if (itemName === 'Chapter') {
        fChapter.has(itemId) ? fChapter.delete(itemId) : fChapter.add(itemId)
      }

      // Question Category
      if (itemName === 'Question Category') {
        fQCatgry.has(itemId) ? fQCatgry.delete(itemId) : fQCatgry.add(itemId)
      }
      console.log(fQLevel, 'Changed or not?')
      this.setState({
        filterQuestionType: fQType,
        filterQuestionLevel: fQLevel,
        filterQuestionCategory: fQCatgry
        // filterChapter: fChapter
      })
    }

    // handleCheckbox = (e, i) => {
    //   if (i.name === 'Question Type') {
    //     if (i.checked) {
    //       console.log('checked', i.name)
    //       if (filterQuestionType.includes(String(i.value)) === false) {
    //         filterQuestionType.push(`${i.value}`)
    //       }
    //       console.log(filterQuestionType)
    //     } else {
    //       console.log('unchecked', i.name)
    //       if (filterQuestionType.includes(String(i.value)) === true) {
    //         let v = filterQuestionType.indexOf(String(i.value))
    //         filterQuestionType.splice(v, 1)
    //       }
    //       console.log(filterQuestionType)
    //     }
    //   }

    //   // Question Level
    //   if (i.name === 'Question Level') {
    //     if (i.checked) {
    //       console.log('checked', i.name)
    //       if (filterQuestionLevel.includes(String(i.label)) === false) {
    //         filterQuestionLevel.push(`${i.value}`)
    //       }
    //       console.log(filterQuestionLevel.value)
    //     } else {
    //       console.log('unchecked', i.name)
    //       if (filterQuestionLevel.includes(String(i.label)) === true) {
    //         let v = filterQuestionLevel.indexOf(String(i.label))
    //         filterQuestionLevel.splice(v, 1)
    //       }
    //     }
    //     console.log('printing filterQuestionLevel here')
    //     console.log(filterQuestionLevel)
    //   }
    //   //  Chapter
    //   if (i.name === 'Chapter') {
    //     if (i.checked) {
    //       console.log('checked', i.name)
    //       if (filterChapter.includes(String(i.label)) === false) {
    //         filterChapter.push(`${i.value}`)
    //       }
    //       console.log(filterChapter)
    //     } else {
    //       console.log('unchecked', i.name)
    //       if (filterChapter.includes(String(i.label)) === true) {
    //         let v = filterChapter.indexOf(String(i.label))
    //         filterChapter.splice(v, 1)
    //       }
    //       console.log(filterChapter)
    //     }
    //   }

    //   // Question Category
    //   if (i.name === 'Question Category') {
    //     if (i.checked) {
    //       console.log('checked', i.name)
    //       if (filterQuestionCategory.includes(String(i.label)) === false) {
    //         filterQuestionCategory.push(`${i.label}`)
    //       }
    //       console.log(filterQuestionCategory)
    //     } else {
    //       console.log('unchecked', i.name)
    //       if (filterQuestionCategory.includes(String(i.label)) === true) {
    //         let v = filterQuestionCategory.indexOf(String(i.label))
    //         filterQuestionCategory.splice(v, 1)
    //       }
    //       console.log(filterQuestionCategory)
    //     }
    //   }
    //   // this.setState({ chapt : filter_subjects })
    //   if ((this.state.gradeID === 'Grades' || this.state.subjectID === 'Subjects') && this.state.questions.question_count > 0) {
    //     let queryString = ''
    //     // queryString = `?gradeID=${gradeString.substring(0,gradeString.length-1)}&subjectID=${subjectString.substring(0,subjectString.length-1)}`;
    //     queryString = `?grade_id=${String(this.state.gradeID)}&subject_id=${String(this.state.subjectID)}`
    //     queryString = qBUrls.Chapter + queryString
    //     this.setState({ chapterArr: null },
    //       () => {
    //         axios
    //           .get(queryString, {
    //             headers: {
    //               Authorization: 'Bearer ' + this.props.token,
    //               'Content-Type': 'application/json'
    //             }
    //           })
    //           .then((res) => {
    //             const chapterarr = res.data[0].map(chp => {
    //               return {
    //                 key: `${chp.id}`,
    //                 value: chp.id,
    //                 text: chp.chapter_name
    //               }
    //             })
    //             this.setState({ chapterArr: chapterarr }, () => {
    //             })
    //           })
    //       })
    //   }
    // }

    // selectQuestion = (questionId, questionObj, method, type, comp) => {
    // let selectedQuestions = [...this.state.selectedQuestions]
    // let selectedMCQ = [...this.state.selectedMCQ]
    // let selectedComp = [...this.state.selectedComp]
    // let comprehensionSelected = [...this.state.comprehensionSelected]
    // if (method === 'added') {
    //   if (type === 'comp') {
    //     selectedQuestions.push(...question)
    //     selectedComp.push(...question)
    //     comprehensionSelected.push(...comp)
    //   } else {
    //     selectedQuestions.push(question)
    //     selectedMCQ.push(question)
    //   }
    // } else if (method === 'removed') {
    //   if (type === 'comp') {
    //     let index = comprehensionSelected.indexOf(question)
    //     comprehensionSelected.splice(index, 1)
    //     question.forEach(quest => {
    //       let index = selectedQuestions.indexOf(quest)
    //       selectedQuestions.splice(index, 1)
    //       let indexInComp = selectedComp.indexOf(quest)
    //       selectedComp.splice(indexInComp, 1)
    //     })
    //   } else {
    //     let index = selectedQuestions.indexOf(question)
    //     selectedQuestions.splice(index, 1)
    //     let indexInMCQ = selectedMCQ.indexOf(question)
    //     selectedMCQ.splice(indexInMCQ, 1)
    //   }
    // }
    // this.setState({ selectedQuestions, selectedComp, selectedMCQ, comprehensionSelected })
    // }
getTabContent = () => {
  let { tab, loadingMCQ, loadingcomp, questionPaperTypelabel } = this.state
  if (tab === 'MCQ') {
    if (loadingMCQ) {
      return <InternalPageStatus label={`Loading questions...`} />
    }
    return (<TabContainer>
      <QuestionSel
        goToPage={(pageNo) => this.applyFilter('MCQ', pageNo)}
        onSelectQuestions={this.selectQuestion}
        questions={this.state.questions}
        questionLevel={this.state.questionLevelArr}
        questionCategory={this.state.questionCategoryArr}
        formData={this.state}
        activePage={this.state.pageNo}
        selectedQuestionsMap={this.state.selectedQuesMap}
        qType={questionPaperTypelabel}

      />
    </TabContainer>)
  } else if (tab === 'comp') {
    if (loadingcomp) {
      return <InternalPageStatus label={`Loading comprehension questions...`} />
    }
    return (<TabContainer>
      <ComprehensionQuestions
        goToPage={(pageNo) => this.applyFilter('comp', pageNo)}
        onSelectQuestions={this.selectQuestion}
        questions={this.state.comprehensionQuestions}
        questionLevel={this.state.questionLevelArr}
        questionCategory={this.state.questionCategoryArr}
        formData={this.state}
        activePage={this.state.pageNo}
        selectedQuestionsMap={this.state.selectedQuesMap}
      />
    </TabContainer>)
  }
}
  getFilterContent=() => {
    let {
      filterQuestionType = new Set(),
      filterQuestionLevel = new Set(),
      filterQuestionCategory = new Set(),
      filterChapter = new Set()
    } = this.state
    return (<React.Fragment>
      <Checkbox
        heading='Question Level'
        array={this.state.questionLevelArr}
        change={this.handleCheckbox}
        checkedItems={[...filterQuestionLevel]}
      />
      <Checkbox
        heading='Question Category'
        array={this.state.questionCategoryArr}
        change={this.handleCheckbox}
        checkedItems={[...filterQuestionCategory]}
      />
      <Checkbox
        heading='Question Type'
        array={this.state.questionTypeArr}
        change={this.handleCheckbox}
        checkedItems={[...filterQuestionType]}
        qType={this.state.questionPaperTypelabel}

      />
      <Checkbox
        heading='Chapter'
        array={this.state.chapterArr}
        change={this.handleCheckbox}
        checkedItems={[...filterChapter]}
      />
      <Button
        variant='outlined'
        color='primary'
        size='large'
        style={{ width: '100%' }}
        // onClick={() => this.applyFilter(this.state.tab)}
        onClick={() => this.applyFilter()}
        primary
      >
        Apply Filter
      </Button>
    </React.Fragment>)
  }
  getBadge =(tabLabel, questionTypeDataKey) => {
    // questionTypeDataKey will questions_context || questions_drafted || questions_published
    let { [questionTypeDataKey]: { question_count: questionCount = null } = {} } = this.state
    return <Badge color='primary'className={this.props.classes.padding} badgeContent={questionCount} max={9999}>{tabLabel}</Badge>
  }

  onChange = (data, ...others) => {
    this.setState({ selectorData: data })
    let item = this.role !== 'Subjecthead' ? others && others.map(val => {
      return ({
        gradeData: val[0] && val[0].filter(i => {
          if (i.grade_id && i.grade_id.toString() === data.grade_id) {
            return true
          }
        })[0],
        subjectData: val[1] && val[1].filter(i => {
          if (i.subject_id && i.subject_id.toString() === data.subject_id) {
            return true
          }
        })[0],
        chapterData: val[2] && val[2].filter(i => {
          if (i.id.toString() === data.id) {
            return true
          }
        })[0] })
    })[0] : others && others.map(val => {
      return ({
        subjectData: val[0] && val[0].filter(i => {
          if (i.subject_id && i.subject_id.toString() === data.subject_id) {
            return true
          }
        })[0],
        gradeData: val[1] && val[1].filter(i => {
          if (i.grade_id && i.grade_id.toString() === data.grade_id) {
            return true
          }
        })[0],
        chapterData: val[2] && val[2].filter(i => {
          if (i.id.toString() === data.id) {
            return true
          }
        })[0] })
    })[0]
    if (data.grade_id) {
      this.setState({
        selectedGrade: { value: data.grade_id,
          label: item.gradeData && item.gradeData.grade_name },
        selectedGradelabel: item.gradeData && item.gradeData.grade_name
      })
    }
    if (data.subject_id) {
      this.setState({
        selectedSubject: { value: data.subject_id,
          label: item.subjectData && item.subjectData.subject_name },
        selectedSubjectlabel: item.subjectData && item.subjectData.subject_name
      })
    }
    if (data.id) {
      this.setState({
        selectedChapter: { value: data.id,
          label: item.subjectData && item.chapterData.chapter_name },
        selectedchapterlabel: item.chapterData && item.chapterData.chapter_name
      })
    }
  }
  selectQuestion = (questionId, questionObj, type) => {
    let { selectedQuesMap = new Map(), sequencedQuesArray = [] } = this.state
    if (sequencedQuesArray.length) {
      selectedQuesMap = new Map(
        sequencedQuesArray.map(item => ([`${item.questionId}_${item.type}`, item]))
      )
    }
    let key = `${questionId}_${type}`
    if (selectedQuesMap.has(key)) {
      selectedQuesMap.delete(key)
    } else if (!selectedQuesMap.has(key)) {
      selectedQuesMap.set(key, { type, questionObj, questionId })
    }
    this.setState({ selectedQuesMap, sequencedQuesArray: [...selectedQuesMap.values()] })
    let { activeStep } = this.state
    if (activeStep === 2 && !selectedQuesMap.size) {
      // switching step from arrage ques to select ques
      this.setState({ activeStep: 1 })
    }
    if (activeStep === 1 && !selectedQuesMap.size) {
      // drawer close on remove of all ques
      this.setState({ viewSelected: false })
    }
  }
  moveCard = (dragIndex, hoverIndex) => {
    const { sequencedQuesArray = [] } = this.state

    const dragCard = sequencedQuesArray[dragIndex]
    // card close
    this.setState({ cardOpen: new Set() })
    this.setState(
      update(this.state, {
        sequencedQuesArray: {
          $splice: [[dragIndex, 1], [hoverIndex, 0, dragCard]]
        }
      })
    )
  }
  handleRemove= (quesId, type) => {
    this.selectQuestion(quesId, null, type)
  }
  getFormatted = () => {
    var removeTags = strHtml => {
      // eslint-disable-next-line no-useless-escape

      // strHtml.replace(/\<\/?[a-zA-Z]*\>/gi, '').replace(/\<br\s\/\>/gi, '').substr(0, 38).padEnd(40, '.')

      return strHtml.replace(/(<([^>]+)>)/ig, '').replace(/(<br ?\/?>)*/g, '').replace(/(?:&nbsp;|<br>)/g, '').substr(0, 38).padEnd(40, '.')
    }
    let { sequencedQuesArray = [] } = this.state
    return sequencedQuesArray.map(item => {
      let obj = {
        id: item.questionId
      }
      if (item['type'] === 'MCQ') {
        let { chapter, subjectname, rating, grade, question } = item.questionObj
        let label = `${removeTags(question)}   ${item.type} - ${grade} - ${subjectname} - ${chapter} - rating: ${rating}`
        obj = {
          ...obj,
          label,
          type: item['type'],
          question: item['questionObj']['question']
        }
      } else if (item['type'] === 'comp') {
        let { chapter, subject, rating, grade, compreshion_text: compreshionText } = item.questionObj
        let label = `${removeTags(compreshionText)}   ${item.type} - ${grade} - ${subject} - ${chapter} - rating: ${rating}`
        obj = {
          ...obj,
          label,
          type: item['type'],
          question: item['questionObj']['compreshion_text']
          // question: 'Comp'
        }
      }
      return obj
    })
  }
  handleTime = (e) => {
    // let { duration } = this.state
    console.log(e.target.value)
    let duration = convertMinsToHrsMins(parseInt(e.target.value))
    this.setState({ mins: parseInt(e.target.value) })
    this.setState({ duration })
    console.log(duration)
  }
  arrangeQuesByDandD = () => {
    let seqQuesArray = this.getFormatted()
    let { cardOpen = new Set() } = this.state
    return (
      <React.Fragment>
        {seqQuesArray.map((item, i) => (
          <Card
            key={item.id}
            id={item.id}
            index={i}
            deleteItem={e => { this.handleRemove(item.id, item.type) }}
            moveCard={this.moveCard}
            text={item.label}
          >
            <Button
              variant='outlined'
              color='secondary'
              size='small'
              onClick={e => {
                let { cardOpen: cardOpenSet = new Set() } = this.state
                cardOpenSet.has(item.id) ? cardOpenSet.delete(item.id) : cardOpenSet.add(item.id)
                this.setState({ cardOpen: cardOpenSet })
              }}>
              {cardOpen.has(item.id) ? 'view less' : 'view more' }
            </Button>
            <Collapse in={cardOpen.has(item.id)} timeout='auto' unmountOnExit >
              {ReactHtmlParser(item.question)}
            </Collapse>
          </Card>
        ))}
      </React.Fragment>
    )
  }
  resetAll=(e) => {
    // // eslint-disable-next-line no-debugger
    // debugger
    this.setState({
      gradeID: null,
      selectedSubject: null,
      selectorData: null,
      selectedTestTypes: {},
      questionPaperTypeName: {},
      selectedTestType: '',
      questionPaperType: '',
      questionPaperSubType: '',
      question_paper_name: '',
      duration: '',
      instruction: '',
      description: '',
      globalSelectorKey: new Date().getTime(),
      selectedQuesMap: new Map(),
      sequencedQuesArray: []

    })
  }
  summaryData=() => {
    let { instruction, question_paper_name: questionPaper, duration, description, questionPaperTypelabel, selectedGradelabel, questionPaperSubtypelabel, selectedSubjectlabel, selectedchapterlabel } = this.state
    const summarydetails = [
      `
      Question Type  :  ${questionPaperTypelabel}`,
      `Question Paper Name  :  ${questionPaper}`,
      `${questionPaperSubtypelabel} ` || ``,
      `Grade  :  ${selectedGradelabel}`,
      `Subject  :  ${selectedSubjectlabel}`,
      `Chapter  :   ${selectedchapterlabel}`,
      `instructions  :  ${instruction}`,
      `Description  :  ${description}`,
      `Duration  :  ${duration}`
    ]
    return (
      <React.Fragment>
        <List style={{ padding: 10, fontSize: '1.5rem' }}>Details Entered</List>
        {
          <ol className='question_paper_summary_container'>{ summarydetails.map((i, index) => {
            if (index === 2) {
              i = 'Question SubType' + ':' + i
            }
            console.log(i, index)
            return <li className='question_paper_summary_list'key={index}>{i ? i.split(':').join(':  ') : ''}</li>
          })}</ol>
        }
      </React.Fragment>
    )
  }
  getStepContent= (step) => {
    const { questionPaperTypelabel } = this.state
    switch (step) {
      case 3:
        return (
          <React.Fragment>
            <ReportConfiguration getConfigurations={this.getReportConfiguration} subjectId={this.state.selectedSubject.value} questionsCount={this.state.selectedQuesMap.size} />
          </React.Fragment>
        )
      case 2:
        return (<React.Fragment>
          <Drawer
            anchor='right'
            open={this.state.viewSummary}
            onClose={() => { this.setState({ viewSummary: false }) }}
            onOpen={() => { this.setState({ viewSummary: true }) }}
            style={{ backgroundColor: 'transparent' }}
          ><div style={{ width: 300 }}>{this.summaryData()}</div></Drawer>
          { this.arrangeQuesByDandD() }
        </React.Fragment>)
        // { /* return */ }
      case 1:
        return (<React.Fragment>
          <Grid container>
            <Grid item xs={2}>
              <ListItem button
                onOut
                onClick={(e) => {
                  let { height, top, left } = e.target.getClientRects()[0]
                  let { currentTarget } = e
                  this.setState(state => ({ anchorEl: currentTarget, open: !state.open, positionTop: (height + top + window.screenTop), positionLeft: left }))
                }}>
                <ListItemText style={{ fontSize: '4px', padding: 0 }} inset primary={'Filter'} />
                {this.state.open ? <ExpandLess /> : <ExpandMore />}
              </ListItem>
            </Grid>
            <Grid item xs={10}>
              {/* <AppBar style={{ backgroundColor: '#f0f0f0' }} elevation={0} position='static'> */}
              <AppBar style={{ backgroundColor: '#f0f0f0' }} elevation={0} position='static'>
                <Tabs
                  value={this.state.tab}
                  onChange={(e, value) => {
                    this.setState({ tab: value })
                  }}
                  indicatorColor='primary'
                  textColor='primary'
                  variant='fullWidth'
                >
                  <Tab value={'MCQ'}
                    label={this.getBadge('List Questions', 'questions')}
                  />

                  {
                    questionPaperTypelabel === 'Recorded Lectures' ? ''
                      : <Tab value={'comp'}
                        label={this.getBadge('Comprehension Question', 'comprehensionQuestions')}
                      />
                  }

                </Tabs>
                {/* </AppBar> */}
              </AppBar>
            </Grid>
          </Grid>
          <Grid container>
            {this.state.open
              ? <Grid item xs={3} >
                <Paper elevation={10}>
                  <Collapse in={this.state.open} timeout='auto' unmountOnExit >
                    {this.getFilterContent()}
                  </Collapse>
                </Paper>
              </Grid> : null
            }
            <Grid item xs={this.state.open ? 9 : 12}>
              {this.getTabContent()}
            </Grid>
          </Grid>
          <Drawer
            anchor='bottom'
            open={this.state.viewSelected}
            onClose={() => { this.setState({ viewSelected: false }) }}
            onOpen={() => { this.setState({ viewSelected: true }) }}
            style={{ backgroundColor: 'transparent', width: 400 }}
          >
            <Button
              onClick={() => { this.setState({ viewSelected: false }) }}
              variant='contained'
              color='primary'
            >
                Close
            </Button>
            {/* <div
              style={{ minHeight: '20vw', margin: '1vw 0', backgroundColor: 'transparent', overflowY: 'auto' }}
            > */}
            <hr />
            {this.arrangeQuesByDandD()}
            {/* </div> */}
          </Drawer>
        </React.Fragment>
        )
      case 0:
        let { mins } = this.state
        return (
          <div >
            <Grid container direction='row' justify='center' alignItems='center' spacing={0}>
              <Grid item xs={3} style={{ marginLeft: 20 }}>
                <OmsSelect
                  label='Test Type'
                  options={this.state.testTypes}
                  change={this.handleTestType}
                  defaultValue={this.state.selectedTestTypes}
                />
              </Grid>
              <Grid item xs={3} style={{ marginLeft: 10 }}>
                <OmsSelect
                  label='Question Paper Type'
                  // placeholder='Select question paper'
                  defaultValue={this.state.questionPaperTypeName}
                  options={this.state.questionPaperTypes}
                  change={this.handleQuestionPaperType}
                />
              </Grid>
              {/* <Grid item xs={3} /> */}
              <Grid item xs={3} style={{ marginLeft: 10 }}>
                {this.state.questionPaperSubTypes.length ? <OmsSelect
                  label='Question Paper Sub Type'
                  disabled={this.state.questionPaperSubTypes.length === 0}
                  // placeholder='Select question paper sub type'
                  defaultValue={this.state.questionPaperSubtypeValue}
                  options={this.state.questionPaperSubTypes}
                  change={({ value, label }) => { this.setState({ questionPaperSubType: value, questionPaperSubtypeValue: { value: value, label: label }, questionPaperSubtypelabel: label }) }}
                  value={this.state.questionPaperSubType}
                /> : ''
                }
              </Grid>
            </Grid>
            <br />
            <Grid container direction='row' justify='center' alignItems='center' spacing={0}>
              <Grid item xs={6}>

                <GSelect key={this.state.globalSelectorKey}initialValue={this.state.selectorData} variant={'selector'} config={COMBINATIONS} onChange={this.onChange} />
              </Grid>
              <Grid item xs={1} />
              <Grid item xs={2} />
            </Grid>
            <br />
            <Grid container direction='row' justify='center' alignItems='center' spacing={0}>
              <Grid item xs={4}>
                <label>Question Paper Name<sup>*</sup></label>
                <br />
                <Input
                  style={{ width: '100%' }}
                  placeholder='Name'
                  value={this.state.question_paper_name}
                  onChange={e => this.setState({ question_paper_name: e.target.value })}
                />
              </Grid>
              <Grid item xs={1} />

              {this.state.questionPaperTypelabel !== 'Recorded Lectures' ? <Grid item xs={4}>
                <label>Duration (in mins)</label>
                <br />
                <TextField
                  id='outlined-number'
                  type='number'
                  InputLabelProps={{
                    shrink: true
                  }}
                  variant='outlined'
                  value={mins}
                  onChange={e => this.handleTime(e)}
                />
                {/* <Input
                  className='without_ampm'
                  style={{ width: '100%' }}16
                  type='number'
                  value={this.state.duration}
                  onChange={e => this.handleTime(e)}
                /> */}
              </Grid> : <Grid item xs={4} />}
            </Grid>
            <br />
            <Grid container direction='row' justify='center' alignItems='center' spacing={0}>
              <Grid item xs={4}>
                <label>Instructions</label>
                <br />
                <TextArea
                  style={{ width: '100%' }}
                  placeholder='Tell us more ...'
                  value={this.state.instruction}
                  onChange={e => this.setState({ instruction: e.target.value })}
                />
              </Grid>
              <Grid item xs={1} />
              <Grid item xs={4}>
                <label>Descriptions</label>
                <br />
                <TextArea
                  style={{ width: '100%' }}
                  placeholder='Tell us more ...'
                  value={this.state.description}
                  onChange={e => this.setState({ description: e.target.value })}
                />
              </Grid>
              <Form.Group className='formargin'>
              </Form.Group>
            </Grid>

          </div>
        )
      default:
        return 'Unknown step'
    }
  }

  handleBack = () => {
    console.log(this.state.activeStep, 'active')
    this.setState(state => ({
      activeStep: state.activeStep - 1
    }))
    if (this.state.activeStep === 1) {
      this.setState({ selectedGrade: null, selectedSubject: null })
    }
  }

  getSequencedQues = () => {
    let { sequencedQuesArray } = this.state
    var comp = []
    var mcq = []

    let sequenceId = 0
    sequencedQuesArray.forEach(item => {
      let marks = 1
      if (item.type === 'MCQ') {
        sequenceId += 1
        let marksData = {
          'sequence_id': sequenceId,
          'id': Number(item.questionId),
          'marks': marks
        }
        mcq.push(marksData)
      } else if (item.type === 'comp') {
        for (let index = 0; index < item.questionObj.questions.length; index++) {
          let subsequentQId = item.questionObj.questions[index]['question_id']
          sequenceId += 1
          let marksData = {
            'sequence_id': sequenceId,
            'id': Number(subsequentQId),
            'marks': marks
          }
          comp.push(marksData)
        }
      }
    })
    let questionsObj = {}
    questionsObj['comp'] = comp
    questionsObj['mcq'] = mcq
    return questionsObj
  }

  getDuration=() => {
    // debugger
    let { duration, questionPaperTypelabel } = this.state
    console.log(duration, 'durrrr', questionPaperTypelabel)
    if (questionPaperTypelabel === 'Recorded Lectures') {
      console.log('herrrr')
      let duration = convertMinsToHrsMins(parseInt(new Date().getMinutes()))
      this.setState({ duration })
      console.log(duration, 'duu')

      return duration
    }
    return duration
  }
  handleFinish = () => {
    // let { selectedMCQ, questionPaperType, selectedSubject, gradeID, duration,
    //   instruction, description, question_paper_name: questionPaperName, selectedComp, selectedQuestions } = this.state
    // let aIds = selectedMCQ; let mcq = []; let comp = []; let ques = {}
    // aIds.forEach(function (id, index) {
    //   let marks = '1'
    //   // if (questionPaperType === 1) {
    //   //   marks = '1'
    //   // } else if (questionPaperType === 2) {
    //   //   marks = 'this.handlemarks'
    //   // }
    //   var marksData = {
    //     'sequence_id': selectedQuestions.indexOf(id) + 1,
    //     'id': id,
    //     'marks': marks
    //   }
    //   mcq.push(marksData)
    // })
    // selectedComp.forEach(function (id, index) {
    //   let marks = '1'
    //   // if (questionPaperType === 1) {
    //   //   marks = '1'
    //   // } else if (questionPaperType === 2) {
    //   //   marks = 'this.handlemarks'
    //   // }
    //   var marksData = {
    //     'sequence_id': selectedQuestions.indexOf(id) + 1,
    //     'id': id,
    //     'marks': marks
    //   }
    //   comp.push(marksData)
    // })
    // ques['comp'] = comp
    // ques['mcq'] = mcq
    let { questionPaperType, selectedSubject,
      instruction, description, question_paper_name: questionPaperName, sequencedQuesArray: seqQuesArry = [], reportConfiguration, selectedTestType, selectedChapter, selectedGrade, duration } = this.state
    if (!seqQuesArry.length) {
      this.props.alert.error('Please select questions')
      this.setState({ activeStep: 1 })
      return
    }

    var ques = this.getSequencedQues()
    var data = {
      'chapter_id': selectedChapter.value,
      'subject_id': selectedSubject.value,
      'grade_id': selectedGrade.value,
      'question_paper_name': questionPaperName,
      'duration': duration,
      'instruction': instruction,
      'description': description,
      'question_paper_type': questionPaperType,
      'questions_object': JSON.stringify(ques)
    }
    if (selectedTestType === 'offline') {
      data.question_range = reportConfiguration
    }
    axios
      .post(qBUrls.CreateQuestionPaper, data, {
        headers: {
          Authorization: 'Bearer ' + this.props.token
        }
      })
      .then(res => {
        if (res.status === 200) {
          this.props.alert.success('Question paper added successfully')
          this.setState({
            activeStep: 0
          })
        } else {
          this.props.alert.error(res.data)
        }
      })
      .catch(error => {
        if (error.status === 409) {
          this.props.alert.error('Staff with given erp already exists')
        } else {
          console.error(error)
          this.props.alert.error('Question submission failed')
        }
        console.log("Error: Couldn't fetch data from " + urls.Teacher, error)
      })
  }

  isStepSkipped (step) {
    return this.state.skipped.has(step)
  }

  componentDidMount () {
    axios
      .get(urls.QuestionPaperType, {
        headers: {
          Authorization: 'Bearer ' + this.props.token
        }
      })
      .then(res => {
        const questionPapersType = res.data.map(qpt => {
          return {
            value: qpt.id,
            label: qpt.question_paper_type
          }
        })
        this.setState({ questionPaperTypes: questionPapersType })
      })
      .catch((error) => {
        console.log(error)
      })
  }

  handleGrade = (e) => {
    this.setState({ gradeID: e.value, valueGrade: e })
  }
  handleQuestionPaperType = ({ value, label }) => {
    console.log(value, label)
    this.setState({ questionPaperType: value, questionPaperTypeName: { value: value, label: label }, questionPaperTypelabel: label, questionPaperSubTypes: [], questionPaperSubtypelabel: '' })
    console.log(this.state.questionPaperType, this.state.questionPaperTypeName)
    axios.get(urls.QuestionPaperSubType + '?qp_id=' + value, {
      headers: {
        Authorization: 'Bearer ' + this.props.token
      }
    })
      .then(res => {
        const subtypesArr = res.data.map(qpst => {
          return {
            key: `${qpst.question_paper_type_id}`,
            value: qpst.question_paper_type_id,
            label: qpst.question_paper_sub_type_name
          }
        })
        this.setState({ questionPaperSubTypes: subtypesArr })
      })
      .catch((error) => {
        console.log(error)
      })
  }

  handleTestType = ({ value, label }) => {
    /* eslint-disable no-debugger */
    // debugger
    this.setState({ selectedTestType: value, selectedTestTypes: { value: value, label: label } })
  }

  handleNext = (e) => {
    // debugger
    const { activeStep } = this.state
    let { skipped, selectedSubject, question_paper_name: questionPaperName,
      instruction, description, questionPaperType, questionPaperSubType, selectedGrade, selectedChapter } = this.state
    let { value: gradeID } = selectedGrade || {}
    let { value: subjectId } = selectedSubject || {}
    let { value: chapterId } = selectedChapter || {}
    // let { value: chapterId } = selectedChapter
    if (this.isStepSkipped(activeStep)) {
      skipped = new Set(skipped.values())
      skipped.delete(activeStep)
    }
    if (activeStep === 0) {
      // reset selected values
      this.setState({
        filterQuestionType: new Set(),
        filterQuestionLevel: new Set(),
        filterQuestionCategory: new Set(),
        filterChapter: new Set()
      })
    }
    if (gradeID && subjectId && chapterId && questionPaperName && this.getDuration() && instruction &&
        description && questionPaperType && (questionPaperType || questionPaperSubType)) {
      this.setState({
        activeStep: activeStep + 1,
        skipped
      })
      e.preventDefault()
      this.applyFilter('MCQ')
      this.applyFilter('comp')

      this.setState({ chapterArr: null }, () => {
        axios
          .get(urls.Chapter + '?subject_id=' + subjectId + '&grade_id=' + gradeID, {
            headers: {
              Authorization: 'Bearer ' + this.props.token
            }
          })
          .then(res => {
            // let { gradeID: gradeId, selectedSubject: { value: subjectId } } = this.state

            let { selectedGrade: { value: gradeId }, selectedSubject: { value: subjectId } } = this.state

            if (Array.isArray(res.data)) {
              let chapters = res.data.map(item => ({ ...item, label: item.chapter_name }))
              chapters = chapters.filter(chtr => (chtr.grade === gradeId * 1 && chtr.subject === subjectId * 1))
              const chaptersarr = chapters.map(chp => {
                return {
                  key: `${chp.id}`,
                  value: chp.id,
                  text: chp.chapter_name
                }
              })
              this.setState({ chapterArr: chaptersarr })
            }
          })
          .catch((error) => {
            console.log(error)
          })
      })

      axios
        .get(urls.QuestionType, {
          headers: {
            Authorization: 'Bearer ' + this.props.token
          }
        })
        .then(res => {
          const questionType = res.data.map(qus => {
            return {
              key: `${qus.id}`,
              value: qus.id,
              text: qus.question_type
            }
          })
          this.setState({ questionTypeArr: questionType })
        })
        .catch((error) => {
          console.log(error)
        })
      // =================================
      axios
        .get(urls.QuestionLevel, {
          headers: {
            Authorization: 'Bearer ' + this.props.token
          }
        })
        .then(res => {
          const questionLevel = res.data.map(qusl => {
            return {
              ...qusl,
              key: `${qusl.id}`,
              value: qusl.id,
              text: qusl.question_level
            }
          })
          this.setState({ questionLevelArr: questionLevel })
        })
        .catch((error) => {
          console.log(error)
        })
      // ========================
      axios
        .get(urls.QuestionCategory, {
          headers: {
            Authorization: 'Bearer ' + this.props.token
          }
        })
        .then(res => {
          const questionCategory = res.data.map(qusc => {
            return {
              ...qusc,
              key: `${qusc.id}`,
              value: qusc.id,
              text: qusc.category_name
            }
          })
          this.setState({ questionCategoryArr: questionCategory })
        })
        .catch((error) => {
          console.log(error)
        })
    } else {
      this.props.alert.error('Fill all the fields')
    }
  }

  applyFilter = (paperType, page = 1) => {
    var axiosCall = (paperType, page = 1) => {
      let {
        filterQuestionType = new Set(),
        filterQuestionLevel = new Set(),
        filterQuestionCategory = new Set(),
        filterChapter = new Set()
      } = this.state
      let { selectedChapter, selectedGrade, selectedSubject } = this.state
      let { value: gradeID } = selectedGrade && selectedGrade
      let { value: subjectId } = selectedSubject || {}
      let { value: chapterId } = selectedChapter || {}

      console.log([...filterChapter], 'filter chaaa')
      let chapterIds = [...filterChapter] && [...filterChapter].length ? [...filterChapter] : chapterId

      let newurl = qBUrls.ListQuestion + `pagenumber=${page}&subject=${subjectId}&grade=${gradeID}&chapter=${chapterIds}&type=${[...filterQuestionType]}&category=${[...filterQuestionCategory]}&level=${[...filterQuestionLevel]}&question_status=Published&ques_type=${paperType}`

      this.setState({ [`loading${paperType}`]: true, loading: true, pageNo: page }, () => {
        axios
          .get(newurl, {
            headers: {
              Authorization: 'Bearer ' + this.props.token
            }
          })
          .then(res => {
            if (paperType === 'MCQ') {
              this.setState({ questions: res.data, loading: false, activeCompPage: page, [`loading${paperType}`]: false })
            } else {
              this.setState({ comprehensionQuestions: res.data, loading: false, activeCompPage: page, [`loading${paperType}`]: false })
            }
          })
          .catch((error) => {
            console.log('error', error)
            // this.setState({ loading: false, [`loading${paperType}`]: false })
            let emptyDataObj = {
              data: [],
              question_count: 0,
              role: undefined,
              total_page_count: 0
            }
            if (paperType === 'MCQ') {
              this.setState({ questions: emptyDataObj, loading: false, activeCompPage: page, [`loading${paperType}`]: false })
            } else {
              this.setState({ comprehensionQuestions: emptyDataObj, loading: false, activeCompPage: page, [`loading${paperType}`]: false })
            }
            this.props.alert.error(error.toString())
          })
      })
    }
    if (!paperType) {
      // Applying filter in all tabs
      axiosCall('MCQ', page)
      axiosCall('comp', page)
    } else {
      axiosCall(paperType, page)
    }
  }

  getSteps = () => {
    const { selectedTestType } = this.state
    const steps = ['Enter details', 'Select Questions', 'Arrage Questions']
    const offlineSteps = [...steps, 'Attach Report Card Configuration']
    return selectedTestType === 'offline' ? offlineSteps : steps
  }

  getReportConfiguration = (configuration) => {
    this.setState({ reportConfiguration: configuration })
  }

  render () {
    let { questionPaperSubtypelabel } = this.state
    console.log('Question Type' + ':' + questionPaperSubtypelabel && questionPaperSubtypelabel)
    const { activeStep, selectedQuesMap = new Map() } = this.state
    const steps = this.getSteps()
    let { classes } = this.props
    console.log(this.state.questionPaperTypelabel)
    return (
      <React.Fragment>
        <Stepper activeStep={activeStep}>
          {steps.map((label, index) => {
            const props = {}
            const labelProps = {}
            if (this.isStepOptional(index)) {

            }
            if (this.isStepFailed(index)) {
              labelProps.error = false
            }
            if (this.isStepSkipped(index)) {
              props.completed = false
            }
            return (
              <Step key={label} {...props}>
                <StepLabel {...labelProps}>{label}</StepLabel>
              </Step>
            )
          })}
        </Stepper>
        <Toolbar
          style={{ backgroundColor: 'white' }}
          floatRight={
            <Fragment>
              {
                activeStep === 1 &&
                selectedQuesMap.size
                  ? <Button
                    color='primary'
                    variant='outlined'
                    onClick={() => { this.setState({ viewSelected: true }) }}
                  >
                View Selected
                  </Button> : null}
              {activeStep === 0 && <Button
                onClick={
                  (e) => this.resetAll(e)

                }
                variant='outlined'
                color='primary'
                size='small'

              >
                <ClearIcon />
                  clear
              </Button>}
              <Button
                disabled={activeStep === 0}
                onClick={this.handleBack}
                className={[classes.button, classes.floatRight]}
              >
                     Back
              </Button>
              {this.isStepOptional(activeStep) && (
                <Button
                  variant='contained'
                  color='primary'
                  onClick={this.handleSkip}
                  className={[classes.button, classes.floatRight]}
                >
                       Skip
                </Button>
              )}
              <Button
                variant='contained'
                size='large'
                color='primary'
                onClick={activeStep === steps.length - 1 ? this.handleFinish : this.handleNext}
                className={[classes.button, classes.floatRight]}
              >
                {activeStep === steps.length - 1 ? 'Create Question Paper' : 'Next'}
              </Button>
              {
                activeStep === 2 &&
                <Button
                  color='primary'
                  variant='outlined'
                  onClick={() => { this.setState({ viewSummary: true }) }}
                >
                View Summary
                </Button> }
            </Fragment>
          }
        />
        <Typography className={classes.instructions}>{this.getStepContent(activeStep)}</Typography>
      </React.Fragment>
    )
  }
}

const mapStateToProps = state => ({
  token: state.authentication.user
})
export default connect(
  mapStateToProps
)(withRouter(withStyles(styles)(DragDropContext(HTML5Backend)(CreateQuestionPaper))))
