import React from 'react';
import { TextField, Grid } from '@material-ui/core';
import Autocomplete from '@material-ui/lab/Autocomplete';

const UserSpecificSubjectDropdown = ({ value, options, onChange }) => {
  return (
    <Grid container spacing={3}>
      <Grid item xs={8} sm={3}>
        <Autocomplete
          size='small'
          onChange={onChange}
          options={options}
          className={[
            'dropdownIcon',
            // isMobile ? '' : 'filterPadding',
            //   classes.dropdown,
          ].join(' ')}
          getOptionLabel={(option) => option?.subject_name}
          filterSelectedOptions
          value={value}
          required
          renderInput={(params) => (
            <TextField
              {...params}
              variant='outlined'
              label='Select subject'
              placeholder='Select subject'
            />
          )}
        />
      </Grid>
    </Grid>
  );
};
export default UserSpecificSubjectDropdown;
