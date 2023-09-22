/* eslint-disable react/jsx-indent */
/* eslint-disable react/jsx-one-expression-per-line */
/* eslint-disable no-nested-ternary */
/* eslint-disable no-unused-vars */

/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable react/no-array-index-key */
import React, { useRef, useContext, useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import SimpleReactLightbox, { SRLWrapper } from 'simple-react-lightbox';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { makeStyles, useTheme } from '@material-ui/core/styles';

import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';
import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos';

import 'react-responsive-carousel/lib/styles/carousel.min.css';

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
import { AlertNotificationContext } from '../../../context-api/alert-context/alert-state';
import axiosInstance from '../../../config/axios';
import endpoints from '../../../config/endpoints';
import { fetchTeacherHomeworkDetailsById } from '../../../redux/actions';
import placeholder from '../../../assets/images/placeholder_small.jpg';
import Attachment from './attachment';

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
  navCard: {
    border: `1px solid ${theme.palette.primary.main}`,
  },
  homeworkblock: {
    color: theme.palette.secondary.main,
    fontWeight: 600,
  },
  headerText: {
    color: theme.palette.secondary.main,
    fontWeight: 600,
    fontSize: '1rem',
    ['@media screen(min-width:768px)']: {
      fontSize: '0.85rem',
    },
  },
  homeworkSubmitwrapper: {
    border: `1px solid ${theme.palette.primary.main}`,
    borderRadius: '10px',
    padding: '20px',
    ['@media screen(min-width:768px)']: {
      margin: '10px',
      width: '90% !important',
      height: 'auto !important',
    },
  },
}));

const ViewHomework = withRouter(
  ({
    history,
    viewHomework,
    getHomeworkDetailsById,
    selectedHomeworkDetails,
    onClose,
    selectedTeacherByCoordinatorToCreateHw,
    ...props
  }) => {
    const scrollableContainer = useRef(null);
    const themeContext = useTheme();
    const isMobile = useMediaQuery(themeContext.breakpoints.down('sm'));
    const classes = useStyles();
    const { isOpen, subjectId, date, subjectName, homeworkId } = viewHomework || {};
    const [isQuestionWise, setIsQuestionWise] = useState(false);

    const handleScroll = (dir) => {
      if (dir === 'left') {
        scrollableContainer.current.scrollLeft -= 150;
      } else {
        scrollableContainer.current.scrollLeft += 150;
      }
    };

    useEffect(() => {
      getHomeworkDetailsById(homeworkId);
    }, []);

    return (
      <div className='view-homework-container-coordinator create_group_filter_container'>
        <Grid container spacing={2} className='message_log_container'>
          <Grid item xs={12} className='add-homework-title-container' md={2}>
            <div className='nav-cards-container'>
              <div className={` ${classes.navCard} nav-card`} onClick={onClose}>
                <div
                  className={` ${classes.headerText} text-center non_selected_homework_type_item`}
                >
                  All Homeworks
                </div>
              </div>
              <div className={` ${classes.navCard} nav-card`}>
                <div className={` ${classes.headerText} text-center`}>{date}</div>
                <div className={` ${classes.headerText} text-center`}>
                  {subjectName?.split('_')[1]}
                </div>
                <div className={` ${classes.headerText} text-center`}>
                  {subjectName?.split('_')[2]}
                </div>
              </div>
            </div>
          </Grid>
          <Grid item xs={12} md={10}>
            <div className={classes.homeworkSubmitwrapper}>
              <div className='homework_block_wrapper'>
                <div className={`${classes.homeworkblock} homework_submit_tag`}>
                  Homework - {subjectName}: {selectedHomeworkDetails?.homework_name},{' '}
                  {date}
                </div>
              </div>

              {selectedHomeworkDetails &&
                selectedHomeworkDetails?.hw_questions?.map((question, index) => (
                  <div
                    className='homework-question-container-coordinator'
                    key={`homework_student_question_${index}`}
                  >
                    <div className='homework-question'>
                      <div className='question'>{question.question}</div>
                    </div>
                    <div className='attachments-container'>
                      <Typography component='h4' color='primary' className='header'>
                        Attachments
                      </Typography>
                      <div className='attachments-list-outer-container'>
                        <div className='prev-btn'>
                          {question.question_files.length > 1 && (
                            <IconButton onClick={() => handleScroll('left')}>
                              <ArrowBackIosIcon />
                            </IconButton>
                          )}
                        </div>
                        <SimpleReactLightbox>
                          <div
                            className='attachments-list'
                            ref={scrollableContainer}
                            onScroll={(e) => {
                              e.preventDefault();
                            }}
                          >
                            {question.question_files.length === 0 && (
                              <Typography style={{ margin: 'auto' }}>
                                Attachment NOT Found
                              </Typography>
                            )}

                            {question.question_files.map((url, i) => (
                              <>
                                <div className='attachment'>
                                  <Attachment
                                    key={`homework_student_question_attachment_${i}`}
                                    fileUrl={url}
                                    fileName={`Attachment-${i + 1}`}
                                    urlPrefix={`${endpoints.discussionForum.s3}`}
                                    index={i}
                                    actions={['preview', 'download']}
                                  />
                                </div>
                              </>
                            ))}
                            <div
                              style={{
                                position: 'absolute',
                                width: '0',
                                height: '0',
                                visibility: 'hidden',
                              }}
                            >
                              <SRLWrapper>
                                {question.question_files.map((url, i) => (
                                  <img
                                    src={`${endpoints.discussionForum.s3}/homework/${url}`}
                                    onError={(e) => {
                                      e.target.src = placeholder;
                                    }}
                                    alt={`Attachment-${i + 1}`}
                                    style={{ width: '0', height: '0' }}
                                  />
                                ))}
                              </SRLWrapper>
                            </div>
                          </div>
                        </SimpleReactLightbox>
                        <div className='next-btn'>
                          {question.question_files.length > 1 && (
                            <IconButton onClick={() => handleScroll('right')}>
                              <ArrowForwardIosIcon color='primary' />
                            </IconButton>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}

              <div className='homework_submit_button_wrapper'>
                <Button
                  variant='contained'
                  className='cancelButton labelColor homework_submit_button_cancel'
                  size='medium'
                  style={{ width: '100%' }}
                  onClick={onClose}
                >
                  CANCEL
                </Button>
              </div>
            </div>
          </Grid>
        </Grid>
      </div>
    );
  }
);

const mapStateToProps = (state) => ({
  selectedHomeworkDetails: state.teacherHomework.selectedHomeworkDetails,
});

const mapDispatchToProps = (dispatch) => ({
  getHomeworkDetailsById: (id) => {
    dispatch(fetchTeacherHomeworkDetailsById(id));
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(ViewHomework);
