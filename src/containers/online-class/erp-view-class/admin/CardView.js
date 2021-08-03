import React, { useEffect } from 'react';
import moment from 'moment';
import './index.css';
import Card from '@material-ui/core/Card';
import CardMedia from '@material-ui/core/CardMedia';
import { Grid, Button, Typography, SvgIcon } from '@material-ui/core';
import Countdown, { zeroPad } from 'react-countdown';
import WhiteClock from '../../../../assets/images/whiteClock.png';
const CardView = ({ fullData, handleViewMore, selectedViewMore, tabValue }) => {
  const getClassName = () => {
    let classIndex = `${fullData.class_type}`;
    return [
      `teacherBatchCardActive${classIndex}`,
      `teacherBatchCardInActive${classIndex}`,
      `viewMoreButton${classIndex}`,
    ];
  };

  const renderer = ({ hours, minutes, seconds, completed }) => {
    if (completed) {
      return '';
    } else {
      return (
        <CardMedia className='countdownTimerContainer'>
          <SvgIcon
            component={() => (
              <img
                style={{ height: '17px', width: '17px', marginTop: '5px' }}
                src={WhiteClock}
              />
            )}
          />
          <span className='countdownTimer'>
            {zeroPad(hours)}:{zeroPad(minutes)}:{zeroPad(seconds)}
          </span>
        </CardMedia>
      );
    }
  };

  return (
    <>
      {fullData && (
        <Grid container spacing={2} className='teacherbatchsCardMain'>
          <Grid item md={12} xs={12}>
            <Card
              className={
                (fullData && fullData.id) === (selectedViewMore && selectedViewMore.id)
                  ? `teacherBatchCardActive ${getClassName()[0]}`
                  : `teacherBatchCardInActive ${getClassName()[1]}`
              }
              // className={ fullData.class_type=== "0" ?`teacherBatchCardActive0`:(fullData.class_type=== "1"
              // ?`teacherBatchCardActive1`:(fullData.class_type=== "2" ?`teacherBatchCardActive2`:`teacherBatchCardActive3`))}
            >
              <Grid container spacing={2}>
                <Grid item md={6} xs={6} style={{ padding: '5px' }}>
                  <span className='teacherBatchCardLable'>
                    {moment(
                      fullData?.online_class ? fullData?.online_class?.start_time : ''
                    ).format('hh:mm A')}
                  </span>

                  {/* {fullData &&
                      fullData.online_class &&
                      fullData.online_class.course_name && (
                        <Typography
                          className='teacherBatchCardLable'
                          style={{ fontSize: '20px', marginTop: '2px' }}
                        >
                          <strong>{fullData.online_class.course_name}</strong>
                          {console.log(fullData.online_class.course_name,'onlineonline')}
                        </Typography>
                      )}{' '}
                    <br /> */}
                  {fullData && fullData.online_class && fullData.online_class.title && (
                    <Typography className='teacherBatchCardLable'>
                      {fullData.online_class.title}
                    </Typography>
                  )}
                </Grid>
                <Grid item md={6} xs={6}>
                  <Typography
                    style={{
                      font: 'normal normal normal 16px/18px Raleway',
                      borderRadius: '7px',
                    }}
                  >
                    {tabValue === 0 && (
                      <span className='countdownTimerWrapper teacherBatchCardLable'>
                        <Countdown
                          date={new Date(fullData?.online_class?.start_time)}
                          renderer={renderer}
                        ></Countdown>
                      </span>
                    )}
                  </Typography>
                </Grid>
                <Grid item md={12} xs={12} style={{ padding: '2px' }}>
                  <span className='teacherBatchCardLable'>
                    {(fullData &&
                      fullData.online_class &&
                      fullData.online_class.subject &&
                      fullData.online_class.subject.length !== 0 &&
                      fullData.online_class.subject.map((item) => (
                        <span>
                          {item.subject_name || ''}
                          &nbsp;
                        </span>
                      ))) ||
                      ''}
                  </span>
                </Grid>
                <Grid item md={12} xs={12} style={{ padding: '2px' }}>
                  <span className='teacherBatchCardLable1'>
                    Start Date:&nbsp;
                    {fullData.online_class
                      ? moment(fullData.online_class.start_time).format('DD-MM-YYYY')
                      : ''}
                  </span>
                </Grid>
                <Grid item md={12} xs={6} style={{ padding: '2px' }}>
                  <span className='teacherBatchCardLable1'>
                    End Date:&nbsp;
                    {fullData.online_class
                      ? moment(fullData.online_class.end_time).format('DD-MM-YYYY')
                      : ''}
                  </span>
                </Grid>
                {/* <Grid item md={6} xs={6} style={{ padding: '5px' }}>
                    <span className='teacherBatchCardLable1'>
                    
                      {fullData.online_class
                        ? fullData.class_type ==='2'?<Typography>specialClass</Typography>:''
                        : ''}
                    </span>
                  </Grid> */}
                <Grid item md={12} xs={12} style={{ textAlign: 'right' }}>
                  <Button
                    variant='contained'
                    color='secondary'
                    className={`TeacherBatchCardViewMoreButton ${getClassName()[2]}`}
                    style={{
                      visibility:
                        (fullData && fullData.id) ===
                        (selectedViewMore && selectedViewMore.id)
                          ? 'hidden'
                          : 'visible',
                    }}
                    onClick={() => {
                      handleViewMore(fullData);
                      localStorage.setItem('viewMoreData', JSON.stringify(fullData));
                    }}
                  >
                    View More
                  </Button>
                </Grid>
              </Grid>
            </Card>
          </Grid>
        </Grid>
      )}
    </>
  );
};

export default CardView;
