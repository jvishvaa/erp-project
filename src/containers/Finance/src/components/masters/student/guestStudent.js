/* eslint-disable eqeqeq */
import React, { Component } from 'react'
import axios from 'axios'
import ReactTable from 'react-table'
import _ from 'lodash'
import Grid from '@material-ui/core/Grid'
// import { withStyles } from '@material-ui/core/styles'
import { TextField, Button, MenuItem, Select, IconButton } from '@material-ui/core'
import { connect } from 'react-redux'
import EditIcon from '@material-ui/icons/EditOutlined'
import SwapHorizontalIcon from '@material-ui/icons/SwapHorizOutlined'
import { withRouter } from 'react-router-dom'
import SearchIcon from '@material-ui/icons/Search'
import { urls } from '../../../urls'
import { OmsSelect } from '../../../ui'
// import { COMBINATIONS } from './gSelector'
// import GSelect from '../../../_components/globalselector'

class GuestStudentList extends Component {
  constructor () {
    super()
    this.state = {
      pageSize: 10,
      pageNumber: 0,
      loading: false
    }

    this.debounceEvent = _.debounce((value) => {
      this.getGuestStudentData(0, value)
    }, 2000)
  }

  componentDidMount () {
    console.log('did mount')
    this.getGuestStudentData()
    this.getGrade()
  }

  getGuestStudentData=(pageNum, searchVal, gId) => {
    // // eslint-disable-next-line no-debugger
    // debugger
    const { pageSize, pageNumber, gradeId, startDate, endDate, searchValue } = this.state
    let path = ''
    this.setState({
      loading: true

    })
    const pageParams = `?page_size=${pageSize}&page_number=${(Number((pageNumber || pageNum) || 0) + 1)}`
    const dateParams = `&from_date=${startDate}&to_date=${endDate}`
    const initialUrl = `${urls.ListGuestStudent}${pageParams}`
    const gradeParams = `&grade_id=${gId || gradeId}`
    const gsSearchUrl = `${urls.ListGuestStudentSearch}${pageParams}&search=${(searchVal || searchValue)}`
    const gsUrl = `${urls.ListGuestStudent}${pageParams}${gradeParams}`
    if ((searchVal || searchValue)) {
      if ((gId || gradeId)) {
        if (startDate && endDate) {
          path = `${gsSearchUrl}${gradeParams}${dateParams}`
        } else {
          path = `${gsSearchUrl}${gradeParams}`
        }
      } else {
        if (startDate && endDate) {
          path = `${gsSearchUrl}${dateParams}`
        } else {
          path = `${gsSearchUrl}`
        }
      }
    } else {
      if ((gId || gradeId)) {
        if (startDate && endDate) {
          path = `${gsUrl}${dateParams}`
        } else {
          path = `${gsUrl}`
        }
      } else {
        if (startDate && endDate) {
          path = `${initialUrl}${dateParams}`
        } else {
          path = `${initialUrl}`
        }
      }
    }

    axios
      .get(path, {
        headers: {
          Authorization: 'Bearer ' + this.props.user }
      }).then(res => {
        const { data: { data = [], total_pages: totalPages, current_page: currentPage, page_size: pageSize } = {} } = res

        this.props.alert.success('Successfully fetched')
        this.setState({
          guestStudentData: data,
          totalPages: totalPages,
          loading: false,
          currentPage: Number(currentPage) - 1,
          pageSize: pageSize
        })
      }).catch(err => {
        console.log(err)
        this.setState({
          loading: false
        })
        this.props.alert.error('No Guest Student')
      })
  }
  handleGradeChange = e => {
    console.log(e)
    this.setState({
      gradeId: e.value,
      pageNumber: 0
    })

    this.getGuestStudentData(0, null, e.value)
  }
  getGrade () {
    axios
      .get(urls.GRADE, {
        headers: {
          Authorization: 'Bearer ' + this.props.user
        }
      }).then(res => {
        console.log(res.data)
        this.setState({ grade: res.data })
      }).catch(err => {
        console.log(err)
        this.props.alert.error('Unable to fetch Grades')
      })
  }

