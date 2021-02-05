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
import { withRouter } from 'react-router-dom';
import CommonBreadcrumbs from '../../../components/common-breadcrumbs/breadcrumbs';
import Layout from '../../Layout';
import axios from '../../../config/axios';
import endpoints from '../../../config/endpoints';

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
class PreviewEditBlog extends Component {
  constructor(props) {
    super(props);
    this.state = {
      relatedBlog: true,
      starsRating: 0,
      feedBack: false,
      genreId: this.props.location.state.genreId,
      title: this.props.location.state.title,
      content: this.props.location.state.textEditorContent,
      studentName: this.props.location.state.studentName,
      date: this.props.location.state.creationDate,
      files: this.props.location.state.files,
      blogId:this.props.location.state.blogId,
      genreName:this.props.location.state.genreName,
    };
  }

  componentDidMount() {
    const { files } = this.state;
    const imageUrl = URL.createObjectURL( files && files[0]);
    this.setState({ imageUrl });
  }


  submitBlog = (type) => {
    const { title, content, files, genreId ,blogId} = this.state;
    const formData = new FormData();
    for (var i = 0; i < files.length; i++) {
      formData.append('thumbnail',files[i]);
    }
    formData.set('title', title);
    formData.set('blog_id', blogId);

    formData.set('content', content);
    formData.set('genre_id', genreId);
    formData.set('status', type == 'Draft' ? 2 : 8);

    axios
      .put(`${endpoints.blog.Blog}`, formData)
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
  };

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
                  {/* <Grid item xs={12}>
                      <Button
                        style={{ cursor: 'Pointer' }}
                        onClick={() => window.history.back()}
                        align='right'
                      >
                        <i>Back</i>
                      </Button>
                      </Grid> */}
                      <Grid item xs={9}>
                      <Card className={classes.cardRoot}>
                        <Typography
                          variant='h5'
                          component='h2'
                          style={{ marginBottom: 10 }}
                        >
                          {this.state.title}
                        </Typography>
                        <CardMedia
                          className={classes.media}
                          image={this.state.imageUrl}
                          title='Contemplative Reptile'
                        />
                        <CardHeader
                          className={classes.author}
                          avatar={
                            <Avatar aria-label='recipe' className={classes.avatar}>
                              {this.state.studentName && this.state.studentName.charAt(0)}
                            </Avatar>
                          }
                          title={this.state.studentName}
                          subheader={this.state.date}
                        />
                        <CardContent>
                          <Typography variant='body2' color='textSecondary' component='p'>
                            {this.state.content}
                          </Typography>
                          
                        </CardContent>
                        <CardActions>
                        
                          <Button
                            style={{ width: 150 }}
                            size='small'
                            color='primary'
                            onClick={() => this.submitBlog('Publish')}
                          >
                            Submit
                          </Button>
                          <Button
                            style={{ width: 150 }}
                            size='small'
                            color='primary'
                            onClick={() => this.submitBlog('Draft')}
                          >
                            Draft
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
export default withRouter(withStyles(styles)(PreviewEditBlog));
