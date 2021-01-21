import React, { Component } from 'react'
import axios from 'axios'
import ExpansionPanel from '@material-ui/core/ExpansionPanel'
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary'
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails'
import Typography from '@material-ui/core/Typography'
import RefreshIcon from '@material-ui/icons/Refresh'
import _ from 'lodash'
import { Grid, Button, Tabs, Tab, AppBar, Collapse, ListItem, ListItemText, Paper, withStyles } from '@material-ui/core'
import InputBase from '@material-ui/core/InputBase'
import SearchIcon from '@material-ui/icons/Search'
import IconButton from '@material-ui/core/IconButton'
import Badge from '@material-ui/core/Badge'
import ExpandLess from '@material-ui/icons/ExpandLess'
import ExpandMore from '@material-ui/icons/ExpandMore'
import Slider from '@material-ui/core/Slider'
import { connect } from 'react-redux'
import { urls, qBUrls } from '../../urls'

import Checkbox from './Checkbox/Checkbox'
import QuestionsFrame from './QuestionComp/viewQuestionsComponent'
import { apiActions } from '../../_actions'
import { FamilyProvider } from './SmallContext'
import GSelect from '../../_components/globalselector'

import { COMBINATIONS } from '../videoUpload/config/combination'

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

class ListQuestion extends Component {
  constructor (props) {
    super(props)
    this.state = {
      questions: {},
      subjectArr: [],
      questionTypeArr: [],
      questionLevelArr: [],
      questionCategoryArr: [],
      chapterArr: [],
      filter: 'notapply',
      chapt: [],
      loading: false,
      loadingD: false,
      loadingP: false,
      questions_context: { data: [] },
      questions_drafted: { data: [] },
      questions_published: { data: [] },
      activePage: 1,
      activePageD: 1,
      activePageP: 1,
      activeIndex: 0,
      tab: 0,
      filterQuestionType: [],
      filterQuestionLevel: [],
      filterQuestionCategory: [],
      filterSubjects: [],
      filterGrades: [],
      chapter: [],
      ratingFrom: [1, 10],
      defaultVal: [1, 10],
      chapterList: [],
      Tabchanged: 0,
      pagenumber: 1

    }
    this.handlePage = this.handlePage.bind(this)
    this.handleDPage = this.handleDPage.bind(this)
    this.handlePPage = this.handlePPage.bind(this)
    this.handleCheckbox = this.handleCheckbox.bind(this)
    this.userProfile = JSON.parse(localStorage.getItem('user_profile'))
    this.role = this.userProfile.personal_info.role
    this.fetchHeaders = { headers: { Authorization: 'Bearer ' + props.user } }
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
        let subjectsArr = res.data.map(sub => {
          return {
            key: `${sub.id}`,
            value: sub.id,
            text: sub.subject_name
          }
        })
        this.setState({ subjectArr: subjectsArr.length ? subjectsArr : null })
      })
      .catch(error => {
        console.log(error)
      })
    // ==================
    axios
      .get(urls.QuestionType, {
        headers: {
          Authorization: 'Bearer ' + this.props.user,
          'Content-Type': 'application/json'
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
      .catch(error => {
        console.log(error)
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
          console.log(res.data, 'qcategory')

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
    this.getQuestions()
  }

  getMineDraftPublishQuestions=(qnStatus, qnResult, loading, activePage, pgNum) => {
    const {
      filterSubjects,
      filterGrades,
      chapter,
      filterQuestionType,
      filterQuestionCategory,
      filterQuestionLevel,
      ratingFrom
    } = this.state
    console.log(loading, pgNum, '=================')
    let newurl = qBUrls.ListQuestion + `pagenumber=${pgNum || 1}&subject=${String(filterSubjects)}&grade=${String(
      filterGrades
    )}&chapter=${String(chapter)}&type=${String(
      filterQuestionType
    )}&category=${String(filterQuestionCategory)}&level=${String(
      filterQuestionLevel
    )}&question_status=${qnStatus}&ques_type=MCQ`
    newurl = qnStatus === 'Published' ? `${newurl}&rating=${ratingFrom}` : newurl

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
  getQnsArgs=(pgNo) => {
    const mineQns = ['Mine', 'questions_context', 'loading', 'activePage', pgNo]
    const publishedQns = ['Published', 'questions_published', 'loadingP', 'activePageP', pgNo]
    const draftQns = ['Drafted', 'questions_drafted', 'loadingD', 'activePageD', pgNo]

    return [mineQns, publishedQns, draftQns]
  }
  getQuestions = (pgNo) => {
    const qnArgs = this.getQnsArgs(pgNo)
    this.getMineDraftPublishQuestions(...qnArgs[0])
    this.getMineDraftPublishQuestions(...qnArgs[1])
    this.getMineDraftPublishQuestions(...qnArgs[2])
  }

  handleCheckbox = (e, i) => {
    let { filterSubjects, filterGrades, chapter, filterQuestionType, filterQuestionCategory, filterQuestionLevel } = this.state

    // Question Type
    if (i.name === 'Question Type') {
      if (i.checked) {
        console.log('checked', i.name)
        if (filterQuestionType.includes(String(i.value)) === false) {
          filterQuestionType.push(`${i.value}`)
        }
      } else {
        console.log('unchecked', i.name)
        if (filterQuestionType.includes(String(i.value)) === true) {
          let v = filterQuestionType.indexOf(String(i.value))
          filterQuestionType.splice(v, 1)
        }
      }
    }
    // Question Level
    if (i.name === 'Question Level') {
      if (i.checked) {
        console.log('checked', i.name)
        if (filterQuestionLevel.includes(String(i.value)) === false) {
          filterQuestionLevel.push(`${i.value}`)
        }
        console.log(filterQuestionLevel)
      } else {
        console.log('unchecked', i.name)
        if (filterQuestionLevel.includes(String(i.value)) === true) {
          let v = filterQuestionLevel.indexOf(String(i.value))
          filterQuestionLevel.splice(v, 1)
        }
        console.log(filterQuestionLevel)
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
        console.log('checked', i.name)
        if (chapter.includes(String(i.value)) === false) {
          chapter.push(`${i.value}`)
        }
        console.log(chapter)
      } else {
        let obj = this.state.chapterArr
        obj.forEach(v => {
          if (v.value === i.value) {
            v.checked = false
          }
        })
        this.setState({ chapterArr: obj })
        console.log('unchecked', i.name)
        if (chapter.includes(String(i.value)) === true) {
          let v = chapter.indexOf(String(i.value))
          chapter.splice(v, 1)
        }
        console.log(chapter)
      }
    }
    // Question Category
    if (i.name === 'Question Category') {
      if (i.checked) {
        console.log('checked', i.name)
        if (filterQuestionCategory.includes(String(i.value)) === false) {
          filterQuestionCategory.push(`${i.value}`)
        }
        console.log(filterQuestionCategory)
        console.log(i.rate, 'hiii')
      } else {
        console.log('unchecked', i.name)
        if (filterQuestionCategory.includes(String(i.value)) === true) {
          let v = filterQuestionCategory.indexOf(String(i.value))
          filterQuestionCategory.splice(v, 1)
        }
        console.log(filterQuestionCategory)
      }
    }
    // Subjects
    if (i.name === 'Subjects') {
      if (i.checked) {
        console.log('checked', i.name)
        if (filterSubjects.includes(String(i.value)) === false) {
          filterSubjects.push(`${i.value}`)
        }
        console.log(filterSubjects)
      } else {
        console.log('unchecked', i.name)
        if (filterSubjects.includes(String(i.value)) === true) {
          let v = filterSubjects.indexOf(String(i.value))
          filterSubjects.splice(v, 1)
          console.log(i.rate, 'hiii')
        }
        console.log(filterSubjects)
      }
      this.setState({ chapt: filterSubjects })
      console.log(this.state.chapt, 'chapterr')
    }
    // Grades
    if (i.name === 'Grades') {
      if (i.checked) {
        console.log('checked', i.name)
        if (filterGrades.includes(String(i.value)) === false) {
          filterGrades.push(`${i.value}`)
          console.log(i.rate, 'hiii')
        }
        console.log(filterGrades)
      } else {
        console.log('unchecked', i.name)
        if (filterGrades.includes(String(i.value)) === true) {
          let v = filterGrades.indexOf(String(i.value))
          filterGrades.splice(v, 1)
        }
        console.log(filterGrades)
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
    this.setState({ filterSubjects, filterGrades, chapter, filterQuestionType, filterQuestionCategory, filterQuestionLevel })
  }

  applyFilter = () => {
    let { searchString = '' } = this.state

    if (searchString !== '') {
      // if search string has value.. making ajax to elastic search else normal list ques api filter
      this.handleSearch()
      return
    }

    this.getQuestions()

    this.scrollToTop()
  }

  scrollToTop = () => {
    document.body.style.scrollBehavior = 'smooth'
    document.documentElement.style.scrollBehavior = 'smooth'
    document.body.scrollTop = 0
    document.documentElement.scrollTop = 0
  }

  handlePage = i => {
    const qnArgs = this.getQnsArgs(i)
    this.getMineDraftPublishQuestions(...qnArgs[0])
  };

  handlePPage = i => {
    const qnArgs = this.getQnsArgs(i)
    this.getMineDraftPublishQuestions(...qnArgs[1])
  };

  handleDPage = i => {
    const qnArgs = this.getQnsArgs(i)
    this.getMineDraftPublishQuestions(...qnArgs[2])
  };
  getTabContent = () => {
    let { filterSubjects, filterGrades, chapter, filterQuestionType, filterQuestionCategory, filterQuestionLevel, loading, loadingD, loadingP, Tabchanged } = this.state
    let { tab } = this.state
    let tabContent = [
      <QuestionsFrame
        keyNameofQuestionsData='questions_context'
        loaderLabel='Loading Questions...'
        loading={loading}
        questionType={filterQuestionType}
        questionLevel={filterQuestionLevel}
        questionCategory={filterQuestionCategory}
        subjects={filterSubjects}
        grades={filterGrades}
        chapter={chapter}
        page={this.handlePage}
        TabChanged={Tabchanged}
        activePage={this.state.activePage}
        searchQuestion={this.searchQuestion}
        searchString={this.state.searchString}
        {...this.props}
      />,
      <QuestionsFrame
        keyNameofQuestionsData='questions_published'
        loaderLabel='Loading Published Questions...'
        loading={loadingP}
        questionType={filterQuestionType}
        questionLevel={filterQuestionLevel}
        questionCategory={filterQuestionCategory}
        subjects={filterSubjects}
        grades={filterGrades} questions_drafted
        chapter={chapter}
        page={this.handlePPage}
        TabChanged={Tabchanged}
        activePage={this.state.activePageP}
        searchQuestion={this.searchQuestion}
        searchString={this.state.searchString}
        {...this.props}
      />
    ]
    if (this.role !== 'Teacher') {
      tabContent.push(
        <QuestionsFrame
          publishQuestions
          keyNameofQuestionsData='questions_drafted'
          loaderLabel='Loading Drafted Questions...'
          loading={loadingD}
          questionType={filterQuestionType}
          questionLevel={filterQuestionLevel}
          questionCategory={filterQuestionCategory}
          subjects={filterSubjects}
          grades={filterGrades}
          chapter={chapter}
          page={this.handleDPage}
          TabChanged={Tabchanged}
          activePage={this.state.activePageD}
          searchQuestion={this.searchQuestion}
          searchString={this.state.searchString}
          {...this.props}
        />
      )
    }

    return tabContent[tab]
  }

  onChange = (data) => {
    console.log(data)
    // filterSubjects, filterGrades, chapter,
    const { grade_id: gradeId, subject_id: subjectId, id } = data
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
    this.setState({ ratingFrom: value })
  }

  resetRating = (event, value) => {
    this.setState({
      ratingFrom: this.state.defaultVal
    })
  }
  handleclick=() => {
    console.log('hanlde clicked')
  }
  getFilterContent = (grades) => {
    let { filterSubjects, filterGrades, chapter, filterQuestionType, filterQuestionCategory, filterQuestionLevel } = this.state
    return (<React.Fragment>
      <Checkbox
        key='Question Type'
        heading='Question Type'
        array={this.state.questionTypeArr}
        change={this.handleCheckbox}
        checkedItems={filterQuestionType}

      />

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
            onClick={this.handleclick}
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
              aria-label='custom thumb label'
              value={this.state.ratingFrom}
              defaultValue={[1, 10]}
              max={10}
              min={1}
              onChange={this.handleChange}

            />
            &nbsp;&nbsp;&nbsp;
            &nbsp;&nbsp;&nbsp;
            <RefreshIcon onClick={this.resetRating}>Reset</RefreshIcon>

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
  getBadge = (tabLabel, questionTypeDataKey) => {
    let loadingVariable = ''

    // loading | loadingP | loadingD
    console.log(questionTypeDataKey, 'questionTypeDataKey')
    switch (questionTypeDataKey) {
      case 'questions_context':
        loadingVariable = 'loading'
        break
      case 'questions_published':
        loadingVariable = 'loadingP'
        break
      case 'questions_drafted':
        loadingVariable = 'loadingD'
        break
      default:
        loadingVariable = 'loading'
        break
    }

    // questionTypeDataKey will questions_context || questions_drafted || questions_published

    let { [questionTypeDataKey]: { question_count: questionCount = null }, [loadingVariable]: loading } = this.state
    // if (loading) return null
    console.log(loading, 'loooooo')
    return <Badge color='primary' className={this.props.classes.padding} badgeContent={loading ? '' : questionCount} max={9999}>{tabLabel}</Badge>
  }

  /**
   * @param
   * ['is_comprehension', 'False'], ['page_size', 10], ['temp', false]]
   * createQuery(['is_comprehension', 'False'], ['page_size', 10], ['temp', false]])
   * @return
   * returns only params has true val
   * is_comprehension=False&page_size=10
  */
  createQuery = params => params.filter(param => (param[1] !== undefined)).map(param => `${param[0]}=${param[1]}`).join('&')

  searchQuestion = (pageNo, questionsVariant, searchValue) => {
    // questionsVariant = questions_context |  questions_published | questions_drafted

    let searchUrl = urls.ListQuestionSearch

    let { fetchHeaders } = this

    let questionStatus = ''
    // Mine | Published | Drafted
    let loadingVariable = ''
    // loading | loadingP | loadingD
    let activePageVariable = ''
    // activePage | activePageP | activePageD
    switch (questionsVariant) {
      case 'questions_context':
        questionStatus = 'Mine'
        loadingVariable = 'loading'
        activePageVariable = 'activePage'
        break
      case 'questions_published':
        questionStatus = 'Published'
        loadingVariable = 'loadingP'
        activePageVariable = 'activePageP'
        break
      case 'questions_drafted':
        questionStatus = 'Drafted'
        loadingVariable = 'loadingD'
        activePageVariable = 'activePageD'
        break
      default:
        questionStatus = 'Mine'
        loadingVariable = 'loading'
        activePageVariable = 'activePage'
        break
    }
    let { filterSubjects, filterGrades, chapter, filterQuestionType, filterQuestionCategory, filterQuestionLevel } = this.state

    let params = [
      ['page_size', 10],
      ['page_no', pageNo],
      ['search', searchValue],
      ['is_comprehension', false]
    ]
    // params related to question
    params = [
      ...params,
      ['subject', filterSubjects],
      ['grade', filterGrades],
      ['chapter', chapter],
      ['category', filterQuestionCategory],
      ['level', filterQuestionLevel],
      ['type', filterQuestionType],
      ['question_status', questionStatus]
    ]
    let query = this.createQuery(params)
    this.setState({ [loadingVariable]: true })

    console.log(typeof (query.split('&')), 'queryyyy')

    axios
      .get(searchUrl + '?' + query, fetchHeaders)
      .then(res => {
        this.setState({
          [questionsVariant]: res.data,
          [loadingVariable]: false,
          [activePageVariable]: pageNo
        })
      })
      .catch(er => {
        this.setState({ [loadingVariable]: false })
      })
  }
  handleSearch = _.debounce(() => {
    let { searchString = '' } = this.state
    if (searchString.trim() === '') return

    this.searchQuestion(1, 'questions_context', searchString)
    this.searchQuestion(1, 'questions_published', searchString)
    this.searchQuestion(1, 'questions_drafted', searchString)
  }, 1000, { 'maxWait': 1000 });
  getSearchInpTag = () => {
    return <React.Fragment>
      <div style={{ marginTop: 5 }}>
        <span
          style={{ float: 'left', backgroundColor: 'rgb(226, 226, 226)', borderRadius: '10px', padding: 2, paddingLeft: 4, paddingRight: 4, margin: 3 }}
        >
          &nbsp;&nbsp;&nbsp;
          <InputBase
            style={{ margin: 0, padding: '0' }}
            onChange={(e) => {
              this.setState({ searchString: e.target.value }, () => {
                let { searchString = '' } = this.state
                if (searchString.trim().length <= 0) this.applyFilter()
                else this.handleSearch()
              })
            }}
            value={this.state.searchString}
            placeholder='Search Question'
          />
          <IconButton
            style={{ margin: 0, padding: '0' }}
            aria-label='Search'
            onClick={e => this.handleSearch()}
          >
            <SearchIcon />
          </IconButton>
          &nbsp;&nbsp;&nbsp;
        </span>
      </div>
    </React.Fragment>
  }
  handleTabs=(value) => {
    let { activeIndex } = this.state
    this.setState({
      tab: value,
      x: activeIndex

    })

    const qnArgs = this.getQnsArgs()
    if (value === 0) {
      this.setState({
        activePage: 1,
        loading: true
      })
      this.getMineDraftPublishQuestions(...qnArgs[0])
    } else if (value === 1) {
      this.setState({
        activePageP: 1,
        loadingP: true
      })
      this.getMineDraftPublishQuestions(...qnArgs[1])
    } else {
      this.setState({
        activePageD: 1,
        loadingD: true
      })
      this.getMineDraftPublishQuestions(...qnArgs[2])
    }
  }
  render () {
    let { filterSubjects } = this.state
    let grades
    console.log(grades)
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
                onChange={(e, value) => this.handleTabs(value)}
                indicatorColor='primary'
                textColor='primary'
                variant='fullWidth'
              >
                <Tab label={this.getBadge('Your Questions', 'questions_context')} />
                <Tab label={this.getBadge('Published Questions', 'questions_published')} />
                {this.role !== 'Teacher' ? <Tab label={this.getBadge('Question Draft', 'questions_drafted')} /> : null}
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
              <React.Fragment>
                {this.getSearchInpTag()}
                <FamilyProvider value={{ ...this.state, updateQues: () => this.applyFilter() }}>
                  {this.getTabContent()}
                </FamilyProvider>
              </React.Fragment>
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
)(withStyles(styles)(ListQuestion))
