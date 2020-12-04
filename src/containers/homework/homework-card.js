import React, { useContext, useEffect, useState } from 'react';
import './homework-card.css';
import { Grid, useTheme, Paper, Typography, Divider } from '@material-ui/core';
import Layout from '../Layout';

const HomeworkCard = ({ data }) => {
  let arr = [];
  for (let i = 0; i < 20; i++) {
    if (i % 5 === 0) arr.push({ name: 'Sankalp Khanna', marks: '14/50' });
    else arr.push({ name: 'Sankalp Khanna', marks: '34/50' });
  }

  return (
    // <Layout>

    <Grid item sm={4}>
      <Paper className='hwcard'>
        <div className='cardHeader'>
          <div className='subjectName'>{data.subject}</div>
          <div>{data.date}</div>
        </div>
        <div className='divider'></div>
        <div className='cardHeaderSub'>Evaluated students :</div>
        <div className='innerBox'>
          {arr.map((val) => (
            <div className='cardRow'>
              <div className='studentName'>{val.name}</div>
              <div className='dividerRow'></div>
              {val.marks === '14/50' ? (
                <div className='studentMarks' style={{ color: '#fe6b6b' }}>
                  {val.marks}
                </div>
              ) : (
                <div className='studentMarks' style={{ color: '#014B7E' }}>
                  {val.marks}
                </div>
              )}
            </div>
          ))}
        </div>
        <div className='cardHeaderSub'>Submitted students :</div>
        <div className='innerBox'>
          {arr.slice(0, 4).map((val) => (
            <div className='cardRow'>
              <div className='studentName'>{val.name}</div>
            </div>
          ))}
        </div>
      </Paper>
    </Grid>
    // </Layout>
  );
};

export default HomeworkCard;
