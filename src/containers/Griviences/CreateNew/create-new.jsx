import React, { useContext, useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import { Editor } from '@tinymce/tinymce-react';
import Layout from '../../Layout';
import TextField from '@material-ui/core/TextField';
import Divider from '@material-ui/core/Divider';
import { Typography } from '@material-ui/core';
import { DropzoneArea } from 'material-ui-dropzone';
import AttachFileIcon from '@material-ui/icons/AttachFile';
import IconButton from '@material-ui/core/IconButton';
import axiosInstance from '../../../config/axios';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { AlertNotificationContext } from '../../../context-api/alert-context/alert-state';
import {Link} from 'react-router-dom';
import './create-new.scss';
import StudentClasses from 'containers/online-class/aol-view/StudentClasses';

const useStyles = makeStyles((theme) => ({
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
  },
  selectEmpty: {
    marginTop: theme.spacing(1),
  },
  multilineColor: {
    background: 'white',
    color: '#014B7E',
  },
  flex: {
    display: 'flex',
    justifyContent: 'space-evenly',
    width: '29%',
    marginTop: '4%',
  },
  flexMobile: {
    display: 'flex',
    justifyContent: 'space-evenly',
    width: '100%',
    marginTop: '4%',
  },
  input: {
    display: 'none',
  },
}));
// const styles = (theme) => ({});

