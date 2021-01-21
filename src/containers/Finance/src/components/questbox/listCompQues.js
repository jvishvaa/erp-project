import React, { Component } from 'react'
import { connect } from 'react-redux'
import axios from 'axios'
import { Grid, Button, Tabs, Tab, AppBar, Collapse, ListItem, ListItemText, Paper, withStyles } from '@material-ui/core'
import Badge from '@material-ui/core/Badge'
import Slider from '@material-ui/core/Slider'
import ExpansionPanel from '@material-ui/core/ExpansionPanel'
import RefreshIcon from '@material-ui/icons/Refresh'
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary'
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails'
import Typography from '@material-ui/core/Typography'
import ExpandMore from '@material-ui/icons/ExpandMore'
import ExpandLess from '@material-ui/icons/ExpandLess'
import Checkbox from './Checkbox/Checkbox'
import QuestionsFrame from './QuestionComprehension/viewComprehensionQuestionComponent'
import { urls, qBUrls } from '../../urls'
import { apiActions } from '../../_actions'
import { FamilyProvider } from './SmallContext'
import GSelect from '../../_components/globalselector'
import { COMBINATIONS } from '../videoUpload/config/combination'

let panes = []
console.log(panes)
const styles = theme => ({
  padding: {
    padding: `0 ${theme.spacing.unit * 4}px`
  }
})
const PrettoSlider = withStyles({
  root: {
    color: '#821057',
    width: '180px'

  },
  thumb: {
    height: 12,
    width: 12,
    backgroundColor: '#821057',
    border: '2px  currentColor'

  },

  valueLabel: {
    'padding-down': '50px',
    top: -22,
    '& *': {
      background: 'transparent',
      color: 'purple'
    }
  },
  track: {
    height: 3,
    borderRadius: '2px'
  },
  rail: {
    height: 5,
    borderRadius: 10,
    width: '180px'

  }
})(Slider)
class ListCompQuestion extends Component {
  constructor () {
    super()
    this.state = {
      questions: {},
      subjectArr: [],
      questionLevelArr: [],
      questionCategoryArr: [],
      chapterArr: [],
      chapterTopicArr: [],
      filter: 'notapply',
      chapt: [],
      chaparr: [],
      loadingM: false,
      questionsM: { data: [] },
      loadingDrafted: false,
      questionsD: { data: [] },
      loadingPublished: false,
      questionsP: { data: [] },
      activePageM: 1,
      activePageD: 1,
      activePageP: 1,
      activeIndex: 0,
      tab: 0,
      filterQuestionLevel: [],
      filterQuestionCategory: [],
      filterSubjects: [],
      filterGrades: [],
      chapter: [],
      chapterTopic: [],
      ratingCompQues: [1, 10],
      defaultValue: [1, 10],
      searchVal: ''
    }
    this.handleCheckbox = this.handleCheckbox.bind(this)
    this.handlePaginationM = this.handlePaginationM.bind(this)
    this.handlePaginationD = this.handlePaginationD.bind(this)
    this.handlePaginationP = this.handlePaginationP.bind(this)
    this.settingToDefaultVal = this.settingToDefaultVal.bind(this)
    this.userProfile = JSON.parse(localStorage.getItem('user_profile'))
    this.role = this.userProfile.personal_info.role
  }

