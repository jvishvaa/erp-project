import React from 'react';
import Paper from '@material-ui/core/Paper';
import { useTheme, IconButton, SvgIcon, Typography, makeStyles } from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import downloadAll from '../../../assets/images/downloadAll.svg';
import './view-more-circular.css';
import endpoints from '../../../config/endpoints';

const useStyles = makeStyles((theme) => ({
  rootViewMore: theme.rootViewMore,
  bodyContentCircular: {
    fontSize: '1rem',
    color: theme.palette.primary.main,
    margin: '5px 10px 0px 20px',
    display: 'flex',
    justifyContent: 'space-between',
  },
}));
const ViewMoreCard = ({ viewMoreData, setViewMore, setSelectedIndex, branch }) => {
  const classes = useStyles();
  const studentBranchName = JSON.parse(localStorage.getItem('userDetails') || {});
  const handleBulkDownload = (files) => {
    if (window.location.pathname === '/teacher-circular') {
      for (let i = 0; i < files?.length; i++) {
        window.open(`${endpoints.signature.s3}${files[i]}`);
      }
    } else {
      // >>>>>>>>>>>>>>>>>>>>STUDENT SIDE VIEW<<<<<<<<<<<<<<<<<<<<<<<<
      for (let i = 0; i < files?.length; i++) {
        window.open(`${endpoints.signature.s3}${files[i]}`);
      }
    }
  };

  return (
    <>
      <Paper className={classes.rootViewMore}>
        <div className='viewMoreHeader'>
          <div className='leftHeader'>
            <div className='headerTitle'>{viewMoreData?.circular_name}</div>
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
                  style={{ fontSize: '1.1rem' }}
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
        <div className='headerTitle_circular'>
          <Typography color='primary'>Description</Typography>
        </div>
        <div className={classes.bodyContentCircular}>
          <div
            style={{ maxWidth: '350px', wordWrap: 'break-word', whiteSpace: 'pre-line' }}
          >
            {viewMoreData?.description}
          </div>
        </div>
      </Paper>
    </>
  );
};

export default ViewMoreCard;
