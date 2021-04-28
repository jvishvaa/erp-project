import React, { useState, useEffect, useRef, useContext } from 'react';
import CommonBreadcrumbs from '../../components/common-breadcrumbs/breadcrumbs';
import {
  Button,
  Card,
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
} from '@material-ui/core';
import { Autocomplete } from '@material-ui/lab';
import AddIcon from '@material-ui/icons/Add';
import './Styles.css';
import endpoints from '../../config/endpoints';
import axiosInstance from '../../config/axios';
import { Editor } from '@tinymce/tinymce-react';
import { AlertNotificationContext } from '../../context-api/alert-context/alert-state';
import Loading from '../../components/loader/loader';
import DropZonecom from './DropZonecom';

import PublicationPreview from './PublicationPreview';
import { FilePreviewerThumbnail } from 'react-file-previewer';

// import Dropzone from 'react-dropzone-uploader';

const useStyles = makeStyles((theme) => ({
  root: {
    '& > *': {
      margin: theme.spacing(4),
    },
  },
  new: {
    '& > *': {
      margin: theme.spacing(1),
    },
  },
}));

const EditPublication = ({
  ID,
  showtitle,
  showbooktype,
  showdes,
  showgrade,
  showsubject,
  showauthor,
  IMG,
  PDF,
  showzone,
  handleGoBackPre,
}) => {
  const classes = useStyles();
  const [subject, setSubject] = useState();

  const [grades, setGrades] = useState([]);
  const Pdf_file = 'http://www.africau.edu/images/default/sample.pdf';
  const [pdfData, setPdfData] = useState({ url: Pdf_file });

  // data for post api
  const [grade, setGrade] = useState();
  const [postSubjects, setPostSubjects] = useState();
  const [branchGet, setBranchGet] = useState();

  const [bookTypes, setBookTypes] = useState();
  const [postData, setpostData] = useState('');
  const [postBranch, setPostBranch] = useState();

  const { setAlert } = useContext(AlertNotificationContext);
  const fileRef = useRef();
  const fileRefer = useRef();
  const [file, setFile] = useState(null);
  const [isPublished, setIsPublished] = useState(false);
  console.log('publishing', isPublished);
  const [description, setDescription] = useState();
  const [thumbnail, setThumbnail] = useState(null);
  const formData = new FormData();
  const formDataDraft = new FormData();
  const [image, setImage] = useState();
  const [value, setValue] = React.useState('');
  const [temp_author, setTemp_author] = useState('');
  const [temp_publication, setTemp_publication] = useState('');
  const [bookTemp, setBookTemp] = useState('');
  const [readFlag, setReadFlag] = useState(false);
  const [editFlag, setEditFlag] = useState(false);
  const [tableFlag, setTableFlag] = useState(true);
  const [delFlag, setDelFlag] = useState(false);
  const [loading, setLoading] = React.useState(false);
  const [goBackFlag, setGoBackFlag] = useState(false);
  console.log('new subjecst', showsubject);
  console.log('new Grade', showgrade);
  const handleFileChange = (event) => {
    const fileReader = new window.FileReader();
    const { files } = event.target;
    const fil = files[0];
    if (fil.name.lastIndexOf('.pdf') > 0) {
      setFile(fil);
      fileReader.onload = (fileLoad) => {
        const { result } = fileLoad.target;
        setPdfData({ url: result });
      };
      fileReader.readAsDataURL(fil);
    } else {
      setFile(null);
      fileRef.current.value = null;
      setAlert('error', 'Only pdf file is acceptable either with .pdf extension');
    }
  };
  const handleBranch = (e, value) => {
    console.log('The value of grade', e.target.value);
    if (value) {
      console.log('grade:', value.id);
      setPostBranch(e.target.value);
    } else {
      setPostBranch('');
    }
  };

  const handleThumbnailChange = (event) => {
    setImage(URL.createObjectURL(event.target.files[0]));
    console.log('imagess', event.target);
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
  console.log('Hell0', thumbnail);

  const handleDES = (event) => {
    console.log('evt:::', event);
    setDescription(event);
  };

  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 1500);
    console.log('before axios');

    axiosInstance.get(endpoints.masterManagement.gradesDrop).then((res) => {
      console.log('res', res.data.data);
      setGrades(res.data.data);
    });
  }, []);

  console.log('array', postSubjects);
  console.log('after');
  const handleGrade = (e, value) => {
    if (value) {
      console.log('grade:', value.id);
      setGrade(e.target.value);
    } else {
      setGrade('');
    }
  };

  useEffect(() => {
    axiosInstance
      .get(`${endpoints.masterManagement.subjects}?grade=${grade}`)
      .then((res) => {
        console.log('in axios');
        setSubject(res.data.result?.results);
        console.log('responsesubjetcs:', res.data.result?.results);
      });
  }, [grade]);
  const handleSubject = (e, value) => {
    if (value) {
      console.log('subject::::', e.target.value);
      setPostSubjects(e.target.value);
    } else {
      setPostSubjects('');
    }
  };
  const handleBookType = (e, value) => {
    console.log('This is booktype', value.props.value);
    let number = value.props.value;
    setBookTemp(number);
    if (number) {
      console.log('booktype:', number);
      setBookTypes(number);
    } else {
      setBookTypes('');
    }
  };
  //local storage
  React.useEffect(() => {
    localStorage.setItem('title', postData.title);
    localStorage.setItem('image', image);
    localStorage.setItem('author', postData.author);
    localStorage.setItem('book_type', bookTemp);
    localStorage.setItem('description', description);

    // localStorage.setItem('subjects_local', subject);
    // localStorage.setItem('pdffilesetBookTemp', file);
  }, [postData.title, image, postData.author, description, bookTemp, postSubjects, file]);

  // console.log('subjectsnames;;', postSubjects.subject.subject_name);
  const handleChange = (e) => {
    console.log('posdata', e.target.value);
    setpostData({ ...postData, [e.target.name]: e.target.value });

    // console.log('the big data', { ...postData, [e.target.name]: e.target.value });
  };
  console.log('book_type', localStorage.getItem('book_type'));

  const handleSubmit = (e) => {
    e.preventDefault();

    console.log('finalpostdata:', postData);

    formData.append('zone', postBranch);
    formData.append('subject', postSubjects);
    formData.append('grade', grade);
    formData.append('publication_type', bookTypes);
    formData.append('title', postData.title);
    formData.append('author_name', postData.author);
    formData.append('file', file);
    formData.append('thumbnail', thumbnail);
    formData.append('description', description);

    console.log('formData:', formData);
    console.log('booktype:', bookTypes.id);
    console.log('subject list:', postSubjects);
    console.log('grade:', grade);

    axiosInstance
      .post(endpoints.publish.ebook, formData)
      .then((result) => {
        if (result.data.status_code === 200) {
          setDelFlag(!delFlag);
          setLoading(false);
          setAlert('success', result.data.message);
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

  const handleSubmitDraft = (e) => {
    e.preventDefault();

    console.log('finalpostdata:', postData);

    formData.append('zone', postBranch);
    formData.append('subject', postSubjects);
    formData.append('grade', grade);
    formData.append('publication_type', bookTypes);
    formData.append('title', postData.title);
    formData.append('author_name', postData.author);
    formData.append('file', file);
    formData.append('thumbnail', thumbnail);
    formData.append('description', description);
    formData.append('is_published', isPublished);
    console.log('formData:', formData);
    console.log('booktype:', bookTypes);
    console.log('subject list:', postSubjects);
    console.log('grade:', grade);

    axiosInstance
      .post(endpoints.publish.ebook, formData)
      .then((result) => {
        if (result.data.status_code === 200) {
          setDelFlag(!delFlag);
          setLoading(false);
          setAlert('success', result.data.message);
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
  const onFilesChange = (files) => {
    console.log(files);
  };

  const onFilesError = (error, file) => {
    console.log('error code ' + error.code + ': ' + error.message);
  };

  const handleRead = (value) => {
    console.log('valuessss:', value);
    // setReadID(value);
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
  }, [goBackFlag]);
  return (
    <>
      <form>
        {!tableFlag && readFlag && (
          <PublicationPreview fun={handleSubmit} handleGoBack={handleGoBack} />
        )}
        {tableFlag && !readFlag && (
          <div className='bg-card'>
            <Grid container direction='row' className={[classes.root]}>
              <Grid item md={3} xs={12}>
                <FormControl variant='outlined' size='small' fullWidth>
                  <InputLabel id='demo-simple-select-outlined-label'>Grade</InputLabel>

                  <Select
                    labelId='demo-simple-select-outlined-label'
                    id='demo-simple-select-outlined'
                    name='grade'
                    onChange={handleGrade}
                    labelWidth={70}
                    defaultValue={showsubject?.id}
                  >
                    {grades &&
                      grades.map((grade) => {
                        return (
                          <MenuItem value={grade.id} key={grade.id}>
                            {grade.grade_name}
                          </MenuItem>
                        );
                      })}
                  </Select>
                </FormControl>
              </Grid>

              <Grid item md={3} xs={12}>
                <FormControl variant='outlined' size='small' fullWidth>
                  <InputLabel id='demo-simple-select-outlined-label'>Subject</InputLabel>

                  <Select
                    labelId='demo-simple-select-outlined-label'
                    id='demo-simple-select-outlined'
                    name='subject'
                    onChange={handleSubject}
                    outlined
                    defaultValue={showgrade.id}
                    labelWidth={70}
                  >
                    {subject &&
                      subject.map((options) => {
                        return (
                          <MenuItem value={options.subject.id} key={options.subject.id}>
                            {options.subject.subject_name}
                          </MenuItem>
                        );
                      })}
                  </Select>
                </FormControl>
              </Grid>
              {/* <Grid item md={3} xs={12}>
                <Autocomplete
                  id='booktype'
                  size='small'
                  options={[
                    { id: 0, name: 'magazine' },
                    { id: 1, name: 'newsletter' },
                  ]}
                  name='publication_type'
                  onChange={handleBookType}
                  getOptionLabel={(option) => option.name}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label='booktype'
                      variant='outlined'
                      required
                      defaultValue={localStorage.getItem('book_type')}
                    />
                  )}
                />
              </Grid> */}

              <Grid item md={3} xs={12}>
                <FormControl variant='outlined' size='small' fullWidth>
                  <InputLabel id='demo-simple-select-outlined-label'>BookType</InputLabel>

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
                    defaultValue={showbooktype}
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
                  Book Title
                </Typography>
                <Grid>
                  <TextField
                    label='Title'
                    variant='outlined'
                    size='small'
                    onChange={handleChange}
                    name='title'
                    placeholder='Title not be more than 10 words'
                    style={{ width: '100%' }}
                    defaultValue={showtitle}
                    multiline
                    required
                  />
                </Grid>
              </Grid>
              <Grid item md={3} xs={12}>
                <Typography variant='subtitle1' style={{ marginBottom: '2%' }}>
                  Author Name
                </Typography>
                <Grid>
                  <TextField
                    label='Name'
                    variant='outlined'
                    size='small'
                    onChange={handleChange}
                    name='author'
                    defaultValue={showauthor}
                    placeholder='Some Name'
                    style={{ width: '100%' }}
                    multiline
                  />
                </Grid>
              </Grid>

              <Grid item md={3} xs={12}>
                <Typography variant='subtitle1' style={{ marginBottom: '2%' }}>
                  Zone
                </Typography>
                <Grid>
                  <FormControl variant='outlined' size='small' fullWidth>
                    <InputLabel id='demo-simple-select-outlined-label'>Branch</InputLabel>

                    <Select
                      labelId='demo-simple-select-outlined-label'
                      id='demo-simple-select-outlined'
                      name='zone'
                      onChange={handleBranch}
                      defaultValue={showzone?.id}
                      outlined
                      labelWidth={70}
                      required
                    >
                      {branchGet &&
                        branchGet.map((options) => {
                          return (
                            <MenuItem value={options.id} key={options.id}>
                              {options.branch_name}
                            </MenuItem>
                          );
                        })}
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>
            </Grid>
            <Grid container direction='row' className={[classes.root]}></Grid>
            <Grid item md={4} xs={12} className={[classes.root]}>
              <Typography variant='subtitle1'>Book description</Typography>
            </Grid>

            <Grid container item md={11} xs={10} className={[classes.root]}>
              <Paper elevation={3} style={{ width: '100%' }}>
                <Editor
                  plugins='wordcount'
                  onEditorChange={handleDES}
                  name='description'
                  initialValue={showdes}
                />
              </Paper>
            </Grid>
            <Grid container item md={11} xs={10} className={[classes.root]}>
              <Paper elevation={3} style={{ width: '100%' }}>
                <Grid container justify='center'>
                  <Typography variant='h5'>
                    Drop a file on this or Browse from you Files
                  </Typography>
                  <Grid container justify='center' direction='row'>
                    {/* <Dropzone
                    inputRef={fileRef}
                    accept='.pdf'
                    onChange={handleFileChange}
                    style={{ display: 'none' }}
                    maxFiles={1}
                    multiple={false}
                    canCancel={false}
                    inputContent='Drop A File'
                  > */}

                    <Grid>
                      <Button onClick={handleClickThumbnail}>
                        Thumbnail
                        <AddIcon />
                      </Button>
                      <Input
                        type='file'
                        inputRef={fileRefer}
                        inputProps={{ accept: '.jpg' }}
                        onChange={handleThumbnailChange}
                        // defaultValue={IMG}
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
                      <Button onClick={handleClick}>
                        Browse
                        <AddIcon />
                      </Button>
                      <Input
                        type='file'
                        inputRef={fileRef}
                        inputProps={{ accept: '.pdf' }}
                        onChange={handleFileChange}
                        // value={PDF}
                        style={{ display: 'none' }}
                      />
                      <FilePreviewerThumbnail file={pdfData} />
                    </Grid>

                    {/* </Dropzone> */}
                    {/* <Dropzone /> */}
                  </Grid>
                </Grid>

                {/* <DropZonecom /> */}
                {/* <Grid container justify='center'>
                <Typography>(Only pdf files support)</Typography>
              </Grid> */}
              </Paper>
            </Grid>

            <Grid container direction='row' className={[classes.root]}>
              <Grid>
                <Button onClick={handleGoBackPre}>Back</Button>
              </Grid>
              <Grid>
                <Button
                  onClick={() => {
                    handleRead();
                  }}
                >
                  Preview
                </Button>
              </Grid>
              <Grid>
                <Button onClick={handleSubmitDraft}>Save Draft</Button>
              </Grid>
            </Grid>
          </div>
        )}
      </form>
    </>
  );
};

export default EditPublication;