  componentDidMount () {
    axios
      .get(urls.SUBJECT, {
        headers: {
          Authorization: 'Bearer ' + this.props.user,
          'Content-Type': 'application/json'
        }
      })
      .then(res => {
        let filterSubjects
        let subjectsArr = res.data.map(sub => {
          return {
            key: `${sub.id}`,
            value: sub.id,
            text: sub.subject_name
          }
        })
        if (this.role === 'Teacher' || this.role === 'Subjecthead') {
          filterSubjects = this.userProfile.academic_profile.map(subject => subject.subject_name)
          subjectsArr = subjectsArr.filter(subject => {
            console.log(filterSubjects, subject.text)
            return filterSubjects.includes(subject.text)
          })
        }

        this.setState({ subjectArr: subjectsArr })
      })
      .catch(error => {
        console.log(error)
        // window.alert('Something went wrong')
      })
    // =================================
    axios
      .get(urls.QuestionLevel, {
        headers: {
          Authorization: 'Bearer ' + this.props.user,
          'Content-Type': 'application/json'
        }
      })
      .then(res => {
        const questionLevel = res.data.map(qusl => {
          return {
            key: `${qusl.id}`,
            value: qusl.id,
            text: qusl.question_level
          }
        })
        this.setState({ questionLevelArr: questionLevel })
      })
      .catch(error => {
        console.log(error)
      })
    // ========================
    axios
      .get(urls.QuestionCategory, {
        headers: {
          Authorization: 'Bearer ' + this.props.user,
          'Content-Type': 'application/json'
        }
      })
      .then(res => {
        const questionCategory = res.data.map(qusc => {
          return {
            key: `${qusc.id}`,
            value: qusc.id,
            text: qusc.category_name
          }
        })
        this.setState({ questionCategoryArr: questionCategory })
      })
      .catch(error => {
        console.log(error)
      })
    this.getCompQuestions()
  }

  getQnsArgs=(pgNo) => {
    const mineQns = ['Mine', 'questionsM', 'loadingM', 'activePageM', pgNo]
    const publishedQns = ['Published', 'questionsP', 'loadingPublished', 'activePageP', pgNo]
    const draftQns = ['Drafted', 'questionsD', 'loadingDrafted', 'activePageD', pgNo]

    return [mineQns, publishedQns, draftQns]
  }
  getCompQuestions = (pgNo) => {
    const qnArgs = this.getQnsArgs(pgNo)
    this.getMineDraftPublishQuestions(...qnArgs[0])
    this.getMineDraftPublishQuestions(...qnArgs[1])
    this.getMineDraftPublishQuestions(...qnArgs[2])
  }

  getMineDraftPublishQuestions=(qnStatus, qnResult, loading, activePage, pgNum) => {
    const {
      filterSubjects,
      filterGrades,
      chapter,
      chapterTopic,
      filterQuestionCategory,
      filterQuestionLevel,
      ratingCompQues
    } = this.state

    let newurl = qBUrls.ListQuestion + `pagenumber=${pgNum || 1}&subject=${String(filterSubjects)}&grade=${String(
      filterGrades
    )}&chapter=${String(chapter
    )}&chapter_topic=${String(chapterTopic)}&category=${String(filterQuestionCategory)}&level=${String(
      filterQuestionLevel
    )}&question_status=${qnStatus}&ques_type=comp`
    newurl = qnStatus === 'Published' ? `${newurl}&rating=${ratingCompQues}` : newurl

    this.setState({ [`${loading}`]: true }, () => {
      axios
        .get(newurl, {
          headers: {
            Authorization: 'Bearer ' + this.props.user
          }
        })
        .then(res => {
          const { data = {} } = res
          this.setState({
            [`${qnResult}`]: data,
            [`${loading}`]: false,
            [`${activePage}`]: pgNum || 1,
            [`${qnStatus.charAt(0).toLowerCase() + qnStatus.slice(1)}QtnCount`]: data.question_count })
        })
        .catch(error => {
          console.log('error', error)
          this.setState({ [`${loading}`]: false })
        })
    })
  }

  handlePaginationM = i => {
    const qnArgs = this.getQnsArgs(i)
    this.getMineDraftPublishQuestions(...qnArgs[0])
  }
  handlePaginationP = i => {
    const qnArgs = this.getQnsArgs(i)
    this.getMineDraftPublishQuestions(...qnArgs[1])
  }

  handlePaginationD = i => {
    const qnArgs = this.getQnsArgs(i)
    this.getMineDraftPublishQuestions(...qnArgs[2])
  };

