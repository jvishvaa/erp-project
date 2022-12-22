import { PlusOutlined } from '@ant-design/icons';
import { Button, Checkbox, Drawer, Form, Input, message, Select, Spin } from 'antd';
import React, { createRef, useContext, useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { addMarksToSection, addQuestionToSection } from 'redux/actions';
import axios from 'axios';
import QuestionBankCard from './questionBankCard';
import ViewMoreCard from './viewMoreCard';
import { useFormik } from 'formik';
import axiosInstance from 'config/axios';
import { Pagination } from '@material-ui/lab';
import endpoints from 'config/endpoints';
import { AlertNotificationContext } from 'context-api/alert-context/alert-state';
import NoDataIcon from 'v2/Assets/dashboardIcons/teacherDashboardIcons/NoDataIcon.svg';
import { FormControlLabel } from '@material-ui/core';

const { Option } = Select;

const QuestionBankDrawer = ({
  drawerOpen,
  onClose,
  section,
  questionId,
  grade,
  erpCategory,
  questionPaperWise,
}) => {
  const dispatch = useDispatch();
  const { setAlert } = useContext(AlertNotificationContext);
  const selectedAcademicYear = useSelector(
    (state) => state.commonFilterReducer?.selectedYear
  );
  const selectedBranch = useSelector(
    (state) => state.commonFilterReducer?.selectedBranch
  );
  const sections = useSelector((state) => state.createQuestionPaper.questions);
  const formRef = createRef();
  const [chapterDropdown, setChapterDropdown] = useState([]);
  const [keyconceptData, setKeyConceptsData] = useState([]);
  const [queTypeDropdown, setQueTypeDropdown] = useState([]);
  const [viewMore, setViewMore] = useState(false);
  const [viewMoreData, setViewMoreData] = useState([]);
  const [periodDataForView, setPeriodDataForView] = useState([]);
  const [loading, setLoading] = useState(false);
  const [callFlag, setCallFlag] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [questionsData, setQuestionData] = useState([]);
  const [isSelectAllQuestion, setIsSelectAllQuestion] = useState(false);
  const [selectedIdQuestion, setSelectedIdQuestion] = useState([]);
  const [selectedQuestion, setSelectedQuestion] = useState([]);
  const [redFlag, setRedflag] = useState(false);
  const [periodData, setPeriodData] = useState([]);
  const [subjectDropdown, setSubjectDropdown] = useState([]);
  const [moduleId, setModuleId] = useState('');
  const NavData = JSON.parse(localStorage.getItem('navigationData')) || {};
  const limit = 10;
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [tabIsErpCentral, setTabIsErpCentral] = useState(true);
  console.log(section, 'section');
  const [testMarks, SettestMarks] = useState(section?.test_marks);
  const [marksselection, setSelectionMarks] = useState([]);

  const formik = useFormik({
    initialValues: {
      branch: selectedBranch,
      grade: grade,
      erp_category: erpCategory,
      subject: '',
      chapter: '',
      topic: '',
      questionLevel: '',
      ques_category: '',
      ques_type: '',
    },
    onSubmit: (values) => {},
    validateOnChange: false,
    validateOnBlur: false,
  });

  useEffect(() => {
    if (NavData && NavData.length) {
      NavData.forEach((item) => {
        if (
          item.parent_modules === 'Assessment' &&
          item.child_module &&
          item.child_module.length > 0
        ) {
          item.child_module.forEach((item) => {
            if (item.child_name === 'Question Paper') {
              setModuleId(item.child_id);
            }
          });
        }
      });
    }
  }, []);

  useEffect(() => {
    if (selectedBranch && selectedAcademicYear) {
    }
  }, [selectedBranch, selectedAcademicYear]);

  useEffect(() => {
    getQuestionTypes();
    let params = {
      session_year: selectedAcademicYear?.id,
      branch_id: selectedBranch?.branch?.id,
      module_id: moduleId,
      grade: grade?.grade_id,
    };
    fetchSubjectData(params);
  }, []);

  useEffect(() => {
    if (grade && (formik.values.subject || erpCategory)) {
      fetchFilterData();
    }
  }, [page, formik.values, tabIsErpCentral]);

  const fetchSubjectData = (params = {}) => {
    axiosInstance
      .get(`${endpoints.lessonPlan.subjects}`, {
        params: { ...params },
      })
      .then((res) => {
        if (res.data.status_code === 200) {
          setSubjectDropdown(res.data.result);
        }
      })
      .catch((error) => {
        message.error(error.message);
      });
  };

  const question_level_options = [
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

  let quesCount = [1, 2];

  const handlePagination = (event, page) => {
    setPage(page);
    setSelectedIndex(-1);
  };

  const getQuestionTypes = () => {
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
  };

  const addQuestionToPaper = (question, questionId, section) => {
    dispatch(addQuestionToSection(question, questionId, section));
    message.success('Question added successfully!');
  };

  const handleAddQuestionToQuestionPaper = (question) => {
    const questionIds = [];
    const centralQuestionIds = [];
    sections.forEach((q) => {
      q.sections[0].questions.forEach(({ id = '', is_central = false }) => {
        if (is_central) {
          centralQuestionIds.push(id);
        } else {
          questionIds.push(id);
        }
      });
    });

    if (!question?.is_central) {
      if (!questionIds.includes(question?.id)) {
        addQuestionToPaper(question, questionId, section?.name);
      } else message.error('Question already added!');
    } else {
      if (!centralQuestionIds.includes(question?.id)) {
        addQuestionToPaper(question, questionId, section?.name);
      } else message.error('Question already added!');
    }
    onClose();
  };

  const handleAdd = () => {
    if (!questionPaperWise && marksselection?.length !== selectedQuestion?.length) {
      setAlert('error', 'please addMarks for All Selected Question');
    } else {
      handleMarkstosection();
      let callRedux = selectedQuestion?.forEach((item, index) => {
        handleAddQuestionToQuestionPaper(item);
      });
    }
  };

  const handleMarkstosection = () => {
    dispatch(addMarksToSection(testMarks, questionId, section?.name));
  };

  const handleMarks = (e, question, index) => {
    let quesindex = testMarks.findIndex((item) => item?.question_id === question?.id);
    let quesindex1 = marksselection.findIndex(
      (item) => item?.question_id === question?.id
    );
    if (quesindex !== -1) {
      let questionMark = testMarks;
      questionMark[quesindex].question_mark = [e.target.value.toString(), '0'];
      SettestMarks(questionMark);
    }
    if (quesindex1 !== -1) {
      let questionMark = marksselection;
      questionMark[quesindex1].question_mark = [e.target.value.toString(), '0'];
      // SettestMarks(questionMark)
      setSelectionMarks(questionMark);
    } else {
      let marks = {
        question_id: question?.id,
        question_mark: [e.target.value.toString(), '0'],
        mark_type: 1,
        child_mark: [],
        is_central: question?.is_central,
        ques_type: 1,
      };
      SettestMarks([...testMarks, marks]);
      setSelectionMarks([...marksselection, marks]);
    }
  };

  console.log(marksselection, 'marksselection');

  const toggleCompleteQuestion = (e, question, index) => {
    const { name, checked } = e.target;
    if (name === 'allSelect') {
      if (checked === true) {
        setIsSelectAllQuestion(true);
        setRedflag(true);
        let tempData = [...periodData];
        let tempArr = tempData.map((item) => {
          return { ...item, checked };
        });
        let temQuestionId = tempArr
          .filter((item) => item?.question_status === '2')
          .map((ques) => ques?.id);
        let tempQues = tempArr
          .filter((item) => item?.question_status === '2')
          .map((ques) => ques);
        setSelectedIdQuestion(temQuestionId);
        setSelectedQuestion(tempQues);
        setPeriodData(tempArr);
        setLoading(false);
      } else {
        setIsSelectAllQuestion(false);
        setRedflag(false);
        let tempData = [...periodData];
        let tempArr = tempData.map((item) => {
          return { ...item, checked };
        });
        setSelectedIdQuestion([]);
        setSelectedQuestion([]);
        setPeriodData(tempArr);
        setLoading(false);
      }
    } else {
      // for child component ->
      setIsSelectAllQuestion(false);
      let tempAllData = [...periodData];
      let newData = { ...periodData[index], checked };
      tempAllData.splice(index, 1, newData);
      setPeriodData(tempAllData);
      if (selectedIdQuestion.includes(question?.id) === false) {
        setSelectedIdQuestion([...selectedIdQuestion, question?.id]);
        setSelectedQuestion([...selectedQuestion, question]);
        setLoading(false);
      } else {
        let tempArr = [];
        let tempQues = [];
        tempArr = selectedIdQuestion.filter((el) => el !== question?.id);
        tempQues = selectedQuestion.filter((el) => el?.id !== question?.id);
        console.log(tempQues);
        setSelectedIdQuestion(tempArr);
        setSelectedQuestion(tempQues);
        setIsSelectAllQuestion(false);
        console.log(tempArr);
      }
    }
    console.log(selectedQuestion);
  };

  const fetchFilterData = () => {
    if (!formik.values.subject && !formik.values.erp_category) {
      return message.error('Please Select Subject or ERP Category !');
    }
    let requestUrl = `${endpoints.questionBank.erpQuestionList}?academic_session=${
      selectedBranch?.id
    }&grade=${grade?.grade_id}&page_size=${limit}&page=${page}&question_status=${2}`;

    requestUrl += `&request_type=${tabIsErpCentral ? 2 : 1}`;
    if (formik.values.subject && !formik.values.erp_category) {
      requestUrl += `&subject=${formik.values.subject?.subject_id}`;
    }
    if (formik.values.chapter) {
      requestUrl += `&chapter=${formik.values.chapter?.chapter_id}`;
    }
    if (formik.values.questionLevel) {
      requestUrl += `&question_level=${formik.values.questionLevel}`;
    }
    if (formik.values.ques_type) {
      requestUrl += `&question_type=${formik.values.ques_type}`;
    }
    if (formik.values.ques_category) {
      requestUrl += `&question_categories=${formik.values.ques_category}`;
    }
    if (formik.values.topic) {
      requestUrl += `&topic=${formik.values.topic?.id}`;
    }
    if (formik.values.erp_category) {
      requestUrl += `&category=${
        tabIsErpCentral ? erpCategory?.central_category_id : erpCategory?.erp_category_id
      }`;
    }
    setLoading(true);
    axiosInstance
      .get(requestUrl)
      .then((result) => {
        if (result?.data?.status_code === 200) {
          let tempArray = result?.data?.result?.results?.map((items) => {
            items['checked'] = false;
          });
          if (result?.data?.result?.count == 0) {
            // message.error('Data Not Available')
            setAlert('error', 'Data Not Available');
          }
          setTotalCount(result?.data?.result?.count);
          setLoading(false);
          setPeriodData(result?.data?.result?.results);
          //   var isVisible =result?.data?.result?.results.map((question) => question?.question_status === "3").filter((ques)=> ques === true)
          //   setIsVisible(isVisible)
          //   setViewMore(false);
          //   setViewMoreData({});
          //   setSelectedIndex(-1);
        } else {
          setLoading(false);
          setAlert('error', result?.data?.message);
        }
      })
      .catch((error) => {
        setLoading(false);
        message.error(error?.response?.data?.message || error?.response?.data?.msg);
      });
  };

  const handleSubject = (value) => {
    if (value) {
      let subject = subjectDropdown?.filter((item) => item?.subject_id === value?.value);
      formik.setFieldValue('subject', subject[0]);
      formik.setFieldValue('chapter', '');
      setChapterDropdown([]);
      setKeyConceptsData([]);
      formik.setFieldValue('topic', '');
      let params = {
        grade: grade?.grade_id,
        subject: value?.value,
        academic_session: selectedBranch?.id,
        academic_year: selectedAcademicYear?.session_year,
        session_year: selectedAcademicYear?.id,
      };
      fetchchapterData(params);
    } else {
      formik.setFieldValue('subject', '');
      formik.setFieldValue('chapter', '');
      formik.setFieldValue('topic', '');
      formRef.current.setFieldsValue({
        chapter: '',
        topic: '',
      });
      setChapterDropdown([]);
      setKeyConceptsData([]);
    }
  };

  const handleChapter = (value) => {
    if (value) {
      let chapter = chapterDropdown?.filter((item) => item?.chapter_id == value?.value);
      formik.setFieldValue('chapter', chapter[0]);
      fetchKeyConceptsData(chapter[0]);
    } else {
      formik.setFieldValue('chapter', '');
    }
  };

  const handleTopic = (value) => {
    if (value) {
      let topic = keyconceptData?.filter((item) => item?.id == value?.value);
      formik.setFieldValue('topic', topic[0]);
    } else {
      formik.setFieldValue('topic', '');
    }
  };

  const handleQuestionLevel = (value) => {
    if (value) {
      formik.setFieldValue('questionLevel', value?.value);
    } else {
      formik.setFieldValue('questionLevel', '');
    }
  };
  const handleQuestionType = (value) => {
    if (value) {
      formik.setFieldValue('ques_type', value?.value);
    } else {
      formik.setFieldValue('ques_type', '');
    }
  };
  const handleQuestionCategory = (value) => {
    if (value) {
      formik.setFieldValue('ques_category', value?.value);
    } else {
      formik.setFieldValue('ques_category', '');
    }
  };

  const fetchchapterData = (params = {}) => {
    // setFiltered(true);
    setLoading(true);
    axiosInstance
      .get(`assessment/v1/questions-list/`, {
        //questions-list-V1/
        params: { ...params },
      })
      .then((result) => {
        if (result?.data?.status_code === 200) {
          let filteredchapters = result?.data?.result?.filter(
            (item) => item?.keyconcept !== null
          );
          setChapterDropdown(filteredchapters);
          // setYCPData(result?.data?.data?.lp_ycp_data);
          // setFiltered(false)
          setLoading(false);
        } else {
          setChapterDropdown([]);
          // setYCPData([]);
          // setFiltered(false)
          setLoading(false);
        }
      })
      .catch((error) => {
        message.error(error.message);
        // setFiltered(false)
        // setLoading(false);
      });
  };
  const changequestionFrom = (e) => {
    setTabIsErpCentral((prev) => !prev);
    setPage(1);
  };
  const fetchKeyConceptsData = (value) => {
    // setLoadingInner(true);
    axiosInstance
      .get(
        `assessment/question_count/?chapter_id=${value?.chapter_id}&is_central=${
          value?.is_central ? 1 : 0
        }`,
        {
          // .get(`academic/annual-plan/key-concepts/`, {
          // params: { ...params },
        }
      )
      .then((result) => {
        if (result?.data?.status_code === 200) {
          setKeyConceptsData(result?.data?.result);
          //   setLoadingInner(false);
        } else {
          //   setLoadingInner(false);/
        }
      })
      .catch((error) => {
        message.error(error.message);
        // setLoadingInner(false);
      });
  };

  const onClosechild = () => {
    setViewMore(false);
  };

  const resolveQuestionTypeName = (type) => {
    switch (type) {
      case 1:
        return 'MCQ SINGLE CHOICE';
      case 2:
        return 'MCQ_MULTIPLE_CHOICE';
      case 3:
        return 'Match the Following';
      case 4:
        return 'Video Question';
      case 5:
        return 'PPT Question';
      case 6:
        return 'Matrix Questions';
      case 7:
        return 'Comprehension Questions';
      case 8:
        return 'True False';
      case 9:
        return 'Fill In The Blanks';
      case 10:
        return 'Descriptive';
      default:
        return '--';
    }
  };

  const getquestionLevel = (type) => {
    switch (type) {
      case 1:
        return 'Easy';
      case 2:
        return 'Average';
      case 3:
        return 'Difficult';
      default:
        return '--';
    }
  };

  console.log(periodData, 'periodData');

  const dummydata = [
    {
      id: 5907,
      school_id: 0,
      question_answer: [],
      question_level: '1',
      parent_id: 0,
      topic: 534,
      question_type: 10,
      grade_subject_mapping: 191,
      question_status: '2',
      is_delete: false,
      created_by: {
        id: 11,
        first_name: 'central_admin',
      },
      child_id: [],
      is_central: true,
      chapter: 901,
      identifier: 'c-5907',
      created_at: '2022-12-01T05:35:18.792784Z',
    },
  ];

  const questionTypes = queTypeDropdown?.map((each) => {
    return (
      <Option key={each?.id} value={each.id}>
        {each?.question_type}
      </Option>
    );
  });

  const questionLeveloptions = question_level_options?.map((each) => {
    return (
      <Option key={each?.value} value={each.value}>
        {each?.Question_level}
      </Option>
    );
  });

  const subjectOptions = subjectDropdown?.map((each) => {
    return (
      <Option key={each?.id} value={each.subject_id}>
        {each?.subject_name}
      </Option>
    );
  });

  const chapterOption = chapterDropdown?.map((each) => {
    return (
      <Option key={each?.chapter_id} value={each.chapter_id}>
        {each?.chapter_name}
      </Option>
    );
  });

  const topicOption = keyconceptData?.map((each) => {
    return (
      <Option key={each?.id} value={each.id}>
        {each?.topic_name}
      </Option>
    );
  });

  const questioncategoryoptions = question_categories_options?.map((each) => {
    return (
      <Option key={each?.value} value={each.value}>
        {each?.q_cat}
      </Option>
    );
  });

  return (
    <Drawer
      title='Questions from Question Bank'
      placement='right'
      onClose={onClose}
      closable={false}
      visible={drawerOpen}
      width={800}
      footer={
        <div
          style={{
            textAlign: 'right',
          }}
        >
          <Button
            form='incomeForm'
            type='primary'
            htmlType='submit'
            onClick={handleAdd}
            disabled={selectedQuestion?.length === 0}
          >
            <PlusOutlined size='small' />
            Add to Section
          </Button>
        </div>
      }
    >
      <div className='row align-items-center th-bg-blue-1 py-1'>
        <div className='col-md-8 th-fw-700'>Section {section?.name}</div>
        {/* <div className='d-flex justify-content-end align-items-center col-md-4'>
              <Checkbox style={{color : '#00c040'}}>Set Marks</Checkbox>
              <Input style={{width:'50px',height:'24px',background:'white'}} />
            </div> */}
      </div>
      <div className='mx-1 mt-4' style={{ border: '2px solid #e9e9e9' }}>
        <div className='filters mt-2 ml-3 py-2'>
          <Form id='filterForm' ref={formRef} layout={'horizontal'}>
            <div className='row align-items-center'>
              {!erpCategory && (
                <div className='col-md-4 col-6 pl-1'>
                  {/* <div className='mb-2 text-left'>Topic</div> */}
                  <Form.Item name='subject'>
                    <Select
                      allowClear
                      placeholder='Subject'
                      showSearch
                      // disabled={user_level == 13}
                      optionFilterProp='children'
                      getPopupContainer={(trigger) => trigger.parentNode}
                      filterOption={(input, options) => {
                        return (
                          options.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                        );
                      }}
                      onChange={(e, value) => {
                        handleSubject(value);
                      }}
                      // onClear={handleClearGrade}
                      className='w-100 text-left th-black-1 th-bg-grey th-br-4'
                      bordered={true}
                    >
                      {subjectOptions}
                    </Select>
                  </Form.Item>
                </div>
              )}
              {/* {boardFilterArr.includes(window.location.host) && ( */}
              {!erpCategory && (
                <div className='col-md-4 col-6 pl-0'>
                  {/* <div className='mb-2 text-left'>Question Level</div> */}
                  <Form.Item name='chapter'>
                    <Select
                      allowClear
                      placeholder='Chapter'
                      showSearch
                      optionFilterProp='children'
                      filterOption={(input, options) => {
                        return (
                          options.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                        );
                      }}
                      onChange={(e, value) => {
                        handleChapter(value);
                      }}
                      getPopupContainer={(trigger) => trigger.parentNode}
                      className='w-100 text-left th-black-1 th-bg-grey th-br-4'
                      bordered={true}
                    >
                      {chapterOption}
                    </Select>
                  </Form.Item>
                </div>
              )}
              {/* )} */}
              {!erpCategory && (
                <div className='col-md-4 col-6 pl-1'>
                  {/* <div className='mb-2 text-left'>Topic</div> */}
                  <Form.Item name='topic'>
                    <Select
                      allowClear
                      placeholder='Topic'
                      showSearch
                      // disabled={user_level == 13}
                      optionFilterProp='children'
                      getPopupContainer={(trigger) => trigger.parentNode}
                      filterOption={(input, options) => {
                        return (
                          options.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                        );
                      }}
                      onChange={(e, value) => {
                        handleTopic(value);
                      }}
                      // onClear={handleClearGrade}
                      className='w-100 text-left th-black-1 th-bg-grey th-br-4'
                      bordered={true}
                    >
                      {topicOption}
                    </Select>
                  </Form.Item>
                </div>
              )}
              <div className='col-md-4 col-6 pl-1 '>
                {/* <div className='mb-2 text-left'>Category</div> */}
                <Form.Item name='category'>
                  <Select
                    allowClear
                    placeholder='Category'
                    showSearch
                    getPopupContainer={(trigger) => trigger.parentNode}
                    optionFilterProp='children'
                    filterOption={(input, options) => {
                      return (
                        options.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                      );
                    }}
                    onChange={(e, value) => {
                      handleQuestionCategory(value);
                    }}
                    // onClear={handleClearSubject}
                    className='w-100 text-left th-black-1 th-bg-grey th-br-4'
                    bordered={true}
                  >
                    {questioncategoryoptions}
                  </Select>
                </Form.Item>
              </div>
              <div className='col-md-4 col-6 pl-1'>
                {/* <div className='mb-2 text-left'>Level</div> */}
                <Form.Item name='level'>
                  <Select
                    allowClear
                    placeholder='Level'
                    showSearch
                    // disabled={user_level == 13}
                    optionFilterProp='children'
                    getPopupContainer={(trigger) => trigger.parentNode}
                    filterOption={(input, options) => {
                      return (
                        options.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                      );
                    }}
                    onChange={(e, value) => {
                      handleQuestionLevel(value);
                    }}
                    // onClear={handleClearGrade}
                    className='w-100 text-left th-black-1 th-bg-grey th-br-4'
                    bordered={true}
                  >
                    {questionLeveloptions}
                  </Select>
                </Form.Item>
              </div>
              <div className='col-md-4 col-12 pl-1'>
                <Form.Item name='questiontype'>
                  <Select
                    allowClear
                    placeholder='Question Type'
                    showSearch
                    // disabled={user_level == 13}
                    optionFilterProp='children'
                    getPopupContainer={(trigger) => trigger.parentNode}
                    filterOption={(input, options) => {
                      return (
                        options.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                      );
                    }}
                    onChange={(e, value) => {
                      handleQuestionType(value);
                    }}
                    // onClear={handleClearGrade}
                    className='w-100 text-left th-black-1 th-bg-grey th-br-4'
                    bordered={true}
                  >
                    {questionTypes}
                  </Select>
                </Form.Item>
              </div>
            </div>
            {/* <div className='row'>
            
            </div> */}
          </Form>
        </div>
        <div className='row'>
          <div className='col-md-6'></div>
          <div className='col-md-3 col-6'>
            <Button
              className={`${
                tabIsErpCentral
                  ? 'highlightbtn th-button-active'
                  : 'nonHighlightbtn th-button'
              } th-width-100 th-br-6 mt-2`}
              // style={{boxShadow : tabIsErpCentral ? 'rgba(14, 30, 37, 0.12) 0px 2px 4px 0px, rgba(14, 30, 37, 0.32) 0px 2px 16px 0px' : 'none' }}
              onClick={() => changequestionFrom('edu')}
            >
              Eduvate Question
            </Button>
            {tabIsErpCentral && (
              <hr className='my-1' style={{ borderTop: '1px solid #1B4CCB' }} />
            )}
          </div>
          <div className='col-md-3 col-6'>
            <Button
              className={`${
                !tabIsErpCentral
                  ? 'highlightbtn th-button-active'
                  : 'nonHighlightbtn th-button'
              }
                     th-width-100 th-br-6 mt-2`}
              onClick={() => changequestionFrom('school')}
            >
              School Question
            </Button>
            {!tabIsErpCentral && (
              <hr className='my-1' style={{ borderTop: '1px solid #1B4CCB' }} />
            )}
          </div>
        </div>
        <hr />
        {loading ? (
          <div className='d-flex justify-content-center align-items-center h-50'>
            <Spin tip='Loading...' size='large' />
          </div>
        ) : (
          <>
            {periodData.length === 0 ? (
              <div className='row justify-content-center my-5'>
                <img src={NoDataIcon} />
              </div>
            ) : (
              <>
                <div className='ml-4'>
                  <FormControlLabel
                    style={{ minWidth: '150px', color: 'blue' }}
                    control={
                      <Checkbox
                        className='mr-2'
                        checked={isSelectAllQuestion}
                        onChange={(e) => toggleCompleteQuestion(e, periodData)}
                        name='allSelect'
                      />
                    }
                    label='Select All'
                  />
                </div>
                {periodData?.map((ques, i) => (
                  <div>
                    <QuestionBankCard
                      index={i}
                      question={ques}
                      setSelectedIndex={setSelectedIndex}
                      // periodColor={selectedIndex === i}
                      viewMore={viewMore}
                      setLoading={setLoading}
                      setViewMore={setViewMore}
                      setViewMoreData={setViewMoreData}
                      setPeriodDataForView={setPeriodDataForView}
                      setCallFlag={setCallFlag}
                      toggleCompleteQuestion={toggleCompleteQuestion}
                      handleMarks={handleMarks}
                      questionPaperWise={questionPaperWise}
                    />
                  </div>
                ))}
              </>
            )}
          </>
        )}

        {/* <ViewMoreCard
                      setSelectedIndex={setSelectedIndex}
                      viewMoreData={viewMoreData}
                      setViewMore={setViewMore}
                    //   filterDataDown={filterDataDown}
                      periodDataForView={periodDataForView}
                      setCallFlag={setCallFlag}
                    /> */}
        {viewMore && (
          <Drawer
            title={
              resolveQuestionTypeName(periodDataForView.question_type) +
              '  (' +
              getquestionLevel(parseInt(periodDataForView?.question_level)) +
              ')'
            }
            placement='right'
            onClose={onClosechild}
            closable={false}
            visible={viewMore}
            width={600}
          >
            <ViewMoreCard
              setSelectedIndex={setSelectedIndex}
              viewMoreData={viewMoreData}
              setViewMore={setViewMore}
              //   filterDataDown={filterDataDown}
              periodDataForView={periodDataForView}
              setCallFlag={setCallFlag}
            />
          </Drawer>
        )}
      </div>
      {/* <div className='row mt-3 mb-4 justify-content-end'>
        <Button className='th-button'>
            Add Question
        </Button>
          </div> */}
      {periodData?.length > 0 && (
        <div className='paginateData paginateMobileMargin'>
          <Pagination
            onChange={handlePagination}
            style={{ marginTop: 25 }}
            count={Math.ceil(totalCount / limit)}
            color='primary'
            page={page}
          />
        </div>
      )}
    </Drawer>
  );
};

export default QuestionBankDrawer;
