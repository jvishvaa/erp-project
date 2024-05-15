import { Drawer, Empty, Space } from 'antd';
import React, { useState } from 'react';
import DashboardStudentCard from './DashboardStudentCard';
import { CloseOutlined } from '@ant-design/icons';

const DashboardChildDrawer = ({
  closeDrawer,
  drawerVisible,
  dashboardLevel,
  setDashboardLevel,
  startDate,
  endDate,
  teacherId,
  index,
  cardData,
  fetchSubjectWise,
  tableData,
  level1Data,
  level2Data,
  level3Data,
  acad_session_id,
  visibleLevel,
}) => {
  const [selectedCardIndex, setSelectedCardIndex] = useState(0);
  const selectCard = (index) => {
    setSelectedCardIndex(index);
  };

  console.log({ tableData });
  return (
    <React.Fragment>
      <Drawer
        zIndex={1300}
        placement='right'
        onClose={closeDrawer}
        visible={drawerVisible}
        title={
          <div className='th-bg-grey'>
            {visibleLevel === 'branch'
              ? 'Student'
              : visibleLevel === 'grade'
              ? 'Subject'
              : 'Homework'}{' '}
            Dashboard
          </div>
        }
        closable={false}
        width={'85%'}
        className='th-resources-drawer'
        extra={
          <Space>
            <CloseOutlined onClick={closeDrawer} />
          </Space>
        }
        bodyStyle={{ backgroundColor: '#f8f8f8' }}
      >
        <div className='row mt-2'>
          <div className='col-12'>
            <div className='py-2'>
              {level3Data?.length > 0 ? (
                <DashboardStudentCard
                  dashboardLevel={dashboardLevel}
                  setDashboardLevel={setDashboardLevel}
                  startDate={startDate}
                  endDate={endDate}
                  index={index}
                  fetchSubjectWise={fetchSubjectWise}
                  tableData={tableData}
                  level1Data={level1Data}
                  level2Data={level2Data}
                  level3Data={level3Data}
                  teacherId={teacherId}
                  visibleLevel={visibleLevel}
                />
              ) : (
                <Empty />
              )}
            </div>
          </div>
        </div>
      </Drawer>
    </React.Fragment>
  );
};

export default DashboardChildDrawer;
