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
import _ from 'lodash';
const EditSchoolDetails = ({ userDetails, handleUpdateUserDetails, setUserDetails }) => {
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
  //eslint-disable-next-line
  const [fakeState, setFakeState] = useState('');
  const formRef = useRef();

  var current_mappings = _.cloneDeep(userDetails);

  const newBranch = {
    session_year: [
      {
        session_year_id: '',
        is_current_session: '',
        acad_session_year: '',
      },
    ],
    branch: [
      {
        branch_id: '',
        branch__branch_name: '',
      },
    ],
    isEdit: true,
  };

  let newAcad = {
    id: '',
    branch: '',
  };

  const handleAddMore = () => {
    let data = [...userDetails?.mapping_bgs, newBranch];

    let acadData = [...userDetails?.acad_session, newAcad];

    userDetails.mapping_bgs = data;
    userDetails.acad_session = acadData;
    handleUpdateUserDetails(userDetails);
    // setUserDetails(userDetails);
    setFakeState(data);
    // handleUpdateUserDetails(data)
  };

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
    if (userDetails) {
      fetchUserDesignation(userDetails?.user_level?.id);
    }
    if (formRef.current) {
      formRef.current.setFieldsValue({
        user_level: userDetails?.user_level?.id,
        user_role: userDetails?.role?.id,
        user_designation: userDetails?.designation?.id
          ? userDetails?.designation?.id
          : null,
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
      <Option
        key={each?.id}
        value={each.id}
        description={each.description}
        is_delete={each.is_delete}
      >
        {each?.level_name}
      </Option>
    );
  });

  const userDesignationListOptions = userDesignationList?.map((each) => {
    return (
      <Option key={each?.id} value={each.id} is_delete={each.is_delete}>
        {each?.designation}
      </Option>
    );
  });

  const rolesOptions = roles?.map((each) => {
    return (
      <Option
        key={each?.id}
        value={each.id}
        created_at={each.created_at}
        created_by={each.created_by}
      >
        {each?.role_name}
      </Option>
    );
  });

  const userData = userDetails;

  const handleUserDesignation = (e, data) => {
    const updatedDetails = _.cloneDeep(userDetails);
    if (e != undefined) {
      updatedDetails.designation.id = data?.value;
      updatedDetails.designation.designation = data?.children;
      updatedDetails.designation.is_delete = data?.is_delete;
      handleUpdateUserDetails(updatedDetails);
    } else {
      updatedDetails.designation.designation = '';
      updatedDetails.designation.is_delete = '';
      handleUpdateUserDetails(updatedDetails);
    }
  };
  const handleUserLevel = (e, data) => {
    const updatedDetails = _.cloneDeep(userDetails);
    if (e != undefined) {
      updatedDetails.user_level.id = data?.value;
      updatedDetails.user_level.is_delete = data?.is_delete;
      updatedDetails.user_level.description = data?.description;
      updatedDetails.user_level.level_name = data?.level_name;
      updatedDetails.designation.user_level = data?.value;
      updatedDetails.designation.designation = '';
      updatedDetails.designation.id = '';
      updatedDetails.designation.user_level = data?.value;
      formRef.current.setFieldsValue({
        user_designation: null,
      });
      fetchUserDesignation(e);
      handleUpdateUserDetails(updatedDetails);
    } else {
      userData[0].userLevel = '';
      updatedDetails.user_level.id = '';
      updatedDetails.user_level.is_delete = '';
      updatedDetails.user_level.description = '';
      updatedDetails.user_level.level_name = '';
      updatedDetails.designation.user_level = '';
      updatedDetails.designation.designation = '';
      updatedDetails.designation.id = '';
      setUserDesignationList([]);
      handleUpdateUserDetails(updatedDetails);
    }
    // setUserDetails(userData);
  };

  const handleUserRole = (e, data) => {
    const updatedDetails = _.cloneDeep(userDetails);
    if (e != undefined) {
      updatedDetails.role.role_name = data?.children;
      updatedDetails.role.id = data?.value;
      updatedDetails.role.created_at = data?.created_at;
      updatedDetails.role.created_by = data?.created_by;
      handleUpdateUserDetails(updatedDetails);
    } else {
      updatedDetails.role.role_name = '';
      updatedDetails.role.id = undefined;
      updatedDetails.role.created_at = '';
      updatedDetails.role.created_by = '';
      handleUpdateUserDetails(updatedDetails);
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
                // disabled={userDetails?.id}
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

        {userDetails?.mapping_bgs?.map((item, index) => (
          <>
            <EditSchoolBranch
              userDetails={userDetails}
              details={item}
              index={index}
              handleUpdateUserDetails={handleUpdateUserDetails}
              setUserDetails={setUserDetails}
            />
          </>
        ))}
        <div className='row mt-3 justify-content-end'>
          <div className='col-md-2'>
            <Button
              type='primary'
              className='float-right text-center px-3'
              icon={<PlusCircleOutlined />}
              onClick={handleAddMore}
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
