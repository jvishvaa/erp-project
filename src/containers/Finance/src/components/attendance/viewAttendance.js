import React from 'react'
import axios from 'axios'
import { connect } from 'react-redux'
import Calendar from 'react-calendar'
import { Radio, Input } from 'semantic-ui-react'
import moment from 'moment'
import ReactTable from 'react-table'
import Button from '@material-ui/core/Button'
import Modal from '@material-ui/core/Modal'
import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableHead from '@material-ui/core/TableHead'
import TableRow from '@material-ui/core/TableRow'
import Paper from '@material-ui/core/Paper'
import { Tabs, Tab, AppBar, Toolbar, withStyles, Popover, Typography } from '@material-ui/core'
import Grid from '@material-ui/core/Grid'
import PSelect from '../../_components/pselect'
import { COMBINATIONS } from './gSelector'
import GSelect from '../../_components/globalselector'
import { urls } from '../../urls'
import AttendanceSummaryReport from './attendanceSummaryReport'
import { InternalPageStatus } from '../../ui'
import { apiActions } from '../../_actions'

const styles = theme => ({
  root: {
    width: '100%',
    marginTop: theme.spacing.unit * 3,
    overflowX: 'auto',
    borderRight: '1px solid #d0cdcd'
  },
  table: {
    minWidth: 700,
    borderRight: '1px solid #d0cdcd'
  },
  head: {
    backgroundColor: '#144f7b',
    color: theme.palette.common.white,
    borderRight: '1px solid #d0cdcd'
  },
  typography: {
    margin: '10px',
    top: '146.906px',
    left: '274.297px',
    'color': 'purple',
    padding: '5px'
  },
  tableFormat: {
    'text-align': '-webkit-center',
    'borderRight': '1px solid #d0cdcd',
    'border': '1px solid'
  }
})

class CalendarComponentForAttendance extends React.Component {
  constructor (props) {
    super()
    this.state = {
      erp: props.erp,
      currentDate: new Date(),
      attenResMonth: [],
      month: moment(),
      loading: false,
      open: false,
      openModel: false,
      openTable: false,
      openTables: false

    }
    this.getAttendanceForDate = this.getAttendanceForDate.bind(this)
    this.onActiveDateChange = this.onActiveDateChange.bind(this)
    // this.onChange = this.onChange.bind(this)
    // this.get = this.get.bind(this)
    // this.date = this.date.bind(this)
  }
  componentDidMount () {
    let { currentDate } = this.state
    this.getAttendanceMonth(this.state.erp, currentDate.getMonth() + 1, currentDate.getFullYear())
  }
  getAttendanceMonth = (obj, month, year) => {
    this.setState({ loading: true })
    axios
      .get(urls.Attendance + '?student_erp=' + obj + '&month=' + month + '&year=' + year, {
        headers: {
          'Authorization': 'Bearer ' + this.props.user
        }
      })
      .then(res => {
        if (res.status === 200) {
          this.setState({ attenResMonth: res.data, loading: false })
        } else {
          this.setState({ loading: false })
          this.props.alert.error('Attendance Details does not exist for the given Date Range')
        }
      })
      .catch(error => {
        this.setState({ loading: false })
        this.props.alert.error('Error Occured')
        console.log(error)
      })
  }
  onActiveDateChange ({ activeStartDate }) {
    this.getAttendanceMonth(this.state.erp, activeStartDate.getMonth() + 1, activeStartDate.getFullYear())
  }

  getAttendanceForDate ({ date }) {
    let { attenResMonth } = this.state
    let currentDateAttendance = attenResMonth.filter(day => {
      let currentItem = moment(day.attendance_for_date).format('DD/MM/YYYY')
      let currentDate = moment(date).format('DD/MM/YYYY')
      if (currentItem === currentDate) {
        return true
      } else {
        return false
      }
    }
    )
    let arrLength = currentDateAttendance.length
    return (
      <div style={{
        width: '100%',
        minWidth: '2vw',
        display: 'flex',
        justifyContent: 'center',
        color: arrLength
          ? currentDateAttendance[0].is_present ? 'green' : 'red'
          : 'black' }}>
        <p>
          {
            (
              () => {
                if (arrLength) {
                  return currentDateAttendance[0].is_present ? 'Present' : 'Absent'
                }
              }
            )()
          }
        </p>
      </div>
    )
  }

