import React from 'react';
import {
  withStyles,
  Grid,
  Box,
  Typography,
  Divider,
} from '@material-ui/core';
import PropTypes from 'prop-types';
import './learning.scss';
import endpoints from 'config/endpoints';


const VideoModel = ({
  classes, file, title,
}) => (
  <div className='video-container'>
        
          <div id='titleLearn'>
            <Typography variant="h5">{title}</Typography>
          </div>
          <div id='videolearn'>
              <video
                id="background-video"
                controls
                controlsList="nodownload"
                alt="video file is crashed"
                height="100%"
                width="100%"
                className='video-play'
              >
                <source src={file?`${endpoints.s3UDAAN_BUCKET}${file.substring(31)}`:""} type="video/mp4" />
                <track
                  src={file?`${endpoints.s3UDAAN_BUCKET}${file.substring(31)}`:""}
                  kind="captions"
                  srcLang="en"
                  label="english_captions"
                />
              </video>
            </div>
  </div>
);

VideoModel.propTypes = {
  classes: PropTypes.objectOf(PropTypes.string).isRequired,
  file: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
};

export default VideoModel;