  handleCheckbox = (e, i) => {
    let { filterSubjects, filterGrades, chapter, chapterTopic, filterQuestionCategory, filterQuestionLevel } = this.state
    // Question Level
    if (i.name === 'Question Level') {
      if (i.checked) {
        if (filterQuestionLevel.includes(String(i.value)) === false) {
          filterQuestionLevel.push(`${i.value}`)
        }
      } else {
        if (filterQuestionLevel.includes(String(i.value)) === true) {
          let v = filterQuestionLevel.indexOf(String(i.v))
          filterQuestionLevel.splice(v, 1)
        }
      }
    }
    //  Chapter
    if (i.name === 'Chapter') {
      if (i.checked) {
        let obj = this.state.chapterArr
        obj.forEach(v => {
          if (v.value === i.value) {
            v.checked = true
          }
        })
        this.setState({ chapterArr: obj })
        if (chapter.includes(String(i.value)) === false) {
          chapter.push(`${i.value}`)
        }
      } else {
        let obj = this.state.chapterArr
        obj.forEach(v => {
          if (v.value === i.value) {
            v.checked = false
          }
        })
        this.setState({ chapterArr: obj })
        if (chapter.includes(String(i.value)) === true) {
          let v = chapter.indexOf(String(i.value))
          chapter.splice(v, 1)
        }
      }
    }
    if (i.name === 'Chapter Topics') {
      if (i.checked) {
        let obj = this.state.chapterTopicArr
        obj.forEach(v => {
          if (v.value === i.value) {
            v.checked = true
          }
        })
        this.setState({ chapterTopicArr: obj })
        console.log('checked', i.name)
        if (chapterTopic.includes(String(i.value)) === false) {
          chapterTopic.push(`${i.value}`)
        }
        console.log(chapterTopic)
      } else {
        let obj = this.state.chapterTopicArr
        obj.forEach(v => {
          if (v.value === i.value) {
            v.checked = false
          }
        })
        this.setState({ chapterTopicArr: obj })
        console.log('unchecked', i.name)
        if (chapterTopic.includes(String(i.value)) === true) {
          let v = chapterTopic.indexOf(String(i.value))
          chapterTopic.splice(v, 1)
        }
        console.log(chapterTopic)
      }
    }
    // Question Category
    if (i.name === 'Question Category') {
      if (i.checked) {
        if (filterQuestionCategory.includes(String(i.value)) === false) {
          filterQuestionCategory.push(`${i.value}`)
        }
      } else {
        if (filterQuestionCategory.includes(String(i.value)) === true) {
          let v = filterQuestionCategory.indexOf(String(i.value))
          filterQuestionCategory.splice(v, 1)
        }
      }
    }
    // Subjects
    if (i.name === 'Subjects') {
      if (i.checked) {
        if (filterSubjects.includes(String(i.value)) === false) {
          filterSubjects.push(`${i.value}`)
        }
      } else {
        console.log('unchecked', i.name)
        if (filterSubjects.includes(String(i.value)) === true) {
          let v = filterSubjects.indexOf(String(i.value))
          filterSubjects.splice(v, 1)
        }
      }
      this.setState({ chapt: filterSubjects })
    }
    // Grades
    if (i.name === 'Grades') {
      if (i.checked) {
        if (filterGrades.includes(String(i.value)) === false) {
          filterGrades.push(`${i.value}`)
        }
      } else {
        if (filterGrades.includes(String(i.value)) === true) {
          let v = filterGrades.indexOf(String(i.value))
          filterGrades.splice(v, 1)
        }
      }
    }
    if (
      (i.name === 'Subjects' || i.name === 'Grades') &&
      filterSubjects.length > 0
    ) {
      let queryString = ''
      let subjectString = ''
      let gradeString = ''
      filterSubjects.forEach(v => {
        subjectString += `${v},`
      })
      filterGrades.forEach(v => {
        gradeString += `${v},`
      })
      queryString = `?grade_id=${gradeString.substring(
        0,
        gradeString.length - 1
      )}&subject_id=${subjectString.substring(0, subjectString.length - 1)}`
      queryString = qBUrls.Chapter + queryString
      axios
        .get(queryString, {
          headers: {
            Authorization: 'Bearer ' + this.props.user,
            'Content-Type': 'application/json'
          }
        })
        .then(res => {
          let { filterGrades = [], filterSubjects = [] } = this.state
          filterGrades = filterGrades.map(gId => String(gId))
          filterSubjects = filterSubjects.map(sId => String(sId))
          if (res.status === 200) {
            let { data = [] } = res
            // res.data[0] is having data
            if (data.length) {
              let chaptersArray = data[0]
              chaptersArray = chaptersArray.filter(chapterObj => {
                const { subject: chapSubjObj = {}, grade: chapGradeObj = {} } = chapterObj
                const { id: chapSubjectId } = chapSubjObj || {}
                const { id: chapGradeId } = chapGradeObj || {}
                const gradeCheck = filterGrades.length === 0 ? true : filterGrades.includes(String(chapGradeId))
                const subjCheck = filterSubjects.length === 0 ? true : filterSubjects.includes(String(chapSubjectId))
                return (gradeCheck && subjCheck)
              })
              chaptersArray = chaptersArray.map(chapterObj => {
                return {
                  key: `${chapterObj.id}`,
                  value: chapterObj.id,
                  text: chapterObj.chapter_name,
                  checked: false
                }
              })
              this.setState({ chapterArr: chaptersArray, chapter: [] })
            } else {
              this.props.alert.error('Failed to fetch chapters')
            }
          }
        })
    }
    if ((i.name === 'Chapter') &&
    chapter.length > 0) {
      let queryString = ''
      let chapterString = ''
      chapter.forEach(v => {
        chapterString += `${v},`
      })
      queryString = `?chapter_id=${chapterString.substring(
        0,
        chapterString.length - 1)}`

      queryString = urls.ChapterTopic + queryString
      axios
        .get(queryString, {
          headers: {
            Authorization: 'Bearer ' + this.props.user,
            'Content-Type': 'application/json'
          }
        })
        .then(res => {
          const chaptertopicarr = res.data.map(chptp => {
            return {
              key: `${chptp.id}`,
              value: chptp.id,
              text: chptp.name,
              checked: false
            }
          })
          this.setState({ chapterTopicArr: chaptertopicarr }, () => {
            this.setState({ chapterTopic: [], chaparr: chapter })
          })
        })
    }
  };
  filterCallForYourQues = () => {
    let { filterSubjects, filterGrades, chapter, chapterTopic, filterQuestionCategory, filterQuestionLevel } = this.state
    let newurl =
      qBUrls.ListQuestion +
      `pagenumber=1&subject=${String(filterSubjects)}&grade=${String(
        filterGrades
      )}&chapter=${String(chapter
      )}&chapter_topic=${String(chapterTopic
      )}&category=${String(filterQuestionCategory)}&level=${String(
        filterQuestionLevel
      )}&question_status=Mine&ques_type=comp`
    this.setState({ loadingM: true }, () => {
      axios
        .get(newurl, {
          headers: {
            Authorization: 'Bearer ' + this.props.user
          }
        })
        .then(res => {
          this.setState({ questionsM: res.data, loadingM: false })
        })
        .catch(error => {
          console.log('error', error)
          this.setState({ loadingM: false })
        })
    })
  }
  filterCallForDraftQues = () => {
    let { filterSubjects, filterGrades, chapter, chapterTopic, filterQuestionCategory, filterQuestionLevel } = this.state
    let draftedurl =
      qBUrls.ListQuestion +
      `pagenumber=1&subject=${String(filterSubjects)}&grade=${String(
        filterGrades
      )}&chapter=${String(chapter
      )}&chapter_topic=${String(chapterTopic
      )}&category=${String(filterQuestionCategory)}&level=${String(
        filterQuestionLevel
      )}&question_status=Drafted&ques_type=comp`
    this.setState({ loadingDrafted: true }, () => {
      axios
        .get(draftedurl, {
          headers: {
            Authorization: 'Bearer ' + this.props.user
          }
        })
        .then(res => {
          this.setState({ questionsD: res.data, loadingDrafted: false })
        })
        .catch(error => {
          console.log('error', error)
          this.setState({ loadingDrafted: false })
        })
    })
  }
  filterCallForPublishQues = () => {
    let { filterSubjects, filterGrades, chapter, chapterTopic, filterQuestionCategory, filterQuestionLevel } = this.state
    let purl =
      qBUrls.ListQuestion +
      `pagenumber=1&subject=${String(filterSubjects)}&grade=${String(
        filterGrades
      )}&chapter=${String(chapter
      )}&chapter_topic=${String(chapterTopic
      )}&category=${String(filterQuestionCategory)}&level=${String(
        filterQuestionLevel
      )}&question_status=Published&ques_type=comp&rating=${this.state.ratingCompQues}`
    this.setState({ loadingPublished: true }, () => {
      axios
        .get(purl, {
          headers: {
            Authorization: 'Bearer ' + this.props.user
          }
        })
        .then(res => {
          this.setState({ questionsP: res.data, loadingPublished: false })
        })
        .catch(error => {
          console.log('error', error)
          this.setState({ loadingPublished: false })
        })
    })
  }
  applyFilter = (category) => {
    // category = enum "PUBLISH", YOUR, "DRAFT"
    if (category === 'PUBLISH') {
      this.filterCallForPublishQues()
      return
    }
    this.filterCallForYourQues()
    this.filterCallForDraftQues()
    this.filterCallForPublishQues()
    this.scrollToTop()
  };
  scrollToTop = () => {
    document.body.style.scrollBehavior = 'smooth'
    document.documentElement.style.scrollBehavior = 'smooth'
    document.body.scrollTop = 0
    document.documentElement.scrollTop = 0
  }
  settingToDefaultVal = elasticSearchVal => {
    console.log('default vallll', elasticSearchVal)
    if (elasticSearchVal === '') {
      this.getCompQuestions()
    }
  }
  getTabContent = () => {
    let { loadingM, loadingPublished, loadingDrafted, filterSubjects, filterGrades, chapter, chapterTopic, filterQuestionCategory, filterQuestionLevel } = this.state
    let { tab } = this.state
    let tabContent = [
      <QuestionsFrame
        keyNameofQuestionsData='questionsM'
        loaderLabel='Loading Questions...'
        loading={loadingM}
        questionLevel={filterQuestionLevel}
        questionCategory={filterQuestionCategory}
        subjects={filterSubjects}
        grades={filterGrades}
        chapter={chapter}
        chapterTopic={chapterTopic}
        page={this.handlePaginationM}
        activePage={this.state.activePageM}
        getSearchValue={this.settingToDefaultVal}
        {...this.props}
      />,
      <QuestionsFrame
        keyNameofQuestionsData='questionsP'
        loaderLabel='Loading Published Questions...'
        loading={loadingPublished}
        questionLevel={filterQuestionLevel}
        questionCategory={filterQuestionCategory}
        subjects={filterSubjects}
        grades={filterGrades}
        chapter={chapter}
        chapterTopic={chapterTopic}
        page={this.handlePaginationP}
        activePage={this.state.activePageP}
        getSearchValue={this.settingToDefaultVal}

        {...this.props}
      />
    ]
    if (this.role !== 'Teacher') {
      tabContent.push(
        <QuestionsFrame
          publishQuestions
          keyNameofQuestionsData='questionsD'
          loaderLabel='Loading Drafted Questions...'
          loading={loadingDrafted}
          questionLevel={filterQuestionLevel}
          questionCategory={filterQuestionCategory}
          subjects={filterSubjects}
          grades={filterGrades}
          chapter={chapter}
          chapterTopic={chapterTopic}
          page={this.handlePaginationD}
          activePage={this.state.activePageD}
          getSearchValue={this.settingToDefaultVal}

          {...this.props}
        />
      )
    }
    console.log(tabContent, 'tab content')

    return tabContent[tab]
  }

