import React, { createRef, useContext, useEffect, useState } from 'react';
import Divider from '@material-ui/core/Divider';
import AddOutlinedIcon from '@material-ui/icons/AddOutlined';
import { Grid, TextField, Button, useTheme, SvgIcon } from '@material-ui/core';
import { useHistory } from 'react-router-dom';
import Autocomplete from '@material-ui/lab/Autocomplete';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { connect, useSelector,useDispatch } from 'react-redux';
// import download from '../../../assets/images/downloadAll.svg';
import { AlertNotificationContext } from '../../../context-api/alert-context/alert-state';
import endpoints from '../../../config/endpoints';
import axiosInstance from '../../../config/axios';
import { Breadcrumb, Form, message, Select } from 'antd';
import { addSection, setFilter } from 'redux/actions';
import { PlusOutlined } from '@ant-design/icons';
import { useFormik } from 'formik';
import cuid from 'cuid';
import Layout from 'containers/Layout';

// import './lesson.css';

const { Option } = Select;

const Filters = () => {
  const { setAlert } = useContext(AlertNotificationContext);
  const themeContext = useTheme();
  const history = useHistory();
  const dispatch = useDispatch();
  const formRef = createRef();
  const isMobile = useMediaQuery(themeContext.breakpoints.down('sm'));
  const wider = isMobile ? '-10px 0px' : '-10px 0px 20px 8px';
  const widerWidth = isMobile ? '98%' : '95%';
  const [academicDropdown, setAcademicDropdown] = useState([]);
  const selectedAcademicYear = useSelector(
    (state) => state.commonFilterReducer?.selectedYear
  );
  const sections = useSelector((state) => state.createQuestionPaper.questions)
  const is_ERP_CENTRAL = [
    { id: 1, flag: false, name: 'ERP' },
    { id: 2, flag: true, name: 'CENTRAL' },
  ];
  const [erpCategory, setErpCategory] = useState();
  const [selectedGrade , setSelectedGrade] = useState()
  const [erpCategoryDropdown, setErpGradeDropdown] = useState([]);
  const [gradeDropdown, setGradeDropdown] = useState([]);
  const [subjectDropdown, setSubjectDropdown] = useState([]);

  const selectedBranch = useSelector(
    (state) => state.commonFilterReducer?.selectedBranch
  );

  const filterDataQP = JSON.parse(sessionStorage.getItem('filter')) || [];
  // question level input
  const qpLevel = [
    { id: 1, level: 'Easy' },
    { id: 2, level: 'Average' },
    { id: 3, level: 'Difficult' },
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
            if (item.child_name === 'Question Paper') {
              setModuleId(item.child_id);
            }
          });
        }
      });
    }
  }, []);

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

  const erpCategories = erpCategoryDropdown?.map((each) => {
    return (
      <Option key={each?.id} value={each.erp_category_id}>
        {each?.erp_category_name}
      </Option>
    );
  });
  useEffect(() => {
    if (selectedBranch && moduleId) {
      getGrades();
      getErpCategory()
    }
  }, [selectedBranch, moduleId]);

  const getErpCategory = () => {
    axiosInstance
      .get(`${endpoints.questionBank.erpCategory}`)
      .then((result) => {
        setErpGradeDropdown(result?.data?.result);
      })
      .catch((error) => {
        setAlert('error', error?.message);
      });
  };
  // const fetchSubjectData = (params = {}) => {
  //   axiosInstance
  //     .get(`${endpoints.lessonPlan.subjects}`, {
  //       params: { ...params },
  //     })
  //     .then((res) => {
  //       if (res.data.status_code === 200) {
  //           setSubjectDropdown(res.data.result);
  //       }
  //     })
  //     .catch((error) => {
  //       message.error(error.message);
  //     });
  // };
  const handleerpCategory = (event, value) => {
    setErpCategory();
    if (value) {
      setErpCategory(value);
    } else {
      setErpCategory()
    }
  };

