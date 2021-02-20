import React, { useContext, useState } from 'react';
import { useHistory } from 'react-router-dom'
import Paper from '@material-ui/core/Paper';
import { Grid, TextField, Button, Typography } from '@material-ui/core';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { useTheme, IconButton, SvgIcon, Divider } from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import Box from '@material-ui/core/Box';
import useStyles from './useStyles';
import downloadAll from '../../../../../assets/images/downloadAll.svg';
import './view-more-course.css';
import endpoints from '../../../../../config/endpoints';
import axiosInstance from '../../../../../config/axios';
import { AlertNotificationContext } from '../../../../../context-api/alert-context/alert-state';
import ViewCourseCard from './ViewCourseCard';
import ViewStore from '../context/ViewStore'
import { Context } from '../context/ViewStore'
import './view-more-course.css';
// import downloadAll from '../../../../../assets/images/downloadAll.svg';


const ViewMoreCard = ({
  viewMoreData,
  setViewMore,
  periodDataForView,
  setSelectedIndex,
  sendGrade,
  branch,
  section,
}) => {

  const themeContext = useTheme();
  const classes = useStyles();

  const isMobile = useMediaQuery(themeContext.breakpoints.down('sm'));
  const { setAlert } = useContext(AlertNotificationContext);

  const [cardDetailsFlag, setCardDetailsFlag] = useState(false)
  const history = useHistory()
  const [state, setState] = useContext(Context)

  const FileRow = (props) => {
    const { file, onClose, index } = props;
    return (
      <div className='file_row_image'>
        <div className='file_name_container'>File {index + 1}</div>
      </div>
    );
  };

  const handleViewCard = () => {
    history.push('./view-period');
  }

  const handleEditCoursePrice = () => {
    history.push(`/course-price/${viewMoreData[0]?.course}/${sendGrade}`);
  }

  const handleEdit = () => {
    setState({ ...state, isEdit: true })
    history.push('/create/course')
  }
  const handleDownload = (e) => {
    // e.preventDefault();
    // periodDataForView && periodDataForView.map((path) => {
    //   path.files && path.files.map((file, i) => window.location.href = (`${endpoints.s3}/${file}`))
    // })
  }
  return (
    <>
      {/* <ViewStore> */}
      {!cardDetailsFlag ?
        <Paper className='rootViewMore'>
          <div className='viewMoreHeader'>
            <div className='leftHeader'>
              <div className='headerTitle'>{periodDataForView?.course_name}</div>
              <div className='headerContent'> Level - {periodDataForView?.level}</div>
            </div>
            <div className='rightHeader'>
              <div className='headerTitle closeIcon'>
                <IconButton
                  onClick={() => {
                    setViewMore(false);
                    setSelectedIndex(-1);
                  }}
                >
                  <CloseIcon color='primary' />
                </IconButton>
              </div>
              <div className='headerContent' sytle={{ cursor: 'pointer' }} onClick={handleEdit}>Edit Details</div>
            </div>
          </div>
          <div className='resourceBulkDownload'>
            <div>Course Wise Details</div>
          </div>
          <div className='bodyContent'>
            {/* <div>Overview</div> */}
          </div>
          <div className='viewMoreBody'>
            <div className='bodyTitle'>
              <div>Overview</div>
            </div>
            <div className='scrollableContent'>
              <div className='bodyContent'>
                <div>{periodDataForView.overview}</div>
              </div>
            </div>
          </div>
          <div className='viewMoreBody'>
            <div className='bodyTitle'>
              <div>Learn</div>
            </div>
            <div className='scrollableContent'>
              <div className='bodyContent'>
                <div>{periodDataForView?.learn}</div>
              </div>
            </div>
          </div>
          <div className='viewMoreBody'>
            <div className='scrollableContent'>
              <div className='bodyContent'>
                <div> No Of Periods : {periodDataForView?.no_of_periods}</div>
              </div>
            </div>
          </div>
          <div className='viewMoreBody'>
            <div className='scrollableContent'>
              <div className='bodyContent'>
                <div>
                No Of Attachments : {periodDataForView?.files && periodDataForView?.files?.length}
                {periodDataForView?.files?.length > 0 ?
                      <IconButton
                        onClick={handleDownload}>
                        <SvgIcon
                          component={() => (
                            <img
                              target='blank'
                              style={{ height: '21px', width: '21px' }}
                              src={downloadAll}
                              alt='downloadAll'
                            />
                          )}
                        />
                      </IconButton> : ''}
              {/* {periodDataForView?.files?.map((file, i) => (
                  <FileRow
                    key={`filess${i}`}
                    file={file}
                    index={i}

                  />
                ))} */}
                </div>
              </div>
            </div>
          </div>
          <div className='viewMoreBody'>
            <Button
              className="courseButton"
              onClick={handleViewCard}
            >
              View Period Details
            </Button>
            <Button
              className="courseButton"
              onClick={handleEditCoursePrice}
            >
              Edit Course Price
            </Button>
          </div>
        </Paper>
        : <ViewCourseCard />}
      {/* </ViewStore> */}
    </>
  );
};

export default ViewMoreCard;