  render () {
    let { attenResMonth = [] } = this.state
    if (!attenResMonth.length) return <InternalPageStatus label='Loading...' />

    return (<Calendar
      onActiveDateChange={(data) => this.onActiveDateChange(data)}
      value={this.state.calDate}
      tileContent={(props) => this.getAttendanceForDate(props)}
      className='my-react-calendar'
    />)
  }
}
class ViewAttendance extends React.Component {
  constructor () {
    super()
    this.state = {
      calDate: new Date(),
      pageId: 1,
      isDelete: false,
      tab: 0,
      activeIndex: 0,
      selectorData: {},
      date: new Date().toISOString().substr(0, 10),
      resultData: [],
      usePowerSelector: false,
      showcolumn: true,
      open: false,
      anchorEl: null,
      anchorEls: null
    }
    this.userProfile = JSON.parse(localStorage.getItem('user_profile'))
    this.onGetAttendance = this.onGetAttendance.bind(this)
    this.handleSelectedata = this.handleSelectedata.bind(this)
    this.getBranchSectionMappingId = this.getBranchSectionMappingId.bind(this)
    // this.DatewisesubComponent = this.DatewisesubComponent.bind(this)
    this.onChange = this.onChange.bind(this)
    // this.getData = this.getData.bind(this)
    this.showcolumn = this.showcolumn.bind(this)
    this.getTRPropsType = this.getTRPropsType.bind(this)
    this.role = this.userProfile.personal_info.role
    // this.onChange = this.onChange.bind(this)
    this.getReportSummary = this.getReportSummary.bind(this)
    this.getXlsReports = this.getXlsReports.bind(this)
    this.getCsvReports = this.getCsvReports.bind(this)
    this.date = this.date.bind(this)
    this.user_id = this.userProfile.personal_info.user_id
  }

  componentDidMount () {
    this.mappingDetails = this.userProfile.academic_profile
    this.role = this.userProfile.personal_info.role
    if (this.role === 'Student') {
      let studentErp = (JSON.parse(localStorage.getItem('user_profile'))).erp
      this.role === 'Student' &&
        studentErp && axios
        .get(
          urls.Attendance + '?student_erp=' + studentErp + '&date=' + this.state.date,
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
                erp: student.student.erp,
                roll_no: student.roll_no,
                is_present: student.is_present,
                remarks: student.remarks
              }
              studentData.push(obj)
            })
            this.setState({ data: studentData })
          } else if (res.status === 204) {
            // let text = res.statusText
            this.props.alert.warning('Attendance is not marked for selected date')
          }
        })
        .catch(error => {
          console.log("Error: Couldn't fetch data from " + urls.GradeMapping, error)
        })
    }
  }

  // onChangeCal = calDate => this.setState({ calDate })

  handleChangeDate = event => {
    this.setState({ date: event.target.value })
  }
  getBranchSectionMappingId (data) {
    let { selectorData: { section_mapping_id: sectionmapingId, branch_id: branch } = {} } = this.state
    // let { section_mapping_id: sectionmapingId, branch_id: branch } = this.state.selectorData
    let { usePowerSelector } = this.state
    // let exporter = new Exporter()
    // usePowerSelector ? (exporter.getBranches()) : 'ghhhh'

    if (usePowerSelector) {
      console.log(this.state.PselectedData)
      if (data === 'section') {
        var secMap = this.state.PselectedData.map(val => {
          console.log(val.sectionMapId)
          return val.sectionMapId
        })
        return secMap
      } else {
        var branchData = this.state.PselectedData.map(val => {
          return val.branchId
        })
        return branchData
      }
    } else {
      console.log(this.state.selectorData)
      if (data === 'section') {
        return sectionmapingId
      } else {
        return branch
      }
    }
  }

  onGetAttendance () {
    let { usePowerSelector } = this.state
    console.log(this.props.filter, usePowerSelector)
    this.setState({
      branchError: false,
      gradeError: false,
      sectionError: false,
      data: []
    })
    let { date } = this.state
    if (this.role !== 'Student') {
      axios
        .get(
          //           urls.Attendance + (this.state.usePowerSelector ? '?acadsectionmapping_id=' + (exporter.getSections()) : '?acadsectionmapping_id=' + this.state.selectorData.section_mapping_id) + '&date=' + date +
          // //           (this.state.usePowerSelector ? '&mapping_acad_branch_grade_id=' + (exporter.getGrades())[0] : '&branch_id=' + this.state.selectorData.branch_id),
          // //           {
          urls.Attendance + '?acadsectionmapping_id=' + this.getBranchSectionMappingId('section') + '&date=' + date,
          {
            headers: {
              Authorization: 'Bearer ' + this.props.user
            }
          }
        )
        .then(res => {
          if (res.status === 200) {
            var studentData = []

            if (usePowerSelector) {
              console.log('usepower----selctor')
              this.setState({ resultData: res.data })
            } else {
              console.log('dont___use----power----selctor')
              res.data.forEach(function (student, index) {
                let obj = {
                  sr: index + 1,
                  id: student.id,
                  name: student.student.name,
                  erp: student.student.erp,
                  roll_no: student.student.roll_no,
                  is_present: student.is_present,
                  remarks: student.remarks
                }
                studentData.push(obj)
              })
              this.setState({ data: studentData })
            }
          } else if (res.status === 204) {
            // let text = res.statusText
            // this.props.alert.warning(text.toString())
            this.props.alert.warning('Attendance is not marked for selected  date')
          }
        })
        .catch(error => {
          if (error.response && error.response.status === 409) {
            this.props.alert.error('Selected Date is a Holiday')
          } else {
            this.props.alert.error('Error Occurred')
          }
          console.log("Error: Couldn't fetch data from " + urls.Attendance, error)
        })
    } else {
      let studentErp = (JSON.parse(localStorage.getItem('user_profile'))).erp
      axios
        .get(
          urls.Attendance + '?student_erp=' + studentErp + '&date=' + date,
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
                erp: student.student.erp,
                roll_no: student.student.roll_no,
                is_present: student.is_present,
                remarks: student.remarks
              }
              studentData.push(obj)
            })
            this.setState({ data: studentData })
          } else if (res.status === 204) {
            // let text = res.statusText
            this.props.alert.warning('Attendance is not marked for selected date')
          }
        })
        .catch(error => {
          console.log("Error: Couldn't fetch data from " + urls.GradeMapping, error)
        })
    }
  }
