import React from 'react'
import axios from 'axios'
import { Radio, Input } from 'semantic-ui-react'
import { connect } from 'react-redux'
import ReactTable from 'react-table'

import moment from 'moment'
import Button from '@material-ui/core/Button'
import Tooltip from '@material-ui/core/Tooltip'
import Grid from '@material-ui/core/Grid'
import { Chip, withStyles, Drawer, Checkbox } from '@material-ui/core'
import Stepper from '@material-ui/core/Stepper'
import Step from '@material-ui/core/Step'
import StepLabel from '@material-ui/core/StepLabel'
import StepContent from '@material-ui/core/StepContent'
import Paper from '@material-ui/core/Paper'
import Typography from '@material-ui/core/Typography'
import 'react-table/react-table.css'
import { AlertMessage, InternalPageStatus } from '../../ui'
import { urls } from '../../urls'
import { apiActions } from '../../_actions'
import { COMBINATIONS } from './gSelector'
import GSelect from '../../_components/globalselector'
import './disable-calendar-picker.css'

const styles = theme => ({
  root: {
    width: '90%'
  },
  button: {
    marginTop: theme.spacing.unit,
    marginRight: theme.spacing.unit
  },
  actionsContainer: {
    marginBottom: theme.spacing.unit * 2
  },
  resetContainer: {
    padding: theme.spacing.unit * 3
  },
  drawer: {
    width: '700px'
  }
})
function getSteps () {
  return ['Select Date', 'Select Absent Students'
  ]
}
function getStepContent (step) {
  switch (step) {
    case 0:
      return `Select Date`
    case 1:
      return `Select Student to send message`
    default:
      return 'Unknown step'
  }
}

class Attendance extends React.Component {
  constructor () {
    super()
    this.state = {
      newMessage: false,
      right: false,
      activeStep: 0,
      absenteesCount: 0,
      absenteesRollNoList: [],
      showTable: false,
      showTableUpdate: false,
      isActive: true,
      currentDate: new Date(),
      date: new Date().toISOString().substr(0, 10),
      loading: false,
      absentStudent: [],
      selectedStudentId: [],
      clicked: false

    }
    this.updatedId = []
    this.userProfile = JSON.parse(localStorage.getItem('user_profile'))
    this.handleRemarkChange = this.handleRemarkChange.bind(this)
    this.onSubmitAttendamce = this.onSubmitAttendamce.bind(this)
    this.onUpdateAttendamce = this.onUpdateAttendamce.bind(this)
    this.getStudent = this.getStudent.bind(this)
    this.onChange = this.onChange.bind(this)
    this.handleChangeCheck = this.handleChangeCheck.bind(this)
    this.handleAdd = this.handleAdd.bind(this)
  }

