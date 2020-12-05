/* eslint-disable react/no-array-index-key */
/* eslint-disable no-debugger */
/* eslint-disable no-console */
/* eslint-disable jsx-a11y/no-static-element-interactions */
import React from 'react';
import Autocomplete from '@material-ui/lab/Autocomplete';
import { TextField } from '@material-ui/core';
import './custom-multiselect.css';

// eslint-disable-next-line no-unused-vars
const CustomMultiSelect = (props) => {
  const { selections, setSelections, nameOfDropdown, optionNames } = props || {};
  const handleChange = (event, value) => {
    if (value.length) {
      const ids = value.map((el) => el);
      setSelections(ids);
    } else {
      setSelections([]);
    }
  };

  return (
    <div className='custom_multiselect_wrapper'>
      <Autocomplete
        multiple
        size='small'
        onChange={handleChange}
        value={selections}
        id='message_log-smsType'
        className='multiselect_custom_autocomplete'
        options={optionNames}
        getOptionLabel={(option) => option}
        filterSelectedOptions
        renderInput={(params) => (
          <TextField
            className='message_log-textfield'
            {...params}
            variant='outlined'
            label={nameOfDropdown}
            placeholder={nameOfDropdown}
          />
        )}
      />
    </div>
  );
};

export default CustomMultiSelect;
