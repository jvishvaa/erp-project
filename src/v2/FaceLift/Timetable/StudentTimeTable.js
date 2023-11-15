import React, { useState, useEffect } from 'react';
import Layout from 'containers/Layout';
import axios from 'v2/config/axios';
import endpoints from 'v2/config/endpoints';
import TimeTableNewView from './TimeTableNewView';
import moment from 'moment';

import { Breadcrumb, Spin, message, DatePicker } from 'antd';
const { RangePicker } = DatePicker;

const StudentTimeTable = () => {
  const [loading, setLoading] = useState(false);
  const [dates, setDates] = useState(null);
  const [value, setValue] = useState([moment(), moment().add(6, 'days')]);
  const [currentWeekTimeTable, setCurrentWeekTimeTable] = useState({});

  const fetchCurrentWeekTimeTable = (params = {}) => {
    setLoading(true);
    axios
      .get(`${endpoints.timeTableNewFlow.studentTimeTableView}/`, {
        params: { ...params },
      })
      .then((res) => {
        if (res?.data?.status_code == 200) {
          // setCurrentWeekTimeTable(res?.data?.result?.result);
          setCurrentWeekTimeTable([
            {
              id: 145,
              week_days: 0,
              time_set_id: 143,
              time_set_name: 'Time Slot 3',
              period_slot: [
                {
                  id: 166,
                  period_name: 'Period 1',
                  start_time: '09:00:00',
                  end_time: '10:00:00',
                  periods: [
                    {
                      id: 186,
                      lecture_type: 3,
                      date: '2023-11-09',
                      sub_teacher: [
                        {
                          id: 17838,
                          name: 'testing   P',
                          user: 20543,
                        },
                        {
                          id: 17238,
                          name: "Activity Teacher  Don't EDIT/Delete",
                          user: 19875,
                        },
                      ],
                      sub: [
                        {
                          id: 8440,
                          subject_id: 91,
                          subject_name: 'Biology',
                        },
                        {
                          id: 7487,
                          subject_id: 3,
                          subject_name: 'Hindi',
                        },
                      ],
                    },
                  ],
                },
                {
                  id: 167,
                  period_name: 'Period 2',
                  start_time: '10:00:00',
                  end_time: '11:00:00',
                  periods: [
                    {
                      id: 185,
                      lecture_type: 2,
                      date: '2023-11-10',
                      sub_teacher: [
                        {
                          id: 17900,
                          name: 'vinay  Teacher',
                          user: 20638,
                        },
                        {
                          id: 17744,
                          name: 'grade 2 teacher new   sd',
                          user: 20355,
                        },
                      ],
                      sub: [
                        {
                          id: 7487,
                          subject_id: 3,
                          subject_name: 'Hindi',
                        },
                        {
                          id: 7485,
                          subject_id: 6,
                          subject_name: 'Maths',
                        },
                      ],
                    },
                  ],
                },
                {
                  id: 168,
                  period_name: 'Period 3',
                  start_time: '11:00:00',
                  end_time: '12:00:00',
                  periods: [
                    {
                      id: 176,
                      lecture_type: 1,
                      date: '2023-11-09',
                      sub_teacher: [
                        {
                          id: 14106,
                          name: 'Pr  Lead',
                          user: 15621,
                        },
                        {
                          id: 10654,
                          name: 'old  QA',
                          user: 12076,
                        },
                      ],
                      sub: [
                        {
                          id: 12,
                          subject_id: 1,
                          subject_name: 'social science',
                        },
                      ],
                    },
                  ],
                },
              ],
              sec_map: [3736],
            },
            {
              id: 146,
              week_days: 1,
              time_set_id: 143,
              time_set_name: 'Time Slot 3',
              period_slot: [
                {
                  id: 166,
                  period_name: 'Period 1',
                  start_time: '09:00:00',
                  end_time: '10:00:00',
                  periods: [
                    {
                      id: 186,
                      lecture_type: 3,
                      date: '2023-11-09',
                      sub_teacher: [
                        {
                          id: 17838,
                          name: 'testing   P',
                          user: 20543,
                        },
                        {
                          id: 17238,
                          name: "Activity Teacher  Don't EDIT/Delete",
                          user: 19875,
                        },
                      ],
                      sub: [
                        {
                          id: 8440,
                          subject_id: 91,
                          subject_name: 'Biology',
                        },
                        {
                          id: 7487,
                          subject_id: 3,
                          subject_name: 'Hindi',
                        },
                      ],
                    },
                  ],
                },
                {
                  id: 167,
                  period_name: 'Period 2',
                  start_time: '10:00:00',
                  end_time: '11:00:00',
                  periods: [
                    {
                      id: 185,
                      lecture_type: 2,
                      date: '2023-11-10',
                      sub_teacher: [
                        {
                          id: 17900,
                          name: 'vinay  Teacher',
                          user: 20638,
                        },
                        {
                          id: 17744,
                          name: 'grade 2 teacher new   sd',
                          user: 20355,
                        },
                      ],
                      sub: [
                        {
                          id: 7487,
                          subject_id: 3,
                          subject_name: 'Hindi',
                        },
                        {
                          id: 7485,
                          subject_id: 6,
                          subject_name: 'Maths',
                        },
                      ],
                    },
                  ],
                },
                {
                  id: 168,
                  period_name: 'Period 3',
                  start_time: '11:00:00',
                  end_time: '12:00:00',
                  periods: [
                    {
                      id: 176,
                      lecture_type: 1,
                      date: '2023-11-09',
                      sub_teacher: [
                        {
                          id: 14106,
                          name: 'Pr  Lead',
                          user: 15621,
                        },
                        {
                          id: 10654,
                          name: 'old  QA',
                          user: 12076,
                        },
                      ],
                      sub: [
                        {
                          id: 12,
                          subject_id: 1,
                          subject_name: 'social science',
                        },
                      ],
                    },
                  ],
                },
              ],
              sec_map: [3736],
            },
            {
              id: 147,
              week_days: 2,
              time_set_id: 137,
              time_set_name: 'new slot 2',
              period_slot: [
                {
                  id: 163,
                  period_name: 'Period 3',
                  start_time: '09:00:00',
                  end_time: '10:00:00',
                  periods: [
                    {
                      id: 187,
                      lecture_type: 2,
                      date: '2023-11-09',
                      sub_teacher: [
                        {
                          id: 16646,
                          name: 'testing  sai',
                          user: 18889,
                        },
                      ],
                      sub: [
                        {
                          id: 12140,
                          subject_id: 227,
                          subject_name: 'Maths 2',
                        },
                      ],
                    },
                  ],
                },
                {
                  id: 160,
                  period_name: 'Period 2',
                  start_time: '10:00:00',
                  end_time: '11:00:00',
                  periods: [
                    {
                      id: 177,
                      lecture_type: 1,
                      date: '2023-11-10',
                      sub_teacher: [
                        {
                          id: 26,
                          name: "Danica ClydeD'Souza",
                          user: 50,
                        },
                      ],
                      sub: [
                        {
                          id: 12,
                          subject_id: 1,
                          subject_name: 'social science',
                        },
                      ],
                    },
                  ],
                },
                {
                  id: 161,
                  period_name: 'Period 3',
                  start_time: '11:00:00',
                  end_time: '12:00:00',
                  periods: [
                    {
                      id: 178,
                      lecture_type: 1,
                      date: '2023-11-13',
                      sub_teacher: [
                        {
                          id: 26,
                          name: "Danica ClydeD'Souza",
                          user: 50,
                        },
                      ],
                      sub: [
                        {
                          id: 12,
                          subject_id: 1,
                          subject_name: 'social science',
                        },
                      ],
                    },
                  ],
                },
              ],
              sec_map: [3736],
            },
            {
              id: 148,
              week_days: 3,
              time_set_id: 137,
              time_set_name: 'new slot 2',
              period_slot: [
                {
                  id: 163,
                  period_name: 'Period 3',
                  start_time: '09:00:00',
                  end_time: '10:00:00',
                  periods: [
                    {
                      id: 187,
                      lecture_type: 2,
                      date: '2023-11-09',
                      sub_teacher: [
                        {
                          id: 16646,
                          name: 'testing  sai',
                          user: 18889,
                        },
                      ],
                      sub: [
                        {
                          id: 12140,
                          subject_id: 227,
                          subject_name: 'Maths 2',
                        },
                      ],
                    },
                  ],
                },
                {
                  id: 160,
                  period_name: 'Period 2',
                  start_time: '10:00:00',
                  end_time: '11:00:00',
                  periods: [
                    {
                      id: 177,
                      lecture_type: 1,
                      date: '2023-11-10',
                      sub_teacher: [
                        {
                          id: 26,
                          name: "Danica ClydeD'Souza",
                          user: 50,
                        },
                      ],
                      sub: [
                        {
                          id: 12,
                          subject_id: 1,
                          subject_name: 'social science',
                        },
                      ],
                    },
                  ],
                },
                {
                  id: 161,
                  period_name: 'Period 3',
                  start_time: '11:00:00',
                  end_time: '12:00:00',
                  periods: [
                    {
                      id: 178,
                      lecture_type: 1,
                      date: '2023-11-13',
                      sub_teacher: [
                        {
                          id: 26,
                          name: "Danica ClydeD'Souza",
                          user: 50,
                        },
                      ],
                      sub: [
                        {
                          id: 12,
                          subject_id: 1,
                          subject_name: 'social science',
                        },
                      ],
                    },
                  ],
                },
              ],
              sec_map: [3736],
            },
            {
              id: 149,
              week_days: 4,
              time_set_id: 134,
              time_set_name: 'New Time Slot',
              period_slot: [
                {
                  id: 138,
                  period_name: 'Period 1',
                  start_time: '09:00:00',
                  end_time: '10:00:00',
                  periods: [
                    {
                      id: 179,
                      lecture_type: 1,
                      date: '2023-11-13',
                      sub_teacher: [
                        {
                          id: 26,
                          name: "Danica ClydeD'Souza",
                          user: 50,
                        },
                      ],
                      sub: [
                        {
                          id: 12,
                          subject_id: 1,
                          subject_name: 'social science',
                        },
                      ],
                    },
                  ],
                },
                {
                  id: 164,
                  period_name: 'Period 2',
                  start_time: '10:00:00',
                  end_time: '11:00:00',
                  periods: [
                    {
                      id: 180,
                      lecture_type: 1,
                      date: '2023-11-13',
                      sub_teacher: [
                        {
                          id: 26,
                          name: "Danica ClydeD'Souza",
                          user: 50,
                        },
                      ],
                      sub: [
                        {
                          id: 12,
                          subject_id: 1,
                          subject_name: 'social science',
                        },
                      ],
                    },
                  ],
                },
                {
                  id: 165,
                  period_name: 'Period 3',
                  start_time: '11:00:00',
                  end_time: '12:00:00',
                  periods: [
                    {
                      id: 172,
                      lecture_type: 1,
                      date: '2023-11-10',
                      sub_teacher: [
                        {
                          id: 26,
                          name: "Danica ClydeD'Souza",
                          user: 50,
                        },
                      ],
                      sub: [
                        {
                          id: 12,
                          subject_id: 1,
                          subject_name: 'social science',
                        },
                      ],
                    },
                  ],
                },
              ],
              sec_map: [3736],
            },
            {
              id: 150,
              week_days: 5,
              time_set_id: 137,
              time_set_name: 'new slot 2',
              period_slot: [
                {
                  id: 163,
                  period_name: 'Period 3',
                  start_time: '09:00:00',
                  end_time: '10:00:00',
                  periods: [
                    {
                      id: 187,
                      lecture_type: 2,
                      date: '2023-11-09',
                      sub_teacher: [
                        {
                          id: 16646,
                          name: 'testing  sai',
                          user: 18889,
                        },
                      ],
                      sub: [
                        {
                          id: 12140,
                          subject_id: 227,
                          subject_name: 'Maths 2',
                        },
                      ],
                    },
                  ],
                },
                {
                  id: 160,
                  period_name: 'Period 2',
                  start_time: '10:00:00',
                  end_time: '11:00:00',
                  periods: [
                    {
                      id: 177,
                      lecture_type: 1,
                      date: '2023-11-10',
                      sub_teacher: [
                        {
                          id: 26,
                          name: "Danica ClydeD'Souza",
                          user: 50,
                        },
                      ],
                      sub: [
                        {
                          id: 12,
                          subject_id: 1,
                          subject_name: 'social science',
                        },
                      ],
                    },
                  ],
                },
                {
                  id: 161,
                  period_name: 'Period 3',
                  start_time: '11:00:00',
                  end_time: '12:00:00',
                  periods: [
                    {
                      id: 178,
                      lecture_type: 1,
                      date: '2023-11-13',
                      sub_teacher: [
                        {
                          id: 26,
                          name: "Danica ClydeD'Souza",
                          user: 50,
                        },
                      ],
                      sub: [
                        {
                          id: 12,
                          subject_id: 1,
                          subject_name: 'social science',
                        },
                      ],
                    },
                  ],
                },
              ],
              sec_map: [3736],
            },
            {
              id: 151,
              week_days: 6,
              time_set_id: 143,
              time_set_name: 'Time Slot 3',
              period_slot: [
                {
                  id: 166,
                  period_name: 'Period 1',
                  start_time: '09:00:00',
                  end_time: '10:00:00',
                  periods: [
                    {
                      id: 186,
                      lecture_type: 3,
                      date: '2023-11-09',
                      sub_teacher: [
                        {
                          id: 17838,
                          name: 'testing   P',
                          user: 20543,
                        },
                        {
                          id: 17238,
                          name: "Activity Teacher  Don't EDIT/Delete",
                          user: 19875,
                        },
                      ],
                      sub: [
                        {
                          id: 8440,
                          subject_id: 91,
                          subject_name: 'Biology',
                        },
                        {
                          id: 7487,
                          subject_id: 3,
                          subject_name: 'Hindi',
                        },
                      ],
                    },
                  ],
                },
                {
                  id: 167,
                  period_name: 'Period 2',
                  start_time: '10:00:00',
                  end_time: '11:00:00',
                  periods: [
                    {
                      id: 185,
                      lecture_type: 2,
                      date: '2023-11-10',
                      sub_teacher: [
                        {
                          id: 17900,
                          name: 'vinay  Teacher',
                          user: 20638,
                        },
                        {
                          id: 17744,
                          name: 'grade 2 teacher new   sd',
                          user: 20355,
                        },
                      ],
                      sub: [
                        {
                          id: 7487,
                          subject_id: 3,
                          subject_name: 'Hindi',
                        },
                        {
                          id: 7485,
                          subject_id: 6,
                          subject_name: 'Maths',
                        },
                      ],
                    },
                  ],
                },
                {
                  id: 168,
                  period_name: 'Period 3',
                  start_time: '11:00:00',
                  end_time: '12:00:00',
                  periods: [
                    {
                      id: 176,
                      lecture_type: 1,
                      date: '2023-11-09',
                      sub_teacher: [
                        {
                          id: 14106,
                          name: 'Pr  Lead',
                          user: 15621,
                        },
                        {
                          id: 10654,
                          name: 'old  QA',
                          user: 12076,
                        },
                      ],
                      sub: [
                        {
                          id: 12,
                          subject_id: 1,
                          subject_name: 'social science',
                        },
                      ],
                    },
                  ],
                },
              ],
              sec_map: [3736],
            },
          ]);
        } else {
          setCurrentWeekTimeTable({});
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
    const tooLate = dates[0] && current.diff(dates[0], 'days') > 7;
    const tooEarly = dates[1] && dates[1].diff(current, 'days') > 7;
    return !!tooEarly || !!tooLate;
  };
  const onOpenChange = (open) => {
    if (open) {
      setDates([null, null]);
    } else {
      setDates(null);
    }
  };

  console.log('dates', dates, value);
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
              <div className='col-md-5 py-2'>
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

            <div className='mt-3 px-2'>
              <Spin spinning={loading}>
                {Object.keys(currentWeekTimeTable).length > 0 && (
                  <TimeTableNewView currentWeekTimeTable={currentWeekTimeTable} />
                )}
              </Spin>
            </div>
          </div>
        </div>
      </Layout>
    </React.Fragment>
  );
};

export default StudentTimeTable;
