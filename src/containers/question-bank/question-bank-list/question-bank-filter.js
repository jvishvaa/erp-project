import React, { useContext, useEffect, useState } from 'react';
import Divider from '@material-ui/core/Divider';
import AddOutlinedIcon from '@material-ui/icons/AddOutlined';
import { Grid, TextField, Button, useTheme, SvgIcon } from '@material-ui/core';
import { useHistory } from 'react-router-dom';
import Autocomplete from '@material-ui/lab/Autocomplete';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import download from '../../../assets/images/downloadAll.svg';
import { AlertNotificationContext } from '../../../context-api/alert-context/alert-state';
import endpoints from '../../../config/endpoints';
import axiosInstance from '../../../config/axios';
import Loading from '../../../components/loader/loader';
import axios from 'axios';
import { connect } from 'react-redux';
import './question-bank.css';

const QuestionBankFilters = ({
  questionList,
  questionId,
  handlePeriodList,
  setPeriodData,
  setViewMore,
  setViewMoreData,
  setFilterDataDown,
  setSelectedIndex,
}) => {
  const { setAlert } = useContext(AlertNotificationContext);
  const themeContext = useTheme();
  const history = useHistory();
  const [loading, setLoading] = useState(false);
  const isMobile = useMediaQuery(themeContext.breakpoints.down('sm'));
  const wider = isMobile ? '-10px 0px' : '-10px 0px 20px 8px';
  const widerWidth = isMobile ? '98%' : '95%';
  const [academicYearDropdown, setAcademicYearDropdown] = useState([]);
  const [branchDropdown, setBranchDropdown] = useState([]);
  const [gradeDropdown, setGradeDropdown] = useState([]);
  const [subjectDropdown, setSubjectDropdown] = useState([]);
  const [chapterDropdown, setChapterDropdown] = useState([]);
  const [topicDropdown, setTopicDropdown] = useState([]);
  const [queTypeDropdown, setQueTypeDropdown] = useState([]);
  const [quesCatData, setQuesCatData] = useState([]);
  const [quesLevel, setQuesLevel] = useState([]);

  const [is_ERP_CENTRAL, setIs_ERP_CENTRAL] = useState([
    { id: 1, flag: false, name: 'ERP' },
    { id: 2, flag: true, name: 'CENTRAL' },
  ]);

  const [mapId, setMapId] = useState('');
  const [filterData, setFilterData] = useState({
    year: '',
    branch: '',
    volume: '',
    grade: '',
    subject: '',
    chapter: '',
    quesType: '',
    topicId: '',
    question_level_option: '',
    question_categories_options: '',
    is_erp_central: is_ERP_CENTRAL[0],
  });
  const question_level_option = [
    { value: 1, Question_level: 'Easy' },
    { value: 2, Question_level: 'Average' },
    { value: 3, Question_level: 'Difficult' },
  ];

  const question_categories_options = [
    { value: 1, q_cat: 'Knowledge' },
    { value: 2, q_cat: 'Understanding' },
    { value: 3, q_cat: 'Application' },
    { value: 4, q_cat: 'Analyse' },
  ];

  const NavData = JSON.parse(localStorage.getItem('navigationData')) || {};
  const [moduleId, setModuleId] = useState('');

  useEffect(() => {
    if (NavData && NavData.length) {
      NavData.forEach((item) => {
        if (
          item.parent_modules === 'Assessment' &&
          item.child_module &&
          item.child_module.length > 0
        ) {
          item.child_module.forEach((item) => {
            if (item.child_name === 'Question Bank') {
              setModuleId(item.child_id);
            }
          });
        }
      });
    }
  }, []);

  useEffect(() => {
    if (questionList?.length === 0 && window.location.search !== '') {
      history.goBack();
    }
  }, [questionList?.length]);

  useEffect(() => {
    if (moduleId) {
      axiosInstance
        .get(`${endpoints.userManagement.academicYear}?module_id=${moduleId}`)
        .then((result) => {
          if (result.data.status_code === 200) {
            setAcademicYearDropdown(result?.data?.data);
            const defaultValue = result.data?.data?.[0];
            handleAcademicYear({}, defaultValue);

            setLoading(false);
          } else {
            setAlert('error', result.data?.message);
          }
        })
        .catch((error) => {
          setAlert('error', error.message);
        });
    }
  }, [moduleId]);

  useEffect(() => {
    // <<<<<<<<<<<<<<<GRADE DROPDOWN>>>>>>>>>>>>>>>>>>>>>
    // axiosInstance
    //   .get(`${endpoints.questionBank.grades}`)
    //   .then((result) => {
    //     if (result.data.status_code === 200) {
    //       setGradeDropdown(result.data.result.results);
    //     } else {
    //       setAlert('error', result.data.message);
    //     }
    //   })
    //   .catch((error) => {
    //     setAlert('error', error.message);
    //   });

    // <<<<<>>>>>>QUESTION TYPE API>>>>>>>>>>>><<<<<<<<<<
    // axiosInstance
    //   .get(`${endpoints.questionBank.examType}`)
    //   .then((result) => {
    //     if (result.data.status_code === 200) {
    //       setQueTypeDropdown(result.data.result);
    //     } else {
    //       setAlert('error', result.data.message);
    //     }
    //   })
    //   .catch((error) => {
    //     setAlert('error', error.message);
    //   });
    setLoading(true);
    axios
      .get(`${endpoints.createQuestionApis.questionType}`, {
        headers: { 'x-api-key': 'vikash@12345#1231' },
      })
      .then((result) => {
        if (result.data.status_code === 200) {
          setQueTypeDropdown(result?.data?.result?.filter((obj) => obj?.id !== 5));
          setLoading(false);
        } else {
          setAlert('error', result.data?.message);
        }
      })
      .catch((error) => {
        setAlert('error', error.message);
      });
  }, []);

  const handleClear = () => {
    setFilterData({
      year: '',
      branch: '',
      volume: '',
      grade: '',
      subject: '',
      chapter: '',
      topicId: '',
      quesType: '',
      question_level_option: '',
      question_categories_options: '',
    });
    setPeriodData([]);
    setSubjectDropdown([]);
    setChapterDropdown([]);
    setViewMoreData({});
    setViewMore(false);
    setFilterDataDown({});
    setSelectedIndex(-1);
  };

  function handleAcademicYear(event, value) {
    setFilterData({
      ...filterData,
      year: '',
      branch: '',
      grade: '',
      subject: '',
      chapter: '',
      question_level_option: '',
      question_categories_options: '',
      quesType: '',
      quesLevel: '',
      topicId: '',
    });
    setPeriodData([]);
    setLoading(true);
    if (value) {
      setFilterData({ ...filterData, year: value });
      axiosInstance
        .get(
          `${endpoints.academics.branches}?session_year=${value.id}&module_id=${moduleId}`
        )
        .then((result) => {
          if (result.data.status_code === 200) {
            setBranchDropdown(result?.data?.data?.results);
            setLoading(false);
          } else {
            setAlert('error', result.data?.message);
          }
        })
        .catch((error) => {
          setAlert('error', error.message);
        });
    } else {
      setLoading(false);
    }
  }

  function handleBranch(event, value) {
    setFilterData({
      ...filterData,
      branch: '',
      grade: '',
      subject: '',
      chapter: '',
      question_level_option: '',
      question_categories_options: '',
      quesType: '',
      quesLevel: '',
      topicId: '',
    });
    setPeriodData([]);
    setLoading(true);
    if (value) {
      setFilterData({ ...filterData, branch: value });
      axiosInstance
        .get(
          `${endpoints.academics.grades}?session_year=${filterData.year?.id}&branch_id=${value.branch.id}&module_id=${moduleId}`
        )
        .then((result) => {
          if (result.data.status_code === 200) {
            setGradeDropdown(result?.data?.data);
            setLoading(false);
          } else {
            setAlert('error', result.data?.message);
          }
        })
        .catch((error) => {
          setAlert('error', error.message);
        });
    } else {
      setLoading(false);
    }
  }

  const handleTopic = (event, value) => {
    setFilterData({
      ...filterData,
      topicId: '',
      question_level_option: '',
      question_categories_options: '',
      quesType: '',
      quesLevel: '',
    });
    setPeriodData([]);
    setLoading(true);
    if (value) {
      setFilterData({ ...filterData, topicId: value });
      setLoading(false);
    } else {
      setLoading(false);
    }
  };

  const handleQuestionCategory = (event, value) => {
    setFilterData({ ...filterData, question_categories_options: '', quesType: '' });
    setPeriodData([]);
    setLoading(true);
    if (value) {
      setQuesCatData(value);
      setFilterData({ ...filterData, question_categories_options: value });
      setLoading(false);
    } else {
      setLoading(false);
    }
  };
  const handleQuestionLevel = (event, value) => {
    setFilterData({
      ...filterData,
      question_level_option: '',
      question_level_option: '',
      question_categories_options: '',
      quesType: '',
      quesLevel: '',
    });
    setPeriodData([]);
    setLoading(true);
    if (value) {
      setQuesLevel(value);
      setFilterData({ ...filterData, question_level_option: value });
      setLoading(false);
    } else {
      setLoading(false);
    }
  };
  const handleQuestionType = (event, value) => {
    setFilterData({ ...filterData, quesType: '' });
    setPeriodData([]);
    setPeriodData([]);
    setLoading(true);
    if (value) {
      setFilterData({ ...filterData, quesType: value });
      setLoading(false);
    } else {
      setLoading(false);
    }
  };

  const handleGrade = (event, value) => {
    setFilterData({
      ...filterData,
      grade: '',
      section: '',
      subject: '',
      chapter: '',
      question_level_option: '',
      question_categories_options: '',
      quesType: '',
      quesLevel: '',
      topicId: '',
    });
    setPeriodData([]);
    setSubjectDropdown([]);
    setChapterDropdown([]);
    setLoading(true);
    if (value) {
      console.log(value, 'test');
      setFilterData({ ...filterData, grade: value, subject: '', chapter: '' });
      axiosInstance
        .get(
          `${endpoints.questionBank.subjectList}?session_year=${filterData.branch?.id}&grade=${value.grade_id}&module_id=${moduleId}`
        )
        .then((result) => {
          if (result.data.status_code === 200) {
            setSubjectDropdown(result?.data?.result);
            setLoading(false);
          } else {
            setAlert('error', result?.data?.message);
            setSubjectDropdown([]);
            setChapterDropdown([]);
          }
        })
        .catch((error) => {
          setAlert('error', error?.message);
          setSubjectDropdown([]);
          setChapterDropdown([]);
        });
    } else {
      setLoading(false);
    }
  };

  // const handleSection = (event, value) => {
  //   setFilterData({
  //     ...filterData,
  //     section: '',
  //     subject: '',
  //     chapter: '',
  //     question_level_option: '',
  //     question_categories_options: '',
  //     quesType: '',
  //     quesLevel: '',
  //   });
  //   if (value) {
  //     setFilterData({...filterData,section:value,subject:'',chapter:''})
  //     axiosInstance.get(
  //       `${endpoints.academics.subjects}?session_year=${filterData.year.id}&branch=${filterData.branch.id}&grade=${filterData.grade.id}&section=${value.section_id}&module_id=${moduleId}`
  //     )  .then((result) => {
  //       if (result.data.status_code === 200) {
  //         setSubjectDropdown(result?.data?.data);
  //         // setMapId(result.data.result.results);
  //         setLoading(false);
  //       } else {
  //         setAlert('error', result?.data?.message);
  //         setSubjectDropdown([]);
  //         setChapterDropdown([]);
  //       }
  //     })
  //     .catch((error) => {
  //       setAlert('error', error?.message);
  //       setSubjectDropdown([]);
  //       setChapterDropdown([]);
  //     });
  //   }else {
  //     setLoading(false);
  //   }
  // };
  const handleSubject = (event, value) => {
    setFilterData({
      ...filterData,
      subject: '',
      chapter: '',
      question_level_option: '',
      question_categories_options: '',
      quesType: '',
      quesLevel: '',
    });
    setPeriodData([]);
    setLoading(true);
    if (value) {
      setFilterData({ ...filterData, subject: value, chapter: '', topic: '' });
      if (value) {
        axiosInstance
          .get(`${endpoints.questionBank.chapterList}?subject=${value.subject_id}`)
          .then((result) => {
            if (result.data.status_code === 200) {
              setChapterDropdown(result?.data?.result);
              setLoading(false);
            } else {
              setAlert('error', result.data?.message);
            }
          })
          .catch((error) => {
            setAlert('error', error.message);
          });
      } else {
        setLoading(false);
      }
      // if (value) {
      //   axiosInstance
      //     .get(`${endpoints.lessonPlan.chapterListCentral}?grade_subject=${value.id}`)
      //     .then((result) => {
      //       if (result.data.status_code === 200) {
      //         setChapterDropdown(result.data.result);
      //       } else {
      //         setAlert('error', result.data.message);
      //         setChapterDropdown([]);
      //       }
      //     })
      //     .catch((error) => {
      //       setAlert('error', error.message);
      //       setChapterDropdown([]);
      //     });
      // }
    } else {
      setLoading(false);
    }
  };

  const handleChapter = (event, value) => {
    setFilterData({
      ...filterData,
      chapter: '',
      topicId: '',
      question_level_option: '',
      question_categories_options: '',
      quesType: '',
      quesLevel: '',
    });
    setPeriodData([]);
    setTopicDropdown([]);
    setLoading(true);
    if (value) {
      setFilterData({ ...filterData, chapter: value });
      if (value?.is_central) {
        axios
          .get(`${endpoints.questionBank.centralTopicList}?chapter=${value.id}`, {
            headers: { 'x-api-key': 'vikash@12345#1231' },
            //
          })
          .then((result) => {
            if (result?.data?.status_code === 200) {
              setTopicDropdown(result?.data?.result);
              setLoading(false);
            } else {
              setAlert('error', result?.data?.message);
            }
          })
          .catch((error) => {
            setAlert('error', error.message);
            setLoading(false);
          });
      }
      if (!value?.is_central)
        axiosInstance
          .get(`${endpoints.questionBank.topicList}?chapter=${value.id}`)
          .then((result) => {
            if (result?.data?.status_code === 200) {
              setTopicDropdown(result?.data?.result);
              setLoading(false);
            } else {
              setAlert('error', result?.data?.message);
            }
          })
          .catch((error) => {
            setAlert('error', error.message);
            setLoading(false);
          });

      // setFilterData({ ...filterData, chapter: value, topic: '' });
      // if (value) {
      //   axios
      //     .get(`${endpoints.createQuestionApis.topicList}?chapter=${value.id}`, {
      //       headers: { 'x-api-key': 'vikash@12345#1231' },
      //     })
      //     .then((result) => {
      //       if (result.data.status_code === 200) {
      //         setTopicDropdown(result?.data?.result);
      //         setLoading(false);
      //       } else {
      //         setAlert('error', result.data?.message);
      //       }
      //     })
      //     .catch((error) => {
      //       setAlert('error', error.message);
      //     });
      // } else {
      //   setLoading(false);
      // }
    } else {
      setLoading(false);
    }
    // if (value) {
    //   setFilterData({ ...filterData, chapter: value });
    //   if (value) {
    //     axiosInstance
    //       .get(`${endpoints.questionBank.topics}?chapter=${value.id}`)
    //       .then((result) => {
    //         if (result.data.status_code === 200) {
    //           setTopicDropdown(result.data.result);
    //         } else {
    //           setAlert('error', result.data.message);
    //           setTopicDropdown([]);
    //         }
    //       })
    //       .catch((error) => {
    //         setAlert('error', error.message);
    //         setTopicDropdown([]);
    //       });
    //   }
    // }
  };
  function handleIsErpCentral(event, value) {
    if (value) {
      setFilterData({ ...filterData, is_erp_central: value });
    }
  }

  const handleFilter = () => {
    if (!filterData?.grade) {
      setAlert('error', 'Select Grade!');
      return;
    }
    if (!filterData?.subject) {
      setAlert('error', 'Select Subject!');
      return;
    }
    if (!filterData?.chapter) {
      setAlert('error', 'Select chapter!');
      return;
    }
    if (
      !filterData?.quesType ||
      !filterData?.question_categories_options ||
      !filterData?.question_level_option ||
      !filterData?.year ||
      !filterData?.branch
    ) {
      setAlert('error', 'Select all the fields!');
      return;
    }
    handlePeriodList(
      filterData.quesType?.id,
      quesCatData,
      filterData.subject?.subject_id,
      quesLevel,
      filterData.topicId,
      // filterData.year?.id,
      filterData.branch?.id,
      filterData.grade?.grade_id,
      filterData.chapter,
      filterData.is_erp_central,
    );
    setSelectedIndex(-1);

    // if (filterData.chapter) {
    //     handlePeriodList(filterData.chapter.id);
    //     setFilterDataDown(filterData);
    //     axiosInstance.get(`/assessment/question-list/?mapping_id=13&question_type=2&question_categories=1&topic=2`)
    //         .then(result => {
    //             if (result.data.status_code === 200) {
    //                 // setOverviewSynopsis(result.data.result);
    //                 handlePeriodList()
    //             } else {
    //                 // setOverviewSynopsis([]);
    //             }
    //         })
    //         .catch(error => {
    //             setAlert('error', error.message);
    //         })
    // } else {
    //     setAlert('warning', 'Please select a chapter!');
    //     setFilterDataDown({});
    // }
  };

  return (
    <>
      {loading ? <Loading message='Loading...' /> : null}

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
            id='academicyear'
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
            id='branch'
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
        {/* <Grid item xs={12} sm={3} className={isMobile ? '' : 'filterPadding'}>
          <Autocomplete
            style={{ width: '100%' }}
            size='small'
            onChange={handleSection}
            id='grade'
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
        </Grid> */}
        <Grid item xs={12} sm={3} className={isMobile ? '' : 'filterPadding'}>
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
        <Grid item xs={12} sm={3} className={isMobile ? '' : 'filterPadding'}>
          <Autocomplete
            style={{ width: '100%' }}
            size='small'
            onChange={handleChapter}
            id='chapter'
            className='dropdownIcon'
            value={filterData?.chapter}
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
        </Grid>
        <Grid item xs={12} sm={3} className={isMobile ? '' : 'filterPadding'}>
          <Autocomplete
            style={{ width: '100%' }}
            size='small'
            onChange={handleTopic}
            id='topic'
            className='dropdownIcon'
            value={filterData?.topicId}
            options={topicDropdown}
            getOptionLabel={(option) => option?.topic_name}
            filterSelectedOptions
            renderInput={(params) => (
              <TextField
                {...params}
                variant='outlined'
                label='Topic'
                placeholder='Topic'
              />
            )}
          />
        </Grid>
        <Grid item xs={12} sm={3} className={isMobile ? '' : 'filterPadding'}>
          <Autocomplete
            style={{ width: '100%' }}
            size='small'
            onChange={handleQuestionLevel}
            id='Question Level'
            className='dropdownIcon'
            value={filterData.question_level_option}
            options={question_level_option}
            getOptionLabel={(option) => option?.Question_level}
            filterSelectedOptions
            renderInput={(params) => (
              <TextField
                {...params}
                variant='outlined'
                label='Question Level'
                placeholder='Question Level'
              />
            )}
          />
        </Grid>
        <Grid item xs={12} sm={3} className={isMobile ? '' : 'filterPadding'}>
          <Autocomplete
            style={{ width: '100%' }}
            size='small'
            onChange={handleQuestionCategory}
            id='Category'
            className='dropdownIcon'
            value={filterData.question_categories_options}
            options={question_categories_options}
            getOptionLabel={(option) => option?.q_cat}
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
        <Grid item xs={12} sm={3} className={isMobile ? '' : 'filterPadding'}>
          <Autocomplete
            style={{ width: '100%' }}
            size='small'
            onChange={handleQuestionType}
            id='Question Type'
            className='dropdownIcon'
            value={filterData?.quesType}
            options={queTypeDropdown}
            getOptionLabel={(option) => option?.question_type}
            filterSelectedOptions
            renderInput={(params) => (
              <TextField
                {...params}
                variant='outlined'
                label='Question Type'
                placeholder='Question Type'
              />
            )}
          />
        </Grid>
        <Grid item xs={12} sm={3} className={isMobile ? '' : 'filterPadding'}>
          <Autocomplete
            style={{ width: '100%' }}
            size='small'
            onChange={handleIsErpCentral}
            id='Question Type'
            className='dropdownIcon'
            value={filterData?.is_erp_central}
            options={is_ERP_CENTRAL}
            getOptionLabel={(option) => option?.name}
            filterSelectedOptions
            renderInput={(params) => (
              <TextField
                {...params}
                variant='outlined'
                label='Question From'
                placeholder='Question From'
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
            style={{ color: 'white', borderRadius: '10px' }}
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
            style={{ color: 'white', borderRadius: '10px' }}
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
        {!questionId && (
          <Grid
            item
            xs={6}
            sm={2}
            className={isMobile ? 'createButton' : 'createButton addButtonPadding'}
          >
            <Button
              startIcon={<AddOutlinedIcon style={{ fontSize: '30px' }} />}
              variant='contained'
              style={{ color: 'white', borderRadius: '10px' }}
              color='primary'
              className='custom_button_master'
              onClick={() => history.push('/create-question')}
              size='medium'
            >
              CREATE
            </Button>
          </Grid>
        )}
        {isMobile && <Grid item xs={3} sm={0} />}
      </Grid>
    </>
  );
};

const mapStateToProps = (state) => ({
  questionList: state.createQuestionPaper.questions,
});

export default connect(mapStateToProps, null)(QuestionBankFilters);
