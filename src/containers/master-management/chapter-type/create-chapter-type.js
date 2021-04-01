import React, { useContext, useState, useEffect } from 'react';
import { Grid, TextField, Button, useTheme, FormHelperText } from '@material-ui/core';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import Autocomplete from '@material-ui/lab/Autocomplete';
import { useFormik } from 'formik';
import axios from 'axios';
import FormControl from '@material-ui/core/FormControl';
import { useStyles } from '../../user-management/useStyles';

import axiosInstance from '../../../config/axios';
import endpoints from '../../../config/endpoints';
import { AlertNotificationContext } from '../../../context-api/alert-context/alert-state';
import { Context } from '../../../containers/daily-dairy/context/context.js';
import validationSchema from '../../user-management/schemas/school-details';

import {
  fetchBranchesForCreateUser,
  fetchGrades,
  fetchSections,
  fetchSubjects as getSubjects,
} from '../../../../src/redux/actions/index';
const CreateChapterType = ({
  setLoading,
  handleGoBack,
  details,
  onSubmit,
  setCentralSubjectName,
}) => {
  const { setAlert } = useContext(AlertNotificationContext);

  const [categoryName, setCategoryName] = useState('');
  const [topicName, setTopicName] = useState('');
  const [searchAcademicYear, setSearchAcademicYear] = useState('');
  const [academicYear, setAcademicYear] = useState([]);
  const [branchDropdown, setBranchDropdown] = useState([]);
  const [overviewSynopsis, setOverviewSynopsis] = useState([]);
  const [gradeDropdown, setGradeDropdown] = useState([]);
  const [sectionDropdown, setSectionDropdown] = useState([]);
  const [subjectIds, setSubjectIds] = useState('');
  const [chapterDropdown, setChapterDropdown] = useState([]);
  const [state, setState] = useContext(Context);
  const { isEdit, editData } = state;
  const [detail, setDetails] = useState('');
  const [branches, setBranches] = useState([]);
  const [grades, setGrades] = useState([]);
  const [sections, setSections] = useState([]);
  const [academicYearDropdown, setAcademicYearDropdown] = useState([]);
  const [centralGsMappingId, setCentralGsMappingId] = useState();
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
            if (item.child_name === 'Chapter Creation') {
              setModuleId(item.child_id);
            }
          });
        }
      });
    }
  }, []);

  const [filterData, setFilterData] = useState({
    branch: [],
    grade: [],
    section: [],
    role: '',
  });

  const [subjectDropdown, setSubjectDropdown] = useState([]);

  const themeContext = useTheme();
  const isMobile = useMediaQuery(themeContext.breakpoints.down('sm'));
  const wider = isMobile ? '-10px 0px' : '-10px 0px 20px 8px';
  const widerWidth = isMobile ? '98%' : '95%';

  // const fetchAcademicYears = () => {
  //   getAcademicYears().then((data) => {
  //     const transformedData = data?.map((obj) => ({
  //       id: obj.id,
  //       session_year: obj.session_year,
  //     }));
  //     setAcademicYears(transformedData);
  //   });
  // };

  useEffect(() => {
    // axiosInstance
    //   .get(`${endpoints.communication.branches}`)
    //   .then((result) => {
    //     if (result.data.status_code === 200) {
    //       setBranchDropdown(result.data.data);
    //     } else {
    //       setAlert('error', result.data.message);
    //     }
    //   })
    //   .catch((error) => {
    //     setAlert('error', error.message);
    //   });

    axiosInstance
      .get(endpoints.userManagement.academicYear)
      .then((result) => {
        if (result.status === 200) {
          setAcademicYear(result.data.data);
        } else {
          setAlert('error', result.data.message);
        }
      })
      .catch((error) => {
        setAlert('error', error.message);
      });

    // axios.get(`${endpoints.lessonPlan.academicYearList}`, {
    //     headers: {
    //         'x-api-key': 'vikash@12345#1231',
    //     }
    // }).then(result => {
    //     if (result.data.status_code === 200) {
    //         setAcademicYearDropdown(result.data.result.results);
    //     } else {
    //         setAlert('error', result.data.message);
    //     }
    // }).catch(error => {
    //     setAlert('error', error.message);
    // })

    axios
      .get(`${endpoints.lessonPlan.volumeList}`, {
        headers: {
          'x-api-key': 'vikash@12345#1231',
        },
      })
      .then((result) => {
        if (result.data.status_code === 200) {
          // setVolumeDropdown(result.data.result.results);
        } else {
          setAlert('error', result.data.message);
        }
      })
      .catch((error) => {
        setAlert('error', error.message);
      });
  }, []);

  useEffect(() => {
    if (moduleId) {
      axiosInstance
        .get(`${endpoints.userManagement.academicYear}?module_id=${moduleId}`)
        .then((result) => {
          if (result.status === 200) {
            setAcademicYear(result.data.data);
          } else {
            setAlert('error', result.data.message);
          }
        })
        .catch((error) => {
          setAlert('error', error.message);
        });
    }
  }, [moduleId]);

  useEffect(() => {
    // axiosInstance
    //   .get(`${endpoints.communication.branches}`)
    //   .then((result) => {
    //     if (result.data.status_code === 200) {
    //       setBranchDropdown(result.data.data);
    //     } else {
    //       setAlert('error', result.data.message);
    //     }
    //   })
    //   .catch((error) => {
    //     setBranchDropdown('error', error.message);
    //   });
    axiosInstance
      .get(endpoints.userManagement.academicYear)
      .then((result) => {
        if (result.status === 200) {
          setAcademicYear(result.data.data);
        } else {
          setAlert('error', result.data.message);
        }
      })
      .catch((error) => {
        setAlert('error', error.message);
      });
  }, []);

  // const handleAcademicYear = (event, value) => {
  //   setFilterData({ year: '', branch: '', grade: '', subject: '', chapter: '' });
  //   if (value) {
  //     setFilterData({
  //       ...filterData,
  //       year: value,
  //       branch: '',
  //       grade: '',
  //       subject: '',
  //       chapter: '',
  //     });
  //   }
  // };
  const handleAcademicYear = (event, value) => {
    setFilterData({ ...filterData, year: '' });
    if (value) {
      setFilterData({ ...filterData, year: value });
      axiosInstance
        .get(
          `${endpoints.academics.branches}?session_year=${value.id}&module_id=${moduleId}`
        )
        .then((result) => {
          if (result.status === 200) {
            setBranchDropdown(result.data.data.results);
          } else {
            setAlert('error', result.data.message);
          }
        })
        .catch((error) => {
          setAlert('error', error.message);
        });
    }
  };

  const fetchBranches = () => {
    fetchBranchesForCreateUser().then((data) => {
      const transformedData = data?.map((obj) => ({
        id: obj.id,
        branch_name: obj.branch_name,
      }));
      setBranches(transformedData);
    });
  };

  const handleChangeBranch = (values) => {
    setGrades([]);
    setSections([]);
    fetchGrades(values).then((data) => {
      const transformedData = data
        ? data.map((grade) => ({
            id: grade.grade_id,
            grade_name: grade.grade__grade_name,
          }))
        : [];
      setGrades(transformedData);
    });
  };

  const fetchChapters = () => {
    debugger;
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
        .get(
          `${endpoints.communication.grades}?session_year=${filterData.year.id}&branch_id=${value.branch.id}&module_id=${moduleId}`
        )
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

  // const handleBranch = (event, value) => {
  //   setFilterData({ ...filterData, branch: '', grade: '', subject: '', chapter: '' });
  //   setOverviewSynopsis([]);
  //   if (value) {
  //     setFilterData({
  //       ...filterData,
  //       branch: value,
  //       grade: '',
  //       subject: '',
  //       chapter: '',
  //     });
  //     axiosInstance
  //       .get(`${endpoints.communication.grades}?branch_id=${value.id}&module_id=8`)
  //       .then((result) => {
  //         if (result.data.status_code === 200) {
  //           setGradeDropdown(result.data.data);
  //         } else {
  //           setAlert('error', result.data.message);
  //           setGradeDropdown([]);
  //           setSubjectDropdown([]);
  //           setChapterDropdown([]);
  //         }
  //       })
  //       .catch((error) => {
  //         setAlert('error', error.message);
  //         setGradeDropdown([]);
  //         setSubjectDropdown([]);
  //         setChapterDropdown([]);
  //       });
  //   } else {
  //     setGradeDropdown([]);
  //     setSubjectDropdown([]);
  //     setChapterDropdown([]);
  //   }
  // };
  const handleGrade = (event, value) => {
    setFilterData({ ...filterData, grade: '', section: '', subject: '' });
    if (value) {
      setFilterData({ ...filterData, grade: value });
      axiosInstance
        .get(
          `${endpoints.lessonReport.subjects}?branch=${filterData.branch.branch.id}&grade=${value.grade_id}&module_id=${moduleId}`
        )
        .then((result) => {
          if (result.data.status_code === 200) {
            setSubjectDropdown(result.data.result);
          } else {
            setAlert('error', result.data.message);
            setSubjectDropdown([]);
          }
        })
        .catch((error) => {
          setAlert('error', error.message);
          setSubjectDropdown([]);
        });

      axiosInstance
        .get(
          `${endpoints.masterManagement.sections}?session_year=${filterData.year.id}&branch_id=${filterData.branch.branch.id}&grade_id=${value.grade_id}&module_id=${moduleId}`
        )
        .then((result) => {
          if (result.data.status_code === 200) {
            // setSubjectDropdown(result.data.result);
            setSectionDropdown(result.data.data);
          } else {
            setAlert('error', result.data.message);
            // setSubjectDropdown([]);
            setSectionDropdown([]);
          }
        })
        .catch((error) => {
          setAlert('error', error.message);
          setSectionDropdown([]);
        });
    } else {
      setSubjectDropdown([]);
      setSectionDropdown([]);
    }
  };
  // const handleGrade = (event, value) => {
  //     setFilterData({ ...filterData, grade: '', subject: '', chapter: '' });
  //     setOverviewSynopsis([]);
  //     if (value && filterData.branch) {
  //         setFilterData({ ...filterData, grade: value, subject: '', chapter: '' });
  //         axiosInstance.get(`${endpoints.lessonPlan.gradeSubjectMappingList}?branch=${filterData.branch.id}&grade=${value.grade_id}`)
  //             .then(result => {
  //                 if (result.data.status_code === 200) {
  //                     setSubjectDropdown(result.data.result);
  //                 }
  //                 else {
  //                     setAlert('error', result.data.message);
  //                     setSubjectDropdown([]);
  //                     setChapterDropdown([]);
  //                 }
  //             })
  //             .catch(error => {
  //                 setAlert('error', error.message);
  //                 setSubjectDropdown([]);
  //                 setChapterDropdown([]);
  //             })
  //             axiosInstance
  //             .get(
  //               `${endpoints.masterManagement.sections}?branch_id=${value.id}&grade_id=${value.grade_id}`
  //             )
  //             .then((result) => {
  //               if (result.data.status_code === 200) {
  //                 // setSubjectDropdown(result.data.result);
  //                 setSectionDropdown(result.data.data);
  //               } else {
  //                 setAlert('error', result.data.message);
  //                 // setSubjectDropdown([]);
  //                 setSectionDropdown([]);
  //               }
  //             })
  //             .catch((error) => {
  //               setAlert('error', error.message);
  //               setSectionDropdown([]);
  //             });
  //     }
  //     else {
  //         setSubjectDropdown([]);
  //         setChapterDropdown([]);
  //     }
  // };
  const handleSubject = (event, value) => {
    setFilterData({ ...filterData, subject: '', chapter: '' });
    setOverviewSynopsis([]);
    if (filterData.grade && filterData.year && value) {
      setFilterData({ ...filterData, subject: value, chapter: '' });
      if (value && filterData.branch && filterData.year && filterData.volume) {
        axiosInstance
          .get(
            `${endpoints.lessonPlan.chapterList}?gs_mapping_id=${value.id}&academic_year=${filterData.year.id}&grade_id=${filterData.grade.grade_id}`
          )
          .then((result) => {
            if (result.data.status_code === 200) {
              setChapterDropdown(result.data.result.chapter_list);
              setCentralGsMappingId(result.data.result?.central_gs_mapping_id);
              setCentralSubjectName(result.data.result?.central_subject_name);
              // setCentralGradeName(result.data.result?.central_grade_name);
            } else {
              setAlert('error', result.data.message);
              setChapterDropdown([]);
            }
          })
          .catch((error) => {
            setAlert('error', error.message);
            setChapterDropdown([]);
          });
      }
    } else {
      setChapterDropdown([]);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    axiosInstance
      .post(endpoints.masterManagement.chapter, {
        academic_year: filterData?.year.id,
        subject: filterData?.subject.subject_id,
        chapter_name: categoryName,
      })
      .then((result) => {
        if (result.data.status_code === 200) {
          setCategoryName('');
          setLoading(false);
          setAlert('success', result.data.message);
        } else if (result.data.status_code === 409) {
          setCategoryName('');
          setLoading(false);
          setAlert('error', result.data.message);
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
  const handleSection = (event, value) => {
    // console.log(value);
    setFilterData({ ...filterData, section: '' });
    if (value) {
      setFilterData({ ...filterData, section: value });
    }
  };

  const classes = useStyles();
  return (
    <form autoComplete='off' onSubmit={handleSubmit}>
      {/* <form autoComplete='off'> */}

      <div style={{ width: '95%', margin: '20px auto' }}>
        <Grid container>
          <Grid
            item
            xs={12}
            sm={4}
            className={isMobile ? 'roundedBox' : 'filterPadding roundedBox'}
          >
            {/* <Autocomplete
                    style={{ width: '100%' }}
                    size='small'
                    onChange={handleAcademicYear}
                    id='academic-year'
                    className="dropdownIcon"
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
                /> */}
            {/* <Autocomplete
              size='small'
              style={{ width: '100%' }}
              onChange={handleAcademicYear}
              id='year'
              options={academicYear}
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
            /> */}
              <Autocomplete
                  size='small'
                  style={{ width: '100%' }}
                  onChange={handleAcademicYear}
                  id='year'
                  className='dropdownIcon'
                  options={academicYear || []}
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
          {/* <Grid
            item
            xs={12}
            sm={4}
            className={isMobile ? 'roundedBox' : 'filterPadding roundedBox'}
          > */}
            {/* <Autocomplete
              style={{ width: '100%' }}
              size='small'
              onChange={handleBranch}
              id='branch'
              className='dropdownIcon'
              value={filterData?.branch}
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
            /> */}
          {/* </Grid> */}
          <Grid
                item
                xs={12}
                sm={4}
                className={isMobile ? 'roundedBox' : 'filterPadding roundedBox'}
              >
                <Autocomplete
                  style={{ width: '100%' }}
                  size='small'
                  onChange={handleBranch}
                  id='branch'
                  className='dropdownIcon'
                  value={filterData?.branch || ''}
                  options={branchDropdown || []}
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
          <Grid
            item
            xs={12}
            sm={4}
            className={isMobile ? 'roundedBox' : 'filterPadding roundedBox'}
          >
            <Autocomplete
              style={{ width: '100%' }}
              size='small'
              onChange={handleGrade}
              id='grade'
              className='dropdownIcon'
              value={filterData?.grade}
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
          <Grid item xs={12} sm={4} className={isMobile ? '' : 'filterPadding'}>
            <Autocomplete
              style={{ width: '100%' }}
              size='small'
              onChange={handleSection}
              id='Section'
              className='dropdownIcon'
              value={filterData?.section}
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
          <Grid
            item
            xs={12}
            sm={4}
            className={isMobile ? 'roundedBox' : 'filterPadding roundedBox'}
          >
            <Autocomplete
              style={{ width: '100%' }}
              size='small'
              onChange={handleSubject}
              id='subject'
              className='dropdownIcon'
              value={filterData?.subject}
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
          </Grid>

          {/* <Grid container spacing={5}> */}
          <Grid item xs={12} sm={4} className={isMobile ? '' : 'addEditPadding'}>
            <TextField
              id='categoryname'
              label='Chapter Name'
              style={{ width: '100%', marginTop: '-10px' }}
              variant='outlined'
              size='small'
              // placeholder='Ex: Attendance List'
              value={categoryName}
              inputProps={{ maxLength: 40 }}
              name='categoryname'
              onChange={(e) => setCategoryName(e.target.value)}
              required
            />
          </Grid>
          {/* <Grid item xs={12} sm={4} className={isMobile?'':'addEditPadding'}>
            <TextField
              id='topicname'
              label='Topic Name'
              style={{ width: '100%' }}
              variant='outlined'
              size='small'
              placeholder='Ex: Attendance List'
              value={topicName}
              inputProps={{maxLength:40}}
              name='topicname'
              onChange={e=>setTopicName(e.target.value)}
              required
            />
          </Grid> */}
        </Grid>
        {/* </Grid> */}
      </div>
      <Grid
        container
        spacing={isMobile ? 1 : 5}
        style={{ width: '95%', margin: '10px', marginLeft: '38px' }}
      >
        <Grid item xs={6} sm={2} className={isMobile ? '' : 'addEditButtonsPadding'}>
          <Button
            variant='contained'
            className='custom_button_master labelColor'
            size='medium'
            onClick={handleGoBack}
          >
            Back
          </Button>
        </Grid>
        <Grid item xs={6} sm={2} className={isMobile ? '' : 'addEditButtonsPadding'}>
          <Button
            variant='contained'
            style={{ color: 'white' }}
            color='primary'
            className='custom_button_master'
            size='medium'
            type='submit'
          >
            Submit
          </Button>
        </Grid>
      </Grid>
    </form>
  );
};
export default CreateChapterType;
