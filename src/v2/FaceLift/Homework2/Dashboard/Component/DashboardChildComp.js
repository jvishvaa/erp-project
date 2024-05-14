import { CloseOutlined } from '@ant-design/icons';
import { Drawer, Space } from 'antd';
import React from 'react';
import DashboardComp from './DashboardComp';

const DashboardChildComp = ({
  closeDrawer,
  showDrawer,
  drawerVisible,
  dashboardChildLevel,
  setDashboardChildLevel,
  dashboardParentData,
  dashboardParentFunc,
  dashboardChildData,
  dashboardChildFunc,
  dashboardLevel,
  setDashboardLevel,
  startDate,
  endDate,
  childLoading,
}) => {
  console.log({ dashboardChildLevel });
  return (
    <React.Fragment>
      <Drawer
        zIndex={1300}
        placement='right'
        onClose={closeDrawer}
        visible={drawerVisible}
        title={
          <div className='th-bg-grey'>
            {dashboardChildLevel === 2
              ? 'Section'
              : dashboardChildLevel === 4
              ? 'Student'
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
        <DashboardComp
          level={dashboardChildLevel}
          dashboardLevel={dashboardChildLevel}
          setDashboardLevel={setDashboardLevel}
          dashboardParentData={dashboardParentData}
          dashboardParentFunc={dashboardParentFunc}
          dashboardChildData={dashboardParentData}
          dashboardChildFunc={dashboardChildFunc}
          startDate={startDate}
          endDate={endDate}
          childLoading={childLoading}
        />
      </Drawer>
    </React.Fragment>
  );
};

export default DashboardChildComp;
