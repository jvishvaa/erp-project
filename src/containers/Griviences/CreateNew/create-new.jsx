import React, { useContext, useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import LayersClearIcon from '@material-ui/icons/LayersClear';
import { Button } from '@material-ui/core';
import endpoints from '../../../config/endpoints';

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
  const history = useHistory();
  const [optionData, setOptionData] = useState('');
  const [loading, setLoading] = useState(false);
  const [academicYear, setAcademicYear] = useState([]);
  const [selectedAcademicYear, setSelectedAcadmeicYear] = useState('');
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

  useEffect(() => {
    // callingAcadamicAPI();
    callApi(`${endpoints.userManagement.academicYear}`, 'academicYearList');
    callingGriviencesAPI();
  }, []);

  const handleChangeOption = (event) => {
    setOptionData(event.target.value);
    console.log(event.target.value, '********************************');
  };
  const handleChangeFile = (files) => {
    setFiles(files);
    console.log(files, '************files************');
  };
  const handleOpenImage = (files) => {
    console.log('attach image');
    setFiles(files);
    console.log(openImage, 'Images');
    setOpenImage(true);
  };
  const handleCloseImage = () => {
    setOpenImage(false);
  };

  const handleEditorChange = (content, editor) => {
    setEditorContent(content);
    console.log('Content was updated:', content);
  };
  // const callingAcadamicAPI = () => {
  //   axiosInstance
  //     .get('/erp_user/list-academic_year/', {})
  //     .then((res) => {
  //       if (res.status === 200) {
  //         console.log(res, 'listyear');
  //         setAcadamicData(res.data.data);
  //       }
  //       console.log(res.data.data);
  //     })
  //     .catch((error) => {
  //       console.log(error);
  //     });
  // };
  const callingGriviencesAPI = () => {
    setLoading(true);
    axiosInstance
      .get('/academic/grievance_types/')
      .then((res) => {
        console.log(res, 'res data');
        setLoading(false);
        if (res.status === 200) {
          console.log(res);
          setGrevancesData(res.data.data);
          setLoading(false);
        }
        console.log(res, 'grievand');
      })
      .catch((error) => {
        console.log(error);
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
            console.log(result?.data?.data || [], 'checking');
            setAcademicYear(result?.data?.data || []);
          }
          if (key === 'branchList') {
            console.log(result?.data?.data || [], 'checking');
            setBranchList(result?.data?.data?.results || []);
          }
          if (key === 'gradeList') {
            console.log(result?.data?.data || [], 'checking');
            setGradeList(result.data.data || []);
          }
          if (key === 'section') {
            console.log(result?.data?.data || [], 'checking');
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
    if (!selectedAcademicYear) {
      setAlert('warning', 'Select Academic Year');
      return;
    }
    console.log(selectedBranch.length, '===============');
    if (selectedBranch.length == 0) {
      console.log(selectedBranch.length, '===============');
      setAlert('warning', 'Select Branch');
      return;
    }
    if (selectedGrade.length == 0) {
      setAlert('warning', 'Select Grade');
      return;
    }
    if (selectedSection.length == 0) {
      setAlert('warning', 'Select Section');
      return;
    }
    if (optionData == 0) {
      setAlert('warning', 'Select Type');
      return;
    }
    let temp;
    if (optionData === 'type 1') {
      temp = 1;
    } else if (optionData === 'type 2') {
      temp = 2;
    } else if (optionData === 'type 3') {
      temp = 3;
    } else if (optionData === 'type 4') {
      temp = 4;
    }
    let obj = {
      academic_year: selectedAcademicYear.id,

      branch: selectedBranch.branch.id,
      grade: selectedGrade.grade_id,
      section: selectedSection.section_id,
      grievance_type: temp,
      title: titleData,
      description: editorContent,
      // grievance_attachment: '',
      erp_id: '',
      ticket_type: 'Grievance',
    };
    console.log(obj, 'objjdata');
    setLoading(true);
    axiosInstance
      .post('/academic/grevience-filter/', obj)
      .then((res) => {
        setLoading(false);
        if (res.status === 200) {
          setAlert('success', 'Created Succcessfully');
          setLoading(false);
          history.push('/griviences/admin-view');
        }
      })
      .catch((error) => {
        setAlert('error', error.message);
        setLoading(false);
      });
    // }
    // console.log('data', error);
  };

  const handleBackButton = () => {
    window.history.back();
  }
  return (
    <>
      <Layout>
        <Grid className='griviences-breadcrums-container'>
          <CommonBreadcrumbs
            componentName='Griviences'
            childComponentName='Create Griviences'
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
            <Grid item md={3} xs={12}>
              <Autocomplete
                style={{ width: '100%' }}
                size='small'
                onChange={(event, value) => {
                  setSelectedAcadmeicYear(value);
                  console.log(value, 'test');
                  if (value) {
                    callApi(
                      `${endpoints.communication.branches}?session_year=${value?.id}&module_id=${moduleId}`,
                      'branchList'
                    );
                  }
                  setSelectedGrade([]);
                  setSectionList([]);
                  setSelectedSection([]);
                  setSelectedBranch([]);
                }}
                id='branch_id'
                className='dropdownIcon'
                value={selectedAcademicYear || ''}
                options={academicYear || ''}
                getOptionLabel={(option) => option?.session_year || ''}
                filterSelectedOptions
                renderInput={(params) => (
                  <TextField
                    {...params}
                    variant='outlined'
                    label='Academic Year'
                    placeholder='Academic Year'
                  />
                )}
              />
            </Grid>
            <Grid item md={3} xs={12}>
              <Autocomplete
                // multiple
                style={{ width: '100%' }}
                size='small'
                onChange={(event, value) => {
                  setSelectedBranch([]);
                  if (value) {
                    // const ids = value.map((el)=>el)
                    const selectedId = value.branch.id;
                    setSelectedBranch(value);
                    console.log(value);
                    callApi(
                      `${endpoints.academics.grades}?session_year=${
                        selectedAcademicYear.id
                      }&branch_id=${selectedId.toString()}&module_id=${moduleId}`,
                      'gradeList'
                    );
                  }
                  setSelectedGrade([]);
                  setSectionList([]);
                  setSelectedSection([]);
                }}
                id='branch_id'
                className='dropdownIcon'
                value={selectedBranch || ''}
                options={branchList || ''}
                getOptionLabel={(option) => option?.branch?.branch_name || ''}
                filterSelectedOptions
                renderInput={(params) => (
                  <TextField
                    {...params}
                    variant='outlined'
                    label='Branch'
                    placeholder='Branch'
                  />
                )}
              />
            </Grid>
            <Grid item md={3} xs={12}>
              <Autocomplete
                // multiple
                style={{ width: '100%' }}
                size='small'
                onChange={(event, value) => {
                  setSelectedGrade([]);
                  if (value) {
                    // const ids = value.map((el)=>el)
                    const selectedId = value.grade_id;
                    // console.log(selectedBranch.branch)
                    const branchId = selectedBranch.branch.id;
                    setSelectedGrade(value);
                    callApi(
                      `${endpoints.academics.sections}?session_year=${selectedAcademicYear.id}&branch_id=${branchId}&grade_id=${selectedId}&module_id=${moduleId}`,
                      'section'
                    );
                  }
                  setSectionList([]);
                  setSelectedSection([]);
                }}
                id='grade_id'
                className='dropdownIcon'
                value={selectedGrade || ''}
                options={gradeList || ''}
                getOptionLabel={(option) => option?.grade__grade_name || ''}
                filterSelectedOptions
                renderInput={(params) => (
                  <TextField
                    {...params}
                    variant='outlined'
                    label='Grade'
                    placeholder='Grade'
                  />
                )}
              />
            </Grid>
            <Grid item md={3} xs={12}>
              <Autocomplete
                // multiple
                style={{ width: '100%' }}
                size='small'
                onChange={(event, value) => {
                  setSelectedSection([]);
                  if (value) {
                    const ids = value.id;
                    const secId = value.section_id;
                    setSelectedSection(value);
                    setSecSelectedId(secId);
                  }
                }}
                id='section_id'
                className='dropdownIcon'
                value={selectedSection || ''}
                options={sectionList || ''}
                getOptionLabel={(option) =>
                  option?.section__section_name || option?.section_name || ''
                }
                filterSelectedOptions
                renderInput={(params) => (
                  <TextField
                    {...params}
                    variant='outlined'
                    label='Section'
                    placeholder='Section'
                  />
                )}
              />
            </Grid>
            <Grid item md={3} xs={12}>
              {/* <Autocomplete
                // multiple
                style={{ width: '100%' }}
                size='small'
                // onChange={(event, value) => {
                //   setSelectedSection([]);
                //   if (value) {
                //     const ids = value.id;
                //     const secId = value.section_id;
                //     setSelectedSection(value);
                //     setSecSelectedId(secId);
                //   }
                // }}
                id='section_id'
                className='dropdownIcon'
                // value={selectedSection || ''}
                // options={sectionList || ''}
                // getOptionLabel={(option) =>
                //   option?.section__section_name || option?.section_name || ''
                // }
                // filterSelectedOptions
                renderInput={(params) => (
                  <TextField
                    {...params}
                    variant='outlined'
                    label='Grivience Type'
                    placeholder='Grivience Type'
                  />
                )}
              /> */}
              {/* <div className='field-label-container'> */}
              <FormControl
                variant='outlined'
                fullWidth
                size='small'
                className='dropdownIcon'
              >
                <InputLabel
                  id='demo-simple-select-outlined-label'
                  className='dropdownIcon'
                >
                  Type
                </InputLabel>
                <Select
                  labelId='demo-simple-select-outlined-label'
                  id='demo-simple-select-outlined'
                  value={optionData}
                  error={error.option}
                  onChange={handleChangeOption}
                  className='dropdownIcon'
                  label='Type'
                >
                  <MenuItem value=''>
                    <em>None</em>
                  </MenuItem>
                  {grevancesData &&
                    grevancesData.map((data, index) => (
                      <MenuItem key={index} value={data?.grievance_name}>
                        {data.grievance_name}
                      </MenuItem>
                    ))}
                </Select>
              </FormControl>
              {/* </div> */}
            </Grid>
          </Grid>

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
                <Typography style={{ padding: '5%' }}>
                  Add Attachment(Optional)
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
            <IconButton size='small' onClick={e => handleBackButton()}>
              {/* <Link to='/griviences/admin-view' style={{ textDecoration: 'none' }}> */}
                <div className='cancel-button'>BACK</div>
              {/* </Link> */}
            </IconButton>
            <IconButton color='primary' size='small'>
              <div className='post-button' onClick={handlePostData}>
                POST
              </div>
            </IconButton>
          </div>
        </div>
        {loading && <Loader />}
      </Layout>
    </>
  );
};

export default CreateNewForm;
