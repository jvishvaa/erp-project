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
import moment from 'moment';

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
import './styles.scss';
import ViewHomeworkQuestion from './view-homework-question';

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
    viewHomework,
    getHomeworkDetailsById,
    selectedHomeworkDetails,
    onClose,
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
        console.log(scrollableContainer.current.scrollLeft);
      }
    };

    useEffect(() => {
      getHomeworkDetailsById(homeworkId);
    }, []);

    return (
      <div className='view-homework-container create_group_filter_container'>
        <Grid container spacing={2} className='message_log_container'>
          <Grid item xs={12} className='add-homework-title-container' md={2}>
            <div className='nav-cards-container'>
              <div className='nav-card' onClick={onClose}>
                <div className='header-text text-center'>All Homeworks</div>
              </div>
              <div className='nav-card'>
                <div className='header-text text-center'>
                  {moment(date).format('DD-MM-YYYY')}
                </div>
                <div className='header-text text-center'>
                  {subjectName?.split('_')[1]}
                </div>
                <div className='header-text text-center'>
                  {subjectName?.split('_')[2]}
                </div>
              </div>
            </div>
          </Grid>
          {/* <Grid item xs={12} className='homework_type_wrapper'>
            <div className='homework_type'>
              <div
                className='homework_type_item non_selected_homework_type_item'
                onClick={onClose}
              >
                All Homeworks
              </div>
              <div className='homework_type_item selected'>
                <div>{date}</div>
                <div>{subjectName?.split('_')[1]}</div>
                <div>{subjectName?.split('_')[2]}</div>
              </div>
            </div>
          </Grid> */}
          <Grid item xs={12} md={10}>
            <div className='homework_submit_wrapper'>
              <div className='homework_block_wrapper home-work-date-subject-name no-border'>
                <div className='homework_block homework_submit_tag'>
                  Homework - {subjectName?.split('_')[2]},{' '}
                  {moment(date).format('DD-MM-YYYY')}
                </div>
              </div>

              {selectedHomeworkDetails?.map((question, index) => (
                <ViewHomeworkQuestion question={question} index={index} />
              ))}

              <div className='homework_submit_button_wrapper'>
                <Button
                  variant='contained'
                  className='custom_button_master labelColor homework_submit_button_cancel'
                  size='medium'
                  onClick={onClose}
                  style={{ borderRadius: '10px' }}
                >
                  Back
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
