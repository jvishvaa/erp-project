import React, { useState } from 'react';
import MomentUtils from '@material-ui/pickers-4.2/adapter/moment';
import DateRangeIcon from '@material-ui/icons/DateRange';
import moment from 'moment';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import { TextField, InputAdornment } from '@material-ui/core';
import { LocalizationProvider, DateRangePicker } from '@material-ui/pickers-4.2';
import './StudentBlog.css';

const MobileDatepicker = (props) => {
  const [dateRange, setDateRange] = useState([moment().subtract(6, 'days'), moment()]);
  const [datePopperOpen, setDatePopperOpen] = useState(false);

  return (
    <div className='date-ranger'>
      <LocalizationProvider dateAdapter={MomentUtils}>
        <DateRangePicker
          startText='Select-date-range'
          value={dateRange}
          onChange={(newValue) => {
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
                  inputProps={{
                    ...inputProps,
                    value: `${inputProps.value} - ${endProps.inputProps.value}`,
                    readOnly: true,
                  }}
                  size='small'
                  style={{ minWidth: '100%' }}
                />
              </>
            );
          }}
        />
            </LocalizationProvider>
    </div>
  );
};

export default MobileDatepicker;
