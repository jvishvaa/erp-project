import React, { Component } from 'react'
// import Modal from 'react-awesome-modal'
import { withStyles, Button, Card, CardContent, Typography } from '@material-ui/core'
import { withRouter } from 'react-router-dom'
import IconButton from '@material-ui/core/IconButton/IconButton'
import DeleteIcon from '@material-ui/icons/DeleteOutlined'
import EditIcon from '@material-ui/icons/Edit'
import Link from '@material-ui/core/Link'
import axios from 'axios'
import TextField from '@material-ui/core/TextField'
import Grid from '@material-ui/core/Grid'
import Modal from '@material-ui/core/Modal'
import Backdrop from '@material-ui/core/Backdrop'
import Fade from '@material-ui/core/Fade'
import ReactTable from 'react-table'
import { connect } from 'react-redux'
import Dropzone from 'react-dropzone'
import SearchIcon from '@material-ui/icons/Search'
// import { debounce } from 'throttle-debounce'
import _ from 'lodash'
import Input from '@material-ui/core/InputBase'
import ReactHtmlParser from 'react-html-parser'
import '../../css/staff.css'
import { urls, qBUrls } from '../../../urls'
import { OmsSelect, Toolbar } from '../../../ui'
import { apiActions } from '../../../_actions'
import { COMBINATIONS } from '../config/questioPaperConfig'
import GSelect from '../../../_components/globalselector'

const styles = theme => ({
  tableWrapper: {
    overflowX: 'auto'
  },
  modal: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  paper: {
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
    width: '90%',
    height: '90%'
  },
  editFields: {
    '& .MuiTextField-root': {
      margin: theme.spacing(1),
      width: '25ch'
    }
  },
  root: {
    flexGrow: 1
  },
  grow: {
    flexGrow: 1
  },
  menuButton: {
    marginLeft: -12,
    marginRight: 20
  }

})

class ViewQuestionPaper extends Component {
  constructor (props) {
    super(props)
    this.props = props
    this.state = {
      subjectData: null,
      questionPaperSubTypes: [],
      visible: false,
      files: {},
      gradeArr: [],
      grades: [],
      isGradeDisabled: false,
      searchTerm: '',
      modalOpen: false
    }
    this.userProfile = JSON.parse(localStorage.getItem('user_profile'))
    this.role = JSON.parse(localStorage.getItem('user_profile')).personal_info.role
    this.mappindDetails = this.userProfile.academic_profile
    this.userId = JSON.parse(localStorage.getItem('user_profile')).personal_info.user_id
    // this.handleSubject = this.handleSubject.bind(this)
    // this.handleGrade = this.handleGrade.bind(this)
    this.onDrop = this.onDrop.bind(this)
    this.deleteQuestionPaper = this.deleteQuestionPaper.bind(this)
    this.delayedCallback = _.debounce(() => {
      this.handleClick()
    }, 2000)
  }

