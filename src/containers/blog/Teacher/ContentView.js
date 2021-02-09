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
import Autocomplete from '@material-ui/lab/Autocomplete';
import { withRouter } from 'react-router-dom';
import axios from '../../../config/axios';
import endpoints from '../../../config/endpoints';
import CommonBreadcrumbs from '../../../components/common-breadcrumbs/breadcrumbs';
import Review from './Review'
import Layout from '../../Layout';
import { Visibility, FavoriteBorder, Favorite } from '@material-ui/icons'
import ReactHtmlParser from 'react-html-parser'



import axiosInstance from '../../../config/axios';
import { AlertNotificationContext } from '../../../context-api/alert-context/alert-state';

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
    backgroundSize:380

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


const publishLevelChoice=[ 
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
      isPublish:false,
      blogId: this.props.location.state.data && this.props.location.state.data.id,
      data: this.props.location.state.data && this.props.location.state.data,
      tabValue :this.props.location.state.tabValue && this.props.location.state.tabValue,
      feedbackrevisionReq:'',
      roleDetails: JSON.parse(localStorage.getItem('userDetails')),
      blogRatings :this.props.location.state.data && this.props.location.state.data.remark_rating,
      overallRemark:this.props.location.state.data && this.props.location.state.data.overall_remark,
      likeStatus:false,
      currentLikes: 0,
      loading:false,
      likes: this.props.location.state.data && this.props.location.state.data.likes,
      loginUserName : JSON.parse(localStorage.getItem('userDetails')).erp_user_id


    };
   


  }
  componentDidMount() {
    let {blogId} = this.state
    this.handleView(blogId)
  }


  handleView = (blogId) => {
    let requestData = {
      "blog_id": blogId ,
    }
  axiosInstance.post(`${endpoints.blog.BlogView}`, requestData)
  .then(result=>{
  if (result.data.status_code === 200) {
  } else {        
  }
  }).catch((error)=>{
  })
}



  submitRevisionFeedback = () => {
    const {  data, feedbackrevisionReq } = this.state;
    const formData = new FormData();
    formData.set('blog_id', data.id);
    formData.set('status', 5);
    formData.set('feedback_revision_required', feedbackrevisionReq);

    axios
      .put(`${endpoints.blog.Blog}`, formData)
      .then((result) => {
        if (result.data.status_code === 200) {
          this.props.history.push({
            pathname: '/blog/teacher',
          });
        } else {
          console.log(result.data.message);
        }
      })
      .catch((error) => {
      });
  };
  handleReivisionNameChange = (e) => {
    this.setState({feedbackrevisionReq:e.target.value})
  };
  submitPublish = () => {
  const {  data, publishedLevel ,roleDetails} = this.state;
  const formData = new FormData();
  formData.set('blog_id', data.id);
  formData.set('status', 4);
  formData.set('published_level', publishedLevel);
  if(publishedLevel === '2'){
    let branchId = roleDetails && roleDetails.role_details.branch && roleDetails.role_details.branch[0]
    formData.set('branch_id', branchId);
    
    }
    axios
      .put(`${endpoints.blog.Blog}`, formData)
      .then((result) => {
        if (result.data.status_code === 200) {
          this.props.history.push({
            pathname: '/blog/teacher',
          });
        } else {
          console.log(result.data.message);

        }
      })
      .catch((error) => {
      });
  };
  
  handlePublishLevelType = (event, value) => {
    if (value && value.value){
      this.setState({publishedLevel:value.value})
    }
    else{
      this.setState({publishedLevel:''})

    }
  }
  getRatings = () => {
    let {blogRatings} =this.state
    if (!blogRatings) {
      return []
    }
    const type = typeof blogRatings
    const parsedRatings = type === 'object' ? blogRatings : JSON.parse(blogRatings)
    const allRatingParamters = JSON.parse(parsedRatings)
    return allRatingParamters
  }

 getOverAllRemark = () => {
   let {overallRemark} = this.state
   return overallRemark
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
axiosInstance.post(`${endpoints.blog.BlogLike}`, requestData)

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
  
  render() {
    const { classes } = this.props;
    const {likes,currentLikes,likeStatus,loginUserName, tabValue,relatedBlog, starsRating, feedBack ,data,feedbackrevisionReq,isPublish,publishedLevel,roleDetails} = this.state;
    const blogFkLike= data && data.blog_fk_like
    const likedUserIds=blogFkLike.map(blog => blog.user)
    const indexOfLoginUser=likedUserIds.indexOf(roleDetails.user_id)
    const loginUser=likedUserIds.includes(roleDetails.user_id)
    const isLiked = loginUser ? blogFkLike[indexOfLoginUser].is_liked : false
    const name =data && data.author && data.author.id
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
                        {
                          data && data.feedback_revision_required ?
                        <CardContent> <Typography
                          style={{color:'#ff6b6b', fontSize:'12px'}}
                        >Revision Feedback:{data.feedback_revision_required}
                       
                        </Typography>
                        <Typography style={{fontSize:'12px'}}> Revised By:{data && data.feedback_revision_by && data.feedback_revision_by.first_name}</Typography></CardContent> 
                        :'' } {data.comment ? 
                        <CardContent> <Typography
                        style={{color:'#ff6b6b', fontSize:'12px'}}
                      >Comment:{data.comment}
                     
                      </Typography>
                      <Typography style={{fontSize:'12px'}}> Commented By:{data && data.commented_by && data.commented_by.first_name}</Typography>
                      </CardContent>  :''}
                       
                        <CardHeader
                          className={classes.author}
                          title={data.author.first_name}
                          subheader=
                          {data && moment(data.created_at).format('MMM DD YYYY')}

                        />
                        <CardContent>
                          <Typography variant='body2' color='textSecondary' component='p'>
                          {ReactHtmlParser(data.content)}
                          </Typography>
                          <Typography component='p'  style={{ paddingRight: '650px',fontSize:'12px'}}
>
                          Total Words : {data.word_count}
                          
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
                            {!data.feedback_revision_required ? 
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
                           {tabValue === 0 ? 'Add Review' : 'View Review' }
                          </Button>  :''}
                          {tabValue === 0 ?
                          <Button
                            size='small'
                            color='primary'
                            onClick={() => this.setState({ feedBack: true,relatedBlog:true })}
                          >
                            Add Revision Feedback
                          </Button> : !data.feedback_revision_required ?
                          <Button
                            size='small'
                            color='primary'
                            onClick={() => this.setState({ isPublish: true })}
                          >
                            Publish
                          </Button> 
:''
                          }
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
                              onChange={(event,value)=>{this.handleReivisionNameChange(event);}}

                            />
                            <br />
                            <CardActions>
                              <Button
                                style={{ fontSize: 12 }}
                                size='small'
                                color='primary'
                                disabled={!feedbackrevisionReq}
                                onClick ={this.submitRevisionFeedback}
                              >
                                Revision required
                              </Button>
                            </CardActions>
                          </CardContent>
                        </Card>
                      ):isPublish ? (
                        <Card style={{ minWidth: 320 }} className={classes.reviewCard}>
                          <CardContent>
                          <Autocomplete
                            style={{ width: '100%' }}
                            size='small'
                            onChange={this.handlePublishLevelType}
                            id='category'
                            required
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
                                disabled={!publishedLevel}
                                onClick ={this.submitPublish}
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
                        style={{ fontSize:'12px', width: '300px',
                        paddingLeft: '30px',
                        color: '#ff6b6b'}}>Reviewed By:{data.reviewed_by && data.reviewed_by.first_name}
                     
                      </Typography>
                        <Review  blogId={data.id}  ratingParameters={this.getRatings} overallRemark={this.getOverAllRemark}
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
