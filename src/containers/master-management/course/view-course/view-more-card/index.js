import React, { useContext, useState } from 'react';
import { useHistory } from 'react-router-dom';
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
import ViewStore from '../context/ViewStore';
import { Context } from '../context/ViewStore';
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

  const [cardDetailsFlag, setCardDetailsFlag] = useState(false);
  const history = useHistory();
  const [state, setState] = useContext(Context);

  const FileRow = (props) => {
    const { file, onClose, index } = props;
    return (
      <div className='file_row_image'>
        <div className='file_name_container'>File {index + 1}</div>
      </div>
    );
  };

  const handleViewCard = () => {
    sessionStorage.removeItem('isAol');
    history.push(`/create/course/${viewMoreData[0]?.course}/${sendGrade}`);
    sessionStorage.setItem('periodDetails', 1);
  };

  const handleEditCoursePrice = () => {
    history.push(`/course-price/${viewMoreData[0]?.course}/${sendGrade}`);
  };

  const handleEdit = () => {
    sessionStorage.removeItem('isAol');
    history.push(`/create/course/${viewMoreData[0]?.course}`);
    sessionStorage.setItem('gradeKey', sendGrade);
  };

  const handleDownload = (type) => {
    if (type === 'course') {
      window.href = `https://erpnew.letseduvate.com/qbox/aol/file-upload/dev/${periodDataForView?.files[0]}`;
    }
    if (type === 'thumbnail') {
      window.open(
        'https://erpnew.letseduvate.com/qbox/aol/file-upload/2021-02-20 16:31:24.776679_LogoBanner.png'
      );
    }
  };
  return (
    <>
      {/* <ViewStore> */}
      {!cardDetailsFlag ? (
        <Paper className='rootViewMore'>
          <div className='viewMoreHeader'>
            <div className='leftHeader'>
              <div className='headerTitle'>{periodDataForView?.course_name}</div>
              <div className='headerContent'> Level - {' '}
                {periodDataForView?.level === 'Low' ? 'Beginner' : periodDataForView?.level === 'High'? 'Advance' : 'Intermediate'}
              </div>
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
              <Button
                className='editDetailsButton'
                sytle={{ cursor: 'pointer' }}
                onClick={handleEdit}
              >
                Edit Details
              </Button>
            </div>
          </div>
          <div className='resourceBulkDownload'>
            <div>Course Wise Details</div>
          </div>
          <div className='bodyContent'>{/* <div>Overview</div> */}</div>
          <div className='viewMoreBody'>
            <div className='bodyTitle'>
              <div>Overview</div>
            </div>
            <div className='scrollableContent'>
              <div className='bodyContent'>
                <div>{periodDataForView?.overview}</div>
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
            <div className='bodyTitle'>
              <div>Prerequisites</div>
            </div>
            <div className='scrollableContent'>
              <div className='bodyContent'>
                <div>{periodDataForView?.pre_requirement}</div>
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
                  Course Attachments :{' '}
                  {periodDataForView?.files && periodDataForView?.files?.length}
                  {periodDataForView?.files?.length > 0 ? (
                    <IconButton>
                      <a
                        // href={`https://erp-revamp.s3.ap-south-1.amazonaws.com/dev/aol_file/course/${periodDataForView?.files[0]}`}
                        href={`https://d3ka3pry54wyko.cloudfront.net/dev/aol_file/course/${periodDataForView?.files[0]}`}
                      >
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
                      </a>
                    </IconButton>
                  ) : (
                    ''
                  )}
                  Thumbnail :{' '}
                  {periodDataForView?.thumbnail && periodDataForView?.thumbnail?.length}
                  {periodDataForView?.thumbnail?.length > 0 ? (
                    <IconButton>
                      <a
                        // href={`https://erp-revamp.s3.ap-south-1.amazonaws.com/dev/aol_file/course/${periodDataForView?.thumbnail[0]}`}
                        href={`https://d3ka3pry54wyko.cloudfront.net/dev/aol_file/course/${periodDataForView?.thumbnail[0]}`}
                      >
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
                      </a>
                    </IconButton>
                  ) : (
                    ''
                  )}
                </div>
              </div>
            </div>
          </div>
          <div className='viewMoreBody'>
            <Button className='courseButton' onClick={handleViewCard}>
              View Period Details
            </Button>
            {window.location.host === endpoints.aolConfirmURL && (
              <Button className='courseButton' onClick={handleEditCoursePrice}>
                Edit Course Price
              </Button>
            )}
          </div>
        </Paper>
      ) : (
        <ViewCourseCard />
      )}
      {/* </ViewStore> */}
    </>
  );
};

export default ViewMoreCard;
