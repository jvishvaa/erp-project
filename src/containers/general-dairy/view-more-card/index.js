import React from 'react';
import Paper from '@material-ui/core/Paper';
import {
  IconButton,
  SvgIcon,
  Divider,
  Button,
  withStyles,
  makeStyles,
} from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import downloadAll from '../../../assets/images/downloadAll.svg';
import './view-more-general.css';
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

const ViewMoreCard = ({ viewMoreData, setViewMore, setSelectedIndex }) => {
  const classes = useStyles();
  const handleBulkDownload = (files) => {
    for (let i = 0; i < files?.length; i++) {
      window.open(`${endpoints.discussionForum.s3}/${files[i]}`);
    }
  };
  return (
    <>
      <Paper className={classes.rootViewMore}>
        <div className='viewMoreHeader'>
          <div className='leftHeader'>
            <div className='headerTitle'>{viewMoreData.title}</div>
            <div className='headerTitle'>
              Created On: {viewMoreData.created_at.substring(0, 10)}
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
          <div className='bodyTitle'>Title</div>
          <Divider className='titleDivider' />
          <div className='bodyContent'>{viewMoreData.title}</div>
          <div className='bodyTitle'>Message</div>
          <Divider className='messageDivider' />
          <div className='bodyContent'>{viewMoreData.message}</div>
          <div className='bodyTitle'>Media</div>
          <Divider className='messageDivider' />
          <div className='rightHeader'>
            <div className='headerTitle closeIcon'>
              <IconButton
                onClick={() => {
                  setViewMore(false);
                  setSelectedIndex(-1);
                }}
              ></IconButton>
            </div>
            {viewMoreData && viewMoreData?.documents?.length > 0 && (
              <div className='headerContent'>
                <DownloadButton
                  onClick={() => handleBulkDownload(viewMoreData?.documents)}
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
            )}
            {/* </div> */}
          </div>
        </div>
      </Paper>
    </>
  );
};

export default ViewMoreCard;
