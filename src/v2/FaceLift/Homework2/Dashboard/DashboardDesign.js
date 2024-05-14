import React, { useState } from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import { EyeOutlined, RightCircleOutlined } from '@ant-design/icons';
import { Table, Tag } from 'antd';

const DashboardDesign = ({
  dashboardData,
  dashboardTableData,
  dashboardLevel,
  setDashboardLevel,
  childLoading,
  startDate,
  endDate,
  apiData,
  setApiData,
  isCollapsed,
  setIsCollapsed,
  closeDrawer,
  showDrawer,
}) => {
  const [selectedHomeworkIndex, setSelectedHomeworkIndex] = useState(0);

  const selectHomework = (index) => {
    setSelectedHomeworkIndex(index);
  };

  const homeworkGraphData = [
    {
      name: 'Pending',
      y: 60,
      color: '#90ed7d',
    },
    {
      name: 'Submitted',
      y: 40,
      color: '#f7a35c',
    },
  ];
  const homeworkGraphOuterData = [
    {
      name: 'Pending ',
      y: 0,
      color: 'rgb(255,255,255)',
      // custom: {
      //   version: '70',
      // },
    },
    {
      name: 'Pending',
      y: 0,
      color: 'rgb(255,255,255)',
      // custom: {
      //   version: '30',
      // },
    },
    {
      name: 'Evaluated',
      y: 25,
      color: 'rgb(255,214,143)',
      // custom: {
      //   version: '25',
      // },
    },
    {
      name: 'Non Evaluated',
      y: 75,
      color: 'rgb(255,214,143',
      // custom: {
      //   version: '75',
      // },
    },
  ];

  const optionPie = {
    chart: {
      type: 'pie',
    },
    credits: {
      enabled: false,
    },
    title: {
      text:
        dashboardLevel === 0
          ? 'Branch'
          : dashboardLevel === 1
          ? 'Grade'
          : dashboardLevel === 2
          ? 'Student'
          : null,
      align: 'left',
    },
    plotOptions: {
      pie: {
        shadow: false,
        center: ['50%', '50%'],
      },
    },
    tooltip: {
      valueSuffix: '%',
    },
    series: [
      {
        name: 'Homework',
        data: homeworkGraphData,
        size: '45%',
        dataLabels: {
          color: '#ffffff',
          distance: '-50%',
        },
      },
      {
        name: 'Evaluations',
        data: homeworkGraphOuterData,
        size: '60%',
        innerSize: '40%',
        dataLabels: {
          format: '<b>{point.name}:</b> <span style="opacity: 0.5">{y}%</span>',
          filter: {
            property: 'y',
            operator: '>',
            value: 1,
          },
          style: {
            fontWeight: 'normal',
          },
        },
        id: 'evaluations',
      },
    ],
    responsive: {
      rules: [
        {
          condition: {
            maxWidth: 300,
          },
          chartOptions: {
            series: [
              {},
              {
                id: 'evaluations',
                dataLabels: {
                  distance: 10,
                  format: '{point.custom.version}',
                  filter: {
                    property: 'percentage',
                    operator: '>',
                    value: 2,
                  },
                },
              },
            ],
          },
        },
      ],
    },
  };

  const tableColumns = [
    {
      title: (
        <span className='th-white th-12 th-fw-500 '>
          {dashboardLevel === 1 ? 'Grade' : dashboardLevel === 2 ? 'Subject' : null}
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
            let apiObj = {};
            console.log({ dashboardLevel });
            if (dashboardLevel === 2) {
              apiObj.level = 'section';
              apiObj.id = dashboardData?.[selectedHomeworkIndex]?.acad_session_id;
              apiObj.grade_id = record?.id;
              setApiData(apiObj);
            }
            showDrawer();
          }}
        >
          <EyeOutlined />
        </span>
      ),
    },
  ];

  return (
    <React.Fragment>
      <div className='row'>
        <div className='col-md-7 col-12 pl-0 dashboard-stat'>
          {Array.isArray(dashboardData) && dashboardData?.length > 0
            ? dashboardData?.map((item, index) => (
                <div
                  className='stat-card row th-bg-white py-2 th-br-12 mb-2 align-items-center'
                  key={index}
                  style={{
                    border: index === selectedHomeworkIndex && '1px solid #1B4CCB',
                  }}
                  onClick={() => selectHomework(index)}
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
                      {item?.name}
                    </h4>
                    <div className='stat-count th-bg-grey th-br-6'>
                      <div className='d-flex justify-content-between px-3 py-2 align-items-center'>
                        <div className='th-10 th-grey'>
                          {item?.percentageCounts?.p_pending}% Pending
                        </div>
                        <div className='th-10 th-grey'>
                          {item?.percentageCounts?.p_submitted}% Submitted
                        </div>
                        <div className='th-10 th-grey'>
                          {item?.percentageCounts?.p_evaluated}% Evaluated
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className='col-md-3 text-center'>
                    <h4 className='mb-0 th-16 text-right'>
                      {item?.numberCounts?.assigned}{' '}
                      <span className='th-grey'>Assigned</span>
                    </h4>
                    {console.log('adsfghj', dashboardLevel)}
                    {dashboardLevel <= 1 && (
                      <Tag
                        color='processing'
                        className='th-br-4 float-right mt-2 mr-0 th-pointer'
                        onClick={() => {
                          let apiObj = {};
                          if (dashboardLevel === 0) {
                            apiObj.level = 'grade';
                            apiObj.id = item?.acad_session_id;
                            setApiData(apiObj);
                            setDashboardLevel(prevState =>parseInt(prevState) + 1);
                          } else if (dashboardLevel === 1) {
                            // dashboardChildFunc({
                            //   start_date: startDate,
                            //   end_date: endDate,
                            //   section_mapping_id: item?.id,
                            // });
                          } else {
                            // dashboardChildFunc({
                            //   start_date: startDate,
                            //   end_date: endDate,
                            //   section_mapping_id: item?.id,
                            // });
                          }
                          setDashboardLevel(parseInt(dashboardLevel) + 1);
                          setIsCollapsed(!isCollapsed);
                        }}
                      >
                        {dashboardLevel === 0 || dashboardLevel === 1
                          ? `Grade`
                          : dashboardLevel === 2 || dashboardLevel === 3
                          ? `Subject`
                          : null}{' '}
                        <RightCircleOutlined />
                      </Tag>
                    )}
                  </div>
                  {index === selectedHomeworkIndex && (
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
                          dataSource={dashboardTableData}
                          pagination={false}
                          loading={childLoading}
                          scroll={{ y: '130px' }}
                          style={{ minHeight: 130 }}
                        />
                      </div>
                    </div>
                  )}
                </div>
              ))
            : null}
        </div>

        <div className='col-md-5 text-center col-12' style={{ minHeight: '150px' }}>
          <div className='th-bg-white th-br-10 p-3'>
            <HighchartsReact highcharts={Highcharts} options={optionPie} />
          </div>
        </div>
      </div>
    </React.Fragment>
  );
};

export default DashboardDesign;
