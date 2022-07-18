import React, { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import { Select } from 'antd';
import { DownOutlined } from '@ant-design/icons';
import moment from 'moment';
import './index.css';
import { useSelector } from 'react-redux';
import axios from 'v2/config/axios';
import endpoints from 'v2/config/endpoints';
import { X_DTS_HOST } from 'v2/reportApiCustomHost';

const { Option } = Select;

const CalendarCard = () => {
  const selectedBranch = useSelector(
    (state) => state.commonFilterReducer?.selectedBranch
  );
  const selectedAcademicYear = useSelector(
    (state) => state.commonFilterReducer?.selectedYear
  );
  const [holidaysData, setHolidaysData] = useState([]);
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
  let monthHolidays = [];

  if (holidaysData) {
    holidaysData.map((holiday, index) => {
      for (
        var date = moment(holiday.holiday_start_date);
        date.isSameOrBefore(holiday.holiday_end_date);
        date.add(1, 'days')
      ) {
        monthHolidays.push(date.format('YYYY-MM-DD'));
      }
    });
  }
  const handleMonthChange = (value) => {
    setMonthStartDate(moment(value).startOf('month').format('YYYY-MM-DD'));
    setMonthEndDate(moment(value).endOf('month').format('YYYY-MM-DD'));
  };

  useEffect(() => {
    if (selectedBranch) {
      fetchHolidaysData({
        start_date: monthStartDate,
        end_date: monthEndDate,
        branch: selectedBranch?.branch?.id,
        session_year: selectedAcademicYear?.id,
      });
    }
  }, [monthStartDate, monthEndDate, selectedBranch]);

  return (
    <div className='th-bg-white th-br-5 mt-3'>
      <div
        className='row justify-content-between th-bg-primary'
        style={{ borderRadius: '5px 5px 0 0 ' }}
      >
        <div className='col-6 th-fw-500 th-16 my-auto th-white'>Calendar</div>
        <div className='col-6 text right'>
          <Select
            className='th-primary th-bg-white th-br-4 th-select'
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
        </div>
      </div>
      <div className='shadow-sm p-2'>
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
              monthHolidays.find((item) => item === moment(date).format('YYYY-MM-DD'))
            ) {
              return 'th-green';
            }
          }}
          calendarType='US'
          formatShortWeekday={(locale, value) =>
            ['S', 'M', 'T', 'W', 'T', 'F', 'S'][value.getDay()]
          }
          className='th-calendar'
        />

        <div className='row mt-3 justify-content-center th-14 th-fw-400 px-2 pt-2 pb-1'>
          <div className='col-3 th-br-8 th-green th-bg-grey badge py-1 '>
            {monthHolidays.length == 0 ? 'No' : monthHolidays.length} Holidays
          </div>
          {/* <div className='col-3 th-br-8 th-red th-bg-grey badge py-1'>9 Week offs</div>
          <div className='col-3 th-br-8 th-pink th-bg-grey badge py-1'>1 Event</div> */}
        </div>
      </div>
    </div>
  );
};

export default CalendarCard;
