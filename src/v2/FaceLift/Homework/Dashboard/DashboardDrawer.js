import { Drawer, Empty, Space, Spin, Switch } from 'antd';
import React, { useState } from 'react';
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
  subjectId,
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
  loading,
  tableLoading,
}) => {
  const [showAbsolute, setShowAbsolute] = useState(false);

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
        {((visibleLevel === 'branch' && dashboardLevel === 1) ||
          (visibleLevel === 'grade' && dashboardLevel === 1)) &&
        loading ? (
          <div
            className='row mt-2 th-bg-grey th-br-10 align-items-center'
            style={{ minHeight: 300 }}
          >
            <div className='col-12 text-center'>
              <div className='pt-3 pb-2'>
                <Spin size='large' tip='Loading...' />
              </div>
            </div>
          </div>
        ) : (
          <div className='th-bg-white th-br-5 pt-1 p-2 shadow-sm'>
            <div className='row mt-2 th-bg-grey th-br-10'>
              <div className='col-md-12'>
                <Switch
                  checkedChildren='Absolute'
                  unCheckedChildren='Percentage'
                  className='mt-3 float-right'
                  defaultChecked={showAbsolute}
                  onChange={() => setShowAbsolute(!showAbsolute)}
                />
              </div>
              <div className='col-12'>
                <div className='pt-3 pb-2'>
                  {level2Data?.length > 0 ? (
                    <DashboardChildCard
                      dashboardLevel={dashboardLevel}
                      setDashboardLevel={setDashboardLevel}
                      startDate={startDate}
                      endDate={endDate}
                      teacherId={teacherId}
                      subjectId={subjectId}
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
                      showAbsolute={showAbsolute}
                      loading={loading}
                      tableLoading={tableLoading}
                    />
                  ) : (
                    <Empty description='No results found for the chosen filters.' />
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </Drawer>
    </React.Fragment>
  );
};

export default DashboardDrawer;
