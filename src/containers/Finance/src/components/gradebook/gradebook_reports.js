import React, { Component } from 'react'
import { connect } from 'react-redux'
import withStyles from '@material-ui/core/styles/withStyles'
import { Grid, Button, Tab, Tabs } from '@material-ui/core'
// import { Button } from '@material-ui/core'
import ReactTable from 'react-table'
import { withRouter } from 'react-router-dom'
import axios from 'axios'
// import { saveAs } from 'file-saver'
import GSelect from '../../_components/globalselector'
import { GRADEBOOKREPORTCOMBINATIONS } from './config/gradebook_report_comb'
import { OmsSelect, Toolbar } from '../../ui'
import { urls } from '../../urls'

const styles = theme => ({
  root: {
    width: '100%'
  },
  tableWrapper: {
    overflowX: 'auto'
  }

})
/** Class representing GradebookReport */
class GradebookReport extends Component {
  constructor () {
    super()
    this.state = {
      termList: [],
      selectedData: {},
      loading: false,
      selectedTermId: '',
      isPublished: false,
      currentTab: 0,
      examType: 'first'
    }
    this.role = JSON.parse(localStorage.getItem('user_profile')).personal_info.role
  }

  componentDidMount () {
    this.getTerms()
      .then(result => {
        this.setState({ termList: result.data, isPublished: result.data[0].is_publish })
      })
      .catch(err => { console.log(err) })
  }

  getTerms = async () => {
    let res = await axios.get(urls.AcademicTerms, {
      headers: {
        Authorization: 'Bearer ' + this.props.user
      }
    })
    return res
  }

  setGradeName = (gradesList = [], gradeId = '') => {
    const selectedGradeName = gradesList.find(grade => {
      return grade.acad_branch_grade_mapping_id === Number(gradeId)
    })
    this.setState({ selectedGradeName: selectedGradeName.grade_name })
  }

  onChange = (e, data) => {
    this.setState({
      selectedData: e,
      branchId: e.branch_id,
      gradeId: e.acad_branch_grade_mapping_id,
      sectionId: e.section_mapping_id,
      subjectId: e.subject_id,
      length: Object.keys(data).length,
      currentTab: 0,
      examType: 'first'
    }, () => {
      if (e.acad_branch_grade_mapping_id) {
        this.role === 'Subjecthead' ? this.setGradeName(data[2], e.acad_branch_grade_mapping_id) : this.setGradeName(data[1], e.acad_branch_grade_mapping_id)
      }
    })
  }
  handleTermChange = (e) => {
    this.setState({ selectedTermId: e.value }, () => {
      if (this.state.selectedData.branch_id) {
        this.getpublished()
          .then(res => {
            this.setState({ isPublished: JSON.parse(res.data.publish_status) })
          })
          .catch(err => {
            console.log(err)
          })
      }
    })
    console.log(e.value, this.state.selectedTermId, 'term')
  }

