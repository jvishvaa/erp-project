import React from 'react'
import { Grid, Button, TableCell, TableHead, TableBody, TableRow, Tooltip, TablePagination, IconButton, Input } from '@material-ui/core/'
import { Delete, History, Edit, MenuBook, Restore } from '@material-ui/icons'
// import { MuiPickersUtilsProvider, DatePicker } from 'material-ui-pickers'
import { withRouter } from 'react-router-dom'
import qs from 'qs'

import axios from 'axios'
import { connect } from 'react-redux'
import ReactTable from 'react-table'
import moment from 'moment'
import { COMBINATIONS } from './customConfigReport'
import { Toolbar } from '../../../ui'
import GSelect from '../../../_components/globalselector'
import { apiActions } from '../../../_actions'
import { urls, qBUrls } from '../../../urls'
// import selector from '../../../ui/selector'
import NoData from './images/noData.png'

const allowedRoles = ['Principal', 'AcademicCoordinator', 'Teacher', 'Admin', 'LeadTeacher', 'EA Academics']

class ShowTeacherReport extends React.Component {
  constructor () {
    super()
    this.state = {
      selectedBranch: {},
      selectedGrade: {},
      selectedSection: {},
      selectedDate: moment().format('YYYY-MM-DD'),
      selectorData: {},
      tableData: [],
      loading: false,
      pages: -1,
      pageSize: 5,
      role: 'Teacher',
      page: 1,
      check: false,
      isDownload: false,
      deleted: false
    }
    this.handleDateChange = this.handleDateChange.bind(this)
    this.deleteHandler = this.deleteHandler.bind(this)
    this.onChange = this.onChange.bind(this)
    this.getReports = this.getReports.bind(this)
    /* global localStorage */
    this.userProfile = JSON.parse(localStorage.getItem('user_profile'))
    this.user_id = this.userProfile.personal_info.user_id
    this.role = this.userProfile.personal_info.role
  }

  isAllowedRole = () => {
    return allowedRoles.includes(this.state.role)
  }

