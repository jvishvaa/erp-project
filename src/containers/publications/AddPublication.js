import React, { useState, useEffect, useRef, useContext } from 'react';
import MyTinyEditor from '../../containers/question-bank/create-question/tinymce-editor';
import {
  Button,
  Divider,
  FormControl,
  Grid,
  Input,
  InputLabel,
  makeStyles,
  MenuItem,
  Paper,
  Select,
  TextField,
  Typography,
  withStyles,
} from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import './Styles.css';
import endpoints from '../../config/endpoints';
import axiosInstance from '../../config/axios';
import { AlertNotificationContext } from '../../context-api/alert-context/alert-state';

import PublicationPreview from './PublicationPreview';
import Loading from '../../components/loader/loader';

const StyledFilterButton = withStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.primary.main,
    color: '#FFFFFF',
    height: '42px',
    borderRadius: '10px',
    padding: '12px 40px',
    marginLeft: '20px',
    marginTop: 'auto',
    '&:hover': {
      backgroundColor: theme.palette.primary.main,
    },
  },
  startIcon: {
    fill: '#FFFFFF',
    stroke: '#FFFFFF',
  },
}))(Button);
const useStyles = makeStyles((theme) => ({
  root: {
    '& > *': {
      margin: theme.spacing(4),
    },
  },
  root1: {
    '& > *': {
      marginTop: theme.spacing(0),
      marginBottom: theme.spacing(0),
      marginLeft: theme.spacing(4),
      marginRight: theme.spacing(4),
    },
  },
  new: {
    '& > *': {
      margin: theme.spacing(1),
    },
  },
  descBox: {
    marginTop: '15px',
    backgroundColor: '#bcf1ff',
    color: theme.palette.secondary.main,
    border: `1px solid ${theme.palette.primary.main}`,
    borderRadius: '10px',
    fontSize: '16px',
    width: '70%',
    padding: '11px 18px',
  },
}));

