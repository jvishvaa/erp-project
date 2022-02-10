import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import { withRouter } from 'react-router-dom';
import moment from 'moment';
import './acadCalendar.scss';
import Divider from '@material-ui/core/Divider';
import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos';
import { parseJSON } from 'date-fns';
import axios from 'config/axios';
import endpoints from 'config/endpoints';
import Noimage from 'assets/images/not-found.png';
import CreateClass from '../dialogs/createClass';
import AddIcon from '@material-ui/icons/Add';
import { SwipeableDrawer } from '@material-ui/core';
// import createClass from '../dialogs/createClass';

const useStyles = makeStyles({
  root: {
    minWidth: 275,
    margin: '2% 0',
  },
  bullet: {
    display: 'inline-block',
    margin: '0 2px',
    transform: 'scale(0.8)',
  },
  title: {
    fontSize: 17,
    margin: 8,
    fontWeight: 600,
    color: 'black',
  },
  pos: {
    marginBottom: 12,
  },
  complete: {
    fontSize: 17,
    margin: 8,
    fontWeight: 600,
  },
});

let events = [
  { title: 'event 1', url1: 'avik', color: '#BD78F9', date: '2022-01-01' },
  { title: 'event overlap', url1: 'avik', color: '#tomato', date: '2022-01-16' },
  {
    title: 'event 2',
    date: '2022-01-12',
    url1: 'avvfvfd',
    eventColor: '#ff0000',
    color: '#257e4a',
  },
  {
    title: 'BCH237',
    start: '2022-01-18T08:30:00',
    end: '2022-01-19T09:30:00',
    extendedProps: {
      department: 'BioChemistry',
    },
    description: 'Lecture',
    color: 'tomato',
  },
  {
    title: 'BCH237',
    start: '2022-01-18T10:30:00',
    end: '2022-01-18T11:30:00',
    extendedProps: {
      department: 'BioChemistry',
    },
    description: 'Lecture',
    color: 'tomato',
  },
];

