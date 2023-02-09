import React, { useState, useEffect } from 'react';
import axios from 'v2/config/axios';
import { X_DTS_HOST } from 'v2/reportApiCustomHost';
import { useHistory } from 'react-router-dom';
import endpoints from 'v2/config/endpoints';
import { useSelector } from 'react-redux';
import { message, Spin } from 'antd';
import { RiseOutlined, FallOutlined } from '@ant-design/icons';
import NoHWIcon from 'v2/Assets/dashboardIcons/studentDashboardIcons/noHW.png';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import moment from 'moment';

const HomeworkReport = () => {
  const history = useHistory();
  const selectedAcademicYear = useSelector(
    (state) => state.commonFilterReducer?.selectedYear
  );
  const [homeworkReportData, setHomeworkReportData] = useState({});
  const [loading, setLoading] = useState(false);

  const fetchHomeworkReportData = (params = {}) => {
    setLoading(true);
    axios
      .get(`${endpoints.studentDashboard.homeworkReport}`, {
        params: { ...params },
        headers: {
          'X-DTS-Host': X_DTS_HOST,
        },
      })
      .then((response) => {
        if (response.status === 200) {
          setHomeworkReportData(response?.data?.result);
          setLoading(false);
        }
      })
      .catch((error) => {
        message.error(error.message);
        setLoading(false);
      });
  };

  const optionsOverallPie = {
    chart: {
      type: 'pie',
    },

    title: {
      verticalAlign: 'middle',
      floating: true,
      text:
        'Overall' +
        '<br />' +
        `${
          homeworkReportData?.total_assigned == 0
            ? 0
            : (
                (homeworkReportData?.total_submitted /
                  homeworkReportData?.total_assigned) *
                100
              ).toFixed(2)
        }%`,
      y: 18,
      style: { fontWight: '800', color: '#32334a ', fontFamily: 'Inter, sans-serif' },
    },
    colors: ['#3AAC45', '#ff9922'],
    credits: {
      enabled: false,
    },

    plotOptions: {
      pie: {
        shadow: true,
      },
    },
    tooltip: {
      formatter: function () {
        return '<b>' + this.point.name + '</b>: ' + this.percentage.toFixed(2) + ' %';
      },
    },
    series: [
      {
        data: [
          ['Total Submitted', homeworkReportData?.total_submitted],
          ['Total Pending', homeworkReportData?.total_pending],
        ],
        // size: '100%',
        innerSize: '85%',
        showInLegend: false,
        dataLabels: {
          enabled: false,
        },
      },
    ],
  };

  useEffect(() => {
    if (selectedAcademicYear)
      fetchHomeworkReportData({
        session_id: selectedAcademicYear?.id,
      });
  }, [selectedAcademicYear]);

  return (
    <div className='th-bg-white th-br-5 py-3 px-2 shadow-sm' style={{ minHeight: 240 }}>
      <div className='row justify-content-between'>
        <div className='col-12 th-16 mt-2 th-fw-500 th-black-1'>Homework Performance</div>
      </div>
      {loading ? (
        <div className='th-width-100 text-center mt-5'>
          <Spin tip='Loading...'></Spin>
        </div>
      ) : homeworkReportData?.total_assigned > 0 ? (
        <div className='th-custom-col-padding'>
          <div className='row px-2'>
            <div className='col-12 px-0 text-center'>
              <div className='d-flex justify-content-between'>
                <div>
                  <HighchartsReact
                    highcharts={Highcharts}
                    options={optionsOverallPie}
                    containerProps={{
                      style: {
                        height: '200px',
                        width: window.innerWidth < 892 ? '160px' : '190px',
                        marginRight: '-30px',
                      },
                    }}
                  />
                </div>
                <div className='d-flex flex-column justify-content-center th-fw-500 mr-3'>
                  <div className='th-grey py-1 d-flex justify-content-between'>
                    <span>Total Assigned :</span>{' '}
                    <span>{homeworkReportData?.total_assigned}</span>
                  </div>
                  <div className='th-green-2 py-1 d-flex justify-content-between'>
                    <span>Total Submitted :</span>{' '}
                    <span>&nbsp;{homeworkReportData?.total_submitted}</span>
                  </div>
                  <div className='th-yellow py-1 d-flex justify-content-between'>
                    <span>Total Pending :</span>{' '}
                    <span>{homeworkReportData?.total_pending}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className='d-flex justify-content-between align-items-center px-2'>
            {homeworkReportData?.cur_month_performance !== null && (
              <div className={`th-black-1 th-12`}>
                <div>
                  % Submission in this Month(
                  {moment().format('MMM')}) - {homeworkReportData?.cur_month_performance}{' '}
                  %
                </div>
                <div>
                  <span
                    className={`${
                      homeworkReportData?.monthly_performance > 0
                        ? 'th-green-2'
                        : 'th-red'
                    }`}
                  >
                    {homeworkReportData?.monthly_performance > 0 ? (
                      <RiseOutlined className='mr-1' />
                    ) : (
                      <FallOutlined className='mr-1' />
                    )}
                    {homeworkReportData?.monthly_performance} %{' '}
                  </span>
                  since previous Month
                </div>
              </div>
            )}

            <div
              className='th-black-1 th-bg-grey p-2 th-br-8 badge th-pointer'
              style={{ outline: '1px solid #d9d9d9' }}
              onClick={() => history.push('/homework/student')}
            >
              View Details
            </div>
          </div>
        </div>
      ) : (
        <div className='d-flex justify-content-center mt-5'>
          <img src={NoHWIcon} style={{ height: '120px', objectFit: 'cover' }} />
        </div>
      )}
    </div>
  );
};

export default HomeworkReport;
