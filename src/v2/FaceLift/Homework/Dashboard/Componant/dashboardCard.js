import React, { useEffect, useState } from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import './dashboard.scss';
import { Table, Tag } from 'antd';
import { EyeOutlined, RightCircleOutlined } from '@ant-design/icons';
import DashboardDrawer from './dashboardDrawer';

const DashboardCard = ({
  mainData,
  index,
  dashboardLevel,
  level2TableData,
  level2Data,
  startDate,
  endDate,
  level1TableData,
  tableLoading,
  getLevel2Data,
  getLevel2TableData,
  setDashboardLevel,
  getLevel1TableData,
  selectedLevel1Card,
  selectedLevel2Card,
  setSelectedLevel1Card,
  setSelectedLevel2Card,
}) => {
  const [selectedHomeworkIndex, setSelectedHomeworkIndex] = useState(0);
  const [selectedHomework, setSelectedHomework] = useState();
  const [isCollapsed, setIsCollapsed] = useState(true);
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [drawerData, setDrawerData] = useState({ open: false, data: null });

  //   const selectHoework = (index) => {
  //     setSelectedHomeworkIndex(index);
  //   };
  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  const showDrawer = (data) => {
    setDrawerData({ ...drawerData, open: true, data: data });
    // setDrawerVisible(true);
    setDashboardLevel(parseInt(dashboardLevel) + 1);
    setIsCollapsed(true);
  };

  const closeDrawer = () => {
    setDrawerData({ ...drawerData, open: false, data: null });
    // setDrawerVisible(false);
    setDashboardLevel(parseInt(dashboardLevel) - 1);
    setIsCollapsed(true);
  };

  //   const homeworkGraphData = [
  //     {
  //       name: 'Pending',
  //       y: 60,
  //       color: '#90ed7d',
  //     },
  //     {
  //       name: 'Submitted',
  //       y: 40,
  //       color: '#f7a35c',
  //     },
  //   ];
  //   const homeworkGraphOuterData = [
  //     {
  //       name: 'Pending ',
  //       y: 0,
  //       color: 'rgb(255,255,255)',
  //       // custom: {
  //       //   version: '70',
  //       // },
  //     },
  //     {
  //       name: 'Pending',
  //       y: 0,
  //       color: 'rgb(255,255,255)',
  //       // custom: {
  //       //   version: '30',
  //       // },
  //     },
  //     {
  //       name: 'Evaluated',
  //       y: 25,
  //       color: 'rgb(255,214,143)',
  //       // custom: {
  //       //   version: '25',
  //       // },
  //     },
  //     {
  //       name: 'Non Evaluated',
  //       y: 75,
  //       color: 'rgb(255,214,143',
  //       // custom: {
  //       //   version: '75',
  //       // },
  //     },
  //   ];

  //   console.log({ homeworkGraphData, homeworkGraphOuterData });

  //   const optionPie = {
  //     chart: {
  //       type: 'pie',
  //     },
  //     credits: {
  //       enabled: false,
  //     },
  //     title: {
  //       text:
  //         dashboardLevel === 0
  //           ? 'Branch'
  //           : dashboardLevel === 1
  //           ? 'Section'
  //           : dashboardLevel === 2
  //           ? 'Student'
  //           : null,
  //       align: 'left',
  //     },
  //     plotOptions: {
  //       pie: {
  //         shadow: false,
  //         center: ['50%', '50%'],
  //       },
  //     },
  //     tooltip: {
  //       valueSuffix: '%',
  //     },
  //     series: [
  //       {
  //         name: 'Homework',
  //         data: homeworkGraphData,
  //         size: '45%',
  //         dataLabels: {
  //           color: '#ffffff',
  //           distance: '-50%',
  //         },
  //       },
  //       {
  //         name: 'Evaluations',
  //         data: homeworkGraphOuterData,
  //         size: '60%',
  //         innerSize: '40%',
  //         dataLabels: {
  //           format: '<b>{point.name}:</b> <span style="opacity: 0.5">{y}%</span>',
  //           filter: {
  //             property: 'y',
  //             operator: '>',
  //             value: 1,
  //           },
  //           style: {
  //             fontWeight: 'normal',
  //           },
  //         },
  //         id: 'evaluations',
  //       },
  //     ],
  //     responsive: {
  //       rules: [
  //         {
  //           condition: {
  //             maxWidth: 300,
  //           },
  //           chartOptions: {
  //             series: [
  //               {},
  //               {
  //                 id: 'evaluations',
  //                 dataLabels: {
  //                   distance: 10,
  //                   format: '{point.custom.version}',
  //                   filter: {
  //                     property: 'percentage',
  //                     operator: '>',
  //                     value: 2,
  //                   },
  //                 },
  //               },
  //             ],
  //           },
  //         },
  //       ],
  //     },
  //   };

  useEffect(() => {
    console.log(
      {
        mainData,
        index,
        dashboardLevel,
        level2TableData,
        level2Data,
        startDate,
        endDate,
        level1TableData,
        tableLoading,
        selectedLevel1Card,
        selectedLevel2Card,
      },
      'data dashboard card'
    );
  });

  const tableColumns = [
    {
      title: (
        <span className='th-white th-12 th-fw-500 '>
          {dashboardLevel === 0 ? 'Grade' : dashboardLevel === 1 ? 'Subject' : null}
        </span>
      ),
      width: '18%',
      align: 'center',
      dataIndex: 'name',
      render: (data) => <span className='th-black-1 th-12'>{data}</span>,
    },
    {
      title: <span className='th-white th-12 th-fw-500'>Pending (%)</span>,
      width: '18%',
      align: 'center',
      dataIndex: 'percentageCounts',
      render: (data) => <span className='th-black-1 th-12'>{data?.p_pending}</span>,
    },

    {
      title: <span className='th-white th-12 th-fw-500'>Submitted (%)</span>,
      width: '18%',
      align: 'center',
      dataIndex: 'percentageCounts',
      render: (data) => <span className='th-black-1 th-12'>{data?.p_submitted}</span>,
    },
    {
      title: <span className='th-white th-12 th-fw-500'>Evaluated (%)</span>,
      width: '18%',
      align: 'center',
      dataIndex: 'percentageCounts',
      render: (data) => <span className='th-black-1 th-12'>{data?.p_evaluated}</span>,
    },
    {
      title: <span className='th-white th-12 th-fw-500'>Total</span>,
      width: '18%',
      align: 'center',
      dataIndex: 'numberCounts',
      render: (data) => <span className='th-black-1 th-12'>{data?.assigned}</span>,
    },
    {
      title: <span className='th-white th-12 th-fw-500'>Action</span>,
      width: '10%',
      align: 'center',
      render: (data, record) => (
        <span
          className='th-12 th-pointer text-primary'
          onClick={() => {
            // dashboardParentFunc({
            //   start_date: startDate,
            //   end_date: endDate,
            //   acadsession_id: dashboardData?.[selectedHomeworkIndex]?.acad_session_id,
            //   grade_id: record?.id,
            // });
            showDrawer({
              ...record,
              ...(dashboardLevel === 0
                ? { acadsession_id: mainData?.acad_session_id }
                : {}),
            });
          }}
        >
          <EyeOutlined />
        </span>
      ),
    },
  ];

  const selectCard = (e, index) => {
    e.preventDefault();
    e.stopPropagation();
    console.log({ dashboardLevel });
    if (dashboardLevel === 0) {
      setSelectedLevel1Card({ index: index, data: mainData });
    } else if (dashboardLevel === 1) {
      setSelectedLevel2Card({ index: index, data: mainData });
    }
  };

  return (
    <React.Fragment>
      {/* <div className='row'>
        <div className='col-md-7 col-12 pl-0 dashboard-stat'> */}

      <div
        className='stat-card row th-bg-white py-2 th-br-12 mb-2 align-items-center'
        key={index}
        style={{
          border:
            (dashboardLevel === 0 && index === selectedLevel1Card?.index) ||
            (dashboardLevel === 1 && index === selectedLevel2Card?.index)
              ? // selectedLevel1Card === undefined ? (dashboardLevel === 1 && index === selectedLevel2Card?.index):(dashboardLevel === 0 && index === selectedLevel1Card?.index)
                '1px solid #1B4CCB'
              : '',
          //  '1px solid #1B4CCB',
        }}
        onClick={(e) => selectCard(e, index)}
      >
        <div className='col-md-9'>
          <h4 className='th-20 mb-1 text-primary'>
            {/* {dashboardLevel === 0
                        ? 'Branch'
                        : dashboardLevel === 1
                        ? 'Section'
                        : dashboardLevel === 2
                        ? 'Student'
                        : null}
                      {index + 1} */}
            {mainData?.name}
          </h4>
          <div className='stat-count th-bg-grey th-br-6'>
            <div className='d-flex justify-content-between px-3 py-2 align-items-center'>
              <div className='th-10 th-grey'>
                {mainData?.percentageCounts?.p_pending}% Pending
              </div>
              <div className='th-10 th-grey'>
                {mainData?.percentageCounts?.p_submitted}% Submitted
              </div>
              <div className='th-10 th-grey'>
                {mainData?.percentageCounts?.p_evaluated}% Evaluated
              </div>
            </div>
          </div>
        </div>
        <div className='col-md-3 text-center'>
          <h4 className='mb-0 th-16 text-right'>
            {mainData?.numberCounts?.assigned} <span className='th-grey'>Assigned</span>
          </h4>
          {dashboardLevel <= 1 && (
            <Tag
              color='processing'
              className='th-br-4 float-right mt-2 mr-0 th-pointer'
              onClick={() => {
                //   if (dashboardLevel === 0) {
                //     dashboardChildFunc({
                //       start_date: startDate,
                //       end_date: endDate,
                //       acadsession_id: item?.acad_session_id,
                //     });
                //   } else if (dashboardLevel === 1) {
                //     dashboardChildFunc({
                //       start_date: startDate,
                //       end_date: endDate,
                //       section_mapping_id: item?.id,
                //     });
                //   } else {
                //     dashboardChildFunc({
                //       start_date: startDate,
                //       end_date: endDate,
                //       section_mapping_id: item?.id,
                //     });
                //   }
                if (dashboardLevel === 0) {
                  getLevel1TableData({
                    start_date: startDate,
                    end_date: endDate,
                    acadsession_id: mainData?.acad_session_id,
                  });
                }
                if (dashboardLevel === 1) {
                  getLevel2TableData({
                    start_date: startDate,
                    end_date: endDate,
                    section_mapping_id: mainData?.id,
                  });
                }
                toggleCollapse();
              }}
            >
              {dashboardLevel === 0 ? `Grade` : dashboardLevel === 1 ? `Subject` : null}{' '}
              <RightCircleOutlined />
            </Tag>
          )}
        </div>
        {console.log(
          dashboardLevel,
          selectedLevel1Card?.index,
          selectedLevel2Card?.index,
          'fjkhafegfewgew'
        )}
        {(dashboardLevel === 0 && selectedLevel1Card?.index === index) ||
        (dashboardLevel === 1 && selectedLevel2Card?.index === index) ? (
          <div
            className={`dashboard-table-collapse ${
              isCollapsed ? 'dashboard-content-collapsed' : ''
            }`}
          >
            <div className='col-md-12 mt-2 dashboard-table'>
              <Table
                size='small'
                className='th-table'
                columns={tableColumns}
                rowKey={(record) => record?.id}
                dataSource={level1TableData}
                pagination={false}
                loading={tableLoading}
                scroll={{ y: '100px' }}
                style={{ minHeight: 100 }}
              />
            </div>
          </div>
        ) : null}
        {drawerData?.open ? (
          <DashboardDrawer
            drawerData={drawerData}
            closeDrawer={closeDrawer}
            dashboardLevel={dashboardLevel}
            startDate={startDate}
            endDate={endDate}
            tableLoading={tableLoading}
            getLevel2Data={getLevel2Data}
            level2Data={level2Data}
            getLevel2TableData={getLevel2TableData}
            level2TableData={level2TableData}
            selectedLevel1Card={selectedLevel1Card}
            setSelectedLevel1Card={setSelectedLevel1Card}
            selectedLevel2Card={selectedLevel2Card}
            setSelectedLevel2Card={setSelectedLevel2Card}
          />
        ) : null}
      </div>

      {/* </div> */}

      {/* <div className='col-md-5 text-center col-12' style={{ minHeight: '150px' }}>
          <div className='th-bg-white th-br-10 p-3'>
            <HighchartsReact highcharts={Highcharts} options={optionPie} />
          </div>
        </div> */}
      {/* </div> */}
    </React.Fragment>
  );
};

export default DashboardCard;
