import { CloseOutlined } from '@ant-design/icons';
import { Drawer, Space } from 'antd';
import React, { useEffect, useState } from 'react';
import DashboardCard from './dashboardCard';

const DashboardDrawer = ({
  closeDrawer,
  drawerData,
  dashboardLevel,
  startDate,
  endDate,
  getLevel2Data,
  level2Data,
  getLevel2TableData,
  level2TableData,
  // selectedLevel1Card,
  // setSelectedLevel1Card,
  selectedLevel2Card,
  setSelectedLevel2Card,
}) => {
  const [drawerCardData, setDrawerCardData] = useState([]);
  useEffect(() => {
    if (dashboardLevel === 1) {
      getLevel2Data({
        start_date: startDate,
        end_date: endDate,
        grade_id: drawerData?.data?.id,
        acadsession_id: drawerData?.data?.acadsession_id,
      });
    }
  }, []);

  useEffect(() => {
    console.log({ drawerData, dashboardLevel, startDate, endDate, level2Data }, 'data');
    if (level2Data?.length) {
      setDrawerCardData(level2Data);
    }
  }, [level2Data]);

  return (
    <React.Fragment>
      <Drawer
        zIndex={1300}
        placement='right'
        onClose={closeDrawer}
        visible={drawerData?.open}
        title={
          <div className='th-bg-grey'>
            {dashboardLevel === 1
              ? 'Section'
              : dashboardLevel === 2
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
        <div className='row mt-2'>
          <div className='col-12'>
            <div className='py-2'>
              <div className='row'>
                <div className='col-md-7 col-12 pl-0 dashboard-stat'>
                  {Array.isArray(drawerCardData) && drawerCardData?.length > 0
                    ? drawerCardData?.map((item, index) => (
                        <DashboardCard
                          dashboardLevel={dashboardLevel}
                          startDate={startDate}
                          endDate={endDate}
                          mainData={item}
                          index={index}
                          getLevel2TableData={getLevel2TableData}
                          level2TableData={level2TableData}
                          // selectedLevel1Card={selectedLevel1Card}
                          // setSelectedLevel1Card={setSelectedLevel1Card}
                          selectedLevel2Card={selectedLevel2Card}
                          setSelectedLevel2Card={setSelectedLevel2Card}
                          //   getLevel1TableData={getLevel1TableData}
                          //   level1TableData={level1TableData}
                          //   tableLoading={tableLoading}
                        />
                      ))
                    : null}
                </div>
              </div>
            </div>
          </div>
        </div>
      </Drawer>
    </React.Fragment>
  );
};

export default DashboardDrawer;
