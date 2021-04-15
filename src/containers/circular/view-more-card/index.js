import React, { useContext } from 'react';
import Paper from '@material-ui/core/Paper';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { useTheme, IconButton, SvgIcon, Typography } from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import downloadAll from '../../../assets/images/downloadAll.svg';
import './view-more-circular.css';
import endpoints from '../../../config/endpoints';
import axiosInstance from '../../../config/axios';
import { AlertNotificationContext } from '../../../context-api/alert-context/alert-state';

const ViewMoreCard = ({
  viewMoreData,
  setViewMore,
  periodDataForView,
  setSelectedIndex,
  grade,
  branch,
  section,
}) => {
  const themeContext = useTheme();
  const isMobile = useMediaQuery(themeContext.breakpoints.down('sm'));
  const { setAlert } = useContext(AlertNotificationContext);
  const studentBranchName = JSON.parse(localStorage.getItem('userDetails') || {});

  console.log(studentBranchName?.role_details?.branch.map((el)=>el.branch_name),'=========================================')
  const handleBulkDownload = (files) => {
    if(window.location.pathname==='/teacher-circular'){
      for (let i = 0; i < files?.length; i++) {
        window.open(`${endpoints.signature.s3}dev/circular_files/${branch?.branch?.branch_name}/${files[i]}`);
      }
    }
    else{
      // >>>>>>>>>>>>>>>>>>>>STUDENT SIDE VIEW<<<<<<<<<<<<<<<<<<<<<<<<
      for (let i = 0; i < files?.length; i++) {
        window.open(`${endpoints.signature.s3}dev/circular_files/${studentBranchName?.role_details && studentBranchName?.role_details?.branch.map((el)=>el.branch_name)}/${files[i]}`);
      }
    }
    
  };
  // console.log(viewMoreData, pic, '++++', branch.branch_name)
  return (
    <>
      <Paper className='rootViewMoreCircular'>
        <div className='viewMoreHeader'>
          <div className='leftHeader'>
            <div className='headerTitle'>{viewMoreData?.circular_name}</div>
            {/* <div className='headerContent'>{periodDataForView?.section_name}</div> */}
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
            {viewMoreData && viewMoreData?.media?.length > 0 && (
              <div className='headerContent'>
                <IconButton
                  onClick={() => handleBulkDownload(viewMoreData?.media)}
                  style={{ fontSize: '1.1rem', color: '#ff6b6b' }}
                  className='bulkDownloadIconViewMore'
                >
                  <SvgIcon
                    component={() => (
                      <img
                        style={{ height: '21px', width: '21px' }}
                        src={downloadAll}
                        alt='downloadAll'
                      />
                    )}
                  />
                  Download All Attachments
                </IconButton>
              </div>
            )}
          </div>
        </div>
        <div className='headerTitle_body'>
          <Typography>Description</Typography>
        </div>
        <div className='bodyContent'>
          <div>{viewMoreData?.description}</div>
        </div>
      </Paper>
    </>
  );
};

export default ViewMoreCard;
