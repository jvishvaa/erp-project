import React, { useState } from 'react';
import MomentUtils from '@material-ui/pickers-4.2/adapter/moment';
import DateRangeIcon from '@material-ui/icons/DateRange';
import moment from 'moment';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import { TextField, InputAdornment } from '@material-ui/core';
import { LocalizationProvider, DateRangePicker } from '@material-ui/pickers-4.2';
import './TeacherBlog.css';

const MobileDatepicker = (props) => {
  const [dateRange, setDateRange] = useState([moment().subtract(6, 'days'), moment()]);
  const [datePopperOpen, setDatePopperOpen] = useState(false);

  return (
    <div className='date-ranger'>
      <LocalizationProvider dateAdapter={MomentUtils}>
        <ClickAwayListener
          onClickAway={() => {
            setDatePopperOpen(false);
          }}
        >
          <DateRangePicker
            disableCloseOnSelect={false}
            startText='Date Range'
            PopperProps={{ open: datePopperOpen }}
            // endText='End-date'
            value={dateRange}
            keyboardIcon={<DateRangeIcon />}
            // calendars='1'
            onChange={(newValue) => {
              // console.log('onChange truggered', newValue);
              const [startDate, endDate] = newValue;
              const sevenDaysAfter = moment(startDate).add(6, 'days');
              setDateRange([startDate, sevenDaysAfter]);
              props.handleStartDateChange(startDate);
              props.handleEndDateChange(sevenDaysAfter);
              setDatePopperOpen(false);
            }}
            renderInput={({ inputProps, ...startProps }, endProps) => {
              return (
                <>
                  <TextField
                    {...startProps}
                    InputProps={{
                      ...inputProps,
                      value: `${moment(inputProps.value).format('DD-MM-YYYY')} - ${moment(
                        endProps.inputProps.value
                      ).format('DD-MM-YYYY')}`,
                      readOnly: true,
                      endAdornment: (
                        <InputAdornment position='start'>
                          <DateRangeIcon style={{ width: '35px' }} color='primary' />
                        </InputAdornment>
                      ),
                    }}
                    fullWidth
                    size='small'
                    style={{ minWidth: '250px' }}
                    onClick={() => {
                      console.log('triggered');
                      setDatePopperOpen(true);
                    }}
                  />
                </>
              );
            }}
          />
        </ClickAwayListener>
      </LocalizationProvider>
    </div>
  );
};

export default MobileDatepicker;
