import { Select } from 'antd';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import {
  fetchBranchesForCreateUser,
  fetchAcademicYears as getAcademicYears,
} from 'redux/actions';
import UserDetails from './userDetails';
import _ from 'lodash'

const EditSchoolBranch = ({userDetails,details,index,handleUpdateUserDetails}) => {
    console.log({details})
  const [branches, setBranches] = useState([]);
  const [moduleId, setModuleId] = useState('');
  const NavData = JSON.parse(localStorage.getItem('navigationData')) || {};
  const [academicYears, setAcademicYears] = useState([]);
  const [selectedAcademicYears, setSelectedAcademicYears] = useState();
  const selectedYear = useSelector((state) => state.commonFilterReducer?.selectedYear);
  const { Option } = Select;
  const [selectedId, setSelectedId] = useState()

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
    fetchAcademicYears();
  }, [moduleId, selectedYear]);

  const academicYearOptions = academicYears?.map((each) => {
    return (
      <Option key={each?.id} value={each.id}>
        {each?.session_year}
      </Option>
    );
  });

  const handleAcademicYear = (e,selectedYear) => {
    console.log({e,selectedYear})
    if (e != undefined) {
        // let updatedDetails = Object.assign({}, userDetails);
        const updatedDetails = _.cloneDeep(userDetails);
        
        updatedDetails.mapping_bgs[index].session_year[0]['acad_session_year'] = selectedYear?.children;
        updatedDetails.mapping_bgs[index].session_year[0]['session_year_id'] = selectedYear?.value;
    //   setSelectedAcademicYears(e);
    handleUpdateUserDetails(updatedDetails)
      console.log({updatedDetails})
      fetchBranches(e);
    } else {
      setSelectedAcademicYears();
    }
  };

  const handleUserBranch = (e, data) => {
    if (e != undefined) {
      console.log(e);
      //   userData[0].userBranch = e;
      //   userData[0].userBranchCode = data?.branch_code;
      //   userData[0].academicYear = data?.acadId;
    } else {
      //   userData[0].userBranch = '';
      //   userData[0].userBranchCode = '';
      //   userData[0].academicYear = '';
    }
    // setUserDetails(userData);
  };

  return (
    <React.Fragment>
      <div className='row mt-3'>
        <div className='col-md-4 col-sm-6 col-12'>
          <Select
            allowClear={true}
            className='th-grey th-bg-white  w-100 text-left'
            placement='bottomRight'
            showArrow={true}
            value={details?.session_year[0]?.session_year_id}
            onChange={(e, value) => handleAcademicYear(e, value)}
            dropdownMatchSelectWidth={false}
            filterOption={(input, options) => {
              return options.children.toLowerCase().indexOf(input.toLowerCase()) >= 0;
            }}
            showSearch
            getPopupContainer={(trigger) => trigger.parentNode}
            placeholder='Select Academic Year'
          >
            {academicYearOptions}
          </Select>
        </div>
        <div className='col-md-4 col-sm-6 col-12'>
          <Select
            allowClear={true}
            value={details?.branch[0]?.branch_id}
            className='th-grey th-bg-white  w-100 text-left'
            placement='bottomRight'
            showArrow={true}
            onChange={(e, value) => handleUserBranch(e, value)}
            dropdownMatchSelectWidth={false}
            filterOption={(input, options) => {
              return options.children.toLowerCase().indexOf(input.toLowerCase()) >= 0;
            }}
            showSearch
            getPopupContainer={(trigger) => trigger.parentNode}
            placeholder='Select Branch'
          >
            {branchListOptions}
          </Select>
        </div>
      </div>
    </React.Fragment>
  );
};

export default EditSchoolBranch;