getStudents = () => {
  let { selectorData } = this.state
  if (selectorData.section_mapping_id && this.role !== 'Student' && this.state.tab === 1) {
    axios
      .get(urls.Students + '?acadsectionmapping=' + selectorData.section_mapping_id, {
        headers: {
          Authorization: 'Bearer ' + this.props.user
        }
      })
      .then(res => {
        var studentDataList = []
        res.data.result.forEach(function (student, index) {
          let obj = {
            sr: index + 1,
            student_id: student.id,
            name: student.name,
            erp: student.erp
          }
          studentDataList.push(obj)
        })
        this.setState({ dataList: studentDataList, mode: 'mark', attnData: null, showTableUpdate: false, showTable: true })
      })
      .catch(error => {
        console.log("Error: Couldn't fetch data from " + urls.Student, error)
      })
  }
}
  onChange = (data) => {
    if (this.state.tab === 0 && this.role !== 'Student') {
      let { selectorData } = this.state
      console.log(selectorData, data)
      this.setState({ selectorData: { section_mapping_id: data.section_mapping_id, branch_id: data.branch_id, grade_id: data.grade_id } }, () => console.log(this.state.selectorData))

      this.setState({ selectorData: data, data: [], resultData: [] })
    } else if (this.state.tab === 1 && this.role !== 'Student  ') {
      let { selectorData } = this.state
      console.log(selectorData, data)
      this.setState({ selectorData: data, dataList: [], resultData: [] })
      this.setState({ selectorData: { section_mapping_id: data.section_mapping_id, branch_id: data.branch_id, grade_id: data.grade_id } }, () => console.log(this.state.selectorData))
      console.log('elseee', data.branch_id, data.grade_id, data.section_mapping_id)
    }
  }
  subComponent = ({ original, row }) => {
    let obj = original
    return <div >
      <CalendarComponentForAttendance
        erp={obj.erp}
        alert={this.props.alert}
        user={this.props.user}

      />
    </div>
  }

  decideTab=() => {
    if (this.state.tab === 0) {
      return this.getDateWiseTabContent()
    } else if (this.state.tab === 1) {
      return this.getMonthWiseTabContent()
    } else if (this.state.tab === 2) {
      return this.getSummaryReportTabContent()
    }
  }
  handleSelectedata () {
    var selectedata = this.props.filter && this.props.filter.data &&
      Object.values(this.props.filter.data.itemData).map((value, index) => {
        return { branchId: value.branch_id,
          sectionMapId: value.id
        }
        // console.log(value.id, 'section___mapinggg__id')
      })
    console.log(selectedata, this.props.filter)
    this.setState({ PselectedData: selectedata, usePowerSelector: true })
  }

  showcolumn () {
    let { resultData } = this.state
    if (resultData && resultData.length > 0) {
      let v = resultData.some(v => v.branch_name)
      console.log(v)
      if (v) {
        return v
      } else {
        return v
      }
    } else {
      return false
    }
  }
  getTRPropsType (state, rowInfo, column) {
    // console.log(state, rowInfo, column, 'getrowwww')
    let { resultData, data } = this.state
    if ((data && data.length) || (resultData && resultData.length > 0)) {
      if (rowInfo && rowInfo.index % 2 === 0) {
        return {
          style: {
            background: '#d5e1df'
          }
        }
      } else {
        return {
          style: {
            background: '#deadb3'
          }
        }
      }
    }
  }

  getDateWiseTabContent = () => {
    let { data, date, resultData } = this.state
    console.log(resultData, resultData.length, 'resdaat')
    return (
      <React.Fragment>
        <Grid container >
          {this.role !== 'Student'
            ? <Grid style={{ marginLeft: 4 }} item>
              <GSelect config={COMBINATIONS} variant={'filter'} onChange={this.onChange} />
            </Grid> : ''}
          <Grid style={{ padding: 10 }} >
            <div className='ui label'>
              <p style={{ fontSize: '16px' }}> Date :</p>
            </div>
            <Input
              type='date'
              value={date}
              max={(() => { let tdy = new Date(); let yr = tdy.getFullYear(); let mn = String(tdy.getMonth() + 1).padStart(2, '0'); let dy = String(tdy.getDate()).padStart(2, '0'); return (yr + '-' + mn + '-' + dy) })()}

              onChange={this.handleChangeDate}
            />
          </Grid>
          <Grid >
            <Button variant='contained' style={{ marginTop: 10 }} color='primary'
              disabled={this.role !== 'Student' ? (!this.state.usePowerSelector && ((this.state.selectorData && !this.state.selectorData.branch_id) ||
            (this.state.selectorData && !this.state.selectorData.grade_id) ||
            (this.state.selectorData && !this.state.selectorData.section_mapping_id))) : ''}
              onClick={this.onGetAttendance}>
Get Attendance
            </Button>
          </Grid>
        </Grid>
        { (this.role === 'Admin' || this.role === 'BDM') &&
        <Grid style={{ margin: '8px', 'font-size': '13px', justify: 'center' }}>
          <span>OR</span>
        </Grid>
        }
        <Grid>
          { (this.role === 'Admin' || this.role === 'BDM') &&
          <PSelect section onClick={(e) => {
            this.handleSelectedata()
          }} />}</Grid>
        {this.state.tab === 0 && ((data && data.length > 0) || (resultData && resultData.length > 0)) && (
          // console.log(resultData.result_data)
          <div style={{ padding: '20px' }}>
            <ReactTable
              data={this.state.usePowerSelector ? resultData : data}

              style={{ fontFamily: 'Arial', fontSize: '1.15rem', fontWeight: 'bold' }}
              // SubComponent={this.state.usePowerSelector ? this.DatewisesubComponent : ''}

              columns={[
                {
                  Header: 'Sr.',
                  accessor: 'id',
                  Cell: (row) => {
                    return <div>{row.index + 1}</div>
                  },
                  minWidth: 60
                },
                {
                  show: this.showcolumn(),
                  Header: 'Branch',

                  accessor: 'branch_name',
                  minWidth: 100

                },
                {
                  show: this.showcolumn(),
                  Header: 'Grade',

                  accessor: 'grade',
                  minWidth: 100
                },
                {
                  show: this.showcolumn(),
                  Header: 'section',

                  accessor: 'section',
                  minWidth: 100
                },
                {
                  Header: 'Roll No',
                  accessor: data && data.length > 0 ? 'roll_no' : 'student.roll_no',
                  Cell: props => <span>{props.original.result_data ? <span style={{ color: 'red', position: 'absolute' }}>{props.original.result_data} </span> : props.value}</span>,
                  minWidth: 100
                },
                {
                  Header: 'Student Name',
                  accessor: data && data.length > 0 ? 'name' : 'student.name',
                  filterable: true,
                  minWidth: 100
                },
                {
                  Header: 'ERP',

                  accessor: data && data.length > 0 ? 'erp' : 'student.erp',
                  minWidth: 100
                },
                {
                  Header: 'Attendance',
                  accessor: d => (
                    !d.result_data && <Radio toggle checked={d.is_present} />
                  ),
                  id: 'attendance',
                  minWidth: 100
                },
                {
                  Header: 'Remarks',
                  accessor: 'remarks',
                  minWidth: 100
                }

              ]
              }
              getTrProps={this.getTRPropsType}
              pageSize={data.length || resultData.length}
              className='-evenly-striped'
              showPagination={false}
            />
            <br />
          </div>
        )}

      </React.Fragment>
    )
  }
  getSummaryReportTabContent = () => {
    return (
      this.role === 'Admin' ||
       this.role === 'Principal' || this.role === 'FOE' || this.role === 'CFO'
    ) &&
    <div><AttendanceSummaryReport alert={this.props.alert} /></div>
  }
  getMonthWiseTabContent =() => {
    return (
      <React.Fragment>
        {this.role !== 'Student'
          ? <React.Fragment>
            <Toolbar >
              <Grid style={{ marginLeft: 4 }} item>
                <GSelect config={COMBINATIONS} variant={'filter'} onChange={this.onChange} />

              </Grid>
              <Button variant='contained' style={{ marginTop: 10 }} disabled={(this.state.selectorData && !this.state.selectorData.branch_id) ||
            (this.state.selectorData && !this.state.selectorData.grade_id) ||
            (this.state.selectorData && !this.state.selectorData.section_mapping_id)} color='primary' onClick={this.getStudents}>
          Get Students
              </Button>
              &nbsp; &nbsp;
              <Button variant='outlined'style={{ marginTop: 10 }} color='primary' onClick={this.handleOpen}>
Attendance Report
              </Button>
            </Toolbar>
            <ReactTable
              // id='table1'
              // defaultPageSize={5}
              // style={{ fontFamily: 'Arial', fontSize: '1.15rem', fontWeight: 'bold' }}

              data={this.state.dataList}
              SubComponent={this.subComponent}
              columns={[
                {
                  Header: 'Sr.',
                  accessor: 'sr'
                },
                {
                  Header: 'Roll No',
                  accessor: 'roll_no'
                },

                {
                  Header: 'Student Name',
                  accessor: 'name'
                },
                {
                  Header: 'ERP',
                  accessor: 'erp'
                }

              ]}
            />
          </React.Fragment>

          : <div style={{ margin: '120px', height: '100%', maxWidth: '100%' }}>
            <CalendarComponentForAttendance
              erp={this.userProfile.erp}
              alert={this.props.alert}
              user={this.props.user}
            />
          </div>
        }
      </React.Fragment>
    )
  }

  handleTabChange = (event, value) => {
    this.setState({ tab: value, data: [], dataList: [], resultData: [] })
  }
  handleOpen = () => {
    this.setState({ open: true })
    console.log('clicked second')
  };
  handleCloseModel1 = () => {
    this.setState({ open: false })
  };

  handleCloseModel = () => {
    this.setState({ openModel: false })
  };

  handleClose = () => {
    this.setState({ anchorEl: null, openTable: false })
  };
  handleCloseMonthwiseSummary = () => {
    console.log('hello')

    this.setState({ anchorEls: null, openTables: false })
  };
  getCsvReports = (id) => {
    let { selectorData } = this.state
    // let { monthwiseAttendanceReport } = urls
    // console.log(monthwiseAttendanceReport, 'mon')
    // let hrefLink = monthwiseAttendanceReport
    // console.log(hrefLink, 'ki')
    let path = ''
    if (selectorData.section_mapping_id) {
      let sectionId = selectorData.section_mapping_id
      path += `?section_mapping_id=${sectionId}`
      path += `&type=${'csv'}`
      this.getCsvPercentageWise(path)
    } else if (selectorData.acad_branch_grade_mapping_id) {
      let gradeId = selectorData.acad_branch_grade_mapping_id
      path += `?acad_branch_grade_mapping_id=${gradeId}`
      path += `&type=${'csv'}`
      this.getCsvPercentageWise(path)
    } else if (selectorData.branch_id) {
      let branchId = selectorData.branch_id
      path += `?branch_id=${branchId}`
      path += `&type=${'csv'}`
      this.getCsvPercentageWise(path)
    }
    // return path
  }
  getCsvPercentageWise =(path) => {
    axios.get(`${urls.percentageWiseReport}${path}`, {
      responseType: 'arraybuffer',
      headers: {
        Authorization: 'Bearer ' + this.props.user,
        'Content-Type': 'application/json'
      }
    })
      .then(res => {
        console.log(res.data)
        var blob = new Blob([res.data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' })
        var link = document.createElement('a')
        link.href = window.URL.createObjectURL(blob)
        link.download = 'percentage_Report_attendence_report.csv'
        link.click()
      })
      .catch(err => {
        console.log(err)
        // logError(err)
      })
  }
  getXlsReports = (id) => {
    let { selectorData } = this.state
    // let { selectorData } = this.state
    // let { monthwiseAttendanceReport } = urls
    // console.log(monthwiseAttendanceReport, 'mon')
    // let hrefLink = monthwiseAttendanceReport
    // console.log(hrefLink, 'ki')
    let path = ''
    if (selectorData.section_mapping_id) {
      let sectionId = selectorData.section_mapping_id
      path += `?section_mapping_id=${sectionId}`
      path += `&type=${'xls'}`
      this.getxlsPercentageWise(path)
    } else if (selectorData.acad_branch_grade_mapping_id) {
      let gradeId = selectorData.acad_branch_grade_mapping_id
      path += `?acad_branch_grade_mapping_id=${gradeId}`
      path += `&type=${'xls'}`
      this.getxlsPercentageWise(path)
    } else if (selectorData.branch_id) {
      let branchId = selectorData.branch_id
      path += `?branch_id=${branchId}`
      path += `&type=${'xls'}`
      this.getxlsPercentageWise(path)
    }
    // return path
  }
  getxlsPercentageWise =(path) => {
    axios.get(`${urls.percentageWiseReport}${path}`, {
      responseType: 'arraybuffer',
      headers: {
        Authorization: 'Bearer ' + this.props.user,
        'Content-Type': 'application/json'
      }
    })
      .then(res => {
        console.log(res.data)
        var blob = new Blob([res.data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' })
        var link = document.createElement('a')
        link.href = window.URL.createObjectURL(blob)
        link.download = 'percentage_Report_attendence_report.xls'
        link.click()
      })
      .catch(err => {
        console.log(err)
        // logError(err)
      })
  }
  getMonthWiseReport = (path) => {
    this.setState({ loading: true })
    axios.get(`${urls.monthwiseAttendanceReport}${path}`, {
      headers: {
        Authorization: 'Bearer ' + this.props.user,
        'Content-Type': 'application/json'
      }
    })
      .then(res => {
        this.setState({
          loading: false,
          monthWiseAttendance: res.data
        })
        console.log(res.data.erp)
        console.log(this.state.percent)
      })
      .catch(error => {
        this.setState({ loading: false })
        console.log(error)
      })
  }
  onChange (data) {
    let { selectorData } = this.state
    console.log(selectorData, data)
    this.setState({ selectorData: data })
  }
  date (props) {
    for (const i in props) {
      return props
    }
    return props
  }
  getPercentageCount =(e) => {
    const value = JSON.parse(e.target.value)
    console.log(value.percentage_count)
    console.log(e.target)
    var input = document.getElementById('per')
    var input1 = document.getElementById('per1')

    input.value = value.percentage_count
    input1.value = value.percentage_count
    console.log(input, input1)
    this.setState({ percent: input1.value })

    this.setState({ perCount: value.percentage_count })
  }
  getData=() => {
    console.log('onchange')
  }
  handleClick = event => {
    this.setState({
      anchorEl: event.currentTarget
    })
  };
  handleClicked = event => {
    this.setState({
      anchorEl: event.currentTarget
    })
  };
  handleClickMonthwiseSummary = event => {
    this.setState({
      anchorEls: event.currentTarget
    })
  };
  getReportSummary (pageNumber) {
    console.log(this.state.selectorData, 'sssssssssssssssssssssss')
    let { selectorData } = this.state
    let path = ''
    if (selectorData.section_mapping_id) {
      let sectionId = selectorData.section_mapping_id
      path += `?section_mapping_id=${sectionId}`
      path += `&type=${'json'}`
      this.getMonthWiseReport(path)
    } else if (selectorData.acad_branch_grade_mapping_id) {
      let gradeId = selectorData.acad_branch_grade_mapping_id
      path += `?acad_branch_grade_mapping_id=${gradeId}`
      path += `&type=${'json'}`
      this.getMonthWiseReport(path)
    } else if (selectorData.branch_id) {
      let branchId = selectorData.branch_id
      path += `?branch_id=${branchId}`
      path += `&type=${'json'}`
      this.getMonthWiseReport(path)
    }
  }
  handleCsvReports = (id) => {
    console.log(this.state.selectorData, 'shivesh testing onclick')
    let { selectorData } = this.state
    let path = ''
    if (selectorData.section_mapping_id) {
      let sectionId = selectorData.section_mapping_id
      path += `?section_mapping_id=${sectionId}`
      path += `&type=${'csv'}`
      this.downloadCsvReport(path)
      console.log(path, 'testing path 21..s')
    } else if (selectorData.acad_branch_grade_mapping_id) {
      let gradeId = selectorData.acad_branch_grade_mapping_id
      path += `?acad_branch_grade_mapping_id=${gradeId}`
      path += `&type=${'csv'}`
      this.downloadCsvReport(path)
    } else if (selectorData.branch_id) {
      let branchId = selectorData.branch_id
      path += `?branch_id=${branchId}`
      path += `&type=${'csv'}`
      this.downloadCsvReport(path)
    }
  }
  downloadCsvReport = (path) => {
    axios.get(`${urls.monthwiseAttendanceReport}${path}`, {
      responseType: 'arraybuffer',
      headers: {
        Authorization: 'Bearer ' + this.props.user,
        'Content-Type': 'application/json'
      }
    })
      .then(res => {
        console.log(res.data)
        var blob = new Blob([res.data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' })
        var link = document.createElement('a')
        // eslint-disable-next-line no-debugger
        // debugger
        link.href = window.URL.createObjectURL(blob)
        link.download = 'monthly_Summary_attendence_report.csv'
        link.click()
      })
      .catch(err => {
        console.log(err)
        // logError(err)
      })
  }
  handletXlsReports = (id) => {
    let { selectorData } = this.state
    let path = ''
    // let { percentageWiseReport } = urls
    // console.log(percentageWiseReport, 'mon')
    // let hrefLink = percentageWiseReport
    if (selectorData.section_mapping_id) {
      let sectionId = selectorData.section_mapping_id
      path += `?section_mapping_id=${sectionId}`
      path += `&type=${'xls'}`
      console.log(path, 'hre')
      this.downloadXlsReport(path)
    } else if (selectorData.acad_branch_grade_mapping_id) {
      let gradeId = selectorData.acad_branch_grade_mapping_id
      path += `?acad_branch_grade_mapping_id=${gradeId}`
      path += `&type=${'xls'}`
      this.downloadXlsReport(path)
    } else if (selectorData.branch_id) {
      let branchId = selectorData.branch_id
      path += `?branch_id=${branchId}`
      path += `&type=${'xls'}`
      this.downloadXlsReport(path)
    }
  }
  downloadXlsReport = (path) => {
    axios.get(`${urls.monthwiseAttendanceReport}${path}`, {
      responseType: 'arraybuffer',
      headers: {
        Authorization: 'Bearer ' + this.props.user,
        'Content-Type': 'application/json'
      }
    })
      .then(res => {
        console.log(res.data)
        var blob = new Blob([res.data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' })
        var link = document.createElement('a')
        // eslint-disable-next-line no-debugger
        // debugger
        link.href = window.URL.createObjectURL(blob)
        link.download = 'monthly_Summary_attendence_report.xls'
        link.click()
      })
      .catch(err => {
        console.log(err)
        // logError(err)
      })
  }
  render () {
    console.log(this.state.resultData, 'ree')
    const { classes } = this.props
    console.log(classes)
    let open = Boolean(this.state.anchorEl)
    let id = open ? 'simple-popover' : undefined
    let openMonthwiseSummary = Boolean(this.state.anchorEls)
    let ids = openMonthwiseSummary ? 'simple-popover' : undefined

    return (
      <React.Fragment>
        <div>

          <Modal
            open={this.state.open}
            onClose={this.handleCloseModel1}
          >
            <div style={{ backgroundColor: 'white', width: '90%', height: '80vh', position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', overflow: 'scroll', padding: 20 }}>

              <Grid container >
                <Grid style={{ marginLeft: 4 }} i tem>
                  <GSelect config={COMBINATIONS} variant={'filter'} onChange={this.onChange} />

                </Grid>
                &nbsp; &nbsp;
                <Button variant='outlined' style={{ marginTop: 16 }} color='primary' onClick={this.handleClicked}

                >
Percentage Report
                </Button>

                <Popover
                  id={id}
                  open={open}
                  anchorEl={this.state.anchorEl}
                  onClose={this.handleClose}
                  anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'center'
                  }}
                  transformOrigin={{
                    vertical: 'top',
                    horizontal: 'center'
                  }}
                >
                  <Typography >
                    <Button
                      style={{ ' margin-top': '-9px' }}
                      color='primary'
                      onClick={this.getReportSummary}
                      target='_blank'>
Show Summary Report
                    </Button>
                  </Typography>
                  <Typography>
                    <Button
                      style={{ ' margin-top': '-9px' }}
                      color='primary'
                      onClick={this.getCsvReports}
                      target='_blank'>
Download CSV
                    </Button>
                  </Typography>
                  <Button
                    style={{ ' margin-top': '-9px' }}
                    color='primary'
                    onClick={this.getXlsReports}
                    target='_blank'>
Download Excel
                  </Button>
                </Popover>
                &nbsp; &nbsp;
                <Button variant='outlined' style={{ marginTop: 16 }} color='primary' onClick={this.handleClickMonthwiseSummary}

                >
Monthly Summary
                </Button>
                <Popover
                  id={ids}
                  open={openMonthwiseSummary}
                  anchorEl={this.state.anchorEls}
                  onClose={this.handleCloseMonthwiseSummary}
                  anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'center'
                  }}
                  transformOrigin={{
                    vertical: 'top',
                    horizontal: 'center'
                  }}
                >
                  <Typography >
                    <Button
                      style={{ ' margin-top': '-9px' }}
                      color='primary'
                      onClick={this.getReportSummary}
                      target='_blank'>
                          Show Summary Report
                    </Button>
                  </Typography>
                  <Typography>
                    <Button
                      style={{ ' margin-top': '-9px' }}
                      color='primary'
                      onClick={this.handleCsvReports}
                      target='_blank'>
                          Download CSV
                    </Button>
                  </Typography>
                  <Button
                    style={{ ' margin-top': '-9px' }}
                    color='primary'
                    onClick={this.handletXlsReports}
                    target='_blank'>
                        Download Excel
                  </Button>

                </Popover>
              </Grid>
              {this.state.monthWiseAttendance && <Paper className={classes.root}>
                <Table className={classes.table} aria-label='spanning table'>
                  <TableHead>
                    <TableRow>
                      <TableCell className={classes.tableFormat} style={{ background: '#3d7198' }} colSpan={5} />
                      { this.state.monthWiseAttendance && this.state.monthWiseAttendance.map(row => (
                        row['attendance'].map(i => {
                          return (

                            <TableCell className={classes.tableFormat} style={{ 'font-size': '16px', background: '#3d7198' }} colSpan={3} >{i.date}</TableCell>
                          )
                        }
                        )

                      ))[0]
                      }
                    </TableRow>
                    <TableRow>
                      <TableCell className={classes.tableFormat} style={{ 'font-size': '16px' }} >ERP</TableCell>
                      <TableCell className={classes.tableFormat} style={{ 'font-size': '16px' }} >Name</TableCell>
                      <TableCell className={classes.tableFormat} style={{ 'font-size': '16px' }} >Branch</TableCell>
                      <TableCell className={classes.tableFormat} style={{ 'font-size': '16px' }} >Grade</TableCell>
                      <TableCell className={classes.tableFormat} style={{ 'font-size': '16px' }} >Section</TableCell>
                      { this.state.monthWiseAttendance && this.state.monthWiseAttendance.map(row => (
                        row['attendance'].map(i => {
                          return (

                            <React.Fragment key={i.date}>

                              <TableCell className={classes.tableFormat} style={{ 'font-size': '16px' }} align='right'>Percentage Count</TableCell>
                              <TableCell className={classes.tableFormat} style={{ 'font-size': '16px' }} align='right'>Present Days</TableCell>
                              <TableCell className={classes.tableFormat} style={{ 'font-size': '16px' }}align='right'>Total Days</TableCell>
                            </React.Fragment>)
                        }
                        )

                      ))[0]
                      }

                    </TableRow>
                  </TableHead>
                  <TableBody>
                    { this.state.monthWiseAttendance && this.state.monthWiseAttendance.map(
                      row => (
                        <TableRow key={row.erp
                        } >
                          <TableCell className={classes.tableFormat} >{row.erp}</TableCell>
                          <TableCell className={classes.tableFormat} >{row.name}</TableCell>
                          <TableCell className={classes.tableFormat} >{row.school}</TableCell>
                          <TableCell className={classes.tableFormat} >{row.grade}</TableCell>
                          <TableCell className={classes.tableFormat} >{row.section}</TableCell>
                          {
                            row['attendance'].map(i => {
                              return (
                                <React.Fragment>
                                  <TableCell className={classes.tableFormat} key={i.date}>
                                    {i.percentage_count}
                                  </TableCell>
                                  <TableCell className={classes.tableFormat} key={i.date}>
                                    {i.present_days}
                                  </TableCell>
                                  <TableCell className={classes.tableFormat} key={i.date}>
                                    {i.total_days}
                                  </TableCell>
                                </React.Fragment>

                              )
                            }
                            )
                          }

                        </TableRow >
                      )

                    )

                    }
                  </TableBody>
                </Table>
              </Paper>}
            </div>
          </Modal>
        </div>

        <Grid item xs={12}>
          <AppBar style={{ backgroundColor: '#f0f0f0' }} elevation={0} position='static'>
            <Tabs
              value={this.state.tab}
              onChange={this.handleTabChange}
              indicatorColor='primary'
              textColor='primary'
              variant='fullWidth'
            >
              {this.role === 'Student' || this.role === 'Teacher' || this.role === 'FOE' || this.role === 'BDM' || this.role === 'Admin' || this.role === 'Principal' || this.role === 'AcademicCoordinator' || this.role === 'LeadTeacher' || this.role === 'CFO'
                ? <Tab label='Datewise' />
                : ''}<Tab label='Monthwise' />
              {this.role === 'Admin' || this.role === 'Principal' || this.role === 'FOE' || this.role === 'CFO'
                ? <Tab label='SummaryReport' /> : ''}

            </Tabs>
          </AppBar>
        </Grid>
        {this.decideTab()}

      </React.Fragment>
    )
  }
}

const mapStateToProps = state => ({
  user: state.authentication.user,
  grades: state.gradeMap.items,
  gradeLoading: state.gradeMap.loading,
  sections: state.sectionMap.items,
  branches: state.branches.items,
  sectionLoading: state.sectionMap.loading,
  filter: state.filter
})

const mapDispatchToProps = dispatch => ({
  loadBranches: () => dispatch(apiActions.listBranches()),
  gradeMapBranch: branchId => dispatch(apiActions.getGradeMapping(branchId)),
  sectionMap: acadId => dispatch(apiActions.getSectionMapping(acadId))
})
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(ViewAttendance))
