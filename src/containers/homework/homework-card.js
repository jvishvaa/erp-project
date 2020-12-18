import React, { useContext, useEffect, useState } from 'react';
import './homework-card.scss';
import {
  Grid,
  useTheme,
  Paper,
  Typography,
  Divider,
  CircularProgress,
} from '@material-ui/core';
import Layout from '../Layout';

const HomeworkCard = ({
  data,
  height,
  evaluatedStudents,
  unevaluatedStudents,
  submittedStudents,
  loading,
  handleViewReceivedHomework,
  onClick,
}) => {
  let arr = [];
  for (let i = 0; i < 20; i++) {
    if (i % 5 === 0) arr.push({ name: 'Sankalp Khanna', marks: '14/50' });
    else arr.push({ name: 'Sankalp Khanna', marks: '34/50' });
  }

  return (
    // <Layout>

    <Grid item sm={4}>
      <Paper
        className='hwcard'
        style={{ height, display: 'flex', flexDirection: 'column' }}
      >
        <div className='cardHeader'>
          <div className='subjectName'>{data.subject}</div>
          <div>{data.date}</div>
        </div>
        <div className='divider'></div>
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
      </Paper>
    </Grid>
    // </Layout>
  );
};

export default HomeworkCard;
