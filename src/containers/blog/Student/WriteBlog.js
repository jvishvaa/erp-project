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
  CardActionArea,
  CardActions,
  CardMedia,
  CardContent,
  Paper,
  CardHeader,
  Divider,
  TextField,
} from '@material-ui/core';
import { Rating, Autocomplete } from '@material-ui/lab';
import { HighlightOff} from '@material-ui/icons'


import Avatar from '@material-ui/core/Avatar';
import StarBorderIcon from '@material-ui/icons/StarBorder';
import Dropzone from 'react-dropzone';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import moment from 'moment';
import { withRouter } from 'react-router-dom';
// import { withRouter } from 'react-router-dom';
import CommonBreadcrumbs from '../../../components/common-breadcrumbs/breadcrumbs';
import Layout from '../../Layout';
import TinyMce from '../../../components/TinyMCE/tinyMce';
import PreviewBlog from './PreviewBlog';
import axios from '../../../config/axios';
import endpoints from '../../../config/endpoints';
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


class WriteBlog extends Component {
  constructor(props) {
    super(props);
    this.state = {
      parsedTextEditorContentLen:0,
      image :'',
      // files:[],
      relatedBlog: true,
      starsRating: 0,
      feedBack: false,
      isDelete:false,
      key: 0,
      title:
        this.props.location.state.title && this.props.location.state.title.length !== 0
          ? this.props.location.state.title
          : '',
      genreId:
          this.props.location.state.genreId && this.props.location.state.genreId.length !== 0
            ? this.props.location.state.genreId
            : '',
      genreName :this.props.location.state.genreName && this.props.location.state.genreName.length !== 0
      ? this.props.location.state.genreName
      :'',
      image: 
      this.props.location.state.thumbnail && this.props.location.state.thumbnail.length !== 0
          ? this.props.location.state.thumbnail
          : '',
      TITLE_CHARACTER_LIMIT: 100,
      Preview: false,
      detail: this.props.location.state.detail,
      roleDetails: JSON.parse(localStorage.getItem('userDetails')),
      genreList: [],
      creationDate: new Date(),
      textEditorContent:
        this.props.location.state.content &&
        this.props.location.state.content.length !== 0
          ? this.props.location.state.content
          : '',
      files:
        this.props.location.state.files && this.props.location.state.files.length !== 0
          ? this.props.location.state.files
          : [],
      wordCountLimit: 50,
      genreObj : this.props.location.state.genreObj && this.props.location.state.genreObj.length !== 0
      ? this.props.location.state.genreObj
      :'',

    };
  }
  static contextType = AlertNotificationContext
  componentDidMount() {
    this.wordCountFetch();
    this.listGenre();
    const { creationDate } = this.state;
    let studentName = JSON.parse(localStorage.getItem('userDetails'));
    studentName = studentName.first_name.toString();
    const date = moment(creationDate).format('DD-MM-YYYY');
    this.setState({
      studentName,
      creationDate: date,
      genreName :this.props.location.state.genreName && this.props.location.state.genreName.length !== 0
      ? this.props.location.state.genreName
      :'',
      // textEditorContent: localStorage.getItem('blogContent'),
    });
  }
 

  listGenre = () => {
    let { roleDetails } = this.state;
    const erpUserId = roleDetails.role_details.erp_user_id;
    axios
      .get(`${endpoints.blog.genreList}?is_delete=${
        'False'
      }&erp_user_id=${
        erpUserId
      }`)
      .then((res) => {
        this.setState({ genreList: res.data.result });
      })
      .catch((error) => {});
  };

  wordCountFetch = () => {
    let { roleDetails } = this.state;
    const erpUserId = roleDetails.role_details.erp_user_id;
    axios
      .get(`${endpoints.blog.WordCountConfig}?erp_user_id=${
        erpUserId
      }`)
      .then((res) => {
        this.setState({wordCountLimit: res.data && res.data.result && res.data.result[0].word_count})
      })
      .catch((error) => {});
  };

