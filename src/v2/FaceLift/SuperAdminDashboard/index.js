import React, { useState } from 'react';
import Layout from 'containers/Layout';
import { useSelector } from 'react-redux';
import { Select } from 'antd';
import { DownOutlined } from '@ant-design/icons';
import AttendanceReport from './components/AttendanceReport';
import Announcement from './components/Announcement';
import FeesOverview from './components/Fees';
import AcademicPerformance from './components/Academic Performance';
import CalendarCard from '../myComponents/CalendarCard';

const { Option } = Select;

const SuperAdmindashboardNew = () => {
  const branchList = useSelector((state) => state.commonFilterReducer?.branchList);
  const selectedBranch = useSelector(
    (state) => state.commonFilterReducer?.selectedBranch
  );
  const [selectedBranchList, setSelectedBranchList] = useState([]);
  const handleBranchChange = (e) => {
    setSelectedBranchList([...e]);
  };
  const branchOptions = branchList?.map((each) => {
    return (
      <Option
        value={each?.branch?.id}
        id={each?.branch?.id}
        key={each?.branch?.id}
        acadId={each?.id}
        selectedBranch={each}
      >
        {each?.branch?.branch_name}
      </Option>
    );
  });

  return (
    <Layout>
      <div className=''>
        <div className='row'>
          <div className='col-md-8 th-16 py-3'>Good Morning, Super Admin</div>
          <div className='col-md-4 th-16 py-3'>
            <Select
              className='th-primary th-bg-white th-br-4 w-100 text-left mt-1'
              placement='bottomRight'
              mode='multiple'
              maxTagCount={2}
              showArrow={true}
              allowClear={true}
              suffixIcon={<DownOutlined className='th-primary' />}
              placeholder={
                <span className='th-primary'>{selectedBranch?.branch?.branch_name}</span>
              }
              dropdownMatchSelectWidth={false}
              bordered={false}
              onChange={(e, value) => handleBranchChange(value)}
              optionFilterProp='children'
              filterOption={(input, options) => {
                return options.children.toLowerCase().indexOf(input.toLowerCase()) >= 0;
              }}
            >
              {branchOptions}
            </Select>
          </div>
        </div>
        <AttendanceReport selectedBranchList={selectedBranchList} />

        <div className='row pt-3'>
          <div className='col-md-4 th-custom-col-padding'>
            <FeesOverview />
          </div>
          <div className='col-md-4 th-custom-col-padding'>
            <AcademicPerformance selectedBranchList={selectedBranchList} />
            <CalendarCard />
          </div>
          <div className='col-md-4 th-custom-col-padding'>
            <Announcement />
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default SuperAdmindashboardNew;