  getStudent = () => {
    if (!this.state.selectedTermId) {
      this.props.alert.warning('Select Term')
      return
    }
    if (!this.state.branchId) {
      this.props.alert.warning('Select Branch')
      return
    }
    let { selectedTermId } = this.state
    this.setState({ loading: true })
    console.log(this.state.selectedData, this.state.branchId)
    let path = this.state.selectedGradeName === 'Grade 9'
      ? `?exam_type=${this.state.examType}&` : '?'
    if (this.state.branchId && !this.state.gradeId) {
      path += `term_id=${selectedTermId}&branch_id=${this.state.branchId}`
    } else if (this.state.gradeId && !this.state.sectionId) {
      path += `term_id=${selectedTermId}&mapping_acad_grade=${this.state.gradeId}`
    } else if (this.state.sectionId && !this.state.subjectId) {
      path += `term_id=${selectedTermId}&section_mapping_id=${this.state.sectionId}`
    } else if (this.state.subjectId) {
      path += `term_id=${selectedTermId}&subject_mapping_id=${this.state.subjectId}`
    }

    this.setState({ loading: true })
    axios.get(`${urls.GradebookStudentsReport}${path}`, {
      headers: {
        Authorization: 'Bearer ' + this.props.user
      }
    })
      .then(res => {
        console.log(res)
        this.setState({ StudentData: res.data.students_data, loading: false, totalPages: res.data.total_pages })
      })
      .catch(error => {
        this.setState({ loading: false })
        console.log(error)
      })
  }
  getStudentsReports = () => {
    let cronLastUpdated = ((Math.floor(new Date().getHours() / 4)) * 4) // in 24 hrs format
    let message = `Bulk Zip Download files are last updated at ${cronLastUpdated} hours.
You can wait till ${cronLastUpdated + 4} hours
or
can download independent student report from download button below to get live marks`
    window.alert(message)

    let { designVariant, mergeCriteria, selectedData: { branch_id: branchId, acad_branch_grade_mapping_id: acadBranchGradeMappingId, section_mapping_id: sectionMappingId } = {}, selectedTermId } = this.state
    let path = this.state.selectedGradeName === 'Grade 9'
      ? `${urls.DownloadStudentsRecords}?exam_type=${this.state.examType}&`
      : `${urls.DownloadStudentsRecords}?`
    path += selectedTermId ? `term_id=${selectedTermId}&` : ''
    path += branchId ? `branch_id=${branchId}&` : ''
    path += acadBranchGradeMappingId ? `mapping_acad_grade=${acadBranchGradeMappingId}&` : ''
    path += sectionMappingId ? `section_mapping_id=${sectionMappingId}&` : ''
    path += mergeCriteria ? `merge_criteria=${mergeCriteria}&` : ''
    path += designVariant ? `design_variant=${designVariant}` : ''
    this.setState({ downloading: true })
    axios.get(path, {
      headers: {
        Authorization: 'Bearer ' + this.props.user
      }
    })
      .then(res => {
        let { file_path: filePath } = res.data
        if (filePath) {
          let anchorTag = document.createElement('a')
          anchorTag.href = urls.MEDIA_BASE + filePath
          anchorTag.click()
        }
        this.setState({ downloading: false })
      })
      .catch(error => {
        this.setState({ downloading: false })
        console.log(error)
      })
  }
  generateStudentWiseReport = (studentErp, variant) => {
    let path = this.state.selectedGradeName === 'Grade 9'
      ? `${urls.DownloadStudentReportCard}?exam_type=${this.state.examType}&`
      : `${urls.DownloadStudentReportCard}?`

    if (!studentErp) return
    let { selectedTermId } = this.state
    path += `erp_list=${studentErp}`
    path += selectedTermId ? `&term_id=${selectedTermId}` : ''

    axios.get(path, {
      headers: {
        Authorization: 'Bearer ' + this.props.user
      }
    })
      .then(res => {
        let { error, message, file_path_list: filePathList } = res.data
        if (error) {
          this.props.alert.error(String(message))
        }
        if (filePathList && Array.isArray(filePathList)) {
          (function (filePathList) {
            filePathList.forEach((filePath, index) => {
              (function (filePath) {
                if (filePath.includes(variant)) window.open(urls.MEDIA_BASE + '/' + filePath)
              }(filePath))
            })
          }(filePathList))
        }
        let { studentDwnldStatus = new Set() } = this.state
        studentDwnldStatus.delete(studentErp)
        this.setState({ studentDwnldStatus })
      })
      .catch(error => {
        console.log(error)
        let { studentDwnldStatus = new Set() } = this.state
        studentDwnldStatus.delete(studentErp)
        this.setState({ studentDwnldStatus })
      })
  }
  downloadStudentWise = (data) => {
    let { selectedTermId } = this.state
    let filePath = 'gradebook_report_cards/' + data.acad_session + '/' + 't' + '_' + selectedTermId + '/' + 'b' + '_' + data.branch_id + '/' + 'g' + '_' + data.grade_id + '/' + 's' + '_' + data.section_id + '/' + data.student_erp + '_' + data.student_name.replace(' ', '+') + '.pdf'
    let anchorTag = document.createElement('a')
    anchorTag.href = urls.MEDIA_BASE + '/' + filePath
    anchorTag.click()
  }

  PublishReportCard = () => {
    let { selectedTermId, branchId, isPublished } = this.state
    let path = urls.publishReportCards
    let formdata = new FormData()

    if (selectedTermId && !branchId) {
      formdata.append('term_id', selectedTermId)
      formdata.append('is_publish', !isPublished === true ? 'True' : 'False')
    } else if (selectedTermId && branchId) {
      formdata.append('term_id', selectedTermId)
      formdata.append('is_publish', !isPublished === true ? 'True' : 'False')
      formdata.append('branch_id', branchId)
    }

    axios.post(path, formdata, {
      headers: {
        Authorization: 'Bearer ' + this.props.user
      }
    })
      .then(res => {
        console.log(res)
        this.setState({ isPublished: !isPublished })
        if (!isPublished) {
          this.props.alert.success('successfully published  ')
        } else {
          this.props.alert.success(' successfully unpublished ')
        }
      })
      .catch(error => {
        this.props.alert.error('something went wrong')
        this.setState({ loading: false })
        console.log(error)
      })
  }
  getpublished = async () => {
    const { selectedTermId, selectedData } = this.state
    let res = await axios.get(`${urls.LockGradebook}?term_id=${selectedTermId}&branch_id=${selectedData.branch_id}`, {
      headers: {
        Authorization: 'Bearer ' + this.props.user
      }
    })
    return res
  }

  handleTabChange = (event, tab) => {
    this.setState({ currentTab: tab, examType: tab === 0 ? 'first' : 'second' })
  }

