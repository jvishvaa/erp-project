import React from 'react'
import axios from 'axios'
import { connect } from 'react-redux'
import { Radio, Input, Grid } from 'semantic-ui-react'

import ReactTable from 'react-table'
import { urls } from '../../urls'
import './attendance.css'
import './disable-calendar-picker.css'

class AttandanceGradeData extends React.Component {
  constructor (props) {
    super()
    this.state = {
      branchId: props.branchId,
      loading: false,
      date: props.date
    }
  }
  componentDidMount () {
    this.setState({ loading: true })
    axios.get(
      urls.AttendanceSummaryBranchReport + '?branch_id=' + this.props.branchId + '&date=' + this.props.date,
      {
        headers: {
          Authorization: 'Bearer ' + this.props.user
        }
      })
      .then(res => {
        if (res.status === 200 && res.data.length > 0) {
          var gradeAttendanceData = []
          res.data.forEach(function (item, index) {
            let obj = {
              sr: index + 1,
              gradeId: item.grade,
              mapId: item.map,
              gradeName: item.grade_name,
              studentCount: item.student_grade_count,
              gradeAttendancePresentCount: item.grade_attendance_present_count,
              gradeAttendanceAbsentCount: item.grade_attendance_absent_count,
              unmarkedGrade: item.unmarked_grade,
              percentageAbsent: Number(item.percentage_absent) === 0 ? 0 : (item.percentage_absent).toFixed(2)
            }
            gradeAttendanceData.push(obj)
          })
          this.setState({ loading: false, gradeAttendanceData: gradeAttendanceData, mode: 'edit', data: null, showTableUpdate: true, showTable: false })
        }
        console.log(gradeAttendanceData, 'gradeAttendanceDataaaaaaaa')
      })
      .catch(error => {
        console.log("Error: Couldn't fetch data from " + urls.GradeMapping, error)
      })
  }
  subComponentGrade = ({ original, branchId }) => {
    return (
      original.gradeAttendancePresentCount === 0
        ? (<div style={{ minHeight: '10vh', display: 'flex' }}><p style={{ margin: 'auto' }}>Attendance Not Marked for this Grade</p></div>)
        : <div >
          <AttandanceSectionData
            mapId={original.mapId}
            branchId={this.props.branchId}
            alert={this.props.alert}
            user={this.props.user}
            date={this.props.date}

          />
        </div>
    )
  }

