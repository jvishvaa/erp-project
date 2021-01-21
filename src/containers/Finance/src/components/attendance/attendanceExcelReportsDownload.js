import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import axios from 'axios'
import { Tabs, Tab, AppBar, withStyles, Grid } from '@material-ui/core'
import Button from '@material-ui/core/Button'

import { InternalPageStatus } from '../../ui'
import GSelect from '../../_components/globalselector'
import { COMBINATIONS } from './combinationsReports'
import { urls } from '../../urls'
import PSelect from '../../_components/pselect'
import Exporter from '../../_components/pselect/exporter'

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
class AttendanceExcelReportsDownload extends Component {
  constructor () {
    super()
    this.state = {
      tab: 0,
      usePowerSelector: false,
      disable: true,
      check: false,
      startB: 0,
      endB: 10,
      startG: 0,
      endG: 10,
      startS: 0,
      endS: 10,
      loading: false,
      selectorData: {},
      download: {
        label: 'DOWNLOAD'
      }

    }
    // this.excel = urls.AttendanceAbsenteesExport + '?branch_id='
    this.userProfile = JSON.parse(localStorage.getItem('user_profile'))
  }

  componentDidMount () {
    this.role = this.userProfile.personal_info.role
    if (this.role === 'Admin' || this.role === 'CFO') {
      this.setState({ loading: true })
      Promise.all([
        axios.get(`${urls.AttendanceExcelReportDownload + '?start=' + this.state.startB + '&end=' + this.state.endB + '&level=' + 'Branch'}`, {
          headers: {
            Authorization: 'Bearer ' + this.props.user,
            'Content-Type': 'application/json'
          }
        }),
        axios.get(`${urls.AttendanceExcelReportDownload + '?start=' + this.state.startG + '&end=' + this.state.endG + '&level=' + 'Grade'}`, {
          headers: {
            Authorization: 'Bearer ' + this.props.user,
            'Content-Type': 'application/json'
          }
        }),
        axios.get(`${urls.AttendanceExcelReportDownload + '?start=' + this.state.startS + '&end=' + this.state.endS + '&level=' + 'Section'}`, {
          headers: {
            Authorization: 'Bearer ' + this.props.user,
            'Content-Type': 'application/json'
          }
        }),
        axios.get(`${urls.AttendanceExcelReportDownload + '?start=' + this.state.startG + '&end=' + this.state.endG + '&level=' + 'BulkAbsentees'}`, {
          headers: {
            Authorization: 'Bearer ' + this.props.user,
            'Content-Type': 'application/json'
          }
        })

      ]).then(([result1, result2, result3, result4]) => {
        this.setState({
          branchExcelReports: result1.data.branch_attendance_report,
          gradeExcelReports: result2.data.grade_attendance_report,
          sectionExcelReports: result3.data.section_attendance_report,
          bulkAbsenteesExcelReports: result4.data.bulk_absentees_attendance_report,
          loading: false
        })
      })
        .catch(error => {
          this.setState({ loading: false })
          console.log(error)
        })
    }
  }

  getDateBranchReport (url) {
    let part = (url.split('/')[url.split('/').length - 1]).replace('BranchWise-', '')
    let index = part.indexOf('.')
    let date = part.substring(0, index !== -1 ? index : part.length)
    return date
  }

  getDateGradeReport (url) {
    let part = (url.split('/')[url.split('/').length - 1]).replace('GradeWise-', '')
    let index = part.indexOf('.')
    let date = part.substring(0, index !== -1 ? index : part.length)
    return date
  }
  getDateSectionReport (url) {
    let part = (url.split('/')[url.split('/').length - 1]).replace('SectionWise-', '')
    let index = part.indexOf('.')
    let date = part.substring(0, index !== -1 ? index : part.length)
    return date
  }
  getDateBulkAbsenteesReport (url) {
    let part = (url.split('/')[url.split('/').length - 1]).replace('BulkAbsentees-', '')
    let index = part.indexOf('.')
    let date = part.substring(0, index !== -1 ? index : part.length)
    return date
  }bulkAbsenteesExcelReports

