import React, { useState, useEffect } from 'react'
import ReactTable from 'react-table'
import { withRouter } from 'react-router'
import { Tooltip, Switch, Button, AppBar, Tabs, Chip, Toolbar, Tab } from '@material-ui/core'
import { GetApp } from '@material-ui/icons'

import axios from 'axios'
import { urls, qBUrls } from '../../../urls'

const AttendeeList = (props) => {
  const [pageSize] = useState(10)
  const [currentPage, setCurrentPage] = useState(0)
  const [loading, setLoading] = useState(true)
  // const [attendeeList, setAttendeeList] = useState([])
  const [editAttendence, setEditAttendence] = useState(false)
  const [tutorId, setTutorId] = useState('')
  const [userId, setUserId] = useState('')
  const [decideEditAttendance, setDecideEditAttendance] = useState(true)
  const [studentsData, setStudentsData] = useState([])
  const [guestStudentsData, setGuestStudentsData] = useState([])
  const [currentTab, setCurrentTab] = useState(0)
  const [countOfStudentsAttendees, setCountOfStudentsAttendees] = useState(0)
  const [countOfGuestStudentsAttendees, setCountOfGuestStudentsAttendees] = useState(0)
  const [countOfStudentsNotAttendees, setCountOfStudentsNotAttendees] = useState(0)
  const [countOfGuestStudentsNotAttendees, setCountOfGuestStudentsNotAttendees] = useState(0)

  // eslint-disable-next-line no-unused-vars
  const [totalPages, setTotalPages] = useState(1)
  const token = JSON.parse(localStorage.getItem('user_profile')).personal_info.token
  const user = JSON.parse(localStorage.getItem('user_profile')).personal_info

  const getTrProps = (state, rowInfo, instance) => {
    if (rowInfo) {
      return {
        style: {
          background: rowInfo.row._original.is_attended === 'Yes' ? 'rgb(190, 256, 180)' : 'rgb(210, 163, 179)'
        }
      }
    }
    return {}
  }

  const logError = (err) => {
    let { message = 'Failed to connect to server', response: { data: { status: messageFromDev } = {} } = {} } = err || {}
    if (messageFromDev) {
      props.alert.error(`${messageFromDev}`)
    } else if (message) {
      // props.alert.error(`${message}`)
    } else {
      console.log('Failed', err)
    }
  }

  const getSearchParams = () => {
    let { location: { search = '' } = {} } = props
    const urlParams = new URLSearchParams(search)
    const searchParamsObj = Object.fromEntries(urlParams)
    return searchParamsObj
  }
  useEffect(() => {
    getAttendeeList()
    let value = document.location.href.split('?')
    if (value.length >= 2 && value[1].includes('show=true')) {
      setDecideEditAttendance(false)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, currentTab])

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const getAttendeeList = () => {
    setLoading(true)
    const { list_id: listId } = props.match.params
    axios.get(`${urls.OnlineclassAttendeeList}?zoomMeetingId=${listId}&type=json&page_size=${pageSize}&page_number=${currentPage + 1}&is_completed=${!getSearchParams().show}&is_guest=${currentTab === 0 ? 'false' : 'true'}`, {
      headers: {
        Authorization: 'Bearer ' + token
      }
    })
      .then(res => {
        // eslint-disable-next-line camelcase
        const { total_pages, tutor_id, user_id, student, guest_student, attended_count, not_attended_count } = res.data

        setLoading(false)
        // setAttendeeList(res.data.attendees)
        setTotalPages(total_pages)
        setUserId(tutor_id)
        setTutorId(user_id)
        setStudentsData(student)
        setGuestStudentsData(guest_student)
        setCountOfStudentsAttendees(attended_count)
        setCountOfGuestStudentsAttendees(attended_count)
        setCountOfGuestStudentsNotAttendees(not_attended_count)
        setCountOfStudentsNotAttendees(not_attended_count)
        setStudentsData(student)
      })
      .catch(err => {
        setLoading(false)
        logError(err)
      })
  }

  const handleToggle = (classId, erpp, invert, username) => {
    if (currentTab === 0) {
      var sendData = [
        {
          'class_id': classId,
          'erp': erpp,
          'is_attended': invert === 'No'

        }
      ]
    } else {
      sendData = [
        {
          'class_id': classId,
          'username': username,
          'is_attended': invert === 'No'

        }
      ]
    }

    let data = {
      'attendee_list': sendData
    }

    axios.put(qBUrls.UpdateAttendance, data, {
      headers: {
        Authorization: 'Bearer ' + token,
        'Content-Type': 'application/json'

      }
    })
      .then(res => {
        setCountOfStudentsAttendees(res.data.no_of_attended_count)
        setCountOfGuestStudentsAttendees(res.data.no_of_attended_count)
        setCountOfGuestStudentsNotAttendees(res.data.not_attended_count)
        setCountOfStudentsNotAttendees(res.data.no_of_not_attended_count)

        getAttendeeList()
        props.alert.success('Attendance has been updated')
      })
      .catch(err => {
        console.log(err)
      })
  }
  const openEditAccess = () => {
    setEditAttendence(!editAttendence)
  }
  const columns = [
    {
      Header: 'SL_NO',
      id: 'sln',
      width: 100,
      Cell: (row, original) => {
        return <div style={{ textAlign: 'center' }} >
          {(pageSize * currentPage + (row.index + 1))}</div>
      }
    },
    {
      Header: 'Academic Session',
      show: currentTab === 0,

      Cell: ({ original }) => {
        return <div style={{ textAlign: 'center' }} >
          {original.acad_session}</div>
      }
    },
    {
      Header: 'Student Name',
      width: 100,
      Cell: ({ original }) => {
        return <div style={{ textAlign: 'center' }} >
          {original.name}</div>
      }
    },
    {
      Header: 'ERP',
      show: currentTab === 0,

      Cell: ({ original }) => {
        return <div style={{ textAlign: 'center' }}>{original.erp}</div>
      }
    },
    {
      Header: 'Grade',
      Cell: ({ original }) => {
        return <div style={{ textAlign: 'center' }} >
          {original.grade}</div>
      }
    },

    {
      Header: 'Branch',
      show: currentTab === 0,
      Cell: ({ original }) => {
        return <div style={{ textAlign: 'center' }} >
          {original.branch}</div>
      }
    },
    {
      Header: 'Section',
      show: currentTab === 0,
      Cell: ({ original }) => {
        return <div style={{ textAlign: 'center' }}>{original.section}</div>
      }
    },
    {
      Header: 'Class',
      Cell: ({ original }) => {
        return <div style={{ textAlign: 'center' }} >
          {original.title}
        </div>
      }
    },
    // {
    //   Header: 'Attended Status',
    //   Cell: ({ original }) => {
    //     return <div style={{ textAlign: 'center' }}>

    //       {original.is_attended ? 'Attended'
    //         : 'Not Attended'}
    //     </div>
    //   }
    // },
    {
      Header: 'Attended Status',
      Cell: ({ original }) => {
        return <div style={{ textAlign: 'center' }} >
          {
            editAttendence ? <Tooltip title={original.is_attended === 'No' ? ' Not Attended' : 'Attended'} placement='right-start'>
              <Switch
                toggle
                checked={original.is_attended !== 'No'}
                onChange={(e) => handleToggle(original.class, original.erp, original.is_attended, original.username)}
              />
            </Tooltip> : original.is_attended === 'Yes' ? 'Attended' : 'Not Attended'
          }

        </div>
      }
    },
    {
      Header: 'Acceptance Status',
      Cell: ({ original }) => {
        return <div style={{ textAlign: 'center' }} >
          {original.is_accepted === 'Yes' ? 'Accepted' : 'Not Accepted'}</div>
      }
    },
    {
      Header: 'Tutor Email',
      width: 300,
      Cell: ({ original }) => {
        return <div style={{ textAlign: 'center' }}>{original.tutor}</div>
      }

    }
  ]

  const handleTabChange = (value, tab) => {
    setCurrentTab(tab)
    setLoading(true)
    setCurrentPage(0)
  }

  const handleBulkExcelDownload = () => {
    const { list_id: zoomId } = props.match.params

    let path = `${urls.OnlineclassAttendeeList}?is_guest=${currentTab !== 0 ? 'true' : 'false'}&zoomMeetingId=${zoomId}&type=excel`

    axios.get(path, {
      responseType: 'arraybuffer',
      headers: {
        Authorization: 'Bearer ' + token
      }
    })
      .then(res => {
        let blob = new Blob([res.data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' })
        let link = document.createElement('a')
        link.href = window.URL.createObjectURL(blob)
        link.download = 'online_class_attendance_report.xls'
        link.click()
        link.remove()
      })
      .catch(err => {
        logError(err)
      })
  }
  return (
    <div style={{ padding: 20 }}>
      <div style={{ display: 'flex' }}>
        <AppBar position='static' color='default' style={{ marginBottom: 20 }}>
          <Tabs aria-label='simple tabs example'>
            <Toolbar>
              {
                (user.role === 'Admin' || tutorId === userId || user.role === 'AOLAdmin' || user.role === 'Online Class Admin') && decideEditAttendance ? <Button
                  style={{ width: '130px', height: '41px', margin: '0 auto' }}
                  variant='contained'
                  color='primary' onClick={openEditAccess}>Edit Attendance</Button> : ''
              }
                              &nbsp;&nbsp;&nbsp;

              <Button
                style={{ width: '130px', height: '41px', margin: '0 auto' }}

                variant='contained'
                color='primary'
                size='medium'
                disabled={(studentsData && currentTab === 0 && studentsData.length === 0) || (guestStudentsData && currentTab !== 0 && guestStudentsData.length === 0)}
                onClick={() => {
                  handleBulkExcelDownload()
                }}
                startIcon={<GetApp />}
              >
                Download
              </Button>

                &nbsp;&nbsp;&nbsp;
              <h3 style={{ color: 'green' }}>Attended  <Chip
                size='medium'
                style={{ color: 'black', fontSize: 20 }}
                label={currentTab === 0 ? countOfStudentsAttendees : countOfGuestStudentsAttendees}

              />

              </h3>

              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
              <h3 style={(user.role === 'Admin' || tutorId === userId) && decideEditAttendance ? { color: 'red', 'padding-bottom': '9px' } : user.role === 'Admin' || tutorId === userId ? { color: 'red', 'padding-bottom': '13px' } : { color: 'red', 'padding-bottom': '13px' }} >Not-Attended
              &nbsp;&nbsp;&nbsp;

                <Chip
                  size='medium'
                  style={{ color: 'black', fontSize: 20 }}
                  label={currentTab === 0 ? countOfStudentsNotAttendees : countOfGuestStudentsNotAttendees}

                />
              </h3>
              <div style={{ padding: '20px' }} >
                <Button
                  style={{ width: '130px', height: '41px', margin: '0 auto' }}

                  // style={{ marginTop: 10 }}
                  variant='contained'
                  color='primary'
                  onClick={props.history.goBack}
                > BACK </Button>
              </div>

            </Toolbar>

          </Tabs>
        </AppBar>
      </div>
      <AppBar style={{ backgroundColor: '#f0f0f0' }} elevation={0} position='static'>
        <Tabs value={currentTab} onChange={handleTabChange} indicatorColor='primary'
          textColor='primary'
          variant='fullWidth'>
          <Tab label={'Students'} />
          <Tab label={'Guest   Students'} />
        </Tabs>
      </AppBar>

      <ReactTable
        manual
        // data={attendeeList || []}
        data={currentTab === 0 ? studentsData : guestStudentsData}

        columns={columns}
        page={currentPage}
        pages={totalPages}
        onPageChange={(page) => {
          setCurrentPage(page)
          setLoading(true)
        }}
        defaultPageSize={pageSize}
        loading={loading}
        getTrProps={getTrProps}

      />
    </div>
  )
}

export default withRouter(AttendeeList)
