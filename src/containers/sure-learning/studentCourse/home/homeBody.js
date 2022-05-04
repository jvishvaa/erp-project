import React from 'react';
import { Grid, Typography, withStyles } from '@material-ui/core';
import styles from './homeBody.style';
// import { useAlert } from '../../hoc/alert/alert';
// import useFetch from '../../hoc/useFetch';
// import urls from '../../url';
// import Loader from '../../hoc/loader';

const HomeBody = () => {
  // const [auth] = useState(JSON.parse(localStorage.getItem('UserLogin')));
  const chapter = JSON.parse(localStorage.getItem('chapterdata'));
  const chapterID = localStorage.getItem('chapterID');

  const videoPlay = (file) => {
    let play = null;
    play = (
      <>
        <Grid container spacing={2}>
          <Grid item md={1} />
          <Grid item md={10} xs={12}>
            <Grid item md={10} xs={12} style={{ margin: '12px 0px' }}>
              <video
                id="background-video"
                controls
                controlsList="nodownload"
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

  return (
    <>
      <Grid container style={{ marginTop: '20vh' }}>
        <Grid item md={1} xs={1} />
        <Grid item md={10} xs={10}>
          {chapter && chapter.length !== 0 && chapterID ? (
            renderData()
          ) : (
            <Typography variant="h4">
              Content of this chapter is empty..!
            </Typography>
          )}
        </Grid>
      </Grid>
    </>
  );
};

export default withStyles(styles)(HomeBody);
