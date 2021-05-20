import {
  Button,
  ButtonBase,
  Divider,
  Grid,
  IconButton,
  makeStyles,
  Paper,
  Typography,
} from '@material-ui/core';

import MediaQuery from 'react-responsive';

import React, { useState } from 'react';
import ReactHtmlParser from 'react-html-parser';
import moment from 'moment';
import Loading from '../../components/loader/loader';

const useStyles = makeStyles((theme) => ({
  root: {
    border: '1px solid',

    margin: '20px',
  },

  details: {
    display: 'flex',
    flexDirection: 'column',
  },

  content: {
    flex: '1 0 auto',
  },

  image: {
    width: '120px',
    height: '177px',
    borderRadius: '10px',
    display: 'block',
    margin: '2%',
  },
  image1: {
    width: '120px',
    height: '177px',
    borderRadius: '10px',
    display: 'block',
    margin: '2%',
  },
  paperSize: {
    marginLeft: '2%',
    marginTop: '5%',
    width: '350px',
    height: '187px',
    borderRadius: '20px',
  },
}));
const PublicationPreview = ({ fun, handleGoBack, entireBack }) => {
  const classes = useStyles();
  const [dateValue, setDateValue] = useState(moment(new Date()).format('YYYY-MM-DD'));
  const [loading, setLoading] = React.useState();
  return (
    <>
      {loading ? <Loading message='Loading...' /> : null}
      <MediaQuery minWidth={600}>
        <Grid container direction='row'>
          <Grid container justify='center'>
            <Button size='small' color='primary' href={`/publications`}>
              Close
            </Button>
          </Grid>

          <Paper elevation={3} className={[classes.paperSize, classes.root]}>
            <Grid container spacing={2}>
              <Grid item>
                <ButtonBase className={classes.image}>
                  <img
                    className={classes.image}
                    alt='complex'
                    src={localStorage.getItem('image')}
                  />
                </ButtonBase>
              </Grid>
              <Grid item xs={12} sm container>
                <Grid item xs container direction='column' spacing={2}>
                  <Grid item xs>
                    <Typography gutterBottom variant='subtitle1' color='secondary'>
                      <b style={{ fontSize: '16px' }}>{localStorage.getItem('title')}</b>
                    </Typography>
                    <Typography variant='body2' gutterBottom>
                      <span style={{ fontSize: '16px' }}>
                        {' '}
                        Author: {localStorage.getItem('author')}
                      </span>
                    </Typography>
                  </Grid>
                  <Grid item>
                    <Typography variant='body2'>
                      <span style={{ fontSize: '16px' }}>
                        Publication:
                        {localStorage.getItem('book_type') === 1
                          ? 'magazine'
                          : 'newsletter'}
                      </span>
                    </Typography>
                    <Typography variant='body2'>
                      {' '}
                      <span style={{ fontSize: '16px' }}>{dateValue}</span>
                    </Typography>
                    <Typography variant='body2'>
                      <span style={{ fontSize: '16px' }}>
                        {' '}
                        Branch: {localStorage.getItem('zone')}
                      </span>
                    </Typography>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Paper>
        </Grid>
        <Grid item md={12} style={{ margin: '20px' }}>
          <Typography>
            Description:{ReactHtmlParser(localStorage.getItem('description'))}
          </Typography>
        </Grid>
        <Grid container justify='center'>
          <Grid item md={8}>
            <Divider />
          </Grid>
        </Grid>
        <Grid item md={8} container direction='row' style={{ margin: '3%' }}>
          <Grid item md={3}>
            <Button
              size='small'
              color='primary'
              onClick={handleGoBack}
              style={{ paddingLeft: '50px', paddingRight: '50px' }}
            >
              Edit
            </Button>
          </Grid>
          <Grid item md={3}>
            <Button
              size='small'
              color='primary'
              onClick={fun}
              style={{ paddingLeft: '50px', paddingRight: '50px' }}
            >
              Publish
            </Button>
          </Grid>
        </Grid>
      </MediaQuery>
      <MediaQuery maxWidth={599}>
        <Grid container direction='row'>
          <Grid container justify='center'>
            <Button size='small' color='primary' href={`/publications`}>
              Close
            </Button>
          </Grid>

          <Paper elevation={3} className={[classes.paperSize, classes.root]}>
            <Grid container spacing={2}>
              <Grid item xs container spacing={2}>
                <Grid item style={{ display: 'flex' }}>
                  <ButtonBase className={classes.image1}>
                    <img
                      className={classes.image1}
                      alt='complex'
                      src={localStorage.getItem('image')}
                    />
                  </ButtonBase>

                  <Grid container direction='column'>
                    <Grid>
                      <Typography gutterBottom variant='subtitle1'>
                        <b style={{ fontSize: '16px' }}>
                          {localStorage.getItem('title')}
                        </b>
                      </Typography>
                    </Grid>
                    <Grid>
                      <Typography variant='body2' gutterBottom>
                        <span style={{ fontSize: '16px' }}>
                          {' '}
                          Author: {localStorage.getItem('author')}
                        </span>
                      </Typography>
                    </Grid>
                    <Grid>
                      <Typography variant='body2'>
                        <span style={{ fontSize: '16px' }}>
                          Publication:
                          {localStorage.getItem('book_type') === 1
                            ? 'magazine'
                            : 'newsletter'}
                        </span>
                      </Typography>
                    </Grid>
                    <Grid>
                      <Typography variant='body2'>
                        {' '}
                        <span style={{ fontSize: '16px' }}>{dateValue}</span>
                      </Typography>
                      <Typography variant='body2'>
                        <span style={{ fontSize: '16px' }}>
                          {' '}
                          Branch: {localStorage.getItem('zone')}
                        </span>
                      </Typography>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Paper>
        </Grid>
        <Grid item md={12} style={{ margin: '20px' }}>
          <Typography>
            Description:{ReactHtmlParser(localStorage.getItem('description'))}
          </Typography>
        </Grid>
        <Grid container justify='center'>
          <Grid item md={8}>
            <Divider />
          </Grid>
        </Grid>

        <Grid item xs={12} style={{ margin: '2%' }}>
          <Button
            size='small'
            color='primary'
            onClick={handleGoBack}
            style={{ width: '100%' }}
          >
            Edit
          </Button>
        </Grid>
        <Grid item xs={12} style={{ margin: '2%' }}>
          <Button size='small' color='primary' onClick={fun} style={{ width: '100%' }}>
            Publish
          </Button>
        </Grid>
      </MediaQuery>
    </>
  );
};

export default PublicationPreview;
