import axios from 'axios'
import React, { Component } from 'react'
import Modal from '@material-ui/core/Modal'
import Card from '@material-ui/core/Card'
import { connect } from 'react-redux'
import ReactTable from 'react-table'
import { withRouter } from 'react-router-dom'
import { withStyles, Button } from '@material-ui/core'
import LinkTag from '@material-ui/core/Link'
import InputBase from '@material-ui/core/InputBase'
import SearchIcon from '@material-ui/icons/Search'
import { fade } from '@material-ui/core/styles/colorManipulator'
import IconButton from '@material-ui/core/IconButton/IconButton'
import DeleteIcon from '@material-ui/icons/DeleteOutlined'
import Typography from '@material-ui/core/Typography'
import PersonIcon from '@material-ui/icons/PersonOutline'
import _ from 'lodash'
import TableRow from '@material-ui/core/TableRow'
import TableCell from '@material-ui/core/TableCell'
// import TextField from '@material-ui/core/TextField'
import ReactHtmlParser from 'react-html-parser'
import Grid from '@material-ui/core/Grid'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogTitle from '@material-ui/core/DialogTitle'
import DialogContent from '@material-ui/core/DialogContent'
import '../../css/staff.css'
import { qBUrls, urls } from '../../../urls'
import { apiActions } from '../../../_actions'
import Select from '../../../ui/select'
import { Toolbar, InternalPageStatus } from '../../../ui'
import { COMBINATIONS as USERSTATUSCONFIG } from '../config/assessmentUserStatusConfig'
import { COMBINATIONS } from '../config/gselectConfig'
import GSelect from '../../../_components/globalselector'
import './assessment.css'

const styles = theme => ({
  root: {
    width: '100%',
    marginTop: theme.spacing.unit * 3,
    overflowX: 'auto'
  },
  expandCol: {
    width: '5%'
  },
  tableWrapper: {
    overflowX: 'auto'
  },

  // root: {
  //   display: 'flex'
  // },
  inputRoot: {
    color: 'inherit',
    width: '100%'
  },
  inputInput: {
    paddingTop: theme.spacing.unit,
    paddingRight: theme.spacing.unit,
    paddingBottom: theme.spacing.unit,
    paddingLeft: theme.spacing.unit * 10,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      width: 120,
      '&:focus': {
        width: 200
      }
    }
  },
  grow: {
    flexGrow: 1
  },
  search: {
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: fade(theme.palette.common.white, 0.15),
    '&:hover': {
      backgroundColor: fade(theme.palette.common.white, 0.25)
    },
    marginLeft: 0,
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      marginLeft: theme.spacing.unit,
      width: 'auto'
    }
  },
  searchIcon: {
    width: theme.spacing.unit * 9,
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  subComponentWrap: {
    border: '2px dashed #620049'
  }
})

class viewAssessment extends Component {
  constructor (props) {
    super(props)
    this.props = props
    this.state = {
      showNatAvgMod: false,
      showMod: false,
      visible: false,
      pageIndex: null,
      next: null,
      prev: null,
      totalPages: null,
      data: [],
      defaultValue: {},
      valueSection: [],
      sectionData: null,
      loading: false,
      natAvg: null,
      taglist: [],
      showInfo: false,
      assessCount: null,
      currentUrl: null,
      pageSize: 5,
      params: null,
      page: 1,
      mapPage: 1,
      AssignDetailsLoading: true,
      loding: false,
      showAssessmentUserStatus: false,
      assessmentUserStatusDetails: {},
      currentUserStatusAssessment: {},
      userAssessmentStatusPageSize: 5,
      currentUserStatusLoading: false,
      open: false,
      mapOpen: false,
      currentlySelected: {},
      testIdError: false,
      assignDetails: [],
      currentPage: 1,
      scrolled: false,
      selectedQuestionPaperId: null,
      selectedUniqueTestId: null
    }

    this.userProfile = JSON.parse(localStorage.getItem('user_profile'))
    this.role = this.userProfile.personal_info.role
    this.fetchData = this.fetchData.bind(this)
    this.subComponent = this.subComponent.bind(this)
    this.displayReRoute = this.displayReRoute.bind(this)
    this.deleteAssessment = this.deleteAssessment.bind(this)
    this.modalShow = this.modalShow.bind(this)
    this.modalClose = this.modalClose.bind(this)
    this.modalNatAvgClose = this.modalNatAvgClose.bind(this)
    this.modalNatAvgShow = this.modalNatAvgShow.bind(this)
    this.deleteAssessment = this.deleteAssessment.bind(this)
    this.handleEditAssessmentName = this.handleEditAssessmentName.bind(this)
    this.handleEditUniqueTestId = this.handleEditUniqueTestId.bind(this)
    this.displaylink = this.displaylink.bind(this)
    this.delayedCallback = _.debounce(() => {
      // this.updateStudentInfo(studentInfo, property, value)
      this.fetchData({ page: 1, pageSize: 5 })
    }, 2000)
  }
  modalShow = (e) => {
    this.setState({ tempId: e })
    this.setState({ showMod: true })
  }