  deleteQuestionPaper= (tempId) => {
    console.log(this.state.tempId, 'delete assess')
    axios
      .delete(qBUrls.QuestionPaper_v2 + '?ques_paper_id=' + tempId, {
        headers: {
          Authorization: 'Bearer ' + this.props.user
        }
      })
      .then(res => {
        console.log(res, 'result delete')
        this.props.alert.success('QuestionPaper deleted successfully')
        this.handleClick()
      })
      .catch(error => {
        console.log(error.response)
        this.props.alert.error('Something went wrong, please try again')
      })
  }
  editQuestionPaper = (id, defaultname, defaultinstruction, defaultdescription, defaultduration) => {
    console.log(defaultname)
    this.props.alert.success('Updated')
    let { questionPaperName, questionPaperNameError, questionPaperInstruction, questionPaperInstructionError, questionPaperDescription, questionPaperDescriptionError, questionPaperDuration, questionPaperDurationError } = this.state
    console.log(questionPaperNameError, questionPaperInstructionError, questionPaperDescriptionError, questionPaperDurationError, 'lp')
    if (questionPaperNameError && questionPaperInstructionError && questionPaperDescriptionError && questionPaperDurationError) {
      let formData = new FormData()

      formData.set('question_paper_id', id)
      formData.set('question_paper_name', questionPaperName !== undefined ? questionPaperName : defaultname)
      formData.set('description', questionPaperInstruction !== undefined ? questionPaperInstruction : defaultinstruction)
      formData.set('instruction', questionPaperDescription !== undefined ? questionPaperDescription : defaultdescription)
      formData.set('duration', questionPaperDuration !== undefined ? questionPaperDuration : defaultduration)
      axios
        .put(`${urls.EditQuestionPaper}`, formData, {
          headers: {
            Authorization: 'Bearer ' + this.props.user,
            'Content-Type': 'application/json'
          }
        })
        .then(res => {
          console.log(res)
          if (res.data && res.data.status) {
            this.props.alert.success('Updated')
          }
        // this.props.alert.success(res.data)
        })
        .catch(error => {
          let { response: { data: { status } = {} } = {}, message } = error
          if (!status && message) {
            this.props.alert.error(JSON.stringify(message))
          } else {
            this.props.alert.error(JSON.stringify(status))
          }
        })
    } else {
      this.props.alert.warning('Please Fill all the Fields')
    }
  }
  convertMinsToHrsMins (mins) {
    let h = Math.floor(mins / 60)
    let m = mins % 60
    h = h < 10 ? '0' + h : h
    m = m < 10 ? '0' + m : m
    return `${h}:${m}`
  }
  handleOpen = (id) => {
    this.setState({ modalOpen: true, Id: id, allSubmit: false, questionPaperNameError: true, questionPaperInstructionError: true, questionPaperDescriptionError: true, questionPaperDurationError: true })
  }
  handleClose = () => {
    this.setState({ modalOpen: false })
  }
  handleName = (e) => {
    this.setState({ questionPaperName: e.target.value, questionPaperNameError: true })
    if (e.target.value === '') {
      console.log('ren')
      this.setState({ questionPaperNameError: false })
    }
  }
  handleInstruction = (e) => {
    this.setState({ questionPaperInstruction: e.target.value, questionPaperInstructionError: true })
    if (e.target.value === '') {
      this.setState({ questionPaperInstructionError: false })
    }
  }
  handleDescription = (e) => {
    this.setState({ questionPaperDescription: e.target.value, questionPaperDescriptionError: true })
    if (e.target.value === '') {
      this.setState({ questionPaperDescriptionError: false })
    }
  }
  handleDuration = (e) => {
    let duration = this.convertMinsToHrsMins(parseInt(e.target.value))
    this.setState({ questionPaperDuration: duration, questionPaperDurationError: true })
    if (e.target.value === '') {
      this.setState({ questionPaperDurationError: false })
    }
  }
  timeConvert = (num) => {
    let hours = Math.floor(num / 60)
    let minutes = num % 60
    return hours + ':' + minutes
  }
  isNumberKey (evt) {
    var charCode = (evt.which) ? evt.which : evt.keyCode
    return !(charCode > 31 && (charCode < 48 || charCode > 57))
  }
  getUnique = (array = [], key) => {
    // // eslint-disable-next-line no-debugger
    // debugger
    const ids = []
    const map = new Map()
    for (const item of array) {
      if (!map.has(item[key])) {
        map.set(item[key], true)
        ids.push(item[key])
      }
    }
    return ids
  }