  isWordCountSubceeded = () => {
    let { textEditorContent, wordCountLimit } = this.state
    const parsedTextEditorContent=textEditorContent.split(' ')
    // const parsedTextEditorContent = textEditorContent.replace(/(<([^>]+)>)/ig, '').split(' ')
    const textWordCount = parsedTextEditorContent.length
    console.log(textWordCount,"@@@")
    this.setState({ parsedTextEditorContentLen: textWordCount })
    console.log(parsedTextEditorContent.length,"@@@@")
    if (parsedTextEditorContent && parsedTextEditorContent.length < wordCountLimit) {
      const errorMsg = `Please write atleast ${wordCountLimit} words.Currently only ${textWordCount} words have been written`
      return errorMsg
    }
    this.setState({ parsedTextEditorContentLen: textWordCount})
    console.log(this.state.parsedTextEditorContentLen,"@@@")

    return false
  }
  
 
  handleTextEditor = (content) => {
    const { blogId } = this.state;
    console.log(content.replace(/&nbsp;/g, ''));

    // remove  begining and end white space
    // eslint-disable-next-line no-param-reassign
    content = content.replace(/&nbsp;/g, '');
    this.setState({ textEditorContent: content, fadeIn: false });
    const subceededWordCount = this.isWordCountSubceeded()

    // localStorage.setItem('blogContent', content);
  };

  handleTitle = (event) => {
    this.setState({ title: event.target.value });
  };
  isImage = (files) => {
    if (files[0].name.match(/.(jpg|jpeg|png)$/i)) {
      return true
    }
    return false
  }
  
  onDrop = (files=[]) => {
    if (!this.isImage(files)) {
      this.context.setAlert('error',"Please select only image file format")

      // this.props.alert.warning('Please select only image file format')
      return
    } else if (files.length > 1) {
      this.context.setAlert('error',"You can select only a single image at once")

      // this.props.alert.warning('You can select only a single image at once')
      return
    }
  
    this.setState({ files,image: URL.createObjectURL(files[0]) });
  };

  getFileNameAndSize = (files) => {
    if (files.length) {
      const fileName = this.state.files && this.state.files.map(file => (
        <li key={file.name}>
          {file.name} - {file.size} bytes
        </li>
      ))
      return fileName
    }
    return null
  }

  handleGenre = (data) => {
    this.setState({ genreId: data.id,genreName:data.genre,genreObj:data });
  };

  PreviewBlogNav = () => {
    let{genreId ,files, title ,textEditorContent,genreObj,parsedTextEditorContentLen}=this.state
    console.log(parsedTextEditorContentLen,"@@@")

    
    if(!genreId ){
      this.context.setAlert('error',"please select genre")
      return
    }
    if(!files.length> 0 ){
      this.context.setAlert('error',"please upload image")
      return
    }
    if(!title){
      this.context.setAlert('error',"please enter title to the blog ")
      return
    }
    if(!textEditorContent){
      this.context.setAlert('error',"please enter description to the blog")
      return
    }
    const subceededWordCount = this.isWordCountSubceeded()
    if (subceededWordCount) {
      this.context.setAlert('error',subceededWordCount)
      return
    }

    const {
      // textEditorContent,
      // title,
      // genreId,
      studentName,
      creationDate,
      // files,
      genreName,
    } = this.state;
    console.log(parsedTextEditorContentLen,"@@@")
    this.props.history.push({
      pathname: '/blog/student/preview-blog',
      state: { studentName, creationDate, genreId, textEditorContent, title, files ,genreName,genreObj,parsedTextEditorContentLen},
    });
  };

