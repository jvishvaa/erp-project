import React, { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import { Select, Modal, Badge, Card, Tooltip, Empty } from 'antd';
import { DownOutlined, RightOutlined } from '@ant-design/icons';
import moment from 'moment';
import './index.css';
import { useSelector } from 'react-redux';
import axios from 'v2/config/axios';
import endpoints from 'v2/config/endpoints';
import { X_DTS_HOST } from 'v2/reportApiCustomHost';
import HolidayIcon from 'v2/Assets/dashboardIcons/lessonPlanIcons/holidayNew.png'
import EventIcon from 'v2/Assets/dashboardIcons/lessonPlanIcons/eventNew.png'

const { Option } = Select;

const CalendarCard = () => {
  const selectedBranch = useSelector(
    (state) => state.commonFilterReducer?.selectedBranch
  );
  const selectedAcademicYear = useSelector(
    (state) => state.commonFilterReducer?.selectedYear
  );
  const [holidaysData, setHolidaysData] = useState([]);
  const [eventssData, setEventsData] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [allEvent, setAllEvent] = useState([]);
  const [modData, setModData] = useState();
  const user_level = JSON.parse(localStorage.getItem('userDetails'))?.user_level || '';
  const modalopen = (item) => {
    setIsModalOpen(true);
    setModData(item);
  };
  const modalClose = () => {
    setIsModalOpen(false);
    setModData();
  };

  const [monthStartDate, setMonthStartDate] = useState(
    moment().startOf('month').format('YYYY-MM-DD')
  );
  const [monthEndDate, setMonthEndDate] = useState(
    moment().endOf('month').format('YYYY-MM-DD')
  );

  const [calendarFilter, setCalendarFilter] = useState('month');
  const handleChange = () => {
    calendarFilter === 'month' ? setCalendarFilter('year') : setCalendarFilter('month');
  };

  const fetchHolidaysData = (params = {}) => {
    axios
      .get(`${endpoints.adminDashboard.calendarEvents}`, {
        params: { ...params },
        headers: {
          'X-DTS-HOST': X_DTS_HOST,
        },
      })
      .then((response) => {
        if (response.status === 200) {
          setHolidaysData(response?.data?.holiday_detail);
        }
      })
      .catch((error) => console.log(error));
  };
  const fetchEventsData = (params = {}) => {
    axios
      .get(`${endpoints.adminDashboard.calendarEventsEvent}`, {
        params: { ...params },
        headers: {
          'X-DTS-HOST': X_DTS_HOST,
        },
      })
      .then((response) => {
        if (response.status === 200) {
          console.log(response);
          setEventsData(response?.data?.events_data);
        }
      })
      .catch((error) => console.log(error));
  };

  const handleTitle = (data) => {
    return <div>
      {data?.is_holiday == true ? <div className='row'> <img src={HolidayIcon} style={{ height: '4vh' }} className='mr-1' /> Holiday  </div> : <div className='row'> <img src={EventIcon} className='mr-1' style={{ height: '4vh' }} />  Events  </div>}
    </div>
  }

  const handleMonthChange = (value) => {
    setMonthStartDate(moment(value).startOf('month').format('YYYY-MM-DD'));
    setMonthEndDate(moment(value).endOf('month').format('YYYY-MM-DD'));
  };
  let userDetails = JSON.parse(localStorage.getItem('userDetails')) || '';
  // let grade_id = userDetails?.role_details?.grades[0]?.grade_id
  // console.log(grade_id);
  useEffect(() => {
    if (selectedBranch) {
      if (user_level == 13) {
        fetchHolidaysData({
          start_date: monthStartDate,
          end_date: monthEndDate,
          session_year: selectedBranch?.id,
          grade: userDetails?.role_details?.grades[0]?.grade_id,
        });
        fetchEventsData({
          start_date: monthStartDate,
          end_date: monthEndDate,
          session_year: selectedBranch?.id,
          grade: userDetails?.role_details?.grades[0]?.grade_id,
        });
      } else {
        fetchHolidaysData({
          start_date: monthStartDate,
          end_date: monthEndDate,
          session_year: selectedBranch?.id,
        });
        fetchEventsData({
          start_date: monthStartDate,
          end_date: monthEndDate,
          session_year: selectedBranch?.id,
        });
      }
    }
  }, [monthStartDate, monthEndDate, selectedBranch]);
  let holidayEach = [];
  let allData = [];
  useEffect(() => {
    if (holidaysData && eventssData) {
      holidaysData.map((item) =>
        holidayEach.push({
          event_name: item?.title,
          start_time: item?.holiday_start_date,
          end_time: item?.holiday_end_date,
          description: item?.description,
          id: item?.id,
          is_holiday: true,
        })
      );
      allData = [...eventssData, ...holidayEach];
      console.log(allData, 'holiday');
      setAllEvent(allData);
      console.log(allEvent, 'allusel');
    }
  }, [holidaysData, eventssData]);

  console.log(allEvent, 'alll');
  let monthHolidays = [];

  if (allEvent) {
    allEvent.map((holiday, index) => {
      for (
        var date = moment(holiday.start_time);
        date.isSameOrBefore(holiday.end_time);
        date.add(1, 'days')
      ) {
        if (!monthHolidays.includes(date.format('YYYY-MM-DD')))
          monthHolidays.push({
            date: date.format('YYYY-MM-DD'),
            prog: holiday?.is_holiday,
          });
      }
    });
  }
  let holidayCount = monthHolidays.filter((item) => item?.prog == true)
  let eventCount = monthHolidays.filter((item) => item?.prog == undefined)
  console.log(monthHolidays.filter((item) => item?.prog == undefined), 'month');
  return (
    <div className='th-bg-white th-br-5 mt-3'>
      <div className='row' style={{ borderRadius: '5px 5px 0 0 ' }}>
        <div
          className='col-2 th-fw-500 th-16 py-3'
          style={{ display: 'flex', alignItems: 'center' }}
        >
          Calendar
        </div>
        {/* <div className='col-2 text right' style={{ padding: '5px' }}>
          <Select
            className='th-bg-white th-br-4 th-fw-500 th-14 th-select'
            bordered={false}
            value={calendarFilter}
            placement='bottomRight'
            onChange={handleChange}
            suffixIcon={<DownOutlined className='th-primary' />}
            dropdownMatchSelectWidth={false}
          >
            <Option value={'month'}>Monthly</Option>
            <Option value={'year'}>Yearly</Option>
          </Select>
        </div>  */}
      </div>
      <div className='shadow-sm p-2' style={{ height: '420px' }}>
        <div className='row'>
          <Calendar
            value={new Date()}
            next2Label={null}
            prev2Label={null}
            minDetail='year'
            onActiveStartDateChange={({ action, activeStartDate, value, view }) => {
              const date = moment(activeStartDate).format('YYYY-MM-DD');
              if (calendarFilter === 'month') {
                handleMonthChange(date);
              }
              setCalendarFilter(view);
            }}
            view={calendarFilter}
            showNeighboringMonth={false}
            onViewChange={handleChange}
            onClickMonth={(value, event) => handleMonthChange(value)}
            tileClassName={({ date, view }) => {
              if (
                monthHolidays.find(
                  (item) =>
                    item?.date === moment(date).format('YYYY-MM-DD') && item?.prog == true
                )
              ) {
                return 'th-holiday';
              }
              if (
                monthHolidays.find(
                  (item) =>
                    item?.date === moment(date).format('YYYY-MM-DD') &&
                    item?.prog == undefined
                )
              ) {
                return 'th-events';
              }
            }}
            calendarType='US'
            formatShortWeekday={(locale, value) =>
              ['S', 'M', 'T', 'W', 'T', 'F', 'S'][value.getDay()]
            }
            className='th-calendar calendar-card'
          />
          <div style={{ width: '50%' }} className='listholiday'>
            <Card
              title='Events and Holidays'
              className='event_holiday'
              bordered={false}
              style={{
                width: '90%',
                margin: '0 auto',
                fontSize: '14px',
              }}
            >
              {allEvent?.length > 0 ?
                <div style={{ overflow: 'hidden', overflowY: 'scroll', height: '30vh' , cursor: 'pointer' }}>
                  {allEvent &&
                    allEvent?.map((item) => (
                      <div className='row mb-2 py-1' style={{
                        borderLeft: item?.is_holiday ? '5px solid #89DDF1' : '5px solid #E089F1',
                      }} onClick={() => modalopen(item)}>
                        <div className='col-4 px-0 pt-1'
                        >
                          <div
                            style={{ background: item?.is_holiday ? '#89DDF1' : '#E089F1' }}
                            className='mx-1 th-10 th-white th-br-4 text-center'
                          >{`${moment(item?.start_time).format('DD')}-${moment(
                            item?.end_time
                          ).format('DD')}`}</div>
                        </div>
                        <div className='col-8 px-0 text-truncate text-capitalize'>
                          <Tooltip title={item?.event_name}>
                            <span
                              style={{ margin: '0px', fontSize: '13px' }}
                            >
                              {item?.event_name}
                            </span>
                          </Tooltip>
                        </div>
                      </div>
                    ))}
                </div> :
                <div className='mt-5' >
                  <Empty description={
                    <span>
                      No Holiday & Events
                    </span>
                  } image={HolidayIcon} />
                </div>}
            </Card>
          </div>
        </div>
        <div className='row justify-content-start th-14 th-fw-400 px-2 pt-2 pb-1'>
          <div className='col-4 row'>
            <div style={{ width: '2vh', height: '2vh', background: '#89DDF1', }} className='mt-1' ></div>
            <div className='th-13 mx-1' style={{ color: '#89DDF1', paddingTop: '0px' }} >
              {holidayCount.length == 0 ? 'No' : holidayCount.length} Holidays
            </div>
          </div>
          <div className='col-4 row'>
            <div style={{ width: '2vh', height: '2vh', background: '#E089F1' }} className='mt-1'></div>
            <div className='th-13 mx-1' style={{ color: '#E089F1', paddingTop: '0px' }}>
              {eventCount.length == 0 ? 'No' : eventCount.length} Events
            </div>
          </div>
        </div>
      </div>
      <Modal
        title={handleTitle(modData)}
        visible={isModalOpen}
        onCancel={modalClose}
        footer={false}
        className='event_holidaymod'
      >
        <div className='p-1' style={{ background: '#F8F8F8' }}>
          <div style={{ minHeight: '30vh', margin: '4%' }}>
            <div className='row d-flex justify-content-between th-13'>
              <div className='font-weight-bold'>
                Start Date : {moment(modData?.start_time).format('DD-MM-YYYY')}
              </div>
              <div className='font-weight-bold'>
                End Date : {moment(modData?.end_time).format('DD-MM-YYYY')}
              </div>
            </div>
            <div className='row mt-1'>
              <div className='col-md-3 p-0 font-weight-bold'>Title :</div>
              <div className='col-md-9 p-0'>{modData?.event_name}</div>
            </div>
            <div className='row mt-1'>
              <div className='col-md-3 p-0 font-weight-bold'>Description :</div>
              <div className='col-md-9 p-0'>{modData?.description}</div>
            </div>
          </div>
          <div></div>
        </div>
      </Modal>
    </div>
  );
};

export default CalendarCard;
