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
import DescriptiveTestcorrectionModule from '../../../components/EvaluationTool';
// /EvaluationTool/descriptiveTestcorrectionModule";

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
    const [questionsState, setQuestionsState] = useState([]);
    const [penToolOpen, setPenToolOpen] = useState(false);
    const [penToolUrl, setPenToolUrl] = useState('');

    const handleHomeworkSubmit = () => {};

    const openInPenTool = (url) => {
      setPenToolUrl(url);
      // setPenToolOpen(true);
    };

    const deleteEvaluated = (index) => {
      const currentQuestion = questionsState[activeQuestion - 1];
      currentQuestion.corrected_submissions.splice(index, 1);
      setQuestionsState([
        ...questionsState.slice(0, index),
        currentQuestion,
        ...questionsState.slice(index + 1),
      ]);
    };

    const handleCloseCorrectionModal = () => {
      setPenToolUrl('');

      // setPenToolOpen(false);
    };

    const fetchHomeworkDetails = async () => {
      const questions = await getSubmittedHomeworkDetails(studentHomeworkId);
      console.log('questions ', questions);
      const initialQuestionsState = questions.map((q) => ({
        id: q.id,
        corrected_submissions: [],
      }));
      setQuestionsState(initialQuestionsState);
    };

    useEffect(() => {
      fetchHomeworkDetails();
    }, []);

    useEffect(() => {
      if (penToolUrl) {
        setPenToolOpen(true);
      } else {
        setPenToolOpen(false);
      }
    }, [penToolUrl]);

    const mediaContent = {
      file_content: penToolUrl,
      // file_content:
      //   'https://erp-revamp.s3.ap-south-1.amazonaws.com/homework/2020-12-14%2013:58:08.817012_Screenshot%20from%202020-11-18%2015-16-37.png',
      // file_content:
      //   'https://image.shutterstock.com/image-photo/bright-spring-view-cameo-island-260nw-1048185397.jpg',
      id: 1,
      splitted_media: null,
    };
    const desTestDetails = [{ asessment_response: { evaluvated_result: '' } }];

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
                  correctedQuestions={
                    questionsState.length
                      ? questionsState[activeQuestion - 1].corrected_submissions
                      : []
                  }
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
                  onOpenInPenTool={openInPenTool}
                  onDeleteCorrectedAttachment={deleteEvaluated}
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
        {penToolOpen && (
          <DescriptiveTestcorrectionModule
            desTestDetails={desTestDetails}
            mediaContent={mediaContent}
            handleClose={handleCloseCorrectionModal}
            alert={undefined}
            open={penToolOpen}
            callBackOnPageChange={() => {}}
            handleSaveFile={(file) => {
              console.log('file obj from base64', file);
              // setImagePreview(URL.createObjectURL(file));
              // setIsEvaluvate(false);
              const index = activeQuestion - 1;
              const modifiedQuestion = { ...questionsState[index] };
              modifiedQuestion.corrected_submissions.push(URL.createObjectURL(file));
              const newQuestionsState = [
                ...questionsState.slice(0, index),
                modifiedQuestion,
                ...questionsState.slice(index + 1),
              ];
              setQuestionsState(newQuestionsState);
              setPenToolUrl(null);
            }}
          />
        )}
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
    return dispatch(fetchSubmittedHomeworkDetails(id));
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(ViewHomework);
