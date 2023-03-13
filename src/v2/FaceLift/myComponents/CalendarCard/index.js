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
import HolidayIcon from 'v2/Assets/dashboardIcons/lessonPlanIcons/holidayNew.png';
import EventIcon from 'v2/Assets/dashboardIcons/lessonPlanIcons/eventNew.png';

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
          let eventsArr = []
          response.data.events_data.map((item) => eventsArr.push({
            id: item.id,
            event_name: item.event_name,
            description: item.description,
            start_time: moment(item.start_time).format('YYYY-MM-DD'),
            end_time: item.end_time,
            academic_year: item.academic_year,
            is_deleted: item.is_deleted,
            event_category_type: item.event_category_type
          }))
          setEventsData(eventsArr);
          // setEventsData(response?.data?.events_data);
        }
      })
      .catch((error) => console.log(error));
  };

  const handleTitle = (data) => {
    return (
      <div>
        {data?.is_holiday == true ? (
          <div className='row'>
            {' '}
            <img
              src={HolidayIcon}
              style={{ height: '4vh' }}
              className='mr-1'
            /> Holiday{' '}
          </div>
        ) : (
          <div className='row'>
            {' '}
            <img src={EventIcon} className='mr-1' style={{ height: '4vh' }} /> Events{' '}
          </div>
        )}
      </div>
    );
  };

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
          start_time: moment(item?.holiday_start_date).format('YYYY-MM-DD'),
          // start_time: item?.holiday_start_date,
          end_time: item?.holiday_end_date,
          description: item?.description,
          id: item?.id,
          is_holiday: true,
        })
      );
      allData = [...eventssData, ...holidayEach];
      let newData = allData.sort((a, b) => Date.parse(a.start_time) - Date.parse(b.start_time));
      console.log(allData, 'holiday');
      setAllEvent(newData);
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
  let holidayCount = monthHolidays.filter((item) => item?.prog == true);
  let eventCount = monthHolidays.filter((item) => item?.prog == undefined);
  console.log(
    monthHolidays,
    'month'
  );


  let duplicateIds = monthHolidays
    .map(e => e['date'])
    .map((e, i, final) => final.indexOf(e) !== i && i)
    .filter(obj => monthHolidays[obj])
    .map(e => monthHolidays[e]["date"])

  let getduplicateDate = monthHolidays.filter(obj => duplicateIds.includes(obj.date));
  console.log(getduplicateDate, 'getdup');

  let changeProg = monthHolidays.map((item, index) => {
    if (duplicateIds.includes(item?.date) == true) {
      console.log(item);
      monthHolidays[index].prog = false
    }
  })



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
      <div
        className='shadow-sm p-2'
        style={{ height: window.innerWidth < 892 ? '470px' : '380px' }}
      >
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
              if (
                monthHolidays.find(
                  (item) =>
                    item?.date === moment(date).format('YYYY-MM-DD') &&
                    item?.prog == false
                )
              ) {
                return 'bothEvent';
              }
              if (
                monthHolidays.find(
                  (item) =>
                    item?.date != moment(date).format('YYYY-MM-DD')  && moment(date).day() == 6
                )
              ) {
                return 'th-weekendcal';
              }
              if (
                monthHolidays.find(
                  (item) =>
                    item?.date != moment(date).format('YYYY-MM-DD')  && moment(date).day() == 0
                )
              ) {
                return 'th-weekendcal';
              }
              if (
                monthHolidays.find(
                  (item) =>
                    item?.date != moment(date).format('YYYY-MM-DD')  && moment(date).day() == 1 || 2 || 3 || 4 || 5
                )
              ) {
                return 'th-weekdaycal';
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
              {allEvent?.length > 0 ? (
                <div
                  style={{
                    overflow: 'hidden',
                    overflowY: 'scroll',
                    height: '30vh',
                    cursor: 'pointer',
                  }}
                  className='th-custom-scrollbar'
                >
                  {allEvent &&
                    allEvent?.map((item) => (
                      <div
                        className='row mb-2 py-1'
                        onClick={() => modalopen(item)}
                      >
                        <div className='col-3 px-0 pt-1'>
                          <div
                            style={{
                              background: item?.is_holiday ? '#00b8df' : '#d700dd',
                              display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '30px', height: '30px', width: '30px'
                            }}
                            className='mx-1 th-10 th-white text-center'
                          >{moment(item?.start_time).format('DD')}</div>
                        </div>
                        <div className='col-8 px-0 text-truncate text-capitalize d-flex align-items-center'>
                          <Tooltip title={item?.event_name} placement='bottomLeft'>
                            <span style={{ margin: '0px', fontSize: '13px' }}>
                              {item?.event_name}
                            </span>
                          </Tooltip>
                        </div>
                        <div className='col-1 p-0' >
                          <RightOutlined style={{ width: '20px', height: '20px' }} />
                        </div>
                      </div>
                    ))}
                </div>
              ) : (
                <div className='mt-5'>
                  <Empty
                    description={<span>No Holiday & Events</span>}
                    image={HolidayIcon}
                  />
                </div>
              )}
            </Card>
          </div>
        </div>
        <div className='row justify-content-start th-14 th-fw-400 px-2 pt-2 pb-1'>
          <div className='col-4 row'>
            <div
              style={{ width: '2vh', height: '2vh', background: '#00b8df' }}
              className='mt-1'
            ></div>
            <div className='th-13 mx-1' style={{ color: '#00b8df', paddingTop: '0px' }}>
              {holidayCount.length == 0 ? 'No' : holidayCount.length} Holidays
            </div>
          </div>
          <div className='col-4 row'>
            <div
              style={{ width: '2vh', height: '2vh', background: '#d700dd' }}
              className='mt-1'
            ></div>
            <div className='th-13 mx-1' style={{ color: '#d700dd', paddingTop: '0px' }}>
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
