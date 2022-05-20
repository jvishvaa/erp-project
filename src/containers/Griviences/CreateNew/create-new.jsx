import React, { useContext, useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import LayersClearIcon from '@material-ui/icons/LayersClear';
import { Button } from '@material-ui/core';
import endpoints from '../../../config/endpoints';
import DNDFileUpload from 'components/dnd-file-upload';
import { Autocomplete, Pagination } from '@material-ui/lab';
import CommonBreadcrumbs from '../../../components/common-breadcrumbs/breadcrumbs';
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
import { Link } from 'react-router-dom';
import Loader from '../../../components/loader/loader';
import './create-new.scss';
import StudentClasses from 'containers/online-class/aol-view/StudentClasses';
import { columnSelectionComplete } from '@syncfusion/ej2-grids';
import Grid from '@material-ui/core/Grid';
import { excelQueryCellInfo } from '@syncfusion/ej2-grids';
import { useHistory, useLocation } from 'react-router-dom';
import DeleteIcon from '@material-ui/icons/Delete';
import { connect, useSelector } from 'react-redux';


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
  const history = useHistory();
  const [optionData, setOptionData] = useState('');
  const [loading, setLoading] = useState(false);
  const [academicYear, setAcademicYear] = useState([]);
  const [branchList, setBranchList] = useState([]);
  const [selectedBranch, setSelectedBranch] = useState([]);
  const [gradeList, setGradeList] = useState([]);
  const [selectedGrade, setSelectedGrade] = useState([]);
  const [sectionList, setSectionList] = useState([]);
  const [selectedSection, setSelectedSection] = useState([]);
  const [secSelectedId, setSecSelectedId] = useState([]);

  const [files, setFiles] = useState([]);
  const [openImage, setOpenImage] = useState(false);
  // const [acadamicData, setAcadamicData] = useState();
  const setMobileView = useMediaQuery('(min-width:800px)');
  const [titleData, setTitleData] = useState('');
  const [grevancesData, setGrevancesData] = useState();
  const [editorContent, setEditorContent] = useState('');
  const moduleId = 178;
  const [error, setErrorValue] = useState({
    option: true,
    editor: true,
    title: true,
    image: true,
  });
  const selectedAcademicYear = useSelector(
    (state) => state.commonFilterReducer?.selectedYear
  );

  useEffect(() => {
    // callingAcadamicAPI();
    callApi(`${endpoints.userManagement.academicYear}`, 'academicYearList');
    callingGriviencesAPI();
  }, []);

  const handleChangeOption = (event = {}, value = []) => {
    setOptionData(value);
  };
  const handleChangeFile = (files) => {
    setFiles(files[0]);
  };

  const handleUpload = (e) => {
    console.log(e);
    setFiles(e);
  }
  const handleOpenImage = (files) => {
    setFiles(files);
    setOpenImage(true);
  };
  const handleCloseImage = () => {
    setOpenImage(false);
  };

  const removeItem = () => {
    setFiles([])
  }

  const handleEditorChange = (content, editor) => {
    setEditorContent(content);
  };
  // const callingAcadamicAPI = () => {
  //   axiosInstance
  //     .get('/erp_user/list-academic_year/', {})
  //     .then((res) => {
  //       if (res.status === 200) {
  //         setAcadamicData(res.data.data);
  //       }
  //     })
  //     .catch((error) => {
  //     });
  // };
  const callingGriviencesAPI = () => {
    setLoading(true);
    axiosInstance
      .get('/academic/grievance_types/')
      .then((res) => {
        setLoading(false);
        if (res.status === 200) {
          setGrevancesData(res.data.data);
          setLoading(false);
        }
      })
      .catch((error) => {
        setLoading(false);
      });
  };
  function callApi(api, key) {
    setLoading(true);
    axiosInstance
      .get(api)
      .then((result) => {
        if (result.status === 200) {
          if (key === 'academicYearList') {
            setAcademicYear(result?.data?.data || []);
          }
          if (key === 'branchList') {
            setBranchList(result?.data?.data?.results || []);
          }
          if (key === 'gradeList') {
            setGradeList(result.data.data || []);
          }
          if (key === 'section') {
            setSectionList(result.data.data);
          }
          setLoading(false);
        } else {
          setAlert('error', result.data.message);
          setLoading(false);
        }
      })
      .catch((error) => {
        setAlert('error', error.message);
        setLoading(false);
      });
  }
  let Valid = true;
  const formData = new FormData();

  const handlePostData = () => {
    console.log(files);
    if (titleData?.length == 0) {
      setAlert('warning', 'Title');
      return;
    }
    if (editorContent?.length == 0) {
      setAlert('warning', 'Description');
      return;
    }
    if (optionData == 0) {
      setAlert('warning', 'Select Type');
      return;
    }
    let temp;
    if (optionData?.grievance_name === 'type 1') {
      temp = 1;
    } else if (optionData?.grievance_name === 'type 2') {
      temp = 2;
    } else if (optionData?.grievance_name === 'type 3') {
      temp = 3;
    } else if (optionData?.grievance_name === 'type 4') {
      temp = 4;
    }
    let obj = {

      grievance_type: temp,
      title: titleData,
      description: editorContent,
      // grievance_attachment: '',
      erp_id: '',
      ticket_type: 'Grievance',
    };
    formData.append('academic_year', selectedAcademicYear?.id)
    formData.append('grievance_type', optionData?.id)
    formData.append('title', titleData)
    formData.append('description', editorContent)
    formData.append('ticket_type', 1)
    if (files?.type ) {
      formData.append('grievance_attachment', files)
    }

    setLoading(true);
    axiosInstance
      .post('/academic/grevience-filter/', formData)
      .then((res) => {
        setLoading(false);
        if (res.status === 201) {
          setAlert('success', 'Created Succcessfully');
          setLoading(false);
          history.push('/griviences/student-view');
        }
      })
      .catch((error) => {
        setAlert('error', error.message);
        setLoading(false);
      });
    // }
  };

  const handleBackButton = () => {
    window.history.back();
  }
  const fileConf = {
    fileTypes: 'image/jpeg,image/png,',
    types: 'images',
    initialValue: '',
  };
  return (
    <>
      <Layout>
        <Grid className='griviences-breadcrums-container'>
          <CommonBreadcrumbs
            componentName='Grievance'
            childComponentName='Create Grievance'
          />
        </Grid>
        <div className='griviences-create-form'>
          <Grid
            container
            direction='row'
            className={classes.root}
            spacing={3}
            id='selectionContainer'
          >
            <Grid item md={2} xs={12}>
              <Autocomplete
                style={{ width: '100%' }}
                size='small'
                onChange={handleChangeOption}
                id='branch_id'
                className='dropdownIcon'
                value={optionData || []}
                options={grevancesData || []}
                getOptionLabel={(option) => option?.grievance_name || ''}
                // getOptionSelected={(option, value) =>
                //   option?.grievance_name == value?.grievance_name
                // }
                renderInput={(params) => (
                  <TextField
                    {...params}
                    variant='outlined'
                    label='Type'
                    placeholder='Type'
                  />
                )}
              />
            </Grid>
          </Grid>

          <Divider variant='middle' />
          <div className='editor-container'>
            <div className='field-label-container-type'>
              {' '}
              <Typography color="secondary">Title</Typography>
              <TextField
                fullWidth
                size='small'
                variant='outlined'
                error={error.title}
                InputProps={{
                  className: classes.multilineColor,
                }}
                inputProps={{ maxLength: 100 }}
                onChange={(e) => setTitleData(e.target.value)}
                placeholder='Title not to be more than 100 words'
              />
            </div>
            {setMobileView ? (
              <Editor plugins='wordcount' onEditorChange={handleEditorChange} />
            ) : (
              <>
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
                <div style={{ width: '25%', display: 'flex', flexDirection: 'column', justifyContent: 'center' , height: '130px' }} >
                  <Typography style={{ textAlign: 'center' }}>
                    Add Attachment
                  </Typography>
                  <Typography style={{ textAlign: 'center' }}>
                    (Optional)
                  </Typography>
                </div>
                <div className='drag-and-drop'  >

                  <DNDFileUpload
                    value={fileConf.initialValue}
                    handleChange={(e) => {
                      if (e) {
                        handleUpload(e);
                      }
                    }}
                    fileType={fileConf.fileTypes}
                    typeNames={fileConf.types}
                  />

                  {files?.name ? 
                  <div style={{display : 'flex' , justifyContent: 'space-between'}} >
                  <p style={{fontSize: '17px' , fontWeight: '600' , marginTop: '10px'}}> File Name : {files?.name}</p> 
                  <IconButton onClick={removeItem}>
                    <DeleteIcon   />
                  </IconButton>
                  </div>
                  : ''}
                </div>
                {/* <div className='attach-image-button'>
                  <input
                    accept='image/*'
                    className={classes.input}
                    id='icon-button-file'
                    type='file'
                  />
                  <IconButton
                    open={openImage}
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
                </div> */}
              </div>
            ) : (
              <></>
            )}
          </div>
          {/* <div>
           
          </div> */}
          <div className={setMobileView ? classes.flex : classes.flexMobile}>
            <Button variant="contained" className='cancelButton labelColor' onClick={e => handleBackButton()}>
              BACK
              {/* </Link> */}
            </Button>
            <Button color='primary' variant="contained" style={{ color: "white" }} onClick={handlePostData}>
              POST
            </Button>
          </div>
        </div>
        {loading && <Loader />}
      </Layout>
    </>
  );
};

export default CreateNewForm;
