import { Breadcrumb, Button, message, Rate } from 'antd';
import endpoints from 'config/endpoints';
import Layout from 'containers/Layout';
import React, { useEffect, useRef, useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import axiosInstance from 'v2/config/axios';
import '../BranchStaffSide/branchside.scss';
import { Calendar } from 'antd';
import moment from 'moment';
import './index.scss';

const EvaluatorDash = () => {
  const history = useHistory();
  const [selectedDate, setSelectedDate] = useState(moment().format('DD-MM-YYYY'));

  const firstDayOfMonth = moment().startOf('month').format('DD-MM-YYYY');
  const lastDayOfMonth = moment().endOf('month').format('DD-MM-YYYY');
  const [startDate, setStartDate] = useState(firstDayOfMonth);
  const [endDate, setEndDate] = useState(lastDayOfMonth);
  const [reportData, setReportData] = useState([]);
  const [overallReport, setOverallReport] = useState();
  const userData = JSON.parse(localStorage.getItem('userDetails'));

  console.log({ startDate });

  useEffect(() => {
    fetchReport({
      start_date: startDate,
      end_date: endDate,
    });
  }, []);

  const handlePanelChange = (value, mode) => {
    const firstDayOfMonth = moment(value).startOf('month').format('DD-MM-YYYY');
    const lastDayOfMonth = moment(value).endOf('month').format('DD-MM-YYYY');
    setStartDate(firstDayOfMonth);
    setEndDate(lastDayOfMonth);
    setSelectedDate(moment(value).format('DD-MM-YYYY'));
    fetchReport({
      start_date: firstDayOfMonth,
      end_date: lastDayOfMonth,
    });
  };
  const fetchReport = async (params = {}) => {
    await axiosInstance
      .get(`${endpoints.centralizedHomework.evaluatorReport}`, {
        params: { ...params },
      })
      .then((res) => {
        if (res?.data?.status_code === 200) {
          setReportData(res?.data?.result?.monthly_report);
          setOverallReport(res?.data?.result?.average_report);
        } else {
          message.error(res?.data?.message);
        }
      })
      .catch((error) => {
        message.error(error.message);
      });
  };

  const getListData = (value) => {
    let listData;
    let findDate = reportData?.map((e) => {
      if (e?.file_date == moment(value).format('YYYY-MM-DD')) {
        listData = [
          {
            allotted: e?.allotted,
            assessed: e?.assessed,
          },
        ];
      }
    });
    return listData || [];
  };
  const dateCellRender = (value) => {
    const listData = getListData(value);
    console.log(value, listData, 'listData');
    return (
      <div className='events'>
        {listData.map((item) => (
          <div className='col-md-12'>
            <p className='m-0'>{item?.assessed}</p>
            <div style={{ borderBottom: '2px solid black' }}></div>
            <p className='m-0'>{item?.allotted}</p>
          </div>
        ))}
      </div>
    );
  };

  const disabledDate = (date) => {
    console.log({ date });
    if (date) {
      return true;
    }
    return false;
  };

  const handleAssesment = () => {
    history.push('/homework/centralized-home');
  };

  return (
    <React.Fragment>
      <Layout>
        {/* Breadcrumb */}
        <div className='row py-3'>
          <div className='col-md-9' style={{ zIndex: 2 }}>
            <Breadcrumb separator='>'>
              <Breadcrumb.Item href='/dashboard' className='th-grey th-16'>
                Dashboard
              </Breadcrumb.Item>
              <Breadcrumb.Item className='th-black-1 th-16'>Evaluator</Breadcrumb.Item>
            </Breadcrumb>
          </div>
        </div>

        <div className='row'>
          <div className='col-md-12'>
            <div className='th-bg-white th-br-5 py-3 px-2 shadow-sm'>
              <div className='col-md-12 d-flex justify-content-center'>
                <div className='th-25 py-1'>Date : {selectedDate}</div>
              </div>
              <div className='row col-md-12 justify-content-center'>
                <div className='th-22'>
                  {moment(startDate, 'DD-MM-YYYY').format('MMMM')}
                </div>
                <div className='th-22 px-1'>{moment(startDate).format('YYYY')}</div>
              </div>
              <div className='row'>
                <div className='col-md-5 col-lg-4'>
                  <div className='card summary-card'>
                    <div className='card-body text-center'>
                      <h6>
                        Your {moment(startDate, 'DD-MM-YYYY').format('MMMM')}'s Assessment
                        summary
                      </h6>
                      <p className='th-fw-600'>
                        {userData?.first_name} {userData?.last_name}
                      </p>
                      <p className='mb-1'>
                        Total Assessed : {overallReport?.total_assessed}
                      </p>
                      <p>Total Alloted : {overallReport?.total_allotted}</p>
                      <div className='assesment-summary'>
                        <p className='mb-0'> Overall Rating</p>
                        <Rate
                          allowHalf
                          value={overallReport?.average_rating}
                          disabled={true}
                        />
                      </div>
                      <Button
                        type='primary'
                        className='th-br-4 mt-3'
                        onClick={handleAssesment}
                      >
                        Start Assessment
                      </Button>
                    </div>
                  </div>
                </div>
                <div className='col-md-7 col-lg-8 evaluator-calendar'>
                  <Calendar
                    dateCellRender={dateCellRender}
                    disabledDate={disabledDate}
                    onPanelChange={handlePanelChange}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    </React.Fragment>
  );
};

export default EvaluatorDash;