const Cards = withRouter(({ props, history }) => {
  const classes = useStyles();
  const [todayData, setTodayData] = useState([]);
  const [createClassClicked, setIsCreateClassClicked] = useState(false);
  const [isCreateClassOpen, setIsCreateClassOpen] = useState(false);

  const { user_level: userLevel = 5 } =
    JSON.parse(localStorage.getItem('userDetails')) || {};


  // let dailyData = JSON.parse(sessionStorage.getItem('dailyData'))

  // useEffect(() => {
  //   setTodayData(dailyData)
  // } , [dailyData])

  const toggleCreateClass = () => {
    setIsCreateClassOpen((prevState) => !prevState);
  };
  const redirectMe = (data) => {
    if(data?.info?.type_name === 'Break'){
      return;
    }
    if (data?.info?.type_id > 0) {
      history.push({
        pathname: `/academic-calendar/edit-period/${data?.info?.id}`,
        state: { data: data },
      });
    }
  };

  // const handleCreateClass = () => {
  //   setIsCreateClassClicked(true);
  // };

  useEffect(() => {
    axios({
      method: 'get',
      url: `${endpoints.period.getDate}`,
      params: {
        start_date: moment(props?.dateProfile?.activeRange?.start).format('YYYY-MM-DD'),
        end_date: moment(props?.dateProfile?.activeRange?.start).format('YYYY-MM-DD'),
      },
    })
      .then((res) => {
        setTodayData(res.data.result);
      })
      .catch((error) => {
        // setAlert('error', 'Something Wrong!');
      });
  }, [props.dateProfile.activeRange.start]);

  return (
    <div className='period-cards'>
      {todayData?.length === 0 ? (
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          {' '}
          <img src={Noimage} />{' '}
        </div>
      ) : (
        <>
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            {todayData &&
              todayData?.map((val) => (
                <Card
                  className={classes.root}
                  onClick={() => redirectMe(val)}
                  className='daily-card'
                  style={{ width: '75%', margin: '1% 0' }}
                >
                  <div
                    className='period-header'
                    style={{ display: 'flex', justifyContent: 'space-between' }}
                  >
                    <div style={{ display: 'flex', alignItems: 'baseline' }}>
                      <Typography
                        className={classes.title}
                        color='textSecondary'
                        gutterBottom
                      >
                        {val?.type?.name} - {val?.info?.name}
                      </Typography>
                      {val?.type?.name === 'Holiday' ? (
                        ''
                      ) : (
                        <p>
                          {moment(val?.start).format('hh:mm a')} -{' '}
                          {moment(val?.end).format('hh:mm a')}{' '}
                        </p>
                      )}
                    </div>
                    <Typography
                      className={classes.complete}
                      color='textSecondary'
                      gutterBottom
                    >
                      {val?.ongoing_status}
                    </Typography>
                  </div>
                  <Divider />
                  <div
                    className='whole-period-data'
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      cursor: 'pointer',
                    }}
                  >
                    <div
                      className='period-header'
                      style={{ display: 'flex', justifyContent: 'space-between' }}
                    >
                      {userLevel === 13 ? (
                        <Typography
                          className='sub-name'
                          color='textSecondary'
                          style={{
                            fontWeight: '600',
                            fontSize: '25px',
                            marginLeft: '20%',
                            minWidth: '70%',
                            minHeight: '70px',
                            display: 'flex',
                            alignItems: 'center',
                          }}
                          gutterBottom
                        >
                          {val?.subject?.name}
                        </Typography>
                      ) : (
                        <>
                          {val?.grade?.name ? (
                            <div
                              style={{
                                margin: '10px',
                                background: '#D1D1D1',
                                padding: '5px',
                                minWidth: '35%',
                              }}
                            >
                              <p
                                style={{
                                  textAlign: 'center',
                                  fontSize: '15px',
                                  fontWeight: '600',
                                }}
                              >
                                {val?.grade?.name}
                              </p>
                              <p
                                style={{
                                  textAlign: 'center',
                                }}
                              >
                                {val?.section?.name}
                              </p>
                            </div>
                          ) : (
                            <div style={{ height: '75px' }}></div>
                          )}
                        </>
                      )}
                      {val?.info?.type_name === 'Examination' ? (
                        <Typography
                          className='sub-name'
                          color='textSecondary'
                          style={{
                            fontWeight: '600',
                            fontSize: '25px',
                            color: '#E94949',
                          }}
                          gutterBottom
                        >
                          {val?.info?.type_name || val?.type?.name}
                        </Typography>
                      ) : (
                        <Typography
                          className='sub-name'
                          color='textSecondary'
                          style={{
                            fontWeight: '600',
                            fontSize: '25px',
                            marginLeft: '20%',
                          }}
                          gutterBottom
                        >
                          {val?.info?.type_name || val?.type?.name}
                        </Typography>
                      )}
                    </div>
                    {userLevel != 13 ? (
                      <p
                        className='subject-area'
                        style={{
                          margin: 'auto',
                          fontSize: '25px',
                          fontWeight: '600',
                          color: '#B6BAC1',
                        }}
                      >
                        {' '}
                        {val?.teacher?.teacher
                          ? val?.teacher?.teacher
                          : '' || val?.holidays}{' '}
                      </p>
                    ) : (
                      ''
                    )}

                    {/* student side classwork and homework */}

                    {userLevel === 13 && val?.ongoing_status === 'Completed' ? (
                      <>
                        <div
                          style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            minWidth: '15%',
                            marginLeft: 'auto',
                          }}
                        >
                          <div
                            style={{
                              margin: 'auto',
                              minWidth: '25%',
                              position: 'relative',
                              border: '1px solid #E1E0E1',
                            }}
                          >
                            <div className='greenMark'></div>
                            <p
                              style={{
                                textAlign: 'center',
                                background: '#c5ffc5',
                                fontSize: '15px',
                                fontWeight: '600',
                              }}
                            >
                              CW
                            </p>
                          </div>
                          <div
                            style={{
                              margin: 'auto',
                              minWidth: '25%',
                              position: 'relative',
                              border: '1px solid #E1E0E1',
                            }}
                          >
                            <div className='redMark'></div>
                            <p
                              style={{
                                textAlign: 'center',
                                margin: 'auto',
                                // color: '#3EA45F',
                                minWidth: '70%',
                                fontSize: '15px',
                                fontWeight: '600',
                                background: '#ff8f8f',
                              }}
                            >
                              HW
                            </p>
                          </div>
                          {val?.student_period_data?.period_attendance === true ? (
                            <div
                              style={{
                                margin: 'auto',
                                minWidth: '25%',
                                border: '1px solid #E1E0E1',
                              }}
                            >
                              <p
                                style={{
                                  textAlign: 'center',
                                  margin: 'auto',
                                  minWidth: '70%',
                                  color: '#52C430',
                                  background: '#c5ffc5',
                                  fontSize: '15px',
                                  fontWeight: '600',
                                }}
                              >
                                {' '}
                                P
                              </p>
                            </div>
                          ) : val?.student_period_data?.period_attendance === false ? (
                            <div
                              style={{
                                margin: 'auto',
                                minWidth: '25%',
                                border: '1px solid #E1E0E1',
                              }}
                            >
                              <p
                                style={{
                                  textAlign: 'center',
                                  margin: 'auto',
                                  minWidth: '70%',
                                  color: '#DB1B1B',
                                  background: '#ff8f8f',
                                  fontSize: '15px',
                                  fontWeight: '600',
                                }}
                              >
                                {' '}
                                A
                              </p>
                            </div>
                          ) : (
                            ''
                          )}
                        </div>
                      </>
                    ) : (
                      ' '
                    )}

                    {val?.info?.name ? (
                      <div style={{ margin: 'auto 1px', height: '25px' }}>
                        <ArrowForwardIosIcon />
                      </div>
                    ) : (
                      ''
                    )}
                  </div>
                </Card>
              ))}
          </div>
        </>
      )}
      {/* <div style={{ margin: '5% 42%', padding: '10px' }}>
        <button
          style={{ padding: '10px', borderRadius: '5px' }}
          onClick={toggleCreateClass}
        >
          <AddIcon style={{ color: 'black', fontSize: 'small', marginRight: '10px' }} />
          Add Extra Class
        </button>
      </div>
      <SwipeableDrawer
        anchor='right'
        open={isCreateClassOpen}
        onClose={toggleCreateClass}
        onOpen={toggleCreateClass}
        style={{ padding: '20px' }}
      >
        <CreateClass toggleCreateClass={toggleCreateClass} isCreateClassOpen={isCreateClassOpen} date={moment(props?.dateProfile?.activeRange?.start).format('YYYY-MM-DD')} />
      </SwipeableDrawer> */}
    </div>
  );
});
export default Cards;
