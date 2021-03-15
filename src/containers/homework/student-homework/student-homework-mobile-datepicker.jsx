import React, { useState } from 'react';
import MomentUtils from '@material-ui/pickers-4.2/adapter/moment';
import DateRangeIcon from '@material-ui/icons/DateRange';
import moment from 'moment';
import {
  Grid,
  TextField,
  Button,
  SvgIcon,
  Badge,
  IconButton,
  useMediaQuery,
  InputAdornment
} from '@material-ui/core';
import {
  LocalizationProvider,
  DateRangePicker,
  DateRange,
  DateRangeDelimiter,
} from '@material-ui/pickers-4.2';
import './student-homework.css';
const MobileDatepicker = (props) => {
  //const [dateRange, setDateRange] = useState([moment().subtract(6, 'days'), moment()]);
  const [dateRange, setDateRange] = useState([
    moment().startOf('isoWeek'),
    moment().endOf('week'),
  ]);
  const [datePopperOpen, setDatePopperOpen] = useState(false);

  return (
    <div className="date-ranger">
      <LocalizationProvider dateAdapter={MomentUtils}>
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
            props.handleStartDateChange(startDate)
            props.handleEndDateChange(sevenDaysAfter)
            setDatePopperOpen(false);
          }}
          renderInput={(
            { inputProps, ...startProps },
            endProps
          ) => {
            console.log('startProps ', startProps, 'endProps', endProps);
            return (
              <>
                <TextField
                  {...startProps}
                  InputProps={{
                    ...inputProps,
                    value: `${moment(inputProps.value).format(
                      'DD-MM-YYYY'
                    )} - ${moment(endProps.inputProps.value).format(
                      'DD-MM-YYYY'
                    )}`,
                    readOnly: true,
                    endAdornment: (
                      <InputAdornment position='start'>
                        <DateRangeIcon
                          style={{ width: '35px' }}
                          color='primary'
                        />
                      </InputAdornment>
                    ),
                  }}
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
      </LocalizationProvider>
    </div>
  )
}

export default MobileDatepicker;