  handleQuestionPaperType = ({ value }) => {
    this.setState({ questionPaperType: value, questionPaperSubTypes: [] })
    axios.get(urls.QuestionPaperSubType + '?qp_id=' + value, {
      headers: {
        Authorization: 'Bearer ' + this.props.user
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

  componentDidMount () {
    if (this.role === 'Admin') {
      this.handleClick()
    }

    axios
      .get(urls.QuestionPaperType, {
        headers: {
          Authorization: 'Bearer ' + this.props.user
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

    this.props.listGrades()
  }

  highLightQuery = (data) => {
    let { searchTerm = '' } = this.state
    if (data && (typeof (data) === 'string') && (searchTerm.trim() !== '')) {
      let regEx = new RegExp(searchTerm, 'gi')
      let highlightedText = data.replace(regEx, `<span style='background-color: yellow'>${searchTerm}</span>`)
      return highlightedText
    }
    return data
  }

  handleClick = (state = { page: 0, pageSize: 5 }, instance) => {
    let { gradeArr = [], valueQuestionPaperSubType = [], selectedSubject = [], questionPaperType, searchTerm } = this.state
    // }
    let path
    if (searchTerm) {
      path = `${urls.SearchQuestionPapers}?q=${searchTerm}&page_no=${state.page + 1}&page_size=${state.pageSize}`
    } else {
      path = `${qBUrls.ListQuestionPaper}?grade_ids=[${gradeArr}]&subject_ids=[${selectedSubject}]&subtype_ids=[${valueQuestionPaperSubType}]&page_number=${state.page + 1}&page_size=${state.pageSize}&type_ids=[${questionPaperType || ''}]`
    }
    this.setState({ loading: true })
    axios
      .get(path, {
        headers: {
          Authorization: 'Bearer ' + this.props.user
        }
      })
      .then(res => {
        console.log('filter', res)
        let results = searchTerm ? res.data.results : res.data.data
        if (results) {
          if (searchTerm) {
            this.setState({ data: results, totalPages: res.data.total_pages, page: state.page, pageSize: state.pageSize, loading: false })
          } else {
            this.setState({ data: results, totalPages: res.data.total_page_count, page: state.page, pageSize: state.pageSize, loading: false })
          }
        }
      })
      .catch(error => {
        console.log(error)
        this.setState({ loading: false })
      })
  }
  subComponent = ({ original, row }) => {
    let obj = original
    return <div>
      <ul>
        {Object.keys(obj).map(key => {
          if (typeof (obj[key]) === 'string') { return <li>{key}:{obj[key]}</li> }
        })}
      </ul>
    </div>
  }

  onDrop (files, id) {
    let filedata = this.state.files
    filedata[id] = files[0].name
    this.setState({ files: filedata })
    let formData = new FormData()
    formData.append('qp_id', id)
    formData.append('file', files[0])
    axios
      .post(urls.QPUpload, formData, {
        headers: {
          Authorization: 'Bearer ' + this.props.user,
          'Content-Type': 'multipart/formData'
        }
      })
      .then((res) => {
        if (res.status === 200) {
          this.props.alert.success('Question paper uploaded successfully')
        } else {
          this.props.alert.error('Something went wrong')
        }
      })
      .catch((error) => {
        console.log(error)
        this.props.alert.error('Something went wrong')
      })
  }

  showNoMappings = () => {
    return true
  }

  onChange = (data) => {
    console.log(data)
    const gradeArr = []
    const subjectArr = []
    if (this.role !== 'Subjecthead') {
      if (data.grade_id && data.subject_id) {
        let res = data.subject_id.split(',')
        res.forEach(curr => {
          subjectArr.push(Number(curr))
        })
        this.setState({ selectedSubject: subjectArr })
      } else if (data.grade_id) {
        gradeArr.push(data.grade_id)
        this.setState({ gradeArr, selectedSubject: [] })
      }
    } else {
      if (data.grade_id && data.subject_id) {
        let res = data.grade_id
        this.setState({ gradeArr: res })
      } else if (data.subject_id) {
        subjectArr.push(data.subject_id)
        this.setState({ gradeArr, selectedSubject: subjectArr })
      }
    }
  }

  // getSearchedResults = async (searchTerm) => {
  //   let result = await axios.get(`${urls.SearchQuestionPapers}?search=${searchTerm}`, {
  //     headers: {
  //       Authorization: 'Bearer ' + this.props.user
  //     }
  //   })
  //   return result
  // }

  handleSearch = (e) => {
    e.persist()
    this.delayedCallback()
  }

  render () {
    const { classes } = this.props
    let { files } = this.state
    console.log(this.state.grades)
    return (
      <React.Fragment>
        <div>
          <Toolbar>
            <GSelect variant={'selector'} onChange={this.onChange} config={COMBINATIONS} />
            <OmsSelect placeholder='paper type' search selection options={this.state.questionPaperTypes} change={this.handleQuestionPaperType} />
            {
              this.state.questionPaperSubTypes.length
                ? <OmsSelect isMulti disabled={this.state.questionPaperSubTypes.length === 0} placeholder='paper subtype' search selection options={this.state.questionPaperSubTypes} change={(e) => { this.setState({ valueQuestionPaperSubType: e }) }} /> : null
            }
            <Button
              variant='contained'
              color='primary'
              onClick={e => {
                this.setState({ pageNo: 0, searchTerm: '' }, () => {
                  this.handleClick()
                })
              }}
            >
                  Apply filter
            </Button>
            <div style={{ position: 'absolute', borderRadius: '20px', backgroundColor: 'rgb(226, 226, 226)', width: 200, right: 5, bottom: 5 }}>
              <div style={{ position: 'absolute', marginLeft: '20px', top: '3px', color: 'white' }}>
                <SearchIcon style={{ color: 'rgba(0,0,0,0.7)' }} />
              </div>
              <div style={{ marginLeft: '60px' }}>
                <Input
                  type='search'
                  value={this.state.searchTerm}
                  placeholder='Search…'
                  onChange={(e) => {
                    this.setState({ searchTerm: e.target.value }, () => {
                      this.handleSearch(e)
                    })
                  }}
                  // value={this.state.searchValue}
                  style={{ color: '#000' }}
                />
              </div>
            </div>
          </Toolbar>
          <div className={classes.tableWrapper} style={{ overflowX: 'auto' }}>
            <ReactTable
              manual
              data={this.state.data}
              defaultPageSize={5}
              loading={this.state.loading}
              page={this.state.pageNo}
              showPageSizeOptions
              // onPageChange={(page) => {
              //   this.setState({ pageNo: page })
              //   this.handleClick({ page, pageSize: !this.state.pageSize ? 5 : this.state.pageSize })
              // }}
              onFetchData={this.handleClick}
              pages={this.state.totalPages}
              SubComponent={this.subComponent}
              columns={[
                {
                  Header: 'SL_NO',
                  id: 'sln',
                  width: 50,
                  Cell: row => {
                    let { page, pageSize } = this.state
                    return (pageSize * page + (row.index + 1))
                  }
                },
                {
                  Header: 'Question Paper Name',
                  // accessor: 'question_paper_name'
                  minWidth: 400,
                  Cell: ({ original }) => {
                    return ReactHtmlParser(this.highLightQuery(original.question_paper_name))
                  }
                },
                {
                  Header: 'Subject',
                  id: 'sub',
                  accessor: props => (props.subject.subject_name)
                },
                {
                  Header: 'Grade',
                  accessor: props => (props.grade.grade),
                  id: 'grade'
                },
                {
                  id: 'view',
                  Header: 'View Paper',
                  accessor: props => {
                    return (
                      <Link
                        onClick={() => { this.props.history.push(`/questbox/view_questionPaper_detail/${props.id}`) }}
                      >click here to view paper</Link>
                    )
                  }
                },
                {
                  id: 'upload',
                  Header: 'Upload Question Paper',
                  className: 'view-question-paper',
                  accessor: d => {
                    return (
                      <React.Fragment style={{ height: '100px !important' }}>
                        {d.question_paper_pdf.includes('no-img.jpg')
                          ? ''
                          : <a href={d.question_paper_pdf}>
                                View Uploaded QP
                          </a>
                        }
                        <Dropzone onDrop={e => this.onDrop(e, d.id)}
                          accept='.pdf'
                        >
                          {({
                            getRootProps,
                            getInputProps,
                            isDragActive,
                            isDragAccept,
                            isDragReject
                          }) => (
                            <Card
                              elevation={0}
                              style={{
                                border: '1px solid black',
                                borderStyle: 'dotted'
                              }}
                              {...getRootProps()}
                              className='dropzone'
                            >
                              <CardContent>
                                <input {...getInputProps()} />
                                <div>
                                  {isDragAccept && 'All files will be accepted'}
                                  {isDragReject && 'Some files will be rejected'}
                                  {!isDragActive && 'Upload Question Paper(./pdf)'}
                                </div>
                                {files[d.id]}
                              </CardContent>
                            </Card>
                          )}
                        </Dropzone>
                      </React.Fragment>
                    )
                  }
                },
                {
                  id: 'Y',
                  Header: 'Actions',
                  accessor: props => {
                    return (
                      <React.Fragment>
                        <div>
                          <IconButton
                            disabled={this.userId !== props.user.id && this.role !== ('Teacher' && 'Admin')}
                            aria-label='Delete'
                            onClick={() => this.deleteQuestionPaper(props.id)}
                            className={classes.margin}
                          >
                            <DeleteIcon fontSize='small' />
                          </IconButton>
                          <IconButton
                            disabled={(this.userId !== props.user.id) && (this.role !== 'Admin')}
                            aria-label='Edit'
                            key={props.id}
                            id={props.id}
                            onClick={() => this.handleOpen(props.id)}
                            className={classes.margin}
                          >
                            <EditIcon fontSize='small' />
                          </IconButton>
                          {props.id === this.state.Id &&
                          <Modal
                            id={props.id}
                            key={props.id}
                            aria-labelledby='transition-modal-title'
                            aria-describedby='transition-modal-description'
                            className={classes.modal}
                            open={this.state.modalOpen}
                            onClose={this.handleClose}
                            closeAfterTransition
                            BackdropComponent={Backdrop}
                            BackdropProps={{
                              timeout: 500
                            }}
                          >
                            <Fade in={this.state.modalOpen}>
                              <div className={classes.paper}>
                                <div style={{ width: '100%',
                                  height: '10%',
                                  backgroundColor: '#821057',
                                  overflow: 'auto',
                                  boxShadow: '0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24)' }}>
                                  <Typography style={{ color: 'white',
                                    paddingTop: '15px' }} variant='h5' align='center'>Edit Question Paper</Typography>
                                </div>
                                <div style={{ padding: '2%' }}className={classes.editFields}>
                                  <Grid style={{ display: 'inline-block' }} container spacing={2}>
                                    <Grid item xs={6} sm={3}>
                                      <TextField
                                        required
                                        id={props.id}
                                        key={props.id}
                                        label='Question Paper Name'
                                        defaultValue={props.question_paper_name}
                                        variant='outlined'
                                        onChange={(e) => { this.handleName(e) }}
                                      />
                                    </Grid>
                                    <Grid item xs={6} sm={3}>
                                      <TextField
                                        required
                                        id={props.id}
                                        key={props.id}
                                        type='Number'
                                        label='Duration (in mins)'
                                        defaultValue={props.duration}
                                        variant='outlined'
                                        onChange={(e) => { this.handleDuration(e) }}
                                      />
                                    </Grid>
                                    <Grid item xs={6} sm={3}>
                                      <TextField
                                        required
                                        id={props.id}
                                        key={props.id}
                                        label='Instructions'
                                        multiline
                                        rows={4}
                                        defaultValue={props.instruction}
                                        variant='outlined'
                                        onChange={(e) => { this.handleInstruction(e) }}
                                      />
                                    </Grid>
                                    <Grid item xs={6} sm={3}>
                                      <TextField
                                        required
                                        id={props.id}
                                        key={props.id}
                                        label='Description'
                                        multiline
                                        rows={4}
                                        defaultValue={props.description}
                                        variant='outlined'
                                        onChange={(e) => { this.handleDescription(e) }}
                                      />
                                    </Grid>
                                    <Grid item xs={6} sm={3}>
                                      <Button id={props.id}
                                        key={props.id} variant='contained' color='primary' onClick={(e) => this.editQuestionPaper(props.id, props.question_paper_name, props.instruction, props.description, props.duration)}>Update</Button>

                                      <Button id={props.id}
                                        key={props.id} style={{ float: 'right' }}variant='contained' color='primary' onClick={(e) => this.handleClose()}>Cancel</Button>
                                    </Grid>
                                  </Grid>
                                </div>
                              </div>
                            </Fade>
                          </Modal>
                          }
                        </div>
                      </React.Fragment>
                    )
                  }
                }
              ]}
            />
          </div>
          {/* </Table> */}
          {/* Edit Question paper */}
          {/* Edit Question paper */}
        </div>
      </React.Fragment>
    )
  }
}

const mapStateToProps = state => ({
  subjects: state.subjects.items,
  grades: state.grades.items,
  user: state.authentication.user
})

const mapDispatchToProps = dispatch => ({
  listGrades: () => dispatch(apiActions.listGrades()),
  gradeMapBranch: branchId => dispatch(apiActions.getGradeMapping(branchId)),
  sectionMap: gradeMapId => dispatch(apiActions.getSectionMapping(gradeMapId)),
  listBranches: dispatch(apiActions.listBranches()),
  listSubjects: dispatch(apiActions.listSubjects())
})

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(withRouter(ViewQuestionPaper)))
