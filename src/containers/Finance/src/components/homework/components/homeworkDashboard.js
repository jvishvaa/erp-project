import React from 'react'
import axios from 'axios'
import { connect } from 'react-redux'
import { Input, Grid } from 'semantic-ui-react'
import ReactTable from 'react-table'
import { withRouter } from 'react-router-dom'
import { Button
} from '@material-ui/core'
import Info from '@material-ui/icons/Info'
import Tooltip from '@material-ui/core/Tooltip'
import { OmsSelect } from '../../../ui'
import { urls } from '../../../urls'

class GradeDataHomework extends React.Component {
  constructor (props) {
    super()
    this.state = {
      branchId: props.branchId,
      subjectId: props.subjectId,
      loading: false,
      toDate: props.toDate,
      fromDate: props.fromDate,
      pageNoG: 0,
      pageSizeG: 5,
      totalItemsG: 0,
      gradeData: [] }
  }
  componentDidMount () {
    this.getGradeData(0)
  }
    getGradeData = () => {
      let { pageNoG } = this.state
      this.setState({ loading: true })
      axios
        .get(
          urls.HomeworkDashboard + '?to_date=' + this.state.toDate +
            '&from_date=' + this.state.fromDate +
            '&page_no=' + (Number(pageNoG || 0) + 1) +
            '&branch_id=' + this.state.branchId +
            '&page_size=' + this.state.pageSizeG +
            '&subject_id=' + this.state.subjectId,
          {
            headers: {
              Authorization: 'Bearer ' + this.props.user
            }
          })
        .then(res => {
          if (res.data.data.length > 0) {
            var resDataG = []
            let totalItemsG = res.data.total_items
            let totalPagesF = Math.ceil(totalItemsG / this.state.pageSizeG)
            res.data.data.forEach(function (item, index) {
              let obj = {
                sr: index + 1,
                acadMapId: item.acad_map_id,
                gradeId: item.grade,
                gradeName: item.grade_name,
                studentCount: item.grade_students_count,
                partiallySubmitted: item.partially_submitted,
                allSubmitted: item.all_submitted,
                totalHomeworks: item.total_homeworks,
                zeroSubmission: item.zero_submission
              }
              resDataG.push(obj)
            })
            this.setState({
              totalPages: totalPagesF,
              totalItemsG: totalItemsG,
              loading: false,
              gradeData: resDataG,
              mode: 'edit',
              data: null,
              showTableUpdate: true,
              showTable: false })
          }
        })
        .catch(error => {
          this.setState({ loading: false })
          console.log("Error: Couldn't fetch data from " + urls.GradeMapping, error)
        })
    }
    subComponentGrade = ({ original }) => {
      return (
        original.studentCount === 0
          ? (<div style={{ minHeight: '10vh', display: 'flex' }}><p style={{ margin: 'auto' }}>Students are not there in this  Grade</p></div>)
          : <div >
            <SectionDataHomework
              acadMapId={original.acadMapId}
              branchId={this.state.branchId}
              alert={this.props.alert}
              user={this.props.user}
              toDate={this.props.toDate}
              fromDate={this.props.fromDate}
              subjectId={this.state.subjectId}

            />
          </div>
      )
    }

