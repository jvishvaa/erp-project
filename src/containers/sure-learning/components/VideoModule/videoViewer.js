import React from 'react';
import {
  withStyles,
  Grid,
  Box,
  Typography,
  Divider,
} from '@material-ui/core';
import PropTypes from 'prop-types';
import styles from './TrainingUnit.style';

const VideoModel = ({
  classes, file, title,
}) => (
  <Grid container spacing={2} style={{ padding: '20px', paddingTop: '70px' }}>
    <Grid item md={12} xs={12}>
      <Box border={1} style={{ padding: '20px', borderColor: 'lightgray' }}>
        <Grid container spacing={2}>
          <Grid item md={1} />
          <Grid item md={10} xs={12}>
            <Typography variant="h5">{title}</Typography>
            <Divider className={classes.divider} />
          </Grid>
          <Grid item md={1} />
          <Grid item md={1} />
          <Grid item md={10} xs={12}>
            <Grid item md={12} xs={12} style={{ margin: '12px 0px', padding: '20px' }}>
              <video
                id="background-video"
                controls
                controlsList="nodownload"
                alt="video file is crashed"
                height="100%"
                width="100%"
                className={classes.video}
              >
                <source src={file} type="video/mp4" />
                <track
                  src={file}
                  kind="captions"
                  srcLang="en"
                  label="english_captions"
                />
              </video>
            </Grid>
          </Grid>
        </Grid>
      </Box>
    </Grid>
  </Grid>
);

VideoModel.propTypes = {
  classes: PropTypes.objectOf(PropTypes.string).isRequired,
  file: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
};

export default withStyles(styles)(VideoModel);