  render () {
    return (<ReactTable
      id='grade-table'
      style={{
        backgroundColor: 'rgba(173, 201, 201, 0.4)',
        fontSize: '1.15rem',
        fontWeight: 'bold' }}

      loading={this.state.loading}
      defaultPageSize={5}
      data={this.state.gradeAttendanceData}
      SubComponent={this.subComponentGrade}
      columns={[
        {
          Header: 'Sr.',
          accessor: 'sr',
          width: 60
        },
        {
          Header: 'Grade',

          accessor: 'gradeName'
        },
        {
          Header: 'Student Count',
          accessor: 'studentCount'
        }, {
          Header: 'Present',
          accessor: 'gradeAttendancePresentCount'
        },
        {
          Header: 'Absent',
          accessor: 'gradeAttendanceAbsentCount'
        }, {
          Header: 'unmarked ',
          accessor: 'unmarkedGrade'
        }, {
          Header: '%Absent',
          accessor: 'percentageAbsent'
        }

      ]}
    />)
  }
}
class AttandanceSectionData extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      mapId: props.mapId,
      branchId: props.branchId,
      loading: false,
      date: props.date
    }
  }
  componentDidMount () {
    this.setState({ loading: true })
    axios.get(
      urls.AttendanceSummaryBranchReport + '?acad_grade_map_id=' + this.props.mapId + '&date=' + this.props.date,
      {
        headers: {
          Authorization: 'Bearer ' + this.props.user
        }
      })
      .then(res => {
        if (res.status === 200 && res.data.length > 0) {
          var sectionAttendanceData = []
          res.data.forEach(function (item, index) {
            let obj = {
              sr: index + 1,
              secMapId: item.sec_map_id,
              sectionId: item.section_id,
              sectionName: item.section_name,
              studentCount: item.student_section_count,
              sectionAttendancePresentCount: item.section_attendance_present_count,
              sectionAttendanceAbsentCount: item.section_attendance_absent_count,
              unmarkedSection: item.unmarked_section,
              percentageAbsent: Number(item.percentage_absent) === 0 ? 0 : (item.percentage_absent).toFixed(2)
            }
            sectionAttendanceData.push(obj)
          })
          this.setState({ loading: false, sectionAttendanceData: sectionAttendanceData, mode: 'edit', data: null, showTableUpdate: true, showTable: false })
        }
      })
      .catch(error => {
        console.log("Error: Couldn't fetch data from " + urls.GradeMapping, error)
      })
  }
  subComponentSection = ({ original }) => {
    return (
      original.sectionAttendancePresentCount === 0
        ? (<div style={{ minHeight: '10vh', display: 'flex' }}><p style={{ margin: 'auto' }}>Attendance Not Marked for this Section</p></div>)
        : <div >
          <AttandanceStudentData
            branchId={this.props.branchId}
            secMapId={original.secMapId}
            alert={this.props.alert}
            user={this.props.user}
            date={this.props.date}

          />
        </div>
    )
  }

  render () {
    let { sectionAttendanceData = [] } = this.state
    return (<ReactTable
      id='section-table'
      loading={this.state.loading}
      defaultPageSize={5}
      showPageSizeOptions={false}
      style={{ backgroundColor: 'rgb(255, 255, 255)', fontSize: '1.15rem', fontWeight: 'bold' }}

      SubComponent={this.subComponentSection}
      showPagination={sectionAttendanceData.length > 5}
      data={sectionAttendanceData}
      columns={[
        {
          Header: 'Sr.',
          accessor: 'sr',
          width: 60
        },
        {
          Header: 'Section',

          accessor: 'sectionName'
        },
        {
          Header: 'Student Count',
          accessor: 'studentCount'
        }, {
          Header: 'Present',
          accessor: 'sectionAttendancePresentCount'
        },
        {
          Header: 'Absent',
          accessor: 'sectionAttendanceAbsentCount'
        }, {
          Header: 'unmarked',
          accessor: 'unmarkedSection'
        }, {
          Header: '%Absent',
          accessor: 'percentageAbsent'
        }

      ]}
    />)
  }
}
class AttandanceStudentData extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      secMapId: props.secMapId,
      branchId: props.branchId,
      loading: false,
      date: props.data
      // date: new Date().toISOString().substr(0, 10)

    }
  }
  componentDidMount () {
    this.setState({ loading: true })
    axios
      .get(
        urls.Attendance + '?acadsectionmapping_id=' + this.props.secMapId + '&date=' + this.props.date + '&branch_id=' + this.props.branchId,
        {
          headers: {
            Authorization: 'Bearer ' + this.props.user
          }
        }
      )
      .then(res => {
        if (res.status === 200) {
          var studentData = []
          res.data.forEach(function (student, index) {
            let obj = {
              sr: index + 1,
              id: student.id,
              name: student.student.name,
              roll: student.student.erp,
              is_present: student.is_present,
              remarks: student.remarks
            }
            studentData.push(obj)
          })
          this.setState({ loading: false, studentData: studentData })
        } else if (res.status === 204) {
          this.setState({ loading: false })

          // let text = res.statusText
          // this.props.alert.warning(text.toString())
          this.props.alert.warning('Attendance is not marked for selected  date')
        }
      })
      .catch(error => {
        if (error.response && error.response.status === 409) {
          console.log(this.props.alert, 'alert')
          this.setState({ loading: false })

          this.props.alert.error('Selected Day is a Holiday')
        } else {
          this.setState({ loading: false })
          this.props.alert.error('Error Occurred')
        }
        console.log("Error: Couldn't fetch data from " + urls.Attendance, error)
      })
    console.log(this.state.studentData, 'studentDataaaa')
  }

  render () {
    let { studentData = [] } = this.state
    // if (!studentData.length > 0) return <div style={{ minHeight: '10vh', display: 'flex' }}><p style={{ margin: 'auto' }}>No Data</p></div>
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
              Header: 'Student Name',
              accessor: 'name',
              filterable: true
            },
            {
              Header: 'ERP',
              accessor: 'roll'
            },
            {
              Header: 'Attendance',
              accessor: d => (
                <Radio toggle checked={d.is_present} />
              ),
              id: 'attendance'
            },
            {
              Header: 'Remarks',
              accessor: 'remarks'
            }
          ]}
        />
      )

    )
  }
}
class AttendanceSummaryReport extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      showTable: false,
      showTableUpdate: false,
      isActive: true,
      currentDate: new Date(),
      date: new Date().toISOString().substr(0, 10),
      loading: false
    }
    this.updatedId = []
    this.userProfile = JSON.parse(localStorage.getItem('user_profile'))
    this.getBranchReport = this.getBranchReport.bind(this)
  }
  componentDidMount () {
    this.getBranchReport()
  }
  handleChangeDate = event => {
    this.setState({ date: event.target.value }, () => this.getBranchReport())
  }

  getBranchReport () {
    this.setState({ loading: true })
    axios
      .get(
        urls.AttendanceSummaryBranchReport + '?date=' + this.state.date,
        {
          headers: {
            Authorization: 'Bearer ' + this.props.user
          }
        })
      .then(res => {
        if (res.status === 200 && res.data.length > 0) {
          var studentData = []
          res.data.forEach(function (item, index) {
            let obj = {
              sr: index + 1,
              branchId: item.branch,
              branchName: item.branch_name,
              studentCount: item.branch_student_count,
              branchAttendancePresentCount: item.branch_attendance_present_count,
              branchAttendanceAbsentCount: item.branch_attendance_absent_count,
              unmarkedBranch: item.unmarked_branch,
              percentageAbsent: Number(item.percentage_absent) === 0 ? 0 : (item.percentage_absent).toFixed(2)
            }
            studentData.push(obj)
          })
          this.setState({ loading: false, attnData: studentData, mode: 'edit', data: null, showTableUpdate: true, showTable: false })
        }
      })
      .catch(error => {
        this.setState({ loading: false })
        console.log("Error: Couldn't fetch data from " + urls.GradeMapping, error)
      })
  }

