import React, { useState, useEffect, useRef } from 'react';
import Calendar from 'react-calendar';
import { Modal, Button, Card, Tooltip, Empty, notification, Popconfirm } from 'antd';
import { RightOutlined, DownloadOutlined } from '@ant-design/icons';
import moment from 'moment';
import './index.css';
import { useSelector } from 'react-redux';
import axios from 'v2/config/axios';
import endpoints from 'v2/config/endpoints';
import { X_DTS_HOST } from 'v2/reportApiCustomHost';
import HolidayIcon from 'v2/Assets/dashboardIcons/lessonPlanIcons/holidayNew.png';
import EventIcon from 'v2/Assets/dashboardIcons/lessonPlanIcons/eventNew.png';
import Slider from 'react-slick';
import { NumberFormatter } from 'v2/CommonFormatter';
import MediaDisplay from '../../Calendar/EventsNewUI/mediaDisplayEvents';
import { saveAs } from 'file-saver';

const CalendarCard = () => {
  const selectedBranch = useSelector(
    (state) => state.commonFilterReducer?.selectedBranch
  );
  const refundRef = useRef();
  const [holidaysData, setHolidaysData] = useState([]);
  const [eventssData, setEventsData] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [allEvent, setAllEvent] = useState([]);
  const [modData, setModData] = useState();
  const [loading, setLoading] = useState(false);

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

  const settings = {
    dots: false,
    infinite: false,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: true,
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
        if (response.data?.status_code === 200) {
          setHolidaysData(response?.data?.holiday_detail);
        }
      })
      .catch((error) => console.log(error));
  };

  console.log({ modData });

  const fetchEventsData = (params = {}) => {
    axios
      .get(`${endpoints.adminDashboard.calendarEventsEvent}`, {
        params: { ...params },
        headers: {
          'X-DTS-HOST': X_DTS_HOST,
        },
      })
      .then((response) => {
        if (response.data?.status_code === 200) {
          let eventsArr = [];
          response.data.events_data.map((item) =>
            eventsArr.push({
              id: item.id,
              event_name: item.event_name,
              attachments: item.attachments,
              description: item.description,
              start_time: moment(item.start_time).format('YYYY-MM-DD'),
              end_time: item.end_time,
              academic_year: item.academic_year,
              is_deleted: item.is_deleted,
              event_category_type: item.event_category_type,
              reg_start: item?.reg_start,
              reg_end: item?.reg_end,
              event_price: item?.event_price,
              approval_status: Number(item?.approval_status),
              reg_start: item?.reg_start,
              subscription: item?.subscription,
              is_subscription_need: item?.is_subscription_need,
              policy_dates: item?.policies,
              refundable: item?.refundable,
            })
          );
          setEventsData(eventsArr);
        }
      })
      .catch((error) => console.log(error));
  };

  const handleTitle = (data) => {
    return (
      <div className='row align-items-center th-18'>
        {data?.is_holiday == true ? (
          <>
            <img src={HolidayIcon} style={{ height: '4vh' }} className='mr-1' /> Holiday
          </>
        ) : (
          <>
            <img src={EventIcon} className='mr-1' style={{ height: '4vh' }} /> Event{' '}
          </>
        )}
      </div>
    );
  };

  const handleMonthChange = (value) => {
    setMonthStartDate(moment(value).startOf('month').format('YYYY-MM-DD'));
    setMonthEndDate(moment(value).endOf('month').format('YYYY-MM-DD'));
  };
  let userDetails = JSON.parse(localStorage.getItem('userDetails')) || '';

  const handleEventAction = ({ eventId, action }) => {
    setLoading(true);
    const params = {
      event_id: eventId,
      subscribed: action === 'subscribe' ? 1 : 0,
    };
    axios
      .post(`${endpoints.eventsDashboard.studentActionApi}`, null, {
        params: { ...params },
      })
      .then((response) => {
        if (response?.data?.status_code == 200) {
          notification['success']({
            message: 'Hurray! Subscribed Successfully',
            duration: 3,
            className: 'notification-container',
          });
          setModData((prev) => ({
            ...prev,
            subscription: action === 'subscribe' ? 1 : 0,
          }));
          fetchEventsData({
            start_date: monthStartDate,
            end_date: monthEndDate,
            session_year: selectedBranch?.id,
            grade: userDetails?.role_details?.grades[0]?.grade_id,
          });
        } else if (response?.data?.status_code == 402) {
          notification['error']({
            message: 'Insufficient wallet balance. Please recharge to subscribe',
            duration: 3,
            className: 'notification-container',
          });
        }
      })
      .catch((error) => {
        notification['error']({
          message: 'OOPS! Something went wrong. Please try again',
          duration: 3,
          className: 'notification-container',
        });
      })
      .finally(() => {
        setLoading(false);
      });
  };

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
          end_time: item?.holiday_end_date,
          description: item?.description,
          id: item?.id,
          is_holiday: true,
        })
      );
      allData = [...eventssData, ...holidayEach];
      let newData = allData.sort(
        (a, b) => Date.parse(a.start_time) - Date.parse(b.start_time)
      );
      setAllEvent(newData);
    }
  }, [holidaysData, eventssData]);

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

  let duplicateIds = monthHolidays
    .map((e) => e['date'])
    .map((e, i, final) => final.indexOf(e) !== i && i)
    .filter((obj) => monthHolidays[obj])
    .map((e) => monthHolidays[e]['date']);

  let getduplicateDate = monthHolidays.filter((obj) => duplicateIds.includes(obj.date));

  let changeProg = monthHolidays.map((item, index) => {
    if (duplicateIds.includes(item?.date) == true) {
      monthHolidays[index].prog = false;
    }
  });

  const handleDownloadAll = async (files) => {
    for (const item of files) {
      const fullName = item?.split('/')[item?.split('/').length - 1];
      await downloadFile(`${item}`, fullName);
    }
  };
  const downloadFile = async (url, fullName) => {
    const response = await fetch(url);
    const blob = await response.blob();
    saveAs(blob, fullName);
  };

  const handleScrollToPolicy = () => {
    refundRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };
  return (
    <div className='th-bg-white th-br-5 mt-3'>
      <div className='row' style={{ borderRadius: '5px 5px 0 0 ' }}>
        <div
          className='col-2 th-fw-500 th-16 py-3'
          style={{ display: 'flex', alignItems: 'center' }}
        >
          Calendar
        </div>
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
                    item?.date != moment(date).format('YYYY-MM-DD') &&
                    moment(date).day() == 6
                )
              ) {
                return 'th-weekendcal';
              }
              if (
                monthHolidays.find(
                  (item) =>
                    item?.date != moment(date).format('YYYY-MM-DD') &&
                    moment(date).day() == 0
                )
              ) {
                return 'th-weekendcal';
              }
              if (
                monthHolidays.find(
                  (item) =>
                    (item?.date != moment(date).format('YYYY-MM-DD') &&
                      moment(date).day() == 1) ||
                    2 ||
                    3 ||
                    4 ||
                    5
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
              className='event_holiday pl-1 '
              bordered={false}
            >
              {allEvent?.length > 0 ? (
                <div
                  style={{
                    overflow: 'hidden',
                    overflowY: 'scroll',
                    height: '30vh',
                  }}
                  className='th-custom-scrollbar'
                >
                  {allEvent &&
                    allEvent?.map((item) => (
                      <div
                        className='row mt-2 py-2 align-items-center th-pointer px-1 th-event-bar'
                        onClick={() => modalopen(item)}
                      >
                        <div className='col-2 pl-0'>
                          <div
                            style={{
                              height: '30px',
                              width: '30px',
                            }}
                            className={`th-12 th-white d-flex align-items-center justify-content-center th-br-30 ${
                              item?.is_holiday ? 'th-bg-blue-4' : 'th-bg-violet-2'
                            }`}
                          >
                            {moment(item?.start_time).format('DD')}
                          </div>
                        </div>
                        <div className='col-9 px-1 text-truncate text-capitalize'>
                          <Tooltip title={item?.event_name} placement='bottomLeft'>
                            <span className='th-14'>{item?.event_name}</span>
                          </Tooltip>
                        </div>
                        <div className='col-1 p-0'>
                          <RightOutlined className='th-10 th-grey' />
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
        <div className='row align-items-center py-2'>
          <div className='col-4'>
            <div className='d-flex align-items-center' style={{ gap: 5 }}>
              <div className='th-bg-blue-4' style={{ width: 14, height: 14 }} />
              <div className='th-blue-2'>
                {holidayCount.length == 0 ? 'No' : holidayCount.length} Holiday
                {holidayCount?.length === 1 ? '' : 's'}
              </div>
            </div>
          </div>
          <div className='col-4'>
            <div className='d-flex align-items-center' style={{ gap: 5 }}>
              <div className='th-bg-violet-2' style={{ width: 14, height: 14 }} />
              <div className='th-violet-2'>
                {eventCount?.length == 0 ? 'No' : eventCount?.length} Event
                {eventCount?.length === 1 ? '' : 's'}
              </div>
            </div>
          </div>
        </div>
      </div>
      <Modal
        title={handleTitle(modData)}
        visible={isModalOpen}
        onCancel={modalClose}
        footer={
          user_level !== 13 ? null : modData?.is_holiday ? null : (
            <div className='d-flex justify-content-center pt-2'>
              {modData?.approval_status == 3 ? (
                <Button
                  type='ghost'
                  disabled
                  className=' th-br-6 th-18 d-flex align-items-center justify-content-center'
                  style={{ minWidth: '25%' }}
                >
                  Cancelled
                </Button>
              ) : modData?.is_subscription_need ? (
                modData?.subscription == 0 ? (
                  <Button
                    type='default'
                    className=' th-br-6 th-18 d-flex align-items-center justify-content-center'
                    style={{ minWidth: '25%', cursor: 'default' }}
                  >
                    Unsubscribed
                  </Button>
                ) : modData?.subscription == 1 ? (
                  <Popconfirm
                    title={
                      <div className='d-flex flex-column' style={{ gap: 5 }}>
                        <div className=''>Are you sure you want to unsubscibe?</div>
                        {modData?.refundable && (
                          <div className='th-grey th-14 mt-2'>
                            Note: Please read the
                            <span
                              className='th-pointer th-primary th-fw-500'
                              onClick={() => {
                                handleScrollToPolicy();
                              }}
                            >
                              refund policy
                            </span>
                          </div>
                        )}
                      </div>
                    }
                    okText={'Unsubscribe'}
                    onConfirm={() => {
                      if (modData?.subscription == 1) {
                        handleEventAction({
                          eventId: modData?.id,
                          action: 'unsubscribe',
                        });
                      }
                    }}
                    zIndex={2100}
                    placement='right'
                  >
                    <Button
                      type='default'
                      loading={loading}
                      className=' th-br-6 th-18 d-flex align-items-center justify-content-center'
                      style={{ minWidth: '25%' }}
                    >
                      Unsubscribe
                    </Button>
                  </Popconfirm>
                ) : (
                  <Popconfirm
                    title={
                      <div className='d-flex flex-column' style={{ gap: 5 }}>
                        <div className=''>Are you sure you want to subscibe?</div>
                        {modData?.refundable && (
                          <div className='th-grey th-14 mt-2'>
                            Note: Please read the
                            <span
                              className='th-pointer th-primary th-fw-500'
                              onClick={() => {
                                handleScrollToPolicy();
                              }}
                            >
                              refund policy
                            </span>
                          </div>
                        )}
                      </div>
                    }
                    okText={'Subscribe'}
                    onConfirm={() => {
                      if (modData?.subscription != 1) {
                        handleEventAction({
                          eventId: modData?.id,
                          action: 'subscribe',
                        });
                      }
                    }}
                    zIndex={2100}
                    placement='right'
                  >
                    <Button
                      type='primary'
                      loading={loading}
                      className=' th-br-6 th-18 d-flex align-items-center justify-content-center'
                      style={{ minWidth: '25%' }}
                    >
                      Subscribe
                    </Button>
                  </Popconfirm>
                )
              ) : null}
            </div>
          )
        }
        centered
        width={'70vw'}
        className='event_holidaymod th-upload-modal'
      >
        <div
          className='p-3'
          style={{
            minHeight: '30vh',
            maxHeight: '70vh',
            overflowY: 'auto',
          }}
        >
          <div
            className='th-bg-grey th-br-16'
            style={{
              border: '1px solid #d9d9d9',
              padding: '16px 6px',
            }}
          >
            <div
              className='row justify-content-between th-14'
              style={{
                gap: 10,
              }}
            >
              {!modData?.is_holiday && modData?.attachments?.length > 0 && (
                <div className='col-12 px-0'>
                  <Slider
                    {...settings}
                    className='th-slick th-post-slick'
                    style={{ height: 320 }}
                  >
                    {modData?.attachments?.map((each) => (
                      <MediaDisplay
                        mediaName={each}
                        mediaLink={each}
                        alt='File Not Supported'
                        className='w-100 th-br-20 p-3'
                      />
                    ))}
                  </Slider>
                </div>
              )}
              {modData?.attachments?.length > 0 && (
                <div className='col-12 text-right'>
                  <Button
                    size='small'
                    className='th-14'
                    type='link'
                    icon={<DownloadOutlined />}
                    onClick={() => {
                      handleDownloadAll(modData?.attachments);
                    }}
                  >
                    Download all attachments
                  </Button>
                </div>
              )}
              <div className='col-12'>
                <div className='d-flex align-items-start justify-content-between th-grey'>
                  <div className=' font-weight-bold th-20'>{modData?.event_name}</div>
                  {!modData?.is_holiday && modData?.is_subscription_need && (
                    <div className='w-25 text-right'>
                      Event Fee :{' '}
                      <span className='font-weight-bold th-black-1'>
                        ₹ {NumberFormatter(modData?.event_price)}
                      </span>
                    </div>
                  )}
                </div>
              </div>
              <div className='col-12 px-0'>
                <div className='d-flex align-items-center justify-content-between flex-wrap'>
                  {!modData?.is_holiday && (
                    <>
                      <div className='col-md-4 '>
                        Event Date :{' '}
                        <span className='font-weight-bold'>
                          {moment(modData?.start_time).format('DD-MM-YYYY')}
                        </span>
                      </div>
                    </>
                  )}
                  <div className='col-md-4 py-2'>
                    {!modData?.is_holiday && 'Reg.'} Start Date :{' '}
                    <span className='font-weight-bold'>
                      {moment(
                        modData?.is_holiday ? modData?.start_time : modData?.reg_start
                      ).format('DD-MM-YYYY')}
                    </span>
                  </div>
                  <div className=' col-4 py-2 text-right'>
                    {!modData?.is_holiday && 'Reg.'} End Date :{' '}
                    <span className='font-weight-bold'>
                      {moment(
                        modData?.is_holiday ? modData?.end_time : modData?.reg_end
                      ).format('DD-MM-YYYY')}
                    </span>
                  </div>
                </div>
              </div>
              <div className='col-12'>
                <div className=' font-weight-bold'>Description :</div>
                <div className='th-grey py-1 th-calendar-description'>
                  <div
                    dangerouslySetInnerHTML={{
                      __html: modData?.description,
                    }}
                  />
                </div>
              </div>
              {!modData?.is_holiday && modData?.refundable && (
                <div className='col-4'>
                  <div className='th-br-20' ref={refundRef}>
                    <div className='font-weight-bold mt-2'>Refund Policy</div>
                    <div
                      className='th-br-8 px-3 py-2 mt-2'
                      style={{ border: '1px solid #d9d9d9' }}
                    >
                      {Object.keys(modData?.policy_dates)?.map((item) => {
                        return (
                          <div className='d-flex align-items-center justify-content-between mb-2 th-15'>
                            <div className='th-grey'>
                              Till{' '}
                              {moment(modData?.start_time)
                                .subtract(item, 'days')
                                .format('MMM D, YYYY')}
                            </div>
                            <div className='th-black-1 th-fw-500'>
                              ₹ {modData?.policy_dates[item]}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default CalendarCard;
