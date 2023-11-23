import React, { useState, useEffect } from 'react';
import Layout from 'containers/Layout';
import axios from 'v2/config/axios';
import endpoints from 'v2/config/endpoints';
import TimeTableNewView from './TimeTableNewView';
import moment from 'moment';

import { Breadcrumb, Spin, message, DatePicker, Card } from 'antd';
const { RangePicker } = DatePicker;

const StudentTimeTable = () => {
  const [loading, setLoading] = useState(false);
  const [dates, setDates] = useState(null);
  const [value, setValue] = useState([
    moment('2023-12-04'),
    moment('2023-12-04').add(6, 'days'),
  ]);
  const [currentWeekTimeTable, setCurrentWeekTimeTable] = useState([]);

  const fetchCurrentWeekTimeTable = (params = {}) => {
    setLoading(true);
    axios
      .get(`${endpoints.timeTableNewFlow.studentTimeTableView}/`, {
        params: { ...params },
      })
      .then((res) => {
        if (res?.data?.status_code == 200) {
          setCurrentWeekTimeTable(res?.data?.result?.result);
        } else {
          setCurrentWeekTimeTable([]);
        }
      })
      .catch((error) => message.error('error', error?.message))
      .finally(() => {
        setLoading(false);
      });
  };

  const disabledDate = (current) => {
    if (!dates) {
      return false;
    }
    const tooLate = dates[0] && current.diff(dates[0], 'days') > 6;
    const tooEarly = dates[1] && dates[1].diff(current, 'days') > 6;
    return !!tooEarly || !!tooLate;
  };
  const onOpenChange = (open) => {
    if (open) {
      setDates([null, null]);
    } else {
      setDates(null);
    }
  };

  useEffect(() => {
    if (value.length > 1) {
      fetchCurrentWeekTimeTable({
        start: moment(value[0]).format('YYYY-MM-DD'),
        end: moment(value[1]).format('YYYY-MM-DD'),
      });
    }
  }, [value]);
  return (
    <React.Fragment>
      <Layout>
        <div className='row py-3 px-2'>
          <div className='col-md-9' style={{ zIndex: 2 }}>
            <Breadcrumb separator='>'>
              <Breadcrumb.Item href='/dashboard' className='th-grey th-16'>
                Dashboard
              </Breadcrumb.Item>
              <Breadcrumb.Item className='th-black-1 th-16'>TimeTable</Breadcrumb.Item>
            </Breadcrumb>
          </div>
        </div>
        <div className='row px-3'>
          <div className='col-12 th-bg-white'>
            <div className='row'>
              <div className='col-md-5 py-2 pr-0'>
                <div className='d-flex align-items-center'>
                  <span className='th-fw-600'>Select Date Range: </span>
                  <span className='pl-2'>
                    <RangePicker
                      className='w-100'
                      popupStyle={{ zIndex: 2100 }}
                      value={dates || value}
                      disabledDate={disabledDate}
                      onCalendarChange={(val) => setDates(val)}
                      onChange={(val) => setValue(val)}
                      onOpenChange={onOpenChange}
                    />
                  </span>
                </div>
              </div>
            </div>

            <div className={`mt-3 px-2 ${loading ? 'py-5' : ''}`}>
              <Spin spinning={loading}>
                <Card className='th-br-8'>
                  {currentWeekTimeTable?.length > 0 && (
                    <TimeTableNewView
                      currentWeekTimeTable={currentWeekTimeTable}
                      startDate={moment(value[0]).format('YYYY-MM-DD')}
                    />
                  )}
                </Card>
              </Spin>
            </div>
          </div>
        </div>
      </Layout>
    </React.Fragment>
  );
};

export default StudentTimeTable;
