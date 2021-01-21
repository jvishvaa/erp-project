import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import axios from 'axios'
import { withStyles, Grid } from '@material-ui/core'

import { Report, ReportOff, Link, BlurCircular, ListAlt, Message } from '@material-ui/icons'
import { InternalPageStatus } from '../../ui'
import { urls } from '../../urls'
import '../css/staff.css'

const styles = ({
  parentDiv: {
    display: 'flex'
  },
  childDiv: {
    textAlign: 'center',
    flexBasis: '20vw',
    margin: 5
  },
  childContent: {
    textAlign: 'center',
    position: 'relative',
    padding: '30px',
    maxHeight: '350px !important',
    overflow: 'auto'
  },
  AnchorStyle: {
    color: 'blue',
    borderBottom: '1px solid blue'
  },
  flexContainer: {
    display: 'flex',
    padding: 10,
    justifyContent: 'center',
    flexDirection: 'row'
  }
})
class ExcelReport extends Component {
  constructor () {
    super()
    this.state = {
      disable: true,
      check: false,
      startTR: 0,
      endTR: 10,
      startTRNU: 0,
      endTRNU: 10,
      startTSSM: 0,
      endTSSM: 10,
      startC: 0,
      endC: 10,
      startGD: 0,
      endGD: 10,
      startG: 0,
      endG: 10,
      loading: false
    }
    this.userProfile = JSON.parse(localStorage.getItem('user_profile'))
  }

  componentDidMount () {
    this.role = this.userProfile.personal_info.role
    if (this.role === 'Principal') {
      this.setState({ loading: true })
      Promise.all([
        axios.get(`${urls.PRINCIPALREPORTS + '?start=' + this.state.startTR + '&end=' + this.state.endTR + '&type=' + 'TeacherReport'}`, {
          headers: {
            Authorization: 'Bearer ' + this.props.user,
            'Content-Type': 'application/json'
          }
        }),
        axios.get(`${urls.PRINCIPALREPORTS + '?start=' + this.state.startTRNU + '&end=' + this.state.endTRNU + '&type=' + 'TRNonUpdated'}`, {
          headers: {
            Authorization: 'Bearer ' + this.props.user,
            'Content-Type': 'application/json'
          }
        }),
        axios.get(`${urls.PRINCIPALREPORTS + '?start=' + this.state.startTSSM + '&end=' + this.state.endTSSM + '&type=' + 'TSubjectSectionMap'}`, {
          headers: {
            Authorization: 'Bearer ' + this.props.user,
            'Content-Type': 'application/json'
          }
        }),
        axios.get(`${urls.PRINCIPALREPORTS + '?start=' + this.state.startC + '&end=' + this.state.endC + '&type=' + 'Circular'}`, {
          headers: {
            Authorization: 'Bearer ' + this.props.user,
            'Content-Type': 'application/json'
          }
        }),
        axios.get(`${urls.PRINCIPALREPORTS + '?start=' + this.state.startGD + '&end=' + this.state.endGD + '&type=' + 'GeneralDiary'}`, {
          headers: {
            Authorization: 'Bearer ' + this.props.user,
            'Content-Type': 'application/json'
          }
        }),
        axios.get(`${urls.PRINCIPALREPORTS + '?start=' + this.state.startG + '&end=' + this.state.endG + '&type=' + 'Grievance'}`, {
          headers: {
            Authorization: 'Bearer ' + this.props.user,
            'Content-Type': 'application/json'
          }
        })
      ]).then(([result1, result2, result3, result4, result5, result6]) => {
        this.setState({
          teacherExcelReport: result1.data.teacher_report,
          nonUploadedTeachersExcelReport: result2.data.teacher_non_updated,
          teacherSubSecMapExcelReport: result3.data.teacher_sub_sec_map_report,
          circularExcelReport: result4.data.circular_report,
          generalDiaryExcelReport: result5.data.general_diary_report,
          grievanceExcelReport: result6.data.grievance_report,
          loading: false
        })
      })
        .catch(error => {
          this.setState({ loading: false })
          console.log(error)
        })
    }
  }

