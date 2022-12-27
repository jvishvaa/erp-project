import React, { createRef, useContext, useEffect, useState } from 'react';
import Divider from '@material-ui/core/Divider';
import AddOutlinedIcon from '@material-ui/icons/AddOutlined';
import { Grid, TextField, Button, useTheme, SvgIcon } from '@material-ui/core';
import { useHistory } from 'react-router-dom';
import Autocomplete from '@material-ui/lab/Autocomplete';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { connect, useSelector } from 'react-redux';
// import download from '../../../assets/images/downloadAll.svg';
import { AlertNotificationContext } from '../../../../context-api/alert-context/alert-state';
import endpoints from '../../../../config/endpoints';
import axiosInstance from '../../../../config/axios';
import { Form, Select } from 'antd';
import { setFilter } from 'redux/actions';
import { PlusOutlined } from '@ant-design/icons';
// import './lesson.css';

const { Option } = Select;


const AssessmentFilters = ({
  handlePeriodList,
  setPeriodData,
  setViewMore,
  setViewMoreData,
  setFilterDataDown,
  setSelectedIndex,
  setClearFlag,
  setPage
}) => {
  const { setAlert } = useContext(AlertNotificationContext);
  const themeContext = useTheme();
  const history = useHistory();
  const formRef = createRef();
  const isMobile = useMediaQuery(themeContext.breakpoints.down('sm'));
  const wider = isMobile ? '-10px 0px' : '-10px 0px 20px 8px';
  const widerWidth = isMobile ? '98%' : '95%';
  const [academicDropdown, setAcademicDropdown] = useState([]);
  const selectedAcademicYear = useSelector(
    (state) => state.commonFilterReducer?.selectedYear
  );
  const [branchDropdown, setBranchDropdown] = useState([]);
  const [gradeDropdown, setGradeDropdown] = useState([]);
  const [subjectDropdown, setSubjectDropdown] = useState([]);
  const [qpValue, setQpValue] = useState('');
  const is_ERP_CENTRAL = [
    { id: 1, flag: false, name: 'ERP' },
    { id: 2, flag: true, name: 'CENTRAL' },
  ];
  const [isErpCategory , setIsErpCategory] = useState(false)
  const [erpCategoryDropdown, setErpGradeDropdown] = useState([]);
  const selectedBranch = useSelector(
    (state) => state.commonFilterReducer?.selectedBranch
  );

  const filterDataQP = JSON.parse(sessionStorage.getItem('filter')) || [];
  const [filterData, setFilterData] = useState({
    academic: '',
    branch: [selectedBranch],
    grade: '',
    subject: '',
    // is_erp_central: is_ERP_CENTRAL[0],
    erp_category : ''
  });
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
    if(selectedBranch && moduleId){
      handleBranch('',[selectedBranch])
    }
  },[selectedBranch,moduleId])
  // useEffect(() => {
  //   if(selectedBranch && branchDropdown){
  //     let branch = branchDropdown.filter((item) => item?.id === selectedBranch?.id)
  //     handleBranch('',branch)

  //   }
  // },[selectedBranch,branchDropdown])

const getErpCategory = () => {
  axiosInstance
      .get(`${endpoints.questionBank.erpCategory}`)
      .then((result) => {
        setErpGradeDropdown(result?.data?.result)
      })
      .catch((error) => {
        setAlert('error', error?.message);
      });
}