  handleScrollBranchReport= (event) => {
    if (event.target.scrollTop === 0) {
      return
    }
    let { target } = event
    if (target.scrollTop + target.clientHeight >= target.scrollHeight) {
      axios.get(`${urls.AttendanceExcelReportDownload + '?start=' + this.state.endB + '&end=' + Number(this.state.endB + 5) + '&level=' + 'Branch'}`, {
        headers: {
          Authorization: 'Bearer ' + this.props.user,
          'Content-Type': 'application/json'
        }
      })
        .then(res => {
          if (res.data.branch_attendance_report) {
            this.setState({
              startB: this.state.endB,
              endB: Number(this.state.endB + 5),
              branchExcelReports: [...this.state.branchExcelReports, ...res.data.branch_attendance_report]
            })
          }
        })
    }
  }
  handleScrollGradeReport = (event) => {
    if (event.target.scrollTop === 0) {
      return
    }
    let { target } = event
    if (target.scrollTop + target.clientHeight >= target.scrollHeight) {
      axios.get(`${urls.AttendanceExcelReportDownload + '?start=' + this.state.endG + '&end=' + Number(this.state.endG + 5) + '&level=' + 'Grade'}`, {
        headers: {
          Authorization: 'Bearer ' + this.props.user,
          'Content-Type': 'application/json'
        }
      })
        .then(res => {
          if (res.data.grade_attendance_report) {
            this.setState({
              startG: this.state.endG,
              endG: Number(this.state.endG + 5),
              gradeExcelReports: [...this.state.gradeExcelReports, ...res.data.grade_attendance_report]
            })
          }
        })
    }
  }
  handleScrollSectionReport= (event) => {
    if (event.target.scrollTop === 0) {
      return
    }
    let { target } = event
    if (target.scrollTop + target.clientHeight >= target.scrollHeight) {
      axios.get(`${urls.AttendanceExcelReportDownload + '?start=' + this.state.endS + '&end=' + Number(this.state.endS + 5) + '&level=' + 'Section'}`, {
        headers: {
          Authorization: 'Bearer ' + this.props.user,
          'Content-Type': 'application/json'
        }
      })
        .then(res => {
          if (res.data.section_attendance_report) {
            this.setState({
              startS: this.state.endS,
              endS: Number(this.state.endS + 5),
              sectionExcelReports: [...this.state.sectionExcelReports, ...res.data.section_attendance_report]
            })
          }
        })
    }
  }
  handleScrollBulkAbsenteesExcelReport= (event) => {
    if (event.target.scrollTop === 0) {
      return
    }
    let { target } = event
    if (target.scrollTop + target.clientHeight >= target.scrollHeight) {
      axios.get(`${urls.AttendanceExcelReportDownload + '?start=' + this.state.endS + '&end=' + Number(this.state.endS + 5) + '&level=' + 'BulkAbsentees'}`, {
        headers: {
          Authorization: 'Bearer ' + this.props.user,
          'Content-Type': 'application/json'
        }
      })
        .then(res => {
          if (res.data.section_attendance_report) {
            this.setState({
              startS: this.state.endS,
              endS: Number(this.state.endS + 5),
              bulkAbsenteesExcelReports: [...this.state.bulkAbsenteesExcelReports, ...res.data.bulk_absentees_attendance_report]
            })
          }
        })
    }
  }
  summaryDownloadTabContent=() => {
    const { branchExcelReports, gradeExcelReports, sectionExcelReports, bulkAbsenteesExcelReports } = this.state
    let { classes = {} } = this.props
    return (
      <div>
        {this.state.loading ? <InternalPageStatus label={'fetching data'} />
          : <React.Fragment>
            <div className={classes.parentDiv} >
              <div className={classes.childDiv}>
                <div className={classes.flexContainer}>
                  <div><h3 >
            Branch Level Reports
                  </h3></div>
                </div>
                <div className={classes.childContent}
                  onScroll={this.handleScrollBranchReport} >
                  {branchExcelReports && branchExcelReports.length > 0 && branchExcelReports.map(branchExcelReport => {
                    return (
                      <a className={classes.AnchorStyle} href={branchExcelReport} target='_blank'>
                        <i className='download icon' style={{ fontSize: '14px' }} /><p style={{ fontSize: '10px' }}>
                          {this.getDateBranchReport(branchExcelReport)}
                        </p>
                      </a>
                    )
                  })}
                </div>
              </div>
              <div className={classes.childDiv}>
                <div className={classes.flexContainer}>
                  <div><h3 >
            Grade Level Reports
                  </h3></div>
                </div>
                <div className={classes.childContent}
                  onScroll={this.handleScrollGradeReport}>
                  {gradeExcelReports && gradeExcelReports.length > 0 && gradeExcelReports.map(gradeExcelReport => {
                    return (
                      <Grid>
                        <a className={classes.AnchorStyle} href={gradeExcelReport} target='_blank'>
                          <i className='download icon' style={{ fontSize: '14px' }} />
                          <p style={{ fontSize: '10px' }}>
                            {this.getDateGradeReport(gradeExcelReport)}
                          </p>
                        </a>
                      </Grid>
                    )
                  })}
                </div>
              </div>
              <div className={classes.childDiv} >
                <div className={classes.flexContainer}>
                  <div><h3 >
            Section Level Reports
                  </h3></div>
                </div>
                <div className={classes.childContent}
                  onScroll={this.handleScrollSectionReport} >
                  {sectionExcelReports && sectionExcelReports.length > 0 && sectionExcelReports.map(sectionExcelReport => {
                    return (
                      <a className={classes.AnchorStyle} href={sectionExcelReport} target='_blank'>
                        <i className='download icon' style={{ fontSize: '14px' }} /><p style={{ fontSize: '10px' }}>{this.getDateSectionReport(sectionExcelReport)}</p></a>

                    )
                  })}
                </div>
              </div>
              <div className={classes.childDiv} >
                <div className={classes.flexContainer}>
                  <div><h3 >
            Bulk Absentees Reports
                  </h3></div>
                </div>
                <div className={classes.childContent}
                  onScroll={this.handleScrollBulkAbsenteesExcelReport} >
                  {bulkAbsenteesExcelReports && bulkAbsenteesExcelReports.length > 0 && bulkAbsenteesExcelReports.map(bulkAbsenteesExcelReport => {
                    return (
                      <a className={classes.AnchorStyle} href={bulkAbsenteesExcelReport} target='_blank'>
                        <i className='download icon' style={{ fontSize: '14px' }} /><p style={{ fontSize: '10px' }}>{this.getDateBulkAbsenteesReport(bulkAbsenteesExcelReport)}</p></a>

                    )
                  })}
                </div>
              </div>

            </div>
          </React.Fragment>
        }</div>
    )
  }

handleDate = (e) => {
  this.setState({ date: e.target.value })
}
download=() => {
  let exporter = new Exporter()

  let { branchId, date, acadBranchGradeMappingId, sectionMappingId } = this.state
  console.log(acadBranchGradeMappingId, sectionMappingId)
  if (acadBranchGradeMappingId === undefined) {
    console.log('grade undefined')
  }
  if (!this.state.usePowerSelector) {
    if (acadBranchGradeMappingId === undefined && sectionMappingId === undefined) {
      window.open(urls.AttendanceAbsenteesExport + '?branch_id=' + branchId + '&date=' + date, '_blank')
    } else if (sectionMappingId === undefined) {
      console.log('section mapping')
      window.open(urls.AttendanceAbsenteesExport + '?branch_id=' + branchId + (this.state.usePowerSelector ? '&acad_branch_grade_mapping_id=' + (exporter.getGrades()) : '&acad_branch_grade_mapping_id=' + acadBranchGradeMappingId) + '&date=' + date, '_blank')
    } else {
      window.open(urls.AttendanceAbsenteesExport + '?branch_id=' + branchId + (this.state.usePowerSelector ? '&acad_branch_grade_mapping_id=' + (exporter.getGrades()) : '&acad_branch_grade_mapping_id=' + acadBranchGradeMappingId) + (this.state.usePowerSelector ? '&section_mapping_id=' + (exporter.getSections()) : '&section_mapping_id=' + sectionMappingId) + '&date=' + date, '_blank')
    }
  } else {
    window.open(urls.AttendanceAbsenteesExport + (this.state.usePowerSelector ? '?branch_id=' + (exporter.getBranches()) : '?branch_id=' + branchId) + (this.state.usePowerSelector ? '&acad_branch_grade_mapping_id=' + (exporter.getGrades()) : '&acad_branch_grade_mapping_id=' + acadBranchGradeMappingId) + (this.state.usePowerSelector ? '&section_mapping_id=' + (exporter.getSections()) : '&section_mapping_id=' + sectionMappingId) + '&date=' + date, '_blank')
  }
}

