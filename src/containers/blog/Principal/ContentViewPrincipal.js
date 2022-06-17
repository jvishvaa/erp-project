/* eslint-disable no-nested-ternary */
/* eslint-disable react/jsx-wrap-multilines */
import React, { Component } from 'react';
import moment from 'moment';
import {
  Grid,
  Card,
  Button,
  Typography,
  CardActions,
  CardMedia,
  CardContent,
  CardHeader,
  TextField,
} from '@material-ui/core';
import withStyles from '@material-ui/core/styles/withStyles';

import ReactHtmlParser from 'react-html-parser'
import Avatar from '@material-ui/core/Avatar';
import Autocomplete from '@material-ui/lab/Autocomplete';
import { withRouter } from 'react-router-dom';
import axios from '../../../config/axios';
import endpoints from '../../../config/endpoints';
import CommonBreadcrumbs from '../../../components/common-breadcrumbs/breadcrumbs';
import ReviewPrincipal from './ReviewPrincipal'
import Layout from '../../Layout';
import { Visibility, FavoriteBorder, Favorite } from '@material-ui/icons';
// import { AlertNotificationContext } from '../../../context-api/alert-context/alert-state';
import PictureAsPdfIcon from '@material-ui/icons/PictureAsPdf';
import { AttachmentPreviewerContext } from '../../../components/attachment-previewer/attachment-previewer-contexts';

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
    backgroundSize: 380
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
  ViewColor: {
    color: `${theme.palette.primary.main} !important`
  },
  likeColor: {
    color: 'red !important'
  },
  likeAndViewbtn: {
    fontFamily: 'Open Sans',
    fontSize: '12px',
    fontWeight: 'lighter',
    textTransform: 'capitalize',
    color: theme.palette.primary.main,
    backgroundColor: 'white',
  },
  ViewColor: {
    color: `${theme.palette.primary.main} !important`
  },
});

let openPreview = '';