useEffect(() => {
if(filterData?.grade && (filterData?.subject || filterData?.erp_category)){
  handleFilter()
}
},[filterData?.subject,qpValue,filterData?.erp_category])

  // useEffect(() => {
  //   if (moduleId && selectedAcademicYear) {
  //     handleAcademicYear();
  //     getErpCategory()
  //     if(history?.location?.state?.isSet == 'true'){
  //     // if(filterDataQP?.branch){
  //     //   handleBranch(filterDataQP , filterDataQP?.branch)
  //     // }
  //     formRef.current.setFieldsValue({
  //       grade : filterDataQP?.grade,
  //       // subject: filterDataQP?.subject,
  //       // questionlevel : 

  //     });
  //     // handleBranch('',[selectedBranch])
  //     handleGrade('',filterDataQP?.grade)
  //     // handleSubject('' , filterDataQP?.subject)
  //     setFilterData({
  //       branch : filterDataQP?.branch,
  //       grade: filterDataQP?.grade,
  //       subject: filterDataQP?.subject,
  //       // erp_category : filterDataQP?.category,
  //       is_erp_central: filterDataQP?.type,
  //       academic : selectedAcademicYear,
  //     })
  //     if(filterDataQP?.category){
  //       setIsErpCategory(true)
  //     }
  //     if(filterDataQP?.subject){
  //       setSub()
  //     }
  //     if(filterDataQP?.qpValue){
  //       setQpValue(filterDataQP?.qpValue)
  //     }
  //     handlePeriodList(
  //       filterDataQP?.type,
  //       selectedAcademicYear,
  //       filterDataQP?.branch,
  //       filterDataQP?.grade,
  //       filterDataQP?.subject,
  //       filterDataQP?.qpValue,
  //       // filterDataQP?.category,
  //     );
  //     }
  //   }
  // }, [moduleId, selectedAcademicYear]);

  const setSub = () => {
    const acadSessionIds = filterDataQP?.branch.map(({ id }) => id) || [];
    axiosInstance
    .get(
      `${endpoints.assessmentErp.subjectList}?session_year=${acadSessionIds}&grade=${filterDataQP?.grade?.value}`
    )
    .then((result) => {
      if (result?.data?.status_code === 200) {
        setSubjectDropdown(result?.data?.result);
      } else {
        setAlert('error', result?.data?.message);
      }
    })
    .catch((error) => {
      setAlert('error', error?.message);
    });
  }

  const handleClear = () => {
    setClearFlag((prev) => !prev);
    setFilterData({
      academic: '',
      branch: [],
      grade: '',
      subject: '',
      erp_category: '',
    });
    setPeriodData([]);
    setGradeDropdown([]);
    setSubjectDropdown([]);
    setViewMoreData({});
    setViewMore(false);
    setFilterDataDown({});
    setSelectedIndex(-1);
    setQpValue('');
    sessionStorage.removeItem('filter')
    // history.replace({ state: { isSet: false } })
  };

  const handleClearQuestionLevel = () => {
    setQpValue('');
  }

  const handleAcademicYear = (event, value) => {
    setFilterData({
      academic: '',
      branch: [],
      grade: '',
      subject: '',
    });
    setBranchDropdown([]);
    setGradeDropdown([]);
    setSubjectDropdown([]);
    // if (value) {
    setFilterData({
      ...filterData,
      academic: selectedAcademicYear,
    });
    axiosInstance
      .get(
        `${endpoints.academics.branches}?session_year=${selectedAcademicYear?.id}&module_id=${moduleId}`
      )
      .then((result) => {
        if (result?.data?.status_code === 200) {
          const selectAllObject = {
            session_year: {},
            id: 'all',
            branch: { id: 'all', branch_name: 'Select All' },
          };
          const data = [selectAllObject, ...result?.data?.data?.results];
          // let branch = data.filter((item) => item?.id === selectedBranch?.id)
          // handleBranch('',branch)
          setBranchDropdown(data);
        } else {
          setAlert('error', result?.data?.message);
        }
      })
      .catch((error) => {
        setAlert('error', error?.message);
      });
    // }
  };
  const handleerpCategory = (event, value) => {
    setPage(1)
    setFilterData({ ...filterData, erp_category: '',subject:'' });
    formRef.current.setFieldsValue({
      subject: null,
    });
    // setLoading(true);
    setIsErpCategory(false)
    if (value) {
      setIsErpCategory(true)
      formRef.current.setFieldsValue({
        subject: null,
      });
      setFilterData({ ...filterData, erp_category: value,subject:'' });
      // setLoading(false);
    } else {
      // setLoading(false);
    }
  };

  const handleBranch = (event, value) => {
   setFilterData({
      ...filterData,
      branch: [],
      grade: '',
      subject: '',
    });
    setGradeDropdown([]);
    setSubjectDropdown([]);
    getErpCategory()
    if (value?.length > 0) {
      value =
        value.filter(({ id }) => id === 'all').length === 1
          ? [...branchDropdown].filter(({ id }) => id !== 'all')
          : value;
      const branchIds = value.map((element) => element?.branch?.id) || [];
      setFilterData({ ...filterData, branch: value });
      axiosInstance
        .get(
          `${endpoints.academics.grades}?session_year=${selectedAcademicYear?.id}&branch_id=${branchIds}&module_id=${moduleId}`
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
    }
  };

  const handleGrade = (event, value) => {
    setPage(1)
    formRef.current.setFieldsValue({
      subject: null,
      // board: null,
    });
    setFilterData({
      ...filterData,
      grade: '',
      subject: '',
    });
    sessionStorage.removeItem('filter')
    setQpValue('');
    setPeriodData([]);
    setSubjectDropdown([]);
    if (value) {
      setFilterData({ ...filterData, grade: value, subject:'' });
      const acadSessionIds = filterData.branch.map(({ id }) => id) || [];
      axiosInstance
        .get(
          `${endpoints.assessmentErp.subjectList}?session_year=${acadSessionIds}&grade=${value?.value}`
        )
        .then((result) => {
          if (result?.data?.status_code === 200) {
            setSubjectDropdown(result?.data?.result);
          } else {
            setAlert('error', result?.data?.message);
          }
        })
        .catch((error) => {
          setAlert('error', error?.message);
        });
    }
  };
  const handleIsErpCentral = (event, value) => {
    if (value) {
      setFilterData({ ...filterData, is_erp_central: value });
    }
  }

  const handleSubject = (event, value) => {
    setPage(1)
    setFilterData({ ...filterData, subject: '' });
    // setQpValue('');
    formRef.current.setFieldsValue({
      erpCategory: null,
    });
    setPeriodData([]);
    if (value) {
      setFilterData({ ...filterData, subject: value });
      // handleFilter()
      formRef.current.setFieldsValue({
        erpCategory: null,
      });
    }
  };

  const handleQpLevel = (event, value) => {
    setPage(1)
    setPeriodData([]);
    if (value) {
      setQpValue(value);
    }
  };

  const handleFilter = () => {
    // if (filterData?.branch.length === 0) {
    //   setAlert('error', 'Select Branch!');
    //   return;
    // }
    if (!filterData?.grade) {
      setAlert('error', 'Select Grade!');
      return;
    }
    if (!filterData?.subject && !filterData?.erp_category?.key) {
      setAlert('error', 'Select Subject or erp category!');
      return;
    }


    // if (!qpValue) {
    //   setAlert('error', 'Select QP Level!');
    //   return;
    // }
    // if (!filterData?.is_erp_central) {
    //   setAlert('error', `Select Question Paper From! ${filterData?.is_erp_central?.name}`);
    //   return;
    // }
    setSelectedIndex(-1);
    handlePeriodList(
      filterData.is_erp_central,
      filterData.academic || selectedAcademicYear,
      filterData.branch,
      filterData.grade,
      filterData.subject,
      qpValue,
      filterData?.erp_category,
    );
  };
  const handleClearSubject = () => {
    setFilterData({...filterData , subject : ''})
  }
  const handleClearGrade = () => {
    setFilterData({...filterData , grade : '' , subject : ''})
    setSubjectDropdown([])
  }

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
    // <Grid
    //   container
    //   spacing={isMobile ? 3 : 5}
    //   style={{ width: widerWidth, margin: wider }}
    // >
    //   {/* <Grid item xs={12} sm={3} className={isMobile ? '' : 'filterPadding'}>
    //     <Autocomplete
    //       style={{ width: '100%' }}
    //       size='small'
    //       onChange={handleAcademicYear}
    //       id='academic-year'
    //       className='dropdownIcon'
    //       value={filterData.academic || ''}
    //       options={academicDropdown || []}
    //       getOptionLabel={(option) => option?.session_year || ''}
    //       filterSelectedOptions
    //       renderInput={(params) => (
    //         <TextField
    //           {...params}
    //           variant='outlined'
    //           label='Academic Year'
    //           placeholder='Academic Year'
    //         />
    //       )}
    //     />
    //   </Grid> */}
    //   <Grid item xs={12} sm={3} className={isMobile ? '' : 'filterPadding'}>
    //     <Autocomplete
    //       style={{ width: '100%' }}
    //       size='small'
    //       onChange={handleBranch}
    //       id='branch'
    //       multiple
    //       limitTags={2}
    //       className='dropdownIcon'
    //       value={filterData.branch || []}
    //       options={branchDropdown || []}
    //       getOptionLabel={(option) => option?.branch?.branch_name || ''}
    //       filterSelectedOptions
    //       renderInput={(params) => (
    //         <TextField
    //           {...params}
    //           variant='outlined'
    //           label='Branch'
    //           placeholder='Branch'
    //           required
    //         />
    //       )}
    //     />
    //   </Grid>
    //   <Grid item xs={12} sm={3} className={isMobile ? '' : 'filterPadding'}>
    //       <Autocomplete
    //         style={{ width: '100%' }}
    //         size='small'
    //         onChange={handleerpCategory}
    //         id='Category'
    //         className='dropdownIcon'
    //         value={filterData?.erp_category || {}}
    //         options={erpCategoryDropdown || []}
    //         getOptionLabel={(option) => option?.erp_category_name || ''}
    //         filterSelectedOptions
    //         renderInput={(params) => (
    //           <TextField
    //             {...params}
    //             variant='outlined'
    //             label='ERP Category'
    //             placeholder='ERP Category'
    //           />
    //         )}
    //       />
    //     </Grid>

    //   <Grid item xs={12} sm={3} className={isMobile ? '' : 'filterPadding'}>
    //     <Autocomplete
    //       style={{ width: '100%' }}
    //       size='small'
    //       onChange={handleGrade}
    //       id='grade'
    //       className='dropdownIcon'
    //       value={filterData.grade || ''}
    //       options={gradeDropdown || []}
    //       getOptionLabel={(option) => option?.grade__grade_name || ''}
    //       filterSelectedOptions
    //       renderInput={(params) => (
    //         <TextField {...params} variant='outlined' label='Grade' placeholder='Grade' required/>
    //       )}
    //     />
    //   </Grid>
    //   {!isErpCategory && <Grid item xs={12} sm={3} className={isMobile ? '' : 'filterPadding'}>
    //     <Autocomplete
    //       style={{ width: '100%' }}
    //       size='small'
    //       onChange={handleSubject}
    //       id='subject'
    //       className='dropdownIcon'
    //       value={filterData.subject || ''}
    //       options={subjectDropdown || []}
    //       getOptionLabel={(option) => option?.subject_name || ''}
    //       filterSelectedOptions
    //       renderInput={(params) => (
    //         <TextField
    //           {...params}
    //           variant='outlined'
    //           label='Subject'
    //           placeholder='Subject'
    //           required
    //         />
    //       )}
    //     />
    //   </Grid>}
    //   <Grid item xs={12} sm={3} className={isMobile ? '' : 'filterPadding'}>
    //     <Autocomplete
    //       style={{ width: '100%' }}
    //       size='small'
    //       onChange={handleQpLevel}
    //       id='questionpaperLevel'
    //       className='dropdownIcon'
    //       value={qpValue || ''}
    //       options={qpLevel || []}
    //       getOptionLabel={(option) => option?.level || ''}
    //       filterSelectedOptions
    //       renderInput={(params) => (
    //         <TextField
    //           disabled
    //           {...params}
    //           variant='outlined'
    //           label='Question Paper Level'
    //           placeholder='Question Paper Level'
    //           required
    //         />
    //       )}
    //     />
    //   </Grid>
    //   <Grid item xs={12} sm={3} className={isMobile ? '' : 'filterPadding'}>
    //     <Autocomplete
    //       style={{ width: '100%' }}
    //       size='small'
    //       onChange={handleIsErpCentral}
    //       id='Question Type'
    //       className='dropdownIcon'
    //       value={filterData?.is_erp_central || {}}
    //       options={is_ERP_CENTRAL || []}
    //       getOptionLabel={(option) => option?.name || ''}
    //       filterSelectedOptions
    //       renderInput={(params) => (
    //         <TextField
    //           {...params}
    //           variant='outlined'
    //           label='Question Paper From'
    //           placeholder='Question Paper From'
    //           required
    //         />
    //       )}
    //     />
    //   </Grid>
    //   {!isMobile && (
    //     <Grid item xs={12} sm={12}>
    //       <Divider />
    //     </Grid>
    //   )}
    //   {isMobile && <Grid item xs={3} sm={0} />}
    //   <Grid item xs={6} sm={2} className={isMobile ? '' : 'addButtonPadding'}>
    //     <Button
    //       variant='contained'
    //       style={{ width: '100%' }}
    //       className='cancelButton labelColor'
    //       size='medium'
    //       onClick={handleClear}
    //     >
    //       Clear All
    //     </Button>
    //   </Grid>
    //   {isMobile && <Grid item xs={3} sm={0} />}
    //   {isMobile && <Grid item xs={3} sm={0} />}
    //   <Grid item xs={6} sm={2} className={isMobile ? '' : 'addButtonPadding'}>
    //     <Button
    //       variant='contained'
    //       color='primary'
    //       style={{ color: 'white', width: '100%' }}
    //       size='medium'
    //       onClick={handleFilter}
    //     >
    //       Filter
    //     </Button>
    //   </Grid>
    //   {isMobile && <Grid item xs={3} sm={0} />}
    //   {isMobile && <Grid item xs={3} sm={0} />}
    //   <Grid
    //     item
    //     xs={6}
    //     sm={2}
    //     className={isMobile ? 'createButton' : 'createButton addButtonPadding'}
    //   >
    //     <Button
    //       startIcon={<AddOutlinedIcon style={{ fontSize: '30px' }} />}
    //       variant='contained'
    //       style={{ color: 'white', width: '100%' }}
    //       color='primary'
    //       onClick={() =>
    //         history.push({
    //           pathname: '/create-question-paper',
    //           search: 'show-question-paper=true',
    //           state: { refresh: true },
    //         })
    //       }
    //       size='medium'
    //     >
    //       Create
    //     </Button>
    //   </Grid>
    //   {isMobile && <Grid item xs={3} sm={0} />}
    // </Grid>
    <div className='row th-bg-white'>
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
                      onClear={handleClearGrade}
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
                            options.children.toLowerCase().indexOf(input.toLowerCase()) >=
                            0
                          );
                        }}
                        onChange={(e,value) => {
                          handleerpCategory(e,value);
                        }}
                        
                        className='w-100 text-left th-black-1 th-bg-grey th-br-6'
                        bordered={false}
                      >
                        {erpCategories}
                      </Select>
                    </Form.Item>
                  </div>
                {!isErpCategory && <div className='col-md-2 col-6 px-2'>
                  <div className='mb-2 text-left'>Subject</div>
                  <Form.Item name='subject'>
                    <Select
                    allowClear
                      placeholder={
                        filterData?.subject ?  (
                          <span className='th-black-1'>{filterData?.subject?.children}</span>
                        ) :
                        'Select Subject'
                      }
                      // value={filterData?.subject}
                      showSearch
                      getPopupContainer={(trigger) => trigger.parentNode}
                      optionFilterProp='children'
                      // defaultValue={subjectName}
                      filterOption={(input, options) => {
                        return (
                          options.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                        );
                      }}
                      onChange={(e, value) => {
                        handleSubject(e,value);
                      }}
                      disabled = {isErpCategory}
                      onClear={handleClearSubject}
                      className='w-100 text-left th-black-1 th-bg-grey th-br-6'
                      bordered={false}
                    >
                      {subjectOptions}
                    </Select>
                  </Form.Item>
                </div>}
                <div className='col-md-2 col-6 px-2'>
                    <div className='mb-2 text-left'>Question Level</div>
                    <Form.Item name='questionlevel'>
                      <Select
                        allowClear
                        placeholder='Question Level'
                        getPopupContainer={(trigger) => trigger.parentNode}
                        showSearch
                        optionFilterProp='children'
                        onClear={handleClearQuestionLevel}
                        filterOption={(input, options) => {
                          return (
                            options.children.toLowerCase().indexOf(input.toLowerCase()) >=
                            0
                          );
                        }}
                        onChange={(e,value) => {
                          handleQpLevel(e,value);
                        }}
                        
                        className='w-100 text-left th-black-1 th-bg-grey th-br-6'
                        bordered={false}
                      >
                        {questionLeveloptions}
                      </Select>
                    </Form.Item>
                  </div>
                  {isErpCategory && <div className='col-md-2 col-6 px-2'></div>}
                <div
                  className='col-md-4 col-6 text-right pr-0'
                >
                  <div className='row justify-content-end pr-1'> <Button
                    type='primary'
                    onClick={() => history.push('/create-question-paper')}
                    shape="round"
                    variant='contained'
                    size={'small'}
                    color='primary'
                    className='th-br-6 th-width-48 th-fw-500'
                  >
                    <PlusOutlined size='small' className='mr-2' />
                    Create New
                  
                  </Button></div>
                 
                </div>
              </div>
            </Form>
          </div>
          </div>
  );
};

export default AssessmentFilters;
