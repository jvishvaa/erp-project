import React, { useContext, useEffect, useState } from 'react';
import './homework-card.scss';
import {
  Grid,
  useTheme,
  Paper,
  Typography,
  Divider,
  CircularProgress,
  IconButton,
  Button
} from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import Checkbox from '@material-ui/core/Checkbox';
import moment from 'moment';
import AssignmentLateIcon from '@material-ui/icons/AssignmentLate';
import AssignmentIcon from '@material-ui/icons/Assignment';
import Badge from '@material-ui/core/Badge';

const HomeworkCard = ({
  data,
  height,
  evaluatedStudents,
  unevaluatedStudents,
  submittedStudents,
  unSubmittedStudents,
  loading,
  onClick,
  onClose,
  handleUser,
  handleUserUnsubmitted,
  handleSubmittedStd,
  handleUnSubmittedStd,
  handleAllSubmit,
  absentList,
  handleAllUnSubmit,
  handleAllAbsent,
  handleUserAbsent
}) => {
  const { subject, date, view } = data;
  console.log(submittedStudents, "userhandle");
  const checkMode = (student) => {
    if (student?.hw_submission_mode === 'Online Submission') {
      onClick(student?.student_homework_id)
    }
  }
  return (
    // <Layout>

    <Grid item xs={12} md={3} className='hwcard-container' style={{ display: 'flex', flexWrap: 'wrap' }}>
      <Paper
        className='hwcard'
        style={{ flexDirection: 'column', width: '100%' , overflowX: 'hidden' , overflow: 'auto' , height: '100%' }}
      >
        <div className='close-icon'>
          <IconButton onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </div>
        <div className='cardHeader'>
          <div className='subjectName'>{subject}</div>
          <div> {moment(date).format('DD-MM-YYYY')}</div>
        </div>
        <div className='divider'></div>
        {view === 'evaluationStats' && (
          <div className='list' style={{ flexGrow: 1 }}>
            <div className='cardHeaderSub'>Evaluated students :</div>
            <div className='innerBox'>
              {loading ? (
                <CircularProgress color='primary' />
              ) : (
                <div>
                  {evaluatedStudents.length ? (
                    evaluatedStudents.map((student) => (
                      <>
                        <div
                          className='cardRow'
                          onClick={() => checkMode(student)}
                          style={{ width: '75%', display: 'flex', justifyContent: 'space-between', cursor: student?.hw_submission_mode === 'Online Submission' ? 'pointer' : 'default' }}
                        >
                          <div className='studentName'>{`${student.first_name} ${student.last_name}`}</div>
                          {student?.hw_submission_mode === 'Online Submission' ?
                            <div className='badgeContent' >
                              <Badge color="success" variant="dot" >
                                <AssignmentIcon style={{color: '#014b7e'}} />
                              </Badge>
                            </div>
                            : ''}
                        </div>
                      </>
                    ))
                  ) : (
                    <p className='no-students-text'>No students</p>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
        {view === 'submissionStats'  && (
          <div className='list' style={{ flexGrow: 1 ,maxHeight: '200px' }}>
            <div style={{ display: 'flex' }}>
              <Checkbox inputProps={{ 'aria-label': 'uncontrolled-checkbox' }} onChange={() => handleAllSubmit()} id="submitAllid" />
              <div className='cardHeaderSub'>Submitted students :</div>
            </div>
            <div >
              {loading ? (
                <CircularProgress color='primary' />
              ) : (
                <div style={{ height: '150px', overflow: 'auto', overflowX: 'hidden' }} className='checkboxsubmit' >
                  {submittedStudents?.length ? (
                    submittedStudents?.map((student) => (
                      <div style={{ display: 'flex', alignItems: 'center' }}>
                        <Checkbox onChange={() => handleUser(student)} inputProps={{ 'aria-label': 'uncontrolled-checkbox' }} />
                        <div
                          onClick={() => checkMode(student)}
                          style={{ width: '75%', display: 'flex', justifyContent: 'space-between', cursor: student?.hw_submission_mode === 'Online Submission' ? 'pointer' : 'default' }}
                        >
                          <div className='studentName'  >
                            {`${student.first_name.charAt(0).toUpperCase() + student.first_name.slice(1)} 
                          ${student.last_name.charAt(0).toUpperCase() + student.last_name.slice(1)}`}
                          </div>
                          {student?.hw_submission_mode === 'Online Submission' ?
                            <div className='badgeContent' >
                              <Badge color="success" variant="dot" >
                                <AssignmentIcon style={{color: '#014b7e'}} />
                              </Badge>
                            </div>
                            : ''}
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className='no-students-text'>No students</p>
                  )}
                </div>
              )}
            </div>
            {submittedStudents && (submittedStudents && submittedStudents.length !== 0) ?
            <div style={{display: 'flex' , justifyContent: 'flex-end'}} >
              <Button onClick={handleSubmittedStd} className='buttonSubmit'  >Move to Not Submitted</Button>
            </div> 
            : '' }
          </div>
        )}
        {view === 'submissionStats'  && (

          <div className='list' style={{ flexGrow: 1, maxHeight: '200px' , margin: '15% 0' }}>
            <div style={{ display: 'flex' }}>
              <Checkbox inputProps={{ 'aria-label': 'uncontrolled-checkbox' }} onChange={() => handleAllUnSubmit()}/>
              <div className='cardHeaderSub'>Not submitted students :</div>
            </div>
            <div >
              {loading ? (
                <CircularProgress color='primary' />
              ) : (
                <div style={{ height: '150px', overflow: 'auto', overflowX: 'hidden' }} className='checkboxUnsubmit' >
                  {unSubmittedStudents && unSubmittedStudents.length ? (
                    <div>
                      {unSubmittedStudents.map((student) => (
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                          <Checkbox onChange={() => handleUserUnsubmitted(student)} inputProps={{ 'aria-label': 'uncontrolled-checkbox' }} />
                          <div
                          //onClick={() => onClick(student.student_homework_id)}
                          >
                            <div className='studentName'>
                              {`${student.first_name.charAt(0).toUpperCase() + student.first_name.slice(1)} 
                          ${student.last_name.charAt(0).toUpperCase() + student.last_name.slice(1)}`}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className='no-students-text'>No students</p>
                  )}
                </div>
              )}
            </div>
            {unSubmittedStudents && (unSubmittedStudents && unSubmittedStudents.length !== 0) ?
            <div style={{display: 'flex' , justifyContent: 'flex-end'}}>
              <Button onClick={handleUnSubmittedStd} className='buttonSubmit'  >Move to Submitted</Button>
            </div>
            : '' }
          </div>
        )}

        {view === 'submissionStats'  && (

          <div className='absentlist' style={{ flexGrow: 1,height: '100px' , padding: '10px 0'  }}>
            <div style={{ display: 'flex' }} className='absentAll' >
              <Checkbox inputProps={{ 'aria-label': 'uncontrolled-checkbox' }} onChange={() => handleAllAbsent()} />
              <div className='cardHeaderSub'>Absent students :</div>
            </div>
            <div >
              {loading ? (
                <CircularProgress color='primary' />
              ) : (
                <div style={{ height: '150px', overflow: 'auto', overflowX: 'hidden' }} className='checkboxAbsent' >
                  {absentList && absentList.length ? (
                    <div>
                      {absentList.map((student) => (
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                          <Checkbox onChange={() => handleUserAbsent(student)} inputProps={{ 'aria-label': 'uncontrolled-checkbox' }} />
                          <div
                          //onClick={() => onClick(student.student_homework_id)}
                          >
                            <div className='studentName'>
                              {`${student.first_name.charAt(0).toUpperCase() + student.first_name.slice(1)} 
                ${student.last_name.charAt(0).toUpperCase() + student.last_name.slice(1)}`}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className='no-students-text'>No students</p>
                  )}
                </div>
              )}
            </div>
            {absentList && (absentList && absentList.length !== 0) ?
            <div style={{display: 'flex' , justifyContent: 'flex-end' , padding: 'inherit'}}>
              <Button onClick={handleUnSubmittedStd} className='buttonSubmit' >Move to Submitted</Button>
            </div>
            : '' }
          </div>
        )}

        {view === 'evaluationStats' && (
          <div className='list' style={{ flexGrow: 1 }}>
            <div className='cardHeaderSub'>Unevaluated students :</div>
            <div className='innerBox'>
              {loading ? (
                <CircularProgress color='primary' />
              ) : (
                <div>
                  {unevaluatedStudents.length ? (
                    unevaluatedStudents.map((student) => (
                      <div className='cardRow'>
                        <div
                          className='studentName'
                          onClick={() => checkMode(student)}
                          style={{ width: '75%', display: 'flex', justifyContent: 'space-between', cursor: student?.hw_submission_mode === 'Online Submission' ? 'pointer' : 'default' }}
                        >{`${student.first_name} ${student.last_name}`}</div>
                            {student?.hw_submission_mode === 'Online Submission' ?
                            <div className='badgeContent' >
                              <Badge color="success" variant="dot" >
                                <AssignmentIcon style={{color: '#014b7e'}} />
                              </Badge>
                            </div>
                            : ''}
                      </div>
                    ))
                  ) : (
                    <p className='no-students-text'>No students</p>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </Paper>
    </Grid>
    // </Layout>
  );
};

export default HomeworkCard;
