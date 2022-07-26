import React, { useState } from 'react';
import Layout from 'containers/Layout';
import { useSelector } from 'react-redux';
import { Select, message } from 'antd';
import { DownOutlined } from '@ant-design/icons';
import AttendanceReport from './components/AttendanceReport';
import Announcement from './components/Announcement';
import FeesOverview from './components/Fees';
import AcademicPerformance from './components/Academic Performance';
import CalendarCard from '../myComponents/CalendarCard';
import Shortcut from './components/Shortcut';

const { Option } = Select;

const SuperAdmindashboardNew = () => {
  const time = new Date().getHours();
  const branchList = useSelector((state) => state.commonFilterReducer?.branchList);
  const selectedBranch = useSelector(
    (state) => state.commonFilterReducer?.selectedBranch
  );
  const [selectedBranchList, setSelectedBranchList] = useState([]);
  const [feesBranch, setFeesBranch] = useState([]);
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
  const handleBranchChange = (e) => {
    if (e.length === 1 && e.some((item) => item.key === 'all')) {
      const all = branchOptions.slice();
      const allBranches = all.map((item) => item?.props);
      setSelectedBranchList(allBranches);
    } else if (e.some((item) => item.key === 'all') && e.length > 1) {
      message.error('Either select all branch or other options');
      return;
    } else {
      setSelectedBranchList([...e]);
    }
  };
  const handleFeesBranch = (e) => {
    setFeesBranch(e);
  };

  return (
    <Layout>
      <div className=''>
        <div className='row'>
          <div className='col-md-8 th-16 py-3'>
            Good {time < 12 ? 'Morning' : time < 16 ? 'AfterNoon' : 'Evening'}, Super
            Admin
          </div>
          <div className='col-md-4 th-16 py-3'>
            <Select
              className='th-primary th-bg-white th-br-4 w-100 text-left mt-1'
              placement='bottomRight'
              mode='multiple'
              maxTagCount={3}
              showArrow={true}
              allowClear={true}
              suffixIcon={<DownOutlined className='th-primary' />}
              placeholder='Select Branches'
              dropdownMatchSelectWidth={false}
              bordered={false}
              onChange={(e, value) => handleBranchChange(value)}
              optionFilterProp='children'
              filterOption={(input, options) => {
                return options.children.toLowerCase().indexOf(input.toLowerCase()) >= 0;
              }}
            >
              <Option key='all'>All</Option>
              {branchOptions}
            </Select>
          </div>
        </div>
        <AttendanceReport selectedBranchList={selectedBranchList} />

        <div className='row pt-3'>
          <div className='col-md-4 th-custom-col-padding'>
            <FeesOverview handleFeesBranch={handleFeesBranch} />
          </div>
          <div className='col-md-4 th-custom-col-padding'>
            <AcademicPerformance selectedBranchList={selectedBranchList} />
            <CalendarCard />
          </div>
          <div className='col-md-4 th-custom-col-padding'>
            <Shortcut selectedBranchList={selectedBranchList} feesBranch={feesBranch} />
            <Announcement />
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default SuperAdmindashboardNew;
