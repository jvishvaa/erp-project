import { Drawer, Empty, Space } from 'antd';
import React from 'react';
import DashboardChildCard from './DashboardChildCard';
import { CloseOutlined } from '@ant-design/icons';

const DashboardDrawer = ({
  closeDrawer,
  drawerVisible,
  dashboardLevel,
  setDashboardLevel,
  startDate,
  endDate,
  teacherId,
  index,
  fetchSubjectWise,
  tableData,
  fetchStudentList,
  acad_session_id,
  level1Data,
  level2Data,
  level3Data,
  visibleLevel,
  secMapId,
}) => {
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
              ? 'Section'
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
              {level2Data?.length > 0 ? (
                <DashboardChildCard
                  dashboardLevel={dashboardLevel}
                  setDashboardLevel={setDashboardLevel}
                  startDate={startDate}
                  endDate={endDate}
                  teacherId={teacherId}
                  index={index}
                  level1Data={level1Data}
                  level2Data={level2Data}
                  level3Data={level3Data}
                  fetchSubjectWise={fetchSubjectWise}
                  tableData={tableData}
                  fetchStudentList={fetchStudentList}
                  acad_session_id={acad_session_id}
                  visibleLevel={visibleLevel}
                  secMapId={secMapId}
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

export default DashboardDrawer;
