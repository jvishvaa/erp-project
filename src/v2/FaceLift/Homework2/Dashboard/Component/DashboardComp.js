import React, { useEffect, useState } from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import './dashboard.scss';
import { message, Table, Tag } from 'antd';
import { EyeOutlined, RightCircleOutlined } from '@ant-design/icons';
import DashboardChildComp from './DashboardChildComp';
import { useSelector } from 'react-redux';
import axiosInstance from 'config/axios';
import endpoints from 'config/endpoints';
import { X_DTS_HOST } from 'v2/reportApiCustomHost';
const DashboardComp = ({
  dashboardLevel,
  setDashboardLevel,
  dashboardData,
  dashboardParentData,
  dashboardParentFunc,
  dashboardChildData,
  dashboardChildFunc,
  startDate,
  endDate,
  childLoading,
}) => {
  console.log({ dashboardData, startDate, endDate, dashboardChildData });

  const branchData = dashboardData?.map((item) => {
    return {
      id: item?.branch_id,
      acad_session_id: item?.acad_session_id,
      name: item?.branch_name,
      numberCounts: item?.counts,
      percentageCounts: item?.percents,
    };
  });

  const sectionData = dashboardChildData?.map((item) => {
    return {
      id: item?.sec_map_id,
      name: item?.section_name,
      numberCounts: item?.counts,
      percentageCounts: item?.percents,
    };
  });

  const gradeData = dashboardChildData?.map((item) => ({
    id: item?.grade_id,
    name: item?.grade_name,
    numberCounts: item?.counts,
    percentageCounts: item?.percents,
  }));

  const subjectData = dashboardChildData?.map((item) => ({
    id: item?.subject_id,
    mappedId: item?.map_sub,
    name: item?.subject_name,
    numberCounts: item?.counts,
    percentageCounts: item?.percents,
  }));

  const studentData = dashboardChildData?.map((item) => ({
    id: item?.subject_id,
    mappedId: item?.map_sub,
    name: item?.subject_name,
    numberCounts: item?.counts,
    percentageCounts: item?.percents,
  }));

  console.log({ branchData, sectionData });

  const selectedAcademicYear = useSelector(
    (state) => state.commonFilterReducer?.selectedYear
  );
  const selectedBranch = useSelector(
    (state) => state.commonFilterReducer?.selectedBranch
  );

  console.log({ selectedAcademicYear, selectedBranch });

  const [isCollapsed, setIsCollapsed] = useState(true);
  const [drawerVisible, setDrawerVisible] = useState(false);

  const [dashboardChildLevel, setDashboardChildLevel] = useState(0);
  const [selectedHomeworkIndex, setSelectedHomeworkIndex] = useState(0);
  const [selectedHomework, setSelectedHomework] = useState(
    dashboardData?.[selectedHomeworkIndex]
  );
  const [modifiedData, setModifiedData] = useState();
  const [dataSource, setDataSource] = useState();
  // const [gradeData, setGradeData] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    console.log({ dashboardLevel });
    setModifiedData(
      dashboardLevel === 0 ? branchData : dashboardLevel === 1 ? sectionData : []
    );
    setDataSource(
      dashboardLevel === 0 ? gradeData : dashboardLevel === 1 ? subjectData : []
    );
  }, [dashboardData, dashboardChildData]);

  // const fetchGradeWise = async (params = {}) => {
  //   console.log({ params });
  //   setLoading(true);
  //   try {
  //     const result = await axiosInstance.get(
  //       `${endpoints?.homeworkDashboard?.gradeWise}`,
  //       {
  //         params: { ...params },
  //         headers: {
  //           'X-DTS-HOST': X_DTS_HOST,
  //         },
  //       }
  //     );
  //     console.log({ result });
  //     if (result?.data?.status_code === 200) {
  //       setGradeData(result?.data?.result);
  //     } else {
  //       setGradeData([]);
  //       message.error(result?.message || 'Something went wrong');
  //     }
  //   } catch (error) {
  //     message.error(error?.response?.data?.message ?? 'Something went wrong');
  //   } finally {
  //     setLoading(false);
  //     toggleCollapse();
  //   }
  // };

  // const dashboardChildData = dashboardChildFunc({
  //   start_date: startDate,
  //   end_date: endDate,
  //   acadsession_id: item?.acad_session_id,
  // });

  console.log({ dashboardLevel, dashboardChildLevel, modifiedData });

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  const showDrawer = () => {
    setDrawerVisible(true);
    setDashboardChildLevel(parseInt(dashboardChildLevel) + 1);
    setDashboardLevel(parseInt(dashboardLevel) + 1);
    setIsCollapsed(true);
  };

  const closeDrawer = () => {
    setDrawerVisible(false);
    setDashboardChildLevel(parseInt(dashboardChildLevel) - 1);
    setDashboardLevel(parseInt(dashboardLevel) - 1);
    setIsCollapsed(true);
  };

  const selectHoework = (index) => {
    setSelectedHomeworkIndex(index);
  };

  const colors = Highcharts.getOptions().colors;

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

  console.log({ homeworkGraphData, homeworkGraphOuterData });

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
          ? 'Section'
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
            dashboardParentFunc({
              start_date: startDate,
              end_date: endDate,
              acadsession_id: dashboardData?.[selectedHomeworkIndex]?.acad_session_id,
              grade_id: record?.id,
            });
            showDrawer();
          }}
        >
          <EyeOutlined />
        </span>
      ),
    },
  ];

  console.log({ dataSource });

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
                  onClick={() => selectHoework(index)}
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
                    {console.log('adsfghj', dashboardChildLevel, dashboardLevel)}
                    {dashboardLevel <= 1 && (
                      <Tag
                        color='processing'
                        className='th-br-4 float-right mt-2 mr-0 th-pointer'
                        onClick={() => {
                          if (dashboardLevel === 0) {
                            dashboardChildFunc({
                              start_date: startDate,
                              end_date: endDate,
                              acadsession_id: item?.acad_session_id,
                            });
                          } else if (dashboardLevel === 1) {
                            dashboardChildFunc({
                              start_date: startDate,
                              end_date: endDate,
                              section_mapping_id: item?.id,
                            });
                          } else {
                            dashboardChildFunc({
                              start_date: startDate,
                              end_date: endDate,
                              section_mapping_id: item?.id,
                            });
                          }
                          toggleCollapse();
                        }}
                      >
                        {dashboardLevel === 0
                          ? `Grade`
                          : dashboardLevel === 1
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
                          dataSource={dashboardChildData}
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

        <DashboardChildComp
          dashboardLevel={dashboardLevel}
          setDashboardLevel={setDashboardLevel}
          drawerVisible={drawerVisible}
          closeDrawer={closeDrawer}
          showDrawer={showDrawer}
          dashboardChildLevel={dashboardChildLevel}
          setDashboardChildLevel={setDashboardChildLevel}
          dashboardParentData={dashboardParentData}
          dashboardParentFunc={dashboardParentFunc}
          dashboardChildData={dashboardChildData}
          dashboardChildFunc={dashboardChildFunc}
          startDate={startDate}
          endDate={endDate}
          childLoading={childLoading}
        />
      </div>
    </React.Fragment>
  );
};

export default DashboardComp;