const CreateNewForm = (props) => {
  const classes = useStyles();
  const { setAlert } = useContext(AlertNotificationContext);
  const [optionData, setOptionData] = useState('');
  const [files, setFiles] = useState([]);
  const [openImage, setOpenImage] = useState(false);
  const [acadamicData, setAcadamicData] = useState();
  const setMobileView = useMediaQuery('(min-width:800px)');
  const [titleData, setTitleData] = useState('');
  const [grevancesData, setGrevancesData] = useState();
  const [editorContent, setEditorContent] = useState('');
  const [error, setErrorValue] = useState({
    option: true,
    editor: true,
    title: true,
    image: true,
  });

  useEffect(() => {
    callingAcadamicAPI();
    callingGriviencesAPI();
  }, []);

  const handleChangeOption = (event) => {
    setOptionData(event.target.value);
  };
  const handleChangeFile = (files) => {
    setFiles(files);
  };
  const handleOpenImage = (files) => {
    setFiles(files);
    setOpenImage(true);
  };
  const handleCloseImage = () => {
    setOpenImage(false);
  };

  const handleEditorChange = (content, editor) => {
    setEditorContent(content);
    console.log('Content was updated:', content);
  };
  const callingAcadamicAPI = () => {
    axiosInstance
      .get('/erp_user/list-academic_year/', {})
      .then((res) => {
        if (res.status === 200) {
          console.log(res,'listyear');
          setAcadamicData(res.data.data);
        }
        console.log(res.data.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const callingGriviencesAPI = () => {
    axiosInstance
      .get('/academic/grievance_types/')
      .then((res) => {
        console.log(res,'res data');
        if (res.status === 200) {
          console.log(res);
          setGrevancesData(res.data.data);
        }
        console.log(res, 'grievand');
      })
      .catch((error) => {
        console.log(error);
      });
  };
  let Valid = true;
  const handlePostData = () => {
    // console.log(optionData);
    // if (optionData.trim().length === 0) {
    //   console.log(false);
    //   setErrorValue({ ...error, option: false });
    //   Valid = false;
    // }
    // if (editorContent.trim().length === 0) {
    //   console.log(false);
    //   setErrorValue({ ...error, editor: false });
    //   Valid = false;
    // }
    // if (titleData.trim().lenght === 0) {
    //   console.log(false);
    //   setErrorValue({ ...error, title: false });
    //   Valid = false;
    // }
    // if (files.lenght === 0) {
    //   console.log(false);
    //   setErrorValue({ ...error, image: false });
    //   Valid = false;
    // }
    // if (Valid) {
      let obj = {
        academic_year: 1,
        section: 1,
        branch: 1,
        grade: 1,
        grievance_type: 1,
        title: titleData,
        description: editorContent,
        grievance_attachment: files,
        ticket_type: 'Grievance',
      };
      console.log(obj,'objjdata');
      axiosInstance
        .post('/academic/create_ticket/', { obj })
        .then((res) => {
          if (res.status === 200) {
            setAlert('success', 'Created Succcessfully');
          }
        })
        .catch((error) => {
          setAlert('error', error.message);
        });
    // }
    // console.log('data', error);
  };
  return (
    <>
      <Layout>
        <div className='griviences-create-form'>
          <div className='field-label-container'>
            <FormControl variant='outlined' fullWidth size='small'>
              <InputLabel id='demo-simple-select-outlined-label'>Type</InputLabel>
              <Select
                labelId='demo-simple-select-outlined-label'
                id='demo-simple-select-outlined'
                value={optionData}
                error={error.option}
                onChange={handleChangeOption}
                label='Type'
              >
                <MenuItem value=''>
                  <em>None</em>
                </MenuItem>
                {grevancesData &&
                  grevancesData.map((data, index) => (
                    <MenuItem key={index} value={data.grievance_name}>
                      {data.grievance_name}
                    </MenuItem>
                  ))}
              </Select>
            </FormControl>
          </div>
          <Divider variant='middle' />
          <div className='editor-container'>
            <div className='field-label-container-type'>
              {' '}
              <div className='text-color'>Title</div>
              <TextField
                fullWidth
                size='small'
                variant='outlined'
                error={error.title}
                InputProps={{
                  className: classes.multilineColor,
                }}
                onChange={(e) => setTitleData(e.target.value)}
                placeholder='Title not to be more then 100 words'
              />
            </div>
            {setMobileView ? (
              <Editor plugins='wordcount' onEditorChange={handleEditorChange} />
            ) : (
              <>
                {' '}
                <TextField
                  id='outlined-multiline-static'
                  label='Message'
                  multiline
                  rows={4}
                  InputProps={{
                    className: classes.multilineColor,
                  }}
                  variant='outlined'
                  onChange={handleEditorChange}
                />
              </>
            )}
          </div>
          <div className='drag-drop-griviences'>
            {setMobileView ? (
              <div className='drag-and-drop-images'>
                <Typography style={{ marginTop: '10px' }}>
                  Add Thumbnail (Optional)
                </Typography>
                <div className='drag-and-drop'>
                  {' '}
                  <DropzoneArea
                    open={openImage}
                    error={error.image}
                    acceptedFiles={['image/jpeg', 'image/png', 'image/bmp']}
                    maxFileSize={5000000}
                    onChange={handleChangeFile.bind(this)}
                    onClose={handleCloseImage.bind(this)}
                  />
                </div>
                <div className='attach-image-button'>
                  <input
                  accept='image/*'
                  className={classes.input}
                  id='icon-button-file'
                  type='file'
                />
                  <IconButton
                    color='primary'
                    aria-label='upload picture'
                    component='span'
                    size='small'
                    onClick={handleOpenImage.bind(this)}
                  >
                    <div className='attach-button'>
                      <AttachFileIcon />
                      ATTACH-IMAGE
                    </div>
                  </IconButton>
                </div>
              </div>
            ) : (
              <div className='drag-and-drop-images'>
                <div className='attach-image-button'>
                  <IconButton
                    color='primary'
                    aria-label='upload picture'
                    component='span'
                    size='small'
                    onClick={handleOpenImage.bind(this)}
                  >
                    <input
                    accept='image/*'
                    className={classes.input}
                    id='icon-button-file'
                    type='file'
                  />
                    <div className='attach-button' htmlFor="icon-button-file">
                      <AttachFileIcon />
                      ATTACH-IMAGE
                    </div>
                  </IconButton>
                </div>
              </div>
            )}
          </div>
          <div className={setMobileView ? classes.flex : classes.flexMobile}>
            <IconButton size='small'>
              <Link to='/griviences'>
              <div className='cancel-button'>CANCEL</div>
              </Link>
            </IconButton>
            <IconButton color='primary' size='small'>
              <div className='post-button' onClick={handlePostData}>
                POST
              </div>
            </IconButton>
          </div>
        </div>
      </Layout>
    </>
  );
};

export default CreateNewForm;
