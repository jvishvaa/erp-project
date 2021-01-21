/* eslint-disable no-unused-vars */
import React, { useState } from 'react'
import { connect } from 'react-redux'
import { Stepper, Step, StepLabel, Button } from '@material-ui/core'
import axios from 'axios'
import { withRouter } from 'react-router'
// import AssignStudents from './AssignStudents'
import CreateClass from './CreateClass'
import { qBUrls } from '../../../urls'

const GenerateNewOnlineClass = (props) => {
  const steps = ['Create Online Class']
  const [activeStep, setActiveStep] = useState(1)
  const [studentList, setStudentlist] = useState([])
  // const [finalData, setFinalData] = useState([])
  const [studentIds, setStudentIds] = useState([])
  const [selectorData, setSelectorData] = useState({})
  const [submitButtonStatus, setSubmitButtonStatus] = useState('enabled')
  const [isReset, resetForm] = useState(false)
  const [count, setCount] = useState(0)
  const [isDisabled, setIsdisabled] = useState(false)
  const [errorErps, setErrorErps] = useState([])

  const handleBack = () => {
    setActiveStep(1)
  }

  const logError = (err) => {
    let { message = 'Failed to connect to server', response: { data: { status: messageFromDev } = {} } = {} } = err || {}
    if (messageFromDev) {
      props.alert.error(`${messageFromDev}`)
    } else if (message) {
      props.alert.error(`${message}`)
    } else {
      console.log('Failed', err)
    }
  }
  const handleSubmit = (finalData) => {
    setIsdisabled(true)
    const formData = new FormData()
    if (finalData.branchId) {
      formData.append('branch_id', finalData.branchId)
    }
    if (finalData.sectionMap) {
      formData.append('section_mapping', finalData.sectionMap)
    }
    if (finalData.gradeMap) {
      formData.append('mapping_acad_grade', finalData.gradeMap)
    }
    if (finalData.gradeId.length) {
      formData.append('grade_id', finalData.gradeId)
    }
    if (finalData.isExcel) {
      formData.append('excel_file', finalData.files[0])
    }
    if (finalData.groups.length) {
      formData.append('groups', finalData.groups)
    }
    if (finalData.isAssignedToAllBranches) {
      formData.append('assign_to_all_students', 'True')
    }

    // const presenterEmail = JSON.stringify(finalData.presenterEmail)
    const finalDataTutorEmail = finalData.tutorEmail.filter(data => data.trim(''))

    const tutorEmail = JSON.stringify(finalDataTutorEmail)
    formData.append('start_time', finalData.startTime)
    formData.append('duration', finalData.duration)
    // formData.append('presenter_emails', presenterEmail)
    formData.append('tutor_emails', tutorEmail)
    formData.append('student_ids', finalData.studentsIds)
    formData.append('attendee_limit', finalData.attendeelimit)
    formData.append('title', finalData.title)
    formData.append('subject_id', finalData.subjectId)
    formData.append('join_limit', finalData.joinLimit)
    formData.append('role', finalData.role)
    formData.append('is_optional', finalData.isOptional)
    formData.append('description', finalData.description)
    formData.append('is_assigned_to_parent', finalData.isAssignedToParent)
    axios.post(qBUrls.CreateOnileClass, formData, {
      headers: {
        Authorization: 'Bearer ' + props.user,
        'Content-Type': 'application/json'
      }
    }).then(res => {
      props.alert.success(res.data.status)
      if (finalData.isPowerSelector) {
        window.location.reload()
      }
      setSubmitButtonStatus('disabled')
      resetForm(true)
      setCount(count + 1)
      setIsdisabled(false)
      setErrorErps([])
    }).catch(err => {
      resetForm(false)
      logError(err)
      setIsdisabled(false)
      if (err.response.data.invalid_eps && err.response.data.invalid_eps.length) {
        setErrorErps(err.response.data.invalid_eps)
      }
    })
  }

  const resetErpErrors = () => {
    setErrorErps([])
  }

  const getUnselectedStudentIds = (data) => {
    setStudentIds(data)
  }
  return (
    <React.Fragment>
      <div>
        {
          <div>
            <CreateClass alert={props.alert} updateSelectorData={data => { setSelectorData(data) }} selectorData={selectorData} handleSubmit={handleSubmit} selections={studentIds} resetForm={isReset} isDisabled={isDisabled} key={count} count={count} errorErps={errorErps} resetErpErrors={resetErpErrors} />
          </div>
        }
      </div>
    </React.Fragment>
  )
}

const mapStateToProps = state => ({
  roles: state.roles.items,
  user: state.authentication.user,
  branches: state.branches.items,
  subjects: state.subjects.items,
  student: state.student,
  grades: state.gradeMap.items,
  sections: state.sectionMap.items,
  filter: state.filter

})

export default connect(
  mapStateToProps
)(withRouter(GenerateNewOnlineClass))
