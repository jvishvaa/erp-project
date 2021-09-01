import React, { useState, useEffect } from 'react';
import { Autocomplete } from '@material-ui/lab';
import { TextField } from '@material-ui/core';
import useStyles from './useStyles';

const DaysFilterContainer = (props) => {
  const classes = useStyles();
  const { selectedLimit, collectData, setCollectData, firstHit, clearFlag } = props;

  const [daysDisplay, setDaysDisplay] = useState([]);

  useEffect(() => {
    if (clearFlag) {
      setComboDays([]);
      setOtherDays([]);
      setDaysDisplay([]);
    }
  }, [clearFlag]);

  useEffect(() => {
    if (selectedLimit) {
      const index = collectData.findIndex(
        (datarow) => datarow['limit'] === selectedLimit
      );
      setComboDays(collectData[index]['comboDays']);
      setOtherDays(collectData[index]['otherDays']);
      setDaysDisplay(collectData[index]['days']);
    }
  }, [selectedLimit, firstHit]);

  const [comboDays, setComboDays] = useState([]);

  const [comboDaysList, setComboDaysList] = useState([
    { id: 1, combo: 'Mon / Wed / Fri', send: 'Mon/Wed/Fri' },
    { id: 2, combo: 'Tue / Thu / Sat', send: 'Tue/Thu/Sat' },
    { id: 3, combo: 'Fri / Sat / Sun', send: 'Fri/Sat/Sun' },
    { id: 4, combo: 'Others' },
  ]);

  const handleComboDays = (event, value) => {
    const index = collectData.findIndex((datarow) => datarow['limit'] === selectedLimit);
    const list = [...collectData];
    list[index]['comboDays'] = [];
    setComboDays([]);
    if (value.length > 0) {
      setComboDays(value);
      list[index]['comboDays'] = value;
      setCollectData(list);
    }
  };

  const [otherDays, setOtherDays] = useState([]);

  const [otherDaysList, setOtherDaysList] = useState([
    { id: 1, day: 'Monday', send: 'Mon' },
    { id: 2, day: 'Tuesday', send: 'Tue' },
    { id: 3, day: 'Wednesday', send: 'Wed' },
    { id: 4, day: 'Thursday', send: 'Thu' },
    { id: 5, day: 'Friday', send: 'Fri' },
    { id: 6, day: 'Saturday', send: 'Sat' },
    { id: 7, day: 'Sunday', send: 'Sun' },
  ]);

  const handleOtherDays = (event, value) => {
    const index = collectData.findIndex((datarow) => datarow['limit'] === selectedLimit);
    const list = [...collectData];
    list[index]['otherDays'] = [];
    setOtherDays([]);
    if (value.length > 0) {
      setOtherDays(value);
      list[index]['otherDays'] = value;
      setCollectData(list);
    }
  };

  const funDayName = (day) => {
    switch (day) {
      case 'Mon':
        return 'Monday';
        break;
      case 'Tue':
        return 'Tuesday';
        break;
      case 'Wed':
        return 'Wednesday';
        break;
      case 'Thu':
        return 'Thursday';
        break;
      case 'Fri':
        return 'Friday';
        break;
      case 'Sat':
        return 'Saturday';
        break;
      case 'Sun':
        return 'Sunday';
        break;
      case 'Fri/Sat/Sun':
        return 'Friday / Saturday / Sunday';
        break;
      case 'Mon/Wed/Fri':
        return 'Monday / Wednesday / Friday';
        break;
      case 'Tue/Thu/Sat':
        return 'Tuesday / Thursday / Saturday';
        break;
    }
  };

  return (
    <div className={classes.daysFilterWrapper}>
      <div className='daysTag'>Days</div>
      {daysDisplay?.length > 0 ? (
        <div className='daysDisplayWrapper'>
          <div className='daysDisplayContainer'>
            {daysDisplay?.map((value) => (
              <div className='dayDisplay'>{funDayName(value)}</div>
            ))}
          </div>
        </div>
      ) : (
        <div className='filterContainer'>
          <div className='comboDaysContainer'>
            <Autocomplete
              multiple
              size='small'
              id='daysCombination'
              className='dropdownIcon'
              options={comboDaysList}
              getOptionLabel={(option) => option?.combo}
              filterSelectedOptions
              value={comboDays}
              onChange={handleComboDays}
              filterSelectedOptions
              renderInput={(params) => (
                <TextField
                  {...params}
                  variant='outlined'
                  label='Week Days'
                  placeholder='Week Days'
                />
              )}
            />
          </div>
          <div className='otherDaysContainer'>
            {comboDays.some((val) => val.combo === 'Others') && (
              <Autocomplete
                multiple
                size='small'
                id='otherDays'
                className='dropdownIcon'
                options={otherDaysList}
                getOptionLabel={(option) => option?.day}
                filterSelectedOptions
                value={otherDays}
                onChange={handleOtherDays}
                filterSelectedOptions
                renderInput={(params) => (
                  <TextField
                    {...params}
                    variant='outlined'
                    label='Other Days'
                    placeholder='Other Days'
                  />
                )}
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default DaysFilterContainer;
