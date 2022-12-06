import React, { createRef, useContext, useEffect, useState } from 'react';
import Divider from '@material-ui/core/Divider';
import AddOutlinedIcon from '@material-ui/icons/AddOutlined';
import { Grid, TextField, Button, useTheme, SvgIcon } from '@material-ui/core';
import { useHistory } from 'react-router-dom';
import Autocomplete from '@material-ui/lab/Autocomplete';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { AlertNotificationContext } from '../../../context-api/alert-context/alert-state';
import { connect, useSelector } from 'react-redux';
import endpoints from '../../../config/endpoints';
import axiosInstance from '../../../config/axios';
import Loading from '../../../components/loader/loader';
import axios from 'axios';
import { useLocation } from 'react-router-dom';
// import { connect } from 'react-redux';
import './question-bank.css';
import ENVCONFIG from '../../../../src/config/config';
import { setFilter } from 'redux/actions';
import { Form, Select } from 'antd';

const {
  apiGateway: { baseURLCentral, xAPIKey },
} = ENVCONFIG;

const { Option } = Select;


const QuestionBankFilters = ({
  questionList,
  questionId,
  section,
  handlePeriodList,
  setPeriodData,
  setViewMore,
  setViewMoreData,
  setFilterDataDown,
  setSelectedIndex,
  setClearFlag,
  isEdit,
  setFilter,
  setPage,
  FilteredData,
  tabIsErpCentral
}) => {
  const { setAlert } = useContext(AlertNotificationContext);
  const themeContext = useTheme();
  const history = useHistory();
  const formRef = createRef();
  const [loading, setLoading] = useState(false);
  const isMobile = useMediaQuery(themeContext.breakpoints.down('sm'));
  const wider = isMobile ? '-10px 0px' : '-10px 0px 20px 8px';
  const widerWidth = isMobile ? '98%' : '95%';
  const [academicYearDropdown, setAcademicYearDropdown] = useState([]);
  const [branchDropdown, setBranchDropdown] = useState([]);
  const [gradeDropdown, setGradeDropdown] = useState([]);
  const [erpCategoryDropdown, setErpGradeDropdown] = useState([]);
  const selectedAcademicYear = useSelector(
    (state) => state.commonFilterReducer?.selectedYear
  );
  let selectedBranch = useSelector((state) => state.commonFilterReducer.selectedBranch);
  const [subjectDropdown, setSubjectDropdown] = useState([]);
  const [chapterDropdown, setChapterDropdown] = useState([]);
  const [topicDropdown, setTopicDropdown] = useState([]);
  const [queTypeDropdown, setQueTypeDropdown] = useState([]);
  const [centralGsMappingId, setCentralGsMappingId] = useState();
  const [boardDropdown, setBoardDropdown] = useState([]);
  const [selectedBoardId, setSelectedBoardId] = useState([]);
  const [selectedModuleId, setSelectedModuleId] = useState([]);
  const [moduleDropdown, setModuleDropdown] = useState([]);
  const [selectedKeyConceptId, setSelectedKeyConceptId] = useState([]);
  const [keyConceptDropdown, setKeyConceptDropdown] = useState([]);
  const [flag,setFlag] = useState(false);
  const location = useLocation();
  const is_ERP_CENTRAL = [
    { id: 1, flag: false, name: 'ERP' },
    { id: 2, flag: true, name: 'CENTRAL' },
  ];
  const [filterData, setFilterData] = useState({
    year: '',
    branch: FilteredData?.academic_session,
    volume: '',
    grade: FilteredData?.grade,
    subject: FilteredData?.subjectId,
    chapter: FilteredData?.chapter,
    quesType: '',
    topicId: FilteredData?.topic,
    question_level: '',
    question_category: '',
    is_erp_central: tabIsErpCentral,
    erp_category : ''
  });

  const question_level_options = [
    { value: 1, Question_level: 'Easy' },
    { value: 2, Question_level: 'Average' },
    { value: 3, Question_level: 'Difficult' },
  ];
  const questionLeveloptions = question_level_options?.map((each) => {
    return (
      <Option key={each?.value} value={each.value}>
        {each?.Question_level}
      </Option>
    );
  });

  const question_categories_options = [
    { value: 1, q_cat: 'Knowledge' },
    { value: 2, q_cat: 'Understanding' },
    { value: 3, q_cat: 'Application' },
    { value: 4, q_cat: 'Analysis' },
    { value: 5, q_cat: 'Remembering' },
    { value: 6, q_cat: 'Evaluation' },
    { value: 7, q_cat: 'Creating' },

  ];
  const questioncategoryoptions = question_categories_options?.map((each) => {
    return (
      <Option key={each?.value} value={each.value}>
        {each?.q_cat}
      </Option>
    );
  });

  const questionTypes = queTypeDropdown?.map((each) => {
    return (
      <Option key={each?.id} value={each.id}>
        {each?.question_type}
      </Option>
    );
  });

  const erpCategories = erpCategoryDropdown?.map((each) => {
    return (
      <Option key={each?.id} value={each.erp_category_id}>
        {each?.erp_category_name}
      </Option>
    );
  });

  useEffect(() => {
  //  if(filterData?.quesType || filterData?.question_category || filterData?.question_level || filterData?.erp_category){
  handlePeriodList(
      filterData?.quesType,
      filterData?.question_category,
      filterData?.subject,
      filterData?.question_level,
      filterData?.topicId,
      FilteredData?.academic_session,
      filterData?.grade,
      filterData?.chapter,
      tabIsErpCentral,
      tabIsErpCentral ? 2 : 0,
      filterData?.erp_category
    );

  //  }
      
      // setSelectedIndex(-1);
  },[filterData?.erp_category , filterData?.question_level,filterData?.question_category,filterData?.quesType])

  // const erpCategorys = erpCategoryDropdown?.map((each) => {
  //   return (
  //     <Option key={each?.id} value={each.id}>
  //       {each?.question_type}
  //     </Option>
  //   );
  // });



  let boardFilterArr = [
    'orchids.letseduvate.com',
    'localhost:3000',
    'localhost:3001',
    'dev.olvorchidnaigaon.letseduvate.com',
    'qa.olvorchidnaigaon.letseduvate.com'
  ]

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
    if(selectedBranch && filterData?.year?.id && moduleId){
      handleBranch('',selectedBranch)

    }
  },[selectedBranch,filterData?.year?.id,moduleId])

  useEffect(() => {
    if (!boardFilterArr.includes(window.location.host)) {
      if (filterData?.subject && boardDropdown.length > 0) {
        let data = boardDropdown?.filter((item) => item?.board_name === 'CBSE');
        handleBoard('', data);
      }
    }
  }, [filterData?.subject, boardDropdown])

  useEffect(() => {
    if (moduleId && selectedAcademicYear) {
      handleAcademicYear();
    }
    //   if (moduleId) {
    //     axiosInstance
    //       .get(`${endpoints.userManagement.academicYear}?module_id=${moduleId}`)
    //       .then((result) => {
    //         if (result?.data?.status_code === 200) {
    //           setAcademicYearDropdown(result?.data?.data);
    //           const defaultValue = result?.data?.data?.[0];
    //           handleAcademicYear({}, defaultValue);
    //           setLoading(false);
    //         } else {
    //           setAlert('error', result?.data?.message);
    //         }
    //       })
    //       .catch((error) => {
    //         setAlert('error', error?.message);
    //       });
    //   }
  }, [moduleId, selectedAcademicYear]);

  useEffect(() => {
    setLoading(true);
    axios
      .get(`${endpoints.createQuestionApis.questionType}`, {
        headers: { 'x-api-key': 'vikash@12345#1231' },
      })
      .then((result) => {
        if (result?.data?.status_code === 200) {
          setQueTypeDropdown(result?.data?.result?.filter((obj) => obj?.id !== 5));
          setLoading(false);
        } else {
          setAlert('error', result?.data?.message);
        }
      })
      .catch((error) => {
        setAlert('error', error?.message);
      });
      axiosInstance
      .get(`${endpoints.questionBank.erpCategory}`)
      .then((result) => {
        setErpGradeDropdown(result?.data?.result)
      })
      .catch((error) => {
        setAlert('error', error?.message);
      });
  }, []);

  const handleClear = () => {
    setClearFlag(true);
    setFilterData({
      year: filterData?.year,
      branch: '',
      volume: '',
      grade: '',
      subject: '',
      chapter: '',
      topicId: '',
      quesType: '',
      question_level: '',
      question_category: '',
      erp_category: '',
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
      question_level: '',
      question_category: '',
      quesType: '',
      quesLevel: '',
      topicId: '',
      erp_category: '',
    });
    setPeriodData([]);
    // setLoading(true);
    // if (value) {
    setFilterData({ ...filterData, year: selectedAcademicYear });
    axiosInstance
      .get(
        `${endpoints.academics.branches}?session_year=${selectedAcademicYear?.id}&module_id=${moduleId}`
      )
      .then((result) => {
        if (result?.data?.status_code === 200) {
          setBranchDropdown(result?.data?.data?.results);
          setLoading(false);
        } else {
          setAlert('error', result?.data?.message);
        }
      })
      .catch((error) => {
        setAlert('error', error?.message);
      });
    // } else {
    // setLoading(false);
    // }
  }

  function handleBranch(event, value) {
    setPage(1)
    setFilterData({
      ...filterData,
      branch: '',
      grade: '',
      subject: '',
      board: '', module: '',
      chapter: '',
      question_level: '',
      question_category: '',
      quesType: '',
      quesLevel: '',
      topicId: '',
      erp_category: '',
    });
    setPeriodData([]);
    setLoading(true);
    if (value) {
      setFilterData({ ...filterData, branch: value });
      axiosInstance
        .get(
          `${endpoints.academics.grades}?session_year=${filterData?.year?.id}&branch_id=${value?.branch?.id}&module_id=${moduleId}`
        )
        .then((result) => {
          if (result?.data?.status_code === 200) {
            setGradeDropdown(result?.data?.data);
            setLoading(false);
          } else {
            setAlert('error', result?.data?.message);
          }
        })
        .catch((error) => {
          setAlert('error', error?.message);
        });
    } else {
      setLoading(false);
    }
  }

  const handleTopic = (event, value) => {
    setPage(1)
    setFilterData({
      ...filterData,
      topicId: '',
      question_level: '',
      question_category: '',
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

  const handleQuestionCategory = (value) => {
    setPage(1)
    setFilterData({ ...filterData, question_category: '', quesType: '' });
    setPeriodData([]);
    setLoading(true);
    if (value) {
      setFilterData({ ...filterData, question_category: value });
      setLoading(false);
    } else {
      setLoading(false);
    }
  };
  const handleerpCategory = (value) => {
    setPage(1)
    setFilterData({ ...filterData, erp_category: '',  });
    setLoading(true);
    setFlag(false)
    if (value) {
      let erpCategory = erpCategoryDropdown?.filter((item) => item.erp_category_id === value)
      setFlag(true)
      setFilterData({ ...filterData, erp_category: erpCategory[0] });
      setLoading(false);
    } else {
      setLoading(false);
    }
  };
  const handleQuestionLevel = (value) => {
    setPage(1)
    setFilterData({
      ...filterData,
      question_level: '',
    });
    setPeriodData([]);
    setLoading(true);
    if (value) {
      setFilterData({ ...filterData, question_level: value });
      setLoading(false);
    } else {
      setLoading(false);

    }
  };
  const handleQuestionType = ( value) => {
    setPage(1)
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
      board: '', module: '',
      chapter: '',
      question_level: '',
      question_category: '',
      quesType: '',
      quesLevel: '',
      topicId: '',
    });
    setPeriodData([]);
    setSubjectDropdown([]);
    setChapterDropdown([]);
    setLoading(true);
    if (value) {
      setFilterData({ ...filterData, grade: value, subject: '', chapter: '' });
      axiosInstance
        .get(
          `${endpoints.lessonReport.subjects}?session_year=${filterData?.year?.id}&branch=${filterData?.branch?.branch?.id}&grade=${value?.grade_id}&module_id=${moduleId}`
        )
        .then((result) => {
          if (result?.data?.status_code === 200) {
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

  const handleSubject = (event, value) => {
    setPage(1)
    setFilterData({
      ...filterData,
      subject: '',
      board: '', module: '',
      chapter: '',
      question_level: '',
      question_category: '',
      quesType: '',
      quesLevel: '',
    });
    setPeriodData([]);
    setLoading(true);
    if (value) {
      setFilterData({ ...filterData, subject: value, chapter: '', topic: '' });
      if (value) {
        axios
          .get(`${baseURLCentral}/central-admin/boards/`,
            {
              headers: { 'x-api-key': 'vikash@12345#1231' }
            }
          )
          .then((result) => {
            if (result?.data?.status_code === 200) {
              // setChapterDropdown(result?.data?.result);
              if (!boardFilterArr.includes(window.location.host)) {
                setBoardDropdown(result?.data?.result)
              }
              setBoardDropdown(result?.data?.result)
              setLoading(false);
            } else {
              setAlert('error', result?.data?.message);
            }
          })
          .catch((error) => {
            setAlert('error', error?.message);
          });
      } else {
        setLoading(false);
      }
    } else {
      setLoading(false);
    }
    if (filterData?.is_erp_central?.name == 'ERP') {
      if (value) {
        axiosInstance
          .get(
            `${endpoints.questionBank.chapterList}?branch_id=${filterData?.branch?.branch?.id}&session_year=${selectedAcademicYear?.id}&grade=${filterData?.grade?.grade_id}&subject_id=${value?.id}&subject=${value?.subject_id}`,
          )
          .then((result) => {
            if (result?.data?.status_code === 200) {
              setLoading(false);
              setChapterDropdown(result?.data?.result);
              // setChapterDropdown(result?.data?.result?.chapter_list);
            } else {
              setLoading(false);
              setAlert('error', result.data.message);
              setChapterDropdown([]);
            }
          })
          .catch((error) => {
            setLoading(false);
            setAlert('error', error.message);
            setChapterDropdown([]);
          });
      }
    }
  };

  const Clearquestionlevel = () => {
    setFilterData({
      ...filterData,
      question_level: '',
    });
  }


  const handleBoard = (event = {}, values = []) => {
    setPage(1)
    setFilterData({ ...filterData, board: '', module: '', chapter: '', keyconcept: '' });
    setChapterDropdown([]);
    setKeyConceptDropdown([]);
    setModuleDropdown([]);
    if (values.length > 0) {
      setChapterDropdown([]);
      setKeyConceptDropdown([]);
      setLoading(true);
      const ids = values.map((el) => el);
      const selectedId = values.map((el) => el?.id);
      setSelectedBoardId(selectedId);
      setFilterData({
        ...filterData,
        chapter: '',
        board: ids,
        module: '',
        keyconcept: '',
      });
      // axios
      axiosInstance
        .get(
          `academic/get-central-module-list/?subject_id=${filterData?.subject?.subject_id}&grade_id=${filterData.grade.grade_id}&branch_id=${filterData?.branch?.branch?.id}&board=${selectedId}`,
        )
        .then((result) => {
          if (result?.data?.status_code === 200) {
            setLoading(false);
            // setModuleDropdown(result?.data?.result?.module_list);
            setModuleDropdown(result.data.result);
            setCentralGsMappingId(result?.data?.result?.central_gs_mapping_id);
            // setCentralSubjectName(result?.data?.result?.central_subject_name);
            // setCentralGradeName(result?.data?.result?.central_grade_name);
          } else {
            setAlert('error', result?.data?.message);
            setChapterDropdown([]);
            setLoading(false);
            setSelectedBoardId([]);
            setModuleDropdown([]);
          }
        })
        .catch((error) => {
          setLoading(false);
          setAlert('error', error.message);
          setSelectedBoardId([]);
          setModuleDropdown([]);
        });
    } else {
      setChapterDropdown([]);
      setLoading(false);
      setSelectedBoardId([]);
      setModuleDropdown([]);
    }
  };

  const handleModule = (event = {}, value = []) => {
    setPage(1)
    setLoading(true);
    setFilterData({ ...filterData, module: '', chapter: '', keyconcept: '' });
    if (value) {
      setLoading(true);
      setSelectedModuleId(value?.id);
      setFilterData({ ...filterData, chapter: '', module: value, keyconcept: '' });
      axiosInstance
        .get(
          `${endpoints.questionBank.chapterList}?branch_id=${filterData?.branch?.branch?.id}&session_year=${selectedAcademicYear?.id}&grade=${filterData?.grade?.grade_id}&subject_id=${filterData?.subject?.id}&subject=${filterData?.subject?.subject_id}&board_id=${selectedBoardId}&module_id=${value?.id}`,
        )
        .then((result) => {
          if (result?.data?.status_code === 200) {
            setLoading(false);
            setChapterDropdown(result?.data?.result);
            // setChapterDropdown(result?.data?.result?.chapter_list);
          } else {
            setLoading(false);
            setAlert('error', result.data.message);
            setChapterDropdown([]);
          }
        })
        .catch((error) => {
          setLoading(false);
          setAlert('error', error.message);
          setChapterDropdown([]);
        });
    } else {
      setLoading(false);
      setChapterDropdown([]);
    }
  };

  const handleChapter = (event, value) => {
    setPage(1)
    setFilterData({
      ...filterData,
      chapter: '',
      topicId: '',
      question_level: '',
      question_category: '',
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
          .get(`${endpoints.questionBank.centralTopicList}?chapter=${value?.id}`, {
            headers: { 'x-api-key': 'vikash@12345#1231' },
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
          .get(`${endpoints.questionBank.topicList}?chapter=${value?.id}`)
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
    } else {
      setLoading(false);
    }
  };
  function handleIsErpCentral(event, value) {
    if (value) {
      setFilterData({ ...filterData, is_erp_central: value });
    }
  }

  const handleFilter = () => {
    setFilter(true)
    if (!filterData?.year) {
      setAlert('error', 'Select Academic Year!');
      return;
    }
    if (!filterData?.branch) {
      setAlert('error', 'Select Branch!');
      return;
    }
    if (!filterData?.grade) {
      setAlert('error', 'Select Grade!');
      return;
    }
    // if (!filterData?.subject) {
    //   setAlert('error', 'Select Subject!');
    //   return;
    // }
    if (!filterData?.is_erp_central) {
      setAlert('error', 'Select Question From!');
      return;
    }
    handlePeriodList(
      filterData?.quesType?.id,
      filterData?.question_category,
      filterData?.subject?.subject_id,
      filterData?.question_level,
      filterData?.topicId,
      filterData?.branch?.id,
      filterData?.grade?.grade_id,
      filterData?.chapter,
      filterData?.is_erp_central,
      0,
      filterData?.erp_category,
    );
    setSelectedIndex(-1);
  };

  return (
    <>
      {loading ? <Loading message='Loading...' /> : null}

  
      <div className='col-12 mt-2 th-bg-white'>
            <Form id='filterForm' ref={formRef} layout={'horizontal'}>
              <div className='row align-items-center'>
                {/* {boardFilterArr.includes(window.location.host) && ( */}
                  <div className='col-md-2 col-6 pl-0'>
                    <div className='mb-2 text-left'>Question Level</div>
                    <Form.Item name='question_level'>
                      <Select
                        allowClear
                        placeholder='Question Level'
                        showSearch
                        optionFilterProp='children'
                        filterOption={(input, options) => {
                          return (
                            options.children.toLowerCase().indexOf(input.toLowerCase()) >=
                            0
                          );
                        }}
                        onChange={(e) => {
                          handleQuestionLevel(e);
                        }}
                        onClear={Clearquestionlevel}
                        getPopupContainer={(trigger) => trigger.parentNode}
                        className='w-100 text-left th-black-1 th-bg-grey th-br-4'
                        bordered={false}
                      >
                        {questionLeveloptions}
                      </Select>
                    </Form.Item>
                  </div>
                {/* )} */}
                <div className='col-md-2 col-6'>
                  <div className='mb-2 text-left'>Question Category</div>
                  <Form.Item name='question category'>
                    <Select
                      allowClear
                      placeholder= 'Question category'
                      showSearch
                      // disabled={user_level == 13}
                      optionFilterProp='children'
                      getPopupContainer={(trigger) => trigger.parentNode}
                      filterOption={(input, options) => {
                        return (
                          options.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                        );
                      }}
                      onChange={(e) => {
                        handleQuestionCategory(e);
                      }}
                      // onClear={handleClearGrade}
                      className='w-100 text-left th-black-1 th-bg-grey th-br-4'
                      bordered={false}
                    >
                      {questioncategoryoptions}
                    </Select>
                  </Form.Item>
                </div>
                <div className='col-md-2 col-6 '>
                  <div className='mb-2 text-left'>Question Type</div>
                  <Form.Item name='question type'>
                    <Select
                    allowClear
                      placeholder='Question Type'
                      showSearch
                      getPopupContainer={(trigger) => trigger.parentNode}
                      optionFilterProp='children'
                      filterOption={(input, options) => {
                        return (
                          options.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                        );
                      }}
                      onChange={(e, value) => {
                        handleQuestionType(e,value)}}
                      // onClear={handleClearSubject}
                      className='w-100 text-left th-black-1 th-bg-grey th-br-4'
                      bordered={false}
                    >
                      {questionTypes}
                    </Select>
                  </Form.Item>
                </div>
                <div className='col-md-2 col-6'>
                  <div className='mb-2 text-left'>ERP Category</div>
                  <Form.Item name='ERP category'>
                    <Select
                      allowClear
                      placeholder= 'ERP category'
                      showSearch
                      // disabled={user_level == 13}
                      optionFilterProp='children'
                      getPopupContainer={(trigger) => trigger.parentNode}
                      filterOption={(input, options) => {
                        return (
                          options.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                        );
                      }}
                      onChange={(value) => {
                        handleerpCategory(value);
                      }}
                      // onClear={handleClearGrade}
                      className='w-100 text-left th-black-1 th-bg-grey th-br-4'
                      bordered={false}
                    >
                      {erpCategories}
                    </Select>
                  </Form.Item>
                </div>
              </div>
              
            </Form>
          </div> 



      {/* <Grid
        container
        spacing={isMobile ? 3 : 5}
        style={{ width: widerWidth, margin: wider }}
      >
        <Grid item xs={12} sm={3} className={isMobile ? '' : 'filterPadding'}>
          <Autocomplete
            style={{ width: '100%' }}
            size='small'
            onChange={handleBranch}
            id='branch'
            className='dropdownIcon'
            value={filterData?.branch || {}}
            options={branchDropdown || []}
            getOptionLabel={(option) => option?.branch?.branch_name || ''}
            filterSelectedOptions
            renderInput={(params) => (
              <TextField
                {...params}
                variant='outlined'
                label='Branch'
                placeholder='Branch'
                required
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
            value={filterData?.grade || {}}
            options={gradeDropdown || []}
            getOptionLabel={(option) => option?.grade__grade_name || ''}
            filterSelectedOptions
            renderInput={(params) => (
              <TextField
                {...params}
                variant='outlined'
                label='Grade'
                placeholder='Grade'
                required
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
            value={filterData?.is_erp_central || {}}
            options={is_ERP_CENTRAL || []}
            getOptionLabel={(option) => option?.name || ''}
            filterSelectedOptions
            renderInput={(params) => (
              <TextField
                {...params}
                variant='outlined'
                label='Question From'
                placeholder='Question From'
                required
              />
            )}
          />
        </Grid>
        {!flag ? (
        <Grid item xs={12} sm={3} className={isMobile ? '' : 'filterPadding'}>
          <Autocomplete
            style={{ width: '100%' }}
            size='small'
            onChange={handleSubject}
            id='subject'
            className='dropdownIcon'
            value={filterData?.subject || {}}
            options={subjectDropdown || []}
            getOptionLabel={(option) => option?.subject_name || ''}
            filterSelectedOptions
            renderInput={(params) => (
              <TextField
                {...params}
                variant='outlined'
                label='Subject'
                placeholder='Subject'
                // required
              />
            )}
          />
        </Grid>

        ): ''}

        {filterData?.is_erp_central?.name == 'CENTRAL' ?
          <>
            {(boardFilterArr.includes(window.location.host)) &&
              <Grid
                item
                xs={12}
                sm={3}
                className={isMobile ? 'roundedBox' : 'filterPadding roundedBox'}
              >
                <Autocomplete
                  multiple
                  style={{ width: '100%' }}
                  size='small'
                  onChange={handleBoard}
                  id='board'
                  className='dropdownIcon'
                  value={filterData.board || []}
                  options={boardDropdown || []}
                  getOptionLabel={(option) => option?.board_name || ''}
                  // filterSelectedOptions
                  getOptionSelected={(option, value) => option?.id == value?.id}
                  renderInput={(params) => (
                    <TextField {...params} variant='outlined' label='Board' placeholder='Board'
                    // required 
                    />
                  )}
                />
              </Grid>}
            <Grid
              item
              xs={12}
              sm={3}
              className={isMobile ? 'roundedBox' : 'filterPadding roundedBox'}
            >
              <Autocomplete
                // multiple
                style={{ width: '100%' }}
                size='small'
                onChange={handleModule}
                id='module'
                className='dropdownIcon'
                value={filterData.module || []}
                options={moduleDropdown || []}
                getOptionLabel={(option) => option?.lt_module_name || ''}
                filterSelectedOptions
                // getOptionSelected={(option, value) =>
                //     option?.id == value?.id
                //   }
                renderInput={(params) => (
                  <TextField
                    {...params}
                    variant='outlined'
                    label='Module'
                    placeholder='Module'
                  // required
                  />
                )}
              />
            </Grid>
          </> : null}

        {!flag ? (
          <>
        <Grid item xs={12} sm={3} className={isMobile ? '' : 'filterPadding'}>
          <Autocomplete
            style={{ width: '100%' }}
            size='small'
            onChange={handleChapter}
            id='chapter'
            className='dropdownIcon'
            value={filterData?.chapter || {}}
            options={chapterDropdown || []}
            getOptionLabel={(option) => option?.chapter_name || ''}
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
            value={filterData?.topicId || {}}
            options={topicDropdown || []}
            getOptionLabel={(option) => option?.topic_name || ''}
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
          </>
        ): ''}
        <Grid item xs={12} sm={3} className={isMobile ? '' : 'filterPadding'}>
          <Autocomplete
            style={{ width: '100%' }}
            size='small'
            onChange={handleQuestionLevel}
            id='Question Level'
            className='dropdownIcon'
            value={filterData?.question_level || {}}
            options={question_level_options || []}
            getOptionLabel={(option) => option?.Question_level || ''}
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
            value={filterData?.question_category || {}}
            options={question_categories_options || []}
            getOptionLabel={(option) => option?.q_cat || ''}
            filterSelectedOptions
            renderInput={(params) => (
              <TextField
                {...params}
                variant='outlined'
                label='Question Category'
                placeholder='Question Category'
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
            value={filterData?.quesType || {}}
            options={queTypeDropdown || []}
            getOptionLabel={(option) => option?.question_type || ''}
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
            onChange={handleerpCategory}
            id='Category'
            className='dropdownIcon'
            value={filterData?.erp_category || {}}
            options={erpCategoryDropdown || []}
            getOptionLabel={(option) => option?.erp_category_name || ''}
            filterSelectedOptions
            renderInput={(params) => (
              <TextField
                {...params}
                variant='outlined'
                label='ERP Category'
                placeholder='ERP Category'
              />
            )}
          />
        </Grid>
        <Grid item xs={12} sm={3} className={isMobile ? '' : 'filterPadding'}>
          <Autocomplete
            style={{ width: '100%' }}
            size='small'
            onChange={handleerpCategory}
            id='Category'
            className='dropdownIcon'
            value={filterData?.erp_category || {}}
            options={erpCategoryDropdown || []}
            getOptionLabel={(option) => option?.erp_category_name || ''}
            filterSelectedOptions
            renderInput={(params) => (
              <TextField
                {...params}
                variant='outlined'
                label='ERP Category'
                placeholder='ERP Category'
              />
            )}
          />
        </Grid>


        {!isMobile && (
          <Grid item xs={12} sm={12}>
            <Divider />
          </Grid>
        )}
        {section && questionId && (
          <Grid item xs={6} sm={2} className={isMobile ? '' : 'addButtonPadding'}>
            <Button
              variant='contained'
              className='cancelButton labelColor'
              style={{ width: '100%' }}
              size='medium'
              onClick={
                isEdit
                  ? () => history.push(`/create-question-paper/${isEdit}`)
                  : () => history.push(`/create-question-paper?show-question-paper=true`)
              }
            >
              Back
            </Button>
          </Grid>
        )}
        {isMobile && <Grid item xs={3} sm={0} />}
        <Grid item xs={6} sm={2} className={isMobile ? '' : 'addButtonPadding'}>
          <Button
            variant='contained'
            style={{ width: '100%' }}
            className='cancelButton labelColor'
            size='medium'
            onClick={handleClear}
          >
            Clear All
          </Button>
        </Grid>
        {isMobile && <Grid item xs={3} sm={0} />}
        {isMobile && <Grid item xs={3} sm={0} />}
        <Grid item xs={6} sm={2} className={isMobile ? '' : 'addButtonPadding'}>
          <Button
            variant='contained'
            style={{ color: 'white', width: '100%' }}
            color='primary'
            size='medium'
            onClick={handleFilter}
          >
            Filter
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
              style={{ color: 'white', width: '100%' }}
              color='primary'
              onClick={() => history.push('/create-question')}
              size='medium'
            >
              Create
            </Button>
          </Grid>
        )}
        {isMobile && <Grid item xs={3} sm={0} />}
      </Grid> */}
    </>
  );
};

const mapStateToProps = (state) => ({
  questionList: state.createQuestionPaper.questions,
});

export default connect(mapStateToProps, null)(QuestionBankFilters);
