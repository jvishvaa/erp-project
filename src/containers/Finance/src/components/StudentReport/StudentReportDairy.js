import React, { Component } from 'react'
import axios from 'axios'
import moment from 'moment'
import { Grid, CardHeader } from 'semantic-ui-react'
import Button from '@material-ui/core/Button'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import Typography from '@material-ui/core/Typography'
import CardContent from '@material-ui/core/CardContent'
import Card from '@material-ui/core/Card'
import '../css/staff.css'
import { urls } from '../../urls'
import { apiActions } from '../../_actions'
import { Modal } from '../../ui'
import FileUpload from './fileUpload'

/**
 * @class StudentReportDairy
 */

class StudentReportDairy extends Component {
  /**
     * @constructs StudentReportDairy
     * @description Asigning value to state property
     * @param  {[type]} props thing representing  some data
     */

  constructor (props) {
    super(props)
    this.state = {
      page: 1,
      date: moment().format('YYYY-MM-DD'),
      studentReport: [],
      fileModal: false,
      teacherReportId: null
    }
    this.userProfile = JSON.parse(localStorage.getItem('user_profile'))
    this.updateDate = this.updateDate.bind(this)
    this.handleChange = this.handleChange.bind(this)
    this.updateWindowDimensions = this.updateWindowDimensions.bind(this)
  }

  componentDidMount () {
    let branch = this.userProfile.branch_id
    let section = this.userProfile.section_id
    let grade = this.userProfile.grade_id
    let subjects = this.userProfile.subjects
    let branchName = this.userProfile.branch_name
    let sectionName = this.userProfile.section_name
    let gradeName = this.userProfile.grade_name
    let sectionMapId = this.userProfile.section_mapping_id

    let subjectData = subjects.map((v) => (
      { value: v.subject_id, label: v.subject_name }
    ))
    let subjectId = subjects.map((item) => (
      item.subject_id
    ))

    this.setState({
      branch, section, subjectId, grade, subjectData, branchName, gradeName, sectionName, sectionMapId
    }, () => this.getStudentReportData())

    window.addEventListener('scroll', this.updateWindowDimensions)
  }

  componentWillUnmount () {
    window.removeEventListener('scroll', this.updateWindowDimensions)
  }

  updateWindowDimensions () {
    let { page, totalPage } = this.state
    const el = document.getElementById('scroll')
    if (el && el.getBoundingClientRect().bottom <= window.innerHeight && page <= totalPage) {
      this.getStudentReportData()
    }
  }

  /**
   * @param  {} e
   */
  handleChange = (e) => {
    let date = moment(e.target.value).format('YYYY-MM-DD')
    this.setState({ studentReport: [], page: 1, date }, () => this.getStudentReportData())
  }

  /**
  * @param  {} difference
  */
  updateDate = (difference) => {
    let { date } = this.state
    let dateUpdated = moment(date).add(difference, 'day').format('YYYY-MM-DD')
    this.setState({ studentReport: [], page: 1, date: dateUpdated }, () => this.getStudentReportData())
  }

  getStudentReportData () {
    let { sectionMapId, subjectId, page, date, studentReport } = this.state
    let params = {
      // branch_id: branch,
      // grade_id: grade,
      // section_id: section,
      section_mapping_id: sectionMapId,
      subject_ids: JSON.stringify(subjectId),
      from_date: date,
      to_date: date,
      page_number: page,
      page_size: 5
    }
    axios
      .get(urls.ReportV2, {
        params: params,
        headers: {
          Authorization: 'Bearer ' + this.props.user,
          'Content-Type': 'application/json'
        }
      })
      .then(res => {
        this.setState({
          studentReport: [...studentReport, ...res.data.reports],
          totalPage: res.data.total_pages,
          page: page + 1
        })
      })
  }

  handleFileModalOpen = (id) => {
    this.setState({
      fileModal: true,
      teacherReportId: id
    })
  }

  handleFileModalClose = () => {
    this.setState({
      fileModal: false
    })
  }

  render () {
    let { subjectData, studentReport = [] } = this.state

    let fileModal = null
    if (this.state.fileModal) {
      fileModal = (
        <Modal
          open={this.state.fileModal}
          click={this.handleFileModalClose}
        >
          <FileUpload
            teacherReportId={this.state.teacherReportId}
            onClose={this.handleFileModalClose}
            alert={this.props.alert}
            isMobile
          />
        </Modal>

      )
    }

    return (
      <React.Fragment>
        <Grid.Row>
          <Button
            style={{ marginLeft: '10px', position: 'absolute', marginTop: '10px' }}
            variant='contained'
            color='primary'
            onClick={() => this.updateDate(-1)}
          >
            Prev<br />
            Date
          </Button>
          <input style={{ marginLeft: '90px', width: '128px', marginTop: '30px' }}
            onChange={this.handleChange}
            value={this.state.date}
            type='date'
            name='startingDate'
            id='startingDate'
          />
          <Button
            style={{ marginLeft: '15px', position: 'absolute', marginTop: '10px' }}
            onClick={() => this.updateDate(1)}
            variant='contained'
            color='primary'
          >
            Next<br />
            Date
          </Button>
        </Grid.Row>

        {studentReport.length > 0 ? <Grid style={{ marginTop: '30px' }} >
          <Grid.Row id='scroll'>
            {studentReport.map(item => (
              <Card style={{ width: '285px', height: '400px', marginLeft: '20px', marginTop: '20px', overflow: 'scroll' }}>
                <CardHeader style={{ backgroundColor: '#f8f8ff', fontWeight: 'bold', paddingLeft: '10px', paddingTop: '10px' }}>
                  {subjectData.map(data => {
                    if (data.value === item.subjectmapping.subject) { return data.label.toUpperCase() }
                  })}
                </CardHeader>
                <CardContent style={{ top: '50px' }}>
                  <Typography>
                    CLASSWORK<br /> <hr />
                    {item.classswork}
                  </Typography>
                </CardContent>
                <CardContent style={{ top: '50px' }}>
                  <Typography>
                    HOMEWORK<br /> <hr />
                    {item.homework}
                  </Typography>
                </CardContent>
                <CardContent style={{ top: '50px' }}>
                  <Typography>
                    MEDIA<br /> <hr />{
                      item.media.length > 0 && item.media.map((file, index) => <Button variant='contained' target={'blank'} href={file.media_file}>File {index + 1}</Button>)}
                  </Typography>
                </CardContent>
                <CardContent>
                  <Button
                    color='primary'
                    variant='contained'
                    disabled={item.homework_submitted}
                    onClick={() => this.handleFileModalOpen(item.id)}
                  >
                    Upload Work
                  </Button>
                </CardContent>
              </Card>
            ))}
          </Grid.Row>
        </Grid> : <h4 style={{ display: 'flex', justifyContent: 'center', marginTop: '90px' }}>No Data </h4>}

        {fileModal}
      </React.Fragment>
    )
  }
}

const mapStateToProps = state => ({
  user: state.authentication.user,
  subjects: state.subjects.items
})

const mapDispatchToProps = dispatch => ({
  listSubjects: () => dispatch(apiActions.listSubjects())
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(StudentReportDairy))