  getDateTeacherReport (url) {
    let part = (url.split('/')[url.split('/').length - 1]).replace('TeacherReport-', '')
    let index = part.indexOf('.')
    let date = part.substring(0, index !== -1 ? index : part.length)
    return date
  }
  getDateTeacherSubjectSectionMappingReport (url) {
    let part = (url.split('/')[url.split('/').length - 1]).replace('TeacherSubjectSectionMappingReport-', '')
    let index = part.indexOf('.')
    let date = part.substring(0, index !== -1 ? index : part.length)
    return date
  }
  getDateTeacherReportNonUpdated (url) {
    let part = (url.split('/')[url.split('/').length - 1]).replace('TeacherReportNonUpdated-', '')
    let index = part.indexOf('.')
    let date = part.substring(0, index !== -1 ? index : part.length)
    date = date.replace('TeacherReport-', '')
    return date
  }
  getDateCircularReport (url) {
    let part = (url.split('/')[url.split('/').length - 1]).replace('Circular-Report-', '')
    let index = part.indexOf('.')
    let date = part.substring(0, index !== -1 ? index : part.length)
    date = date.replace('TeacherReport-', '')
    return date
  }
  getDateGeneralDiaryReport (url) {
    let part = (url.split('/')[url.split('/').length - 1]).replace('GeneralDiaryReport-', '')
    let index = part.indexOf('.')
    let date = part.substring(0, index !== -1 ? index : part.length)
    date = date.replace('TeacherReport-', '')
    return date
  }
  getDateGrievanceReport (url) {
    let part = (url.split('/')[url.split('/').length - 1]).replace('GeneralDiaryReport-', '')
    let index = part.indexOf('.')
    let date = part.substring(0, index !== -1 ? index : part.length)
    date = date.replace('Grievance-Report-', '')
    return date
  }

  handleScrollTeacherReport = (event) => {
    if (event.target.scrollTop === 0) {
      return
    }
    let { target } = event
    if (target.scrollTop + target.clientHeight >= target.scrollHeight) {
      axios.get(`${urls.PRINCIPALREPORTS + '?start=' + this.state.endTR + '&end=' + Number(this.state.endTR + 5) + '&type=' + 'TeacherReport'}`, {
        headers: {
          Authorization: 'Bearer ' + this.props.user,
          'Content-Type': 'application/json'
        }
      })
        .then(res => {
          if (res.data.teacher_report) {
            this.setState({
              startTR: this.state.endTR,
              endTR: Number(this.state.endTR + 5),
              teacherExcelReport: [...this.state.teacherExcelReport, ...res.data.teacher_report]
            })
          }
        })
    }
  }
  handleScrollNonUploadedTeacherReport = (event) => {
    if (event.target.scrollTop === 0) {
      return
    }
    let { target } = event
    if (target.scrollTop + target.clientHeight >= target.scrollHeight) {
      axios.get(`${urls.PRINCIPALREPORTS + '?start=' + this.state.endTRNU + '&end=' + Number(this.state.endTRNU + 5) + '&type=' + 'TRNonUpdated'}`, {
        headers: {
          Authorization: 'Bearer ' + this.props.user,
          'Content-Type': 'application/json'
        }
      })
        .then(res => {
          if (res.data.teacher_non_updated) {
            this.setState({
              startTRNU: this.state.endTRNU,
              endTRNU: Number(this.state.endTRNU + 5),
              nonUploadedTeachersExcelReport: [...this.state.nonUploadedTeachersExcelReport, ...res.data.teacher_non_updated]
            })
          }
        })
    }
  }
  handleScrollTSubjectSectionMap= (event) => {
    if (event.target.scrollTop === 0) {
      return
    }
    let { target } = event
    if (target.scrollTop + target.clientHeight >= target.scrollHeight) {
      axios.get(`${urls.PRINCIPALREPORTS + '?start=' + this.state.endTSSM + '&end=' + Number(this.state.endTSSM + 5) + '&type=' + 'TSubjectSectionMap'}`, {
        headers: {
          Authorization: 'Bearer ' + this.props.user,
          'Content-Type': 'application/json'
        }
      })
        .then(res => {
          if (res.data.teacher_sub_sec_map_report) {
            this.setState({
              startTSSM: this.state.endTSSM,
              endTSSM: Number(this.state.endTSSM + 5),
              teacherSubSecMapExcelReport: [...this.state.teacherSubSecMapExcelReport, ...res.data.teacher_sub_sec_map_report]
            })
          }
        })
    }
  }