const handleGrade = (e,value) => {
  setSelectedGrade()
if(value){
  setSelectedGrade(value)
//   let params = {
//     session_year: selectedAcademicYear?.id,
//     branch_id: selectedBranch?.branch?.id,
//     module_id: moduleId,
//     grade: value?.value,
// }
// fetchSubjectData(params)
}else{
  setSelectedGrade()
}
}

  const handleAddSection = (i) => {
    let len = sections?.length || 0;
    const sectionArray = [
      {
        id: cuid(),
        name: `${String.fromCharCode(65 + i)}`,
        questions: [],
        instruction:'',
        mandatory_questions : 1,
        test_marks : []
      },
    ];
    const question = { id: cuid(), sections: sectionArray };
    // initAddSection(question);
    dispatch(addSection(question));
  };

  // const handleSubject = (value) => {
    
  //   if(value){
  //       let subject = subjectDropdown?.filter((item) => item?.subject_id === value?.value)
  //       // formik.setFieldValue('subject',subject[0])
  //   }else{
  //       // formik.setFieldValue('subject','')
  //   }
  // }


  const handleSectionCount = (count) => {
    if(!selectedGrade){
      return setAlert('error', "Please Select Grade")
    }
    else {
      for(let i=0;i<count;i++){
      handleAddSection(i)
    }
    history.push({
        pathname : '/createquestionpaper',
        state : {
            sectionCount : count,
            Grade : selectedGrade,
            erpCategory : erpCategory
        }
    })
  }
  }

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

  const gradeOptions = gradeDropdown?.map((each) => {
    return (
      <Option key={each?.id} value={each.grade_id}>
        {each?.grade_name}
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

  return (
    <Layout>
      <div className='row py-3 px-2' style={{ zIndex: 2 }}>
        <Breadcrumb separator='>'>
          <Breadcrumb.Item className='th-grey th-16'>
            Assessment
          </Breadcrumb.Item>
          <Breadcrumb.Item className='th-black-1 th-16' href='/assessment-question'>Question Paper</Breadcrumb.Item>
          <Breadcrumb.Item className='th-black-1 th-16'>Create</Breadcrumb.Item>

        </Breadcrumb>
      </div>
      <div className='row th-bg-white py-2 mx-3 '>
        <div className='col-12'>
          <Form id='filterForm' ref={formRef} layout={'horizontal'}>
            <div className='row align-items-center'>
              {/* {boardFilterArr.includes(window.location.host) && ( */}
              {/* )} */}
              <div className='col-md-2 col-6 px-1'>
                <div className='mb-2 text-left'>Grade</div>
                <Form.Item name='grade'>
                  <Select
                    allowClear
                    placeholder={
                      // filterData?.grade ? filterData?.grade?.children :
                      'Select Grade'
                    }
                    showSearch
                    optionFilterProp='children'
                    getPopupContainer={(trigger) => trigger.parentNode}
                    filterOption={(input, options) => {
                      return (
                        options.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                      );
                    }}
                    onChange={(e, value) => {
                      handleGrade(e,value);
                    }}
                    //   onClear={handleClearGrade}
                    className='w-100 text-left th-black-1 th-bg-grey th-br-6'
                    bordered={false}
                  >
                    {gradeOptions}
                  </Select>
                </Form.Item>
              </div>
              <div className='col-md-2 col-6 px-2'>
                <div className='mb-2 text-left'>Erp Category</div>
                <Form.Item name='erpCategory'>
                  <Select
                    allowClear
                    placeholder='Erp Category'
                    getPopupContainer={(trigger) => trigger.parentNode}
                    showSearch
                    optionFilterProp='children'
                    filterOption={(input, options) => {
                      return (
                        options.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                      );
                    }}
                    onChange={(e, value) => {
                      handleerpCategory(e, value);
                    }}
                    className='w-100 text-left th-black-1 th-bg-grey th-br-6'
                    bordered={false}
                  >
                    {erpCategories}
                  </Select>
                </Form.Item>
              </div>
              {/* {!erpCategory && <div className='col-md-2 col-6'>
                  <div className='mb-2 text-left'>Subject</div>
                  <Form.Item name='subject'>
                    <Select
                      allowClear
                      placeholder= 'Subject'
                      showSearch
                      // disabled={user_level == 13}
                      optionFilterProp='children'
                      getPopupContainer={(trigger) => trigger.parentNode}
                      filterOption={(input, options) => {
                        return (
                          options.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                        );
                      }}
                      onChange={(e,value) => {
                        handleSubject(value);
                      }} 
                      // onClear={handleClearGrade}
                      className='w-100 text-left th-black-1 th-bg-grey th-br-4'
                      bordered={false}
                    >
                      {subjectOptions}
                    </Select>
                  </Form.Item>
                </div>} */}
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
            </div>
          </Form>
        </div>
        <div className = 'col-md-12'>
            <div className='row'>
                Choose Question Template
            </div>
            <hr />
            <div className='row col-md-12 th-bg-grey justify-content-center'>
                <div className='col-md-2 th-bg-white mr-3 mt-4 th-pointer' onClick={() => handleSectionCount(1)} style={{height : '200px'}}>1 Section</div>
                <div className='col-md-2 th-bg-white m-4 th-pointer' onClick={() => handleSectionCount(2)} style={{height : '200px'}}> 2 Section</div>
                <div className='col-md-2 th-bg-white m-4 th-pointer' onClick={() => handleSectionCount(4)} style={{height : '200px'}}>4 Section</div>
                <div className='col-md-2 th-bg-white m-4 th-pointer' onClick={() => handleSectionCount(6)} style={{height : '200px'}}>6 Section</div>
                <div className='col-md-2 th-bg-white ml-3 mt-4 th-pointer' onClick={() => handleSectionCount(8)} style={{height : '200px'}}>8 Section</div>

            </div>
        </div>
      </div>
    </Layout>
  );
};

export default Filters;