  downloadExcel =() => {
    let { gradeId, startDate, endDate } = this.state
    let url = urls.ExportGuestStudent
    let path = `${url}`
    const dateParams = `&from_date=${startDate}&to_date=${endDate}`
    const gradeParams = `?grade_id=${gradeId}`
    if ((gradeId)) {
      if (startDate && endDate) {
        path = `${url}${gradeParams}${dateParams}`
      } else {
        path = `${url}${gradeParams}`
      }
    } else {
      if (startDate && endDate) {
        path = `${url}${dateParams}`
      } else {
        path = `${url}`
      }
    }
    axios.get(`${path}`, {
      responseType: 'arraybuffer',
      headers: {
        Authorization: 'Bearer ' + this.props.user
      }
    })
      .then(res => {
        var blob = new Blob([res.data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' })
        var link = document.createElement('a')
        link.href = window.URL.createObjectURL(blob)
        link.download = 'export_guest_student.xls'
        link.click()
      })
      .catch(err => {
        console.log(err)
      })
  }

  switchUser = (userId) => {
    console.log(userId)
    axios.post(urls.LOGIN, {
      user_id: userId.id
    }, {
      headers: {
        Authorization: 'Bearer ' + this.props.user
      }
    }).then(res => {
      localStorage.setItem('user_profile', JSON.stringify(res.data))
      localStorage.setItem('id_token', res.data.personal_info.token)
      window.location.assign('/')
    })
  }

   handleStatusChange = (event, id, index) => {
     let selectedStatus = event.target.value
     let newStatus = null
     if (event.target.value === 'Called and Not Interested') {
       newStatus = 1
     } else if (event.target.value === 'Interested But Group Not Assigned') {
       newStatus = 2
     } else {
       newStatus = event.target.value
     }
     const { data } = this.state
     const dataCopy = data
     dataCopy[index]['status'] = selectedStatus
     this.setState({ data: dataCopy })

     let dataSubmit = {
       id: id,
       status: newStatus
     }
     axios.put(urls.Status_Update, dataSubmit, {
       headers: {
         Authorization: 'Bearer ' + this.props.user
       }
     }).then(res => {
       console.log(res.data)
     }).catch(err => {
       console.log(err)
       this.props.alert.error('Cannot DO this Action')
     })
   }

  handleSearch = (event) => {
    this.setState({ searchValue: event.target.value })
    this.debounceEvent(event.target.value)
  }
  render () {
    console.log(this.state.pageNumber)
    return (
      <div>
        <div style={{ padding: '25px' }}>
          <Grid
            container
            direction='row'
            justify='flex-start'
            alignItems='center'
          >
            <Grid container item xs sm={5} md={3} lg={2} spacing={5}>
              <OmsSelect
                label='Grade'
                placeholder='Select Grade'
                options={this.state.grade
                  ? this.state.grade
                    .map(grade => ({ value: grade.id, label: grade.grade }))
                  : []
                }
                change={this.handleGradeChange}
              // defaultValue={valueGrade}
              />
            </Grid>
            <Grid container item xs sm={5} md={6} lg={2} spacing={3} style={{ paddingLeft: '50px', display: 'contents' }}>
              <SearchIcon />
              <TextField type='text' onChange={this.handleSearch} style={{ marginLeft: '3vh', marginTop: '1vh' }} placeholder='Search...' />
              <Grid item>
                <label>Start date:</label><br />
                <input type='date' value={this.state.startDate} onChange={e => this.setState({ startDate: e.target.value })} style={{ marginTop: '1vh' }} />
              </Grid>
              <Grid item>
                <label>End date:</label><br />
                <input type='date' value={this.state.endDate} min={this.state.startDate} disabled={!this.state.startDate} onChange={(e) => { this.setState({ endDate: e.target.value }, () => this.getGuestStudentData(0)) }} style={{ marginTop: '1vh' }} />
              </Grid>

            </Grid>

            <Grid container item xs sm={3} md={3} lg={2} spacing={3} style={{ marginLeft: '10px', marginTop: '1vh' }}>

              <div>

                <Button variant='contained' type='submit' onClick={this.downloadExcel}>
              Download Excel File
                </Button>
              </div>
            </Grid>
          </Grid>
        </div>
        <ReactTable
          manual
          data={this.state.guestStudentData ? this.state.guestStudentData : []}
          defaultPageSize={this.state.pageSize}
          style={{ maxWidth: '100%' }}
          showPagination
          showPageSizeOptions={false}
          onPageChange={(pNo) => { this.setState({ pageNumber: pNo }, () => this.getGuestStudentData(pNo, null)) }}
          page={this.state.pageNumber}
          pages={this.state.totalPages}
          loading={this.state.loading}
          columns={[
            {
              Header: <div className='student'>Sr</div>,
              accessor: 'id',
              Cell: (row) => {
                return <div>{(this.state.pageSize * (this.state.pageNumber) + (row.index + 1))}</div>
              },
              maxWidth: 60
            },
            {
              Header: <div>Student Name</div>,
              accessor: 'name',
              Cell: props => <span className='number'>{props.value ? props.value : 'NIL'}</span>
            },
            {
              Header: <div>User Name</div>,
              accessor: 'user.username',
              Cell: props => <span className='number'>{props.value ? props.value : 'NIL'}</span>
            },
            {
              Header: <div>Date Of Join</div>,
              accessor: 'user.date_joined',
              Cell: props => <span className='number'>{props.value ? props.value : 'NIL'}</span>
            },
            {
              Header: <div>Phone Number</div>,
              accessor: 'phone_number',
              Cell: props => <span className='number'>{props.value ? props.value : 'NIL'}</span>
            },
            {
              Header: <div>Email Address</div>,
              accessor: 'email_address',
              Cell: props => <span className='number'>{props.value ? props.value : 'NIL'}</span>
            },
            {
              Header: <div>Grade</div>,
              accessor: 'grade.grade',
              Cell: props => <span className='number'>{props.value ? props.value : 'NIL'}</span>
            },
            {
              Header: <div>Date of Birth</div>,
              accessor: 'date_of_birth',
              Cell: props => <span className='number'>{props.value ? props.value : 'NIL'}</span>
            },
            {
              Header: <div>Gender</div>,
              accessor: 'gender',
              Cell: props => <span className='number'>{props.value ? props.value : 'NIL'}</span>
            },
            {
              Header: <div>Address</div>,
              accessor: 'address',
              Cell: props => <span className='number'>{props.value ? props.value : 'NIL'}</span>
            },
            {
              Header: <div>City</div>,
              accessor: 'city',
              Cell: props => <span className='number'>{props.value ? props.value : 'NIL'}</span>
            },
            {
              Header: <div>School</div>,
              accessor: 'school',
              Cell: props => <span className='number'>{props.value ? props.value : 'NIL'}</span>
            },
            {
              Header: <div>Pincode</div>,
              accessor: 'pincode',
              Cell: props => <span className='number'>{props.value ? props.value : 'NIL'}</span>
            },
            {
              id: 'w',
              Header: <div>Status</div>,
              Cell: ({ original, index }) => {
                return (<Select
                  defaultValue={original.status}
                  value={original.status}
                  onChange={(event) => {
                    this.handleStatusChange(event, original.id, index)
                  }} fullWidth >
                  <MenuItem value={original.status} disabled >{original.status}</MenuItem>
                  <MenuItem value='Called and Not Interested' disabled={original.status === 'Group Assigned'} >Called and Not Interested</MenuItem>
                  <MenuItem value='Interested But Group Not Assigned' disabled={original.status === 'Group Assigned'}>Interested But Group Not Assigned</MenuItem>
                  <MenuItem value='4' disabled={original.status === 'Group Assigned'}>Group Assigned But Deleted</MenuItem>
                  <MenuItem value='5' disabled={original.status === 'Group Assigned'}>Student Unreachable</MenuItem>
                  <MenuItem value='6' disabled={original.status === 'Group Assigned'}>Removed from group due to absenteeism</MenuItem>
                </Select>)
              }

            },
            {
              id: 'x',
              Header: <div> Edit </div>,
              accessor: props => {
                console.log(props)
                return (
                  <div>
                    <IconButton
                      aria-label='Edit'
                      onClick={e => {
                        console.log(props, 'id')
                        e.stopPropagation()
                        this.props.history.push(
                          '/student/guest/filter/' + props.id
                        )
                      }}
                      // className={classes.margin}
                    >
                      <EditIcon fontSize='small' />
                    </IconButton>
                  </div>
                )
              }
            },
            {
              id: 'xy',
              Header: <div> Login as </div>,
              accessor: props => {
                console.log(props)
                return (
                  <IconButton
                    aria-label='Login As'
                    onClick={() => this.switchUser(props.user)}
                  >
                    <SwapHorizontalIcon fontSize='small' />
                  </IconButton>
                )
              }

            }
          ]}

        />
      </div>
    )
  }
}
const mapStateToProps = state => ({
  user: state.authentication.user,
  grades: state.gradeMap.items
})

export default connect(mapStateToProps)(withRouter(GuestStudentList))
