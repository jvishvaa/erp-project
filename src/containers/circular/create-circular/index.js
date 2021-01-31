import React, { useContext, useEffect, useState } from 'react';
import Divider from '@material-ui/core/Divider';
import { useHistory } from 'react-router-dom';
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
// import download from '../../assets/images/downloadAll.svg';
import Layout from '../../Layout';
import CommonBreadcrumbs from '../../../components/common-breadcrumbs/breadcrumbs';
import AddOutlinedIcon from '@material-ui/icons/AddOutlined';
import hidefilter from '../../../assets/images/hidefilter.svg';
import showfilter from '../../../assets/images/showfilter.svg';
import endpoints from '../../../config/endpoints';
import axiosInstance from '../../../config/axios';
import attachmenticon from '../../../assets/images/attachmenticon.svg';
import deleteIcon from '../../../assets/images/delete.svg';
import './create-circular.css';
import axios from 'axios';
import moment from 'moment';
import { LocalizationProvider, DateRangePicker } from '@material-ui/pickers-4.2';
import MomentUtils from '@material-ui/pickers-4.2/adapter/moment';
import { Context } from '../context/CircularStore';

const CraeteCircular = () => {
  const { setAlert } = useContext(AlertNotificationContext);
  const themeContext = useTheme();
  const isMobile = useMediaQuery(themeContext.breakpoints.down('sm'));
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

  //context
  const [state, setState] = useContext(Context);
  const { isEdit, editData } = state;
  const { setIsEdit, setEditData } = setState;

  const [title, setTitle] = useState(editData.circular_name || '');
  const [description, setDescription] = useState(editData.description || '');
  const [filePath, setFilePath] = useState([]);
  const [filterEvent, setFilterEvent] = useState(false);

  console.log(state, 'CCCCC', editData.circular_name);

  const circularRole = [
    { name: editData.module_name || 'Student Circular', value: 'Student Circular' },
    {
      name:
        editData.module_name === 'Student Circular'
          ? 'Teacher Circular'
          : null || 'Teacher Circular',
      value: 'Teacher Circular',
    },
  ];

  const [filterData, setFilterData] = useState({
    branch: [],
    grade: [],
    section: [],
    role: '',
  });

  const handleClear = () => {
    setFilterData((filterData.branch = []));
    setFilterData({
      branch: [],
      grade: [],
      section: [],
      role: '',
    });
  };

  const handleRole = (event, value) => {
    setFilterData({ ...filterData, role: '' });
    if (value) {
      setFilterData({ ...filterData, role: value });
    }
  };

  const handleSection = (event, value) => {
    setFilterData({ ...filterData, section: [] });
    if (value) {
      setFilterData({ ...filterData, section: [...filterData.section, value] });
    }
  };

  const handleBranch = (event, value) => {
    setFilterData({ ...filterData, branch: [], grade: [], subject: '', chapter: '' });
    setOverviewSynopsis([]);
    if (value) {
      setFilterData({
        ...filterData,
        branch: [...filterData.branch, value],
        grade: '',
        subject: '',
        chapter: '',
      });
      axiosInstance
        .get(`${endpoints.communication.grades}?branch_id=${value.id}&module_id=8`)
        .then((result) => {
          if (result.data.status_code === 200) {
            setGradeDropdown(result.data.data);
          } else {
            setAlert('error', result.data.message);
            setGradeDropdown([]);
            setSubjectDropdown([]);
            setChapterDropdown([]);
          }
        })
        .catch((error) => {
          setAlert('error', error.message);
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
    setFilterData({ ...filterData, grade: [], subject: '', chapter: '' });
    setOverviewSynopsis([]);
    if (value && filterData.branch) {
      setFilterData({
        ...filterData,
        grade: [...filterData.grade, value],
        subject: '',
        chapter: '',
      });
      axiosInstance
        .get(
          `${endpoints.masterManagement.sections}?branch_id=${filterData.branch[0].id}&grade_id=${value.grade_id}`
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

  const handleImageChange = (event) => {
    if (filePath.length < 10) {
      const data = event.target.files[0];
      const fd = new FormData();
      fd.append('file', event.target.files[0]);
      fd.append('branch', filterData.branch[0].branch_name);
      // fd.append('grade',filterData.grade[0].id)
      // fd.append('section',filterData.section.id)

      axiosInstance.post(`${endpoints.circular.fileUpload}`, fd).then((result) => {
        if (result.data.status_code === 200) {
          console.log(result.data, 'resp');
          setAlert('success', result.data.message);
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
        <div className='file_close'>
          <span onClick={onClose}>
            <SvgIcon
              component={() => (
                <img
                  style={{
                    width: '20px',
                    height: '20px',
                    // padding: '5px',
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

  const removeFileHandler = (i) => {
    // const list = [...filePath];
    filePath.splice(i, 1);
    setAlert('success', 'File successfully deleted');
  };

  useEffect(() => {
    axiosInstance
      .get(`${endpoints.communication.branches}`)
      .then((result) => {
        if (result.data.status_code === 200) {
          setBranchDropdown(result.data.data);
        } else {
          setAlert('error', result.data.message);
        }
      })
      .catch((error) => {
        setBranchDropdown('error', error.message);
      });
  }, []);

  const handleSubmit = () => {
    axiosInstance
      .post(`${endpoints.circular.createCircular}`, {
        circular_name: title,
        description: description,
        module_name: filterData.role.value,
        media: filePath,
        Branch: filterData.branch.map(function (b) {
          return b.id;
        }),
        // grades:[54],
        grades: filterData.grade.map((g) => g.grade_id),
        sections: filterData.section.map((s) => s.id),
        // sections:[75]
      })
      .then((result) => {
        if (result.data.status_code === 200) {
          setTitle('');
          setDescription('');
          setAlert('success', result.data.message);
          // setFilterData(filterData.branch=[])
          // setFilterData({
          //     branch: [],
          //     grade: [],
          //     section:[],
          //     role:''
          // });
        } else {
          setAlert('error', result.data.message);
        }
      });
  };

  const handleEdited = () => {
    axiosInstance
      .put(`${endpoints.circular.updateCircular}`, {
        circular_id: editData.id,
        circular_name: title,
        description: description,
        module_name: filterData.role.value,
      })
      .then((result) => {
        if (result.data.status_code === 200) {
          setState({ ...state, isEdit: false });
          setTitle('');
          setDescription('');
          setAlert('success', result.data.message);
        } else {
          setAlert('error', result.data.message);
        }
      })
      .catch((error) => {
        setAlert('error', error.data.message);
      });
  };

  console.log(filterData, '=====', title, description, filePath);
  return (
    <>
      <Layout>
        <div className={isMobile ? 'breadCrumbFilterRow' : null}>
          <div style={{ width: '95%', margin: '20px auto' }}>
            <CommonBreadcrumbs
              componentName='Circulars'
              childComponentName='Create New'
            />
          </div>
          {isMobile ? (
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
          ) : null}
        </div>
        <Grid
          container
          spacing={isMobile ? 3 : 5}
          style={{ width: widerWidth, margin: wider }}
        >
          <Grid item xs={12} sm={3} className={isMobile ? '' : 'filterPadding'}>
            <Autocomplete
              style={{ width: '100%' }}
              size='small'
              onChange={handleBranch}
              id='grade'
              className='dropdownIcon'
              value={filterData?.branch[0] || ''}
              options={branchDropdown}
              getOptionLabel={(option) => option?.branch_name}
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
              value={filterData?.role || ''}
              // value={circularRole}
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
              value={filterData?.grade[0] || ''}
              options={gradeDropdown}
              getOptionLabel={(option) => option?.grade__grade_name}
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
              value={filterData?.section[0] || ''}
              options={sectionDropdown}
              getOptionLabel={(option) => option?.section__section_name}
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
              FILTER
            </Button>
          </Grid>
          {isMobile && <Grid item xs={3} sm={0} />}
          {isMobile && <Grid item xs={3} sm={0} />}

          {/* <Grid item xs={6} sm={2} className={isMobile ? 'createButton' : 'createButton addButtonPadding'}>
                <Button
                    startIcon={<AddOutlinedIcon style={{ fontSize: '30px' }} />}
                    variant='contained'
                    style={{ color: 'white' }}
                    color="primary"
                    className="custom_button_master"
                    // onClick={()=>history.push("/create-circular")}
                    size='medium'
                >
                    CREATE
                </Button>
            </Grid> */}
          {isMobile && <Grid item xs={3} sm={0} />}
        </Grid>

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
                    // defaultValue="Default Value"
                    value={title}
                    variant='outlined'
                    onChange={(e) => setTitle(e.target.value)}
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
                    // defaultValue="Default Value"
                    value={description}
                    variant='outlined'
                    onChange={(e) => setDescription(e.target.value)}
                  />
                </Grid>
              </Grid>
              <div className='attachmentContainer'>
                <div style={{ display: 'flex' }} className='scrollable'>
                  {filePath?.length > 0
                    ? filePath?.map((file, i) => (
                        <FileRow
                          key={`homework_student_question_attachment_${i}`}
                          file={file}
                          index={i}
                          onClose={() => removeFileHandler(i)}
                        />
                      ))
                    : null}
                </div>

                <div className='attachmentButtonContainer'>
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
                      style={{ display: 'none' }}
                      id='raised-button-file'
                      accept='image/*'
                      onChange={handleImageChange}
                    />
                    Add Document
                  </Button>
                </div>
              </div>
            </div>
            <div>
              <Button
                onClick={state.isEdit ? handleEdited : handleSubmit}
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
