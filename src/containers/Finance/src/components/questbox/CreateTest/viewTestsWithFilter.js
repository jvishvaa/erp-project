import React, {
  Component
  //  Fragment
} from 'react'
import axios from 'axios'
import { connect } from 'react-redux'
// import { Card } from 'semantic-ui-react'
import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'
import Typography from '@material-ui/core/Typography'
import Modal from 'react-awesome-modal'
import {
  Button, withStyles, Tabs, Tab, AppBar, Grid
  // CircularProgress
} from '@material-ui/core'
import TableRow from '@material-ui/core/TableRow'
import Link from '@material-ui/core/Link'
import TableCell from '@material-ui/core/TableCell'
import { withRouter } from 'react-router-dom'
import ReactTable from 'react-table'
import InputBase from '@material-ui/core/InputBase'
import IconButton from '@material-ui/core/IconButton'
import SearchIcon from '@material-ui/icons/Search'
import DeleteIcon from '@material-ui/icons/DeleteOutlined'
import EventNoteIcon from '@material-ui/icons/EventNoteOutlined'
import _ from 'lodash'
// import { throttle, debounce } from 'throttle-debounce'
// import TextField from '@material-ui/core/TextField'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
// import DialogTitle from '@material-ui/core/DialogTitle'
import { apiActions } from '../../../_actions'
// import { OmsSelect } from '../../../ui'
import { COMBINATIONS } from '../config/combination'
import GSelect from '../../../_components/globalselector'
import { urls } from '../../../urls'
import './test.css'

const styles = theme => ({
  root: {
    width: '90%'
  },
  button: {
    // marginRight: theme.spacing.unit
  },
  instructions: {
    marginTop: theme.spacing.unit,
    marginBottom: theme.spacing.unit
  },
  expand: {
    transform: 'rotate(0deg)',
    marginLeft: 'auto',
    transition: theme.transitions.create('transform', {
      duration: theme.transitions.duration.shortest
    })
  },
  expandOpen: {
    transform: 'rotate(180deg)'
  }
})

class ViewTestsWithFilter extends Component {
  constructor () {
    super()
    this.role = JSON.parse(localStorage.getItem('user_profile')).personal_info.role
    this.state = {
      attemtingAssessNo: 0,
      assessmentCount: 0,
      // questionPaperData: [],
      AssignDetailsLoading: true,
      testId: null,
      expanded: false,
      status: { NS: 'Not started', S: 'started', C: 'Completed' },
      tab: 0,
      testTypes: ['Normal', 'Practice'],
      currentTestType: 'Normal',
      // loading: true,
      onlineTests: [],
      practiceTests: [],
      subjects: [],
      gradeArr: [],
      query: [],
      open: false,
      assignDetails: [],
      page: 1,
      mapPage: 1,
      pageSize: 5,
      currentPage: 1,
      scrolled: false

    }
    this.getTabContent = this.getTabContent.bind(this)
    this.handleSearch = this.handleSearch.bind(this)
    this.delayedCallback = _.debounce((event) => {
      this.handleSearch(event)
    }, 1000)
  }

  // Changes in Viewtestsfilter

  componentDidMount () {
    this.fetchData()
    this.props.getSubjects()
  }
  componentWillUnmount () {
    this.setState = () => {}
  }
  changeQuery = event => {
    this.setState({ q: event.target.value }, () => {
      this.delayedCallback(this.state.q)
    })
  };
  getTests = (path) => {
    return axios.get(path, {
      headers: {
        Authorization: 'Bearer ' + this.props.user
      }
    })
  }

  handleSearch (e) {
    console.log('Entering here')
    axios
      .get(urls.ElasticSearchOnlineTest + '?q=' + e, {
        headers: {
          Authorization: 'Bearer ' + this.props.user
        }
      })
      .then(res => {
        console.log('filter', res)
        let data = res.data
        this.setState({
          data: data,
          onlineTests: res.data.results
        })
      })
      .catch(error => {
        console.log(error, 'error')
        this.setState({ loading: false })
      })
  }

  handleTabChange = (event, value) => {
    this.setState({ tab: value, currentTestType: this.state.testTypes[value], loading: true, subjectId: '', gradeId: '' }, this.fetchData)
  }