  openModal = (e) => {
    axios
      .get(qBUrls.NationalAvg + '?ass_id=' + e,
        {
          headers: {
            Authorization: 'Bearer ' + this.props.user
          }
        }
      )
      .then(res => {
        if (res.status === 201) {
          console.log(res, 'modal')
          this.setState({ assessCount: res.data.assess_count, tagList: res.data.tagss })
        } else {
          console.log('no data found')
        }
        this.setState({
          visible: true
        })
      })
      .catch(error => {
        console.trace('mk')
        console.log(
          "Error: Couldn't get data from " +
            this.state.next + error
        )
      })
  }

  closeModal () {
    this.setState({
      visible: false
    })
  }

  modalNatAvgClose () {
    this.setState({ showNatAvgMod: false })
    this.closeModal()
  }
  modalNatAvgShow = (tag) => {
    console.log(tag, 'tag id')
    console.log('im here')
    axios
      .get(qBUrls.NationalAverage_v2 + '?tag=' + tag,
        {
          headers: {
            Authorization: 'Bearer ' + this.props.user
          }
        }
      )
      .then(res => {
        if (res.status === 200) {
          console.log(res, 'result after the call ...')
          this.setState({ NationalAverageData: res.data })
        } else {
          console.log('no data found')
        }
        this.setState({ showNatAvgMod: true })
      })
      .catch(error => {
        console.trace('mk')
        console.log(
          "Error: Couldn't get data from " +
            this.state.next + error
        )
      })
  }

  modalClose () {
    this.setState({ showMod: false })
  }

  deleteAssessment () {
    console.log(this.state.tempId, 'delete assess')
    this.modalClose()
    axios
      .delete(qBUrls.Assessment_v2 + '?assessment_id=' + this.state.tempId, {
        headers: {
          Authorization: 'Bearer ' + this.props.user
        }
      })
      .then(res => {
        console.log(res, 'result delete')
        this.props.alert.success('Assessment deleted successfully')
        this.setState({ loading: true })
        if (this.state.data.length === 1) {
          this.fetchData({ page: this.state.page - 1, pageSize: this.state.pageSize })
        } else {
          this.fetchData({ page: this.state.page, pageSize: this.state.pageSize })
        }
      })
      .catch(error => {
        console.trace('mk')
        console.log(error.response)
        this.props.alert.error('Something went wrong, please try again')
      })
  }
  componentDidMount () {
    this.role = this.userProfile.personal_info.role
    if (this.role === 'Admin' || this.role === 'Subjecthead' || this.role === 'ExaminationHead') {
      this.fetchData({ page: this.state.page, pageSize: this.state.pageSize })
    }
  }

  handleSelect = ranges => {
    var selectionRange = {
      startDate: ranges.selection.startDate,
      endDate: ranges.selection.endDate,
      key: 'selection'
    }
    this.setState({ selectionRange: selectionRange })
  }

  URLToArray (url) {
    var request = {}
    var pairs = url.substring(url.indexOf('?') + 1).split('&')
    for (var i = 0; i < pairs.length; i++) {
      if (!pairs[i]) { continue }
      var pair = pairs[i].split('=')
      request[decodeURIComponent(pair[0])] = decodeURIComponent(pair[1])
    }
    return request
  }

  displayReRoute (id, secMap) {
    console.log(id, 'assessment id')
    console.log(secMap, 'mapping id')
    this.props.history.push('/questbox/assessment/view/section/' + id + '/' + (secMap || 'NAN'))
  }

