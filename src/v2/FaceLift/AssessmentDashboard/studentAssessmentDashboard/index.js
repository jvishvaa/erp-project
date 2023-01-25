import React, { useState, useEffect } from 'react';
import Layout from 'containers/Layout';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import { RightOutlined, DownOutlined } from '@ant-design/icons';
import { Table, Breadcrumb, Progress, Empty, Drawer, Spin, DatePicker } from 'antd';
import axios from 'v2/config/axios';
import endpoints from 'v2/config/endpoints';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { X_DTS_HOST } from 'v2/reportApiCustomHost';
import _ from 'lodash';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import moment from 'moment';

const { RangePicker } = DatePicker;

const StudentAssessmentDashboard = () => {
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [monthWiseAssessment, setMonthWiseAssessment] = useState(null);
  const [subjectWiseAssessment, setSubjectWiseAssessment] = useState([]);
  const [testWiseAssessment, setTestWiseAssessment] = useState([]);
  const [testDetail, setTestDetail] = useState([]);
  const [assessmentConfig, setAssessmentConfig] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [monthLoader, setMonthLoader] = useState(false);
  const [subjectLoader, setSubjectLoader] = useState(false);
  const [testLoader, setTestLoader] = useState(false);
  const [testDetailLoader, setTestDetailLoader] = useState(false);
  const [loading, setLoading] = useState(null);
  const [startDate, setStartDate] = useState(
    moment().subtract(30, 'days').startOf('day').format('YYYY-MM-DD')
  );
  const [endDate, setEndDate] = useState(moment().format('YYYY-MM-DD'));

  const [overallSelected, setOverallSelected] = useState(true);

  const selectedBranch = useSelector(
    (state) => state.commonFilterReducer?.selectedBranch
  );

  useEffect(() => {
    checkAssessmentConfig({ branch_id: selectedBranch?.branch?.id });
  }, []);

  const checkAssessmentConfig = (params = {}) => {
    setLoading(true);
    axios
      .get(`${endpoints.assessmentDashboard.assessmentConfig}`, {
        params: { ...params },
        headers: {
          'X-DTS-Host': X_DTS_HOST,
        },
      })
      .then((response) => {
        if (response.status === 200) {
          setAssessmentConfig(response?.data?.dashboard_enabled);
          if (response?.data?.dashboard_enabled) {
            fetchMonthWiseAssessment({ acad_session: selectedBranch.id });
            fetchSubjectWiseAssessment({ acad_session: selectedBranch.id });
            fetchTestWiseAssessment({ acad_session: selectedBranch.id, page_size: 500 });
          }
          setLoading(false);
        }
      })
      .catch((error) => {
        console.log(error);
        setLoading(false);
      });
  };

  const fetchMonthWiseAssessment = (params = {}) => {
    setMonthLoader(true);
    axios
      .get(`${endpoints.assessmentDashboard.studentMonthwiseAssessment}`, {
        params: { ...params },
        headers: {
          'X-DTS-Host': X_DTS_HOST,
        },
      })
      .then((response) => {
        if (response.status === 200) {
          setMonthWiseAssessment(response?.data.month_wise_performance);
          setMonthLoader(false);
        }
      })
      .catch((error) => {
        console.log(error);
        setMonthLoader(false);
      });
  };

  const fetchSubjectWiseAssessment = (params = {}) => {
    setSubjectLoader(true);
    axios
      .get(`${endpoints.assessmentDashboard.studentSubjectwiseAssessment}`, {
        params: { ...params },
        headers: {
          'X-DTS-Host': X_DTS_HOST,
        },
      })
      .then((response) => {
        if (response.status === 200) {
          setSubjectWiseAssessment(response?.data);
          setSubjectLoader(false);
        }
      })
      .catch((error) => {
        console.log(error);
        setSubjectLoader(false);
      });
  };

  const fetchTestWiseAssessment = (params = {}) => {
    setTestLoader(true);
    axios
      .get(`${endpoints.assessmentDashboard.studentTestwiseAssessment}`, {
        params: { ...params },
        headers: {
          'X-DTS-Host': X_DTS_HOST,
        },
      })
      .then((response) => {
        if (response.status === 200) {
          setTestWiseAssessment(response?.data.results);
          setTestLoader(false);
        }
      })
      .catch((error) => {
        console.log(error);
        setTestLoader(false);
      });
  };

  const showDrawer = (data) => {
    setDrawerOpen(true);
    handleTestDetails({ test_id: data.id });
  };

  const handleSubjectSelection = (selectedSubject) => {
    setSelectedSubject(selectedSubject?.test__subjects__id);
    setOverallSelected(selectedSubject === 'overall' ? true : false);

    fetchTestWiseAssessment({
      acad_session: selectedBranch.id,
      page_size: 500,

      start_date: startDate,
      end_date: endDate,
      subject_id:
        selectedSubject === 'overall' ? null : selectedSubject?.test__subjects__id,
    });
  };

  useEffect(() => {
    if (assessmentConfig) {
      fetchMonthWiseAssessment({
        acad_session: selectedBranch.id,
        subject_id: selectedSubject,
      });
    }
  }, [selectedSubject]);

  const handleTestDetails = (params = {}) => {
    setTestDetailLoader(true);
    axios
      .get(`${endpoints.assessmentDashboard.studentTestDetail}`, {
        params: { ...params },
        headers: {
          'X-DTS-Host': X_DTS_HOST,
        },
      })
      .then((response) => {
        if (response.status === 200) {
          setTestDetail(response?.data);
          setTestDetailLoader(false);
        }
      })
      .catch((error) => {
        console.log(error);
        setTestDetailLoader(false);
      });
  };
  const onCloseDrawer = () => {
    setDrawerOpen(false);
    setTestDetail(null);
  };

  const handleDateChange = (value) => {
    if (value) {
      setStartDate(moment(value[0]).format('YYYY-MM-DD'));
      setEndDate(moment(value[1]).format('YYYY-MM-DD'));
      if (value[0] && value[1]) {
        fetchTestWiseAssessment({
          acad_session: selectedBranch.id,
          page_size: 500,
          start_date: value[0].format('YYYY-MM-DD'),
          end_date: value[1].format('YYYY-MM-DD'),
          subject_id: selectedSubject === 'overall' ? null : selectedSubject,
        });
      }
    }
  };

  const barOptions = {
    chart: {
      backgroundColor: '#f8f8f8',
    },
    title: {
      text: '',
    },
    colors: ['#1b4ccb'],
    series: [
      {
        showInLegend: false,
        data: _.map(monthWiseAssessment, 'percentage'),
        name: 'Marks %',
      },
    ],

    xAxis: {
      reversed: false,
      title: {
        text: 'Months',
      },

      categories: _.map(monthWiseAssessment, 'test_date__month_name'),
    },
    yAxis: {
      title: {
        text: 'Percentage',
      },
      labels: {
        format: '{value} %',
      },
      max: 100,
    },
    credits: {
      enabled: false,
    },
  };

  const barChartOptions = {
    chart: {
      type: 'column',
    },
    title: {
      text: '',
    },
    colors: ['#09a23a', '#f8222f'],
    xAxis: {
      categories: ['Easy', 'Medium', 'Hard'],
      crosshair: true,
    },
    yAxis: {
      min: 0,
      title: {
        text: 'Count',
      },
    },

    plotOptions: {
      column: {
        pointPadding: 0.2,
        borderWidth: 0,
      },
    },
    series: [
      {
        name: 'Correct',
        data: _.map(testDetail?.difficulty_wise_stats, 'correct'),
      },
      {
        name: 'Wrong',
        data: _.map(testDetail?.difficulty_wise_stats, 'wrong'),
      },
    ],
    credits: {
      enabled: false,
    },
  };

  const testColumns = [
    {
      title: <span className='th-white th-fw-700'>Test Name</span>,
      width: '30%',
      align: 'left',
      render: (data) => (
        <span className='th-black-1 th-14 text-capitalize'>{data?.test_name}</span>
      ),
    },

    {
      title: <span className='th-white th-fw-700'>Test Type</span>,
      width: '15%',
      align: 'center',
      render: (data) => <span className='th-black-1 th-16'>{data?.test_type}</span>,
    },

    {
      title: <span className='th-white th-fw-700'>Total Marks</span>,
      width: '15%',
      align: 'center',
      render: (data) => (
        <span className='th-black-1 th-16'>{data?.marks_data?.total_marks}</span>
      ),
    },
    {
      title: <span className='th-white th-fw-700'>Marks</span>,
      width: '20%',
      align: 'center',
      render: (data) => (
        <span className='th-black-1 th-16'>{data?.marks_data?.marks_secured}</span>
      ),
    },
    {
      title: <span className='th-white th-fw-700'>Percentage(%)</span>,
      width: '15%',
      align: 'center',
      render: (data) => (
        <span className='th-black-1 th-16'>{data?.marks_data?.percentage}</span>
      ),
    },
    {
      align: 'center',
      width: '5%',
      key: 'icon',
      render: (data, row) => (
        <span onClick={() => showDrawer(data)}>
          {data?.current_status === 'Completed' &&
          data?.marks_data?.marks_secured != 'not attempted' &&
          data?.test_mode === '1' ? (
            <RightOutlined className='th-grey th-pointer' />
          ) : null}
        </span>
      ),
    },
  ];

  return (
    <Layout>
      {assessmentConfig ? (
        <div className=''>
          <div className='row pt-3'>
            <div className='col-md-12'>
              <Breadcrumb separator='>'>
                <Breadcrumb.Item href='/dashboard' className='th-grey th-pointer'>
                  Dashboard
                </Breadcrumb.Item>
                <Breadcrumb.Item className='th-black-1'>
                  Assessment Dashboard
                </Breadcrumb.Item>
              </Breadcrumb>
            </div>
            <div className='col-md-12 mt-3'>
              <div className='th-bg-white th-br-5 py-3 px-2 shadow-sm'>
                <div className='row justify-content-between'>
                  <div className='col-8 col-md-6 th-16 th-fw-500 th-black-1 d-flex flex-column flex-md-row align-items-md-center'>
                    Assessment Dashboard{' '}
                    <div className='th-12 pl-0 pl-md-3 th-pointer th-primary'></div>
                  </div>
                </div>
                <div className='row pt-2'>
                  {subjectLoader ? (
                    <div className='py-5 text-center w-100'>
                      <Spin />
                    </div>
                  ) : (
                    subjectWiseAssessment?.subject_wise_performance?.map(
                      (eachSubject) => {
                        return (
                          <div className='col-md-3 mt-1'>
                            <div
                              className='py-2 px-2 mt-2 th-br-6 th-pointer'
                              onClick={() => handleSubjectSelection(eachSubject)}
                              style={{
                                outline:
                                  eachSubject.test__subjects__id === selectedSubject
                                    ? '2px solid #1b4ccb'
                                    : 'none',
                                backgroundColor:
                                  eachSubject.test__subjects__id === selectedSubject
                                    ? '#e9e9e9'
                                    : '#f8f8f8',
                              }}
                            >
                              <div className='d-flex justify-content-between py-2 th-16 th-fw-500 th-black-1'>
                                <div>{eachSubject?.test__subjects__subject_name}</div>
                                <div>{eachSubject?.percentage?.toFixed(2)}%</div>
                              </div>
                            </div>
                          </div>
                        );
                      }
                    )
                  )}
                </div>
                <div className='row mt-3'>
                  <div className='col-md-3'>
                    <div
                      className='py-2 px-2 th-br-6 th-pointer'
                      style={{
                        outline: overallSelected ? '2px solid #1b4ccb' : 'none',
                        backgroundColor: '#e9e9e9',
                        minHeight: '210px',
                      }}
                      onClick={() => handleSubjectSelection('overall')}
                    >
                      <div className='text-center'>
                        <div className='pb-4 th-20 th-fw-500 th-black-1'>
                          Overall Performance
                        </div>
                        <Progress
                          type='dashboard'
                          percent={subjectWiseAssessment?.overall_performance?.toFixed(2)}
                          width={110}
                          // strokeColor='#1b4ccb'
                          trailColor='#d5d5d5'
                          strokeColor={{
                            '0%': '#819adb',
                            '30%': '#4369cd',
                            '60%': '#1b4ccb',
                          }}
                        />
                      </div>
                    </div>
                  </div>
                  <div
                    className='col-md-9 th-br-6  th-pointer'
                    style={{ minHeight: '150px' }}
                  >
                    {monthLoader ? (
                      <div className='pt-5 mt-5 text-center'>
                        <Spin />
                      </div>
                    ) : (
                      <HighchartsReact
                        highcharts={Highcharts}
                        options={barOptions}
                        containerProps={{
                          style: { height: '220px', borderRadius: '6px' },
                        }}
                      />
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Table */}
          <div className='mb-3'>
            <div className='col-md-12 pt-3 '>
              <div className='row justify-content-between th-bg-white py-4 th-br-6 shadow-sm px-2'>
                <div className='col-md-8 pb-3'>
                  <div className='th-16'>Test Wise</div>
                </div>
                <div className='col-md-4 text-right pb-3'>
                  <RangePicker
                    allowClear={false}
                    bordered={false}
                    showToday={false}
                    defaultValue={[moment(startDate), moment(endDate)]}
                    onChange={(value) => handleDateChange(value)}
                    className='th-br-4'
                    separator={'to'}
                    // format={'DD/MM/YYYY'}
                  />
                </div>
                <div className='col-md-12'>
                  <Table
                    className='th-table'
                    rowClassName={(record, index) =>
                      index % 2 === 0 ? 'th-bg-grey' : 'th-bg-white'
                    }
                    columns={testColumns}
                    dataSource={testWiseAssessment}
                    pagination={false}
                    scroll={{ y: 300 }}
                    loading={testLoader}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <>
          <div className='row'>
            <div className='col-md-12'>
              <Breadcrumb separator='>'>
                <Breadcrumb.Item href='/dashboard' className='th-grey th-pointer'>
                  Dashboard
                </Breadcrumb.Item>
                <Breadcrumb.Item className='th-black-1'>
                  Assessment Dashboard
                </Breadcrumb.Item>
              </Breadcrumb>
            </div>
          </div>

          <div className='py-5 mt-3 text-center'>
            {loading || loading === null ? (
              <Spin />
            ) : (
              <Empty
                description={
                  <span>
                    Nothing to show. Please go back to{' '}
                    <Link to='/dashboard'>Dashboard</Link>
                  </span>
                }
              />
            )}
          </div>
        </>
      )}

      <Drawer
        title='Test Details'
        placement='right'
        onClose={onCloseDrawer}
        visible={drawerOpen}
        width={500}
      >
        {testDetailLoader ? (
          <div className='py-5 text-center'>
            <Spin />
          </div>
        ) : (
          <>
            {' '}
            <div className='pb-3'>
              <div className='pb-1'>Test Name: {testDetail?.test_name}</div>
              <div className='pb-1'>No of Questions : {testDetail?.total_questions}</div>
              <div className='pb-1'>
                Time Taken:
                {testDetail?.time_taken?.hours
                  ? `${testDetail?.time_taken?.hours} hour`
                  : ''}{' '}
                {testDetail?.time_taken?.minutes
                  ? `${testDetail?.time_taken?.minutes} min`
                  : ''}{' '}
                {testDetail?.time_taken?.seconds
                  ? `${testDetail?.time_taken?.seconds} seconds`
                  : ''}{' '}
              </div>
            </div>
            <HighchartsReact
              highcharts={Highcharts}
              options={barChartOptions}
              containerProps={{ style: { height: '300px', borderRadius: '6px' } }}
            />
          </>
        )}
      </Drawer>
    </Layout>
  );
};

export default StudentAssessmentDashboard;
