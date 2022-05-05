import React from 'react';
import {
  Grid, Typography, withStyles, Divider, Box,
} from '@material-ui/core';
import PropTypes from 'prop-types';
import styles from './MoreInfo.style';
// import urls from '../../../url';

const MoreInfo = ({ classes }) => {
  // const [auth] = useState(JSON.parse(localStorage.getItem('UserLogin')));
  const chapter = JSON.parse(localStorage.getItem('chapterdata'));

  // const coursePrincipalCompleted = async (id) => {
  //   const data = {
  //     course: id,
  //     is_self_driven: 'True',
  //   };
  //   const response = await fetch(urls.principalCompletedViewCourse, {
  //     method: 'POST', // or 'PUT'
  //     body: JSON.stringify(data), // data can be `string` or {object}!
  //     headers: {
  //       Authorization: `Bearer ${auth.personal_info.token}`,
  //       'Content-Type': 'application/json',
  //     },
  //   });
  //   const getDataiNFO = await response.json();
  //   // setBranchSubmit("");
  //   // setVideo("");
  //   return getDataiNFO;
  // };

  const videoPlay = (file, title) => {
    let play = null;
    play = (
      <>
        <Grid container spacing={2}>
          <Grid item md={10} xs={12}>
            <Typography variant="h5">{title}</Typography>
            <Divider className={classes.divider} />
          </Grid>
          <Grid item md={12} xs={12}>
            <Grid item md={10} xs={12} style={{ margin: '12px 0px' }}>
              <video
                id="background-video"
                controls
                controlsList="nodownload"
                alt="video file is crashed"
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

  const showImage = (imageFile, title) => {
    let text = null;
    text = (
      <>
        <Grid container spacing={2}>
          <Grid item md={10} xs={12}>
            <Typography variant="h5">{title}</Typography>
            <Divider className={classes.divider} />
          </Grid>
          <Grid item md={1} />
          <Grid item md={10} xs={12}>
            <Grid item md={10} xs={12} style={{ margin: '12px 0px' }}>
              <iframe
                title="myFrame"
                src={`http://docs.google.com/gview?url=${imageFile}&embedded=true`}
                style={{ width: '100%', height: '700px', frameborder: '0' }}
                alt="PDF file is crashed"
              />
            </Grid>
          </Grid>
          <Divider className={classes.divider} />
        </Grid>
      </>
    );
    return text;
  };

  const assiessmentDisplay = (FileAssessment, title) => {
    let assiessmentFile = null;
    assiessmentFile = (
      <>
        <Grid container spacing={2}>
          <Grid item md={1} />
          <Grid item md={10} xs={12}>
            <Typography variant="h5">{title}</Typography>
            <Divider className={classes.divider} />
          </Grid>
          <Grid item md={2} />
          <Grid item md={10} xs={12}>
            <Grid item md={10} xs={12} style={{ margin: '12px 0px' }}>
              <iframe
                title="myFrame"
                src={`http://docs.google.com/gview?url=${FileAssessment}&embedded=true`}
                style={{ width: '100%', height: '700px', frameborder: '0' }}
                alt="PDF file is crashed"
              />
            </Grid>
          </Grid>
          <Divider className={classes.divider} />
        </Grid>
      </>
    );
    return assiessmentFile;
  };
  const textDisplay = (document, title) => {
    let text = null;
    text = (
      <>
        <Grid container spacing={2}>
          <Grid item md={10} xs={12}>
            <Typography variant="h5">{title}</Typography>
            <Divider className={classes.divider} />
          </Grid>
          <Grid item md={12} xs={12}>
            <Grid
              item
              md={10}
              xs={12}
              style={{ margin: '12px 0px', textAlign: 'justify' }}
            >
              <Typography alt="text file null">{document}</Typography>
            </Grid>
          </Grid>
        </Grid>
      </>
    );
    return text;
  };

  const showPPT = (document123) => ({ __html: document123 });

  const renderData = () => {
    let showChapters = null;
    showChapters = (
      <>
        {chapter
          && chapter.map((index, id) => (
            // eslint-disable-next-line react/no-array-index-key
            <React.Fragment key={id}>
              <Grid container>
                <Grid item md={2} />
                <Grid item md={10} xs={12} id="parent">
                  {index && index.content_type === 'Video'
                    ? videoPlay(index.file, index.title)
                    : ''}
                  {index && index.content_type === 'Text'
                    ? textDisplay(index.document, index.title)
                    : ''}
                  {index && index.content_type === 'File'
                    ? showImage(index.file, index.title)
                    : ''}
                  {index && index.content_type === 'ppt' && (
                    <Grid container spacing={2}>
                      <Grid item md={10} xs={12}>
                        <Typography variant="h5">{index.title}</Typography>
                        <Divider className={classes.divider} />
                      </Grid>
                      <Grid
                        item
                        md={12}
                        xs={12}
                        style={{ margin: '12px 0px', textAlign: 'justify' }}
                        dangerouslySetInnerHTML={showPPT(
                          index.ppt_iframe,
                          index.title,
                        )}
                      />
                    </Grid>
                  )}
                  {index && index.content_type === 'Assignment'
                    ? assiessmentDisplay(index.file, index.title)
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
      <Grid container>
        <Grid item md={1} />
        <Grid item md={10} xs={12}>
          <Box border={2} className={classes.paper}>
            {chapter && chapter.length !== 0 ? (
              renderData()
            ) : (
              <Typography variant="h4">
                Content of this chapter is empty..!
              </Typography>
            )}
          </Box>
        </Grid>
      </Grid>
      {/* {localStorage.getItem('roleType') === '"Principal"' && (
        <button
          type="submit"
          style={{
            padding: '0.6rem 1rem',
            backgroundColor: 'royalBlue',
            color: 'white',
            border: '1px solid transparent',
            borderRadius: '4px',
            cursor: 'pointer',
          }}
          onClick={() => coursePrincipalCompleted(
            localStorage.getItem('viewID'),
            localStorage.getItem('principalCourseType'),
          )}
        >
          Complete
        </button>
      )} */}
    </>
  );
};

MoreInfo.propTypes = {
  classes: PropTypes.instanceOf(Object).isRequired,
};

export default withStyles(styles)(MoreInfo);
