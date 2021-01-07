/* eslint-disable no-nested-ternary */
/* eslint-disable react/jsx-wrap-multilines */
import React, { Component } from 'react';
import withStyles from '@material-ui/core/styles/withStyles';
// import { connect } from 'react-redux';
import {
  Grid,
  Card,
  Button,
  Typography,
  CardActions,
  CardMedia,
  CardContent,
  Paper,
  CardHeader,
  Divider,
  TextField,
} from '@material-ui/core';
import Rating from '@material-ui/lab/Rating';
import Avatar from '@material-ui/core/Avatar';
import StarBorderIcon from '@material-ui/icons/StarBorder';
// import { withRouter } from 'react-router-dom';
import CommonBreadcrumbs from '../../../components/common-breadcrumbs/breadcrumbs';
import Layout from '../../Layout';

const styles = (theme) => ({
  root: {
    flexGrow: 1,
    width: '100%',
    marginTop: 20,
  },
  cardRoot: {
    padding: theme.spacing(2),
    textAlign: 'center',
    color: theme.palette.text.secondary,
    borderRadius: 10,
    border: '1px solid #D5D5D5',
  },
  sideBlogs: {
    width: 200,
    height: 289,
    borderRadius: 16,
    marginBottom: 20,
  },
  media: {
    height: 300,
    borderRadius: 16,
  },
  author: {
    marginTop: 20,
    borderRadius: 16,
    border: '1px solid #D5D5D5',
  },
  reviewCard: {
    width: '100%',
    borderRadius: 16,
    marginBottom: 20,
    textAlign: 'center',
  },
});

const StyledRating = withStyles({
  iconFilled: {
    color: '#ff6d75',
  },
  iconHover: {
    color: '#ff3d47',
  },
})(Rating);
class ContentView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      relatedBlog: true,
      starsRating: 0,
      feedBack: false,
    };
  }

  render() {
    const { classes } = this.props;
    const { relatedBlog, starsRating, feedBack } = this.state;
    return (
      <div className='layout-container-div'>
        <Layout className='layout-container'>
          <div className='message_log_wrapper' style={{ backgroundColor: '#F9F9F9' }}>
            <div
              className='message_log_breadcrumb_wrapper'
              style={{ backgroundColor: '#F9F9F9' }}
            >
              <CommonBreadcrumbs componentName='Blog' />
              <div className='create_group_filter_container'>
                <div className={classes.root}>
                  <Grid container spacing={3}>
                    <Grid item xs={9}>
                      <Typography
                        style={{ cursor: 'Pointer' }}
                        onClick={() => window.history.back()}
                        align='right'
                      >
                        <u>Back to main Page</u>
                      </Typography>
                      <Card className={classes.cardRoot}>
                        <Typography
                          variant='h5'
                          component='h2'
                          style={{ marginBottom: 10 }}
                        >
                          Title
                        </Typography>
                        <CardMedia
                          className={classes.media}
                          image='https://en.as.com/en/imagenes/2020/02/09/football/1581260503_252075_noticia_normal.jpg'
                          title='Contemplative Reptile'
                        />
                        <CardHeader
                          className={classes.author}
                          avatar={
                            <Avatar aria-label='recipe' className={classes.avatar}>
                              R
                            </Avatar>
                          }
                          //   action={
                          //     <IconButton aria-label='settings'>
                          //       <MoreVertIcon />
                          //     </IconButton>
                          //   }
                          title='Shrimp and Chorizo Paella'
                          subheader='September 14, 2016'
                        />
                        <CardContent>
                          <Typography variant='body2' color='textSecondary' component='p'>
                            Lizards are a widespread group of squamate reptiles, with over
                            6,000 species, ranging across all continents except Antarctica
                          </Typography>
                        </CardContent>
                        <CardActions>
                          <Button style={{ width: 150 }} size='small' color='primary'>
                            Edit
                          </Button>
                          <Button style={{ width: 150 }} size='small' color='primary'>
                            Publish
                          </Button>
                        </CardActions>
                      </Card>
                    </Grid>
                    <Grid item xs={3}>
                      <Typography
                        variant='body1'
                        component='p'
                        style={{ marginBottom: 10 }}
                      >
                        Saved Drafts
                      </Typography>
                      <Card className={classes.sideBlogs}>
                        <CardContent>
                          <Typography gutterBottom variant='h5' component='h2'>
                            Lizard
                          </Typography>
                          <Typography variant='body2' color='textSecondary' component='p'>
                            Lizards are a widespread group of squamate reptiles, with over
                            6,000 species, ranging across all continents except Antarctica
                          </Typography>
                        </CardContent>
                        <CardActions>
                          <Button size='small' color='primary'>
                            Edit
                          </Button>
                        </CardActions>
                      </Card>
                      <Card className={classes.sideBlogs}>
                        <CardContent>
                          <Typography gutterBottom variant='h5' component='h2'>
                            Lizard
                          </Typography>
                          <Typography variant='body2' color='textPrimary' component='p'>
                            Lizards are a widespread group of squamate reptiles, with over
                            6,000 species, ranging across all continents except Antarctica
                          </Typography>
                        </CardContent>
                        <CardActions>
                          <Button size='small' color='primary'>
                            Edit
                          </Button>
                        </CardActions>
                      </Card>
                    </Grid>
                  </Grid>
                </div>
              </div>
            </div>
          </div>
        </Layout>
      </div>
    );
  }
}
export default withStyles(styles)(ContentView);
