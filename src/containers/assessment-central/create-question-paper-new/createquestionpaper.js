import React, { useContext, useState, useEffect, createRef } from 'react';
import { LeftOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, Form, Select, Input, Tag, Switch, Breadcrumb } from 'antd';
import { EditOutlined } from '@ant-design/icons';
import { useHistory, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { AlertNotificationContext } from '../../../context-api/alert-context/alert-state';
import endpoints from '../../../config/endpoints';
import axiosInstance from '../../../config/axios';
import { useFormik } from 'formik';
import Layout from 'containers/Layout';
import TextArea from 'antd/lib/input/TextArea';
import SectionCard from './sectionCard';
import Sections from './sections';
import cuid from 'cuid';
import {
  deleteSection,
  deleteQuestionSection,
  createQuestionPaper,
  setFilter,
  addSection,
  setIsFetched,
  editQuestionPaper,
} from 'redux/actions';
import Question from './questions';

const { Option } = Select;

const CreatequestionPaperNew = () => {
  const { setAlert } = useContext(AlertNotificationContext);
  const history = useHistory();
  const location = useLocation();
  const NavData = JSON.parse(localStorage.getItem('navigationData')) || {};
  const [moduleId, setModuleId] = useState('');
  const [erpCategoryDropdown, setCategoryDropdown] = useState([]);
  const [gradeDropdown, setGradeDropdown] = useState([]);
  const formRef = createRef();
  const selectedAcademicYear = useSelector(
    (state) => state.commonFilterReducer?.selectedYear
  );
  const dispatch = useDispatch();
  const sections = useSelector((state) => state.createQuestionPaper.questions);
  const selectedBranch = useSelector(
    (state) => state.commonFilterReducer?.selectedBranch
  );
  const isFetched = useSelector((state) => state.createQuestionPaper.isFetched);
  const questionPaperName = useSelector(
    (state) => state.createQuestionPaper.questionPaperName
  );
  const [editFilters, setEditFilters] = useState(false);
  const { sectionCounts, Grade, erpCategory } = history?.location?.state;
  const [questionPaperWise, setQuestionPaperWise] = useState(true);
  const [qp_wise_marks, setQp_wise_Marks] = useState(0);
  const [max_Marks, setMaxMarks] = useState(0);
  const { refresh = false, isEdit, paperId } = history.location?.state || {};

  useEffect(() => {
    if (refresh || isEdit) {
      dispatch(setIsFetched(false));
    }
  }, [refresh, isEdit]);
  useEffect(() => {
    if (!isFetched && gradeDropdown?.length && isEdit) {
      handleFetch();
    }
  }, [isFetched, gradeDropdown]);

  const handleTransformResponse = (responseQuestions, responseSections) => {
    responseSections.forEach((section, index) => {
      const sectionId = cuid();
      const key = String.fromCharCode(65 + index);
      const questionList = [];
      // const testMark = [];

      section[key].forEach((sectionIdentifier) =>
        responseQuestions.forEach((question) => {
          if (sectionIdentifier === question?.identifier) {
            questionList.push(question);
            // question_marks_data.forEach((item) => {
            //   if(item?.question_id == question?.id) testMark.push(item)
            // })
          }
        })
      );
debugger
      const sectionArray = [
        {
          id: cuid(),
          name: key,
          questions: questionList,
          instruction: section?.instruction || '',
          mandatory_questions: section?.mandatory_questions,
          test_marks: section?.test_marks || [],
        },
      ];
      const sectionObject = { id: sectionId, sections: sectionArray };
      dispatch(addSection(sectionObject));
    });
  };

  const handleFetch = () => {
    dispatch(setIsFetched(true));
    let data = Number(location.pathname.slice(23));
    const url = endpoints.assessmentErp?.questionPaperViewMore.replace(
      '<question-paper-id>',
      paperId
    );
    axiosInstance
      .get(url)
      .then((result) => {
        if (result.data.status_code === 200) {
          dispatch(setFilter('questionPaperName', result.data.result.paper_name));
          formik.setFieldValue('questionPaperName', result.data.result.paper_name);
          setQuestionPaperWise(!result?.data?.result?.is_question_wise);
          setMaxMarks(result?.data?.result?.total_mark);
          if (result?.data?.result?.is_question_wise) {
            setQp_wise_Marks(result?.data?.result?.total_mark);
          }
          let grade = gradeDropdown.filter(
            (item) => item?.grade_id == result.data.result?.grade
          );
          handleGrade({
            key: grade[0]?.id,
            value: grade[0]?.grade_id,
            children: grade[0]?.grade_name,
          });
          // setFilterData(result.data.result)
          const { questions: responseQuestions = [], sections: responseSections = [] } =
            result.data.result || {};
          handleTransformResponse(responseQuestions, responseSections); //for edit question-paper
        }
      })
      .catch((error) => {
        setAlert('error', error.message);
      });
  };

  const formik = useFormik({
    initialValues: {
      branch: [],
      questionPaperName: questionPaperName || '',
      grade: Grade,
      erp_category: erpCategory ? erpCategory : '',
      subjects: [],
      questionLevel: '',
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

  const erpCategories = erpCategoryDropdown?.map((each) => {
    return (
      <Option key={each?.id} value={each.erp_category_id}>
        {each?.erp_category_name}
      </Option>
    );
  });
  useEffect(() => {
    let value = {
      key: formik.values.grade?.id,
      children: formik.values.grade?.grade_name,
      value: formik.values.grade?.grade_id,
    };
    formRef.current.setFieldsValue({
      grade: value,
    });
  }, [formik?.values?.grade]);

  const gradeOptions = gradeDropdown?.map((each) => {
    return (
      <Option key={each?.id} value={each.grade_id}>
        {each?.grade_name}
      </Option>
    );
  });
  useEffect(() => {
    if (gradeOptions?.length && Grade) {
      // let selectedcategory = erpCategories.filter((item) => item?.props?.value == erpCategory)
      // let selectedgrade = gradeOptions.filter((item) => item?.props?.value == Grade)
      let category = erpCategoryDropdown.filter(
        (item) => item?.erp_category_id == erpCategory?.value
      );
      let grade = gradeDropdown.filter((item) => item?.grade_id == Grade?.value);

      formik.setFieldValue('grade', grade[0]);
      if (erpCategory) {
        formik.setFieldValue('erp_category', category[0]);
        formRef.current.setFieldsValue({
          erpCategory: erpCategory,
        });
      }
      formRef.current.setFieldsValue({
        grade: Grade,
        // 'erpCategory': erpCategory
      });
    }
  }, [erpCategoryDropdown, gradeDropdown]);
  useEffect(() => {
    if (selectedBranch && moduleId) {
      getGrades();
      getErpCategory();
    }
  }, [selectedBranch, moduleId]);

  const getErpCategory = () => {
    axiosInstance
      .get(`${endpoints.questionBank.erpCategory}`)
      .then((result) => {
        setCategoryDropdown(result?.data?.result);
      })
      .catch((error) => {
        setAlert('error', error?.message);
      });
  };
  const handleGrade = (value) => {
    if (value) {
      let grade = gradeDropdown.filter((item) => item?.grade_id == value?.value);
      formik.setFieldValue('grade', grade[0]);
    } else {
      formik.setFieldValue('grade', '');
    }
  };

  console.log(formik.values.grade, 'grade');

  const handlequesType = () => {
    setQuestionPaperWise((prev) => !prev);
    setQp_wise_Marks(0);
    let data = sections.forEach((item) => {
      let dummy = item?.sections[0].questions.forEach((que, i) => {
        handleDeleteQuestion(que?.id, i);
      });
    });
  };

  const handleerpCategory = (value) => {
    formik.setFieldValue({
      erp_category: '',
    });
    if (value) {
      let category = erpCategoryDropdown?.filter(
        (item) => item?.erp_category_id == value?.value
      );
      formik.setFieldValue('erp_category', category[0]);
    } else {
      formik.setFieldValue('erp_category', '');
      formRef.current.setFieldsValue('erp_category', '');
    }
  };

  const handleQuestionPaperName = (e) => {
    dispatch(
      setFilter(
        'questionPaperName',
        e.target.value.replace(/\b(\w)/g, (s) => s.toUpperCase())
      )
    );
    formik.setFieldValue(
      'questionPaperName',
      e.target.value.replace(/\b(\w)/g, (s) => s.toUpperCase())
    );
  };

  const getGrades = () => {
    axiosInstance
      .get(
        `${endpoints.academics.grades}?session_year=${selectedAcademicYear?.id}&branch_id=${selectedBranch?.branch?.id}&module_id=${moduleId}`
      )
      .then((result) => {
        if (result?.data?.status_code === 200) {
          setGradeDropdown(result?.data?.data);
        } else {
          setAlert('error', result?.data?.message);
        }
      })
      .catch((error) => {
        setAlert('error', error?.message);
      });
  };
  const handleDeleteSection = (questionId, section) => {
    dispatch(deleteSection(questionId, section));
  };

  const DeleteSections = () => {
    sections.forEach((question) => {
      let data = question.sections?.forEach((sec) => {
        dispatch(deleteSection(question?.id, sec?.id));
      });
    });
  };

  const deleteOneSection = (questionId, sectionId) => {
    dispatch(deleteSection(questionId, sectionId));
  };

  const handleEditQuestionPaper = async (isDraft) => {
    console.log(isDraft);
    try {
      if (max_Marks === 0) {
        return setAlert('error', 'Please Enter Maximum Marks');
      } else if (max_Marks > 100 || max_Marks < 0) {
        return setAlert('error', 'Please Enter Valid Marks 0-100');
      }
      const questionData = [],
        centralQuestionData = [];
      const sectionData = [];
      const grade_subject_mapping = [];
      const subjects = [];
      let totalMark = 0;
      let instructionValidCount = 0;
      sections.forEach((q) => {
        q.sections.forEach((sec) => {
          if (sec?.instruction?.length === 0) {
            instructionValidCount += 1;
          }
          const sectionObj = {
            [sec.name]: [],
            discription: sec.name,
            mandatory_questions: sec?.mandatory_questions,
            instruction: sec?.instruction,
            test_marks: sec?.test_marks,
          };
          if (!questionPaperWise) {
            // let marks = sec.test_marks?.forEach((item) => {
            //   totalMark += parseInt(item?.question_mark[0]);
            // });
            for(let i=0;i<sec?.mandatory_questions;i++){
              totalMark += parseInt(sec?.test_marks[i].question_mark[0]);
            }
          }
          sec.questions.forEach((question) => {
            if (question?.is_central) {
              grade_subject_mapping.push(question?.grade_subject_mapping);
            } else {
              subjects.push(question?.subject);
            }
            sectionObj[sec.name].push(question?.identifier);
            if (question?.is_central) {
              if (!centralQuestionData.includes(question.id)) {
                centralQuestionData.push(question.id, question.child_id);
              }
            } else {
              if (!questionData.includes(question.id)) {
                questionData.push(question.id, question.child_id);
              }
            }
          });
          sectionData.push(sectionObj);
        });
      });
      if (instructionValidCount !== 0) {
        return setAlert('error', 'Please Enter instructions');
      }
      if (
        (!questionPaperWise && totalMark < parseInt(max_Marks)) ||
        totalMark > parseInt(max_Marks)
      ) {
        return setAlert('error', 'Selected Marks not Matched with Maximum Marks');
      }

      let reqObj = {
        academic_year: selectedAcademicYear?.id,
        paper_name: questionPaperName,
        grade: formik.values.grade?.grade_id,
        // academic_session: formik.values.branch.id,
        academic_session: [selectedBranch?.id],
        // subjects: formik.values.subject?.map((obj) => obj?.subject_id),
        grade_subject_mapping: [...new Set(grade_subject_mapping)],
        // paper_level: formik.values.question_paper_level?.id,
        subjects: [...new Set(subjects)],
        // paper_level: formik.values.question_paper_level?.id,
        section: sectionData,
        sections: sectionData,
        is_review: isDraft ? 'False' : 'True',
        is_draft: isDraft ? 'True' : 'False',
        is_verified: 'False',
        total_mark: qp_wise_marks,
        is_question_wise: !questionPaperWise ? 'True' : 'False',
      };
      let filterdata = {
        branch: formik.values.branch,
        academic: formik.values.academic,
        grade: formik.values.grade,
        qpValue: {
          id: formik.values.question_paper_level?.id,
          level: formik.values.question_paper_level?.name,
        },
        type: { id: 1, flag: false, name: 'ERP' },
      };

      if (formik.values.erp_category) {
        reqObj['category'] = formik.values.erp_category?.erp_category_id;
        filterdata['category'] = formik.values.erp_category;
      }

      if (questionData?.length) {
        reqObj = { ...reqObj, question: questionData.flat() };
      }

      if (centralQuestionData?.length) {
        reqObj = { ...reqObj, central_question: centralQuestionData.flat() };
      }

      // if (isDraft) {
      //   reqObj.is_draft = 'True';
      //   reqObj.is_review = 'False';
      // }

      let sectionFlag = true,
        sectionName = '';

      for (let k = 0; k < sectionData.length; k++) {
        const sectionObj = sectionData[k];
        if (sectionObj[String.fromCharCode(65 + k)].length === 0) {
          sectionName = String.fromCharCode(65 + k);
          sectionFlag = false;
          break;
        }
      }
      let submitArray = {
        Section: sectionFlag,
        'Question Paper Name': questionPaperName,
        // 'Question Level': formik.values.question_paper_level.id,
        // Subject: formik.values.subject.length,
        Grade: formik.values.grade.grade_id,
      };
      // if(formik.values.category){
      //   submitArray['Category'] = formik.values.category
      // }
      // if(formik.values.subject.length){
      //   submitArray['Subject'] = formik.values.subject.length
      // }
      let finalSubmitFlag =
        Object.entries(submitArray).every(([key, value]) => value) && sectionData.length;
      if (finalSubmitFlag) {
        await dispatch(editQuestionPaper(reqObj, paperId));
        DeleteSections();
        sessionStorage.setItem('filter', JSON.stringify(filterdata));
        // await initEditQuestionPaper(reqObj);
        // history.push('/assessment-question');
        history.push({
          pathname: '/assessment-question',
          state: {
            isSet: 'true',
          },
        });
        setAlert('success', 'Question Paper Updated successfully');
        // handleResetQuestionPaper();
      } else {
        // const checkSectionLength = isDraft ? true : sectionData.length;
        const checkSectionLength = sectionData.length;
        if (checkSectionLength) {
          for (const [key, value] of Object.entries(submitArray)) {
            if (key === 'Section' && !Boolean(value))
              setAlert('error', `Please add questions for Section-${sectionName}`);
            else if (!Boolean(value)) setAlert('error', `${key} can't be empty!`);
          }
        } else {
          setAlert('error', 'At least one section is compulsory!');
        }
      }
    } catch (e) {
      setAlert('error', 'Please Select Filters First');
    }
  };

  const handleCreateQuestionPaper = async (isDraft) => {
    try {
      if (max_Marks === 0) {
        return setAlert('error', 'Please Enter Maximum Marks');
      } else if (max_Marks > 100 || max_Marks < 0) {
        return setAlert('error', 'Please Enter Valid Maximum Marks 0-100');
      } else if (questionPaperWise && qp_wise_marks == 0) {
        return setAlert('error', 'Please Enter Question Paper Marks');
      } else if (
        questionPaperWise &&
        (qp_wise_marks < max_Marks || qp_wise_marks > max_Marks)
      ) {
        return setAlert('error', 'Selected Marks not Matched with Maximum Marks');
      }
      // if(questionPaperWise && (qp_wise_marks !== max_Marks)){

      // }
      const questionData = [],
        centralQuestionData = [];

      const sectionData = [];
      const grade_subject_mapping = [];
      const subjects = [];
      let totalMark = 0;
      let instructionValidCount = 0;
      sections.forEach((q) => {
        q.sections.forEach((sec) => {
          if (sec?.instruction?.length === 0) {
            instructionValidCount += 1;
          }
          const sectionObj = {
            [sec.name]: [],
            discription: sec.name,
            mandatory_questions: sec?.mandatory_questions,
            instruction: sec?.instruction,
            test_marks: sec?.test_marks,
          };
          if (!questionPaperWise) {
            for(let i=0;i<sec?.mandatory_questions;i++){
              totalMark += parseInt(sec?.test_marks[i].question_mark[0]);
            }
            // let marks = sec.test_marks?.forEach((item) => {
            //   totalMark += parseInt(item?.question_mark[0]);
            // });
          }
          sec.questions.forEach((question) => {
            if (question?.is_central) {
              grade_subject_mapping.push(question?.grade_subject_mapping);
            } else {
              subjects.push(question?.subject);
            }
            sectionObj[sec.name].push(question?.identifier);
            if (question?.is_central) {
              if (!centralQuestionData.includes(question.id)) {
                centralQuestionData.push(question.id, question.child_id);
              }
            } else {
              if (!questionData.includes(question.id)) {
                questionData.push(question.id, question.child_id);
              }
            }
          });
          sectionData.push(sectionObj);
        });
      });
      if (instructionValidCount !== 0) {
        return setAlert('error', 'Please Enter instructions');
      }

      if (
        (!questionPaperWise && totalMark < parseInt(max_Marks)) ||
        totalMark > parseInt(max_Marks)
      ) {
        return setAlert('error', 'Selected Marks not Matched with Maximum Marks');
      }

      let reqObj = {
        academic_year: selectedAcademicYear?.id,
        paper_name: questionPaperName,
        grade: formik.values.grade?.grade_id,
        academic_session: [selectedBranch?.id],
        grade_subject_mapping: [...new Set(grade_subject_mapping)],
        // paper_level: formik.values.question_paper_level?.id,
        subjects: [...new Set(subjects)],
        section: sectionData,
        sections: sectionData,
        is_review: isDraft ? 'False' : 'True',
        is_draft: isDraft ? 'True' : 'False',
        total_mark: qp_wise_marks,
        is_question_wise: !questionPaperWise ? 'True' : 'False',
      };
      let filterdata = {
        branch: selectedBranch,
        academic: selectedAcademicYear,
        grade: formik.values.grade,
        qpValue: {
          id: formik.values.question_paper_level?.id,
          level: formik.values.question_paper_level?.name,
        },
        type: { id: 1, flag: false, name: 'ERP' },
      };

      if (formik.values.erp_category) {
        reqObj['category'] = formik.values.erp_category?.erp_category_id;
        filterdata['category'] = formik.values.erp_category;
      }
      // if(formik.values.subject.length > 0){
      //   reqObj['subjects'] = formik.values.subject?.map((obj) => obj?.subject_id)
      //   filterdata['subject'] = formik.values.subject[0]

      // }

      if (questionData?.length) {
        reqObj = { ...reqObj, question: questionData.flat() };
      }

      if (centralQuestionData?.length) {
        reqObj = { ...reqObj, central_question: centralQuestionData.flat() };
      }

      if (isDraft) {
        reqObj.is_draft = 'True';
        reqObj.is_review = 'False';
      }

      let sectionFlag = true,
        sectionName = '';

      for (let k = 0; k < sectionData.length; k++) {
        const sectionObj = sectionData[k];
        if (sectionObj[String.fromCharCode(65 + k)].length === 0) {
          sectionName = String.fromCharCode(65 + k);
          sectionFlag = false;
          break;
        }
      }
      let submitArray = {
        Section: sectionFlag,
        'Question Paper Name': questionPaperName,
        // 'Question Level': formik.values.question_paper_level.id,
        // Subject: formik.values.subject.length,
        // Category : formik.values.category.length,
        Grade: formik.values.grade.grade_id,
      };
      // if(formik.values.category){
      //   submitArray['Category'] = formik.values.category
      // }
      // if(formik.values.subject.length){
      //   submitArray['Subject'] = formik.values.subject.length
      // }
      let finalSubmitFlag =
        Object.entries(submitArray).every(([key, value]) => value) && sectionData.length;

      if (finalSubmitFlag) {
        await dispatch(createQuestionPaper(reqObj));
        DeleteSections();
        // history.push('/assessment-question');
        // sessionStorage.removeItem('filter')
        sessionStorage.setItem('filter', JSON.stringify(filterdata));
        history.push({
          pathname: '/assessment-question',
          state: {
            isSet: 'true',
          },
        });
        setAlert('success', 'Question Paper created successfully');
        // handleResetQuestionPaper();
      } else {
        // const checkSectionLength = isDraft ? true : sectionData.length;
        const checkSectionLength = sectionData.length;
        if (checkSectionLength) {
          for (const [key, value] of Object.entries(submitArray)) {
            if (key === 'Section' && !Boolean(value))
              setAlert('error', `Please add questions for Section-${sectionName}`);
            else if (!Boolean(value)) setAlert('error', `${key} can't be empty!`);
          }
        } else {
          setAlert('error', 'At least one section is compulsory!');
        }
      }
    } catch (e) {
      setAlert('error', 'Failed to create Question Paper');
    }
  };

  const handleAddSection = () => {
    let len = sections?.length || 0;
    const sectionArray = [
      {
        id: cuid(),
        name: `${String.fromCharCode(65 + len)}`,
        questions: [],
        instruction: '',
        mandatory_questions: 1,
        test_marks: [],
      },
    ];
    const question = { id: cuid(), sections: sectionArray };
    // initAddSection(question);
    dispatch(addSection(question));
  };

  const handleDeleteQuestion = (questionId, sectionId) => {
    dispatch(deleteQuestionSection(questionId, sectionId));
  };

  return (
    <Layout>
      <div className='mx-3'>
        <div className='row'>
          {!isEdit && (
            <Button
              type='primary'
              onClick={() => {
                DeleteSections();
                history.push('/create-question-paper');
              }}
              shape='round'
              variant='contained'
              size={'small'}
              color='primary'
              className='th-br-6 th-fw-500'
            >
              <LeftOutlined size='small' />
              Back To Create Question
            </Button>
          )}
          {isEdit && (
            <Button
              type='primary'
              onClick={() => {
                DeleteSections();
                history.push({
                  pathname: '/assessment-question',
                  state: {
                    isSet: isEdit ? 'true' : 'false',
                  },
                });
              }}
              shape='round'
              variant='contained'
              size={'small'}
              color='primary'
              className='th-br-6 th-fw-500'
            >
              <LeftOutlined size='small' />
              Back To Question Paper
            </Button>
          )}
        </div>

        <div className='row my-3'>Question Paper Format/Details</div>
        <div className='row th-bg-white align-items-center'>
          <div className='col-6 px-0'>
            <Form id='filterForm' ref={formRef} layout={'horizontal'}>
              <div className='row align-items-center'>
                <div className='col-6'>
                  {/* {boardFilterArr.includes(window.location.host) && ( */}
                  {/* )} */}

                  <div className='th-fw-600'>Grade</div>
                  <Form.Item name='grade'>
                    <Select
                      allowClear
                      placeholder={
                        // filterData?.grade ? filterData?.grade?.children :
                        'Select Grade'
                      }
                      showSearch
                      optionFilterProp='children'
                      // disabled={!editFilters}
                      getPopupContainer={(trigger) => trigger.parentNode}
                      // value={formik.values.grade}
                      filterOption={(input, options) => {
                        return (
                          options.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                        );
                      }}
                      onChange={(e, value) => {
                        handleGrade(value);
                      }}
                      //   onClear={handleClearGrade}
                      className='w-100 text-left th-black-1 th-bg-grey th-br-6 mt-3'
                      bordered={false}
                    >
                      {gradeOptions}
                    </Select>
                  </Form.Item>
                </div>
                <div className='col-6'>
                  <div className='th-fw-600'>ERP Category</div>
                  <Form.Item name='erpCategory'>
                    <Select
                      allowClear
                      placeholder='ERP Category'
                      getPopupContainer={(trigger) => trigger.parentNode}
                      showSearch
                      optionFilterProp='children'
                      // disabled={!editFilters}
                      filterOption={(input, options) => {
                        return (
                          options.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                        );
                      }}
                      value={formik.values.erp_category}
                      onChange={(e, value) => {
                        handleerpCategory(value);
                      }}
                      className='w-100 text-left th-black-1 th-bg-grey th-br-6 mt-3'
                      bordered={false}
                    >
                      {erpCategories}
                    </Select>
                  </Form.Item>
                </div>
              </div>

              {/* <div className='col-md-2 col-6 px-2'>
                <div className='mb-2 text-left'>Question Level</div>
                <Form.Item name='questionlevel'>
                  <Select
                    allowClear
                    placeholder='Question Level'
                    getPopupContainer={(trigger) => trigger.parentNode}
                    showSearch
                    optionFilterProp='children'
                    filterOption={(input, options) => {
                      return (
                        options.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                      );
                    }}
                    onChange={(e, value) => {
                      //   handleQpLevel(e,value);
                    }}
                    className='w-100 text-left th-black-1 th-bg-grey th-br-6'
                    bordered={false}
                  >
                    {questionLeveloptions}
                  </Select>
                </Form.Item>
              </div> */}
            </Form>
          </div>
          {/* <div className='col-1 px-0'>
            {!editFilters && (
              <Tag
                icon={<EditOutlined />}
                color='geekblue'
                className='th-pointer th-br-6 ml-2'
                onClick={() => {
                  setEditFilters(true);
                }}
              >
                Edit
              </Tag>
            )}
          </div> */}
          <div className='col-6 text-right'>
            {/* <div className='col-md-8'>
              <div className='ml-5' style={{ color: '#2ecf87' }}> */}
            Set Maximum Marks
            {/* </div>
            </div> */}
            {/* <div className='col-md-4'> */}
            <Input
              placeholder='Marks'
              type='number'
              value={max_Marks}
              maxLength={3}
              className='w-25 mx-2 text-center'
              onChange={(e) => setMaxMarks(e.target.value)}
            />
            {/* </div> */}
          </div>
        </div>
        <div className='row th-bg-white'>
          <div className='my-2 pl-4 d-flex align-items-center'>
            <div>Question Wise</div>
            <Switch
              // defaultChecked = {questionPaperWise ? true : false}
              checked ={questionPaperWise ? true : false}
              onChange={handlequesType}
              className='mx-2'
            />
            <div>Question Paper Wise</div>
            {questionPaperWise && (
              <div className='col-md-3'>
                <Input
                  className='w-100 text-center'
                  placeholder='Marks'
                  type='text'
                  pattern='\d*'
                  maxLength={3}
                  onChange={(e) => setQp_wise_Marks(e.target.value)}
                />
              </div>
            )}
          </div>
        </div>
        <div>
          {sections?.map((question) => (
            <div className='row th-bg-white my-3'>
              {/* <SectionCard /> */}
              <Question
                grade={formik.values.grade}
                question={question}
                erpCategory={formik.values.erp_category || erpCategory}
                onDeleteSection={handleDeleteSection}
                onDeleteQuestion={handleDeleteQuestion}
                questionPaperWise={questionPaperWise}
                deleteOneSection={deleteOneSection}
              />
            </div>
          ))}
          <div className='row justify-content-end py-3'>
            <Button className='mr-3 th-button-active' onClick={handleAddSection}>
              <PlusOutlined size='small' />
              Add Section
            </Button>
          </div>
        </div>
        <div
          className='row align-items-center justify-content-end pr-5'
          style={{
            height: '58px',
            background: '#1b4ccb',
            left: 0,
            right: 0,
            bottom: 0,
            overflow: 'hidden',
            position: 'absolute',
          }}
        >
          <div className='col-md-4'>
            <Input
              placeholder='Question Paper Name'
              value={formik.values.questionPaperName}
              onChange={handleQuestionPaperName}
            />
          </div>
          <div className='col-md-1'></div>
          <div className=' mr-4'>
            <Button onClick={() => handleCreateQuestionPaper(true)}>Save As Draft</Button>
          </div>
          {!isEdit && (
            <div className=''>
              <Button onClick={() => handleCreateQuestionPaper(false)}>
                Create Paper
              </Button>
            </div>
          )}
          {isEdit && (
            <div className='col-md-2'>
              <Button onClick={() => handleEditQuestionPaper(false)}>Update Paper</Button>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default CreatequestionPaperNew;