  getStudent =() => {
    this.setState({ loading: true, absenteesRollNoList: [], absenteesCount: 0 })
    let { absenteesRollNoList, absenteesCount } = this.state
    let date = this.state.date ? moment(this.state.date).format('YYYY-MM-DD') : null
    let newAbsenteesRollNoList = absenteesRollNoList
    axios
      .get(
        urls.Attendance + '?acadsectionmapping_id=' + this.state.selectorData.acadsectionmapping_id + '&date=' + date,
        // + '&branch_id=' + this.state.selectorData.branch_id,
        {
          headers: {
            Authorization: 'Bearer ' + this.props.user
          }
        }
      )
      .then(res => {
        if (res.status === 200 && res.data.length > 0) {
          var studentData = []
          var count = 0
          newAbsenteesRollNoList = []
          res.data.forEach(function (student, index) {
            let obj = {
              sr: index + 1,
              id: student.id,
              name: student.student.name,
              erp: student.student.erp,
              roll_no: student.student.roll_no,
              is_present: student.is_present,
              remarks: student.remarks ? student.remarks : ''
            }
            studentData.push(obj)
            if (obj.is_present === false) {
              newAbsenteesRollNoList.push(obj.roll_no)
              console.log('new', newAbsenteesRollNoList)
              count = count + 1
              console.log('count value in loop', count)
              // newAbsenteesRollNoList.length
            }
          })
          console.log('count', count)
          absenteesCount = count

          this.setState({ newAbsenteesRollNoList: [], absenteesCount, absenteesRollNoList: newAbsenteesRollNoList, loading: false, attnData: studentData, mode: 'edit', data: null, showTableUpdate: true, showTable: false })
        } else if (res.status === 204) {
          let date = this.state.date
          this.setState({ loading: true, absenteesRollNoList: [], absenteesCount: 0 })
          axios
            .get(urls.StudentAttendance + '?acadsectionmapping=' + this.state.selectorData.acadsectionmapping + '&date=' + date + '&is_active=' + this.state.isActive, {
              headers: {
                Authorization: 'Bearer ' + this.props.user
              }
            })
            .then(res => {
              var studentData = []
              res.data.forEach(function (student, index) {
                let obj = {
                  sr: index + 1,
                  student_id: student.id,
                  name: student.name,
                  erp: student.erp,
                  roll_no: student.roll_no,
                  is_present: true,
                  remarks: ''
                }
                studentData.push(obj)
              })
              this.setState({ loading: false, data: studentData, mode: 'mark', attnData: null, showTableUpdate: false, showTable: true })
            })
            .catch(error => {
              this.setState({ loading: false })

              console.log("Error: Couldn't fetch data from " + urls.Student, error)
            })
        }
        this.setState({ clicked: true })
      })
      .catch(error => {
        if (error.response && error.response.status === 409) {
          this.setState({ loading: false })

          this.props.alert.error('Selected Date is a Holiday')
        } else {
          this.setState({ loading: false })

          this.props.alert.error('Error Occurred')
        }
        console.log("Error: Couldn't fetch data from " + urls.Attendance, error)
      })
  }

  handleRemarkChange = (id, event) => {
    let { mode, data, attnData } = this.state
    if (mode === 'mark') {
      let dataCopy = data
      dataCopy.forEach(function (student) {
        if (student.student_id === id) {
          student['remarks'] = event.target.value
        }
      })
      this.setState({ data: dataCopy })
    } else {
      if (!this.updatedId.includes(id)) {
        this.updatedId.push(id)
      }

      let dataCopy = attnData
      dataCopy.forEach(function (student) {
        if (student.id === id) {
          student['remarks'] = event.target.value
        }
      })
      this.setState({ attnData: dataCopy })
    }
  }
  handleCounter=(checked, rollNo) => {
    let { absenteesRollNoList } = this.state
    if (checked === false) {
      console.log(this.state.absenteesCount + 1, 'absentcouunt')
      let abseentCount = this.state.absenteesCount + 1
      this.setState({ absenteesCount: abseentCount, absenteesRollNoList: [...this.state.absenteesRollNoList, rollNo] })
    } else {
      let newRollNoList = absenteesRollNoList
      let elementIndex = newRollNoList.indexOf(rollNo)
      if (elementIndex !== -1) {
        newRollNoList.splice(elementIndex, 1)
      }

      console.log(this.state.absenteesCount - 1, 'negitiveabsentcount')
      let abseentCount = this.state.absenteesCount - 1
      this.setState({ absenteesCount: abseentCount, absenteesRollNoList: newRollNoList })
    }
  }

  handleToggle = (rollNo, id, e, i) => {
    let { mode, data, attnData } = this.state
    this.handleCounter(i.checked, rollNo)

    if (mode === 'mark') {
      let dataCopy = data
      dataCopy.forEach((student) => {
        if (student.student_id === id) {
          if (i.checked) {
            student['is_present'] = true
          } else {
            student['is_present'] = false
          }
        }
      })
      this.setState({ data: dataCopy })
    } else {
      if (!this.updatedId.includes(id)) {
        this.updatedId.push(id)
      }
      let dataCopy = attnData
      dataCopy.forEach(function (student) {
        if (student.id === id) {
          if (i.checked) {
            student['is_present'] = true
          } else {
            student['is_present'] = false
          }
        }
      })
      this.setState({ attnData: dataCopy })
    }
  }

