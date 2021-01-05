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
import MaleRating from '../../../../assets/images/malerating.svg';
import FemaleRating from '../../../../assets/images/femalerating.svg';
import axiosInstance from '../../../../config/axios';
import endpoints from '../../../../config/endpoints';
import './homework-timeline.css';

const HomeworkTimeline = ({ setHomeworkTimelineDisplay, moduleId }) => {
  const days = ['30 Days', '60 Days', '90 Days'];
  const [Ratings, setRating] = useState([]);
  const { setAlert } = useContext(AlertNotificationContext);
  const [totalHomework, setTotalHomework] = useState();
  const [submittedHomework, setSubmittedHomework] = useState();
  const {role_details:{gender}}=JSON.parse(localStorage.getItem('userDetails'));
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
      let request = `${endpoints.homeworkStudent.getRating}?module_id=${moduleId}`;
      if (selectedDays) {
        request += `&duration=${selectedDays.substring(0, 2)}`;
      }
      const result = await axiosInstance.get(request);
      if (result.data.status_code === 200) {
        setRating(result.data.data.subject_rating);
        if (result.data.data.subject_rating.length) {
          // let tempTotalHw = 0;
          // let tempSubmitedHw = 0;
          // result.data.data.forEach((items) => {
          //   tempTotalHw += Number(items.hw_given);
          //   tempSubmitedHw += Number(items.hw_submitted);
          // });
          setTotalHomework(result.data.data.hw_given);
          setSubmittedHomework(result.data.data.hw_submitted);
          setHomeworkTimelineDisplay(true);
        } else {
          setHomeworkTimelineDisplay(false);
        }
      } else {
        setAlert('error', result.data.message);
        // setHomeworkTimelineDisplay(false)
      }
    } catch (error) {
      setAlert('error', error.message);
      setHomeworkTimelineDisplay(false);
    }
  };

  useEffect(() => {
    getRating();
  }, [selectedDays, moduleId]);

  return (
    <>
      <div className='subject-homework-details-wrapper'>
        <div className='subject-homework-tag-wrapper'>
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
          <div className='subject-homework-tag'>Timeline</div>
        </div>
        <div className="receivedSubmittedContainer">
          <div>
            <div className="finishedHomeworkTag">Homeworks finished</div>
            <div>
              <span className="submittedHomeworkTag">{submittedHomework>0?submittedHomework:'0'}</span>
              <span className="totalHomeworkTag"><span className="slashClass">/</span>{totalHomework>0?totalHomework:'0'}</span>
            </div>
          </div>
          <div className="maleFemaleContainer">
            <SvgIcon
              component={() => (
                <img
                  style={gender==='1'?{
                    width: '166px',
                    height: '150px',
                    marginRight: '-20px',
                  }:{
                    width: '166px',
                    height: '150px',
                    marginRight:'-10px',
                  }}
                  src={gender==='1'?MaleRating:FemaleRating}
                />
              )}
            />
          </div>
        </div>
        <Grid container className='homework_timeline_container' spacing={5}>
          <Grid className='homework_timeline_rating' lg={12} item>
            <Card className='homework_details_timeline-card'>
              <SvgIcon
                component={() => (
                  <img
                    className='static-media'
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
                      <span className="nameContainer">
                        <span className='subject_rating_first_letter'>{subject.subject_name.substring(0, 1)}</span>{' '}
                        <span className='subject_rating_subject_name'>
                          {subject.subject_name}
                        </span>
                      </span>
                      <span className="starContainer">
                        {[...Array(subject.rating)].map((e, i) => (
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
                          />))
                        }
                      </span>
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
};

export default HomeworkTimeline;