  handleScrollCircular= (event) => {
    if (event.target.scrollTop === 0) {
      return
    }
    let { target } = event
    if (target.scrollTop + target.clientHeight >= target.scrollHeight) {
      axios.get(`${urls.PRINCIPALREPORTS + '?start=' + this.state.endC + '&end=' + Number(this.state.endC + 5) + '&type=' + 'Circular'}`, {
        headers: {
          Authorization: 'Bearer ' + this.props.user,
          'Content-Type': 'application/json'
        }
      })
        .then(res => {
          if (res.data.circular_report) {
            this.setState({
              startC: this.state.endC,
              endC: Number(this.state.endC + 5),
              circularExcelReport: [...this.state.circularExcelReport, ...res.data.circular_report]
            })
          }
        })
    }
  }
  handleScrollGeneralDiary= (event) => {
    if (event.target.scrollTop === 0) {
      return
    }
    let { target } = event
    if (target.scrollTop + target.clientHeight >= target.scrollHeight) {
      axios.get(`${urls.PRINCIPALREPORTS + '?start=' + this.state.endGD + '&end=' + Number(this.state.endGD + 5) + '&type=' + 'GeneralDiary'}`, {
        headers: {
          Authorization: 'Bearer ' + this.props.user,
          'Content-Type': 'application/json'
        }
      })
        .then(res => {
          if (res.data.general_diary_report) {
            this.setState({
              startGD: this.state.endGD,
              endGD: Number(this.state.endGD + 5),
              generalDiaryExcelReport: [...this.state.generalDiaryExcelReport, ...res.data.general_diary_report]
            })
          }
        })
    }
  }
  handleScrollGrievance = (event) => {
    if (event.target.scrollTop === 0) {
      return
    }
    let { target } = event
    if (target.scrollTop + target.clientHeight >= target.scrollHeight) {
      axios.get(`${urls.PRINCIPALREPORTS + '?start=' + this.state.endG + '&end=' + Number(this.state.endG + 5) + '&type=' + 'Grievance'}`, {
        headers: {
          Authorization: 'Bearer ' + this.props.user,
          'Content-Type': 'application/json'
        }
      })
        .then(res => {
          if (res.data.grievance_report) {
            this.setState({
              startG: this.state.endG,
              endG: Number(this.state.endG + 5),
              grievanceExcelReport: [...this.state.grievanceExcelReport, ...res.data.grievance_report]
            })
          }
        })
    }
  }