const AddPublication = ({ handleGoBackPre, handleGoBackPre1 }) => {
  const classes = useStyles();
  const [subject, setSubject] = useState();
  const [branchGet, setBranchGet] = useState();
  const [gradesGet, setGradesGet] = useState([]);
  const [grade, setGrade] = useState();
  const [postSubjects, setPostSubjects] = useState();
  const [postBranch, setPostBranch] = useState();

  const [bookTypes, setBookTypes] = useState();
  const [postData, setpostData] = useState('');

  const { setAlert } = useContext(AlertNotificationContext);
  const fileRef = useRef();
  const fileRefer = useRef();
  const [file, setFile] = useState(null);
  const [isPublished, setIsPublished] = useState('Draft');
  const [description, setDescription] = useState(
    localStorage.getItem('description') === 'undefined'
      ? ''
      : localStorage.getItem('description')
  );
  const [thumbnail, setThumbnail] = useState(null);
  const [temBranch, setTemBranch] = useState();
  const formData = new FormData();

  const [image, setImage] = useState();

  const [bookTemp, setBookTemp] = useState('');
  const [readFlag, setReadFlag] = useState(false);
  const [tableFlag, setTableFlag] = useState(true);
  const [delFlag, setDelFlag] = useState(false);
  const [loading, setLoading] = React.useState(false);
  const [goBackFlag, setGoBackFlag] = useState(false);
  const handleFileChange = (event) => {
    const { files } = event.target;
    const fil = files[0];
    if (fil.name.lastIndexOf('.pdf') > 0) {
      if (fil.size / 1024 / 1024 <= 5) {
        setFile(fil);
      } else {
        setAlert('error', 'Please Select lessthan 5MB!');
      }

      console.log('upload', fil);
    } else {
      setFile(null);
      fileRef.current.value = null;
      setAlert('error', 'Only pdf file is acceptable either with .pdf extension');
    }
  };
  const handleThumbnailChange = (event) => {
    setImage(URL.createObjectURL(event.target.files[0]));

    const { files } = event.target;
    const fil = files[0];
    if (fil.name.lastIndexOf('.jpg') > 0) {
      setThumbnail(fil);
    } else {
      setThumbnail(null);
      fileRefer.current.value = null;
      setAlert(
        'error',
        'Only image file is acceptable either with .jpg or .jpeg or .png extension'
      );
    }
  };

  const handleDES = (content, delta, source, editor) => {
    const WORDS = editor.getText().split(' ');
    const MAX_WORDS = WORDS.length;
    const MAX_LENGTH = 100;
    if (MAX_WORDS <= MAX_LENGTH) {
      setDescription(content);
    } else {
      // editor.setContent(description);
      setDescription(description);
      setAlert('error', 'Maximum word limit reached!');
    }
  };

  useEffect(() => {
    setLoading(true);

    axiosInstance.get(endpoints.masterManagement.gradesDrop).then((res) => {
      setGradesGet(res.data.data);
      setLoading(false);
    });

    axiosInstance.get(endpoints.academics.branches).then((res) => {
      if (res) {
        setBranchGet(res.data.data.results);
        setLoading(false);
      } else {
        setBranchGet('');
        setLoading(false);
      }
    });
  }, []);

  const handleGrade = (e, value) => {
    if (value) {
      setGrade(e.target.value);
    } else {
      setGrade('');
    }
  };

  const handleBranch = (e, value) => {
    let number = e.target.value;
    let exactNum = number - 1;
    if (value) {
      setPostBranch(e.target.value);
      setTemBranch(branchGet?.[exactNum].branch.branch_name);
    } else {
      setPostBranch('');
    }
  };

  useEffect(() => {
    setLoading(true);
    axiosInstance
      .get(`${endpoints.masterManagement.subjects}?grade=${grade}`)
      .then((res) => {
        setSubject(res.data.data.results);
        setLoading(false);
      });
  }, [grade]);
  const handleSubject = (e, value) => {
    if (value) {
      setPostSubjects(e.target.value);
    } else {
      setPostSubjects('');
    }
  };
  const handleBookType = (e, value) => {
    let number = value.props.value;
    setBookTemp(number);
    if (number) {
      setBookTypes(number);
    } else {
      setBookTypes('');
    }
  };

  const LocalData = () => {
    localStorage.setItem('title', postData.title);
    localStorage.setItem('image', image);
    localStorage.setItem('author', postData.author);
    localStorage.setItem('book_type', bookTemp);
    localStorage.setItem('description', description);
    localStorage.setItem('subjects_local', postSubjects);
    localStorage.setItem('grade', grade);
    localStorage.setItem('zone', temBranch);
    localStorage.setItem('branch', postBranch);
  };

  const handleChange = (e) => {
    setpostData({ ...postData, [e.target.name]: e.target.value });
  };

  const [publishFlag, setPublishFlag] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setPublishFlag(true);
    formData.append('zone', postBranch);
    formData.append('subject', postSubjects);
    formData.append('grade', grade);
    formData.append('publication_type', bookTypes);
    formData.append('title', postData.title);
    formData.append('author_name', postData.author);
    formData.append('file', file);
    formData.append('thumbnail', thumbnail);
    formData.append('description', description);

    axiosInstance
      .post(endpoints.publish.ebook, formData)
      .then((result) => {
        if (result.data.status_code === 200) {
          setDelFlag(!delFlag);
          setLoading(false);
          setPublishFlag(false);
          setAlert('success', result.data.message);
          handleGoBackPre();
        } else {
          setLoading(false);
          setPublishFlag(false);
          setAlert('error', result.data.message);
        }
      })
      .catch((error) => {
        setLoading(false);
        setPublishFlag(false);
        setAlert('error', error.message);
      });
  };

  const handleSubmitDraft = (e) => {
    e.preventDefault();
    setLoading(true);
    if (!grade) {
      setAlert('error', 'Select Grade !');
      setLoading(false);
      return;
    }
    if (!postSubjects) {
      setAlert('error', 'Select Subject !');
      setLoading(false);
      return;
    }
    if (!bookTypes) {
      setAlert('error', 'Select Book Type !');
      setLoading(false);
      return;
    }
    if (!postData.title) {
      setAlert('error', 'Enter title !');
      setLoading(false);
      return;
    }
    if (!postData.author) {
      setAlert('error', 'Enter Author Name !');
      setLoading(false);
      return;
    }
    if (!postBranch) {
      setAlert('error', 'Select Branch !');
      setLoading(false);
      return;
    }

    if (!description) {
      setAlert('error', 'Enter Description !');
      setLoading(false);
      return;
    }
    if (!thumbnail) {
      setAlert('error', 'Select Thumbnail !');
      setLoading(false);
      return;
    }
    if (!file) {
      setAlert('error', 'Select Browse !');
      setLoading(false);
      return;
    }

    formData.append('zone', postBranch);
    formData.append('subject', postSubjects);
    formData.append('grade', grade);
    formData.append('publication_type', bookTypes);
    formData.append('title', postData.title);
    formData.append('author_name', postData.author);
    formData.append('file', file);
    formData.append('thumbnail', thumbnail);
    formData.append('description', description);
    formData.append('status_post', isPublished);

    axiosInstance
      .post(endpoints.publish.ebook, formData)
      .then((result) => {
        if (result.data.status_code === 200) {
          setDelFlag(!delFlag);
          setLoading(false);
          setAlert('success', result.data.message);
          handleGoBackPre();
        } else {
          setLoading(false);
          setAlert('error', result.data.message);
        }
      })
      .catch((error) => {
        setLoading(false);
        setAlert('error', error.message);
      });
  };
  const handleClick = (event) => {
    fileRef.current.click();
  };
  const handleClickThumbnail = (event) => {
    fileRefer.current.click();
  };

  const handleRead = (value) => {
    if (!grade) {
      setAlert('error', 'Select Grade !');
      setLoading(false);
      return;
    }
    if (!postSubjects) {
      setAlert('error', 'Select Subject !');

      setLoading(false);
      return;
    }

    if (!bookTypes) {
      setAlert('error', 'Select Book Type !');
      setLoading(false);
      return;
    }
    if (!postData.title) {
      setAlert('error', 'Enter title');
      setLoading(false);
      return;
    }
    if (!postData.author) {
      setAlert('error', 'Enter Author Name !');
      setLoading(false);
      return;
    }
    if (!postBranch) {
      setAlert('error', 'Select Branch !');
      setLoading(false);
      return;
    }
    if (!description) {
      setAlert('error', 'Enter Description !');
      return;
    }
    if (!thumbnail) {
      setAlert('error', 'Select Thumbnail !');
      setLoading(false);
      return;
    }
    if (!file) {
      setAlert('error', 'Select Browse !');
      setLoading(false);
      return;
    }

    setTableFlag(false);
    setReadFlag(true);
  };

  const handleGoBack = () => {
    setTableFlag(true);
    setReadFlag(false);
    setGoBackFlag(!goBackFlag);
  };
  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 450);
  }, [goBackFlag, readFlag]);

  return (
    <>
      {loading ? (
        <Loading
          message={
            publishFlag ? "Please don't refresh or leave this page." : 'Loading...'
          }
        />
      ) : null}
      <form>
        {!tableFlag && readFlag && (
          <PublicationPreview
            fun={handleSubmit}
            handleGoBack={handleGoBack}
            entireBack={handleGoBackPre}
          />
        )}
        {tableFlag && !readFlag && (
          <div className='bg-card'>
            <Grid container direction='row' className={[classes.root]}>
              <Grid item md={3} xs={12}>
                <FormControl variant='outlined' size='small' fullWidth>
                  <InputLabel id='demo-simple-select-outlined-label' required>
                    <b>Grade</b>
                  </InputLabel>
                  <Select
                    labelId='demo-simple-select-outlined-label'
                    id='demo-simple-select-outlined'
                    name='grade'
                    onChange={handleGrade}
                    defaultValue={
                      localStorage.getItem('grade') === 'undefined'
                        ? ''
                        : localStorage.getItem('grade')
                    }
                    labelWidth={50}
                  >
                    {gradesGet &&
                      gradesGet.map((item) => {
                        return (
                          <MenuItem value={item.grade_id} key={item.grade_id}>
                            {item.grade_name}
                          </MenuItem>
                        );
                      })}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item md={3} xs={12}>
                <FormControl variant='outlined' size='small' fullWidth>
                  <InputLabel id='demo-simple-select-outlined-label' required>
                    <b>Subject</b>
                  </InputLabel>

                  <Select
                    labelId='demo-simple-select-outlined-label'
                    id='demo-simple-select-outlined'
                    name='subject'
                    onChange={handleSubject}
                    outlined
                    defaultValue={
                      localStorage.getItem('subjects_local') === 'undefined'
                        ? ''
                        : localStorage.getItem('subjects_local')
                    }
                    labelWidth={70}
                  >
                    {subject &&
                      subject.map((options) => {
                        return (
                          <MenuItem value={options.id} key={options.id}>
                            {options.subject_name}
                          </MenuItem>
                        );
                      })}
                  </Select>
                </FormControl>
              </Grid>

              <Grid item md={3} xs={12}>
                <FormControl variant='outlined' size='small' fullWidth>
                  <InputLabel id='demo-simple-select-outlined-label' required>
                    <b>BookType</b>
                  </InputLabel>

                  <Select
                    labelId='demo-simple-select-outlined-label'
                    id='demo-simple-select-outlined'
                    name='publication_type'
                    onChange={handleBookType}
                    outlined
                    inputProps={[
                      { id: 1, name: 'magazine' },
                      { id: 2, name: 'newsletter' },
                    ]}
                    defaultValue={
                      localStorage.getItem('book_type') === 'undefined'
                        ? ''
                        : localStorage.getItem('book_type')
                    }
                    labelWidth={70}
                  >
                    <MenuItem value={1}>magazine</MenuItem>
                    <MenuItem value={2}>newsletter</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
            <Divider />
            <Grid container direction='row' className={[classes.root]}>
              <Grid item md={3} xs={12}>
                <Typography variant='subtitle1' style={{ marginBottom: '2%' }}>
                  <b>Book Title</b>
                </Typography>
                <Grid>
                  <TextField
                    label='Title'
                    variant='outlined'
                    size='small'
                    onChange={handleChange}
                    name='title'
                    defaultValue={
                      localStorage.getItem('title') === 'undefined'
                        ? ''
                        : localStorage.getItem('title')
                    }
                    inputProps={{ pattern: '^[a-zA-Z0-9 ]+', maxLength: 30 }}
                    placeholder='Title not be more than 10 words'
                    style={{ width: '100%' }}
                    multiline
                    required
                  />
                </Grid>
              </Grid>
              <Grid item md={3} xs={12}>
                <Typography variant='subtitle1' style={{ marginBottom: '2%' }}>
                  <b>Author Name</b>
                </Typography>
                <Grid>
                  <TextField
                    label='Name'
                    variant='outlined'
                    size='small'
                    onChange={handleChange}
                    name='author'
                    defaultValue={
                      localStorage.getItem('author') === 'undefined'
                        ? ''
                        : localStorage.getItem('author')
                    }
                    placeholder='Some Name'
                    style={{ width: '100%' }}
                    multiline
                    required
                  />
                </Grid>
              </Grid>
              <Grid item md={3} xs={12}>
                <Typography variant='subtitle1' style={{ marginBottom: '2%' }}>
                  <b> Zone</b>
                </Typography>
                <Grid>
                  <FormControl variant='outlined' size='small' fullWidth>
                    <InputLabel id='demo-simple-select-outlined-label' required>
                      Branch
                    </InputLabel>

                    <Select
                      labelId='demo-simple-select-outlined-label'
                      id='demo-simple-select-outlined'
                      name='zone'
                      onChange={handleBranch}
                      defaultValue={
                        localStorage.getItem('branch') === 'undefined'
                          ? ''
                          : localStorage.getItem('branch')
                      }
                      outlined
                      labelWidth={70}
                      required
                    >
                      {branchGet &&
                        branchGet.map((options) => {
                          return (
                            <MenuItem value={options.id} key={options.id}>
                              {options.branch.branch_name}
                            </MenuItem>
                          );
                        })}
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>
            </Grid>
            <Grid container direction='row' className={[classes.root]}></Grid>
            <Grid item md={12} xs={12} className={[classes.root1]}>
              <Typography variant='subtitle1'>
                <b>Book description</b>
              </Typography>
            </Grid>
            <Grid container item md={11} xs={10} className={[classes.root1]}>
              <Paper elevation={3} style={{ width: '100%' }}>
                {/* <MyTinyEditor
                  id='descriptioneditor'
                  handleEditorChange={handleDES}
                  placeholder='Book description...'
                  name='description'
                  className={classes.descBox}
                  content={
                    localStorage.getItem('description') === 'undefined'
                      ? ''
                      : localStorage.getItem('description')
                  }
                /> */}
                <div className='py-2 w-100 font-weight-normal'>
                  <ReactQuillEditor
                    id='descriptioneditor'
                    value={description}
                    onChange={(content, delta, source, editor) =>
                      handleDES(content, delta, source, editor)
                    }
                    placeholder='Book description...'
                  />
                </div>
              </Paper>
            </Grid>
            <Grid container item md={11} xs={12} className={[classes.root]}>
              <Paper elevation={3} style={{ width: '100%' }} fullWidth>
                <Grid container justify='center' style={{ marginTop: '35px' }}>
                  <Typography variant='h5'>
                    Drop a file on this or Browse from you Files
                  </Typography>
                  <Grid
                    container
                    justify='center'
                    direction='row'
                    style={{ marginBottom: '35px' }}
                  >
                    <Grid style={{ marginRight: '1%' }}>
                      <StyledFilterButton onClick={handleClickThumbnail}>
                        Thumbnail
                        <AddIcon />
                      </StyledFilterButton>
                      <Input
                        type='file'
                        inputRef={fileRefer}
                        inputProps={{ accept: '.jpg' }}
                        onChange={handleThumbnailChange}
                        style={{ display: 'none' }}
                      />
                    </Grid>
                    <Grid>
                      {image ? (
                        <img
                          src={image}
                          style={{
                            width: 150,
                            height: 200,
                            borderRadius: '10px',
                            objectFit: 'cover',
                          }}
                        />
                      ) : (
                        ''
                      )}
                    </Grid>
                    <Grid>
                      <StyledFilterButton onClick={handleClick}>
                        Browse
                        <AddIcon />
                      </StyledFilterButton>
                      <Input
                        type='file'
                        inputRef={fileRef}
                        inputProps={{ accept: '.pdf' }}
                        onChange={handleFileChange}
                        style={{ display: 'none' }}
                      />
                    </Grid>
                  </Grid>
                </Grid>
              </Paper>
            </Grid>
            <Grid container direction='row' className={[classes.root]}>
              <Grid item xs={1}>
                <StyledFilterButton onClick={handleGoBackPre1}>Back</StyledFilterButton>
              </Grid>
              <Grid item xs={1}>
                <StyledFilterButton
                  onClick={() => {
                    handleRead();
                    LocalData();
                  }}
                >
                  Preview
                </StyledFilterButton>
              </Grid>
              <Grid item md={2} xs={2}>
                <StyledFilterButton onClick={handleSubmitDraft}>
                  Save Draft
                </StyledFilterButton>
              </Grid>
            </Grid>
          </div>
        )}
      </form>
    </>
  );
};

export default AddPublication;
