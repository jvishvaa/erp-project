import React, { useState, useEffect } from 'react';
import { Autocomplete } from '@material-ui/lab';
import { TextField } from '@material-ui/core';
import './days-filter.css';

const DaysFilterContainer = ({clear}) => {

    const [comboDays, setComboDays] = useState([]);

    const [comboDaysList, setComboDaysList] = useState([
        { id: 1, combo: 'Mon / Wed / Fri' },
        { id: 2, combo: 'Tue / Thur / Sat' },
        { id: 3, combo: 'Fri / Sat / Sun' },
        { id: 4, combo: 'Others' },
    ]);

    const handleComboDays = (event, value) => {
        setComboDays([]);
        if (value.length > 0) {
            setComboDays(value);
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
        setOtherDays([]);
        if (value.length > 0) {
            // const sendData = value.map(obj => obj.send);
            setOtherDays(value);
        }
    };

    useEffect(()=>{
        if(clear) {
            setOtherDays([]);
            setComboDays([]);
        } 
        
    },[clear]);

    return (
        <div className="daysFilterWrapper">
            <div className="daysTag">
                Days
            </div>
            <div className="filterContainer">
                <div className="comboDaysContainer">
                    <Autocomplete
                        multiple
                        size='small'
                        id='daysCombination'
                        className='dropdownIcon'
                        options={comboDaysList}
                        getOptionLabel={(option) => option.combo}
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
                <div className="otherDaysContainer">
                    {comboDays.some(val => val.combo === 'Others') &&
                        <Autocomplete
                            multiple
                            size='small'
                            id='otherDays'
                            className='dropdownIcon'
                            options={otherDaysList}
                            getOptionLabel={(option) => option.day}
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
                        />}
                </div>
            </div>
        </div>
    )
}

export default DaysFilterContainer;