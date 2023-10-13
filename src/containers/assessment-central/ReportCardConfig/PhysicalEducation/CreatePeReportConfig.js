import React, { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { DownOutlined, MinusCircleOutlined, PlusCircleOutlined } from '@ant-design/icons';
import { Breadcrumb, Button, Checkbox, Divider, Form, Select, message } from 'antd';
import axiosInstance from 'config/axios';
import endpoints from 'config/endpoints';
import Layout from 'containers/Layout';
import PeReportCardActivity from './PeReportCardActivity';

const CreatePeReportConfig = () => {
  const { Option } = Select;
  const formRef = useRef();
  const NavData = JSON.parse(localStorage.getItem('navigationData')) || {};
  const [moduleId, setModuleId] = useState('');
  const selectedYear = useSelector((state) => state.commonFilterReducer?.selectedYear);
  const [branchList, setBranchList] = useState([]);
  const [selectedBranch, setSelectedBranch] = useState('');
  const [gradeList, setGradeList] = useState([]);
  const [selectedGrade, setSelectedGrade] = useState('');
  const [semesterList, setSemesterList] = useState([]);
  const [categoryList, setCategoryList] = useState([]);
  const [activityList, setActivityList] = useState([]);
  const [fakeState, setFakeState] = useState('');
  const [terms, setTerms] = useState([
    {
      semester_id: '',
      activities: [
        {
          activity_type_id: '',
          criterias: [],
        },
      ],
    },
  ]);

  const newSemester = [
    {
      activity_type_id: '',
      criterias: [],
    },
  ];

  const newTermsObj = {
    semester_id: '',
    activities: newSemester,
  };

  useEffect(() => {
    fetchSemester();
    // fetchCategory();
  }, []);

  useEffect(() => {
    if (NavData && NavData.length) {
      NavData.forEach((item) => {
        if (
          item.parent_modules === 'Assessment' &&
          item.child_module &&
          item.child_module.length > 0
        ) {
          item.child_module.forEach((item) => {
            if (item.child_name === 'Report Card Config') {
              setModuleId(item.child_id);
            }
          });
        }
      });
    }
  }, [window.location.pathname]);

  useEffect(() => {
    if (moduleId && selectedYear) {
      fetchBranches(selectedYear?.id);
    }
  }, [moduleId, selectedYear]);

  const fetchBranches = async () => {
    axiosInstance
      .get(
        `${endpoints.academics.branches}?session_year=${selectedYear?.id}&module_id=${moduleId}`
      )
      .then((res) => {
        if (res?.data?.status_code == 200) {
          // const allBranchData = res?.data?.data?.results.map((item) => item.branch);
          setBranchList(res?.data?.data?.results);
          console.log(res?.data?.data?.results);
        } else {
          message.error(res?.data?.message);
        }
      });
  };

  const fetchGrade = async (branch) => {
    try {
      const result = await axiosInstance.get(
        `${endpoints.communication.grades}?session_year=${selectedYear.id}&branch_id=${branch}&module_id=${moduleId}`
      );
      if (result.data.status_code === 200) {
        setGradeList(result.data.data);
      } else {
        message.error(result.data.message);
      }
    } catch (error) {
      message.error(error.message);
    }
  };

  const fetchSemester = () => {
    axiosInstance
      .get(`${endpoints.reportCardConfig.reportcardsubcomponent}`)
      .then((res) => {
        setSemesterList(res.data.result);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  // const fetchCategory = () => {
  //   axiosInstance
  //     .get(`${endpoints.peReportCardConfig.categoryList}`, {
  //       headers: {
  //         'X-DTS-Host': X_DTS_HOST,
  //       },
  //     })
  //     .then((result) => {
  //       console.log({ result });
  //       if (result?.data?.status_code === 200) {
  //         setCategoryList(result?.data?.sub_types);
  //       }
  //     })
  //     .catch((error) => {
  //       console.log(error?.message);
  //     });
  // };

  const branchListOptions = branchList?.map((each) => {
    console.log({ each });
    return (
      <Option key={each?.branch?.id} value={each?.branch?.id}>
        {each?.branch?.branch_name}
      </Option>
    );
  });

  const gradeOptions = gradeList?.map((each) => {
    return (
      <Option key={each?.grade_id} value={each.grade_id}>
        {each?.grade__grade_name}
      </Option>
    );
  });

  console.log({ semesterList });

  const semesterOptions = semesterList?.map((each) => {
    return (
      <Option key={each?.id} value={each.id}>
        {each?.sub_component_name}
      </Option>
    );
  });

  const handleChangeBranch = (each) => {
    console.log(each, 'testing');
    if (each.length > 0) {
      if (each.some((item) => item === 'all')) {
        //   const allBranch = branchList.map((item) => {
        //     console.log(item);
        //   });
        console.log(
          branchList.map((item) => item?.branch?.id),
          'branchhhh'
        );
        // const allBranch = branchList.map((item) => item);
        const allBranch = branchList.map((item) => item?.branch?.id);
        console.log({ allBranch });
        setSelectedBranch(allBranch);
        fetchGrade(allBranch);
        formRef.current.setFieldsValue({
          branch: branchList.map((item) => item?.branch?.id),
          grade: null,
        });
      } else {
        const singleBranch = each.map((item) => item);
        setSelectedBranch(singleBranch);
        console.log({ singleBranch });
        console.log({ selectedBranch });
        fetchGrade(singleBranch);
        formRef.current.setFieldsValue({
          grade: null,
        });
      }
    } else {
      setSelectedBranch([]);
      setSelectedGrade(null);
      setGradeList([]);
    }
  };

  const handleClearBranch = () => {
    setSelectedBranch([]);
  };

  const handleChangeGrade = (e, value) => {
    if (e) {
      setSelectedGrade(e);
    } else {
      setSelectedGrade(null);
      formRef.current.setFieldsValue({
        grade: null,
      });
    }
  };

  const handleAddTerms = () => {
    let newTerms = [...terms, newTermsObj];
    setTerms(newTerms);
  };

  const handleRemoveTerms = (termIndex) => {
    console.log({ termIndex });
    let remainsTerm = terms?.filter((item, index) => index !== termIndex);
    setTerms(remainsTerm);
  };

  const handleAddTermsActivity = (termIndex) => {
    console.log('termdet', termIndex, terms[termIndex]?.activities);
    let newActivity = [...terms[termIndex]?.activities, ...newSemester];
    console.log({ newActivity }, termIndex);
    let updatedTerms = [...terms];
    updatedTerms[termIndex].activities = newActivity;
    console.log('final term', terms);
    setTerms(updatedTerms);
  };

  console.log({ terms });

  const handleSemester = (e, value, termIndex) => {
    if (e) {
      let updatedTerms = [...terms];
      updatedTerms[termIndex].semester_id = e;
      setTerms(updatedTerms);
    } else {
      let updatedTerms = [...terms];
      updatedTerms[termIndex].semester_id = '';
      setTerms(updatedTerms);
    }
  };

  // const handleAllActivity = (e, termIndex, semIndex) => {
  //   console.log(e.target.checked);
  //   if (e.target.checked) {
  //     terms[termIndex].activities[semIndex].activity = [];
  //     const allActivity = semesterList.map((item) => item?.id);
  //     console.log({ allActivity });
  //     let updatedTerms = [...terms];
  //     updatedTerms[termIndex].activities[semIndex].activity = allActivity;
  //     setTerms(updatedTerms);
  //     formRef.current.setFieldsValue({
  //       [`activity${termIndex}${semIndex}`]: allActivity,
  //     });
  //     setFakeState(cuid());
  //   } else {
  //     let updatedTerms = [...terms];
  //     updatedTerms[termIndex].activities[semIndex].activity = [];
  //     setTerms(updatedTerms);
  //   }
  //   setFakeState(cuid());
  // };

  const handleReportCardConfig = () => {
    if (!selectedBranch) {
      message.error('Please select branch');
      return;
    }
    if (!selectedGrade) {
      message.error('Please select grade');
      return;
    }

    const isSemesterNull = terms.filter(function (el) {
      return el.semester_id == '' || el.semester_id == undefined;
    });

    if (isSemesterNull.length > 0) {
      message.error('Please select all semester');
      return;
    }

    let semesterdetailsArr = terms.map((item) => item.activities).flat();

    console.log('sd', semesterdetailsArr.flat());

    const isCategoryNull = semesterdetailsArr.filter(function (el) {
      return el.activity_type_id == '' || el.activity_type_id == undefined;
    });

    if (isCategoryNull.length > 0) {
      message.error('Please select all category');
      return;
    }

    const isActivityNull = semesterdetailsArr.filter(function (el) {
      return el.criterias == '' || el.criterias == undefined || el.criterias.length < 1;
    });

    if (isActivityNull.length > 0) {
      message.error('Please select all activity');
      return;
    }
    submitReportCardConfig();
    // console.log({ isCategoryNull });

    console.log(terms?.flat());
  };

  const submitReportCardConfig = () => {
    let formData = {
      session_year_id: selectedYear?.id,
      branch_id: selectedBranch,
      grade_id: selectedGrade,
      semester: [...terms],
    };

    console.log({ formData });
    axiosInstance
      .post(`${endpoints.peReportCardConfig.addConfig}`, formData)
      .then((result) => {
        if (result?.data?.status_code === 200) {
          message.success('Submited successfully');
        } else {
          message.error(result?.data?.message);
        }
        console.log({ result });
      })
      .catch((error) => {
        console.log('err', error);
        message.error(error?.response?.data?.message);
      });
  };

  console.log({ terms });

  return (
    <React.Fragment>
      <Layout>
        <div className='row pt-3 pb-2'>
          <div className='col-md-6 th-bg-grey' style={{ zIndex: 2 }}>
            <Breadcrumb separator='>'>
              <Breadcrumb.Item className='th-black-1 th-16 th-grey'>
                Assessment
              </Breadcrumb.Item>
              <Breadcrumb.Item className='th-black-1 th-16'>
                Report Card Config
              </Breadcrumb.Item>
            </Breadcrumb>
          </div>
        </div>
        <div className='row mb-3'>
          <div className='col-md-12'>
            <div className='th-bg-white th-br-5 py-3 px-2 shadow-sm'>
              <Form id='form' className='mt-1' layout={'vertical'} ref={formRef}>
                <div className='row'>
                  <div className='col-md-3 col-sm-6 col-12'>
                    <div className='text-left'>Branch*</div>
                    <Form.Item name='branch'>
                      <Select
                        allowClear={true}
                        className='th-grey th-bg-white  w-100 text-left'
                        placement='bottomRight'
                        showArrow={true}
                        onChange={(e, value) => handleChangeBranch(e, value)}
                        onClear={handleClearBranch}
                        dropdownMatchSelectWidth={true}
                        filterOption={(input, options) => {
                          return (
                            options.children.toLowerCase().indexOf(input.toLowerCase()) >=
                            0
                          );
                        }}
                        showSearch
                        getPopupContainer={(trigger) => trigger.parentNode}
                        placeholder='Select Branch*'
                        mode='multiple'
                      >
                        {branchList.length > 1 && (
                          <>
                            <Option key={0} value={'all'}>
                              Select All
                            </Option>
                          </>
                        )}
                        {branchListOptions}
                      </Select>
                    </Form.Item>
                  </div>
                  <div className='col-md-3 col-sm-6 col-12'>
                    <div className='text-left'>Grade *</div>
                    <Form.Item name='grade'>
                      <Select
                        getPopupContainer={(trigger) => trigger.parentNode}
                        maxTagCount={1}
                        allowClear={true}
                        suffixIcon={<DownOutlined className='th-grey' />}
                        className='th-grey th-bg-grey th-br-4 w-100 text-left'
                        placement='bottomRight'
                        showArrow={true}
                        onChange={(e, value) => handleChangeGrade(e, value)}
                        // onClear={handleClearGrade}
                        dropdownMatchSelectWidth={true}
                        filterOption={(input, options) => {
                          return (
                            options.children.toLowerCase().indexOf(input.toLowerCase()) >=
                            0
                          );
                        }}
                        showSearch
                        placeholder='Select Grade*'
                      >
                        {gradeOptions}
                      </Select>
                    </Form.Item>
                  </div>
                  <div
                    className='col-md-2 col-sm-4 mt-1'
                    style={{ display: 'flex', alignItems: 'center' }}
                  >
                    <Button
                      type='primary'
                      className='btn-block mt-0 th-br-4'
                      onClick={handleAddTerms}
                      style={{ width: 'fit-content' }}
                    >
                      <PlusCircleOutlined /> Add Terms
                    </Button>
                  </div>
                </div>

                <Divider className='mt-1 mb-2' />
                {terms?.map((termItem, termIndex) => (
                  <>
                    {/* TERMS / SEMESTER */}
                    <div className='row'>
                      <div className='col-md-3 col-sm-6 col-12'>
                        <div className='text-left'>Semester*</div>
                        {/* <Form.Item name={`semester${termIndex}`}> */}
                        <Select
                          id={`semester${termIndex}`}
                          getPopupContainer={(trigger) => trigger.parentNode}
                          allowClear={true}
                          suffixIcon={<DownOutlined className='th-grey' />}
                          className='th-grey th-bg-grey th-br-4 w-100 text-left'
                          placement='bottomRight'
                          showArrow={true}
                          onChange={(e, value) => handleSemester(e, value, termIndex)}
                          dropdownMatchSelectWidth={true}
                          filterOption={(input, options) => {
                            return (
                              options.children
                                .toLowerCase()
                                .indexOf(input.toLowerCase()) >= 0
                            );
                          }}
                          showSearch
                          placeholder='Select Semester*'
                        >
                          {semesterOptions}
                        </Select>
                        {/* </Form.Item> */}
                      </div>

                      <div
                        className='col-md-4 col-sm-6 col-12 mt-3'
                        style={{ display: 'flex', alignItems: 'center' }}
                      >
                        <div className='row no-gutters mt-1'>
                          {terms.length > 1 && (
                            <div className='col-md-6 col-sm-6 col-6 pr-2'>
                              <Button
                                type='primary'
                                className='btn-block mt-0 th-br-4'
                                onClick={() => handleRemoveTerms(termIndex)}
                                style={{ width: 'fit-content' }}
                              >
                                <MinusCircleOutlined /> Remove Terms
                              </Button>
                            </div>
                          )}
                          <div className='col-md-6 col-sm-6 col-6 pr-2'>
                            <Button
                              type='primary'
                              className='btn-block mt-0 th-br-4'
                              onClick={() => handleAddTermsActivity(termIndex)}
                              style={{ width: 'fit-content' }}
                            >
                              <PlusCircleOutlined /> Add Category
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* CATEGORY AND ACTIVITY */}
                    {termItem?.activities?.map((semItem, semIndex) => (
                      <PeReportCardActivity
                        terms={terms}
                        setTerms={setTerms}
                        termItem={termItem}
                        termIndex={termIndex}
                        semItem={semItem}
                        semIndex={semIndex}
                      />
                    ))}
                  </>
                ))}

                <div className='row justify-content-end'>
                  <div className='col-md-2 col-sm-6 col-12'>
                    <Button
                      type='primary'
                      className='btn-block mt-0 th-br-4'
                      style={{ width: 'fit-content' }}
                      onClick={handleReportCardConfig}
                    >
                      Submit Report Config
                    </Button>
                  </div>
                </div>
              </Form>
            </div>
          </div>
        </div>
      </Layout>
    </React.Fragment>
  );
};

export default CreatePeReportConfig;
