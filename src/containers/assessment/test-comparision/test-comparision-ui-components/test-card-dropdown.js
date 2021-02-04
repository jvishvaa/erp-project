import React from 'react';
// import useMediaQuery from '@material-ui/core/useMediaQuery';
import Autocomplete from '@material-ui/lab/Autocomplete';
import {
  TextField,
  // useTheme,
  Typography,
  // Grid,
  Box,
} from '@material-ui/core';

import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(() => ({
  root: {
    border: '1px solid',
    borderColor: '#E2E2E2',
    padding: '0.9rem',
    borderRadius: '10px',
    boxShadow: 'none',
  },
  title: {
    fontSize: '1rem',
    color: '#004770',
  },
  contentGreen: {
    fontSize: '1rem',
    color: '#109400',
  },

  dropdown: {
    paddingTop: '0.6rem',
  },
}));

const TestCardDropdown = ({ tests = [], value, ...restProps }) => {
  const classes = useStyles();
  // const themeContext = useTheme();
  // const isMobile = useMediaQuery(themeContext.breakpoints.down('sm'));
  const hasValue = value && Object.keys(value).length;
  return (
    <>
      <Box className={classes.root}>
        <Box>
          <Typography className={classes.title} variant='p' component='p' color='primary'>
            {hasValue ? 'English, Grade 3' : 'Add a test'}
          </Typography>
        </Box>
        <Box>
          <Typography className={classes.title} variant='p' component='p' color='primary'>
            {hasValue ? 'Test 1 - ID - XXXX' : <br />}
          </Typography>
        </Box>
        <Box>
          <Typography
            className={classes.contentGreen}
            variant='p'
            component='p'
            color='primary'
          >
            {hasValue ? 'Conducted on 29.11.2020' : <br />}
          </Typography>
        </Box>
        <Box>
          <Autocomplete
            size='small'
            onChange={(e, value) => {
              restProps.update(value);
            }}
            options={tests}
            className={[
              'dropdownIcon',
              // isMobile ? '' : 'filterPadding',
              classes.dropdown,
            ].join(' ')}
            getOptionLabel={(option) => option?.test__test_name}
            filterSelectedOptions
            value={value}
            required
            renderInput={(params) => (
              <TextField
                {...params}
                variant='outlined'
                label='Select test'
                placeholder='Select test'
              />
            )}
          />
        </Box>
      </Box>
    </>
  );
};
export default TestCardDropdown;
