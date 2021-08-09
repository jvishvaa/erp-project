import React from 'react';
import Paper from '@material-ui/core/Paper';
import {
  IconButton,
  SvgIcon,
  Divider,
  withStyles,
  Button,
  makeStyles,
} from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import downloadAll from '../../../assets/images/downloadAll.svg';
import './view-more.css';
import endpoints from '../../../config/endpoints';

const DownloadButton = withStyles({
  root: {
    backgroundColor: 'transparent',
    textTransform: 'capitalize',
    '&:hover': {
      backgroundColor: 'transparent !important',
    },
  },
})(Button);

const useStyles = makeStyles((theme) => ({
  rootViewMore: theme.rootViewMore,
}));

const ViewMoreDailyDairyCard = ({ viewMoreData, setViewMore, setSelectedIndex }) => {
  const handleBulkDownloads = (files) => {
    for (let i = 0; i < files?.length; i++) {
      window.open(`${endpoints.discussionForum.s3}/${files[i]}`);
    }
  };
  const classes = useStyles();
  return (
    <>
      <Paper className={classes.rootViewMore}>
        <div className='viewMoreHeader'>
          <div className='leftHeader'>
            <div className='headerTitle'>{viewMoreData.subject.subject_name}</div>
            <div style={{ align: 'left' }}>Created On:</div>
            <div style={{ align: 'left' }}>
              {viewMoreData.created_at.substring(0, 10)}
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
          </div>
        </div>
        <div>
          <div className='bodyTitle'>Recap of previous class</div>
          <Divider className='titleDivider' />
          <div className='bodyContent'>{viewMoreData.teacher_report.previous_class}</div>
          <div className='bodyTitle'>Details of classwork</div>
          <Divider className='messageDivider' />
          <div className='bodyContent'>{viewMoreData.teacher_report.class_work}</div>
          <div className='bodyTitle'>Summary</div>
          <Divider className='messageDivider' />
          <div className='bodyContent'>{viewMoreData.teacher_report.summary}</div>
          <div className='bodyTitle'>Tools Used</div>
          <Divider className='messageDivider' />
          <div className='bodyContent'>{viewMoreData.teacher_report.tools_used}</div>
          <div className='bodyTitle'>Homework</div>
          <Divider className='messageDivider' />
          <div className='bodyContent'>{viewMoreData.teacher_report.homework}</div>
          <div className='bodyTitle'>Media</div>

          <div className='headerContent'>
            <DownloadButton
              onClick={() => handleBulkDownloads(viewMoreData?.documents)}
              style={{ fontSize: '1.1rem', color: '#ff6b6b', display: 'flex' }}
              className='bulkDownloadIconViewMore'
              startIcon={
                <SvgIcon
                  component={() => (
                    <img
                      style={{ display: 'flex' }}
                      // style={{ height: '21px', width: '21px', marginLeft: '-343px' }}
                      src={downloadAll}
                      alt='downloadAll'
                    />
                  )}
                />
              }
            >
              Download Attachments
            </DownloadButton>
          </div>
        </div>
      </Paper>
    </>
  );
};

export default ViewMoreDailyDairyCard;
