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
import DeleteIcon from '@material-ui/icons/Delete';
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
import Loading from '../../../components/loader/loader';

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
  navCard:{
    border : `1px solid ${theme.palette.primary.main}`,
    color : theme.palette.secondary.main,
  }, 
  navCard1:{
    color : theme.palette.secondary.main,
  },
  homeworkblock:{
    color : theme.palette.secondary.main,
    fontWeight: 600
  },
   headerText: {
    color: theme.palette.secondary.main,
    fontWeight: 600,
    fontSize: "1rem",
    ['@media screen(min-width:768px)']: {
      fontSize: "0.85rem",
    }
  },
  homeworkSubmitwrapper:{
    border: `1px solid ${theme.palette.primary.main}`,  
    borderRadius: "10px",
    padding: "20px",
    ['@media screen(min-width:780px)']: {
      margin: "10px",
      width: "90% !important",
      height: "auto !important",
    }
  }
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
    console.log(viewHomework,'ViewHomework1')
    const { isOpen, subjectId, date, subjectName, homeworkId } = viewHomework || {};
    const [isQuestionWise, setIsQuestionWise] = useState(false);
    const [loading, setLoading] = useState(false);
    const { setAlert } = useContext(AlertNotificationContext);

    const handleScroll = (dir) => {
      if (dir === 'left') {
        scrollableContainer.current.scrollLeft -= 150;
      } else {
        scrollableContainer.current.scrollLeft += 150;
      }
    };

    const handleDelete = () => {
      setLoading(true);
        axiosInstance
          .delete(
            `${endpoints.homework.hwDelete}${viewHomework.homeworkId}/hw-questions/`
          )
          .then((result) => {
            if (result.data.status_code === 200) {
              onClose();
              setAlert('success', result.data?.message);
              setLoading(false);
            } else {
              setAlert('error', result.data?.message);
              setLoading(false);
            }
          })
          .catch((error) => {
            setAlert('error', "error1");
            setLoading(false);
          });
    };

    useEffect(() => {
      getHomeworkDetailsById(homeworkId);
    }, []);

    return (
      <div className='view-homework-container create_group_filter_container'>
        <Grid container spacing={2} className='message_log_container'>
          <Grid item xs={12} className='add-homework-title-container' md={2}>
            <div className='nav-cards-container'>
              <div className={` ${classes.navCard} nav-card`} onClick={onClose}>
                <div className={` ${classes.headerText} text-center`} >
                  <Button 
                  style={{ background : 'white'  }}
                  className="allHomeWorkButton"
                  className={classes.navCard1}
                  >
                  All Homeworks
                  </Button>
                  </div>
              </div>
              <div className={` ${classes.navCard} nav-card`}>
                <div className={` ${classes.headerText} text-center`}>
                  {moment(date).format('DD-MM-YYYY')}
                </div>
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
              <div className='homework_block_wrapper home-work-date-subject-name no-border'>
                <div className={` ${classes.homeworkblock} homework_submit_tag`}>
                  {/* Homework - {viewHomework?.subjectName?.split('_')[2]},{' '} */}
                  Homework - {subjectName} :{' '} {selectedHomeworkDetails?.homework_name},{' '}
                  {/* {moment(date).format('DD-MM-YYYY')} */}
                </div>
                {/* <div>
                  <Typography style={{display: 'block'}}>
                    Discription: {selectedHomeworkDetails?.description}
                  </Typography>
                </div> */}
                {/* <Typography style={{display: 'block'}}>
                  Homework - {subjectName},{' '}
                  {moment(date).format('DD-MM-YYYY')}
                </Typography>
                <Typography style={{display: 'block'}}>Title: {selectedHomeworkDetails?.homework_name}</Typography> */}
              </div>

              {selectedHomeworkDetails?.hw_questions?.map((question, index) => (
                <ViewHomeworkQuestion question={question} index={index} />
              ))}

              <div className='homework_submit_button_wrapper'>
                <Button
                  variant='contained'
                  className='labelColor homework_submit_button_cancel'
                  size='medium'
                  onClick={onClose}
                  style={{ borderRadius: '10px' }}
                >
                  Back
                </Button>
                <Button
                  variant="contained"
                  color="secondary"
                  onClick={handleDelete}
                  style={{backgroundColor:'red'}}
                  startIcon={<DeleteIcon />}
                >
                  Delete
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
