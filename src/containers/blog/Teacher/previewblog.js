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
import ReactHtmlParser from 'react-html-parser';

import Avatar from '@material-ui/core/Avatar';
import { withRouter } from 'react-router-dom';
import CommonBreadcrumbs from '../../../components/common-breadcrumbs/breadcrumbs';
import Layout from '../../Layout';
import axios from '../../../config/axios';
import endpoints from '../../../config/endpoints';
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
    backgroundSize: '500px',
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

let openPreview = '';
class PreviewEditBlogTeacher extends Component {
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
      blogId: this.props.location.state.blogId,
      genreName: this.props.location.state.genreName,
      image: this.props.location.state.image,
      parsedTextEditorContentLen: this.props.location.state.parsedTextEditorContentLen,
      genreObj: this.props.location.state.genreObj,
    };
  }

  static contextType = AttachmentPreviewerContext;

  componentDidMount() {
    const { files } = this.state;
    if (files.length) {
      const imageUrl = URL.createObjectURL(files && files[0]);
      this.setState({ imageUrl });
    }
    openPreview = this.context.openPreview;
  }

  submitBlog = (type) => {
    const { title, content, files, genreId, blogId, image, parsedTextEditorContentLen } =
      this.state;
    const formData = new FormData();
    for (var i = 0; i < files.length; i++) {
      formData.append('thumbnail', files[i] || image);
    }
    formData.set('title', title);
    formData.set('blog_id', blogId);
    formData.set('content', content);
    formData.set('genre_id', genreId);
    formData.set('word_count', parsedTextEditorContentLen);
    formData.set('status', type == 'Draft' ? 2 : 8);

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
      .catch((error) => { });
  };
  EditBlogNav = () => {
    const {
      content,
      title,
      files,
      genreId,
      genreName,
      genreObj,
      image,
      parsedTextEditorContentLen,
      blogId,
    } = this.state;
    this.props.history.push({
      pathname: '/blog/teacher/edit-blog',
      state: {
        content,
        title,
        files,
        genreId,
        genreName,
        genreObj,
        image,
        blogId,
        parsedTextEditorContentLen,
      },
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
              <CommonBreadcrumbs
                componentName='Blog'
                childComponentName='Preview Edit Blog'
                isAcademicYearVisible={true}
              />
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
                        {console.log('debug', this.state.imageUrl || this.state.image)}
                        {console.log('debug1', this.state.imageUrl)}
                        {console.log('debug2', this.state.image)}
                        {console.log('debug3', this.state)}
                        {'.' + this?.state?.files[0]?.name.split('.')[this?.state?.files[0]?.name.split('.').length - 1] == '.pdf' ?
                          <div onClick={() => {
                            openPreview({
                              currentAttachmentIndex: 0,
                              attachmentsArray: [
                                {
                                  // src: `${endpoints.lessonPlan.s3}${file}`,
                                  src: `${this?.state?.imageUrl || this?.state?.image}`,
                                  // name: `${p?.document_type}`,
                                  // name: this.state.files.split('.')[this.state.files.split('.').length - 2],
                                  extension: '.' + this?.state?.files[0]?.name.split('.')[this?.state?.image?.split('.').length - 1],
                                  // extension: '.jpg,.jpeg,.png,.pdf',
                                },
                              ],
                            });
                          }} className={classes.media}>
                            <PictureAsPdfIcon style={{ height: 200, width: 200 }} />
                            <div style={{ fontSize: '16px' }}><b>'Click on the PDF icon to view'</b></div>
                          </div>
                          :
                          <CardMedia className={classes.media} image={this.state.imageUrl || this?.state?.image}
                            onClick={() => {
                              openPreview({
                                currentAttachmentIndex: 0,
                                attachmentsArray: [
                                  {
                                    // src: `${endpoints.lessonPlan.s3}${file}`,
                                    src: `${this?.state?.imageUrl || this?.state?.image}`,
                                    // name: `${p?.document_type}`,
                                    // name: this.state.files.split('.')[this.state.files.split('.').length - 2],
                                    extension: '.' + this?.state?.image?.split('.')[this?.state?.image?.split('.').length - 1],
                                    // extension: '.jpg,.jpeg,.png,.pdf',
                                  },
                                ],
                              });
                            }}
                          ><span> Please click here to view Image/PDF</span></ CardMedia>}
                        {/* <CardMedia
                          className={classes.media}
                          image={this.state.imageUrl || this.state.image}
                          title='Contemplative Reptile'
                        /> */}
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
                            {ReactHtmlParser(this.state.content)}
                          </Typography>
                        </CardContent>
                        <CardActions>
                          <Button
                            style={{ width: 150 }}
                            size='small'
                            color='primary'
                            onClick={this.EditBlogNav}
                          >
                            Edit
                          </Button>

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
export default withRouter(withStyles(styles)(PreviewEditBlogTeacher));
