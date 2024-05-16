import React, { useState } from 'react';
import DashboardChildDrawer from './DashboardChildDrawer';
import { Table, Tag } from 'antd';
import { EyeOutlined, RightCircleOutlined } from '@ant-design/icons';
import { useSelector } from 'react-redux';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';

const DashboardChildCard = ({
  dashboardLevel,
  startDate,
  endDate,
  teacherId,
  cardData,
  setDashboardLevel,
  index,
  fetchGradeWise,
  fetchSectionWise,
  tableData,
  fetchSubjectWise,
  fetchStudentList,
  acad_session_id,
  level1Data,
  level2Data,
  level3Data,
  visibleLevel,
  secMapId,
}) => {
  const [isCollapsed, setIsCollapsed] = useState(true);
  const [drawerVisible, setDrawerVisible] = useState(false);
  const selectedBranch = useSelector(
    (state) => state.commonFilterReducer?.selectedBranch
  );

  console.log({ dashboardLevel });

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  const showDrawer = (data) => {
    setDrawerVisible(true);
    setDashboardLevel(parseInt(dashboardLevel) + 1);
    setIsCollapsed(true);
  };

  const closeDrawer = () => {
    setDrawerVisible(false);
    setDashboardLevel(parseInt(dashboardLevel) - 1);
    setIsCollapsed(true);
  };

  const [selectedCardIndex, setSelectedCardIndex] = useState(0);
  const selectCard = (index) => {
    setSelectedCardIndex(index);
  };

  const tableColumns = [
    {
      title: (
        <span className='th-white th-12 th-fw-500 '>
          {visibleLevel === 'branch' && dashboardLevel === 0
            ? 'Grade'
            : visibleLevel === 'branch' && dashboardLevel === 1
            ? 'Subject'
            : visibleLevel === 'grade' && dashboardLevel === 0
            ? 'Section'
            : visibleLevel === 'grade' && dashboardLevel === 1
            ? 'Student'
            : null}
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
        <>
          {visibleLevel === 'branch' ? (
            <span
              className='th-12 th-pointer text-primary'
              onClick={() => {
                if (dashboardLevel === 1) {
                  fetchStudentList({
                    start_date: startDate,
                    end_date: endDate,
                    subject: record?.id,
                    section_mapping: level2Data[selectedCardIndex]?.id,
                    acad_session: acad_session_id,
                  });
                }
                showDrawer();
              }}
            >
              <EyeOutlined />
            </span>
          ) : (
            <span></span>
          )}
        </>
      ),
    },
  ];

  const chartInnerData = [
    {
      name: 'Pending',
      y: level2Data[selectedCardIndex]?.percentageCounts?.p_pending,
      color: '#90ed7d',
    },
    {
      name: 'Submitted',
      y: level2Data[selectedCardIndex]?.percentageCounts?.p_submitted,
      color: '#f7a35c',
    },
  ];
  const chartOuterData = [
    {
      name: 'Pending ',
      y: 0,
      color: 'rgb(255,255,255)',
    },
    {
      name: 'Pending',
      y: 0,
      color: 'rgb(255,255,255)',
    },
    {
      name: 'Evaluated',
      y: level2Data[selectedCardIndex]?.percentageCounts?.p_evaluated,
      color: 'rgb(255,214,143)',
    },
    {
      name: 'Non Evaluated',
      y: level2Data[selectedCardIndex]?.percentageCounts?.p_non_evaluated,
      color: 'rgb(255,214,143',
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
        visibleLevel === 'branch' && dashboardLevel === 0
          ? 'Branch'
          : visibleLevel === 'branch' && dashboardLevel === 1
          ? 'Section'
          : visibleLevel === 'grade' && dashboardLevel === 0
          ? 'Grade'
          : visibleLevel === 'grade' && dashboardLevel === 1
          ? 'Subject'
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
        data: chartInnerData,
        size: '45%',
        dataLabels: {
          color: '#ffffff',
          distance: '-50%',
        },
      },
      {
        name: 'Evaluations',
        data: chartOuterData,
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
  
  return (
    <React.Fragment>
      <div className='row'>
        <div className='col-md-7 col-12 pl-0 dashboard-stat'>
          {Array.isArray(level2Data) && level2Data?.length > 0
            ? level2Data?.map((item, index) => (
                <div
                  className='stat-card row th-bg-white py-2 th-br-12 mb-2 align-items-center'
                  key={index}
                  style={{
                    border: selectedCardIndex === index ? '1px solid #1B4CCB' : '',
                  }}
                  onClick={(e) => selectCard(index)}
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
                    {console.log({ dashboardLevel })}
                    {dashboardLevel <= 1 && (
                      <Tag
                        color='processing'
                        className='th-br-4 float-right mt-2 mr-0 th-pointer'
                        onClick={() => {
                          if (visibleLevel === 'branch' && dashboardLevel === 1) {
                            fetchSubjectWise({
                              start_date: startDate,
                              end_date: endDate,
                              section_mapping_id: item?.id,
                            });
                          } else if (visibleLevel === 'grade' && dashboardLevel === 1) {
                            fetchStudentList({
                              start_date: startDate,
                              end_date: endDate,
                              subject: item?.id,
                              section_mapping: secMapId,
                              acad_session: selectedBranch?.id,
                            });
                          }
                          toggleCollapse();
                        }}
                      >
                        {visibleLevel === 'branch'
                          ? `Subject`
                          : visibleLevel === 'grade'
                          ? `Student`
                          : ``}{' '}
                        <RightCircleOutlined />
                      </Tag>
                    )}
                  </div>
                  {!isCollapsed && selectedCardIndex === index ? (
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
                          dataSource={tableData}
                          pagination={false}
                          // loading={tableLoading}
                          scroll={{ y: '100px' }}
                          style={{ minHeight: 100 }}
                        />
                      </div>
                    </div>
                  ) : null}
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
      <DashboardChildDrawer
        drawerVisible={drawerVisible}
        closeDrawer={closeDrawer}
        cardData={cardData}
        level1Data={level1Data}
        level2Data={level2Data}
        level3Data={level3Data}
        startDate={startDate}
        endDate={endDate}
        dashboardLevel={dashboardLevel}
        setDashboardLevel={setDashboardLevel}
        fetchSubjectWise={fetchSubjectWise}
        tableData={tableData}
        acad_session_id={acad_session_id}
        visibleLevel={visibleLevel}
      />
    </React.Fragment>
  );
};

export default DashboardChildCard;
