import React from 'react'
import axios from 'axios'
import { connect } from 'react-redux'
import { Input, Grid } from 'semantic-ui-react'
import ReactTable from 'react-table'
import { withRouter } from 'react-router-dom'

import { Button, Chip
} from '@material-ui/core'
import { urls } from '../../../urls'

class GradeData extends React.Component {
  constructor (props) {
    super()
    this.state = {
      branchId: props.branchId,
      loading: false,
      toDate: props.toDate,
      fromDate: props.fromDate
    }
  }
  componentDidMount () {
    this.setState({ loading: true })
    axios.get(
      urls.BlogDashboard + '?to_date=' + this.state.toDate + '&from_date=' + this.state.fromDate + '&branch_id=' + this.props.branchId,

      {
        headers: {
          Authorization: 'Bearer ' + this.props.user
        }
      })
      .then(res => {
        if (res.status === 200 && res.data.length > 0) {
          var gradeData = []
          res.data.forEach(function (item, index) {
            let obj = {
              sr: index + 1,
              acadMapId: item.acad_map_id,
              gradeName: item.grade_name,
              studentCount: item.grade_student_count,
              blogSubmittedCount: item.grade_students_submitted_blogs,
              blogNotSubmittedCount: item.grade_student_not_submitted_blogs,
              totalBlogsSubmitted: item.total_submitted_blogs_grade,
              blogReviewedCount: item.blog_reviewed_count,
              pubBlogsGrade: item.across_grade,
              pubBlogsSection: item.across_section,
              pubBlogsTotal: item.total_pub_blogs

            }
            gradeData.push(obj)
          })
          this.setState({ loading: false, gradeData: gradeData, mode: 'edit', data: null, showTableUpdate: true, showTable: false })
        }
      })
      .catch(error => {
        console.log("Error: Couldn't fetch data from " + urls.GradeMapping, error)
      })
  }
    subComponentGrade = ({ original }) => {
      return (
        original.studentCount === 0
          ? (<div style={{ minHeight: '10vh', display: 'flex' }}><p style={{ margin: 'auto' }}>Students are not there in this  Grade</p></div>)
          : <div >
            <SectionData
              acadMapId={original.acadMapId}
              branchId={this.props.branchId}
              alert={this.props.alert}
              user={this.props.user}
              toDate={this.props.toDate}
              fromDate={this.props.fromDate}

            />
          </div>
      )
    }