  absenteesDownloadTabContent=() => {
    return (
      <React.Fragment>
        <Grid container >
          <Grid style={{ marginLeft: 4 }} item>
            <GSelect variant={'filter'} onChange={this.onBranchChange} config={COMBINATIONS} />
          </Grid>
        </Grid>

        {/* <Grid
            container
            justify='center'
            alignItems='center'
          /> */}
        <Grid style={{ margin: '8px', 'font-size': '13px', justify: 'center' }}>
          <span>OR</span>
        </Grid>
        <Grid style={{ justify: 'center' }}>
          <PSelect section selectedItems={this.state.section_mapping} onClick={() => { console.log('Setting powerselector'); this.setState({ usePowerSelector: true }) }} />
        </Grid>
        <Grid style={{ padding: 10 }} >
          <div className='ui label'>
            <p style={{ fontSize: '16px' }}> Date :</p>
          </div>
          <input
            onChange={this.handleDate}
            value={this.state.date}
            type='date'
            name='startingDate'
            id='startingDate'
            max={(() => { let tdy = new Date(); let yr = tdy.getFullYear(); let mn = String(tdy.getMonth() + 1).padStart(2, '0'); let dy = String(tdy.getDate()).padStart(2, '0'); return (yr + '-' + mn + '-' + dy) })()}
          />
        </Grid>

        <Grid >
          <Button variant='contained' disabled={(!this.state.date)} style={{ marginTop: 10 }} color='primary' onClick={this.download}
          >{this.state.download.label}</Button>

        </Grid>

      </React.Fragment>
    )
  }
  decideTab = () => {
    if (this.state.tab === 0) {
      return this.summaryDownloadTabContent()
    } else {
      return this.absenteesDownloadTabContent()
    }
  }
  onBranchChange = (data) => {
    console.log(data, 'data')
    this.setState({ branchId: data.branch_id, acadBranchGradeMappingId: data.acad_branch_grade_mapping_id, sectionMappingId: data.section_mapping_id })
  }
  handleTabChange = (event, value) => {
    this.setState({ tab: value, data: [], dataList: [] })
  }

  render () {
    return (
      <React.Fragment>
        <Grid item xs={12}>
          <AppBar
            style={{ backgroundColor: '#f0f0f0' }}
            elevation={0} position='static'>
            <Tabs
              value={this.state.tab}
              onChange={this.handleTabChange}
              indicatorColor='primary'
              textColor='primary'
              variant='fullWidth'
            >
              { this.role === 'Admin' || this.role === 'CFO'
                ? <Tab label='Summary Excel Reports' />
                : ''}{ this.role === 'Admin' || this.role === 'CFO' ? <Tab label='Absentees Reports' />
                : ''}

            </Tabs>
          </AppBar>
        </Grid>
        {this.decideTab()
        }

      </React.Fragment>
    )
  }
}
const mapStateToProps = state => ({
  user: state.authentication.user
})

const mapDispatchToProps = dispatch => ({
})

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(withRouter(AttendanceExcelReportsDownload)))
