/* eslint-disable react/jsx-indent */
/* eslint-disable react/jsx-one-expression-per-line */
/* eslint-disable no-nested-ternary */
/* eslint-disable no-unused-vars */
/* eslint-disable no-debugger */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable react/no-array-index-key */
import React, { useContext, useState, useEffect } from 'react';
import { withRouter } from 'react-router-dom';
import {
  Grid,
  SvgIcon,
  Card,
  CardContent,
  Typography,
  TextField,
} from '@material-ui/core';
import Autocomplete from '@material-ui/lab/Autocomplete';
import { AlertNotificationContext } from '../../../../context-api/alert-context/alert-state';
import ReceivedIcon from '../../../../assets/images/receivedIcon.svg';
import SubmittedIcon from '../../../../assets/images/submitedIcon.svg';
import RatingIcon from '../../../../assets/images/ratingIcon1.svg';
import Star from '../../../../assets/images/XMLID_16_.svg';
import axiosInstance from '../../../../config/axios';
import endpoints from '../../../../config/endpoints';
import './homework-timeline.css';

const HomeworkTimeline = withRouter(({ history, ...props }) => {
  const days = ['30 Days', '60 Days', '90 Days'];
  const [Ratings, setRating] = useState([]);
  const { setAlert } = useContext(AlertNotificationContext);
  const [totalHomework, setTotalHomework] = useState();
  const [submittedHomework, setSubmittedHomework] = useState();

  //   [
  //     {
  //       subject: 87,
  //       subject_name: 'Science',
  //       hw_given: 1,
  //       hw_submitted: 0,
  //       rating: 4,
  //     },
  //     {
  //       subject: 93,
  //       subject_name: 'aa',
  //       hw_given: 1,
  //       hw_submitted: 0,
  //       rating: 4,
  //     },
  //     {
  //       subject: 94,
  //       subject_name: 'python',
  //       hw_given: 5,
  //       hw_submitted: 0,
  //       rating: 4,
  //     },
  //     {
  //       subject: 95,
  //       subject_name: 'django',
  //       hw_given: 7,
  //       hw_submitted: 1,
  //       rating: 4,
  //     },
  //     {
  //       subject: 96,
  //       subject_name: 'DRF',
  //       hw_given: 5,
  //       hw_submitted: 0,
  //       rating: 4,
  //     },
  //   ];
  const [selectedDays, setSelectedDays] = useState('30 Days');
  const handleDayChange = (event, value) => {
    if (value) {
      setSelectedDays(value);
    } else {
      setSelectedDays('30 Days');
    }
  };
  const getRating = async () => {
    try {
      let request=endpoints.homeworkStudent.getRating
      if(selectedDays) {
        request+= `?duration=${selectedDays.substring(0,2)}`
      }
      const result = await axiosInstance.get(request);
      if (result.data.status_code === 200) {
        setRating(result.data.data);
        if (result.data.data.length) {
          let tempTotalHw = 0;
          let tempSubmitedHw = 0;
          result.data.data.forEach((items) => {
            tempTotalHw += Number(items.hw_given);
            tempSubmitedHw += Number(items.hw_submitted);
          });
          setTotalHomework(tempTotalHw);
          setSubmittedHomework(tempSubmitedHw);
        }
      } else {
        setAlert('error', result.data.message);
      }
    } catch (error) {
      setAlert('error', error.message);
    }
  };

  useEffect(() => {
    getRating();
  }, [selectedDays]);
  return (
    <>
      <div className='subject-homework-details-wrapper'>
        <div className='subject-homework-tag-wrapper'>
          <div className='subject-homework-tag'>Rating</div>
          <Autocomplete
            size='small'
            onChange={handleDayChange}
            value={selectedDays}
            id='message_log-branch'
            className='rating_days'
            options={days}
            filterSelectedOptions
            getOptionLabel={(option) => option}
            disableClearable
            renderInput={(params) => (
              <TextField
                className='message_log-textfield'
                {...params}
                variant='outlined'
              />
            )}
          />
        </div>
        <Grid container className='homework_timeline_container' spacing={2}>
          <Grid className='homework_timeline_received_submitted' lg={6} item>
            <Card className='homework_details_timeline-card'>
              <SvgIcon
                component={() => (
                  <img
                    style={{
                      width: '25px',
                      height: '25px',
                      marginTop: '5px',
                      marginRight: '3px',
                      float: 'right',
                    }}
                    src={ReceivedIcon}
                    alt='submitted'
                  />
                )}
              />
              <CardContent className='homework_details_timeline-card_content'>
                <Typography
                  variant='body2'
                  className='homework_timeline_card_tag'
                  color='#014b7e'
                  component='h6'
                >
                  Received
                </Typography>
                <Typography
                  variant='body2'
                  className='homework_timeline_card_info'
                  component='p'
                >
                  {totalHomework}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid className='homework_timeline_received_submitted' lg={6} item>
            <Card className='homework_details_timeline-card'>
              <SvgIcon
                component={() => (
                  <img
                    style={{
                      width: '25px',
                      height: '25px',
                      marginTop: '5px',
                      marginRight: '3px',
                      float: 'right',
                    }}
                    src={SubmittedIcon}
                    alt='submitted'
                  />
                )}
              />
              <CardContent className='homework_details_timeline-card_content'>
                <Typography
                  variant='body2'
                  className='homework_timeline_card_tag'
                  color='#014b7e'
                  component='h6'
                >
                  Submitted
                </Typography>
                <Typography
                  variant='body2'
                  className='homework_timeline_card_info'
                  component='p'
                >
                  {submittedHomework}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid className='homework_timeline_rating' lg={12} item>
            <Card className='homework_details_timeline-card'>
              <SvgIcon
                component={() => (
                  <img
                    style={{
                      width: '25px',
                      height: '25px',
                      marginTop: '5px',
                      marginRight: '3px',
                      float: 'right',
                    }}
                    src={RatingIcon}
                    alt='submitted'
                  />
                )}
              />
              <CardContent className='homework_details_timeline-card_content'>
                <div className='homework_details_timeline_rating_row'>
                  <Typography
                    variant='body2'
                    className='homework_timeline_card_tag'
                    color='#014b7e'
                    component='h6'
                  >
                    My Rating
                  </Typography>
                </div>
                <Typography
                  variant='body2'
                  className='homework_timeline_card_info'
                  component='p'
                >
                  {Ratings.map((subject, index) => (
                    <div
                      className='subject_rating_wrapper'
                      key={`ratiting_subject_row${index}`}
                    >
                      <span className='subject_rating_first_letter'>{subject.subject_name.substring(0,1)}</span>{' '}
                      <span className='subject_rating_subject_name'>
                        {subject.subject_name}
                      </span>
                      <span className='subject_rating'>{subject.rating}/5</span>
                      <SvgIcon
                        component={() => (
                          <img
                            style={{
                              width: '20px',
                              height: '20px',
                            }}
                            src={Star}
                            alt='submitted'
                          />
                        )}
                      />
                    </div>
                  ))}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </div>
    </>
  );
});

export default HomeworkTimeline;