  onChange = (data) => {
    console.log(data)
    // filterSubjects, filterGrades, chapter,
    const { grade_id: gradeId = [], subject_id: subjectId = [], id } = data
    if (this.role !== 'Subjecthead') {
      if (id) {
        this.setState({ filterGrades: gradeId, chapter: id, filterSubjects: subjectId })
      } else if (gradeId && subjectId) {
        this.setState({ filterGrades: gradeId, chapter: '', filterSubjects: subjectId })
      } else {
        this.setState({ filterGrades: gradeId, chapter: '', filterSubjects: [] })
      }
    } else {
      if (id) {
        this.setState({ filterGrades: gradeId, chapter: id, filterSubjects: subjectId })
      } else if (gradeId && subjectId) {
        this.setState({ filterGrades: gradeId, chapter: '', filterSubjects: subjectId })
      } else {
        this.setState({ filterSubjects: subjectId, chapter: '', filterGrades: [] })
      }
    }
  }
  handleChange = (event, value) => {
    this.setState({ ratingCompQues: value })
    console.log(this.state.ratingCompQues)
  }
  resetRating=(event, value) => {
    this.setState({
      ratingCompQues: this.state.defaultValue
    })
  }
  getFilterContent=(grades) => {
    let { filterSubjects, filterGrades, chapter, chapterTopic, filterQuestionCategory, filterQuestionLevel } = this.state
    return (<React.Fragment>
      <Checkbox
        key='Question Level'
        heading='Question Level'
        array={this.state.questionLevelArr}
        change={this.handleCheckbox}
        checkedItems={filterQuestionLevel}
      />
      <Checkbox
        key='Question Category'
        heading='Question Category'
        array={this.state.questionCategoryArr}
        change={this.handleCheckbox}
        checkedItems={filterQuestionCategory}
      />
      {/* <label style={{ 'font-width': '80px', 'padding-left': '20px' }}>Rating</label> */}

      {this.role === 'Admin' ? (
        <React.Fragment>
          <Checkbox
            key='Subjects'
            heading='Subjects'
            array={this.state.subjectArr}
            change={this.handleCheckbox}
            checkedItems={filterSubjects}
          />
          <Checkbox
            key='Grades'
            heading='Grades'
            array={grades}
            change={this.handleCheckbox}
            checkedItems={filterGrades}
          />
          {this.state.chapterArr.length > 0 &&
                  this.state.chapt.length > 0
            ? (
              <Checkbox
                key='Chapter'
                heading='Chapter'
                array={this.state.chapterArr}
                change={this.handleCheckbox}
                checkedItems={chapter}
              />
            ) : null}
          { this.state.chaparr.length > 0
            ? (
              <Checkbox
                key='Chapter Topics'
                heading='Chapter Topics'
                array={this.state.chapterTopicArr}
                change={this.handleCheckbox}
                checkedItems={chapterTopic}
              />
            ) : null}
        </React.Fragment>
      ) : (<div style={{ padding: '10px 15px 10px 15px', boxSizing: 'border-box' }}>
        <GSelect variant={'selector'} onChange={this.onChange} config={COMBINATIONS} />
      </div>)}
      <div>
        <ExpansionPanel>
          <ExpansionPanelSummary
            expandIcon={<ExpandMore />}
            aria-controls='panel1a-content'

          >
            <Typography >Rating</Typography>
          </ExpansionPanelSummary>
          <ExpansionPanelDetails>

            <PrettoSlider
              valueLabelDisplay='on'
              value={this.state.ratingCompQues}
              aria-label='custom thumb label'
              defaultValue={[1, 10]}
              max={10}
              min={1}
              onChange={this.handleChange}
            />
            &nbsp;&nbsp;&nbsp;
            &nbsp;&nbsp;&nbsp;
            <RefreshIcon onClick={this.resetRating} onMouseEnter={this.display}>Reset</RefreshIcon>

          </ExpansionPanelDetails>
        </ExpansionPanel>
      </div>
      <Button
        onClick={this.applyFilter}
        variant='outlined'
        color='primary'
        size='large'
        style={{ width: '100%' }}
      >
                  Apply Filter
      </Button>
      <br />
    </React.Fragment>)
  }
  getBadge =(tabLabel, questionTypeDataKey) => {
    let loadingVariable = ''
    console.log(questionTypeDataKey, 'questionTypeDataKey')
    switch (questionTypeDataKey) {
      case 'questionsM':
        loadingVariable = 'loadingM'
        break
      case 'questionsP':
        loadingVariable = 'loadingPublished'
        break
      case 'questionsD':
        loadingVariable = 'loadingDrafted'
        break
      default:
        loadingVariable = 'loadingM'
        break
    }
    let { [questionTypeDataKey]: { question_count: questionCount = null, [loadingVariable]: loading } } = this.state
    return <Badge color='primary'className={this.props.classes.padding} badgeContent={loading ? ' ' : questionCount} max={9999}>{tabLabel}</Badge>
  }