    render () {
      let { totalPages, gradeData, pageNoG } = this.state
      return (
        <ReactTable
          id='grade-table'
          manual
          showPagination={totalPages > 1}
          showPageSizeOptions={false}
          onPageChange={(a) => {
            this.setState({ pageNoG: a }, () => { this.getGradeData(a) })
          }}
          page={pageNoG}
          pages={totalPages}
          data={gradeData}
          sortable
          style={{ fontFamily: 'Arial',
            backgroundColor: 'rgba(0,255,0,0.2)',
            fontSize: '1.15rem',
            fontWeight: 'bold' }}
          loading={this.state.loading}
          defaultPageSize={5}
          SubComponent={this.subComponentGrade}
          columns={[
            {
              accessor: 'gradeName'
            },
            {
              accessor: 'studentCount'
            },
            {
              accessor: 'totalHomeworks'
            }, {
              accessor: 'allSubmitted'
            }, {
              accessor: 'zeroSubmission'
            }, {
              accessor: 'partiallySubmitted'
            }
          ]}
        />)
    }
}
class SectionDataHomework extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      acadMapId: props.acadMapId,
      branchId: props.branchId,
      subjectId: props.subjectId,
      loading: false,
      toDate: props.toDate,
      fromDate: props.fromDate,
      pageNoS: 0,
      pageSizeS: 5,
      totalItemsS: 0,
      sectionData: []
    }
  }
  componentDidMount () {
    this.getSectionData(0)
  }
  getSectionData = () => {
    let { pageNoS } = this.state
    this.setState({ loading: true })
    axios
      .get(
        urls.HomeworkDashboard + '?to_date=' + this.state.toDate +
          '&from_date=' + this.state.fromDate +
          '&page_no=' + (Number(pageNoS) + 1) +
          '&acad_grade_map_id=' + this.state.acadMapId +
          '&page_size=' + this.state.pageSizeS +
          '&subject_id=' + this.state.subjectId,
        {
          headers: {
            Authorization: 'Bearer ' + this.props.user
          }
        })
      .then(res => {
        if (res.data.data.length > 0) {
          var resDataS = []
          let totalItemsS = res.data.total_items
          let totalPagesF = Math.ceil(totalItemsS / this.state.pageSizeS)
          res.data.data.forEach(function (item, index) {
            let obj = {
              sr: index + 1,
              secMapId: item.sec_map_id,
              sectionId: item.section,
              sectionName: item.section_name,
              studentCount: item.section_students_count,
              partiallySubmitted: item.partially_submitted,
              allSubmitted: item.all_submitted,
              totalHomeworks: item.total_homeworks,
              zeroSubmission: item.zero_submission
            }
            resDataS.push(obj)
          })
          this.setState({ totalPages: totalPagesF, totalItemsS: totalItemsS, loading: false, sectionData: resDataS, mode: 'edit', data: null, showTableUpdate: true, showTable: false })
        }
      })
      .catch(error => {
        this.setState({ loading: false })
        console.log("Error: Couldn't fetch data from " + urls.GradeMapping, error)
      })
  }
    subComponentSection = ({ original }) => {
      return (
        original.studentCount === 0
          ? (<div style={{ minHeight: '10vh', display: 'flex' }}><p style={{ margin: 'auto' }}>Students are not there in this Section</p></div>)
          : <div >
            <StudentDataHomeWork
              secMapId={original.secMapId}
              alert={this.props.alert}
              user={this.props.user}
              toDate={this.state.toDate}
              fromDate={this.state.fromDate}
              subjectId={this.state.subjectId}
            />
          </div>
      )
    }

    render () {
      let { sectionData, totalPages, pageNoS } = this.state
      return (<ReactTable
        id='section-table'
        manual
        loading={this.state.loading}
        showPagination={totalPages > 1}
        defaultPageSize={5}
        showPageSizeOptions={false}
        data={sectionData}
        style={{ fontFamily: 'Arial',
          backgroundColor: 'rgba(255, 127, 80,0.3)',
          fontSize: '1.15rem',
          fontWeight: 'bold' }}
        SubComponent={this.subComponentSection}
        onPageChange={(a) => {
          this.setState({ pageNoS: a }, () => { this.getSectionData(a) })
        }}
        sortable
        page={pageNoS}
        pages={totalPages}
        columns={[
          {
            accessor: 'sectionName'
          },
          {
            accessor: 'studentCount'
          }, {
            accessor: 'totalHomeworks'
          },
          {
            accessor: 'allSubmitted'
          }, {
            accessor: 'zeroSubmission'
          }, {
            accessor: 'partiallySubmitted'
          }
        ]}
      />)
    }
}
class StudentDataHomeWork extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      secMapId: props.secMapId,
      loading: false,
      toDate: props.toDate,
      fromDate: props.fromDate,
      subjectId: props.subjectId,
      pageNoStu: 0,
      pageSizeStu: 5,
      totalItemsStu: 0,
      studentData: []
    }
  }

  componentDidMount () {
    this.getStudentData(0)
  }
  getStudentData = () => {
    let { pageNoStu } = this.state
    this.setState({ loading: true })
    axios
      .get(
        urls.HomeworkDashboard + '?to_date=' + this.state.toDate +
          '&from_date=' + this.state.fromDate +
          '&page_no=' + (Number(pageNoStu) + 1) +
          '&sec_map_id=' + this.state.secMapId +
          '&page_size=' + this.state.pageSizeStu +
          '&subject_id=' + this.state.subjectId,
        {
          headers: {
            Authorization: 'Bearer ' + this.props.user
          }
        })
      .then(res => {
        if (res.data.data.length > 0) {
          var resDataStu = []
          let totalItemsStu = res.data.total_items
          let totalPagesF = Math.ceil(totalItemsStu / this.state.pageSizeStu)
          res.data.data.forEach(function (item, index) {
            let obj = {
              sr: index + 1,
              studentId: item.student_id,
              studentName: item.student_name,
              // partiallySubmitted: item.partially_submitted,
              submitted: item.submitted,
              totalHomeworks: item.total_homeworks,
              zeroSubmission: item.not_submitted
            }
            resDataStu.push(obj)
          })
          this.setState({ totalPages: totalPagesF, totalItemsStu: totalItemsStu, loading: false, studentData: resDataStu, mode: 'edit', data: null, showTableUpdate: true, showTable: false })
        }
      })
      .catch(error => {
        this.setState({ loading: false })
        console.log("Error: Couldn't fetch data from " + urls.GradeMapping, error)
      })
  }
  render () {
    let { studentData, totalPages, pageNoStu } = this.state
    return (
      <ReactTable
        id='student-table'
        manual
        loading={this.state.loading}
        showPagination={totalPages > 1}
        defaultPageSize={5}
        style={{ fontFamily: 'Arial',
          fontSize: '1.15rem',
          fontWeight: 'bold',

          backgroundColor: 'rgba(255,255,0,0.1)'

        }}
        data={studentData}
        showPageSizeOptions={false}
        onPageChange={(a) => {
          this.setState({ pageNoStu: a }, () => { this.getStudentData(a) })
        }}
        page={pageNoStu}
        pages={totalPages}
        sortable
        columns={[
          {
            Header: 'Student',

            accessor: 'studentName'
          }, {
            Header: 'TotalHomeworks ',
            accessor: 'totalHomeworks'
          },

          // {
          //   Header: 'partially Submitted',
          //   accessor: 'partiallySubmitted'
          // },
          {
            Header: 'Submitted',
            accessor: 'submitted'
          },
          { Header: 'Not Submitted ',
            accessor: 'zeroSubmission'

          }
        ]}
      />

    )
  }
}
class HomeworkDashboard extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      showTable: false,
      showTableUpdate: false,
      isActive: true,
      currentDate: new Date(),
      totalBlogSubmittedInAllBranch: 0,
      toDate: new Date().toISOString().substr(0, 10),
      subjectList: [],
      pageNo: 0,
      pageSizeB: 5,
      totalItemsR: 0,
      branchData: [],
      pages: null,
      fromDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().substr(0, 10),
      loading: false
    }
    this.updatedId = []
    this.userProfile = JSON.parse(localStorage.getItem('user_profile'))
    this.getBranchData = this.getBranchData.bind(this)
    this.role = JSON.parse(localStorage.getItem('user_profile')).personal_info.role
  }
  componentDidMount () {
    this.getSubjects()
      .then(result => { this.setState({ subjectList: result.data.data }) })
      .catch(err => { console.log(err) })
  }
  handleChangeToDate = event => {
    this.setState({ valueSubject: [], subjectList: [], branchData: [], subLabel: '', subjectId: '' })
    this.getSubjects()
      .then(result => { this.setState({ subjectList: result.data.data }) })
      .catch(err => { console.log(err) })
    let toDateC = document.getElementById('toDate').value
    let fromDateC = document.getElementById('fromDate').value
    if (fromDateC > toDateC) {
      this.props.alert.error('From date should be less than from date')
    } else if (toDateC < fromDateC) {
      this.props.alert.error('To date should be greater than from date')
    } else {
      this.setState({ toDate: event.target.value })
    }
  }
  handleChangeFromDate = event => {
    this.setState({ valueSubject: [], subjectList: [], branchData: [], subLabel: '', subjectId: '' })
    this.getSubjects()
      .then(result => { this.setState({ subjectList: result.data.data }) })
      .catch(err => { console.log(err) })
    let toDateC = document.getElementById('toDate').value
    let fromDateC = document.getElementById('fromDate').value
    if (fromDateC > toDateC) {
      this.props.alert.error('From date should be less than from date')
    } else if (toDateC < fromDateC) {
      this.props.alert.error('To date should be greater than from date')
    } else {
      this.setState({ fromDate: event.target.value })
    }
  }

  getBranchData = (pageNo) => {
    this.setState({ loading: true })
    axios
      .get(
        urls.HomeworkDashboard + '?to_date=' + this.state.toDate +
        '&from_date=' + this.state.fromDate +
        '&page_no=' + (Number(pageNo || 0) + 1) +

        '&page_size=' + this.state.pageSizeB +
        '&subject_id=' + this.state.subjectId,
        {
          headers: {
            Authorization: 'Bearer ' + this.props.user
          }
        })
      .then(res => {
        if (res.data.data.length > 0) {
          var resDataB = []
          let totalItemsR = res.data.total_items
          let totalPagesF = Math.ceil(totalItemsR / this.state.pageSizeB)
          res.data.data.forEach(function (item, index) {
            let obj = {
              sr: index + 1,
              branchId: item.branch_id,
              branchName: item.branch_name,
              studentCount: item.branch_students_count,
              partiallySubmitted: item.partially_submitted,
              allSubmitted: item.all_submitted,
              totalHomeworks: item.total_homeworks,
              zeroSubmission: item.zero_submission
            }
            resDataB.push(obj)
          })
          this.setState({ totalPages: totalPagesF, totalItems: totalItemsR, loading: false, branchData: resDataB, mode: 'edit', data: null, showTableUpdate: true, showTable: false })
        }
      })
      .catch(error => {
        this.setState({ loading: false })
        console.log("Error: Couldn't fetch data from " + urls.GradeMapping, error)
      })
  }

  subComponentBranch = ({ original }) => {
    return (
      original.studentCount === 0
        ? (<div style={{ minHeight: '10vh', display: 'flex' }}><p style={{ margin: 'auto' }}>Students are not there in this branch</p></div>) : (<div >
          <GradeDataHomework
            branchId={original.branchId}
            alert={this.props.alert}
            user={this.props.user}
            toDate={this.state.toDate}
            fromDate={this.state.fromDate}
            subjectId={this.state.subjectId}

          />
        </div>)
    )
  }
  handleSubjectChange = (event) => {
    this.setState({ subLabel: event.label, subjectValue: event, branchData: [], subjectId: event.value }, () => { this.getBranchData(0) })
  }

  getSubjects = async () => {
    let res = await axios.get(urls.HomeworkDashboardSubjects, {
      headers: {
        Authorization: 'Bearer ' + this.props.user
      }
    })
    return res
  }

  render () {
    let { subjectList, totalPages, branchData, pageNo } = this.state
    return (
      <React.Fragment>
        <Grid style={{ justifyContent: 'flex', backgroundColor: '#fbfbfb' }} container >
          <div style={{ paddingTop: 12, fontFamily: 'Arial', fontSize: '1.15rem', fontWeight: 'bold' }}
          > Filter OnlineClass
          </div>
          <div style={{ paddingTop: 12 }} > <h4>From Date :</h4> </div><Input
            type='date'
            value={this.state.fromDate}
            max={(() => { let tdy = new Date(); let yr = tdy.getFullYear(); let mn = String(tdy.getMonth() + 1).padStart(2, '0'); let dy = String(tdy.getDate()).padStart(2, '0'); return (yr + '-' + mn + '-' + dy) })()}
            className='unstyled'
            name='fromDate'
            id='fromDate'
            required
            onChange={this.handleChangeFromDate}
          />
          <div style={{ paddingTop: 12 }} > <h4>To Date :</h4>
          </div><Input
            type='date'
            value={this.state.toDate}
            max={(() => { let tdy = new Date(); let yr = tdy.getFullYear(); let mn = String(tdy.getMonth() + 1).padStart(2, '0'); let dy = String(tdy.getDate()).padStart(2, '0'); return (yr + '-' + mn + '-' + dy) })()}
            className='unstyled'
            required
            name='toDate'
            id='toDate'
            onChange={this.handleChangeToDate}
          />
          <OmsSelect
            label={'Subject'}
            options={subjectList.map((item) => {
              return { label: item.subject_name, value: item.subject_id }
            })}
            defaultValue={this.state.valueSubject}
            change={this.handleSubjectChange}
          />{this.role === 'Teacher'
            ? <div style={{ padding: '10px' }} >
              <Button
                style={{ marginTop: 10 }}
                variant='contained'
                color='primary'
                onClick={this.props.history.goBack}
              > BACK </Button>
            </div>
            : ''}
        </Grid>

        <ReactTable
          id='branch-table'
          manual
          showPageSizeOptions={false}
          defaultPageSize={5}
          loading={this.state.loading}
          onPageChange={(a) => {
            this.setState({ pageNo: a }, () => { this.getBranchData(a) })
          }}
          page={pageNo}
          pages={totalPages}
          data={branchData}
          showPagination={totalPages > 1}
          sortable
          style={{ fontFamily: 'Arial', fontSize: '1.15rem', fontWeight: 'bold' }}
          SubComponent={this.subComponentBranch}
          columns={[
            {
              Header: 'Sr.',
              accessor: 'sr',
              width: 60,
              Cell: (row) => {
                return <div>{(this.state.pageSizeB * this.state.pageNo + (row.index + 1))}</div>
              }
            },

            {
              Header: 'Branch',

              accessor: 'branchName'
            },
            {
              Header: () => {
                return <Tooltip title='Total number of students in the branch' placement='top-start'>
                  <span> Student Count <Info /></span>
                </Tooltip>
              },
              accessor: 'studentCount'
            }, {
              Header: () => {
                return <Tooltip title='Total number of homeworks assigned to the students' placement='top-start'>
                  <span> TotalHomeworks <Info /></span>
                </Tooltip>
              },
              accessor: 'totalHomeworks'
            },
            {
              Header: () => {
                return <Tooltip title='Total number of students who submitted all the homeworks e.g.(5 out of 5, 3 out of 3)' placement='top-start'>
                  <span> Submitted <Info /></span>
                </Tooltip>
              },
              accessor: 'allSubmitted'
            },
            { Header: () => {
              return <Tooltip title='Total Numberof students who didnt submitted any homework e.g.(0 out of 5, 0 out 3)' placement='top-start'>
                <span>  Not Submitted <Info /></span>
              </Tooltip>
            },
            accessor: 'zeroSubmission'
            }, {
              Header: () => {
                return <Tooltip title='Total number of students who submitted partially e.g.(3 out of 5, 1 out of 3 )' placement='top-start'>
                  <span> Partially Submitted <Info /></span>
                </Tooltip>
              },
              accessor: 'partiallySubmitted'
            }
          ]}
        />

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
)(withRouter(HomeworkDashboard))