const publishLevelChoice = [
  { label: 'Branch', value: '2' },
  { label: 'Grade', value: '3' },
  { label: 'Section', value: '4' }

]
class ContentView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      relatedBlog: true,
      starsRating: 0,
      feedBack: false,
      isPublish: false,
      data: this.props.location.state.data && this.props.location.state.data,
      tabValue: this.props.location.state.tabValue && this.props.location.state.tabValue,
      comment: '',
      roleDetails: JSON.parse(localStorage.getItem('userDetails')),
      blogRatings: this.props.location.state.data && this.props.location.state.data.remark_rating,
      overallRemark: this.props.location.state.data && this.props.location.state.data.overall_remark,
      blogId: this.props.location.state.data && this.props.location.state.data.id,
      likeStatus: false,
      currentLikes: 0,
      loading: false,
      likes: this.props.location.state.data && this.props.location.state.data.likes,
      loginUserName: JSON.parse(localStorage.getItem('userDetails')).erp_user_id

    };

  }
  // static contextType = AlertNotificationContext;
  static contextType = AttachmentPreviewerContext;
  componentDidMount() {
    let { blogId } = this.state;
    this.handleView(blogId);
    openPreview = this.context.openPreview;
  }


  handleView = (blogId) => {
    let requestData = {
      "blog_id": blogId,
    }
    axios.post(`${endpoints.blog.BlogView}`, requestData)
      .then(result => {
        if (result.data.status_code === 200) {
        } else {
        }
      }).catch((error) => {
      })
  }
  getLikeStatus = (isLiked) => {
    let { likeStatus, likes } = this.state
    if (isLiked === true && likeStatus === false) {
      this.setState({ currentLikes: likes - 1, likeStatus: true })
    } else if (isLiked === true && likeStatus === true) {
      this.setState({ currentLikes: likes + 1, likeStatus: false })

    } else if (isLiked === false && likeStatus === false) {
      this.setState({ currentLikes: likes + 1, likeStatus: true })

    } else if (isLiked === false && likeStatus === true) {
      this.setState({ currentLikes: likes, likeStatus: false })

    }
  }
  handleLike = (isLiked, blogId) => {
    this.getLikeStatus(isLiked)
    let requestData = {
      "blog_id": blogId,

    }
    axios.post(`${endpoints.blog.BlogLike}`, requestData)

      .then(result => {
        if (result.data.status_code === 200) {
          this.setState({ loading: false })
        } else {
          this.setState({ loading: false })
        }
      }).catch((error) => {
        this.setState({ loading: false })
      })
  }


  submitComment = () => {
    const { data, comment } = this.state;
    const formData = new FormData();
    formData.set('blog_id', data.id);
    formData.set('status', 7);
    formData.set('comment', comment);

    axios
      .put(`${endpoints.blog.Blog}`, formData)
      .then((result) => {
        if (result.data.status_code === 200) {
          this.props.history.push({
            pathname: '/blog/principal',
          });
        } else {
          console.log(result.data.message);
        }
      })
      .catch((error) => {
      });
  };
  handleReivisionNameChange = (e) => {
    this.setState({ comment: e.target.value })
  };
  submitPublish = () => {
    const { data, publishedLevel, roleDetails } = this.state;
    const formData = new FormData();
    formData.set('blog_id', data.id);
    formData.set('status', 4);
    formData.set('published_level', publishedLevel);
    if (publishedLevel === '2') {
      let branchId = roleDetails && roleDetails.role_details.branch && roleDetails.role_details.branch[0]
      formData.set('branch_id', branchId);

    }
    axios
      .put(`${endpoints.blog.Blog}`, formData)
      .then((result) => {
        if (result.data.status_code === 200) {
          // this.context.setAlert('success', 'Blog Published Successfully');
          this.props.history.push({
            pathname: '/blog/principal',
          });
        } else {
          console.log(result.data.message);

        }
      })
      .catch((error) => {
      });
  };

  handlePublishLevelType = (event, value) => {
    if (value && value.value) {
      this.setState({ publishedLevel: value.value })
    }
    else {
      this.setState({ publishedLevel: '' })

    }
  }
  getRatings = () => {
    let { blogRatings } = this.state
    if (!blogRatings) {
      return []
    }
    const type = typeof blogRatings
    const parsedRatings = type === 'object' ? blogRatings : JSON.parse(blogRatings)
    const allRatingParamters = JSON.parse(parsedRatings)
    return allRatingParamters
  }

  getOverAllRemark = () => {
    let { overallRemark } = this.state
    return overallRemark
  }


  render() {
    const { classes } = this.props;
    const { roleDetails, likes, currentLikes, likeStatus, loginUserName, tabValue, relatedBlog, starsRating, feedBack, data, comment, isPublish, publishedLevel } = this.state;

    const blogFkLike = data && data.blog_fk_like
    const likedUserIds = blogFkLike.map(blog => blog.user)
    const indexOfLoginUser = likedUserIds.indexOf(roleDetails.user_id)
    const loginUser = likedUserIds.includes(roleDetails.user_id)
    const isLiked = loginUser ? blogFkLike[indexOfLoginUser].is_liked : false
    const name = data && data.author && data.author.id
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
                    <Grid item xs={12}>
                      <Button
                        className='labelColor cancelButton'
                        style={{ cursor: 'Pointer' }}
                        onClick={() => window.history.back()}
                        align='right'
                      >
                        <i>Back</i>
                      </Button>
                    </Grid>
                    <Grid item xs={9}>
                      <Card className={classes.cardRoot}>
                        <Typography
                          variant='h5'
                          component='h2'
                          style={{ marginBottom: 10 }}
                        >
                          {data.title}
                        </Typography>
                        {/* <CardMedia className={classes.media} image={data.thumbnail} /> */}
                        {'.' + this?.state?.data?.thumbnail.split('.')[this?.state?.data?.thumbnail.split('.').length - 1] == '.pdf' ?
                          <div onClick={() => {
                            openPreview({
                              currentAttachmentIndex: 0,
                              attachmentsArray: [
                                {
                                  // src: `${endpoints.lessonPlan.s3}${file}`,
                                  src: `${this?.state?.data?.thumbnail}`,
                                  // name: `${p?.document_type}`,
                                  // name: this.state.files.split('.')[this.state.files.split('.').length - 2],
                                  extension: '.' + this?.state?.data?.thumbnail.split('.')[this?.state?.data?.thumbnail?.split('.')?.length - 1],
                                  // extension: '.jpg,.jpeg,.png,.pdf',
                                },
                              ],
                            });
                          }} className={classes.media}>
                            <PictureAsPdfIcon style={{ height: 200, width: 200 }} />
                            <div style={{ fontSize: '16px' }}><b>'Click on the PDF icon to view'</b></div>
                          </div>
                          :
                          <CardMedia
                            className={classes.media}
                            image={this?.state?.data?.thumbnail}
                            title='Blog Images and PDF'
                            onClick={() => {
                              openPreview({
                                currentAttachmentIndex: 0,
                                attachmentsArray: [
                                  {
                                    // src: `${endpoints.lessonPlan.s3}${file}`,
                                    src: `${this?.state?.data?.thumbnail}`,
                                    // name: `${p?.document_type}`,
                                    // name: this.state.files.split('.')[this.state.files.split('.').length - 2],
                                    extension: '.' + this?.state?.data?.thumbnail.split('.')[this?.state?.data?.thumbnail.split('.').length - 1],
                                    // extension: '.jpg,.jpeg,.png,.pdf',
                                  },
                                ],
                              });
                            }}
                            rel='noopener noreferrer'
                            target='_blank'
                          />
                        }
                        {data.feedback_revision_required ? (
                          <CardContent>
                            {' '}
                            <Typography color="primary" style={{ fontSize: '12px' }}>
                              Revision Feedback:{data.feedback_revision_required}
                            </Typography>
                            <Typography style={{ fontSize: '12px' }}>
                              {' '}
                              Revised By:
                              {data &&
                                data.feedback_revision_by &&
                                data.feedback_revision_by.first_name}
                            </Typography>
                          </CardContent>
                        ) : data.comment ? (
                          <CardContent>
                            {' '}
                            <Typography color="primary" style={{ fontSize: '12px' }}>
                              Comment:{data.comment}
                            </Typography>
                            <Typography style={{ fontSize: '12px' }}>
                              {' '}
                              Commented By:
                              {data && data.commented_by && data.commented_by.first_name}
                            </Typography>
                            <Typography style={{ fontSize: '12px' }}> Revised By:{data && data.feedback_revision_by && data.feedback_revision_by.first_name}</Typography></CardContent>
                        ) : data.comment ?
                          <CardContent>
                            <Typography
                              color="primary"
                              style={{ fontSize: '12px' }}
                            >Comment:{data.comment}

                            </Typography>
                            <Typography style={{ fontSize: '12px' }}> Commented By:{data && data.commented_by && data.commented_by.first_name}</Typography>
                          </CardContent> : ''}
                        <CardHeader
                          className={classes.author}
                          avatar={
                            <Avatar aria-label='recipe' className={classes.avatar}>
                              R
                            </Avatar>
                          }
                          title={data.author.first_name}
                          subheader=
                          {data && moment(data.created_at).format('MMM DD YYYY')}

                        />
                        <CardContent>
                          <Typography variant='body2' color='textSecondary' component='p'>
                            {ReactHtmlParser(data.content)}
                          </Typography>
                          <Typography component='p' style={{ paddingRight: '650px', fontSize: '12px' }}
                          >
                            Total Words : {data.word_count}
                          </Typography>
                          <Typography component='p' style={{ paddingRight: '650px', fontSize: '12px' }}>
                            Genre: {data.genre && data.genre.genre}
                          </Typography>
                        </CardContent>
                        <CardActions>
                          {loginUserName !== name ? <Button
                            className={classes.likeAndViewbtn}
                            onClick={() => this.handleLike(isLiked, data.id)}
                          > {isLiked || likeStatus ? <Favorite className={classes.likeColor} />
                            : <FavoriteBorder className={classes.likeColor} />} {currentLikes === 0 ? likes
                              : currentLikes
                            }Likes
                          </Button> : ''} &nbsp;&nbsp;&nbsp;
                          <Button
                            className={classes.likeAndViewbtn}
                          >   <Visibility className={classes.ViewColor} />{data.views}Views
                          </Button>
                          {tabValue === 1 && !data.feedback_revision_required && !data.comment && !data.published_by ?
                            <Button
                              size='small'
                              color='primary'
                              variant="contained"
                              onClick={() => this.setState({ feedBack: true })}
                            >
                              Comment
                            </Button> : ''}
                          {
                            data.feedback_revision_required !== null ?
                              <Button
                                size='small'
                                variant="contained"
                                color='primary'
                                onClick={() => this.setState({ isPublish: true })}
                              >
                                Publish
                              </Button> : ''

                          }


                          {data.feedback_revision_required !== null ?
                            <Button
                              size='small'
                              variant="contained"
                              color='primary'
                              onClick={() => {
                                this.setState({
                                  relatedBlog: !relatedBlog,
                                  feedBack: false,
                                });
                              }}
                            >
                              {relatedBlog ? 'Review' : 'View Related Blog'}
                            </Button> : ''}




                        </CardActions>
                      </Card>
                    </Grid>
                    <Grid item xs={3}>
                      {feedBack ? (
                        <Card style={{ minWidth: 320 }} className={classes.reviewCard}>
                          <CardContent>
                            <TextField
                              id='outlined-multiline-static'
                              multiline
                              rows={12}
                              placeholder='Provide Feedback related to this blog..'
                              variant='outlined'
                              onChange={(event, value) => { this.handleReivisionNameChange(event); }}

                            />
                            <br />
                            <CardActions>
                              <Button
                                style={{ fontSize: 12 }}
                                size='small'
                                variant="contained"
                                color='primary'
                                disabled={!comment}
                                onClick={this.submitComment}
                              >
                                Submit
                              </Button>
                            </CardActions>
                          </CardContent>
                        </Card>
                      ) : isPublish ? (
                        <Card style={{ minWidth: 320 }} className={classes.reviewCard}>
                          <CardContent>
                            <Autocomplete
                              style={{ width: '100%' }}
                              size='small'
                              onChange={this.handlePublishLevelType}
                              id='category'
                              required
                              disableClearable
                              options={publishLevelChoice}
                              getOptionLabel={(option) => option?.label}
                              filterSelectedOptions
                              renderInput={(params) => (
                                <TextField
                                  {...params}
                                  variant='outlined'
                                  label='Publish Level'
                                  placeholder='Publish Level'
                                />
                              )}
                            />
                            <br />
                            <CardActions>
                              <Button
                                style={{ fontSize: 12 }}
                                size='small'
                                color='primary'
                                variant="contained"
                                disabled={!publishedLevel}
                                onClick={this.submitPublish}
                              >
                                Submit
                              </Button>
                            </CardActions>
                          </CardContent>
                        </Card>
                      )
                        : relatedBlog ? ''
                          : (
                            <Grid>
                              <Typography
                                color="primary"
                                style={{
                                  fontSize: '12px', width: '300px',
                                  paddingLeft: '30px',
                                }}>Reviewed By:{data.reviewed_by && data.reviewed_by.first_name}

                              </Typography>
                              <ReviewPrincipal blogId={data.id} ratingParameters={this.getRatings} overallRemark={this.getOverAllRemark}
                              />
                            </Grid>

                          )
                      }
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