  render () {
    const { teacherExcelReport, nonUploadedTeachersExcelReport, teacherSubSecMapExcelReport, circularExcelReport, generalDiaryExcelReport, grievanceExcelReport } = this.state
    let { classes = {} } = this.props
    return (
      <div>
        {this.state.loading ? <InternalPageStatus label={'fetching data'} />
          : <React.Fragment>
            <div className={classes.parentDiv} >
              <div className={classes.childDiv}>
                <div className={classes.flexContainer}>
                  <div> <Report style={{ color: 'green' }} /></div>
                  <div><h3 >
              TeacherReport
                  </h3></div>
                </div>
                <div className={classes.childContent}
                  onScroll={this.handleScrollTeacherReport} >
                  {teacherExcelReport && teacherExcelReport.length > 0 && teacherExcelReport.map(teacherReport => {
                    return (
                      <a className={classes.AnchorStyle} href={teacherReport} target='_blank'>
                        <i className='download icon' style={{ fontSize: '12px' }} /><p style={{ fontSize: '10px' }}>
                          {this.getDateTeacherReport(teacherReport)}
                        </p>
                      </a>
                    )
                  })}
                </div>
              </div>
              <div className={classes.childDiv}>
                <div className={classes.flexContainer}>
                  <div>   <ReportOff style={{ color: 'red' }} /></div>
                  <div><h3 >
              TRNonUpdated
                  </h3></div>
                </div>
                <div className={classes.childContent}
                  onScroll={this.handleScrollNonUploadedTeacherReport}>
                  {nonUploadedTeachersExcelReport && nonUploadedTeachersExcelReport.length > 0 && nonUploadedTeachersExcelReport.map(nonUploadedTeacher => {
                    return (
                      <Grid>
                        <a className={classes.AnchorStyle} href={nonUploadedTeacher} target='_blank'>
                          <i className='download icon' style={{ fontSize: '12px' }} />
                          <p style={{ fontSize: '10px' }}>
                            {this.getDateTeacherReportNonUpdated(nonUploadedTeacher)}
                          </p>
                        </a>
                      </Grid>
                    )
                  })}
                </div>
              </div>
              <div className={classes.childDiv} >
                <div className={classes.flexContainer}>
                  <div>    <Link style={{ color: 'blue' }} /></div>
                  <div><h3 >
              TSubjSecMap
                  </h3></div>
                </div>
                <div className={classes.childContent}
                  onScroll={this.handleScrollTSubjectSectionMap} >
                  {teacherSubSecMapExcelReport && teacherSubSecMapExcelReport.length > 0 && teacherSubSecMapExcelReport.map(teacherSubSecMapReport => {
                    return (
                      <a className={classes.AnchorStyle} href={teacherSubSecMapReport} target='_blank'>
                        <i className='download icon' style={{ fontSize: '12px' }} /><p style={{ fontSize: '10px' }}>{this.getDateTeacherSubjectSectionMappingReport(teacherSubSecMapReport)}</p></a>

                    )
                  })}
                </div>
              </div>
              <div className={classes.childDiv} >
                <div className={classes.flexContainer}>
                  <div>    <BlurCircular style={{ color: 'pink' }} /></div>
                  <div><h3 >
               CircularReport
                  </h3></div>
                </div>
                <div className={classes.childContent}
                  onScroll={this.handleScrollCircular}>
                  {circularExcelReport && circularExcelReport.length > 0 && circularExcelReport.map(circularExcelReport => {
                    return (
                      <a className={classes.AnchorStyle} href={circularExcelReport} target='_blank'>
                        <i className='download icon' style={{ fontSize: '12px' }} /><p style={{ fontSize: '10px' }}>{this.getDateCircularReport(circularExcelReport)}</p></a>
                    )
                  })}
                </div>
              </div>
              <div className={classes.childDiv} >
                <div className={classes.flexContainer}>
                  <div>     <ListAlt style={{ color: 'black' }} /></div>
                  <div><h3 >
              GeneralDiary
                  </h3></div>
                </div>
                <div className={classes.childContent}
                  onScroll={this.handleScrollGeneralDiary}>
                  {generalDiaryExcelReport && generalDiaryExcelReport.length > 0 && generalDiaryExcelReport.map(generalDiaryReport => {
                    return (
                      <a className={classes.AnchorStyle} href={generalDiaryReport} target='_blank'>
                        <i className='download icon' style={{ fontSize: '12px' }} /><p style={{ fontSize: '10px' }}>{this.getDateGeneralDiaryReport(generalDiaryReport)}</p></a>
                    )
                  })}
                </div>
              </div>
              <div className={classes.childDiv} >
                <div className={classes.flexContainer}>
                  <div>      <Message style={{ color: 'orange' }} /></div>
                  <div><h3 >
              Grievance
                  </h3></div>
                </div>
                <div className={classes.childContent}
                  onScroll={this.handleScrollGrievance}>
                  {grievanceExcelReport && grievanceExcelReport.length > 0 && grievanceExcelReport.map(grievanceReport => {
                    return (
                      <a className={classes.AnchorStyle} href={grievanceReport} target='_blank'>
                        <i className='download icon' style={{ fontSize: '12px' }} /><p style={{ fontSize: '10px' }}>{this.getDateGrievanceReport(grievanceReport)}</p></a>
                    )
                  })}
                </div>
              </div>
            </div>
          </React.Fragment>
        }</div>
    )
  }
}
const mapStateToProps = state => ({
  user: state.authentication.user
})

const mapDispatchToProps = dispatch => ({
})

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(withRouter(ExcelReport)))
