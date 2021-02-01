/* eslint-disable no-nested-ternary */
/* eslint-disable react/jsx-wrap-multilines */
import React, { Component } from 'react';
import withStyles from '@material-ui/core/styles/withStyles';
import moment from 'moment';

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
import { withRouter } from 'react-router-dom';
import CommonBreadcrumbs from '../../../components/common-breadcrumbs/breadcrumbs';
import SideBar from './sideBar';
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
      data: this.props.location.state.data && this.props.location.state.data
    };
    console.log(this.props,"22222222222@@@@@")

  }
  componentDidMount() {
    console.log(this.state.data);
  }
  
  render() {
    console.log(this.props,"22222222222@@@@@")
    const { classes } = this.props;
    const { relatedBlog, starsRating, feedBack ,data} = this.state;
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
                            {data.title}
                        </Typography>
                        <CardMedia className={classes.media} image={data.thumbnail} />

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
                          title={data.author.first_name}
                          subheader=
                          {data && moment(data.created_at).format('MMM DD YYYY')}

                        />
                        <CardContent>
                          <Typography variant='body2' color='textSecondary' component='p'>
                            {data.content}
                          </Typography>
                        </CardContent>
                        <CardActions>
                          <Button
                            size='small'
                            color='primary'
                            onClick={() => {
                              this.setState({
                                relatedBlog: !relatedBlog,
                                feedBack: false,
                              });
                            }}
                          >
                            {relatedBlog ? 'Add Review' : 'View Related Blog'}
                          </Button>
                          <Button
                            size='small'
                            color='primary'
                            onClick={() => this.setState({ feedBack: true })}
                          >
                            Add Feedback
                          </Button>
                        </CardActions>
                      </Card>
                    </Grid>
                    <Grid item xs={3}>
                      {feedBack ? (
                        <Card style={{ minWidth: 320 }} className={classes.reviewCard}>
                          <CardContent>
                            <Typography
                              align='center'
                              component='h2'
                              style={{ fontWeight: 500 }}
                              variant='body1'
                            >
                              Review
                            </Typography>
                            <TextField
                              id='outlined-multiline-static'
                              multiline
                              rows={12}
                              placeholder='Provide Feedback related to this blog..'
                              variant='outlined'
                            />
                            <br />
                            <CardActions>
                              <Button
                                style={{ fontSize: 12 }}
                                size='small'
                                color='primary'
                              >
                                Revisions Needed
                              </Button>
                              <Button
                                style={{ fontSize: 12, marginLeft: '20%' }}
                                size='small'
                                color='primary'
                              >
                                Add Review
                              </Button>
                            </CardActions>
                            <Button fullWidth size='small' color='primary'>
                              Publish
                            </Button>
                          </CardContent>
                        </Card>
                      ) : relatedBlog ? ''
                      // (
                      //   <>
                      //     <SideBar />
                      //   </>
                      // ) 
                      : (
                        <Card className={classes.reviewCard}>
                          <CardContent>
                            <Typography
                              align='center'
                              component='h2'
                              style={{ fontWeight: 500 }}
                              variant='body1'
                            >
                              Review
                            </Typography>
                            <Divider variant='middle' />
                            <Typography
                              align='center'
                              color='textPrimary'
                              component='h2'
                              variant='overline'
                            >
                              CLARITY
                            </Typography>
                            <StyledRating
                              name='size-medium'
                              defaultValue={starsRating}
                              emptyIcon={
                                <StarBorderIcon color='primary' fontSize='inherit' />
                              }
                            />
                            <TextField
                              id='outlined-textarea'
                              placeholder='Add Review...optional'
                              multiline
                              variant='outlined'
                            />
                            <Divider variant='middle' />
                            <Typography
                              align='center'
                              color='textPrimary'
                              component='p'
                              variant='overline'
                            >
                              GRAMMER
                            </Typography>
                            <StyledRating
                              name='size-medium'
                              defaultValue={starsRating}
                              emptyIcon={
                                <StarBorderIcon color='primary' fontSize='inherit' />
                              }
                            />
                            <TextField
                              id='outlined-textarea'
                              placeholder='Add Review...optional'
                              multiline
                              variant='outlined'
                            />
                            <Divider variant='middle' />
                            <Typography
                              align='center'
                              color='textPrimary'
                              component='p'
                              variant='overline'
                            >
                              STRUCTURE
                            </Typography>
                            <StyledRating
                              name='size-medium'
                              defaultValue={starsRating}
                              emptyIcon={
                                <StarBorderIcon color='primary' fontSize='inherit' />
                              }
                            />
                            <TextField
                              id='outlined-textarea'
                              placeholder='Add Review...optional'
                              multiline
                              variant='outlined'
                            />
                            <Divider variant='middle' />
                            <Typography
                              align='center'
                              color='textPrimary'
                              component='p'
                              variant='overline'
                            >
                              VOCABULARY
                            </Typography>
                            <StyledRating
                              name='size-medium'
                              defaultValue={starsRating}
                              emptyIcon={
                                <StarBorderIcon color='primary' fontSize='inherit' />
                              }
                            />
                            <TextField
                              id='outlined-textarea'
                              placeholder='Add Review...optional'
                              multiline
                              variant='outlined'
                            />
                            <Divider variant='middle' />
                            <Typography
                              align='center'
                              color='textPrimary'
                              component='p'
                              variant='overline'
                            >
                              COHERENCE
                            </Typography>
                            <StyledRating
                              name='size-medium'
                              defaultValue={starsRating}
                              emptyIcon={
                                <StarBorderIcon color='primary' fontSize='inherit' />
                              }
                            />
                            <TextField
                              id='outlined-textarea'
                              placeholder='Add Review...optional'
                              multiline
                              variant='outlined'
                            />
                            <Divider variant='middle' />
                            <Typography
                              align='center'
                              color='textPrimary'
                              component='p'
                              variant='overline'
                            >
                              ENGAGEMENT
                            </Typography>
                            <StyledRating
                              name='size-medium'
                              defaultValue={starsRating}
                              emptyIcon={
                                <StarBorderIcon color='primary' fontSize='inherit' />
                              }
                            />
                            <TextField
                              id='outlined-textarea'
                              placeholder='Add Review...optional'
                              multiline
                              variant='outlined'
                            />
                            <Divider variant='middle' />
                            <Typography
                              align='center'
                              color='textPrimary'
                              component='p'
                              variant='overline'
                            >
                            OVERALL RATING
                            </Typography>
                            <StyledRating
                              name='size-medium'
                              defaultValue={starsRating}
                              emptyIcon={
                                <StarBorderIcon color='primary' fontSize='inherit' />
                              }
                            />
                            <TextField
                              id='outlined-textarea'
                              placeholder='Add Review....mandatory'
                              multiline
                              variant='outlined'
                            />
                          </CardContent>
                        </Card>
                      )}
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
export default withRouter(withStyles(styles)(ContentView));
