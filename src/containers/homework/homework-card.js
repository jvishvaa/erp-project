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
} from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import moment from 'moment';


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
}) => {
  const { subject, date, view } = data;
  return (
    // <Layout>

    <Grid item xs={12} md={3} className='hwcard-container' style={{ display: 'flex',height:'100vh',flexWrap:'wrap' }}>	
      <Paper
        className='hwcard'
        style={{ height, flexDirection: 'column', position: 'relative', width: '100%' }}
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
                      <div
                        className='cardRow'
                        onClick={() => onClick(student.student_homework_id)}
                      >
                        <div className='studentName'>{`${student.first_name} ${student.last_name}`}</div>
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
        {view === 'submissionStats' && (
          <div className='list' style={{ flexGrow: 1 }}>
            <div className='cardHeaderSub'>Submitted students :</div>
            <div className='innerBox'>
              {loading ? (
                <CircularProgress color='primary' />
              ) : (
                <div>
                  {submittedStudents.length ? (
                    submittedStudents.map((student) => (
                      <div
                        className='cardRow'
                        onClick={() => onClick(student.student_homework_id)}
                      >
                        <div className='studentName'>
                          {`${student.first_name.charAt(0).toUpperCase() + student.first_name.slice(1)} 
                          ${student.last_name.charAt(0).toUpperCase() + student.last_name.slice(1)}`}
                        </div>
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
        {view === 'submissionStats' && (unSubmittedStudents && unSubmittedStudents.length !== 0) && (
          
          <div className='list' style={{ flexGrow: 1,height:'45%' }}>
            <div className='cardHeaderSub'>Not submitted students :</div>
            <div className='innerBox'>
              {loading ? (
                <CircularProgress color='primary' />
              ) : (
                <div>
                  {unSubmittedStudents && unSubmittedStudents.length ? (
                    unSubmittedStudents.map((student) => (
                      <div
                        className='cardRow'
                        //onClick={() => onClick(student.student_homework_id)}
                      >
                        <div className='studentName'>
                          {`${student.first_name.charAt(0).toUpperCase() + student.first_name.slice(1)} 
                          ${student.last_name.charAt(0).toUpperCase() + student.last_name.slice(1)}`}
                        </div>
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
                          onClick={() => onClick(student.student_homework_id)}
                        >{`${student.first_name} ${student.last_name}`}</div>
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
