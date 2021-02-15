import React, { useState, useEffect } from 'react';
import { Autocomplete } from '@material-ui/lab';
import { TextField } from '@material-ui/core';
import './days-filter.css';

const DaysFilterContainer = (props) => {
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
    { id: 1, combo: 'Mon / Wed / Fri', send: 'M/W/F' },
    { id: 2, combo: 'Tue / Thur / Sat', send: 'T/T/S' },
    { id: 3, combo: 'Fri / Sat / Sun', send: 'F/S/S' },
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
    { id: 1, day: 'Monday', send: 'M' },
    { id: 2, day: 'Tuesday', send: 'T' },
    { id: 3, day: 'Wednesday', send: 'W' },
    { id: 4, day: 'Thursday', send: 'TH' },
    { id: 5, day: 'Friday', send: 'F' },
    { id: 6, day: 'Saturday', send: 'SA' },
    { id: 7, day: 'Sunday', send: 'S' },
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
      case 'M':
        return 'Monday';
        break;
      case 'T':
        return 'Tuesday';
        break;
      case 'W':
        return 'Wednesday';
        break;
      case 'TH':
        return 'Thursday';
        break;
      case 'F':
        return 'Friday';
        break;
      case 'SA':
        return 'Saturday';
        break;
      case 'S':
        return 'Sunday';
        break;
      case 'F/S/S':
        return 'Friday / Saturday / Sunday';
        break;
      case 'M/W/F':
        return 'Monday / Wednesday / Friday';
        break;
      case 'T/T/S':
        return 'Tuesday / Thursday / Saturday';
        break;
    }
  };

  return (
    <div className='daysFilterWrapper'>
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
