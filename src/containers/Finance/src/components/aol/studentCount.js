import React, { useState, useEffect } from 'react'
import Box from '@material-ui/core/Box'
import axios from 'axios'
import { urls } from '../../urls'

function StudentCount (props) {
  const [totalStudentCount, setTotalStudentCount] = useState('0')
  const [uniqueStudentCount, setUniqueStudentCount] = useState('0')
  const userProfile = JSON.parse(localStorage.getItem('user_profile'))
  const token = userProfile.personal_info.token
  useEffect(() => {
    fetchStudentCount()
  })
  const fetchStudentCount = () => {
    axios.get(`${urls.GetStudentCount}`, {
      headers: {
        Authorization: 'Bearer ' + token
      }
    })
      .then(res => {
        const uniVal = res.data['unique student attended']
        setTotalStudentCount(res.data.total_student_attended)
        setUniqueStudentCount(uniVal)
      })
      .catch(err => {
        console.log(err)
      })
  }
  return (
    <React.Fragment>
      <Box display='flex' flexDirection='col' p={1} m={2}>
        <Box p={1} >
          TOTAL STUDENT ATTENDED: {totalStudentCount}
        </Box>
        <Box p={1} >
          UNIQUE STUDENT ATTENDED: {uniqueStudentCount}
        </Box>
      </Box>
    </React.Fragment>
  )
}

export default StudentCount
