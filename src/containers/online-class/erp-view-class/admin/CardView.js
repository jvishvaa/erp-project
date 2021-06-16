import React, { useEffect } from 'react';
import moment from 'moment';
import './index.css';
import { Grid, Card, Button, Typography, SvgIcon } from '@material-ui/core';
import Countdown, { zeroPad } from 'react-countdown';
import WhiteClock from '../../../../assets/images/whiteClock.png';
const CardView = ({
  fullData,
  handleViewMore,
  selectedViewMore,
  index,
  tabValue,
  setIndex,
}) => {
  const getClassName = () => {
    let classIndex = '1';
    if (index % 3 === 0) classIndex = '3';
    else if (index % 2 === 0) classIndex = '2';
    else classIndex = '1';
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
        <div className='countdownTimerContainer'>
          <SvgIcon
            component={() => (
              <img style={{ height: '25px', width: '25px' }} src={WhiteClock} />
            )}
          />
          <span className='countdownTimer'>
            {zeroPad(hours)}:{zeroPad(minutes)}:{zeroPad(seconds)}
          </span>
        </div>
      );
    }
  };

  return (
    <>
      {fullData && (
        <div>
          <Grid container spacing={2} className='teacherbatchsCardMain'>
            <Grid item md={12} xs={12}>
              <Card
                className={
                  (fullData && fullData.id) === (selectedViewMore && selectedViewMore.id)
                    ? `teacherBatchCardActive ${getClassName()[0]}`
                    : `teacherBatchCardInActive ${getClassName()[1]}`
                }
              >
                <Grid container spacing={2}>
                  <Grid item md={8} xs={8} style={{ padding: '5px' }}>
                    <span className='teacherBatchCardLable'>
                      {moment(
                        fullData?.online_class ? fullData?.online_class?.start_time : ''
                      ).format('hh:mm A')}
                    </span>
                    {fullData &&
                      fullData.online_class &&
                      fullData.online_class.course_name && (
                        <span
                          className='teacherBatchCardLable'
                          style={{ fontSize: '20px', marginTop: '5px' }}
                        >
                          <strong>{fullData.online_class.course_name}</strong>
                        </span>
                      )}{' '}
                    <br />
                    {fullData && fullData.online_class && fullData.online_class.title && (
                      <span className='teacherBatchCardLable'>
                        {fullData.online_class.title}
                      </span>
                    )}
                  </Grid>
                  <Grid item xs={4}>
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
                  <Grid item md={12} xs={12} style={{ padding: '5px' }}>
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
                  <Grid item md={12} xs={12} style={{ padding: '5px' }}>
                    <span className='teacherBatchCardLable1'>
                      Start Date:&nbsp;
                      {/*(fullData &&
                    fullData.online_class &&
                    fullData.online_class.start_time &&
                    new Date(fullData.online_class.start_time)
                      .toString()
                      .split('G')[0]
                      .substring(0, 16)) ||
                  ''*/}
                      {fullData.online_class
                        ? moment(fullData.online_class.start_time).format('DD-MM-YYYY')
                        : ''}
                    </span>
                  </Grid>
                  <Grid item md={12} xs={12} style={{ padding: '5px' }}>
                    <span className='teacherBatchCardLable1'>
                      End Date:&nbsp;
                      {/*(fullData &&
                    fullData.online_class &&
                    fullData.online_class.end_time &&
                    new Date(fullData.online_class.end_time)
                      .toString()
                      .split('G')[0]
                      .substring(0, 16)) ||
                  '' */}
                      {fullData.online_class
                        ? moment(fullData.online_class.end_time).format('DD-MM-YYYY')
                        : ''}
                    </span>
                  </Grid>
                  <Grid item md={12} xs={12} style={{ textAlign: 'right' }}>
                    <Button
                      variant='contained'
                      color='secondary'
                      className={`TeacherBatchCardViewMoreButton ${getClassName()[2]}`}
                      style={{
                        display:
                          (fullData && fullData.id) ===
                          (selectedViewMore && selectedViewMore.id)
                            ? 'none'
                            : '',
                      }}
                      onClick={() => {
                        setIndex(index);
                        let data = JSON.parse(localStorage.getItem('filterData')) || '';
                        localStorage.setItem(
                          'filterData',
                          JSON.stringify({ ...data, index })
                        );
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
        </div>
      )}
    </>
  );
};

export default CardView;
