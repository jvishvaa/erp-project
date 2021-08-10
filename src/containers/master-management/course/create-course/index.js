import React, { useContext, useEffect, useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import Loading from '../../../../components/loader/loader';
import CommonBreadcrumbs from '../../../../components/common-breadcrumbs/breadcrumbs';
import { AlertNotificationContext } from '../../../../context-api/alert-context/alert-state';
import Layout from '../../../Layout';
import AddOutlinedIcon from '@material-ui/icons/AddOutlined';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import { Grid, TextField, Button, useTheme, SvgIcon } from '@material-ui/core';
import Divider from '@material-ui/core/Divider';
import Autocomplete from '@material-ui/lab/Autocomplete';
import endpoints from '../../../../config/endpoints';
import axiosInstance from '../../../../config/axios';
import CourseCard from '../course-card';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import './style.css';
import deleteIcon from '../../../../assets/images/delete.svg';
import attachmenticon from '../../../../assets/images/attachmenticon.svg';
import { Context } from '../view-course/context/ViewStore';
import { filter } from 'lodash';
import LinearProgressBar from '../../../../components/progress-bar';

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    margin: '0 auto',
    boxShadow: 'none',
  },
}));

const CreateCourse = () => {
  const classes = useStyles();
  const history = useHistory();
  const aolHostURL = window.location.host;
  const { setAlert } = useContext(AlertNotificationContext);
  const [loading, setLoading] = useState(false);
  const themeContext = useTheme();
  const isMobile = useMediaQuery(themeContext.breakpoints.down('sm'));
  const wider = isMobile ? '-10px 0px' : '-10px 0px 20px 8px';
  const widerWidth = isMobile ? '98%' : '95%';
  const { courseKey, gradeKey } = useParams();
  const [branchDropdown, setBranchDropdown] = useState([]);
  const [gradeDropdown, setGradeDropdown] = useState([]);
  const [categoryDropdown, setCategoryDropdown] = useState([]);
  const [subjectDropdown, setSubjectDropdown] = useState([]);
  const [age, setAge] = useState([]);
  const [noOfPeriods, setNoPeriods] = useState('');
  const [title, setTitle] = useState('');
  const [editData, setEditData] = useState({});
  const [editFlag, setEditFlag] = useState(false);
  const [coursePre, setCoursePre] = useState('');
  const [learn, setLearn] = useState('');
  const [overview, setOverview] = useState('');
  const [filePath, setFilePath] = useState([]);
  const [nextToggle, setNextToggle] = useState(false);
  const [thumbnailImage, setThumbnailImage] = useState('');
  const [data, setData] = useState([]);
  const branchDrop = [{ branch_name: 'AOL' }];
  const [filterData, setFilterData] = useState({
    branch: '',
    grade: '',
    courseLevel: '',
    category: '',
    age: '',
    subject: '',
  });

  const [courseLevelDrop, setCourseLevelDrop] = useState([
    { value: 'Beginner', level: 'Low' },
    { value: 'Intermediate', level: 'Mid' },
    { value: 'Advance', level: 'High' },
  ]);
  const [progress, setProgress] = React.useState(10);
  const [isLodding, setIsLodding] = React.useState(0);

  const NavData = JSON.parse(localStorage.getItem('navigationData')) || {};
  const [moduleId, setModuleId] = useState('');

  useEffect(() => {
    if (NavData && NavData.length) {
      NavData.forEach((item) => {
        if (
          item.parent_modules === 'Master Management' &&
          item.child_module &&
          item.child_module.length > 0
        ) {
          item.child_module.forEach((item) => {
            if (item.child_name === 'Course') {
              setModuleId(item.child_id);
            }
          });
        }
      });
    }
  }, []);

  const handleCourseLevel = (event, value) => {
    setFilterData({ ...filterData, courseLevel: '' });
    if (value) {
      setFilterData({ ...filterData, courseLevel: value });
    }
  };

  const handleBranch = (event, value) => {
    setFilterData({ ...filterData, branch: '' });
    if (value) {
      setFilterData({
        ...filterData,
        branch: value,
      });
    }
  };

  const handleAddPeriod = () => {
    const list = [...data];
    setNoPeriods((prev) => Number(prev) + 1);
    list.push({ title: '', description: '', files: [] });
    setData(list);
  };

  const goBackHandler = () => {
    const isCreate = Number(sessionStorage.getItem('createCourse')) || '';
    const isPeriod = Number(sessionStorage.getItem('periodDetails')) || '';
    if (window.location.host === endpoints.aolConfirmURL) {
      const isAolValue = Number(sessionStorage.getItem('isAol')) || '';
      if (isAolValue === 1) {
        history.push(`/online-class/view-class`);
      } else if (isAolValue === 2) {
        history.push('/online-class/attend-class');
      } else if (isAolValue === 3) {
        history.push('/online-class/teacher-view-class');
      } else {
        const gKey = Number(sessionStorage.getItem('gradeKey')) || '';
        if (isCreate !== 1 || isPeriod === 1) {
          history.push(`/course-list/${gKey}`);
        }
        sessionStorage.removeItem('gradeKey');
      }
    } else {
      const isErpValue = Number(sessionStorage.getItem('isErpClass')) || '';
      if (isErpValue === 1) {
        history.push(`/erp-online-class`);
      } else if (isErpValue === 2) {
        history.push('/erp-online-class-student-view');
      } else if (isErpValue === 3) {
        history.push('/erp-online-class-teacher-view');
      } else {
        const gKey = Number(sessionStorage.getItem('gradeKey')) || '';
        if (isCreate !== 1 || isPeriod === 1) {
          history.push(`/course-list/${gKey}`);
        }
        sessionStorage.removeItem('gradeKey');
      }
    }
  };

  const handleBack = () => {
    const isNext = Number(sessionStorage.getItem('nextFlag')) || '';
    if (isNext !== 1) {
      if (Number(gradeKey)) {
        goBackHandler();
      } else {
        const isCreate = Number(sessionStorage.getItem('createCourse')) || '';
        const periodView = Number(sessionStorage.getItem('periodDetails')) || '';
        const isGrade = Number(sessionStorage.getItem('gradeKey')) || '';
        if (isCreate === 1 || periodView === 1 || Number(isGrade) > 0)
          setNextToggle((prev) => !prev);
      }
    } else {
      setNextToggle((prev) => !prev);
      sessionStorage.removeItem('nextFlag');
    }
  };

  const handleBackToCourseList = () => {
    history.push(`/course-list/`);
  };

  useEffect(() => {
    if (Number(courseKey)) {
      axiosInstance
        .get(`${endpoints.onlineCourses.fetchCourseDetails}?course_id=${courseKey}`)
        .then((result) => {
          if (result.data?.result?.length > 0) {
            if (result.data?.status_code === 200) {
              handleCategory();
              handleGrade();
              setEditFlag(true);
              const {
                course_period,
                no_of_periods,
                learn: learn_text,
                pre_requirement,
                overview: overview_text,
                course_name,
                files: doc_file,
                thumbnail: thumbnail_file,
                level: level_name,
                tags: {
                  age: age_data,
                  category: category_data,
                  grade: grade_data,
                  subjects: subject_data,
                },
              } = result.data?.result[0]?.course_id;
              setData(course_period.reverse());
              setNoPeriods(no_of_periods);
              setLearn(learn_text);
              setCoursePre(pre_requirement);
              setOverview(overview_text);
              setTitle(course_name);
              setFilePath(doc_file);
              setThumbnailImage(thumbnail_file[0]);

              if (Number(gradeKey)) setNextToggle((prev) => !prev);
              else {
                if (window.location.host === endpoints.aolConfirmURL) {
                  const isAolValue = Number(sessionStorage.getItem('isAol')) || '';
                  if (isAolValue === 1) {
                    history.push(`/online-class/view-class`);
                  } else if (isAolValue === 2) {
                    history.push('/online-class/attend-class');
                  } else if (isAolValue === 3) {
                    history.push('/online-class/teacher-view-class');
                  }
                } else {
                  const isErpValue = Number(sessionStorage.getItem('isErpClass')) || '';
                  if (isErpValue === 1) {
                    history.push(`/online-class/view-class`);
                  } else if (isErpValue === 2) {
                    history.push('/erp-online-class-student-view');
                  } else if (isErpValue === 3) {
                    history.push('/erp-online-class-teacher-view');
                  }
                }
              }
              setFilterData({
                branch: { branch_name: 'AOL' },
                courseLevel: courseLevelDrop?.find((obj) => obj?.level === level_name),
                category: category_data,
                age: age_data,
                subject: {
                  id: subject_data?.id,
                  subjectName: subject_data?.subject_name,
                },
                grade: {
                  id: grade_data?.id,
                  gradeId: grade_data?.grade_id,
                  gradeName: grade_data?.grade_name,
                },
              });
            } else {
              setEditFlag(false);
            }
          } else {
            setEditFlag(false);
            goBackHandler();
          }
        })
        .catch((error) => {
          setEditFlag(false);
        });
    } else {
      goBackHandler();
    }
  }, [courseKey]);

  const handleNext = () => {
    // const dataObj = {
    //   subjectId,
    // }
    // const { subject:{ id: sujectId }} = filterData || {}
    // const isValid = !([
    //   sujectId,
    //   aolHostURL ?      title:true,
    // ].map(Boolean).includes(false))

    // if(isValid)

    if (aolHostURL === endpoints.aolConfirmURL) {
      if (
        filePath?.length === 1 &&
        Boolean(thumbnailImage) &&
        Boolean(title) &&
        noOfPeriods > 0 &&
        Boolean(filterData.subject.id) &&
        Boolean(filterData.grade.gradeId) &&
        Boolean(filterData.courseLevel.level) &&
        Boolean(filterData.category.id) &&
        Boolean(filterData.branch?.branch_name) &&
        Boolean(filterData.age.id) &&
        Boolean(filterData.subject.id)
      ) {
        if (noOfPeriods > 0) {
          if (data.length === 0) {
            const list = [...data];
            for (let i = 0; i < noOfPeriods; i++) {
              list.push({ title: '', description: '', files: [] });
            }
            setData(list);
          }
          sessionStorage.setItem('nextFlag', 1);
          setNextToggle((prev) => !prev);
        } else {
          setAlert('warning', 'Periods should be more than or equal to 1');
        }
      } else {
        if (!Boolean(thumbnailImage))
          setAlert('warning', 'Thumbnail Image is compulsory!');
        if (filePath?.length !== 1) setAlert('warning', 'Document is compulsory!');
        if (!Boolean(title)) setAlert('warning', 'Title is compulsory!');
        if (noOfPeriods <= 0)
          setAlert('warning', 'No. of periods should be more than 0!');
        if (!Boolean(filterData.subject.id))
          setAlert('warning', 'Subject is compulsory!');
        if (!Boolean(filterData.age.id)) setAlert('warning', 'Age is compulsory!');
        if (!Boolean(filterData.grade.gradeId))
          setAlert('warning', 'Grade is compulsory!');
        if (!Boolean(filterData.category.id))
          setAlert('warning', 'Category is compulsory!');
        if (!Boolean(filterData.branch.branch_name))
          setAlert('warning', 'Branch is compulsory!');
        if (!Boolean(filterData.courseLevel.level))
          setAlert('warning', 'Level is compulsory!');
      }
    } else {
      if (
        filePath?.length === 1 &&
        Boolean(thumbnailImage) &&
        Boolean(title) &&
        noOfPeriods > 0 &&
        Boolean(filterData.grade.gradeId) &&
        Boolean(filterData.courseLevel.level)
      ) {
        if (noOfPeriods > 0) {
          if (data.length === 0) {
            const list = [...data];
            for (let i = 0; i < noOfPeriods; i++) {
              list.push({ title: '', description: '', files: [] });
            }
            setData(list);
          }
          setNextToggle((prev) => !prev);
        } else {
          setAlert('warning', 'Periods should be more than or equal to 1');
        }
      } else {
        if (!Boolean(thumbnailImage))
          setAlert('warning', 'Thumbnail Image is compulsory!');
        if (filePath?.length !== 1) setAlert('warning', 'Document is compulsory!');
        if (!Boolean(title)) setAlert('warning', 'Title is compulsory!');
        if (noOfPeriods <= 0)
          setAlert('warning', 'No. of periods should be more than 0!');
        if (!Boolean(filterData.grade.gradeId))
          setAlert('warning', 'Grade is compulsory!');
        if (!Boolean(filterData.courseLevel.level))
          setAlert('warning', 'Level is compulsory!');
      }
    }
  };

  const handleNoOfPeriods = (event) => {
    let val = event.target.value;
    if (val <= 100) setNoPeriods(val);
    else setAlert('warning', "No. of periods can't be more than 100");
  };

  const handleCategory = (event, value) => {
    setFilterData({ ...filterData, category: '', grade: '', subject: '' });
    setGradeDropdown([]);
    setSubjectDropdown([]);
    setAge([]);
    if (value) {
      setFilterData({ ...filterData, category: value, grade: '', subject: '' });
      axiosInstance
        .get(`${endpoints.onlineCourses.categoryList}?tag_type=2&parent_id=${value.id}`)
        .then((result) => {
          if (result.data?.status_code === 201) {
            const list1 = [];
            const list2 = [];
            const resp = result.data?.result;
            resp.forEach((obj) => {
              if (obj?.tag_type === '1') {
                list1.push({
                  id: obj?.id,
                  subjectName: obj?.subject__subject_name,
                });
              } else {
                list2.push({
                  id: obj.id,
                  gradeName: obj?.grade__grade_name,
                  gradeId: obj?.grade_id,
                });
              }
            });
            setSubjectDropdown(list1);
            setGradeDropdown(list2);
          }
        });
    }
  };

  const handleSubject = (event, value) => {
    setFilterData({ ...filterData, subject: value });
    if (value) {
      setFilterData({ ...filterData, subject: value });
    }
  };

  const handleAge = (event, value) => {
    setFilterData({ ...filterData, age: '' });
    if (value) {
      setFilterData({ ...filterData, age: value });
    }
  };

  useEffect(() => {
    if (aolHostURL !== endpoints.aolConfirmURL && moduleId) {
      setGradeDropdown([]);
      let url = `${endpoints.masterManagement.grades}`;
      if (aolHostURL === endpoints.aolConfirmURL) url += `?branch_id=1`;
      else url += `?branch_id=1`;
      axiosInstance
        .get(url)
        .then((result) => {
          if (result.data.status_code === 200) {
            const list = [];
            result.data.result.results.forEach((obj) => {
              list.push({
                id: obj.id || '',
                gradeName: obj?.grade_name || '',
                // gradeId: obj?.grade_id||'',
                gradeId: obj?.id || '',
              });
            });
            setGradeDropdown(list);
          }
        })
        .catch((error) => {
          setGradeDropdown([]);
          setAlert('error', error.message);
        });
    }
  }, [moduleId]);

  const handleGrade = (event, value) => {
    setFilterData({ ...filterData, grade: '' });
    if (value) {
      setFilterData({
        ...filterData,
        grade: value,
      });
      axiosInstance
        .get(`${endpoints.onlineCourses.categoryList}?tag_type=3&parent_id=${value.id}`)
        .then((result) => {
          if (result.data.status_code === 201) {
            setAge(result.data.result);
          } else {
            setAlert('error', result.data.message);
          }
        })
        .catch((error) => {
          setAlert('error', error.description);
        });
    } else {
      setAge([]);
    }
  };

  const removeFileHandler = (i, fileType) => {
    if (fileType === 'thumbnail') {
      setThumbnailImage('');
      setIsLodding(0);
    } else if (fileType === 'doc') {
      setIsLodding(0);
      filePath.splice(i, 1);
    }
    setAlert('success', 'File deleted successfully');
  };

  const handleImageChange = (event) => {
    setIsLodding(1);
    if (filePath.length < 10) {
      const data = event.target.files[0];
      const fd = new FormData();
      fd.append('file', event.target.files[0]);
      axiosInstance.post(`${endpoints.onlineCourses.fileUpload}`, fd).then((result) => {
        if (result.data.status_code === 200) {
          const fileList = [...filePath];
          fileList.push(result.data?.result?.get_file_path);
          setFilePath(fileList);

          const timer = setInterval(() => {
            setProgress((prevProgress) =>
              prevProgress >= 100 ? 100 : prevProgress + 10
            );
          }, 700);
          setAlert('success', result.data.message);
          return () => {
            setIsLodding(0);
            clearInterval(timer);
          };
        } else {
          setAlert('error', result.data?.message);
        }
      });
    } else {
      setAlert('warning', 'Limit Exceeded for file upload!');
    }
  };

  const handleThumbnail = (event) => {
    setIsLodding(2);
    const fd = new FormData();
    fd.append('file', event.target.files[0]);
    const fileName = event.target.files[0]?.name;
    if (
      fileName.indexOf('.jpg') > 0 ||
      fileName.indexOf('.jpeg') > 0 ||
      fileName.indexOf('.png') > 0
    ) {
      axiosInstance.post(`${endpoints.onlineCourses.fileUpload}`, fd).then((result) => {
        if (result.data.status_code === 200) {
          setThumbnailImage(result.data?.result?.get_file_path);
          //setAlert('success', result.data.message);
          //setProgress(100);
          const timer = setInterval(() => {
            setProgress((prevProgress) =>
              prevProgress >= 100 ? 100 : prevProgress + 10
            );
          }, 700);
          setAlert('success', result.data.message);
          return () => {
            setIsLodding(0);
            //setAlert('success', result.data.message);
            clearInterval(timer);
          };
        } else {
          setAlert('error', result.data.message);
          setIsLodding(0);
        }
      });
    } else {
      setAlert('error', 'Only .jpg, .jpeg & .png files are acceptable!');
    }
  };

  const handleSubmit = () => {
    const isAol = aolHostURL === endpoints.aolConfirmURL;
    axiosInstance
      .post(`${endpoints.onlineCourses.createCourse}`, {
        course_name: title,
        pre_requirement: coursePre,
        overview: overview,
        learn: learn,
        grade: [filterData.grade.gradeId],
        level: filterData.courseLevel.level,
        no_of_periods: parseInt(data?.length),
        files: filePath,
        thumbnail: [thumbnailImage],
        period_data: data,
        tag_id: isAol ? `${filterData.age.id},${filterData.subject.id}` : '',
      })
      .then((result) => {
        if (result.data.status_code === 200) {
          setFilePath([]);
          setThumbnailImage('');
          setData([]);
          setNoPeriods('');
          setTitle('');
          setCoursePre('');
          setOverview('');
          setLearn('');
          setEditData();
          setEditFlag(false);
          setFilterData({
            branch: '',
            grade: '',
            courseLevel: '',
            category: '',
            age: '',
            subject: '',
          });
          setAlert('success', result.data.message);
          setNextToggle(false);
          history.push(`/course-list`);
        } else {
          setAlert('error', result.data.message);
          setGradeDropdown([]);
        }
      })
      .catch((error) => {
        setAlert(
          'error',
          error.response?.data?.message ||
            error.response?.data?.msg ||
            error.response?.data?.description
        );
        setGradeDropdown([]);
      });
  };

  const handleEdit = () => {
    const isAol = aolHostURL === endpoints.aolConfirmURL;
    axiosInstance
      .put(`${endpoints.onlineCourses.updateCourse}${courseKey}/update-course/`, {
        course_name: title,
        pre_requirement: coursePre,
        overview: overview,
        learn: learn,
        grade: [filterData.grade.gradeId],
        level: filterData.courseLevel.level,
        no_of_periods: parseInt(data?.length),
        files: filePath,
        thumbnail: [thumbnailImage],
        period_data: data,
        tag_id: isAol ? `${filterData.age.id},${filterData.subject.id}` : '',
      })
      .then((result) => {
        if (result.data.status_code === 200) {
          setFilePath([]);
          setThumbnailImage('');
          setData([]);
          setNoPeriods('');
          setTitle('');
          setCoursePre('');
          setOverview('');
          setLearn('');
          setEditData();
          setEditFlag(false);
          setFilterData({
            branch: '',
            grade: '',
            courseLevel: '',
            category: '',
            age: '',
            subject: '',
          });
          setAlert('success', result.data.message);
          setNextToggle((prev) => !prev);
          history.push(`/course-list/${sessionStorage.getItem('gradeKey')}`);
          sessionStorage.removeItem('gradeKey');
        }
      });
  };

  const FileRow = (props) => {
    const { name, file, onClose, index } = props;
    return (
      <div className='file_row_image_course'>
        <div className='file_name_container_course'>{name}</div>
        <Divider orientation='vertical' className='divider_color' flexItem />
        <div className='file_close_course'>
          <span onClick={onClose}>
            <SvgIcon
              component={() => (
                <img
                  style={{
                    width: '15px',
                    height: '15px',
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

  useEffect(() => {
    if (aolHostURL === endpoints.aolConfirmURL) {
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
          setBranchDropdown([]);
          setAlert('error', error.message);
        });

      axiosInstance
        .get(`${endpoints.onlineCourses.categoryList}?tag_type=1`)
        .then((result) => {
          if (result.data.status_code === 201) {
            setCategoryDropdown(result.data.result);
          } else {
            setAlert('error', result.data.message);
          }
        })
        .catch((error) => {
          setCategoryDropdown([]);
          setAlert('error', error.message);
        });
    }
  }, []);

  useEffect(() => {
    if (data?.length < 1) setNextToggle(false);
  }, [data?.length]);

  return (
    <>
      {loading ? <Loading message='Loading...' /> : null}
      <Layout>
        <CommonBreadcrumbs
          componentName={
            history.location?.state?.isOnline ? 'Online Class' : 'Master Management'
          }
          childComponentName={
            Boolean(gradeKey)
              ? 'Period Details'
              : Boolean(courseKey)
              ? 'Edit Course'
              : 'Create Course'
          }
          childComponentNameNext={!Boolean(gradeKey) && nextToggle && 'Periods'}
        />
        {!nextToggle ? (
          !gradeKey && (
            <Grid
              container
              spacing={isMobile ? 3 : 5}
              style={{ width: widerWidth, margin: wider }}
            >
              <Grid item xs={12} sm={3} className={isMobile ? '' : 'filterPadding'}>
                <Autocomplete
                  style={{ width: '100%' }}
                  size='small'
                  onChange={handleCourseLevel}
                  id='academic-year'
                  className='dropdownIcon'
                  value={filterData?.courseLevel || ''}
                  options={courseLevelDrop || []}
                  getOptionLabel={(option) => option?.value || ''}
                  filterSelectedOptions
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      variant='outlined'
                      label='Course Level'
                      placeholder='Course Level'
                    />
                  )}
                />
              </Grid>
              {aolHostURL === endpoints.aolConfirmURL && (
                <Grid item xs={12} sm={3} className={isMobile ? '' : 'filterPadding'}>
                  <Autocomplete
                    style={{ width: '100%' }}
                    size='small'
                    onChange={handleBranch}
                    id='grade'
                    className='dropdownIcon'
                    value={filterData?.branch || ''}
                    options={branchDrop || []}
                    getOptionLabel={(option) => option?.branch_name || ''}
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
              )}
              {aolHostURL === endpoints.aolConfirmURL && (
                <Grid item xs={12} sm={3} className={isMobile ? '' : 'filterPadding'}>
                  <Autocomplete
                    style={{ width: '100%' }}
                    size='small'
                    onChange={handleCategory}
                    id='volume'
                    className='dropdownIcon'
                    value={filterData?.category || ''}
                    options={categoryDropdown || []}
                    getOptionLabel={(option) => option?.tag_name || ''}
                    filterSelectedOptions
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        variant='outlined'
                        label='Category'
                        placeholder='Category'
                      />
                    )}
                  />
                </Grid>
              )}
              <Grid item xs={12} sm={3} className={isMobile ? '' : 'filterPadding'}>
                <Autocomplete
                  style={{ width: '100%' }}
                  size='small'
                  onChange={handleGrade}
                  id='volume'
                  className='dropdownIcon'
                  value={filterData?.grade || ''}
                  options={gradeDropdown || []}
                  getOptionLabel={(option) => option?.gradeName || ''}
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
              {aolHostURL === endpoints.aolConfirmURL && (
                <Grid item xs={12} sm={3} className={isMobile ? '' : 'filterPadding'}>
                  <Autocomplete
                    style={{ width: '100%' }}
                    size='small'
                    onChange={handleAge}
                    id='volume'
                    className='dropdownIcon'
                    value={filterData?.age || ''}
                    options={age || []}
                    getOptionLabel={(option) => option?.tag_name || ''}
                    filterSelectedOptions
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        variant='outlined'
                        label='Age'
                        placeholder='Age'
                      />
                    )}
                  />
                </Grid>
              )}
              {aolHostURL === endpoints.aolConfirmURL && (
                <Grid item xs={12} sm={3} className={isMobile ? '' : 'filterPadding'}>
                  <Autocomplete
                    style={{ width: '100%' }}
                    size='small'
                    onChange={handleSubject}
                    id='volume'
                    className='dropdownIcon'
                    value={filterData?.subject || ''}
                    options={subjectDropdown || []}
                    getOptionLabel={(option) => option?.subjectName || ''}
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
                </Grid>
              )}
              <Grid item xs={12} sm={3} className={isMobile ? '' : 'filterPadding'}>
                <TextField
                  id='noofperiods'
                  type='number'
                  className='dropdownIcon'
                  style={{ width: '100%' }}
                  label='No. Of Periods'
                  placeholder='No. Of Periods'
                  variant='outlined'
                  size='small'
                  value={noOfPeriods}
                  inputProps={{
                    min: 0,
                    max: 100,
                    maxLength: 3,
                    readOnly: data.length > 0,
                  }}
                  name='noofperiods'
                  onChange={(e) => handleNoOfPeriods(e)}
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <Divider />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  className='multiRowTextfield'
                  id='outlined-multiline-static1'
                  label='Course Title'
                  placeholder='Course Title'
                  multiline
                  rows='1'
                  style={{ width: '100%' }}
                  value={title}
                  variant='outlined'
                  onChange={(e) => setTitle(e.target.value)}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  className='multiRowTextfield'
                  id='outlined-multiline-static2'
                  label='Course Prerequisites'
                  placeholder='Course Prerequisites'
                  multiline
                  rows='6'
                  style={{ width: '100%' }}
                  value={coursePre}
                  variant='outlined'
                  onChange={(e) => setCoursePre(e.target.value)}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  className='multiRowTextfield'
                  id='outlined-multiline-static3'
                  label='What Will You Learn From This Course'
                  placeholder='What Will You Learn From This Course'
                  multiline
                  rows='6'
                  style={{ width: '100%' }}
                  value={learn}
                  variant='outlined'
                  onChange={(e) => setLearn(e.target.value)}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  className='multiRowTextfield'
                  id='outlined-multiline-static4'
                  label='Course Overview'
                  placeholder='Course Overview'
                  multiline
                  rows='6'
                  style={{ width: '100%' }}
                  value={overview}
                  variant='outlined'
                  onChange={(e) => setOverview(e.target.value)}
                />
              </Grid>

              <div className='attachmentContainer'>
                <div style={{ display: 'flex' }}>
                  {filePath?.length > 0
                    ? filePath?.map((file, i) => (
                        <FileRow
                          name='File'
                          key={`homework_student_question_attachment_${i}`}
                          file={file}
                          index={i}
                          onClose={() => removeFileHandler(i, 'doc')}
                        />
                      ))
                    : null}
                </div>

                {filePath?.length < 1 && (
                  <div className='attachmentButtonContainer'>
                    <div>
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
                        className='attachment_button_doc'
                        title='Attach Supporting File'
                        variant='contained'
                        size='small'
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
                    {isLodding === 1 && (
                      <div style={{ width: '200px', margin: '10px' }}>
                        <LinearProgressBar value={progress} color='secondary' />
                      </div>
                    )}
                  </div>
                )}

                {thumbnailImage !== '' && (
                  <FileRow
                    name='Thumbnail'
                    key='Thumbnail'
                    file={thumbnailImage}
                    onClose={() => removeFileHandler(0, 'thumbnail')}
                  />
                )}

                {thumbnailImage === '' && (
                  <div className='attachmentButtonContainer'>
                    <div>
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
                        className='attachment_button_doc'
                        title='Attach Supporting File'
                        variant='contained'
                        size='small'
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
                          onChange={handleThumbnail}
                        />
                        Add Thumbnail
                      </Button>
                    </div>
                    {isLodding === 2 && (
                      <div style={{ width: '200px', margin: '10px' }}>
                        <LinearProgressBar value={progress} color='secondary' />
                      </div>
                    )}
                  </div>
                )}
              </div>

              <Grid item xs={12} sm={12}>
                <Divider />
              </Grid>
              <Grid item xs={4} sm={12} className={isMobile ? '' : 'filterPadding'}>
                <Button
                  onClick={handleBackToCourseList}
                  variant='contained'
                  className='cancelButton labelColor'
                  style={{ width: '15%' }}
                >
                  Back
                </Button>
                <Button
                  onClick={handleNext}
                  variant='contained'
                  color='primary'
                  style={{ float: 'right', width: '15%', color: 'white' }}
                >
                  NEXT
                </Button>
              </Grid>
            </Grid>
          )
        ) : (
          <>
            <Paper className={classes.root}>
              <Grid container className='periodCardsContainer' spacing={isMobile ? 3 : 5}>
                {data?.map((_, i) => (
                  <Grid item xs={12} sm={4}>
                    <CourseCard
                      gradeKey={gradeKey}
                      setNoPeriods={setNoPeriods}
                      key={i}
                      index={i}
                      cData={data}
                      setData={setData}
                    />
                  </Grid>
                ))}
                {!gradeKey && (
                  <Grid item xs={12} sm={4}>
                    {data.length < 99 && (
                      <Button onClick={handleAddPeriod} className='periodAddButton'>
                        <AddOutlinedIcon style={{ fontSize: '100px' }} />
                      </Button>
                    )}
                  </Grid>
                )}
              </Grid>
            </Paper>
            <div className='submitContainer'>
              <Grid item xs={12} sm={12}>
                <div className='buttonContainer'>
                  <Button
                    variant='contained'
                    onClick={handleBack}
                    style={{ width: '100%', marginRight: '5%' }}
                    className='cancelButton labelColor'
                  >
                    Back
                  </Button>
                  {!gradeKey && (
                    <Button
                      variant='contained'
                      color='primary'
                      size='medium'
                      style={{ color: 'white', width: '100%' }}
                      onClick={editFlag ? handleEdit : handleSubmit}
                    >
                      Submit
                    </Button>
                  )}
                </div>
              </Grid>
            </div>
          </>
        )}
      </Layout>
    </>
  );
};

export default CreateCourse;