  subComponent = (properties) => {
    console.log(properties, 'proppp')
    return (
      <div>
        <ul id='subcomp'>
          {
            properties.original.sectionMappiData ? properties.original.sectionMappiData.map(i => {
              console.log(i, 'lll')
              let gra = i.branch_grade_acad_session_mapping.grade.grade
              let bran = i.branch_grade_acad_session_mapping.branch.branch_name
              let sect = i.section.section_name
              let mappi = bran + '/' + gra + '/' + sect
              return <li><a onClick={() => this.displayReRoute(properties.original.id, i.id)}>{mappi}</a></li>
            }) : ''
          }
        </ul>
      </div>
    )
  }
  displaylink (vdata) {
    console.log(vdata)
    if (vdata) {
      return 'display-link'
    } else {
      return 'hide-link'
    }
  }
  handleSearch = (e) => {
    this.delayedCallback(e)
  }
  searchBar = (queryStringKey) => {
    let { props: { classes } } = this
    return <div className={classes.search}>
      <div className={classes.searchIcon}>
        <SearchIcon />
      </div>
      <InputBase
        id={queryStringKey}
        placeholder='Search…'
        value={this.state.searchTerm}
        classes={{
          root: classes.inputRoot,
          input: classes.inputInput
        }}
        onChange={(e) => {
          this.setState({ searchTerm: e.target.value }, () => {
            this.handleSearch(e)
          })
        }}

      />
    </div>
  }
  filterTableData = (data, queryKey, queryStringKey) => {
    let{ [queryStringKey]: qStr } = this.state
    if (!data) { return [] }
    if (data && (qStr && qStr.trim() !== '')) {
      data = data.filter(item => (item[queryKey] && item[queryKey].toLowerCase().includes(qStr)))
      return data
    }
    return data
  }
  getAPIurl = (reactTableState) => {
    console.log(reactTableState)
    let path = qBUrls.AssessmentNew_v2
    let { branchId, gradeId, sectionId, assessmentType } = this.state
    let { page, pageSize = 5 } = reactTableState
    let queryParams = new Map([
      ['page', (page)],
      ['page_size', pageSize],
      ['branch_id', branchId || null],
      ['grade_id', gradeId || null],
      ['section_id', sectionId || null],
      ['assessment_type', assessmentType || null]
    ])
    path += '?'
    queryParams.forEach((val, key) => {
      if (val) { path += key + '=' + val + '&' }
    })
    this.setState({ page, pageSize })
    return path
  }
  fetchData = reactTableState => {
    console.log(reactTableState)
    const { searchTerm } = this.state
    this.setState({ loading: true, isFetchDataFailed: false })
    let url
    if (searchTerm) {
      url = `${urls.SearchAssessments1}?q=${searchTerm}&page_no=${reactTableState.page}`
    } else {
      url = this.getAPIurl(reactTableState)
    }
    console.log(url)
    axios
      .get(url, {
        headers: {
          Authorization: 'Bearer ' + this.props.user
        }
      })
      .then(res => {
        console.log('filter', res)
        let dataAss = []
        if (res.status === 200) {
          // let result = searchTerm ? res.data : res.data
          res.data['results'].forEach((val) => {
            // eslint-disable-next-line no-debugger
            // debugger
            console.log(val && val.id ? val.id : 'empty', 'idd')
            dataAss.push({
              id: val && val.id ? val.id : '',
              assessment_name: val.name_assessment ? val.name_assessment : '',
              created_by: val.created_by && val.created_by.username ? val.created_by.username : '',
              question_paper: val.question_paper ? val.question_paper : '',
              questionpaper_subject: val.question_paper && val.question_paper.subject ? val.question_paper.subject.subject_name : '',
              assessment_subject: val.subject && val.subject.subject_name ? val.subject.subject_name : '',
              sectionMappiData: val.assign_to_section_mappings > 0
                ? Array.from(new Set(val.assign_to_section_mappings.map((details) => (
                  details)))) : '',
              sectionMappi: val.assign_to_section_mappings > 0 ? Array.from(new Set(val.assign_to_section_mappings.map((details) => (
                details.id))
              )) : '',
              uniqueTest: val.unique_test_id ? val.unique_test_id : '',
              assessmentAttemptCount: val.assessment_attempt_count
            })
          })
          // eslint-disable-next-line no-debugger
          // debugger
          let { page, total_pages: totalPages } = res.data
          console.log(page)
          this.setState({
            pageIndex: 0,
            page: reactTableState.page,
            totalPages,
            assessmentData: dataAss,
            data: dataAss,
            loading: false,
            currentUserStatusGradeId: res.data.results[0].question_paper && res.data.results[0].question_paper.grade ? res.data.results[0].question_paper.grade.id : ''
          })
        } else {
          this.props.alert.error('Something went wrong, please try again')
          this.setState({ loading: false, isFetchDataFailed: true })
        }
      })
      .catch(error => {
        console.log(error)
        console.log(error.response)
        console.log(this.state.data, ' dataAss')
        // // eslint-disable-next-line no-debugger
        // debugger
        this.setState({ loading: false, isFetchDataFailed: true })
        this.props.alert.error('Failed to fetch assessment data')
      })
  }

