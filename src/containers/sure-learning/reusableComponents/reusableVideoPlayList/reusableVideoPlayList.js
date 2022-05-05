import React from 'react';
import {
  // Paper,
  Grid,
  // Typography,
  withStyles,
  // Button,
  // Box,
  // TextareaAutosize,
} from '@material-ui/core';
import PropTypes from 'prop-types';
import styles from './reusableVideoPlayList.style';

const ReusableContinueCourse = ({ classes, chapter }) => {
  const videoPlay = (file) => {
    let play = null;
    play = (
      <>
        <Grid container spacing={2} className={classes.griddddddd}>
          <Grid item md={1} />
          <Grid item md={10} xs={12}>
            <Grid item md={10} xs={12} style={{ margin: '12px 0px' }}>
              <video
                controlsList="nodownload"
                id="background-video"
                controls
                alt="course"
                height="100%"
                width="100%"
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
      </>
    );
    return play;
  };
  const showImage = (imageFile) => {
    let text = null;
    text = (
      <>
        <Grid container spacing={2}>
          <Grid item md={1} />
          <Grid item md={10} xs={12}>
            <Grid item md={10} xs={12} style={{ margin: '12px 0px' }}>
              <img style={{ width: '100%' }} src={imageFile} alt="course" />
            </Grid>
          </Grid>
        </Grid>
      </>
    );
    return text;
  };
  const textDisplay = (document) => {
    let text = null;
    text = (
      <>
        <Grid container spacing={2}>
          <Grid item md={1} />
          <Grid item md={10} xs={12}>
            <Grid
              item
              md={10}
              xs={12}
              style={{ margin: '12px 0px', textAlign: 'justify' }}
            >
              <p>{document}</p>
            </Grid>
          </Grid>
        </Grid>
      </>
    );
    return text;
  };
  const renderData = () => {
    let showChapters = null;

    showChapters = (
      <>
        {chapter
          && chapter.map((index, id) => (
            // eslint-disable-next-line react/no-array-index-key
            <React.Fragment key={id}>
              <Grid container>
                <Grid item md={1} />

                <Grid item md={10} xs={12}>
                  {index && index.content_type === 'Video'
                    ? videoPlay(index.file, index.title)
                    : ''}
                  {index && index.content_type === 'Text'
                    ? textDisplay(index.document, index.title)
                    : ''}
                  {index && index.content_type === 'File'
                    ? showImage(index.file, index.title)
                    : ''}
                </Grid>
              </Grid>
            </React.Fragment>
          ))}
      </>
    );
    return showChapters;
  };

  return <>{chapter ? renderData() : ''}</>;
};
ReusableContinueCourse.defaultProps = {
  chapter: null,
};
ReusableContinueCourse.propTypes = {
  classes: PropTypes.instanceOf(Object).isRequired,
  chapter: PropTypes.instanceOf(Object),
};

export default withStyles(styles)(ReusableContinueCourse);