  getReports (page, pageSize) {
    let { selectorData, startDate, endDate, isDownload, deleted } = this.state

    // let { branch_acad_id: branchId, subject_mapping_id: sectionMapId, subject_mapping_id: subjectMapId, acad_branch_grade_mapping_id: gradeMapId } = selectorData

    if (this.role === 'Admin' && (Object.keys(selectorData).length === 0)) {
      this.props.alert.warning('Select filter')
      return
    }

    var tableData = []
    pageSize = pageSize || this.state.pageSize
    let path = ''
    this.setState({ loading: true })
    if (selectorData.subject_mapping_id && startDate) {
      if (!endDate) {
        this.props.alert.error('Select appropriate end date')
        return
      }
      let subjectId = selectorData.subject_mapping_id
      let sectionId = selectorData.section_mapping_id
      path += `?subject_mapping_ids=${subjectId}&section_mapping_id=${sectionId}&from_date=${startDate}&to_date=${endDate}&page_number=${page || 1}&page_size=${pageSize}&is_download=${isDownload ? 'True' : 'False'}&deleted=${deleted ? 'True' : 'False'}`
    } else if (selectorData.subject_mapping_id) {
      let subjectId = selectorData.subject_mapping_id
      let sectionId = selectorData.section_mapping_id
      path += `?subject_mapping_ids=${subjectId}&section_mapping_id=${sectionId}&page_number=${page || 1}&page_size=${pageSize}&is_download=${isDownload ? 'True' : 'False'}&deleted=${deleted ? 'True' : 'False'}`
    } else
    if (selectorData.section_mapping_id && startDate) {
      if (!endDate) {
        this.props.alert.error('Select appropriate end date')
        return
      }
      let sectionId = selectorData.section_mapping_id
      path += `?section_mapping_id=${sectionId}&from_date=${startDate}&to_date=${endDate}&page_number=${page || 1}&page_size=${pageSize}&is_download=${isDownload ? 'True' : 'False'}&deleted=${deleted ? 'True' : 'False'}`
    } else if (selectorData.section_mapping_id) {
      let sectionId = selectorData.section_mapping_id
      path += `?section_mapping_id=${sectionId}&page_number=${page || 1}&page_size=${pageSize}&is_download=${isDownload ? 'True' : 'False'}&deleted=${deleted ? 'True' : 'False'}`
    } else
    if (selectorData.acad_branch_grade_mapping_id && startDate) {
      if (!endDate) {
        this.props.alert.error('Select appropriate end date')
        return
      }
      let gradeId = selectorData.acad_branch_grade_mapping_id
      path += `?acad_branch_grade_id=${gradeId}&from_date=${startDate}&to_date=${endDate}&page_number=${page || 1}&page_size=${pageSize}&is_download=${isDownload ? 'True' : 'False'}&deleted=${deleted ? 'True' : 'False'}`
    } else if (selectorData.acad_branch_grade_mapping_id) {
      let gradeId = selectorData.acad_branch_grade_mapping_id
      // eslint-disable-next-line no-unneeded-ternary
      path += `?acad_branch_grade_id=${gradeId}&page_number=${page || 1}&page_size=${pageSize}&is_download=${isDownload ? 'True' : 'False'}&deleted=${deleted ? 'True' : 'False'}`
    } else
    if (selectorData.branch_acad_id && startDate) {
      if (!endDate) {
        this.props.alert.error('Select appropriate end date')
        return
      }
      let branchId = selectorData.branch_acad_id
      path += `?branch_acad_id=${branchId}&from_date=${startDate}&to_date=${endDate}&page_number=${page || 1}&page_size=${pageSize}&is_download=${isDownload ? 'True' : 'False'}&deleted=${deleted ? 'True' : 'False'}`
    } else if (selectorData.branch_acad_id) {
      let branchId = selectorData.branch_acad_id
      path += `?branch_acad_id=${branchId}&page_number=${page || 1}&page_size=${pageSize}&is_download=${isDownload ? 'True' : 'False'}&deleted=${deleted ? 'True' : 'False'}`
    }
    // path += `&is_download=${isDownload}`
    axios.get(`${urls.ReportV2}${path}`, {
    // axios
    //   .get(urls.ReportV2, {
      // params: {
      //   ...selectorData,
      //   from_date: startDate,
      //   to_date: endDate,
      //   page_number: page,
      //   page_size: pageSize
      // },
      paramsSerializer: path => {
        return qs.stringify(path)
      },
      headers: {
        Authorization: 'Bearer ' + this.props.user
      }
    })
      .then(res => {
        res.data.reports.forEach((reportData, dataIndex) => {
          console.log(reportData.id)
          let subjectName
          this.props.subjects.forEach(function (subject) {
            if (subject.id === reportData.subjectmapping.subject) {
              subjectName = subject.subject_name
            }
          })
          tableData.push({
            id: reportData.id,
            date: reportData.which_day
              ? moment(reportData.which_day).format('LLLL')
              : '',
            subjectName: subjectName,
            teacherName: reportData.added_by
              ? reportData.added_by.first_name
              : '',
            recap_of_prev_class: reportData.recap
              ? reportData.recap
              : '',
            details_of_classWork: reportData.classswork
              ? reportData.classswork
              : '',
            end_summary_check: reportData.summary
              ? reportData.summary
              : '',
            experiments_demos_videos: reportData.support_materials
              ? reportData.support_materials
              : '',
            homeworkGiven: reportData.homework
              ? reportData.homework
              : '',
            media_file: reportData.media
              ? reportData.media.length > 0 && reportData.media.map((file, index) => <Button target={'blank'} href={file.media_file}>File {index + 1}</Button>)
              : '',
            history: (
              <div>
                {this.role !== 'CFO' && (<Tooltip title='History'>
                  <IconButton
                    aria-label='History'
                    onClick={e => {
                      e.stopPropagation()
                      this.props.history.push(
                        '/teacherHistory/' + reportData.id
                      )
                    }}
                  >
                    <History fontSize='small' />
                  </IconButton>
                </Tooltip>)}{' '}
                {this.role !== 'CFO' && (<Tooltip title='Edit'>
                  <IconButton
                    aria-label='Edit'
                    onClick={e => {
                      e.stopPropagation()
                      this.props.history.push(
                        '/teacher-report/edit/' + reportData.id
                      )
                    }}
                  >
                    <Edit fontSize='small' />
                  </IconButton>
                </Tooltip>)}
                {this.role !== 'CFO' && (<Tooltip title='Delete'>
                  <IconButton
                  // {(this.role === 'Subjecthead' || this.role === 'Planner' || this.role === 'Principal') ? <IconButton
                    aria-label='Delete'
                    onClick={(e) => this.deleteHandler(reportData.id, dataIndex)}
                  >
                    <Delete fontSize='small' />
                  </IconButton>
                </Tooltip>)}
                {this.role !== 'CFO' && this.isAllowedRole() && (<Tooltip title='View Submissions'>
                  <IconButton
                  // {(this.role === 'Subjecthead' || this.role === 'Planner' || this.role === 'Principal') ? <IconButton
                    aria-label='Submission'
                    onClick={(e) => this.submissionClickHandler(reportData.id)}
                  >
                    <MenuBook fontSize='small' />
                  </IconButton>
                </Tooltip>)}
              </div>
            )
          })
        })
        this.setState({ tableData: tableData, pageSize: res.data.page_size, pages: res.data.total_pages, count: res.data.total_reports, currentPage: res.data.page_number, loading: false })
      })
  }
  deleteHandler = (id, index) => {
    var updatedList = urls.Report + String(id) + '/'
    axios
      .delete(updatedList, {
        headers: {
          Authorization: 'Bearer ' + this.props.user
        },
        body: {
          id
        }
      })
      .then((res) => {
        this.props.alert.success('Deleted Teacher report Successfully')
        this.getReports()
        let { tableData } = this.state
        delete tableData[index]
        this.setState({ tableData })
      })
      .catch((error) => {
        console.log("Error: Couldn't fetch data from " + urls.Report, error)
      })
  }

