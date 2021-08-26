import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { IconButton, SvgIcon, Paper, Button } from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import useStyles from './useStyles';
import downloadAll from '../../../../../assets/images/downloadAll.svg';
import './view-more-course.css';
import endpoints from '../../../../../config/endpoints';
import ViewCourseCard from './ViewCourseCard';
import './view-more-course.css';

const ViewMoreCard = ({
  viewMoreData,
  setViewMore,
  periodDataForView,
  setSelectedIndex,
  sendGrade,
}) => {
  const classes = useStyles();
  const [cardDetailsFlag, setCardDetailsFlag] = useState(false);
  const history = useHistory();

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

  return (
    <>
      {!cardDetailsFlag ? (
        <Paper className={classes.rootViewMore}>
          <div className='viewMoreHeader'>
            <div className='leftHeader'>
              <div className='headerTitle'>{periodDataForView?.course_name}</div>
              <div className='headerContent'>
                {' '}
                Level -{' '}
                {periodDataForView?.level === 'Low'
                  ? 'Beginner'
                  : periodDataForView?.level === 'High'
                  ? 'Advance'
                  : 'Intermediate'}
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
                onClick={handleEdit}
                variant='contained'
                color='primary'
                style={{ color: 'white' }}
              >
                Edit Details
              </Button>
            </div>
          </div>
          <div className='resourceBulkDownload'>
            <div>Course Wise Details</div>
          </div>
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
                        href={`https://erp-revamp.s3.ap-south-1.amazonaws.com/dev/aol_file/course/${periodDataForView?.files[0]}`}
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
                        href={`https://erp-revamp.s3.ap-south-1.amazonaws.com/dev/aol_file/course/${periodDataForView?.thumbnail[0]}`}
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
            <Button
              className='courseButton'
              variant='contained'
              color='primary'
              style={{color: 'white'}}
              onClick={handleViewCard}
            >
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
    </>
  );
};

export default ViewMoreCard;