  onSubmitAttendamce () {
    this.setState({ loading: true, absenteesRollNoList: [], absenteesCount: 0 })
    const { selectorData, date, data } = this.state
    let attendanceData = {
      acadsectionmapping_id: selectorData.acadsectionmapping_id,
      user_id: this.userProfile.personal_info.user_id,
      Attendance_for_Date: date,
      Attendance_details: data
    }

    axios
      .post(urls.Attendance, attendanceData, {
        headers: {
          Authorization: 'Bearer ' + this.props.user
        }
      })
      .then(res => {
        if (res.status === 200) {
          this.setState({ loading: false })

          this.props.alert.success(res.data)
          this.getStudent()
        }
      })
      .catch(error => {
        this.setState({ loading: false })

        console.log("Error: Couldn't fetch data from " + urls.GradeMapping, error)
      })
  }

  onUpdateAttendamce () {
    if (this.updatedId.length > 0) {
      let { attnData, selectorData } = this.state
      let stduentData = []
      let that = this
      attnData.forEach(function (student) {
        if (that.updatedId.includes(student.id)) {
          stduentData.push(student)
        }
      })
      let attendanceData = {
        acadsectionmapping_id: selectorData.acadsectionmapping_id,
        user_id: this.userProfile.personal_info.user_id,
        Attendance_details: stduentData
      }
      this.setState({ loading: true
        // , absenteesRollNoList: [], absenteesCount: 0
      })

      axios
        .put(urls.Attendance, attendanceData, {
          headers: {
            Authorization: 'Bearer ' + this.props.user
          }
        })
        .then(res => {
          if (res.status === 200) {
            this.setState({ loading: false })

            this.props.alert.success(res.data)
            this.updatedId = []
          }
        })
        .catch(error => {
          this.setState({ loading: false })
          console.log("Error: Couldn't fetch data from " + urls.GradeMapping, error)
        })
    }
  }
  onChange = (data) => {
    this.setState({ absenteesRollNoList: [], absenteesCount: 0, data: [], studentData: [], showTable: false, showTableUpdate: false
    })
    this.setState({ selectorData: { acadsectionmapping: data.section_mapping_id, acadsectionmapping_id: data.section_mapping_id, branch_id: data.branch_id, grade_id: data.grade_id } }, () => console.log(this.state.selectorData))
  }
handleDate = (e) => {
  this.setState({ absenteesRollNoList: [], absenteesCount: 0, data: [], attnDate: [], date: e.target.value })
}
toggleNewMessage = (e) => {
  this.setState({ newMessage: true, anchorEl: e.currentTarget })
}
handleNext = () => {
  const { activeStep } = this.state

  this.setState({ studentError: false })

  if (activeStep === 1) {
    if (this.state.selectedStudentId.length === 0) {
      this.setState({ studentError: true })
      return
    }
  }
  this.setState(state => ({
    activeStep: state.activeStep + 1
  }))
};

handleBack = () => {
  this.setState(state => ({
    activeStep: state.activeStep - 1
  }))
};
handleAdd () {
  // var that = this
  let { selectedStudentId } = this.state
  let date = this.state.date ? moment(this.state.date).format('DD-MM-YYYY') : null
  console.log(this.state, 'this.styate')
  let obj = {
    s_id: selectedStudentId,
    date: date
  }

  axios
    .post(urls.AbsentStudent, JSON.stringify(obj), {
      headers: {
        'Authorization': 'Bearer ' + this.props.user,
        // 'Content-Type': 'multipart/formData'
        'Content-Type': 'application/json'

      }
    })
    .then(res => {
      if (res.status === 200) {
        this.props.alert.success('SMS Sent')
        this.setState({ studentError: true })
      } else {
        this.props.alert.error('Error occured')
      }
    })
    .catch(error => {
      this.props.alert.error('Error occureds')
      console.log(error)
    })
}
handleChangeCheck (event, id) {
  let dataCopy = this.state.attnData
  console.log(dataCopy, 'cop')
  let student = dataCopy.filter((student) => student.erp === id)[0]
  this.setState({ data: dataCopy })
  console.log(this.state.data, 'data')
  if (event.target.checked) {
    this.state.selectedStudentId.push(id)
    console.log(this.state.selectedStudentId)
    student['isChecked'] = true
  } else {
    if (this.state.selectedStudentId.includes(id)) {
      this.state.selectedStudentId.splice(this.state.selectedStudentId.indexOf(id), 1)
    }
    student['isChecked'] = false
  }
  this.setState({ data: dataCopy })
  console.log(this.state.data, 'dat')
  console.log(event.target.checked)
  if (this.state.selectedStudentId.length === 0) {
    console.log(this.state.selectedStudentId.length, this.state.isChecked)

    this.setState({ isChecked: false })
  }
}
handleReset = () => {
  let attendanceData = this.state.attnData

  attendanceData.map(item => {
    item.isChecked = false
  })

  this.setState({
    activeStep: 0,
    selectedStudentId: [],
    attnData: attendanceData

  })
};
toggleModal = () => {
  this.props.onCloseMessage()
}
// static getDerivedStateFromProps (props, state) {
//   if (state.openNewMessage !== props.newMessage) {
//     return {
//       openNewMessage: props.newMessage
//     }
//   }
// }
opendrawer=() => {
  const { classes } = this.props
  const steps = getSteps()
  const { studentError, activeStep } = this.state
  const x = this.state.attnData && this.state.attnData.filter(item => (item.is_present === false))
  console.log(x ? x.length : 'ni length', 'vv')

  return (<React.Fragment>
    <div className={classes.root}>
      <Stepper activeStep={activeStep} orientation='vertical'>
        {steps.map((label, index) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
            <StepContent>
              <Typography>{getStepContent(index)}</Typography>
              { index === 0
                ? <React.Fragment>
                  <Grid style={{ 'font-size': '16px', padding: 10 }} >
                    <div className='ui label'>
                      <p style={{ fontSize: '16px' }}> Date :</p>
                    </div>
                    <input
                      className='unstyled'
                      onChange={this.handleDate}
                      value={this.state.date}
                      type='date'
                      name='startingDate'
                      id='startingDate'
                      max={(() => { let tdy = new Date(); let yr = tdy.getFullYear(); let mn = String(tdy.getMonth() + 1).padStart(2, '0'); let dy = String(tdy.getDate()).padStart(2, '0'); return (yr + '-' + mn + '-' + dy) })()}

                    />
                  </Grid>
                </React.Fragment> : ''}
              { index === 1
                ? <React.Fragment>
                  {x === null ? <InternalPageStatus label={`No Absent Student`} loader={false} />
                    : <ReactTable style={{ width: '700px' }}
                      data={x}
                      columns={[
                        {
                          Header: 'Select',
                          accessor: d => (
                            <Checkbox
                              onChange={e => this.handleChangeCheck(e, d.erp)}
                              checked={d.isChecked}
                              id={d.erp}
                            />
                          ),
                          id: 'check'
                        },
                        {
                          Header: 'Student Name',
                          accessor: 'name',
                          filterable: true
                        },
                        {
                          Header: 'Roll Number',
                          accessor: 'roll_no'
                        },
                        {
                          Header: 'ERP',
                          accessor: 'erp'
                        }
                      ]}
                      pageSize={x ? x.length : 'No Absent Student'}
                      className='-striped -highlight'
                      showPagination={false}
                    />}
                  {studentError && (
                    <Typography style={{ color: 'red' }}>Select Student</Typography>
                  )}
                </React.Fragment>
                : ''
              }
              <div className={classes.actionsContainer}>
                <div>
                  <Button
                    disabled={activeStep === 0}
                    onClick={this.handleBack}
                    className={classes.button}
                  >
                  Back
                  </Button>
                  <Button
                    variant='contained'
                    color='primary'
                    onClick={this.handleNext}
                    className={classes.button}
                  >
                    {activeStep === steps.length - 1 ? 'Finish' : 'Next'}
                  </Button>
                </div>
              </div>
            </StepContent>
          </Step>
        ))}
      </Stepper>
      {activeStep === steps.length && (
        <Paper square elevation={0} className={classes.resetContainer}>
          <Typography>All steps completed</Typography>
          <Button onClick={this.handleReset} className={classes.button}>
          Reset
          </Button>
          <Button
            variant='contained'
            color='primary'
            onClick={this.handleAdd}
            className={classes.button}
          >
              Send Message
          </Button>
        </Paper>
      )}
    </div>

  </React.Fragment>)
}
handleOpen = () => {
  this.setState({ right: true })
  // this.getStudent()
};
handleClose = (event) => {
  let attendanceData = this.state.attnData

  attendanceData && attendanceData.map(item => {
    item.isChecked = false
  })

  this.setState({ right: false, selectedStudentId: [], attnData: attendanceData })
};

