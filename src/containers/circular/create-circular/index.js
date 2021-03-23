import React, { useContext, useEffect, useState } from 'react';
import Divider from '@material-ui/core/Divider';
import { useHistory, useParams } from 'react-router-dom';
import {
  Grid,
  TextField,
  Button,
  useTheme,
  SvgIcon,
  IconButton,
  TextareaAutosize,
} from '@material-ui/core';
import Autocomplete from '@material-ui/lab/Autocomplete';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { AlertNotificationContext } from '../../../context-api/alert-context/alert-state';
import Layout from '../../Layout';
import CommonBreadcrumbs from '../../../components/common-breadcrumbs/breadcrumbs';
import AddOutlinedIcon from '@material-ui/icons/AddOutlined';
import hidefilter from '../../../assets/images/hidefilter.svg';
import showfilter from '../../../assets/images/showfilter.svg';
import endpoints from '../../../config/endpoints';
import axiosInstance from '../../../config/axios';
import attachmenticon from '../../../assets/images/attachmenticon.svg';
import deleteIcon from '../../../assets/images/delete.svg';
import axios from 'axios';
import moment from 'moment';
import { LocalizationProvider, DateRangePicker } from '@material-ui/pickers-4.2';
import MomentUtils from '@material-ui/pickers-4.2/adapter/moment';
import { Context } from '../context/CircularStore';
import { filter, result } from 'lodash';
import Loading from '../../../components/loader/loader';

