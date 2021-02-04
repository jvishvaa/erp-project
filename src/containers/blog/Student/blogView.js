/* eslint-disable no-nested-ternary */
/* eslint-disable react/jsx-wrap-multilines */
import React, { Component } from 'react';
import { withStyles, useTheme } from '@material-ui/core/styles';
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
import { withRouter } from 'react-router-dom';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import StarBorderIcon from '@material-ui/icons/StarBorder';
// import { withRouter } from 'react-router-dom';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import moment from 'moment';
import CommonBreadcrumbs from '../../../components/common-breadcrumbs/breadcrumbs';
import Layout from '../../Layout';
import SideBar from './sideBar';
import axios from '../../../config/axios';
import endpoints from '../../../config/endpoints';
import DeleteOutlinedIcon from '@material-ui/icons/DeleteOutlined';
import IconButton from '@material-ui/core/IconButton';
import { Visibility, FavoriteBorder, Favorite } from '@material-ui/icons'

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
    backgroundSize:'500px'
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

class BlogView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      relatedBlog: true,
      starsRating: 0,
      feedBack: false,
      commentOpen: false,
      data: this.props.location.state.data && this.props.location.state.data,
      tabValue:this.props.location.state.tabValue && this.props.location.state.tabValue,
      blogId: this.props.location.state.data && this.props.location.state.data.id,
      likeStatus:false,
      currentLikes: 0,
      loading:false,
      likes: this.props.location.state.data && this.props.location.state.data.likes,
      loginUserName : JSON.parse(localStorage.getItem('userDetails')).first_name,
      roleDetails: JSON.parse(localStorage.getItem('userDetails')),

    };
  }
  componentDidMount() {
    let {blogId} = this.state
    this.handleView(blogId)
  }
  getLikeStatus = (isLiked) => {
    let { likeStatus,likes }=this.state
    if (isLiked === true && likeStatus === false) {
      this.setState({currentLikes :likes-1,likeStatus:true})
    } else if (isLiked === true && likeStatus === true) {
      this.setState({currentLikes :likes+1,likeStatus:false})
  
    } else if (isLiked === false && likeStatus === false) {
      this.setState({currentLikes :likes+1,likeStatus:true})
  
    } else if (isLiked === false && likeStatus === true) {
      this.setState({currentLikes :likes,likeStatus:false})
  
    }
  }
  handleLike = (isLiked,blogId) => {
    this.getLikeStatus(isLiked)
    let requestData = {
      "blog_id": blogId ,
  
    }
  axios.post(`${endpoints.blog.BlogLike}`, requestData)
  
  .then(result=>{
  if (result.data.status_code === 200) {
    this.setState({loading:false})
    // setAlert('success', result.data.message);
  } else {        
    this.setState({loading:false})
    // setAlert('error', result.data.message);
  }
  }).catch((error)=>{
    this.setState({loading:false})
    // setAlert('error', error.message);
  })
    }

  handleView = (blogId) => {
    let requestData = {
      "blog_id": blogId ,
    }
  axios.post(`${endpoints.blog.BlogView}`, requestData)
  .then(result=>{
  if (result.data.status_code === 200) {
  } else {        
  }
  }).catch((error)=>{
  })
}


  
  handleCommentChange = (event) => {
    this.setState({ comment: event.target.value });
  };

  submitComment = (type) => {
    if (type === 'Submit') {
      const { comment, blogId } = this.state;
      const formData = new FormData();
      // formData.set('blog_id', blogId);
      formData.set('content', 7);
      formData.set('comment', comment);

      axios
        .post(`${endpoints.blog.Blog}`, formData)
        .then((result) => {
          if (result.data.status_code === 200) {
            this.props.history.push({
              pathname: '/blog/student/dashboard',
            });
          } else {
            console.log(result.data.message);
          }
        })
        .catch((error) => {
        });
    }
  };
  WriteBlogNav = () => {
    const { data } = this.state;
    let content=data && data.content
    let title=data && data.title
    let thumbnail = data && data.thumbnail
    let genreId =data && data.genre && data.genre.id
    let genreName =data && data.genre && data.genre.genre
    this.props.history.push({
      pathname: '/blog/student/write-blog',
      state: { content, title, thumbnail,genreId,genreName },
    });
  };
  handleDeleteBlog = (blogId) => {

    let requestData = {
      "blog_id": blogId ,
      "status": "1"
  
    }
  axios.put(`${endpoints.blog.Blog}`, requestData)

  .then(result=>{
  if (result.data.status_code === 200) {
    this.props.history.push({
      pathname: '/blog/student/dashboard',
    });
    // setLoading(false);
    // setAlert('success', result.data.message);
  } else {        
    // setLoading(false);
    // setAlert('error', result.data.message);
  }
  }).catch((error)=>{
    // setLoading(false);        
    // setAlert('error', error.message);
  })
};


  render() {
    const { classes } = this.props;

    const {roleDetails,likes,currentLikes,likeStatus,loginUserName, relatedBlog, starsRating, feedBack, commentOpen, data,tabValue } = this.state;
    const blogFkLike= data && data.blog_fk_like
    const likedUserIds=blogFkLike.map(blog => blog.user)
    const indexOfLoginUser=likedUserIds.indexOf(roleDetails.user_id)
    const loginUser=likedUserIds.includes(roleDetails.user_id)
    const isLiked = loginUser ? blogFkLike[indexOfLoginUser].is_liked : false
    const name =data && data.author && data.author.first_name
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
                          {
                  tabValue === 2 ?
<IconButton
                  title='Delete'
                  onClick={()=>this.handleDeleteBlog(data && data.id)}
                >
                  <DeleteOutlinedIcon
                    style={{ color: '#ff6b6b' }}
                  />
                </IconButton>
      : '' 
              }
                        </Typography>
                       
                        <CardMedia className={classes.media} image={data.thumbnail} />
                        {
                          tabValue === 0 ?
                        <CardContent> <Typography
                          style={{color:'red', fontSize:'12px'}}
                        >Revision Feedback:{data.feedback_revision_required}
                       
                        </Typography>
                        <Typography style={{fontSize:'12px'}}> Revised By:{data && data.feedback_revision_by && data.feedback_revision_by.first_name}</Typography></CardContent> 
                        : tabValue !==0 && data.comment ? 
                        <CardContent> <Typography
                        style={{color:'red', fontSize:'12px'}}
                      >Comment:{data.comment}
                     
                      </Typography>
                      <Typography> Commented By:{data && data.commented_by && data.commented_by.first_name}</Typography>
                      </CardContent>  :''}
                        <CardHeader
                          className={classes.author}
                          title={data.author.first_name}
                          subheader={moment(data.created_at).format('MMM DD YYYY')}
                        />
                       
                        <CardContent>
                          <Typography variant='body2' color='textSecondary' component='p'>
                            {data.content}
                          </Typography>
                          <Typography component='p'  style={{ paddingRight: '650px',fontSize:'12px'}}
>
                          TotalWords : {data.word_count}
                          </Typography>

                        </CardContent>
                        <CardActions>
                        {loginUserName !== name ? <Button
                              style={{ fontFamily: 'Open Sans', fontSize: '12px', fontWeight: 'lighter', 'text-transform': 'capitalize' ,color:'red' ,backgroundColor:'white'}}
                              onClick={()=>this.handleLike(isLiked,data.id)}
                            > {isLiked || likeStatus ? <Favorite style={{ color: '#ff6b6b' }} />
                                : <FavoriteBorder style={{ color: '#ff6b6b' }} />} {currentLikes === 0 ? likes
                                : currentLikes
                              }Likes
                            </Button> : ''} &nbsp;&nbsp;&nbsp;
                            <Button
                              style={{ fontFamily: 'Open Sans', fontSize: '12px', fontWeight: 'lighter', 'text-transform': 'capitalize' ,color:'red' ,backgroundColor:'white'}}

                            >   <Visibility style={{ color: '#ff6b6b' }} />{data.views}Views
                            </Button>
                          {tabValue !== 1 ?
                          <Button
                            style={{ width: 150 }}
                            size='small'
                            color='primary'
                            onClick={this.WriteBlogNav}
                          >
                            Edit
                          </Button>
                          :''}
                        </CardActions>
                        {/* <CardActions>
                          <ExpansionPanel
                            onClick={() => this.setState({ commentOpen: !commentOpen })}
                            style={{ width: '100%' }}
                          >
                            <ExpansionPanelSummary>
                              <Button
                                size='small'
                                color='primary'
                                onClick={() =>
                                  this.submitComment(
                                    commentOpen ? 'Submit' : 'Add Comment'
                                  )}
                              >
                                {commentOpen ? 'Submit' : 'Add Comment'}
                              </Button>
                            </ExpansionPanelSummary>
                            <ExpansionPanelDetails>
                              <TextField
                                fullWidth
                                id='outlined-textarea'
                                label='Multiline Placeholder'
                                placeholder='Placeholder'
                                multiline
                                variant='outlined'
                                onChange={(e) => this.handleCommentChange(e)}
                              />
                            </ExpansionPanelDetails>
                          </ExpansionPanel>
                        </CardActions> */}
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
                      ) :  ''
                      // (
                      //   <SideBar />
                      // )
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
export default withRouter(withStyles(styles)(BlogView));
