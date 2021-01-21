import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import axios from 'axios'
import { Face, SupervisorAccount, ChildCare } from '@material-ui/icons'
import { withStyles, Grid } from '@material-ui/core'
import { urls } from '../../urls'
import { InternalPageStatus } from '../../ui'

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
    maxHeight: '250px !important',
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
class BulkExcelDownloadStudentStaff extends Component {
  constructor () {
    super()
    this.state = {
      disable: true,
      check: false,
      startS: 0,
      endS: 12,
      startSS: 0,
      endSS: 12,
      startAS: 0,
      endAS: 12,
      loading: false
    }
  }

  componentDidMount () {
    this.setState({ loading: true })
    Promise.all([
      axios.get(`${urls.ADMINREPORTS + '?start=' + this.state.startS + '&end=' + this.state.endS + '&bulk=' + 'Student'}`, {
        headers: {
          Authorization: 'Bearer ' + this.props.user,
          'Content-Type': 'application/json'
        }
      }),
      axios.get(`${urls.ADMINREPORTS + '?start=' + this.state.startSS + '&end=' + this.state.endSS + '&bulk=' + 'SchoolStaff'}`, {
        headers: {
          Authorization: 'Bearer ' + this.props.user,
          'Content-Type': 'application/json'
        }
      }),
      axios.get(`${urls.ADMINREPORTS + '?start=' + this.state.startAS + '&end=' + this.state.endAS + '&bulk=' + 'AcademicStaff'}`, {
        headers: {
          Authorization: 'Bearer ' + this.props.user,
          'Content-Type': 'application/json'
        }
      })
    ]).then(([result1, result2, result3]) => {
      this.setState({
        studentExcelBulkDatas: result1.data.student_bulk_excel,
        schoolStaffDatas: result2.data.school_data_bulk_list,
        acadStaffDatas: result3.data.acad_data_bulk_list,
        loading: false
      })
    })
      .catch(error => {
        this.setState({ loading: false })
        console.log(error)
      })
  }

  getDate (url) {
    let part = (url.split('/')[url.split('/').length - 1]).replace('studentdatabulkexcel-', '')
    let index = part.indexOf('.')
    let date = part.substring(0, index !== -1 ? index : part.length)
    return date
  }
  getDateSchool (url) {
    let part = (url.split('/')[url.split('/').length - 1]).replace('schoolstaffbulk-', '')
    let index = part.indexOf('.')
    let date = part.substring(0, index !== -1 ? index : part.length)
    return date
  }
  getDateAcad (url) {
    let part = (url.split('/')[url.split('/').length - 1]).replace('academicstaffbulk-', '')
    let index = part.indexOf('.')
    let date = part.substring(0, index !== -1 ? index : part.length)
    return date
  }
  handleScrollStudent= (event) => {
    if (event.target.scrollTop === 0) {
      return
    }
    let { target } = event
    if (target.scrollTop + target.clientHeight >= target.scrollHeight) {
      axios.get(`${urls.ADMINREPORTS + '?start=' + this.state.endS + '&end=' + Number(this.state.endS + 5) + '&bulk=' + 'Student'}`, {
        headers: {
          Authorization: 'Bearer ' + this.props.user,
          'Content-Type': 'application/json'
        }
      })
        .then(res => {
          if (res.data.student_bulk_excel) {
            this.setState({
              startS: this.state.endS,
              endS: Number(this.state.endS + 5),
              studentExcelBulkDatas: [...this.state.studentExcelBulkDatas, ...res.data.student_bulk_excel]
            })
          }
        })
    }
  }
  handleScrollSchoolStaff= (event) => {
    if (event.target.scrollTop === 0) {
      return
    }
    let { target } = event
    if (target.scrollTop + target.clientHeight >= target.scrollHeight) {
      axios.get(`${urls.ADMINREPORTS + '?start=' + this.state.endSS + '&end=' + Number(this.state.endSS + 5) + '&bulk=' + 'SchoolStaff'}`, {
        headers: {
          Authorization: 'Bearer ' + this.props.user,
          'Content-Type': 'application/json'
        }
      })
        .then(res => {
          if (res.data.school_data_bulk_list) {
            this.setState({
              startSS: this.state.endSS,
              endSS: Number(this.state.endSS + 5),
              schoolStaffDatas: [...this.state.schoolStaffDatas, ...res.data.school_data_bulk_list]
            })
          }
        })
    }
  }
  handleScrollAcademicStaff = (event) => {
    if (event.target.scrollTop === 0) {
      return
    }
    let { target } = event
    if (target.scrollTop + target.clientHeight >= target.scrollHeight) {
      axios.get(`${urls.ADMINREPORTS + '?start=' + this.state.endAS + '&end=' + Number(this.state.endAS + 5) + '&bulk=' + 'AcademicStaff'}`, {
        headers: {
          Authorization: 'Bearer ' + this.props.user,
          'Content-Type': 'application/json'
        }
      })
        .then(res => {
          if (res.data.acad_data_bulk_list) {
            this.setState({
              startAS: this.state.endAS,
              endAS: Number(this.state.endAS + 5),
              acadStaffDatas: [...this.state.acadStaffDatas, ...res.data.acad_data_bulk_list]
            })
          }
        })
    }
  }

