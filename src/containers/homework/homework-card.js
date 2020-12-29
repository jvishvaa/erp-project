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

const HomeworkCard = ({
  data,
  height,
  evaluatedStudents,
  unevaluatedStudents,
  submittedStudents,
  loading,
  onClick,
  onClose,
}) => {
  const { subject, date, view } = data;
  console.log('view ', view);
  return (
    // <Layout>

    <Grid item xs={12} sm={4}>
      <Paper
        className='hwcard'
        style={{ height, display: 'flex', flexDirection: 'column', position: 'relative' }}
      >
        <div className='close-icon'>
          <IconButton onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </div>
        <div className='cardHeader'>
          <div className='subjectName'>{subject}</div>
          <div>{date}</div>
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
