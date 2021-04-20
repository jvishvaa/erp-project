import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CardMedia,
  Divider,
  Grid,
  IconButton,
  makeStyles,
  Tooltip,
  Typography,
} from '@material-ui/core';
import CommonBreadcrumbs from 'components/common-breadcrumbs/breadcrumbs';
import Layout from 'containers/Layout';
import MediaQuery from 'react-responsive';

import React from 'react';
import ReactHtmlParser from 'react-html-parser';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    border: '1px solid',
    borderColor: theme.palette.primary.main,
    padding: '1rem',
    borderRadius: '10px',
    width: 300,
    height: 250,

    margin: '20px',
  },

  details: {
    display: 'flex',
    flexDirection: 'column',
  },

  content: {
    flex: '1 0 auto',
  },
  cover: {
    width: 130,
    height: 200,
    borderRadius: '10px',
  },
}));
const PublicationPreview = ({ fun, handleGoBack }) => {
  const classes = useStyles();

  return (
    <>
      <Grid container direction='row'>
        <Grid container justify='center'>
          <Button size='small' color='primary' href={`/publications`}>
            Close
          </Button>
        </Grid>
        <Grid item md={3}>
          <Card className={classes.root}>
            <CardMedia
              className={classes.cover}
              image={localStorage.getItem('image')}
              title='Live from space album cover'
            />
            <div className={classes.details}>
              <CardContent className={classes.content}>
                <Typography component='h6' variant='h6'>
                  {localStorage.getItem('title')}
                </Typography>
                <Typography variant='subtitle1' color='textSecondary'>
                  {localStorage.getItem('author')}
                </Typography>
                <Typography variant='subtitle2' color='textSecondary'>
                  Publication:
                  {localStorage.getItem('book_type') === 1 ? 'magazine' : 'newsletter'}
                </Typography>
              </CardContent>
            </div>
          </Card>
        </Grid>
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
        <MediaQuery minWidth={600}>
          <Grid item md={8} container direction='row' style={{ margin: '3%' }}>
            <Grid item md={3}>
              <Button
                size='small'
                variant='contained'
                disabled
                style={{ paddingLeft: '50px', paddingRight: '50px' }}
              >
                Delete
              </Button>
            </Grid>
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
          <Grid container direction='row' style={{ margin: '3%' }}>
            <Grid item xs={3}>
              <Button size='small' variant='contained' disabled>
                Delete
              </Button>
            </Grid>
            <Grid item xs={3}>
              <Button size='small' color='primary' onClick={handleGoBack}>
                Edit
              </Button>
            </Grid>
            <Grid item xs={3}>
              <Button size='small' color='primary' onClick={fun}>
                Publish
              </Button>
            </Grid>
          </Grid>
        </MediaQuery>
      </Grid>
    </>
  );
};

export default PublicationPreview;
