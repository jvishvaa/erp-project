import React, { Component } from 'react'
import axios from 'axios'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { withStyles, Button, Modal, Typography } from '@material-ui/core'
import PrintIcon from '@material-ui/icons/PrintOutlined'
import VisibilityIcon from '@material-ui/icons/VisibilityOutlined'
import QuestionAnswerIcon from '@material-ui/icons/QuestionAnswerOutlined'
import InfoIcon from '@material-ui/icons/InfoOutlined'
import ReactTable from 'react-table'
import { urls } from '../../urls'
import EnglishReport from './english'
import MathReport from './maths'

function getModalStyle () {
  return {
    transform: `translate(10%, 10%)`,
    overflowY: 'auto',
    position: 'absolute',
    height: '600px'
  }
}

const styles = theme => ({
  paper: {
    position: 'absolute',
    width: '80%',
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[5],
    padding: theme.spacing.unit * 4,
    outline: 'none',
    marginLeft: 'auto',
    marginRight: 'auto'
  }
})

class Report extends Component {
  constructor (props) {
    super(props)
    this.state = { showModal: false, flag: true }
    this.userProfile = JSON.parse(localStorage.getItem('user_profile'))
    this.handleAssessment = this.handleAssessment.bind(this)
    this.handleDownload = this.handleDownload.bind(this)
    this.getAssessmentData = this.getAssessmentData.bind(this)
  }

  componentDidMount () {
    this.getAssessmentData(1)
    this.setState({ flag: false })
    axios
      .get(urls.StudentAssessment, {
        headers: {
          Authorization: 'Bearer ' + this.props.user
        }
      }).then(res => {
        this.setState({ assessmentStatus: res.data })
      }).catch(error => {
        console.log(error)
        this.setState({ assessmentStatus: [] })
      })
  }

  handleClose = () => {
    this.setState({ showModal: false })
  }

  getAssessmentData (page) {
    if (this.state.flag) {
      axios
        .get(urls.CreateAssessmentV2 +
        '?branch_id=' + this.userProfile.branch_id + '&page=' + page +
          '&grade_id=' + this.userProfile.grade_id + '&section_id=' +
            this.userProfile.section_id, {
          headers: {
            Authorization: 'Bearer ' + this.props.user
          }
        })
        .then(res => {
          this.setState({ assessmentData: res.data })
        })
        .catch(error => {
          console.log(error)
        })
    } else {
      this.setState({ flag: true })
    }
  }

  handleAssessment = (assessmentId, subjectName) => {
    this.setState({
      subject: subjectName,
      assData: null
    })
    axios
      .get(urls.WeeklyTestReport + '?ass_id=' + assessmentId, {
        headers: {
          Authorization: 'Bearer ' + this.props.user
        }
      })
      .then(res => {
        this.setState({ showModal: true, assData: res.data })
      })
      .catch(error => {
        console.log(error)
        if (error.response &&
              (error.response.status === 400 || error.response.status === 404)) {
          this.props.alert.error('No data found')
        }
      })
  }

  handleDownload (assessmentId, subjectId, subjectName) {
    axios
      .get(urls.WeeklyTestReportPdf + '?ass_id=' + assessmentId +
        '&sub_id=' + subjectId, {
        headers: {
          Authorization: 'Bearer ' + this.props.user
        },
        responseType: 'blob'
      }).then((response) => {
        const url = window.URL.createObjectURL(new Blob([response.data]))
        const link = document.createElement('a')
        let name = subjectName + 'Report.pdf'
        link.href = url
        link.setAttribute('download', name) // or any other extension
        document.body.appendChild(link)
        link.click()
      }).catch((error) => {
        console.log(error)
        if (error.response && error.response.status === 404) {
          this.props.alert.error('No data found')
        }
      })
  }

  handleDownloadRemidial (assessmentId, subjectName) {
    axios
      .get(urls.GetRemidialQuestionPaper + '?ass_id=' + assessmentId, {
        headers: {
          Authorization: 'Bearer ' + this.props.user
        },
        responseType: 'blob'
      }).then((response) => {
        const url = window.URL.createObjectURL(new Blob([response.data]))
        const link = document.createElement('a')
        let name = subjectName + 'Report.pdf'
        link.href = url
        link.setAttribute('download', name) // or any other extension
        document.body.appendChild(link)
        link.click()
      }).catch((error) => {
        console.log(error)
        if (error.response && error.response.status === 404) {
          this.props.alert.error('No data found')
        } else if (error.response && error.response.status === 400) {
          this.props.alert.error('student has no remedial questions')
        }
      })
  }

  handleExpand (row) {
    let currentAssessment = this.state.assessmentStatus
      .filter(us => { return us.assessment.id === row.original.id })
    if (currentAssessment.length > 0 && currentAssessment[0].is_attempted_assessment) {
      return (
        <React.Fragment>
          <div style={{ display: 'inline', marginLeft: '5%' }}>
            <Button
              aria-label='Print'
              onClick={e => this.handleDownload(
                row.original.id,
                row.original.question_paper.subject.id,
                row.original.question_paper.subject.subject_name
              )}
            >
              <PrintIcon fontSize='small' />
            Download Report
            </Button>
            <Button
              aria-label='Print'
              onClick={e => this.handleAssessment(
                row.original.id,
                row.original.question_paper.subject.subject_name
              )}
            >
              <VisibilityIcon fontSize='small' />
            View Report
            </Button>
            {!row.original.question_paper.question_paper_pdf.includes('no-img.jpg')
              ? <Button
                aria-label='Print'
                href={row.original.question_paper.question_paper_pdf}
                download
              >
                <QuestionAnswerIcon fontSize='small' />
              Download Question Paper
              </Button>
              : ''
            }
            {currentAssessment.remedial_questions
              ? <Button
                aria-label='Print'
                onClick={e => this.handleDownloadRemidial(
                  row.original.id,
                  row.original.question_paper.subject.subject_name
                )}
              >
                <InfoIcon fontSize='small' />
              Remidial Questions
              </Button>
              : ''}
          </div>
        </React.Fragment>
      )
    } else {
      return <Typography variant='body1' style={{ marginLeft: '5%' }}>
        Assessment not attempted yet
      </Typography>
    }
  }

  render () {
    let { assessmentData, assData, subject, showModal } = this.state
    const { classes } = this.props
    return (
      <React.Fragment>
        {assessmentData &&
        <ReactTable
          manual
          data={assessmentData.results}
          columns={[
            {
              Header: 'Assessment Name',
              accessor: 'name_assessment'
            },
            {
              Header: 'Assessment Type',
              accessor: 'assessment_type'
            },
            {
              Header: 'Subject',
              accessor: d => d.question_paper.subject.subject_name,
              id: 'subject'
            }
          ]}
          showPagination
          showPageSizeOptions={false}
          defaultPageSize={5}
          className='-striped -highlight'
          pages={assessmentData.total_pages}
          onFetchData={e => this.getAssessmentData(e.page + 1)}
          SubComponent={row => this.handleExpand(row)}
        />
        }
        <Modal
          open={showModal}
          onClose={this.handleClose}
        >
          <div
            style={getModalStyle()}
            className={classes.paper}
          >
            {assData && subject === 'English' ? <EnglishReport assData={assData} /> : ''}
            {assData && subject === 'Maths' ? <MathReport assData={assData} /> : ''}
          </div>
        </Modal>
      </React.Fragment>
    )
  }
}

const mapStateToProps = state => ({
  user: state.authentication.user
})

const mapDispatchToProps = dispatch => ({
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(withRouter(Report)))
