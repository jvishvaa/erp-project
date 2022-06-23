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
import Avatar from '@material-ui/core/Avatar';
import Rating from '@material-ui/lab/Rating';
import ReactHtmlParser from 'react-html-parser'

import { withRouter } from 'react-router-dom';
import axios from '../../../config/axios';
import endpoints from '../../../config/endpoints';
import CommonBreadcrumbs from '../../../components/common-breadcrumbs/breadcrumbs';
import Layout from '../../Layout';
import { Visibility, FavoriteBorder, Favorite } from '@material-ui/icons'
import ReviewPrincipal from '../Principal/ReviewPrincipal';
import { AttachmentPreviewerContext } from '../../../components/attachment-previewer/attachment-previewer-contexts';
import PictureAsPdfIcon from '@material-ui/icons/PictureAsPdf';


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
  }
});

let openPreview = '';

class ContentViewPublishStudent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      starsRating: 0,
      data: this.props.location.state.data && this.props.location.state.data,
      tabValue: this.props.location.state.tabValue && this.props.location.state.tabValue,
      roleDetails: JSON.parse(localStorage.getItem('userDetails')),
      blogId: this.props.location.state.data && this.props.location.state.data.id,
      likeStatus: false,
      currentLikes: 0,
      loading: false,
      likes: this.props.location.state.data && this.props.location.state.data.likes,
      loginUserName: JSON.parse(localStorage.getItem('userDetails')).erp_user_id,
      blogRatings: this.props.location.state.data && this.props.location.state.data.remark_rating,
      overallRemark: this.props.location.state.data && this.props.location.state.data.overall_remark,

    };

  }
  static contextType = AttachmentPreviewerContext;
  componentDidMount() {
    let { blogId } = this.state;
    openPreview = this.context.openPreview;
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
          // setAlert('success', result.data.message);
        } else {
          this.setState({ loading: false })
          // setAlert('error', result.data.message);
        }
      }).catch((error) => {
        this.setState({ loading: false })
        // setAlert('error', error.message);
      })
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
    const { tabValue, roleDetails, likes, currentLikes, likeStatus, loginUserName, data, feedbackrevisionReq } = this.state;
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
                        style={{ cursor: 'Pointer' }}
                        className='cancelButton labelColor'
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
                        {'.' + data.thumbnail.split('.')[data.thumbnail.split('.').length - 1] == '.pdf' ?
                          <div onClick={() => {
                            openPreview({
                              currentAttachmentIndex: 0,
                              attachmentsArray: [
                                {
                                  // src: `${endpoints.lessonPlan.s3}${file}`,
                                  src: `${data?.thumbnail}`,
                                  // name: `${p?.document_type}`,
                                  // name: this.state.files.split('.')[this.state.files.split('.').length - 2],
                                  extension: '.' + data?.thumbnail?.split('.')[data?.thumbnail?.split('.').length - 1],
                                  // extension: '.jpg,.jpeg,.png,.pdf',
                                },
                              ],
                            });
                          }} className={classes.media}>
                            <PictureAsPdfIcon style={{ height: 200, width: 200 }} />
                            <div style={{ fontSize: '16px' }}><b>'Click on the PDF icon to view'</b></div>
                          </div>
                          :
                          <CardMedia className={classes.media} image={data?.thumbnail}
                            onClick={() => {
                              openPreview({
                                currentAttachmentIndex: 0,
                                attachmentsArray: [
                                  {
                                    // src: `${endpoints.lessonPlan.s3}${file}`,
                                    src: `${data?.thumbnail}`,
                                    // name: `${p?.document_type}`,
                                    // name: this.state.files.split('.')[this.state.files.split('.').length - 2],
                                    extension: '.' + data?.thumbnail?.split('.')[data?.thumbnail?.split('.')?.length - 1],
                                    // extension: '.jpg,.jpeg,.png,.pdf',
                                  },
                                ],
                              });
                            }}
                          />}
                        <CardContent>
                          {' '}
                          {tabValue && data.comment ? (
                            <CardContent>
                              {' '}
                              <Typography style={{ color: 'red', fontSize: '12px' }}>
                                Comment:{data.comment}
                              </Typography>
                              <Typography style={{ fontSize: '12px' }}>
                                {' '}
                                Commented By:
                                {data &&
                                  data.commented_by &&
                                  data.commented_by.first_name}
                              </Typography>
                            </CardContent>
                          ) : (
                            ''
                          )}
                        </CardContent>
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
                          {loginUserName !== name ?
                            <Button
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
                        </CardActions>
                      </Card>
                    </Grid>
                    <Grid item xs={3}>
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
export default withRouter(withStyles(styles)(ContentViewPublishStudent));
