import React, { useState} from 'react';
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
  
} from '@material-ui/core';
import {
    LocalizationProvider,
    DateRangePicker,
    DateRange,
    DateRangeDelimiter,
  } from '@material-ui/pickers-4.2';
import './student-homework.css';
  const MobileDatepicker = (props) =>{
    const [dateRange, setDateRange] = useState([moment().subtract(6, 'days'), moment()]);
    const [datePopperOpen, setDatePopperOpen] = useState(false);

      return(
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
           
            return (
              <>
              
                <TextField
                  {...startProps}
                  inputProps={{
                    ...inputProps,
                    value: `${inputProps.value} - ${endProps.inputProps.value}`,
                    readOnly: true,
                    endAdornment: (<DateRangeIcon />)
                    
                  }}
                  size='small'
                   style={{ minWidth: '300px' }}
                  onClick={() => {
                    // console.log('triggered');
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