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
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import {
  Grid,
  TextField,
  Button,
  SvgIcon,
  Icon,
  Slide,
  Checkbox,
  IconButton,
  Typography,
  Divider,
} from '@material-ui/core';
import {
  Attachment as AttachmentIcon,
  HighlightOffOutlined as CloseIcon,
} from '@material-ui/icons';
import { AlertNotificationContext } from '../../../../../context-api/alert-context/alert-state';
import axiosInstance from '../../../../../config/axios';
import endpoints from '../../../../../config/endpoints';
import './homework-submission.css';
import { SRLWrapper } from 'simple-react-lightbox';
import placeholder from '../../../../../assets/images/placeholder_small.jpg';
import Attachment from '../../../teacher-homework/attachment';
import '../../../teacher-homework/styles.scss'

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

const HomeworkSubmission = withRouter(({ history, ...props }) => {
  const classes = useStyles();
  const { homeworkSubmission, setHomeworkSubmission } = props || {};
  const { isOpen, subjectId, date, subjectName } = homeworkSubmission || {};
  const [isQuestionWise, setIsQuestionWise] = useState(false);
  const [allQuestionAttachment, setAllQuestionAttachment] = useState([]);
  const [questionRecord, setQuestionRecord] = useState([
    { question: 'This is the test1 ?', attachment: [] },
    { question: 'This is the test2 ?', attachment: [] },
    { question: 'This is the test3 ?', attachment: [] },
  ]);
  const handleHomeworkCancel = () => {
    setHomeworkSubmission({ isOpen: false, subjectId: '', date: '', subjectName: '' });
  };
  const handleHomeworkSubmit = () => {};
  const [subjectQuestions,setSubjectQuestions]=useState([])
  const uploadFileHandler = (e, index) => {
    if (e.target.files[0]) {
      const tempQuestionRecord = questionRecord.slice();
      const newFiles = [...questionRecord[index].attachment, e.target.files[0]];
      tempQuestionRecord[index].attachment = newFiles;
      setQuestionRecord(tempQuestionRecord);
    }
  };

  useEffect(()=>{
    axiosInstance.get(`/academic/42/hw-questions/?hw_status=1`)
    .then(result=>{
      setSubjectQuestions(result.data.data)
    })
    .catch(error=>{
      // setAlert('error',)
    })
  },[])
  
  const removeFileHandler = (questionIndex, i) => {
    const tempQuestionRecord = questionRecord.slice();
    const newFiles = questionRecord[questionIndex].attachment.filter(
      (_, index) => index !== i
    );
    tempQuestionRecord[questionIndex].attachment = newFiles;
    setQuestionRecord(tempQuestionRecord);
  };

  const FileRow = (props) => {
    const { file, onClose, className } = props;
    return (
      <div className={className}>
        <Grid container spacing={2} alignItems='center'>
          <Grid item xs={12} md={8}>
            <Typography className='file_name_container' variant='span'>
              {file.name}
            </Typography>
          </Grid>
          <Grid item xs={12} md={3}>
            <CloseIcon style={{ color: '#ff6b6b' }} onClick={onClose} />
          </Grid>
        </Grid>
        <Divider />
      </div>
    );
  };

  return (
    <div className='create_group_filter_container'>
      <Grid container spacing={2} className='message_log_container'>
        <Grid item className='homework_type_wrapper'>
          <div className='homework_type'>
            <div
              className='homework_type_item non_selected_homework_type_item'
              onClick={handleHomeworkCancel}
            >
              All Homeworks
            </div>
            <div className='homework_type_item selected'>
              <div>{date}</div>
              <div>{subjectName}</div>
            </div>
          </div>
        </Grid>
        <Grid item lg={10}>
          <div className='homework_submit_wrapper'>
            <div className='homework_block_wrapper'>
              <div className='homework_block homework_submit_tag'>
                Homework - {subjectName}, {date}
              </div>
              <div className='homework_block_questionwise_check'>
                <Checkbox
                  onChange={() => {
                    setIsQuestionWise(!isQuestionWise);
                  }}
                  color='primary'
                  checked={isQuestionWise}
                />
                <span>Upload question wise</span>
              </div>
            </div>

            {subjectQuestions.map((questionItem, index) => (
              <div
                className='homework_submit_questions_wrapper'
                key={`homework_student_question_${index}`}
              >
                <div className='homework_submit_questions'>
                  <span className='homework_question'>{questionItem.question}</span>
                </div>
                <Grid
                  container
                  className='homework_submit_questions_attachment'
                  alignItems='center'
                  spacing={2}
                  justify='space-between'
                >
                  <Grid item xs={2} className={classes.wrapper}>
                    <IconButton
                      fontSize='small'
                      // component={AttachmentIcon}
                      className={classes.attachmentIcon}
                    >
                      <AttachmentIcon fontSize='small' className={classes.Attachment} />
                      <input
                        type='file'
                        onChange={(e) => uploadFileHandler(e, index)}
                        className={classes.fileInput}
                      />
                    </IconButton>
                  </Grid>

                  <div className='attachments-container'>
                    <Typography component='h4' color='primary' className='header'>
                      Attachments
                    </Typography>
                    <div className='attachments-list'>
                      {questionItem.question_files.map((url, i) => (
                        <div className='attachment'>
                          <Attachment
                            key={`homework_student_question_attachment_${i}`}
                            fileUrl={url}
                            fileName={`Attachment-${i + 1}`}
                            urlPrefix={`${endpoints.s3}/homework`}
                            index={i}
                          />
                        </div>
                      ))}
                      <div style={{ position: 'absolute', visibility: 'hidden' }}>
                        <SRLWrapper>
                          {questionItem.question_files.map((url, i) => (
                            <img
                              src={`${endpoints.s3}/homework/${url}`}
                              onError={(e) => {
                                e.target.src = placeholder;
                              }}
                              alt={`Attachment-${i + 1}`}
                            />
                          ))}
                        </SRLWrapper>
                      </div>
                    </div>
                  </div>
              
                  {/* <Grid item xs={10}>
                    {questionItem.attachment.map((file, i) => (
                      <FileRow
                        key={`homework_student_question_attachment_${i}`}
                        file={file}
                        onClose={() => removeFileHandler(index, i)}
                        className={classes.fileRow}
                      />
                    ))}
                  </Grid> */}
                </Grid>
              </div>
            ))}

            <div className='homework_submit_button_wrapper'>
              <Button
                variant='contained'
                className='custom_button_master labelColor homework_submit_button_cancel'
                size='medium'
                onClick={handleHomeworkCancel}
              >
                CANCEL
              </Button>
              <Button
                variant='contained'
                style={{ color: 'white' }}
                onClick={handleHomeworkSubmit}
                color='primary'
                className='custom_button_master'
                size='medium'
              >
                Submit
              </Button>
            </div>
          </div>
        </Grid>
      </Grid>
    </div>
  );
});

export default HomeworkSubmission;
