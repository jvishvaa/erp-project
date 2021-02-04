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
import { withRouter } from 'react-router-dom';
import axios from '../../../config/axios';
import endpoints from '../../../config/endpoints';
import CommonBreadcrumbs from '../../../components/common-breadcrumbs/breadcrumbs';
import Layout from '../../Layout';
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

          
class ContentViewPublishStudent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      relatedBlog: true,
      starsRating: 0,
      data: this.props.location.state.data && this.props.location.state.data,
      tabValue :this.props.location.state.tabValue && this.props.location.state.tabValue,
      roleDetails: JSON.parse(localStorage.getItem('userDetails')),
      blogId: this.props.location.state.data && this.props.location.state.data.id,
      likeStatus:false,
      currentLikes: 0,
      loading:false,
      likes: this.props.location.state.data && this.props.location.state.data.likes,
      loginUserName : JSON.parse(localStorage.getItem('userDetails')).first_name


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
  




  
  render() {
    const { classes } = this.props;
    const { tabValue, roleDetails,likes,currentLikes,likeStatus,loginUserName,data,feedbackrevisionReq} = this.state;
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
                        </Typography>
                        <CardMedia className={classes.media} image={data.thumbnail} />
                        <CardContent> {tabValue  && data.comment ? 
                        <CardContent> <Typography
                        style={{color:'red', fontSize:'12px'}}
                      >Comment:{data.comment}
                     
                      </Typography>
                      <Typography> Commented By:{data && data.commented_by && data.commented_by.first_name}</Typography>
                      </CardContent>  :''}</CardContent>
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
                            {data.content}
                          </Typography>
                          <Typography component='p'  style={{paddingRight: '650px', fontSize:'12px'}}
>
                          TotalWords : {data.word_count}
                          </Typography>
                          <Typography  component='p' style={{ paddingRight: '650px',fontSize:'12px'}}>
                           Genre: {data.genre && data.genre.genre}
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
export default withRouter(withStyles(styles)(ContentViewPublishStudent));
