import React, { useState, useEffect } from 'react'
import { connect } from 'react-redux'
import {
  Grid,
  TextField,
  Typography,
  MenuItem,
  Button
} from '@material-ui/core'

import * as actionTypes from '../../store/actions'
import { apiActions } from '../../../../_actions'

const EditInfo = ({
  type,
  user,
  alert,
  typeNumber,
  date,
  studentName,
  fatherName,
  optingClass,
  amount,
  fetchGrades,
  branch,
  selectedSession,
  session,
  grades,
  editHandler,
  regDate,
  close
}) => {
  const [changedStdName, setChangedStdName] = useState(studentName)
  const [changedFatName, setChangedFatName] = useState(fatherName)
  const [changedOptClass, setChangedOptClass] = useState(() => {
    if (optingClass) {
      return optingClass.id
    }
    return null
  })
  const [changedAmount, setChangedAmount] = useState(amount)
  const [changedDate, setChangedDate] = useState(date)
  const [changedSession, setChangedSession] = useState(selectedSession)

  useEffect(() => {
    fetchGrades(selectedSession, branch, user, alert)
  }, [fetchGrades, selectedSession, branch, user, alert])

  const editClickHandler = () => {
    if (type === 'Admission' && regDate && regDate > changedDate) {
      alert.warning('Admisssion Date must be greater than Registration date')
      return
    }
    if (type !== 'Admission' && (!changedDate ||
      !changedAmount ||
      !changedStdName ||
      !changedFatName ||
      !changedSession ||
      !changedOptClass)) {
      alert.warning('Please Fill all Fields')
      return
    }
    const number = `${type.toLowerCase()}_number`
    const date = `${type.toLowerCase()}_date`
    const body = {
      'form_type': type.toLowerCase(),
      [number]: typeNumber,
      [date]: changedDate,
      'amount': changedAmount,
      'student_name': changedStdName,
      'father_name': changedFatName,
      'year': changedSession,
      'grade': changedOptClass
    }
    editHandler(body, user, alert)
    close()
  }

  return (
    <React.Fragment>
      <Grid container spacing={8}>
        <Grid item xs={12}>
          <Typography variant='subtitle2'>{`${type} Number : ${typeNumber}`}</Typography>
        </Grid>
        {type !== 'Admission' ? (<Grid item xs={12} md={6}>
          <TextField
            label='Student Name'
            value={changedStdName}
            onChange={(e) => setChangedStdName(e.target.value)}
            margin='normal'
            variant='outlined'
            fullWidth
          />
        </Grid>) : null }
        {type !== 'Admission' ? (<Grid item xs={12} md={6}>
          <TextField
            label='Father Name'
            value={changedFatName}
            onChange={(e) => setChangedFatName(e.target.value)}
            margin='normal'
            variant='outlined'
            fullWidth
          />
        </Grid>) : null }
        { type !== 'Admission' ? <Grid item xs={12} md={6}>
          <TextField
            select
            label='Session'
            value={changedSession}
            onChange={(e) => setChangedSession(e.target.value)}
            margin='normal'
            variant='outlined'
            fullWidth
          >
            {session && session.session_year.map(option => (
              <MenuItem key={option} value={option}>
                {option}
              </MenuItem>
            ))}
          </TextField>
        </Grid> : null}
        { type !== 'Admission' ? <Grid item xs={12} md={6}>
          <TextField
            select
            label='Grade'
            value={changedOptClass}
            onChange={(e) => setChangedOptClass(e.target.value)}
            margin='normal'
            variant='outlined'
            fullWidth
          >
            {grades.map(option => (
              <MenuItem key={option.grade.id} value={option.grade.id}>
                {option.grade.grade}
              </MenuItem>
            ))}
          </TextField>
        </Grid> : null}
        {type !== 'Admission' ? (<Grid item xs={12} md={6}>
          <TextField
            type='number'
            label='Amount'
            value={changedAmount}
            onChange={(e) => setChangedAmount(e.target.value)}
            margin='normal'
            variant='outlined'
            fullWidth
          />
        </Grid>) : null}
        <Grid item xs={12} md={6}>
          <TextField
            label='Date'
            type='date'
            value={changedDate}
            onChange={(e) => setChangedDate(e.target.value)}
            margin='normal'
            variant='outlined'
            fullWidth
            inputProps={{ min: regDate }}
          />
        </Grid>
      </Grid>
      <Grid container justify='flex-end'>
        <Grid item xs={3}>
          <Button
            color='primary'
            variant='contained'
            onClick={editClickHandler}
          >Edit</Button>
        </Grid>
      </Grid>
    </React.Fragment>
  )
}

const mapStateToProps = (state) => ({
  grades: state.finance.common.gradesPerBranch,
  session: state.academicSession.items
})

const mapDispatchToProps = (dispatch) => ({
  loadSession: dispatch(apiActions.listAcademicSessions()),
  fetchGrades: (session, branch, user, alert) => dispatch(actionTypes.fetchGradesPerBranch({ session, branch, user, alert }))
})

export default connect(mapStateToProps, mapDispatchToProps)(EditInfo)
