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
  FormHelperText,
} from '@material-ui/core';
import FormControl from '@material-ui/core/FormControl';
import Autocomplete from '@material-ui/lab/Autocomplete';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import AddOutlinedIcon from '@material-ui/icons/AddOutlined';
import axios from 'axios';
import { useFormik } from 'formik';
import { HomeWork } from '@material-ui/icons';
import { useStyles } from '../../user-management/useStyles';

import { AlertNotificationContext } from '../../../context-api/alert-context/alert-state';
import Layout from '../../Layout';
import CommonBreadcrumbs from '../../../components/common-breadcrumbs/breadcrumbs';
import endpoints from '../../../config/endpoints';
import axiosInstance from '../../../config/axios';
import attachmenticon from '../../../assets/images/attachmenticon.svg';
import deleteIcon from '../../../assets/images/delete.svg';
import Loading from '../../../components/loader/loader';
import validationSchema from '../../user-management/schemas/school-details';
import {
  fetchBranchesForCreateUser,
  fetchGrades,
  fetchSections,
  fetchAcademicYears as getAcademicYears,
  fetchSubjects as getSubjects,
} from '../../../redux/actions/index';
import { Context } from '../context/context';

const CreateDailyDairy = (details, onSubmit) => {
  const [academicYears, setAcademicYears] = useState([]);
  const [branches, setBranches] = useState([]);
  const [grades, setGrades] = useState([]);
  const [sections, setSections] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [chapterDropdown, setChapterDropdown] = useState([]);
  const [filePath, setFilePath] = useState([]);
  const { token } = JSON.parse(localStorage.getItem('userDetails')) || {};
  const [searchAcademicYear, setSearchAcademicYear] = useState('');
  const [academicYear, setAcademicYear] = useState([]);
  const [branchDropdown, setBranchDropdown] = useState([]);
  const [subjectIds, setSubjectIds] = useState('');
  const [subjectDropdown, setSubjectDropdown] = useState([]);
  const [recap, setRecap] = useState('');
  const [detail, setDetails] = useState('');
  const [summary, setSummary] = useState('');
  const [tools, setTools] = useState('');
  const [homework, setHomework] = useState('');
  const [branchSel, setSelBranch] = useState([]);
  const [gradeSel, setSelGrade] = useState([]);
  const [sectionSel, setSelSection] = useState([]);
  const [subjectSel, setSelSubject] = useState([]);
  const [errors, setErrors] = useState({ branches: '', grades: '' });
  const [loading, setLoading] = useState(false);
  const history = useHistory();

  // context
  const [state, setState] = useContext(Context);
  const { isEdit, editData } = state;
  const { setIsEdit, setEditData } = setState;
  const [title, setTitle] = useState(editData.circular_name || '');
  const [description, setDescription] = useState(editData.description || '');

  const [filterData, setFilterData] = useState({
    year: '',
    volume: '',
    grade: '',
    branch: '',
  });

  const { setAlert } = useContext(AlertNotificationContext);
  const themeContext = useTheme();
  const isMobile = useMediaQuery(themeContext.breakpoints.down('sm'));
  const wider = isMobile ? '-10px 0px' : '-10px 0px 20px 8px';
  const widerWidth = isMobile ? '98%' : '95%';
  const [moduleId, setModuleId] = useState();
  const NavData = JSON.parse(localStorage.getItem('navigationData')) || {};

  useEffect(() => {
    if (NavData && NavData.length) {
      console.log('NavData: ', NavData)
      NavData.forEach((item) => {
        if (
          item.parent_modules === 'Diary' &&
          item.child_module &&
          item.child_module.length > 0
        ) {
          item.child_module.forEach((item) => {
            if (item.child_name === 'Teacher Diary') {
              setModuleId(item.child_id);
            }
          });
        }
      });
    }
  }, []);

  const formik = useFormik({
    initialValues: {
      academic_year: details.academic_year,
      branch: details.branch,
      grade: details.grade,
      section: details.section,
      subjects: details.subjects,
      chapters: details.chapters,
    },
    validationSchema,
    onSubmit: (values) => {
      onSubmit(values);
    },
    validateOnChange: false,
    validateOnBlur: false,
  });

  const fetchAcademicYears = () => {
    getAcademicYears(moduleId).then((data) => {
      const transformedData = data?.map((obj) => ({
        id: obj.id,
        session_year: obj.session_year,
      }));
      setAcademicYears(transformedData);
    });
  };

  useEffect(() => {
    // axiosInstance.get(`${endpoints.communication.branches}`)
    //     .then(result => {
    //         if (result.data.status_code === 200) {
    //             setBranchDropdown(result?.data?.data);
    //         } else {
    //             setAlert('error', result?.data?.message);
    //         }
    //     }).catch(error => {
    //         setBranchDropdown('error', error.message);
    //     })
    axiosInstance
      .get(`${endpoints.userManagement.academicYear}?module_id=${moduleId}`)
      .then((result) => {
        if (result.status === 200) {
          setAcademicYear(result?.data?.data);
        } else {
          setAlert('error', result?.data?.message);
        }
      })
      .catch((error) => {
        setAlert('error', error.message);
      });
  }, []);
  const handleAcademicYear = (event, value) => {
    setSearchAcademicYear('');
    setFilterData({ ...filterData, year: '' });
    if (value) {
      setSearchAcademicYear(value.id);
      setFilterData({ ...filterData, year: value });
      fetchBranchesForCreateUser(value.id, moduleId).then((data) => {
        const transformedData = data?.map((obj) => ({
          id: obj.id,
          branch_name: obj.branch_name,
        }));
        setBranches(transformedData);
      });
      // axiosInstance
      //   .get(
      //     `${endpoints.masterManagement.branchList}?session_year=${value.id}&module_id=${moduleId}`
      //   )
      //   .then((result) => {
      //     if (result?.data?.status_code) {
      //       setBranchDropdown(result?.data?.data);
      //     } else {
      //       setAlert('error', result?.data?.message);
      //     }
      //   })
      //   .catch((error) => setAlert('error', error?.message));
    }
  };

  const fetchBranches = () => {
    console.log('handle branch: ', searchAcademicYear, moduleId)
    fetchBranchesForCreateUser(searchAcademicYear, moduleId).then((data) => {
      const transformedData = data?.map((obj) => ({
        id: obj.id,
        branch_name: obj.branch_name,
      }));
      setBranches(transformedData);
    });
  };

  const handleChangeBranch = (values) => {
    console.log(values, 'VVVVVVVVVVVVv');
    setGrades([]);
    setSections([]);
    fetchGrades(searchAcademicYear, values, moduleId).then((data) => {
      const transformedData = data
        ? data.map((grade) => ({
            id: grade.grade_id,
            grade_name: grade.grade__grade_name,
          }))
        : [];
      setGrades(transformedData);
    });
  };

  const handleChangeGrade = (values, branch) => {
    console.log('handle grade', values)
    if (branch) {
      fetchSections(searchAcademicYear, branch, [values], moduleId).then((data) => {
        const transformedData = data
          ? data.map((section) => ({
              id: section.section_id,
              section_name: `${section.section__section_name}`,
            }))
          : [];
        const filteredSelectedSections = formik.values.section.filter(
          (sec) => transformedData.findIndex((data) => data.id === sec.id) > -1
        );
        setSections(transformedData);
        formik.setFieldValue('section', filteredSelectedSections);
      });
      // fetchSubjects(branch, values);
    } else {
      setSections([]);
    }
  };

  const fetchChapters = () => {
    // debugger
    axios
      .get(
        `/qbox/academic/chapters/?academic_year=${searchAcademicYear}&subject=${subjectIds}`
      )
      .then((result) => {
        if (result.data.status_code === 200) {
          setChapterDropdown(result.data.result);
        } else {
          setAlert('error');
        }
      })
      .catch((error) => {
        setAlert('error');
      });
  };

  const fetchSubjects = (branch, grade, section) => {
    console.log('=== fetch sub:', branch, grade, section)
    if (branch && grade &&
      // grade.length > 0 &&
      section 
      // section.length > 0
    ) {
      getSubjects(searchAcademicYear, branch, grade, section, moduleId).then((data) => {

        const transformedData = data.map((obj) => ({
          id: obj.subject__id,
          subject_name: obj.subject__subject_name,
        }));
        setSubjectDropdown(transformedData);
        const filteredSelectedSubjects = formik.values.subjects.filter(
          (sub) => transformedData.findIndex((data) => data.id === sub.id) > -1
        );
        formik.setFieldValue('subjects', filteredSelectedSubjects);
      });
    } else {
      setSubjectDropdown([]);
    }
  };

  const handleSection = (e, value) => {
    formik.setFieldValue('section', value);
    if (!!value.length) {
      formik.setFieldValue('subjects', []);
    }
    const {
      values: { branch = {}, grade = [] },
    } = formik;
    console.log('values : ', value)
    fetchSubjects([branch], [grade], [value]);
  };

  const handleSubject = (event, value) => {
    setFilterData({ ...filterData });
    console.log(value);
    setSubjectIds(value?.id);
    axiosInstance
      .get(
        `${endpoints.dailyDairy.branches}?session_year=${searchAcademicYear}&subject=${value.id}&module_id=${moduleId}`
      )
      .then((result) => {
        if (result.data.status_code === 200) {
          setChapterDropdown(result.data.result);
        } else {
          setAlert('error');
        }
      })
      .catch((error) => {
        setAlert('error');
      });
  };

  const handleImageChange = (event) => {
    let fileType = ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf']
    let selectedFileType = event.target.files[0]?.type
    if (!fileType.includes(selectedFileType)) {
      return setAlert('error', 'File Type not supported');
    }
    if (filePath.length < 10) {
      if (isEdit) {
        console.log('Continue');
      } else if (
        !formik.values.section ||
        !formik.values.grade ||
        !formik.values.subjects ||
        !formik.values.branch.id ||
        !subjectIds
      ) {
        return setAlert('error', 'Please select all fields');
      }
      setLoading(true);
      const data = event.target.files[0];
      console.log(formik.values);
      let fd = new FormData();
      fd.append('file', data);
      fd.append(
        'branch_name',
        isEdit ? editData.branch?.branch_name : formik.values.branch?.branch_name
      );
      fd.append('grades', isEdit ? editData?.grade?.id : formik.values.grade[0]?.id);
      // fd.append('section', isEdit ? editData.section[0].id : formik.values.section[0].id);
      axiosInstance.post(`academic/dairy-upload/`, fd).then((result) => {
        console.log(fd);
        if (result.data.status_code === 200) {
          setLoading(false);

          console.log(result.data, 'resp');
          setAlert('success', result.data.message);
          setFilePath([...filePath, result.data.result]);
        } else {
          setLoading(false);

          setAlert('error', result.data.message);
        }
      });
    } else {
      setAlert('warning', 'Exceed Maximum Number Attachment');
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    console.log('upload attach:', filePath);

    const createDairyEntry = endpoints.dailyDairy.createDailyDairy;
    console.log('handle Formik:', formik)
    const ids = formik.values.section
      ? [formik.values.section].map((el) => el.id)
      : setAlert('error', 'Fill all the required fields');
    const grade = formik.values.grade ? [formik.values.grade].map((el) => el.id) : '';
    const subjectId = formik.values.subjects
      ? formik.values.subjects.map((el) => el.id)
      : setAlert('error', 'check');
    if (
      !formik.values.section ||
      !formik.values.grade ||
      !formik.values.subjects ||
      !formik.values.branch.id
    ) {
      return setAlert('error', 'Please select all fields');
    }
    console.log('===============');
    console.log(subjectId);
    console.log(formik.values.subjects);
    const teacherReport = [];
    try {
      const response = await axiosInstance.post(
        createDairyEntry,
        filePath && filePath.length > 0
          ? {
            academic_year: searchAcademicYear,
            module_id: moduleId,
              branch: formik.values?.branch?.id,
              grade,
              section_mapping: ids,
              subject: subjectIds,
              chapter: formik.values.chapters?.id,
              documents: filePath,
              teacher_report: {
                previous_class: recap,
                summary,
                class_work: detail,
                tools_used: tools,
                homework,
              },
              dairy_type: 2,
            }
          : {
              academic_year: searchAcademicYear,
            branch: formik.values?.branch?.id,
            module_id: moduleId,

              grade,
              section_mapping: ids,
              subject: subjectIds,
              chapter: formik.values?.chapters?.id,
              teacher_report: {
                previous_class: recap,
                summary,
                class_work: detail,
                tools_used: tools,
                homework,
              },
              dairy_type: 2,
            },
        {
          headers: {
            // 'application/json' is the modern content-type for JSON, but some
            // older servers may use 'text/json'.
            // See: http://bit.ly/text-json
            'content-type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const { message, status_code: statusCode } = response.data;
      if (statusCode === 200) {
        setAlert('success', message);
        // window.location.reload();
        history.push('/diary/teacher');
      } else {
        setAlert('error', response.data.message);
      }
    } catch (error) {
      setAlert('error', error.message);
    }
  };

  const handleEdited = () => {
    console.log(editData);
    axiosInstance
      .put(
        `${endpoints.dailyDairy.updateDelete}${editData.id}/update-delete-dairy/`,
        filePath && filePath.length > 0
          ? {
              academic_year: editData.academic_year.id,
              branch: editData.branch.id,
              grade: editData.grade.id,
              section: [editData.section[0].id],
              subject: editData.subject.id,
              chapter: editData.chapter.id,
              documents: filePath,
              teacher_report: {
                previous_class:
                  recap && recap.length > 0 ? recap : editData.teacher_report.recap,
                summary:
                  summary && summary.length > 0
                    ? summary
                    : editData.teacher_report.summary,
                class_work:
                  detail && detail.length > 0
                    ? detail
                    : editData.teacher_report.class_work,
                tools_used:
                  tools && tools.length > 0 ? tools : editData.teacher_report.tools_used,
                homework:
                  homework && homework.length > 0
                    ? homework
                    : editData.teacher_report.homework,
              },
              dairy_type: 2,
            }
          : {
              academic_year: editData.academic_year.id,
              branch: editData.branch.id,
              grade: editData.grade.id,
              section: [editData.section[0].id],
              subject: editData.subject.id,
              chapter: editData.chapter.id,
              teacher_report: {
                previous_class:
                  recap && recap.length > 0 ? recap : editData.teacher_report.recap,
                summary:
                  summary && summary.length > 0
                    ? summary
                    : editData.teacher_report.summary,
                class_work:
                  detail && detail.length > 0
                    ? detail
                    : editData.teacher_report.class_work,
                tools_used:
                  tools && tools.length > 0 ? tools : editData.teacher_report.tools_used,
                homework:
                  homework && homework.length > 0
                    ? homework
                    : editData.teacher_report.homework,
              },
              dairy_type: 2,
            }
      )
      .then((result) => {
        if (result.data.status_code === 200) {
          setAlert('success', result.data.message);
        } else {
          setAlert('error', 'Something went wrong');
        }
      })
      .catch((error) => {
        setAlert('error', 'Something went wrong');
      });
  };

  const FileRow = (props) => {
    const { file, onClose, index } = props;
    return (
      <div className='file_row_image_new'>
        <div className='file_name_container_new'>
          {file}
          {/* {index + 1} */}
        </div>
        {/* <Divider orientation="vertical"  className='divider_color' flexItem /> */}
        <div>
          <span onClick={onClose}>
            <SvgIcon
              component={() => (
                <img
                  style={
                    isMobile
                      ? {
                          marginLeft: '',
                          width: '20px',
                          height: '20px',
                          // padding: '5px',
                          cursor: 'pointer',
                        }
                      : {
                          width: '20px',
                          height: '20px',
                          // padding: '5px',
                          cursor: 'pointer',
                        }
                  }
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
    // fetchAcademicYears();
    // fetchBranches();
    console.log('branches ', details.branch, details.grade);
    if (details.branch) {
      handleChangeBranch([details.branch]);
      if (details.grade && details.grade.length > 0) {
        handleChangeGrade(details.grade, [details.branch]);
      }
    }
    if (details.subjects && details.subjects.length > 0) {
      axios
        .get(
          `/academic/chapters/?academic_year=${searchAcademicYear}&subject=${subjectIds}`
        )
        .then((result) => {
          if (result.data.status_code === 200) {
            setChapterDropdown(result.data.result);
          } else {
            setAlert('error');
          }
        })
        .catch((error) => {
          setAlert('error');
        });
    }
  }, []);
  const classes = useStyles();

  return (
    <>
      {loading ? <Loading message='Loading...' /> : null}

      <Layout>
        <div className={isMobile ? 'breadCrumbFilterRow' : null}>
          <div style={{ width: '95%', margin: '20px auto' }}>
            <CommonBreadcrumbs
              componentName='Daily Diary'
              childComponentName='Create New'
            />
          </div>
        </div>
        <Grid
          container
          spacing={isMobile ? 3 : 5}
          style={{ width: widerWidth, margin: wider }}
        >
          <Grid item xs={12} sm={3} className={isMobile ? '' : 'filterPadding'}>
            <FormControl fullWidth className={classes.margin} variant='outlined'>
              {/* <Autocomplete
            id='academic_year'
            name='academic_year'
            onChange={(e, value) => {
              formik.setFieldValue('academic_years', value);
            }}
            value={formik.values.academic_year}
            options={academicYears}
            getOptionLabel={(option) => option.session_year || ''}
            renderInput={(params) => (
              <TextField
                {...params}
                variant='outlined'
                label='Academic Year'
                placeholder='Academic Year'
              />
            )}
            size='small'
          /> */}
              <Autocomplete
                size='small'
                style={{ width: '100%' }}
                onChange={handleAcademicYear}
                id='year'
                options={academicYear}
                getOptionLabel={(option) => option?.session_year}
                value={
                  state.isEdit ? editData.academic_year : formik.values.academic_year
                }
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
              <FormHelperText style={{ color: 'red' }}>
                {formik.errors.academic_year ? formik.errors.academic_year : ''}
              </FormHelperText>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={3} className={isMobile ? '' : 'filterPadding'}>
            <Autocomplete
              id='branch'
              name='branch'
              onChange={(e, value) => {
                state.isEdit ? setAlert('error') : formik.setFieldValue('branch', value);
                formik.setFieldValue('grade', []);
                formik.setFieldValue('section', []);
                formik.setFieldValue('subjects', []);
                handleChangeBranch(value ? [value] : null);
              }}
              value={state.isEdit ? editData.branch : formik.values.branch}
              options={branches}
              getOptionLabel={(option) => option?.branch_name || ''}
              renderInput={(params) => (
                <TextField
                  {...params}
                  variant='outlined'
                  label='Branch'
                  placeholder='Branch'
                />
              )}
              size='small'
            />
            <FormHelperText style={{ color: 'red' }}>
              {errors.branches ? errors.branches : ''}
            </FormHelperText>
          </Grid>
          <Grid item xs={12} sm={3} className={isMobile ? '' : 'filterPadding'}>
            <FormControl fullWidth className={classes.margin} variant='outlined'>
              <Autocomplete
                id='grade'
                name='grade'
                onChange={(e, value) => {
                  formik.setFieldValue('grade', value);
                  formik.setFieldValue('section', []);
                  formik.setFieldValue('subjects', []);
                  handleChangeGrade(value || null, [formik.values.branch]);
                }}
                // multiple
                value={state.isEdit ? editData.grade : formik.values.grade}
                options={grades}
                getOptionLabel={(option) => option.grade_name || ''}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    variant='outlined'
                    label='Grade'
                    placeholder='Grade'
                  />
                )}
                getOptionSelected={(option, value) => option.id == value.id}
                size='small'
              />
              <FormHelperText style={{ color: 'red' }}>
                {formik.errors.grade ? formik.errors.grade : ''}
              </FormHelperText>
            </FormControl>
          </Grid>
        </Grid>
        <Grid
          container
          spacing={isMobile ? 3 : 5}
          style={{ width: widerWidth, margin: wider }}
        >
          <Grid item xs={12} sm={3} className={isMobile ? '' : 'filterPadding'}>
            <FormControl fullWidth className={classes.margin} variant='outlined'>
              <Autocomplete
                id='section'
                name='section'
                onChange={(e, value) => handleSection(e, value)}
                value={state.isEdit ? editData.section : formik.values.section}
                options={sections}
                // multiple
                getOptionLabel={(option) => option.section_name || ''}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    variant='outlined'
                    label='Section'
                    placeholder='Section'
                  />
                )}
                getOptionSelected={(option, value) => option.id == value.id}
                size='small'
              />
              <FormHelperText style={{ color: 'red' }}>
                {formik.errors.section ? formik.errors.section : ''}
              </FormHelperText>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={3} className={isMobile ? '' : 'filterPadding'}>
            <FormControl
              color='secondary'
              fullWidth
              className={classes.margin}
              variant='outlined'
            >
              {console.log(editData.subject, 'editData.subject')}
              <Autocomplete
                // {...state.isEdit ? {}:{multiple:true}}

                style={{ width: '100%' }}
                size='small'
                onChange={handleSubject}
                id='subj'
                // className='dropdownIcon'
                value={state.isEdit ? editData.subject : formik.values.subjects}
                options={subjectDropdown}
                getOptionLabel={(option) => option?.subject_name}
                filterSelectedOptions
                renderInput={(params) => (
                  <TextField
                    {...params}
                    variant='outlined'
                    label='Subject'
                    placeholder='Subject'
                  />
                )}
              />
              <FormHelperText style={{ color: 'red' }}>
                {formik.errors.subjects ? formik.errors.subjects : ''}
              </FormHelperText>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={3} className={isMobile ? '' : 'filterPadding'}>
            <FormControl fullWidth className={classes.margin} variant='outlined'>
              <Autocomplete
                id='chapters'
                style={{ width: '100%' }}
                size='small'
                onChange={(e, value) => {
                  formik.setFieldValue('chapters', value);
                }}
                value={state.isEdit ? editData.chapter : formik.values.chapters}
                options={chapterDropdown}
                getOptionLabel={(option) => option?.chapter_name}
                filterSelectedOptions
                renderInput={(params) => (
                  <TextField
                    {...params}
                    variant='outlined'
                    label='Chapter'
                    placeholder='Chapter'
                  />
                )}
              />
              <FormHelperText style={{ color: 'red' }}>
                {formik.errors.chapters ? formik.errors.chapters : ''}
              </FormHelperText>
            </FormControl>
          </Grid>
        </Grid>

        {/* <<<<<<<<<< EDITOR PART  >>>>>>>>>> */}
        <div>
          <div className='descriptionBorder'>
            <Grid
              container
              spacing={isMobile ? 3 : 5}
              style={{ width: widerWidth, margin: wider }}
            >
              <Grid item xs={12} sm={4} className={isMobile ? '' : 'filterPadding'}>
                <TextField
                  id='outlined-multiline-static'
                  label='Recap of previous class'
                  multiline
                  rows='3'
                  color='secondary'
                  style={{ width: '100%', marginTop: '1.25rem' }}
                  // defaultValue="Default Value"
                  defaultValue={
                    state.isEdit ? editData.teacher_report.previous_class : []
                  }
                  variant='outlined'
                  onChange={(e) => setRecap(e.target.value)}
                />
              </Grid>
              <Grid item xs={12} sm={4} className={isMobile ? '' : 'filterPadding'}>
                <TextField
                  id='outlined-multiline-static'
                  label='Details of classwork'
                  multiline
                  rows='3'
                  color='secondary'
                  style={{ width: '100%', marginTop: '1.25rem' }}
                  // defaultValue="Default Value"
                  defaultValue={state.isEdit ? editData.teacher_report.class_work : []}
                  variant='outlined'
                  onChange={(e) => setDetails(e.target.value)}
                />
              </Grid>
              <Grid item xs={12} sm={4} className={isMobile ? '' : 'filterPadding'}>
                <TextField
                  id='outlined-multiline-static'
                  label='Summary'
                  multiline
                  rows='3'
                  color='secondary'
                  style={{ width: '100%', marginTop: '1.25rem' }}
                  // defaultValue="Default Value"
                  defaultValue={state.isEdit ? editData.teacher_report.summary : []}
                  variant='outlined'
                  onChange={(e) => setSummary(e.target.value)}
                />
              </Grid>
            </Grid>
            <Grid
              container
              spacing={isMobile ? 3 : 5}
              style={{ width: widerWidth, margin: wider }}
            >
              <Grid item xs={12} sm={4} className={isMobile ? '' : 'filterPadding'}>
                <TextField
                  id='outlined-multiline-static'
                  label='Tools Used'
                  multiline
                  rows='3'
                  color='secondary'
                  style={{ width: '100%', marginTop: '1.25rem' }}
                  // defaultValue="Default Value"
                  defaultValue={state.isEdit ? editData.teacher_report.tools_used : []}
                  variant='outlined'
                  onChange={(e) => setTools(e.target.value)}
                />
              </Grid>
              <Grid item xs={12} sm={4} className={isMobile ? '' : 'filterPadding'}>
                <TextField
                  id='outlined-multiline-static'
                  label='Homework'
                  multiline
                  rows='3'
                  color='secondary'
                  style={{ width: '100%', marginTop: '1.25rem' }}
                  // defaultValue="Default Value"
                  defaultValue={state.isEdit ? editData.teacher_report.homework : []}
                  variant='outlined'
                  onChange={(e) => setHomework(e.target.value)}
                />
              </Grid>

              <Grid item xs={12} sm={4} className={isMobile ? '' : 'filterPadding'}>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                  {state.isEdit
                    ? editData.documents.map((file, i) => (
                        <FileRow
                        key={`homework_student_question_attachment_${i}`}
                        file={file}
                        index={i}
                        onClose={() => removeFileHandler(i)}
                      />
                      ))
                    : filePath?.length > 0
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
                <div style={isMobile ? { marginTop: '1%' } : { marginTop: '10%' }}>
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
                      accept='image/*, .pdf'
                      onChange={handleImageChange}
                      // defaultValue={state.isEdit?editData.documents : []}
                      // value={state.isEdit?editData.documents : []}
                    />
                    Add Document
                  </Button>
                  <br />
                  <small
                    style={{
                      color: '#014b7e',
                      fontSize: '16px',
                      marginLeft: '28px',
                      marginTop: '8px',
                    }}
                  >
                    {' '}
                    Accepted files: [jpeg,jpg,png,pdf]
                  </small>
                </div>
              </Grid>
            </Grid>
          </div>
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
            <Button
              // style={isMobile ? { marginLeft: '' } : { marginLeft: '60%' }}
              onClick={() => history.goBack()}
              className='submit_button'
            >
              BACK
            </Button>
            <Button
              // style={isMobile ? { marginLeft: '' } : { marginLeft: '80%' }}
              onClick={state.isEdit ? handleEdited : handleSubmit}
              className='submit_button'
            >
              SUBMIT
            </Button>
          </div>
        </div>
      </Layout>
    </>
  );
};

export default CreateDailyDairy;