handleDate = (e) => {
  this.setState({ date: e.target.value })
}
subComponentBranch = ({ original }) => {
  return (
    original.branchAttendancePresentCount === 'Holiday'
      ? (<div style={{ minHeight: '10vh', display: 'flex' }}><p style={{ margin: 'auto' }}>Holiday</p></div>)
      : original.branchAttendancePresentCount === 0
        ? (<div style={{ minHeight: '10vh', display: 'flex' }}><p style={{ margin: 'auto' }}>Attendance Not Marked for this Day</p></div>) : (<div >
          <AttandanceGradeData
            branchId={original.branchId}
            alert={this.props.alert}
            user={this.props.user}
            date={this.state.date}

          />
        </div>)
  )
}
render () {
  let { attnData = [] } = this.state
  // if (!attnData.length > 0) return <div style={{ minHeight: '10vh', display: 'flex' }}><p style={{ margin: 'auto' }}>No Data</p></div>

  return (
    <React.Fragment>
      <Grid style={{ justifyContent: 'flex-end', backgroundColor: '#fbfbfb' }} container >
        <div style={{ paddingTop: 12 }} > Date : </div><Input
          type='date'
          value={this.state.date}
          max={(() => { let tdy = new Date(); let yr = tdy.getFullYear(); let mn = String(tdy.getMonth() + 1).padStart(2, '0'); let dy = String(tdy.getDate()).padStart(2, '0'); return (yr + '-' + mn + '-' + dy) })()}
          className='unstyled'

          onChange={this.handleChangeDate}
        />
      </Grid>

      <ReactTable
        id='branch-table'
        loading={this.state.loading}
        defaultPageSize={5}
        data={attnData}
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
            Header: 'Present',
            accessor: 'branchAttendancePresentCount'
          },
          {
            Header: 'Absent',
            accessor: 'branchAttendanceAbsentCount'
          }, {
            Header: 'unmarked',
            accessor: 'unmarkedBranch'
          }, {
            Header: '%Absent',
            accessor: 'percentageAbsent'
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
)(AttendanceSummaryReport)