  handleSubject = (e) => {
    this.setState({ subjectId: e.value, selectedGrade: {}, gradeId: '' })
    if (role === 'Admin') {
      axios.get(urls.GRADE, {
        headers: {
          Authorization: 'Bearer ' + this.props.user
        }
      })
        .then(res => {
          let gradesArr = []
          let data = res.data || []
          gradesArr = data.map(grd => {
            return {
              key: `${grd.id}`,
              value: grd.id,
              label: grd.grade
            }
          })
          console.log(gradesArr)
          this.setState({ gradeArr: gradesArr })
        })
    } else {
      let gradesArr = []
      let uniqueSubjects = this.getUnique(academicProfile, 'subject_name')
      let subj = uniqueSubjects.filter((subject) => {
        return e.label === subject.subject_name
      })
      gradesArr = subj.map(grd => {
        return {
          key: `${grd.grade_id}`,
          value: grd.grade_id,
          label: grd.grade_name
        }
      })
      this.setState({ gradeArr: gradesArr })
    }
  }

  handleGrade = (e) => {
    this.setState({ gradeId: e.value, selectedGrade: e })
  }

  handleGetTests = () => {
    let { subjectId, gradeId } = this.state
    if (subjectId && gradeId) {
      this.fetchData()
    }
  }

  fetchData = (reacttableState) => {
    let { page = 0, pageSize = 5 } = reacttableState || {}
    let { subjectId, gradeId, currentTestType } = this.state

    // let path = `${urls.ViewTest}?`
    // admin,teacher etc will use student url.
    let path = `${urls.StudentTest}?`
    console.warn(path)
    path += `page=${page + 1}&type=${currentTestType}&`
    path += subjectId && gradeId ? `subject_id=${subjectId}&grade_id=${gradeId}` : ''
    console.warn(path)
    if ((this.role === 'Teacher' || this.role === 'LeadTeacher') && !subjectId && !gradeId) {
      this.setState({ loading: false })
      return
    }
    this.setState({ page, pageSize, loading: true })
    this.getTests(path)
      .then(res => {
        console.log(res)
        if (currentTestType === 'Normal') {
          this.setState({
            onlineTests: res.data.results,
            onlinetestId: res.data.results.onlinetest_id,
            totalPages: res.data.total_pages,
            loading: false
          })
        } else if (currentTestType === 'Practice') {
          this.setState({
            practiceTests: res.data.results,
            totalPages: res.data.total_pages,
            loading: false
          })
        }
      })
      .catch(err => {
        console.log(err)
        this.setState({ loading: false })
      })
  }

  getData = (original) => {
    const { activeAssessment } = this.state
    const assessmentId = original.assessments[activeAssessment].assessment_id
    axios.get(`${urls.QuestionpaperDetails}?assessment_id=${assessmentId}`, {
      headers: {
        Authorization: 'Bearer ' + this.props.user
      }
    })
      .then(res => {
        this.setState({ questionPaperData: res.data, loadingSubComponent: false })
      })
      .catch(error => {
        console.log(error)
      })
  }

  assessmentSubComponent = (props) => {
    let { questionPaperData } = this.state
    console.log(props, 'props')
    return (
      <React.Fragment>
        {
          questionPaperData ? (
            <React.Fragment>
              <Card>
                <CardContent>
                  <Typography gutterBottom variant='h5' component='h2'>
                  Question Paper:  {questionPaperData.question_paper.question_paper_name}
                  </Typography>
                  <Typography variant='h6' color='textSecondary' component='p'>
                  Grade:  {questionPaperData.question_paper.grade.grade}
                  </Typography>
                  <Typography variant='h6' color='textSecondary' component='p'>
                  Subject:  {questionPaperData.question_paper.subject.subject_name}
                  </Typography>
                  <Typography variant='h6' color='textSecondary' component='p'>
                  Created on:  {questionPaperData.question_paper.created_date.slice(0, 10)}
                  </Typography>
                  <Typography variant='h6' color='textSecondary' component='p'>
                  Created By:  {questionPaperData.question_paper.user.username}
                  </Typography>
                  <Typography variant='h6' color='textSecondary' component='p'>
                    <Link
                      onClick={() => { this.props.history.push(`/questbox/view_questionPaper_detail/${props.original.assessment_id}`) }}
                    >click here to view Question paper</Link>
                  </Typography>
                </CardContent>
              </Card>
            </React.Fragment>
          ) : (
            <h3>{this.state.loadingSubComponent ? 'Loading...' : 'No data'}</h3>
          )
        }
      </React.Fragment>
    )
  }