    render () {
      let { gradeData } = this.state
      return (<ReactTable
        id='grade-table'

        loading={this.state.loading}
        defaultPageSize={5}
        data={gradeData}
        style={{ fontFamily: 'Arial',
          backgroundColor: 'rgba(173, 201, 201, 0.4)',
          fontSize: '1.15rem',
          fontWeight: 'bold' }}

        SubComponent={this.subComponentGrade}
        columns={[
          {
            Header: 'Sr ',
            accessor: 'sr',
            width: 60
          },

          {
            Header: 'Grade ',
            accessor: 'gradeName'
          },
          {
            Header: 'StudentCount',
            accessor: 'studentCount'
          }, {
            Header: ' No.Of.Students Submitted ',
            accessor: 'blogSubmittedCount'
          },
          {
            Header: 'Not Submitted',
            accessor: 'blogNotSubmittedCount'
          }, {
            Header: 'Total Blogs Submitted',
            accessor: 'totalBlogsSubmitted'
          },
          {
            Header: 'Reviewed Blogs ',
            accessor: 'blogReviewedCount'
          },
          {
            Header: 'Published Across Grade ',
            accessor: 'pubBlogsGrade'
          }, {
            Header: 'Published Across Section ',
            accessor: 'pubBlogsSection'
          }, {
            Header: ' Total Published Blogs',
            accessor: 'pubBlogsTotal'
          }

        ]}
      />)
    }
}
class SectionData extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      acadMapId: props.acadMapId,
      branchId: props.branchId,
      loading: false,
      toDate: props.toDate,
      fromDate: props.fromDate
    }
  }
  componentDidMount () {
    this.setState({ loading: true })
    axios.get(
      urls.BlogDashboard + '?to_date=' + this.state.toDate + '&from_date=' + this.state.fromDate + '&acad_grade_map_id=' + this.props.acadMapId,

      {
        headers: {
          Authorization: 'Bearer ' + this.props.user
        }
      })
      .then(res => {
        if (res.status === 200 && res.data.length > 0) {
          var sectionData = []
          res.data.forEach(function (item, index) {
            let obj = {
              sr: index + 1,
              secMapId: item.sec_map_id,
              sectionName: item.section_name,
              studentCount: item.section_student_count,
              blogSubmittedCount: item.section_students_submitted_blogs,
              blogNotSubmittedCount: item.section_student_not_submitted_blogs,
              totalBlogsSubmitted: item.total_submitted_blogs_section,
              blogReviewedCount: item.blog_reviewed_count,
              pubBlogsSection: item.across_section

            }
            sectionData.push(obj)
          })
          this.setState({ loading: false, sectionData: sectionData, mode: 'edit', data: null, showTableUpdate: true, showTable: false })
        }
      })
      .catch(error => {
        console.log("Error: Couldn't fetch data from " + urls.GradeMapping, error)
      })
  }
    subComponentSection = ({ original }) => {
      return (
        original.studentCount === 0
          ? (<div style={{ minHeight: '10vh', display: 'flex' }}><p style={{ margin: 'auto' }}>Students are not there in this Section</p></div>)
          : <div >
            <StudentData
              branchId={this.props.branchId}
              secMapId={original.secMapId}
              alert={this.props.alert}
              user={this.props.user}
              toDate={this.state.toDate}
              fromDate={this.state.fromDate}
            />
          </div>
      )
    }

    render () {
      let { sectionData = [] } = this.state
      return (<ReactTable
        id='section-table'
        loading={this.state.loading}
        defaultPageSize={5}
        showPageSizeOptions={false}
        style={{ fontFamily: 'Arial',
          backgroundColor: 'rgb(255, 255, 255)',
          fontSize: '1.15rem',
          fontWeight: 'bold' }}

        SubComponent={this.subComponentSection}
        showPagination={sectionData.length > 5}
        data={sectionData}
        columns={[
          {
            accessor: 'sr',
            width: 60
          },

          {
            Header: 'Section ',
            accessor: 'sectionName'
          },
          {
            Header: 'Student Count ',

            accessor: 'studentCount'
          }, {
            Header: ' No.Of.Students Submitted ',

            accessor: 'blogSubmittedCount'
          },
          {
            Header: 'Not Submitted',

            accessor: 'blogNotSubmittedCount'
          },
          {
            Header: 'Total Blogs Submitted',

            accessor: 'totalBlogsSubmitted'
          },
          {
            Header: 'Reviewed Blogs ',

            accessor: 'blogReviewedCount'
          },
          {
            Header: 'Published Across Section ',
            accessor: 'pubBlogsSection'
          }
        ]}
      />)
    }
}
class StudentData extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      secMapId: props.secMapId,
      branchId: props.branchId,
      loading: false,
      toDate: props.toDate,
      fromDate: props.fromDate

    }
  }
  componentDidMount () {
    this.setState({ loading: true })
    axios
      .get(
        urls.BlogDashboard + '?to_date=' + this.state.toDate + '&from_date=' + this.state.fromDate + '&sec_map_id=' + this.props.secMapId,

        {
          headers: {
            Authorization: 'Bearer ' + this.props.user
          }
        }
      )
      .then(res => {
        if (res.status === 200) {
          var studentData = []
          res.data.forEach(function (item, index) {
            let obj = {
              sr: index + 1,
              studentName: item.student_name,
              studentBlogSubmissionCount: item.blogs_submitted_by_student,
              lastPostTitle: item.last_post_title,
              lastPostSubDate: item.last_post_submission_date,
              blogReviewedCount: item.blog_reviewed_count,
              pubBlogsBranch: item.across_branch,
              pubBlogsGrade: item.across_grade,
              pubBlogsSection: item.across_section,
              pubBlogsTotal: item.total_pub_blogs
            }
            studentData.push(obj)
          })
          this.setState({ loading: false, studentData: studentData })
        }
      })
      .catch(error => {
        console.log("Error: Couldn't fetch data from " + urls.GradeMapping, error)
      })
  }

  render () {
    let { studentData = [] } = this.state
    return (
      studentData && studentData.length > 0 && (
        <ReactTable
          id='student-table'
          loading={this.state.loading}
          defaultPageSize={5}
          style={{ fontFamily: 'Arial',
            fontSize: '1.15rem',
            fontWeight: 'bold',

            backgroundColor: 'rgba(255, 196, 200, 0.2)'
          }}
          data={studentData}
          columns={[
            {
              Header: 'Sr.',
              accessor: 'sr',
              width: 60
            },
            {
              Header: 'StudentName',

              accessor: 'studentName'
            },
            {
              Header: 'Last Post Title',
              accessor: 'lastPostTitle'
            },
            {
              Header: 'Last Post Submission Date',
              accessor: 'lastPostSubDate'
            }, {
              Header: 'Total No Of Blogs Submitted',
              accessor: 'studentBlogSubmissionCount'
            },
            {
              Header: 'Reviewed Blogs ',
              accessor: 'blogReviewedCount'
            }, {
              Header: 'Published Across Branch ',
              accessor: 'pubBlogsBranch'
            }, {
              Header: 'Published Across Grade ',
              accessor: 'pubBlogsGrade'
            }, {
              Header: 'Published Across Section ',
              accessor: 'pubBlogsSection'
            }, {
              Header: ' Total Published Blogs',
              accessor: 'pubBlogsTotal'
            }

          ]}
        />
      )

    )
  }
}
class BlogDashboard extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      showTable: false,
      showTableUpdate: false,
      isActive: true,
      currentDate: new Date(),
      totalBlogSubmittedInAllBranch: 0,
      toDate: new Date().toISOString().substr(0, 10),

      fromDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().substr(0, 10),

      loading: false
    }
    this.updatedId = []
    this.userProfile = JSON.parse(localStorage.getItem('user_profile'))
    this.getBranchData = this.getBranchData.bind(this)
  }
  componentDidMount () {
    this.getBranchData()
  }
  handleChangeToDate = event => {
    let toDateC = document.getElementById('toDate').value
    let fromDateC = document.getElementById('fromDate').value
    if (fromDateC > toDateC) {
      this.props.alert.error('From date should be less than from date')
    } else if (toDateC < fromDateC) {
      this.props.alert.error('To date should be greater than from date')
    } else {
      this.setState({ toDate: event.target.value }, () => this.getBranchData())
    }
  }
  handleChangeFromDate = event => {
    let toDateC = document.getElementById('toDate').value
    let fromDateC = document.getElementById('fromDate').value
    if (fromDateC > toDateC) {
      this.props.alert.error('From date should be less than from date')
    } else if (toDateC < fromDateC) {
      this.props.alert.error('To date should be greater than from date')
    } else {
      this.setState({ fromDate: event.target.value }, () => this.getBranchData())
    }
  }

  getBranchData () {
    let { totalBlogSubmittedInAllBranch } = this.state
    this.setState({ loading: true })
    axios
      .get(
        urls.BlogDashboard + '?to_date=' + this.state.toDate + '&from_date=' + this.state.fromDate,
        {
          headers: {
            Authorization: 'Bearer ' + this.props.user
          }
        })
      .then(res => {
        if (res.status === 200 && res.data.length > 0) {
          var branchData = []

          res.data.forEach(function (item, index) {
            totalBlogSubmittedInAllBranch += item.total_submitted_blogs_branch
            let obj = {
              sr: index + 1,
              branchId: item.branch,
              branchName: item.branch_name,
              studentCount: item.branch_student_count,
              blogSubmittedCount: item.branch_students_submitted_blogs,
              blogNotSubmittedCount: item.barnch_student_not_submitted_blogs,
              totalBlogsSubmitted: item.total_submitted_blogs_branch,
              blogReviewedCount: item.blog_reviewed_count,
              pubBlogsBranch: item.across_branch,
              pubBlogsGrade: item.across_grade,
              pubBlogsSection: item.across_section,
              pubBlogsTotal: item.total_pub_blogs

            }
            branchData.push(obj)
          })
          this.setState({ total: totalBlogSubmittedInAllBranch, loading: false, branchData: branchData, mode: 'edit', data: null, showTableUpdate: true, showTable: false })
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
          <GradeData
            branchId={original.branchId}
            alert={this.props.alert}
            user={this.props.user}
            toDate={this.state.toDate}
            fromDate={this.state.fromDate}

          />
        </div>)
    )
  }
  render () {
    let { total, branchData = [] } = this.state

    return (
      <React.Fragment>
        <Grid style={{ justifyContent: 'flex', backgroundColor: '#fbfbfb' }} container >
          <div style={{ paddingTop: 12, fontFamily: 'Arial', fontSize: '1.15rem', fontWeight: 'bold' }}
          > Total Submitted Blogs Across Branches {this.state.fromDate} to {this.state.toDate}:
            <Chip
              size='medium'
              style={{ color: '#821057', fontSize: 20 }}
              label={total || '0'}
            /> </div>
          <div style={{ paddingTop: 12 }} > <h4>From Date :</h4> </div><Input
            type='date'
            required
            value={this.state.fromDate}
            max={(() => { let tdy = new Date(); let yr = tdy.getFullYear(); let mn = String(tdy.getMonth() + 1).padStart(2, '0'); let dy = String(tdy.getDate()).padStart(2, '0'); return (yr + '-' + mn + '-' + dy) })()}
            className='unstyled'
            name='fromDate'
            id='fromDate'
            onChange={this.handleChangeFromDate}
          />
          <div style={{ paddingTop: 12 }} > <h4>To Date :</h4>
          </div><Input
            type='date'
            value={this.state.toDate}
            max={(() => { let tdy = new Date(); let yr = tdy.getFullYear(); let mn = String(tdy.getMonth() + 1).padStart(2, '0'); let dy = String(tdy.getDate()).padStart(2, '0'); return (yr + '-' + mn + '-' + dy) })()}
            className='unstyled'
            name='toDate'
            id='toDate'
            required
            onChange={this.handleChangeToDate}
          />
          <div style={{ padding: '10px' }} >
            <Button
              style={{ marginTop: 10 }}
              variant='contained'
              color='primary'
              onClick={this.props.history.goBack}
            > BACK </Button>
          </div>
        </Grid>

        <ReactTable
          id='branch-table'
          loading={this.state.loading}
          defaultPageSize={5}
          data={branchData}
          style={{ fontFamily: 'Arial', fontSize: '1.15rem', fontWeight: 'bold' }}
          SubComponent={this.subComponentBranch}
          columns={[
            {
              Header: 'Sr.',
              accessor: 'sr',
              width: 60
            },

            {
              Header: 'Branch ',

              accessor: 'branchName'
            },
            {
              Header: 'Student Count',
              accessor: 'studentCount'
            }, {
              Header: ' No.Of.Students Submitted ',
              accessor: 'blogSubmittedCount'
            },
            {
              Header: 'Not Submitted',
              accessor: 'blogNotSubmittedCount'
            }, {
              Header: 'Total Blogs Submitted',
              accessor: 'totalBlogsSubmitted'
            }, {
              Header: 'Reviewed Blogs ',
              accessor: 'blogReviewedCount'
            }, {
              Header: 'Published Across Branch ',
              accessor: 'pubBlogsBranch'
            }, {
              Header: 'Published Across Grade ',
              accessor: 'pubBlogsGrade'
            }, {
              Header: 'Published Across Section ',
              accessor: 'pubBlogsSection'
            }, {
              Header: ' Total Published Blogs',
              accessor: 'pubBlogsTotal'
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
)(withRouter(BlogDashboard))