  render () {
    let { filterSubjects } = this.state
    let { activeIndex } = this.state
    let grades
    let filterGrade
    if (this.props.grades) {
      grades = this.props.grades.map(grd => {
        return {
          key: `${grd.id}`,
          value: grd.id,
          text: grd.grade
        }
      })
    } else {
      grades = [{ key: '002', value: '002', text: 'no grades' }]
    }
    if (this.role === 'Teacher') {
      filterGrade = this.userProfile.academic_profile.map(grade => grade.grade_name)

      grades = grades.filter(grade => {
        console.log(filterSubjects, grade.text)
        return filterGrade.includes(grade.text)
      })
    }

    return (
      <React.Fragment>
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
            <AppBar style={{ backgroundColor: '#f0f0f0' }} elevation={0} position='static'>
              <Tabs
                value={this.state.tab}
                onChange={(e, value) => this.setState({ tab: value, x: activeIndex })}
                indicatorColor='primary'
                textColor='primary'
                variant='fullWidth'
              >
                <Tab label={this.getBadge('Your Questions', 'questionsM')} />
                <Tab label={this.getBadge('Published Questions', 'questionsP')} />
                {this.role !== 'Teacher' ? <Tab label={this.getBadge('Question Draft', 'questionsD')} /> : null}
              </Tabs>
            </AppBar>
          </Grid>

        </Grid>
        <Grid container>
          {this.state.open
            ? <Grid item xs={3} >
              <Paper elevation={10}>
                <Collapse in={this.state.open} timeout='auto' unmountOnExit >
                  {this.getFilterContent(grades)}
                </Collapse>
              </Paper>
            </Grid> : null
          }
          <Grid item xs={this.state.open ? 9 : 12}>
            {
              <FamilyProvider value={{ ...this.state, updateQues: () => this.applyFilter() }}>
                {this.getTabContent()}
              </FamilyProvider>
            }
          </Grid>
        </Grid>
      </React.Fragment>
    )
  }
}

const mapStateToProps = state => ({
  grades: state.grades.items,
  user: state.authentication.user
})

const mapDispatchToProps = dispatch => ({
  listGrades: dispatch(apiActions.listGrades())
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(ListCompQuestion))