  subComponent = ({ original, row }) => {
    let { expandedAssessmentRows = {} } = this.state
    let assessments = original.assessments || []
    return <React.Fragment>
      <div>
        <ReactTable
          data={assessments || []}
          expanded={expandedAssessmentRows}
          onExpandedChange={(expandedAssessment, activeAssessmentItem) => {
            console.log(expandedAssessment, activeAssessmentItem)
            this.setState({ expandedAssessmentRows: { [activeAssessmentItem[0]]: expandedAssessment[activeAssessmentItem[0]] }, activeAssessment: activeAssessmentItem[0] }, () => {
              this.setState({ loadingSubComponent: true }, () => { this.getData(original) })
            })
          }}
          showPageSizeOptions={(assessments.length > 5)}
          defaultPageSize={assessments.length <= 5 ? assessments.length : 5}
          showPagination={(assessments.length > 5)}
          loading={this.state.loading}
          pages={assessments.length}
          SubComponent={this.assessmentSubComponent}
          columns={[
            {
              Header: 'SL_NO',
              id: 'sln',
              width: 100,
              Cell: (sln) => {
                console.log(sln)
                return sln.index + 1
              }
            },
            {
              Header: 'Assessment name',
              id: 'assessmentId',
              accessor: 'assessment_name'
            },
            {
              Header: 'Assessment type',
              id: 'assessmentType',
              accessor: 'assessment_type'
            },
            {
              Header: 'Assessment duration',
              id: 'assessmentDuration',
              accessor: 'assessment_duration'
            },
            {
              Header: 'Assessment category',
              id: 'assessmentCategory',
              accessor: 'assessment_category'
            },
            {
              Header: 'Assessment Start Date',
              id: 'startDate',
              accessor: 'assessment_start_date'
            },
            {
              Header: 'Assessment End Date',
              id: 'endDate',
              accessor: 'assessment_end_date'
            }
          ]}
        />
      </div>
    </React.Fragment>
  }
  scrollHandle = (event) => {
    let { currentPage } = this.state
    // let url = urls.AssignDetails
    let pageSize = this.state.pageSize
    let { target } = event

    if (target.scrollTop + target.clientHeight >= target.scrollHeight) {
      axios.get(`${urls.AssignDetails}?onlinetest_id=${this.state.openedTestId}&page=${currentPage + 1}&page_size=${pageSize}`, {
        headers: {
          Authorization: 'Bearer ' + this.props.user,
          'Content-Type': 'application/json'
        }
      })
        .then(res => {
          if (res.data.result.length) {
            this.setState({
              currentPage: this.state.currentPage + 1,
              assignDetails: [...this.state.assignDetails, ...res.data.result],
              mappingCount: res.data.mapping_count
            })
          }
        })
    }
  }
  handleClickOpen = (props, state, pageSize) => {
    this.setState({ open: true, AssignDetailsLoading: true, openedTestId: props })
    pageSize = pageSize || this.state.pageSize
    var path = urls.AssignDetails
    path += `?onlinetest_id=${props}`
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
          open: true,
          mappingCount: res.data.mapping_count
        })
        console.log(res.data, 'data')
      }
    })
      .catch(e => console.log(e))
    // this.setState({ open: true })
  };
  modalShow = (id) => {
    console.log(id)
    this.setState({ deleteTestId: id, showMod: true })
  }

  modalClose = () => {
    this.setState({ showMod: false })
  }

  deleteTest = () => {
    const { deleteTestId } = this.state
    this.setState({ showMod: false })
    axios
      .delete(`${urls.ViewTest}${deleteTestId}/`, {
        headers: {
          Authorization: 'Bearer ' + this.props.user
        }
      })
      .then(res => {
        console.log(this.props)
        this.fetchData({ page: this.state.page, pageSize: this.state.pageSize })
        this.props.alert.success('Test deleted successfully')
      })
      .catch(error => {
        console.log(error)
        this.props.alert.error('Delete failed')
      })
  }

  getTabContent (type) {
    let { expandedRows = {}, queryString = '' } = this.state
    let data = type === 'Normal' ? this.state.onlineTests : this.state.practiceTests || []
    let filteredTestsData = queryString
      ? data.filter(obj => obj.onlinetest_name.includes(queryString))
      : data
    console.log(data)
    return <div style={{ width: '100%' }}>
      <div style={{ padding: '20px' }}>
        <React.Fragment>
          <ReactTable
            manual
            expanded={expandedRows}
            onExpandedChange={(expanded, activeItem) => {
              this.setState({ expandedRows: { [activeItem[0]]: expanded[activeItem[0]] }, expandedAssessmentRows: {} })
            }}
            data={filteredTestsData}
            showPageSizeOptions={false}
            defaultPageSize={5}
            loading={this.state.loading}
            onFetchData={this.fetchData}
            pages={this.state.totalPages}
            SubComponent={this.subComponent}
            columns={[
              {
                Header: 'SL_NO',
                id: 'sln',
                width: 100,
                Cell: row => {
                  let { page, pageSize } = this.state
                  return (pageSize * page + (row.index + 1))
                }
              },
              {
                Header: 'Onlinetest name',
                accessor: 'onlinetest_name'
              },
              {
                Header: 'Start Date',
                id: 'start',
                accessor: 'onlinetest_start_date'
              },
              {
                Header: 'End Date',
                id: 'end',
                accessor: 'onlinetest_end_date'
              },
              {
                id: 'info',
                Header: 'Info',
                accessor: (props) => {
                  return (
                    <div>
                      <React.Fragment> <Button variant='outlined' size='small' color='primary' onClick={() => { console.log(props); this.handleClickOpen(props.onlinetest_id) }}>
                       Mapping Details
                      </Button></React.Fragment>

                    </div>
                  )
                }
              },
              (this.role === 'Admin' || this.role === 'Principal' || this.role === 'ExaminationHead') &&
              {
                Header: 'View Results',
                id: 'result',
                accessor: props => {
                  return (
                    <IconButton
                      onClick={e => this.props.history.push('/questbox/viewTests/result/' + props.onlinetest_id)}
                    >
                      <EventNoteIcon fontSize='small' />
                    </IconButton>
                  )
                }
              },
              (this.role === 'Admin' || this.role === 'ExaminationHead') && {
                id: 'Y',
                Header: 'Actions',
                accessor: props => {
                  return (
                    <div>
                      {(this.role === 'Admin' || this.role === 'ExaminationHead') && <IconButton
                        aria-label='Delete'
                        onClick={(e) => this.modalShow(props.onlinetest_id)}
                      >
                        <DeleteIcon fontSize='small' />
                      </IconButton>}
                    </div>
                  )
                }
              }
            ]}
          />
        </React.Fragment>
      </div>
    </div>
  }

  getUnique = (array, key) => {
    const unique = array.map(elem => elem[key])
    let uniqueObjectKeys = unique.map((elem, index, final) => {
      return final.indexOf(elem) === index && index
    })

    let uniqueObjects = uniqueObjectKeys.filter(elem => array[elem]).map(elem => array[elem])
    return uniqueObjects
  }

  handleGlobalSelectorChange = (data) => {
    if (data.grade_id && data.subject_id) {
      this.setState({ gradeId: data.grade_id, subjectId: data.subject_id })
    } else if (data.grade_id) {
      this.setState({ gradeId: data.grade_id })
    }
  }

  handleClose = () => {
    this.setState({ open: false })
  };

  render () {
    console.log(this.state.branches, 'iui')
    const { assignDetails } = this.state
    const { subjects } = this.props
    const { AssignDetailsLoading } = this.state
    let listSubjects = role === 'Admin' ? subjects : academicProfile
    console.log(listSubjects)
    // let uniqueSubjects = listSubjects ? this.getUnique(listSubjects, 'subject_name') : []

    return (
      <React.Fragment>
        <div >

          <Dialog
            open={this.state.open}
            onClose={this.handleClose}
            aria-labelledby='form-dialog-title'
          >
            <div className='test-container'onScroll={this.scrollHandle}>
              {AssignDetailsLoading ? 'Loading...' : <React.Fragment>

                <DialogContent>
                  <h3>
                    Test mapped to&nbsp;{this.state.mappingCount}&nbsp;
                    {this.state.mappingCount === 0 ? 'No sections' : this.state.mappingCount === 1 ? 'section' : 'sections'}
                  </h3>
                  <TableRow>
                    {/* <TableCell >{this.state.assignDetails && this.state.assignDetails.branch_name}</TableCell> */}
                    <TableCell >{this.state.assignDetails.map((mapping, index) => {
                      return <TableRow>
                        <div className='test-container' onScroll={this.scrollHandle}>
                          <TableCell>{index + 1}</TableCell>
                          <TableCell>{mapping.session_year || '- - -' }</TableCell>
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
                    <Button onClick={this.handleClose} color='primary'>
              Cancel
                    </Button>

                  </DialogActions>
                  : 'NO MAPPING'}
              </React.Fragment>}
            </div>
          </Dialog>

        </div>
        <AppBar style={{ backgroundColor: '#f0f0f0' }} elevation={0} position='static'>
          <Grid container style={{ justifyContent: 'space-between' }}>
            <Grid item>
              <Tabs
                value={this.state.tab}
                onChange={this.handleTabChange}
                indicatorColor='secondary'
                textColor='secondary'
                variant='fullWidth'
              >
                <Tab label='Online Tests' />
                {this.role !== 'Applicant' && <Tab label='Practice Tests' />}
              </Tabs>
            </Grid>
            <Grid item>
              <div style={{ display: 'flex', justifyContent: 'space-around', width: '400px' }}>
                <GSelect variant={'selector'} config={COMBINATIONS} onChange={this.handleGlobalSelectorChange} />
              </div>
            </Grid>
            <Grid item>
              <Button variant='contained'
                color='primary'
                onClick={this.handleGetTests}
                style={{ marginTop: '5px' }}
              >
                Get Tests
              </Button>
            </Grid>
            <Grid item>
              <InputBase onBlur={
                (e) => {
                  this.setState({ queryString: '' })
                  e.target.value = ''
                }
              } onChange={(e) => { this.changeQuery(e) }} placeholder='Search Tests' />
              <IconButton aria-label='Search'>
                <SearchIcon />
              </IconButton>
            </Grid>
          </Grid>
        </AppBar>
        {(this.state.tab === 1)
          ? this.getTabContent('Practice')
          : ''}
        {(this.state.tab === 0)
          ? this.getTabContent('Normal')
          : ''}

        <Modal visible={this.state.showMod} width='400' height='100' effect='fadeInUp' onClickAway={() => this.modalClose()}>
          <segment>
            <div>
              <h4 style={{ textAlign: 'center', marginTop: '5%' }}>Are you sure to delete the selected Assessment ? </h4>
            </div>
          </segment>
          <segment style={{ marginTop: '50px' }}>
            <Button variant='secondary' onClick={this.deleteTest} style={{ backgroundColor: 'green', float: 'left', marginLeft: '20%', color: 'white', marginTop: '2%' }}>
              Yes
            </Button>
            <Button variant='primary' onClick={this.modalClose} style={{ backgroundColor: 'red', float: 'right', marginRight: '20%', color: 'white', marginTop: '2%' }}>
              No
            </Button>
          </segment>
        </Modal>
      </React.Fragment>
    )
  }
}
const personalInfo = localStorage.getItem('user_profile') ? JSON.parse(localStorage.getItem('user_profile')).personal_info : undefined
const academicProfile = localStorage.getItem('user_profile') ? JSON.parse(localStorage.getItem('user_profile')).academic_profile : undefined
const role = personalInfo ? personalInfo.role : undefined
const mapStateToProps = state => ({
  user: state.authentication.user,
  listTests: state.listTests.items,
  selectedTestData: state.onlineTest.items,
  grades: state.gradeMap.items,
  branches: state.branches.items,
  subjects: state.subjects.items,
  completeState: state
})

const mapDispatchToProps = dispatch => ({
  getAllTests: () => dispatch(apiActions.listTests()),
  getOnlineTest: testId => dispatch(apiActions.getOnlineTest(testId)),
  getSubjects: () => dispatch(apiActions.listSubjects())
})

export default withStyles(styles)(connect(mapStateToProps, mapDispatchToProps)(withRouter(ViewTestsWithFilter)))
