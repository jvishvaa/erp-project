import { DownOutlined, PlusCircleOutlined } from '@ant-design/icons';
import { Button, Form, Input, Select } from 'antd';
import axios from 'axios';
import React, { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import {
  fetchBranchesForCreateUser,
  fetchAcademicYears as getAcademicYears,
} from 'redux/actions';
import axiosInstance from 'v2/config/axios';
import endpoints from 'v2/config/endpoints';
import EditSchoolBranch from './editSchoolBranch';
import _ from 'lodash'
const EditSchoolDetails = ({ userDetails, handleUpdateUserDetails }) => {
  const [userLevelList, setUserLevelList] = useState([]);
  const [userDesignationList, setUserDesignationList] = useState([]);
  const [roles, setRoles] = useState([]);
  const [branches, setBranches] = useState([]);
  const NavData = JSON.parse(localStorage.getItem('navigationData')) || {};
  const [moduleId, setModuleId] = useState('');
  const [academicYears, setAcademicYears] = useState([]);
  const [selectedAcademicYears, setSelectedAcademicYears] = useState();
  const selectedYear = useSelector((state) => state.commonFilterReducer?.selectedYear);
  const { Option } = Select;
  const formRef = useRef();

  console.log({ userDetails });
var current_mappings = _.cloneDeep(userDetails);

  useEffect(() => {
    if (NavData && NavData.length) {
      NavData.forEach((item) => {
        if (
          item.parent_modules === 'User Management' &&
          item.child_module &&
          item.child_module.length > 0
        ) {
          item.child_module.forEach((item) => {
            if (item.child_name === 'Create User') {
              setModuleId(item.child_id);
            }
          });
        }
      });
    }
  }, []);

  useEffect(() => {
    if (moduleId && selectedYear) {
      fetchBranches(selectedYear?.id);
    }
    fetchUserLevel();
    fetchRole();
    fetchAcademicYears();
  }, [moduleId, selectedYear]);

  const fetchAcademicYears = () => {
    console.log('hit');
    getAcademicYears(moduleId).then((data) => {
      let transformedData = '';
      transformedData = data?.map((obj = {}) => ({
        id: obj?.id || '',
        session_year: obj?.session_year || '',
        is_default: obj?.is_current_session || '',
      }));
      setAcademicYears(transformedData);
    });
  };

  useEffect(() => {
    if (formRef.current) {
        console.log('userDetails?.user_level?.id', userDetails);
      formRef.current.setFieldsValue({
        user_level: userDetails?.user_level?.id,
        user_role: userDetails?.role?.id,
        user_designation: userDetails?.designation?.id,
      });
    }
  }, [userDetails]);

  const fetchBranches = (acadId) => {
    if (selectedYear) {
      fetchBranchesForCreateUser(acadId, moduleId).then((data) => {
        const transformedData = data?.map((obj) => ({
          id: obj.id,
          branch_name: obj.branch_name,
          branch_code: obj.branch_code,
          acadId: obj.acadId,
        }));
        setBranches(transformedData);
      });
    }
  };
  const branchListOptions = branches?.map((each) => {
    return (
      <Option
        key={each?.id}
        value={each.id}
        branch_code={each?.branch_code}
        acadId={each?.acadId}
      >
        {each?.branch_name}
      </Option>
    );
  });

  const fetchUserLevel = () => {
    axios
      .get(`${endpoints.userManagement.userLevelList}`, {
        headers: {
          'X-Api-Key': 'vikash@12345#1231',
        },
      })
      .then((res) => {
        if (res?.data?.status_code === 200) {
          setUserLevelList(res?.data?.result);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const fetchUserDesignation = (value) => {
    axios
      .get(`${endpoints.userManagement.userDesignation}?user_level=${value}`, {
        headers: {
          'X-Api-Key': 'vikash@12345#1231',
        },
      })
      .then((res) => {
        if (res?.data?.status_code === 200) {
          setUserDesignationList(res?.data?.result);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const fetchRole = () => {
    axiosInstance
      .get(`${endpoints.nonAcademicStaff.roles}`)
      .then((res) => {
        if (res?.data?.status_code === 200) {
          setRoles(res?.data?.result);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const academicYearOptions = academicYears?.map((each) => {
    return (
      <Option key={each?.id} value={each.id}>
        {each?.session_year}
      </Option>
    );
  });

  const userLevelListOptions = userLevelList?.map((each) => {
    return (
      <Option key={each?.id} value={each.id}>
        {each?.level_name}
      </Option>
    );
  });

  const userDesignationListOptions = userDesignationList?.map((each) => {
    return (
      <Option key={each?.id} value={each.id}>
        {each?.designation}
      </Option>
    );
  });

  const rolesOptions = roles?.map((each) => {
    return (
      <Option key={each?.id} value={each.id}>
        {each?.role_name}
      </Option>
    );
  });

  const userData = userDetails;

  const handleUserDesignation = (e) => {
    if (e != undefined) {
      userData[0].userDesignation = e;
    } else {
      userData[0].userDesignation = '';
    }
    // setUserDetails(userData);
  };

  const handleUserLevel = (e) => {
    if (e != undefined) {
      userData[0].userLevel = e;
      setUserDesignationList([]);
      formRef.current.setFieldsValue({
        user_designation: null,
      });
      fetchUserDesignation(e);
      userData[0].userDesignation = e;
    } else {
      userData[0].userLevel = '';
    }
    // setUserDetails(userData);
  };

  const handleUserBranch = (e, data) => {
    if (e != undefined) {
      userData[0].userBranch = e;
      userData[0].userBranchCode = data?.branch_code;
      userData[0].academicYear = data?.acadId;
    } else {
      userData[0].userBranch = '';
      userData[0].userBranchCode = '';
      userData[0].academicYear = '';
    }
    // setUserDetails(userData);
  };

  const handleUserRole = (e) => {
    if (e != undefined) {
      userData[0].userRole = e;
    } else {
      userData[0].userRole = '';
    }
    // setUserDetails(userData);
  };

  const handleAcademicYear = (e) => {
    if (e != undefined) {
      setSelectedAcademicYears(e);
      fetchBranches(e);
    } else {
      setSelectedAcademicYears();
    }
  };

  return (
    <React.Fragment>
      <Form id='schoolDetailsForm' ref={formRef} layout={'vertical'}>
        <div className='row mt-5'>
          <div className='col-md-4 col-sm-6 col-12'>
            <Form.Item
              name='user_level'
              label='Select User Level'
              rules={[{ required: true, message: 'Please select User Level' }]}
            >
              <Select
                getPopupContainer={(trigger) => trigger.parentNode}
                maxTagCount={5}
                allowClear={true}
                // disabled={userDetails?.id}
                // defaultValue={userDetails?.user_level?.id}
                suffixIcon={<DownOutlined className='th-grey' />}
                className='th-grey th-bg-grey th-br-4 w-100 text-left mt-1'
                placement='bottomRight'
                showArrow={true}
                onChange={(e, value) => handleUserLevel(e, value)}
                dropdownMatchSelectWidth={false}
                showSearch
                filterOption={(input, options) => {
                  return options.children.toLowerCase().indexOf(input.toLowerCase()) >= 0;
                }}
                placeholder='Select User Level'
              >
                {userLevelListOptions}
              </Select>
            </Form.Item>
          </div>
          <div className='col-md-4 col-sm-6 col-12'>
            <Form.Item
              name='user_designation'
              label='Select User Designation'
              rules={[{ required: true, message: 'Please select User Designation' }]}
            >
              <Select
                getPopupContainer={(trigger) => trigger.parentNode}
                maxTagCount={5}
                // disabled={userDetails?.id}
                allowClear={true}
                // value={userDetails?.designation?.id}
                suffixIcon={<DownOutlined className='th-grey' />}
                className='th-grey th-bg-grey th-br-4 w-100 text-left mt-1'
                placement='bottomRight'
                showArrow={true}
                onChange={(e, value) => handleUserDesignation(e, value)}
                dropdownMatchSelectWidth={false}
                filterOption={(input, options) => {
                  return options.children.toLowerCase().indexOf(input.toLowerCase()) >= 0;
                }}
                showSearch
                placeholder='Select User Designation'
              >
                {userDesignationListOptions}
              </Select>
            </Form.Item>
          </div>
          <div className='col-md-4 col-sm-6 col-12'>
            <Form.Item
              name='user_role'
              label='Select User Role'
              rules={[{ required: true, message: 'Please select User Role' }]}
            >
              <Select
                getPopupContainer={(trigger) => trigger.parentNode}
                maxTagCount={5}
                allowClear={true}
                disabled={userDetails?.id}
                // value={userDetails?.role?.id}
                suffixIcon={<DownOutlined className='th-grey' />}
                className='th-grey th-bg-grey th-br-4 w-100 text-left mt-1'
                placement='bottomRight'
                showArrow={true}
                onChange={(e, value) => handleUserRole(e, value)}
                dropdownMatchSelectWidth={false}
                filterOption={(input, options) => {
                  return options.children.toLowerCase().indexOf(input.toLowerCase()) >= 0;
                }}
                showSearch
                placeholder='Select User Role'
              >
                {rolesOptions}
              </Select>
            </Form.Item>
          </div>
        </div>

        {/* {userDetails?.mapping_bgs?.map((item) => (
          <>
            <div className='row mt-3'>
              <div className='col-md-4 col-sm-6 col-12'>
                <Form.Item
                  name='academic_year'
                  label='Select Academic Year'
                  rules={[{ required: true, message: 'Please select Academic Year' }]}
                >
                  <Select
                    allowClear={true}
                    className='th-grey th-bg-white  w-100 text-left'
                    placement='bottomRight'
                    showArrow={true}
                    defaultValue={item?.session_year[0]?.session_year_id}
                    onChange={(e, value) => handleAcademicYear(e, value)}
                    dropdownMatchSelectWidth={false}
                    filterOption={(input, options) => {
                      return (
                        options.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                      );
                    }}
                    showSearch
                    getPopupContainer={(trigger) => trigger.parentNode}
                    placeholder='Select Academic Year'
                  >
                    {academicYearOptions}
                  </Select>
                </Form.Item>
              </div>
              <div className='col-md-4 col-sm-6 col-12'>
                <Form.Item
                  name='branch'
                  label='Select Branch'
                  rules={[{ required: true, message: 'Please select Branch' }]}
                >
                  <Select
                    allowClear={true}
                    defaultValue={item?.branch[0]?.branch_id}
                    className='th-grey th-bg-white  w-100 text-left'
                    placement='bottomRight'
                    showArrow={true}
                    onChange={(e, value) => handleUserBranch(e, value)}
                    dropdownMatchSelectWidth={false}
                    filterOption={(input, options) => {
                      return (
                        options.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                      );
                    }}
                    showSearch
                    getPopupContainer={(trigger) => trigger.parentNode}
                    placeholder='Select Branch'
                  >
                    {branchListOptions}
                  </Select>
                </Form.Item>
              </div>
            </div>
          </>
        ))} */}

        {current_mappings?.mapping_bgs?.map((item,index) => (
          <>
            <EditSchoolBranch userDetails={userDetails} details={item} index={index} handleUpdateUserDetails={handleUpdateUserDetails}/>
          </>
        ))}
        <div className='row mt-3 justify-content-end'>
          <div className='col-md-2'>
            <Button
              type='primary'
              className='float-right text-center px-3'
              icon={<PlusCircleOutlined />}
            >
              Add
            </Button>
          </div>
        </div>
      </Form>
    </React.Fragment>
  );
};

export default EditSchoolDetails;
