/* eslint-disable no-nested-ternary */
/* eslint-disable react/jsx-wrap-multilines */
import React, { Component } from 'react';
import { withStyles, useTheme } from '@material-ui/core/styles';
// import { connect } from 'react-redux';
import ReactHtmlParser from 'react-html-parser'

import {
  Grid,
  Card,
  Button,
  Typography,
  CardActions,
  CardMedia,
  CardContent,
  CardHeader,
} from '@material-ui/core';
import { withRouter } from 'react-router-dom';
import moment from 'moment';
import CommonBreadcrumbs from '../../../components/common-breadcrumbs/breadcrumbs';
import Layout from '../../Layout';
import axios from '../../../config/axios';
import endpoints from '../../../config/endpoints';
import DeleteOutlinedIcon from '@material-ui/icons/DeleteOutlined';
import Restore from '@material-ui/icons/Restore'
import IconButton from '@material-ui/core/IconButton';
import { Visibility, FavoriteBorder, Favorite } from '@material-ui/icons'
import ReviewPrincipal from '../Principal/ReviewPrincipal';
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
      roleDetails: JSON.parse(localStorage.getItem('userDetails')),
blogRatings :this.props.location.state.data && this.props.location.state.data.remark_rating,
      overallRemark:this.props.location.state.data && this.props.location.state.data.overall_remark,
    };
    console.log(this.state.tabValue,"@@@@@")
  }
  static contextType = AlertNotificationContext

  componentDidMount() {
    let {blogId} = this.state
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


  
  handleCommentChange = (event) => {
    this.setState({ comment: event.target.value });
  };

 
  EditBlogNav = () => {
    const { data } = this.state;
    let content=data && data.content
    let title=data && data.title
    let thumbnail = data && data.thumbnail
    let genreObj =data.genre
    let parsedTextEditorContentLen = data.word_count
    let genreId =data && data.genre && data.genre.id
    let genreName =data && data.genre && data.genre.genre
    let blogId=data&&data.id
    this.props.history.push({
      pathname: '/blog/student/edit-blog',
      state: { content, title, thumbnail,genreId,genreName,blogId,genreObj ,parsedTextEditorContentLen},
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
    this.context.setAlert('success',"Blog delete sucessfully")

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
handleRestoreBlog = (blogId) => {

  let requestData = {
    "blog_id": blogId ,
    "status": "9"

  }
axios.put(`${endpoints.blog.Blog}`, requestData)

.then(result=>{
if (result.data.status_code === 200) {
  this.context.setAlert('success',"Blog restored to drafted tab")

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
                          { tabValue === 0 ||
                  tabValue === 2 ?
                    <IconButton
                    style={{float:'right'}}
                  title='Delete'
                  onClick={()=>this.handleDeleteBlog(data && data.id)}
                >
                  <DeleteOutlinedIcon
                    style={{ color: '#ff6b6b' }}
                  />
                </IconButton>
      : '' 
              }
               {
                  tabValue === 3 ?
                    <IconButton
                    style={{float:'right'}}
                  title='Restore'
                  onClick={()=>this.handleRestoreBlog(data && data.id)}
                >
                  <Restore
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
                      <Typography  style={{fontSize:'12px'}}> Commented By:{data && data.commented_by && data.commented_by.first_name}</Typography>
                      </CardContent>  :''}
                        <CardHeader
                          className={classes.author}
                          title={data.author.first_name}
                          subheader={moment(data.created_at).format('MMM DD YYYY')}
                        />
                       
                        <CardContent>
                        
                          <Typography variant='body2' color='textSecondary' component='p'>
                          {ReactHtmlParser(data.content)}
                          </Typography>
                          <Typography  component='p' style={{ paddingRight: '650px',fontSize:'12px'}}>
                           Genre: {data.genre && data.genre.genre}
                          </Typography>
                          <Typography component='p'  style={{ paddingRight: '650px',fontSize:'12px'}}
>
                          Total Words : {data.word_count} 
                          </Typography>

                        </CardContent>
                        <CardActions>
                        <Button                               style={{ fontFamily: 'Open Sans', fontSize: '12px', fontWeight: 'lighter', 'text-transform': 'capitalize' ,color:'red' ,backgroundColor:'white'}}
>
                    <Favorite style={{ color: 'red' }} />{likes}likes</Button>
 &nbsp;&nbsp;&nbsp;
                            <Button
                              style={{ fontFamily: 'Open Sans', fontSize: '12px', fontWeight: 'lighter', 'text-transform': 'capitalize' ,color:'red' ,backgroundColor:'white'}}

                            >   <Visibility style={{ color: '#ff6b6b' }} />{data.views}Views
                            </Button>

                      {!data.feedback_revision_required && tabValue ===1 ? 
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
                            {relatedBlog ? 'Review' : 'View Related Blog'}
                          </Button>  :''}
                         
                          {tabValue === 0  || tabValue === 2 ?
                          <Button
                            style={{ width: 150 }}
                            size='small'
                            color='primary'
                            onClick={this.EditBlogNav}
                          >
                            Edit
                          </Button>
                          :''}
                        </CardActions>
                      </Card>
                    </Grid>
                    <Grid item xs={3}>
                   { relatedBlog ? ''
                      : (
                        <Grid>
                        <Typography
                        style={{ fontSize:'12px', width: '300px',
                        paddingLeft: '30px',
                        color: '#ff6b6b'}}>Reviewed By:{data.reviewed_by && data.reviewed_by.first_name}
                     
                      </Typography>
                        <ReviewPrincipal  blogId={data.id}  ratingParameters={this.getRatings} overallRemark={this.getOverAllRemark}
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
export default withRouter(withStyles(styles)(BlogView));
