import React from 'react';
import {
  LocalizationProvider,
  DateRangePicker,
  DateRange,
  DateRangeDelimiter,
} from '@material-ui/pickers-4.2';
import moment from 'moment';

const Calander = () => {
    const [dateRange, setDateRange] = useState([
        moment().startOf('isoWeek'),
        moment().endOf('week'),
      ]);
  return (
    <div>
      <LocalizationProvider
        dateAdapter={MomentUtils}
        style={{ backgroundColor: '#F9F9F9' }}
      >
        <DateRangePicker
          id='date-range-picker-date'
          disableCloseOnSelect={false}
          startText='Select-dates'
          PopperProps={{ open: datePopperOpen }}
          // endText='End-date'
          value={dateRange}
          // calendars='1'
          onChange={(newValue) => {
            console.log('onChange truggered', newValue);
            const [startDate, endDate] = newValue;
            const sevenDaysAfter = moment(startDate).add(6, 'days');
            // setDateRange([startDate, sevenDaysAfter]);
            // setDatePopperOpen(false);
          }}
          renderInput={(
            // {
            //   inputProps: { value: startValue, ...restStartInputProps },
            //   ...startProps
            // },
            // {
            //   inputProps: { value: endValue, ...restEndInputProps },
            //   ...endProps
            // }
            // { inputProps, ...startProps },
            // startProps,
            endProps
          ) => {
            //console.log('startProps ', startProps, 'endProps', endProps);
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
                  style={{ minWidth: '250px' }}
                //   onClick={() => {
                //     console.log('triggered');
                //     setDatePopperOpen(true);
                //   }}
                />
                {/* <TextField {...startProps} size='small' /> */}
                {/* <DateRangeDelimiter> to </DateRangeDelimiter> */}
                {/* <TextField {...endProps} size='small' /> */}
              </>
            );
          }}
        />
      </LocalizationProvider>
    </div>
  );
};

export default Calander;
