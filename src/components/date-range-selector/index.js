import React from 'react';
import { LocalizationProvider, DateRangePicker } from '@material-ui/pickers-4.2';
import MomentUtils from '@material-ui/pickers-4.2/adapter/moment';
import { TextField, InputAdornment } from '@material-ui/core';
import DateRangeIcon from '@material-ui/icons/DateRange';
import moment from 'moment';
import './date-picker-style.scss';

const DateRangeSelector = ({ value, onChange, onClick, open }) => {
  return (
    <LocalizationProvider
      dateAdapter={MomentUtils}
      style={{ backgroundColor: '#F9F9F9' }}
    >
      <DateRangePicker
        className='view-assesment-date-picker'
        id='date-range-picker-date'
        disableCloseOnSelect={false}
        startText='Select-dates'
        PopperProps={{ open }}
        // endText='End-date'
        value={value}
        // calendars='1'
        onChange={(newValue) => {
          const [startDate, endDate] = newValue;
          const sevenDaysAfter = moment(startDate).add(6, 'days');
          onChange([startDate, sevenDaysAfter]);
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
                size='small'
                style={{ minWidth: '250px', width: '100%' }}
                onClick={onClick}
              />
              {/* <TextField {...startProps} size='small' /> */}
              {/* <DateRangeDelimiter> to </DateRangeDelimiter> */}
              {/* <TextField {...endProps} size='small' /> */}
            </>
          );
        }}
      />
    </LocalizationProvider>
  );
};

export default DateRangeSelector;