  render () {
    const { termList } = this.state
    let { classes } = this.props
    let { StudentData, loading } = this.state
    const columns = [
      {
        Header: 'SL_NO',
        id: 'sln',
        width: 80,
        Cell: row => {
          return ((row.index + 1))
        }
      },
      {
        Header: 'Student Name',
        accessor: 'student_name'
      },
      {
        Header: 'Enrollment Code',
        accessor: 'student_erp',
        width: 160
      },

      {
        Header: 'Download report card',
        accessor: 'student_erp',
        Cell: (props, index) => {
          let { original: { student_erp: studentErp } = {} } = props
          let { studentDwnldStatus = new Set() } = this.state
          return props.value
            ? <React.Fragment>

              <Button
                disabled={studentDwnldStatus.has(studentErp)}
                onClick={e => {
                  let { studentDwnldStatus = new Set() } = this.state
                  studentDwnldStatus.add(studentErp)
                  this.setState({ studentDwnldStatus })
                  this.generateStudentWiseReport(studentErp, '_bw.pdf')
                }}
              >
                Black theme
              </Button>

              <Button
                disabled={studentDwnldStatus.has(studentErp)}
                onClick={e => {
                  let { studentDwnldStatus = new Set() } = this.state
                  studentDwnldStatus.add(studentErp)
                  this.setState({ studentDwnldStatus })
                  this.generateStudentWiseReport(studentErp, '_default.pdf')
                }}
              >
                Maroon theme
              </Button>

              <Button
                disabled={studentDwnldStatus.has(studentErp)}
                onClick={e => {
                  let { studentDwnldStatus = new Set() } = this.state
                  studentDwnldStatus.add(studentErp)
                  this.setState({ studentDwnldStatus })
                  this.generateStudentWiseReport(studentErp, '_layer2.pdf')
                }}
              >
                Content (b&amp;w)
              </Button>

              <Button
                disabled={studentDwnldStatus.has(studentErp)}
                onClick={e => {
                  let { studentDwnldStatus = new Set() } = this.state
                  studentDwnldStatus.add(studentErp)
                  this.setState({ studentDwnldStatus })
                  this.generateStudentWiseReport(studentErp, '_layer1.pdf')
                }}
              >
                Template
              </Button>
            </React.Fragment>
            : ''
        }
      }
    ]
    return (
      <div>

        <Toolbar floatRight={
          (this.role === 'Admin' || this.role === 'Principal') &&
          <React.Fragment>
            <React.Fragment>
              <Button
                style={{ margin: 10 }}
                variant='contained'
                color='primary'
                disabled={!this.state.selectedTermId}
                onClick={this.PublishReportCard}>
                {
                  !this.state.isPublished
                    ? <span style={{ display: 'flex' }}><span>publish</span></span>
                    : <span style={{ display: 'flex' }}><span>unpublish</span></span>
                }</Button>
            </React.Fragment>

          </React.Fragment>
        }>
          <React.Fragment>
            <Grid>
              <OmsSelect
                label={'Term'}
                options={termList.map((term) => {
                  return { label: term.term, value: term.id }
                })}
                change={this.handleTermChange}
              />
            </Grid >

            <Grid >
              <GSelect onChange={this.onChange} variant={'selector'} config={GRADEBOOKREPORTCOMBINATIONS} />

            </Grid>
            {this.state.selectedTermId &&
            <Grid>
              <OmsSelect
                label={'Merge pdf'}
                options={[
                  { label: 'Section', value: 'section_wise' },
                  { label: 'Grade', value: 'grade_wise' },
                  { label: 'Both', value: 'both_grade_section_wise' }
                ]}
                change={e => { this.setState({ mergeCriteria: e.value }) }}
              />
            </Grid >
            }
            {this.state.selectedTermId &&
            <Grid>
              <OmsSelect
                label={'Design variant'}
                options={[
                  { label: 'Black theme', value: 'bw' },
                  { label: 'Maroon theme', value: 'default' },
                  { label: 'Content (b&w)', value: 'layer2' },
                  { label: 'template', value: 'layer_template' }
                ]}
                isMulti
                change={e => { this.setState({ designVariant: e.map(item => item.value) }) }}
              />
            </Grid >
            }
            <Button color='primary' onClick={this.getStudent}>get students</Button>
            <Button color='primary' disabled={this.state.downloading} onClick={this.getStudentsReports}>{this.state.downloading ? 'Downloading...' : 'Zip Download'}</Button>
            {
              this.state.selectedGradeName === 'Grade 9'
                ? <div style={{ marginLeft: 40 }}>
                  <Tabs
                    value={this.state.currentTab}
                    indicatorColor='primary'
                    textColor='primary'
                    onChange={this.handleTabChange}
                  >
                    <Tab label='Attempt One' />
                    <Tab label='Improvement Test' />
                  </Tabs>
                </div>
                : ''
            }
          </React.Fragment>
        </Toolbar>
        {StudentData
          ? <div className={classes.tableWrapper} style={{ overflowX: 'auto' }}>
            <div style={{ padding: 10 }}>
              <ReactTable
                style={{ height: '100%' }}
                data={StudentData || []}
                columns={columns}
                defaultPageSize={5}
                loading={loading}
                pages={this.state.totalPages}
              />
            </div>
          </div> : null
        }
      </div>

    )
  }
}

const mapStateToProps = (state) => ({
  user: state.authentication.user
})

export default connect(mapStateToProps)((withRouter(withStyles(styles)(GradebookReport))))