render () {
  let {
    absenteesCount,
    absenteesRollNoList,
    data,
    attnData
  } = this.state
  console.log(attnData, 'att')
  const { classes } = this.props
  // const steps = getSteps()
  // const { activeStep } = this.state

  return (
    <React.Fragment>
      <Grid container >
        <Grid style={{ marginLeft: 4 }} item>
          <GSelect config={COMBINATIONS} variant={'filter'} onChange={this.onChange} />
        </Grid>
        <AlertMessage alertMessage={this.state.alertMessage} />
        <Grid style={{ padding: 10 }} >
          <div className='ui label'>
            <p style={{ fontSize: '16px' }}> Date :</p>
          </div>
          <input
            className='unstyled'
            onChange={this.handleDate}
            value={this.state.date}
            type='date'
            name='startingDate'
            id='startingDate'
            max={(() => { let tdy = new Date(); let yr = tdy.getFullYear(); let mn = String(tdy.getMonth() + 1).padStart(2, '0'); let dy = String(tdy.getDate()).padStart(2, '0'); return (yr + '-' + mn + '-' + dy) })()}

          />
        </Grid>

        <Grid item >

          <Button variant='contained' style={{ marginTop: 10 }} color='primary' disabled={(this.state.selectorData && !this.state.selectorData.branch_id) || (this.state.selectorData && !this.state.selectorData.grade_id) || (this.state.selectorData && !this.state.selectorData.acadsectionmapping && !this.state.selectorData.acadsectionmapping_id)} onClick={this.getStudent}>
            Get Student Data
          </Button>
          &nbsp; &nbsp;
          {this.state.clicked ? <Button
            type='button'
            color='primary'
            variant='contained'
            style={{ marginTop: 10 }}
            onClick={this.handleOpen}
            disabled={(this.state.selectorData && !this.state.selectorData.branch_id) || (this.state.selectorData && !this.state.selectorData.grade_id) || (this.state.selectorData && !this.state.selectorData.acadsectionmapping && !this.state.selectorData.acadsectionmapping_id)}
          >
                          SEND SMS
          </Button> : <Button
            type='button'
            color='primary'
            variant='contained'
            style={{ marginTop: 10 }}
            onClick={this.handleOpen}
            disabled
          >
                          SEND SMS
          </Button>}
          <Drawer classes={{
            paper: classes.drawer
          }}anchor='right' open={this.state.right} onClose={(event) => { this.handleClose(event) }}>
            {this.opendrawer()}
          </Drawer>
        </Grid>
      </Grid>
      {data && this.state.showTable === true && (
        <div style={{ padding: '20px' }}>
          <ReactTable
            style={{ fontFamily: 'Arial', fontSize: '1.15rem', fontWeight: 'bold' }}
            loading={this.state.loading}
            data={data}
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
                Header: 'ERP',
                accessor: 'erp'
              },
              {
                Header: 'Student Name',
                accessor: 'name',
                filterable: true
              },
              {
                Header: 'Attendance',
                accessor: d => (
                  <div>
                    <Tooltip title={d.is_present ? 'present' : 'absent'} placement='right-start'>
                      <Radio
                        toggle
                        checked={d.is_present}
                        onChange={(e, i) => this.handleToggle(d.roll_no, d.student_id, e, i)}
                      />
                    </Tooltip></div>
                ),
                id: 'attendance'
              },
              {
                Header: 'Remarks',
                accessor: properties => {
                  return (
                    <Input
                      style={{ height: 30, width: 150 }}
                      type='text'
                      key={properties.student_id}
                      onChange={e => this.handleRemarkChange(properties.student_id, e)}
                      disabled={properties.is_present}
                    />
                  )
                },
                id: 'remark'
              }
            ]}
            pageSize={data.length}
            className='-striped -highlight'
            showPagination={false}

          />
          <br />
          <div style={{ fontFamily: 'Arial', fontSize: '1.15rem', fontWeight: 'bold' }}
          > Total Absentees:
            <Chip
              size='medium'
              style={{ color: '#821057', fontSize: 20 }}
              label={absenteesCount || '0'}
            /> &nbsp;&nbsp;&nbsp;&nbsp;
            You are going to mark Absent for  Roll No &nbsp;&nbsp; :&nbsp;&nbsp;
            <Chip
              size='medium'
              style={{ color: '#821057', fontSize: 20 }}
              label={absenteesRollNoList.join(',')} /></div>
          <Button variant='contained' style={{ marginTop: 20 }}color='primary' onClick={this.onSubmitAttendamce}>
              Mark Attendance
          </Button>
        </div>
      )}
      {attnData && this.state.showTableUpdate === true && (
        <div style={{ padding: '20px' }}>
          <ReactTable
            style={{ fontFamily: 'Arial', fontSize: '1.15rem', fontWeight: 'bold' }}
            data={attnData}
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
                accessor: 'name',
                filterable: true
              },

              {
                Header: 'ERP',
                accessor: 'erp'
              },
              {
                Header: 'Attendance',
                accessor: d => (
                  <div>
                    <Tooltip title={d.is_present ? 'present' : 'absent'} placement='right-start'>
                      <Radio
                        toggle
                        checked={d.is_present}
                        onChange={(e, i) => this.handleToggle(d.roll_no, d.id, e, i)}
                      />
                    </Tooltip></div>
                ),
                id: 'attendance'
              },
              {
                Header: 'Remarks',

                accessor: properties => {
                  return (
                    <Input
                      style={{ height: 30, width: 150 }}
                      type='text'
                      key={properties.student_id}
                      value={properties.remarks}
                      disabled={properties.is_present}
                      onChange={e => this.handleRemarkChange(properties.id, e)}
                    />
                  )
                },
                id: 'remark'
              }
            ]}
            pageSize={attnData.length}
            className='-striped -highlight'
            showPagination={false}
            loading={this.state.loading}
          />
          <br />
          <div style={{ fontFamily: 'Arial', fontSize: '1.15rem', fontWeight: 'bold' }}
          > Total Absentees:
            <Chip
              size='medium'
              style={{ color: '#821057', fontSize: 20 }}
              label={absenteesCount || '0'}
            /> &nbsp;&nbsp;&nbsp;&nbsp;
            You are going to mark Absent for Roll No  &nbsp;&nbsp; :&nbsp;&nbsp;
            <Chip
              size='medium'
              style={{ color: '#821057', fontSize: 20 }}
              label={absenteesRollNoList.join(',')} /></div>

          <Button variant='contained' style={{ marginTop: 20 }}color='primary'onClick={this.onUpdateAttendamce}>
              Edit Attendance
          </Button>
        </div>
      )}

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
  sectionLoading: state.sectionMap.loading
})

const mapDispatchToProps = dispatch => ({
  loadBranches: () => dispatch(apiActions.listBranches()),
  gradeMapBranch: branchId => dispatch(apiActions.getGradeMapping(branchId)),
  sectionMap: acadId => dispatch(apiActions.getSectionMapping(acadId))
})
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(Attendance))