  render() {
    const { classes } = this.props;
    const {
      files,
      relatedBlog,
      starsRating,
      feedBack,
      image,
      genreObj,
      genreName,
      textEditorContent,
      key,
      title,
      TITLE_CHARACTER_LIMIT,
      Preview,
      genreList,
      genreId,
      studentName,
      creationDate,wordCountLimit
    } = this.state;
    console.log(genreList,genreName,"@250")
    return Preview ? (
      <PreviewBlog
        content={textEditorContent}
        title={title}
        genreId={genreId}
        studentName={studentName}
        date={creationDate}
      />
    ) : (
      <div className='layout-container-div'>
        <Layout className='layout-container'>
          <div className='message_log_wrapper' style={{ backgroundColor: '#F9F9F9' }}>
            <div
              className='message_log_breadcrumb_wrapper'
              style={{ backgroundColor: '#F9F9F9' }}
            >
              <CommonBreadcrumbs componentName='Blog' />
              <div className='create_group_filter_container'>
                <Grid container style={{ margin: 20 }}>
                  {/* <Grid item xs={12} sm={4}>
                    <Autocomplete
                      size='small'
                      id='combo-box-demo'
                      options={[]}
                      getOptionLabel={(option) => option.title}
                      style={{ width: 300 }}
                      renderInput={(params) => (
                        <TextField {...params} label='Combo box' variant='outlined' />
                      )}
                    />
                  </Grid> */}
                  <Grid item xs={12} sm={4}>
                    <Autocomplete
                      size='small'
                      id='combo-box-demo'
                      options={genreList}
                      value={genreObj}
                      getOptionLabel={(option) => option.genre}
                      style={{ width: 300 }}
                      onChange={(e, data) => this.handleGenre(data)}
                      renderInput={(params) => (
                        <TextField {...params} label='Genre' variant='outlined' />
                        )}
                      // getOptionSelected={(option, value) => value && option.id == value.id}
                        />
                  </Grid>
                </Grid>
              </div>
              <Divider variant='middle' />
              <div className='create_group_filter_container'>
                <Grid container spacing={2} style={{ margin: 20 }}>
                  <Grid item xs={12}>
                    <TextField
                      id='outlined-textarea'
                      placeholder='Title not to be more than 100 characters'
                      inputProps={{ maxLength: 100 }}
                      helperText={`Charater: ${title.length}/${TITLE_CHARACTER_LIMIT}`}
                      onChange={this.handleTitle}
                      multiline
                      required
                      value={this.state.title}
                      label='Blog Title'
                      size='medium'
                      fullWidth
                      variant='outlined'
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Typography style={{ margin: 10 }} variant='body1'>
                      Write the blog with atleast {wordCountLimit} words
                    </Typography>
                    <TinyMce
                      key={key}
                      id={key}
                      get={this.handleTextEditor}
                      content={textEditorContent}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Typography style={{ margin: 10 }} variant='body1'>
                      Add Thumbnail 
                    </Typography>
                    <Typography
                      color='textPrimary'
                      style={{ margin: 10 }}
                      variant='caption'
                    >
                    </Typography>
                    <Card className={classes.Card}>
                      <Dropzone onDrop={this.onDrop}>
                        {({
                          getRootProps,
                          getInputProps,
                          isDragActive,
                          isDragAccept,
                          isDragReject,
                        }) => (
                          <Card
                            elevation={0}
                            style={{
                              width: '320px',
                              height: '150px',
                              border: '1px solid #ff6b6b',
                            }}
                            {...getRootProps()}
                            className='dropzone'
                          >
                            <CardContent>
                              <input {...getInputProps()} />
                              <div>
                                {isDragAccept && 'All files will be accepted'}
                                {isDragReject && 'Some files will be rejected'}
                                {!isDragActive && (
                                  <> 
                                    <CloudUploadIcon
                                      color='primary'
                                      style={{ marginLeft: '45%', marginTop: '15%' }}
                                    />drop file
                                  </>
                                )}
                                
                              </div>
                              {this.getFileNameAndSize(files)}
                              {/* {files} */}
                            </CardContent>
                          </Card>
                        )}
                      </Dropzone>
                      

                      <Divider variant='middle' style={{ margin: 10 }} />

                      <CardActions>
                        <Button
                          size='small'
                          style={{ width: 150 }}
                          onClick={this.PreviewBlogNav}
                          color='primary'
                          // disabled={!genreId || !files.length> 0 ||!title ||!textEditorContent}
                        >
                          Preview Blog
                        </Button>
                      </CardActions>
                    </Card>
                  </Grid>
                </Grid>
              </div>
            </div>
          </div>
        </Layout>
      </div>
    );
  }
}
export default withRouter(withStyles(styles)(WriteBlog));
