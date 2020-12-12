/* eslint-disable react/jsx-indent */
/* eslint-disable react/jsx-one-expression-per-line */
/* eslint-disable no-nested-ternary */
/* eslint-disable no-unused-vars */
/* eslint-disable no-debugger */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable react/no-array-index-key */
import React, { useContext, useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import useMediaQuery from '@material-ui/core/useMediaQuery';

import { Grid, Button, FormControl, InputLabel, OutlinedInput } from '@material-ui/core';

import { AlertNotificationContext } from '../../../context-api/alert-context/alert-state';

import { fetchSubmittedHomeworkDetails } from '../../../redux/actions';

import SubmittedQuestion from './submitted-question';

const useStyles = makeStyles((theme) => ({
  attachmentIcon: {
    color: '#ff6b6b',
    marginLeft: '4%',
    '&:hover': {
      cursor: 'pointer',
    },
  },
  fileInput: {
    fontSize: '50px',
    position: 'absolute',
    width: '20%',
    top: 0,
    bottom: 0,
    opacity: 0,
  },
  fileRow: {
    padding: '6px',
  },
  modalButtons: {
    position: 'sticky',
    width: '98%',
    margin: 'auto',
    bottom: 0,
  },
}));

const ViewHomework = withRouter(
  ({
    history,
    homework,
    setViewHomework,
    getHomeworkDetails,
    selectedHomeworkDetails,
    onClose,
    getSubmittedHomeworkDetails,
    submittedHomeworkDetails,
    totalSubmittedQuestions,
    ...props
  }) => {
    const themeContext = useTheme();
    const isMobile = useMediaQuery(themeContext.breakpoints.down('sm'));
    const classes = useStyles();
    const { date, subject, studentHomeworkId } = homework || {};
    const [activeQuestion, setActiveQuestion] = useState(1);

    const handleHomeworkSubmit = () => {};

    useEffect(() => {
      getSubmittedHomeworkDetails(studentHomeworkId);
    }, []);

    return (
      <div className='view-homework-container create_group_filter_container'>
        <Grid container spacing={2} className='message_log_container'>
          <Grid item md={2} className='homework_type_wrapper'>
            <div className='homework_type'>
              <div
                className='homework_type_item non_selected_homework_type_item'
                onClick={onClose}
              >
                All Homeworks
              </div>
              <div className='homework_type_item selected'>
                <div>{date}</div>
                <div>{subject?.split('_')[1]}</div>
                <div>{subject?.split('_')[2]}</div>
              </div>
            </div>
          </Grid>
          <Grid item md={10}>
            <div className='homework_submit_wrapper'>
              <div className='homework_block_wrapper'>
                <div className='homework_block homework_submit_tag'>
                  Homework - {subject?.split('_')[2]}, {date}
                </div>
              </div>

              {submittedHomeworkDetails?.length && (
                <SubmittedQuestion
                  question={submittedHomeworkDetails[activeQuestion - 1]}
                  activeQuestion={activeQuestion}
                  totalQuestions={totalSubmittedQuestions}
                  onNext={() => {
                    setActiveQuestion((prev) =>
                      prev < totalSubmittedQuestions ? prev + 1 : prev
                    );
                  }}
                  onPrev={() => {
                    setActiveQuestion((prev) => (prev > 1 ? prev - 1 : prev));
                  }}
                />
              )}
            </div>
            <div
              className=''
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                marginTop: '1rem',
              }}
            >
              <div className='input-container' style={{ display: 'flex', width: '60%' }}>
                <div style={{ width: '70%', marginRight: '1rem' }}>
                  <FormControl variant='outlined' fullWidth size='small'>
                    <InputLabel htmlFor='component-outlined'>Overall remarks</InputLabel>
                    <OutlinedInput id='remarks' name='remarks' label='Overall remarks' />
                  </FormControl>
                </div>
                <div>
                  <FormControl variant='outlined' fullWidth size='small'>
                    <InputLabel htmlFor='component-outlined'>Overall score</InputLabel>
                    <OutlinedInput id='score' name='remarks' label='Overall remarks' />
                  </FormControl>
                </div>
              </div>
              <div style={{ width: '40%', display: 'flex', justifyContent: 'flex-end' }}>
                <div style={{ marginRight: '1rem' }}>
                  <Button variant='contained' className='disabled-btn'>
                    Cancel
                  </Button>
                </div>
                <div>
                  <Button variant='contained' color='primary'>
                    EVALUATION DONE
                  </Button>
                </div>
              </div>
            </div>
          </Grid>
        </Grid>
      </div>
    );
  }
);

const mapStateToProps = (state) => ({
  submittedHomeworkDetails: state.teacherHomework.submittedHomeworkDetails,
  totalSubmittedQuestions: state.teacherHomework.totalSubmittedQuestions,
  fetchingSubmittedHomeworkDetails:
    state.teacherHomework.fetchingSubmittedHomeworkDetails,
});

const mapDispatchToProps = (dispatch) => ({
  getSubmittedHomeworkDetails: (id) => {
    dispatch(fetchSubmittedHomeworkDetails(id));
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(ViewHomework);