  submissionClickHandler = (id) => {
    const { history } = this.props
    history.push({
      pathname: '/teacher-report/viewHomeworkSubmission',
      state: {
        id,
        isOnlineClass: false
      }
    })
  }
  onChange (data) {
    this.setState({ selectorData: data })
  }

  handleDateChange (update) {
    this.setState({ selectedDate: update.format('YYYY-MM-DD') })
  }

  componentDidMount () {
    const userProfile = JSON.parse(localStorage.getItem('user_profile'))
    const personalInfo = userProfile.personal_info
    const { role } = personalInfo
    this.setState({
      role
    })
  }
  restoreReports=(reportId) => {
    axios.get(qBUrls.RestoreReport + `?report_id=${reportId}`, {
      headers: {
        Authorization: 'Bearer ' + this.props.user
      }
    })
      .then(res => {
        this.getReports(this.state.page || 1)
        this.props.alert.success('Restored successfully')
      })
      .catch(err => {
        console.log(err)
        this.props.alert.error('Something went wrong')
      })
  }
  downloadTeacherReport=() => {
    let { selectorData, startDate, endDate, isDownload, page, pageSize } = this.state

    const { section_mapping_id: section, subject_mapping_id: subject, acad_branch_grade_mapping_id: branchGrade, branch_acad_id: branch } = selectorData

    pageSize = pageSize || this.state.pageSize
    let path = ''
    let commonPath = `&page_number=${page || 1}&page_size=${pageSize}&is_download=${isDownload ? 'True' : 'False'}`

    this.setState({ loading: true })

    // validation if end date is not present
    if (selectorData.subject_mapping_id && startDate) {
      if (!endDate) {
        this.props.alert.error('Select appropriate end date')
        return
      }
      let subjectId = subject
      let sectionId = section
      path += `?subject_mapping_ids=${subjectId}&section_mapping_id=${sectionId}&from_date=${startDate}&to_date=${endDate}${commonPath}`
    } else if (selectorData.subject_mapping_id) {
      let subjectId = subject
      let sectionId = section
      path += `?subject_mapping_ids=${subjectId}&section_mapping_id=${sectionId}${commonPath}`
    } else
    if (section && startDate) {
      if (!endDate) {
        this.props.alert.error('Select appropriate end date')
        return
      }

      let sectionId = section
      path += `?section_mapping_id=${sectionId}&from_date=${startDate}&to_date=${endDate}${commonPath}`
    } else if (section) {
      let sectionId = section
      path += `?section_mapping_id=${sectionId}${commonPath}`
    } else
    if (branchGrade && startDate) {
      if (!endDate) {
        this.props.alert.error('Select appropriate end date')
        return
      }

      let gradeId = branchGrade
      path += `?acad_branch_grade_id=${gradeId}&from_date=${startDate}&to_date=${endDate}${commonPath}`
    } else if (branchGrade) {
      let gradeId = branchGrade
      // eslint-disable-next-line no-unneeded-ternary
      path += `?acad_branch_grade_id=${gradeId}${commonPath}`
    } else
    if (selectorData.branch_acad_id && startDate) {
      if (!endDate) {
        this.props.alert.error('Select appropriate end date')
        return
      }

      var branchId = branch
      path += `?branch_acad_id=${branchId}&from_date=${startDate}&to_date=${endDate}${commonPath}`
    } else if (branch) {
      path += `?branch_acad_id=${branchId}${commonPath}`
    }

    axios.get(`${urls.ReportV2}${path}`, {
      responseType: 'arraybuffer',
      headers: {
        Authorization: 'Bearer ' + this.props.user
      }
    })
      .then(res => {
        let blob = new Blob([res.data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' })
        let link = document.createElement('a')
        link.href = window.URL.createObjectURL(blob)
        link.download = 'Teacher_report.xls'
        link.click()
        link.remove()
        this.setState({
          loading: false
        })
      })
      .catch(err => {
        this.setState({
          loading: false
        })
        console.log(err)
      })
  }
  // getHrefTODownload = () => {
  // let { selectorData, startDate, endDate } = this.state
  // let { DownloadExcel } = urls
  // let userId = this.user_id

  // let hrefLink = DownloadExcel + '?branch_id=' + selectorData.branch_id + '?section_id=' + selectorData.section_id + '?grade_id=' + selectorData.grade_id + '?subject_id=' + selectorData.subject_id + '?from_date=' + selectedDate.from_date + '?to_date=' + selectedDate.to_date + '?user_id=' +
  // let hrefLink = DownloadExcel + '?'
  // hrefLink += selectorData.branch_id ? `branch_id=${selectorData.branch_id}&` : ''
  // hrefLink += selectorData.grade_id ? `grade_id=${selectorData.grade_id}&` : ''
  // hrefLink += selectorData.section_id ? `section_id=${selectorData.section_id}&` : ''
  // hrefLink += selectorData.subject_id ? `subject_id=${selectorData.subject_id}&` : ''
  // hrefLink += startDate ? `from_date=${startDate}&` : ''
  // hrefLink += endDate ? `to_date=${endDate}&` : ''
  // hrefLink += `user_id=` + userId
  // return hrefLink
  // }

  render () {
    let { tableData, count, selectorData, deleted } = this.state
    var columns = [

      {
        accessor: 'subjectName',
        Header: 'Subject Name'
      },
      {
        accessor: 'teacherName',
        Header: 'Teacher Name'
      },
      {
        accessor: 'recap_of_prev_class',
        Header: 'Recap Of Previous Class'
      },
      {
        accessor: 'details_of_classWork',
        Header: 'Details Of Class Work'
      },
      {
        accessor: 'end_summary_check',
        Header: 'End Summary Check'
      },
      {
        accessor: 'experiments_demos_videos',
        Header: 'Experiments/ Demos/ Videos/ Any other tools used'
      },
      {
        accessor: 'homeworkGiven',
        show: !deleted,
        Header: 'Homework Given'
      },
      {
        accessor: 'media_file',
        show: !deleted,
        Header: 'Media'
      },
      {
        accessor: 'date',

        Header: 'Updated At'
      },
      {
        accessor: 'history',
        show: !deleted,
        Header: 'Actions'
      },

      {
        id: 'id',
        show: deleted,
        Header: 'Restore',
        accessor: val => {
          console.log(val)
          return (
            <Tooltip title='Restore' arrow>
              <Restore onClick={() => this.restoreReports(val.id)} />
            </Tooltip>
          )
        }
      }

    ]
    return <React.Fragment>
      <Toolbar>
        <Grid container>
          <Grid style={{ marginLeft: 4 }} item>
            <GSelect initialValue={{ branch_name: decodeURIComponent(window.location.href.split('/')[(window.location.href.split('/').length) - 1]) }} config={COMBINATIONS} variant={'filter'} onChange={this.onChange} />
          </Grid>
          {/* <Grid item>
            <MuiPickersUtilsProvider utils={MomentUtils}>
              <DatePicker
                style={{ margin: 8 }}
                label='Date'
                value={selectedDate}
                onChange={this.handleDateChange}
              />
            </MuiPickersUtilsProvider>
          </Grid> */}
          <Grid item style={{ margin: '8px 10px' }}>
            <label>Start date:</label><br />
            <Input type='date' value={this.state.startDate} onChange={e => this.setState({ startDate: e.target.value })} />
          </Grid>
          <Grid item style={{ margin: '8px 10px' }}>
            <label>End date:</label><br />
            <Input type='date' value={this.state.endDate} min={this.state.startDate} disabled={!this.state.startDate} onChange={e => this.setState({ endDate: e.target.value })} />
          </Grid>
          <Grid item>
            <Button variant='contained' style={{ marginTop: 16 }} color='primary' onClick={() =>
              this.setState({
                isDownload: false, deleted: false
              }, () => {
                this.getReports(this.state.page || 1)
              })
            }>
              Show Reports
            </Button>
            &nbsp;&nbsp;
            <Button
              style={{ marginTop: 16 }}
              color='primary'
              variant='contained'
              onClick={() =>
                this.setState({
                  deleted: true }, () => {
                  this.getReports(this.state.page || 1)
                })}

            >
           View deleted report
            </Button>
            &nbsp;&nbsp;
            {
              deleted ? ''
                : <Button
                  // variant='contained'
                  style={{ marginTop: 16 }}
                  color='primary'
                  variant='contained'
                  disabled={selectorData && !!(!selectorData.branch_acad_id || !selectorData.acad_branch_grade_mapping_id)}
                  // href={this.getHrefTODownload()}
                  onClick={() =>
                    this.setState({
                      isDownload: true }, () => {
                      this.downloadTeacherReport()
                    })}

                >
                  {/* // onClick={() => this.getExcelFile()}> */}

              Download Excel
                </Button>
            }

          </Grid>
          {/* <Grid item style={{ marginTop: 16 }}>
          DELETED REPORT:
            <Switch
              // defaultChecked value='checkedF'
              value={this.state.check}
              onClick={() =>
                this.setState({ deleted: true }, () => {
                  this.getReports(this.state.page || 1)
                })}
            />
          </Grid> */}

        </Grid>
      </Toolbar>
      <Grid>
        <ReactTable
          TrGroupComponent={(data) => data.children}
          TheadComponent={(data) => {
            return <TableHead>
              {data.children}
            </TableHead>
          }}
          TbodyComponent={(data) => {
            return <TableBody>{data.children}</TableBody>
          }}
          TrComponent={(data) => {
            return <TableRow>{data.children}</TableRow>
          }}
          ThComponent={(data) => {
            return <TableCell>{data.children}</TableCell>
          }}
          TdComponent={(data) => {
            return <TableCell style={{ width: '200px' }}>{data.children}</TableCell>
          }}
          NoDataComponent={(data) => {
            return <div style={{ display: 'flex', position: 'absolute', left: 0, top: 0, width: '100%', height: '100%', textAlign: 'center', background: '#fff' }} >
              <span style={{ 'margin-left': '425px', 'margin-top': '100px', backgroundImage: `url(${NoData})`, backgroundRepeat: 'no-repeat', width: '396px' }}>&nbsp;</span>
            </div>
          }}
          pages={this.state.pages} // should default to -1 (which means we don't know how many pages we have)
          pageSize={this.state.pageSize}
          PaginationComponent={(props) => {
            return <TablePagination
              rowsPerPageOptions={props.pageSizeOptions}
              component='div'
              backIconButtonProps={{
                'aria-label': 'Previous Page'
              }}
              nextIconButtonProps={{
                'aria-label': 'Next Page'
              }}
              count={count}
              rowsPerPage={props.pageSize}
              page={props.page}
              onChangePage={(event, page) => props.onPageChange(page)}
              onChangeRowsPerPage={(event) => props.onPageSizeChange(event.target.value)}
            />
          }}
          page={this.state.currentPage - 1}
          onPageChange={(pageIndex) => this.getReports(pageIndex + 1)}
          onPageSizeChange={(pageSize, pageIndex) => this.getReports(pageIndex + 1, pageSize)}
          loading={this.state.loading}
          manual
          data={tableData.length > 0 ? tableData : []}
          columns={columns}
        />
      </Grid>
    </React.Fragment>
  }
}
const mapStateToProps = state => ({
  user: state.authentication.user,
  subjects: state.subjects.items
})
const mapDispatchToProps = dispatch => ({
  listSubjects: dispatch(apiActions.listSubjects())
})
export default connect(mapStateToProps, mapDispatchToProps)(withRouter(ShowTeacherReport))