  setTestIdUniqueStatus = (status) => {
    if (this.state.testId.length > 0) {
      this.setState({ istestIdUnique: status })
    }
  }
  handleTestId = e => {
    let inputValue = e.target.value
    let { currentlySelected = {} } = this.state
    let { uniqueTest } = currentlySelected
    this.setState({ testIdEdited: true })
    if (String(uniqueTest) === String(inputValue)) {
      this.setState({ istestIdUnique: true })
      return
    }
    this.setState({ currentlySelected: { ...this.state.currentlySelected, uniqueTest: inputValue } })
    if (e.target.value.length > 0) {
      axios
        .get(urls.UniqueTestId + '?testId=' + inputValue, {
          headers: {
            Authorization: 'Bearer ' + this.props.user
          }
        })
        .then(res => {
          console.log(res.status === 204)
          if (res.status === 204) {
            this.setTestIdUniqueStatus(true)
          }
        })
        .catch(error => {
          console.log(error)
          if (error.response.status === 409) {
            this.setTestIdUniqueStatus(false)
          } else {
            console.log(error)
          }
          console.log("Error: Couldn't fetch data from " + urls.UniqueTestId)
        })
    } else {
      console.log('Making it false...')
      this.setState({ istestIdUnique: false })
    }
    this.setState({ testId: inputValue })
  };
  handleEditUniqueTestId () {
    // var that = this
    let { currentlySelected } = this.state
    // if (!testId) {
    //   this.setState({ testIdError: true })
    //   return
    // }
    console.log(this.state, 'this.styate')
    let obj = {
      // assessment_name: currentlySelected.assessment_name,
      assessment_id: currentlySelected.id,
      unique_test_id: currentlySelected.uniqueTest
    }

    axios
      .put(urls.EditAssessment, JSON.stringify(obj), {
        headers: {
          'Authorization': 'Bearer ' + this.props.user,
          'Content-Type': 'application/json'
        }
      })
      .then(res => {
        if (String(res.status).startsWith(String(2))) {
          this.props.alert.success('Successfully Updated')
          this.setState((prevState) => {
            let newState = prevState
            let assessmentsData = this.state.assessmentData
            assessmentsData[prevState.currentlySelectedIndex] = {
              ...assessmentsData[prevState.currentlySelectedIndex],
              // assessment_name: currentlySelected.assessment_name,
              uniqueTest: currentlySelected.uniqueTest
            }
            newState.assessmentsData = assessmentsData
            return newState
          })
        } else if (res.status === 409) {
          this.props.alert.error('ID Already Exists')
        }
      })
      .catch(error => {
        this.props.alert.error('Error occured')
        console.log(error)
      })
  }
  handleEditAssessmentName () {
    // var that = this
    let { currentlySelected } = this.state

    console.log(this.state, 'this.styate')
    let obj = {
      assessment_name: currentlySelected.assessment_name,
      assessment_id: currentlySelected.id
      // unique_test_id: currentlySelected.uniqueTest
    }

    axios
      .put(urls.EditAssessment, JSON.stringify(obj), {
        headers: {
          'Authorization': 'Bearer ' + this.props.user,
          'Content-Type': 'application/json'
        }
      })
      .then(res => {
        if (String(res.status).startsWith(String(2))) {
          this.props.alert.success('Successfully Updated')
          this.setState((prevState) => {
            let newState = prevState
            let assessmentsData = this.state.assessmentData
            assessmentsData[prevState.currentlySelectedIndex] = {
              ...assessmentsData[prevState.currentlySelectedIndex],
              assessment_name: currentlySelected.assessment_name
              // uniqueTest: currentlySelected.uniqueTest
            }
            newState.assessmentsData = assessmentsData
            return newState
          })
        } else if (res.status === 409) {
          this.props.alert.error('ID Already Exists')
        }
      })
      .catch(error => {
        this.props.alert.error('Error occured')
        console.log(error)
      })
  }
  scrollHandle = (event) => {
    let { currentPage } = this.state
    // let url = urls.AssignDetails
    let pageSize = this.state.pageSize
    let { target } = event

    if (target.scrollTop + target.clientHeight >= target.scrollHeight) {
      axios.get(`${urls.mappingDetails}?assessment_id=${this.state.openedAssessmentId}&page=${currentPage + 1}&page_size=${pageSize}`, {
        headers: {
          Authorization: 'Bearer ' + this.props.user,
          'Content-Type': 'application/json'
        }
      })
        .then(res => {
          if (res.data.result.length) {
            this.setState({
              currentPage: this.state.currentPage + 1,
              assignDetails: [...this.state.assignDetails, ...res.data.result]
            })
          }
        })
    }
  }
  getMappingDetails = (props, state, pageSize) => {
    this.setState({ mapOpen: true, AssignDetailsLoading: true, openedAssessmentId: props })
    pageSize = pageSize || this.state.pageSize

    var path = urls.mappingDetails
    path += `?assessment_id=${props}`
    // path += selectedTermId ? `&term_id=${selectedTermId}` : ''

    path += `&page=${state && state.page ? state.page + 1 : 1}`
    path += `&page_size=${pageSize}`
    console.log(props, 'iui')
    // path += props.onlinetest_id ? 'onlinetest_id=' + props.onlinetest_id + '&' : ''

    axios.get(path, {
      headers: {
        'Authorization': 'Bearer ' + this.props.user
      }
    }).then((res) => {
      console.log(res, 'ressss')
      if (res.status === 200) {
        this.setState({ assignDetails: res.data.result,
          AssignDetailsLoading: false,
          mapPages: res.data.total_pages,
          mapPage: res.data.current_page,
          mapOpen: true
        })
        console.log(res.data, 'data')
      }
    })
      .catch(e => console.log(e))
    // this.setState({ open: true })
  };
  handleClickOpen = (id) => {
    let currentlySelectedIndex
    let currentlySelected = this.state.assessmentData.filter((assessment, index) => {
      if (assessment.id === id) {
        currentlySelectedIndex = index
        return true
      } else {
        return false
      }
    })[0]
    this.setState({ open: true, currentlySelected: currentlySelected, currentlySelectedIndex })
  };

  handleClose = () => {
    this.setState({ open: false })
  };