  render () {
    const { studentExcelBulkDatas, schoolStaffDatas, acadStaffDatas } = this.state
    let { classes = {} } = this.props
    return (
      <div>
        {this.state.loading ? <InternalPageStatus label={'fetching data'} />
          : <React.Fragment>
            <div className={classes.parentDiv} >
              <div className={classes.childDiv}>
                <div className={classes.flexContainer}>
                  <div> <ChildCare style={{ color: 'green' }} /></div>
                  <div><h3 >
            Student
                  </h3></div>
                </div>
                <div className={classes.childContent}
                  onScroll={this.handleScrollStudent} >
                  {studentExcelBulkDatas && studentExcelBulkDatas.length > 0 && studentExcelBulkDatas.map(studentExcelBulkData => {
                    return (
                      <a className={classes.AnchorStyle}
                        href={studentExcelBulkData}
                        target='_blank'>
                        <p style={{ fontSize: '20px' }}>
                          <i className='download icon' />
                          {this.getDate(studentExcelBulkData)}
                        </p>
                      </a>
                    )
                  })}
                </div>
              </div>

              <div className={classes.childDiv}>

                <div className={classes.flexContainer}>
                  <div><Face style={{ color: 'red' }} /></div>
                  <div><h3 >
              SchoolStaff
                  </h3></div>
                </div>

                <div className={classes.childContent}
                  onScroll={this.handleScrollSchoolStaff}>
                  {schoolStaffDatas && schoolStaffDatas.length > 0 && schoolStaffDatas.map(schoolStaffData => {
                    return (
                      <Grid>
                        <a className={classes.AnchorStyle}
                          href={schoolStaffData}
                          target='_blank'>
                          <p style={{ fontSize: '20px' }}>
                            <i className='download icon' />
                            {this.getDateSchool(schoolStaffData)}
                          </p>
                        </a>
                      </Grid>
                    )
                  })}
                </div>
              </div>
              <div className={classes.childDiv}>

                <div className={classes.flexContainer}>
                  <div> <SupervisorAccount style={{ color: 'blue' }} /></div>
                  <div><h3 >
              AcademicStaff
                  </h3></div>
                </div>

                <div className={classes.childContent}
                  onScroll={this.handleScrollAcademicStaff} >
                  {acadStaffDatas && acadStaffDatas.length > 0 && acadStaffDatas.map(acadStaffData => {
                    return (
                      <a className={classes.AnchorStyle}
                        href={acadStaffData}
                        target='_blank'>
                        <p style={{ fontSize: '20px' }}>
                          <i className='download icon' />
                          {this.getDateAcad(acadStaffData)}
                        </p></a>

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

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(withRouter(BulkExcelDownloadStudentStaff)))
