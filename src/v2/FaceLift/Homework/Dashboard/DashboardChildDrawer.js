import { Drawer, Empty, Space, Spin, Switch } from 'antd';
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
  loading,
}) => {
  const [showAbsolute, setShowAbsolute] = useState(false);

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
        <div className='th-bg-white th-br-5 pt-1 p-2 shadow-sm'>
          {console.log(
            visibleLevel === 'branch' && dashboardLevel === 2 && loading,
            visibleLevel,
            dashboardLevel,
            loading,
            'fdghjk'
          )}
          {visibleLevel === 'branch' && dashboardLevel === 2 && loading ? (
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
                      showAbsolute={showAbsolute}
                      loading={loading}
                    />
                  ) : (
                    <Empty />
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </Drawer>
    </React.Fragment>
  );
};

export default DashboardChildDrawer;