  mappingDetailsClose = () => {
    this.setState({ mapOpen: false })
  };
  highLightQuery = (data) => {
    let { searchTerm = '' } = this.state
    if (data && (typeof (data) === 'string') && (searchTerm.trim() !== '')) {
      let regEx = new RegExp(searchTerm, 'gi')
      let highlightedText = data.replace(regEx, `<span style='background-color: yellow'>${searchTerm}</span>`)
      return highlightedText
    }
    return data
  }
  filterToolbar=() => {
    let { branchId, gradeId, sectionId, valueBranch, valueGrade, valueSection } = this.state
    if (!branchId && !gradeId && !sectionId) { return null }
    return (
      <div>
        <p style={{ paddingLeft: '5px' }}>
          <b>Filter</b>
          <Button
            variant='text'
            color='primary'
            onClick={e => this.setState({ valueBranch: [], branchId: null, valueGrade: [], gradeId: null, valueSection: [], sectionId: null }, this.fetchData)}
          >
            Clear
          </Button>
        </p>
        <ul>
          { !Array.isArray(valueBranch) ? <li><b>Branch : </b>{valueBranch.label}</li> : null}
          { !Array.isArray(valueGrade) ? <li><b>Grade : </b>{valueGrade.label}</li> : null}
          { !Array.isArray(valueSection) ? <li><b>Section : </b>{valueSection.label}</li> : null}
        </ul>
      </div>
    )
  }

  onChange = (data) => {
    console.log(data)
    const { section_id: sectionId, grade_id: gradeId, branch_id: branchId } = data
    if (sectionId) {
      this.setState({ branchId, gradeId, sectionId }, () => {
      })
    } else if (gradeId) {
      this.setState({ branchId, gradeId, sectionId: null }, () => {
      })
    } else if (branchId) {
      this.setState({ branchId, gradeId: null, sectionId: null }, () => {
      })
    }
  }

  getAssessment = () => {
    this.setState({ searchTerm: '' }, () => {
      this.fetchData({ page: 1, pageSize: 5 })
    })
  }

