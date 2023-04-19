import { DownOutlined } from '@ant-design/icons';
import { Form, Input, Select } from 'antd';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { fetchBranchesForCreateUser } from 'redux/actions';
import endpoints from 'v2/config/endpoints';

const SchoolDetails = () => {
  const [userLevelList, setUserLevelList] = useState([]);
  const [selectedUserLevels, setSelectedUserLevels] = useState();
  const [branches, setBranches] = useState([]);
  const NavData = JSON.parse(localStorage.getItem('navigationData')) || {};
  const [moduleId, setModuleId] = useState('');
  const selectedYear = useSelector((state) => state.commonFilterReducer?.selectedYear);
  const { Option } = Select;


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
  }, [moduleId, selectedYear]);

  const fetchBranches = () => {
    if (selectedYear) {
      fetchBranchesForCreateUser(selectedYear?.id, moduleId).then((data) => {
        const transformedData = data?.map((obj) => ({
          id: obj.id,
          branch_name: obj.branch_name,
          branch_code: obj.branch_code,
        }));
        // if (transformedData?.length > 1) {
        //   transformedData.unshift({
        //     id: 'all',
        //     branch_name: 'Select All',
        //     branch_code: 'all',
        //   });
        // }
        setBranches(transformedData);
      });
    }
  };


  const branchListOptions = branches?.map((each) => {
    return (
      <Option key={each?.id} value={each.id}>
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

  const userLevelListOptions = userLevelList?.map((each) => {
    return (
      <Option key={each?.id} value={each.id}>
        {each?.level_name}
      </Option>
    );
  });

  const handleUserLevel = (e) => {
    setSelectedUserLevels(e);
  };
  const handleClearUserLevel = () => {
    setSelectedUserLevels();
  };

  return (
    <React.Fragment>
      <Form id='schoolDetailsForm' layout={'vertical'}>
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
                suffixIcon={<DownOutlined className='th-grey' />}
                className='th-grey th-bg-grey th-br-4 w-100 text-left mt-1'
                placement='bottomRight'
                showArrow={true}
                onChange={(e, value) => handleUserLevel(e, value)}
                onClear={handleClearUserLevel}
                dropdownMatchSelectWidth={false}
                filterOption={(input, options) => {
                  return options.children.toLowerCase().indexOf(input.toLowerCase()) >= 0;
                }}
                placeholder='Select user Level'
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
                allowClear={true}
                suffixIcon={<DownOutlined className='th-grey' />}
                className='th-grey th-bg-grey th-br-4 w-100 text-left mt-1'
                placement='bottomRight'
                showArrow={true}
                onChange={(e, value) => handleUserLevel(e, value)}
                onClear={handleClearUserLevel}
                dropdownMatchSelectWidth={false}
                filterOption={(input, options) => {
                  return options.children.toLowerCase().indexOf(input.toLowerCase()) >= 0;
                }}
                placeholder='Select user Designation'
              >
                {userLevelListOptions}
              </Select>
            </Form.Item>
          </div>
        </div>
        <div className='row mt-3'>
          <div className='col-md-4 col-sm-6 col-12'>
            <Form.Item
              name='academic_year'
              label='Academic Year'
              rules={[{ required: true, message: 'Please enter Academic Year' }]}
            >
              <Input
                placeholder='Academic Year'
                defaultValue={selectedYear?.session_year}
                disabled
                className=''
              />
            </Form.Item>
          </div>
          <div className='col-md-4 col-sm-6 col-12'>
            <Form.Item
              name='branch'
              label='Select Branch'
              rules={[{ required: true, message: 'Please select Branch' }]}
            >
              <Select
                mode='multiple'
                allowClear={true}
                className='th-grey th-bg-white  w-100 text-left'
                placement='bottomRight'
                showArrow={true}
                dropdownMatchSelectWidth={false}
                filterOption={(input, options) => {
                  return options.children.toLowerCase().indexOf(input.toLowerCase()) >= 0;
                }}
                getPopupContainer={(trigger) => trigger.parentNode}
                placeholder='Select Branch'
              >
                {branchListOptions}
              </Select>
            </Form.Item>
          </div>
        </div>
      </Form>
    </React.Fragment>
  );
};

export default SchoolDetails;
