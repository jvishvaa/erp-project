import { Button, Select, Tag } from 'antd';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import {
  fetchBranchesForCreateUser,
  fetchAcademicYears as getAcademicYears,
} from 'redux/actions';
import UserDetails from './userDetails';
import _ from 'lodash';
import { CloseCircleOutlined } from '@ant-design/icons';

const EditSchoolBranch = ({
  userDetails,
  details,
  index,
  handleUpdateUserDetails,
  setUserDetails,
}) => {
  const [branches, setBranches] = useState([]);
  const [moduleId, setModuleId] = useState('');
  const NavData = JSON.parse(localStorage.getItem('navigationData')) || {};
  const [academicYears, setAcademicYears] = useState([]);
  const [selectedAcademicYears, setSelectedAcademicYears] = useState();
  const selectedYear = useSelector((state) => state.commonFilterReducer?.selectedYear);
  const { Option } = Select;
  const [selectedId, setSelectedId] = useState();
  //eslint-disable-next-line
  const [fakeState, setFakeState] = useState('');

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

  useEffect(() => {
    if (userDetails) {
      const updatedDetails = _.cloneDeep(userDetails);

      updatedDetails.mapping_bgs[index].session_year[0]['acad_session_year'] =
        selectedYear?.children;
      updatedDetails.mapping_bgs[index].session_year[0]['session_year_id'] =
        selectedYear?.value;
    }
  }, []);

  const academicYearOptions = academicYears?.map((each) => {
    return (
      <Option key={each?.id} value={each.id}>
        {each?.session_year}
      </Option>
    );
  });

  const handleAcademicYear = (e, selectedYear) => {
    if (e != undefined) {
      // let updatedDetails = Object.assign({}, userDetails);
      const updatedDetails = _.cloneDeep(userDetails);
      updatedDetails.acad_session[index].id = selectedYear?.value;
      updatedDetails.mapping_bgs[index].session_year[0]['acad_session_year'] =
        selectedYear?.children;
      updatedDetails.mapping_bgs[index].session_year[0]['session_year_id'] =
        selectedYear?.value;
      //   setSelectedAcademicYears(e);
      handleUpdateUserDetails(updatedDetails);
      fetchBranches(e);
    } else {
      setSelectedAcademicYears();
    }
  };

  const handleDeleteMapping = (index) => {
    let newUserDetails = userDetails?.mapping_bgs?.slice();
    let newAcadDetails = userDetails?.acad_session?.slice();
    newUserDetails.splice(index, 1);
    newAcadDetails.splice(index, 1);
    handleUpdateUserDetails({
      ...userDetails,
      mapping_bgs: newUserDetails,
      acad_session: newAcadDetails,
    });
  };

  const handleUserBranch = (e, data) => {
    const updatedDetails = _.cloneDeep(userDetails);
    if (e != undefined) {
      updatedDetails.acad_session[index].branch = data?.value;
      updatedDetails.mapping_bgs[index].branch[0]['branch__branch_name'] = data?.children;
      updatedDetails.mapping_bgs[index].branch[0]['branch_id'] = e;
      //   setSelectedAcademicYears(e);
      handleUpdateUserDetails(updatedDetails);
    } else {
      updatedDetails.acad_session[index].branch = '';
      updatedDetails.mapping_bgs[index].branch[0]['branch__branch_name'] = '';
      updatedDetails.mapping_bgs[index].branch[0]['branch_id'] = '';
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
            disabled={!details?.isEdit}
            value={details?.session_year[0]?.session_year_id || null}
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
            allowClear={false}
            value={details?.branch[0]?.branch_id || null}
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
        {userDetails?.mapping_bgs[index]?.isEdit && (
          <div className='col-md-2'>
            <Button
              icon={<CloseCircleOutlined />}
              color='error'
              style={{ cursor: 'pointer' }}
              onClick={() => handleDeleteMapping(index)}
            >
              Delete
            </Button>
          </div>
        )}
      </div>
    </React.Fragment>
  );
};

export default EditSchoolBranch;