  getAssessmentUserStatus = (id, page = 1, pageSize = this.state.userAssessmentStatusPageSize, branchId, gradeId, sectionId) => {
    this.setState({ currentUserStatusLoading: true })
    axios
      .get(`${urls.AssessmentUserStatus}?assessment_id=${id}&page=${page}&page_size=${pageSize}` + (branchId ? `&branch_id=${branchId}` : '') + (gradeId ? `&grade_id=${gradeId}` : '') + (sectionId ? `&section_id=${sectionId}` : ''), {
        headers: {
          Authorization: 'Bearer ' + this.props.user
        }
      }).then((res) => {
        this.setState({ currentUserStatusLoading: false, assessmentUserStatusDetails: res.data, showAssessmentUserStatus: true, currentUserStatusAssessment: id, userAssessmentStatusPageSize: pageSize })
      }).catch(e => {
        this.props.alert.error('Failed to fetch user assessment status')
      })
  }
  getToolbar = () => {
    // let { branchData, sectionData, valueBranch } = this.state
    return (
      <React.Fragment>
        <Toolbar
          floatRight={this.searchBar('queryAssessmentName')}
        >
          <Grid item>
            <Grid container>
              <Grid item>
                <GSelect config={COMBINATIONS} variant={'selector'} onChange={this.onChange} />
              </Grid>
              <Grid style={{ padding: 4 }} item>
                <Select change={(e) => { this.setState({ assessmentType: e.value }) }} label='Type' options={[{ value: 'offline', label: 'offline' }, { value: 'online', label: 'online' }]} />
              </Grid>
              <Grid item>
                <Button
                  variant='outlined'
                  size='small'
                  onClick={this.getAssessment}
                  style={{ marginTop: '20px' }}
                >
            Get Assessment
                </Button>
              </Grid>
            </Grid>
          </Grid>
        </Toolbar>
      </React.Fragment>
    )
  }
  getReactTable = () => {
    let { isFetchDataFailed } = this.state
    let { classes } = this.props
    if (isFetchDataFailed) {
      return (
        <InternalPageStatus
          label={
            <p>Error occured in fetching Assessments&nbsp;
              <LinkTag component='button' onClick={() => { this.setState({ branchId: null, gradeId: null, sectionId: null }, () => { this.fetchData({ page: 1, pageSize: 5 }) }) }}>
                <b>Click here to reload_</b></LinkTag>
            </p>
          }
          loader={false}
        />
      )
    }
    const getColumnWidth = (rows, accessor, headerText) => {
      const maxWidth = 400
      const magicSpacing = 10
      const cellLength = Math.max(
        ...rows.map(row => (`${row[accessor]}` || '').length),
        headerText.length
      )
      return Math.min(maxWidth, cellLength * magicSpacing)
    }
    let columns = [
      {
        Header: 'Id',
        Cell: row => {
          let { page, pageSize } = this.state
          return (pageSize * (page - 1) + (row.index + 1))
        },
        width: 60
      },

      {
        Header: 'Assessment Name',
        minWidth: 200,
        Cell: ({ original }) => {
          return ReactHtmlParser(this.highLightQuery(original.assessment_name))
          // { ReactHtmlParser(this.highLightQuery(this.reSizeImageTags(question))) }
        }
        // width: getColumnWidth(this.state.data, 'assessment_name', 'Assessment Nam')
      },
      {
        Header: 'Subject from QuestionPaper',
        id: 'sub',
        accessor: 'questionpaper_subject',
        width: getColumnWidth(this.state.data, 'questionpaper_subject', 'Subject')
      },
      {
        Header: 'Subject from Assessment',
        id: 'assesment_sub',
        accessor: 'assessment_subject',
        width: getColumnWidth(this.state.data, 'assessment_subject', 'Subject')
      },
      {
        Header: 'Created By',
        accessor: 'created_by',
        width: getColumnWidth(this.state.data, 'created_by', 'Created By')
      },
      {
        Header: 'Unique Test Id',
        accessor: 'uniqueTest',
        width: getColumnWidth(this.state.data, 'uniqueTest', 'Unique Test Id')
      },
      {
        id: 'info',
        Header: 'Info',
        accessor: props => {
          return (
            <div>
              <Button variant='outlined' size='small' color='primary' onClick={() => { console.log(props); this.getMappingDetails(props.id) }}>
               Mapping Details
              </Button>

            </div>
          )
        }
      },
      {
        id: 'Y',
        Header: 'Actions',
        accessor: props => {
          return (
            <div>
              {(this.role === 'Admin' || this.role === 'Subjecthead' || this.role === 'ExaminationHead') && <IconButton
                aria-label='Delete'
                onClick={() => this.modalShow(props.id)}
                // onClick={() => this.deleteAssessment(props.id)}
                className={classes.margin}
              >
                <DeleteIcon fontSize='small' />
              </IconButton>}
              {(this.role === 'Admin' || this.role === 'Subjecthead' || this.role === 'ExaminationHead') && <Button variant='outlined' size='small' color='primary' onClick={() => this.handleClickOpen(props.id)}>
             Edit
              </Button>}
            </div>
          )
        }
      },
      {
        id: 'Z',
        Header: 'View Question Paper',
        accessor: props => {
          return (
            <LinkTag
              onClick={() => { this.props.history.push(`/questbox/view_questionPaper_detail/${props.question_paper.id}`) }}
              // style={{ display: 'none' }}
              className={this.displaylink(props.question_paper.id)}
            >click here to view paper</LinkTag>
          )
        }
      },
      {
        id: 'Zx',
        Header: 'Attempted by',
        accessor: props => {
          console.log(props)
          return <Button onClick={() => {
            this.setState({ selectedQuestionPaperId: props.question_paper.id, selectedUniqueTestId: Number(props.uniqueTest) }, () => {
              this.getAssessmentUserStatus(props.id)
            })
          }}><PersonIcon />{props.assessmentAttemptCount}</Button>
        }
      }
    ]
    return (
      <ReactTable
        manual
        // data={this.state.data}
        data={this.filterTableData(this.state.data, 'assessment_name', 'queryAssessmentName')}
        defaultPageSize={5}
        loading={this.state.loading}
        // onFetchData={this.fetchData}
        pages={this.state.totalPages}
        page={this.state.page - 1}
        onPageSizeChange={(pageSize, pageIndex) => this.fetchData({ page: pageIndex + 1, pageSize })}
        onPageChange={(pageIndex) => this.fetchData({ page: pageIndex + 1 })}
        columns={columns}
      />

    )
  }
  onChangeUserStatus = (data) => {

  }
  render () {
    const { AssignDetailsLoading } = this.state
    let { assessCount, tagList, NationalAverageData, assessmentData, currentUserStatusLoading, showAssessmentUserStatus, currentUserStatusAssessment, currentUserStatusGradeId, assignDetails } = this.state
    console.log(assessmentData, 'dadadtaaaa')
    console.log(this.state.reactTableState)
    const mappingList = assignDetails.map(mapping => {
    })
    const userStatusColumns = [
      {
        Header: 'ERP',
        accessor: 'student.erp'
      },
      {
        Header: 'Student',
        accessor: 'student.name'
      },
      {
        id: 'br',
        Header: 'Branch',
        accessor: data => this.props.branches.filter(branch => branch.id === data.student.branch)[0].branch_name
      },
      {
        id: 'gr',
        Header: 'Grade',
        accessor: data => {
          console.log(this.props.grades.filter(grade => grade.id === data.student.grade), 'DATA')
          return this.props.grades.filter(grade => grade.id === data.student.grade)[0].grade
        }
      },
      {
        id: 'sec',
        Header: 'Section',
        accessor: data => {
          console.log(this.props.sections, 'DATA SECTIONS')
          return this.props.sections.filter(section => section.id === data.student.section)[0].section_name
        }
      },
      {
        Header: 'Marks Obtained',
        accessor: 'marks_obtained'
      }, {
        Header: 'Total Marks',
        accessor: 'total_mark'
      }]

    if (this.role === 'Subjecthead' || this.role === 'ExaminationHead') { // TODO
      userStatusColumns.push({
        Header: 'Edit Marks',
        Cell: ({ original }) => {
          console.log(original)
          return (
            <LinkTag
              onClick={() => { this.props.history.push(`/questbox/view_questionPaper_detail/${this.state.selectedQuestionPaperId}/${original.student.id}/${this.state.selectedUniqueTestId}`) }}
            >click here to view paper</LinkTag>
          )
        }
      })
    }

    // const { classes } = this.props
    return (
      <React.Fragment>
        <div>

          <Dialog
            open={this.state.open}
            onClose={this.handleClose}
            aria-labelledby='form-dialog-title'
          >
            <DialogTitle id='form-dialog-title'>Assessment Name</DialogTitle>
            <DialogContent>
              <input
                label='Assessment Name'
                onChange={(e) => {
                  console.log(e.target.value)
                  this.setState({ currentlySelected: { ...this.state.currentlySelected, assessment_name: e.target.value } })
                }}
                type='name'
                value={this.state.currentlySelected.assessment_name}
              />
              {this.state.currentlySelected.assessment_name ? <Button

                onClick={this.handleEditAssessmentName}
                color='primary'>
Save
              </Button> : null}
            </DialogContent>
            <DialogTitle id='form-dialog-title'>Test ID</DialogTitle>
            <DialogContent>
              <input
                label='Test ID'
                onChange={this.handleTestId}
                // onChange={this.handleTestId}

                type='id'
                value={this.state.currentlySelected.uniqueTest}
                // value={this.state.testId}

              />
              {this.state.istestIdUnique ? <Button

                onClick={this.handleEditUniqueTestId}
                color='primary'>
Save
              </Button> : null}
              {this.state.testIdError && (
                <Typography style={{ color: 'red' }}>Add Test Id</Typography>
              )}
              {(this.state.currentlySelected.uniqueTest && this.state.testIdEdited) ? (
                this.state.istestIdUnique ? (
                  <p style={{ color: 'green' }}> Id Available </p>
                ) : (
                  <p style={{ color: 'red' }}>
                    {' '}
                              Id not available. Kindly try another.{' '}
                  </p>
                )
              ) : (
                ''
              )}
            </DialogContent>
            {/* <DialogActions> */}
            <Button onClick={this.handleClose} color='primary'>
    Cancel
            </Button>

            {/* </DialogActions> */}
          </Dialog>
        </div>

        <div>
          <Dialog
            open={this.state.mapOpen}
            onClose={this.mappingDetailsClose}
            aria-labelledby='form-dialog-title'
          >
            <div className='assessment-container'onScroll={this.scrollHandle}>

              {AssignDetailsLoading ? 'Loading...' : <React.Fragment>
                <DialogContent>
                  <TableRow>
                    {/* <TableCell >{this.state.assignDetails && this.state.assignDetails.branch_name}</TableCell> */}
                    <TableCell >{this.state.assignDetails.map(mapping => {
                      return <TableRow>
                        <div className='assessment-container'onScroll={this.scrollHandle}>
                          <div>
                            {mappingList}
                          </div>
                          <TableCell>{mapping.branch_name}</TableCell>
                          <TableCell>{mapping.grade_name}</TableCell>
                          <TableCell>{mapping.section_name}</TableCell>
                        </div>
                      </TableRow>
                    })}</TableCell>
                  </TableRow>
                </DialogContent>
                {assignDetails.length > 0
                  ? <DialogActions>
                    <Button onClick={this.mappingDetailsClose} color='primary'>
    Cancel
                    </Button>

                  </DialogActions>
                  : 'NO MAPPING'}
              </React.Fragment>}

            </div>

          </Dialog>
        </div>

        <Modal open={showAssessmentUserStatus} onClose={() => this.setState({ showAssessmentUserStatus: false, selectedUniqueTestId: null, selectedQuestionPaperId: null })}>
          <div>
            <Card style={{ maxHeight: '90vh', width: '90vw', position: 'absolute', top: '5vh', left: '5vw' }}>
              <div style={{ height: '15vh', padding: 16, zIndex: 1000, display: 'flex' }}>
                <h3>Assessment User Status </h3>
                <GSelect initialValue={{ grade_id: currentUserStatusGradeId }} config={USERSTATUSCONFIG} variant={'selector'} onChange={(data) => { console.log(data); this.getAssessmentUserStatus(currentUserStatusAssessment, this.state.assessmentUserStatusDetails.page, this.state.userAssessmentStatusPageSize, data.branch_id, data.grade_id, data.section_id) }} />
              </div>
              <ReactTable
                style={{ height: '75vh', width: '90vw' }}
                manual
                // data={this.state.data}
                data={this.state.assessmentUserStatusDetails.results}
                defaultPageSize={this.state.userAssessmentStatusPageSize}
                loading={currentUserStatusLoading}
                pages={this.state.assessmentUserStatusDetails.total_pages}
                page={this.state.assessmentUserStatusDetails.page - 1}
                onPageChange={(pageIndex) => this.getAssessmentUserStatus(currentUserStatusAssessment, pageIndex + 1)}
                onPageSizeChange={(pageSize, pageIndex) => { this.getAssessmentUserStatus(currentUserStatusAssessment, pageIndex + 1, pageSize) }}
                columns={userStatusColumns}
              />
            </Card>
          </div>
        </Modal>
        <Modal open={this.state.visible} onClose={() => this.closeModal()}>
          <Card style={{ position: 'absolute', top: '10vh', margin: '0 auto' }}>
            <segment>
              { assessCount !== null && tagList !== [] ? (
              // <segment>
                <div>
                  <h4 style={{ textAlign: 'center', marginTop: '5%' }}>Click on the below Tags to get the related National Average based on tags :</h4>
                  <ul style={{ textAlign: 'center' }}>
                    {
                      tagList ? tagList.map(i => {
                        return <a href='javascript:void(0);' onClick={() => this.modalNatAvgShow(i['tag_id'])}><li style={{ borderStyle: 'groove', width: '30%' }}>{i['tag_name']}</li></a>
                      }) : ''
                    }
                  </ul>
                  <h4><p>&nbsp;&nbsp;Total assessments related to the Above tags are:</p> &nbsp;&nbsp; {assessCount}</h4>
                  {'\n'}
                  {/* <h4><p>&nbsp;&nbsp;The Average is:</p> &nbsp;&nbsp;{natAvg} </h4>{'\n'}{'\n'} */}
                  <a href='javascript:void(0);' onClick={() => this.closeModal()} style={{ marginTop: '30%' }}>Close</a>
                </div>
              ) : (
                <div>
                  <p> No related data</p>
                  <a href='javascript:void(0);' onClick={() => this.closeModal()}>Close</a>
                </div>
              )
              }
            </segment>
          </Card>
        </Modal>
        <Dialog
          open={this.state.showMod}
          onClose={() => this.modalClose()}
          aria-labelledby='alert-dialog-title'
          aria-describedby='alert-dialog-description'
        >
          <DialogTitle id='alert-dialog-title'>{'Are you sure to delete the selected Assessment ?'}</DialogTitle>
          <DialogActions>
            <Button onClick={this.modalClose} color='primary'>
            No
            </Button>
            <Button onClick={this.deleteAssessment} color='primary' autoFocus>
            Yes
            </Button>
          </DialogActions>
        </Dialog>
        <Modal open={this.state.showNatAvgMod} onClose={() => this.modalNatAvgClose()}>
          <Card style={{ position: 'absolute', top: '10vh', margin: '0 auto' }}>
            <segment>
              { NationalAverageData !== null ? (
              // <segment>
                <div>
                  <h4 style={{ textAlign: 'center', marginTop: '5%' }}>Click on the below Tags to get the related National Average based on tags :</h4>
                  <ul style={{ textAlign: 'center' }}>
                    {
                      NationalAverageData ? NationalAverageData.map(i => {
                        return <li style={{ textAlign: 'justify' }}>The National Average for {i['question_range_definition']['range_name']} of range {i['question_range_definition']['start_point']} to {i['question_range_definition']['end_point']} is: {i['national_avg'] }</li>
                      }) : ''
                    }
                  </ul>
                  {/* <h4><p>&nbsp;&nbsp;Total assessments related to the Above tags are:</p> &nbsp;&nbsp; {assessCount}</h4> */}
                  {'\n'}
                  {/* <h4><p>&nbsp;&nbsp;The Average is:</p> &nbsp;&nbsp;{natAvg} </h4>{'\n'}{'\n'} */}
                  <a href='javascript:void(0);' onClick={() => this.modalNatAvgClose()} style={{ marginTop: '30%' }}>Close</a>
                </div>
              ) : (
                <div>
                  <p> No related data</p>
                  <a href='javascript:void(0);' onClick={() => this.modalNatAvgClose()}>Close</a>
                </div>
              )
              }
            </segment>
          </Card>
        </Modal>
        {this.getToolbar()}
        {this.getReactTable()}

      </React.Fragment>
    )
  }
}

const mapStateToProps = state => ({
  branches: state.branches.items,
  sections: state.sections.items,
  section: state.sectionMap.items,
  subjects: state.subjects.items,
  grades: state.grades.items,
  user: state.authentication.user
})

const mapDispatchToProps = dispatch => ({
  loadBranches: () => dispatch(apiActions.listBranches()),
  gradeMapBranch: branchId => dispatch(apiActions.getGradeMapping(branchId)),
  sectionMap: gradeMapId => dispatch(apiActions.getSectionMapping(gradeMapId)),
  listBranches: dispatch(apiActions.listBranches()),
  listSubjects: dispatch(apiActions.listSubjects()),
  listGrades: dispatch(apiActions.listGrades()),
  listSections: dispatch(apiActions.listSections())
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(withRouter(viewAssessment)))