const CraeteCircular = () => {
  const { setAlert } = useContext(AlertNotificationContext);
  const themeContext = useTheme();
  const { circularKey } = useParams();
  const isMobile = useMediaQuery(themeContext.breakpoints.down('sm'));
  const [loading, setLoading] = useState(false);
  const wider = isMobile ? '-10px 0px' : '-10px 0px 20px 8px';
  const widerWidth = isMobile ? '98%' : '95%';
  const history = useHistory();
  const [isFilter, setIsFilter] = useState(true);

  const [branchDropdown, setBranchDropdown] = useState([]);
  const [academicYearDropdown, setAcademicYearDropdown] = useState([]);
  const [volumeDropdown, setVolumeDropdown] = useState([]);
  const [gradeDropdown, setGradeDropdown] = useState([]);
  const [subjectDropdown, setSubjectDropdown] = useState([]);
  const [chapterDropdown, setChapterDropdown] = useState([]);
  const [overviewSynopsis, setOverviewSynopsis] = useState([]);
  const [centralGsMappingId, setCentralGsMappingId] = useState();
  const [sectionDropdown, setSectionDropdown] = useState([]);

  // alert(circularKey,'k')
  //context
  const [state, setState] = useContext(Context);
  const { isEdit, editData } = state;
  const { setIsEdit, setEditData } = setState;

  const [title, setTitle] = useState(editData.circular_name || '');
  const [description, setDescription] = useState(editData.description || '');
  const [filePath, setFilePath] = useState([]);
  const [filterEvent, setFilterEvent] = useState(false);

  console.log(state, 'eeeeeeeeee');
  const circularRole = [{ name: 'Student Circular', value: 'Student Circular' }];

  const [filterData, setFilterData] = useState({
    branch: '',
    grade: '',
    section: '',
    role: '',
    year: '',
  });
  const [moduleId, setModuleId] = useState();
  const NavData = JSON.parse(localStorage.getItem('navigationData')) || {};

  useEffect(() => {
    if (NavData && NavData.length) {
      NavData.forEach((item) => {
        if (
          item.parent_modules === 'Circular' &&
          item.child_module &&
          item.child_module.length > 0
        ) {
          item.child_module.forEach((item) => {
            if (item.child_name === 'Teacher Circular') {
              setModuleId(item.child_id);
            }
          });
        }
      });
    }
  }, [window.location.pathname]);
  const handleClear = () => {
    setFilterData({
      branch: '',
      grade: '',
      section: '',
      role: '',
      year: '',
    });
  };

  const handleRole = (event, value) => {
    setFilterData({ ...filterData, role: '' });
    if (value) {
      setFilterData({ ...filterData, role: value });
    }
  };
  const handleAcademicYear = (event, value) => {
    setFilterData({ ...filterData, year: '' });
    if (value) {
      setFilterData({ ...filterData, year: value });
      //.get(`${endpoints.masterManagement.branchList}?session_year=${value.id}&module_id=${moduleId}`)
      axiosInstance
        .get(`${endpoints.communication.branches}?session_year=${value.id}&module_id=${moduleId}`)
        .then((result) => {
          if (result?.data?.status_code) {
            setBranchDropdown(result?.data?.data?.results);
          } else {
            setAlert('error', result?.data?.message);
          }
        })
        .catch((error) => setAlert('error', error?.message));
    }
  };


  const handleSection = (event, value) => {
    setFilterData({ ...filterData, section: '' });
    if (value) {
      setFilterData({ ...filterData, section: value });
    }
  };

  const handleBranch = (event, value) => {
    setFilterData({ ...filterData, branch: '', grade: '', subject: '', chapter: '' });
    setOverviewSynopsis([]);
    if (value) {
      setFilterData({
        ...filterData,
        branch: value,
        grade: '',
        subject: '',
        chapter: '',
      });
      axiosInstance
        .get(`${endpoints.communication.grades}?branch_id=${value?.id}&session_year=${filterData.year?.id}&module_id=${moduleId}`)
        .then((result) => {
          if (result.data.status_code === 200) {
            setGradeDropdown(result?.data?.data);
          } else {
            setAlert('error', result?.data?.message);
            setGradeDropdown([]);
            setSubjectDropdown([]);
            setChapterDropdown([]);
          }
        })
        .catch((error) => {
          setAlert('error', error?.message);
          setGradeDropdown([]);
          setSubjectDropdown([]);
          setChapterDropdown([]);
        });
    } else {
      setGradeDropdown([]);
      setSubjectDropdown([]);
      setChapterDropdown([]);
    }
  };

  const handleGrade = (event, value) => {
    setFilterData({ ...filterData, grade: '', subject: '', chapter: '' });
    setOverviewSynopsis([]);
    if (value && filterData?.branch) {
      setFilterData({
        ...filterData,
        grade: value,
        subject: '',
        chapter: '',
      });
      axiosInstance
        .get(
          `${endpoints.masterManagement.sections}?branch_id=${filterData?.branch?.id}&session_year=${filterData.year.id}&grade_id=${value?.grade_id}&module_id=${moduleId}`
        )
        .then((result) => {
          if (result.data.status_code === 200) {
            setSectionDropdown(result.data.data);
          } else {
            setAlert('error', result.data.message);
            setSectionDropdown([]);
          }
        })
        .catch((error) => {
          setAlert('error', error.message);
          setSectionDropdown([]);
        });
    } else {
      setSectionDropdown([]);
      setChapterDropdown([]);
    }
  };

  function handleTitle(e){
      if(e.target.value.split(' ').length <= 20){
        setTitle(e.target.value)
      }
      else{
        setAlert('warning','Max Word Limit Is 20')
      }
  }
  const handleImageChange = (event) => {
    if (event.target.files[0].name.split('.')[1] === 'csv') {
      return setAlert('warning', 'Unaccepted File Type');
    }
    if (filePath.length < 10) {
      setLoading(true);
      const data = event.target.files[0];
      const fd = new FormData();
      fd.append('file', event.target.files[0]);
      fd.append('branch', filterData?.branch?.branch && filterData?.branch?.branch?.branch_name);
      // fd.append('grade',filterData.grade[0].id)
      // fd.append('section',filterData.section.id)
      axiosInstance.post(`${endpoints.circular.fileUpload}`, fd).then((result) => {
        if (result.data.status_code === 200) {
          setAlert('success', result.data.message);
          setLoading(false);
          setFilePath([...filePath, result.data.result]);
        } else {
          setAlert('error', result.data.message);
        }
      });
    } else {
      setAlert('warning', 'Exceed Maximum Number Attachment');
    }
  };

  const handleFilter = () => {
    if (!filterData.year) {
      return setAlert('warning', 'Select Academic Year');
    }
    if (!filterData.branch) {
      return setAlert('warning', 'Select Branch');
    }
    if (!filterData.role) {
      return setAlert('warning', 'Select Role');
    }
    if (filterData.grade.length <= 0) {
      return setAlert('warning', 'Select Grade');
    }
    if (filterData.section.length <= 0) {
      return setAlert('warning', 'Select Section');
    }
    if (filterData.branch && filterData.role && filterData.grade && filterData.section) {
      setFilterEvent(true);
    }
  };

  const FileRow = (props) => {
    const { file, onClose, index } = props;
    return (
      <div className='file_row_image'>
        <div className='file_name_container'>File {index + 1}</div>
        <Divider orientation='vertical' className='divider_color' flexItem />
        <div className='file_closeCircular'>
          <span onClick={onClose}>
            <SvgIcon
              component={() => (
                <img
                  style={{
                    width: '20px',
                    height: '20px',
                    cursor: 'pointer',
                  }}
                  src={deleteIcon}
                  alt='given'
                />
              )}
            />
          </span>
        </div>
      </div>
    );
  };

  const removeFileHandler = (i,file) => {
    const list = [...filePath];
    console.log(i,file,"File")
    setLoading(true)
    axiosInstance.post(`${endpoints.circular.deleteFile}`,{
      file_name:`dev/circular_files/${filterData?.branch?.branch?.branch_name}/${file}`
    }).then((result)=>{
      if (result.data.status_code === 204) {
        list.splice(i, 1);
        setFilePath(list);
        setAlert('success', result.data.message);
        setLoading(false);
      }else {
        setAlert('error', result.data.message);
        setLoading(false);
      }
    }).catch(error => {
      setAlert('error', error.message);
      setLoading(false);
    })
  };

  useEffect(() => {
    axiosInstance
      .get(`${endpoints.userManagement.academicYear}`)
      .then((result) => {
        if (result.data.status_code === 200) {
          setAcademicYearDropdown(result?.data?.data);
        } else {
          setAlert('error', result.data.message);
        }
      })
      .catch((error) => {
        setAlert('error', error.message);
      });
  }, []);

  const handleSubmit = () => {
    if (!title) {
      return setAlert('warning', 'Title Cannot Be Empty');
    }
    if (!description) {
      return setAlert('warning', 'Description Cannot Be Empty');
    }
    axiosInstance
      .post(`${endpoints.circular.createCircular}`, {
        circular_name: title,
        description: description,
        module_name: filterData.role.value,
        media: filePath,
        Branch: [filterData?.branch?.id],
        grades: [filterData?.grade?.grade_id],
        sections: [filterData?.section?.id],
        academic_year: filterData?.year?.id,
      })
      .then((result) => {
        if (result?.data?.status_code === 200) {
          setTitle('');
          setDescription('');

          setFilterData({
            branch: '',
            grade: '',
            section: '',
            role: '',
          });
          setFilePath([]);
          setFilterEvent(false);
          setAlert('success', result?.data?.message);
          history.goBack();
        } else {
          setAlert('error', result?.data?.message || `${result?.data?.description}`);
        }
      });
  };

  const handleEdited = () => {
    if (!filterData.year) {
      return setAlert('warning', 'Select Academic Year');
    }
    if (!filterData.branch) {
      return setAlert('warning', 'Select Branch');
    }
    if (!filterData.role) {
      return setAlert('warning', 'Select Role');
    }
    if (!filterData.grade) {
      return setAlert('warning', 'Select Grade');
    }
    if (!filterData.section) {
      return setAlert('warning', 'Select Section');
    }

    axiosInstance
      .put(`${endpoints.circular.updateCircular}`, {
        circular_id: circularKey,
        circular_name: title,
        description: description,
        module_name: filterData.role.value,
        media:filePath,
        Branch: [filterData?.branch?.id],
        grades: [filterData?.grade?.id],
        sections: [filterData?.section?.id],
        academic_year: filterData?.year?.id,
      })
      .then((result) => {
        if (result.data.status_code === 200) {
          setTitle('');
          setDescription('');
          setFilterData({
            branch: '',
            grade: '',
            section: '',
            role: '',
          });
          setFilePath([]);
          setFilterEvent(false);
          setAlert('success', result?.data?.message);
          history.push('/teacher-circular');
        } else {
          setAlert('error', result?.data?.message);
        }
      })
      .catch((error) => {
        setAlert('error', error?.data?.message);
      });
  };

  //////EDIT USE-EFFECT
  useEffect(() => {
    if (Number(circularKey)) {
      axiosInstance
        .get(`${endpoints.circular.viewMoreCircularData}?circular_id=${circularKey}`)
        .then((result) => {
          console.log(result?.data, 'RRRRRRRR');
          if (result?.data?.status_code === 200) {
            setFilterData({
              ...filterData,
              year: result?.data?.result?.academic_year,
              branch: result?.data?.result?.branches[0],
              grade: result?.data?.result?.grades[0],
              section: result?.data?.result?.sections[0],
              role: circularRole[0],
            });
            setTitle(result?.data?.result?.circular_name);
            setDescription(result?.data?.result?.description);
            setFilePath(result?.data?.result.media);
            setFilterEvent(true);
          }
        });
    }
  }, []);

  return (
    <>
      {loading ? <Loading message='Loading...' /> : null}
      <Layout>
        <div className={isMobile ? 'breadCrumbFilterRow' : null} className='isFilter'>
          <div style={{ width: '95%', margin: '20px auto' }}>
            <CommonBreadcrumbs
              componentName='Circulars'
              childComponentName='Create New'
            />
          </div>
          <div className='hideShowFilterIcon'>
            <IconButton onClick={() => setIsFilter(!isFilter)}>
              <SvgIcon
                component={() => (
                  <img
                    style={{ height: '20px', width: '25px' }}
                    src={isFilter ? hidefilter : showfilter}
                  />
                )}
              />
            </IconButton>
          </div>
        </div>
        {isFilter ? (
          <Grid
            container
            spacing={isMobile ? 3 : 5}
            style={{ width: widerWidth, margin: wider }}
          >
            <Grid item xs={12} sm={3} className={isMobile ? '' : 'filterPadding'}>
              <Autocomplete
                style={{ width: '100%' }}
                size='small'
                onChange={handleAcademicYear}
                id='grade'
                className='dropdownIcon'
                value={filterData?.year}
                options={academicYearDropdown}
                getOptionLabel={(option) => option?.session_year}
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
            <Grid item xs={12} sm={3} className={isMobile ? '' : 'filterPadding'}>
              <Autocomplete
                style={{ width: '100%' }}
                size='small'
                onChange={handleBranch}
                id='grade'
                className='dropdownIcon'
                value={filterData?.branch}
                options={branchDropdown}
                getOptionLabel={(option) => option?.branch?.branch_name}
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
            <Grid item xs={12} sm={3} className={isMobile ? '' : 'filterPadding'}>
              <Autocomplete
                style={{ width: '100%' }}
                size='small'
                onChange={handleRole}
                id='role'
                className='dropdownIcon'
                value={filterData?.role}
                options={circularRole}
                getOptionLabel={(option) => option?.name}
                filterSelectedOptions
                renderInput={(params) => (
                  <TextField
                    {...params}
                    variant='outlined'
                    label='Role'
                    placeholder='Role'
                  />
                )}
              />
            </Grid>
            <Grid
              item
              xs={12}
              sm={3}
              className={isMobile ? 'roundedBox' : 'filterPadding roundedBox'}
            >
              <Autocomplete
                style={{ width: '100%' }}
                size='small'
                onChange={handleGrade}
                id='grade'
                className='dropdownIcon'
                value={filterData?.grade || ''}
                options={gradeDropdown}
                getOptionLabel={(option) =>
                  option?.grade__grade_name || option?.grade_name
                }
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
            <Grid item xs={12} sm={3} className={isMobile ? '' : 'filterPadding'}>
              <Autocomplete
                style={{ width: '100%' }}
                size='small'
                onChange={handleSection}
                id='grade'
                className='dropdownIcon'
                value={filterData?.section || ''}
                options={sectionDropdown}
                getOptionLabel={(option) =>
                  option?.section__section_name || option?.section_name
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

            {!isMobile && (
              <Grid item xs={12} sm={12}>
                <Divider />
              </Grid>
            )}
            {isMobile && <Grid item xs={3} sm={0} />}
            {circularKey ? (
              ''
            ) : (
              <>
                <Grid item xs={6} sm={2} className={isMobile ? '' : 'addButtonPadding'}>
                  <Button
                    variant='contained'
                    className='custom_button_master labelColor'
                    size='medium'
                    onClick={handleClear}
                  >
                    CLEAR ALL
                  </Button>
                </Grid>
                {isMobile && <Grid item xs={3} sm={0} />}
                {isMobile && <Grid item xs={3} sm={0} />}
                <Grid item xs={6} sm={2} className={isMobile ? '' : 'addButtonPadding'}>
                  <Button
                    variant='contained'
                    style={{ color: 'white' }}
                    color='primary'
                    className='custom_button_master'
                    size='medium'
                    onClick={handleFilter}
                  >
                    NEXT
                  </Button>
                </Grid>
              </>
            )}
            {isMobile && <Grid item xs={3} sm={0} />}
            {isMobile && <Grid item xs={3} sm={0} />}
            {isMobile && <Grid item xs={3} sm={0} />}
          </Grid>
        ) : (
          ''
        )}

        {filterEvent ? (
          <div>
            <div className='descriptionBorder'>
              <Grid
                container
                spacing={isMobile ? 3 : 5}
                style={{ width: widerWidth, margin: wider }}
              >
                <Grid item xs={12}>
                  <TextField
                    id='outlined-multiline-static'
                    label='Title'
                    multiline
                    rows='1'
                    color='secondary'
                    style={{ width: '100%', marginTop: '1.25rem' }}
                    value={title}
                    variant='outlined'
                    // onChange={(e) => setTitle(e.target.value)}
                    onChange={(e)=>handleTitle(e)}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    id='outlined-multiline-static'
                    label='Description'
                    multiline
                    rows='6'
                    color='secondary'
                    style={{ width: '100%' }}
                    value={description}
                    variant='outlined'
                    onChange={(e) => setDescription(e.target.value)}
                  />
                </Grid>
              </Grid>
              <div className='attchmentContainer'>
                <div style={{ display: 'flex' }} className='scrollable'>
                  {filePath?.length > 0
                    ? filePath?.map((file, i) => (
                        <FileRow
                          key={`create_circular_${i}`}
                          file={file}
                          index={i}
                          onClose={() => removeFileHandler(i,file)}
                        />
                      ))
                    : null}
                </div>

                <div className='attachmentButton_circular'>
                  <Button
                    startIcon={
                      <SvgIcon
                        component={() => (
                          <img
                            style={{ height: '20px', width: '20px' }}
                            src={attachmenticon}
                          />
                        )}
                      />
                    }
                    className='attchment_button'
                    title='Attach Supporting File'
                    variant='contained'
                    size='medium'
                    disableRipple
                    disableElevation
                    disableFocusRipple
                    disableTouchRipple
                    component='label'
                    style={{ textTransform: 'none' }}
                  >
                    <input
                      type='file'
                      accept='.png, .jpg, .jpeg,.mp3,.mp4,.pdf'
                      style={{ display: 'none' }}
                      id='raised-button-file'
                      accept='image/*'
                      onChange={handleImageChange}
                    />
                    Add Document
                  </Button>
                  <small
                    style={{
                      color: '#014b7e',
                      fontSize: '16px',
                      marginLeft: '28px',
                      marginTop: '8px',
                    }}
                  >
                    {' '}
                    Accepted files: [jpeg,jpg,png,mp3,mp4,pdf]
                  </small>
                </div>
                <div>
                </div>
              </div>
            </div>
            <div>
            {circularKey && <Button   className='submit_button' onClick={()=>history.goBack()}>BACK</Button>}
              <Button
                onClick={circularKey ? handleEdited : handleSubmit}
                className='submit_button'
              >
                SUBMIT
              </Button>
            </div>
          </div>
        ) : null}
      </Layout>
    </>
  );
};

export default CraeteCircular;
